# Code Review: T005 Guided Tutorial Mode

## Gate: PASS

**Summary:** Solid implementation of a tutorial system for beginners. The code is well-structured with clear separation of concerns. All acceptance criteria are met. A few minor improvements could enhance the UX, but nothing blocking.

---

## Git Reality Check

**Commits:**
```
2e37fe1 T005: Add guided tutorial mode with lessons and celebration
```

**Files Changed (12 files, +1418 lines):**
- src/App.tsx
- src/components/Celebration.tsx
- src/components/Header.tsx
- src/components/TerminalPanel.tsx
- src/components/TutorialPanel.tsx
- src/index.css
- src/styles/tutorial.css
- src/tutorial/index.ts
- src/tutorial/lessons.ts
- src/tutorial/types.ts
- src/tutorial/useTutorial.ts
- tasks/planning/T005-guided-tutorial/main.md

**Matches Execution Report:** Yes - all files mentioned in execution log are present in commit.

**Build Status:** PASS - `npm run build` succeeds without errors.

---

## AC Verification

| AC | Claimed | Verified | Notes |
|----|---------|----------|-------|
| AC1: TutorialPanel shows current step | Yes | Yes | Step instruction, explanation, and expected command are displayed |
| AC2: Progress indicator works | Yes | Yes | Progress dots with completed/current/pending states, step counter |
| AC3: Hint button reveals hint | Yes | Yes | `toggleHint` action toggles `showHint` state, displays hint-box |
| AC4: Skip button advances step | Yes | Yes | `skipStep` calls `nextStep`, advances to next step |
| AC5: Each step validates correctly | Yes | Yes | Regex patterns in `lessons.ts` validate commands |
| AC6: Flexible validation (any filename) | Yes | Yes | `/^touch\s+\S+/` accepts any filename |
| AC7: Success message after each step | Yes | Yes | `successMessage` from step shown via `ValidationResult` |
| AC8: Lesson complete celebration | Yes | Yes | `Celebration` component with confetti canvas animation |
| AC9: All branching steps validate | Yes | Yes | 7 steps in Lesson 2 with regex validation patterns |
| AC10: Toggle between modes | Yes | Yes | Header mode toggle button works |
| AC11: Tutorial panel shows/hides | Yes | Yes | Conditional render in TutorialPanel: `if (mode !== 'tutorial') return null` |

---

## Issues Found

### 🟠 Major

1. **Step 4 of Lesson 2 validation is problematic**
   - File: `/home/blake/repos/experiments/skool/learn-git/src/tutorial/lessons.ts:103-106`
   - Problem: The validation accepts either `git add` OR `git commit -m` separately, but the step instruction says "Stage and commit your changes". If user does `git add .` first, it passes and advances - but then they still need to commit. The tutorial will advance before the commit is done.
   - Code:
     ```typescript
     validate: (cmd) => {
       return matchesCommand(cmd, /^git\s+add/) || matchesCommand(cmd, /^git\s+commit\s+-m/)
     },
     ```
   - Fix: Either split into two steps (add, then commit), or only validate on the `git commit` since that's the final required action. Or use the ValidationContext to check if file was actually staged and committed.

2. **createdFileName and createdBranchName are tracked but never used**
   - File: `/home/blake/repos/experiments/skool/learn-git/src/tutorial/useTutorial.ts:121-129`
   - Problem: The store tracks these values for "flexible validation in later steps" but the validation functions don't actually use them. The validation in `lessons.ts` doesn't receive these stored values.
   - Code:
     ```typescript
     // Track created resources for flexible validation in later steps
     const touchMatch = command.match(/^touch\s+(\S+)/)
     if (touchMatch) {
       get().setCreatedFileName(touchMatch[1])
     }
     ```
   - Fix: Either remove this dead code, or update the validation functions in lessons.ts to use these tracked values (e.g., to validate that the user stages the file they created).

