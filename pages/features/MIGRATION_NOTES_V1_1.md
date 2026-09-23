# ZEVQYN V1.1 Features Page — WordPress Migration Guide

> **Target Page:** Features (`/features/`)  
> **Source Files in Repo:** `pages/features/wordpress-blocks.html`, `style.css`, `script.js`, `content.html`  
> **Target Environment:** WordPress 7.1.x + Blocksy Theme  

---

## What Was Refined in V1.1

1. **Eliminated Spinning Conic Gradients:** Removed `@property --zev-angle`, `@keyframes zevqynBorderSpin`, and `@keyframes zev-running-border` which ran continuous border animations around every card.
2. **Standardized Dark Surfaces:** Adopted the shared `--zev-bg-canvas` (`#090b0e`), `--zev-bg-panel` (`#0f1217`), and `--zev-bg-surface` (`#151921`) hierarchy.
3. **Calibrated Typography:** Reduced the extreme 82px H1 headline to a proportional `clamp(34px, 4.5vw, 54px)` with editorial line-height and letter-spacing.
4. **Refined UI Mockups:** Streamlined the desktop/mobile preview graphics into crisp, high-contrast dark software windows.
5. **Full Accessibility & Motion Guards:** Integrated `:focus-visible` outlines and full `@media (prefers-reduced-motion: reduce)` support.

---

## Step-by-Step Migration Instructions

1. Log into WordPress Admin (`/wp-admin/`).
2. Navigate to **Pages $\to$ All Pages $\to$ Features**.
3. Click the top-right **⋮** menu and switch to **Code Editor** mode.
4. Replace the entire content with the contents of `pages/features/wordpress-blocks.html`.
5. Switch back to **Visual Editor** mode to verify layout rendering.
6. Under **Blocksy Page Settings**, verify **Page Title** is set to **Disabled**.
7. Click **Update**.

---

## Verification After Migration

- Click `#zev-tools` link in hero to verify smooth scrolling.
- Click `Start Researching` to verify navigation to `/register/`.
- Verify cards reveal smoothly upon scrolling into view.
