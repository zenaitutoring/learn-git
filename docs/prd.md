# Learn Git - Interactive Git Simulator

## Status
| Field | Value |
|-------|-------|
| PRD Version | 0.1 |
| Feedback Round | 1 |
| Last Updated | 2026-02-06 |
| Mockup Status | **APPROVED** |

## Changelog
| Version | Changes |
|---------|---------|
| 0.0 | Initial draft based on user intent |
| 0.1 | Mockup v2 approved. Updated visual language: SVG nodes with gradient+glow, stacked labels (no overlap), curved branch lines. Tasks created: T001-T003. |

---

## Goal
A lightweight web application that teaches Git through hands-on simulation. Users type Git commands in a pseudo-terminal and see the resulting repository state visualized as an interactive graph in real-time.

## Non-Goals
- No authentication or user accounts
- No persistent storage (session-based only)
- No actual Git operations on a real filesystem
- No guided tutorials or lessons (free exploration only)
- No production-grade error handling

## Users
- Primary: The creator and friends learning Git
- Secondary: Community members wanting to experiment with Git concepts safely

## Core Concept

### Layout
```
┌─────────────────────────────────────────────────────────────────┐
│                        Learn Git                                │
├─────────────────────────────┬───────────────────────────────────┤
│                             │                                   │
│    PSEUDO-TERMINAL          │       GRAPH VISUALIZATION         │
│                             │                                   │
│  $ git init                 │            ○ (staged)             │
│  Initialized empty repo     │            │                      │
│  $ git add file.txt         │            ●───● main             │
│  $ git commit -m "init"     │           /                       │
│  [main abc123] init         │          ●───● feature            │
│  $ git branch feature       │                                   │
│  $ _                        │                                   │
│                             │                                   │
├─────────────────────────────┴───────────────────────────────────┤
│  Working Directory: file.txt (modified)  |  Branch: main       │
└─────────────────────────────────────────────────────────────────┘
```

### Visual Language
| State | Symbol | Meaning |
|-------|--------|---------|
| Staged (after `git add`) | ○ (hollow circle) | Changes ready to commit |
| Committed | ● (filled circle) | Permanent node in history |
| Branch pointer | Label attached to node | e.g., `main`, `feature` |
| HEAD | Special indicator | Current position |

### Simulated Filesystem
- Users can "create" and "edit" virtual files
- Working directory state shown in status bar
- No actual files written anywhere

---

## Phased Implementation

### Phase 1: Core Foundation
**Commands:**
- `git init` — initialize repo, show first empty state
- `git add <file>` — stage files (hollow circle appears)
- `git commit -m "msg"` — commit staged changes (circle fills in, becomes node)
- `git status` — show working directory state in terminal
- `git branch <name>` — create branch (new label)
- `git checkout <branch>` / `git switch <branch>` — move HEAD

**Filesystem simulation:**
- `touch <file>` — create virtual file
- `echo "content" > file` — modify virtual file
- `ls` — list virtual files
- `cat <file>` — show file contents

### Phase 2: History & Inspection
**Commands:**
- `git log` — show commit history in terminal
- `git log --oneline --graph` — ASCII graph in terminal
- `git diff` — show changes between states

### Phase 3: Branching Operations
**Commands:**
- `git merge <branch>` — merge branches (graph shows merge commit)
- `git rebase <branch>` — rebase (graph redraws linearly)
- Conflict simulation and resolution

---

## Technical Approach (High-Level)

### Frontend
- Single-page application (likely React or vanilla JS)
- Terminal emulator component (xterm.js or similar)
- Graph rendering (D3.js, vis.js, or custom SVG/Canvas)

### State Management
- In-memory Git simulation (JavaScript object representing repo state)
- Each browser session = isolated sandbox
- No backend required for core functionality

### Architecture
```
┌──────────────────────────────────────────────┐
│                  Browser                      │
│  ┌─────────────┐      ┌───────────────────┐  │
│  │  Terminal   │ ───> │  Git Simulator    │  │
│  │  Component  │      │  (JS State)       │  │
│  └─────────────┘      └─────────┬─────────┘  │
│                                 │            │
│                       ┌─────────▼─────────┐  │
│                       │  Graph Renderer   │  │
│                       │  (D3/SVG)         │  │
│                       └───────────────────┘  │
└──────────────────────────────────────────────┘
```

---

## Open Questions
1. Should we support `git stash`?
2. Remote simulation — how to visualize "origin"? (separate graph area?)
3. Reset to initial state button? Or rely on page refresh?
4. Dark mode / light mode preference?

---

## Acceptance Criteria (Phase 1)

- [ ] User can type commands in terminal, see output
- [ ] `git init` creates initial repo state
- [ ] `touch`/`echo` commands create/modify virtual files
- [ ] `git add` shows hollow circle in graph
- [ ] `git commit` fills circle and creates permanent node
- [ ] `git branch` creates new branch label
- [ ] `git checkout` moves HEAD indicator
- [ ] Graph updates in real-time as commands execute
- [ ] Each browser tab is an isolated session
