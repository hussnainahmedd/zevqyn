# Portfolio Builder

**Production URL:** https://zevqyn.free.je/portfolio/  
**WordPress Slug:** `portfolio`  
**Status:** V1.1 Refined  

## Description

Portfolio builder application. Custom SPA with portfolio CRUD, live preview, profile configuration, career record selector, and publishing controls.

## V1.1 Refinement Overview

- Unified visual language with the V1.1 Design System, standardizing panels, inputs, and buttons.
- Replaced bright mint `#67f5a2` with `--zev-green-primary` (#2ebd68).
- Elevated the live preview pane into a sharp editorial card display.
- Preserved 100% of the client-side JavaScript logic and all DOM identifiers.
- See [MIGRATION_NOTES_V1_1.md](MIGRATION_NOTES_V1_1.md) for full deployment instructions and DOM element inventories.

## Files

- `wordpress-blocks.html` — Full WordPress block source (authoritative source for WordPress)
- `content.html` — Clean HTML markup structure
- `style.css` — V1.1 refined CSS styles
- `script.js` — Client-side SPA logic (untouched)
- `MIGRATION_NOTES_V1_1.md` — Step-by-step WordPress migration guide