# Project Workspace

**Production URL:** https://zevqyn.free.je/project-workspace/  
**WordPress Slug:** `project-workspace`  
**Status:** V1.1 Refined  

## Description

Project editor workspace. Custom SPA with full project editing, interactive tag managers for technologies and skills, live character counters, image preview, and research traceability.

## V1.1 Refinement Overview

- Replaced tiny 8–9px AI typography with readable, ergonomic scale (13px body, 11px uppercase metadata labels, 20px stats).
- Standardized colors, panels, borders, and inputs to the V1.1 Design System tokens.
- Preserved 100% of client-side JavaScript logic (1,950 lines) and all DOM elements.
- See [MIGRATION_NOTES_V1_1.md](MIGRATION_NOTES_V1_1.md) for full deployment instructions and DOM element inventories.

## Files

- `wordpress-blocks.html` — Full WordPress block source (authoritative source for WordPress)
- `content.html` — Clean HTML markup structure
- `style.css` — V1.1 refined CSS styles
- `script.js` — Client-side SPA logic (untouched)
- `MIGRATION_NOTES_V1_1.md` — Step-by-step WordPress migration guide