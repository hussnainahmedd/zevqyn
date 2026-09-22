# Admin Inbox

**Production URL:** https://zevqyn.free.je/admin-inbox/  
**WordPress Slug:** `admin-inbox`  
**Status:** V1.1 Refined  

## Description

Admin contact messages inbox. Custom SPA with message list, status management, search/filter, split-screen detail view, and mailto reply.

## V1.1 Refinement Overview

- Re-engineered master-detail inbox view into a clean, modern email client layout.
- Styled unread badges, status filters, search input, and message body with V1.1 design tokens.
- Preserved 100% of the client-side JavaScript logic and all DOM identifiers.
- See [MIGRATION_NOTES_V1_1.md](MIGRATION_NOTES_V1_1.md) for full deployment instructions and DOM element inventories.

## Files

- `wordpress-blocks.html` — Full WordPress block source (authoritative source for WordPress)
- `content.html` — Clean HTML markup structure
- `style.css` — V1.1 refined CSS styles
- `script.js` — Client-side SPA logic (untouched)
- `MIGRATION_NOTES_V1_1.md` — Step-by-step WordPress migration guide