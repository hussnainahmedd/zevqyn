# ZEVQYN V1.0 → V1.1 Comprehensive UI/UX Audit

> **Document Version:** 1.1.0  
> **Target Release:** ZEVQYN V1.1  
> **Architecture Scope:** WordPress Frontend (`/pages/*`, `/assets/*`, `/docs/*`)  
> **Author:** Antigravity UI/UX Architecture Team  
> **Status:** Completed Baseline Audit  

---

## Executive Summary & Core Diagnosis

ZEVQYN is an **AI Research + Career Workspace** connecting academic and technical inquiry directly to proof-of-work and professional opportunity:

$$\text{Research} \longrightarrow \text{Project} \longrightarrow \text{Resume} \longrightarrow \text{Portfolio} \longrightarrow \text{Career Growth}$$

Functionally, ZEVQYN V1 is a sophisticated, working implementation. The underlying backend (FastAPI, pgvector, Supabase, Google Gemini RAG) delivers substantial capability: multi-document conversational search, generative synthesis (flashcards, key points, summaries), research-to-project translation, ATS resume generation with PDF export, dynamic portfolio building, and targeted career copilot interactions.

However, visually and experientially, **ZEVQYN V1 suffers from an acute "AI-generated SaaS" aesthetic**. The interface displays hallmark signs of having been composited through disjointed prompts that prioritized decorative visual effects over deliberate information hierarchy and ergonomic software design.

### Primary Symptom Profile

```
Current V1 Aesthetic (Defects)              Refined V1.1 Target Direction
──────────────────────────────────────      ──────────────────────────────────────
• Fluorescent neon green glow everywhere    • Deliberate, calm dark palette
• 20+ continuous spinning gradient borders  • Crisp 1px structural borders
• Pervasive glassmorphism & heavy blurs     • Solid, high-legibility surfaces
• Repetitive 3x3 rounded card grids        • Purposeful panels, lists, & tables
• 8 different shades of green               • Unified single-source brand green
• Inconsistent border radii (6px to 24px)   • Restrained 6px / 10px / 14px scale
• Low-contrast muted text (#626d7c on dark) • WCAG 2.1 AA compliant contrast
• Oversized generic marketing typography    • Editorial hierarchy & dense app type
• Missing accessible keyboard focus rings   • Dedicated :focus-visible indicators
• Fragile mobile layouts and cramped touch  • Responsive ergonomics & touch targets
```

This audit thoroughly analyzes all **19 published pages** in the ZEVQYN frontend archive, diagnosing visual, structural, responsive, and accessibility deficiencies while cataloging critical API dependencies to guarantee that V1.1 refinements do not compromise live production functionality.

---

## The "AI-Generated" Pattern Breakdown

Through complete code inspection across the 19 archived pages, five systemic architectural flaws were identified that create the synthetic, template-like impression:

### 1. Ubiquitous Glow and Border Keyframe Loops
- **Observation:** `home.html` features 20 distinct elements with class `.border-animation`. `features.html` and `contact.html` implement CSS Houdini `@property --zev-angle` running infinite conic gradient border rotations (`zevqynBorderSpin`, `zctBorderRun`).
- **Defect:** When every container continuously spins a neon green light beam, visual hierarchy is completely obliterated. The user's eye has no resting anchor. The software looks like a crypto-gambling dashboard rather than an institutional research tool.

### 2. Palette Fragmentation (Color Incoherence)
- Across 19 pages, **eight distinct green hex values** and **seven conflicting background darks** were hardcoded independently:
  - *Greens:* `#5AA55B` (Home), `#35b45a` (Login/Register), `#35b85b` (Dashboard/Research), `#4ed36f` (Resume/Research), `#25e879` (About), `#24e777` (Contact), `#63f1ae` (Career), `#68f5a3` (Public Portfolio).
  - *Backgrounds:* `#020604`, `#030504`, `#05070b`, `#06100b`, `#07100f`, `#080c12`, `#080d13`.
  - *Unprompted Blue Accents:* `register.html` and `settings.html` introduce blue borders (`rgba(70, 95, 200, 0.45)`) and blue glows (`rgba(61, 96, 255, 0.22)`), clashing with the rest of the workspace.
- **Defect:** Navigating from the Dashboard (`#030504`) to Career Hub (`#06100b`) to Public Portfolio (`#05070b`) reveals jarring background shifts and incompatible accent saturations.

### 3. "Cardification" of Everything
- **Observation:** Page headings, navigation headers, metric counters, simple paragraphs, and entire application viewports are wrapped in heavy, rounded cards with `padding: 46px 48px`, `border-radius: 20px-24px`, and `backdrop-filter: blur(...)`.
- **Defect:** Deeply nested cards inside cards create wasted screen real estate, forcing unnecessary vertical and horizontal scrolling on research and editor screens where information density is critical.

### 4. Oversized Marketing Typography in Core Application Tools
- **Observation:** Tool dashboards utilize `font-size: 36px` to `48px` headings with loose line-heights, leaving only 40% of the viewport for actual research documents or project data.
- **Defect:** Application screens feel like marketing landing pages rather than high-utility productivity software like Linear, Notion, or Cursor.

### 5. Weak Keyboard and Low-Contrast Accessibility
- **Observation:** `outline: none;` is applied universally to form inputs, buttons, and selectable cards without providing alternative `:focus-visible` states. Secondary text colors frequently drop below a 3:1 contrast ratio against deep dark backgrounds.

---

## Detailed Page-by-Page Audit (19 Pages)

---

### 1. Home (`pages/home/`)
- **Type:** Marketing Landing Page
- **Implementation:** Gutenberg Blocks via Greenshift Plugin (`wp:greenshift-blocks/*`)
- **Current Strengths:**
  - Clear high-level value proposition ("Turn Research Into Your Career Advantage").
  - Strong four-stage workflow narrative (Research $\to$ Project $\to$ Resume $\to$ Portfolio).
  - Engaging statistics counter elements.
- **Current Weaknesses:**
  - 20 separate elements decorated with continuous rotating border animations (`.border-animation`).
  - Excessive dark green linear gradients stacked on top of dark background images (`bg-test-12-scaled-1.jpg`), causing muddy visual artifacting.
  - Generic SaaS feature cards that present static icons and abstract text without showcasing real software UI.
- **AI-Generated-Looking Patterns:**
  - Neon green glowing card borders running non-stop.
  - Floating badges with heavy glassmorphic blurs (`backdrop-filter: blur(7px)`).
  - Repetitive 3-column and 4-column card blocks with identical layout weights.
