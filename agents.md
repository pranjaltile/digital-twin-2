# agents.md - AI Development Instructions

**For: GitHub Copilot, Claude Desktop, ChatGPT, and Future AI Integrations**

This file serves as the **context-aware instruction manual** for all AI tools working within this project. Read this first before generating or suggesting code.

---

## Project Overview

**Project Name:** Digital Twin  
**Purpose:** AI-powered professional presence system for 24/7 conversational engagement  
**Status:** Active Development (Milestone 2/9)  
**Repository:** https://github.com/pranjaltile/digital-twin-2

---

## Tech Stack & Architecture

### Core Technology Decisions
- **Frontend**: Next.js 16 (App Router), React 19, TypeScript (strict)
- **Styling**: Tailwind CSS + Shadcn UI (no custom CSS unless necessary)
- **AI/LLM**: Claude Sonnet 4.5 via Vercel AI SDK v6 (not OpenAI, not local models)
- **Database**: Neon Postgres (serverless), not MongoDB, not SQLite
- **Backend**: Next.js API Routes (serverless functions), not Express or standalone Node
- **Deployment**: Vercel Functions, not Docker, not self-hosted
- **State Management**: React hooks + URL query params (no Redux/Zustand unless essential)

### Why These Choices
- **Vercel AI SDK v6**: Provides structured tool-calling and streaming abstractions
- **Claude Sonnet 4.5**: Best balance of cost and reasoning capability for conversational AI
- **Shadcn UI**: Consistent, accessible components that work with Tailwind
- **Neon Postgres**: Serverless scaling, automatic backups, no infrastructure overhead
- **Vercel**: Automatic deployments, edge functions, integrated with Next.js

---

## Directory Structure & File Purposes

```
digital-twin/
├── app/
│   ├── page.tsx                    # Landing page - keep minimal, link to /chat
│   ├── chat/
│   │   └── page.tsx               # Chat interface - main interaction point
│   └── api/
│       ├── chat/route.ts          # Claude streaming endpoint - core logic
│       ├── conversations/[id]/route.ts   # Retrieve conversation history
│       ├── visitors/route.ts      # POST visitor capture
│       ├── bookings/route.ts      # POST booking requests
│       └── test-db/route.ts       # Health check - verify DB connection
├── components/
│   ├── ChatMessage.tsx            # Single message display with avatar
│   ├── VisitorCaptureForm.tsx    # Lead capture form - Shadcn form component
│   ├── BookingScheduler.tsx       # Meeting scheduling - date picker + meeting type
│   └── ui/
│       ├── button.tsx             # Shadcn button - never create custom
│       ├── card.tsx               # Shadcn card - message containers
│       ├── input.tsx              # Shadcn input - form fields
│       ├── textarea.tsx           # Shadcn textarea - multi-line input
│       └── scroll-area.tsx        # Shadcn scroll - message history
├── lib/
│   ├── db.ts                      # Database queries: createConversation(), saveMessage(), getHistory()
│   ├── env.ts                     # Environment validation - throw on startup if missing vars
│   ├── systemPrompt.ts            # Claude system prompt - your personality & expertise
│   ├── tools.ts                   # Tool definitions for M6 (optional, not yet implemented)
│   └── utils.ts                   # Utility functions (formatDate, parseError, etc.)
├── docs/
│   ├── prd.md                     # Product Requirements - this is your curriculum
│   ├── ARCHITECTURE.md            # System design, data flow, integration points
│   ├── SCHEMA.md                  # Database schema with column descriptions
│   └── SETUP.md                   # Local development setup instructions
├── public/                        # Static assets (logo, favicon) - minimal
├── .env.local                     # SECRETS - never commit
├── .env.example                   # Template for .env.local - safe to commit
├── agents.md                      # THIS FILE - instructions for AI tools
├── README.md                      # Project overview + 8-milestone roadmap
├── package.json                   # Dependencies
├── next.config.ts                 # Next.js configuration
├── tsconfig.json                  # TypeScript configuration - use strict mode
└── eslint.config.mjs              # Code linting - enforce style consistency
```

---

## Coding Standards & Conventions

### TypeScript
- **Strict Mode**: Always enabled. Generate types, don't use `any`
- **File Naming**: camelCase for files (e.g., `chatMessage.tsx`), PascalCase for React components
- **Imports**: Use `@/*` alias from tsconfig.json (e.g., `import { Button } from "@/components/ui/button"`)
- **Comments**: Use JSDoc for functions, minimal inline comments (code should be self-documenting)

```typescript
// ✅ Good
export interface Message {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
}

// ❌ Avoid
export interface Message {
  [key: string]: any; // Never use any
}
```

### React Components
- **Functional Components Only**: No class components
- **Shadcn UI First**: Always use Shadcn components before creating custom UI
- **Props Typing**: Always define prop interfaces
- **Hooks**: Use React hooks (useState, useEffect, useCallback) for state management
- **Server Components**: Use by default in Next.js App Router (add `'use client'` only when needed for interactivity)

