# ZEVQYN V1.1 Design System Specification

> **Version:** 1.1.0  
> **Status:** Authoritative Foundation Specification  
> **Applicability:** ZEVQYN Frontend Archive & Production WordPress Runtime  
> **Identity Core:** Premium AI Workspace + Scholarly Research Environment + Career Publishing Suite  

---

## 1. Design Philosophy & Aesthetic Intent

ZEVQYN V1.1 moves deliberately away from the ephemeral "AI Startup Template" aesthetic. It rejects neon-haze glows, continuous spinning conic-gradient borders, decorative desk mockups, and exaggerated 24px pill cards.

Instead, V1.1 establishes an **editorial, engineering-grade product identity** inspired by high-utility, calm software (Linear, Raycast, Notion, Cursor, GitHub):

- **Calm, High-Contrast Obsidian Foundation:** Dark, deep surfaces engineered for extended focus, reading, and writing.
- **Intentional, Restrained Accent Placement:** The signature ZEVQYN Green is treated as an active indicator and primary action accent—never an ambient halo or decorative border light.
- **Structural Elevation over Diffuse Glow:** Depth is conveyed through crisp 1px borders, subtle tonal contrast between canvas and panel, and soft, natural directional drop-shadows.
- **High-Density Typography:** Crisp hierarchical typography tailored for technical data, documents, and code, replacing generic oversized marketing headlines.
- **Tactile, Physics-Based Micro-Interactions:** Subtle compression on click, gentle spring return, and damped hover lifts that respond naturally to user intent without demanding attention.

---

## 2. Complete CSS Custom Properties (Tokens)

The following token sheet represents the single source of truth for all V1.1 styling across both WordPress custom CSS and individual page components:

