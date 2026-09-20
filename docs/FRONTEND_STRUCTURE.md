# Frontend Structure

## Overview

The ZEVQYN V1 frontend consists of 19 published WordPress pages. The custom frontend code is embedded within WordPress using Gutenberg blocks — either Greenshift plugin blocks or raw HTML (`wp:html`) blocks.

---

## Page Organization

### Marketing Pages (Public)

| Page | Slug | Build Method | Custom JS | Custom CSS | Backend Integration |
|---|---|---|---|---|---|
| Home | `/home/` | Greenshift blocks | No | No (block attrs) | None |
| Features | `/features/` | `wp:html` custom | Yes (IntersectionObserver) | Yes (1,524 lines) | None |
| How It Works | `/how-it-works/` | `wp:html` custom | Yes (IntersectionObserver) | Yes (1,968 lines) | None |
| About | `/about/` | `wp:html` custom | Yes (3D tilt + scroll) | Yes (1,173 lines) | None |
| Contact | `/contact/` | `wp:html` custom | Yes (form + AJAX) | Yes (1,446 lines) | POST `/api/v1/contact` |

### Authentication Pages

| Page | Slug | Build Method | Custom JS | Custom CSS | Backend Integration |
|---|---|---|---|---|---|
| Login | `/login/` | Greenshift + `wp:html` | Yes (Supabase Auth) | Yes | Supabase Auth |
| Register | `/register/` | Greenshift + `wp:html` | Yes (Supabase Auth) | Yes | Supabase Auth |

### Application Pages (Authenticated)

| Page | Slug | Build Method | Custom JS | Custom CSS | Backend Integration |
|---|---|---|---|---|---|
| Dashboard | `/dashboard/` | `wp:html` SPA | Yes (~950 lines) | Yes (~520 lines) | Multiple endpoints |
| Research Hub | `/research/` | `wp:html` SPA | Yes (~1,180 lines) | Yes (~1,150 lines) | Workspaces API |
| Research Workspace | `/research-workspace/` | `wp:html` SPA | Yes (~3,200 lines) | Yes (~1,630 lines) | Documents, Chat, AI Tools |
| Projects Hub | `/projects/` | `wp:html` SPA | Yes (~1,710 lines) | Yes (~1,010 lines) | Projects API |
| Project Workspace | `/project-workspace/` | `wp:html` SPA | Yes (~1,950 lines) | Yes (~1,095 lines) | Projects API |
| Career Hub | `/career/` | `wp:html` SPA | Yes (~2,320 lines) | Yes (~835 lines) | Profile, Career CRUD |
| Resume Builder | `/resume/` | `wp:html` SPA | Yes (~5,285 lines) | Yes (~1,580 lines) | Resumes, Career, PDF |
| Portfolio Builder | `/portfolio/` | `wp:html` SPA | Yes (~1,925 lines) | Yes (~820 lines) | Portfolios, Career |
| Public Portfolio | `/p/` | `wp:html` custom | Yes (~715 lines) | Yes (~1,300 lines) | Public portfolios API |
| Career AI | `/career-ai/` | `wp:html` SPA | Yes (~1,438 lines) | Yes (~1,295 lines) | AI Chat, 6 AI tools |
| Settings | `/settings/` | `wp:html` SPA | Yes (~626 lines) | Yes (~1,024 lines) | Supabase Auth |
| Admin Inbox | `/admin-inbox/` | `wp:html` SPA | Yes (~1,190 lines) | Yes (~720 lines) | Contact Messages |

---

## File Organization

### Per-Page Structure

Each page directory contains:

```
page-name/
├── wordpress-blocks.html    # Original WordPress block markup (source of truth)
├── script.js                # Extracted JavaScript (reference copy)
├── style.css                # Extracted CSS (reference copy)
├── content.html             # Extracted HTML (reference copy, where separable)
└── README.md                # Page description and notes
```

**wordpress-blocks.html** is the authoritative source file. It contains the complete page content as exported from WordPress, including block comments (`<!-- wp:html -->`, `<!-- wp:greenshift-blocks/... -->`), inline styles, and scripts.

The separated `script.js`, `style.css`, and `content.html` files are provided for **readability and reference only**. They are extracted from the wordpress-blocks.html and may not perfectly reconstruct the page without the WordPress environment.

### Exception: Home Page

The Home page uses Greenshift blocks exclusively and does not contain `<script>` or `<style>` tags. Its directory only contains:

```
home/
├── wordpress-blocks.html    # Greenshift block markup
└── README.md
```

---

## Code Patterns

### Common Application Page Pattern

Most application pages follow this structure:

```html
<!-- wp:html -->

<script data-wp-block-html="js">
(function () {
    // Configuration
    const SUPABASE_URL = "https://...supabase.co";
    const SUPABASE_KEY = "sb_publishable_...";
    const BACKEND_URL = "https://zevqyn-backend.onrender.com/api/v1";

    // Load Supabase SDK dynamically
    function loadSupabase() { /* ... */ }

    // Authentication check
    async function init() {
        await loadSupabase();
        const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        const session = await client.auth.getSession();
        if (!session.data.session) {
            window.location.href = '/login/';
            return;
        }
        // Load data, set up UI...
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
</script>

<style data-wp-block-html="css">
/* Theme overrides */
.hero-section, .entry-header, .page-title { display: none !important; }

/* Application styles */
/* ... */
</style>

<!-- HTML structure -->
<div id="app-container">
    <!-- sidebar, header, main content -->
</div>

<!-- /wp:html -->
```

### CSS Naming Conventions

Each page uses a unique CSS prefix to avoid class name collisions:

| Page | CSS Prefix |
|---|---|
| About | `za-` |
| Contact | `zct-` |
| Features | `zgf-` |
| How It Works | `zhi-` |
| Public Portfolio | `zpp-` |
| Dashboard | `zev-dash-` |
| Research | `zev-res-` |
| (and similar patterns) | |

---

## WordPress Block Types Used

### Greenshift Blocks (Marketing)

Used primarily on the Home page:

- `greenshift-blocks/row` — Grid row layout
- `greenshift-blocks/row-column` — Column within row
- `greenshift-blocks/container` — Flexible container
- `greenshift-blocks/heading` — Styled heading
- `greenshift-blocks/text` — Styled text block
- `greenshift-blocks/buttonbox` — CTA buttons
- `greenshift-blocks/counter` — Animated number counter
- `greenshift-blocks/iconbox` — Icon with text
- `greenshift-blocks/image` — Image block
- `greenshift-blocks/iconlist` — Icon list

### WordPress Core Blocks

- `wp:html` — Raw HTML block (used for all custom code)
- `wp:image` — Image (used in Login/Register)
- `wp:paragraph` — Text paragraph

---

## What Comes from the Export

All page content in this repository comes directly from the WordPress WXR/XML export. The export captures:

- ✅ Page content (HTML within blocks)
- ✅ WordPress block markup and attributes
- ✅ Custom Customizer CSS
- ✅ Navigation menus
- ✅ Media attachment references (URLs)

### Limitations of the Export

The export does **NOT** include:

- ❌ WordPress core files
- ❌ Theme files (Blocksy)
- ❌ Plugin files (Greenshift, etc.)
- ❌ Actual media files (only URLs)
- ❌ Theme Customizer settings (colors, typography, layout)
- ❌ Widget configurations
- ❌ Database tables
- ❌ Server configuration (PHP, Apache/Nginx)
- ❌ Blocksy header/footer templates
- ❌ Global site design settings

This means the Greenshift block pages (especially Home) cannot be fully rendered without the WordPress environment, Blocksy theme, and Greenshift plugin installed.
