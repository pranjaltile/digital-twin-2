/**
 * Chat API Route Handler
 * POST /api/chat
 * Handles real-time chat with Claude Sonnet 4.5 via Vercel AI SDK
 * 
 * Milestone 3: Message persistence
 * Milestone 6: Tool-calling & agentic logic (prepared)
 */

import { streamText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { getSystemPrompt } from '@/lib/systemPrompt';
import { createConversation, saveMessage, getConversationHistory } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

interface ChatRequest {
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  conversationId?: string;
  visitorSessionId?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { messages, conversationId, visitorSessionId } = await request.json() as ChatRequest;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid request: messages array required' },
        { status: 400 }
      );
    }

    if (messages.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request: at least one message required' },
        { status: 400 }
      );
    }

    // Get or create conversation
    let convId = conversationId;
    if (!convId) {
      convId = await createConversation(visitorSessionId);
      console.log('Created new conversation:', convId);
    }

    // Get conversation history from database (for context)
    const storedHistory = await getConversationHistory(convId);
    
    // Build full message history: stored messages + current session messages
    const fullHistory = [
      ...storedHistory.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
    ];

    // If there are new messages not in history, add them
    if (messages.length > fullHistory.length) {
      const newMessages = messages.slice(fullHistory.length);
      fullHistory.push(...newMessages);
    }

    // Save the latest user message to database
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role === 'user') {
      await saveMessage(convId, 'user', lastMessage.content);
    }

    // Get system prompt
    const systemPrompt = getSystemPrompt();

    // Create the AI model stream
    const { textStream } = await streamText({
      model: anthropic('claude-3-5-sonnet-20241022'),
      system: systemPrompt,
      messages: fullHistory as any,
      temperature: 0.7,
      maxTokens: 2000,
    });

    // Collect response
    const chunks: string[] = [];
    for await (const chunk of textStream) {
      chunks.push(chunk);
    }
    const responseText = chunks.join('');

    // Save assistant response to database
    if (responseText) {
      await saveMessage(convId, 'assistant', responseText);
    }

    console.log('Chat response saved to database');

    // Return response
    return new NextResponse(responseText, {
      headers: {
        'X-Conversation-ID': convId,
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message.includes('API')) {
      return NextResponse.json(
        { error: 'AI service unavailable. Check ANTHROPIC_API_KEY.' },
        { status: 503 }
      );
    }

    if (error instanceof Error && error.message.includes('database')) {
      return NextResponse.json(
        { error: 'Database error. Check DATABASE_URL connection.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// Optional: Handle GET for testing
export async function GET() {
  return NextResponse.json({
    message: 'Chat endpoint with tool-calling support',
    method: 'POST',
    features: ['streaming responses', 'tool calling', 'database persistence'],
  });
}
