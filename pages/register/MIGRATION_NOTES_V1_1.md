# ZEVQYN V1.1 Register Page — WordPress Migration Guide

> **Target Page:** Register (`/register/`)  
> **Source Files in Repo:** `pages/register/wordpress-blocks.html`, `style.css`, `script.js`, `content.html`  
> **Target Environment:** WordPress 7.1.x + Blocksy Theme  

---

## What Was Refined in V1.1

1. **Eliminated Inconsistent Blue Glow:** Removed blue border (`rgba(70,95,200,0.45)`) and blue glow (`rgba(40,80,255,0.04)`), bringing Register into 100% visual coherence with Login and the rest of ZEVQYN.
2. **Compact, Focused Obsidian Card:** Styled with matching $480\text{px}$ width, $32\text{px}$ padding, and $10\text{px}$ radius.
3. **Calibrated Input Heights:** Tightened form fields to $42\text{px}$ height with subtle 1px border.
4. **Preserved Supabase Auth Logic:** Preserved 100% of the working Supabase Auth sign-up, password verification, and email verification / immediate session handling.
5. **Preserved DOM IDs:** `zevqyn-register-form`, `zevqyn-full-name`, `zevqyn-reg-email`, `zevqyn-reg-password`, `zevqyn-confirm-password`, `zevqyn-register-btn`, `zevqyn-register-message`.

---

## Step-by-Step Migration Instructions

1. Log into WordPress Admin (`/wp-admin/`).
2. Navigate to **Pages $\to$ All Pages $\to$ Register**.
3. Switch to **Code Editor** mode.
4. Replace the entire content with `pages/register/wordpress-blocks.html`.
5. Switch back to **Visual Editor** mode.
6. Verify under **Blocksy Settings** that **Page Title** is **Disabled**.
7. Click **Update**.

---

## Verification After Migration

- Test submitting with passwords $< 6$ characters to verify validation error message.
- Test submitting with mismatched passwords to verify mismatch error.
- Verify the "Already have an account?" link routes to `/login/`.
