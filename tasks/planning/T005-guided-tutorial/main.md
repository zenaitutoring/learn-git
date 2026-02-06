# T005: Guided Tutorial Mode

## Meta
- **Status:** CODE_REVIEW
- **Created:** 2026-02-06
- **Last Updated:** 2026-02-06
- **Blocked Reason:** —
- **Depends On:** T001-T004

## Task

Add a guided tutorial mode for beginners. Step-by-step lessons with tooltips, hints, and validation.

**Problem:** Free exploration is overwhelming for students who don't know Git yet.

**Solution:** A "Tutorial Mode" that:
- Walks through Git basics step-by-step
- Shows what to type next
- Validates each step before proceeding
- Explains WHY each command matters
- Celebrates progress

---

## Plan

### Objective
Create an optional tutorial mode that guides complete beginners through their first Git workflow with contextual hints, validation, and encouragement.

### Scope
- **In Scope:**
  - Tutorial mode toggle (free mode vs guided mode)
  - Lesson 1: First commit (init → touch → add → commit)
  - Lesson 2: Branching (branch → checkout → commit → merge)
  - Step-by-step prompts with expected command
  - Validation: check if user ran correct command
  - "Hint" button if stuck
  - Progress indicator
  - Contextual explanations (why this step matters)
- **Out of Scope:**
  - Multiple difficulty levels
  - Custom lesson editor
  - Saving progress across sessions

### UX Design

#### Tutorial Panel (top or side)
```
┌─────────────────────────────────────────────────────────────┐
│  📚 Lesson 1: Your First Commit          Step 2 of 5  ●●○○○ │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Create a file to track                                     │
│                                                             │
│  Git can only track files that exist. Let's create one.     │
│                                                             │
│  👉 Type: touch readme.md                                   │
│                                                             │
│  [Show Hint]                              [Skip Step]       │
└─────────────────────────────────────────────────────────────┘
```

#### Step Validation
- User types command → check if it matches expected
- Correct: ✅ "Great! The file is created. Now let's tell Git about it."
- Wrong: Gentle nudge "Hmm, try `touch readme.md` to create a file first"
- Allow flexibility (e.g., `touch foo.txt` also works for "create a file")

#### Lesson Structure

**Lesson 1: Your First Commit**
| Step | Instruction | Expected | Validation |
|------|-------------|----------|------------|
| 1 | Initialize Git | `git init` | repo initialized |
| 2 | Create a file | `touch <any>.md` | file exists |
| 3 | Check status | `git status` | shows untracked |
| 4 | Stage the file | `git add <file>` | file staged |
| 5 | Commit | `git commit -m "..."` | commit created |

**Lesson 2: Branching & Merging**
| Step | Instruction | Expected | Validation |
|------|-------------|----------|------------|
| 1 | Create branch | `git branch feature` | branch exists |
| 2 | Switch to it | `git checkout feature` | HEAD on feature |
| 3 | Make a change | `touch feature.js` | file exists |
| 4 | Add and commit | `git add . && git commit` | commit on feature |
| 5 | Switch back | `git checkout main` | HEAD on main |
| 6 | Merge | `git merge feature` | merge complete |
| 7 | View history | `git log --oneline --graph` | see the merge |

### Phases

| Phase | Description | Estimated Complexity |
|-------|-------------|---------------------|
| 1 | Tutorial state & UI component | Medium |
| 2 | Lesson 1 implementation | Medium |
| 3 | Lesson 2 implementation | Low |
| 4 | Polish & mode toggle | Low |

### Phase Details

#### Phase 1: Tutorial State & UI
- **Objective:** Build tutorial infrastructure
- **Files to create:**
  - `src/tutorial/types.ts` - Lesson, Step, TutorialState types
  - `src/tutorial/lessons.ts` - Lesson definitions
  - `src/tutorial/useTutorial.ts` - Tutorial state hook
  - `src/components/TutorialPanel.tsx` - UI component
  - `src/styles/tutorial.css` - Styling
- **Acceptance Criteria:**
  - [ ] TutorialPanel shows current step
  - [ ] Progress indicator works
  - [ ] Hint button reveals hint
  - [ ] Skip button advances step

#### Phase 2: Lesson 1 - First Commit
- **Objective:** Complete first lesson with validation
- **Files to modify:**
  - `src/tutorial/lessons.ts` - Add Lesson 1 steps
  - `src/components/TerminalPanel.tsx` - Hook into command execution for validation
- **Acceptance Criteria:**
  - [ ] Each step validates correctly
  - [ ] Flexible validation (any filename works)
  - [ ] Success message after each step
  - [ ] Lesson complete celebration

#### Phase 3: Lesson 2 - Branching
- **Objective:** Second lesson covering branches and merge
- **Files to modify:**
  - `src/tutorial/lessons.ts` - Add Lesson 2 steps
- **Acceptance Criteria:**
  - [ ] All branching steps validate
  - [ ] Explains what merge does
  - [ ] Shows graph after merge

#### Phase 4: Polish & Mode Toggle
- **Objective:** Clean UX for switching modes
- **Files to modify:**
  - `src/App.tsx` - Mode toggle in header
  - `src/components/Header.tsx` - Add toggle button
