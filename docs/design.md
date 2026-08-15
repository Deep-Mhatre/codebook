# CodeBook — Design Specification

## 1. Design Vision

CodeBook should feel like a **digital coding notebook**, not a traditional SaaS dashboard or full IDE.

The visual direction is inspired by the simplicity and organization of Notion, combined with the readability and functionality expected from a developer tool.

### Core principles

- Minimal
- Calm
- Content-first
- Notebook-like
- Developer-friendly
- Fast
- Distraction-free
- Simple dark/light mode
- Consistent monochrome icons

> **The interface should disappear and let the user's notes and code become the focus.**

---

# 2. Design Philosophy

CodeBook is:

```text
Notion
  +
Executable Python Notebook
  +
Developer-focused UI
```

It is NOT:

- A complex admin dashboard
- A cloud IDE
- A flashy AI SaaS
- A debugging environment
- A heavily animated application

Avoid unnecessary:

- Gradients
- Glowing effects
- Glassmorphism
- Giant cards
- Excessive shadows
- Excessive rounded containers
- Decorative animations

---

# 3. Overall Layout

Desktop-first application.

```text
┌──────────────────────────────────────────────────────────────┐
│  ◈ CodeBook                         Search  ☼  Settings  👤  │
├────────────────┬─────────────────────────────────────────────┤
│                │                                             │
│  Python        │  Variables                                  │
│                │                                             │
│  Fundamentals  │  A variable stores a value...               │
│  › Variables   │                                             │
│  › Data Types  │  ┌────────────────────────────────────────┐ │
│  › Operators   │  │ name = "Ghost"                         │ │
│                │  │ age = 22                               │ │
│  Control Flow  │  │                                        │ │
│  › If / Else   │  └────────────────────────────────────────┘ │
│  › Loops       │                                             │
│                │                         ▶ Run                │
│  Functions     │  Output                                     │
│                │  ───────────────────────────────────────── │
│  Libraries     │  Ghost 22                                   │
│                │                                             │
│  + New Page    │                                             │
└────────────────┴─────────────────────────────────────────────┘
```

The application consists of:

1. Top navigation
2. Left navigation/sidebar
3. Main notebook canvas
4. Code/output area

---

# 4. Top Navigation

The top navigation should remain simple.

```text
┌──────────────────────────────────────────────────────────────┐
│ ◈ CodeBook             Search       ☼       ⚙       👤       │
└──────────────────────────────────────────────────────────────┘
```

### Elements

**Left**

- CodeBook logo/name

**Right**

- Search
- Theme toggle
- Settings
- User menu

Avoid unnecessary navigation links.

---

# 5. Logo

The CodeBook logo should be simple.

Preferred direction:

```text
◈ CodeBook
```

or a minimal notebook/code symbol.

Do not use:

- Complex illustrations
- Gradients
- 3D logos
- Large brand marks

The logo should work at small sizes.

---

# 6. Sidebar

The sidebar is the primary navigation system.

Example:

```text
Python

Fundamentals
  › Variables
  › Data Types
  › Operators

Control Flow
  › If / Else
  › Loops

Functions
  › Parameters
  › Return Values

Data Structures
  › Lists
  › Tuples
  › Dictionaries

Libraries
  › NumPy
  › Pandas
  › Matplotlib

Projects

──────────────────
+ New Page
```

### Sidebar behavior

- Expand/collapse topics
- Create topic
- Create subtopic
- Rename
- Delete
- Reorder
- Drag and drop later

The sidebar should be compact and quiet.

---

# 7. Icons

Use **Lucide Icons**.

Icons should be:

- Monochrome
- Thin
- Small
- Consistent
- Functional

Avoid using colorful emoji as interface icons.

### Icon mapping

| Action | Icon |
|---|---|
| New page | `Plus` |
| Search | `Search` |
| Settings | `Settings` |
| Light mode | `Sun` |
| Dark mode | `Moon` |
| Expand | `ChevronRight` |
| Collapse | `ChevronDown` |
| Delete | `Trash2` |
| Rename | `Pencil` |
| Add block | `Plus` |
| Run code | `Play` |
| More actions | `MoreHorizontal` |
| Topic | `Folder` |
| Page | `FileText` |
| Code | `Code2` |
| Search | `Search` |
| Close | `X` |

---

# 8. Theme System

CodeBook supports:

```text
Light
Dark
System
```

The default should follow the user's system preference.

The user can override it using the theme button.

### Theme button

Do not use a large toggle component.

Use a simple icon:

```text
☼
```

for light mode and:

```text
☾
```

for dark mode.

Clicking the icon changes the theme.

Persist the user's choice.

---

# 9. Light Theme

Recommended palette:

```text
Background:        #FFFFFF
Sidebar:           #F7F7F5
Primary Text:      #37352F
Secondary Text:    #787774
Border:            #E9E9E7
Hover:             #F1F1EF
Code Background:   #F7F7F5
```

