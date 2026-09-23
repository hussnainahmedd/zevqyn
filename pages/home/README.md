# Home Page

**Production URL:** https://zevqyn.free.je/  
**WordPress Slug:** `home`  
**Version:** V1.1 (Refined Editorial AI Workspace)

---

## Description

The central landing page for ZEVQYN, communicating the core product positioning:

$$\text{Research} \longrightarrow \text{Project} \longrightarrow \text{Resume} \longrightarrow \text{Portfolio} \longrightarrow \text{Career Growth}$$

In V1.1, the page has been refined from an over-animated template into an editorial, high-credibility presentation featuring:
- Hero section with high-fidelity ZEVQYN workspace UI overview
- 4-step connected pipeline milestones (Research, Project, Resume, Portfolio)
- Three core workspace capability pillars (AI Research Studio, Research-to-Project Engine, Career Launchpad)
- Technical rigor & architectural differentiation section (source-grounded RAG, pgvector, Supabase RLS)
- Primary action triggers routing to registration (`/register/`) and features (`/features/`, `/how-it-works/`, `/about/`)

---

## Files

- `wordpress-blocks.html` — Full WordPress Custom HTML block source (authoritative source to paste into WordPress Code Editor)
- `content.html` — Clean semantic HTML structure
- `style.css` — Scoped stylesheet adhering to the V1.1 design system (`--zev-*` design tokens)
- `script.js` — Subtle, desktop-only micro-interaction script with reduced-motion and touch-device guards
- `MIGRATION_NOTES_V1_1.md` — Step-by-step instructions for applying this update in WordPress without coding

---

## Design Refinements in V1.1

- **Eliminated Spinning Border Keyframes:** Removed 10 looping `.border-animation` containers that caused visual clutter and high CPU usage.
- **Deep Obsidian Palette:** Standardized on `#090b0e` canvas, `#0f1217` panels, and `#151921` surfaces.
- **Authentic Product Showcase:** Replaced abstract green graphics with the real ZEVQYN workspace architecture visual.
- **Active Navigation Links:** Replaced dead/placeholder buttons with verified links (`/register/`, `/features/`, `/how-it-works/`, `/about/`).
- **Full Accessibility:** WCAG 2.1 AA text contrast compliance, `:focus-visible` keyboard focus indicators, and `@media (prefers-reduced-motion: reduce)` support.