- **UX Problems:**
  - Primary call-to-action ("Start Researching") routes to `/register/`, but secondary CTAs ("Learn more information") lack concrete destination links or interactive anchors.
- **Responsive Issues:**
  - Counters and multi-column grid blocks experience awkward text-wrapping between 768px and 1024px.
  - Hero image overlays clip text on narrow tablet viewports.
- **Accessibility Issues:**
  - Greenshift counters rely on custom attributes without accessible ARIA live region announcements.
  - Low contrast on muted green description copy (`#565D66`).
- **Motion Opportunities:**
  - Replace the 20 looping border animations with subtle, cursor-driven card elevation (+2px lift) and a restrained, physics-based spring return.
- **Recommended Changes:**
  - Strip looping border keyframe animations.
  - Clean up background gradients to a unified deep obsidian foundation (`#090b0e`).
  - Introduce authentic UI screenshots or interactive preview mockups of the actual Research Workspace and Resume Builder.
- **Risk Level:** **MEDIUM RISK** *(Requires preserving valid Greenshift block JSON attributes so WordPress parser does not break).*

---

### 2. Features (`pages/features/`)
- **Type:** Marketing Feature Showcase
- **Implementation:** Custom HTML/CSS/JS in single `wp:html` block
- **Current Strengths:**
  - Thorough coverage of the platform's eight core features.
  - Handcrafted CSS-only UI mockups (laptop and smartphone previews).
  - Smooth in-page scroll navigation targeting `#zev-tools`.
- **Current Weaknesses:**
  - Extreme CSS weight (1,524 lines of CSS for 110 lines of JS).
  - Conic gradient animations (`@property --zev-angle` and `@keyframes zevqynBorderSpin`) cause significant CPU/GPU draw on laptops.
  - Excessive visual clutter around the CSS laptop mockup (fake coffee emoji `☕`, floating sticky notes).
- **AI-Generated-Looking Patterns:**
  - Elaborate pure-CSS gadget illustrations that look like dribbble concepts rather than actual product screenshots.
  - Repetitive feature blocks: alternating left/right layout with glowing badges and green drop-shadow halos.
- **UX Problems:**
  - The page is very long (over 2,200 lines of markup) with minimal visual pacing variations.
- **Responsive Issues:**
  - CSS-drawn smartphone mockups break layout boundaries and cause horizontal overflow on mobile screens $< 380\text{px}$.
- **Accessibility Issues:**
  - Missing `:focus-visible` styles on feature link cards.
  - Conic gradient border animations run continuously without checking `prefers-reduced-motion`.
- **Motion Opportunities:**
  - Add viewport-triggered entrance transitions with natural deceleration (`cubic-bezier(0.16, 1, 0.3, 1)`).
- **Recommended Changes:**
  - Remove CPU-heavy conic border keyframe loops.
  - Replace stylized CSS desk gadgets with clean, high-fidelity vector or UI panels representing actual research tools.
  - Standardize typography scale to match the new design system.
- **Risk Level:** **LOW RISK** *(Static page; no backend API calls or authentication dependencies).*

---

### 3. How It Works (`pages/how-it-works/`)
- **Type:** Educational Product Walkthrough
- **Implementation:** Custom HTML/CSS/JS in single `wp:html` block
- **Current Strengths:**
  - Clear 6-step breakdown of the ZEVQYN lifecycle.
  - Logical progression from document ingestion to career impact.
- **Current Weaknesses:**
  - Radar hero visual (`@keyframes zhiOrbitSpin`, 30s rotation) feels gimmicky and distracting.
  - Repetitive mock browser cards at every single step create visual fatigue.
  - Overuse of dotted border connectors and floating badges.
- **AI-Generated-Looking Patterns:**
  - Spinning concentric orbit rings with glowing node dots.
  - Omnidirectional neon box-shadows (`rgba(53, 220, 120, .13)`).
- **UX Problems:**
  - Steps are numbered but visually compete with one another due to identical size and shadow treatments.
- **Responsive Issues:**
  - The horizontal flow strip (`.zhi-flow-strip`) forces an awkward multi-row wrap on tablets.
- **Accessibility Issues:**
  - The spinning orbital animation does not halt under `@media (prefers-reduced-motion: reduce)`.
  - Contrast of step numbers against dark gradient cards is marginal (3.2:1).
- **Motion Opportunities:**
  - Subtle scroll-driven milestone indicator that illuminates the active step as the user reads down the page.
- **Recommended Changes:**
  - Replace the spinning radar graphic with an elegant, static architectural flowchart.
  - Simplify the 6 step cards using clean typography, refined borders, and authentic UI snapshots.
- **Risk Level:** **LOW RISK** *(No API or state dependencies).*

---

### 4. About (`pages/about/`)
- **Type:** Brand Story & Philosophy
- **Implementation:** Custom HTML/CSS/JS in single `wp:html` block
- **Current Strengths:**
  - Compelling manifesto content articulating why traditional research and career tools are fragmented.
  - Fast, responsive vanilla JS `IntersectionObserver` scroll reveals.
- **Current Weaknesses:**
  - Mouse-tracking 3D tilt effect on `.za-visual` (`perspective(1000px) rotateX(...) rotateY(...)`) feels like an unnecessary novelty that distracts from reading.
  - `@keyframes zaBorderRun` rotating border light around cards.
- **AI-Generated-Looking Patterns:**
  - Orbital concentric diagrams (`.za-orbit`, `.za-core`) that duplicate the same aesthetic used in How It Works.
  - Generic tech-manifesto card styling with neon text accents.
- **UX Problems:**
  - The interactive 3D card tilt can trigger accidental cursor flicker during micro-movements.
- **Responsive Issues:**
  - While disabled on $\le 1024\text{px}$, the visual cards stack with excessive vertical whitespace ($>80\text{px}$ gaps) on mobile devices.
- **Accessibility Issues:**
  - High motion intensity on desktop without reduced-motion query guard in JS mousemove handler.
- **Motion Opportunities:**
  - Dampen the 3D tilt to a barely perceptible, buttery-smooth $\pm 3^\circ$ limit with gentle spring damping, or replace it with a clean elevation lift.
- **Recommended Changes:**
  - Restrain the 3D card physics; disable it entirely when reduced motion is preferred.
  - Remove running border light animations.
  - Unify typography with editorial clarity (serif or clean neo-grotesque display headers).
- **Risk Level:** **LOW RISK** *(Static page; no backend integration).*

---

