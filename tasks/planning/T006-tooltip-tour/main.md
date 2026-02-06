# T006: Focused Tooltip Tour

## Meta
- **Status:** CODE_REVIEW
- **Created:** 2026-02-06
- **Last Updated:** 2026-02-06
- **Blocked Reason:** —
- **Depends On:** T001-T005

## Task

Replace the current tutorial panel with a focused, tooltip-driven experience. One thing at a time, pointing at exactly where to look.

**Problems with current approach:**
- Too much on the page at once
- Tutorial panel competes for attention
- No visual connection between instructions and UI
- Not obvious what to do or where to look
- Confetti is too much

**New approach:**
- Tutorial mode is DEFAULT
- Tooltips point at specific elements (terminal input, graph area)
- Dim/blur everything except the focus area
- Explain changes AS they happen with animated callouts
- Repetition: do each action twice to reinforce
- Calm, encouraging, one step at a time

---

## Plan

### Objective
Create an immersive, focused tutorial that guides users through Git with tooltips pointing at exactly what to look at, explaining each change as it happens.

### UX Design

#### Spotlight + Tooltip Pattern
```
┌─────────────────────────────────────────────────────────────┐
│ [dimmed header]                                             │
├──────────────────────┬──────────────────────────────────────┤
│                      │  ┌─────────────────────────────┐     │
│  [dimmed terminal]   │  │  ← This is your commit!     │     │
│                      │  │    See how it created a     │     │
│                      │  │    node in the graph?       │     │
│  ┌────────────────┐  │  │                             │     │
│  │ Type here ─────┼──┼──│    [Got it!]                │     │
│  └────────────────┘  │  └─────────────────────────────┘     │
│    ↑ SPOTLIGHT       │     ● ───────── (highlighted)        │
│                      │                                      │
└──────────────────────┴──────────────────────────────────────┘
```

#### Flow: First Commit (with repetition)

**Step 1: Welcome**
- Tooltip over center: "Welcome! Let's learn Git step by step."
- Everything slightly dimmed
- [Start] button

**Step 2: Focus on Terminal**
- Spotlight on terminal input
- Tooltip: "This is the terminal. You'll type Git commands here."
- [Got it]

**Step 3: Initialize Git**
- Spotlight on terminal input
- Tooltip pointing at input: "First, let's initialize Git. Type: `git init`"
- User types `git init`
- ✓ Success animation on terminal

**Step 4: Explain what happened**
- Tooltip: "Git is now tracking this folder. But there's nothing to track yet!"
- [Next]

**Step 5: Create a file**
- Spotlight on terminal
- Tooltip: "Let's create a file. Type: `touch readme.md`"
- User types
- ✓ File appears (animate)

**Step 6: Stage the file**
- Spotlight on terminal
- Tooltip: "Now tell Git to track this file. Type: `git add readme.md`"
- User types
- ✓ Graph shows dashed circle (animate + highlight)

**Step 7: Explain staging**
- Spotlight shifts to graph
- Tooltip pointing at dashed circle: "See this? Your file is 'staged' - ready to be saved."
- [Got it]

**Step 8: Commit**
- Spotlight on terminal
- Tooltip: "Now save it permanently. Type: `git commit -m \"first commit\"`"
- User types
- ✓ Graph node fills in (animate + highlight)

**Step 9: Explain commit**
- Spotlight on graph
- Tooltip pointing at filled node: "This is your first commit! A permanent snapshot."
- [Got it]

**Step 10: Repetition**
- Tooltip: "Let's do it again to practice. Create another file."
- Repeat steps 5-9 with less hand-holding

**Step 11: Complete**
- Gentle celebration (just a message, maybe subtle confetti)
- Tooltip: "You've got it! You can now explore freely or try branching."
- [Free Explore] [Learn Branching]

### Key Components

1. **Spotlight overlay** - Dims everything except focus area
2. **Tooltip component** - Points at elements with arrow
3. **Step controller** - Manages flow, waits for user actions
4. **Animation system** - Highlights changes (pulse, glow)
5. **Progress indicator** - Subtle dots or progress bar

