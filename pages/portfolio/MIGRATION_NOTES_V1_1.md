# ZEVQYN V1.1 Portfolio Builder — WordPress Migration Guide

> **Target Page:** Portfolio Builder (`/portfolio/`)  
> **Source Files in Repo:** `pages/portfolio/wordpress-blocks.html`, `style.css`, `script.js`, `content.html`  
> **Target Environment:** WordPress 7.1.x + Blocksy Theme  

---

## What Was Refined in V1.1

1. **Clean Studio Architecture:** Streamlined the split layout between the Editor (left) and Live Preview (right), replacing harsh neon gradients with dark obsidian cards.
2. **Consistent Design System:** Mapped all buttons, inputs, tabs, and toggles to the unified `--zev-green-primary` (#2ebd68) and standard V1.1 surface/border tokens.
3. **Readable Typography:** Replaced 9–10px micro-fonts with 13px inputs/body, 11px monospace tag pills, and 16px section headers.
4. **Preserved Multi-Portfolio CRUD Engine (Zero JS Changes):** All 37,850 bytes of `script.js` are 100% intact. Exact DOM IDs preserved:
   - Header/Actions: `zevqyn-pf-new`, `zevqyn-pf-delete`, `zevqyn-pf-save`, `zevqyn-pf-status`, `zevqyn-pf-selector`, `zevqyn-pf-publish-badge`, `zevqyn-pf-open-public`
   - Form Fields: `zevqyn-pf-title`, `zevqyn-pf-slug`, `zevqyn-pf-theme`, `zevqyn-pf-headline`, `zevqyn-pf-bio`, `zevqyn-pf-location`, `zevqyn-pf-website`, `zevqyn-pf-github`, `zevqyn-pf-linkedin`, `zevqyn-pf-avatar`
   - Items & Library: `zevqyn-pf-items-container`, `zevqyn-pf-show-projects`, `zevqyn-pf-show-skills`, `zevqyn-pf-show-education`, `zevqyn-pf-show-certificates`, `zevqyn-pf-is-published`
   - Live Preview Elements: `zevqyn-pf-preview-avatar`, `zevqyn-pf-preview-name`, `zevqyn-pf-preview-headline`, `zevqyn-pf-preview-links`, `zevqyn-pf-preview-bio-section`, `zevqyn-pf-preview-bio`, `zevqyn-pf-preview-projects-section`, `zevqyn-pf-preview-projects`, `zevqyn-pf-preview-skills-section`, `zevqyn-pf-preview-skills`, `zevqyn-pf-preview-education-section`, `zevqyn-pf-preview-education`, `zevqyn-pf-preview-certificates-section`, `zevqyn-pf-preview-certificates`
   - Modals: `zevqyn-pf-new-modal`, `zevqyn-pf-new-title`, `zevqyn-pf-new-slug`, `zevqyn-pf-new-cancel`, `zevqyn-pf-new-submit`, `zevqyn-pf-new-close`

---

## Step-by-Step Migration Instructions

1. Log into WordPress Admin (`/wp-admin/`).
2. Navigate to **Pages $\to$ All Pages $\to$ Portfolio Builder**.
3. Switch to **Code Editor** mode.
4. Replace all content with `pages/portfolio/wordpress-blocks.html`.
5. Switch back to **Visual Editor** mode.
6. Under **Blocksy Settings**, verify **Page Title** is **Disabled** and layout is **Full Width (No Sidebar)**.
7. Click **Update**.

---

## Verification After Migration

- Navigate to `/portfolio/` while authenticated.
- Verify portfolio dropdown populates and switching portfolios updates the editor form and live preview.
- Test attaching and detaching items (projects, skills, education, certificates) — verify live preview reflects changes.
- Click "Save Portfolio" — verify success status banner appears.
- When published, verify "Open Public Portfolio ↗" links correctly to `/p/?slug=...`.
