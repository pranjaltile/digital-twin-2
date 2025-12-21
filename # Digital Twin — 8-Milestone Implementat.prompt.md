# Digital Twin — 8-Milestone Implementation Roadmap

**Overview:** Transform 8 sequential milestones into a deployed, production-ready conversational AI system. Each milestone builds on previous work, integrating frontend, AI, backend, and database layers. Success criteria and demo expectations are explicit for each milestone.

---

## **Milestone 1: Project Setup & Foundation (Week 1)**

**Goal:** Establish clean, operational development foundation.

### Tasks
1. **Initialize Next.js 16 project** with TypeScript, Tailwind CSS, App Router
   - Run: `npx create-next-app@latest` with flags: `--typescript --tailwind --eslint --app --import-alias "@/*"`
   
2. **Install and configure Shadcn UI** for consistent design system
   - Run: `npx shadcn-ui@latest init` (choose default style)
   - Add components: `button`, `card`, `input`, `textarea`, `scroll-area`
   
3. **Install Vercel AI SDK v6** with provider
   - Run: `npm install ai @ai-sdk/anthropic` (Claude Sonnet 4.5)
   - Alternatively: `npm install ai @ai-sdk/openai` for OpenAI
   
4. **Provision Neon Postgres database**
   - Create account at neon.tech → new free project
   - Retrieve connection string (copy pooled URL for serverless)
   
5. **Install Vercel Postgres client**
   - Run: `npm install @vercel/postgres`
   
6. **Configure environment variables**
   - Create `.env.local` with: `DATABASE_URL`, `ANTHROPIC_API_KEY`
   - Create `.env.example` with placeholders (safe for GitHub)
   - Add environment validation in `lib/env.ts`
   
7. **Initialize database schema**
   - Create minimal schema in Neon: `projects`, `conversations`, `messages` tables
   - Run schema SQL via Neon console
   - Test connection via API endpoint
   
8. **Set up Git and branching strategy**
   - Initialize git: `git init`
   - Create `.gitignore` (ignore `.env.local`, `node_modules/`, `.next/`)
   - Establish branch naming: `main` (production) → `develop` (staging) → `feature/*` (development)
   
9. **Create base page and test connection**
   - Build `app/page.tsx`: "Hello, Digital Twin" landing page
   - Build `app/api/test-db/route.ts`: Database connection test endpoint
   - Add UI component `components/ui/ConnectionStatus.tsx` to display DB status

### Demo Expectation
- App runs on `localhost:3000` → displays "Hello, Digital Twin"
- Visiting `/api/test-db` returns `{ connected: true }` with timestamp from database
- GitHub repo has clean commit history with no secrets exposed
- `.env.example` is accurate and in repository

### Success Criteria
- ✅ Next.js 16 boots successfully
- ✅ Shadcn UI installed and components available
- ✅ Vercel AI SDK installed
- ✅ Neon Postgres connection verified
- ✅ Environment variables properly configured
- ✅ Database schema initialized
- ✅ First commit pushed to GitHub

---

## **Milestone 2: Chat Interface & Agent Wiring (Week 2)**

**Goal:** Enable real-time conversation using AI agent → backend → UI.

### Tasks
1. **Design chat UI layout** in `app/chat/page.tsx`
   - Build using Shadcn components: `card`, `input`, `button`, `scroll-area`
   - Layout: message history (scrollable), user input field, send button, loading indicator
   - Mobile responsive using Tailwind CSS

2. **Create ChatMessage component** `components/ChatMessage.tsx`
   - Render individual messages with role indicator (user/assistant) + avatar + timestamp
   - Use Shadcn `Card` + `Avatar` for polish

3. **Build chat route handler** `app/api/chat/route.ts`
   - POST endpoint receives: `{ messages: Message[] }`
   - Initialize `generateText()` from Vercel AI SDK with Claude Sonnet 4.5
   - System prompt: Basic introduction (will expand in Milestone 5)
   - Return streaming response

