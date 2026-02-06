# T004: Git Merge & Log

## Meta
- **Status:** CODE_REVIEW
- **Created:** 2026-02-06
- **Last Updated:** 2026-02-06
- **Blocked Reason:** —
- **Depends On:** T001, T002, T003

## Task

Add `git merge` and `git log` commands with proper visualization.

**Learning Goals:**
- Understand fast-forward vs three-way merge
- See how merge commits connect two branch histories
- Connect terminal `git log --graph` output to visual graph

---

## Plan

### Objective
Implement git merge (fast-forward and three-way) with graph visualization showing merge commits, plus git log with ASCII graph output that mirrors the visual.

### Scope
- **In Scope:**
  - `git merge <branch>` command
  - Fast-forward merge (branch pointer moves, no new commit)
  - Three-way merge (merge commit with two parents)
  - Graph visualization of merge commits (node with two parent lines)
  - `git log` (full format)
  - `git log --oneline`
  - `git log --oneline --graph` (ASCII art)
  - `git log --all` flag
- **Out of Scope:**
  - Merge conflicts (future task)
  - `git rebase`
  - Remote operations (`push`/`pull`)
  - `git merge --squash`, `--no-ff` flags

### Phases

| Phase | Description | Estimated Complexity |
|-------|-------------|---------------------|
| 1 | Simulator: merge logic | Medium |
| 2 | Git merge command + terminal output | Medium |
| 3 | Graph: merge commit visualization | Medium |
| 4 | Git log command with --graph | Medium |

### Phase Details

#### Phase 1: Simulator Merge Logic
- **Objective:** Add merge capability to GitSimulator
- **Files to modify:**
  - `src/simulator/types.ts` - Commit type needs `parents: string[]` (array, not single parent)
  - `src/simulator/GitSimulator.ts` - Add `merge(branchName)` method
- **Logic:**
  - Detect fast-forward: target branch is ancestor of source
  - Fast-forward: just move branch pointer
  - Three-way: create merge commit with two parents
- **Acceptance Criteria:**
  - [ ] `merge()` detects fast-forward scenario
  - [ ] Fast-forward moves branch pointer without new commit
  - [ ] Three-way creates commit with `parents: [currentHead, otherBranchHead]`
  - [ ] Branch being merged stays where it is (only current branch moves)

#### Phase 2: Git Merge Command
- **Objective:** Add `git merge` terminal command
- **Files to modify:**
  - `src/commands/git.ts` - Add merge handler
- **Output format:**
  ```
  # Fast-forward:
  Updating a1b2c3d..b2c3d4e
  Fast-forward
   feature.js | 1 +
   1 file changed, 1 insertion(+)

  # Three-way merge:
  Merge made by the 'ort' strategy.
   feature.js | 1 +
   1 file changed, 1 insertion(+)
  ```
- **Acceptance Criteria:**
  - [ ] `git merge <branch>` executes merge
  - [ ] Shows "Fast-forward" for fast-forward merges
  - [ ] Shows "Merge made by" for three-way merges
  - [ ] Error if branch doesn't exist
  - [ ] Error if trying to merge current branch into itself

#### Phase 3: Graph Merge Visualization
- **Objective:** Visualize merge commits with two parent lines
- **Files to modify:**
  - `src/components/Graph/layout.ts` - Handle commits with multiple parents
  - `src/components/Graph/CommitLine.tsx` - Draw lines to both parents
  - `src/components/GraphPanel.tsx` - Pass parent info to lines
- **Visual design:**
  - Merge commit: same node style (or subtle indicator like double border)
  - Two lines connect from merge commit to both parents
  - Lines curve appropriately to avoid overlap
- **Acceptance Criteria:**
  - [ ] Merge commit shows with two parent lines
  - [ ] Lines don't overlap or cross awkwardly
  - [ ] Fast-forward just moves label (no new node)
  - [ ] Layout handles merge commits in column positioning

#### Phase 4: Git Log Command
- **Objective:** Add git log with ASCII graph output
- **Files to modify:**
  - `src/commands/git.ts` - Add log handler
