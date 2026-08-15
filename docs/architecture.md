# CodeBook — System Architecture & Project Structure (`architecture.md`)

> **Product Vision:** Notion-style digital coding notebook combining rich note-taking, hierarchical organization, and real executable Python code with structured outputs.  
> **Core Architectural Principle:** Notebook system (Next.js + Supabase) and Execution system (Python Worker + Docker Sandbox) are completely decoupled to allow independent scaling, execution security, and multi-language expansion.

---

## 1. High-Level System Architecture

```text
                                  ┌───────────────────────────────────────────────┐
                                  │             Client (Browser)                  │
                                  │  Next.js (App Router) + React + Tailwind      │
                                  │  Tiptap Editor + Monaco Code Editor + Zustand │
                                  └──────────────────────┬────────────────────────┘
                                                         │
                                    ┌────────────────────┴────────────────────┐
                                    │ HTTP / REST / WebSockets                │
                                    ▼                                         ▼
         ┌───────────────────────────────────────────┐      ┌───────────────────────────────────────────┐
         │         Notebook System (App API)         │      │        Execution Proxy (/api/execute)     │
         ├───────────────────────────────────────────┤      ├───────────────────────────────────────────┤
         │ Next.js API Routes (Serverless/Edge)      │      │ Auth Session Check & Rate Limiting        │
         │ Zod Request/Response Validation           │      │ Request Forwarding                        │
         │ Drizzle ORM                               │      └─────────────────────┬─────────────────────┘
         └─────────────────────┬─────────────────────┘                            │
                               │                                                  │ HTTP Internal API
                               ▼                                                  ▼
         ┌───────────────────────────────────────────┐      ┌───────────────────────────────────────────┐
         │       Database & Storage (Supabase)       │      │         Python Execution Worker           │
         ├───────────────────────────────────────────┤      ├───────────────────────────────────────────┤
         │ Supabase PostgreSQL (Full-Text Search)    │      │ FastAPI / HTTP Runner Server              │
         │ Supabase Auth (JWT, Email/Pass, Google)   │      │ Execution Dispatcher & Output Parser      │
         │ Supabase Storage (Generated Plot Images)  │      └─────────────────────┬─────────────────────┘
         │ Row Level Security (RLS) Multi-Tenancy    │                            │
         └───────────────────────────────────────────┘                            ▼
                                                            ┌───────────────────────────────────────────┐
                                                            │          Docker Container Sandbox         │
                                                            ├───────────────────────────────────────────┤
                                                            │ Python 3.11 Slim Runtime                  │
                                                            │ Pinned ML & Data Science Libraries        │
                                                            │ Non-Root User (`codebook_user`)           │
                                                            │ CPU (1 Core), RAM (512MB), Time (10s) Max │
                                                            │ Isolated Temp FS & Restricted Network     │
                                                            └───────────────────────────────────────────┘
```

---

## 2. Project Directory & Workspace Structure

CodeBook is structured as a clean, production-ready monorepo separating web frontend application, core database/shared packages, execution runner services, and infrastructure Docker configs.

