# ZEVQYN V1.1 Career AI — WordPress Migration Guide

> **Target Page:** Career AI (`/career-ai/`)  
> **Source Files in Repo:** `pages/career-ai/wordpress-blocks.html`, `style.css`, `script.js`, `content.html`  
> **Target Environment:** WordPress 7.1.x + Blocksy Theme  

---

## What Was Refined in V1.1

1. **Focused Copilot Workspace:** Eliminated blue/green ambient blur halos and grounded the interface in dark obsidian panels with 1px border dividers.
2. **Standardized Toolkit & Chat Stream:** Refined the 6 AI tool cards into a high-density, accessible layout. Elevated user and assistant chat message contrast.
3. **Preserved Streaming & AI Tool Modals (Zero JS Changes):**
   - All 1,439 lines of `script.js` are untouched.
   - Streamed chat completion via backend API remains 100% intact.
   - Exact DOM IDs preserved:
     - Root & Navigation: `zev-career-ai`, `zev-cai-new-chat`, `zev-cai-conversations`
     - Tool Cards: `zev-cai-tool-role-fit`, `zev-cai-tool-skills`, `zev-cai-tool-interview`, `zev-cai-tool-star`, `zev-cai-tool-career-path`, `zev-cai-tool-learning-plan`
     - Chat Components: `zev-cai-chat-messages`, `zev-cai-clear-chat`, `zev-cai-welcome`, `zev-cai-typing`, `zev-cai-input`, `zev-cai-send`, `zev-cai-toast`
     - Tool Modals: `zev-cai-modal`, `zev-cai-modal-close`, `zev-cai-modal-backdrop`, `zev-cai-modal-kicker`, `zev-cai-modal-title`, `zev-cai-modal-form`, `zev-cai-modal-loading`, `zev-cai-modal-result`
4. **Backend V1.1 API Alignment & Legacy Deprecation:**
   - Active Endpoints: Strictly uses modern V1.1 API routes:
     - `POST /api/v1/career/ai/chat` (Conversational chat)
     - `GET /api/v1/career/ai/conversations` (History list)
     - `GET /api/v1/career/ai/conversations/{id}` (Fetch thread)
     - `DELETE /api/v1/career/ai/conversations/{id}` (Delete thread)
     - Specialized tools (`/career/ai/analyze`, `/skill-gap`, `/projects`, `/resume`, `/portfolio`, `/plan`)
   - Legacy Deprecation: Fully audited to ensure 0 references to deprecated `POST /api/v1/career/assistant`. The frontend cleanly adheres to V1.1 contracts.

---

## Step-by-Step Migration Instructions

1. Log into WordPress Admin (`/wp-admin/`).
2. Navigate to **Pages $\to$ All Pages $\to$ Career AI**.
3. Switch to **Code Editor** mode.
4. Replace all content with `pages/career-ai/wordpress-blocks.html`.
5. Switch back to **Visual Editor** mode.
6. Under **Blocksy Settings**, verify **Page Title** is **Disabled** and layout is **Full Width (No Sidebar)**.
7. Click **Update**.

---

## Verification After Migration

- Navigate to `/career-ai/` while authenticated.
- Click "New conversation" and send a prompt to verify streaming responses work.
- Click each of the 6 tool cards in the AI Toolkit:
  - Role Fit Analysis
  - Skill Gap Explorer
  - Interview Prep
  - STAR Story Builder
  - Career Path Simulator
  - Learning Plan Generator
- Verify each modal opens, form fields render cleanly, and submitting triggers the backend endpoint.
