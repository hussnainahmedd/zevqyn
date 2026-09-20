# ZEVQYN Architecture

## System Overview

ZEVQYN is a full-stack AI-powered research and career workspace. The system is composed of three primary layers: a WordPress frontend, a FastAPI backend, and data/AI services.

```
┌──────────────────────────────────────────────────────────────────┐
│                        BROWSER (User)                            │
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────────┐  │
│  │ Marketing│  │   Auth   │  │   App    │  │  Public Pages  │  │
│  │  Pages   │  │  Pages   │  │  Pages   │  │  (Portfolio)   │  │
│  └──────────┘  └──────────┘  └──────────┘  └────────────────┘  │
└───────────────────────┬──────────────────────────────────────────┘
                        │
         ┌──────────────┼──────────────────┐
         │              │                  │
         ▼              ▼                  ▼
┌────────────┐  ┌──────────────┐  ┌────────────────┐
│ WordPress  │  │ Supabase     │  │ FastAPI        │
│ Frontend   │  │ Auth (Direct)│  │ Backend        │
│ (Static)   │  │              │  │ (REST API)     │
└────────────┘  └──────────────┘  └───┬────────┬───┘
                                      │        │
                              ┌───────▼──┐  ┌──▼───────────┐
                              │ Supabase │  │ Google       │
                              │ Database │  │ Gemini       │
                              │ Storage  │  │ AI + RAG     │
                              │ pgvector │  │ Embeddings   │
                              └──────────┘  └──────────────┘
```

---

## Frontend Layer

### WordPress + Blocksy + Greenshift

The V1 frontend is a WordPress installation using the **Blocksy theme** (started from a Codespot template) with the **Greenshift** block editor plugin.

**Two types of pages exist:**

1. **Marketing Pages** (Home) — Built entirely with Greenshift Gutenberg blocks. The visual layout, styling, and responsive behavior are encoded in block JSON attributes. These pages require the Greenshift plugin runtime to render correctly.

2. **Application Pages** (Dashboard, Research, Projects, Career, Resume, Portfolio, Career AI, Settings, Admin Inbox, and all workspace pages) — Built as **self-contained SPAs inside `wp:html` blocks**. Each page contains its own `<style>`, `<script>`, and HTML structure. These pages aggressively override WordPress/Blocksy theme elements (hiding headers, page titles, etc.) to present a full-viewport custom application UI.

3. **Mixed Pages** (Login, Register) — Use Greenshift blocks for the page layout but embed custom `wp:html` blocks containing the authentication forms and JavaScript.

4. **Static Marketing Pages** (Features, How It Works, About, Contact) — Built as custom HTML/CSS/JS within `wp:html` blocks, but without backend data integration.

### Client-Side Authentication

Application pages load the **Supabase JavaScript SDK v2** from CDN and use it for:
- Session management (`auth.getSession()`)
- User authentication (`auth.signInWithPassword()`, `auth.signUp()`)
- Token retrieval for backend API calls
- Password management (`auth.updateUser()`, `auth.resetPasswordForEmail()`)
- Sign-out (`auth.signOut()`)

Unauthenticated users are automatically redirected to `/login/`.

### API Communication Pattern

Application pages communicate with the FastAPI backend using this pattern:

```javascript
// 1. Get Supabase session token
const session = await supabaseClient.auth.getSession();
const token = session.data.session.access_token;

// 2. Make authenticated API request
const response = await fetch(BACKEND_URL + '/api/v1/endpoint', {
    headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
    }
});
```

---

## Backend Layer

### FastAPI (Python)

The backend is a Python FastAPI application hosted on Render.

**Production URL:** `https://zevqyn-backend.onrender.com`

**API Base Path:** `/api/v1/`

### Key API Endpoint Groups

