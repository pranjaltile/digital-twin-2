# Milestone 7: Testing Guide
## Digital Twin — Production Readiness

---

## ✅ Pre-Deployment Checklist

Before deploying to production, verify all the following:

### 1. **Code Quality**
- [ ] All TypeScript compilation errors resolved: `npm run build`
- [ ] No console warnings or errors
- [ ] ESLint passes: `npm run lint`
- [ ] Git repository is clean: `git status` shows no uncommitted changes
- [ ] Latest changes pushed to GitHub: `git push origin main`

### 2. **Environment Variables**
- [ ] `.env.local` contains:
  - [ ] `POSTGRES_URL` (Neon connection string)
  - [ ] `ANTHROPIC_API_KEY` (Claude API key)
  - [ ] `NEXT_PUBLIC_APP_NAME=DigitalTwin`
- [ ] Vercel project dashboard has same variables set under Settings → Environment Variables

### 3. **Database**
- [ ] Neon Postgres database is accessible
- [ ] All tables created: `conversations`, `messages`, `visitors`, `bookings`, `tool_calls`
- [ ] Database test passes: `curl http://localhost:3000/api/test-db` returns `{ "success": true }`

### 4. **Chat Interface**
- [ ] Homepage loads at `/`
- [ ] Chat page loads at `/chat` with welcome message
- [ ] Suggested prompts display correctly
- [ ] Chat sends messages and receives responses
- [ ] Conversations persist in database

### 5. **API Endpoints**
- [ ] `POST /api/chat` accepts messages and returns streaming responses
- [ ] `GET /api/test-db` returns database connection status
- [ ] Responses include proper headers and error handling

### 6. **AI Personalization**
- [ ] System prompt includes Pranjal's profile information
- [ ] Claude responds with contextual knowledge about:
  - [ ] Background as Full-Stack Developer Intern @ Ausbiz
  - [ ] NLP-Chatbot project
  - [ ] SUNHACK 2024 experience
  - [ ] NPTEL Design Thinking certification
  - [ ] Tech skills and interests

### 7. **Lead Capture**
- [ ] After 2 exchanges, user can provide name and email
- [ ] Visitor data stores in database
- [ ] Visitor ID returned correctly

### 8. **GitHub Repository**
- [ ] Repository is public
- [ ] All commits pushed to `main` branch
- [ ] Repository accessible at: `https://github.com/[your-username]/DigitalTwin2`

---

## 🧪 Test Scenarios

### **Scenario 1: Welcome & Suggested Prompts**
**Steps:**
1. Visit `/chat`
2. See welcome message: "Welcome to Pranjal's Digital Twin"
3. See 6 suggested prompts displayed as buttons

**Expected Result:** ✅ Welcome rendered, prompts clickable

---

### **Scenario 2: Simple Chat**
**Test Message:** "What are you?"

**Expected Response:**
- Should mention Pranjal's role as Full-Stack Developer Intern
- Should reference AI/ML expertise
- Should include friendly, professional tone

**Success Criteria:**
- ✅ Response contains personalization
- ✅ Message saves to database
- ✅ Conversation ID maintains across messages
- ✅ Response streams smoothly

---

### **Scenario 3: Project Questions**
**Test Message:** "Tell me about your NLP-Chatbot project"

**Expected Response:**
- Should describe HealthTech clinical search application
- Should mention technical details (NLP, backend features)
- Should explain business impact

**Success Criteria:**
- ✅ Specific project details included
- ✅ Professional but friendly tone
- ✅ Demonstrates deep knowledge

---

### **Scenario 4: Lead Capture**
**Steps:**
1. Exchange 2 messages in chat
2. Look for lead capture prompt
3. Enter: Name = "John Doe", Email = "john@example.com"
4. Select Role = "Software Engineer"

**Expected Result:**
- ✅ Visitor record created in database
- ✅ Lead capture form closes
- ✅ Conversation continues

**Verification:**
```sql
SELECT * FROM visitors WHERE email = 'john@example.com';
```

