# Resume Builder

**Production URL:** https://zevqyn.free.je/resume/  
**WordPress Slug:** `resume`  
**Status:** V1.1 Refined  

## Description

Resume builder application. Custom SPA with multi-resume management, live ATS preview, PDF export, career source attachment, and manual record creation.

## V1.1 Refinement Overview

- Elevated the live ATS preview paper by staging it on a deep studio canvas (`#11141b`) with natural sheet shadows.
- Calmed the editor chrome with V1.1 design tokens, consistent input sizing, and accessible typography.
- Strictly preserved 100% of the ATS paper preview CSS and the 5,285 lines of client JavaScript ensuring authenticated PDF export continues to work seamlessly.
- See [MIGRATION_NOTES_V1_1.md](MIGRATION_NOTES_V1_1.md) for full deployment instructions and DOM element inventories.

## Files

- `wordpress-blocks.html` — Full WordPress block source (authoritative source for WordPress)
- `content.html` — Clean HTML markup structure
- `style.css` — V1.1 refined CSS styles (with verbatim ATS paper styles)
- `script.js` — Client-side SPA logic (untouched)
- `MIGRATION_NOTES_V1_1.md` — Step-by-step WordPress migration guide