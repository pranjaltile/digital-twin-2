# 🤖 Digital Twin

An AI-powered professional presence that represents you 24/7. Visitors can engage in natural conversation with your Digital Twin via text or voice, learn about your skills and experience, and book meetings—all through an intelligent conversational interface.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwind-css)

## ✨ Features

- **💬 Real-time Chat** — Stream AI responses with natural conversation flow
- **🎤 Voice Mode** — Talk directly using speech recognition & text-to-speech
- **🧠 Context-Aware** — Maintains conversation history for coherent discussions
- **📝 Lead Capture** — Automatically collect visitor contact information
- **📅 Booking System** — Schedule meetings directly through chat
- **📊 Admin Dashboard** — Monitor visitors, conversations, and bookings
- **🌙 Dark Mode** — Beautiful, modern dark UI

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Neon Postgres database (free tier available)
- Groq API key (free tier available)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/digital-twin.git
cd digital-twin

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your Digital Twin!

### Environment Variables

Create a `.env.local` file with:

```env
# Database (Neon Postgres)
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require

# AI Provider (Groq)
GROQ_API_KEY=gsk_your_api_key_here

# Optional
NEXT_PUBLIC_CALENDAR_URL=https://calendly.com/your-link
```

## 🏗️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Language** | TypeScript 5 |
| **UI** | React 19 + Shadcn UI + Tailwind CSS 4 |
| **AI** | Groq API (Llama 3.3 70B) |
| **Database** | Neon Postgres (Serverless) |
| **Voice** | Web Speech API (STT + TTS) |

## 📁 Project Structure

```
digital-twin/
├── app/
│   ├── page.tsx              # Landing page
│   ├── chat/page.tsx         # Chat interface (text + voice)
│   ├── admin/page.tsx        # Admin dashboard
│   ├── api/
│   │   ├── chat/route.ts     # Text chat endpoint
│   │   ├── voice/route.ts    # Voice chat endpoint
│   │   ├── visitors/route.ts # Lead capture
│   │   ├── bookings/route.ts # Booking system
│   │   └── admin/stats/route.ts # Analytics
├── components/
│   ├── ui/                   # Shadcn components
│   ├── ChatMessage.tsx       # Message display
│   ├── VisitorCaptureForm.tsx
│   ├── BookingScheduler.tsx
│   └── SuggestedPrompts.tsx
├── lib/
│   ├── db.ts                 # Database utilities
│   ├── systemPrompt.ts       # AI personality
│   ├── tools.ts              # AI tool definitions
│   └── utils.ts              # Helpers
└── docs/                     # Documentation
```

## 🎯 Usage

### Text Chat
1. Visit `/chat`
2. Type your message and press Enter
3. AI responds in real-time with streaming

### Voice Mode
1. Visit `/chat`
2. Click the **Voice** button in the header
3. Click the mic button and speak
4. AI responds with voice (toggle speaker to mute)

### Admin Dashboard
Visit `/admin` to see:
- Total visitors, conversations, bookings
- Recent visitor list with export to CSV
- Booking status and management

## 🔧 Configuration

### Customize AI Personality

Edit `lib/systemPrompt.ts` to change:
- Name and role
- Skills and experience
- Communication style
- Response behavior

### Database Schema

See `docs/SCHEMA.md` for full database structure:
- `conversations` — Chat sessions
- `messages` — All messages
- `visitors` — Lead information
- `bookings` — Meeting requests

## 📚 Documentation

- [Architecture Overview](docs/ARCHITECTURE.md)
- [Database Schema](docs/SCHEMA.md)
- [Deployment Guide](docs/DEPLOYMENT_GUIDE.md)
- [Setup Instructions](docs/SETUP.md)
- [Testing Guide](docs/TESTING_GUIDE.md)
- [Troubleshooting](docs/TROUBLESHOOTING.md)

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!

```bash
vercel deploy --prod
```

### Environment Variables on Vercel

Set these in your Vercel project settings:
- `DATABASE_URL`
- `GROQ_API_KEY`
- `NEXT_PUBLIC_CALENDAR_URL` (optional)

## 📊 Milestones

| # | Milestone | Status |
|---|-----------|--------|
| 1 | Foundation |  Complete |
| 2 | Chat Interface |  Complete |
| 3 | Database Persistence |  Complete |
| 4 | Lead Capture |  Complete |
| 5 | Personality Enhancement |  Complete |
| 6 | Tool Calling |  Complete |
| 7 | Deployment |  Complete |
| 8 | Voice Agent |  Complete |
| 9 | Polish & Launch |  Complete |

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines first.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

##  Acknowledgments

- [Vercel](https://vercel.com) for hosting
- [Groq](https://groq.com) for fast AI inference
- [Neon](https://neon.tech) for serverless Postgres
- [Shadcn](https://ui.shadcn.com) for beautiful components

---

**Built by Pranjal Tile**
