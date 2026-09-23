# ZEVQYN V1.1 Public Portfolio — WordPress Migration Guide

> **Target Page:** Public Portfolio (`/p/`)  
> **Source Files in Repo:** `pages/public-portfolio/wordpress-blocks.html`, `style.css`, `script.js`, `content.html`  
> **Target Environment:** WordPress 7.1.x + Blocksy Theme  

---

## What Was Refined in V1.1

1. **Stripped Cyberpunk Clutter:** Deactivated scanline noise overlays (`.zpp-noise`), pulsating neon orbs (`.zpp-orb`), distorted polygon avatars, and neon button drop shadows.
2. **Editorial Engineering Aesthetic:** Introduced clean modern typography, disciplined borders (`--zev-border-default`), crisp monospace metadata tags, and balanced section padding.
3. **Preserved Public API Contracts (Zero JS Changes):**
   - The `/p/?slug=...` query parameter parsing is 100% intact.
   - Fetch calls to `GET /api/v1/public/portfolios/{slug}` remain unaltered.
   - All 715 lines of `script.js` are untouched.
   - Exact DOM IDs preserved:
     - Root: `zevqyn-public-portfolio`, `zpp-loading`, `zpp-error`, `zpp-content`
     - Nav & Hero: `zpp-nav-contact`, `zpp-name`, `zpp-headline`, `zpp-about-text`, `zpp-hero-cta`, `zpp-avatar`, `zpp-avatar-fallback`, `zpp-avatar-img`, `zpp-social-github`, `zpp-social-linkedin`, `zpp-social-website`, `zpp-status-role`
     - Sections: `zpp-about`, `zpp-about-bio`, `zpp-stat-projects`, `zpp-stat-skills`, `zpp-projects`, `zpp-projects-grid`, `zpp-skills`, `zpp-skills-cloud`, `zpp-education`, `zpp-timeline`, `zpp-certificates`, `zpp-certificates-grid`, `zpp-connect`, `zpp-connect-email`, `zpp-connect-btn`, `zpp-footer-name`, `zpp-footer-year`

---

## Step-by-Step Migration Instructions

1. Log into WordPress Admin (`/wp-admin/`).
2. Navigate to **Pages $\to$ All Pages $\to$ Public Portfolio** (Slug: `p`).
3. Switch to **Code Editor** mode.
4. Replace all content with `pages/public-portfolio/wordpress-blocks.html`.
5. Switch back to **Visual Editor** mode.
6. Under **Blocksy Settings**, verify **Page Title** is **Disabled** and layout is **Full Width (No Sidebar)**.
7. Click **Update**.

---

## Verification After Migration

- Test loading `/p/?slug=<existing_public_slug>` without being logged in.
- Verify hero section renders clean typography and correctly populates author profile data.
- Test loading `/p/` without a slug or with an invalid slug — verify clean 404 state displays with "Back to ZEVQYN" button.
- Verify mobile responsiveness on smaller screen widths.
