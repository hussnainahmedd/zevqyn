# ZEVQYN - New Frontend

AI Research + Career Workspace. Journey: **Research -> Project -> Resume -> Portfolio -> Career Growth**.

## Template direction chosen (and why)
No proprietary template code was copied. Structural research covered Framer Marketplace (AI/SaaS), Webflow AI SaaS, Cruip (Open PRO / Mosaic / Relay / Cadence), Tailwind Plus, shadcn/ui, Untitled UI, Flowbite and ThemeWagon dashboards.

**Selected direction: Cruip Mosaic-style application shell + Relay-style restrained dark marketing, rebuilt with shadcn/ui component discipline and Untitled-UI spacing/typography calibration.**

Why it won: Mosaic gives the calm, dense, table-friendly dashboard ZEVQYN Research/Documents/Resume editors need without admin-template clutter; Relay dark marketing is premium without glow cliches; shadcn primitives (owned source in src/components/ui/) keep forms/dialogs/tables consistent and accessible; Untitled 4px spacing and radius calibration prevents the random-cards look. Green (#25E879) is NOT forced - the system leads with neutral zinc/slate surfaces and an indigo primary action; ZEVQYN emerald is retained only as brand mark and positive/progress accent. Typography is Inertia/Momentum-led, not template-default.

## Inertia / Momentum typography
- Display: **Space Grotesk** (600, tracking -0.04em to -0.02em, line-height ~1.0) for heroes and section statements - editorial, directional, numbered (01/02/03) sequencing mirrors the product journey.
- UI/body: **Inter** (14-15px, line-height 1.55-1.6) for dense app tables, forms and editors. App titles capped at 24px; marketing display clamps 44-72px only where composition earns it.
- Mono: **JetBrains Mono** for citations, metadata and eyebrows. Premium comes from type + spacing + layout - not blur, glow or gradients.

## Stack
Next.js (App Router) + TypeScript + Tailwind CSS v4. Data: @tanstack/react-query; forms: react-hook-form + zod; auth/data client: @supabase/supabase-js; icons: lucide-react.

## Architecture
- src/lib/env.ts - public env only. src/lib/supabase.ts - single Supabase client (publishable key only; never service-role).
- src/lib/api/client.ts - centralized authenticated fetch (Bearer injection, 401 redirect, error normalization). src/lib/api/services.ts - typed domain services for all backend paths. No scattered raw fetch in pages.
- Backend: FastAPI at NEXT_PUBLIC_API_BASE_URL (default https://zevqyn-backend.onrender.com) with Supabase Auth JWT. Gemini runs only via the backend.
- Routes: marketing / /features /how-it-works /about /contact, auth /login /register, app /app/* (dashboard, workspaces + research studio, documents, projects, career, resume, portfolio, career-ai, settings, admin inbox), public /p/[slug] (SSR).

## Setup
npm install, copy .env.example to .env.local and fill public values, npm run dev. Build: npm run build.

Env names (values never committed):
- NEXT_PUBLIC_API_BASE_URL
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY (publishable/anon only)

## Deploy (Vercel + zevqyn.dev)
Import this repo in Vercel, set the three env vars, deploy (push -> auto-deploy). Add zevqyn.dev + www.zevqyn.dev in Vercel Domains, add the shown DNS records (A @, CNAME www) at the registrar, set apex primary. Then update Render CORS_ORIGINS to include https://zevqyn.dev and Supabase Auth redirect URLs. Domain migration is a separate step - frontend code uses relative routes, so no hard-coded frontend domain.


## License

Proprietary — © 2025–2026 ZEVQYN. All rights reserved. See [LICENSE](./LICENSE). No license is granted for use, modification, or distribution unless explicitly authorized in writing by the project owner.
