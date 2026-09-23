# ZEVQYN V1.1 Admin Contact Inbox — WordPress Migration Guide

> **Target Page:** Admin Contact Inbox (`/admin-inbox/`)  
> **Source Files in Repo:** `pages/admin-inbox/wordpress-blocks.html`, `style.css`, `script.js`, `content.html`  
> **Target Environment:** WordPress 7.1.x + Blocksy Theme  

---

## What Was Refined in V1.1

1. **Modern Mail Client Split View:** Re-engineered the master-detail inbox layout with clean border dividers, high contrast unread indicators, and message preview cards.
2. **Standardized Surfaces & Typography:** Mapped stat counters, search bar, status filter dropdowns, and message body cards to the V1.1 Design System.
3. **Preserved Admin API Contracts (Zero JS Changes):**
   - Admin token authentication and session headers remain untouched.
   - All 21,767 bytes of `script.js` are 100% intact.
   - Message status updating (`PATCH /api/v1/contact/{id}`) works seamlessly.
   - Exact DOM IDs preserved:
     - Header/Stats: `zai-total-count`, `zai-new-count`, `zai-read-count`, `zai-replied-count`
     - Toolbar: `zai-search`, `zai-filter`, `zai-refresh`
     - Status: `zai-status`
     - Master List: `zai-list-count`, `zai-list`
     - Detail Panel: `zai-detail-empty`, `zai-detail-content`, `zai-subject`, `zai-date`, `zai-status-pill`, `zai-sender`, `zai-email`, `zai-category`, `zai-message`, `zai-status-select`, `zai-update-status`, `zai-reply-btn`

---

## Step-by-Step Migration Instructions

1. Log into WordPress Admin (`/wp-admin/`).
2. Navigate to **Pages $\to$ All Pages $\to$ Contact Inbox** (Slug: `admin-inbox`).
3. Switch to **Code Editor** mode.
4. Replace all content with `pages/admin-inbox/wordpress-blocks.html`.
5. Switch back to **Visual Editor** mode.
6. Under **Blocksy Settings**, verify **Page Title** is **Disabled** and layout is **Full Width (No Sidebar)**.
7. Click **Update**.

---

## Verification After Migration

- Navigate to `/admin-inbox/` while authenticated as an administrator.
- Verify contact messages load into the master list on the left.
- Click a message in the list and verify the detail view loads on the right with sender, email, category, and message body.
- Test changing status (e.g. from New to Read or Replied) and clicking "Save status" — verify status pill updates.
- Test searching messages and filtering by status dropdown.