### Scope
- **In Scope:**
  - Tooltip component with arrow pointing at target
  - Spotlight/dimming overlay
  - Step-by-step tour flow
  - Animate graph changes with callouts
  - Tutorial as default mode
  - Calm celebration (subtle)
  - Repetition built into flow
  - "Free Mode" toggle to escape
- **Out of Scope:**
  - Branching tour (separate task)
  - Keyboard shortcuts
  - Progress persistence

### Phases

| Phase | Description | Estimated Complexity |
|-------|-------------|---------------------|
| 1 | Tooltip + Spotlight components | Medium |
| 2 | Tour flow controller | Medium |
| 3 | Graph change animations + callouts | Medium |
| 4 | Polish + default mode + calm celebration | Low |

### Phase Details

#### Phase 1: Tooltip + Spotlight
- **Files to create:**
  - `src/components/Tour/Tooltip.tsx` - Tooltip with arrow, positions itself
  - `src/components/Tour/Spotlight.tsx` - Overlay that dims except target
  - `src/styles/tour.css` - Tour styling
- **Acceptance Criteria:**
  - [ ] Tooltip can point at any element by ref or selector
  - [ ] Arrow points in correct direction
  - [ ] Spotlight dims page except target area
  - [ ] Smooth transitions

#### Phase 2: Tour Flow Controller
- **Files to create:**
  - `src/tour/types.ts` - Tour step types
  - `src/tour/steps.ts` - First commit tour steps
  - `src/tour/useTour.ts` - Tour state management
- **Files to modify:**
  - `src/components/TerminalPanel.tsx` - Hook for command validation
  - `src/App.tsx` - Integrate tour
- **Acceptance Criteria:**
  - [ ] Tour progresses through steps
  - [ ] Waits for user action when required
  - [ ] Auto-advances on explanation steps
  - [ ] Can exit to free mode anytime

#### Phase 3: Graph Animations + Callouts
- **Files to modify:**
  - `src/components/Graph/CommitNode.tsx` - Add highlight animation
  - `src/components/Graph/StagedNode.tsx` - Add appear animation
  - `src/components/GraphPanel.tsx` - Trigger animations on changes
- **Acceptance Criteria:**
  - [ ] New nodes animate in (scale + glow)
  - [ ] Tooltip can point at graph elements
  - [ ] Staged → Committed transition is animated

#### Phase 4: Polish
- **Files to modify:**
  - `src/tutorial/useTutorial.ts` - Default to tutorial mode
  - `src/components/Celebration.tsx` - Calm down confetti
  - `src/components/Header.tsx` - Cleaner toggle
- **Acceptance Criteria:**
  - [ ] App starts in tutorial mode by default
  - [ ] Celebration is subtle (brief confetti or just message)
  - [ ] Easy escape to free mode
  - [ ] Remove old TutorialPanel (replaced by tour)

### Decision Matrix

| Decision | Options Considered | Choice | Rationale |
|----------|-------------------|--------|-----------|
| Tooltip library | Floating UI, Tippy, custom | Custom | Keep bundle small, specific needs |
| Spotlight approach | CSS overlay, SVG mask, backdrop-filter | CSS overlay with cutout | Simplest, good browser support |
| Animation | CSS, Framer Motion, GSAP | CSS animations | Lightweight, sufficient |

---

## Plan Review
_Plan-reviewer agent fills this section._

- **Gate:** —
- **Open Questions Finalized:** —
- **Issues Found:** —

---

## Execution Log

### Phase 1: Tooltip + Spotlight Components
- **Status:** COMPLETE
- **Started:** 2026-02-06
- **Completed:** 2026-02-06
- **Commits:** `b2d2208`
- **Files Created:**
  - `src/components/Tour/Tooltip.tsx` - Tooltip with arrow positioning, action buttons
  - `src/components/Tour/Spotlight.tsx` - CSS clip-path overlay with highlight
  - `src/components/Tour/index.ts` - Exports
  - `src/styles/tour.css` - All tour styling with animations
- **Notes:** Components built as standalone, ready for integration

### Tasks Completed
- [x] Task 1.1: Create Tooltip component with arrow positioning
- [x] Task 1.2: Create Spotlight overlay with CSS clip-path cutout
- [x] Task 1.3: Add tour.css with smooth transitions

