/**
 * Booking Scheduling Component
 * Allows visitors to schedule a call/meeting
 * 
 * Milestone 4: Lead Capture
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle, CheckCircle, Loader2, ExternalLink } from 'lucide-react';

interface BookingSchedulerProps {
  visitorEmail?: string;
  conversationId: string;
  calendarUrl?: string;
}

export function BookingScheduler({
  visitorEmail,
  conversationId,
  calendarUrl = 'https://calendly.com',
}: BookingSchedulerProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [bookingId, setBookingId] = useState<string>('');

  const handleScheduleClick = async () => {
    setStatus('loading');
    setErrorMessage('');

    try {
      if (!visitorEmail) {
        setErrorMessage('Please provide your email to schedule a call');
        setStatus('error');
        return;
      }

      // Create booking record
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId,
          email: visitorEmail,
          status: 'pending',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create booking');
      }

      const data = await response.json();
      setBookingId(data.booking.id);
      setStatus('success');

      // Open calendar in new window
      setTimeout(() => {
        const calendarWithEmail = `${calendarUrl}?email=${encodeURIComponent(visitorEmail)}`;
        window.open(calendarWithEmail, '_blank');
      }, 1500);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to schedule');
      setStatus('error');
    }
  };

  return (
    <Card className="bg-slate-800 border-slate-700 p-4 sm:p-6" id="scheduling">
      <div className="space-y-4">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white mb-1">Schedule a call</h3>
          <p className="text-sm text-slate-400">
            Let's discuss your needs in detail
          </p>
        </div>

        {/* Info Box */}
        <div className="p-3 rounded-lg bg-blue-900/20 border border-blue-900/50">
          <p className="text-sm text-blue-300">
            📅 Calendar link will open after you book. Choose a time that works best for you.
          </p>
        </div>

        {/* Error Message */}
        {status === 'error' && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-red-900/20 border border-red-900/50">
            <AlertCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-400">{errorMessage}</p>
          </div>
        )}

        {/* Success Message */}
        {status === 'success' && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-green-900/20 border border-green-900/50">
            <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-green-400">Booking created!</p>
              <p className="text-xs text-green-400/80 mt-1">
                Opening calendar now. A confirmation email will be sent to {visitorEmail}
              </p>
            </div>
          </div>
        )}

        {/* Action Button */}
        <Button
          onClick={handleScheduleClick}
          disabled={status === 'loading' || status === 'success' || !visitorEmail}
          className="w-full bg-green-600 hover:bg-green-700 text-white"
        >
          {status === 'loading' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {status === 'success' ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Booking Confirmed
            </>
          ) : (
            <>
              <ExternalLink className="mr-2 h-4 w-4" />
              Schedule on Calendar
            </>
          )}
        </Button>

        {/* Fallback Link */}
        <div className="text-center">
          <p className="text-xs text-slate-500 mb-2">Or visit directly:</p>
          <a
            href={calendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"
          >
            {calendarUrl}
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </Card>
  );
}
