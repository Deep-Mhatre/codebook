# CodeBook — Tech Stack

## 1. Product Architecture

CodeBook is a Notion-style executable coding notebook.

Core architecture:

```text
                    CodeBook
                       │
        ┌──────────────┴──────────────┐
        │                             │
   Notebook App                 Python Executor
        │                             │
        ▼                             ▼
 Next.js + React                Python Worker
        │                             │
        ▼                             ▼
 Supabase PostgreSQL             Docker Sandbox
        │                             │
        └──────────────┬──────────────┘
                       ▼
                 Structured Output
```

The notebook application and Python execution engine must remain separate.

This allows the execution environment to evolve independently and makes it possible to support heavy Python libraries, files, visualization, and additional languages later.

---

# 2. Frontend

## Next.js

**Purpose:** Main web application framework.

Responsibilities:

- Application routing
- Server-side rendering where useful
- API endpoints
- Authentication integration
- Notebook UI
- Page management
- Search
- Settings

Use the App Router.

---

## TypeScript

**Purpose:** Type safety across the application.

Use strict TypeScript.

Types should be shared across:

- UI
- API
- Database layer
- Execution requests
- Execution responses

---

## Tailwind CSS

**Purpose:** Application styling.

Use Tailwind for:

- Layout
- Responsive design
- Theme support
- Spacing
- Typography
- Component styling

---

## shadcn/ui

**Purpose:** Base UI components.

Use for:

- Buttons
- Dialogs
- Dropdowns
- Tabs
- Inputs
- Command menu
- Tooltips
- Toasts
- Menus

Components should be customized to maintain the notebook aesthetic.

---

# 3. Notebook Editor

## Tiptap

**Purpose:** Rich-text and block-based notebook editor.

A page is composed of blocks:

```text
Page
│
├── Heading
├── Text
├── CodeBlock
├── OutputBlock
├── Text
├── CodeBlock
└── ImageBlock
```

Tiptap handles:

- Text editing
- Headings
- Lists
- Inline formatting
- Block structure
- Keyboard shortcuts
- Extensible custom nodes

CodeBook-specific blocks will be implemented as custom Tiptap nodes.

---

# 4. Code Editor

## Monaco Editor

**Purpose:** Code editing inside CodeBlocks.

Monaco provides:

- Syntax highlighting
- Line numbers
- Code completion
- Multiple cursors
- Keyboard shortcuts
- Python language support
- Code formatting support

CodeBook does not need to expose IDE-style debugging functionality.

The primary interaction is:

```text
Write → Run → Output
```

---

# 5. Client State

## Zustand

Use Zustand for lightweight client-side state.

Examples:

```text
Sidebar state
Active page
Selected block
Editor UI state
Scratchpad state
Theme preferences
Execution UI state
```

Do not use Zustand as the primary database cache.

---

# 6. Server State

## TanStack Query

Use TanStack Query for server state.

Responsibilities:

- Fetch notebooks
- Fetch topics
- Fetch pages
- Fetch blocks
- Cache server data
- Mutations
- Refetching
- Optimistic updates where appropriate

Architecture:

```text
Supabase / API
      ↓
TanStack Query
      ↓
React UI
```

---

# 7. Backend

## Next.js API

Use Next.js API routes for the initial application backend.

Responsibilities:

```text
Notebook CRUD
Topic CRUD
Page CRUD
Block CRUD
Search
User settings
Execution requests
```

Example endpoints:

```text
GET    /api/notebooks
POST   /api/notebooks

GET    /api/topics/:id
POST   /api/topics
PATCH  /api/topics/:id
DELETE /api/topics/:id

GET    /api/pages/:id
POST   /api/pages

POST   /api/execute

GET    /api/search
```

---

# 8. Database

## Supabase PostgreSQL

Use PostgreSQL as the primary persistent database.

Supabase provides:

- PostgreSQL
- Authentication
- Row Level Security
- Storage
- Database tooling

Database hierarchy:

```text
User
 │
 └── Notebook
       │
       └── Topic
             │
             └── Page
                   │
                   └── Block
```

---

# 9. ORM

## Drizzle ORM

Use Drizzle as the TypeScript database layer.

Reasons:

- PostgreSQL-first
- Lightweight
- Type-safe
- Strong SQL control
- Simple migrations
- Good fit for Supabase PostgreSQL

Architecture:

```text
Next.js
   ↓
Drizzle ORM
   ↓
Supabase PostgreSQL
```

---

# 10. Authentication

## Supabase Auth

Initial authentication providers:

```text
Email / Password
Google
```

Every resource must belong to the authenticated user.

Use PostgreSQL Row Level Security to prevent cross-user access.

Example:

```text
User A
  ↓
Only User A's notebooks

User B
  ↓
Only User B's notebooks
```

---

# 11. Storage

## Supabase Storage

Use Supabase Storage for generated and uploaded files.

Potential files:

```text
Generated charts
Uploaded CSV files
Excel files
Images
Generated files
Notebook exports
```

Suggested structure:

```text
storage/
└── users/
    └── {user_id}/
        ├── notebooks/
        ├── images/
        └── files/
```

---

# 12. Python Execution Engine

## Python Runtime

CodeBook must use a real Python runtime for execution.

Do not use Pyodide as the primary execution engine.

Reason:

Users should eventually be able to use real Python libraries such as:

```text
NumPy
Pandas
Matplotlib
Seaborn
Requests
Scikit-learn
SciPy
OpenPyXL
BeautifulSoup
Plotly
```

The execution environment should behave as closely as possible to a normal Python environment.

---

# 13. Python Worker

The Python worker receives execution requests.

Example request:

```json
{
  "language": "python",
  "code": "print('Hello Ghost')",
  "timeout": 5
}
```

The worker:

1. Receives code
2. Creates an isolated execution environment
3. Runs Python
4. Captures stdout
5. Captures stderr
6. Captures rich outputs
7. Collects generated files
8. Enforces resource limits
9. Returns structured results

---

# 14. Docker Sandbox

User code must never run directly on the main application server.

Use Docker for isolation.

Architecture:

```text
Execution API
      ↓
Python Worker
      ↓
Docker Container
      ↓
Python Runtime
      ↓
User Code
```

Each execution environment should have:

```text
CPU limit
Memory limit
Execution timeout
Process limit
Temporary filesystem
Non-root user
Restricted network
No host filesystem access
```

The exact limits can be tuned after testing.

---

# 15. Python Base Environment

The initial environment should contain common learning and data-analysis packages.

```text
Python 3.x

numpy
pandas
matplotlib
seaborn
requests
scikit-learn
```

Future packages:

```text
scipy
openpyxl
beautifulsoup4
plotly
pillow
```

Package versions should be pinned.

Example:

```text
numpy==<version>
pandas==<version>
matplotlib==<version>
```

This improves reproducibility.

---

# 16. Execution Output Protocol

The Python executor must return structured output rather than only a text string.

Example:

```json
{
  "status": "success",
  "executionTime": 0.42,
  "outputs": [
    {
      "type": "text",
      "content": "Hello Ghost"
    }
  ]
}
```

Supported output types:

```text
text
error
table
image
html
file
```

---

# 17. Standard Output

Python:

```python
print("Hello Ghost")
```

Response:

```json
{
  "type": "text",
  "content": "Hello Ghost"
}
```

Frontend renders the result below the corresponding code block.

---

# 18. Error Output

Python:

```python
print(unknown_variable)
```

Executor returns:

```json
{
  "type": "error",
  "content": "NameError: name 'unknown_variable' is not defined"
}
```

The UI displays the error in an error output panel.

CodeBook does not implement a debugger.

No:

```text
Breakpoints
Call stack
Step over
Step into
Watch variables
```

---

# 19. Pandas DataFrame Output

Python:

```python
import pandas as pd

df = pd.DataFrame({
    "Name": ["A", "B", "C"],
    "Score": [85, 92, 78]
})

df
```

The execution layer should identify the DataFrame and return structured table data.

Frontend renders:

```text
┌────────┬───────┐
│ Name   │ Score │
├────────┼───────┤
│ A      │ 85    │
│ B      │ 92    │
│ C      │ 78    │
└────────┴───────┘
```

Future capabilities:

- Sorting
- Filtering
- Pagination
- Copy
- CSV export

---

# 20. Visualization Output

Python:

```python
import matplotlib.pyplot as plt

months = ["Jan", "Feb", "Mar", "Apr"]
sales = [120, 150, 180, 210]

plt.plot(months, sales)
plt.title("Monthly Sales")
plt.show()
```

Execution flow:

```text
Python
 ↓
Matplotlib
 ↓
Figure
 ↓
Capture figure
 ↓
PNG / image output
 ↓
Store temporarily or in Supabase Storage
 ↓
Return image reference
 ↓
Render in CodeBook
```

The notebook should display the chart directly underneath the code block.

---

# 21. Future Interactive Visualization

For Plotly:

```text
Python
 ↓
Plotly
 ↓
HTML / JSON representation
 ↓
Structured output
 ↓
CodeBook visualization renderer
```

This enables interactive charts instead of static images.

---

# 22. File Outputs

The executor should support generated files.

Examples:

```text
CSV
Excel
JSON
PNG
PDF
ZIP
```

Output:

```json
{
  "type": "file",
  "name": "sales.csv",
  "url": "..."
}
```

The UI can display:

```text
📄 sales.csv
[Download]
```

---

# 23. Scratchpad

The Scratchpad is a temporary execution environment.

Flow:

```text
Scratchpad
    ↓
Write code
    ↓
Run
    ↓
Experiment
    ↓
Save to Notebook
```

The user can save an experiment into:

```text
Python
 → Data Structures
 → Lists
```

---

