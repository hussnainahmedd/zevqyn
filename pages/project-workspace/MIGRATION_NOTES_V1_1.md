# ZEVQYN V1.1 Project Workspace Page — WordPress Migration Guide

> **Target Page:** Project Workspace (`/project-workspace/`)  
> **Source Files in Repo:** `pages/project-workspace/wordpress-blocks.html`, `style.css`, `script.js`, `content.html`  
> **Target Environment:** WordPress 7.1.x + Blocksy Theme  

---

## What Was Refined in V1.1

1. **Ergonomic Studio Layout:** Refined from tiny 8–9px AI-generated text to readable typography (13px body, 11px uppercase metadata labels, 20px stat numbers) while preserving the two-column grid.
2. **Design System Integration:** Replaced hardcoded ad-hoc greens with `--zev-green-primary` (#2ebd68), `--zev-border-default`, `--zev-bg-panel`, and `--zev-radius-*` tokens.
3. **Interactive Form States:** Polished input focus rings, toggle switch mechanics, tag chip delete buttons, and image preview container.
4. **Preserved DOM Bindings (Zero JS Changes):** All 1,950 lines of `script.js` are 100% intact. Exact DOM IDs preserved:
   - Header/Actions: `zevqyn-project-heading`, `zevqyn-project-visibility-badge`, `zevqyn-project-subheading`, `zevqyn-project-reset`, `zevqyn-project-save`
   - State/Loading: `zevqyn-project-loading`, `zevqyn-project-error`, `zevqyn-project-error-message`, `zevqyn-project-content`, `zevqyn-project-toast`
   - Stats: `zevqyn-stat-tech`, `zevqyn-stat-skills`, `zevqyn-stat-links`, `zevqyn-stat-origin`
   - Fields & Counters: `zevqyn-project-title`, `zevqyn-title-count`, `zevqyn-project-short`, `zevqyn-short-count`, `zevqyn-project-description`, `zevqyn-description-count`
   - Tags: `zevqyn-tech-input`, `zevqyn-add-tech`, `zevqyn-tech-tags`, `zevqyn-skill-input`, `zevqyn-add-skill`, `zevqyn-skill-tags`
   - Settings & Links: `zevqyn-project-visibility`, `zevqyn-project-featured`, `zevqyn-project-github`, `zevqyn-project-live`, `zevqyn-open-github`, `zevqyn-open-live`
   - Media & Origin: `zevqyn-project-image`, `zevqyn-image-preview`, `zevqyn-image-empty`, `zevqyn-project-image-preview`, `zevqyn-research-origin-panel`, `zevqyn-origin-title`, `zevqyn-origin-text`, `zevqyn-open-research`
   - Meta: `zevqyn-project-created`, `zevqyn-project-updated`

---

## Step-by-Step Migration Instructions

1. Log into WordPress Admin (`/wp-admin/`).
2. Navigate to **Pages $\to$ All Pages $\to$ Project Workspace**.
3. Switch to **Code Editor** mode.
4. Replace all content with `pages/project-workspace/wordpress-blocks.html`.
5. Switch back to **Visual Editor** mode.
6. Under **Blocksy Settings**, verify **Page Title** is **Disabled** and layout is **Full Width (No Sidebar)**.
7. Click **Update**.

---

## Verification After Migration

- Navigate to `/project-workspace/?id=<valid_id>` while authenticated.
- Verify project data populates (title, short description, description, technologies, skills).
- Test adding and removing technologies and skills.
- Test updating fields and clicking "Save Changes" — verify the success toast appears.
- Test visiting `/project-workspace/` without an `?id=` param — verify the clean error state renders with "Return to Projects" link.
