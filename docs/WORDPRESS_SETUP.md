# WordPress Setup

## Production Environment

The ZEVQYN V1 frontend is a WordPress installation with the following configuration:

| Component | Detail |
|---|---|
| WordPress Version | 7.1.1 |
| Theme | Blocksy (Codespot starter template) |
| Primary Block Plugin | Greenshift |
| Hosting | InfinityFree |
| Domain | https://zevqyn.free.je |

---

## Theme: Blocksy

ZEVQYN uses the **Blocksy** theme, initialized from a **Codespot** starter template. Blocksy provides:

- Header and footer templates
- Site-wide typography and color settings
- Page layout configuration
- Navigation menus
- Responsive design framework
- Customizer integration

### Customizer CSS

Custom CSS rules are added through WordPress Customizer (`Appearance → Customize → Additional CSS`). These rules are preserved in `assets/css/custom-theme.css` and handle:

- Hiding WordPress-generated page titles on application pages (Login page-id-1237, Register page-id-1251, Dashboard page-id-1269)
- Hiding the public "Get Started" CTA button on the Dashboard page
- Map icon vertical alignment fix

### Theme Dependency

The Blocksy theme controls:
- Site-wide header and navigation
- Footer layout
- Default page structure (entry-header, entry-content, etc.)
- Global color palette CSS variables (`--theme-palette-color-1` through `--theme-palette-color-8`)
- Typography settings

Application pages override many of these defaults using `display: none !important` rules.

---

## Block Plugin: Greenshift

**Greenshift** is the primary block editor plugin used for building marketing pages. It provides:

- Advanced row/column layouts with responsive breakpoints
- Container blocks with background effects, overlays, and custom CSS
- Styled heading and text blocks
- Button components with hover effects
- Animated number counters
- Icon boxes and icon lists
- Image blocks with advanced positioning

### Greenshift Block Attributes

Greenshift stores extensive styling configuration in block JSON attributes. For example, a container block might include:

```json
{
    "id": "gsbp-2966556",
    "background": {
        "backgroundState": "Gradient",
        "gradient": "linear-gradient(180deg,rgba(10,43,18,0.42) 0%,rgb(12,12,12) 64%)"
    },
    "border": {
        "borderRadius": {
            "values": { "topLeft": ["12px"], "topRight": ["12px"] }
        }
    },
    "responsive": {
        "customcss": "{CURRENT}{\nbackdrop-filter: blur(3px);\n}"
    }
}
```

These attributes are rendered by the Greenshift plugin runtime. Without the plugin, the raw HTML shows semantic structure but lacks visual styling.

### Greenshift Style Book

The export includes a `gspbstylebook` post type (ID: 77) which contains Greenshift's global style configuration.

---

## How Custom Code is Used

### wp:html Blocks

The majority of ZEVQYN's application functionality is implemented as custom HTML, CSS, and JavaScript injected via WordPress `wp:html` blocks. This approach:

1. Allows full control over the rendered output
2. Bypasses WordPress/Blocksy theme restrictions
3. Enables SPA-like behavior within WordPress pages
4. Supports direct Supabase and backend API integration

### Per-Page Architecture

Each application page follows this pattern:

```
WordPress Page
└── wp:html block
    ├── <script data-wp-block-html="js">
    │   └── Full application JavaScript (IIFE)
    ├── <style data-wp-block-html="css">
    │   └── Full scoped CSS stylesheet
    └── HTML structure
        └── Complete application UI
```

The `data-wp-block-html` attribute is added by WordPress to identify script/style content within HTML blocks.

---

## Important Notes

### WXR XML Is Not a Full Backup

The WordPress WXR (WordPress eXtended RSS) export file included in this repository is a **content export**, not a complete backup. It contains:

- ✅ Page and post content
- ✅ Block markup with attributes
- ✅ Custom Customizer CSS
- ✅ Navigation menu structure
- ✅ Media attachment metadata and URLs
- ✅ Author information
- ✅ Categories and tags

It does **NOT** contain:

- ❌ WordPress core files
- ❌ Theme files (Blocksy)
- ❌ Plugin files (Greenshift, etc.)
- ❌ Theme Customizer settings (colors, fonts, layout)
- ❌ Widget configurations
- ❌ Actual uploaded media files
- ❌ Database schema or user data
- ❌ PHP configuration
- ❌ Server configuration

### Reconstructing the Frontend

To reconstruct the ZEVQYN frontend from this archive:

1. Install WordPress 7.1.x
2. Install and activate the Blocksy theme
3. Import the Codespot starter template via Blocksy
4. Install and activate the Greenshift plugin
5. Import the WXR XML file via `Tools → Import → WordPress`
6. Upload all media files to `wp-content/uploads/`
7. Configure the Customizer CSS from `assets/css/custom-theme.css`
8. Verify navigation menus
9. Set the Home page as the static front page

> **Warning:** Steps 2-4 require specific plugin/theme versions that were current at the time of export. Future versions may render differently.

### WordPress Encoding Issue

WordPress has been observed to encode `&&` (JavaScript logical AND) as `&#038;&#038;` inside certain code blocks. This affects:

- JavaScript `if` conditions with `&&`
- Logical expressions
- Template literals with `&&`

The ZEVQYN V1 code has been written to **avoid** this issue by using alternative patterns:

- Separate `if` statements instead of `&&` chaining
- `Promise.all()` instead of sequential `await` with `&&`
- Explicit boolean checks

If editing code within WordPress HTML blocks, be aware that saving content through the block editor may encode `&&` to HTML entities, breaking JavaScript execution.

**Recommendation:** When editing JavaScript in WordPress HTML blocks, always test the rendered output. If `&&` is being encoded, consider:
- Using WordPress's Code Editor mode instead of Visual Editor
- Testing with the browser console for syntax errors after saving

### Navigation Menus

The export contains two navigation menus:

1. **Main Menu** (term_id: 6) — Primary site navigation
2. **Secondary Footer Menu** (term_id: 7) — Footer navigation

Menu items reference page objects by post ID:
- Home (ID: 2)
- About (ID: 12)
- Contact (ID: 16)
- Features (ID: 1184)
- How It Works (ID: 1186)

### Site Identity

| Setting | Value |
|---|---|
| Site Title | ZEVQYN |
| Tagline | AI Research + Career Workspace |
| Favicon | `wp-content/uploads/2026/09/cropped-111-32x32.png` |
| Logo | `wp-content/uploads/2026/09/logo.png` (also `wp-content/uploads/2025/10/logo.svg`) |