### 5. Contact (`pages/contact/`)
- **Type:** Inquiry & Support Form + FAQ
- **Implementation:** Custom HTML/CSS/JS in single `wp:html` block
- **Current Strengths:**
  - Fully functional asynchronous AJAX submission directly to `POST https://zevqyn-backend.onrender.com/api/v1/contact`.
  - Category selector cards (Support, Feedback, Partnership, Other) with auto-scroll and auto-population.
  - Real-time character counter (1500 chars max) and smooth accordion FAQ.
- **Current Weaknesses:**
  - Heavy conic-gradient rotating border (`--zct-angle` and `zctBorderRun`).
  - Card selector buttons look like massive chunky cards rather than sleek, actionable category pills.
  - Excessive vertical padding ($100\text{px}$) pushes the actual form below the fold on standard laptops.
- **AI-Generated-Looking Patterns:**
  - Glowing green border circulating around the form card.
  - Floating notification bubbles with simulated chat messages.
- **UX Problems:**
  - Category selector cards take up too much vertical space before the user can even see the name/email fields.
- **Responsive Issues:**
  - On screens $<650\text{px}$, the 4 category cards stack vertically, creating a long wall of buttons before the form inputs.
- **Accessibility Issues:**
  - FAQ accordion items lack `aria-expanded="false/true"` and `aria-controls` bindings.
  - Form input errors rely primarily on red borders without descriptive `aria-describedby` error associations.
- **Motion Opportunities:**
  - Accordion height animation using CSS grid transition (`grid-template-rows: 0fr` $\to$ `1fr`) for seamless 60fps performance without JavaScript `scrollHeight` recalculations.
- **Recommended Changes:**
  - Convert bulky category cards into an elegant segmented pill control.
  - Remove glowing conic border animation around the form container.
  - Add full ARIA attributes to the FAQ accordion and form validation states.
  - **Preserve exact payload schema:** `{ name, email, subject, message }`.
- **Risk Level:** **MEDIUM RISK** *(Must strictly preserve endpoint URL, payload keys, and DOM IDs: `zct-name`, `zct-email`, `zct-subject`, `zct-message`, `zct-submit-btn`).*

---

### 6. Login (`pages/login/`)
- **Type:** User Authentication
- **Implementation:** Greenshift layout row + custom `wp:html` form
- **Current Strengths:**
  - Reliable Supabase Auth v2 client-side integration (`signInWithPassword`).
  - Intelligent redirect handling to `/dashboard/`.
  - Enter-key submission binding on password input.
- **Current Weaknesses:**
  - Card styling feels like a generic 2022 crypto-login: dark card `#080c12`, border `rgba(53, 180, 90, 0.22)`, heavy box-shadow `0 25px 70px rgba(0,0,0,0.50)` with green diffuse bloom.
  - Left column marketing text is generic ("Research Smarter. Build Your Future.") with unaligned logo sizing.
- **AI-Generated-Looking Patterns:**
  - Massive card padding (`46px 48px`) with exaggerated 24px border radius.
  - Double green focus glow on input fields (`box-shadow: 0 0 0 3px rgba(53,180,90,0.1), 0 0 20px rgba(53,180,90,0.08)`).
- **UX Problems:**
  - Error messages appear as basic colored text blocks inserted via DOM manipulation, causing layout jank upon appearance.
- **Responsive Issues:**
  - On mobile screens $< 768\text{px}$, the left brand column disappears completely, leaving only the card with awkward edge margins.
- **Accessibility Issues:**
  - Missing `autocomplete="username"` on email input.
  - Error alert lacks `role="alert"` or `aria-live="polite"`.
- **Motion Opportunities:**
  - Smooth micro-compression on button press (`transform: scale(0.985)`).
- **Recommended Changes:**
  - Refine the login card to a sleek, compact container with a crisp 1px border (`rgba(255,255,255,0.08)`) and no green shadow haze.
  - Tighten input heights from $58\text{px}$ to a professional $44\text{px}$.
  - Integrate an accessible, animated error banner.
- **Risk Level:** **MEDIUM RISK** *(Must preserve Supabase initialization, form element IDs: `zevqyn-login-btn`, `zevqyn-email`, `zevqyn-password`, and redirect logic).*

---

### 7. Register (`pages/register/`)
- **Type:** User Onboarding
- **Implementation:** Greenshift layout row + custom `wp:html` form
- **Current Strengths:**
  - Functional client-side validation (matching password check, minimum 6 characters).
  - Handles Supabase email confirmation notification vs immediate session redirect.
- **Current Weaknesses:**
  - **Inconsistent Color Scheme:** Unlike the login page (which uses green), the register card is styled with **blue borders** (`rgba(70, 95, 200, 0.45)`) and **blue shadow glows** (`rgba(40, 80, 255, 0.04)`), creating immediate visual confusion.
  - Disconnected field layout and oversized submit button.
- **AI-Generated-Looking Patterns:**
  - Deep blue glowing card floating on a dark green website.
  - Bulky input boxes ($58\text{px}$ height) with mismatched focus states.
- **UX Problems:**
  - If email confirmation is required by Supabase, the confirmation banner is easily missed because it renders at the bottom of the card after button click.
- **Responsive Issues:**
  - Excessive top/bottom margin causes form to overflow small mobile displays, hiding submit button below the fold.
- **Accessibility Issues:**
  - Confirm password field lacks proper ARIA mismatch warning.
  - Focus state overrides default browser accessibility rings.
- **Motion Opportunities:**
  - Subtle field-focus indicator slide.
- **Recommended Changes:**
  - Harmonize palette: eliminate the blue borders and bring register into alignment with ZEVQYN's unified dark/green design system.
  - Match card geometry, padding, and input heights with the refined Login card.
- **Risk Level:** **MEDIUM RISK** *(Must preserve Supabase signup call, payload parameters, and DOM IDs).*

---

### 8. Dashboard (`pages/dashboard/`)
- **Type:** Primary Application Home
- **Implementation:** Custom SPA in single `wp:html` block
- **Current Strengths:**
  - Robust multi-endpoint parallel data aggregation (`/workspaces`, `/workspaces/{id}/documents`, `/projects`, `/profile`, `/resumes`, `/portfolios`).
  - Practical career workflow tracker (calculates 25% increments across Research $\to$ Project $\to$ Resume $\to$ Portfolio).
  - Profile completeness algorithm scanning 9 core attributes.
- **Current Weaknesses:**
  - Visual hierarchy is chaotic: metric cards, workflow progress bar, quick actions, and recent workspaces all compete with equal visual prominence.
  - Sidebar is rigid with hardcoded link lists that feel unintegrated with the main content area.
  - The workflow progress bar looks like a gamified progress meter rather than a professional executive roadmap.
