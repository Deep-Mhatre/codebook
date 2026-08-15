# PRD — CodeBook

**Product:** CodeBook  
**Version:** MVP v1.0  
**Type:** Personal / learning coding notebook  
**Initial Language:** Python

---

## 1. Product Vision

CodeBook is a Notion-style digital coding notebook where users can organize programming knowledge into topics and subtopics while writing and executing real Python code directly inside their notes.

The core experience is:

> **Learn → Write → Run → See → Experiment → Save → Revisit**

CodeBook should feel like a modern, permanent programming notebook — not an IDE.

---

## 2. Problem

When learning Python, users typically use multiple tools:

```text
YouTube / Documentation
        ↓
Notes app
        ↓
VS Code
        ↓
Python terminal
        ↓
Screenshots / saved files
```

This creates fragmented knowledge.

CodeBook combines these into one workspace:

```text
                    CodeBook
                       │
        ┌──────────────┼──────────────┐
        ↓              ↓              ↓
      Notes           Code          Output
        │              │              │
        └──────────────┼──────────────┘
                       ↓
                 Permanent Page
```

---

## 3. Target User

### Primary

Developers and students learning programming languages who prefer:

- Writing their own notes
- Creating small code examples
- Experimenting with code
- Keeping everything organized
- Revisiting old concepts later

### Initial focus

Python learners from beginner through intermediate level.

---

## 4. Core Product Principle

**CodeBook is a notebook first and a code execution environment second.**

It should NOT feel like:

- VS Code
- PyCharm
- A cloud IDE
- A debugging environment

It should feel like:

> **Notion + executable Python notebook**

---

## 5. Core User Flow

```text
Create Notebook
      ↓
Create Topic
      ↓
Create Subtopic
      ↓
Create Page
      ↓
Write explanation
      ↓
Insert Python code block
      ↓
Run code
      ↓
View output
      ↓
Add personal notes
      ↓
Automatically save
```

---

## 6. Notebook Organization

Example:

```text
📚 My Python Notebook

├── 🟢 Fundamentals
│   ├── Variables
│   ├── Data Types
│   ├── Operators
│   └── Input & Output
│
├── 🔀 Control Flow
│   ├── If / Else
│   ├── For Loops
│   └── While Loops
│
├── ⚙️ Functions
│   ├── Functions
│   ├── Parameters
│   ├── Return Values
│   └── Scope
│
├── 📦 Data Structures
│   ├── Lists
│   ├── Tuples
│   ├── Dictionaries
│   └── Sets
│
├── 📊 Libraries
│   ├── NumPy
│   ├── Pandas
│   └── Matplotlib
│
└── 🚀 Projects
```

Users can:

- Create notebook
- Create topic
- Create subtopic
- Rename
- Delete
- Reorder
- Nest topics

---

## 7. Page System

A page consists of independent blocks.

### Supported MVP blocks

**Text**

```text
A variable stores a value that can be referenced later.
```

**Heading**

```text
What I learned
```

**Code**

```python
name = "Ghost"
age = 22

print(name)
print(age)
```

**Output**

```text
Ghost
22
```

The user can arrange these blocks freely.

---

## 8. Python Code Execution

The application will use a **real Python runtime**, not a browser-only interpreter.

### Execution architecture

```text
Browser
   │
   │ POST /execute
   ▼
Execution API
   │
   ▼
Execution Worker
   │
   ▼
Isolated Python Environment
   │
   ├── Python
   ├── NumPy
   ├── Pandas
   ├── Matplotlib
   ├── Requests
   └── Other packages
   │
   ▼
Structured Output
   │
   ▼
Browser
```

The user clicks **Run**.

The frontend sends the code to the execution service.

The execution service runs it inside an isolated environment and returns the result.

---

## 9. Structured Output System

The executor must not only return strings.

It should return structured outputs.

```text
Execution Result
│
├── stdout
├── stderr
├── execution_time
└── outputs[]
```

Possible output types:

```text
text
error
image
table
file
html
```

This allows CodeBook to support real Python notebook behavior.

---

## 10. Text Output

Code:

```python
print("Hello Ghost")
```

Output:

```text
Hello Ghost
```

The UI renders this as a normal output block.

---

## 11. Error Output

Code:

```python
print(unknown_variable)
```

Output:

```text
NameError: name 'unknown_variable' is not defined
```

Errors should appear in a visually distinct error panel.

The application should **not introduce a debugger**.

No:

- Breakpoints
- Call stack
- Watch variables
- Debug panels

---

## 12. DataFrame Output

Code:

```python
import pandas as pd

df = pd.DataFrame({
    "Name": ["A", "B", "C"],
    "Score": [85, 92, 78]
})

df
```

CodeBook should render an actual table:

| Name | Score |
|---|---:|
| A | 85 |
| B | 92 |
| C | 78 |

Future enhancements:

- Sorting
- Filtering
- Pagination
- Copy table
- Export CSV

---

## 13. Data Visualization

Code:

```python
import matplotlib.pyplot as plt

months = ["Jan", "Feb", "Mar", "Apr"]
sales = [120, 150, 180, 210]

plt.plot(months, sales)
plt.title("Monthly Sales")
plt.show()
```

Execution service captures the generated figure.

```text
Python
 ↓
Matplotlib
 ↓
Generated image
 ↓
Execution response
 ↓
CodeBook
 ↓
Rendered chart
```

The user sees the chart directly underneath the code block.

---

## 14. Supported Python Libraries

### Initial environment

