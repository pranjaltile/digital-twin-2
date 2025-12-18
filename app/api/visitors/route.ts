/**
 * Visitor API Route
 * POST /api/visitors
 * Captures visitor information and links to conversation
 * 
 * Milestone 4: Lead Capture
 */

import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

interface VisitorRequest {
  conversationId: string;
  name: string;
  email: string;
  linkedin?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { conversationId, name, email, linkedin } = (await request.json()) as VisitorRequest;

    // Validate required fields
    if (!conversationId || !name || !email) {
      return NextResponse.json(
        { error: 'conversationId, name, and email are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Check if visitor already exists for this email
    const existingVisitor = await sql`
      SELECT id FROM visitors WHERE email = ${email} LIMIT 1;
    `;

    let visitorId: string;

    if (existingVisitor.rows.length > 0) {
      visitorId = existingVisitor.rows[0].id;
      
      // Update existing visitor with new metadata
      await sql`
        UPDATE visitors
        SET name = ${name}, linkedin = ${linkedin || null}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ${visitorId};
      `;
    } else {
      // Create new visitor
      const result = await sql`
        INSERT INTO visitors (session_id, email, name, linkedin)
        VALUES (${`session-${Date.now()}`}, ${email}, ${name}, ${linkedin || null})
        RETURNING id;
      `;
      visitorId = result.rows[0].id;
    }

    // Link visitor to conversation
    await sql`
      UPDATE conversations
      SET visitor_id = ${visitorId}
      WHERE id = ${conversationId};
    `;

    console.log('✅ Visitor saved:', { visitorId, email, name });

    return NextResponse.json(
      {
        success: true,
        visitor: {
          id: visitorId,
          name,
          email,
          linkedin: linkedin || null,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Visitor API error:', error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message.includes('database')) {
      return NextResponse.json(
        { error: 'Database error. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