- **AI-Generated-Looking Patterns:**
  - Identical 4-card metric row with generic icon boxes and oversized numbers.
  - Repetitive card borders (`rgba(53, 184, 91, 0.22)`).
- **UX Problems:**
  - "Recent Workspaces" list only displays titles and dates; lacks instant document count badges or quick-launch document actions.
  - No empty state for users who have just registered and have zero data.
- **Responsive Issues:**
  - On screens $< 1000\text{px}$, sidebar collapses into a top navigation bar that pushes all dashboard widgets far down the screen.
- **Accessibility Issues:**
  - Profile progress bar lacks `role="progressbar"`, `aria-valuenow`, and `aria-valuemin/max`.
  - Icon-only action links lack `aria-label`.
- **Motion Opportunities:**
  - Smooth counter animation for metrics on initial data resolution.
- **Recommended Changes:**
  - Redesign metric tiles into compact, high-density data indicators.
  - Refine the workflow tracker into an elegant linear milestone stepper.
  - Establish a true collapsible mobile navigation drawer.
  - Implement a polished first-time onboarding empty state.
- **Risk Level:** **MEDIUM-HIGH RISK** *(Extensive multi-endpoint asynchronous fetch logic; DOM element IDs for stats and workspace cards must not be altered).*

---

### 9. Research Hub (`pages/research/`)
- **Type:** Workspace Directory & Management
- **Implementation:** Custom SPA in single `wp:html` block
- **Current Strengths:**
  - Instant client-side search across workspace titles and descriptions.
  - Multi-option sorting (recent, newest, oldest, name).
  - Clean modal for creating new research workspaces.
- **Current Weaknesses:**
  - The bottom section contains four large static marketing cards ("How Zevqyn Research Works") that clutter the screen for experienced users.
  - Workspace cards have excessive padding and redundant green border outlines.
- **AI-Generated-Looking Patterns:**
  - Large decorative cards explaining obvious concepts instead of prioritizing the user's actual research workspaces.
  - Omnipresent green glowing focus rings on the search input.
- **UX Problems:**
  - Searching and filtering controls sit directly below a large banner rather than anchored at the top of the workspace table/grid.
  - Lack of a list/table view toggle for users managing 10+ workspaces.
- **Responsive Issues:**
  - Workspace grid collapses awkwardly from 3 columns to 1 column without an intermediate 2-column breakpoint on medium tablets.
- **Accessibility Issues:**
  - Workspace search input lacks `aria-label="Search research workspaces"`.
  - Create workspace modal does not trap keyboard focus when open.
- **Motion Opportunities:**
  - Spring entrance on modal open; smooth grid re-layout on search filter.
- **Recommended Changes:**
  - Demote or remove the static "How it Works" cards to an optional collapsible guide.
  - Introduce an elegant, compact workspace card layout with clear document counters and timestamp metadata.
  - Add keyboard focus trap to `#zev-create-modal`.
- **Risk Level:** **MEDIUM RISK** *(Search, sort, and workspace creation DOM bindings must remain intact).*

---

### 10. Research Workspace (`pages/research-workspace/`)
- **Type:** Core Research & Document Intelligence Studio
- **Implementation:** Custom SPA in single `wp:html` block (3,202 lines of JS, 1,629 lines of CSS)
- **Current Strengths:**
  - **Highest functional value in the entire platform.**
  - Document upload pipeline with drag-and-drop and automatic backend indexing trigger (`/documents/{id}/index`).
  - Presigned file download handling and modal document deletion.
  - Multi-turn conversational RAG chat with conversation persistence.
  - Automated citation cleanup and source badge rendering.
  - Four specialized generative study tools: Summary, Key Points, Questions, and interactive Flashcards.
  - Research-to-project blueprint generation saving to `localStorage`.
- **Current Weaknesses:**
  - Two-column split layout (Documents on left, Chat on right) is rigid and cramped on standard 13" laptop screens ($1280 \times 800$ or $1366 \times 768$).
  - Chat bubbles are visually noisy, with exaggerated border radius and multiple nested source chips.
  - Flashcard flip animation occasionally exhibits 3D backface clipping in WebKit/Safari.
  - The study tools tabs (Summary, Key Points, Questions, Flashcards) are crammed into a tiny tab bar that wraps unpredictably.
- **AI-Generated-Looking Patterns:**
  - Chat message bubbles styled like glowing messaging apps rather than a scholarly research notebook.
  - Heavy drop shadows on every individual document list item.
- **UX Problems:**
  - When reviewing a long AI summary, the chat input box remains pinned, severely restricting reading space.
  - Suggested prompt chips ("Summarize the main ideas", etc.) take up valuable vertical chat history room.
  - The "Create Project →" button in the generated proposal preview lacks an attached submit event handler in V1.
- **Responsive Issues:**
  - Below $1100\text{px}$, the two columns stack vertically, pushing the chat interface completely below the document list.
- **Accessibility Issues:**
  - Chat transcript does not implement `role="log"` or `aria-live="polite"`.
  - Flashcards flip on click but cannot be flipped via keyboard `Enter` or `Space`.
- **Motion Opportunities:**
  - Smooth panel toggle transitions; clean 3D card flip with `transform: rotateY(180deg)` and GPU acceleration.
- **Recommended Changes:**
  - Re-engineer the layout into a flexible research studio: collapsible document drawer, prominent reading/chat panel, and dedicated tools tab.
  - Refine source citation chips into understated, clickable reference badges.
  - Fix flashcard keyboard accessibility and 3D rendering.
  - Connect the "Create Project" proposal action directly to the projects creation flow.
- **Risk Level:** **HIGH RISK** *(Most complex page in the application; file upload FormData, indexing polling, chat message streaming, citation regex sanitation, and study tool endpoints must remain 100% functional).*

---

### 11. Projects Hub (`pages/projects/`)
- **Type:** Portfolio Projects Directory
- **Implementation:** Custom SPA in single `wp:html` block
- **Current Strengths:**
  - Comprehensive client-side filtering (all, research, manual, public, private) and sorting (updated, newest, oldest, name).
  - Clear distinction between projects originating from research workspaces vs manually created projects.
  - Clean project deletion confirmation modal.
- **Current Weaknesses:**
  - Project cards are overly tall with redundant empty spaces when descriptions are short.
  - Technology tags wrap unpredictably and overflow card boundaries when more than 6 tags exist.
  - Top statistics row takes up significant vertical space without providing actionable utility.
- **AI-Generated-Looking Patterns:**
  - Green glowing border outlines on card hover (`border-color: #35b85b; box-shadow: 0 0 15px rgba(53,184,91,0.15)`).
  - Generic folder icons on every project card.
