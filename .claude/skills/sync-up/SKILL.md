---
name: sync-up
description: Use when the user says "sync up" or "catch me up" at session start — restores project context from docs/DECISIONS.md, BACKLOG.md, ARCHITECTURE.md, SKIN-PRINCIPLES.md, pending plans, git status and every local branch, then prints the Sync Up table and open backlog.
---

# Sync Up

On "sync up" or "catch me up":

1. Read `docs/DECISIONS.md`, `docs/BACKLOG.md`, `docs/ARCHITECTURE.md`, `docs/SKIN-PRINCIPLES.md`
   - A backlog item's status comes **solely** from its heading/section (Open Items vs Completed, `~~…~~` strikethrough). Never infer status from body prose — a completed item may still carry its full original problem write-up, which reads as unresolved.
2. Check for pending plans — list `docs/superpowers/plans/` and read the most recent file. If a plan exists that hasn't been fully implemented, surface it in the summary.
3. Check git status and recent git log — use **separate parallel Bash calls** (not chained with `&&`), so each matches `Bash(git status*)` / `Bash(git log*)` allow rules and avoids permission prompts
4. **Scan local branches for in-progress work** — run `git branch` and for each non-main branch, run `git log main..<branch> --oneline` to see what's on it. Cross-reference branches with plan files (branch names often match plan topics). Report each branch with a short summary of its status:
   - How many commits ahead of main
   - Whether it's pushed to remote (`git branch -vv` shows tracking info)
   - Whether it corresponds to a known plan file
   - This catches work done by parallel agents in worktrees, which is otherwise invisible from main
5. Present the summary as a structured table, not prose paragraphs:

```
## Sync Up

| Area | Status |
|------|--------|
| **Branch** | `main` — clean / 2 uncommitted files |
| **Last commit** | `abc1234` — Short commit message |
| **Last decision** | #N — Summary of decision |
| **Pending plan** | None / `2026-03-12-badge-redesign.md` — Brief summary |
| **Blockers** | None / description |
| **Active branches** | None |

### Open Backlog

| Priority | Items |
|----------|-------|
| **High** | Item 1, Item 2 |
| **Medium** | Item 3, Item 4 |
| **Low** | Item 5 |

Ready to go — what are we working on?
```

- **Active branches** gets its own table (Branch / Commits / Remote / Plan) only when non-main branches exist; otherwise it collapses into the top table's `Active branches` row.

6. State readiness