4. **Implement `useChat` hook integration** in `app/chat/page.tsx`
   - Use Vercel AI SDK's `useChat()` hook for client-side chat management
   - Automatically handles streaming, message appending, error states
   - Alternative: Manual `fetch` + stream reading if custom control needed

5. **Add loading and error states**
   - Show spinner while AI is responding
   - Display error toast if API call fails (use Shadcn toast)
   - Auto-scroll to latest message in chat history

6. **Test end-to-end chat flow**
   - User types message → sent to `/api/chat`
   - Claude responds → displayed in UI in real-time
   - Messages appear with correct role indicators

### Integration Points
- Frontend calls `app/api/chat/route.ts` (no database write yet)
- AI SDK calls Claude model with simple system prompt
- Response streams to client via `useChat()` hook

### Demo Expectation
- Chat page loads at `/chat`
- Type message → AI responds in real-time with streaming text
- UI updates instantly; no page reloads
- Basic personality evident (friendly greeting, professional tone)

### Success Criteria
- ✅ Chat UI displays correctly
- ✅ Messages stream in real-time
- ✅ Error handling working
- ✅ Responsive on mobile and desktop
- ✅ No database writes yet (temporary in-memory state)

---

## **Milestone 3: Database Integration & Data Persistence (Week 3)**

**Goal:** Ensure real interactions are captured and retrievable.

### Tasks
1. **Expand database schema** in Neon
   - Add `conversations` table: `id`, `visitor_session_id`, `created_at`, `updated_at`
   - Modify `messages` table: add `conversation_id` reference, ensure `role`, `content`, `created_at` indexed
   - Add indexes for query performance

2. **Create database utilities** `lib/db.ts`
   - Function: `createConversation()` → INSERT new conversation, return `conversation_id`
   - Function: `saveMessage(conversation_id, role, content)` → INSERT message
   - Function: `getConversationHistory(conversation_id)` → SELECT messages ordered by timestamp
   - All functions use `@vercel/postgres` SQL client with error handling

3. **Update chat route handler** `app/api/chat/route.ts`
   - Extract or create `conversation_id` from query params or session
   - Before calling Claude, fetch conversation history via `getConversationHistory()`
   - Inject full message history into `generateText()` call
   - After response generated, call `saveMessage()` to store both user and assistant message

4. **Add session/visitor tracking**
   - Generate or retrieve `visitor_session_id` (use browser cookies or query params for now)
   - Store in chat component state or URL
   - Pass to `/api/chat` endpoint

5. **Create conversation retrieval endpoint** `app/api/conversations/[id]/route.ts`
   - GET `/api/conversations/{conversation_id}` → returns full chat history
   - Used for page reload/recovery

6. **Test data persistence**
   - Chat with AI → messages stored in DB
   - Reload page → messages reappear
   - Open Neon console → check for stored rows

### Integration Points
- Chat page creates/retrieves `conversation_id` on mount
- `/api/chat` route fetches history from DB, injects into Claude context
- After each response, messages persisted to Neon
- Reload page → database supplies message history

### Demo Expectation
- Chat with AI → close browser
- Reopen app → messages still visible
- Open Neon console → see rows in `messages` and `conversations` tables
- Show timestamp progression

### Success Criteria
- ✅ Messages persisted to Neon
- ✅ Conversation history retrieved and displayed on reload
- ✅ Visitor session tracking working
- ✅ Database queries optimized with indexes
- ✅ No data loss or corruption

---

## **Milestone 4: Contact & Lead Capture (Conversion Actions) (Week 4)**

**Goal:** Transform conversation into stored lead with contact details.

### Tasks
1. **Extend database schema** in Neon
   - Create `visitors` table: `id`, `email`, `name`, `role` (recruiter/hiring_manager/other), `context`, `created_at`
   - Create `bookings` table: `id`, `visitor_id`, `requested_datetime`, `meeting_type`, `notes`, `status`, `created_at`

