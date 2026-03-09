# 🚀 WealthWise — Deployment Guide

## Deploy to Vercel (Free, ~5 minutes)

### Step 1 — Create a GitHub account
Go to https://github.com and sign up (free).

### Step 2 — Create a new repository
1. Click the **+** icon → "New repository"
2. Name it `wealthwise`
3. Set to **Public**
4. Click **Create repository**

### Step 3 — Upload your project files
In the new repo, click **"uploading an existing file"** and drag in ALL files from this zip:
```
wealthwise/
├── index.html
├── package.json
├── vite.config.js
├── vercel.json
├── .gitignore
└── src/
    ├── main.jsx
    └── App.jsx
```

### Step 4 — Deploy on Vercel
1. Go to https://vercel.com → Sign up with GitHub (free)
2. Click **"Add New Project"**
3. Import your `wealthwise` GitHub repo
4. Vercel auto-detects Vite — no config needed
5. Click **Deploy**

✅ Your site is live in ~60 seconds at:
`https://wealthwise-[yourname].vercel.app`

---

## Custom Domain (Optional)
1. In Vercel → Project Settings → Domains
2. Add your domain (e.g. `wealthwise.app`)
3. Update DNS at your registrar — Vercel shows exact steps

---

## Alternative: Netlify
1. Go to https://netlify.com → Sign up free
2. Drag the entire `wealthwise` folder onto the Netlify dashboard
3. It builds and deploys automatically

---

## Run Locally (for testing)
```bash
# Install Node.js from https://nodejs.org first
cd wealthwise
npm install
npm run dev
# Open http://localhost:5173
```

---

## Responsive Breakpoints
| Device | Width | Layout |
|--------|-------|--------|
| Mobile | < 640px | Single column, compact header |
| Tablet | 640–1023px | Slide-out sidebar, 720px max-width |
| Desktop | ≥ 1024px | Fixed left sidebar, 900px content area |

---

## Tech Stack
- **React 18** + Vite 5
- **No CSS framework** — pure inline styles, zero dependencies
- **Claude AI** — powers the AI Finance Coach (API key handled by Claude.ai)
- **Deployed on** Vercel (recommended) or Netlify

---

Built with ❤️ by Govindaraju Dinadayalan × Claude AI