| Endpoint Group | Purpose |
|---|---|
| `/api/v1/workspaces` | Research workspace CRUD |
| `/api/v1/workspaces/{id}/documents` | Document upload, download, delete, index |
| `/api/v1/workspaces/{id}/chat` | RAG-powered AI conversation |
| `/api/v1/workspaces/{id}/conversations` | Chat history management |
| `/api/v1/workspaces/{id}/research/*` | AI tools (summary, key-points, questions, flashcards, create-project) |
| `/api/v1/projects` | Project CRUD |
| `/api/v1/profile` | User profile management |
| `/api/v1/career/skills` | Skills CRUD |
| `/api/v1/career/education` | Education CRUD |
| `/api/v1/career/certificates` | Certificates CRUD |
| `/api/v1/resumes` | Resume CRUD |
| `/api/v1/resumes/{id}/items` | Resume item attachment |
| `/api/v1/resumes/{id}/pdf` | PDF generation |
| `/api/v1/portfolios` | Portfolio CRUD |
| `/api/v1/portfolios/{id}/*` | Portfolio item management |
| `/api/v1/public/portfolios/{slug}` | Public portfolio data (unauthenticated) |
| `/api/v1/career/ai/*` | Career AI tools and chat |
| `/api/v1/contact` | Contact form submission |
| `/api/v1/contact/messages` | Admin message management |

---

## Data Layer

### Supabase PostgreSQL

Primary database storing all application data:
- User profiles
- Research workspaces and documents
- Projects and career records
- Resumes and portfolios
- AI conversation history
- Contact form submissions

### Supabase Auth

Handles user registration, login, session management, and password operations. The frontend interacts directly with Supabase Auth using the publishable browser key.

### Supabase Storage

Stores uploaded research documents (PDF, DOCX, TXT, MD files).

### pgvector

PostgreSQL extension for vector similarity search, used for RAG document retrieval.

---

## AI Layer

### Google Gemini

Large Language Model used for:
- RAG-powered document Q&A
- Research summaries, key points, questions, flashcards
- Research-to-project conversion
- Career analysis and skill gap assessment
- Resume and portfolio review
- Career action plan generation

### Embeddings

Google Gemini embeddings are used to vectorize document chunks for semantic search.

### RAG Architecture

```
User Question
     │
     ▼
┌──────────────┐
│ Embed Query  │
│ (Gemini)     │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Vector Search│
│ (pgvector)   │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Retrieve     │
│ Source Chunks │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Generate     │
│ Response     │
│ (Gemini +    │
│  Sources)    │
└──────┬───────┘
       │
       ▼
  AI Response
  with Source
  Citations
```

---

## Deployment Architecture

| Component | Service | URL |
|---|---|---|
| Frontend | InfinityFree (WordPress) | https://zevqyn.free.je |
| Backend | Render (Python/FastAPI) | https://zevqyn-backend.onrender.com |
| Database | Supabase | https://phjizxajnigiiawitkyx.supabase.co |
| AI | Google Cloud (Gemini API) | — |
| Source Code | GitHub | https://github.com/hussnainahmedd/zevqyn |

---

## Authentication Flow

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  User    │────▶│  Login   │────▶│ Supabase │────▶│ Session  │
│  Browser │     │  Page    │     │   Auth   │     │  Token   │
└──────────┘     └──────────┘     └──────────┘     └────┬─────┘
                                                        │
                                          ┌─────────────┼─────────────┐
                                          │             │             │
                                          ▼             ▼             ▼
                                    ┌──────────┐ ┌──────────┐ ┌──────────┐
                                    │ Frontend │ │ Backend  │ │ Supabase │
                                    │ Session  │ │ Bearer   │ │ Direct   │
                                    │ Check    │ │ Token    │ │ Queries  │
                                    └──────────┘ └──────────┘ └──────────┘
```

1. User enters credentials on the Login page
2. Frontend calls Supabase Auth `signInWithPassword()`
3. Supabase returns session with JWT access token
4. Token is used for:
   - Frontend session validation (redirect if expired)
   - Backend API authorization (`Authorization: Bearer <token>`)
   - Direct Supabase operations (settings page)
