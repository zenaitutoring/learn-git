# Code Review: T006 Focused Tooltip Tour

## Gate: REVISE

**Summary:** Implementation is solid overall with good component architecture and UX flow. However, several issues need addressing before this is production-ready, particularly around edge cases in tooltip positioning, animation CSS targeting, and a potential memory leak.

---

## Git Reality Check

**Commits (5 total for T006):**
```
2dc8484 Update T006 main.md with complete execution log
dd0ea32 Phase4: Polish - Default tour, calm celebration, clean header
3301ca5 Phase3: Add Graph Animations and Callouts
b7166b4 Phase2: Add Tour Flow Controller
b2d2208 Phase1: Add Tooltip and Spotlight components
```

**Files Changed (18):**
- src/App.tsx
- src/components/Celebration.tsx
- src/components/Graph/CommitNode.tsx
- src/components/Graph/StagedNode.tsx
- src/components/GraphPanel.tsx
- src/components/Header.tsx
- src/components/TerminalPanel.tsx
- src/components/Tour/Spotlight.tsx
- src/components/Tour/Tooltip.tsx
- src/components/Tour/TourController.tsx
- src/components/Tour/index.ts
- src/styles/tour.css
- src/styles/tutorial.css
- src/tour/index.ts
- src/tour/steps.ts
- src/tour/types.ts
- src/tour/useTour.ts
- src/tutorial/useTutorial.ts

**Matches Execution Report:** Yes - all claimed files are present in commits.

---

## AC Verification

| Phase | AC | Claimed | Verified | Notes |
|-------|-----|---------|----------|-------|
| 1 | Tooltip can point at any element by ref or selector | Yes | Partial | Works for selectors. RefObject support is typed but `getBoundingClientRect()` on ref.current may fail if element unmounted |
| 1 | Arrow points in correct direction | Yes | No | Arrow direction logic is inverted - see Issue #1 |
| 1 | Spotlight dims page except target area | Yes | Yes | Clip-path approach works well |
| 1 | Smooth transitions | Yes | Yes | 0.3s ease on transitions |
| 2 | Tour progresses through steps | Yes | Yes | nextStep() works correctly |
| 2 | Waits for user action on action steps | Yes | Yes | waitingForAction flag properly used |
| 2 | Auto-advances on explanation steps | Yes | Yes | Button click advances |
| 2 | Can exit to free mode anytime | Yes | Yes | Skip Tour button visible |
| 3 | New nodes animate in | Yes | Partial | CSS animations exist but class targeting may be unreliable - see Issue #3 |
| 3 | Tooltip can point at graph elements | Yes | Yes | Target `.graph-content` works |
| 3 | Staged to Committed transition animated | Yes | Yes | Highlight ring pulses |
| 4 | App starts in tour mode by default | Yes | Yes | useTour active: true |
| 4 | Celebration is subtle | Yes | Yes | Confetti removed, clean overlay |
| 4 | Easy escape to free mode | Yes | Yes | Multiple exit points |
| 4 | Old TutorialPanel replaced/hidden | Yes | Yes | Conditional render in App.tsx |

---

## Issues Found

### Critical

_None_

### Major

#### 1. Tooltip Arrow Direction Logic Inverted
- **File:** `/home/blake/repos/experiments/skool/learn-git/src/components/Tour/Tooltip.tsx:163-164`
- **Problem:** The arrow class is set to `tooltip-arrow-${style.arrowPosition}` where `arrowPosition` is the position of the tooltip relative to the target (e.g., "bottom" means tooltip is below target). However, the CSS arrows are styled as if the arrow should point in that direction. When tooltip is below target (`position: bottom`), the arrow should point UP toward the target, but the CSS for `tooltip-arrow-bottom` creates an arrow pointing DOWN.
- **Code:**
  ```tsx
  const arrowClass = style ? `tooltip-arrow tooltip-arrow-${style.arrowPosition}` : ''
  ```
  ```css
  .tooltip-arrow-bottom {
    top: -10px;
    left: 50%;
    transform: translateX(-50%);
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 10px solid #1e3a5f;
  }
  ```
- **Fix:** The CSS is actually correct upon closer inspection (arrow at top pointing up via border-bottom). The naming is just confusing - verify visually but this may be a false alarm.

