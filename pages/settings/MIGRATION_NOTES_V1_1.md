# ZEVQYN V1.1 Settings — WordPress Migration Guide

> **Target Page:** Settings (`/settings/`)  
> **Source Files in Repo:** `pages/settings/wordpress-blocks.html`, `style.css`, `script.js`, `content.html`  
> **Target Environment:** WordPress 7.1.x + Blocksy Theme  

---

## What Was Refined in V1.1

1. **Eliminated Discordant Brand Icon Gradient:** Replaced the out-of-place blue/purple brand icon gradient with `--zev-green-primary` (#2ebd68), matching the rest of the workspace sidebars.
2. **Standardized Surfaces and Cards:** Account cards, security panels, session controls, and detail rows now use V1.1 obsidian surfaces and 1px borders.
3. **Readable Typography:** Replaced 9–10px micro-copy with 13px inputs/body, 12px monospace identifiers, and 11px uppercase metadata labels.
4. **Preserved Auth & Security Actions (Zero JS Changes):**
   - All 13,963 bytes of `script.js` are untouched.
   - Exact DOM IDs preserved:
     - Header & Profile: `zev-user-name`, `zev-user-email`, `zev-user-initials`, `zev-settings-message`
     - Account Info: `zev-info-email`, `zev-info-name`, `zev-account-status`, `zev-user-id`, `zev-created-at`, `zev-last-sign-in`, `zev-copy-id-btn`
     - Password Form: `zev-password-form`, `zev-new-password`, `zev-confirm-password`, `zev-toggle-new-pw`, `zev-toggle-confirm-pw`, `zev-update-password-btn`
     - Actions: `zev-reset-password-btn`, `zev-sign-out-btn`, `zev-settings-loading`

---

## Step-by-Step Migration Instructions

1. Log into WordPress Admin (`/wp-admin/`).
2. Navigate to **Pages $\to$ All Pages $\to$ Settings**.
3. Switch to **Code Editor** mode.
4. Replace all content with `pages/settings/wordpress-blocks.html`.
5. Switch back to **Visual Editor** mode.
6. Under **Blocksy Settings**, verify **Page Title** is **Disabled** and layout is **Full Width (No Sidebar)**.
7. Click **Update**.

---

## Verification After Migration

- Navigate to `/settings/` while authenticated.
- Verify user profile data populates (email, display name, account status, user ID, creation date).
- Click "Copy" on User ID — verify the ID copies to the clipboard.
- Test changing password field visibility toggles.
- Verify Sign Out button functions and redirects cleanly to `/login/`.
