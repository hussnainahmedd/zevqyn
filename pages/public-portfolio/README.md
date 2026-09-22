# Public Portfolio

**Production URL:** https://zevqyn.free.je/p/  
**WordPress Slug:** `p`  
**Status:** V1.1 Refined  

## Description

Public-facing portfolio viewer (production slug: /p/). Custom HTML/CSS/JS rendering portfolio from public API. No authentication required.

## V1.1 Refinement Overview

- Replaced distracting cyberpunk effects (scanlines, blur orbs, neon shadows) with an editorial, engineering-grade portfolio layout.
- Styled typography and layout with high readability across desktop and mobile.
- Preserved 100% of client-side JavaScript logic and public API endpoints (`/api/v1/public/portfolios/{slug}`).
- See [MIGRATION_NOTES_V1_1.md](MIGRATION_NOTES_V1_1.md) for full deployment instructions and DOM element inventories.

## Files

- `wordpress-blocks.html` — Full WordPress block source (authoritative source for WordPress)
- `content.html` — Clean HTML markup structure
- `style.css` — V1.1 refined CSS styles
- `script.js` — Client-side SPA logic (untouched)
- `MIGRATION_NOTES_V1_1.md` — Step-by-step WordPress migration guide