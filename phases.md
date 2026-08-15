# CodeBook — Implementation Roadmap & Execution Plan (`phases.md`)

> **Product Vision:** Notion-style digital coding notebook combining rich note-taking, hierarchical organization, and real executable Python code with structured outputs.  
> **Core Principle:** Notebook first, execution second. Clean, quiet, calm visual aesthetics with complete separation between the Notebook system (Next.js + Supabase) and Execution system (Python Worker + Docker Sandbox).

---

## Architecture Overview

```text
                               ┌─────────────────────────────────────────┐
                               │                CodeBook                 │
                               └────────────────────┬────────────────────┘
                                                    │
                      ┌─────────────────────────────┴─────────────────────────────┐
                      │                                                           │
          ┌───────────▼───────────┐                                   ┌───────────▼───────────┐
          │    Frontend System    │                                   │    Backend System     │
          ├───────────────────────┤                                   ├───────────────────────┤
          │ Next.js App Router    │                                   │ Next.js API Routes    │
          │ TypeScript            │                                   │ Drizzle ORM           │
          │ Tailwind CSS          │                                   │ Supabase PostgreSQL   │
          │ shadcn/ui             │                                   │ Supabase Auth & Storage│
          │ Tiptap Editor         │                                   │ Python Execution Worker│
          │ Monaco Code Editor    │                                   │ Docker Sandbox        │
          │ Zustand & TanStack Q. │                                   │ Zod Validation        │
          └───────────────────────┘                                   └───────────────────────┘
```

---

# PART 1: Frontend Implementation Plan

The Frontend is divided into **4 distinct, sequential execution chunks**. Each chunk is self-contained, testable, and builds upon the previous foundation.

---

## Chunk F1: Foundation, Design Tokens & App Shell Layout

### Goal
Establish the core Next.js application structure, custom design tokens, dark/light theme engine, and the main desktop App Shell layout (Topbar, Sidebar skeleton, Main Canvas).

### Key Deliverables & Tasks
1. **Next.js & Styling Infrastructure Setup**
   - Configure Next.js (App Router), TypeScript, Tailwind CSS, and `shadcn/ui` primitives.
   - Implement central CSS design tokens in `index.css` / `globals.css` supporting Warm Light (`#FFFFFF`, `#F7F7F5`) and Calm Dark (`#191919`, `#202020`) palettes.
   - Enforce typography hierarchy: `Inter` for UI text, `JetBrains Mono` / `Geist Mono` for code blocks.
2. **Icon & UI Primitive Library**
   - Integrate monochrome `Lucide Icons` mapped to actions (`Plus`, `Search`, `Settings`, `Sun`, `Moon`, `Play`, `Folder`, `FileText`, `Code2`, `Trash2`, `Pencil`).
   - Customize `shadcn/ui` base components (Button, Dialog, Dropdown, Input, Tooltip) to match the quiet notebook aesthetic (subtle 1px borders, moderate 6-8px border radius, no heavy shadows).
3. **App Shell Layout Construction**
   - Build `AppShell` container component (`components/layout/app-shell.tsx`).
   - Implement `Topbar` (`components/layout/topbar.tsx`): Logo (`◈ CodeBook`), Search trigger button (`Cmd+K`), Theme toggle button (`Sun`/`Moon` icon), Settings button, User profile menu.
   - Implement Theme Engine with system preference detection and persistent localStorage state override.
4. **Sidebar Shell Layout**
   - Construct collapsible `Sidebar` component (`components/layout/sidebar.tsx`).
   - Implement sidebar header, scrollable area, and bottom quick-action (`+ New Page`).

### Verification & Checkpoints
- App launches locally cleanly without console errors or layout shifts.
- Smooth dark/light theme switching with instant CSS token update.
- Responsive layout structure validated on Desktop (>1024px) and Tablet screen sizes.

---

## Chunk F2: State Infrastructure & Notebook Navigation Hierarchy

### Goal
Build client-side state management (Zustand), server-data synchronization (TanStack Query), interactive Topic/Subtopic tree navigation, and global Cmd+K search dialog.

### Key Deliverables & Tasks
1. **State Management Setup**
   - Create Zustand UI stores (`lib/store/ui-store.ts`): Sidebar collapse state, active page ID, active block ID, Scratchpad drawer visibility, theme preference.
   - Setup `TanStack Query` client & custom data hooks (`lib/hooks/use-notebooks.ts`, `use-topics.ts`, `use-pages.ts`).
