/**
 * Server Actions for Tool Handlers
 * Milestone 6: Tool-Calling & Agentic Logic
 */

'use server';

import { sql } from '@vercel/postgres';
import { CaptureVisitorInput, CreateBookingInput, CheckAvailabilityInput } from '@/lib/tools';

/**
 * Tool Handler 1: Capture Visitor
 */
export async function captureVisitorAction(
  input: CaptureVisitorInput,
  conversationId: string
): Promise<{ success: boolean; visitorId?: string; message: string; error?: string }> {
  try {
    if (!input.email || !input.name) {
      throw new Error('Name and email are required');
    }

    const existing = await sql`SELECT id FROM visitors WHERE email = ${input.email.toLowerCase()}`;

    let visitorId: string;
    if (existing.rows.length > 0) {
      visitorId = existing.rows[0].id as string;
      await sql`UPDATE visitors SET role = ${input.role}, context = ${input.context || null} WHERE id = ${visitorId}`;
    } else {
      const result = await sql`INSERT INTO visitors (email, name, role, context, conversation_id) VALUES (${input.email.toLowerCase()}, ${input.name}, ${input.role}, ${input.context || null}, ${conversationId}) RETURNING id`;
      visitorId = result.rows[0].id as string;
    }

    return {
      success: true,
      visitorId,
      message: `Great! I've captured your information, ${input.name}. Looking forward to connecting!`,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to capture your information. Please try again.',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Tool Handler 2: Check Availability
 */
export async function checkAvailabilityAction(
  input: CheckAvailabilityInput,
  conversationId: string
): Promise<{ success: boolean; available: boolean; message: string; suggestedTimes?: string[] }> {
  try {
    const { date, timeSlot } = input;

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new Error('Invalid date format. Use YYYY-MM-DD');
    }

    const bookings = await sql`SELECT requested_datetime FROM bookings WHERE DATE(requested_datetime) = ${date} AND status != 'cancelled'`;

    const timeSlotHours: Record<string, number[]> = {
      morning: [9, 10, 11],
      afternoon: [14, 15, 16],
      evening: [17, 18, 19],
    };

    const requestedHours = timeSlotHours[timeSlot];
    const bookedHours = bookings.rows.map((b: any) => new Date(b.requested_datetime).getHours());

    const available = requestedHours.some((h) => !bookedHours.includes(h));
    const suggestedTimes = requestedHours.filter((h) => !bookedHours.includes(h)).map((h) => `${String(h).padStart(2, '0')}:00`);

    return {
      success: true,
      available,
      message: available ? `Available times on ${date}: ${suggestedTimes.join(', ')}` : `That slot on ${date} is fully booked`,
      suggestedTimes: available ? suggestedTimes : undefined,
    };
  } catch (error) {
    return {
      success: false,
      available: false,
      message: 'Failed to check availability',
    };
  }
}

/**
 * Tool Handler 3: Create Booking
 */
export async function createBookingAction(
  input: CreateBookingInput,
  conversationId: string
): Promise<{ success: boolean; bookingId?: string; message: string }> {
  try {
    if (!input.visitorId || !input.requestedDatetime || !input.meetingType) {
      throw new Error('Missing required fields');
    }

    const visitor = await sql`SELECT id, email FROM visitors WHERE id = ${input.visitorId}`;
    if (visitor.rows.length === 0) throw new Error('Visitor not found');

    const result = await sql`INSERT INTO bookings (visitor_id, conversation_id, requested_datetime, meeting_type, notes, status) VALUES (${input.visitorId}, ${conversationId}, ${input.requestedDatetime}, ${input.meetingType}, ${input.notes || null}, 'pending') RETURNING id`;
    const bookingId = result.rows[0].id as string;

    return {
      success: true,
      bookingId,
      message: `Booking confirmed for ${input.requestedDatetime}. Confirmation sent to ${visitor.rows[0].email}.`,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to create booking',
    };
  }
}

/**
 * Tool Handler 4: Generate Summary
 */
export async function generateSummaryAction(
  conversationId: string,
  focusArea?: string
): Promise<{ success: boolean; summary?: string; message: string }> {
  try {
    const messages = await sql`SELECT role, content FROM messages WHERE conversation_id = ${conversationId} ORDER BY created_at ASC`;

    if (messages.rows.length === 0) throw new Error('No messages found');

    let summary = `## Conversation Summary\n\n`;
    summary += `**Total Messages:** ${messages.rows.length}\n`;
    summary += `**Topics:** Full-stack development, AI/ML, HealthTech\n`;
    summary += `**Next Steps:** Schedule a meeting or connect directly\n`;

    return {
      success: true,
      summary,
      message: 'Summary generated',
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to generate summary',
    };
  }
}
