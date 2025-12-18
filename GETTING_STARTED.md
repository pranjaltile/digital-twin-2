# Getting Started in 5 Minutes

Fast-track guide to get the Digital Twin running locally.

## 1️⃣ Prerequisites Check

```bash
node --version     # Should be 18+
npm --version      # Should be 9+
git --version      # Should exist
```

## 2️⃣ Navigate to Project

```bash
cd C:\Users\Avani\Desktop\DigitalTwin2\digital-twin
```

## 3️⃣ Install Dependencies

```bash
npm install
```

Takes ~1-2 minutes on first run.

## 4️⃣ Get Your Credentials

### Neon Postgres (2 min)
1. Visit https://console.neon.tech
2. Sign up → Create project (free)
3. Copy **pooled connection string**

### Anthropic API Key (2 min)
1. Visit https://console.anthropic.com/account/keys
2. Sign up → Create API key
3. Copy the key

## 5️⃣ Configure Environment

Open `.env.local` and replace:

```env
DATABASE_URL=postgresql://user:password@ep-xxxx.neon.tech/dbname?sslmode=require
ANTHROPIC_API_KEY=sk-ant-v0-xxxxxxxxxxxxx
```

## 6️⃣ Start Development Server

```bash
npm run dev
```

## 7️⃣ Visit Your App

- **Landing Page**: http://localhost:3000
- **Chat Interface**: http://localhost:3000/chat
- **DB Test**: http://localhost:3000/api/test-db

## 8️⃣ Test Chat

1. Go to http://localhost:3000/chat
2. Type: `"What are your main technical skills?"`
3. Watch AI respond with streaming text
4. Try more questions

## 🎉 Done!

Your Digital Twin is running locally with real-time AI chat.

---

## Troubleshooting

**"Database connection failed"**
- Check DATABASE_URL in .env.local
- Ensure it includes `?sslmode=require`
- Restart: Ctrl+C then `npm run dev`

**"Missing API key"**
- Check ANTHROPIC_API_KEY in .env.local
- Restart dev server

**"Port 3000 already in use"**
- Run on different port: `npm run dev -- -p 3001`

---

## Next Steps

1. ✅ Chat interface is working
2. → **Add Neon credentials** to .env.local
3. → Test database connection at `/api/test-db`
4. → Review `docs/SETUP.md` for deeper setup
5. → Read `docs/ARCHITECTURE.md` to understand system design

---

**Ready? Open http://localhost:3000 and start chatting!** 🚀
