# Milestone 7: Deployment Guide
## Digital Twin — Going Live on Vercel

---

## 📋 Overview

**Goal:** Deploy your personalized Digital Twin to production so anyone can interact with it via a public URL.

**Timeline:** ~20 minutes from start to live  
**Requirements:**
- GitHub account (already have it ✅)
- Vercel account (free tier works)
- Neon Postgres URL (already have it ✅)
- Anthropic API key (already have it ✅)

---

## 🎯 What Gets Deployed

When you deploy to Vercel:
- ✅ Frontend React/Next.js app
- ✅ API routes for chat, database
- ✅ Your personalized system prompt
- ✅ All suggested prompts
- ✅ Admin dashboard
- ✅ Lead capture functionality

**What stays local:**
- ❌ `.env.local` file (you'll set these in Vercel)
- ❌ Local database files

---

## 🚀 Step-by-Step Deployment

### **Phase 1: Verify Code is Ready (5 min)**

1. **Check git status is clean:**
   ```powershell
   cd c:\Users\Avani\Desktop\DigitalTwin2\digital-twin
   git status
   ```
   Should show: `working tree clean`

2. **Verify build works locally:**
   ```powershell
   npm run build
   ```
   Should complete with no errors: ✅ `✓ Next.js telemetry...`

3. **Verify everything is pushed:**
   ```powershell
   git log --oneline -5
   ```
   Should show recent commits

---

### **Phase 2: Create Vercel Project (3 min)**

1. **Go to Vercel:**
   - Visit: https://vercel.com/dashboard
   - Sign in with GitHub if not already
   - Click "New Project" button

2. **Select Repository:**
   - Search for: `DigitalTwin2`
   - Click "Import"

3. **Configure Project:**
   - **Project Name:** `digital-twin` (or your preference)
   - **Framework:** Next.js
   - **Root Directory:** Toggle to `digital-twin/`
   - **Build Command:** Already correct `npm run build`
   - **Output Directory:** `.next`

4. **Click "Create" button**
   - Vercel will now build and deploy
   - This takes 3-5 minutes first time

---

### **Phase 3: Set Environment Variables (5 min)**

While Vercel builds, add your secrets:

1. **Go to Project Settings:**
   - In Vercel dashboard, click your project
   - Go to Settings tab
   - Click "Environment Variables" on left

2. **Add POSTGRES_URL:**
   - **Name:** `POSTGRES_URL`
   - **Value:** `postgresql://...` (copy from `.env.local`)
   - Click "Save"

3. **Add ANTHROPIC_API_KEY:**
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** `sk-ant-api03-...` (copy from `.env.local`)
   - Click "Save"

4. **Add NEXT_PUBLIC_APP_NAME:**
   - **Name:** `NEXT_PUBLIC_APP_NAME`
   - **Value:** `DigitalTwin`
   - Click "Save"

5. **Redeploy to apply env vars:**
   - Go to Deployments tab
   - Click the latest deployment
   - Click "Redeploy"
   - Wait for green checkmark ✅

---

### **Phase 4: Test Production (5 min)**

1. **Get your production URL:**
   - In Vercel dashboard, top of page shows: `https://[project-name].vercel.app`
   - Click to open in new tab

2. **Test homepage:**
   - Should load landing page
   - No errors in console (F12)

3. **Test chat:**
   - Click "Chat" or go to `/chat`
   - See welcome message
   - Send test message: "What is Digital Twin?"
   - Should get personalized response about you

4. **Test database:**
   - Go to `/api/test-db`
   - Should see: `{ "success": true }`

5. **Test admin dashboard:**
   - Go to `/admin`
   - Should load stats page

---

### **Phase 5: Celebrate! 🎉**

Your Digital Twin is now live at: `https://[your-project-name].vercel.app`

Share the link with:
- ✨ Your network on LinkedIn
- 🐦 Twitter/X
- 💼 Potential employers/clients
- 👥 Friends and family

---

## 🔧 Advanced: Custom Domain (Optional)

Want a custom domain like `pranjal.digital`?

1. **In Vercel Project Settings:**
   - Go to "Domains"
   - Click "Add Domain"
   - Enter your domain: `pranjal.digital`

2. **Configure DNS:**
   - Go to your domain registrar
   - Add CNAME record pointing to: `cname.vercel-dns.com`
   - Wait 24-48 hours for propagation

3. **Verify in Vercel:**
   - Should show green checkmark when configured

---

## 📊 Production Monitoring

After deployment, monitor these:

### **Vercel Dashboard**
- Deployments: Watch for green checkmarks
- Function Logs: Any runtime errors?
- Speed Insights: Page load times
- Web Analytics: How many visitors?

### **Neon Dashboard**
- Connection pool status
- Query performance
- Database size

### **Your Application**
- Visit daily first week
- Check chat responses quality
- Monitor visitor feedback
- Review admin dashboard for bookings

---

## 🔄 Making Changes After Deployment

### **Small changes (text, prompts):**
1. Edit files locally
2. Commit: `git add . && git commit -m "Update prompts"`
3. Push: `git push origin main`
4. Vercel auto-deploys in 1-2 minutes

### **Large changes (database schema):**
1. Test locally first
2. Run migrations on production DB
3. Deploy code
4. Verify in production

### **Emergency rollback:**
1. In Vercel Deployments tab
2. Find previous working deployment
3. Click "Redeploy"

---

## 🚨 Troubleshooting

### **Build fails in Vercel?**
1. Click failed deployment to see logs
2. Common issues:
   - Missing env var
   - TypeScript error
   - Missing dependency
3. Fix locally, push, and redeploy

### **Chat doesn't work in production?**
1. Check Vercel function logs for API errors
2. Verify ANTHROPIC_API_KEY is set
3. Check Claude API quota hasn't exceeded

### **Database doesn't connect?**
1. Verify POSTGRES_URL set in Vercel
2. Check Neon connection pool not exhausted
3. Ensure Vercel IPs whitelisted (Neon does this auto)

### **Slow responses?**
1. Check Neon query performance
2. Look for database bottlenecks
3. Enable caching in Next.js routes

---

## 📈 What's Next?

Now that Milestone 7 is complete:

**Optional Enhancements:**
- 📊 Implement real admin dashboard data loading
- 🔔 Add email notifications for new bookings
- 📱 Create mobile app
- 🎤 Add voice interface
- 🤖 Enable full tool-calling for autonomous bookings

**Business Development:**
- Share production link in profile
- Update LinkedIn with "Digital Twin" project
- Write blog post about how it works
- Get feedback from visitors

---

## ✨ Production Checklist

Before sharing publicly:

- [ ] Chat works end-to-end
- [ ] Personalization mentions correct name/role
- [ ] Database saves conversations
- [ ] Admin dashboard accessible at `/admin`
- [ ] No console errors
- [ ] Performance acceptable (< 2s responses)
- [ ] Security headers present
- [ ] Error handling works

---

## 🎓 Learning Resources

**Vercel Docs:**
- https://vercel.com/docs/frameworks/nextjs
- https://vercel.com/docs/edge-network/analytics

**Next.js Deployment:**
- https://nextjs.org/docs/deployment

**Monitoring:**
- https://vercel.com/docs/speed-insights

---

## 📞 Support

**Vercel Support:** https://vercel.com/support  
**Claude Docs:** https://docs.anthropic.com/claude  
**Neon Support:** https://neon.tech/docs

Congratulations on reaching Milestone 7! 🚀
