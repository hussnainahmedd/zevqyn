# ZEVQYN V1.1 Home Page — WordPress Migration & Deployment Guide

> **Target Page:** Homepage (`/home/` or root URL `/`)  
> **Source Files in Repo:** `pages/home/wordpress-blocks.html`, `style.css`, `script.js`, `content.html`  
> **Target Environment:** WordPress 7.1.x + Blocksy Theme  
> **Skill Level Required:** Standard WordPress Admin (No coding required)  

---

## Executive Overview of Changes

In ZEVQYN V1.0, the homepage relied on 13 nested Greenshift Gutenberg rows with 10 continuous `.border-animation` classes and heavy linear gradients. 

In ZEVQYN V1.1, the homepage has been refined into a **single, unified, high-performance HTML/CSS block** (identical to how the other 18 ZEVQYN pages operate). This removes the "AI-generated template" aesthetic, eliminates 20 spinning border loops, standardizes the dark obsidian palette, and establishes an editorial hierarchy with authentic product UI previews.

---

## Pre-Migration Checklist (Safety First)

Before making any changes in the WordPress Admin dashboard:

1. **Verify You Have Admin Access:** Log in to `https://zevqyn.free.je/wp-admin/`.
2. **Do Not Delete the Existing Page:** You will be updating the content of the existing `Home` page (ID: 2).
3. **Backup Current Block Code:** 
   - Open **Pages $\to$ All Pages $\to$ Home**.
   - In the top-right corner, click the **Three Dots (⋮) $\to$ Code Editor**.
   - Copy the entire existing text and save it to a local text file named `backup-home-v1.0.txt`.

---

## Step-by-Step Migration Instructions

### Step 1: Apply the Shared V1.1 Theme Foundation (One-Time Setup)

The V1.1 homepage uses the shared CSS custom properties defined in `assets/css/custom-theme.css`.

1. In WordPress Admin, navigate to **Appearance $\to$ Customize $\to$ Additional CSS**.
2. Open the file `assets/css/custom-theme.css` from this repository.
3. Replace the contents of the **Additional CSS** field with the contents of `assets/css/custom-theme.css`.
4. Click **Publish**.

> *Note:* This preserves the existing title-hiding rules for Login, Register, and Dashboard while adding the `--zev-*` design tokens site-wide.

---

### Step 2: Upload the Hero Overview Asset

The refined V1.1 hero displays the high-fidelity overview graphic instead of abstract dark-green graphics.

1. In WordPress Admin, go to **Media $\to$ Add New**.
2. Upload `assets/images/zevqyn-overview.jpg` from this repository.
3. Once uploaded, copy the **File URL** (it will look like: `https://zevqyn.free.je/wp-content/uploads/2026/09/zevqyn-overview.jpg`).
4. *(Optional)* If the image is at a different URL, replace `assets/images/zevqyn-overview.jpg` in `pages/home/content.html` with that URL. By default, relative asset paths will resolve automatically if using the repository structure.

---

### Step 3: Replace the Homepage Content

1. In WordPress Admin, navigate to **Pages $\to$ All Pages $\to$ Home**.
2. Switch to **Code Editor** mode (click the top-right **⋮** menu and select **Code Editor**, or press `Ctrl + Shift + Alt + M` on Windows).
3. Select everything in the editor (`Ctrl + A`) and delete it.
4. Open the file `pages/home/wordpress-blocks.html` from this repository in a text editor (Notepad, VS Code, etc.).
5. Select all text (`Ctrl + A`) and copy it (`Ctrl + C`).
6. Paste the copied block into the WordPress Code Editor (`Ctrl + V`).
7. Click the top-right **⋮** menu and switch back to **Visual Editor** mode.
8. You should see a single, clean Custom HTML block containing the refined V1.1 layout.
9. Click **Update** (or **Save**).

---

### Step 4: Blocksy Page Layout Settings Verification

In the right-hand sidebar under **Page / Blocksy Settings**:

1. **Page Title:** Ensure **Disabled / Hide** is selected (this prevents WordPress from rendering a default "Home" title bar).
2. **Page Structure / Layout:** Ensure **Normal** or **Full Width (No Sidebar)** is selected.
3. **Content Area Padding:** Ensure vertical padding is set to default or disabled (the V1.1 code manages its own container padding).

---

## What Was Removed or Replaced

| V1.0 Feature | V1.1 Refinement | Reason |
|---|---|---|
| 10x `.border-animation` loops | Replaced with static, crisp 1px borders (`--zev-border-default`) | Eliminates distracting neon border spinning; reduces CPU usage. |
| Multiple conflicting green gradients | Replaced with clean obsidian foundation (`#090b0e`, `#0f1217`, `#151921`) | Removes muddy, oversaturated dark green background clutter. |
| "Learn more information" button (no link) | Replaced with `<a href="/features/">Explore Features</a>` | Fixes dead CTA; properly routes users into feature details. |
| Repetitive 3x3 icon + heading cards | Replaced with editorial 4-step milestone cards and technical rigor section | Creates varied section rhythm instead of endless card grids. |
| Generic stock imagery | Replaced with authentic ZEVQYN workspace overview visual | Builds credibility by showing the real platform. |

---

## What Was Preserved Untouched

- **Brand Slogan & Positioning:** *"Turn Research Into Your Career Advantage"* remains the primary headline.
- **Core Product Journey:** `Research → Project → Resume → Portfolio → Career Growth` remains the central architectural concept.
- **Call-to-Action Destinations:** Primary buttons route to `/register/`. Secondary links route to `/features/`, `/how-it-works/`, and `/about/`.
- **Zero Hallucinated Content:** No fake testimonials, fake partner logos, or fake user statistics were introduced.

---

## Rollback Procedure (In Case of Emergency)

If you need to instantly restore the original V1.0 homepage:

1. In WordPress Admin, open **Pages $\to$ All Pages $\to$ Home**.
2. Switch to **Code Editor** mode.
3. Delete all content in the editor.
4. Paste the text from your `backup-home-v1.0.txt` file (or from Git commit `c718f62` in the `main` branch).
5. Click **Update**.
6. Clear your browser cache and refresh the homepage.