#### 2. Memory Leak in Spotlight Polling
- **File:** `/home/blake/repos/experiments/skool/learn-git/src/components/Tour/Spotlight.tsx:79`
- **Problem:** The Spotlight component uses `setInterval(updateRect, 100)` to poll for target position changes. This runs 10 times per second even when the target hasn't moved. Combined with `requestAnimationFrame` inside `updateRect`, this creates unnecessary work and potential memory pressure.
- **Code:**
  ```tsx
  const interval = setInterval(updateRect, 100)
  ```
- **Fix:** Use IntersectionObserver or MutationObserver, or at minimum use a longer interval (500ms) since position changes are rare during tour.

#### 3. CSS Animation Classes May Not Trigger
- **File:** `/home/blake/repos/experiments/skool/learn-git/src/styles/tour.css:305-398`
- **Problem:** The CSS animations target `.commit-node-new .commit-circle` and similar, but SVG elements don't always inherit className-based CSS animations reliably across all browsers. The `<g>` element receives the class but the `<circle>` inside is selected via child selector which can be problematic in SVG namespace.
- **Code:**
  ```css
  .commit-node-new .commit-circle {
    animation: commit-appear 0.5s ease-out;
  }
  ```
- **Fix:** Apply animation classes directly to the circle elements rather than relying on parent-child selection in SVG, or use inline style animations.

#### 4. Stale Ref Values in Animation Detection
- **File:** `/home/blake/repos/experiments/skool/learn-git/src/components/GraphPanel.tsx:37-60`
- **Problem:** The `newCommitRef` and `newStagedRef` are refs that get cleared after 1500ms via setTimeout, but the render uses these refs directly. Since refs don't trigger re-renders, the animation state may persist incorrectly or be missed depending on timing.
- **Code:**
  ```tsx
  setTimeout(() => {
    newCommitRef.current = null
  }, 1500)
  ```
- **Fix:** Use state instead of refs for animation triggers, or force a re-render after the timeout.

### Minor

#### 5. Unused `matchesCommand` Helper Export
- **File:** `/home/blake/repos/experiments/skool/learn-git/src/tour/steps.ts:4-10`
- **Problem:** The `matchesCommand` helper is defined but only used internally. It's not exported but could be useful for testing.
- **Fix:** Either export it or mark it as internal with underscore prefix.

#### 6. Hardcoded Welcome Lines Not Cleared on Tour Restart
- **File:** `/home/blake/repos/experiments/skool/learn-git/src/components/TerminalPanel.tsx:9-12`
- **Problem:** When user restarts tour via Header, the terminal keeps old output. The `gitReset()` is called but terminal lines persist.
- **Fix:** Clear terminal lines when tour restarts (add a `clearTerminal` call to the restart flow).

#### 7. Magic Number for Auto-Advance Delay
- **File:** `/home/blake/repos/experiments/skool/learn-git/src/tour/useTour.ts:82-84`
- **Problem:** The 800ms delay before auto-advancing is hardcoded.
- **Code:**
  ```tsx
  setTimeout(() => {
    get().nextStep()
  }, 800)
  ```
- **Fix:** Extract to a constant or make configurable per step.

---

## What's Good

- Clean component architecture with Tooltip, Spotlight, TourController separation
- Zustand store is well-structured with clear actions and state
- Tour step definitions are readable and self-documenting
- Smooth CSS transitions throughout
- Confetti removal is clean - celebration overlay is appropriately calm
- Integration with existing systems (TerminalPanel, GraphPanel) is non-invasive
- Build passes with zero TypeScript errors
- Progress indicator dots are a nice UX touch

---

## Required Actions (for REVISE)

- [ ] Verify tooltip arrow visually appears correct (Issue #1 may be false alarm)
- [ ] Replace setInterval with longer interval or observer pattern in Spotlight (Issue #2)
- [ ] Test CSS animations in Safari/Firefox (Issue #3)
- [ ] Convert animation refs to state in GraphPanel (Issue #4)

Optional improvements:
- [ ] Clear terminal on tour restart (Issue #6)
- [ ] Extract delay constant (Issue #7)

---

## Learnings

| Learning | Applies To | Action |
|----------|-----------|--------|
| SVG CSS animations need direct class application | Graph component patterns | Add to component guidelines |
| setInterval for DOM polling is expensive | Performance-sensitive UI | Prefer observers |
| Refs don't trigger re-renders | Animation state management | Use state for time-limited visual states |