- **UX Problems:**
  - Clicking a project card opens it, but there is no quick-copy button for the public project link.
- **Responsive Issues:**
  - Filter and sort dropdowns stack vertically on mobile, pushing project items far down the screen.
- **Accessibility Issues:**
  - Delete buttons lack explicit `aria-label` specifying which project will be deleted.
- **Motion Opportunities:**
  - Subdued scale-up on hover (+1px Y-translation with soft shadow transition).
- **Recommended Changes:**
  - Compact the project card layout: title, research origin badge, concise description, clean horizontal technology tag list with `+N` pill, and direct edit action.
  - Make filter toolbar horizontal and sticky on scroll.
- **Risk Level:** **MEDIUM RISK** *(Must preserve project list rendering, filter criteria, and modal submission).*

---

### 12. Project Workspace (`pages/project-workspace/`)
- **Type:** Project Detail & Editor
- **Implementation:** Custom SPA in single `wp:html` block
- **Current Strengths:**
  - In-place editing via HTTP `PATCH /api/v1/projects/{id}`.
  - Interactive tag management for Technologies and Skills with keyboard entry and tag deletion.
  - Real-time character counters for title, short description, and full description.
  - Traceability link back to origin research workspace (`workspace_id`).
  - Live external link buttons ("Open GitHub ↗", "Open Live Project ↗").
- **Current Weaknesses:**
  - Form layout is split across two asymmetric columns with inconsistent vertical rhythms.
  - Image preview container looks like a broken image placeholder when no URL is provided.
  - Character counter text is loud and visually competes with input labels.
- **AI-Generated-Looking Patterns:**
  - Neon green visibility pill badge in header.
  - Glowing input focus rings.
- **UX Problems:**
  - "Reset Changes" button sits directly next to "Save Project", risking accidental cancellation of unsaved edits.
- **Responsive Issues:**
  - Right settings column (links, image, origin) drops beneath the large description textarea on screens $<1150\text{px}$.
- **Accessibility Issues:**
  - Tag deletion "×" buttons are plain text without `aria-label="Remove technology tag"`.
- **Motion Opportunities:**
  - Tag addition pill pop-in animation (`scale(0.9)` $\to$ `scale(1)`).
- **Recommended Changes:**
  - Reorganize form into a clean single-column executive editor with a dedicated metadata sidebar.
  - Style the image upload/preview area with an elegant empty state placeholder.
  - Separate destructive/reset actions from the primary save CTA.
- **Risk Level:** **MEDIUM-HIGH RISK** *(Strict DOM element bindings for tag arrays, character counters, and PATCH payload serialization).*

---

### 13. Career Hub (`pages/career/`)
- **Type:** Professional Profile & Career Database
- **Implementation:** Custom SPA in single `wp:html` block (2,324 lines of JS, 838 lines of CSS)
- **Current Strengths:**
  - Central repository feeding both Resume Builder and Portfolio Builder.
  - Complete CRUD management across four essential career domains: Projects, Skills, Education, and Certificates.
  - Multi-tab library interface with fast asynchronous tab switching.
  - Star rating system for skill proficiency levels (1–5).
- **Current Weaknesses:**
  - Profile card at the top is massive ($300\text{px}+$ height), pushing the actual career record tabs below the fold.
  - Four separate modal dialogs (`#zev-proj-modal`, `#zev-skill-modal`, `#zev-edu-modal`, `#zev-cert-modal`) have duplicated, inconsistent styling.
  - Different green accent used here (`#63f1ae`, mint/cyan-green) compared to the rest of the application (`#35b85b`).
- **AI-Generated-Looking Patterns:**
  - Massive glowing profile card with ambient blur orbs in the background.
  - Mint green neon tags and modal buttons.
- **UX Problems:**
  - Editing profile details requires opening an inline form that reshapes the entire header, causing jarring layout shifts.
- **Responsive Issues:**
  - Tab navigation overflows horizontally on mobile devices without clear scroll cue indicators.
- **Accessibility Issues:**
  - Star ratings are clickable `span` elements without keyboard focusability or `aria-valuenow` announcements.
  - Modals lack proper focus trapping.
- **Motion Opportunities:**
  - Smooth tab indicator transition with sliding underline.
- **Recommended Changes:**
  - Compact the profile card into an executive header strip.
  - Standardize all 4 record creation modals using a unified design system dialog component.
  - Replace mint green accent with unified ZEVQYN brand green.
  - Make skill proficiency ratings accessible via keyboard and screen readers.
- **Risk Level:** **HIGH RISK** *(Extensive CRUD modal logic and multi-tab state; payload structures for skills, education, and certificates must not be altered).*

---

### 14. Resume Builder (`pages/resume/`)
- **Type:** ATS Resume Generator & PDF Exporter
- **Implementation:** Custom SPA in single `wp:html` block (5,285 lines of JS, 1,583 lines of CSS)
- **Current Strengths:**
  - **Critical user value feature.**
  - Dynamic multi-resume management (create, switch, rename, delete).
  - Real-time ATS resume preview sheet with live DOM synchronization on any input change.
  - One-click attachment of Career Hub records (projects, skills, education, certificates) into active resume.
  - Automated PDF compilation and download trigger via `/api/v1/resumes/{id}/pdf`.
- **Current Weaknesses:**
  - The workspace around the resume sheet is cluttered with competing dark cards, dark sidebars, and stat counters.
  - The "paper" preview sheet lacks authentic print margins on smaller screens and clips text unpredictably.
  - Summary input textarea is awkwardly positioned above the preview, forcing the user to scroll back and forth to see their edits.
- **AI-Generated-Looking Patterns:**
  - Dark UI chrome with green glowing borders framing a bright white piece of paper.
  - Neon green icons in the resume toolbar.
- **UX Problems:**
  - On standard laptop viewports, the resume preview paper is zoomed out or requires double scrolling (viewport scroll + preview container scroll).
- **Responsive Issues:**
  - On screens $<1024\text{px}$, the live preview sheet is shoved below all configuration controls, rendering the real-time preview utility ineffective on mobile/tablet.
- **Accessibility Issues:**
  - Complex nested controls inside item lists lack keyboard re-ordering capability.
  - The live preview DOM updates rapidly without notifying screen reader users of preview synchronization.
- **Motion Opportunities:**
  - Quiet, subtle paper zoom/pan controls; smooth toast notification on PDF download completion.
- **Recommended Changes:**
  - Quiet the workspace chrome: dark neutral charcoal surfaces that allow the high-contrast resume document to be the visual hero.
  - Position editor controls in a focused, collapsible side drawer beside the preview.
  - Add quick print/zoom controls (100%, 75%, Fit to Screen) for comfortable document review.