2. **Interactive Sidebar Topic Tree**
   - Build `TopicTree` component (`components/navigation/topic-tree.tsx`).
   - Implement expandable/collapsible nested topics and subtopics with custom chevron indicators (`ChevronRight` / `ChevronDown`).
   - Implement hover-revealed `MoreHorizontal` context menus for inline actions: Rename, Duplicate, Move, Delete topic/page.
   - Build modal dialogs for topic/subtopic creation and confirmation.
3. **Global Search Interface (Cmd+K)**
   - Implement `CommandMenu` search dialog (`components/navigation/command-menu.tsx`).
   - Wire keyboard shortcut listener (`Ctrl/Cmd + K`).
   - Render categorized search results (Notebooks, Topics, Pages, Code snippets) with instant page navigation upon selection.
4. **Page Breadcrumb & Header Navigation**
   - Build `PageHeader` component (`components/notebook/page-header.tsx`): Category hierarchy path (e.g. `Python → Fundamentals → Variables`), page title input, and "Last edited" timestamp indicator.

### Verification & Checkpoints
- Topic tree expands, collapses, and highlights selected active page.
- Keyboard shortcut `Cmd+K` opens search modal smoothly and traps focus correctly.
- Context menus open cleanly on hover/click without breaking tree selection state.

---

## Chunk F3: Core Canvas, Block Editor System & Monaco Code Editor

### Goal
Implement the main notebook canvas, the Tiptap rich-text block editing system, custom block nodes, and integrated Monaco Code Editor blocks.

### Key Deliverables & Tasks
1. **Tiptap Block Editor Integration**
   - Integrate Tiptap rich-text editor engine (`components/notebook/block-editor.tsx`).
   - Implement block types: Heading 1/2/3, Paragraph/Text, Bullet List, Image Block.
   - Configure seamless block drag/reorder handles and inline block addition control (`+`).
2. **Monaco Code Editor Block Component**
   - Create custom Tiptap Node / React wrapper for `Monaco Editor` (`components/notebook/code-block.tsx`).
   - Configure Python syntax highlighting, line numbers, auto-closing brackets, code formatting, and horizontal scrolling (no forced wrapping).
   - Apply JetBrains Mono / Geist Mono typography and dark/light Monaco theme sync.
3. **Compact Block Action Toolbar**
   - Implement compact, unobtrusive execution trigger on code blocks (`▶ Run`).
   - Implement execution status states: Idle (`▶ Run`), Executing (`⟳ Running...`), Success (`✓ Completed`), Error (`⚠ Error`).
   - Bind keyboard shortcut `Ctrl/Cmd + Enter` inside Monaco editor to trigger code execution.
4. **Auto-Save & Page Synchronization**
   - Implement debounced auto-save hook (`use-auto-save.ts`) sending block changes to backend API without interrupting typing flow.
   - Add quiet auto-save indicator in header (`Saved` / `Saving...`).

### Verification & Checkpoints
- Text and headings edit smoothly with standard markdown keyboard shortcuts.
- Monaco Code Editor loads within block system, handles Python code seamlessly, and triggers `Cmd+Enter`.
- Auto-save triggers silently after edit pause without blocking UI interaction.

---

## Chunk F4: Structured Output Rendering, Scratchpad & Mobile Polish

### Goal
Build structured execution output renderers (Text, Error, Pandas DataFrame tables, Matplotlib charts), the temporary Scratchpad experimentation drawer, and mobile/tablet responsive touch polish.

### Key Deliverables & Tasks
1. **Structured Output Renderers**
   - Create `OutputBlock` wrapper component placed directly underneath code blocks (`components/notebook/output-block.tsx`).
   - **Text Output:** Render standard stdout / print statements in clean terminal-style text container (`components/notebook/text-output.tsx`).
   - **Error Output:** Render Python tracebacks in a visually distinct, readable error panel (`components/notebook/error-output.tsx`).
2. **Rich Data Output Renderers**
   - **DataFrame Table Output:** Build `TableOutput` component (`components/notebook/table-output.tsx`) rendering clean spreadsheet-like preview with sorting, copying, and pagination options.
   - **Visualization Output:** Build `ImageOutput` component (`components/notebook/image-output.tsx`) rendering captured Matplotlib/Seaborn plot PNG images with light lightbox zoom.
3. **Scratchpad Experimentation System**
   - Construct floating/slide-out `Scratchpad` drawer component (`components/notebook/scratchpad.tsx`).
   - Include standalone Monaco Python editor, instant Run button, output display, and "Save to Notebook" target selector modal.