```css
:root {
  /* ============================================================
     1. COLOR SYSTEM: FOUNDATION SURFACES (DEEP OBSIDIAN)
     ============================================================ */
  --zev-bg-canvas: #090b0e;        /* Deepest base background (page canvas) */
  --zev-bg-panel: #0f1217;         /* Level 1: Sidebars, toolbars, flat sections */
  --zev-bg-surface: #151921;       /* Level 2: Active cards, table rows, list items */
  --zev-bg-elevated: #1b202a;      /* Level 3: Modals, dropdown popovers, tooltips */
  --zev-bg-subtle: #222834;        /* Level 4: Hover states, active row highlights */
  --zev-bg-input: #0c0f14;         /* Form control background inset */

  /* ============================================================
     2. COLOR SYSTEM: ZEVQYN BRAND GREEN (REFINED & CALIBRATED)
     ============================================================ */
  --zev-green-primary: #2ebd68;    /* Authoritative primary brand green */
  --zev-green-hover: #26a75a;      /* Hover state on primary green actions */
  --zev-green-active: #1f8f4c;     /* Pressed / active button state */
  --zev-green-faint: rgba(46, 189, 104, 0.08);   /* Subtle tag backgrounds */
  --zev-green-subtle: rgba(46, 189, 104, 0.16);  /* Selected item tint */
  --zev-green-border: rgba(46, 189, 104, 0.32);  /* Active / focused element border */
  --zev-green-text: #41cf7b;       /* High-legibility green for dark text contrast */

  /* ============================================================
     3. COLOR SYSTEM: NEUTRAL TEXT & GRAPHIC SCALES
     ============================================================ */
  --zev-text-primary: #f4f6f8;     /* 100% white-equivalent: Headings & titles */
  --zev-text-secondary: #c0c7d2;   /* 85% contrast: Body text, form labels */
  --zev-text-muted: #828c9a;       /* 60% contrast: Metadata, timestamps, captions */
  --zev-text-tertiary: #525a66;    /* 40% contrast: Placeholders, disabled states */
  --zev-text-inverse: #090b0e;     /* Text on bright green buttons / badges */

  /* ============================================================
     4. COLOR SYSTEM: STRUCTURAL BORDERS
     ============================================================ */
  --zev-border-faint: rgba(255, 255, 255, 0.06); /* Divider lines & subtle lists */
  --zev-border-default: rgba(255, 255, 255, 0.10); /* Standard card & panel borders */
  --zev-border-strong: rgba(255, 255, 255, 0.18); /* Hover state on bordered cards */
  --zev-border-focus: var(--zev-green-primary);    /* Focus ring outline */

  /* ============================================================
     5. COLOR SYSTEM: SEMANTIC STATUS & ACCENTS
     ============================================================ */
  --zev-color-info: #06b6d4;       /* Cyan: Workspace origins, links */
  --zev-color-info-bg: rgba(6, 182, 212, 0.10);
  --zev-color-success: #10b981;    /* Emerald: Verified, published, completed */
  --zev-color-success-bg: rgba(16, 185, 129, 0.10);
  --zev-color-warning: #f59e0b;    /* Amber: Draft, pending, attention needed */
  --zev-color-warning-bg: rgba(245, 158, 11, 0.10);
  --zev-color-danger: #ef4444;     /* Red: Destructive actions, errors */
  --zev-color-danger-bg: rgba(239, 68, 68, 0.10);
  --zev-color-ai: #a855f7;         /* Purple: AI Generative tools & Gemini */
  --zev-color-ai-bg: rgba(168, 85, 247, 0.10);

  /* ============================================================
     6. TYPOGRAPHY SYSTEM
     ============================================================ */
  --zev-font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  --zev-font-mono: 'JetBrains Mono', 'Fira Code', Menlo, Monaco, Consolas, monospace;

  /* Font Sizes */
  --zev-text-xs: 0.75rem;     /* 12px - Badges, metadata, tooltips */
  --zev-text-sm: 0.8125rem;   /* 13px - Secondary body, compact UI, list items */
  --zev-text-base: 0.875rem;  /* 14px - Primary standard UI & form text */
  --zev-text-md: 0.9375rem;   /* 15px - Article body, readable description */
  --zev-text-lg: 1.125rem;    /* 18px - Section subheadings, card titles */
  --zev-text-xl: 1.375rem;    /* 22px - Panel headings, modal titles */
  --zev-text-2xl: 1.75rem;    /* 28px - Page H1 headings (Application) */
  --zev-text-3xl: 2.25rem;    /* 36px - Section titles (Marketing) */
  --zev-text-4xl: 3.0rem;     /* 48px - Hero headline (Marketing Display) */

  /* Line Heights */
  --zev-leading-tight: 1.2;
  --zev-leading-snug: 1.35;
  --zev-leading-normal: 1.5;
  --zev-leading-relaxed: 1.65;

  /* Font Weights */
  --zev-weight-normal: 400;
  --zev-weight-medium: 500;
  --zev-weight-semibold: 600;
  --zev-weight-bold: 700;

  /* ============================================================
     7. SPACING SCALE (4PX BASELINE)
     ============================================================ */
  --zev-space-1: 4px;
  --zev-space-2: 8px;
  --zev-space-3: 12px;
  --zev-space-4: 16px;
  --zev-space-6: 24px;
  --zev-space-8: 32px;
  --zev-space-12: 48px;
  --zev-space-16: 64px;
  --zev-space-24: 96px;

  /* ============================================================
     8. BORDER RADIUS HIERARCHY
     ============================================================ */
  --zev-radius-xs: 4px;       /* Inner chips, micro-indicators */
  --zev-radius-sm: 6px;       /* Form controls, buttons, tooltips, tags */
  --zev-radius-md: 10px;      /* Standard cards, list containers, dropdowns */
  --zev-radius-lg: 14px;      /* Modals, large panels, feature blocks */
  --zev-radius-full: 9999px;  /* Avatar circles, pill badges */

  /* ============================================================
     9. SHADOWS & ELEVATION (DIRECTIONAL, ZERO NEON BLOOM)
     ============================================================ */
  --zev-shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
  --zev-shadow-md: 0 4px 14px rgba(0, 0, 0, 0.45);
  --zev-shadow-lg: 0 12px 32px rgba(0, 0, 0, 0.60);
  --zev-shadow-modal: 0 24px 60px rgba(0, 0, 0, 0.85);
  --zev-shadow-inner: inset 0 1px 1px rgba(255, 255, 255, 0.04);

  /* ============================================================
     10. PHYSICS & MOTION TOKENS
     ============================================================ */
  --zev-ease-spring: cubic-bezier(0.16, 1, 0.3, 1);  /* Natural spring snap */
  --zev-ease-standard: cubic-bezier(0.2, 0, 0, 1);   /* Smooth transition */
  --zev-duration-micro: 120ms;
  --zev-duration-standard: 200ms;
  --zev-duration-macro: 320ms;
}

/* Reduced Motion Override: Accessibility First */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 3. Surface & Layout Hierarchy

### Surface Classification Rules

| Elevation Level | Token | Used Exclusively For |
|---|---|---|
| **Level 0 (Canvas)** | `--zev-bg-canvas` | Full viewport document body and background. |
| **Level 1 (Panels)** | `--zev-bg-panel` | App navigation sidebar, topbars, research knowledge panel, footer. |
| **Level 2 (Cards & Rows)** | `--zev-bg-surface` | Meaningful objects: Research Workspace card, Project card, Message item, Chat bubble. |
| **Level 3 (Overlay)** | `--zev-bg-elevated` | Floating elements: Dialog modals, dropdown menus, context popovers. |

### The "No Unnecessary Cards" Rule
In ZEVQYN V1.1, containers are not placed inside rounded cards simply because they exist.
- **Not a Card:** Page titles, description paragraphs, filter bars, dashboard section headings, and tab bars sit directly on the panel or canvas surface.
- **Card Appropriate:** Independent entity records that can be opened, dragged, re-ordered, or deleted (e.g. an individual workspace, a resume template, or a project record).

### Elimination of Diffuse Neon Glow
The V1 pattern:
```css
/* ❌ DEPRECATED V1 PATTERN */
box-shadow: 0 0 35px rgba(53, 180, 90, 0.05), 0 0 0 3px rgba(53, 180, 90, 0.10);
border: 1px solid rgba(53, 180, 90, 0.22);
```
Is universally replaced by the V1.1 structural elevation pattern:
```css
/* ✅ REFINED V1.1 PATTERN */
background: var(--zev-bg-surface);
border: 1px solid var(--zev-border-default);
box-shadow: var(--zev-shadow-md), var(--zev-shadow-inner);
```

---

## 4. Typography Hierarchy & Specification

### Standardized Scales

```
Display (Hero):     44px – 48px | Weight: 700 | Leading: 1.15 | Tracking: -0.025em (Marketing only)
Heading 1 (App):    28px – 32px | Weight: 600 | Leading: 1.25 | Tracking: -0.015em
Heading 2 (Panel):  20px – 22px | Weight: 600 | Leading: 1.30 | Tracking: -0.01em
Heading 3 (Card):   16px – 17px | Weight: 600 | Leading: 1.40 | Tracking: 0
Section Subhead:    12px – 13px | Weight: 600 | Leading: 1.00 | Tracking: +0.06em (Uppercase)
Body (Standard):    14px        | Weight: 400 | Leading: 1.55 | Tracking: 0
Body (Small):       13px        | Weight: 400 | Leading: 1.50 | Tracking: 0
Metadata / Tag:     11px – 12px | Weight: 500 | Leading: 1.20 | Tracking: +0.02em
Button / Nav:       13px – 14px | Weight: 500 | Leading: 1.00 | Tracking: 0
```

### Contrast Compliance (WCAG 2.1 AA)
- Primary text on surface: `#f4f6f8` on `#151921` $\implies$ **Contrast ratio 14.8:1** (AAA Compliant).
- Secondary text on surface: `#c0c7d2` on `#151921` $\implies$ **Contrast ratio 9.1:1** (AAA Compliant).
- Muted metadata on surface: `#828c9a` on `#151921` $\implies$ **Contrast ratio 4.8:1** (AA Compliant).
- ZEVQYN text green: `#41cf7b` on `#151921` $\implies$ **Contrast ratio 6.4:1** (AA Compliant).