2. **Build visitor capture form component** `components/VisitorCaptureForm.tsx`
   - Shadcn form with fields: name (text), email (email), role (select), context (textarea)
   - Validation: email format, name not empty
   - Submit button
   - Success state: confirmation message + reference ID

3. **Create visitor capture API endpoint** `app/api/visitors/route.ts`
   - POST: accepts `{ email, name, role, context, conversation_id }`
   - INSERT into `visitors` table
   - Link `conversation_id` to `visitor_id`
   - Return: `{ visitor_id, message: "Captured successfully" }`

4. **Add AI tool for lead capture** (prepare for Milestone 5 agentic enhancement)
   - Define tool in chat route: `captureVisitorTool({ name, email, role, context })`
   - Tool calls POST `/api/visitors`
   - Placeholder: AI decides when to offer form (will be agentic in M5)

5. **Integrate form into chat UI** `app/chat/page.tsx`
   - Display form as modal or inline section after 2-3 messages
   - Or: AI agent suggests form via button in chat
   - On submit: save to DB, show confirmation in chat

6. **Create booking request endpoint** `app/api/bookings/route.ts`
   - POST: accepts `{ visitor_id, datetime, meeting_type, notes }`
   - INSERT into `bookings` table
   - Return: `{ booking_id, confirmation_message }`

7. **Add booking UI** `components/BookingForm.tsx`
   - Date/time picker (Shadcn Popover + Calendar)
   - Meeting type select (30 min call, technical discussion, etc.)
   - Optional notes textarea
   - Submit and confirmation

8. **Test lead capture flow**
   - Chat → form appears → fill form → submit
   - Check Neon: visitor stored with email, name, role
   - Check booking stored if requested
   - Show confirmation message

### Integration Points
- Chat UI conditionally renders `VisitorCaptureForm` after engagement threshold
- Form submits to `app/api/visitors/route.ts` and `app/api/bookings/route.ts`
- AI agent (future M5) will suggest form proactively

### Demo Expectation
- Chat for 2-3 exchanges → form appears
- Enter: name, email, role, optional context
- Submit → "Thank you! Reference ID: xyz123"
- Open Neon → verify visitor and booking records

### Success Criteria
- ✅ Visitor contact captured and stored
- ✅ Booking request tracked
- ✅ Form validation working
- ✅ Confirmation shown to user
- ✅ Email format validated

---

## **Milestone 5: Personality & Context Enhancements (Week 5)**

**Goal:** Make Digital Twin behave like you, not a generic bot.

### Tasks
1. **Create professional profile document** `docs/PROFILE.md`
   - Your skills (technologies, methodologies, domains)
   - Experience summary (years, roles, notable projects)
   - Availability and work preferences (remote, contract, full-time, etc.)
   - Unique strengths and differentiators
   - Communication style guide (tone descriptors: confident, friendly, technical, etc.)

2. **Build enhanced system prompt** `lib/systemPrompt.ts`
   - Encode: name, skills, experience, availability
   - Tone: your communication style
   - Rules: when to suggest booking, when to ask for contact, what topics to avoid
   - Instructions for suggesting follow-up prompts
   - Example format:
   ```
   You are [Your Name], a [role] with [X years] experience in [domains].
   Your strengths: [skills]. You prefer [work style].
   Communicate with [tone descriptors].
   After each response, suggest 2-3 relevant follow-up questions.
   If user expresses interest, offer to capture contact details.
   ```

3. **Implement context injection** `app/api/chat/route.ts`
   - Inject system prompt from `lib/systemPrompt.ts`
   - Include retrieved conversation history
   - If visitor already captured: inject their role + interest level

4. **Add suggested prompts feature** `components/SuggestedPrompts.tsx`
   - After each AI response, parse suggested prompts from response (or explicit tool output in M6)
   - Display 2-4 clickable buttons below chat
   - On click: send prompt as user message

