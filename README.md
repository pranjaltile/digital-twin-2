# Digital Twin

An AI-powered professional presence that represents you 24/7. Visitors can engage in natural conversation with your Digital Twin, learn about your skills and experience, and book meetings—all through an intelligent conversational interface.

## 🎯 Project Vision

Transform your professional identity into a live, interactive service using modern AI and full-stack development patterns. Your Digital Twin:

- **Communicates in your voice** — Reflects your professional tone and personality
- **Answers questions accurately** — About your skills, experience, and availability
- **Guides conversations** — Suggests relevant follow-up topics
- **Captures leads** — Stores visitor details for follow-up
- **Books meetings** — Enables interview scheduling
- **Learns continuously** — Stores all interactions for improvement

## 🏗️ Tech Stack

### Frontend
- **Next.js 16** — React framework with App Router, streaming support
- **React 19** — Latest React features and optimizations
- **Shadcn UI** — Accessible, consistent component library
- **Tailwind CSS** — Utility-first styling

### AI & Intelligence
- **Vercel AI SDK v6** — LLM orchestration with streaming support
- **Claude Sonnet 4.5** — Advanced reasoning model for conversational AI
- **Tool-calling** — Autonomous decision-making and action execution

### Backend & Infrastructure
- **Next.js API Routes** — Serverless backend functions
- **Vercel Functions** — Deployment and scaling
- **Neon Postgres** — Managed PostgreSQL database
- **Vercel Workflows** — Scheduled and triggered async jobs

## 📋 8-Milestone Implementation Roadmap

### **Milestone 1: Project Setup & Foundation (Week 1)**

**Goal:** Establish clean, operational development foundation.

#### Tasks
1. Initialize Next.js 16 project with TypeScript, Tailwind CSS, App Router
2. Install and configure Shadcn UI with components: `button`, `card`, `input`, `textarea`, `scroll-area`
3. Install Vercel AI SDK v6 with Claude Sonnet 4.5 provider
4. Provision Neon Postgres database and install Vercel Postgres client
5. Configure environment variables with `.env.local` and `.env.example`
6. Initialize database schema: `projects`, `conversations`, `messages` tables
7. Set up Git with branching strategy: `main` (production) → `develop` (staging) → `feature/*` (development)
8. Create base landing page and database connection test endpoint

#### Demo Expectation
- ✅ App runs on `localhost:3000` with "Hello, Digital Twin" landing page
- ✅ `/api/test-db` returns `{ connected: true }` with timestamp from database
- ✅ GitHub repo has clean commit history with no secrets exposed

---

### **Milestone 2: Chat Interface & Agent Wiring (Week 2)**

**Goal:** Enable real-time conversation using AI agent → backend → UI.

#### Tasks
1. Design chat UI layout with Shadcn components: `card`, `input`, `button`, `scroll-area`
2. Create ChatMessage component with role indicator (user/assistant) + avatar + timestamp
3. Build chat route handler `app/api/chat/route.ts` with Claude integration
4. Implement `useChat` hook integration for client-side chat management
5. Add loading and error states with auto-scroll to latest message
6. Test end-to-end chat flow with real-time streaming responses

#### Demo Expectation
- ✅ Chat page loads at `/chat`
- ✅ Type message → AI responds in real-time with streaming text
- ✅ UI updates instantly; no page reloads
- ✅ Basic personality evident (friendly greeting, professional tone)

---

### **Milestone 3: Database Integration & Data Persistence (Week 3)**

**Goal:** Ensure real interactions are captured and retrievable.

#### Tasks
1. Expand database schema: `conversations` table with `visitor_session_id`, `created_at`, `updated_at`
2. Modify `messages` table: add `conversation_id` reference, ensure proper indexing
3. Create database utilities in `lib/db.ts`: `createConversation()`, `saveMessage()`, `getConversationHistory()`
4. Update chat route handler to fetch conversation history and inject into Claude context
5. Add session/visitor tracking with browser cookies or query params
6. Create conversation retrieval endpoint `app/api/conversations/[id]/route.ts`
7. Test data persistence: chat → close browser → reopen → messages reappear

#### Demo Expectation
- ✅ Chat with AI → messages stored in Neon
- ✅ Close browser → reopen app → messages still visible
- ✅ Verify rows in `messages` and `conversations` tables in Neon console

---

### **Milestone 4: Contact & Lead Capture (Week 4)**

**Goal:** Transform conversation into stored lead with contact details.