```typescript
// ✅ Good
'use client';

import { Button } from "@/components/ui/button";

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function ChatMessage({ role, content, timestamp }: ChatMessageProps) {
  return (
    <div className="flex gap-4">
      <p className="text-sm text-gray-600">{content}</p>
      <span className="text-xs text-gray-400">{timestamp.toLocaleTimeString()}</span>
    </div>
  );
}
```

### API Routes
- **Naming**: Use RESTful conventions (POST /api/chat, GET /api/conversations/[id])
- **Error Handling**: Always return `{ error: string }` with appropriate status code
- **Validation**: Validate all input parameters before database queries
- **Streaming**: Use Vercel AI SDK's `streamText()` for Claude responses (never implement streaming manually)

```typescript
// ✅ Good - API route with streaming
import { streamText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';

export async function POST(req: Request) {
  const { messages } = await req.json();
  
  if (!messages || !Array.isArray(messages)) {
    return Response.json({ error: 'Invalid messages' }, { status: 400 });
  }

  const result = streamText({
    model: anthropic('claude-sonnet-4-20250514'),
    messages,
    system: systemPrompt,
  });

  return result.toAIStream();
}
```

### Database Queries
- **ORM**: Use raw SQL with `@vercel/postgres` (no Prisma or Drizzle unless added explicitly)
- **Parameterized Queries**: Always use `$1, $2` placeholders to prevent SQL injection
- **Error Handling**: Wrap in try-catch, log errors, return user-friendly messages
- **Indexing**: Mention indexes in comments when creating queries that need them

```typescript
// ✅ Good
import { sql } from '@vercel/postgres';

export async function getConversationHistory(conversationId: string) {
  try {
    const result = await sql`
      SELECT id, role, content, created_at 
      FROM messages 
      WHERE conversation_id = $1 
      ORDER BY created_at ASC
    `, [conversationId];
    
    return result.rows;
  } catch (error) {
    console.error('Failed to fetch conversation:', error);
    throw new Error('Unable to retrieve conversation history');
  }
}
```

### Naming Conventions
- **Functions**: camelCase, descriptive verbs (`getConversationHistory`, `saveMessage`)
- **Constants**: UPPER_SNAKE_CASE for globals (e.g., `MAX_MESSAGE_LENGTH`)
- **React Props**: descriptive, avoid abbreviations (e.g., `isLoading` not `isl`)
- **Database Tables**: snake_case, plural names (`conversations`, `messages`, `visitors`)
- **Git Commits**: Conventional commits format
  - `feat: add tool-calling for autonomous booking`
  - `fix: prevent message duplication on retry`
  - `docs: update ARCHITECTURE.md with data flow`

---

## System Prompt & Personality Injection

### Location
`lib/systemPrompt.ts` contains your professional identity

### Content
```typescript
export const systemPrompt = `You are [Your Name], a [role] with [X years] experience in [domains].

Your Strengths:
- [Skill 1]
- [Skill 2]
- [Skill 3]

Availability:
- [Work type: full-time/contract/advisory]
- [Time commitment]

Communication Style:
- [Tone: friendly/formal/technical/conversational]
- [Approach: direct/collaborative]

Responsibilities in Conversation:
1. Answer questions about your experience accurately
2. After each response, suggest 2-3 relevant follow-up questions
3. Offer to capture contact information when visitor shows interest
4. Suggest meeting scheduling if appropriate for discussion topic
5. Stay within your expertise—refer to external resources for out-of-scope topics

Avoid:
- Discussing topics outside your expertise
- Making promises about availability without checking
- Over-personalizing (maintain professionalism)
`;
```

### How It's Used
Injected into every Claude call in `app/api/chat/route.ts`:
```typescript
const result = streamText({
  model: anthropic('claude-sonnet-4-20250514'),
  system: systemPrompt, // Your personality lives here
  messages, // Conversation history
  tools: [], // M6 feature - autonomous actions
});
```

---

## AI Tool-Calling Architecture (Milestone 6)

When implementing agentic features, follow this pattern:

### Tool Definition
```typescript
// lib/tools.ts
export const tools = {
  captureVisitor: {
    description: 'Capture visitor contact information',
    parameters: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        email: { type: 'string' },
        role: { type: 'string', enum: ['recruiter', 'hiring_manager', 'other'] },
      },
      required: ['name', 'email', 'role'],
    },
  },
};
```

