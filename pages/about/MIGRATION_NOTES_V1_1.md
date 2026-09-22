# ZEVQYN V1.1 About Page — WordPress Migration Guide

> **Target Page:** About (`/about/`)  
> **Source Files in Repo:** `pages/about/wordpress-blocks.html`, `style.css`, `script.js`, `content.html`  
> **Target Environment:** WordPress 7.1.x + Blocksy Theme  

---

## What Was Refined in V1.1

1. **Eliminated Running Border Light:** Removed `@keyframes zaBorderRun` continuous animation loop.
2. **Damped 3D Card Tilt:** Reduced mouse parallax to $\pm 2.5^\circ$ maximum, disabled on screens $\le 1024\text{px}$, on touch devices, and when reduced motion is preferred.
3. **Obsidian Palette:** Aligned with shared `--zev-bg-canvas` (`#090b0e`), `--zev-bg-panel` (`#0f1217`), and `--zev-bg-surface` (`#151921`).
4. **Enhanced Editorial Comparison:** Clear, high-contrast visual comparison between traditional fragmented research and ZEVQYN's unified pipeline.
5. **Full Focus Rings & a11y:** Added `:focus-visible` styling to all buttons and links.

---

## Step-by-Step Migration Instructions

1. Log into WordPress Admin (`/wp-admin/`).
2. Navigate to **Pages $\to$ All Pages $\to$ About**.
3. Switch to **Code Editor** mode.
4. Replace all content with `pages/about/wordpress-blocks.html`.
5. Switch back to **Visual Editor** mode.
6. Verify under **Blocksy Settings** that **Page Title** is **Disabled**.
7. Click **Update**.

---

## Verification After Migration

- Verify card reveals smoothly upon scroll.
- Verify 3D tilt is gentle and does not wobble on touch devices.
- Verify button links route to `/features/` and `/register/`.
