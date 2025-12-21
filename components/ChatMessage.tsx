/**
 * ChatMessage Component
 * Displays individual chat messages with role indicator and formatting
 */

'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

export function ChatMessage({ role, content, timestamp }: ChatMessageProps) {
  const isUser = role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarFallback className="bg-blue-600 text-white">🤖</AvatarFallback>
        </Avatar>
      )}

      <div
        className={`flex max-w-xs flex-col gap-1 lg:max-w-md ${
          isUser ? 'items-end' : 'items-start'
        }`}
      >
        <Card
          className={`px-4 py-2 ${
            isUser
              ? 'bg-blue-600 text-white'
              : 'bg-slate-200 text-slate-900 dark:bg-slate-800 dark:text-slate-100'
          }`}
        >
          <p className="whitespace-pre-wrap text-sm leading-relaxed">
            {content}
          </p>
        </Card>

        {timestamp && (
          <span className="text-xs text-slate-400">
            {format(timestamp, 'HH:mm')}
          </span>
        )}
      </div>

      {isUser && (
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarFallback className="bg-slate-600 text-white">
            👤
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
