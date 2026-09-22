# ZEVQYN V1.1 Career Hub — WordPress Migration Guide

> **Target Page:** Career Hub (`/career/`)  
> **Source Files in Repo:** `pages/career/wordpress-blocks.html`, `style.css`, `script.js`, `content.html`  
> **Target Environment:** WordPress 7.1.x + Blocksy Theme  

---

## What Was Refined in V1.1

1. **Eliminated Mint `#63f1ae` & Blue Glows:** Replaced harsh mint accents with `--zev-green-primary` (#2ebd68), eliminated large 130px blur orbs and distracting gradients.
2. **Standardized Surface Hierarchy:** Panels, form inputs, status banners, tabs, and record cards mapped to V1.1 design tokens (`--zev-bg-panel`, `--zev-bg-surface`, `--zev-border-default`).
3. **High-Density Stats & Typography:** Replaced oversized hero and stat text with disciplined 28px/1.2 stat numbers, 14px body copy, and 11px uppercase metadata labels.
4. **Preserved Multi-Modal CRUD Engine (Zero JS Changes):** All 2,324 lines of `script.js` are 100% intact. Exact DOM IDs preserved:
   - Header/Navigation: `zev-career-app`, `zev-career-status`, `zev-career-loading`, `zev-career-content`
   - Counts: `zev-career-project-count`, `zev-career-skill-count`, `zev-career-education-count`, `zev-career-certificate-count`
   - Profile: `zev-career-avatar`, `zev-career-avatar-fallback`, `zev-career-preview-name`, `zev-career-preview-title`, `zev-career-preview-bio`, `zev-career-full-name`, `zev-career-headline`, `zev-career-bio`, `zev-career-location`, `zev-career-website`, `zev-career-github`, `zev-career-linkedin`, `zev-career-avatar-url`, `zev-career-save-profile`
   - Tabs & Lists: `zev-career-projects-list`, `zev-career-skills-list`, `zev-career-education-list`, `zev-career-certificates-list`
   - Modals: `zev-career-project-modal`, `zev-career-skill-modal`, `zev-career-education-modal`, `zev-career-certificate-modal`, with all respective form inputs and submit buttons.

---

## Step-by-Step Migration Instructions

1. Log into WordPress Admin (`/wp-admin/`).
2. Navigate to **Pages $\to$ All Pages $\to$ Career Hub**.
3. Switch to **Code Editor** mode.
4. Replace all content with `pages/career/wordpress-blocks.html`.
5. Switch back to **Visual Editor** mode.
6. Under **Blocksy Settings**, verify **Page Title** is **Disabled** and layout is **Full Width (No Sidebar)**.
7. Click **Update**.

---

## Verification After Migration

- Navigate to `/career/` while authenticated.
- Verify profile details load from `/api/v1/career/profile`.
- Test tab switching: Projects, Skills, Education, Certificates.
- Open each modal (+ Add Project, + Add Skill, + Add Education, + Add Certificate) and verify clean backdrop, sharp borders, and readable inputs.
- Test editing/saving profile details and verify the success status toast.
