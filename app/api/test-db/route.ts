/**
 * API route to test database connection
 * GET /api/test-db
 */

import { testConnection } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const connected = await testConnection();

    if (connected) {
      return NextResponse.json({
        connected: true,
        timestamp: new Date().toISOString(),
        message: '✅ Database connection successful',
      });
    } else {
      return NextResponse.json(
        {
          connected: false,
          error: 'Database connection test failed',
        },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        connected: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
