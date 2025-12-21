/**
 * Chat Page
 * Main conversational interface for the Digital Twin
 * 
 * Milestone 4: Lead Capture - Visitor form and booking
 * Milestone 5: Personalized suggested prompts for Pranjal
 */

'use client';

import { useChat } from 'ai/react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from '@/components/ChatMessage';
import { VisitorCaptureForm } from '@/components/VisitorCaptureForm';
import { BookingScheduler } from '@/components/BookingScheduler';
import { SuggestedPrompts } from '@/components/SuggestedPrompts';
import Link from 'next/link';
import { Loader2, Send, Home, Copy, Check } from 'lucide-react';

// Suggested prompts tailored to Pranjal's expertise
const SUGGESTED_PROMPTS = [
  'What AI and web technologies do you specialize in?',
  'Tell me about your NLP-Chatbot project',
  'What was your SUNHACK 2024 experience like?',
  'Are you open to freelance or full-time opportunities?',
  'How do you approach design thinking in development?',
  'What HealthTech projects interest you?',
];

export default function ChatPage() {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [visitorEmail, setVisitorEmail] = useState<string>('');
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [suggestedPrompts, setSuggestedPrompts] = useState<string[]>(SUGGESTED_PROMPTS);
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: '/api/chat',
    body: {
      conversationId,
      visitorSessionId: sessionId,
    },
    onResponse: (response) => {
      // Extract conversation ID from response headers
      const convId = response.headers.get('X-Conversation-ID');
      if (convId && !conversationId) {
        setConversationId(convId);
        // Store in localStorage for page reload
        localStorage.setItem('lastConversationId', convId);
      }
    },
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize session ID and load previous conversation if exists
  useEffect(() => {
    // Generate or retrieve session ID
    let sid = sessionStorage.getItem('visitorSessionId');
    if (!sid) {
      sid = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('visitorSessionId', sid);
    }
    setSessionId(sid);

    // Try to load previous conversation
    const lastConvId = localStorage.getItem('lastConversationId');
    if (lastConvId && !conversationId) {
      setConversationId(lastConvId);
    }
  }, [conversationId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Show lead capture after 2 user messages (4 total messages)
    if (messages.length >= 4 && !showLeadCapture) {
      setShowLeadCapture(true);
    }
  }, [messages, showLeadCapture]);

  const copyConversationId = () => {
    if (conversationId) {
      navigator.clipboard.writeText(conversationId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-800/50 px-4 py-4 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Digital Twin</h1>
            <p className="text-xs text-slate-400">AI-powered professional presence</p>
          </div>
          <div className="flex items-center gap-2">
            {conversationId && (
              <Button
                variant="ghost"
                size="sm"
                onClick={copyConversationId}
                className="text-xs text-slate-400 hover:text-slate-300"
              >
                {copied ? (
                  <>
                    <Check className="mr-1 h-3 w-3" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="mr-1 h-3 w-3" />
                    ID: {conversationId.slice(0, 8)}...
                  </>
                )}
              </Button>
            )}
            <Link href="/">
              <Button
                variant="outline"
                size="sm"
                className="border-slate-600 text-slate-300 hover:border-slate-500 hover:bg-slate-700"
              >
                <Home className="mr-2 h-4 w-4" />
                Home
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <ScrollArea className="flex-1 px-4 py-6">
        <div className="mx-auto max-w-2xl space-y-4">
          {messages.length === 0 && (
            <div className="flex h-full items-center justify-center text-center">
              <div className="space-y-4">
                <div className="text-4xl">👋</div>
                <h2 className="text-2xl font-bold text-white">Welcome to Pranjal's Digital Twin</h2>
                <p className="max-w-sm text-slate-400">
                  Chat with an AI representation of a Full-Stack Developer & AI/ML specialist. 
                  Ask about expertise, projects, or collaboration opportunities. Your conversation is saved automatically.
                </p>
                <div className="space-y-3 pt-4">
                  <SuggestedPrompts
                    prompts={suggestedPrompts.slice(0, 3)}
                    onPromptClick={(prompt) => {
                      handleInputChange({
                        target: { value: prompt },
                      } as any);
                    }}
                  />
                </div>
                {conversationId && (
                  <p className="text-xs text-slate-500 pt-4">
                    Conversation ID: <code className="text-slate-400">{conversationId}</code>
                  </p>
                )}
              </div>
            </div>
          )}

          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              role={message.role as 'user' | 'assistant'}
              content={message.content}
              timestamp={new Date()}
            />
          ))}

          {isLoading && (
            <div className="flex justify-start gap-3">
              <div className="flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2">
                <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
                <span className="text-sm text-slate-400">Thinking...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-lg bg-red-900/20 p-4 text-sm text-red-400">
              <p className="font-semibold">Error:</p>
              <p>{error.message || 'Failed to get response. Please try again.'}</p>
            </div>
          )}

          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-slate-700 bg-slate-800/50 px-4 py-4 backdrop-blur-sm">
        <div className="mx-auto max-w-2xl space-y-4">
          {/* Lead Capture Section */}
          {showLeadCapture && conversationId && (
            <div className="space-y-3">
              {!visitorEmail ? (
                <VisitorCaptureForm
                  conversationId={conversationId}
                  onSuccess={() => {
                    // Extract email from form if needed (handled in component)
                    // For now, user can continue chatting
                  }}
                />
              ) : (
                <BookingScheduler
                  visitorEmail={visitorEmail}
                  conversationId={conversationId}
                  calendarUrl={process.env.NEXT_PUBLIC_CALENDAR_URL || 'https://calendly.com'}
                />
              )}
            </div>
          )}

          {/* Chat Input */}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Ask me anything..."
              disabled={isLoading}
              className="border-slate-600 bg-slate-900 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500"
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Send className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Send</span>
            </Button>
          </form>

          <p className="mt-2 text-center text-xs text-slate-500">
            💾 Your messages are saved. 📋 Contact info kept private.
          </p>
        </div>
      </div>
    </div>
  );
}
