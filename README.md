<div align="center">

# ZEVQYN

### AI Research + Career Workspace — Frontend

*Upload your research, chat with your documents, generate study tools, and turn your work into projects, resumes, and portfolios — all powered by AI.*

![WordPress](https://img.shields.io/badge/WordPress-21759B?logo=wordpress&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?logo=supabase&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google_Gemini-4285F4?logo=google&logoColor=white)
![InfinityFree](https://img.shields.io/badge/InfinityFree-005B96)
![License](https://img.shields.io/badge/license-proprietary-red)

</div>

---

## Preview

<p align="center">
  <img src="assets/hero.webp" alt="ZEVQYN — AI Research + Career Workspace" width="100%">
</p>

---

## What is ZEVQYN?

ZEVQYN is an AI-powered workspace I built to connect the entire journey from academic research to career growth. Upload research documents, chat with them through AI (RAG), generate study tools, convert research into projects, build resumes and portfolios, and get AI-driven career guidance — all in one integrated platform.

**Core workflow:**

```
Research → Project → Resume → Portfolio → Career Growth
```

---

## Features

### Public pages
- **Home** — landing page with the product value proposition
- **Features** — detailed product showcase
- **How It Works** — step-by-step walkthrough
- **About** — brand story
- **Contact** — contact form with FAQ

### Authentication
- **Register / Login** — email + password sign-in powered by Supabase Auth (Supabase JS SDK v2, client-side)

### The workspace (authenticated)
- **Dashboard** — aggregated metrics, recent workspaces, career workflow tracker
- **Documents** — global document explorer with search, type/status filters, and workspace mapping
- **Research Hub** — create and manage research workspaces
- **Research Workspace** — document upload, RAG-powered AI chat, AI study tools (**summaries, key points, questions, flashcards**), and research-to-project conversion
- **Projects** — project management with search, filtering, and sorting
- **Project Workspace** — full project editor with tag managers and research traceability
- **Career Hub** — central career data repository (profile, skills, education, certificates)
- **Resume Builder** — manage multiple resumes with section reordering, live ATS preview, and PDF export
- **Portfolio Builder** — portfolio creation with live preview and a shareable public URL
- **Public Portfolio** — public portfolio viewer (no login required)
- **Career AI** — AI copilot with chat plus tools for profile analysis, skill-gap analysis, project ideas, resume review, portfolio review, and action plans
- **Settings** — account management, password change, sign out
- **Admin Inbox** — admin-side management of contact messages

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| CMS | WordPress |
| Theme | Blocksy (from a Codespot starter template) |
| Page builder | Greenshift blocks (marketing pages) |
| App pages | Custom HTML / CSS / JavaScript embedded via `wp:html` blocks |
| Client-side auth | Supabase JS SDK v2 |
| AI backend | FastAPI + Google Gemini (separate repo — see below) |
| Hosting | InfinityFree |

---

## Architecture

```
┌──────────────────────────────────────┐
│              Browser (user)          │
└──────────────────┬───────────────────┘
                   │
┌──────────────────▼───────────────────┐
│       WordPress frontend (this repo) │
│   Blocksy theme + Greenshift blocks  │
│      Custom HTML / CSS / JavaScript  │
│          Hosted on InfinityFree      │
└──────────────────┬───────────────────┘
                   │  REST API
┌──────────────────▼───────────────────┐
│        FastAPI backend (Python)      │
│         Google Gemini AI + RAG       │
│           Supabase data layer        │
│            Hosted on Render          │
└──────────────────────────────────────┘
```

---

## Repository structure

```
zevqyn/
├── assets/
│   ├── hero.webp              ← preview banner
│   ├── css/custom-theme.css    ← WordPress Customizer CSS
│   └── images/                ← referenced media
├── docs/
│   ├── ARCHITECTURE.md
│   ├── FRONTEND_STRUCTURE.md
│   ├── WORDPRESS_SETUP.md     ← production deployment guide
│   ├── DESIGN_SYSTEM_V1_1.md
│   └── UI_UX_AUDIT_V1.md
├── pages/
│   └── <page>/                ← one folder per page
│       ├── wordpress-blocks.html  ← block markup for WordPress
│       ├── content.html           ← page content
│       ├── style.css              ← page styles
│       ├── script.js              ← page logic (API calls live here)
│       └── README.md              ← per-page notes
└── wordpress-export/
    └── zevqyn.WordPress.2026-09-20.xml  ← WXR site export
```

---

## Setup (rebuilding the site)

This repository is a **source archive of the frontend code** — it is not a standalone app you can `npm start`. The production site runs on WordPress. To reconstruct it, follow `docs/WORDPRESS_SETUP.md`; the short version:

1. Install WordPress and activate the **Blocksy** theme.
2. Install and activate the **Greenshift** block plugin.
3. Import `wordpress-export/zevqyn.WordPress.2026-09-20.xml` via `Tools → Import → WordPress`.
4. Apply the Customizer CSS from `assets/css/custom-theme.css`.
5. Recreate each application page using that page's `wordpress-blocks.html` + `content.html`, and attach its `style.css` / `script.js`.

Each page's folder is self-contained: `script.js` holds the Supabase-auth and backend-API logic, `style.css` holds the page styling.

---

## Backend (companion repo)

All AI and data logic lives in the separate backend repository:

👉 **[hussnainahmedd/zevqyn-backend](https://github.com/hussnainahmedd/zevqyn-backend)** — Python + FastAPI RAG API (document upload, embeddings, pgvector retrieval, Gemini chat, study tools, resumes, portfolios, career AI). The frontend pages call it over REST.

**Deployments (per project docs):**
- Frontend: [zevqyn.free.je](https://zevqyn.free.je/) (InfinityFree)
- Backend: [zevqyn-backend.onrender.com](https://zevqyn-backend.onrender.com) (Render)

---

## License

© 2025–2026 ZEVQYN. All rights reserved.

Proprietary — no license is granted for use, modification, or distribution unless explicitly authorized by the project owner. See `LICENSE`.

---

<div align="center">

Built by **Hussnain Ahmad** — [github.com/hussnainahmedd](https://github.com/hussnainahmedd)

</div>
