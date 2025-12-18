# Architecture Overview

## System Layers

The Digital Twin is built as a five-layer system, with clear separation of concerns and data flow between layers.

```
┌─────────────────────────────────────────────────┐
│ Layer 1: Frontend (React 19 + Shadcn UI)       │
│ • Chat interface with message history           │
│ • Real-time streaming display                  │
│ • Form inputs for lead capture & booking       │
└─────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────┐
│ Layer 2: AI Agent (Vercel AI SDK + Claude)     │
│ • System prompt with personality                │
│ • Tool-calling for autonomous actions          │
│ • Context injection from conversation history  │
│ • Streaming response generation                │
└─────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────┐
│ Layer 3: Backend (Next.js 16 Server)           │
│ • API routes for chat, visitors, bookings      │
│ • Server Actions for database writes            │
│ • Request validation & error handling          │
│ • Tool execution logic                          │
└─────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────┐
│ Layer 4: Data Storage (Neon Postgres)          │
│ • Conversations & message history              │
│ • Visitor profiles & contact details           │
│ • Booking requests & scheduling                │
│ • Analytics & interaction patterns             │
└─────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────┐
│ Layer 5: Workflows (Vercel Workflows)          │
│ • Email notifications                           │
│ • Analytics aggregation                         │
│ • Scheduled tasks                               │
│ • Multi-step orchestration                     │
└─────────────────────────────────────────────────┘
```

## Data Flow

### Chat Message Flow
1. **User Input** → Types message in chat UI
2. **Frontend** → Collects message via `useChat()` hook
3. **API Call** → POST to `/api/chat` with message history
4. **Backend** → Receives messages, validates input
5. **AI Layer** → Claude processes with system prompt + context
6. **Streaming** → Response streams back to frontend
7. **Storage** → Message persisted to Neon (Milestone 3)
8. **Display** → Message appears in chat with timestamp

### Lead Capture Flow
1. **User Interaction** → Fills visitor form (name, email, role, context)
2. **Validation** → Frontend validates email format, required fields
3. **API Call** → POST to `/api/visitors` with contact details
4. **Backend** → Inserts visitor record to Neon
5. **Response** → Returns visitor_id and confirmation
6. **Workflow** → Vercel Workflow triggers welcome email (Milestone 7)
7. **Storage** → Visitor data persisted, linked to conversation

### Booking Flow
1. **User Intent** → Requests meeting with AI Twin
2. **AI Decision** → Claude decides to call booking tool
3. **Tool Call** → `createBooking(visitor_id, datetime, type)`
4. **Backend** → Validates availability, inserts booking record
5. **Workflow** → Triggers confirmation email & calendar sync
6. **Confirmation** → AI responds to user with booking details
7. **Storage** → Booking persisted with status & notes

## Technology Decisions

### Why Next.js 16?
- **App Router**: Server Components for secure AI integration
- **Streaming**: Native support for streaming responses from LLMs
- **Edge Compute**: Deploy globally with minimal latency
- **DX**: Built-in TypeScript, ESLint, fast refresh

### Why Claude Sonnet 4.5?
- **Reasoning**: Strong multi-step reasoning for agentic tasks
- **Speed**: 0.5-1s latency suitable for real-time chat
- **Cost**: Balanced between capability and API cost
- **Reliability**: Consistent personality expression

### Why Vercel AI SDK v6?
- **Provider Agnostic**: Switch LLMs without code changes
- **Tool-Calling**: Native support for autonomous function execution
- **Streaming**: Built-in streaming and incremental UI updates
- **React Integration**: Seamless with React 19 Server Components

### Why Neon Postgres?
- **Serverless**: Scales to zero, no connection management overhead
- **Developer Experience**: Simple connection strings, quick setup
- **Reliability**: Automated backups, replication, failover
- **Cost**: Free tier sufficient for MVP, scales as needed

## Component Architecture

### Frontend Components
- **`ChatPage`** (`app/chat/page.tsx`)
  - Main chat interface
  - Manages message state with `useChat()` hook
  - Handles input submission & streaming

- **`ChatMessage`** (`components/ChatMessage.tsx`)
  - Displays individual messages
  - Shows role indicator (user/assistant)
  - Formats timestamps

- **UI Components** (`components/ui/`)
  - Button, Card, Input, Textarea, ScrollArea, Avatar
  - Shadcn UI primitives, Tailwind-styled

