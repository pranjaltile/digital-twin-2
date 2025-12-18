/**
 * Bookings API Route
 * POST /api/bookings
 * Creates booking records when visitor schedules a call
 * 
 * Milestone 4: Lead Capture
 */

import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

interface BookingRequest {
  conversationId: string;
  email: string;
  status?: 'pending' | 'confirmed' | 'cancelled';
  preferredTime?: string;
  notes?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as BookingRequest;
    const { conversationId, email, status = 'pending', preferredTime, notes } = body;

    // Validate required fields
    if (!conversationId || !email) {
      return NextResponse.json(
        { error: 'conversationId and email are required' },
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

    // Check if booking already exists for this conversation
    const existingBooking = await sql`
      SELECT id FROM bookings WHERE conversation_id = ${conversationId} LIMIT 1;
    `;

    let bookingId: string;

    if (existingBooking.rows.length > 0) {
      bookingId = existingBooking.rows[0].id;
      
      // Update existing booking
      await sql`
        UPDATE bookings
        SET 
          email = ${email},
          status = ${status},
          preferred_time = ${preferredTime ? new Date(preferredTime).toISOString() : null},
          notes = ${notes || null},
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${bookingId};
      `;
    } else {
      // Create new booking
      const result = await sql`
        INSERT INTO bookings (conversation_id, email, status, preferred_time, notes)
        VALUES (
          ${conversationId},
          ${email},
          ${status},
          ${preferredTime ? new Date(preferredTime).toISOString() : null},
          ${notes || null}
        )
        RETURNING id;
      `;
      bookingId = result.rows[0].id;
    }

    console.log('✅ Booking created:', { bookingId, email, status });

    return NextResponse.json(
      {
        success: true,
        booking: {
          id: bookingId,
          conversationId,
          email,
          status,
          preferredTime,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Bookings API error:', error);

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