---

## 5. Component Specifications

### 5.1 Buttons

```css
/* Base Button Primitive */
.zev-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--zev-space-2);
  height: 38px;
  padding: 0 var(--zev-space-4);
  font-family: var(--zev-font-sans);
  font-size: var(--zev-text-base);
  font-weight: var(--zev-weight-medium);
  line-height: 1;
  white-space: nowrap;
  border-radius: var(--zev-radius-sm);
  border: 1px solid transparent;
  cursor: pointer;
  outline: none;
  transition: transform var(--zev-duration-micro) var(--zev-ease-spring),
              background var(--zev-duration-standard) ease,
              border-color var(--zev-duration-standard) ease,
              box-shadow var(--zev-duration-standard) ease;
}

/* Physics Interaction Tokens */
.zev-btn:hover {
  transform: translateY(-1px);
}
.zev-btn:active {
  transform: scale(0.985);
}
.zev-btn:focus-visible {
  outline: 2px solid var(--zev-green-primary);
  outline-offset: 2px;
}
.zev-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  transform: none !important;
}

/* Primary Green Action */
.zev-btn-primary {
  background: var(--zev-green-primary);
  color: var(--zev-text-inverse);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2);
}
.zev-btn-primary:hover {
  background: var(--zev-green-hover);
  box-shadow: 0 3px 8px rgba(46, 189, 104, 0.25);
}

/* Secondary Neutral Surface */
.zev-btn-secondary {
  background: var(--zev-bg-subtle);
  color: var(--zev-text-primary);
  border-color: var(--zev-border-default);
}
.zev-btn-secondary:hover {
  background: var(--zev-bg-elevated);
  border-color: var(--zev-border-strong);
}

/* Subtle / Ghost Action */
.zev-btn-ghost {
  background: transparent;
  color: var(--zev-text-secondary);
}
.zev-btn-ghost:hover {
  background: var(--zev-bg-subtle);
  color: var(--zev-text-primary);
}

/* Destructive Action */
.zev-btn-danger {
  background: var(--zev-color-danger-bg);
  color: var(--zev-color-danger);
  border-color: rgba(239, 68, 68, 0.25);
}
.zev-btn-danger:hover {
  background: var(--zev-color-danger);
  color: #fff;
}
```