### Backend Routes
- **`POST /api/chat`** (`app/api/chat/route.ts`)
  - Receives message array
  - Calls Claude with system prompt
  - Streams response to client
  - Signature: `{ messages: Array<{role, content}> } → Stream<string>`

- **`POST /api/visitors`** (`app/api/visitors/route.ts`) [Milestone 4]
  - Captures visitor contact details
  - Validates email, name
  - Stores to visitors table
  - Signature: `{ email, name, role, context } → { visitor_id, message }`

- **`POST /api/bookings`** (`app/api/bookings/route.ts`) [Milestone 4]
  - Creates booking request
  - Validates availability
  - Triggers confirmation workflow
  - Signature: `{ visitor_id, datetime, type, notes } → { booking_id, confirmation }`

- **`GET /api/test-db`** (`app/api/test-db/route.ts`)
  - Tests database connectivity
  - Returns status and timestamp
  - Signature: `() → { connected: boolean, timestamp: string }`

### Database Schema (Neon)

**conversations**
- id: UUID (PK)
- project_id: UUID (FK → projects)
- visitor_session_id: VARCHAR
- title: VARCHAR
- created_at: TIMESTAMP
- updated_at: TIMESTAMP

**messages**
- id: UUID (PK)
- conversation_id: UUID (FK → conversations)
- role: VARCHAR (user/assistant)
- content: TEXT
- metadata: JSONB
- created_at: TIMESTAMP

**visitors** [Milestone 4]
- id: UUID (PK)
- email: VARCHAR (UNIQUE)
- name: VARCHAR
- role: VARCHAR (recruiter/hiring_manager/other)
- context: TEXT
- created_at: TIMESTAMP

**bookings** [Milestone 4]
- id: UUID (PK)
- visitor_id: UUID (FK → visitors)
- requested_datetime: TIMESTAMP
- meeting_type: VARCHAR
- notes: TEXT
- status: VARCHAR (requested/confirmed/completed/cancelled)
- created_at: TIMESTAMP

## Error Handling

### Client-Side
- Input validation before submission
- Loading states during API calls
- Error toast for failed requests
- Fallback UI for network failures

### Server-Side
- Request validation (JSON parsing, schema validation)
- Database connection error handling
- AI API error handling (rate limits, timeouts)
- Graceful degradation on partial failures

### Recovery
- Automatic retry on network failures
- Conversation history preserved
- Error messages logged for debugging
- User-friendly error messages in UI

## Performance Considerations

### Streaming
- Messages stream as they're generated (no waiting for full response)
- Frontend updates UI incrementally
- Better perceived performance than waiting

### Caching
- Conversation history cached in state
- System prompt memoized
- Database query results cached when appropriate

### Database
- Indexed queries on conversation_id, visitor_id
- Connection pooling via Neon serverless driver
- Async operations don't block chat response

## Security Architecture

### Secrets Management
- API keys stored in `.env.local` (never committed)
- Environment variables validated on startup
- No secrets in database or logs

### Data Protection
- HTTPS enforced in production
- Database connections encrypted
- Visitor data isolated per conversation

### Access Control
- No authentication required (public chat) [Milestone 1-7]
- Admin panel protected (future enhancement)
- Rate limiting on API endpoints (future enhancement)

## Deployment Architecture

### Development
- Local Next.js dev server with hot reload
- Local Neon connection for testing
- Environment validation on startup

### Production (Vercel)
- Vercel Functions for serverless execution
- Automatic scaling based on traffic
- Global edge distribution
- Environment variables in Vercel dashboard
- Neon connection pooled for serverless
- Workflows for async operations

## Monitoring & Observability

### Logging
- Console logs for development
- Structured logs sent to external service (future)
- Error tracking (Sentry integration planned)

### Metrics
- Chat message count & average response time
- Visitor conversion rate
- Booking success rate
- AI model performance (latency, error rate)

### Analytics
- Conversation patterns
- Visitor questions (to improve prompts)
- User engagement signals
- Booking pipeline metrics

## Future Enhancements

### Near-term (Milestones 3-5)
- Database persistence
- Lead capture forms
- Personality enhancements
- Multi-turn memory

### Medium-term (Milestone 6)
- Tool-calling autonomous actions
- Availability checking
- Booking automation
- Email summaries

### Long-term (Milestones 7-9)
- Voice interface (phone)
- Admin dashboard
- Analytics & insights
- Mobile app
- Calendar integration
- CRM integration

---

*Last updated: Milestone 2*
