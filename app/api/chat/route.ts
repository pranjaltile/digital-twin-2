/**
 * Chat API Route Handler
 * Direct Groq API streaming without SDK version conflicts
 */

import { getSystemPrompt } from '@/lib/systemPrompt';

// Enable debug logging in development
const DEBUG = process.env.NODE_ENV === 'development';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  parts?: Array<{ type: string; text: string }>;
}

interface ChatRequest {
  messages: ChatMessage[];
}

export async function POST(request: Request) {
  try {
    let body: ChatRequest;
    try {
      const text = await request.text();
      body = JSON.parse(text) as ChatRequest;
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid request format' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    let { messages } = body;

    if (!messages?.length) {
      return new Response(
        JSON.stringify({ error: 'No messages provided' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Convert messages to the proper format
    messages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    })) as ChatMessage[];

    let systemPrompt: string;
    try {
      systemPrompt = getSystemPrompt();
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'Unknown error';
      if (DEBUG) console.error('[CHAT] Failed to get system prompt:', errorMessage);
      throw new Error('Failed to load system prompt');
    }

    // Check if API key is set
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error('GROQ_API_KEY not configured');
    }

    // Call Groq API with available model
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages.map(m => ({ role: m.role, content: m.content })),
        ],
        temperature: 0.7,
        max_tokens: 1024,
        stream: false,
      }),
    });

    if (!groqResponse.ok) {
      const error = await groqResponse.json();
      throw new Error(`Groq API error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await groqResponse.json();
    const assistantMessage = data.choices?.[0]?.message?.content || '';

    // Create a proper streaming response that useChat expects
    // AI SDK v4 format: "0:JSON_STRING\n" for text, "e:JSON\n" for finish
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      start(controller) {
        try {
          // Send text - format is 0:"text content"\n (JSON encoded string)
          controller.enqueue(encoder.encode(`0:${JSON.stringify(assistantMessage)}\n`));
          
          // Send finish reason
          controller.enqueue(encoder.encode(`e:${JSON.stringify({ finishReason: 'stop', usage: { promptTokens: 0, completionTokens: 0 } })}\n`));
          
          // Send done signal
          controller.enqueue(encoder.encode(`d:${JSON.stringify({ finishReason: 'stop' })}\n`));
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    if (DEBUG) console.error('[CHAT ERROR]', errorMessage);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate response',
        message: errorMessage
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
}
