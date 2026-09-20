# Assets

This directory contains CSS and other assets extracted from the WordPress Customizer and theme configuration.

## Contents

### css/custom-theme.css

Custom CSS rules added through the WordPress Customizer (`Appearance → Customize → Additional CSS`). These rules apply globally across the ZEVQYN site and handle:

- Hiding WordPress-generated page titles on app pages (Login, Register, Dashboard)
- Hiding the public "Get Started" CTA button on authenticated pages
- Map icon alignment fix

### Media Assets

Media files (images, icons, SVGs) are hosted on the production WordPress installation and referenced via absolute URLs. They are **not** included in this repository. See the [Extraction Report](../docs/EXTRACTION_REPORT.md) for a complete list of media URLs.

Production media base URL:
```
https://zevqyn.free.je/wp-content/uploads/
```