Include commonly used learning/data-analysis libraries:

```text
Python
NumPy
Pandas
Matplotlib
Seaborn
Requests
Scikit-learn
```

The exact versions should be pinned for reproducibility.

### Future

Allow users to install additional packages.

Example:

```text
+ Add Package

Package:
[ beautifulsoup4 ]

[Install]
```

---

## 15. Execution Security

User code must **never run directly on the main application server**.

Execution should happen inside an isolated environment.

Each execution should have configurable:

- CPU limit
- Memory limit
- Execution timeout
- Filesystem restrictions
- Network restrictions
- Non-root execution
- Temporary workspace

Example:

```text
Execution Container

Python
 ├── User code
 ├── Packages
 ├── Temporary files
 └── Output

Maximum:
CPU       → Limited
Memory    → Limited
Runtime   → Limited
Network   → Restricted
```

For the personal/local MVP, execution can initially run locally.

---

## 16. Scratchpad

CodeBook should provide a temporary experimentation area.

```text
⚡ Scratchpad

numbers = [1, 2, 3, 4, 5]

sum(numbers)

▶ Run
```

Output:

```text
15
```

The user can then:

**Save to Notebook**

and choose:

```text
Python
 → Data Structures
 → Lists
```

This encourages experimentation without cluttering permanent notes.

---

## 17. Auto Save

All notebook changes automatically save.

Save:

- Text
- Code
- Outputs
- Page structure
- Topic structure

No manual save button should be required.

---

## 18. Search

Global search should search:

- Notebook names
- Topics
- Subtopics
- Pages
- Text content
- Code

Example:

```text
Search: pandas
```

Results:

```text
Python → Libraries → Pandas
Python → Projects → Sales Analysis
Python → Experiments → DataFrame
```

---

## 19. UI

Desktop-first.

```text
┌──────────────────────────────────────────────────────────────┐
│ CodeBook                         🔍 Search       ⚙ Settings │
├────────────────┬─────────────────────────────────────────────┤
│                │                                             │
│ 📚 Python      │ Variables                                   │
│                │                                             │
│ Fundamentals   │ A variable stores a value...                │
│  ├ Variables   │                                             │
│  ├ Data Types  │ ┌─────────────────────────────────────────┐ │
│  └ Operators   │ │ name = "Ghost"                          │ │
│                │ │ age = 22                                │ │
│ Control Flow   │ │ print(name, age)                        │ │
│                │ └─────────────────────────────────────────┘ │
│ Functions      │                            ▶ Run            │
│                │                                             │
│ Data Structures│ Output                                      │
│                │ ─────────────────────────────────────────  │
│ Libraries      │ Ghost 22                                    │
│                │                                             │
│ Projects       │                                             │
└────────────────┴─────────────────────────────────────────────┘
```

### Design

- Minimal
- Clean
- Dark/light mode
- Notebook-like
- Excellent typography
- Large readable code blocks
- Minimal animations
- No unnecessary dashboards

---

## 20. Technical Stack

### Frontend

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Monaco Editor

### Backend

- Next.js API
- Python execution service

### Database

- Supabase PostgreSQL
- Supabase Auth

### Execution

- Python runtime
- Docker-based sandbox for hosted execution

### Storage

- Supabase Storage for generated images/files

---

## 21. Data Model

```text
users
  │
  └── notebooks
        │
        └── topics
              │
              └── pages
                    │
                    └── blocks
```

### `notebooks`

```text
id
user_id
name
created_at
updated_at
```

### `topics`

```text
id
notebook_id
parent_id
title
position
created_at
updated_at
```

### `pages`

```text
id
topic_id
title
position
created_at
updated_at
```

### `blocks`

```text
id
page_id
type
content
language
position
created_at
updated_at
```

---

## 22. MVP Scope

### Must Have

- [ ] User authentication
- [ ] Create notebook
- [ ] Python notebook
- [ ] Topics
- [ ] Subtopics
- [ ] Pages
- [ ] Text blocks
- [ ] Code blocks
- [ ] Monaco editor
- [ ] Run Python
- [ ] stdout output
- [ ] Error output
- [ ] Matplotlib image output
- [ ] Pandas table output
- [ ] Auto-save
- [ ] Search
- [ ] Scratchpad

### Not in MVP

- Debugger
- AI coding assistant
- Git integration
- Collaboration
- Multiple programming languages
- Online code sharing
- Advanced package manager
- Team workspaces

---

## 23. Future Roadmap

### V2

- Version history
- Package manager
- File uploads
- CSV/Excel support
- Interactive Plotly charts
- Export notebook
- Keyboard shortcuts

### V3

- JavaScript
- TypeScript
- SQL
- Java
- C++

### V4

- AI tutor
- AI explanations
- Quiz generation
- Flashcards
- Learning progress
- Spaced repetition

---

## 24. Success Criteria

The MVP succeeds if a user can complete this entire workflow without leaving CodeBook:

```text
Create Python notebook
        ↓
Create "Data Visualization"
        ↓
Create "Matplotlib"
        ↓
Write explanation
        ↓
Write Python code
        ↓
Run code
        ↓
See generated chart
        ↓
Write personal observations
        ↓
Close CodeBook
        ↓
Return later
        ↓
Everything is still there
```

## Core Philosophy

> **CodeBook isn't trying to replace VS Code. It isn't trying to replace Jupyter. It isn't trying to replace Notion.**

It takes the best part of each:

**Notion's organization + Jupyter's executable cells + a real Python environment = a permanent coding notebook.**
