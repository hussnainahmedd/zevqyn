# Login Page

**Production URL:** https://zevqyn.free.je/login/  
**WordPress Slug:** `login`  
**Version:** V1.1 (Refined Compact Obsidian Card)

---

## Description

The authentication login screen for ZEVQYN:
- Direct integration with Supabase Auth v2 SDK (`signInWithPassword`)
- Automatic session detection and redirection to `/dashboard/`
- Real-time client-side validation and error alerts
- Navigation link to `/register/`

---

## Files

- `wordpress-blocks.html` — Full WordPress Custom HTML block source (authoritative source)
- `content.html` — Clean semantic HTML structure
- `style.css` — Refined stylesheet with V1.1 design tokens and zero diffuse neon glow
- `script.js` — Supabase authentication logic (preserved intact)
- `MIGRATION_NOTES_V1_1.md` — Step-by-step WordPress deployment instructions