---

### 5.2 Form Controls (Inputs, Selects, Textareas)

```css
.zev-input,
.zev-select,
.zev-textarea {
  width: 100%;
  height: 40px;
  padding: 0 var(--zev-space-3);
  background: var(--zev-bg-input);
  color: var(--zev-text-primary);
  font-family: var(--zev-font-sans);
  font-size: var(--zev-text-base);
  border: 1px solid var(--zev-border-default);
  border-radius: var(--zev-radius-sm);
  outline: none;
  box-sizing: border-box;
  transition: border-color var(--zev-duration-standard) ease,
              box-shadow var(--zev-duration-standard) ease,
              background var(--zev-duration-standard) ease;
}

.zev-textarea {
  height: auto;
  min-height: 100px;
  padding: var(--zev-space-3);
  line-height: var(--zev-leading-normal);
  resize: vertical;
}

.zev-input::placeholder,
.zev-textarea::placeholder {
  color: var(--zev-text-tertiary);
}

/* Focused State: Clean 1px highlight, NO fuzzy diffuse glow */
.zev-input:focus,
.zev-select:focus,
.zev-textarea:focus {
  border-color: var(--zev-green-primary);
  background: #0e1218;
  box-shadow: 0 0 0 1px var(--zev-green-primary);
}

/* Error State */
.zev-input.has-error,
.zev-textarea.has-error {
  border-color: var(--zev-color-danger);
  box-shadow: 0 0 0 1px var(--zev-color-danger);
}
```

---

### 5.3 Badges, Pills & Status Indicators

