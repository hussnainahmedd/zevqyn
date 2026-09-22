# ZEVQYN V1.1 Research Workspace Page — WordPress Migration Guide

> **Target Page:** Research Workspace (`/research-workspace/`)  
> **Source Files in Repo:** `pages/research-workspace/wordpress-blocks.html`, `style.css`, `script.js`, `content.html`  
> **Target Environment:** WordPress 7.1.x + Blocksy Theme  
> **Risk Classification:** HIGH RISK (CSS-First Refinement)  

---

## What Was Refined in V1.1 (CSS-First)

1. **Scholarly Split Studio:** Refined the 2-column layout on desktop: dedicated Knowledge Base drawer ($360\text{px}$) and expansive reading/chat studio ($1\text{fr}$).
2. **Chat Stream Readability:** High-contrast message surfaces with clean, understated citation pills (`.zev-citation-chip`) showing exact page references.
3. **Refined Generative Study Tools:** Segmented tab controls for Summaries, Key Points, Questions, and Flashcards with 3D flip transform that eliminates visual clipping.
4. **Research Conversation Deletion & History (V1.1 Backend Integration):**
   - Added a "Saved Chats" panel in the Knowledge Base drawer displaying all conversations in the workspace.
   - Click to switch active conversation and retrieve full message history via `GET /api/v1/workspaces/{workspace_id}/conversations/{conversation_id}/messages`.
   - Clear confirmation modal (`#zevqyn-delete-conv-modal`) prevents accidental deletion.
   - Authenticated deletion via `DELETE /api/v1/workspaces/{workspace_id}/conversations/{conversation_id}`.
   - Deletes message records from database cascade; if active conversation was deleted, resets chat studio to clean prompt state.
   - Scope-guarded: strictly research conversations; career conversations cannot be affected.
5. **Preserved Core RAG Logic:** All file uploads, background indexing polling, citation regex sanitization, study tools, and project conversions remain 100% operational.
6. **Full Focus Rings & a11y:** Added `:focus-visible` styling to all input fields, buttons, and conversation items.

---

## Step-by-Step Migration Instructions

1. Log into WordPress Admin (`/wp-admin/`).
2. Navigate to **Pages $\to$ All Pages $\to$ Research Workspace**.
3. Switch to **Code Editor** mode.
4. Replace all content with `pages/research-workspace/wordpress-blocks.html`.
5. Switch back to **Visual Editor** mode.
6. Under **Blocksy Settings**, verify **Page Title** is **Disabled** and layout is **Full Width (No Sidebar)**.
7. Click **Update**.

---

## Verification After Migration

- Open an existing research workspace (`/research-workspace/?id=<uuid>`).
- Upload a test PDF and verify indexing progress completes.
- Send a question in the chat and verify grounded response with citation pills.
- Verify the conversation appears under "Saved Chats" in the left panel.
- Click a previous conversation in "Saved Chats" and verify its message history loads.
- Click the delete button (`×`) on a saved chat:
  - Verify confirmation modal displays ("Delete conversation?").
  - Click "Cancel" and verify modal closes with no changes.
  - Re-open modal and click "Delete":
    - Verify conversation is removed from the sidebar.
    - If the deleted chat was currently open, verify the chat pane resets to a clean empty state.
    - Verify conversation count decrements in stats.
- Switch to Study Tools and test generating a Summary and flipping Flashcards.
- Verify "Create Project" proposal preview populates.

---

## Rollback Notes

If conversation deletion issues arise:
- Revert `pages/research-workspace/wordpress-blocks.html` to commit `28f8d94`.
- Backend conversation records remain intact in Supabase PostgreSQL unless deleted by user.
