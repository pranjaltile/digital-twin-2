# Implementation Plan
## Digital Twin - AI-Powered Professional Presence

**Document Version:** 1.0  
**Generated:** December 21, 2025  
**Source:** Technical Design Document v1.0  
**Status:** Approved for Implementation

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Project Overview](#project-overview)
3. [Milestone Breakdown](#milestone-breakdown)
4. [Task Breakdown](#task-breakdown)
5. [Dependency Graph](#dependency-graph)
6. [Resource Allocation](#resource-allocation)
7. [Risk Assessment](#risk-assessment)
8. [Quality Gates](#quality-gates)
9. [Appendices](#appendices)

---

## 1. Executive Summary

### 1.1 Project Scope

This implementation plan covers the complete development of Digital Twin across 9 milestones, from foundation setup through production deployment and polish.

### 1.2 Timeline Overview

| Phase | Milestones | Duration | Status |
|-------|------------|----------|--------|
| **Phase 1: Foundation** | M1-M3 | Week 1-2 | ✅ Complete |
| **Phase 2: Features** | M4-M6 | Week 2-3 | ✅ Complete |
| **Phase 3: Production** | M7-M8 | Week 3-4 | ✅ Complete |
| **Phase 4: Polish** | M9 | Week 4 | ✅ Complete |

### 1.3 Key Deliverables

- ✅ Functional chat interface with streaming AI responses
- ✅ Database persistence for conversations and messages
- ✅ Lead capture system with visitor forms
- ✅ Meeting scheduling with booking management
- ✅ AI personality and suggested prompts
- ✅ Tool-calling for autonomous actions
- ✅ Production deployment on Vercel
- ✅ Voice agent with speech recognition and TTS
- ✅ Admin dashboard with analytics
- ✅ Accessibility and performance optimizations

---

## 2. Project Overview

### 2.1 Technology Stack

| Component | Technology | Version |
|-----------|------------|---------|
| Framework | Next.js | 16 |
| Language | TypeScript | 5 |
| UI | React + Shadcn UI | 19 |
| Styling | Tailwind CSS | 4 |
| AI Provider | Groq (Llama 3.3 70B) | Latest |
| AI SDK | Vercel AI SDK | 4.x |
| Database | Neon Postgres | Serverless |
| Deployment | Vercel | Latest |
| Voice | Web Speech API | Native |

### 2.2 Team Structure

| Role | Responsibility |
|------|----------------|
| **Developer** | Full-stack implementation, AI integration |
| **AI Assistant** | Code generation, debugging, documentation |
| **Reviewer** | Code review, testing, quality assurance |

### 2.3 Development Environment

- **IDE**: VS Code with GitHub Copilot
- **Version Control**: Git + GitHub
- **Package Manager**: npm
- **Local Server**: Next.js dev server (Turbopack)

---

## 3. Milestone Breakdown

### Milestone 1: Foundation ✅

**Objective:** Set up project infrastructure and basic Next.js application

**Tasks:**
| ID | Task | Effort | Status |
|----|------|--------|--------|
| M1.1 | Initialize Next.js 16 with TypeScript | 0.5h | ✅ |
| M1.2 | Configure Tailwind CSS 4 | 0.25h | ✅ |
| M1.3 | Install Shadcn UI components | 0.5h | ✅ |
| M1.4 | Set up environment variables | 0.25h | ✅ |
| M1.5 | Create project structure | 0.5h | ✅ |
| M1.6 | Initialize Git repository | 0.25h | ✅ |

**Deliverables:**
- ✅ Working Next.js application
- ✅ Shadcn UI components installed
- ✅ Environment configuration
- ✅ Git repository with initial commit

---

### Milestone 2: Chat Interface ✅

**Objective:** Implement real-time chat with streaming AI responses

**Tasks:**
| ID | Task | Effort | Status |
|----|------|--------|--------|
| M2.1 | Create chat page layout | 1h | ✅ |
| M2.2 | Implement message input component | 0.5h | ✅ |
| M2.3 | Create ChatMessage component | 0.5h | ✅ |
| M2.4 | Set up useChat hook | 0.5h | ✅ |
| M2.5 | Create /api/chat endpoint | 1h | ✅ |
| M2.6 | Integrate Groq API | 1h | ✅ |
| M2.7 | Implement streaming response format | 1.5h | ✅ |
| M2.8 | Add loading states and error handling | 0.5h | ✅ |

**Deliverables:**
- ✅ Functional chat interface
- ✅ Real-time streaming responses
- ✅ Message history in session
- ✅ Error handling and loading states

---

### Milestone 3: Database Persistence ✅

**Objective:** Store conversations and messages in Neon Postgres

**Tasks:**
| ID | Task | Effort | Status |
|----|------|--------|--------|
| M3.1 | Set up Neon Postgres database | 0.5h | ✅ |
| M3.2 | Create database schema (SQL) | 1h | ✅ |
| M3.3 | Create lib/db.ts utilities | 1h | ✅ |
| M3.4 | Implement createConversation() | 0.5h | ✅ |
| M3.5 | Implement saveMessage() | 0.5h | ✅ |
| M3.6 | Implement getConversationHistory() | 0.5h | ✅ |
| M3.7 | Create migration script | 0.5h | ✅ |
| M3.8 | Add database indexes | 0.25h | ✅ |
| M3.9 | Test database operations | 0.5h | ✅ |

**Deliverables:**
- ✅ Database tables created
- ✅ CRUD operations working
- ✅ Message persistence across sessions
- ✅ Migration script for schema updates

---

### Milestone 4: Lead Capture ✅

**Objective:** Capture visitor information and schedule meetings

**Tasks:**
| ID | Task | Effort | Status |
|----|------|--------|--------|
| M4.1 | Create VisitorCaptureForm component | 1h | ✅ |
| M4.2 | Create visitors table | 0.25h | ✅ |
| M4.3 | Create /api/visitors endpoint | 0.5h | ✅ |
| M4.4 | Implement email validation | 0.25h | ✅ |
| M4.5 | Create BookingScheduler component | 1h | ✅ |
| M4.6 | Create bookings table | 0.25h | ✅ |
| M4.7 | Create /api/bookings endpoint | 0.5h | ✅ |
| M4.8 | Add form trigger logic (after 2 exchanges) | 0.5h | ✅ |
| M4.9 | Add success confirmations | 0.25h | ✅ |

**Deliverables:**
- ✅ Visitor capture form
- ✅ Booking scheduler
- ✅ Database storage for leads
- ✅ Confirmation messages

---

### Milestone 5: Personality Enhancement ✅

**Objective:** Add AI personality and suggested prompts

**Tasks:**
| ID | Task | Effort | Status |
|----|------|--------|--------|
| M5.1 | Create lib/systemPrompt.ts | 0.5h | ✅ |
| M5.2 | Write personality system prompt | 1h | ✅ |
| M5.3 | Create SuggestedPrompts component | 0.5h | ✅ |
| M5.4 | Define suggested prompt list | 0.25h | ✅ |
| M5.5 | Integrate prompts into chat UI | 0.5h | ✅ |
| M5.6 | Test personality consistency | 0.5h | ✅ |

**Deliverables:**
- ✅ Personalized AI responses
- ✅ Suggested follow-up prompts
- ✅ Consistent communication style

---

### Milestone 6: Tool-Calling ✅

**Objective:** Enable autonomous actions via AI tool-calling

**Tasks:**
| ID | Task | Effort | Status |
|----|------|--------|--------|
| M6.1 | Create lib/tools.ts | 0.5h | ✅ |
| M6.2 | Define captureVisitor tool | 0.5h | ✅ |
| M6.3 | Define checkAvailability tool | 0.5h | ✅ |
| M6.4 | Define createBooking tool | 0.5h | ✅ |
| M6.5 | Integrate tools with chat API | 1h | ✅ |
| M6.6 | Create tool_calls table | 0.25h | ✅ |
| M6.7 | Log tool executions | 0.5h | ✅ |
| M6.8 | Test tool-calling flows | 0.5h | ✅ |

**Deliverables:**
- ✅ Tool definitions
- ✅ Autonomous action execution
- ✅ Tool call logging

---

### Milestone 7: Deployment ✅

**Objective:** Deploy to Vercel with production configuration

**Tasks:**
| ID | Task | Effort | Status |
|----|------|--------|--------|
| M7.1 | Create vercel.json configuration | 0.25h | ✅ |
| M7.2 | Configure environment variables on Vercel | 0.25h | ✅ |
| M7.3 | Deploy to Vercel | 0.25h | ✅ |
| M7.4 | Test production deployment | 0.5h | ✅ |
| M7.5 | Create DEPLOYMENT_GUIDE.md | 0.5h | ✅ |
| M7.6 | Set up custom domain (optional) | 0.5h | ⏸️ |

**Deliverables:**
- ✅ Production deployment on Vercel
- ✅ Environment variables configured
- ✅ Deployment documentation

---

### Milestone 8: Voice Agent ✅

**Objective:** Add voice interaction capabilities

**Tasks:**
| ID | Task | Effort | Status |
|----|------|--------|--------|
| M8.1 | Research Web Speech API | 0.5h | ✅ |
| M8.2 | Create /api/voice endpoint | 1h | ✅ |
| M8.3 | Implement speech recognition | 1h | ✅ |
| M8.4 | Implement text-to-speech | 1h | ✅ |
| M8.5 | Create voice mode toggle | 0.5h | ✅ |
| M8.6 | Add voice UI components | 1h | ✅ |
| M8.7 | Handle voice mode state machine | 1h | ✅ |
| M8.8 | Fix stale closure issues | 0.5h | ✅ |
| M8.9 | Add TTS mute toggle | 0.25h | ✅ |
| M8.10 | Test voice flow end-to-end | 0.5h | ✅ |

**Deliverables:**
- ✅ Voice mode toggle in chat
- ✅ Speech recognition (STT)
- ✅ Text-to-speech (TTS)
- ✅ Voice-optimized AI responses

---

### Milestone 9: Polish & Launch Quality ✅

**Objective:** Final polish, accessibility, and documentation

**Tasks:**
| ID | Task | Effort | Status |
|----|------|--------|--------|
| M9.1 | UX Refinements | 1h | ✅ |
| M9.2 | Add ARIA labels | 0.5h | ✅ |
| M9.3 | Add semantic HTML | 0.25h | ✅ |
| M9.4 | Create admin dashboard | 1.5h | ✅ |
| M9.5 | Create /api/admin/stats endpoint | 1h | ✅ |
| M9.6 | Make dashboard mobile responsive | 0.5h | ✅ |
| M9.7 | Remove debug console.logs | 0.5h | ✅ |
| M9.8 | Fix TypeScript `any` types | 0.5h | ✅ |
| M9.9 | Update README.md | 0.5h | ✅ |
| M9.10 | Clean up unused files | 0.25h | ✅ |
| M9.11 | Create design.md | 1h | ✅ |
| M9.12 | Create implementation-plan.md | 0.5h | ✅ |

**Deliverables:**
- ✅ Polished UI with accessibility
- ✅ Admin dashboard
- ✅ Clean codebase
- ✅ Comprehensive documentation

---

## 4. Task Breakdown

### 4.1 Complete Task List

| Milestone | Task ID | Task | Priority | Effort | Dependencies | Status |
|-----------|---------|------|----------|--------|--------------|--------|
| M1 | M1.1 | Initialize Next.js | P0 | 0.5h | - | ✅ |
| M1 | M1.2 | Configure Tailwind | P0 | 0.25h | M1.1 | ✅ |
| M1 | M1.3 | Install Shadcn UI | P0 | 0.5h | M1.2 | ✅ |
| M1 | M1.4 | Environment variables | P0 | 0.25h | M1.1 | ✅ |
| M1 | M1.5 | Project structure | P0 | 0.5h | M1.1 | ✅ |
| M1 | M1.6 | Git repository | P0 | 0.25h | M1.1 | ✅ |
| M2 | M2.1 | Chat page layout | P0 | 1h | M1 | ✅ |
| M2 | M2.2 | Message input | P0 | 0.5h | M2.1 | ✅ |
| M2 | M2.3 | ChatMessage component | P0 | 0.5h | M2.1 | ✅ |
| M2 | M2.4 | useChat hook | P0 | 0.5h | M2.1 | ✅ |
| M2 | M2.5 | /api/chat endpoint | P0 | 1h | M1.4 | ✅ |
| M2 | M2.6 | Groq API integration | P0 | 1h | M2.5 | ✅ |
| M2 | M2.7 | Streaming format | P0 | 1.5h | M2.6 | ✅ |
| M2 | M2.8 | Error handling | P1 | 0.5h | M2.7 | ✅ |
| M3 | M3.1 | Neon database setup | P0 | 0.5h | - | ✅ |
| M3 | M3.2 | Database schema | P0 | 1h | M3.1 | ✅ |
| M3 | M3.3 | lib/db.ts | P0 | 1h | M3.2 | ✅ |
| M3 | M3.4 | createConversation() | P0 | 0.5h | M3.3 | ✅ |
| M3 | M3.5 | saveMessage() | P0 | 0.5h | M3.3 | ✅ |
| M3 | M3.6 | getConversationHistory() | P0 | 0.5h | M3.3 | ✅ |
| M3 | M3.7 | Migration script | P1 | 0.5h | M3.2 | ✅ |
| M3 | M3.8 | Database indexes | P1 | 0.25h | M3.2 | ✅ |
| M4 | M4.1 | VisitorCaptureForm | P0 | 1h | M2 | ✅ |
| M4 | M4.2 | Visitors table | P0 | 0.25h | M3 | ✅ |
| M4 | M4.3 | /api/visitors | P0 | 0.5h | M4.2 | ✅ |
| M4 | M4.4 | Email validation | P1 | 0.25h | M4.3 | ✅ |
| M4 | M4.5 | BookingScheduler | P0 | 1h | M4.1 | ✅ |
| M4 | M4.6 | Bookings table | P0 | 0.25h | M3 | ✅ |
| M4 | M4.7 | /api/bookings | P0 | 0.5h | M4.6 | ✅ |
| M4 | M4.8 | Form trigger logic | P1 | 0.5h | M4.1 | ✅ |
| M5 | M5.1 | lib/systemPrompt.ts | P0 | 0.5h | M2 | ✅ |
| M5 | M5.2 | Personality prompt | P0 | 1h | M5.1 | ✅ |
| M5 | M5.3 | SuggestedPrompts | P1 | 0.5h | M2 | ✅ |
| M5 | M5.4 | Prompt list | P1 | 0.25h | M5.3 | ✅ |
| M5 | M5.5 | Integrate prompts | P1 | 0.5h | M5.3 | ✅ |
| M6 | M6.1 | lib/tools.ts | P0 | 0.5h | M5 | ✅ |
| M6 | M6.2 | captureVisitor tool | P0 | 0.5h | M6.1 | ✅ |
| M6 | M6.3 | checkAvailability tool | P1 | 0.5h | M6.1 | ✅ |
| M6 | M6.4 | createBooking tool | P0 | 0.5h | M6.1 | ✅ |
| M6 | M6.5 | Tool integration | P0 | 1h | M6.2-4 | ✅ |
| M6 | M6.6 | tool_calls table | P1 | 0.25h | M3 | ✅ |
| M6 | M6.7 | Tool logging | P1 | 0.5h | M6.6 | ✅ |
| M7 | M7.1 | vercel.json | P0 | 0.25h | M6 | ✅ |
| M7 | M7.2 | Vercel env vars | P0 | 0.25h | M7.1 | ✅ |
| M7 | M7.3 | Deploy | P0 | 0.25h | M7.2 | ✅ |
| M7 | M7.4 | Test deployment | P0 | 0.5h | M7.3 | ✅ |
| M7 | M7.5 | Deployment guide | P1 | 0.5h | M7.3 | ✅ |
| M8 | M8.1 | Research Web Speech | P0 | 0.5h | M7 | ✅ |
| M8 | M8.2 | /api/voice | P0 | 1h | M8.1 | ✅ |
| M8 | M8.3 | Speech recognition | P0 | 1h | M8.1 | ✅ |
| M8 | M8.4 | Text-to-speech | P0 | 1h | M8.1 | ✅ |
| M8 | M8.5 | Voice mode toggle | P0 | 0.5h | M8.3 | ✅ |
| M8 | M8.6 | Voice UI | P0 | 1h | M8.5 | ✅ |
| M8 | M8.7 | State machine | P0 | 1h | M8.6 | ✅ |
| M8 | M8.8 | Fix closures | P0 | 0.5h | M8.7 | ✅ |
| M8 | M8.9 | TTS mute toggle | P1 | 0.25h | M8.4 | ✅ |
| M9 | M9.1 | UX refinements | P1 | 1h | M8 | ✅ |
| M9 | M9.2 | ARIA labels | P1 | 0.5h | M9.1 | ✅ |
| M9 | M9.3 | Semantic HTML | P1 | 0.25h | M9.1 | ✅ |
| M9 | M9.4 | Admin dashboard | P0 | 1.5h | M8 | ✅ |
| M9 | M9.5 | /api/admin/stats | P0 | 1h | M9.4 | ✅ |
| M9 | M9.6 | Mobile responsive | P1 | 0.5h | M9.4 | ✅ |
| M9 | M9.7 | Remove console.logs | P1 | 0.5h | M9.1 | ✅ |
| M9 | M9.8 | Fix TypeScript any | P1 | 0.5h | M9.7 | ✅ |
| M9 | M9.9 | Update README | P0 | 0.5h | M9 | ✅ |
| M9 | M9.10 | Clean unused files | P1 | 0.25h | M9.9 | ✅ |
| M9 | M9.11 | Create design.md | P0 | 1h | M9 | ✅ |
| M9 | M9.12 | Create impl-plan.md | P0 | 0.5h | M9.11 | ✅ |

### 4.2 Effort Summary

| Milestone | Total Effort | Tasks |
|-----------|--------------|-------|
| M1: Foundation | 2.25h | 6 |
| M2: Chat Interface | 6.5h | 8 |
| M3: Database | 5h | 9 |
| M4: Lead Capture | 4.5h | 9 |
| M5: Personality | 3.25h | 6 |
| M6: Tool-Calling | 4.25h | 8 |
| M7: Deployment | 1.75h | 6 |
| M8: Voice Agent | 7.25h | 10 |
| M9: Polish | 8h | 12 |
| **TOTAL** | **42.75h** | **74** |

---

## 5. Dependency Graph

```
M1 Foundation
    │
    ▼
M2 Chat Interface ──────────────────┐
    │                               │
    ▼                               │
M3 Database ◀───────────────────────┤
    │                               │
    ├───────────────┐               │
    ▼               ▼               │
M4 Lead Capture   M5 Personality    │
    │               │               │
    └───────────────┼───────────────┘
                    │
                    ▼
              M6 Tool-Calling
                    │
                    ▼
              M7 Deployment
                    │
                    ▼
              M8 Voice Agent
                    │
                    ▼
              M9 Polish & Launch
```

### 5.1 Critical Path

```
M1 → M2 → M3 → M5 → M6 → M7 → M8 → M9
```

The critical path determines the minimum time to complete the project. Delays on any critical path task delay the entire project.

### 5.2 Parallel Work Opportunities

| Phase | Parallel Tasks |
|-------|----------------|
| After M3 | M4 (Lead Capture) and M5 (Personality) |
| After M7 | Documentation updates while building M8 |
| During M9 | Admin dashboard and code cleanup |

---

## 6. Resource Allocation

### 6.1 Development Resources

| Resource | Availability | Primary Focus |
|----------|--------------|---------------|
| Developer | Full-time | Implementation, debugging |
| AI Assistant (Claude) | On-demand | Code generation, review |
| GitHub Copilot | Continuous | Inline suggestions |

### 6.2 Infrastructure Resources

| Resource | Provider | Cost |
|----------|----------|------|
| Database | Neon Postgres | Free tier |
| AI API | Groq | Free tier |
| Hosting | Vercel | Free tier |
| Domain | Optional | ~$12/year |

### 6.3 Tool Requirements

| Tool | Purpose | Required |
|------|---------|----------|
| VS Code | IDE | ✅ |
| Node.js 18+ | Runtime | ✅ |
| Git | Version control | ✅ |
| Chrome/Edge | Testing (voice) | ✅ |
| Postman | API testing | Optional |

---

## 7. Risk Assessment

### 7.1 Risk Matrix

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| API rate limits (Groq) | Medium | High | Implement retry logic, queue requests |
| Database connection issues | Low | High | Connection pooling, health checks |
| Voice API browser support | Medium | Medium | Graceful degradation, browser detection |
| Streaming format changes | Low | High | Version pin AI SDK, test thoroughly |
| Build failures | Low | Medium | CI/CD validation, TypeScript strict mode |
| Environment variable leaks | Low | Critical | .gitignore, secret scanning |

### 7.2 Risk Responses

**R1: API Rate Limits**
- Monitor usage in Groq dashboard
- Implement exponential backoff
- Consider caching common responses

**R2: Database Connection**
- Use Neon connection pooling
- Add `/api/health` endpoint
- Monitor connection count

**R3: Voice Browser Support**
- Detect `SpeechRecognition` API availability
- Show graceful fallback message
- Recommend Chrome/Edge for voice

**R4: Streaming Format**
- Pin `ai` package version
- Document expected format
- Add integration tests

---

## 8. Quality Gates

### 8.1 Milestone Exit Criteria

| Milestone | Exit Criteria |
|-----------|---------------|
| M1 | Next.js dev server runs, Shadcn components render |
| M2 | Chat sends message, receives streamed response |
| M3 | Messages persist, reload shows history |
| M4 | Lead form submits, booking creates record |
| M5 | AI uses personality, prompts display |
| M6 | Tools execute, calls logged |
| M7 | Production URL works, env vars set |
| M8 | Voice input transcribes, TTS speaks |
| M9 | No TypeScript errors, clean build |

### 8.2 Definition of Done

A task is "Done" when:
- [ ] Code is written and compiles without errors
- [ ] TypeScript has no `any` types (strict mode)
- [ ] Feature works in development
- [ ] Feature works in production (after M7)
- [ ] No console errors in browser
- [ ] Code is committed with meaningful message

### 8.3 Code Quality Standards

```typescript
// ✅ Good: Typed, explicit error handling
const processVoiceInput = useCallback(async (transcript: string) => {
  try {
    const response = await fetch('/api/voice', { ... });
    if (!response.ok) throw new Error('Failed');
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown';
    setVoiceError(message);
  }
}, [dependencies]);

// ❌ Bad: Untyped, implicit any, no error handling
const process = async (t) => {
  const r = await fetch('/api/voice', { ... });
  const d = await r.json();
  speak(d.response);
};
```

---

## 9. Appendices

### A. Git Commit Convention

```
<type>(<scope>): <description>

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation
- style: Formatting
- refactor: Code restructure
- test: Tests
- chore: Maintenance

Examples:
- feat(chat): add streaming response format
- fix(voice): resolve stale closure in transcript
- docs: update README with voice instructions
- chore: remove unused debug files
```

### B. File Naming Convention

| Type | Convention | Example |
|------|------------|---------|
| Pages | `page.tsx` | `app/chat/page.tsx` |
| API Routes | `route.ts` | `app/api/chat/route.ts` |
| Components | PascalCase | `ChatMessage.tsx` |
| Utilities | camelCase | `systemPrompt.ts` |
| Documentation | UPPER_CASE.md | `ARCHITECTURE.md` |

### C. Testing Checklist

#### Chat Flow
- [ ] Send message → receive response
- [ ] Multiple exchanges → context preserved
- [ ] Long message → handles gracefully
- [ ] Network error → shows error message

#### Voice Flow
- [ ] Toggle voice mode → UI changes
- [ ] Click mic → recognition starts
- [ ] Speak → transcript displays
- [ ] Stop speaking → AI responds
- [ ] TTS plays → can mute/unmute

#### Lead Capture
- [ ] Form appears → after 2 exchanges
- [ ] Submit valid → success message
- [ ] Submit invalid email → error shown
- [ ] Duplicate email → handled gracefully

#### Admin Dashboard
- [ ] Page loads → stats display
- [ ] Visitors table → shows data
- [ ] Bookings table → shows data
- [ ] Mobile view → responsive layout

### D. Environment Variables

```env
# Required
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxx
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require

# Optional
NEXT_PUBLIC_CALENDAR_URL=https://calendly.com/your-link
```

### E. Deployment Checklist

- [ ] All environment variables set in Vercel
- [ ] Database migrations applied
- [ ] Build succeeds (`npm run build`)
- [ ] Production URL accessible
- [ ] Chat works in production
- [ ] Voice works in production (Chrome/Edge)
- [ ] Admin dashboard loads
- [ ] No console errors

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Dec 21, 2025 | AI (Claude Opus 4.5) | Initial generation from design.md |

---

**End of Implementation Plan**
