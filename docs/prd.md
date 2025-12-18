# Product Requirements Document (PRD)
## Digital Twin - AI-Powered Professional Presence

**Document Version:** 1.0  
**Last Updated:** December 19, 2025  
**Status:** Active Development (Milestone 2/9)

---

## Executive Summary

**Digital Twin** is an AI-powered professional presence system that enables 24/7 conversational engagement with visitors. The system intelligently captures leads, schedules meetings, and represents your professional identity through Claude Sonnet 4.5 conversational AI.

**Key Value Propositions:**
- 24/7 availability without manual intervention
- Intelligent lead capture with visitor context
- Seamless meeting scheduling
- Persistent interaction history for follow-up
- Professional portfolio enhancement

---

## AI Study & Reference Materials

### Framework & Architecture References
- **Vercel AI SDK v6 Documentation**: https://sdk.vercel.ai/docs
- **Next.js App Router**: https://nextjs.org/docs/app
- **Claude API Documentation**: https://docs.anthropic.com/claude/reference
- **Shadcn UI Components**: https://ui.shadcn.com

### AI & LLM Concepts
- **Tool-Calling in LLMs**: https://docs.anthropic.com/claude/docs/tool-use
- **Prompt Engineering Best Practices**: https://docs.anthropic.com/claude/docs/prompt-engineering
- **Streaming Responses**: https://docs.anthropic.com/claude/reference/stream-messages-api
- **System Prompts for Personalization**: https://docs.anthropic.com/claude/docs/system-prompts

### Database & Backend
- **Neon Postgres Documentation**: https://neon.tech/docs
- **Next.js API Routes**: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
- **Vercel Functions**: https://vercel.com/docs/functions

### Voice Integration (Milestone 8)
- **Twilio Documentation**: https://www.twilio.com/docs
- **OpenAI Realtime API**: https://platform.openai.com/docs/guides/realtime
- **Deepgram STT**: https://developers.deepgram.com/docs

---

## Technical Requirements

### Core Stack
- **Frontend Framework**: Next.js 16 with React 19 and App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + Shadcn UI components
- **AI Model**: Claude Sonnet 4.5 via Vercel AI SDK v6
- **Database**: Neon Postgres (serverless)
- **Deployment**: Vercel Functions (serverless backend)

### Environment & Tooling
- **Node.js**: 18.x or higher
- **Package Manager**: npm
- **Version Control**: Git + GitHub
- **Code Quality**: ESLint + Prettier
- **Development**: VS Code with GitHub Copilot recommended

### Performance Budgets
- **First Contentful Paint (FCP)**: < 2 seconds
- **API Response Time**: < 1 second for typical queries
- **Chat Stream Latency**: < 3 seconds to first token from Claude
- **Database Query Time**: < 500ms for conversation history (10-50 messages)
- **Bundle Size**: < 200KB initial (gzipped)

### Security Requirements
- Environment variables for all secrets (API keys, database URLs)
- No secrets committed to GitHub (enforced via .gitignore)
- HTTPS-only for production deployment
- Database connection pooling for serverless scalability
- Input validation on all API endpoints

---

## Functional Requirements

### F1: Chat Interface & Messaging
- **Description**: Users can send messages and receive real-time streamed responses from Claude
- **Acceptance Criteria**:
  - Message input accepts up to 2000 characters
  - Streaming responses display incrementally (no waiting for full response)
  - Message history persists in UI during session
  - Timestamps displayed for each message
  - Mobile responsive layout (works on phones, tablets, desktops)

### F2: Conversation Persistence
- **Description**: All messages are stored in database and retrievable across sessions
- **Acceptance Criteria**:
  - Messages inserted to `messages` table with `conversation_id` reference
  - Conversation history retrieved on page reload
  - Message ordering by timestamp (oldest first)
  - Supports conversations with 100+ messages efficiently
  - Database indexed for fast retrieval

### F3: Lead Capture
- **Description**: Visitors can submit contact information (email, name, role, context)
- **Acceptance Criteria**:
  - Form validation: email format, name required, role dropdown
  - Form triggers after 2-3 exchanges (or via manual button)
  - Visitor data stored in `visitors` table
  - Email deduplication to prevent duplicate captures
  - Confirmation message shown with reference ID

### F4: Meeting Scheduling
- **Description**: Captured visitors can request meetings with date/time selection
- **Acceptance Criteria**:
  - Date/time picker UI with calendar component
  - Meeting type selection (30-min call, technical discussion, etc.)
  - Optional notes field
  - Booking stored in `bookings` table
  - Confirmation message with booking reference
  - Availability checking (avoid double-booking)