#### Tasks
1. Extend database schema: `visitors` table (`id`, `email`, `name`, `role`, `context`) and `bookings` table
2. Build VisitorCaptureForm component with Shadcn form validation
3. Create visitor capture API endpoint `app/api/visitors/route.ts`
4. Define AI tool for lead capture (prepare for agentic enhancement)
5. Integrate form into chat UI as modal or inline section
6. Create booking request endpoint `app/api/bookings/route.ts`
7. Add BookingForm component with date/time picker and meeting type select
8. Test lead capture flow: chat → form appears → submit → verify in Neon

#### Demo Expectation
- ✅ Chat for 2-3 exchanges → form appears
- ✅ Enter name, email, role, optional context
- ✅ Submit → "Thank you! Reference ID: xyz123"
- ✅ Verify visitor and booking records in Neon

---

### **Milestone 5: Personality & Context Enhancements (Week 5)**

**Goal:** Make Digital Twin behave like you, not a generic bot.

#### Tasks
1. Create professional profile document `docs/PROFILE.md` with skills, experience, availability, communication style
2. Build enhanced system prompt in `lib/systemPrompt.ts` encoding your personality and expertise
3. Implement context injection in chat route: system prompt + conversation history + visitor context
4. Add suggested prompts feature `components/SuggestedPrompts.tsx` with clickable buttons
5. Enhance AI response parsing to extract and display suggested prompts
6. Add proactive engagement prompts for contact form and booking suggestions
7. Test personality authenticity: AI accurately reflects experience and tone

#### Demo Expectation
- ✅ Chat feels conversational and personalized
- ✅ AI introduces itself with your key skills
- ✅ Suggested prompts are relevant and helpful
- ✅ Responses reference actual experience/values
- ✅ Form appears naturally after engagement threshold

---

### **Milestone 6: Tool-Calling & Agentic Logic (Week 6 - Recommended)**

**Goal:** Enable AI to make decisions and trigger actions autonomously.

#### Tasks
1. Define tool schemas in `lib/tools.ts`: `captureVisitor()`, `checkAvailability()`, `createBooking()`, `generateSummary()`
2. Implement tool handlers as Server Actions: `app/actions/captureVisitor.ts`, `checkAvailability.ts`, `createBooking.ts`
3. Update chat route for tool-calling loop: Claude decides which tool → execute → feed result back
4. Create tool execution logger in `lib/toolExecutionLog.ts` for audit trail
5. Add tool result display to chat UI (show actions like "Checking availability...")
6. Test agentic flow: user request → AI decides tool → execute → respond with result

#### Demo Expectation
- ✅ User: "Book me for next Thursday"
- ✅ AI checks availability → creates booking → confirms to user
- ✅ No manual form filling required
- ✅ Booking stored in DB with confirmation

---

### **Milestone 7: Deployment & Real-World Access (Week 7)**

**Goal:** Make Digital Twin publicly accessible.

#### Tasks
1. Prepare for Vercel deployment with production environment variables
2. Connect GitHub repo to Vercel and enable automatic deployments on `main` branch
3. Deploy to Vercel: `vercel deploy --prod`
4. Configure custom domain (optional but recommended)
5. Test production deployment: chat → database writes → API routes functional
6. Create admin panel `app/admin/page.tsx` showing visitors, bookings, conversation metrics
7. Create testing/demo instructions in `docs/TESTING.md`
8. Set up monitoring with Vercel analytics and error logging (Sentry optional)

#### Demo Expectation
- ✅ App deployed and accessible via public URL
- ✅ Database connection works in production
- ✅ Chat functional on deployed instance
- ✅ Lead capture working
- ✅ No secrets exposed in repo or logs

---

### **Milestone 8: Voice Agent (Optional - Week 8+)**

**Goal:** Enable phone-based conversational access (optional but high-impact).

#### Tasks
1. Choose telephony provider: Twilio + Deepgram + ElevenLabs, or OpenAI Realtime API, or Vapi
2. Set up phone number routing and webhook configuration
3. Implement voice endpoint `app/api/voice/route.ts` handling speech-to-text and text-to-speech
4. Reuse chat logic for voice: same Claude agent with tools and database persistence
5. Handle voice-specific considerations: latency, interruption, turn-taking, audio quality
6. Test voice flow: call number → speak to AI → receive spoken response → booking confirmation
7. Verify voice conversation persisted to database with `voice` source tag

#### Demo Expectation
- ✅ Call your phone number
- ✅ Speak to Digital Twin → hear conversational response
- ✅ Ask to book → hear confirmation
- ✅ End call → verify database logs of voice conversation

---

### **Milestone 9: Polish & Launch Quality (Week 9)**

**Goal:** Deliver product-grade experience.