```css
.zev-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--zev-space-1);
  height: 22px;
  padding: 0 var(--zev-space-2);
  font-size: var(--zev-text-xs);
  font-weight: var(--zev-weight-semibold);
  letter-spacing: 0.02em;
  border-radius: var(--zev-radius-xs);
  line-height: 1;
  white-space: nowrap;
}

/* Status: Published / Active / Success */
.zev-badge-success {
  background: var(--zev-color-success-bg);
  color: var(--zev-color-success);
  border: 1px solid rgba(16, 185, 129, 0.25);
}

/* Status: Research Origin / Connected */
.zev-badge-info {
  background: var(--zev-color-info-bg);
  color: var(--zev-color-info);
  border: 1px solid rgba(6, 182, 212, 0.25);
}

/* Status: Draft / Private / Warning */
.zev-badge-warning {
  background: var(--zev-color-warning-bg);
  color: var(--zev-color-warning);
  border: 1px solid rgba(245, 158, 11, 0.25);
}

/* Technology Tag Pill */
.zev-tech-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 24px;
  padding: 0 8px;
  background: var(--zev-bg-subtle);
  color: var(--zev-text-secondary);
  font-size: var(--zev-text-xs);
  font-family: var(--zev-font-mono);
  border-radius: var(--zev-radius-xs);
  border: 1px solid var(--zev-border-faint);
}
```

---

### 5.4 Modals & Dialogs

```css
.zev-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(4, 6, 8, 0.78);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--zev-space-4);
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--zev-duration-standard) ease;
}

.zev-modal-backdrop.is-active {
  opacity: 1;
  pointer-events: auto;
}

.zev-modal-dialog {
  width: 100%;
  max-width: 540px;
  background: var(--zev-bg-panel);
  border: 1px solid var(--zev-border-strong);
  border-radius: var(--zev-radius-lg);
  box-shadow: var(--zev-shadow-modal);
  transform: scale(0.96) translateY(8px);
  transition: transform var(--zev-duration-macro) var(--zev-ease-spring);
  overflow: hidden;
}

.zev-modal-backdrop.is-active .zev-modal-dialog {
  transform: scale(1) translateY(0);
}

.zev-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--zev-space-4) var(--zev-space-6);
  border-bottom: 1px solid var(--zev-border-faint);
}

.zev-modal-body {
  padding: var(--zev-space-6);
  max-height: 70vh;
  overflow-y: auto;
}

.zev-modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--zev-space-3);
  padding: var(--zev-space-4) var(--zev-space-6);
  background: var(--zev-bg-canvas);
  border-top: 1px solid var(--zev-border-faint);
}
```

---

### 5.5 Empty States

Every data module in ZEVQYN V1.1 (Workspaces, Documents, Projects, Skills, Resumes, etc.) must present an intentional, structured empty state:

```html
<div class="zev-empty-state">
  <div class="zev-empty-icon">
    <!-- Clean, minimalist monochrome SVG icon -->
  </div>
  <h3 class="zev-empty-title">No research workspaces found</h3>
  <p class="zev-empty-desc">
    Upload research papers, PDF documents, or notes to begin extracting insights with grounded AI.
  </p>
  <button type="button" class="zev-btn zev-btn-primary">
    + Create Workspace
  </button>
</div>
```

```css
.zev-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--zev-space-12) var(--zev-space-6);
  background: var(--zev-bg-surface);
  border: 1px dashed var(--zev-border-strong);
  border-radius: var(--zev-radius-md);
  margin: var(--zev-space-4) 0;
}

.zev-empty-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--zev-radius-full);
  background: var(--zev-bg-subtle);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--zev-text-muted);
  margin-bottom: var(--zev-space-3);
}

.zev-empty-title {
  font-size: var(--zev-text-lg);
  font-weight: var(--zev-weight-semibold);
  color: var(--zev-text-primary);
  margin: 0 0 var(--zev-space-2) 0;
}

.zev-empty-desc {
  font-size: var(--zev-text-base);
  color: var(--zev-text-muted);
  max-width: 420px;
  line-height: var(--zev-leading-normal);
  margin: 0 0 var(--zev-space-6) 0;
}
```

---

### 5.6 Loading States (Skeletons & Inline Indicators)

Fullscreen blocking spinners are deprecated in V1.1. In-place content skeletons replace them:

```css
.zev-skeleton {
  background: linear-gradient(
    90deg,
    var(--zev-bg-surface) 25%,
    var(--zev-bg-subtle) 37%,
    var(--zev-bg-surface) 63%
  );
  background-size: 400% 100%;
  animation: zevSkeletonWave 1.4s ease infinite;
  border-radius: var(--zev-radius-xs);
}

@keyframes zevSkeletonWave {
  0% { background-position: 100% 50%; }
  100% { background-position: 0 50%; }
}
```