The interface should feel warm and paper-like rather than pure developer-tool white.

---

# 10. Dark Theme

Recommended palette:

```text
Background:        #191919
Sidebar:           #202020
Primary Text:      #E6E6E6
Secondary Text:    #9B9B9B
Border:            #303030
Hover:             #2A2A2A
Code Background:   #222222
```

Avoid pure black.

Avoid excessive contrast.

The dark theme should feel comfortable for long coding sessions.

---

# 11. Typography

Typography should prioritize readability.

### UI

Use:

```text
Inter
```

or a similar clean sans-serif font.

### Code

Use:

```text
JetBrains Mono
```

or:

```text
Geist Mono
```

### Suggested hierarchy

```text
Page title        28–32px
Section heading   20–24px
Body              15–16px
Sidebar           14px
Code              14–15px
Metadata          12–13px
```

Avoid oversized typography.

---

# 12. Main Notebook Canvas

The main content area should resemble a digital notebook.

Example:

```text
Variables

A variable is a named reference to a value.

### Example

┌──────────────────────────────────────────┐
│ name = "Ghost"                           │
│ age = 22                                 │
│                                          │
│ print(name)                              │
│ print(age)                               │
└──────────────────────────────────────────┘

                              ▶ Run

Output

Ghost
22
```

The content should have generous whitespace.

Do not put every section inside a card.

---

# 13. Page Header

Example:

```text
Variables

Python Fundamentals

A short explanation of what this concept means...
```

Optional metadata:

```text
Last edited 2 minutes ago
```

The page title should be prominent but not oversized.

---

# 14. Block System

CodeBook pages use blocks.

Supported MVP blocks:

```text
Text
Heading
Code
Output
Image
Table
```

Example:

```text
Heading
   ↓
Text
   ↓
Code
   ↓
Output
   ↓
Text
   ↓
Code
   ↓
Image
```

Blocks should visually flow into each other instead of appearing as separate dashboard cards.

---

# 15. Code Block

Code blocks are one of the most important components.

Example:

```text
┌─────────────────────────────────────────────────┐
│ Python                                  ⋮       │
├─────────────────────────────────────────────────┤
│ 1  name = "Ghost"                               │
│ 2  age = 22                                     │
│ 3                                               │
│ 4  print(name, age)                             │
└─────────────────────────────────────────────────┘
                                      ▶ Run
```

### Features

- Syntax highlighting
- Line numbers
- Copy button
- Run button
- Language indicator
- Code folding where useful
- Keyboard shortcuts

Keep the code editor visually clean.

---

# 16. Run Button

The primary code action is:

```text
▶ Run
```

It should be small and unobtrusive.

States:

```text
▶ Run
⟳ Running...
✓ Completed
```

For errors:

```text
⚠ Error
```

Do not create a large IDE-style execution toolbar.

---

# 17. Output Block

Output appears directly below its code block.

### Text

```text
Output
────────────────────────

Hello Ghost
22
```

### Error

```text
Error
────────────────────────

NameError: name 'x' is not defined
```

### Image

```text
Output
────────────────────────

        [Generated chart]
```

The relationship between code and output should be visually obvious.

---

# 18. DataFrame/Table Output

Tables should look like clean spreadsheet previews.

```text
┌────────┬───────┬────────┐
│ Name   │ Score │ Grade  │
├────────┼───────┼────────┤
│ A      │ 85    │ B      │
│ B      │ 92    │ A      │
│ C      │ 78    │ C      │
└────────┴───────┴────────┘
```

Avoid putting the table inside a huge decorative card.

Future controls:

```text
Sort
Filter
Copy
Export
```

---

# 19. Visualization Output

Charts should appear naturally within the notebook.

```text
Code
 ↓
Run
 ↓
Chart
 ↓
Notes
```

Example:

```text
Monthly Sales

┌─────────────────────────────────────┐
│                                     │
│          📈 Generated Chart         │
│                                     │
└─────────────────────────────────────┘

Observation:

Sales increased every month.
```

Generated visualizations should have enough width to be readable.

---

# 20. Scratchpad

Scratchpad is a temporary workspace.

UI:

```text
┌────────────────────────────────────────────────┐
│ ⚡ Scratchpad                         Clear     │
├────────────────────────────────────────────────┤
│                                                │
│ numbers = [1, 2, 3, 4, 5]                     │
│ sum(numbers)                                   │
│                                                │
└────────────────────────────────────────────────┘

                              ▶ Run

15

                         [Save to Notebook]
```

It should feel lightweight and temporary.

---

# 21. Search

Search should be accessible from the top bar.

Shortcut:

```text
Ctrl / Cmd + K
```

Search results:

```text
Search

pandas

Python
  Libraries → Pandas

Python
  Projects → Sales Analysis

Python
  Experiments → DataFrame
```