#### Tasks
1. UX refinements: mobile layout, loading states, error messages, confirmation dialogs
2. Accessibility (a11y): ARIA labels, keyboard navigation, WCAG contrast standards
3. Performance optimization: lazy loading, database query optimization, <1s API response times
4. Documentation: README overview, ARCHITECTURE.md, SCHEMA.md, DEPLOYMENT.md, SETUP.md
5. Code quality: TypeScript strict mode, ESLint/Prettier consistency, meaningful commits
6. GitHub polish: clean branch history, correct .gitignore, visible README
7. Analytics dashboard: total visitors, bookings, top questions, export CSV
8. Final testing: production environment, cross-browser compatibility, load testing

#### Demo Expectation
- ✅ Mobile responsive and fast
- ✅ Accessible (keyboard navigation, screen reader friendly)
- ✅ Well-documented architecture
- ✅ Portfolio-grade product quality
- ✅ Analytics showing active engagement
- ✅ Production-ready for public showcase

---

### **Cross-Milestone Integration & Dependencies**

```
M1 (Foundation) 
  ↓
M2 (Chat UI & Agent)
  ↓
M3 (Database Persistence)
  ↓
M4 (Lead Capture)
  ↓
M5 (Personality Enhancement)
  ↓
M6 (Tool-Calling) — Optional but recommended
  ↓
M7 (Deployment)
  ↓
M8 (Voice Agent) — Optional, requires M7
  ↓
M9 (Polish & Launch)
```

### **Key Decisions**
- **M6 (Tool-Calling):** Adds agentic autonomy (recommended for "wow" factor). M4 with manual forms still works for MVP.
- **M8 (Voice):** Optional but impressive. Decide timing: post-MVP or later iteration.
- **Timeline:** Each milestone is ~1 week. Adjust based on your pace. Some milestones (M2, M5) lighter; others (M3, M6) more involved.
- **Testing Strategy:** M1-M3 manual testing. M4+ add integration tests. M7+ test with real traffic.

---

## Current Status

### ✅ Milestone 1: Foundation
- Next.js 16 + TypeScript + Tailwind setup
- Shadcn UI components initialized
- Vercel AI SDK configured
- Environment variables & secrets management
- Database schema designed
- Git repository initialized

### 🚀 Milestone 2: Chat Interface & Agent Wiring (Current)
- ✅ Chat UI with message history
- ✅ Real-time streaming responses
- ✅ AI agent integration (Claude Sonnet)
- ✅ System prompt for personality
- → Next: Complete M3 (Database persistence)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Git
- Neon Postgres account (free: https://neon.tech)
- Anthropic API key (free: https://console.anthropic.com)

### Setup

1. **Clone and install dependencies:**
   ```bash
   cd digital-twin
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   
   Then edit `.env.local` with:
   - `DATABASE_URL` — Your Neon pooled connection string
   - `ANTHROPIC_API_KEY` — Your Claude API key

3. **Start development server:**
   ```bash
   npm run dev
   ```
   
   Visit http://localhost:3000

4. **Test the chat:**
   - Click "Start Chatting" on homepage
   - Try asking about skills, experience, or availability
   - Watch responses stream in real-time

## 📁 Project Structure

```
digital-twin/
├── app/
│   ├── page.tsx              # Landing page with status
│   ├── chat/
│   │   └── page.tsx          # Chat interface
│   └── api/
│       ├── chat/
│       │   └── route.ts      # Chat endpoint (Claude integration)
│       └── test-db/
│           └── route.ts      # Database connection test
├── components/
│   ├── ui/                   # Shadcn UI components
│   └── ChatMessage.tsx       # Message display component
├── lib/
│   ├── db.ts                 # Database utilities
│   ├── env.ts                # Environment validation
│   └── systemPrompt.ts       # AI personality definition
├── .env.local                # Secrets (DO NOT COMMIT)
├── .env.example              # Template (safe to commit)
└── package.json              # Dependencies
```

## 🔧 Environment Variables

**Required:**
- `DATABASE_URL` — Neon Postgres pooled connection string
- `ANTHROPIC_API_KEY` — Claude API key

**Optional:**
- `NEXT_PUBLIC_APP_NAME` — Application display name

See `.env.example` for template.

## 🧪 Testing

### Local Testing
```bash
# Start dev server
npm run dev

# Visit http://localhost:3000
# Click "Start Chatting"
# Send a test message
```

### Test the Database Connection
```bash
# Visit http://localhost:3000/api/test-db
# Should return: { connected: true, timestamp: "...", message: "✅ Database connection successful" }
```
---

**Built with ❤️ as a representation of professional identity and modern AI integration.**

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
