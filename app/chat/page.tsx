/**
 * Chat Page
 * Main conversational interface for the Digital Twin
 * 
 * Milestone 4: Lead Capture - Visitor form and booking
 * Milestone 5: Personalized suggested prompts for Pranjal
 * Milestone 8: Voice Agent - Integrated voice mode
 */

'use client';

import { useChat } from 'ai/react';
import { useEffect, useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from '@/components/ChatMessage';
import { VisitorCaptureForm } from '@/components/VisitorCaptureForm';
import { BookingScheduler } from '@/components/BookingScheduler';
import { SuggestedPrompts } from '@/components/SuggestedPrompts';
import Link from 'next/link';
import { Loader2, Send, Home, Copy, Check, Mic, MicOff, MessageSquare, Volume2, VolumeX, Phone, PhoneOff } from 'lucide-react';

// TypeScript types for Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

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
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Voice mode state
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isVoiceProcessing, setIsVoiceProcessing] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isTTSEnabled, setIsTTSEnabled] = useState(true);
  const [voiceSupported, setVoiceSupported] = useState(true);
  const [voiceError, setVoiceError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const voiceTranscriptRef = useRef<string>(''); // Use ref to avoid stale closure

  // Check voice support
  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      setVoiceSupported(false);
    }
  }, []);

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
    if (lastConvId) {
      setConversationId(lastConvId);
    }
    
    setIsInitialized(true);
  }, []);
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: '/api/chat',
    onError: (err) => {
      if (process.env.NODE_ENV === 'development') {
        console.error('[useChat ERROR]', err);
      }
    },
  });

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

  // Text-to-speech function
  const speak = useCallback((text: string) => {
    if (!isTTSEnabled || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    utterance.lang = 'en-US';

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => 
      v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha')
    ) || voices.find(v => v.lang.startsWith('en'));
    
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      // Resume listening after AI finishes speaking
      if (isVoiceMode && recognitionRef.current) {
        try { recognitionRef.current.start(); } catch (e) { /* already started */ }
      }
    };
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [isTTSEnabled, isVoiceMode]);

  // Process voice input
  const processVoiceInput = useCallback(async (transcript: string) => {
    if (!transcript.trim()) {
      return;
    }

    setIsVoiceProcessing(true);
    setVoiceError(null);

    try {
      const response = await fetch('/api/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript,
          messages: messages.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to get response');
      }

      const data = await response.json();
      
      // Speak the response
      if (data.response) {
        speak(data.response);
      }

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process voice';
      setVoiceError(errorMessage);
    } finally {
      setIsVoiceProcessing(false);
      setVoiceTranscript('');
      voiceTranscriptRef.current = '';
    }
  }, [messages, speak]);

  // Initialize speech recognition
  const initRecognition = useCallback(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) return null;

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = false; // Stop after each phrase
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };
    
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          final += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }

      setInterimTranscript(interim);
      if (final) {
        voiceTranscriptRef.current = final;
        setVoiceTranscript(final);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error !== 'no-speech' && event.error !== 'aborted') {
        setVoiceError(`Speech error: ${event.error}`);
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimTranscript('');
      
      // Process transcript when speech ends - use ref to get latest value
      const finalTranscript = voiceTranscriptRef.current;
      if (finalTranscript) {
        processVoiceInput(finalTranscript);
      }
    };

    return recognition;
  }, [processVoiceInput]);

  // Toggle voice mode
  const toggleVoiceMode = useCallback(() => {
    if (isVoiceMode) {
      // Turning off voice mode
      recognitionRef.current?.abort();
      window.speechSynthesis?.cancel();
      setIsListening(false);
      setIsSpeaking(false);
      setVoiceTranscript('');
      setInterimTranscript('');
    }
    setIsVoiceMode(!isVoiceMode);
  }, [isVoiceMode]);

  // Toggle microphone
  const toggleMic = useCallback(() => {
    if (!voiceSupported || !isVoiceMode) return;

    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      // Stop any ongoing speech first
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
      setVoiceError(null);
      voiceTranscriptRef.current = '';
      setVoiceTranscript('');
      setInterimTranscript('');

      // Create new recognition instance each time
      recognitionRef.current = initRecognition();
      
      try { 
        recognitionRef.current?.start(); 
      } catch {
        // Recognition may already be started
      }
    }
  }, [voiceSupported, isVoiceMode, isListening, initRecognition]);

  // Cleanup
  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
      window.speechSynthesis?.cancel();
    };
  }, []);

  // Load voices
  useEffect(() => {
    const loadVoices = () => window.speechSynthesis?.getVoices();
    loadVoices();
    window.speechSynthesis?.addEventListener('voiceschanged', loadVoices);
    return () => window.speechSynthesis?.removeEventListener('voiceschanged', loadVoices);
  }, []);

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
            {/* Voice Mode Toggle */}
            {voiceSupported && (
              <Button
                variant="outline"
                size="sm"
                onClick={toggleVoiceMode}
                className={`${
                  isVoiceMode 
                    ? 'border-purple-500 bg-purple-900/30 text-purple-300' 
                    : 'border-slate-600 text-slate-300 hover:border-purple-500 hover:bg-purple-900/30'
                }`}
              >
                {isVoiceMode ? (
                  <>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Text
                  </>
                ) : (
                  <>
                    <Mic className="mr-2 h-4 w-4" />
                    Voice
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
      <ScrollArea className="flex-1 px-4 py-6 bg-transparent">
        <div className="mx-auto max-w-2xl space-y-4 min-h-full">
          {messages.length === 0 && (
            <div className="flex h-full items-center justify-center text-center">
              <div className="space-y-4">
                <div className="text-4xl">👋</div>
                <h2 className="text-2xl font-bold text-white">Welcome to Pranjal's Digital Twin</h2>
                <p className="max-w-sm mx-auto text-center text-slate-400">
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
                      // Auto-submit after short delay to ensure state update
                      setTimeout(() => {
                        const form = document.querySelector('form');
                        if (form) {
                          form.dispatchEvent(new Event('submit', { bubbles: true }));
                        }
                      }, 50);
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
              <p className="font-mono text-xs mb-1">{error.message || 'Failed to get response. Please try again.'}</p>
              <p className="text-xs text-red-300">Check console for details (F12)</p>
            </div>
          )}

          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-slate-700 bg-slate-800/50 px-4 py-4 backdrop-blur-sm">
        <div className="mx-auto max-w-2xl space-y-4">
          {/* Lead Capture Section */}
          {showLeadCapture && conversationId && !isVoiceMode && (
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

          {/* Voice Mode UI */}
          {isVoiceMode ? (
            <div className="space-y-4">
              {/* Voice Status */}
              <div className="flex items-center justify-center">
                <div className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isListening 
                    ? 'bg-blue-500/20 ring-4 ring-blue-500/50 animate-pulse' 
                    : isSpeaking 
                      ? 'bg-purple-500/20 ring-4 ring-purple-500/50'
                      : isVoiceProcessing
                        ? 'bg-yellow-500/20 ring-4 ring-yellow-500/50'
                        : 'bg-slate-700'
                }`}>
                  {isListening ? (
                    <Mic className="h-8 w-8 text-blue-400" />
                  ) : isSpeaking ? (
                    <Volume2 className="h-8 w-8 text-purple-400 animate-pulse" />
                  ) : isVoiceProcessing ? (
                    <Loader2 className="h-8 w-8 text-yellow-400 animate-spin" />
                  ) : (
                    <MicOff className="h-8 w-8 text-slate-500" />
                  )}
                </div>
              </div>

              {/* Voice Transcript */}
              <div className="text-center min-h-[40px]">
                {isListening && (
                  <p className="text-slate-300 text-sm">
                    {interimTranscript || voiceTranscript || 'Listening... speak now'}
                  </p>
                )}
                {isSpeaking && <p className="text-purple-400 text-sm">Speaking...</p>}
                {isVoiceProcessing && <p className="text-yellow-400 text-sm">Processing...</p>}
                {voiceError && <p className="text-red-400 text-sm">{voiceError}</p>}
                {!isListening && !isSpeaking && !isVoiceProcessing && !voiceError && (
                  <p className="text-slate-500 text-sm">Click the mic button to speak</p>
                )}
              </div>

              {/* Voice Controls */}
              <div className="flex justify-center gap-3">
                <Button
                  onClick={toggleMic}
                  size="lg"
                  className={`rounded-full w-14 h-14 ${
                    isListening 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : 'bg-slate-700 hover:bg-slate-600'
                  }`}
                  disabled={isVoiceProcessing || isSpeaking}
                >
                  {isListening ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
                </Button>

                <Button
                  onClick={() => setIsTTSEnabled(!isTTSEnabled)}
                  size="lg"
                  variant="outline"
                  className={`rounded-full w-14 h-14 border-slate-600 ${!isTTSEnabled && 'opacity-50'}`}
                >
                  {isTTSEnabled ? <Volume2 className="h-6 w-6" /> : <VolumeX className="h-6 w-6" />}
                </Button>
              </div>

              <p className="text-center text-xs text-slate-500">
                🎤 Voice mode active • Click mic to start/stop • Toggle speaker to mute AI voice
              </p>
            </div>
          ) : (
            <>
              {/* Text Chat Input */}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
