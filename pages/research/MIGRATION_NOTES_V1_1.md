# ZEVQYN V1.1 Research Hub Page — WordPress Migration Guide

> **Target Page:** Research (`/research/`)  
> **Source Files in Repo:** `pages/research/wordpress-blocks.html`, `style.css`, `script.js`, `content.html`  
> **Target Environment:** WordPress 7.1.x + Blocksy Theme  

---

## What Was Refined in V1.1

1. **Scholarly Catalog Hierarchy:** Styled workspace items as clean document knowledge tiles with exact document counters and metadata.
2. **Eliminated Bottom Marketing Clutter:** Removed repetitive static cards to keep the user's attention anchored on active workspaces.
3. **Preserved Real-Time Filtering:** Maintained client-side full-text search across titles and descriptions, sorting (recent, newest, oldest, name).
4. **Preserved Workspace Creation Modal:** Maintained modal form DOM bindings and API call to `POST /api/v1/workspaces`.
5. **Global Documents Integration (V1.1 Backend Integration):**
   - Added "Documents" navigation link in sidebar pointing to `/documents/`.
   - Connected "Documents" stat tile (`#zevqyn-document-count`) directly to `/documents/`.
   - Optimized document count loading to query `GET /api/v1/documents?limit=100` once, replacing N+1 per-workspace calls while maintaining fallback safety.
6. **Preserved DOM IDs:** `zevqyn-create-message`, `zevqyn-user-name`, `zevqyn-user-email`, `zevqyn-user-avatar`, `zevqyn-research-loading`, `zevqyn-workspace-grid`, `zevqyn-empty-state`, `zevqyn-workspace-count`, `zevqyn-document-count`, `zevqyn-chat-count`, `zevqyn-research-search`, `zevqyn-research-sort`, `zevqyn-create-modal`, `zevqyn-research-title`, `zevqyn-create-research-form`, `zevqyn-research-description`, `zevqyn-create-btn`, `zevqyn-new-research`, `zevqyn-empty-create`, `zevqyn-modal-close`, `zevqyn-modal-cancel`, `zevqyn-signout`.

---

## Step-by-Step Migration Instructions

1. Log into WordPress Admin (`/wp-admin/`).
2. Navigate to **Pages $\to$ All Pages $\to$ Research**.
3. Switch to **Code Editor** mode.
4. Replace all content with `pages/research/wordpress-blocks.html`.
5. Switch back to **Visual Editor** mode.
6. Under **Blocksy Settings**, verify **Page Title** is **Disabled** and layout is **Full Width (No Sidebar)**.
7. Click **Update**.

---

## Verification After Migration

- Test searching workspaces by typing in the search box.
- Test sorting by name and date.
- Test opening "+ New Workspace" modal and creating a test workspace.
- Verify clicking a workspace card navigates to `/research-workspace/?id=...`.
- Verify clicking the "Documents →" stat tile navigates to `/documents/`.
- Verify sidebar contains "Documents" link navigating to `/documents/`.