### Tool Handler
```typescript
// app/actions/captureVisitor.ts
'use server';

export async function captureVisitorAction(data: VisitorData) {
  try {
    const result = await sql`
      INSERT INTO visitors (name, email, role, created_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING id
    `, [data.name, data.email, data.role];
    
    return { success: true, visitorId: result.rows[0].id };
  } catch (error) {
    return { success: false, error: 'Failed to capture visitor' };
  }
}
```

### Tool-Calling Loop in API Route
```typescript
// app/api/chat/route.ts
const result = streamText({
  model: anthropic('claude-sonnet-4-20250514'),
  system: systemPrompt,
  messages,
  tools, // Enable tool-calling
});

// Handle tool calls
for await (const event of result) {
  if (event.type === 'tool-call') {
    const toolResult = await executeTool(event.toolName, event.toolInput);
    // Feed result back to Claude...
  }
}
```

---

## Performance Budgets & Optimization

### Chat Response Latency
- **Target**: <3 seconds from user message to first token from Claude
- **Breakdown**:
  - Network request: 50ms
  - Database fetch conversation history: 200ms
  - Claude response: 2000-2500ms
  - Streaming transfer: 50-100ms

**Optimization Tips**:
- Don't fetch unnecessary data (paginate message history if >50 messages)
- Use database indexes on `conversation_id` and `created_at`
- Parallelize DB queries where possible (fetch visitor context + message history in parallel)

### Database Query Performance
- **Target**: <500ms for typical queries
- **Indexes Required**:
  - `conversations.id` (primary key)
  - `messages.conversation_id` (for history retrieval)
  - `messages.created_at` (for ordering)
  - `visitors.email` (for duplicate checking)

### Bundle Size
- **Target**: <200KB initial JavaScript (gzipped)
- **Don't Add**: Large charting libraries, animation frameworks, or full icon sets
- **Do Use**: Tree-shaking for imports (e.g., `import { Button } from "@/components/ui/button"` not `import * from "@/components/ui"`)

---

## Security Checklist

### Secrets Management
- ✅ `.env.local` contains all secrets (never committed)
- ✅ `.env.example` has placeholders only (safe to commit)
- ✅ On Vercel: Set env vars in project settings dashboard
- ✅ Never log or expose API keys in error messages

### Input Validation
- ✅ All API endpoints validate request body
- ✅ Email format validation for visitor capture
- ✅ SQL parameterization (`$1, $2`) to prevent injection
- ✅ Rate limiting on chat endpoint (future enhancement)

### Database Security
- ✅ Connection pooling enabled (Neon default)
- ✅ No direct database credentials in code
- ✅ Read-only credentials for analytics (if added later)

---

## Common Patterns & Recipes

### Fetching Conversation History
```typescript
const history = await db.getConversationHistory(conversationId);
const formattedMessages = history.map(msg => ({
  role: msg.role,
  content: msg.content,
}));
```

### Streaming Chat Response
```typescript
const result = streamText({
  model: anthropic('claude-sonnet-4-20250514'),
  system: systemPrompt,
  messages: formattedMessages,
});

return result.toAIStream(); // Sends SSE stream to client
```

### Capturing Visitor & Saving Message
```typescript
// Save assistant response to DB
await db.saveMessage(conversationId, 'assistant', response);

// Later: Capture visitor (M4)
const visitorId = await captureVisitorAction({
  name, email, role
});

// Link conversation to visitor
await db.linkConversationToVisitor(conversationId, visitorId);
```

---

## Decision Tree for AI Suggestions

When working on this project, ask yourself:

1. **Is this related to Chat/Messaging?**
   - Yes → Use `app/api/chat/route.ts` and Vercel AI SDK
   - Check: Is it streaming? Should it be?

2. **Is this related to Database?**
   - Yes → Use Neon SQL queries with parameterization
   - Check: Does this query need an index?

3. **Is this a UI Component?**
   - Yes → Check if Shadcn has it first
   - If not → Create custom component but style with Tailwind only

4. **Is this a new API Endpoint?**
   - Yes → Create in `app/api/[feature]/route.ts`
   - Check: Does this need authentication? (Not yet, but note for later)

5. **Is this for Production Deployment?**
   - Yes → Test on Vercel staging first
   - Check: Are environment variables configured?

---

## Current Milestone & Next Steps

**Current**: Milestone 2 (Chat Interface & Agent Wiring)
- Chat UI functional ✅
- Real-time streaming working ✅
- Claude integration complete ✅

**Next Steps**:
1. Verify Milestone 2 locally (chat working end-to-end)
2. Move to Milestone 3: Database Persistence (save messages to Neon)
3. Add conversation history retrieval
4. Test data persistence across sessions

---

## When Stuck

**For Code Generation Issues:**
- Reference `docs/prd.md` for requirements
- Check `docs/ARCHITECTURE.md` for system design
- Look at existing patterns in `lib/` and `app/api/`

**For AI Tool Recommendations:**
- I will follow this file exactly; don't override without updating agents.md
- Stack choices are deliberate; don't suggest alternatives without justification
- Performance targets are hard limits; suggest tradeoffs if unavoidable

**For Questions About Architecture:**
- Frontend ↔ API routes: Always via Next.js built-in routing
- API routes ↔ Database: Always parameterized SQL queries
- AI ↔ Tools: Always through Vercel AI SDK tool-calling abstractions

---

**End of agents.md**

Last Updated: December 19, 2025  
For Updates: Edit this file and commit with `docs: update agents.md`
