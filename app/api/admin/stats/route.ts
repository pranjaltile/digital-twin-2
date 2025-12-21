/**
 * Admin Stats API Route
 * Milestone 9: Polish & Launch Quality
 * 
 * Fetches analytics data for the admin dashboard
 */

import { sql } from '@vercel/postgres';

interface VisitorRow {
  id: string;
  name: string;
  email: string;
  role: string | null;
  created_at: string;
}

interface BookingRow {
  id: string;
  visitor_name: string | null;
  requested_datetime: string | null;
  meeting_type: string;
  status: string;
}

export async function GET() {
  try {
    // Fetch total visitors
    const visitorsResult = await sql`SELECT COUNT(*) as count FROM visitors`;
    const totalVisitors = parseInt(visitorsResult.rows[0]?.count || '0');

    // Fetch total conversations
    const conversationsResult = await sql`SELECT COUNT(*) as count FROM conversations`;
    const totalConversations = parseInt(conversationsResult.rows[0]?.count || '0');

    // Fetch total bookings
    const bookingsResult = await sql`SELECT COUNT(*) as count FROM bookings`;
    const totalBookings = parseInt(bookingsResult.rows[0]?.count || '0');

    // Fetch pending bookings
    const pendingResult = await sql`SELECT COUNT(*) as count FROM bookings WHERE status = 'pending'`;
    const pendingBookings = parseInt(pendingResult.rows[0]?.count || '0');

    // Fetch total messages
    const messagesResult = await sql`SELECT COUNT(*) as count FROM messages`;
    const totalMessages = parseInt(messagesResult.rows[0]?.count || '0');

    // Fetch recent visitors (last 10)
    const recentVisitorsResult = await sql`
      SELECT id, name, email, role, created_at 
      FROM visitors 
      ORDER BY created_at DESC 
      LIMIT 10
    `;
    const recentVisitors = (recentVisitorsResult.rows as VisitorRow[]).map(row => ({
      id: row.id,
      name: row.name,
      email: row.email,
      role: row.role,
      createdAt: new Date(row.created_at).toLocaleDateString(),
    }));

    // Fetch recent bookings (last 10)
    const recentBookingsResult = await sql`
      SELECT b.id, v.name as visitor_name, b.requested_datetime, b.meeting_type, b.status
      FROM bookings b
      LEFT JOIN visitors v ON b.visitor_id = v.id
      ORDER BY b.created_at DESC
      LIMIT 10
    `;
    const recentBookings = (recentBookingsResult.rows as BookingRow[]).map(row => ({
      id: row.id,
      visitorName: row.visitor_name || 'Unknown',
      requestedDatetime: row.requested_datetime ? new Date(row.requested_datetime).toLocaleString() : 'Not specified',
      meetingType: row.meeting_type,
      status: row.status,
    }));

    // Fetch conversations this week
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekConversationsResult = await sql`
      SELECT COUNT(*) as count FROM conversations WHERE created_at > ${weekAgo.toISOString()}
    `;
    const conversationsThisWeek = parseInt(weekConversationsResult.rows[0]?.count || '0');

    return new Response(
      JSON.stringify({
        stats: {
          totalVisitors,
          totalConversations,
          totalBookings,
          pendingBookings,
          totalMessages,
          conversationsThisWeek,
        },
        recentVisitors,
        recentBookings,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    if (process.env.NODE_ENV === 'development') {
      console.error('[ADMIN API ERROR]', errorMessage);
    }
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch admin data',
        stats: {
          totalVisitors: 0,
          totalConversations: 0,
          totalBookings: 0,
          pendingBookings: 0,
          totalMessages: 0,
          conversationsThisWeek: 0,
        },
        recentVisitors: [],
        recentBookings: [],
      }),
      { 
        status: 200, // Return 200 with empty data to avoid breaking UI
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
}
