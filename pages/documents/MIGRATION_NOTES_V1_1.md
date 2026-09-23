# ZEVQYN V1.1 Global Documents Library — WordPress Migration Guide

> **Target Page:** Documents Library (`/documents/`)  
> **Source Files in Repo:** `pages/documents/wordpress-blocks.html`, `style.css`, `script.js`, `content.html`  
> **Target Environment:** WordPress 7.1.x + Blocksy Theme  
> **Risk Classification:** LOW RISK (New Additive Module)  

---

## Architectural Context

The Global Documents Library is a new V1.1 module integrating the backend `GET /api/v1/documents` endpoint. It allows users to view, search, and filter all uploaded documents across all research workspaces from a single dashboard.

---

## Step-by-Step WordPress Migration Instructions

1. Log into WordPress Admin (`/wp-admin/`).
2. Navigate to **Pages $\to$ Add New Page**.
3. Set the page title to **Documents**.
4. Set the page permalink slug to `documents` (accessible at `/documents/`).
5. Switch to **Code Editor** mode (Ctrl+Shift+Alt+M or top-right three dots).
6. Paste the entire contents of `pages/documents/wordpress-blocks.html`.
7. Switch back to **Visual Editor** mode.
8. Under **Blocksy Settings** (right sidebar):
   - **Page Title:** Disabled
   - **Page Structure:** Normal / Full Width
   - **Sidebar:** None
   - **Header / Footer:** Visible
9. Click **Publish**.
10. Navigate to **Appearance $\to$ Menus** and add the Documents page to the primary application menu if desired.

---

## Verification After Migration

- Navigate to `/documents/` while authenticated with Supabase.
- Verify total documents and workspace counts match reality.
- Test searching by filename in the search box.
- Test filtering by workspace, file type (PDF, DOCX, TXT, MD), and status.
- Verify clicking "Open in Workspace →" correctly navigates to `/research-workspace/?id=<uuid>`.
- Test pagination by clicking "Load More Documents" if more than 50 documents exist.
- Verify responsive layout across desktop (1440px), tablet (768px), and mobile (390px).

---

## Rollback Notes

If the Documents page requires rollback:
- Trash the WordPress page `/documents/`.
- No database records or backend endpoints are modified by removing this frontend page.
