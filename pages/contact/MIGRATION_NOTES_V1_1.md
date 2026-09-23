# WordPress Migration Notes V1.1

## Overview
This bundle has been completely normalized to the V1.1 design system. It uses the exact same typography, spacing, and variable scale as the Home and Features pages.

## Deployment Checklist
1. Open the WordPress editor for this page.
2. Delete the existing blocks.
3. Paste the contents of wordpress-blocks.html as Custom HTML.
4. Verify that the page matches the V1.1 aesthetic (dark surface, no neon glow, correct font hierarchy).
5. Ensure Page Title is hidden in Blocksy settings.
6. Verify responsive layout on mobile.

## API Notes (Contact only)
For the Contact page, ensure that the POST /api/v1/contact endpoint continues to receive payloads in the identical format as before. The JS structure was strictly preserved.

## Rollback
If the layout fails to render properly, revert the WordPress revision history to the immediately preceding version.
