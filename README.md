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

## 📋 Project Milestones

### ✅ Milestone 1: Foundation (Complete)
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
- → Next: Test locally, add streaming display

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

## 📊 Current Status

- **Milestone 1**: ✅ Complete
- **Milestone 2**: 🚀 In Progress
- **Overall Progress**: ~22% (2/9 milestones)

### What's Working
- Landing page with status dashboard ✓
- Database connection testing ✓
- Chat UI interface ✓
- Claude Sonnet 4.5 integration ✓
- Real-time streaming responses ✓

### What's Next
- Database persistence (Milestone 3)
- Lead capture forms (Milestone 4)
- Personality enhancements (Milestone 5)
- Tool-calling agentic logic (Milestone 6)
- Production deployment (Milestone 7)

## 🚀 Next Steps

1. ✅ Milestone 1 complete
2. 🚀 Milestone 2 in progress
3. Add your Neon credentials to `.env.local`
4. Add your Anthropic API key to `.env.local`
5. Run `npm run dev` and test the chat
6. Commit and push to GitHub

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
