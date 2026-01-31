# 🚀 GitHub Deployment Guide for MoneyPilot

This guide will walk you through pushing your MoneyPilot application to GitHub.

## 📋 Prerequisites

1. **GitHub Account**: Create one at https://github.com if you don't have one
2. **Git Installed**: Check by running `git --version` in terminal
3. **GitHub CLI (Optional)**: For easier authentication

---

## 🎯 Step-by-Step Guide

### Step 1: Initialize Git Repository

Open terminal in your project directory and run:

```bash
cd c:\Users\Kunal\AIBoomi_Moneypilot
git init
```

### Step 2: Configure Git (First Time Only)

If you haven't configured Git before:

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Step 3: Add All Files

```bash
git add .
```

This stages all files for commit. The `.gitignore` file will automatically exclude:
- `.env` (your secrets)
- `node_modules/`
- `dist/`
- Other build artifacts

### Step 4: Create Initial Commit

```bash
git commit -m "Initial commit: MoneyPilot AI-powered investment planning platform"
```

### Step 5: Create GitHub Repository

**Option A: Using GitHub Website**
1. Go to https://github.com/new
2. Repository name: `moneypilot` (or your preferred name)
3. Description: "AI-powered investment planning platform with Supabase and Gemini AI"
4. Choose **Public** or **Private**
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

**Option B: Using GitHub CLI** (if installed)
```bash
gh repo create moneypilot --public --source=. --remote=origin
```

### Step 6: Connect Local Repository to GitHub

After creating the repository on GitHub, you'll see commands like:

```bash
git remote add origin https://github.com/YOUR_USERNAME/moneypilot.git
git branch -M main
git push -u origin main
```

**Replace `YOUR_USERNAME` with your actual GitHub username!**

### Step 7: Push Your Code

```bash
git push -u origin main
```

You may be prompted to authenticate:
- **Username**: Your GitHub username
- **Password**: Use a Personal Access Token (not your GitHub password)

---

## 🔑 Creating a Personal Access Token (PAT)

If you need to create a PAT:

1. Go to https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Name: "MoneyPilot Deployment"
4. Expiration: Choose your preference
5. Scopes: Check `repo` (full control of private repositories)
6. Click "Generate token"
7. **COPY THE TOKEN IMMEDIATELY** (you won't see it again!)
8. Use this token as your password when pushing

---

## ✅ Verify Deployment

After pushing, verify:

1. Go to `https://github.com/YOUR_USERNAME/moneypilot`
2. You should see all your files
3. Check that `.env` is **NOT** visible (it should be gitignored)
4. README.md should be displayed on the repository page

---

## 🔄 Future Updates

When you make changes:

```bash
# Stage changes
git add .

# Commit with a descriptive message
git commit -m "Add feature: improved asset allocation algorithm"

# Push to GitHub
git push
```

---

## 📝 Recommended Commit Message Format

```bash
git commit -m "Type: Brief description

Detailed explanation if needed"
```

**Types:**
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

**Examples:**
```bash
git commit -m "feat: Add rule-based investment readiness scoring"
git commit -m "fix: Resolve Supabase upsert conflict issue"
git commit -m "docs: Update README with deployment instructions"
```

---

## 🌟 Optional: Add Repository Topics

On GitHub, add topics to make your repo discoverable:
1. Go to your repository
2. Click the gear icon next to "About"
3. Add topics: `fintech`, `investment`, `ai`, `supabase`, `gemini`, `vite`, `javascript`

---

## 🚀 Next Steps: Deploy to Production

After pushing to GitHub, you can deploy to:

### Vercel (Recommended)
1. Go to https://vercel.com
2. Sign in with GitHub
3. Click "New Project"
4. Import your `moneypilot` repository
5. Add environment variables:
   - `VITE_GEMINI_API_KEY`
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Click "Deploy"

### Netlify
1. Go to https://netlify.com
2. Sign in with GitHub
3. Click "Add new site" → "Import an existing project"
4. Choose your `moneypilot` repository
5. Build command: `npm run build`
6. Publish directory: `dist`
7. Add environment variables (same as above)
8. Click "Deploy"

---

## ⚠️ Important Security Notes

✅ **DO:**
- Keep `.env` in `.gitignore`
- Use environment variables for all secrets
- Rotate API keys if accidentally committed
- Use different API keys for dev/production

❌ **DON'T:**
- Commit `.env` file
- Hardcode API keys in source code
- Share your Supabase anon key publicly (it's okay in client-side code)
- Use production database for development

---

## 🆘 Troubleshooting

### "Permission denied (publickey)"
- Use HTTPS instead of SSH: `https://github.com/username/repo.git`
- Or set up SSH keys: https://docs.github.com/en/authentication/connecting-to-github-with-ssh

### "Failed to push some refs"
- Pull first: `git pull origin main --rebase`
- Then push: `git push`

### "Authentication failed"
- Use Personal Access Token, not password
- Check token has `repo` scope

### ".env file is visible on GitHub"
- Remove it: `git rm --cached .env`
- Commit: `git commit -m "Remove .env from tracking"`
- Push: `git push`

---

## 📞 Need Help?

- GitHub Docs: https://docs.github.com
- Git Basics: https://git-scm.com/book/en/v2/Getting-Started-Git-Basics
- Vercel Docs: https://vercel.com/docs
- Netlify Docs: https://docs.netlify.com

---

**You're all set! 🎉**

Your MoneyPilot application is now on GitHub and ready to share with the world!
