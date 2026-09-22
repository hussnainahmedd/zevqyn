# ZEVQYN V1.1 Resume Builder — WordPress Migration Guide

> **Target Page:** Resume Builder (`/resume/`)  
> **Source Files in Repo:** `pages/resume/wordpress-blocks.html`, `style.css`, `script.js`, `content.html`  
> **Target Environment:** WordPress 7.1.x + Blocksy Theme  

---

## What Was Refined in V1.1

1. **Studio Canvas & Quiet Chrome:** Wrapped the ATS paper sheet in a neutral slate canvas background (`#11141b`) so the white preview sheet stands out like real printed paper.
2. **Standardized Design Tokens:** Chrome buttons, stats, inputs, panels, modals, and toasts now utilize V1.1 design tokens (`--zev-green-primary`, `--zev-border-default`, `--zev-bg-panel`, `--zev-bg-surface`).
3. **Ergonomic Scale:** Replaced tiny 8–9px fonts in editor panels with 13px inputs/body and 11px uppercase metadata labels.
4. **ATS Preview Paper & PDF Export Intact (CRITICAL):**
   - The entire `#zevqyn-resume-preview` and `.zev-rb-preview-paper` ATS styling is 100% untouched to ensure exact visual correspondence with the backend Python PDF generator.
   - All 5,285 lines of `script.js` are 100% intact.
   - Exact DOM IDs preserved:
     - Header/Toolbar: `zevqyn-create-resume`, `zevqyn-resume-select`, `zevqyn-edit-resume`, `zevqyn-delete-resume`, `zevqyn-export-pdf`
     - Status/Stats: `zevqyn-resume-empty`, `zevqyn-builder-content`, `zevqyn-stat-items`, `zevqyn-stat-completeness`, `zevqyn-stat-pdf`, `zevqyn-stat-updated`
     - Form: `zevqyn-resume-title`, `zevqyn-resume-name`, `zevqyn-resume-summary`, `zevqyn-resume-phone`, `zevqyn-resume-email`, `zevqyn-resume-location`, `zevqyn-resume-website`, `zevqyn-resume-linkedin`, `zevqyn-resume-github`, `zevqyn-save-resume`
     - Source Library: `zevqyn-source-projects`, `zevqyn-source-skills`, `zevqyn-source-education`, `zevqyn-source-certificates`, `zevqyn-source-list`, `zevqyn-resume-items`
     - Live Preview Paper: `zevqyn-resume-preview`, `zevqyn-preview-name`, `zevqyn-preview-professional-title`, `zevqyn-preview-contact`, `zevqyn-preview-links`, `zevqyn-preview-summary`, `zevqyn-preview-content`
     - Modals: `zevqyn-create-modal`, `zevqyn-delete-modal`, `zevqyn-manual-career-modal`

---

## Step-by-Step Migration Instructions

1. Log into WordPress Admin (`/wp-admin/`).
2. Navigate to **Pages $\to$ All Pages $\to$ Resume Builder**.
3. Switch to **Code Editor** mode.
4. Replace all content with `pages/resume/wordpress-blocks.html`.
5. Switch back to **Visual Editor** mode.
6. Under **Blocksy Settings**, verify **Page Title** is **Disabled** and layout is **Full Width (No Sidebar)**.
7. Click **Update**.

---

## Verification After Migration

- Navigate to `/resume/` while authenticated.
- Verify existing resumes load into the dropdown selector.
- Select a resume and verify the live ATS paper preview renders on the slate canvas.
- Click "Export PDF" — verify authenticated download from `/api/v1/resumes/{id}/pdf`.
- Test adding items from the source tabs (Projects, Skills, Education, Certificates) into the resume.
