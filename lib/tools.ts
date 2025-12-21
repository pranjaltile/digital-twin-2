/**
 * Tool Schemas for Agentic Decision-Making
 * Milestone 6: Tool-Calling & Agentic Logic
 * 
 * Tools that Claude can autonomously decide to use
 */

import { tool } from 'ai';
import { z } from 'zod';

// Tool 1: Capture Visitor Information
export const captureVisitorTool = tool({
  description: 'Capture visitor contact information and profile. Use when visitor provides or indicates they want to share their details.',
  parameters: z.object({
    name: z.string().describe('Full name of the visitor'),
    email: z.string().email().describe('Email address of the visitor'),
    role: z.enum(['recruiter', 'hiring_manager', 'collaborator', 'interested_party', 'other']).describe('Role or type of visitor'),
    context: z.string().optional().describe('Optional context about why they are reaching out (max 500 chars)'),
  }),
  execute: async () => {
    // Placeholder - actual execution handled in chat route
    return { status: 'pending' };
  },
});

// Tool 2: Check Availability
export const checkAvailabilityTool = tool({
  description: 'Check if a specific date and time slot is available for a meeting. Use when visitor asks about scheduling.',
  parameters: z.object({
    date: z.string().describe('Date in YYYY-MM-DD format'),
    timeSlot: z.enum(['morning', 'afternoon', 'evening']).describe('Time slot preference (morning: 9-12, afternoon: 12-17, evening: 17-20)'),
  }),
  execute: async () => {
    // Placeholder - actual execution handled in chat route
    return { status: 'pending' };
  },
});

// Tool 3: Create Booking
export const createBookingTool = tool({
  description: 'Create a booking/meeting request. Use after visitor confirms they want to schedule a meeting.',
  parameters: z.object({
    visitorId: z.string().describe('ID of the visitor (from captureVisitor)'),
    requestedDatetime: z.string().describe('Requested datetime in ISO format (YYYY-MM-DDTHH:mm:ss)'),
    meetingType: z.enum(['quick_call', 'technical_discussion', 'collaboration_exploration', 'general_inquiry']).describe('Type of meeting requested'),
    notes: z.string().optional().describe('Optional notes about the meeting (max 300 chars)'),
  }),
  execute: async () => {
    // Placeholder - actual execution handled in chat route
    return { status: 'pending' };
  },
});

// Tool 4: Generate Summary
export const generateSummaryTool = tool({
  description: 'Generate a summary of the conversation. Use when conversation is ending or visitor wants a recap.',
  parameters: z.object({
    conversationId: z.string().describe('ID of the conversation to summarize'),
    focusArea: z.enum(['skills_discussed', 'projects_discussed', 'availability', 'next_steps', 'full_summary']).optional().describe('What aspect to focus on in the summary'),
  }),
  execute: async () => {
    // Placeholder - actual execution handled in chat route
    return { status: 'pending' };
  },
});

// Export all tools as object for Vercel AI SDK
export const tools = {
  captureVisitor: captureVisitorTool,
  checkAvailability: checkAvailabilityTool,
  createBooking: createBookingTool,
  generateSummary: generateSummaryTool,
};

export type ToolNames = keyof typeof tools;

/**
 * Tool Call Input Types
 */

export interface CaptureVisitorInput {
  name: string;
  email: string;
  role: 'recruiter' | 'hiring_manager' | 'collaborator' | 'interested_party' | 'other';
  context?: string;
}

export interface CheckAvailabilityInput {
  date: string; // YYYY-MM-DD
  timeSlot: 'morning' | 'afternoon' | 'evening';
}

export interface CreateBookingInput {
  visitorId: string;
  requestedDatetime: string; // ISO format
  meetingType: 'quick_call' | 'technical_discussion' | 'collaboration_exploration' | 'general_inquiry';
  notes?: string;
}

export interface GenerateSummaryInput {
  conversationId: string;
  focusArea?: 'skills_discussed' | 'projects_discussed' | 'availability' | 'next_steps' | 'full_summary';
}