- **Output formats:**
  ```bash
  # git log
  commit a1b2c3d4e5f6 (HEAD -> main)
  Author: User
  Date:   Thu Feb 6 2026

      commit message

  # git log --oneline
  a1b2c3d (HEAD -> main) commit message
  b2c3d4e (feature) another commit

  # git log --oneline --graph
  *   fc01a60 (HEAD -> main) Merge branch 'feature'
  |\
  | * b2c3d4e (feature) add feature
  |/
  * a1b2c3d initial commit

  # git log --oneline --graph --all
  (shows all branches)
  ```
- **Acceptance Criteria:**
  - [ ] `git log` shows full commit details
  - [ ] `--oneline` shows compact format
  - [ ] `--graph` shows ASCII branch structure
  - [ ] `--all` includes commits from all branches
  - [ ] Colors match our scheme (orange hashes, colored branch names)
  - [ ] Merge commits show with `|\` junction in ASCII

### Decision Matrix

| Decision | Options Considered | Choice | Rationale |
|----------|-------------------|--------|-----------|
| Merge commit indicator | Different shape, double border, same | Same style | Keep it simple, the two lines are enough indicator |
| Fast-forward visual | Animate, instant move | Instant move | Animation adds complexity |
| Log --graph algorithm | Custom ASCII, library | Custom | Simple enough for our commit structure |
| Commit.parents type | `parent: string \| null`, `parents: string[]` | `parents: string[]` | Supports merge commits cleanly |

---

## Plan Review
_Plan-reviewer agent fills this section._

- **Gate:** —
- **Open Questions Finalized:** —
- **Issues Found:** —

---

## Execution Log
_Executor agent fills this section per phase._

### Phase 1: Simulator Merge Logic
- **Status:** COMPLETE
- **Started:** 2026-02-06
- **Completed:** 2026-02-06
- **Commits:** `8346e3b`
- **Files Modified:**
  - `src/simulator/types.ts` — Added MergeResult interface, merge() and getAllCommits() to GitStore
  - `src/simulator/GitSimulator.ts` — Implemented merge() with fast-forward and three-way logic, added getAllCommits()
  - `src/simulator/index.ts` — Exported MergeResult type
  - `src/commands/git.ts` — Fixed unused variable warnings (pre-existing)
- **Notes:** Commit type already had parentIds as string[]. Implemented isAncestor helper for detecting fast-forward vs three-way.

### Phase 2: Git Merge Command
- **Status:** COMPLETE
- **Started:** 2026-02-06
- **Completed:** 2026-02-06
- **Commits:** `8346e3b`
- **Files Modified:**
  - `src/commands/git.ts` — Added merge command handler with fast-forward and three-way output
  - `src/commands/types.ts` — Extended CommandContext with merge, getCommit, getLog, getAllCommits, commits, head, headIsDetached
  - `src/components/TerminalPanel.tsx` — Passed new context fields to command execution
- **Notes:** Outputs "Fast-forward" or "Merge made by the 'ort' strategy." as per plan

### Phase 3: Graph Merge Visualization
- **Status:** COMPLETE
- **Started:** 2026-02-06
- **Completed:** 2026-02-06
- **Commits:** `8346e3b`
- **Files Modified:**
  - `src/components/Graph/layout.ts` — Updated line color logic for merge commits (second parent uses parent's branch color)
  - `src/components/Graph/CommitLine.tsx` — Refactored curved path handling for both branch and merge directions
- **Notes:** The layout already handled multiple parents via parentIds iteration. Added logic to distinguish merge line colors.

### Phase 4: Git Log Command
- **Status:** COMPLETE
- **Started:** 2026-02-06
- **Completed:** 2026-02-06
- **Commits:** `8346e3b`
- **Files Modified:**
  - `src/commands/git.ts` — Added log command handler with --oneline, --graph, --all flags
- **Notes:** Implemented full format, oneline format, and ASCII graph visualization. Shows branch decorations and HEAD pointer.

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

### Phase 4
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