- **Risk Level:** **HIGH RISK** *(Largest codebase in frontend; 5,285 lines of JS. Modifying `#zev-rb-preview-paper` DOM layout or selector IDs risks breaking ATS generation and PDF binary download).*

---

### 15. Portfolio Builder (`pages/portfolio/`)
- **Type:** Portfolio Publisher & Configurator
- **Implementation:** Custom SPA in single `wp:html` block (1,926 lines of JS, 822 lines of CSS)
- **Current Strengths:**
  - Clean separation between private builder configuration and public portfolio display.
  - Live sticky preview reflecting bio, avatar, headline, and attached items.
  - Instant slug validation and "Open Public Portfolio" button (`/p/?slug=...`).
- **Current Weaknesses:**
  - Builder column and preview column fight for visual priority with nearly identical surface colors.
  - Toggle switches (Publish Portfolio, Show Contact Links, Show Certificates) look clunky and lack clear state feedback.
- **AI-Generated-Looking Patterns:**
  - Glowing badges ("LIVE" vs "DRAFT") with excessive box shadows.
  - Redundant ambient background blur elements.
- **UX Problems:**
  - The slug input field displays `zevqyn.free.je/p/` as a static label, but on narrow screens the input text overflows and truncates.
- **Responsive Issues:**
  - On mobile, the sticky live preview disables and drops to the bottom, but leaves an empty sticky placeholder.
- **Accessibility Issues:**
  - Toggle switches are built with custom divs lacking `role="switch"` and `aria-checked="true/false"`.
- **Motion Opportunities:**
  - Smooth spring toggle transition on publish status switch.
- **Recommended Changes:**
  - Clear visual demarcation: clean, purposeful settings panel on the left; authentic device-framed preview on the right.
  - Convert custom toggles to accessible HTML checkbox switches with standard ARIA roles.
- **Risk Level:** **MEDIUM-HIGH RISK** *(Portfolio CRUD and item attachment API endpoints must remain intact).*

---

### 16. Public Portfolio (`pages/public-portfolio/`)
- **Type:** Public-Facing Showcase (Production route: `/p/?slug=...`)
- **Implementation:** Custom HTML/CSS/JS in single `wp:html` block (715 lines of JS, 1,301 lines of CSS)
- **Current Strengths:**
  - **100% unauthenticated client rendering.** Anyone with the link can view the creator's portfolio.
  - Comprehensive profile rendering: hero, avatar fallback, about, projects with live/github links, skill cloud, education, certificates.
  - IntersectionObserver scroll reveal animations.
- **Current Weaknesses:**
  - Visual styling leans heavily into "neon cyberpunk": scanline noise texture, glowing dots, neon green timeline lines (`#68f5a3`), and heavy drop shadows.
  - This gaming/crypto look undermines the credibility of users presenting themselves for serious software engineering, research, or enterprise positions.
- **AI-Generated-Looking Patterns:**
  - Cyberpunk grid background with scanlines.
  - Glowing orb halos around the user avatar.
  - Neon green badges on every skill and project card.
- **UX Problems:**
  - Navigation header is fixed but covers the top of section headings when clicking in-page anchor links.
- **Responsive Issues:**
  - On mobile devices, the timeline line shifts off-center, misaligning with the education and certificate milestone dots.
- **Accessibility Issues:**
  - Neon green text (`#68f5a3`) on dark backgrounds often strains readability during extended viewing.
  - External links open in new tabs without screen-reader warnings or `rel="noopener noreferrer"`.
- **Motion Opportunities:**
  - Refined, staggered scroll reveal on project cards; smooth scroll spy highlighting active nav link.
- **Recommended Changes:**
  - Eliminate the scanline texture and neon gaming aesthetic.
  - Redesign into a refined, high-end editorial portfolio: clean typography, elegant monochrome cards with subtle ZEVQYN green accents, crisp typography, and professional layout.
  - **Preserve exact URL query structure:** `/p/?slug=...`.
- **Risk Level:** **MEDIUM RISK** *(Public data rendering logic from `/api/v1/public/portfolios/{slug}` must be preserved).*

---

### 17. Career AI (`pages/career-ai/`)
- **Type:** AI Career Copilot & Analysis Studio
- **Implementation:** Custom SPA in single `wp:html` block (1,439 lines of JS, 1,298 lines of CSS)
- **Current Strengths:**
  - Multi-faceted capability: conversational AI chat + 6 specialized tools (Profile Analysis, Skill Gap Analysis, Project Ideas, Resume Review, Portfolio Review, 30/60/90 Action Plan).
  - Conversational history sidebar with session creation and deletion.
  - Custom markdown parser rendering headers, lists, and bold text.
- **Current Weaknesses:**
  - The 6 AI tool cards sit directly above the chat window, consuming $250\text{px}+$ of vertical height and squeezing the actual conversation window into a tiny slit.
  - Tool result modal dialogs are dense with raw JSON-like text presentations rather than beautifully structured visual summaries.
  - Chat interface has generic glowing bot icons and neon borders.
- **AI-Generated-Looking Patterns:**
  - Circular score meters with heavy green glowing progress rings.
  - Floating prompt chips with glowing outlines.
- **UX Problems:**
  - Switching between conversation chat and specialized tools feels disjointed.
  - No clear visual distinction between user messages and AI recommendations.
- **Responsive Issues:**
  - The left conversation sidebar collapses on mobile, but there is no hamburger toggle to reopen it, locking mobile users into only their current chat.
- **Accessibility Issues:**
  - AI responses stream/render without `aria-live="polite"` announcements.
  - Circular score meters lack text-based equivalents for screen readers.
- **Motion Opportunities:**
  - Smooth score meter fill animation; natural typing indicator dots.
- **Recommended Changes:**
  - Relocate the 6 specialized AI tools into a dedicated, accessible toolbar or drawer, freeing up the full height for the conversational copilot.
  - Format tool results (e.g. 30/60/90 day action plan) into polished, printable executive roadmaps.
  - Implement a mobile-friendly slide-over conversation history drawer.
- **Risk Level:** **HIGH RISK** *(6 separate API tool endpoints plus chat conversation management; markdown parser and DOM response insertion must remain intact).*

---

### 18. Settings (`pages/settings/`)
- **Type:** User Account & Security Management
- **Implementation:** Custom SPA in single `wp:html` block
- **Current Strengths:**
  - Useful metadata inspection: email address, session status badge, Supabase user UUID with instant clipboard copy.
  - In-place password change with client validation and password visibility toggle.
  - Password reset email trigger and account sign-out workflow.