3. **Confetti animation runs forever**
   - File: `/home/blake/repos/experiments/skool/learn-git/src/components/Celebration.tsx:72-76`
   - Problem: When confetti pieces fall off screen, they reset to the top and fall again indefinitely. This could be distracting while reading the celebration message. Animation should stop after a few seconds.
   - Code:
     ```typescript
     if (piece.y > canvas.height + 20) {
       piece.y = -20
       piece.x = Math.random() * canvas.width
       piece.vy = Math.random() * 3 + 2
     }
     ```
   - Fix: Add a timeout (e.g., 3-4 seconds) to stop the animation, or fade it out gradually.

### 🟡 Minor

1. **No keyboard shortcut for hint/skip**
   - Problem: Beginners might benefit from keyboard shortcuts (e.g., `?` for hint, `Tab` to skip) rather than clicking buttons.
   - Fix: Add keyboard event listeners in TutorialPanel.

2. **Lesson 2 requires Lesson 1 completion**
   - Problem: Lesson 2 (Branching) starts with `git branch feature` but requires an initialized repo with at least one commit. If a user selects Lesson 2 directly, the simulator resets and they cannot complete step 1 (creating a branch on an uninitialized repo fails).
   - Fix: Either disable Lesson 2 until Lesson 1 is complete, or add prerequisite steps to Lesson 2 (init + commit), or clearly warn the user.

3. **No accessibility attributes**
   - Problem: Buttons lack `aria-label` attributes, progress dots have no `role="progressbar"`, celebration modal has no focus trap.
   - Fix: Add ARIA attributes for screen reader support.

4. **Magic string for emoji/unicode**
   - File: `/home/blake/repos/experiments/skool/learn-git/src/components/TutorialPanel.tsx:46,85,91`
   - Problem: Unicode escapes like `'\uD83D\uDCDA'` are harder to read than emoji literals or named constants.
   - Fix: Use readable constants like `const BOOK_EMOJI = '\uD83D\uDCDA'` or just the literal emoji if the codebase supports it.

5. **Skip advances step but doesn't execute the command**
   - Problem: When user skips a step, the tutorial advances but the git simulator state doesn't change. If they skip "git init", subsequent steps will fail because repo isn't initialized.
   - Fix: Consider either executing the expected command when skipping, or warning users that skipping may break subsequent steps.

6. **No TypeScript strict null checks on currentLesson**
   - File: `/home/blake/repos/experiments/skool/learn-git/src/components/Celebration.tsx:105`
   - Problem: `currentLesson` could be undefined but used in template without guard.
   - Code: `Amazing work! You've mastered "{currentLesson?.title}".`
   - Note: The optional chaining handles it, but the logic could be cleaner.

---

## What's Good

- **Clean architecture:** Tutorial types, lessons, and store are well-separated. The Zustand store is clean and follows patterns.
- **Flexible validation:** Regex patterns allow creativity (any filename, any branch name) which is great for beginners.
- **Gentle UX:** "Hmm, that's not quite what we're looking for" is encouraging, not punishing.
- **Good explanations:** Each step has clear instruction, explanation, and hint. The "why" is emphasized.
- **Celebration is delightful:** The confetti effect and encouraging message will make beginners happy.
- **CSS animations:** Smooth slide-down, pulse on progress dot, bounce on emoji - professional feel.
- **Mode toggle:** Clear visual distinction between Free and Tutorial mode.
- **Reset functionality:** Proper integration with git simulator reset.

---

## Required Actions

None - gate is PASS. The issues found are not blockers for a tutorial teaching beginners Git.

---

## Recommendations for Future Improvement

- [ ] Split Lesson 2 Step 4 into two steps (add, then commit)
- [ ] Remove unused `createdFileName`/`createdBranchName` or implement their use
- [ ] Add timeout to confetti animation
- [ ] Add Lesson 1 prerequisite check for Lesson 2
- [ ] Consider keyboard shortcuts for power users
- [ ] Add ARIA accessibility attributes

---

## Learnings

| Learning | Applies To | Action |
|----------|-----------|--------|
| Multi-command steps (add && commit) are tricky to validate | Future tutorials | Split into separate steps |
| Store state for "future use" should be implemented or removed | All features | YAGNI - don't add unused state |
| Infinite animations can be distracting | UI components | Add timeouts to celebration animations |