- **Acceptance Criteria:**
  - [ ] Toggle between "Free Mode" and "Tutorial Mode"
  - [ ] Tutorial mode shows panel, free mode hides it
  - [ ] Persists choice in session

### Decision Matrix

| Decision | Options Considered | Choice | Rationale |
|----------|-------------------|--------|-----------|
| Tutorial position | Side panel, top banner, modal | Top banner | Less intrusive, always visible |
| Validation strictness | Exact match, flexible, regex | Flexible with patterns | Allow creativity (any filename) |
| Progress persistence | localStorage, none | None | Keep it simple, refresh = restart |
| Lesson format | JSON, TypeScript objects | TypeScript objects | Type safety, easy to edit |

---

## Open Questions

1. **Should wrong commands be blocked?** Or allow them and just show "that's not what we expected"?
2. **Reset lesson button?** Let users restart a lesson?
3. **Celebration at end?** Confetti? Simple message?

---

## Plan Review
_Plan-reviewer agent fills this section._

- **Gate:** —
- **Open Questions Finalized:** —
- **Issues Found:** —

---

## Execution Log

### Phase 1: Tutorial State & UI
- **Status:** COMPLETE
- **Started:** 2026-02-06
- **Completed:** 2026-02-06
- **Files Created:**
  - `src/tutorial/types.ts` - Tutorial types (TutorialStep, Lesson, ValidationContext, TutorialState, ValidationResult)
  - `src/tutorial/lessons.ts` - Lesson definitions with 2 lessons (First Commit, Branching & Merging)
  - `src/tutorial/useTutorial.ts` - Zustand store for tutorial state management
  - `src/tutorial/index.ts` - Module exports
  - `src/components/TutorialPanel.tsx` - Tutorial panel UI with progress dots, hints, skip
  - `src/styles/tutorial.css` - Styling with animations (slide, fade, pulse)
- **Files Modified:**
  - `src/App.tsx` - Added TutorialPanel component
- **Notes:** Implemented animated progress dots, hint toggle, skip button, lesson selector

### Phase 2: Lesson 1 - First Commit
- **Status:** COMPLETE
- **Started:** 2026-02-06
- **Completed:** 2026-02-06
- **Files Modified:**
  - `src/components/TerminalPanel.tsx` - Hooked tutorial validation into command execution
- **Notes:** Flexible validation allows any filename for touch commands, any message for commits. Success/nudge messages shown after each command.

### Phase 3: Lesson 2 - Branching & Merging
- **Status:** COMPLETE
- **Started:** 2026-02-06
- **Completed:** 2026-02-06
- **Notes:** Lesson 2 was already defined in Phase 1. 7 steps covering branch creation, checkout, commit on branch, merge, and log --graph.

### Phase 4: Polish & Mode Toggle
- **Status:** COMPLETE
- **Started:** 2026-02-06
- **Completed:** 2026-02-06
- **Files Created:**
  - `src/components/Celebration.tsx` - Celebration overlay with canvas confetti animation
- **Files Modified:**
  - `src/components/Header.tsx` - Added mode toggle button (Free Mode / Tutorial Mode)
  - `src/components/TutorialPanel.tsx` - Added lesson selector and reset button
  - `src/index.css` - Header layout for mode toggle
  - `src/App.tsx` - Added Celebration component
- **Notes:** Confetti uses canvas animation with 150 particles. Celebration has "Next Lesson" and "Free Explore" buttons.

### Design Decisions Applied (from user):
1. Wrong commands: ALLOWED - shows gentle "try this instead" nudge
2. Reset button: YES - resets both tutorial state and git simulator
3. Celebration: YES with ANIMATIONS - confetti, bouncing emoji, encouraging messages

### Tasks Completed
- [x] Task 1.1: Create tutorial types
- [x] Task 1.2: Create lesson definitions (both lessons in one file)
- [x] Task 1.3: Create useTutorial Zustand store
- [x] Task 1.4: Create TutorialPanel component
- [x] Task 1.5: Create tutorial.css with animations
- [x] Task 2.1: Hook validation into TerminalPanel
- [x] Task 2.2: Implement flexible validation (any filename)
- [x] Task 3.1: Lesson 2 steps (done in Phase 1)
- [x] Task 4.1: Mode toggle in Header
- [x] Task 4.2: Celebration component with confetti
- [x] Task 4.3: Lesson selector and reset button

### Acceptance Criteria
- [x] AC1: TutorialPanel shows current step - verified in build
- [x] AC2: Progress indicator works - progress dots with completed/current states
- [x] AC3: Hint button reveals hint - toggleHint action implemented
- [x] AC4: Skip button advances step - skipStep calls nextStep
- [x] AC5: Each step validates correctly - validateCommand in useTutorial
- [x] AC6: Flexible validation - regex patterns allow any filename
- [x] AC7: Success message after each step - shown in terminal output
- [x] AC8: Lesson complete celebration - Celebration component with confetti
- [x] AC9: All branching steps validate - 7 steps with validation patterns
- [x] AC10: Toggle between modes - Header mode toggle button
- [x] AC11: Tutorial panel shows/hides - conditional render based on mode

---

## Code Review Log
_TBD_

---

## Completion
_TBD_