- **Current Weaknesses:**
  - **Inconsistent Color Scheme:** Uses intense blue glowing drop-shadows (`box-shadow: 0 0 22px rgba(61, 96, 255, 0.22)`) mixed arbitrarily with green buttons.
  - Excessive spacing around simple form rows makes the page feel empty yet unorganized.
- **AI-Generated-Looking Patterns:**
  - Isolated blue glowing cards on a green-themed application.
  - Giant user avatar initial taking up a third of the card.
- **UX Problems:**
  - Password change form does not confirm current password before allowing update.
- **Responsive Issues:**
  - User ID string overflows its container on mobile displays $<380\text{px}$.
- **Accessibility Issues:**
  - Password visibility "Show/Hide" buttons lack `aria-label` detailing their current state.
  - Copied-to-clipboard status lacks screen reader announcement.
- **Motion Opportunities:**
  - Subtle checkmark animation on clipboard copy success.
- **Recommended Changes:**
  - Remove all blue glows; harmonize with the refined obsidian/green palette.
  - Structure into clean account sections: Profile Identity, Security & Credentials, Session Management.
  - Add text overflow truncation with ellipsis on the User ID string.
- **Risk Level:** **LOW-MEDIUM RISK** *(Direct Supabase Auth methods: `getUser`, `updateUser`, `resetPasswordForEmail`, `signOut`).*

---

### 19. Admin Inbox (`pages/admin-inbox/`)
- **Type:** Contact Message Administration
- **Implementation:** Custom SPA in single `wp:html` block (1,191 lines of JS, 722 lines of CSS)
- **Current Strengths:**
  - Practical two-column master-detail layout (message list on left, message detail on right).
  - Real-time client-side search and status filter (`all`, `new`, `read`, `replied`, `archived`).
  - Automatic status update to "read" when opening unread messages.
  - Direct `mailto:` reply generator with pre-filled subject and recipient.
  - Handles backend 403 Forbidden with clear admin permissions notice.
- **Current Weaknesses:**
  - Styling is dated and looks like an early prototype rather than modern enterprise admin software.
  - Status badges use uncalibrated colors (bright lime, harsh orange, muted grey).
  - Search input and filter select are misaligned horizontally.
- **AI-Generated-Looking Patterns:**
  - Generic card borders with sharp contrast differences.
- **UX Problems:**
  - No pagination or virtual scrolling; if 200+ contact messages exist, performance will degrade.
- **Responsive Issues:**
  - The split view collapses on tablets, but selecting a message does not automatically navigate the user into the detail view, requiring confusing downward scrolling.
- **Accessibility Issues:**
  - Message list items are styled divs without `role="button"` or keyboard navigation bindings (`Enter`/`Space` to select).
- **Motion Opportunities:**
  - Smooth message selection highlight; subtle status pill color transition.
- **Recommended Changes:**
  - Refine into a clean, modern email-client interface (reminiscent of Linear or Superhuman).
  - Align search and filter controls into a unified utility bar.
  - Standardize status badge palette (New: Cyan/Green, Read: Neutral, Replied: Purple, Archived: Slate).
- **Risk Level:** **MEDIUM RISK** *(Must preserve localStorage token retrieval, GET `/contact/messages`, and PATCH `/contact/messages/{id}`).*

---

## Top 10 Visual & UX Problems Across ZEVQYN

Based on the systemic audit across all 19 pages, the **Top 10 critical issues** to eliminate in V1.1 are:

1. **Continuous Glowing Border Animations (The "Gamer/Crypto" Trap):**
   *Pages affected:* `home`, `features`, `how-it-works`, `about`, `contact`.
   *Problem:* Looping conic and linear gradient border animations distract the user, destroy visual calm, and drain battery/CPU.
2. **Palette Fragmentation & Incoherent Accents:**
   *Pages affected:* All 19 pages.
   *Problem:* 8 different greens and random blue intrusions (`register`, `settings`) make the product feel stitched together from disparate open-source templates.
3. **Pervasive Glassmorphism & Overbearing Drop Shadows:**
   *Pages affected:* `home`, `login`, `register`, `dashboard`, `research-workspace`, `public-portfolio`.
   *Problem:* `backdrop-filter: blur(...)` and omnidirectional glowing green shadows muddy the text contrast and look amateurish.
4. **Card Overuse & Deeply Nested Containers:**
   *Pages affected:* `dashboard`, `research`, `projects`, `career`, `resume`.
   *Problem:* Putting page titles, statistics, paragraphs, and lists inside individual heavy cards produces severe vertical sprawl and cramped data areas.
5. **Inconsistent, Unrestrained Border Radii:**
   *Pages affected:* All pages (ranging randomly from 6px to 24px).
   *Problem:* Exaggerated 24px pills on large rectangular containers look bloated and cartoonish.
6. **Oversized Marketing Typography on Productive Workspace Screens:**
   *Pages affected:* `dashboard`, `research`, `projects`, `project-workspace`.
   *Problem:* Massive 36px+ headlines push core tools, document tables, and editors beneath the fold on standard 13" laptop screens.
7. **Severe Keyboard & Focus Accessibility Gaps:**
   *Pages affected:* All 19 pages.
   *Problem:* Universal `outline: none;` without `:focus-visible` ring replacements leaves keyboard and assistive-tech users completely stranded.
8. **Low Text Contrast on Dark Surfaces:**
   *Pages affected:* `features`, `about`, `career`, `career-ai`, `projects`.
   *Problem:* Muted text colors (`#626d7c`, `#565d66`) against dark obsidian backdrops fail WCAG 2.1 AA 4.5:1 minimum contrast standards.
9. **Rigid Responsive Layouts & Cramped Mobile Views:**
   *Pages affected:* `research-workspace`, `career-ai`, `resume`, `admin-inbox`, `contact`.
   *Problem:* Multi-column workspaces simply stack into mile-long vertical scrolls on mobile devices without accessible navigation drawers or tabbed views.
10. **Cyberpunk Aesthetic on Public Portfolios:**
    *Pages affected:* `public-portfolio`.
    *Problem:* Scanlines, neon grids, and glowing dots undermine the credibility of students and professionals sharing their work with real-world employers and recruiters.

---

## Components to Preserve Unchanged (What Works Well)

ZEVQYN V1 contains many well-engineered, robust features that **must not be replaced or broken**:

1. **Authentication Flow & Session Guard (`script.js` in all app pages):**
   The asynchronous Supabase token retrieval, session validation, and unauthenticated redirect to `/login/` is solid, reliable, and secure.
