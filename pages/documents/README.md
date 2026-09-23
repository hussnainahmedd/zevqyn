# ZEVQYN Global Document Library

> **Route:** `/documents/`  
> **Status:** Published (V1.1 Integration)  
> **Scope:** Central cross-workspace document explorer and management suite  

---

## Overview

The **Global Document Library** provides authenticated ZEVQYN users with a centralized, high-density view of all source documents uploaded across all research workspaces.

Previously, documents were siloed inside individual research workspaces. V1.1 exposes the backend global document query engine (`GET /api/v1/documents`), enabling unified search, metadata inspection, status tracking, and direct workspace navigation.

---

## Key Features

1. **Cross-Workspace Document Aggregation:**
   - Queries `GET /api/v1/documents` with server-side pagination (`limit <= 100`, `offset`).
   - Automatically maps `workspace_id` to human-readable workspace titles via cached `GET /api/v1/workspaces`.
2. **Server-Side Search & Multi-Dimensional Filtering:**
   - **Filename Search:** Debounced substring search on `original_filename` (`search=...`).
   - **Workspace Filter:** Single workspace isolation (`workspace_id=...`).
   - **File Type Filter:** Filter by extension (`file_type=pdf|docx|txt|md`).
   - **Status Filter:** Filter by processing status (`status=indexed|uploaded|extracting`).
3. **Institutional V1.1 Design:**
   - Deep obsidian canvas (`#0B0D11`) and surface cards (`#181C24`).
   - File format badges with distinctive semantic accents.
   - Status pills with WCAG 4.5:1+ contrast.
   - Formatted human-readable file sizes and creation dates.
   - Zero exposure of private backend storage paths.
4. **Direct Workspace Navigation:**
   - Each card provides a direct link to open that document's research studio (`/research-workspace/?id={workspace_id}`).

---

## File Structure

```
pages/documents/
├── content.html          # Clean HTML structure
├── style.css             # Scoped CSS with V1.1 design tokens & responsive breakpoints
├── script.js             # Vanilla JS client logic (Supabase auth, API requests)
├── wordpress-blocks.html # Ready-to-paste WordPress Gutenberg block markup
├── README.md             # This file
└── MIGRATION_NOTES_V1_1.md # WordPress migration and testing documentation
```
