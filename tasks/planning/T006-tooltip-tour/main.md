# T006: Focused Tooltip Tour

## Meta
- **Status:** EXECUTING_PHASE_1
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
_TBD_

---

## Code Review Log
_TBD_

---

## Completion
_TBD_