2. **RAG Chat Citation Sanitization Engine (`research-workspace`):**
   The regex pipeline that strips internal source markers (`[SOURCE_1]`, `[7]`) and constructs deduplicated, clickable source pills with page references is ingenious and works accurately.
3. **Real-time ATS Resume Preview Renderer (`resume`):**
   The dynamic DOM builder that translates raw project, skill, education, and certificate records into a standardized, ATS-compliant paper layout with date formatting (`YYYY-MM-DD` $\to$ `MMM YYYY`) is high-value intellectual property and must be preserved.
4. **PDF Binary Download Pipeline (`resume`):**
   The authenticated blob fetcher targeting `GET /api/v1/resumes/{id}/pdf` with automatic browser download trigger operates cleanly without external library bloat.
5. **Interactive Tag Managers (`project-workspace`):**
   The tag entry, duplicate prevention, and deletion mechanics for technologies and skills are intuitive and bug-free.
6. **Contact Form AJAX Submission & Real-time Validation (`contact`):**
   The client-side validation logic and clean XHR JSON submission to Render backend is fast, dependable, and error-resilient.
7. **Client-Side Full-Text Search & Filtering (`projects`, `research`, `admin-inbox`):**
   Instant, zero-latency multi-attribute filtering across titles, descriptions, and technology arrays functions flawlessly.
8. **Public Portfolio Slug Routing Architecture (`public-portfolio`):**
   The URL parameter parser extracting `?slug=...` and resolving the unauthenticated public endpoint is lightweight and architecturally sound.

---

## Technical & API Risk Matrix

Before initiating frontend code modifications, each page is assigned a risk level based on its architectural coupling:

| Page | Risk Level | Primary Risk Factors & Constraints |
|---|:---:|---|
| **`resume`** | **HIGH RISK** | 5,285 lines of JS. Direct DOM manipulation inside `#zev-rb-preview-paper`. Multiple nested modals. PDF export endpoint. Do NOT touch DOM IDs or print CSS rules! |
| **`research-workspace`** | **HIGH RISK** | 3,202 lines of JS. File upload FormData, presigned downloads, multi-turn RAG chat, citation regex, 4 study tools, and proposal generation. |
| **`career`** | **HIGH RISK** | 2,324 lines of JS. 4 independent CRUD modals for skills, education, certs, projects. Star ratings and date inputs. Payload schemas must remain exact. |
| **`career-ai`** | **HIGH RISK** | 1,439 lines of JS. Chat session management, streaming/polling response insertion, and 6 specialized AI tool API endpoints. |
| **`project-workspace`** | **MEDIUM-HIGH** | 1,950 lines of JS. Tag array state synchronization, character counters, and HTTP PATCH serialization. |
| **`portfolio`** | **MEDIUM-HIGH** | 1,926 lines of JS. Portfolio switcher, live preview DOM synchronization, and source attachment endpoints. |
| **`dashboard`** | **MEDIUM RISK** | 947 lines of JS. Multi-endpoint parallel fetch (`workspaces`, `projects`, `profile`, `resumes`, `portfolios`). DOM counters must match IDs. |
| **`projects`** | **MEDIUM RISK** | 1,710 lines of JS. Filter, sort, and modal creation/deletion DOM bindings. |
| **`research`** | **MEDIUM RISK** | 1,183 lines of JS. Workspace search, sort, and create modal logic. |
| **`public-portfolio`** | **MEDIUM RISK** | 715 lines of JS. Unauthenticated `/public/portfolios/{slug}` endpoint consumption. Must preserve `/p/?slug=...` routing format. |
| **`admin-inbox`** | **MEDIUM RISK** | 1,191 lines of JS. LocalStorage token authentication, message list selection, and status PATCH endpoints. |
| **`contact`** | **MEDIUM RISK** | 750 lines of JS. Form field IDs, live counter, and POST `/api/v1/contact` schema. |
| **`login`** | **MEDIUM RISK** | Supabase Auth sign-in, redirect timeout, and error banner insertion. |
| **`register`** | **MEDIUM RISK** | Supabase Auth sign-up, password length check, and email verification notice. |
| **`home`** | **MEDIUM RISK** | Greenshift Gutenberg block page. Must preserve valid block JSON attributes so WordPress editor does not throw invalid block errors. |
| **`settings`** | **LOW-MEDIUM** | Supabase Auth profile inspection, password change, and sign out. |
| **`about`** | **LOW RISK** | Static marketing page. No API calls or authentication dependencies. |
| **`features`** | **LOW RISK** | Static marketing page. No API calls or authentication dependencies. |
| **`how-it-works`** | **LOW RISK** | Static marketing page. No API calls or authentication dependencies. |

---

## Phased Implementation Roadmap for V1.1

Following user approval of this audit and the accompanying design system, implementation will proceed in six structured phases:

```
┌───────────────────────────────────────────────────────────────┐
│ PHASE 1: Design Tokens & Global CSS Foundation                │
│ • Unified CSS variables (colors, typography, spacing, radius) │
│ • Focus-visible styles, accessible utilities, spring tokens   │
└───────────────────────────────┬───────────────────────────────┘
                                │
┌───────────────────────────────▼───────────────────────────────┐
│ PHASE 2: Public Marketing Refinement                          │
│ • home, features, how-it-works, about, contact                │
│ • Remove spinning borders, restore calm editorial hierarchy  │
└───────────────────────────────┬───────────────────────────────┘
                                │
┌───────────────────────────────▼───────────────────────────────┐
│ PHASE 3: Authentication Experience                            │
│ • login, register                                             │
│ • Unify login/register cards, eliminate blue glow, clean type │
└───────────────────────────────┬───────────────────────────────┘
                                │
┌───────────────────────────────▼───────────────────────────────┐
│ PHASE 4: Core Workspace Applications                          │
│ • dashboard, research, research-workspace,                    │
│   projects, project-workspace                                 │
│ • High-density layout, calm chat, compact workspace cards     │
└───────────────────────────────┬───────────────────────────────┘
                                │
┌───────────────────────────────▼───────────────────────────────┐
│ PHASE 5: Career & Publishing Suite                            │
│ • career, resume, portfolio, public-portfolio, career-ai      │
│ • Clean ATS preview, editorial public portfolio, calm AI copilot│
└───────────────────────────────┬───────────────────────────────┘
                                │
┌───────────────────────────────▼───────────────────────────────┐
│ PHASE 6: Settings, Administration & Final Validation          │
│ • settings, admin-inbox                                       │
│ • Full WCAG contrast audit, keyboard navigation check         │
│ • Cross-device responsive and performance verification        │
└───────────────────────────────────────────────────────────────┘
```
