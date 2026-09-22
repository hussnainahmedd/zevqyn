# ZEVQYN V1.1 Research Workspace Page — WordPress Migration Guide

> **Target Page:** Research Workspace (`/research-workspace/`)  
> **Source Files in Repo:** `pages/research-workspace/wordpress-blocks.html`, `style.css`, `script.js`, `content.html`  
> **Target Environment:** WordPress 7.1.x + Blocksy Theme  
> **Risk Classification:** HIGH RISK (CSS-First Refinement)  

---

## What Was Refined in V1.1 (CSS-First)

1. **Scholarly Split Studio:** Refined the 2-column layout on desktop: dedicated Knowledge Base drawer ($360\text{px}$) and expansive reading/chat studio ($1\text{fr}$).
2. **Chat Stream Readability:** High-contrast message surfaces with clean, understated citation pills (`.zev-citation-chip`) showing exact page references.
3. **Refined Generative Study Tools:** Segmented tab controls for Summaries, Key Points, Questions, and Flashcards with 3D flip transform that eliminates visual clipping.
4. **100% Application Logic Preserved:** Zero modifications to the 3,202 lines of JavaScript:
   - File upload FormData & presigned downloads
   - Document indexing trigger & polling
   - Multi-turn conversational RAG chat
   - Citation regex sanitization
   - Study tools synthesis API calls
   - Research-to-project proposal generation
5. **Full Focus Rings & a11y:** Added `:focus-visible` styling to all input fields and buttons.

---

## Step-by-Step Migration Instructions

1. Log into WordPress Admin (`/wp-admin/`).
2. Navigate to **Pages $\to$ All Pages $\to$ Research Workspace**.
3. Switch to **Code Editor** mode.
4. Replace all content with `pages/research-workspace/wordpress-blocks.html`.
5. Switch back to **Visual Editor** mode.
6. Under **Blocksy Settings**, verify **Page Title** is **Disabled** and layout is **Full Width (No Sidebar)**.
7. Click **Update**.

---

## Verification After Migration

- Open an existing research workspace (`/research-workspace/?id=<uuid>`).
- Upload a test PDF and verify indexing progress completes.
- Send a question in the chat and verify grounded response with citation pills.
- Switch to Study Tools and test generating a Summary and flipping Flashcards.
- Verify "Create Project" proposal preview populates.
