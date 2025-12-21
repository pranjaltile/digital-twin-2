/**
 * SuggestedPrompts Component
 * Displays clickable suggested questions for users to ask
 * 
 * Milestone 5: Personality Enhancement
 */

'use client';

import { Button } from '@/components/ui/button';
import { Lightbulb } from 'lucide-react';

interface SuggestedPromptsProps {
  prompts: string[];
  onPromptClick: (prompt: string) => void;
  isLoading?: boolean;
}

export function SuggestedPrompts({
  prompts,
  onPromptClick,
  isLoading = false,
}: SuggestedPromptsProps) {
  if (prompts.length === 0) return null;

  return (
    <div className="my-4 space-y-2">
      <div className="flex items-center gap-2 text-sm text-slate-400">
        <Lightbulb className="h-4 w-4" />
        <span>Try asking:</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {prompts.map((prompt, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            className="text-xs border-slate-600 text-slate-300 hover:border-slate-500 hover:bg-slate-800"
            onClick={() => onPromptClick(prompt)}
            disabled={isLoading}
          >
            {prompt}
          </Button>
        ))}
      </div>
    </div>
  );
}