```text
codebook/
├── apps/
│   └── web/                             # Primary Web Application (Next.js 14+ App Router)
│       ├── app/                         # App Router pages and API routes
│       │   ├── (auth)/                  # Authentication pages (login, signup, callback)
│       │   │   ├── login/page.tsx
│       │   │   └── signup/page.tsx
│       │   ├── (dashboard)/             # Main Notebook workspace routes
│       │   │   ├── layout.tsx           # Dashboard layout with AppShell, Topbar & Sidebar
│       │   │   ├── page.tsx             # Dashboard index / recent pages view
│       │   │   └── n/[notebookId]/      # Notebook view routes
│       │   │       └── [[...pagePath]]/ # Dynamic Topic & Page router
│       │   │           └── page.tsx
│       │   ├── api/                     # REST API Endpoints
│       │   │   ├── auth/callback/       # Supabase auth redirect handler
│       │   │   ├── notebooks/           # Notebook CRUD routes
│       │   │   │   └── route.ts
│       │   │   ├── topics/              # Topic & Subtopic CRUD routes
│       │   │   │   ├── route.ts
│       │   │   │   └── [id]/route.ts
│       │   │   ├── pages/               # Page & Block synchronization API
│       │   │   │   ├── route.ts
│       │   │   │   └── [id]/
│       │   │   │       ├── route.ts
│       │   │   │       └── blocks/route.ts
│       │   │   ├── search/              # Global full-text search route
│       │   │   │   └── route.ts
│       │   │   └── execute/             # Code execution proxy endpoint
│       │   │       └── route.ts
│       │   ├── layout.tsx               # Root HTML layout, font setup & providers
│       │   ├── globals.css              # Theme CSS tokens (Light/Dark variables) & Tailwind
│       │   └── providers.tsx            # QueryClientProvider, ThemeProvider, AuthProvider
│       │
│       ├── components/                  # Modular React UI Components
│       │   ├── layout/                  # App shell layout components
│       │   │   ├── app-shell.tsx        # Responsive container wrapper
│       │   │   ├── topbar.tsx           # Top navigation bar (Search, Theme, User menu)
│       │   │   └── sidebar.tsx          # Collapsible tree navigation sidebar
│       │   ├── navigation/              # Tree navigation & search UI
│       │   │   ├── topic-tree.tsx       # Hierarchical topic/subtopic tree
│       │   │   ├── topic-item.tsx       # Individual topic item with context menu
│       │   │   ├── command-menu.tsx     # Cmd+K search dialog modal
│       │   │   └── page-breadcrumbs.tsx # Header navigation breadcrumbs
│       │   ├── notebook/                # Notebook canvas & block components
│       │   │   ├── canvas.tsx           # Main notebook editing workspace
│       │   │   ├── page-header.tsx      # Page title & metadata component
│       │   │   ├── block-editor.tsx     # Tiptap rich-text block orchestrator
│       │   │   ├── blocks/              # Block-specific node components
│       │   │   │   ├── text-block.tsx   # Paragraph & heading text node
│       │   │   │   ├── code-block.tsx   # Monaco Python editor block
│       │   │   │   └── image-block.tsx  # Image attachment node
│       │   │   ├── output/              # Execution output rendering components
│       │   │   │   ├── output-block.tsx # Output container wrapper
│       │   │   │   ├── text-output.tsx  # Terminal stdout display
│       │   │   │   ├── error-output.tsx # Traceback error display panel
│       │   │   │   ├── table-output.tsx # Pandas DataFrame interactive table
│       │   │   │   └── image-output.tsx # Matplotlib plot image viewer
│       │   │   └── scratchpad.tsx       # Slide-out temporary execution drawer
│       │   └── ui/                      # Base shadcn/ui primitives
│       │       ├── button.tsx
│       │       ├── dialog.tsx
│       │       ├── dropdown-menu.tsx
│       │       ├── input.tsx
│       │       ├── tooltip.tsx
│       │       └── toast.tsx
│       │
│       ├── hooks/                       # Custom React Hooks
│       │   ├── use-auto-save.ts         # Debounced auto-save hook
│       │   ├── use-search.ts            # Cmd+K search hook
│       │   └── use-keyboard-shortcuts.ts# Global shortcut listener
│       │
│       ├── lib/                         # Application utilities & state
│       │   ├── store/                   # Zustand UI stores
│       │   │   ├── ui-store.ts          # Sidebar, Scratchpad, Active page store
│       │   │   └── theme-store.ts       # Theme preference store
│       │   ├── api/                     # TanStack Query client & fetchers
│       │   │   └── query-client.ts
│       │   └── utils.ts                 # Classname merge & helper functions
│       │
│       ├── public/                      # Static assets & favicon icons
│       ├── next.config.mjs              # Next.js build configuration
│       ├── tailwind.config.ts           # Tailwind CSS theme configuration
│       ├── tsconfig.json                # TypeScript configuration
│       └── package.json                 # Web app dependencies
│
├── packages/                            # Shared Workspace Packages
│   ├── db/                              # Database layer
│   │   ├── src/
│   │   │   ├── index.ts                 # Drizzle connection client
│   │   │   ├── schema.ts                # PostgreSQL tables, relations & indexes
│   │   │   └── migrate.ts               # Migration runner script
│   │   ├── drizzle/                     # Generated SQL migrations
│   │   ├── drizzle.config.ts            # Drizzle kit configuration
│   │   └── package.json
│   │
│   ├── types/                           # Shared TypeScript Type Definitions
│   │   ├── src/
│   │   │   ├── notebook.ts              # Notebook, Topic, Page, Block types
│   │   │   ├── execution.ts             # Execution request/response types
│   │   │   └── api.ts                   # REST API contract interfaces
│   │   └── package.json
│   │
│   └── validation/                      # Zod Validation Schemas
│       ├── src/
│       │   ├── notebook.schema.ts       # CRUD request schemas
│       │   └── execution.schema.ts      # Code execution request schemas
│       └── package.json
│
├── services/                            # Independent Backend Microservices
│   └── python-runner/                   # Python Code Execution Service
│       ├── runner/                      # FastAPI runner application
│       │   ├── main.py                  # HTTP server entrypoint
│       │   ├── executor.py              # Sandbox process spawner
│       │   ├── parser.py                # Structured output extractor
│       │   └── config.py                # Security limits & environment settings
│       ├── tests/                       # Runner unit & security tests
│       │   ├── test_execution.py
│       │   └── test_security.py
│       ├── requirements.txt             # Runner dependencies
│       └── Dockerfile                   # Worker container definition
│
├── docker/                              # Docker Environments
│   └── python-sandbox/                  # Isolated Python Sandbox image
│       ├── Dockerfile                   # Python 3.11 base + pinned libraries
│       └── requirements.txt             # Pinned packages (numpy, pandas, matplotlib)
│
├── docs/                                # Project Specifications & Plans
│   ├── prd.md                           # Product Requirements Document
│   ├── techstack.md                     # Technical Stack Specification
│   ├── design.md                        # Design & UI Specification
│   ├── phases.md                        # 8-Chunk Implementation Roadmap
│   └── architecture.md                  # System Architecture & Directory Guide
│
├── tests/                               # Integration & End-to-End Test Suite
│   ├── e2e/                             # Playwright E2E test scripts
│   │   ├── auth.spec.ts
│   │   ├── notebook.spec.ts
│   │   └── execution.spec.ts
│   └── vitest.config.ts                 # Vitest integration config
│
├── .env.example                         # Environment template
├── turbo.json                           # Turborepo monorepo pipeline configuration
├── package.json                         # Root monorepo dependencies & scripts
└── README.md                            # Project overview & quickstart guide
```

