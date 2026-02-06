# T003: Graph Visualization

## Meta
- **Status:** READY
- **Created:** 2026-02-06
- **Last Updated:** 2026-02-06
- **Blocked Reason:** —
- **Depends On:** T001, T002

## Task

Build the real-time SVG graph visualization that shows repository state as commands are executed.

**Deliverables:**
- SVG-based graph rendering
- Nodes for commits (filled) and staged changes (dashed/hollow)
- Branch labels and HEAD indicator
- Curved branch lines
- Real-time updates when simulator state changes

**Visual reference:** See graph panel in `mockup.html`:
- Committed nodes: gradient fill (#e94560), glow effect, commit hash inside
- Staged nodes: dashed orange border, hollow, "?" inside
- Branch labels: colored pills (blue for main, purple for feature)
- HEAD label: green pill, positioned below branch label
- Lines: colored by branch, curved for branching points
- Legend at bottom showing node types

---

## Plan
_Planner agent fills this section._

### Objective
Create an SVG-based graph visualization that reactively updates as the Git simulator state changes, matching the visual style from the mockup.

### Scope
- **In Scope:**
  - SVG graph container with proper sizing
  - Commit node component (filled circle with gradient + glow)
  - Staged indicator (dashed hollow circle)
  - Branch label component (colored pill)
  - HEAD indicator
  - Connection lines (straight and curved)
  - Graph layout algorithm (position nodes based on commit history)
  - Real-time subscription to simulator state
  - Legend component
- **Out of Scope:**
  - Interactive nodes (clicking, hovering) — future enhancement
  - Merge commit visualization — future task
  - Animation/transitions — nice-to-have if time permits

### Phases

| Phase | Description | Estimated Complexity |
|-------|-------------|---------------------|
| 1 | SVG components (nodes, labels, lines) | Medium |
| 2 | Graph layout algorithm | Medium |
| 3 | Real-time integration + polish | Low |

### Phase Details

#### Phase 1: SVG Components
- **Objective:** Build reusable SVG components for graph elements
- **Files to create:**
  - `src/components/Graph/GraphPanel.tsx` - main container
  - `src/components/Graph/CommitNode.tsx` - filled commit circle
  - `src/components/Graph/StagedNode.tsx` - dashed staged indicator
  - `src/components/Graph/BranchLabel.tsx` - branch name pill
  - `src/components/Graph/HeadLabel.tsx` - HEAD indicator
  - `src/components/Graph/CommitLine.tsx` - connection lines
  - `src/components/Graph/Legend.tsx` - legend at bottom
  - `src/styles/graph.css` - graph-specific styles
- **Acceptance Criteria:**
  - [ ] CommitNode renders with gradient + glow + hash text
  - [ ] StagedNode renders with dashed orange border
  - [ ] BranchLabel renders as colored pill
  - [ ] HeadLabel renders as green pill
  - [ ] CommitLine renders straight and curved paths
  - [ ] Legend shows staged/committed/branch examples

#### Phase 2: Graph Layout Algorithm
- **Objective:** Position nodes based on commit history
- **Files to create:**
  - `src/components/Graph/layout.ts` - layout calculation
- **Layout rules:**
  - Commits flow bottom-to-top (oldest at bottom)
  - Main branch is leftmost column
  - Feature branches offset to the right
  - Branch point shows curved line
  - Spacing: ~60px vertical between commits
- **Acceptance Criteria:**
  - [ ] Single commit centered
  - [ ] Linear commits stack vertically
  - [ ] Branch creates horizontal offset
  - [ ] Multiple branches don't overlap
  - [ ] Labels don't overlap with nodes

#### Phase 3: Real-time Integration
- **Objective:** Connect graph to simulator state
- **Files to modify:**
  - `src/components/Graph/GraphPanel.tsx` - subscribe to state
  - `src/App.tsx` - ensure state flows correctly
- **Acceptance Criteria:**
  - [ ] Graph updates when `git add` is run (shows staged node)
  - [ ] Graph updates when `git commit` is run (staged → committed)
  - [ ] Graph updates when `git branch` is run (new label appears)
  - [ ] Graph updates when `git checkout` is run (HEAD moves)
  - [ ] Graph header shows stats: "N commits", "M staged", "on branch"
  - [ ] Status bar shows current branch and working tree state

### Decision Matrix

| Decision | Options Considered | Choice | Rationale |
|----------|-------------------|--------|-----------|
| Rendering | Canvas, SVG, D3.js | Plain SVG + React | Simple, declarative, mockup is already SVG |
| Layout | D3-force, dagre, custom | Custom | Commit graph is simple DAG, custom is cleaner |
| Updates | Polling, subscription | Zustand subscription | Already using Zustand, natural fit |

---

## Plan Review

- **Gate:** READY
- **Reviewed:** 2026-02-06
- **Summary:** Plan captures mockup visual elements well. SVG + React approach is appropriately simple. Minor gaps around empty state handling and explicit state interface, but nothing blocks execution.
- **Issues:** 0 critical, 2 major, 3 minor
- **Open Questions Finalized:** None - all decisions made autonomously (appropriate given clear mockup)

**Major issues to address during execution:**
1. Handle empty/initial state (before git init, or with 0 commits)
2. Document expected state interface from T001 simulator

**Minor notes:**
- Define SVG defs (gradient, glow) once in GraphPanel
- Add branch count to graph header status
- Line colors should match branch colors (blue for main, purple for feature)

> Details: `plan-review.md`

---

## Execution Log
_Executor agent fills this section per phase._

### Phase 1: SVG Components
- **Status:** PENDING
- **Started:** —
- **Completed:** —
- **Commits:** —
- **Files Modified:** —
- **Notes:** —

### Phase 2: Graph Layout Algorithm
- **Status:** PENDING
- **Started:** —
- **Completed:** —
- **Commits:** —
- **Files Modified:** —
- **Notes:** —

### Phase 3: Real-time Integration
- **Status:** PENDING
- **Started:** —
- **Completed:** —
- **Commits:** —
- **Files Modified:** —
- **Notes:** —

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

- **Completed:** [DATE]
- **Summary:** ...
- **Commits:** ...
- **Lessons Learned:** ...