4. **Responsive Layout & Mobile Adaptation**
   - Convert left sidebar into responsive drawer overlay for mobile screens (<768px).
   - Ensure Monaco editor and DataFrame tables handle touch gestures and horizontal scrolling gracefully without page breaking.

### Verification & Checkpoints
- Text outputs, errors, tables, and images render accurately under their corresponding code blocks.
- Scratchpad opens, executes code independently, and allows saving snippets into targeted notebook topics.
- Entire UI validated for zero clutter, strict adherence to `design.md` visual rules (no heavy gradients/glassmorphism).

---

# PART 2: Backend Implementation Plan

The Backend is divided into **4 distinct, sequential execution chunks**, covering database architecture, REST APIs, isolated execution engine, and storage.

---

## Chunk B1: Database Schema, Drizzle ORM & Auth System

### Goal
Define PostgreSQL database architecture via Drizzle ORM, establish Supabase connection pooling, configure Supabase Auth, and enforce Row Level Security (RLS) policies.

### Key Deliverables & Tasks
1. **Database Connection & Drizzle ORM Setup**
   - Configure Drizzle ORM (`drizzle.config.ts`) connected to Supabase PostgreSQL.
   - Create database connection client with pool management (`lib/db/index.ts`).
2. **Relational Schema Definition**
   - Define schema files (`lib/db/schema.ts`):
     - `notebooks` (id, user_id, name, created_at, updated_at)
     - `topics` (id, notebook_id, parent_id, title, position, created_at, updated_at)
     - `pages` (id, topic_id, title, position, created_at, updated_at)
     - `blocks` (id, page_id, type, content, language, position, created_at, updated_at)
   - Add foreign key constraints, cascade deletion, and indexing on `user_id`, `notebook_id`, `topic_id`, `page_id`.
3. **Supabase Auth Integration**
   - Set up Supabase Auth client & middleware (`lib/auth/supabase-server.ts`).
   - Support Email/Password and Google OAuth authentication routes.
   - Implement Auth session validation middleware for API route protection.
4. **Row Level Security (RLS) Policies**
   - Write SQL migrations implementing PostgreSQL RLS rules ensuring strict multi-tenant isolation (users can ONLY select, insert, update, delete their own records).

### Verification & Checkpoints
- Drizzle migrations generate and execute cleanly against Supabase PostgreSQL.
- Auth flow creates new user records and issues secure JWT sessions.
- Direct database query tests confirm RLS prevents cross-user data access.

---

## Chunk B2: Next.js REST API & Full-Text Search Layer

### Goal
Construct type-safe REST API endpoints with Zod validation for Notebook, Topic, Page, and Block CRUD operations, along with PostgreSQL full-text search.

### Key Deliverables & Tasks
1. **Zod API Schema Validation Layer**
   - Create request/response Zod schemas (`lib/validation/schemas.ts`) for Notebooks, Topics, Pages, Blocks, and Execution requests.
2. **Notebook & Topic API Endpoints**
   - `GET /api/notebooks` & `POST /api/notebooks`
   - `GET /api/topics/[id]`, `POST /api/topics`, `PATCH /api/topics/[id]`, `DELETE /api/topics/[id]`
   - Support parent-child nesting updates and position reordering.
3. **Page & Block API Endpoints**
   - `GET /api/pages/[id]` & `POST /api/pages`
   - `PUT /api/pages/[id]/blocks` (Batch block synchronization for auto-save)
   - `POST /api/blocks`, `PATCH /api/blocks/[id]`, `DELETE /api/blocks/[id]`
4. **PostgreSQL Full-Text Search API**
   - `GET /api/search?q={query}`
   - Implement PostgreSQL full-text search index (`tsvector`) across topic titles, page titles, text block content, and code block contents.

### Verification & Checkpoints
- All REST endpoints pass API unit tests with valid and invalid Zod payload inputs.
- Batch block update endpoint persists edited page state within <100ms.
- Search API returns matching results ranked by relevance across notebooks, topics, and code snippets.

---

## Chunk B3: Python Execution Worker & Docker Sandbox Infrastructure

### Goal
Build the standalone Python Worker execution service, Docker sandbox environment with security hardening, and structured output parsing protocol.

### Key Deliverables & Tasks
1. **Python Worker Service Architecture**
   - Create standalone FastAPI / HTTP runner service (`services/python-runner`).
   - Define `/execute` endpoint receiving JSON payload `{ code: string, timeout: number }`.
