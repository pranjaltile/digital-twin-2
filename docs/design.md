# Technical Design Document
## Digital Twin - AI-Powered Professional Presence

**Document Version:** 1.0  
**Generated:** December 21, 2025  
**Source:** PRD v1.0 + Architecture Documentation  
**Status:** Approved for Implementation

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [System Architecture](#system-architecture)
3. [Component Design](#component-design)
4. [Data Architecture](#data-architecture)
5. [API Design](#api-design)
6. [AI Agent Design](#ai-agent-design)
7. [Voice Integration Design](#voice-integration-design)
8. [Security Design](#security-design)
9. [Performance Design](#performance-design)
10. [Deployment Architecture](#deployment-architecture)
11. [Testing Strategy](#testing-strategy)
12. [Appendices](#appendices)

---

## 1. Executive Summary

### 1.1 Purpose

This document provides the comprehensive technical design for Digital Twin, an AI-powered professional presence system. It translates the Product Requirements Document (PRD) into actionable technical specifications that enable implementation.

### 1.2 Scope

The design covers all nine milestones:
- **M1-M3**: Foundation, Chat Interface, Database Persistence
- **M4-M5**: Lead Capture, Personality Enhancement
- **M6**: Tool-Calling & Autonomous Actions
- **M7**: Deployment & Production Readiness
- **M8**: Voice Agent Integration
- **M9**: Polish & Launch Quality

### 1.3 Design Principles

| Principle | Implementation |
|-----------|----------------|
| **Serverless-First** | All components run on Vercel Functions, scaling automatically |
| **Streaming-Native** | AI responses stream incrementally for perceived performance |
| **Type-Safe** | TypeScript strict mode across entire codebase |
| **Component-Based** | Shadcn UI components for consistent, accessible UI |
| **AI-Augmented** | Claude handles complex decisions; tools execute actions |

---

## 2. System Architecture

### 2.1 High-Level Architecture

```
┌──────────────────────────────────────────────────────────────────────────┐
│                            CLIENT LAYER                                   │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐          │
│  │   Chat UI       │  │   Voice Mode    │  │   Admin Panel   │          │
│  │   (React 19)    │  │  (Web Speech)   │  │   (Dashboard)   │          │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘          │
└───────────┼────────────────────┼────────────────────┼────────────────────┘
            │                    │                    │
            ▼                    ▼                    ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                           API LAYER (Next.js 16)                          │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐          │
│  │  /api/chat      │  │  /api/voice     │  │  /api/admin/*   │          │
│  │  (Streaming)    │  │  (JSON)         │  │  (JSON)         │          │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘          │
│           │                    │                    │                    │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐          │
│  │  /api/visitors  │  │  /api/bookings  │  │  /api/health    │          │
│  │  (Lead Capture) │  │  (Scheduling)   │  │  (Monitoring)   │          │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘          │
└───────────┼────────────────────┼────────────────────┼────────────────────┘
            │                    │                    │
            ▼                    ▼                    ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                          AI AGENT LAYER                                   │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                    Groq API (Llama 3.3 70B)                       │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐                  │   │
│  │  │  System    │  │  Tool      │  │  Response  │                  │   │
│  │  │  Prompt    │  │  Definitions│  │  Generation│                  │   │
│  │  └────────────┘  └────────────┘  └────────────┘                  │   │
│  └──────────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────────┘
            │
            ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                         DATA LAYER (Neon Postgres)                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │conversations│  │  messages   │  │  visitors   │  │  bookings   │    │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘    │
│  ┌─────────────┐  ┌─────────────┐                                       │
│  │  projects   │  │ tool_calls  │                                       │
│  └─────────────┘  └─────────────┘                                       │
└──────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Technology Stack

| Layer | Technology | Version | Rationale |
|-------|------------|---------|-----------|
| **Runtime** | Node.js | 18.x+ | LTS, Vercel native support |
| **Framework** | Next.js | 16 | App Router, streaming, React 19 |
| **UI Library** | React | 19 | Concurrent features, Server Components |
| **Styling** | Tailwind CSS | 4 | Utility-first, tree-shaking |
| **Components** | Shadcn UI | Latest | Accessible, customizable |
| **AI Provider** | Groq | API v1 | Fast inference, Llama 3.3 70B |
| **AI SDK** | Vercel AI SDK | 4.x | useChat hook, streaming |
| **Database** | Neon Postgres | Serverless | Auto-scaling, connection pooling |
| **Deployment** | Vercel | Latest | Serverless functions, edge |
| **Language** | TypeScript | 5 | Strict mode, type safety |

### 2.3 Request Flow

```
User Input → Chat UI → useChat Hook → POST /api/chat
                                           │
                                           ▼
                                    Parse Messages
                                           │
                                           ▼
                                    Load System Prompt
                                           │
                                           ▼
                                    Call Groq API
                                           │
                                           ▼
                                    Stream Response
                                           │
                                           ▼
                             Format for AI SDK v4
                             (0:"text"\n, e:{}, d:{})
                                           │
                                           ▼
                              Return ReadableStream
                                           │
                                           ▼
                               useChat displays incrementally
```

---

## 3. Component Design

### 3.1 Frontend Components

#### 3.1.1 Page Components

| Component | Path | Responsibility |
|-----------|------|----------------|
| `ChatPage` | `app/chat/page.tsx` | Main chat interface with voice toggle |
| `AdminPage` | `app/admin/page.tsx` | Analytics dashboard |
| `HomePage` | `app/page.tsx` | Landing page with CTA |

#### 3.1.2 ChatPage Component Design

```typescript
// State Management
interface ChatPageState {
  // useChat hook state
  messages: Message[];
  input: string;
  isLoading: boolean;
  error: Error | null;
  
  // Voice mode state
  isVoiceMode: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  isVoiceProcessing: boolean;
  voiceTranscript: string;
  interimTranscript: string;
  isTTSEnabled: boolean;
  
  // Lead capture state
  showLeadCapture: boolean;
  visitorEmail: string;
  
  // Session state
  conversationId: string | null;
  sessionId: string;
}
```

#### 3.1.3 UI Component Hierarchy

```
ChatPage
├── Header
│   ├── Title + Subtitle
│   ├── Voice Toggle Button
│   ├── TTS Toggle (voice mode only)
│   └── Home Link
├── ScrollArea (Messages)
│   ├── ChatMessage[] (assistant/user)
│   └── SuggestedPrompts (initial state)
├── VoiceUI (voice mode only)
│   ├── Mic Button
│   ├── Transcript Display
│   └── Speaking Indicator
├── TextInput (text mode only)
│   ├── Input Field
│   └── Send Button
├── VisitorCaptureForm (triggered after 2 exchanges)
└── BookingScheduler (after lead capture)
```

### 3.2 Shared Components

| Component | Path | Props | Purpose |
|-----------|------|-------|---------|
| `ChatMessage` | `components/ChatMessage.tsx` | `message, isLoading` | Render message with role styling |
| `VisitorCaptureForm` | `components/VisitorCaptureForm.tsx` | `onSubmit, onDismiss` | Lead capture modal |
| `BookingScheduler` | `components/BookingScheduler.tsx` | `visitorId, onBook` | Meeting scheduling |
| `SuggestedPrompts` | `components/SuggestedPrompts.tsx` | `prompts, onSelect` | Clickable prompt chips |

### 3.3 Shadcn UI Components

```
components/ui/
├── avatar.tsx      # User/AI avatars
├── button.tsx      # Primary actions
├── card.tsx        # Content containers
├── input.tsx       # Text input fields
├── scroll-area.tsx # Scrollable message area
└── textarea.tsx    # Multi-line input
```

---

## 4. Data Architecture

### 4.1 Entity Relationship Diagram

```
┌─────────────────┐       ┌─────────────────┐
│    projects     │       │   conversations │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │──┐    │ id (PK)         │
│ name            │  └───▶│ project_id (FK) │
│ description     │       │ visitor_session │
│ created_at      │       │ title           │
│ updated_at      │       │ created_at      │
└─────────────────┘       │ updated_at      │
                          └────────┬────────┘
                                   │
                                   ▼
┌─────────────────┐       ┌─────────────────┐
│    visitors     │       │    messages     │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │
│ email (UNIQUE)  │       │ conversation_id │◀──┘
│ name            │       │ role            │
│ role            │       │ content         │
│ context         │       │ metadata (JSONB)│
│ created_at      │       │ created_at      │
└────────┬────────┘       └─────────────────┘
         │
         ▼
┌─────────────────┐       ┌─────────────────┐
│    bookings     │       │   tool_calls    │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │
│ visitor_id (FK) │◀──┘   │ conversation_id │
│ requested_dt    │       │ tool_name       │
│ meeting_type    │       │ input (JSONB)   │
│ notes           │       │ output (JSONB)  │
│ status          │       │ created_at      │
│ created_at      │       └─────────────────┘
└─────────────────┘
```

### 4.2 Table Specifications

#### 4.2.1 conversations

```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  visitor_session_id VARCHAR(255),
  title VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for query optimization
CREATE INDEX idx_conversations_project_id ON conversations(project_id);
CREATE INDEX idx_conversations_visitor_session ON conversations(visitor_session_id);
CREATE INDEX idx_conversations_created_at ON conversations(created_at DESC);
```

#### 4.2.2 messages

```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for conversation history retrieval
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
```

#### 4.2.3 visitors

```sql
CREATE TABLE visitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(100),
  context TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for email lookups (deduplication)
CREATE INDEX idx_visitors_email ON visitors(email);
CREATE INDEX idx_visitors_created_at ON visitors(created_at DESC);
```

#### 4.2.4 bookings

```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id UUID NOT NULL REFERENCES visitors(id) ON DELETE CASCADE,
  requested_datetime TIMESTAMP,
  meeting_type VARCHAR(100),
  notes TEXT,
  status VARCHAR(50) DEFAULT 'pending' 
    CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for booking management
CREATE INDEX idx_bookings_visitor_id ON bookings(visitor_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_created_at ON bookings(created_at DESC);
```

### 4.3 Query Patterns

| Query | Expected Latency | Index Used |
|-------|------------------|------------|
| Get conversation messages | <100ms | `idx_messages_conversation_id` |
| Get visitor by email | <50ms | `idx_visitors_email` |
| Get pending bookings | <100ms | `idx_bookings_status` |
| Count conversations (week) | <200ms | `idx_conversations_created_at` |
| Recent visitors (10) | <100ms | `idx_visitors_created_at` |

---

## 5. API Design

### 5.1 API Endpoints Overview

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| POST | `/api/chat` | Text chat with AI | None |
| POST | `/api/voice` | Voice chat with AI | None |
| POST | `/api/visitors` | Capture lead | None |
| POST | `/api/bookings` | Schedule meeting | None |
| GET | `/api/admin/stats` | Dashboard data | None* |
| GET | `/api/health` | Health check | None |

*Admin endpoints should have authentication in production.

### 5.2 Chat API

**Endpoint:** `POST /api/chat`

**Request:**
```typescript
interface ChatRequest {
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}
```

**Response:** `ReadableStream` (AI SDK v4 format)
```
0:"Hello! I'm Pranjal's Digital Twin..."\n
e:{"finishReason":"stop","usage":{"promptTokens":0,"completionTokens":0}}\n
d:{"finishReason":"stop"}\n
```

**Error Response:**
```typescript
interface ChatError {
  error: string;
  message: string;
}
```

### 5.3 Voice API

**Endpoint:** `POST /api/voice`

**Request:**
```typescript
interface VoiceRequest {
  transcript: string;
  messages?: Array<{ role: 'user' | 'assistant'; content: string }>;
  conversationId?: string;
}
```

**Response:**
```typescript
interface VoiceResponse {
  response: string;
  conversationId: string;
  source: 'voice';
}
```

### 5.4 Visitors API

**Endpoint:** `POST /api/visitors`

**Request:**
```typescript
interface VisitorRequest {
  email: string;
  name: string;
  role?: string;
  context?: string;
}
```

**Response:**
```typescript
interface VisitorResponse {
  success: boolean;
  visitorId: string;
  message: string;
}
```

### 5.5 Bookings API

**Endpoint:** `POST /api/bookings`

**Request:**
```typescript
interface BookingRequest {
  visitorId: string;
  requestedDatetime?: string;
  meetingType: string;
  notes?: string;
}
```

**Response:**
```typescript
interface BookingResponse {
  success: boolean;
  bookingId: string;
  message: string;
}
```

### 5.6 Admin Stats API

**Endpoint:** `GET /api/admin/stats`

**Response:**
```typescript
interface AdminStatsResponse {
  stats: {
    totalVisitors: number;
    totalConversations: number;
    totalBookings: number;
    pendingBookings: number;
    totalMessages: number;
    conversationsThisWeek: number;
  };
  recentVisitors: Array<{
    id: string;
    name: string;
    email: string;
    role: string | null;
    createdAt: string;
  }>;
  recentBookings: Array<{
    id: string;
    visitorName: string;
    requestedDatetime: string;
    meetingType: string;
    status: string;
  }>;
}
```

---

## 6. AI Agent Design

### 6.1 System Prompt Architecture

```typescript
const systemPrompt = `
You are Pranjal's Digital Twin — an AI representation of a software developer 
specializing in AI/ML, web development, and design thinking.

## Core Identity
- Name: Pranjal
- Role: Full-Stack Developer & AI Enthusiast
- Expertise: React, Next.js, Python, NLP, HealthTech

## Communication Style
- Warm and professional
- Technical when appropriate
- Concise but comprehensive
- Always helpful and engaged

## Capabilities
- Answer questions about skills and experience
- Discuss projects (NLP-Chatbot, SUNHACK 2024)
- Capture visitor information for follow-up
- Schedule meetings when requested

## Behavioral Guidelines
- Never claim to be human
- Stay in character as Pranjal's representative
- Redirect off-topic conversations politely
- Suggest relevant follow-up questions
`;
```

### 6.2 Voice Mode Modifications

For voice interactions, the system prompt is augmented:

```typescript
const voiceSystemPrompt = `
${baseSystemPrompt}

IMPORTANT: You are now in VOICE MODE.
- Keep responses concise (2-3 sentences)
- Avoid markdown, bullet points, or formatting
- Speak naturally as if in a phone conversation
- Max response: 300 tokens
`;
```

### 6.3 Tool Definitions (Future Enhancement)

```typescript
const tools = {
  captureVisitor: {
    description: 'Capture visitor contact information',
    parameters: {
      email: { type: 'string', required: true },
      name: { type: 'string', required: true },
      role: { type: 'string', required: false },
      context: { type: 'string', required: false },
    },
  },
  checkAvailability: {
    description: 'Check available meeting slots',
    parameters: {
      date: { type: 'string', required: true },
    },
  },
  createBooking: {
    description: 'Schedule a meeting',
    parameters: {
      visitorId: { type: 'string', required: true },
      datetime: { type: 'string', required: true },
      meetingType: { type: 'string', required: true },
    },
  },
};
```

---

## 7. Voice Integration Design

### 7.1 Voice Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     BROWSER LAYER                            │
│  ┌─────────────────┐      ┌─────────────────┐              │
│  │ SpeechRecognition│      │ SpeechSynthesis │              │
│  │ (Web Speech API) │      │ (Web Speech API)│              │
│  └────────┬────────┘      └────────▲────────┘              │
│           │                        │                        │
│           ▼                        │                        │
│  ┌─────────────────────────────────┴─────────────────┐     │
│  │              Voice Mode State Machine              │     │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐        │     │
│  │  │ Listening │→│Processing│→│ Speaking │→(loop)  │     │
│  │  └──────────┘  └──────────┘  └──────────┘        │     │
│  └───────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                      SERVER LAYER                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                   POST /api/voice                    │   │
│  │  • Receive transcript                                │   │
│  │  • Add voice mode instructions to prompt             │   │
│  │  • Call Groq with max_tokens: 300                   │   │
│  │  • Return JSON response (not streaming)             │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 7.2 Voice State Machine

```
                    ┌──────────────┐
                    │    IDLE      │
                    └──────┬───────┘
                           │ toggleVoiceMode()
                           ▼
┌──────────────────────────────────────────────────────────┐
│                    VOICE MODE ACTIVE                      │
│                                                          │
│    ┌──────────┐    toggleMic()    ┌──────────┐          │
│    │  READY   │◀─────────────────▶│LISTENING │          │
│    └──────────┘                   └────┬─────┘          │
│         ▲                              │ onend          │
│         │                              ▼                │
│         │ speak complete        ┌──────────┐           │
│         │                       │PROCESSING│           │
│    ┌────┴─────┐                └────┬─────┘           │
│    │ SPEAKING │◀───────────────────┘                  │
│    └──────────┘    processVoiceInput()                 │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 7.3 Voice Component Implementation

```typescript
// Key refs to avoid stale closures
const recognitionRef = useRef<SpeechRecognition | null>(null);
const voiceTranscriptRef = useRef<string>('');

// Speech Recognition setup
recognition.continuous = false;  // Stop after phrase
recognition.interimResults = true;  // Show partial results
recognition.lang = 'en-US';

// TTS Configuration
utterance.rate = 1.0;
utterance.pitch = 1.0;
utterance.lang = 'en-US';
// Prefer natural-sounding voices
preferredVoice = voices.find(v => 
  v.name.includes('Google') || 
  v.name.includes('Natural')
);
```

---

## 8. Security Design

### 8.1 Secret Management

| Secret | Storage | Access |
|--------|---------|--------|
| `GROQ_API_KEY` | `.env.local` / Vercel | Server-side only |
| `DATABASE_URL` | `.env.local` / Vercel | Server-side only |
| `CALENDAR_URL` | `.env.local` / Vercel | Client-side (NEXT_PUBLIC_) |

### 8.2 Security Measures

```typescript
// 1. Environment validation
if (!process.env.GROQ_API_KEY) {
  throw new Error('GROQ_API_KEY not configured');
}

// 2. Input validation
if (!messages?.length) {
  return new Response(
    JSON.stringify({ error: 'No messages provided' }),
    { status: 400 }
  );
}

// 3. Error sanitization (no secrets in responses)
catch (error: unknown) {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  // Never expose stack traces or internal details
  return new Response(
    JSON.stringify({ error: 'Failed to process request' }),
    { status: 500 }
  );
}
```

### 8.3 Data Protection

- **HTTPS**: Enforced in production (Vercel default)
- **Database**: SSL/TLS connections required (Neon default)
- **Secrets**: Never logged, never in client bundle
- **User Data**: Stored with minimal PII, no passwords

---

## 9. Performance Design

### 9.1 Performance Budgets

| Metric | Target | Measurement |
|--------|--------|-------------|
| First Contentful Paint | <2s | Lighthouse |
| Time to First Byte | <500ms | Real User Monitoring |
| Chat First Token | <3s | Custom metric |
| API Response Time | <1s | Server timing |
| Bundle Size (gzip) | <200KB | Build output |

### 9.2 Optimization Strategies

#### 9.2.1 Streaming Responses
```typescript
// Stream responses instead of waiting for completion
const readableStream = new ReadableStream({
  start(controller) {
    // Send text incrementally
    controller.enqueue(encoder.encode(`0:${JSON.stringify(text)}\n`));
    controller.close();
  },
});
```

#### 9.2.2 Database Indexing
```sql
-- Indexes on frequently queried columns
CREATE INDEX idx_conversations_created_at ON conversations(created_at DESC);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_visitors_email ON visitors(email);
```

#### 9.2.3 React Optimizations
```typescript
// Memoize expensive computations
const speak = useCallback((text: string) => { ... }, [isTTSEnabled, isVoiceMode]);

// Use refs for values needed in closures
const voiceTranscriptRef = useRef<string>('');
```

---

## 10. Deployment Architecture

### 10.1 Vercel Deployment

```
┌─────────────────────────────────────────────────────────────┐
│                        VERCEL                                │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                  Edge Network                        │   │
│  │  • Static assets (CDN)                              │   │
│  │  • Next.js pages (ISR/SSG)                          │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Serverless Functions                    │   │
│  │  • /api/chat (Node.js runtime)                      │   │
│  │  • /api/voice (Node.js runtime)                     │   │
│  │  • /api/admin/* (Node.js runtime)                   │   │
│  │  • /api/visitors, /api/bookings                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Environment Variables                   │   │
│  │  • GROQ_API_KEY                                     │   │
│  │  • DATABASE_URL (Neon)                              │   │
│  │  • NEXT_PUBLIC_CALENDAR_URL                         │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    NEON POSTGRES                             │
│  • Serverless scaling                                       │
│  • Connection pooling                                       │
│  • Automated backups                                        │
└─────────────────────────────────────────────────────────────┘
```

### 10.2 Environment Configuration

| Environment | DATABASE_URL | GROQ_API_KEY | Purpose |
|-------------|--------------|--------------|---------|
| Development | Local `.env.local` | Dev key | Local testing |
| Preview | Vercel env | Dev key | PR previews |
| Production | Vercel env | Prod key | Live site |

### 10.3 Build Process

```bash
# Build command
npm run build

# Output
# - .next/static (CDN assets)
# - .next/server (serverless functions)
# - .next/cache (build cache)
```

---

## 11. Testing Strategy

### 11.1 Testing Layers

| Layer | Tool | Coverage Target |
|-------|------|-----------------|
| Unit Tests | Vitest | 80% lib functions |
| Component Tests | React Testing Library | Critical paths |
| API Tests | Supertest | All endpoints |
| E2E Tests | Playwright | Happy paths |

### 11.2 Manual Testing Checklist

#### Chat Flow
- [ ] Send message, receive streaming response
- [ ] Multiple back-and-forth exchanges
- [ ] Long messages (>1000 chars)
- [ ] Error handling (API timeout)

#### Voice Flow
- [ ] Toggle voice mode on/off
- [ ] Speak and see transcript
- [ ] Hear TTS response
- [ ] Toggle TTS mute
- [ ] Handle speech errors gracefully

#### Lead Capture
- [ ] Form appears after 2 exchanges
- [ ] Validation on email format
- [ ] Success confirmation displayed
- [ ] Duplicate email handled

#### Admin Dashboard
- [ ] Stats load and display
- [ ] Recent visitors table
- [ ] Recent bookings table
- [ ] Mobile responsive layout

---

## 12. Appendices

### A. File Structure

```
digital-twin/
├── app/
│   ├── layout.tsx              # Root layout with dark theme
│   ├── page.tsx                # Landing page
│   ├── globals.css             # Tailwind + custom styles
│   ├── chat/
│   │   └── page.tsx            # Main chat interface
│   ├── admin/
│   │   └── page.tsx            # Admin dashboard
│   └── api/
│       ├── chat/route.ts       # Text chat API
│       ├── voice/route.ts      # Voice chat API
│       ├── visitors/route.ts   # Lead capture API
│       ├── bookings/route.ts   # Booking API
│       ├── health/route.ts     # Health check
│       └── admin/
│           └── stats/route.ts  # Admin stats API
├── components/
│   ├── ui/                     # Shadcn components
│   ├── ChatMessage.tsx
│   ├── VisitorCaptureForm.tsx
│   ├── BookingScheduler.tsx
│   └── SuggestedPrompts.tsx
├── lib/
│   ├── db.ts                   # Database utilities
│   ├── systemPrompt.ts         # AI personality
│   ├── tools.ts                # Tool definitions
│   ├── env.ts                  # Environment validation
│   └── utils.ts                # Helpers
├── docs/
│   ├── prd.md                  # Product requirements
│   ├── design.md               # This document
│   ├── ARCHITECTURE.md         # System architecture
│   ├── SCHEMA.md               # Database schema
│   └── DEPLOYMENT_GUIDE.md     # Deployment instructions
└── scripts/
    └── migrate.ts              # Database migrations
```

### B. Configuration Files

#### next.config.ts
```typescript
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    turbopack: true,
  },
};
```

#### tsconfig.json
```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "jsx": "preserve",
    "module": "esnext",
    "moduleResolution": "bundler",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### C. Error Codes

| Code | Message | Resolution |
|------|---------|------------|
| `GROQ_001` | API key not configured | Set GROQ_API_KEY env var |
| `DB_001` | Database connection failed | Check DATABASE_URL |
| `VOICE_001` | Speech recognition not supported | Use Chrome/Edge |
| `INPUT_001` | No messages provided | Send valid message array |

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Dec 21, 2025 | AI (Claude Opus 4.5) | Initial generation from PRD |

---

**End of Technical Design Document**