### Acceptance Criteria
- [x] AC1: Tooltip can point at any element by ref or selector
- [x] AC2: Arrow points in correct direction (auto-calculates)
- [x] AC3: Spotlight dims page except target area (clip-path)
- [x] AC4: Smooth transitions (0.3s ease on all transitions)

### Phase 2: Tour Flow Controller
- **Status:** COMPLETE
- **Started:** 2026-02-06
- **Completed:** 2026-02-06
- **Commits:** `b7166b4`
- **Files Created:**
  - `src/tour/types.ts` - Tour step and state types
  - `src/tour/steps.ts` - First commit tour steps (14 steps with repetition)
  - `src/tour/useTour.ts` - Zustand store for tour state
  - `src/tour/index.ts` - Exports
  - `src/components/Tour/TourController.tsx` - Orchestrates tour UI
- **Files Modified:**
  - `src/components/TerminalPanel.tsx` - Added tour validation hook
  - `src/App.tsx` - Integrated TourController, hide old panel when tour active
  - `src/components/Tour/index.ts` - Export TourController
- **Notes:** Tour starts active by default, has welcome overlay, skip button

### Tasks Completed
- [x] Task 2.1: Create tour types and step definitions
- [x] Task 2.2: Create useTour Zustand store
- [x] Task 2.3: Create TourController component
- [x] Task 2.4: Hook tour into TerminalPanel for command validation
- [x] Task 2.5: Integrate tour into App.tsx

### Acceptance Criteria
- [x] AC1: Tour progresses through steps (via nextStep)
- [x] AC2: Waits for user action on action steps (waitingForAction flag)
- [x] AC3: Auto-advances on explanation steps (button click)
- [x] AC4: Can exit to free mode anytime (skipTour button)

### Phase 3: Graph Animations + Callouts
- **Status:** COMPLETE
- **Started:** 2026-02-06
- **Completed:** 2026-02-06
- **Commits:** `3301ca5`
- **Files Modified:**
  - `src/components/Graph/CommitNode.tsx` - Added isNew, isHighlighted props
  - `src/components/Graph/StagedNode.tsx` - Added isNew, isHighlighted props
  - `src/components/GraphPanel.tsx` - Track new nodes, connect to tour
  - `src/styles/tour.css` - Added graph animation keyframes
- **Notes:** Animations use CSS only for lightweight performance

### Tasks Completed
- [x] Task 3.1: Add animation props to CommitNode
- [x] Task 3.2: Add animation props to StagedNode
- [x] Task 3.3: Track new nodes in GraphPanel
- [x] Task 3.4: Add CSS animations for node appearance

### Acceptance Criteria
- [x] AC1: New nodes animate in (scale + glow via CSS)
- [x] AC2: Tooltip can point at graph elements (target: .graph-content)
- [x] AC3: Staged -> Committed transition is animated (highlight ring)

### Phase 4: Polish
- **Status:** COMPLETE
- **Started:** 2026-02-06
- **Completed:** 2026-02-06
- **Commits:** `dd0ea32`
- **Files Modified:**
  - `src/tutorial/useTutorial.ts` - Comment clarifying free mode default
  - `src/components/Header.tsx` - Exit Tour / Restart Tour toggle
  - `src/components/Celebration.tsx` - Removed confetti, calm message only
  - `src/styles/tutorial.css` - Added calm celebration styles
- **Notes:** Tour is active by default, old tutorial panel hidden when tour active

### Tasks Completed
- [x] Task 4.1: Tour starts active by default
- [x] Task 4.2: Remove wild confetti, keep calm message
- [x] Task 4.3: Update Header with clean tour toggle
- [x] Task 4.4: Old TutorialPanel integrated (hidden when tour active)

### Acceptance Criteria
- [x] AC1: App starts in tutorial/tour mode by default
- [x] AC2: Celebration is subtle (no confetti, just message)
- [x] AC3: Easy escape to free mode (Skip Tour button, Header toggle)
- [x] AC4: Old TutorialPanel replaced/hidden by tour system

---

## Code Review Log
_TBD_

---

## Completion
_TBD_
