# AI Agents Configuration
## Digital Twin - Instructions for AI Tools

**Last Updated:** December 22, 2025  
**Project:** Digital Twin - AI-Powered Professional Presence

---

## Overview

This document provides instructions for AI agents (GitHub Copilot, Claude, etc.) working on the Digital Twin project. It defines where key documents are located, how to interact with the system, and conventions to follow.

---

## Project Documentation

### Primary Documents

| Document | Path | Purpose |
|----------|------|---------|
| **PRD** | `docs/prd.md` | Product requirements, features, acceptance criteria |
| **Technical Design** | `docs/design.md` | Architecture, component design, API specs |
| **Implementation Plan** | `docs/implementation-plan.md` | Task breakdown, dependencies, timeline |
| **Architecture** | `docs/ARCHITECTURE.md` | System layers, data flow, technology decisions |
| **Database Schema** | `docs/SCHEMA.md` | Table definitions, indexes, relationships |
| **Deployment Guide** | `docs/DEPLOYMENT_GUIDE.md` | Vercel deployment instructions |
| **Setup Guide** | `docs/SETUP.md` | Local development setup |
| **Testing Guide** | `docs/TESTING_GUIDE.md` | Testing strategies and checklists |
| **Troubleshooting** | `docs/TROUBLESHOOTING.md` | Common issues and solutions |

### Quick Reference

```
docs/
├── prd.md                 # WHAT to build (requirements)
├── design.md              # HOW to build (technical design)
├── implementation-plan.md # WHEN to build (task schedule)
├── ARCHITECTURE.md        # System overview
├── SCHEMA.md              # Database tables
├── DEPLOYMENT_GUIDE.md    # Production deployment
├── SETUP.md               # Dev environment
├── TESTING_GUIDE.md       # QA procedures
└── TROUBLESHOOTING.md     # Debug help
```

---

## Project Structure

```
digital-twin/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Landing page
│   ├── layout.tsx         # Root layout (dark theme)
│   ├── globals.css        # Tailwind styles
│   ├── chat/page.tsx      # Main chat interface + voice
│   ├── admin/page.tsx     # Admin dashboard
│   └── api/               # API routes
│       ├── chat/route.ts      # Text chat (streaming)
│       ├── voice/route.ts     # Voice chat (JSON)
│       ├── visitors/route.ts  # Lead capture
│       ├── bookings/route.ts  # Meeting scheduling
│       ├── health/route.ts    # Health check
│       └── admin/stats/route.ts # Dashboard data
├── components/            # React components
│   ├── ui/               # Shadcn UI primitives
│   ├── ChatMessage.tsx   # Message display
│   ├── VisitorCaptureForm.tsx
│   ├── BookingScheduler.tsx
│   └── SuggestedPrompts.tsx
├── lib/                   # Utilities
│   ├── db.ts             # Database operations
│   ├── systemPrompt.ts   # AI personality
│   ├── tools.ts          # Tool definitions
│   ├── env.ts            # Environment validation
│   └── utils.ts          # Helpers
├── scripts/              # Maintenance scripts
│   └── migrate.ts        # Database migrations
└── docs/                 # Documentation
```

---

## Technology Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Framework | Next.js | 16 |
| Language | TypeScript | 5 (strict mode) |
| UI | React + Shadcn UI | 19 |
| Styling | Tailwind CSS | 4 |
| AI Provider | Groq API | Llama 3.3 70B |
| AI SDK | Vercel AI SDK | 4.x |
| Database | Neon Postgres | Serverless |
| Deployment | Vercel | Latest |
| Voice | Web Speech API | Native browser |

---

## AI Agent Instructions

### When Generating Code

1. **Always use TypeScript** with strict mode
2. **Follow existing patterns** in the codebase
3. **Use Shadcn UI** for new UI components
4. **Avoid `any` types** - use proper TypeScript interfaces
5. **Handle errors properly** with try/catch and user feedback
6. **Use environment variables** for secrets (never hardcode)

### When Modifying Chat/AI Features

1. **Reference** `lib/systemPrompt.ts` for personality configuration
2. **Reference** `docs/design.md` Section 6 for AI agent design
3. **Streaming format** for chat: `0:${JSON.stringify(text)}\n`
4. **JSON format** for voice: `{ response: string, conversationId: string }`
5. **Max tokens**: 1024 for chat, 300 for voice

### When Modifying Database

1. **Reference** `docs/SCHEMA.md` for table definitions
2. **Use** `@vercel/postgres` `sql` template literal
3. **Add indexes** for frequently queried columns
4. **Follow naming**: snake_case for columns, PascalCase for types

### When Adding New Features

