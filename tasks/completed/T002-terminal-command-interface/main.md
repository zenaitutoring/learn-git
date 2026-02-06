# T002: Terminal & Command Interface

## Meta
- **Status:** COMPLETE
- **Created:** 2026-02-06
- **Last Updated:** 2026-02-06
- **Blocked Reason:** —
- **Depends On:** T001

## Task

Build the terminal UI component and command parser that executes against the Git simulator.

**Deliverables:**
- Terminal component with input, command history, and styled output
- Command parser for Git commands and shell commands
- Integration with GitSimulator from T001
- Realistic terminal feel (prompt, colors, scrolling)

**Commands to implement:**
- Git: `git init`, `git add`, `git commit`, `git status`, `git branch`, `git checkout`, `git switch`
- Shell: `touch`, `echo "..." > file`, `ls`, `cat`, `clear`

**Visual reference:** See terminal styling in `mockup.html`:
- Dark background (#0d1117)
- Green prompt with arrow (➜)
- Branch indicator in purple
- Colored output (green success, orange staged, red errors)
- Blinking cursor

---

## Plan
_Planner agent fills this section._

### Objective
Create an interactive terminal that parses user commands and executes them against the Git simulator, displaying realistic output.

### Scope
- **In Scope:**
  - Terminal UI component with xterm.js-like feel (or custom implementation)
  - Command history (up/down arrows)
  - Command parser that tokenizes input
  - Git command handlers (init, add, commit, status, branch, checkout, switch)
  - Shell command handlers (touch, echo, ls, cat, clear)
  - Output formatting matching real Git output
- **Out of Scope:**
  - Graph visualization (T003)
  - Advanced commands (merge, rebase, log --graph) — future tasks

### Phases

| Phase | Description | Estimated Complexity |
|-------|-------------|---------------------|
| 1 | Terminal UI component | Medium |
| 2 | Command parser + shell commands | Medium |
| 3 | Git command handlers | Medium |

### Phase Details

#### Phase 1: Terminal UI Component
- **Objective:** Build interactive terminal with input/output
- **Files to create/modify:**
  - `src/components/TerminalPanel.tsx` - main component
  - `src/components/Terminal/TerminalInput.tsx` - input line with cursor
  - `src/components/Terminal/TerminalOutput.tsx` - scrollable output area
  - `src/components/Terminal/TerminalLine.tsx` - single output line
  - `src/styles/terminal.css` - terminal-specific styles from mockup
- **Acceptance Criteria:**
  - [ ] Can type commands in input field
  - [ ] Enter submits command
  - [ ] Output appears above input
  - [ ] Auto-scroll to bottom on new output
  - [ ] Up/down arrows navigate command history
  - [ ] Prompt shows current branch: `➜ (main)`

#### Phase 2: Command Parser + Shell Commands
- **Objective:** Parse input and execute shell commands
- **Files to create:**
  - `src/commands/parser.ts` - tokenize and parse commands
  - `src/commands/types.ts` - command types
  - `src/commands/shell.ts` - shell command handlers
  - `src/commands/index.ts` - command registry
- **Acceptance Criteria:**
  - [ ] `touch file.txt` creates virtual file
  - [ ] `echo "content" > file.txt` writes to file
  - [ ] `ls` lists virtual files
  - [ ] `cat file.txt` shows file content
  - [ ] `clear` clears terminal output
  - [ ] Unknown commands show error

#### Phase 3: Git Command Handlers
- **Objective:** Implement Git commands against simulator
- **Files to create:**
  - `src/commands/git.ts` - all git command handlers
- **Acceptance Criteria:**
  - [ ] `git init` initializes repo, shows success message
  - [ ] `git status` shows working directory state (untracked, staged, clean)
  - [ ] `git add <file>` stages file, updates simulator state
  - [ ] `git add .` stages all modified files
  - [ ] `git commit -m "msg"` creates commit, shows hash
  - [ ] `git branch` lists branches
  - [ ] `git branch <name>` creates new branch
  - [ ] `git checkout <branch>` switches branch, updates HEAD
  - [ ] `git switch <branch>` same as checkout
  - [ ] Error messages for invalid operations (e.g., commit with nothing staged)

### Decision Matrix

| Decision | Options Considered | Choice | Rationale |
|----------|-------------------|--------|-----------|
| Terminal lib | xterm.js, custom | Custom | xterm.js is overkill, we just need basic input/output |
| Parser approach | Regex, split, library | Simple split + handlers | Commands are simple, no need for complex parsing |
| Output format | Plain text, structured | Structured (type + content) | Allows for colored output based on type |

---

## Plan Review
- **Gate:** READY
- **Reviewed:** 2026-02-06
- **Summary:** Plan is solid and appropriately scoped. All terminal features from mockup are captured. Minor gaps (error styling, echo append syntax) can be addressed during execution.
- **Issues:** 0 critical, 0 major, 6 minor
- **Open Questions Finalized:** None - planner made appropriate autonomous decisions

> Details: `plan-review.md`

---

## Execution Log
_Executor agent fills this section per phase._

### Phase 1: Terminal UI Component
- **Status:** COMPLETE
- **Started:** 2026-02-06
- **Completed:** 2026-02-06
- **Commits:** `ad630c3`
- **Files Modified:**
  - `src/components/Terminal/TerminalLine.tsx` — new component for rendering command/output lines
  - `src/components/Terminal/TerminalOutput.tsx` — scrollable output container with auto-scroll
  - `src/components/Terminal/TerminalInput.tsx` — input field with history navigation (up/down)
  - `src/components/Terminal/index.ts` — barrel exports
  - `src/components/TerminalPanel.tsx` — refactored to use new components
  - `src/index.css` — added error, staged, untracked output styles
- **Notes:** Prompt shows branch indicator from GitStore. Blue arrow, purple branch per mockup.

### Phase 2: Command Parser + Shell Commands
- **Status:** COMPLETE
- **Started:** 2026-02-06
- **Completed:** 2026-02-06
- **Commits:** `296d27b`
- **Files Modified:**
  - `src/commands/types.ts` — command types and context interface
  - `src/commands/parser.ts` — tokenizer with quote handling and redirect parsing
  - `src/commands/shell.ts` — shell command handlers (touch, echo, ls, cat, clear, pwd)
  - `src/commands/index.ts` — command registry and executor
  - `src/components/TerminalPanel.tsx` — integrated executeCommand
- **Notes:** Shell commands require git init for file operations (matches real git behavior). Added echo append (>>) support per plan review.

### Phase 3: Git Command Handlers
- **Status:** COMPLETE
- **Started:** 2026-02-06
- **Completed:** 2026-02-06
- **Commits:** `1596eeb`
- **Files Modified:**
  - `src/commands/git.ts` — all git command handlers (init, status, add, commit, branch, checkout, switch)
  - `src/commands/index.ts` — import and register gitCommands
- **Notes:** Error output styled red per plan review. All commands connect to GitSimulator from T001.

---

## Code Review Log

### All Phases (Combined Review)
- **Gate:** PASS
- **Reviewed:** 2026-02-06
- **Issues:** 0 critical, 0 major, 6 minor
- **Summary:** Implementation is solid for a learning app. Terminal UI matches mockup styling. All specified commands work correctly. Integration with GitSimulator from T001 is properly wired. Minor edge cases noted but nothing blocking.

> Details: `code-review.md`

**Minor Issues Found:**
1. Touch command has dead code comment about init check
2. History navigation edge case at oldest command
3. Parser doesn't handle escaped quotes (edge case)
4. React key using array index (works for append-only)
5. Command echo uses hardcoded '~' prompt
6. N/A - was false positive on mockup comparison

---

## Completion

- **Completed:** 2026-02-06
- **Summary:** Built interactive terminal UI with command history, parser with quote/redirect handling, shell commands (touch, echo, ls, cat, clear, pwd), and Git commands (init, status, add, commit, branch, checkout, switch). All commands integrate with GitSimulator from T001. Styling matches mockup.
- **Commits:** `ad630c3`, `296d27b`, `1596eeb`, `02efab7`
- **Lessons Learned:**
  - Custom terminal implementation worked well; xterm.js would have been overkill
  - Quote parsing is tricky but simple split+state machine approach is sufficient
  - Structured output types (success/error/staged/untracked) enable clean CSS-based coloring
