# Troubleshooting: Chat & Dashboard Not Showing

## ✅ Issues Fixed

I've identified and fixed the following issues:

### **1. Chat API Response Format** ✅ FIXED
**Problem:** The chat API was returning plain text instead of proper streaming format
**Solution:** Updated `/api/chat/route.ts` to use Vercel AI SDK's `toDataStreamResponse()` method
**Impact:** Chat responses now stream properly to the frontend

### **2. Chat Hook Initialization** ✅ FIXED
**Problem:** `useChat` hook was initialized with empty `conversationId` and `sessionId`
**Solution:** Moved initialization logic before hook call, ensure session ID exists
**Impact:** Better state management and hook initialization

### **3. Suggested Prompts Auto-Submit** ✅ FIXED
**Problem:** Clicking suggested prompts didn't submit the form
**Solution:** Added auto-submit logic after text input
**Impact:** Suggested prompts now work as expected

### **4. Admin Dashboard** ✅ VERIFIED
**Status:** Admin page structure is correct at `/admin`
**Features:** Stats cards, visitor table, bookings list all implemented

---

## 🧪 How to Test Locally

### **Step 1: Start Development Server**
```powershell
cd c:\Users\Avani\Desktop\DigitalTwin2\digital-twin
npm run dev
```

### **Step 2: Open in Browser**
Navigate to:
- **Chat:** http://localhost:3000/chat
- **Admin:** http://localhost:3000/admin
- **Debug:** http://localhost:3000/debug

### **Step 3: Verify Each Page**

#### **Chat Page (`/chat`)**
- [ ] Welcome message shows: "Welcome to Pranjal's Digital Twin"
- [ ] Suggested prompts display as buttons
- [ ] Input field ready for typing
- [ ] Send button functional
- [ ] Messages appear after clicking suggested prompt

#### **Admin Dashboard (`/admin`)**
- [ ] 4 stats cards visible (Visitors, Conversations, Bookings, Pending)
- [ ] Recent Visitors table shows
- [ ] Recent Bookings section shows
- [ ] Export CSV button present

#### **Debug Page (`/debug`)**
- [ ] Database connection: ✅ OK
- [ ] Chat API: ✅ OK
- [ ] Admin page: ✅ OK
- [ ] Chat page: ✅ OK

---

## 🔍 Common Issues & Solutions

### **Issue: Chat page loads but no responses**

**Diagnosis:**
1. Open browser DevTools (F12)
2. Go to Network tab
3. Type a message in chat
4. Check if `/api/chat` request is made
5. Look at response status and body

**Possible Solutions:**

**A) Missing Environment Variables**
- Check `.env.local` has:
  ```
  POSTGRES_URL=postgresql://...
  ANTHROPIC_API_KEY=sk-ant-api03-...
  NEXT_PUBLIC_APP_NAME=DigitalTwin
  ```
- Restart dev server after adding env vars

**B) Database Connection Failed**
- Visit `/api/test-db` in browser
- Should show: `{ "success": true }`
- If error, check POSTGRES_URL is correct

**C) API Key Invalid**
- Verify ANTHROPIC_API_KEY is correct
- Check it hasn't expired
- Generate new key if needed

**D) Network/CORS Issue**
- Check Network tab for CORS errors
- Verify API route is accessible

---

### **Issue: Admin dashboard doesn't load**

**Diagnosis:**
1. Visit `/admin` directly
2. Check browser console for errors
3. Verify page renders

**Solution:** Admin page should load even without data. If blank page:
- Clear browser cache: Ctrl+Shift+Delete
- Hard refresh: Ctrl+Shift+R
- Restart dev server

---

### **Issue: Suggested prompts don't work**

**Diagnosis:**
1. Click a suggested prompt button
2. Check if text appears in input field
3. Check if form submits

**Solution:**
- Browser might need hard refresh
- Try typing manually and clicking Send
- Check console for JavaScript errors

---

## 📊 Debug Checklist

Run through these in order:

- [ ] **Build succeeds:** `npm run build` completes without errors
- [ ] **Dev server runs:** `npm run dev` starts without errors
- [ ] **App loads:** Can navigate to `/chat` without error
- [ ] **API works:** `/api/test-db` returns `{ "success": true }`
- [ ] **Can type:** Chat input field accepts text
- [ ] **Can submit:** Pressing Enter or clicking Send works
- [ ] **Gets response:** API call completes and response shows
- [ ] **Admin loads:** `/admin` page renders
- [ ] **Dashboard shows:** Stats cards visible on admin page

---

## 🚀 Quick Start Command

Copy and paste this to start fresh:

```powershell
cd c:\Users\Avani\Desktop\DigitalTwin2\digital-twin
npm run build
npm run dev
```

Then open: http://localhost:3000/chat

---

## 📞 Still Having Issues?

Try these in order:

1. **Clear everything:**
   ```powershell
   npm cache clean --force
   rm -r .next
   npm install
   npm run build
   npm run dev
   ```

2. **Check logs:**
   - Terminal output from `npm run dev`
   - Browser DevTools Console (F12)
   - Browser Network tab (see API responses)

3. **Verify database:**
   - Is Neon connection still active?
   - Do you have POSTGRES_URL from Neon?

4. **Verify API key:**
   - Is ANTHROPIC_API_KEY valid?
   - Have you exceeded usage limits?

---

## 📝 Expected Behavior

### **Normal Chat Flow:**
1. ✅ User sees welcome message with suggested prompts
2. ✅ User clicks suggested prompt or types message
3. ✅ Message appears in chat bubble
4. ✅ "Thinking..." spinner shows
5. ✅ AI response streams in
6. ✅ After 2 exchanges, lead capture form appears
7. ✅ Conversation persists on page reload

### **Normal Admin Flow:**
1. ✅ Page loads immediately
2. ✅ Shows 0 visitors/bookings (nothing captured yet)
3. ✅ Tables/cards render correctly

---

## 🎯 Next Steps

After fixing:

1. **Test locally** using the checklist above
2. **Commit changes:** `git add . && git commit -m "Test message"`
3. **Push to GitHub:** `git push origin main`
4. **Deploy to Vercel:** Follow DEPLOYMENT_GUIDE.md
5. **Test in production:** Visit live URL

---

## 💡 Pro Tips

- Use `/debug` page to quickly test all endpoints
- Check browser DevTools Network tab for API issues
- Restart dev server after any env var changes
- Hard refresh browser (Ctrl+Shift+R) to clear cache
- Look at terminal output for backend errors

---

## 📚 Documentation

See also:
- `docs/DEPLOYMENT_GUIDE.md` - For production deployment
- `docs/TESTING_GUIDE.md` - For comprehensive testing
- `docs/MILESTONE_7_SUMMARY.md` - Milestone 7 overview
