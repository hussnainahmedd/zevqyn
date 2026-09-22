# ZEVQYN V1.1 Dashboard Page — WordPress Migration Guide

> **Target Page:** Dashboard (`/dashboard/`)  
> **Source Files in Repo:** `pages/dashboard/wordpress-blocks.html`, `style.css`, `script.js`, `content.html`  
> **Target Environment:** WordPress 7.1.x + Blocksy Theme  

---

## What Was Refined in V1.1

1. **High Information Density:** Transformed the dashboard from a marketing-like presentation into an engineering-grade overview tool.
2. **Compact Metric Indicator Tiles:** Clean $20\text{px}$ padding tiles with crisp 1px borders replacing bulky containers.
3. **Refined Stepper Progress Bar:** Clean linear milestone tracking without gamified neon halos.
4. **Preserved Multi-Endpoint Aggregation:** Preserved 100% of the parallel fetch logic querying `/workspaces`, `/workspaces/{id}/documents`, `/projects`, `/profile`, `/resumes`, and `/portfolios`.
5. **Preserved DOM IDs:** `zevqyn-user-name`, `zevqyn-user-email`, `zevqyn-user-avatar`, `zevqyn-welcome`, `zevqyn-research-count`, `zevqyn-document-count`, `zevqyn-project-count`, `zevqyn-profile-completion`, `zevqyn-recent-research`, `.zev-progress span`, `zevqyn-signout`.

---

## Step-by-Step Migration Instructions

1. Log into WordPress Admin (`/wp-admin/`).
2. Navigate to **Pages $\to$ All Pages $\to$ Dashboard**.
3. Switch to **Code Editor** mode.
4. Replace all content with `pages/dashboard/wordpress-blocks.html`.
5. Switch back to **Visual Editor** mode.
6. Under **Blocksy Settings**, verify **Page Title** is **Disabled** and layout is **Full Width (No Sidebar)**.
7. Click **Update**.

---

## Verification After Migration

- Log into an account and open `/dashboard/`.
- Verify user name and email display properly in the sidebar.
- Verify workspace, document, and project counters display accurate numbers.
- Verify clicking a recent workspace navigates to `/research-workspace/?id=...`.
- Verify "Sign Out" cleanly terminates the session.
