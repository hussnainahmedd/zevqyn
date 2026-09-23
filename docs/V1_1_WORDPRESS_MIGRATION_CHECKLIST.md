# ZEVQYN V1.1 WordPress Migration & Deployment Checklist

> **Target Environment:** WordPress 7.1.x + Blocksy Theme  
> **Production URL:** [https://zevqyn.free.je/](https://zevqyn.free.je/)  
> **Source Branch:** `v1.1-ui-refinement`  
> **Risk Mitigation:** Perform migrations page-by-page. Verify each page in an incognito window before proceeding to the next.  

---

## 0. Pre-Migration Safety Steps

- [ ] Take a full database and site export from **Tools $\to$ Export** in WordPress Admin.
- [ ] Ensure the latest working git branch `v1.1-ui-refinement` is cloned and available locally.
- [ ] Confirm backend API is online at [https://zevqyn-backend.onrender.com](https://zevqyn-backend.onrender.com).

---

## 1. Global Customizer CSS (Deploy First)

> **File:** [`assets/css/custom-theme.css`](../assets/css/custom-theme.css)

- [ ] Log into WordPress Admin (`/wp-admin/`).
- [ ] Navigate to **Appearance $\to$ Customize $\to$ Additional CSS**.
- [ ] Replace existing CSS with the full contents of `assets/css/custom-theme.css`.
- [ ] Click **Publish**.
- [ ] Verify that global site typography and navigation styling load without issues.

---

## 2. Marketing Pages Migration Checklist

### Home (`/`)
- [ ] Navigate to **Pages $\to$ All Pages $\to$ Home**.
- [ ] Switch to **Code Editor** mode.
- [ ] Replace content with `pages/home/wordpress-blocks.html`.
- [ ] Under Blocksy Settings: Disable Page Title, Set Full Width (No Sidebar).
- [ ] Click **Update** and verify in an incognito browser.

### Features (`/features/`)
- [ ] Navigate to **Pages $\to$ All Pages $\to$ Features**.
- [ ] Switch to **Code Editor** mode.
- [ ] Replace content with `pages/features/wordpress-blocks.html`.
- [ ] Under Blocksy Settings: Disable Page Title, Set Full Width.
- [ ] Click **Update**.

### How It Works (`/how-it-works/`)
- [ ] Navigate to **Pages $\to$ All Pages $\to$ How It Works**.
- [ ] Switch to **Code Editor** mode.
- [ ] Replace content with `pages/how-it-works/wordpress-blocks.html`.
- [ ] Under Blocksy Settings: Disable Page Title, Set Full Width.
- [ ] Click **Update**.

### About (`/about/`)
- [ ] Navigate to **Pages $\to$ All Pages $\to$ About**.
- [ ] Switch to **Code Editor** mode.
- [ ] Replace content with `pages/about/wordpress-blocks.html`.
- [ ] Under Blocksy Settings: Disable Page Title, Set Full Width.
- [ ] Click **Update**.

### Contact (`/contact/`)
- [ ] Navigate to **Pages $\to$ All Pages $\to$ Contact**.
- [ ] Switch to **Code Editor** mode.
- [ ] Replace content with `pages/contact/wordpress-blocks.html`.
- [ ] Under Blocksy Settings: Disable Page Title, Set Full Width.
- [ ] Click **Update**.
- [ ] Smoke test: Submit a test inquiry to verify AJAX submit to backend.

---

## 3. Authentication Pages Migration Checklist

### Login (`/login/`)
- [ ] Navigate to **Pages $\to$ All Pages $\to$ Login**.
- [ ] Switch to **Code Editor** mode.
- [ ] Replace content with `pages/login/wordpress-blocks.html`.
- [ ] Under Blocksy Settings: Disable Page Title, Set Full Width.
- [ ] Click **Update**.
- [ ] Smoke test: Test signing in with credentials.

### Register (`/register/`)
- [ ] Navigate to **Pages $\to$ All Pages $\to$ Register**.
- [ ] Switch to **Code Editor** mode.
- [ ] Replace content with `pages/register/wordpress-blocks.html`.
- [ ] Under Blocksy Settings: Disable Page Title, Set Full Width.
- [ ] Click **Update**.

---

## 4. Core Workspace Pages Migration Checklist

### Dashboard (`/dashboard/`)
- [ ] Navigate to **Pages $\to$ All Pages $\to$ Dashboard**.
- [ ] Switch to **Code Editor** mode.
- [ ] Replace content with `pages/dashboard/wordpress-blocks.html`.
- [ ] Under Blocksy Settings: Disable Page Title, Set Full Width.
- [ ] Click **Update**.
- [ ] Smoke test: Verify stat tiles populate with user data.

### Research Hub (`/research/`)
- [ ] Navigate to **Pages $\to$ All Pages $\to$ Research**.
- [ ] Switch to **Code Editor** mode.
- [ ] Replace content with `pages/research/wordpress-blocks.html`.
- [ ] Under Blocksy Settings: Disable Page Title, Set Full Width.
- [ ] Click **Update**.
- [ ] Smoke test: Verify document list loads and document upload modal opens.

### Research Workspace (`/research-workspace/`)
- [ ] Navigate to **Pages $\to$ All Pages $\to$ Research Workspace**.
- [ ] Switch to **Code Editor** mode.
- [ ] Replace content with `pages/research-workspace/wordpress-blocks.html`.
- [ ] Under Blocksy Settings: Disable Page Title, Set Full Width.
- [ ] Click **Update**.
- [ ] Smoke test: Open a research document workspace, test RAG document chat and flashcard tabs.

### Projects Hub (`/projects/`)
- [ ] Navigate to **Pages $\to$ All Pages $\to$ Projects**.
- [ ] Switch to **Code Editor** mode.
- [ ] Replace content with `pages/projects/wordpress-blocks.html`.
- [ ] Under Blocksy Settings: Disable Page Title, Set Full Width.
- [ ] Click **Update**.
- [ ] Smoke test: Test category filters (Research vs Manual) and project creation modal.

### Project Workspace (`/project-workspace/`)
- [ ] Navigate to **Pages $\to$ All Pages $\to$ Project Workspace**.
- [ ] Switch to **Code Editor** mode.
- [ ] Replace content with `pages/project-workspace/wordpress-blocks.html`.
- [ ] Under Blocksy Settings: Disable Page Title, Set Full Width.
- [ ] Click **Update**.
- [ ] Smoke test: Open an existing project by `?id=...`, edit title, add a technology tag, and save.

---

## 5. Career & Publishing Suite Migration Checklist

### Career Hub (`/career/`)
- [ ] Navigate to **Pages $\to$ All Pages $\to$ Career Hub**.
- [ ] Switch to **Code Editor** mode.
- [ ] Replace content with `pages/career/wordpress-blocks.html`.
- [ ] Under Blocksy Settings: Disable Page Title, Set Full Width.
- [ ] Click **Update**.
- [ ] Smoke test: Test switching tabs (Projects, Skills, Education, Certificates) and test modal creation.

### Resume Builder (`/resume/`)
- [ ] Navigate to **Pages $\to$ All Pages $\to$ Resume Builder**.
- [ ] Switch to **Code Editor** mode.
- [ ] Replace content with `pages/resume/wordpress-blocks.html`.
- [ ] Under Blocksy Settings: Disable Page Title, Set Full Width.
- [ ] Click **Update**.
- [ ] **CRITICAL TEST:** Select a resume, verify the live ATS paper preview displays accurately, and click **Export PDF** to verify authenticated PDF download works.

### Portfolio Builder (`/portfolio/`)
- [ ] Navigate to **Pages $\to$ All Pages $\to$ Portfolio Builder**.
- [ ] Switch to **Code Editor** mode.
- [ ] Replace content with `pages/portfolio/wordpress-blocks.html`.
- [ ] Under Blocksy Settings: Disable Page Title, Set Full Width.
- [ ] Click **Update**.
- [ ] Smoke test: Test attaching/detaching items and verifying live preview updates.

### Public Portfolio (`/p/`)
- [ ] Navigate to **Pages $\to$ All Pages $\to$ Public Portfolio** (Slug: `p`).
- [ ] Switch to **Code Editor** mode.
- [ ] Replace content with `pages/public-portfolio/wordpress-blocks.html`.
- [ ] Under Blocksy Settings: Disable Page Title, Set Full Width.
- [ ] Click **Update**.
- [ ] Smoke test: Visit `/p/?slug=<public_portfolio_slug>` in an incognito window without logging in.

### Career AI (`/career-ai/`)
- [ ] Navigate to **Pages $\to$ All Pages $\to$ Career AI**.
- [ ] Switch to **Code Editor** mode.
- [ ] Replace content with `pages/career-ai/wordpress-blocks.html`.
- [ ] Under Blocksy Settings: Disable Page Title, Set Full Width.
- [ ] Click **Update**.
- [ ] Smoke test: Send a message in Career AI chat to verify streaming responses; test launching one of the AI toolkit modals.

---

## 6. Settings & Administration Migration Checklist

### Settings (`/settings/`)
- [ ] Navigate to **Pages $\to$ All Pages $\to$ Settings**.
- [ ] Switch to **Code Editor** mode.
- [ ] Replace content with `pages/settings/wordpress-blocks.html`.
- [ ] Under Blocksy Settings: Disable Page Title, Set Full Width.
- [ ] Click **Update**.
- [ ] Smoke test: Test "Copy User ID" and verify sign-out button.

### Admin Contact Inbox (`/admin-inbox/`)
- [ ] Navigate to **Pages $\to$ All Pages $\to$ Contact Inbox** (Slug: `admin-inbox`).
- [ ] Switch to **Code Editor** mode.
- [ ] Replace content with `pages/admin-inbox/wordpress-blocks.html`.
- [ ] Under Blocksy Settings: Disable Page Title, Set Full Width.
- [ ] Click **Update**.
- [ ] Smoke test: Log in as admin, select a message in the master-detail list, update status to "Read".

---

## 7. Rollback Plan

If any page experiences unexpected rendering issues upon pasting:
1. In the WordPress page editor, open the **Revisions** panel on the right sidebar.
2. Select the previous revision and click **Restore This Revision**.
3. Clear browser cache and re-test.
