# ZEVQYN V1.1 Projects Hub Page — WordPress Migration Guide

> **Target Page:** Projects (`/projects/`)  
> **Source Files in Repo:** `pages/projects/wordpress-blocks.html`, `style.css`, `script.js`, `content.html`  
> **Target Environment:** WordPress 7.1.x + Blocksy Theme  

---

## What Was Refined in V1.1

1. **Engineering Productivity Layout:** Compact project cards with clear distinction between research-origin projects and manual entries.
2. **Horizontal Technology Tagging:** Clean monospace tag pills (`.zev-tech-tag`) that do not wrap into chaotic multi-line stacks.
3. **Preserved Multi-Filter Engine:** Maintained client-side filtering across categories (All, Research, Manual, Public, Private) and sorting (Updated, Newest, Oldest, Name).
4. **Preserved Modal CRUD & Deletion Confirmation:** Maintained exact DOM bindings for project creation and deletion.
5. **Preserved DOM IDs:** `zevqyn-project-toast`, `zevqyn-user-name`, `zevqyn-user-email`, `zevqyn-user-avatar`, `zevqyn-projects-loading`, `zevqyn-no-projects`, `zevqyn-project-search`, `zevqyn-project-filter`, `zevqyn-project-sort`, `zevqyn-project-grid`, `zevqyn-projects-label`, `zevqyn-project-count`, `zevqyn-research-project-count`, `zevqyn-public-project-count`, `zevqyn-project-modal`, `zevqyn-project-title`, `zevqyn-project-form`, `zevqyn-project-description`, `zevqyn-project-technologies`, `zevqyn-project-github`, `zevqyn-project-live`, `zevqyn-project-public`, `zevqyn-project-submit`, `zevqyn-project-delete-modal`, `zevqyn-project-delete-confirm`, `zevqyn-new-project`, `zevqyn-empty-new-project`, `zevqyn-project-modal-close`, `zevqyn-project-cancel`, `zevqyn-project-delete-cancel`, `zevqyn-signout`.

---

## Step-by-Step Migration Instructions

1. Log into WordPress Admin (`/wp-admin/`).
2. Navigate to **Pages $\to$ All Pages $\to$ Projects**.
3. Switch to **Code Editor** mode.
4. Replace all content with `pages/projects/wordpress-blocks.html`.
5. Switch back to **Visual Editor** mode.
6. Under **Blocksy Settings**, verify **Page Title** is **Disabled** and layout is **Full Width (No Sidebar)**.
7. Click **Update**.

---

## Verification After Migration

- Test filter dropdowns (All, Research, Manual, Public).
- Test sorting by name and updated date.
- Test creating a project and verify it renders in the grid.
- Click a project card to verify navigation to `/project-workspace/?id=...`.
