/**
 * Get Conversation API Route
 * GET /api/conversations/[id]
 * 
 * Retrieves a conversation and all its messages from the database
 */

import { getConversation, getConversationHistory } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: conversationId } = await params;

    if (!conversationId) {
      return NextResponse.json(
        { error: 'Conversation ID required' },
        { status: 400 }
      );
    }

    // Get conversation metadata
    const conversation = await getConversation(conversationId);
    
    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    // Get all messages in conversation
    const messages = await getConversationHistory(conversationId);

    return NextResponse.json({
      success: true,
      conversation: {
        id: conversation.id,
        title: conversation.title,
        createdAt: conversation.created_at,
        updatedAt: conversation.updated_at,
        messageCount: messages.length,
      },
      messages,
    });
  } catch (error) {
    console.error('Error retrieving conversation:', error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to retrieve conversation',
      },
      { status: 500 }
    );
  }
}