---

## 3. Core Data Flow & Execution Pipelines

### 3.1 Code Execution Pipeline (Browser → Execution → Output Renderer)

```text
  [User Clicks "Run" / Cmd+Enter]
                │
                ▼
  1. CodeBlock component captures Python snippet
                │
                ▼
  2. POST /api/execute (Next.js API Proxy)
     ├── Validates JWT User Session
     ├── Validates Payload via Zod (execution.schema.ts)
     └── Enforces Rate Limiting
                │
                ▼
  3. HTTP POST /execute (Python Runner Service)
     └── Receives code & execution parameters
                │
                ▼
  4. Docker Sandbox Process Execution
     ├── Spawns non-root unprivileged process inside Container
     ├── Enforces 1.0 CPU, 512MB RAM, 10s Timeout limits
     ├── Captures standard output (stdout) & errors (stderr)
     ├── Serializes Pandas DataFrames to JSON table structures
     └── Saves Matplotlib plots to temporary PNG files
                │
                ▼
  5. Asset Storage & Response Assembly
     ├── Generated plot PNGs uploaded to Supabase Storage
     └── Returns Structured Execution JSON Protocol:
         {
           "status": "success",
           "executionTime": 0.38,
           "outputs": [
             { "type": "text", "content": "Sales Summary 2026" },
             { "type": "table", "data": { "headers": [...], "rows": [...] } },
             { "type": "image", "url": "https://...supabase.co/.../chart.png" }
           ]
         }
                │
                ▼
  6. OutputBlock Renderer
     ├── TextOutput renders terminal output
     ├── TableOutput renders interactive spreadsheet view
     └── ImageOutput renders plot image inline under code block
```

### 3.2 Auto-Save & Synchronization Pipeline

```text
  [User Edits Text or Code Block]
                │
                ▼
  1. Tiptap / Monaco Editor fires local change event
                │
                ▼
  2. Zustand UI Store updates active local block state
                │
                ▼
  3. useAutoSave Hook (Debounced 1500ms)
                │
                ▼
  4. PUT /api/pages/[id]/blocks (Next.js API)
     ├── Validates user ownership via Row Level Security (RLS)
     └── Batch updates block positions & contents via Drizzle ORM
                │
                ▼
  5. UI updates header state indicator ("Saving..." ──► "Saved")
```

---

## 4. Database Schema & Data Model Architecture

The database architecture is designed with strict multi-tenant user isolation. Every notebook, topic, page, and block cascades directly or indirectly from the authenticated `users` table.