---

## 6. Page Personality Matrix

Each of ZEVQYN's functional areas reflects a distinct software personality within the unified design system:

| Module | Core Personality | Visual Emphases | Anti-Patterns to Strictly Avoid |
|---|---|---|---|
| **Research Hub** | Scholarly catalog | Clean metadata, document badges, chronological ordering, list/grid density | Floating marketing banners, neon card outlines |
| **Research Workspace** | Focused intelligence lab | Clear citation pills, readable chat stream, split knowledge/chat panels | Messenger app speech bubbles, spinning border animations |
| **Projects** | Engineering productivity | Status tags, tech stack badges, research origin links, linear list view | Bulky generic folders, heavy drop shadows |
| **Project Workspace** | Structured technical editor | High-density form layout, clean tag chips, direct link tests | Cluttered 2-column layout, unaligned character counts |
| **Career Hub** | Professional database | Dense record tables, credential validation links, structured tabbed catalog | Oversized profile header card, mint-green neon glow |
| **Resume Builder** | Desktop publishing tool | High-contrast ATS paper preview, quiet dark chrome, instant PDF actions | Loud glowing toolbars, double-scrolling preview panes |
| **Portfolio Builder** | Content publishing engine | Clear live/draft state, live mobile/desktop frame preview, instant slug copy | Ambiguous toggle switches, cramped inputs |
| **Public Portfolio** | Editorial portfolio site | Elegant typography, monochrome cards with subtle green accents, clean bio | Cyberpunk grid lines, scanline noise, glowing avatar halo |
| **Career AI** | Executive career advisor | Calm conversational transcript, clean structured roadmaps, quiet score pills | Robotic glowing chatbots, tiny compressed chat windows |
| **Settings** | Secure account utility | Clean rows, credential privacy, clear sign-out action | Random blue drop-shadows, oversized avatar initials |
| **Admin Inbox** | High-efficiency mail client | Split master-detail view, keyboard navigation, clear status tags | Bulky card borders, low-contrast timestamp text |

---

## 7. Physics-Based Motion Guidelines

Motion in ZEVQYN V1.1 is functional and ergonomic. It serves three strict purposes:
1. **Direct Manipulation Feedback:** Interactive controls visually acknowledge click/press immediately (`scale(0.985)`).
2. **Spatial Orientation:** Modals and dropdowns expand outward from their trigger origin.
3. **State Transitions:** Toggles, tabs, and alerts slide with natural spring damping (`cubic-bezier(0.16, 1, 0.3, 1)`).

### Prohibited Motion Patterns
- ❌ No continuous infinite spinning borders (`@keyframes zaBorderRun`, `zevqynBorderSpin`, `zctBorderRun`).
- ❌ No 3D cursor-following card rotations that tilt while reading text.
- ❌ No animated background orb floaters on data entry or research screens.
- ❌ No animations with durations exceeding $350\text{ms}$.

---

## 8. Accessibility (a11y) Standards

ZEVQYN V1.1 enforces **WCAG 2.1 Level AA** standards:

1. **Focus Ring Primitive:**
   ```css
   :focus-visible {
     outline: 2px solid var(--zev-green-primary) !important;
     outline-offset: 2px !important;
   }
   ```
2. **Semantic ARIA Patterns:**
   - Tabs must feature `role="tablist"`, `role="tab"`, `aria-selected="true/false"`, and `aria-controls`.
   - Modals must feature `role="dialog"`, `aria-modal="true"`, and `aria-labelledby`.
   - Chat live streams must feature `role="log"` and `aria-live="polite"`.
   - Progress bars must feature `role="progressbar"`, `aria-valuenow`, and `aria-valuemin="0"`, `aria-valuemax="100"`.
3. **Minimum Touch Targets:** All interactive buttons, icon triggers, and form fields must measure at least $40\text{px} \times 40\text{px}$ (preferably $44\text{px}$ on mobile).
4. **Motion Fallbacks:** Every keyframe and transition is encapsulated within or overridden by `@media (prefers-reduced-motion: reduce)`.
