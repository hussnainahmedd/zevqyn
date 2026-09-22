# Career Hub

**Production URL:** https://zevqyn.free.je/career/  
**WordPress Slug:** `career`  
**Status:** V1.1 Refined  

## Description

Central career data repository. Custom SPA with profile management, CRUD for projects, skills, education, certificates, and tabbed library browser.

## V1.1 Refinement Overview

- Eliminated abrasive mint `#63f1ae` color in favor of the unified `--zev-green-primary` (#2ebd68).
- Removed oversized blur orbs and ambient gradients, grounding the interface in dark obsidian panels with 1px borders.
- Re-architected modals for skills, education, certifications, and projects with sharp borders and clean focus rings.
- Preserved 100% of the 2,324 lines of client-side JavaScript logic and all DOM identifiers.
- See [MIGRATION_NOTES_V1_1.md](MIGRATION_NOTES_V1_1.md) for full deployment instructions and DOM element inventories.

## Files

- `wordpress-blocks.html` — Full WordPress block source (authoritative source for WordPress)
- `content.html` — Clean HTML markup structure
- `style.css` — V1.1 refined CSS styles
- `script.js` — Client-side SPA logic (untouched)
- `MIGRATION_NOTES_V1_1.md` — Step-by-step WordPress migration guide