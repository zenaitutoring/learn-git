# T002: Terminal & Command Interface

## Meta
- **Status:** READY
- **Created:** 2026-02-06
- **Last Updated:** 2026-02-06 (plan reviewed)
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
- **Status:** PENDING
- **Started:** —
- **Completed:** —
- **Commits:** —
- **Files Modified:** —
- **Notes:** —

### Phase 2: Command Parser + Shell Commands
- **Status:** PENDING
- **Started:** —
- **Completed:** —
- **Commits:** —
- **Files Modified:** —
- **Notes:** —

### Phase 3: Git Command Handlers
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
