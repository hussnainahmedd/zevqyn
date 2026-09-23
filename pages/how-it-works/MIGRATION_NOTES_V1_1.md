# ZEVQYN V1.1 How It Works Page — WordPress Migration Guide

> **Target Page:** How It Works (`/how-it-works/`)  
> **Source Files in Repo:** `pages/how-it-works/wordpress-blocks.html`, `style.css`, `script.js`, `content.html`  
> **Target Environment:** WordPress 7.1.x + Blocksy Theme  

---

## What Was Refined in V1.1

1. **Eliminated 30s Spinning Radar Orbit:** Removed `@keyframes zhiOrbitSpin` and `@keyframes zhiRunningBorder` continuous spinning loops.
2. **Replaced with Architectural Pipeline:** Added a clean, structured schematic displaying the actual end-to-end data pipeline: Ingest $\to$ Parse $\to$ RAG $\to$ Project $\to$ ATS Resume $\to$ Career AI.
3. **Structured 6-Step Showcase:** Refined the step cards with high-contrast typography, restrained 1px borders, and clear outcome points.
4. **Accessible Motion:** Wrapped all reveals and transitions in `@media (prefers-reduced-motion: reduce)`.
5. **Full Focus Rings:** Added `:focus-visible` styling on all action triggers and links.

---

## Step-by-Step Migration Instructions

1. Log into WordPress Admin (`/wp-admin/`).
2. Navigate to **Pages $\to$ All Pages $\to$ How It Works**.
3. Switch to **Code Editor** mode.
4. Replace all content with `pages/how-it-works/wordpress-blocks.html`.
5. Switch back to **Visual Editor** mode.
6. Verify under **Blocksy Settings** that **Page Title** is **Disabled**.
7. Click **Update**.

---

## Verification After Migration

- Click `#zhi-steps` in hero to verify smooth scrolling.
- Click `Start Researching Free` to verify navigation to `/register/`.
- Verify the 6 pipeline milestone nodes render with clean 1px borders.