5. **Enhance AI response parsing**
   - Extract suggested prompts from assistant response
   - Mark prompts in response with `[SUGGESTED: ...]` tags, then parse
   - Or: Use Vercel AI SDK structured output in M6 for cleaner separation

6. **Add proactive engagement prompts**
   - AI suggests contact form at right moment (e.g., after establishing genuine interest)
   - AI suggests booking if visitor mentions scheduling intent

7. **Test personality authenticity**
   - Chat about your strengths → AI accurately reflects your experience
   - Suggested prompts feel natural and relevant
   - Tone matches your communication style

### Integration Points
- System prompt injected into `app/api/chat/route.ts`
- Conversation history provides context
- Visitor role (if captured) shapes response style

### Demo Expectation
- Chat feels conversational and personalized
- AI introduces itself confidently with your key skills
- Suggested prompts are relevant and helpful
- Responses reference your actual experience/values
- Form appears naturally after a few exchanges

### Success Criteria
- ✅ Responses feel authentic to you
- ✅ Suggested prompts are contextual
- ✅ No generic or robotic phrasing
- ✅ AI correctly highlights your strengths
- ✅ Tone consistent with your style

---

## **Milestone 6: Tool-Calling & Agentic Logic (Week 6 - Optional but Recommended)**

**Goal:** Enable AI to make decisions and trigger actions autonomously.

### Tasks
1. **Define tool schemas** `lib/tools.ts`
   - Tool 1: `captureVisitor(name, email, role, context)` → stores visitor, returns visitor_id
   - Tool 2: `checkAvailability(date, time_slot)` → queries existing bookings, returns availability
   - Tool 3: `createBooking(visitor_id, datetime, meeting_type)` → inserts booking, returns confirmation
   - Tool 4: `generateSummary(conversation_id)` → composes conversation summary via Claude

2. **Implement tool handlers** (Server Actions)
   - Create `app/actions/captureVisitor.ts`
   - Create `app/actions/checkAvailability.ts`
   - Create `app/actions/createBooking.ts`
   - Create `app/actions/generateSummary.ts`
   - Each handler: validates input, queries/writes DB, returns result

3. **Update chat route for tool-calling** `app/api/chat/route.ts`
   - Switch from `generateText()` to `generateText()` with `tools` array
   - Implement tool-calling loop: Claude decides which tool → execute → feed result back
   - Continue looping until Claude generates final response (no more tool calls)

4. **Create tool execution logger** `lib/toolExecutionLog.ts`
   - Log each tool call: name, input, output, status, timestamp
   - Store in `tool_calls` table for audit trail

5. **Add tool result display to chat UI**
   - Show tool calls in chat (e.g., "Checking availability...")
   - Display results inline (e.g., "Available times: Thu 2pm, Fri 10am")
   - Or: Hide tool calls and show only final response (depends on UX preference)

6. **Test agentic flow**
   - User: "Book me for next Thursday"
   - AI decides: calls `checkAvailability()`
   - AI receives: available times
   - AI decides: calls `createBooking()` if visitor already captured, or asks for details first
   - AI responds: "Booked for Thursday 2pm! Confirmation sent."

### Integration Points
- Vercel AI SDK tool-calling loop orchestrates Claude + tools
- Tools call Server Actions which interact with Neon DB
- Tool results fed back into Claude context
- Chat UI displays final response (and optionally tool steps)

### Demo Expectation
- User: "Can you book me for Thursday?"
- AI understands intent → checks availability → creates booking → confirms to user
- No manual form filling required (still available if user prefers)
- Booking stored in DB

### Success Criteria
- ✅ Tool-calling loop working
- ✅ Multiple sequential tools executed correctly
- ✅ Tools return accurate results
- ✅ Agentic reasoning visible and sensible
- ✅ All actions logged for audit

---

## **Milestone 7: Deployment & Real-World Access (Week 7)**

**Goal:** Make Digital Twin publicly accessible.