The search interface should resemble Notion's command/search experience.

---

# 22. Context Menus

Use a simple `MoreHorizontal` icon for contextual actions.

Example:

```text
Variables                         ⋯
```

Menu:

```text
Rename
Duplicate
Move
Delete
```

Avoid permanent action buttons everywhere.

---

# 23. Hover States

UI should reveal secondary controls on hover.

Example:

```text
Variables                           ⋯
```

The `⋯` can remain hidden until the user hovers.

This keeps the sidebar clean.

---

# 24. Spacing

Use generous whitespace.

Recommended general spacing:

```text
Page padding:       32–48px
Sidebar padding:    12–16px
Block spacing:      16–24px
Section spacing:    32–48px
```

Do not compress the interface like a traditional IDE.

---

# 25. Borders and Shadows

Prefer borders over shadows.

Use:

```text
1px subtle border
```

Avoid:

```text
Heavy shadows
Floating cards
Multiple nested borders
```

The application should feel flat and calm.

---

# 26. Border Radius

Use moderate rounding.

Suggested:

```text
Buttons:       6–8px
Inputs:        6–8px
Code blocks:   8px
Dialogs:       10–12px
```

Avoid excessive pill-shaped UI.

---

# 27. Animations

Animations should be minimal.

Allowed:

- Sidebar expand/collapse
- Dialog appearance
- Theme transition
- Small hover transitions
- Loading indicator

Avoid:

- Parallax
- Large page transitions
- Floating elements
- Continuous animations
- Decorative motion

---

# 28. Responsive Behavior

### Desktop

Primary target.

```text
Sidebar + Canvas
```

### Tablet

```text
Collapsible Sidebar + Canvas
```

### Mobile

The sidebar becomes a drawer.

Code editor should support horizontal scrolling rather than forcing code to wrap.

The experience should remain functional but desktop is the priority.

---

# 29. Accessibility

Requirements:

- Keyboard navigation
- Visible focus states
- Proper button labels
- ARIA labels where necessary
- Sufficient text contrast
- Screen-reader-friendly navigation
- Keyboard shortcut support

Important shortcuts:

```text
Ctrl/Cmd + K       Search
Ctrl/Cmd + S       Save / trigger save state if needed
Ctrl/Cmd + Enter   Run code
Esc                Close dialog
```

Auto-save remains the actual persistence mechanism.

---

# 30. Loading States

Keep loading states subtle.

Example:

```text
⟳ Running...
```

For page loading:

```text
Skeleton
```

Avoid full-screen loading animations.

---

# 31. Empty States

Example:

```text
No pages yet.

Create your first page to start learning.

        + New Page
```

Keep empty states simple and useful.

---

# 32. Error States

Errors should explain what happened without overwhelming the user.

Example:

```text
Something went wrong.

We couldn't save this page.

[Try Again]
```

Python execution errors should be shown separately from application errors.

---

# 33. Design Tokens

Use centralized design tokens so light and dark themes can be changed without rewriting components.

Example:

```text
--background
--foreground
--muted
--muted-foreground
--border
--hover
--code-background
--primary
--destructive
```

Components should consume tokens instead of hardcoding colors.

---

# 34. Component Philosophy

Components should be small and reusable.

Suggested structure:

```text
components/
├── layout/
│   ├── app-shell
│   ├── topbar
│   └── sidebar
│
├── notebook/
│   ├── page-header
│   ├── block-editor
│   ├── text-block
│   ├── code-block
│   ├── output-block
│   ├── table-output
│   └── image-output
│
├── navigation/
│   ├── topic-tree
│   └── page-tree
│
└── ui/
    ├── button
    ├── dialog
    ├── dropdown
    └── command-menu
```

---

# 35. Visual Do / Don't

## Do

```text
✓ White space
✓ Thin borders
✓ Monochrome icons
✓ Simple typography
✓ Clear hierarchy
✓ Inline controls
✓ Clean code blocks
✓ Quiet sidebar
✓ Fast interactions
```

## Don't

```text
✗ Gradient backgrounds
✗ Neon colors
✗ Huge cards
✗ Excessive rounded corners
✗ Glassmorphism
✗ Giant dashboard widgets
✗ Emoji-heavy navigation
✗ Unnecessary animations
✗ IDE-style toolbars
```

---

# 36. Final Visual Direction

The final UI should feel like:

```text
        Notion
          │
          ├── Organization
          ├── Pages
          ├── Clean navigation
          └── Minimal UI

          +

       Developer Tool
          │
          ├── Monaco
          ├── Code
          ├── Terminal-like output
          └── Data visualization

          ↓

        CodeBook
```

The user should open CodeBook and immediately feel:

> **"This is my digital programming notebook."**

Not:

> "This is another complicated developer dashboard."
