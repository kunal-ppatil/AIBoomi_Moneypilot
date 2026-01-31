# Debugging Data Save Error

## Quick Diagnostics

### Step 1: Check Browser Console
1. Open http://localhost:3001/app.html
2. Press **F12** to open Developer Tools
3. Go to **Console** tab
4. Try to complete Step 1 of the wizard
5. Look for any red error messages
6. **Copy the exact error message** and share it with me

### Step 2: Check Network Tab
1. In Developer Tools, go to **Network** tab
2. Try to save data again
3. Look for requests to Supabase (will have "supabase" in the URL)
4. Click on the failed request
5. Check the **Response** tab
6. **Copy the error response**

### Step 3: Verify Tables Exist
1. Go to Supabase Dashboard → Table Editor
2. Check if you see:
   - `financial_plans` table
   - `calculation_results` table
3. If tables are missing, re-run the SQL schema

### Step 4: Check RLS Policies
1. Go to Supabase Dashboard → Authentication → Policies
2. Make sure policies exist for both tables
3. Each table should have 4 policies (SELECT, INSERT, UPDATE, DELETE)

---

## Common Issues & Fixes

### Issue 1: "new row violates row-level security policy"
**Fix:** RLS policies not created properly
- Re-run the SQL schema
- Make sure you're logged in when testing

### Issue 2: "relation does not exist"
**Fix:** Tables not created
- Go to Table Editor
- Re-run the SQL schema if tables are missing

### Issue 3: "JWT expired" or "Invalid token"
**Fix:** Session issue
- Logout and login again
- Clear browser cache
- Restart dev server

### Issue 4: Network error / CORS
**Fix:** Supabase URL incorrect
- Check `.env` file has correct URL
- Restart dev server after changing `.env`

---

## Quick Test

Open browser console and run this:
```javascript
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Gemini Key exists:', !!import.meta.env.VITE_GEMINI_API_KEY);
```

This will verify environment variables are loaded.

---

Please share the exact error message from the console and I'll fix it immediately!
