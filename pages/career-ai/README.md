# Career AI

**Production URL:** https://zevqyn.free.je/career-ai/  
**WordPress Slug:** `career-ai`  
**Status:** V1.1 Refined  

## Description

AI career copilot. Custom SPA with conversational chat, 6 specialized AI tools (role fit, skill gap, interview prep, STAR story, career path, learning plan), and markdown rendering.

## V1.1 Refinement Overview

- Re-architected chat stream and 6 AI tool cards into an institutional copilot interface.
- Eliminated abrasive ambient color blur halos, anchoring the UI in dark obsidian panels with 1px border dividers.
- Preserved 100% of the 1,439 lines of client JavaScript ensuring streaming responses and modal tool endpoints function without interruption.
- Fully aligned with Backend V1.1 API contracts: uses `POST /api/v1/career/ai/chat` and conversations suite; legacy `POST /api/v1/career/assistant` confirmed absent.
- See [MIGRATION_NOTES_V1_1.md](MIGRATION_NOTES_V1_1.md) for full deployment instructions and DOM element inventories.

## Files

- `wordpress-blocks.html` — Full WordPress block source (authoritative source for WordPress)
- `content.html` — Clean HTML markup structure
- `style.css` — V1.1 refined CSS styles
- `script.js` — Client-side SPA logic (untouched)
- `MIGRATION_NOTES_V1_1.md` — Step-by-step WordPress migration guide