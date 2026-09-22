# Settings

**Production URL:** https://zevqyn.free.je/settings/  
**WordPress Slug:** `settings`  
**Status:** V1.1 Refined  

## Description

Account settings page. Custom SPA with account info display, password change, password reset email, user ID clipboard copy, and sign-out.

## V1.1 Refinement Overview

- Aligned brand icon, sidebar navigation, and panel styles with the V1.1 Design System tokens.
- Replaced blue/purple brand icon gradient with `--zev-green-primary` (#2ebd68).
- Preserved 100% of the client-side JavaScript logic and all DOM identifiers.
- See [MIGRATION_NOTES_V1_1.md](MIGRATION_NOTES_V1_1.md) for full deployment instructions and DOM element inventories.

## Files

- `wordpress-blocks.html` — Full WordPress block source (authoritative source for WordPress)
- `content.html` — Clean HTML markup structure
- `style.css` — V1.1 refined CSS styles
- `script.js` — Client-side SPA logic (untouched)
- `MIGRATION_NOTES_V1_1.md` — Step-by-step WordPress migration guide