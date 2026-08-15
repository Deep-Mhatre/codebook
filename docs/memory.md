
# CodeBook — Project Memory & Implementation State (`memory.md`)

## Project Overview
- **Project Name:** CodeBook
- **Vision:** Notion-style digital coding notebook with executable Python code and structured outputs.
- **Current Phase:** Part 1 - Frontend Implementation Plan
- **Active Chunk:** **Chunk F1: Foundation, Design Tokens & App Shell Layout**
- **Last Updated:** 2026-08-15

---

## Current Status & Progress Tracking

| Phase / Chunk | Status | Notes / Key Completed Deliverables |
|---|---|---|
| **Chunk F1: Foundation & App Shell** | 🔄 **IN PROGRESS** | Initializing Next.js app, design tokens, icons, and shell components |
| **Chunk F2: State & Navigation Tree** | ⏳ Pending | Zustand, TanStack Query, Topic Tree, Cmd+K modal |
| **Chunk F3: Canvas & Monaco Editor** | ⏳ Pending | Tiptap Block Editor, Monaco Code Editor, Auto-save |
| **Chunk F4: Output Renderers & Polish** | ⏳ Pending | Text, Error, Pandas Table, Matplotlib output renderers |
| **Chunk B1: DB Schema & Auth** | ⏳ Pending | Drizzle ORM, Supabase PostgreSQL, Auth, RLS |
| **Chunk B2: REST API & Search** | ⏳ Pending | Zod schemas, CRUD API routes, Full-Text search |
| **Chunk B3: Python Runner & Docker** | ⏳ Pending | FastAPI Worker, Docker container sandbox |
| **Chunk B4: Storage, Proxy & E2E** | ⏳ Pending | Execution proxy, Supabase storage, E2E tests |

---

## Active Task Log: Chunk F1

- [ ] **Step 1:** Initialize Next.js project structure with TypeScript, Tailwind CSS, App Router, Lucide Icons, and base packages.
- [ ] **Step 2:** Configure CSS Design Tokens in `globals.css` (Warm Light & Calm Dark themes, typography font variables).
- [ ] **Step 3:** Implement App Shell Layout (`AppShell`, `Topbar`, `Sidebar` components).
- [ ] **Step 4:** Build Theme Engine (Light / Dark / System preference with persistent toggle).
- [ ] **Step 5:** Verify local build and runtime execution.

---

## Technical Decisions & Memory Log
1. **Repository Layout:** Creating standard Next.js App Router structure in the workspace root with modular folder organization (`app/`, `components/`, `lib/`, `hooks/`, `styles/`).
2. **Design Tokens:** Enforcing warm paper light mode (`#FFFFFF`/`#F7F7F5`) and calm dark mode (`#191919`/`#202020`) as specified in `design.md`.
3. **Icons:** Using `lucide-react` for monochrome, quiet UI icons.
