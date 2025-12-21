/**
 * Voice API Route Handler
 * Milestone 8: Voice Agent
 * 
 * Handles voice-to-text input and returns text response for TTS
 * Reuses the same chat logic as text interface
 */

import { getSystemPrompt } from '@/lib/systemPrompt';

interface VoiceRequest {
  transcript: string;
  messages?: Array<{ role: 'user' | 'assistant'; content: string }>;
  conversationId?: string;
}

export async function POST(request: Request) {
  try {
    const body: VoiceRequest = await request.json();
    const { transcript, messages = [], conversationId } = body;

    if (!transcript?.trim()) {
      return new Response(
        JSON.stringify({ error: 'No transcript provided' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get system prompt
    const systemPrompt = getSystemPrompt();

    // Check API key
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error('GROQ_API_KEY not configured');
    }

    // Build conversation history with new user message
    const conversationMessages = [
      ...messages.map(m => ({ role: m.role, content: m.content })),
      { role: 'user' as const, content: transcript }
    ];

    // Call Groq API (same as chat route but optimized for voice)
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { 
            role: 'system', 
            content: `${systemPrompt}\n\nIMPORTANT: You are now in VOICE MODE. Keep your responses concise and conversational - aim for 2-3 sentences unless the user asks for detail. Avoid using markdown, bullet points, or formatting that doesn't translate well to speech. Speak naturally as if in a phone conversation.`
          },
          ...conversationMessages,
        ],
        temperature: 0.7,
        max_tokens: 300, // Shorter for voice responses
        stream: false,
      }),
    });

    if (!groqResponse.ok) {
      const error = await groqResponse.json();
      throw new Error(`Groq API error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await groqResponse.json();
    const assistantMessage = data.choices?.[0]?.message?.content || '';

    // Return plain JSON for voice client (not streaming format)
    return new Response(
      JSON.stringify({
        response: assistantMessage,
        conversationId: conversationId || `voice-${Date.now()}`,
        source: 'voice'
      }),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process voice input',
        message: errorMessage
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
}
