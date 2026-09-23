# ZEVQYN V1.1 Login Page — WordPress Migration Guide

> **Target Page:** Login (`/login/`)  
> **Source Files in Repo:** `pages/login/wordpress-blocks.html`, `style.css`, `script.js`, `content.html`  
> **Target Environment:** WordPress 7.1.x + Blocksy Theme  

---

## What Was Refined in V1.1

1. **Compact, Focused Obsidian Card:** Reduced max-width to $480\text{px}$, padding to $32\text{px}$, and radius to $10\text{px}$.
2. **Eliminated Neon Box Shadows:** Removed the diffuse green shadow haze in favor of crisp 1px borders (`--zev-border-default`) and natural directional elevation (`--zev-shadow-lg`).
3. **Calibrated Input Heights:** Reduced inputs from $58\text{px}$ to a professional $42\text{px}$.
4. **Preserved Supabase Auth Logic:** Preserved 100% of the working Supabase Auth initialization, session check, sign-in method, error message insertion, and redirect to `/dashboard/`.
5. **Preserved DOM IDs:** `zevqyn-email`, `zevqyn-password`, `zevqyn-login-btn`, `zevqyn-login-message`.

---

## Step-by-Step Migration Instructions

1. Log into WordPress Admin (`/wp-admin/`).
2. Navigate to **Pages $\to$ All Pages $\to$ Login**.
3. Switch to **Code Editor** mode.
4. Replace the entire content with `pages/login/wordpress-blocks.html`.
5. Switch back to **Visual Editor** mode.
6. Verify under **Blocksy Settings** that **Page Title** is **Disabled**.
7. Click **Update**.

---

## Verification After Migration

- Attempt login with invalid credentials to verify the red error banner renders cleanly.
- Attempt login with valid credentials to verify seamless redirection to `/dashboard/`.
- Verify the "Create an account" link routes to `/register/`.
