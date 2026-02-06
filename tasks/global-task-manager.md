# Global Task Manager

Tracks all tasks. The orchestrator maintains this file.

## Current Tasks

| ID | Task Name | Priority | Phase | Status | Link |
|:---|:----------|:---------|:------|:-------|:-----|
| T006 | Focused Tooltip Tour | 1 | — | PLANNING | [main.md](./planning/T006-tooltip-tour/main.md) |

Next available task id: T007

---

## Task Dependencies

```
T001 (Infrastructure) ─── COMPLETE
  └── T002 (Terminal) ─── COMPLETE
  └── T003 (Graph) ────── COMPLETE
  └── T004 (Merge/Log) ── COMPLETE
        │
        └── Working App ✓
```

---

## Recently Completed

| ID | Task Name | Completed | Link |
|:---|:----------|:----------|:-----|
| T001 | Project Setup & Core Infrastructure | 2026-02-06 | [main.md](./completed/T001-core-foundation-mvp/main.md) |
| T002 | Terminal & Command Interface | 2026-02-06 | [main.md](./completed/T002-terminal-command-interface/main.md) |
| T003 | Graph Visualization | 2026-02-06 | [main.md](./completed/T003-graph-visualization/main.md) |
| T004 | Git Merge & Log | 2026-02-06 | [main.md](./completed/T004-advanced-git-operations/main.md) |
| T005 | Guided Tutorial Mode | 2026-02-06 | [main.md](./completed/T005-guided-tutorial/main.md) |

---

## Status Legend

| Status | Meaning |
|--------|---------|
| `PLANNING` | Planner creating implementation plan |
| `PLAN_REVIEW` | Plan-reviewer validating plan |
| `READY` | Plan approved, awaiting execution |
| `EXECUTING_PHASE_N` | Executor working on phase N |
| `CODE_REVIEW` | Code-reviewer checking implementation |
| `BLOCKED` | Needs human input |
| `COMPLETE` | All phases done |

## Directory Rules

- `PLANNING` / `PLAN_REVIEW` → `tasks/planning/`
- `READY` / `EXECUTING_*` / `CODE_REVIEW` → `tasks/active/`
- `BLOCKED` → `tasks/paused/`
- `COMPLETE` → `tasks/completed/`

When moving directories, update the Link column.