1. **Check PRD** (`docs/prd.md`) for requirements alignment
2. **Check Design** (`docs/design.md`) for architecture fit
3. **Update Implementation Plan** if adding new milestones
4. **Follow component patterns** in existing code

---

## API Endpoints

### Chat API
```typescript
// POST /api/chat
// Request
{ messages: Array<{ role: 'user' | 'assistant'; content: string }> }

// Response (streaming)
0:"Hello! I'm the Digital Twin..."\n
e:{"finishReason":"stop"}\n
d:{"finishReason":"stop"}\n
```

### Voice API
```typescript
// POST /api/voice
// Request
{ transcript: string, messages?: Array<...>, conversationId?: string }

// Response (JSON)
{ response: string, conversationId: string, source: 'voice' }
```

### Visitors API
```typescript
// POST /api/visitors
// Request
{ email: string, name: string, role?: string, context?: string }

// Response
{ success: boolean, visitorId: string, message: string }
```

### Bookings API
```typescript
// POST /api/bookings
// Request
{ visitorId: string, requestedDatetime?: string, meetingType: string, notes?: string }

// Response
{ success: boolean, bookingId: string, message: string }
```

### Admin Stats API
```typescript
// GET /api/admin/stats
// Response
{
  stats: { totalVisitors, totalConversations, totalBookings, ... },
  recentVisitors: Array<{ id, name, email, role, createdAt }>,
  recentBookings: Array<{ id, visitorName, requestedDatetime, status }>
}
```

---

## Database Schema

### Core Tables

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `projects` | Project container | id, name, description |
| `conversations` | Chat sessions | id, project_id, visitor_session_id |
| `messages` | Chat messages | id, conversation_id, role, content |
| `visitors` | Lead contacts | id, email (unique), name, role |
| `bookings` | Meeting requests | id, visitor_id, requested_datetime, status |
| `tool_calls` | AI tool audit | id, conversation_id, tool_name, input, output |

### Common Queries

```sql
-- Get conversation messages
SELECT * FROM messages WHERE conversation_id = $1 ORDER BY created_at;

-- Get visitor by email
SELECT * FROM visitors WHERE email = $1;

-- Get pending bookings
SELECT * FROM bookings WHERE status = 'pending';

-- Count conversations this week
SELECT COUNT(*) FROM conversations WHERE created_at > NOW() - INTERVAL '7 days';
```

---

## Environment Variables

```env
# Required
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxx
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require

# Optional
NEXT_PUBLIC_CALENDAR_URL=https://calendly.com/your-link
```

---

## Common Tasks

### Add a New API Endpoint

1. Create file at `app/api/<name>/route.ts`
2. Export `GET` or `POST` async function
3. Use `sql` from `@vercel/postgres` for database
4. Return `new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } })`

### Add a New UI Component

1. Create file at `components/<Name>.tsx`
2. Use `'use client'` directive for client components
3. Import from `@/components/ui/*` for Shadcn primitives
4. Export default function component

### Modify AI Personality

1. Edit `lib/systemPrompt.ts`
2. Update the `getSystemPrompt()` function
3. Test in chat to verify tone and content

### Add Database Table

1. Add SQL to `scripts/migrate.ts`
2. Run migration: `npx tsx scripts/migrate.ts`
3. Document in `docs/SCHEMA.md`
4. Add TypeScript interface in relevant route

---

## Git Conventions

### Commit Messages

```
<type>(<scope>): <description>

Types: feat, fix, docs, style, refactor, test, chore

Examples:
- feat(chat): add voice mode toggle
- fix(api): resolve streaming format issue
- docs: update agents.md with MCP instructions
```

### Branch Strategy

- `main` - Production-ready code
- `feature/<name>` - New features
- `fix/<issue>` - Bug fixes

---

## Testing Checklist

### Before Committing

- [ ] `npm run build` succeeds
- [ ] No TypeScript errors
- [ ] No console errors in browser
- [ ] Feature works in development
- [ ] Tested in Chrome/Edge (for voice)

### Before Deploying

- [ ] All environment variables set in Vercel
- [ ] Database migrations applied
- [ ] Production URL accessible
- [ ] Chat and voice working

---

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| "Module not found" | Run `npm install` |
| "GROQ_API_KEY not configured" | Add to `.env.local` |
| "Database connection failed" | Check `DATABASE_URL` |
| Voice not working | Use Chrome/Edge, check HTTPS |
| Streaming format error | Check AI SDK v4 format |

### Debug Mode

Set `NODE_ENV=development` for verbose logging in API routes.

---

## Contact

For questions about this project, refer to:
- Technical issues → `docs/TROUBLESHOOTING.md`
- Architecture questions → `docs/ARCHITECTURE.md`
- Feature requests → `docs/prd.md`

---

**End of AI Agents Configuration**
