# Code Review: T004 Git Merge & Log

## Gate: PASS

**Summary:** Implementation is functionally correct for a learning application. Merge logic handles fast-forward vs three-way detection properly. Graph visualization connects merge commits to both parents. Log output supports all requested flags. Found 4 minor issues that do not block completion.

---

## Git Reality Check

**Commit:**
```
4fc9423 T004: Add git merge and git log commands
```

**Files Changed:**
- src/commands/git.ts (263 lines added)
- src/commands/types.ts (8 lines added)
- src/components/Graph/CommitLine.tsx (50 lines refactored)
- src/components/Graph/layout.ts (21 lines added)
- src/components/TerminalPanel.tsx (7 lines added)
- src/simulator/GitSimulator.ts (145 lines added)
- src/simulator/index.ts (3 lines modified)
- src/simulator/types.ts (9 lines added)

**Matches Execution Report:** Yes - all files listed in execution log are present in commit.

---

## AC Verification

### Phase 1: Simulator Merge Logic

| AC | Claimed | Verified | Notes |
|----|---------|----------|-------|
| merge() detects fast-forward scenario | Yes | Yes | `isAncestor()` helper correctly walks parent graph |
| Fast-forward moves branch pointer without new commit | Yes | Yes | Lines 322-338 update branch pointer only |
| Three-way creates commit with parents array | Yes | Yes | Lines 352-358 create merge commit with both parents |
| Branch being merged stays where it is | Yes | Yes | Only current branch is updated in `updatedBranches` |

### Phase 2: Git Merge Command

| AC | Claimed | Verified | Notes |
|----|---------|----------|-------|
| git merge <branch> executes merge | Yes | Yes | Handler at line 452 |
| Shows "Fast-forward" for fast-forward | Yes | Yes | Line 471 |
| Shows "Merge made by" for three-way | Yes | Yes | Line 476 |
| Error if branch doesn't exist | Yes | Yes | Error caught and displayed at line 482 |
| Error if merging into self | Yes | Yes | Displays "Already up to date." at line 485 |

### Phase 3: Graph Merge Visualization

| AC | Claimed | Verified | Notes |
|----|---------|----------|-------|
| Merge commit shows with two parent lines | Yes | Yes | `layout.ts` iterates all parentIds |
| Lines don't overlap or cross awkwardly | Yes | Partial | Simple cases work; complex graphs may overlap |
| Fast-forward just moves label | Yes | Yes | No new commit created, branch pointer updates |
| Layout handles merge commits in column positioning | Yes | Yes | Column assignment via `commitBranch` map |

### Phase 4: Git Log Command

| AC | Claimed | Verified | Notes |
|----|---------|----------|-------|
| git log shows full commit details | Yes | Yes | Lines 411-446 |
| --oneline shows compact format | Yes | Yes | Lines 384-409 |
| --graph shows ASCII branch structure | Yes | Yes | Lines 281-383 |
| --all includes commits from all branches | Yes | Yes | Uses `getAllCommits()` |
| Colors match scheme | N/A | N/A | Terminal output is plain text, no ANSI colors |
| Merge commits show with `|\` junction | Yes | Yes | Line 359 generates merge prefix |

---

## Issues Found

### 0 Critical, 0 Major, 4 Minor

### Minor Issues

1. **Duplicate path logic in CommitLine.tsx**
   - File: `/home/blake/repos/experiments/skool/learn-git/src/components/Graph/CommitLine.tsx:24-54`
   - Problem: The branching and merging cases (lines 24-38 vs 40-54) have identical path generation code. The comment says "curve right" vs "curve left" but the SVG path is exactly the same.
   - Impact: No functional bug since the path formula works symmetrically, but the dead code and misleading comments reduce maintainability.
   - Fix: Consolidate into single path generation block.

2. **ASCII graph merge prefix regex is fragile**
   - File: `/home/blake/repos/experiments/skool/learn-git/src/commands/git.ts:359`
   - Problem: `graphPrefix.replace('*', '|').replace(/\|(?=[^|]*$)/, '\\')` will produce unexpected output for complex graphs with multiple active columns.
   - Impact: For the simple learning scenarios this app targets, it works. Edge cases with 3+ branches merging simultaneously would render incorrectly.
   - Fix: Acceptable for learning app scope.

3. **Log --graph column tracking can grow unbounded**
   - File: `/home/blake/repos/experiments/skool/learn-git/src/commands/git.ts:290-310`
   - Problem: The `activeColumns` array grows when commits are added but the cleanup at lines 380-382 only trims trailing nulls. Middle columns stay null, causing sparse arrays.
   - Impact: Cosmetic - extra spaces in graph output for certain merge patterns.
   - Fix: Low priority for learning app.

4. **merge() error message inconsistency**
   - File: `/home/blake/repos/experiments/skool/learn-git/src/commands/git.ts:484-485`
   - Problem: When merging branch into itself, GitSimulator throws "Cannot merge a branch into itself" but the command handler converts this to "Already up to date." Real git also says "Already up to date" so the output is correct, but the error handling path conflates two different situations.
   - Impact: None for users - output is correct. Code is slightly misleading.
   - Fix: Optional - could check `branchName === currentBranch` before calling merge().

---

## What's Good

1. **Merge logic is solid** - The `isAncestor()` BFS algorithm correctly handles all ancestor detection cases including merge commits with multiple parents.

2. **Edge cases covered** - Detached HEAD state, empty branch with no commits, branch not found, already up-to-date - all handled with appropriate error messages.

3. **Clean integration** - CommandContext extended properly, TerminalPanel passes all needed state, types exported correctly.

4. **Graph visualization works** - Merge commits show two colored lines connecting to both parents. The color logic correctly uses the parent's branch color for the second parent line.

5. **Log output matches real git** - Commit decorations (HEAD ->, branch labels) formatted correctly. Merge line showing parent hashes included.

---

## Required Actions

None - all issues are minor and do not block functionality for a learning application.

---

## Learnings

| Learning | Applies To | Action |
|----------|-----------|--------|
| BFS for ancestor detection handles merge commits naturally | Future graph algorithms | Reuse pattern |
| Commit.parentIds as array (not single parent) enables clean merge support | Data model design | Continue this approach |
| ASCII graph rendering is complex - keep simple for learning apps | Log visualization | Don't over-engineer |
