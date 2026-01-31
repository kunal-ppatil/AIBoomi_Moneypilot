# MoneyPilot Full-Stack Integration - Setup Instructions

## 🚀 Quick Setup Guide

### Step 1: Install Supabase Package

Since PowerShell execution policy is blocking npm, please run this command:

**Option A: Run in Command Prompt (cmd)**
```cmd
cd C:\Users\Kunal\AIBoomi_Moneypilot
npm install @supabase/supabase-js
```

**Option B: Fix PowerShell (Run as Administrator)**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```
Then run:
```powershell
npm install @supabase/supabase-js
```

---

### Step 2: Setup Supabase Database

1. Go to your Supabase project dashboard: https://dewblcsdjdrkusdkeawm.supabase.co

2. Navigate to **SQL Editor** (left sidebar)

3. Click **New Query**

4. Copy and paste the entire contents of `supabase_schema.sql` file

5. Click **Run** to execute the SQL

This will create:
- `financial_plans` table
- `calculation_results` table
- Row Level Security policies
- Indexes for performance

---

### Step 3: Start the Development Server

```bash
npm run dev
```

---

## ✅ What's Been Implemented

### Authentication
- ✅ Supabase Auth integration
- ✅ Login/Signup modals functional
- ✅ Email validation
- ✅ Password strength check (min 6 characters)
- ✅ Session management
- ✅ Protected routes
- ✅ Logout functionality

### Database
- ✅ Supabase PostgreSQL integration
- ✅ User financial plans storage
- ✅ Calculation results storage
- ✅ Row Level Security (users can only access their own data)
- ✅ Automatic data persistence

### AI Features
- ✅ Gemini AI integration with your API key
- ✅ "Learn More" buttons on result cards
- ✅ "Deep Analysis" button
- ✅ 3-Step Action Plan generation
- ✅ Loading states and error handling

### UI/UX
- ✅ Premium fintech design
- ✅ Glassmorphism effects
- ✅ Smooth animations
- ✅ Responsive design

---

## 🔧 Environment Variables

Your `.env` file is configured with:
```
VITE_GEMINI_API_KEY=AIzaSyCHhCMt9D-UdvmU3HDNzmrpSs2OcLndNrg
VITE_SUPABASE_URL=https://dewblcsdjdrkusdkeawm.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**⚠️ IMPORTANT**: Never commit the `.env` file to Git! It's already in `.gitignore`.

---

## 📋 Testing Checklist

After setup, test these flows:

1. **Landing Page**
   - [ ] Click "Sign up" button → Modal opens
   - [ ] Click "Log in" link → Modal opens
   - [ ] Create a new account
   - [ ] Verify redirect to app page

2. **Wizard Flow**
   - [ ] Fill in personal information
   - [ ] Add multiple goals
   - [ ] Select preferences
   - [ ] Click "See My Plan"

3. **Results Page**
   - [ ] View readiness score
   - [ ] Click "Learn More" buttons → AI generates content
   - [ ] Click "Show Deep Analysis" → AI generates analysis
   - [ ] Verify 3-step action plan loads

4. **Data Persistence**
   - [ ] Complete wizard
   - [ ] Logout
   - [ ] Login again
   - [ ] Verify data is still there

5. **Logout**
   - [ ] Click logout button
   - [ ] Verify redirect to landing page
   - [ ] Try accessing /app.html directly → Should redirect to home

---

## 🐛 Troubleshooting

### "Missing environment variables" error
- Make sure `.env` file exists in project root
- Restart the dev server after creating `.env`

### Authentication not working
- Check Supabase dashboard → Authentication → Settings
- Ensure email auth is enabled
- Check browser console for errors

### AI features not working
- Verify Gemini API key is correct
- Check browser console for API errors
- Ensure you have internet connection

### Data not persisting
- Make sure you ran the `supabase_schema.sql` in Supabase SQL Editor
- Check Supabase dashboard → Table Editor to see if tables exist
- Check browser console for database errors

---

## 📁 Project Structure

```
AIBoomi_Moneypilot/
├── .env                    # Environment variables (DO NOT COMMIT)
├── .env.example            # Template for environment variables
├── .gitignore              # Git ignore file
├── supabase_schema.sql     # Database schema
├── src/
│   ├── config/
│   │   └── env.js          # Environment configuration
│   ├── services/
│   │   ├── supabase.js     # Supabase auth & data service
│   │   └── ai.js           # Gemini AI service
│   ├── ui/
│   │   ├── wizard.js       # Wizard interface
│   │   └── results.js      # Results dashboard
│   ├── main.js             # Landing page logic
│   └── app.js              # App page logic
└── ...
```

---

## 🎉 You're All Set!

Once you complete Steps 1-3 above, your MoneyPilot app will be fully functional with:
- User authentication
- Data persistence across sessions
- AI-powered financial insights
- Beautiful premium UI

Enjoy your fully integrated MoneyPilot application! 🚀
