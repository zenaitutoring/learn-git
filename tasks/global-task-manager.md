# Global Task Manager

Tracks all tasks. The orchestrator maintains this file.

## Current Tasks

| ID | Task Name | Priority | Phase | Status | Link |
|:---|:----------|:---------|:------|:-------|:-----|
| T002 | Terminal & Command Interface | 1 | — | READY | [main.md](./planning/T002-terminal-command-interface/main.md) |
| T003 | Graph Visualization | 2 | — | READY | [main.md](./planning/T003-graph-visualization/main.md) |

Next available task id: T004

---

## Task Dependencies

```
T001 (Infrastructure)
  └── T002 (Terminal) ──┐
                        ├── Working App
  └── T003 (Graph) ─────┘
```

T002 and T003 both depend on T001. They can be worked on in parallel after T001 is complete.

---

## Recently Completed

| ID | Task Name | Completed | Link |
|:---|:----------|:----------|:-----|
| T001 | Project Setup & Core Infrastructure | 2026-02-06 | [main.md](./completed/T001-core-foundation-mvp/main.md) |

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