### Tasks
1. **Prepare for Vercel deployment**
   - Ensure all environment variables configured in Vercel project dashboard
   - Set `DATABASE_URL` and `ANTHROPIC_API_KEY` (or `OPENAI_API_KEY`)
   - Test locally with production-like env vars

2. **Deploy to Vercel**
   - Connect GitHub repo to Vercel
   - Enable automatic deployments on `main` branch push
   - Deploy: `vercel deploy --prod`

3. **Configure custom domain** (optional but recommended)
   - Purchase domain (or use free subdomain from Vercel)
   - Update DNS records (if custom domain)
   - Verify SSL certificate active

4. **Test production deployment**
   - Visit deployed URL
   - Test chat → database writes
   - Check Neon connection works (test endpoint should still work)
   - Verify all API routes functional

5. **Create admin panel** `app/admin/page.ts` (optional but useful)
   - Lightweight view showing:
     - Recent visitors: name, email, date
     - Bookings received: date, meeting type
     - Conversation count
   - Protectable with basic auth or skip for now

6. **Create testing/demo instructions** `docs/TESTING.md`
   - Clear steps for external testers to interact with your Twin
   - Example prompts to try
   - Expected behavior descriptions
   - Links to live deployment

7. **Add monitoring and logging** (optional)
   - Set up Vercel analytics
   - Log errors to external service (e.g., Sentry) if desired
   - Monitor database query performance

### Integration Points
- Vercel Functions handle all API routes
- Neon Postgres connection works from Vercel edge
- All secrets in Vercel environment

### Demo Expectation
- Share public URL with stakeholders
- They can chat with your Digital Twin without localhost
- Visitor data captured to database
- You can review interactions

### Success Criteria
- ✅ App deployed and accessible via URL
- ✅ Database connection works in production
- ✅ Chat functional on deployed instance
- ✅ Lead capture working
- ✅ No secrets exposed in repo or logs

---

## **Milestone 8: Voice Agent (Optional - Week 8+)**

**Goal:** Enable phone-based conversational access (optional but high-impact).

### Tasks
1. **Choose telephony provider**
   - Option A: Twilio (phone number routing) + Deepgram (STT) + ElevenLabs (TTS)
   - Option B: OpenAI Realtime API (all-in-one for voice)
   - Option C: Vapi (managed voice platform)

2. **Set up phone number routing**
   - Twilio: purchase number, configure webhook to your backend
   - Or: OpenAI Realtime: configure endpoint for voice calls

3. **Implement voice endpoint** `app/api/voice/route.ts`
   - Receives incoming call or voice stream
   - Manages speech-to-text transcription
   - Calls same chat logic as text interface
   - Returns text-to-speech audio response

4. **Reuse chat logic** `app/api/voice/route.ts`
   - Call same Claude agent with tools
   - Use same database queries for context
   - Store voice conversation in DB (same `conversations` and `messages` tables)
   - Mark message source: `voice` vs `text`

5. **Handle voice-specific considerations**
   - Latency: minimize round-trip time for responsiveness
   - Interruption: allow caller to interrupt AI mid-speech
   - Turn-taking: detect when caller finishes speaking (silence detection)
   - Audio quality: ensure TTS sounds professional

6. **Test voice flow**
   - Call your phone number
   - Greet voice AI
   - Ask questions → receive spoken responses
   - Request booking → spoken confirmation
   - Hang up → verify call logged in database

### Integration Points
- Voice endpoint routes to same chat logic
- Same database schema (conversations, messages, bookings, visitors)
- Same AI agent + tools
- Voice calls appear in admin dashboard alongside text chats

### Demo Expectation
- Call your number → speak to Digital Twin
- Hear conversational response
- Ask to book → hear confirmation
- End call → show database logs of voice conversation

### Success Criteria
- ✅ Phone number accessible
- ✅ Voice transcription accurate
- ✅ Speech-to-text responsive
- ✅ Text-to-speech natural-sounding
- ✅ Conversation persisted to DB
- ✅ Same tools work via voice

