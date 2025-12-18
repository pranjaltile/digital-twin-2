# Setup Guide

Complete instructions for setting up the Digital Twin project locally.

## Prerequisites

- **Node.js 18+** — [Download](https://nodejs.org)
- **npm 9+** — Included with Node.js
- **Git** — [Download](https://git-scm.com)
- **Code Editor** — VS Code recommended
- **Neon Account** — Free at [neon.tech](https://console.neon.tech)
- **Anthropic API Key** — Free at [console.anthropic.com](https://console.anthropic.com/account/keys)

## Step 1: Clone & Navigate

```bash
# Navigate to project directory
cd C:\Users\Avani\Desktop\DigitalTwin2\digital-twin

# List files to verify structure
ls -la
```

Expected output:
```
app/
components/
lib/
docs/
node_modules/
.env.example
.env.local
README.md
package.json
```

## Step 2: Install Dependencies

```bash
npm install
```

This installs all packages from `package.json`:
- Next.js 16
- React 19
- Shadcn UI
- Vercel AI SDK
- Vercel Postgres
- Date-fns
- Lucide React

**Verify installation:**
```bash
npm list ai @ai-sdk/anthropic @vercel/postgres
```

## Step 3: Get Neon Credentials

### Create Neon Account
1. Visit [https://console.neon.tech](https://console.neon.tech)
2. Sign up with GitHub, Google, or email
3. Create a new project (free tier)

### Get Connection String
1. In Neon console, click your project
2. Go to "Connection string"
3. Select "Node.js" 
4. **IMPORTANT**: Use the **pooled connection** (not direct socket)
5. Copy the full connection string:
   ```
   postgresql://user:password@ep-xxxx.neon.tech/dbname?sslmode=require
   ```

## Step 4: Get Anthropic API Key

### Create API Key
1. Visit [https://console.anthropic.com/account/keys](https://console.anthropic.com/account/keys)
2. Sign up or log in with email
3. Click "Create Key"
4. Copy your API key:
   ```
   sk-ant-v0-xxxxxxxxxxxxx
   ```

## Step 5: Configure Environment Variables

### Edit `.env.local`

```bash
# Open .env.local in your editor
# Windows: code .env.local
# Or open manually in VS Code
```

**Replace with your actual credentials:**

```env
# Database Connection
# Paste your Neon pooled connection string here
DATABASE_URL=postgresql://user:password@ep-xxxx.neon.tech/dbname?sslmode=require

# AI Provider - Claude API Key
ANTHROPIC_API_KEY=sk-ant-v0-xxxxxxxxxxxxx

# Application Settings
NEXT_PUBLIC_APP_NAME=DigitalTwin
```

**Save the file.**

### Verify Configuration

```bash
# Test environment validation
node -e "require('./lib/env.ts')"
```

Should output: `✅ Environment validation passed`

If you see an error, double-check your `.env.local` file.

## Step 6: Start Development Server

```bash
npm run dev
```

**Expected output:**
```
> next dev

▲ Next.js 16.0.0
- Local:        http://localhost:3000
- Environments: .env.local

✓ Ready in 2.3s
```

**Keep this terminal running.**

## Step 7: Test the Application

### Homepage
1. Open [http://localhost:3000](http://localhost:3000)
2. See "Hello, Digital Twin" page with status dashboard
3. Check three system status indicators

### Test Database Connection
1. Click "Check DB Status" button, or
2. Visit [http://localhost:3000/api/test-db](http://localhost:3000/api/test-db)
3. Should see JSON response:
   ```json
   {
     "connected": true,
     "timestamp": "2025-12-18T...",
     "message": "✅ Database connection successful"
   }
   ```

### Test Chat Interface
1. Click "Start Chatting" on homepage
2. You're taken to `/chat` page
3. Try typing: `"What are your main skills?"`
4. Watch AI respond with streaming text
5. Try more prompts:
   - "Tell me about your experience"
   - "Are you open to remote work?"
   - "What's your availability?"

## Step 8: Verify Project Structure

Confirm all key files are present:

```bash
# List main directories
ls -la app/
ls -la components/
ls -la lib/

# Check for created files
ls -la app/api/chat/route.ts
ls -la app/api/test-db/route.ts
ls -la app/chat/page.tsx
ls -la components/ChatMessage.tsx
ls -la lib/db.ts
ls -la lib/env.ts
ls -la lib/systemPrompt.ts
```

## Step 9: Setup Git (Optional but Recommended)

```bash
# Check Git status
git status

# Add all files
git add .

# Create initial commit
git commit -m "Milestone 2: Chat interface & agent wiring"

# Check commit history
git log --oneline
```

## Troubleshooting

### Database Connection Failed
**Error:** `❌ Database connection failed`

**Solution:**
1. Verify `DATABASE_URL` in `.env.local`
2. Check connection string format (should include `?sslmode=require`)
3. Ensure Neon project is active in console
4. Test connection manually:
   ```bash
   psql "your-connection-string"
   ```

### API Key Not Found
**Error:** `Missing AI provider key`

**Solution:**
1. Verify `ANTHROPIC_API_KEY` in `.env.local`
2. Check key format (starts with `sk-ant-`)
3. Ensure no extra spaces in `.env.local`
4. Restart dev server: `npm run dev`

### Chat Not Responding
**Error:** Empty responses or "Thinking..." spinner never stops

**Solution:**
1. Check browser console for errors (F12 → Console)
2. Verify API key in `.env.local`
3. Check network tab in DevTools
4. Restart dev server

### Localhost Port Already in Use
**Error:** `Error: Port 3000 already in use`

**Solution:**
```bash
# Kill process on port 3000
# Windows: 
taskkill /PID $(netstat -ano | findstr :3000 | findstr LISTENING | awk '{print $5}') /F

# Or use different port:
npm run dev -- -p 3001
```

### Module Not Found
**Error:** `Module not found: 'ai/react'`

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run ESLint
npm run lint

# Check TypeScript
npx tsc --noEmit
```

## File Locations Reference

```
/
├── .env.local              ← Your secrets (never commit!)
├── .env.example            ← Safe template
├── README.md               ← Project overview
├── package.json            ← Dependencies
├── next.config.ts          ← Next.js configuration
│
├── app/
│   ├── page.tsx            ← Homepage
│   ├── chat/
│   │   └── page.tsx        ← Chat interface
│   └── api/
│       ├── chat/
│       │   └── route.ts    ← Chat endpoint
│       └── test-db/
│           └── route.ts    ← DB test endpoint
│
├── components/
│   ├── ui/                 ← Shadcn components
│   └── ChatMessage.tsx     ← Message component
│
├── lib/
│   ├── db.ts              ← Database utilities
│   ├── env.ts             ← Environment validation
│   └── systemPrompt.ts    ← AI personality
│
└── docs/
    ├── ARCHITECTURE.md    ← System design
    ├── SETUP.md           ← This file
    └── SCHEMA.md          ← Database schema
```

## Next Steps After Setup

1. **Test thoroughly**: Try different chat prompts
2. **Explore code**: Read through route handlers, components
3. **Understand architecture**: Review `docs/ARCHITECTURE.md`
4. **Commit changes**: Make initial git commit
5. **Plan Milestone 3**: Database persistence setup

## Getting Help

- **Check browser console**: F12 → Console tab for errors
- **Check terminal output**: Look for error messages in dev server
- **Review documentation**: `docs/ARCHITECTURE.md` and `README.md`
- **Test database**: Visit `/api/test-db` endpoint
- **Inspect network**: DevTools → Network tab for API calls

---

**Setup complete! You're ready to chat with your Digital Twin. 🎉**

Next: Milestone 3 - Database Integration & Data Persistence
