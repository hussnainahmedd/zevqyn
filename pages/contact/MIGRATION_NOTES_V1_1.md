# ZEVQYN V1.1 Contact Page — WordPress Migration Guide

> **Target Page:** Contact (`/contact/`)  
> **Source Files in Repo:** `pages/contact/wordpress-blocks.html`, `style.css`, `script.js`, `content.html`  
> **Target Environment:** WordPress 7.1.x + Blocksy Theme  

---

## What Was Refined in V1.1

1. **Eliminated Spinning Conic Border:** Removed `@property --zct-angle` and `@keyframes zctBorderRun` continuous animation around the form card.
2. **Compact Category Selector:** Streamlined the 4 inquiry type cards into sleek segmented selection pills that do not push the form inputs below the fold.
3. **Preserved Exact Backend API Integration:** Preserved 100% of the working AJAX submission to `POST https://zevqyn-backend.onrender.com/api/v1/contact` with payload `{ name, email, subject, message }`.
4. **Preserved DOM IDs:** `zct-contact-form`, `zct-name`, `zct-email`, `zct-subject`, `zct-message`, `zct-submit`, `zct-count`, `zct-form-response`.
5. **Standardized Dark Surfaces:** Adopted the V1.1 design tokens (`--zev-bg-canvas`, `--zev-bg-panel`, `--zev-bg-surface`, `--zev-border-default`, `--zev-green-primary`).
6. **Full Focus Rings & a11y:** Added `:focus-visible` styling to all input fields and buttons.

---

## Step-by-Step Migration Instructions

1. Log into WordPress Admin (`/wp-admin/`).
2. Navigate to **Pages $\to$ All Pages $\to$ Contact**.
3. Switch to **Code Editor** mode.
4. Replace all content with `pages/contact/wordpress-blocks.html`.
5. Switch back to **Visual Editor** mode.
6. Verify under **Blocksy Settings** that **Page Title** is **Disabled**.
7. Click **Update**.

---

## Verification After Migration

- Select each category pill (Support, Feedback, Partnership, Other) and verify `zct-subject` auto-populates.
- Type in the message box and verify `zct-count` updates up to 1500 chars.
- Submit a test inquiry and verify successful HTTP 200 response banner.