# 24. Execution Queue

### MVP

Avoid unnecessary infrastructure.

Start with:

```text
Next.js
   ↓
Execution API
   ↓
Python Worker
   ↓
Docker
```

### Scaling architecture

When concurrent execution increases:

```text
Next.js
   ↓
Execution API
   ↓
Redis / Queue
   ↓
Python Workers
   ↓
Docker Containers
```

Possible queue technology:

- Redis
- BullMQ

Do not add a queue until actual concurrency requires it.

---

# 25. Search

### MVP

Use PostgreSQL full-text search.

Search:

```text
Notebook names
Topics
Subtopics
Pages
Text blocks
Code blocks
```

No Elasticsearch or external search engine is required initially.

---

# 26. API Validation

## Zod

Use Zod for validating:

- API requests
- API responses where useful
- Execution requests
- Environment variables
- User input

Example execution request:

```text
ExecuteRequest
├── language: "python"
├── code: string
└── timeout: number
```

---

# 27. Environment Variables

Use typed environment validation.

Example categories:

```text
Database
Authentication
Storage
Execution service
Application URL
```

Never expose:

```text
Database secrets
Service-role keys
Execution credentials
Docker credentials
```

to the browser.

---

# 28. Deployment

## Frontend / Application

Use Vercel for the Next.js application.

```text
GitHub
   ↓
Vercel
   ↓
Next.js
```

## Database

Use Supabase.

```text
Supabase
├── PostgreSQL
├── Auth
└── Storage
```

## Python Execution

Use a separate server/container infrastructure.

```text
Vercel
   │
   │ Execute request
   ▼
Python Execution Server
   │
   ▼
Docker Sandbox
```

Do not run unrestricted Python execution inside standard Vercel serverless functions.

---

# 29. Local Development

Local architecture:

```text
CodeBook
│
├── Next.js
│
├── Supabase / local database
│
└── Python Runner
      │
      └── Docker
```

The developer should be able to run the entire stack locally.

This allows development and testing without paying for cloud execution.

---

# 30. Testing

## Frontend

```text
Vitest
React Testing Library
```

## End-to-End

```text
Playwright
```

## Backend

```text
Vitest
API integration tests
```

## Python Runner

Test:

```text
✓ print output
✓ Python syntax error
✓ Runtime error
✓ Timeout
✓ Infinite loop
✓ Pandas DataFrame
✓ Matplotlib chart
✓ File generation
✓ Package imports
✓ Memory limits
✓ CPU limits
```

---

# 31. Developer Tooling

```text
TypeScript
ESLint
Prettier
Husky
lint-staged
```

CI:

```text
GitHub Actions
```

Pipeline:

```text
Push
 ↓
Lint
 ↓
Typecheck
 ↓
Unit Tests
 ↓
Build
 ↓
E2E Tests
```

---

# 32. Recommended Repository Structure

```text
codebook/
│
├── apps/
│   └── web/
│       ├── app/
│       ├── components/
│       ├── features/
│       ├── lib/
│       └── styles/
│
├── services/
│   └── python-runner/
│       ├── worker/
│       ├── sandbox/
│       ├── packages/
│       └── tests/
│
├── packages/
│   ├── db/
│   ├── types/
│   ├── ui/
│   └── validation/
│
├── docker/
│   └── python/
│
├── tests/
│
├── package.json
└── README.md
```

A monorepo is recommended because the application and execution service will evolve together while remaining separate services.

---

# 33. Final Technology Stack

| Layer | Technology |
|---|---|
| Framework | Next.js |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI | shadcn/ui |
| Rich Text | Tiptap |
| Code Editor | Monaco Editor |
| Client State | Zustand |
| Server State | TanStack Query |
| API | Next.js API |
| ORM | Drizzle ORM |
| Database | Supabase PostgreSQL |
| Authentication | Supabase Auth |
| File Storage | Supabase Storage |
| Python Runtime | Python 3.x |
| Execution | Python Worker |
| Sandbox | Docker |
| Queue | None initially / Redis + BullMQ later |
| Validation | Zod |
| Unit Testing | Vitest |
| Component Testing | React Testing Library |
| E2E Testing | Playwright |
| CI | GitHub Actions |
| Frontend Hosting | Vercel |
| Python Hosting | Dedicated execution server |
| Repository | GitHub |

---

# 34. Architecture Principle

The most important architectural decision is:

```text
                 CODEBOOK
                    │
        ┌───────────┴───────────┐
        │                       │
   Notebook System        Execution System
        │                       │
        ▼                       ▼
 Next.js + Supabase       Python + Docker
        │                       │
        └───────────┬───────────┘
                    │
             Structured Output
                    │
                    ▼
                 Notebook
```

**The notebook stores knowledge.  
The execution engine executes code.  
The output renderer turns execution results into notebook content.**

This separation allows CodeBook to start as a Python learning notebook and later evolve into a multi-language executable development notebook without rewriting the core application.