---

## **Milestone 9: Polish & Launch Quality (Week 9)**

**Goal:** Deliver product-grade experience.

### Tasks
1. **UX refinements**
   - Mobile layout testing (chat responsive on phone)
   - Loading states clear and visible
   - Error messages helpful and actionable
   - Confirm/cancel actions on destructive operations

2. **Accessibility (a11y)**
   - ARIA labels on form inputs
   - Keyboard navigation working (tab through chat, forms)
   - Color contrast meets WCAG standards
   - Screen reader friendly (test with browser extensions)

3. **Performance optimization**
   - Chat page lazy-loads non-critical components
   - Database queries optimized (indexes in place)
   - API response times < 1s for typical queries
   - Streaming responses feel instant

4. **Documentation**
   - `README.md`: Project overview, tech stack, quick start
   - `docs/ARCHITECTURE.md`: System design, layers, data flow diagram
   - `docs/SCHEMA.md`: Database schema with table descriptions
   - `docs/DEPLOYMENT.md`: How to deploy your own instance
   - `docs/SETUP.md`: Local development setup instructions

5. **Code quality**
   - TypeScript strict mode enabled
   - No console warnings/errors on clean deploy
   - Consistent code style (Prettier + ESLint)
   - Meaningful commit messages

6. **GitHub repository polish**
   - Clean branch history (main branch deployment-ready)
   - `.gitignore` correct (no .env.local, node_modules, etc.)
   - README visible and helpful on GitHub landing
   - Releases/tags marked for major milestones

7. **Analytics & monitoring dashboard** `app/admin/page.tsx`
   - Display: total visitors, bookings this month, top questions asked
   - Simple bar charts or metrics
   - Export data to CSV option (optional)

### Integration Points
- All layers (frontend, AI, backend, database) working cohesively
- Deployment pipeline stable
- Monitoring in place

### Demo Expectation
- Portfolio-grade product
- Can be shown confidently to recruiters or employers
- Professional appearance and performance
- Clear documentation for understanding architecture
- Analytics showing active engagement

### Success Criteria
- ✅ Mobile responsive
- ✅ Fast and responsive
- ✅ Accessible (basic a11y)
- ✅ Well documented
- ✅ Clean, production-ready code
- ✅ Ready for public portfolio showcase

---

## **Cross-Milestone Integration & Dependencies**

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

**Key Integration Points:**
- M1 ← Foundation for everything
- M2 builds on M1 (chat UI uses Shadcn, AI SDK)
- M3 builds on M2 (chat route now writes to DB)
- M4 builds on M3 (visitor table + booking storage)
- M5 builds on M4 (enhanced prompts use visitor context)
- M6 builds on M5 (tools call M4 actions)
- M7: Deploy all M1-M6
- M8: Optional enhancement to M7
- M9: Polish all layers

---

## **Further Considerations**

1. **Timeline Flexibility**: Each milestone is 1 week; adjust based on your pace. Some milestones (M2, M5) are lighter; others (M3, M6) are more involved.

2. **Branching Strategy**: 
   - `main`: production-ready code (deploy from here)
   - `develop`: integration branch for features
   - `feature/m2-chat-ui`, `feature/m3-db-persistence`: specific milestone branches
   - Merge via pull request with code review

3. **M6 Decision**: Tool-calling adds agentic autonomy (recommended for "wow" factor). M4 with manual forms still works well for MVP. Decide before M6.

4. **M8 Decision**: Voice is optional but impressive. Decide timing: post-MVP or later iteration. Don't let it block M7 deployment.

5. **Testing Strategy**: 
   - M1-M3: Manual testing in browser
   - M4+: Add simple integration tests (test API endpoints, DB writes)
   - M7+: Test production deployment with real traffic

6. **Iteration**: After each milestone, gather feedback (from yourself or early testers). Refine before moving to next milestone.