2. **Docker Container Sandbox Configuration**
   - Create `docker/python/Dockerfile` based on Python 3.11 slim image.
   - Install pinned learning & data science libraries: `numpy`, `pandas`, `matplotlib`, `seaborn`, `requests`, `scikit-learn`.
3. **Security & Isolation Hardening**
   - Configure sandbox execution limits: CPU cap (e.g. 1.0 core), Memory limit (e.g. 512MB), Execution timeout (max 10 seconds), Non-root unprivileged execution user (`codebook_user`), Isolated `/tmp` filesystem, Restricted network access.
4. **Structured Output Capture Engine**
   - Implement Python execution wrapper capturing `stdout` and `stderr`.
   - Implement DataFrame interceptor serializing Pandas DataFrames to structured JSON tables.
   - Implement Matplotlib/Seaborn figure interceptor rendering plots to base64 PNG images.
   - Return structured response: `{ status, executionTime, outputs: [{ type: "text"|"error"|"table"|"image", content }] }`.

### Verification & Checkpoints
- Execution worker runs locally inside Docker container.
- Code execution cleanly returns stdout, stderr tracebacks, pandas tables, and plot images.
- Timeout test (e.g. `while True: pass`) terminates strictly after timeout without hanging host process.

---

## Chunk B4: Supabase Storage Integration, Execution Proxy & E2E Validation

### Goal
Connect Next.js API `/api/execute` proxy to Python Worker, set up Supabase Storage for generated plots/files, and execute full end-to-end integration test suite.

### Key Deliverables & Tasks
1. **Next.js Execution API Proxy (`/api/execute`)**
   - Create Next.js API route `/api/execute` forwarding validated requests from frontend to Python Worker.
   - Add rate-limiting middleware (preventing execution spam) and user quota verification.
2. **Supabase Storage Integration**
   - Configure Supabase Storage bucket `codebook-assets` with path structure `storage/users/{user_id}/images/`.
   - Automate plot/image uploading from execution responses to Supabase Storage, returning persistent public/signed image URLs to the frontend.
3. **Automated Testing Suite Setup**
   - **Unit Tests (Vitest):** Validate API handlers, Drizzle queries, and Zod parsers.
   - **Runner Tests:** Test Python Runner across print statements, syntax errors, pandas dataframes, matplotlib charts, infinite loops, and memory overflows.
   - **E2E Tests (Playwright):** Test end-to-end flow from user sign-in → create notebook → add page → enter Python code → click Run → view table/chart → auto-save refresh.
4. **Local Development Environment & Monorepo Tooling**
   - Configure `package.json` scripts to launch Next.js app, Supabase local instance, and Python Docker container in single command (`npm run dev`).

### Verification & Checkpoints
- Complete end-to-end integration verified: Frontend sends code → Next.js API proxy authorizes → Docker sandbox runs Python → Plot uploaded to Supabase Storage → Chart renders in notebook output block.
- Playwright E2E test suite executes with 100% pass rate.
- Project ready for deployment (Next.js on Vercel, Python Execution Server on container platform).

---

## Summary Matrix of Phases & Chunks

| Track | Chunk | Focus Area | Key Deliverables |
|---|---|---|---|
| **Frontend** | **Chunk F1** | Design System & App Shell | Next.js setup, CSS tokens (Light/Dark), Topbar, Logo, Collapsible Sidebar |
| **Frontend** | **Chunk F2** | State & Navigation Tree | Zustand stores, TanStack Query, Topic/Subtopic Tree, Cmd+K Search Modal |
| **Frontend** | **Chunk F3** | Canvas & Monaco Editor | Tiptap Block Editor, Custom Nodes, Monaco Code Block, Run Button (`▶`), Auto-save |
| **Frontend** | **Chunk F4** | Output Renderers & Polish | Text/Error Output, Pandas Table Output, Matplotlib Chart Renderer, Scratchpad Drawer |
| **Backend** | **Chunk B1** | DB Schema & Auth | Drizzle ORM, Supabase PostgreSQL tables, Foreign Keys, Supabase Auth, RLS Policies |
| **Backend** | **Chunk B2** | REST API & Search | Zod schemas, Notebook/Topic/Page/Block CRUD API, PostgreSQL Full-Text Search |
| **Backend** | **Chunk B3** | Python Runner & Docker | FastAPI Worker, Docker Container Sandbox, Resource limits, Structured Output Extractor |
| **Backend** | **Chunk B4** | Storage, Proxy & E2E | `/api/execute` proxy, Supabase Storage uploads, Vitest unit tests, Playwright E2E suite |
