# T001: Project Setup & Core Infrastructure

## Meta
- **Status:** COMPLETE
- **Created:** 2026-02-06
- **Last Updated:** 2026-02-06
- **Blocked Reason:** —

## Task

Set up the project infrastructure and build the core Git simulator engine.

**Deliverables:**
- Vite + React project with TypeScript
- Docker configuration for local development
- Split-panel layout (terminal left, graph right) matching `mockup.html`
- In-memory Git simulator with state for: commits, branches, staging area, HEAD
- Virtual filesystem simulation (files exist only in memory)

**Reference:** `prd.md`, `mockup.html`

---

## Plan
_Planner agent fills this section._

### Objective
Create the foundational infrastructure: Docker-based dev environment, React app shell with the two-panel layout, and the core Git simulation engine that tracks repository state in memory.

### Scope
- **In Scope:**
  - Dockerfile and docker-compose.yml for local dev
  - Vite + React + TypeScript project setup
  - App shell with header, split panels, status bar (matching mockup)
  - GitSimulator class/module with state management
  - VirtualFileSystem class/module
  - State types: Commit, Branch, StagingArea, WorkingDirectory
- **Out of Scope:**
  - Terminal input handling (T002)
  - Graph rendering (T003)
  - Actual command parsing (T002)

### Phases

| Phase | Description | Estimated Complexity |
|-------|-------------|---------------------|
| 1 | Docker + Vite project setup | Low |
| 2 | App shell layout (header, panels, status bar) | Low |
| 3 | Git simulator engine + virtual filesystem | Medium |

### Phase Details

#### Phase 1: Docker + Project Setup
- **Objective:** Get a Vite+React+TS app running in Docker
- **Files to create:**
  - `Dockerfile`
  - `docker-compose.yml`
  - `package.json`
  - `vite.config.ts`
  - `tsconfig.json`
  - `src/main.tsx`
  - `src/App.tsx`
  - `index.html`
- **Acceptance Criteria:**
  - [ ] `docker compose up` starts dev server
  - [ ] App accessible at localhost:4000 (or similar dev port)
  - [ ] Hot reload works

#### Phase 2: App Shell Layout
- **Objective:** Create the visual structure matching mockup.html
- **Files to create/modify:**
  - `src/App.tsx` - main layout
  - `src/components/Header.tsx`
  - `src/components/TerminalPanel.tsx` (placeholder)
  - `src/components/GraphPanel.tsx` (placeholder)
  - `src/components/StatusBar.tsx`
  - `src/index.css` - global styles matching mockup colors
- **Acceptance Criteria:**
  - [ ] Header with "Learn Git" title and subtitle
  - [ ] Two-panel split layout
  - [ ] Status bar at bottom
  - [ ] Dark theme matching mockup (#1a1a2e, #0d1117, etc.)

#### Phase 3: Git Simulator Engine
- **Objective:** Build the in-memory Git state machine
- **Files to create:**
  - `src/simulator/types.ts` - TypeScript interfaces
  - `src/simulator/GitSimulator.ts` - main simulator class
  - `src/simulator/VirtualFileSystem.ts` - file operations
  - `src/simulator/index.ts` - exports
- **Acceptance Criteria:**
  - [ ] Can create commits (id, message, parent, timestamp)
  - [ ] Can create/switch branches
  - [ ] Can stage files (working → staging)
  - [ ] Can track HEAD position
  - [ ] Virtual files can be created, modified, read
  - [ ] State is reactive (can subscribe to changes)

### Decision Matrix

| Decision | Options Considered | Choice | Rationale |
|----------|-------------------|--------|-----------|
| Framework | React, Vue, Vanilla JS | React | Familiar, good state management, component model |
| Build tool | Vite, CRA, Webpack | Vite | Fast, modern, good TS support |
| State management | Redux, Zustand, Context | Zustand | Lightweight, simple API, good for this scale |
| Styling | Tailwind, CSS Modules, Plain CSS | Plain CSS | Mockup already has CSS, keep it simple |

---

## Plan Review
_Plan-reviewer agent fills this section._

- **Gate:** READY | NEEDS_WORK | NOT_READY
- **Open Questions Finalized:** —
- **Issues Found:** —

> Details: plan-review.md

---

## Execution Log
_Executor agent fills this section per phase._

### Phase 1: Docker + Project Setup
- **Status:** COMPLETE
- **Started:** 2026-02-06
- **Completed:** 2026-02-06
- **Commits:** —
- **Files Modified:** Dockerfile, docker-compose.yml, package.json, vite.config.ts, tsconfig.json, index.html, src/main.tsx, src/App.tsx, src/index.css, .dockerignore, .gitignore
- **Notes:** Using port 4003 (registered via ports CLI). All acceptance criteria verified.

### Phase 2: App Shell Layout
- **Status:** COMPLETE
- **Started:** 2026-02-06
- **Completed:** 2026-02-06
- **Commits:** —
- **Files Modified:** src/App.tsx, src/components/Header.tsx, src/components/TerminalPanel.tsx, src/components/GraphPanel.tsx, src/components/StatusBar.tsx, src/index.css, src/vite-env.d.ts
- **Notes:** All acceptance criteria verified. TypeScript compiles clean.

### Phase 3: Git Simulator Engine
- **Status:** COMPLETE
- **Started:** 2026-02-06
- **Completed:** 2026-02-06
- **Commits:** —
- **Files Modified:** src/simulator/types.ts, src/simulator/GitSimulator.ts, src/simulator/VirtualFileSystem.ts, src/simulator/index.ts, src/components/StatusBar.tsx (updated), src/components/GraphPanel.tsx (updated)
- **Notes:** Zustand store with full Git simulation. Components wired up to reactive state.

---

## Code Review Log
_Code-reviewer agent fills this section per phase._

### Phase 1
- **Gate:** —
- **Issues Found:** —
- **Revision Count:** 0/3

### Phase 2
- **Gate:** —
- **Issues Found:** —
- **Revision Count:** 0/3

### Phase 3
- **Gate:** —
- **Issues Found:** —
- **Revision Count:** 0/3

---

## Completion
_Final summary when task is complete._

- **Completed:** 2026-02-06
- **Summary:** Successfully set up Docker-based Vite+React+TypeScript project with split-panel layout matching mockup. Implemented in-memory Git simulator using Zustand with full support for: init, file operations, staging, commits, branches, and checkout. Components are wired to reactive state.
- **Commits:** f62dd11
- **Lessons Learned:** Port 4003 used (4000-4002 already registered). Vite-env.d.ts needed for CSS imports in TypeScript.