---

### **Scenario 5: Conversation Persistence**
**Steps:**
1. Start chat with message "Hello"
2. Note the Conversation ID (in browser devtools)
3. Refresh page
4. Return to same conversation ID

**Expected Result:**
- ✅ Previous messages load
- ✅ Full conversation history visible

---

### **Scenario 6: Admin Dashboard**
**Steps:**
1. Visit `/admin`
2. Check dashboard displays

**Expected Result:**
- ✅ Stats show (Visitors, Conversations, Bookings)
- ✅ Recent visitors table visible
- ✅ Recent bookings section visible

---

## 🚀 Production Deployment Steps

### **Step 1: Vercel Account Setup**
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub account
3. Authorize Vercel to access your GitHub repositories

### **Step 2: Connect Repository**
1. In Vercel dashboard, click "New Project"
2. Select your GitHub repository: `DigitalTwin2`
3. Configure project:
   - **Framework Preset:** Next.js
   - **Root Directory:** `digital-twin/`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`

### **Step 3: Environment Variables**
In Vercel Project Settings → Environment Variables, add:
```
POSTGRES_URL=postgresql://...neon.tech...
ANTHROPIC_API_KEY=sk-ant-api03-...
NEXT_PUBLIC_APP_NAME=DigitalTwin
```

### **Step 4: Deploy**
1. Click "Deploy"
2. Wait for build to complete (~3-5 minutes)
3. Get production URL: `https://your-project-name.vercel.app`

### **Step 5: Verify Production**
1. Visit production URL
2. Run all test scenarios above
3. Check database connections
4. Verify env vars loading correctly

---

## 📊 Monitoring & Logging

### **Vercel Logs**
- View in Vercel dashboard under: **Deployments → Recent → Logs**
- Check for any runtime errors or warnings

### **Database Monitoring**
- Neon dashboard shows query analytics
- Check connection pool status
- Monitor for slow queries

### **Error Tracking**
- Set up Sentry.io for error tracking (optional):
  ```bash
  npm install @sentry/nextjs
  ```

---

## 🔒 Security Checklist

- [ ] API keys never committed to Git
- [ ] `.env.local` added to `.gitignore`
- [ ] Database connection uses pooling
- [ ] CORS properly configured (if needed)
- [ ] API routes validate input
- [ ] No sensitive data in logs
- [ ] Database backups enabled (Neon)

---

## 📝 Performance Benchmarks

After deploying, target these metrics:

| Metric | Target | Check |
|--------|--------|-------|
| Chat Response Time | < 2s | Monitor in Vercel Analytics |
| Database Query Time | < 100ms | Neon dashboard |
| Page Load Time | < 2s | Vercel Speed Insights |
| API Uptime | > 99.9% | Vercel dashboard |

---

## 🐛 Troubleshooting

### **Chat not working in production?**
1. Check `ANTHROPIC_API_KEY` is set in Vercel
2. Verify API key is still valid
3. Check Vercel function logs for errors

### **Database not connecting?**
1. Verify `POSTGRES_URL` in Vercel settings
2. Check Neon connection limits not exceeded
3. Ensure IP whitelisting allows Vercel IPs

### **Slow responses?**
1. Check Neon query performance
2. Look for N+1 queries in database
3. Enable caching where possible

### **Build failing?**
1. Run `npm run build` locally to reproduce
2. Check Node version matches (18+)
3. Verify all env vars present

---

## ✨ Next Steps After Deployment

1. **Monitor production** for 24-48 hours
2. **Share the link** with friends/colleagues for feedback
3. **Add custom domain** (optional)
4. **Set up email notifications** for booking leads
5. **Collect analytics** on visitor interactions
6. **Iterate** based on feedback

---

## 📞 Support

**Vercel Docs:** https://vercel.com/docs  
**Next.js Docs:** https://nextjs.org/docs  
**Claude API Docs:** https://docs.anthropic.com  
**Neon Docs:** https://neon.tech/docs