### F5: AI Personality & Context
- **Description**: AI responses reflect your professional identity and experience
- **Acceptance Criteria**:
  - System prompt includes name, skills, experience, tone
  - Responses reference specific expertise and achievements
  - Suggested follow-up prompts provided after each response
  - Tone consistent with communication style (e.g., formal, friendly, technical)
  - Context from visitor profile shapes response style

### F6: Tool-Calling & Autonomous Actions (M6)
- **Description**: AI agent can autonomously capture leads, check availability, and schedule meetings
- **Acceptance Criteria**:
  - Claude uses tools to call captureVisitor(), checkAvailability(), createBooking()
  - Tool results fed back to Claude for context-aware response
  - Multiple sequential tool calls supported (e.g., check availability → create booking)
  - Tool execution logged for audit trail
  - User sees clear confirmation of actions taken

### F7: Deployment & Public Access
- **Description**: System accessible via public URL with production readiness
- **Acceptance Criteria**:
  - App deployed to Vercel with custom domain (optional)
  - Database connection works in production environment
  - Environment variables properly configured on Vercel
  - Chat functional on deployed instance
  - No console errors or security warnings

### F8: Voice Agent (M8 - Optional)
- **Description**: Visitors can call a phone number and speak to Digital Twin via voice
- **Acceptance Criteria**:
  - Phone number routes to voice endpoint
  - Speech-to-text transcription accurate (>95% for clear audio)
  - Text-to-speech response natural-sounding (professional tone)
  - Voice conversations persisted to database with `voice` source tag
  - Same tools and personality available via voice

---

## Non-Functional Requirements

### NF1: Performance
- Chat responses stream incrementally (not batch-returned)
- Database queries use indexes for <500ms retrieval
- API endpoints respond in <1s under typical load
- Mobile UI performs well on 4G networks

### NF2: Reliability
- 99% uptime for deployed system
- Database backups automated (Neon handles)
- Graceful error handling (no crashes on invalid input)
- Error messages helpful and actionable

### NF3: Maintainability
- TypeScript strict mode enabled (catch bugs early)
- Code follows ESLint + Prettier standards
- Meaningful commit messages (conventional commits)
- Architecture documented in `docs/ARCHITECTURE.md`

### NF4: Scalability
- Serverless functions auto-scale with traffic
- Database connection pooling for concurrent requests
- Handles 100+ concurrent chat sessions
- No single points of failure

### NF5: Security
- No secrets in repository (enforced by .gitignore)
- Environment variables isolated per environment (dev, staging, prod)
- Input validation on all API endpoints
- HTTPS-only for all API calls
- Database credentials rotated periodically

### NF6: Accessibility (a11y)
- ARIA labels on form inputs
- Keyboard navigation for all interactive elements
- Color contrast ≥ 4.5:1 (WCAG AA)
- Screen reader compatible

---

## Acceptance Criteria (MVP - Milestone 3)

### Must Have (M1-M3)
- ✅ Chat UI functional with real-time streaming responses
- ✅ Conversation history persisted to database
- ✅ Messages retrievable on page reload
- ✅ Environment variables properly configured
- ✅ GitHub repository with clean commit history
- ✅ Deployed to Vercel with public URL

### Should Have (M4-M5)
- ✅ Lead capture form with visitor details
- ✅ Meeting scheduling with date/time picker
- ✅ AI personality reflected in responses
- ✅ Suggested follow-up prompts
- ✅ Professional documentation (README, ARCHITECTURE)

### Nice to Have (M6-M9)
- ✅ Tool-calling for autonomous actions
- ✅ Voice agent via phone number
- ✅ Admin analytics dashboard
- ✅ Advanced visitor segmentation

---

## Success Metrics

### User Engagement
- Average conversation length: ≥5 exchanges per session
- Lead capture rate: ≥30% of visitors
- Meeting booking rate: ≥10% of captured leads

### System Performance
- Chat first-response latency: <2 seconds
- Database query time: <500ms average
- Page load time: <2 seconds on 4G

### Business Impact
- 24/7 availability (100% uptime)
- Zero manual intervention required
- Documented architecture for future scaling

---

## Notes for AI Tools

This PRD is your curriculum. When generating code or suggesting features:

1. **Stack Compliance**: Always use Next.js App Router, Shadcn UI, Vercel AI SDK, Neon Postgres
2. **Architecture**: Reference `docs/ARCHITECTURE.md` for system design patterns
3. **Naming Conventions**: Use conventional commits ("feat:", "fix:", "docs:")
4. **Performance**: Prioritize streaming responses and indexed database queries
5. **Security**: Never suggest storing secrets in code; use environment variables only

---

**End of PRD**