```text
 ┌──────────────────────┐
 │     auth.users       │
 └──────────┬───────────┘
            │ 1
            │
            │ N
 ┌──────────▼───────────┐
 │      notebooks       │
 ├──────────────────────┤
 │ id (UUID, PK)        │
 │ user_id (UUID, FK)   │───────┐
 │ name (VARCHAR)       │       │
 │ created_at (TIMESTAMPTZ)     │
 │ updated_at (TIMESTAMPTZ)     │
 └──────────┬───────────┘       │
            │ 1                 │
            │                   │
            │ N                 │
 ┌──────────▼───────────┐       │
 │        topics        │       │
 ├──────────────────────┤       │ Row Level Security (RLS)
 │ id (UUID, PK)        │       │ Enforces: user_id = auth.uid()
 │ notebook_id (UUID, FK)       │
 │ parent_id (UUID, FK) │       │
 │ title (VARCHAR)      │       │
 │ position (INT)       │       │
 │ created_at (TIMESTAMPTZ)     │
 │ updated_at (TIMESTAMPTZ)     │
 └──────────┬───────────┘       │
            │ 1                 │
            │                   │
            │ N                 │
 ┌──────────▼───────────┐       │
 │        pages         │       │
 ├──────────────────────┤       │
 │ id (UUID, PK)        │       │
 │ topic_id (UUID, FK)  │       │
 │ title (VARCHAR)      │       │
 │ position (INT)       │       │
 │ created_at (TIMESTAMPTZ)     │
 │ updated_at (TIMESTAMPTZ)     │
 └──────────┬───────────┘       │
            │ 1                 │
            │                   │
            │ N                 │
 ┌──────────▼───────────┐       │
 │        blocks        │       │
 ├──────────────────────┤       │
 │ id (UUID, FK)        │───────┘
 │ page_id (UUID, FK)   │
 │ type (VARCHAR)       │  ("heading" | "text" | "code" | "output" | "image")
 │ content (TEXT)       │
 │ language (VARCHAR)   │  ("python" | "text")
 │ position (INT)       │
 │ created_at (TIMESTAMPTZ)
 │ updated_at (TIMESTAMPTZ)
 └──────────────────────┘
```

---

## 5. Technology Stack Mapping

| Layer | Technology Selected | Responsibility |
|---|---|---|
| **Framework** | Next.js 14+ (App Router) | App routing, server rendering, REST API endpoints |
| **Language** | TypeScript (Strict) | End-to-end type safety across client, API & database |
| **Styling & UI** | Tailwind CSS + `shadcn/ui` | Responsive design, CSS variable design tokens |
| **Rich Text Editor** | Tiptap | Block-based document editing (headings, paragraphs, lists) |
| **Code Editor** | Monaco Editor | Inline Python code editing (syntax highlighting, line numbers) |
| **Client State** | Zustand | UI state (sidebar toggle, active page, scratchpad, theme) |
| **Server State** | TanStack Query (v5) | Data fetching, query caching, optimistic UI updates |
| **Database & Auth** | Supabase PostgreSQL + Auth | Managed database, JWT authentication, RLS multi-tenancy |
| **ORM Layer** | Drizzle ORM | Type-safe SQL builder & schema migration management |
| **Python Execution** | FastAPI Worker + Docker | Isolated Python 3.11 container sandbox execution |
| **File Storage** | Supabase Storage | Generated Matplotlib/Seaborn plot image persistence |
| **Validation** | Zod | Request payload, environment variable & schema validation |
| **Testing** | Vitest + Playwright | Unit, API integration & End-to-End browser testing |

---

## 6. Security Architecture & Execution Hardening

1. **Multi-Tenant Data Isolation (Database & API)**
   - All database queries are filtered by `user_id`.
   - PostgreSQL Row Level Security (RLS) policies block unauthorized user data reads/writes at the database layer.
2. **Code Execution Isolation (Docker Sandbox)**
   - Code execution is strictly prohibited on the main Next.js web application server.
   - User code executes inside an isolated Docker container running as an unprivileged user (`codebook_user`).
   - Hardened container flags:
     - `--memory=512m` (Max RAM cap)
     - `--cpus=1.0` (Max CPU cap)
     - `--network=none` or restricted outbound access.
     - Hard timeout mechanism (max 10 seconds execution lifetime).
3. **Structured API Protection**
   - API endpoints protected via Supabase Auth middleware.
   - Zod schema validation strips unknown or malformed request parameters.
   - Rate-limiting middleware on `/api/execute` prevents execution flooding.

---

## 7. Environment Configuration Scaffolding (`.env.example`)

```env
# General App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Supabase Database & Auth Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
DATABASE_URL=postgresql://postgres:password@localhost:5432/codebook

# Python Runner Execution Service
PYTHON_RUNNER_URL=http://localhost:8000
PYTHON_RUNNER_SECRET=your-internal-runner-secret
EXECUTION_TIMEOUT_SECONDS=10

# Supabase Storage Configuration
NEXT_PUBLIC_STORAGE_BUCKET=codebook-assets
```
