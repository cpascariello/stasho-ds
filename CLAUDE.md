# Working Habits

Persistent habits for maintaining project memory across sessions.

---

## Quick Start

**Sync up:** Say "sync up" or "catch me up" to restore context at session start.

---

## Three Habits

### 1. Decision Logging

Log decisions to `docs/DECISIONS.md` when these phrases appear:
- "decided" / "let's go with" / "rejected"
- "choosing X because" / "not doing X because"
- "actually, let's" / "changed my mind"

Before proposing anything, check if it contradicts a past decision. If conflict found:
> This would contradict Decision #N (summary). Override?

**Format:**
```
## Decision #[N] - [Date]
**Context:** [What we were working on]
**Decision:** [What was decided]
**Rationale:** [Why - this is the important part]
**Alternatives considered:** [If any were discussed]
```

### 2. Scope Drift Detection

**This is an active interrupt, not a passive log.**

When the conversation drifts from the stated task:
1. Stop and say: "This is drifting from [original task]. Add to backlog and refocus, or pivot?"
2. If backlog: log to `docs/BACKLOG.md` and return to the original task
3. If pivot: continue, but note the scope change

**Triggers to watch for:**
- "Would it be useful to add X?" (when X wasn't part of original request)
- "We could also do Y" (when Y is unrelated to core ask)
- "While we're at it, let's add Z"
- Any work that extends beyond what was asked

**Do NOT flag** clarifying questions about the core feature or technical approaches to achieve the original goal.

**Backlog format:**
```
### [Date] - [Short title]
**Source:** Identified while working on [context]
**Description:** [What needs to be done]
**Priority:** Low/Medium/High
```

### 3. Git Discipline

**Branching:**
- Brainstorm and plan on main
- **Push main before branching** — unpushed commits on main cause divergence after squash merge
- When dev starts, create feature branch from main before any file edits
- Branch naming: `<type>/[name]` (e.g. `feature/`, `fix/`, `chore/`, `refactor/`)

**Integration branches (long-lived multi-chunk work):**

Some work spans many chunks over multiple sessions (e.g. a full skin redesign). Don't merge each chunk to `main` directly — use an integration branch that accumulates chunks and merges to main only when the full thing is done.

- The integration branch lives on origin (e.g. `skin/paraplu`) and never gets squash-merged until the work is complete.
- Each chunk = a short-lived branch off the integration branch, with its own worktree if needed: `git checkout -b skin/buttons-animations` from inside the integration worktree.
- Chunk PRs target the integration branch, not main: `gh pr create --base skin/paraplu --title "..."`. Squash-merge chunks into the integration branch with `gh pr merge <num> --squash --delete-branch`.
- After each chunk merge, sync the integration branch in the worktree: `git checkout skin/paraplu && git pull --ff-only origin skin/paraplu`.
- When the whole integration is ready, treat the integration branch itself as a normal feature branch: PR it into main, squash-merge.
- CI (`.github/workflows/ci.yml`) only runs on PRs to `main`. Chunk PRs into an integration branch rely on local `npm run check` — that's the safety net.
- Active integration branches: none currently. (`skin/paraplu` shipped to main 2026-05-27 and its branch is deleted.)

**Before merging:** Update ALL docs before squash merging to main.
- `docs/DESIGN-SYSTEM.md` -- add/update tokens, components, hooks, or patterns
- `docs/ARCHITECTURE.md` -- add/update patterns for any new architectural decisions, new files, or changed structure
- `CLAUDE.md` -- add a line to the capability index **only if a new capability shipped** (feature detail belongs in DESIGN-SYSTEM.md / ARCHITECTURE.md, not here)
- `docs/DECISIONS.md` -- log any key decisions made during the feature
- `docs/BACKLOG.md` -- move completed items to Completed section, add any deferred ideas

**Checklist before merge:**
1. DESIGN-SYSTEM.md updated with new tokens/components?
2. ARCHITECTURE.md updated?
3. CLAUDE.md capability index updated (only if a new capability shipped)?
4. DECISIONS.md has implementation decisions?
5. BACKLOG.md item moved to Completed?

**During development:** Track intent, not metrics.

- **Scope drift:** "This started as [X] but now includes [Y]. Commit [X] first?"
- **Feature complete:** When user says "done" or "that's it" -> squash merge to main
- **Pre-break:** When user says "break", "later", "tomorrow" -> "Push before you go?"

**Completion:** `gh pr merge --squash` keeps main history clean (one commit per feature). Never push directly to main — always go through a PR.

Never interrupt based on file count or commit count.

**Finishing a branch** (overrides the `finishing-a-development-branch` skill options):

**Use `/dio:ship`.** The skill runs the full sequence end-to-end — catch up on main, doc audit against the actual `git diff main...HEAD`, project checks, commit, push, PR, squash-merge, local cleanup — without intermediate confirmation prompts. The steps live in the skill; this section only holds the rules below and the project-specific overrides. If the user says "ship", "ship this", "merge this", or "wrap it up", invoke `/dio:ship` rather than running the steps manually one at a time.

**Never merge locally.** Option 1 ("Merge back to main locally") from the finishing skill is not allowed — hooks block direct pushes to main, and local merges cause SHA divergence after squash-merge. Always go through the PR.

**Project-specific overrides** the `/dio:ship` skill must respect:
- Integration-branch chunks follow the rules in **Integration branches** above (PR `--base <integration-branch>`, post-merge sync of the integration branch instead of main, local `npm run check` as the CI substitute).
- Never remove the integration branch's worktree until the integration itself merges to main.

---

## Context Recovery

On "sync up" or "catch me up", invoke the `sync-up` skill (`.claude/skills/sync-up/SKILL.md`). It reads the project docs, scans branches and plan files, and prints the sync table plus the open backlog.

---

## Docs

| File | Purpose |
|------|---------|
| `docs/DESIGN-SYSTEM.md` | Consumer-facing: what to use, how to use it (props, variants, examples) |
| `docs/ARCHITECTURE.md` | Maintainer-facing: how it works internally (patterns, hooks, workarounds) |
| `docs/SKIN-PRINCIPLES.md` | Skin identity + rules — north star for designing/restyling components in the active skin |
| `docs/DECISIONS.md` | Decision log with rationale |
| `docs/BACKLOG.md` | Parking lot for scope creep and deferred ideas |
| `docs/superpowers/specs/` | Design specs from brainstorming sessions (read-only reference) |
| `docs/superpowers/plans/` | Implementation plans from planning sessions (read-only reference) |

---

## Skill Integration

Skills (superpowers) are tools, not separate processes. Match the ceremony to the size of the work — see Workflow Tiers below — and use skills naturally within it:

- **Brainstorming:** Use for non-trivial design work (Medium and Large tiers). Flag scope creep during brainstorming.
- **Planning:** Use `writing-plans` or `EnterPlanMode` for Large-tier work — multi-file changes, new features, unclear requirements.
- **Implementation:** Use `subagent-driven-development` or `executing-plans` for Large-tier plans; smaller tiers skip the plan file.
- **Debugging state/sync bugs:** Before writing any fix, trace the full data flow (write -> store -> fetch -> parse -> render). Identify all integration points that need coordinated changes. Don't patch one step without understanding the chain.
- **Post-implementation:** Use `/dio:ship` to run the full finishing sequence (doc audit + checks + commit + push + PR + squash-merge + cleanup) end-to-end. Update ARCHITECTURE.md and DECISIONS.md if new patterns or decisions emerged.

### Workflow Tiers

Match the ceremony to the work. When unsure, size up one tier, not down.

- **Small** — a bug fix, copy tweak, or contained change to one or two files with no design unknowns. Branch, do it, ship. No spec, no plan.
- **Medium** — a feature or refactor spanning a few files, with design choices but no deep unknowns. A short brainstorm if the design isn't obvious; a brief spec only when the *why* is worth preserving past the diff. Brainstorm → plan → implement in the **same session**.
- **Large** — architectural, security-sensitive, or multi-day cross-layer work (e.g. a full skin redesign). Full brainstorm + spec + plan. The spec is the highest-value artifact — it records the *why* the diff and commit log can't. A separate implementation session is **optional**.

### Session Workflow

Default: brainstorm, plan, and implement in **one session**. Context windows are large enough that brainstorm back-and-forth doesn't meaningfully crowd implementation.

Split into a separate implementation session only for Large-tier work whose implementation is a multi-day effort — when a clean execution context earns the handoff seam. When splitting:

1. **Brainstorm + Plan session:** Explore design, write the spec to `docs/superpowers/specs/` and the plan to `docs/superpowers/plans/`.
2. **Implement session:** Start fresh, say "sync up", then execute the plan via `executing-plans` or `subagent-driven-development`. The plan file on disk is the handoff artifact — no brainstorm context carries over.

### Plans Must Include Doc Updates

Every implementation plan must include a final step with this exact checklist. This is not optional — it's part of the definition of done, not a merge-time afterthought.

The final plan task should be:

```
### Task N: Update docs

- [ ] DESIGN-SYSTEM.md — new tokens, components, hooks, or patterns
- [ ] ARCHITECTURE.md — new patterns, new files, or changed structure
- [ ] DECISIONS.md — design decisions made during this feature
- [ ] BACKLOG.md — completed items moved, deferred ideas added
- [ ] CLAUDE.md — capability index, only if a new capability shipped
```

Copy this checklist verbatim into every plan. Do not paraphrase or summarize — the explicit checklist prevents items from being forgotten.

---

## Project: stasho design system

Tokens-only design system, with a Next.js preview app to visualize brand colors, semantic tokens, typography, gradients, shadows, and transitions.

### Tech Stack

- **Monorepo:** npm workspaces (`packages/ds` + `apps/preview`)
- **Framework:** Next.js 16 (App Router, static export)
- **Language:** TypeScript 5.9 (strict)
- **Styling:** Tailwind CSS 4 + CSS custom properties
- **Icons:** Phosphor Icons (`@phosphor-icons/react`)
- **Testing:** Vitest + Testing Library
- **Deployment:** Static export (`out/` directory)

### Commands

```bash
npm run dev       # Dev server (Turbopack) — preview app
npm run build     # Static export — preview app
npm run test      # vitest — DS package
npm run lint      # oxlint — all workspaces
npm run typecheck # tsc --noEmit — all workspaces
npm run check     # lint + typecheck + test — all workspaces
```

### Key Directories

```
packages/ds/src/styles/       # Design tokens (tokens.css with OKLCH scales)
packages/ds/src/components/   # DS components (button, input, textarea, form-field)
packages/ds/src/lib/          # Utilities (cn.ts)
apps/preview/src/app/         # Next.js pages and layout
apps/preview/src/components/  # Preview-only UI (sidebar, theme-switcher)
docs/superpowers/             # Brainstorm specs + implementation plans
```

### Current Features & Architecture

Feature implementation details are **not inlined here** — they change every release and would tax every turn. The detail lives in docs, read on demand:

- **`docs/DESIGN-SYSTEM.md`** — consumer-facing: every component's props, variants, and usage. The canonical "what is".
- **`docs/ARCHITECTURE.md`** — maintainer-facing patterns, hooks, and workarounds.
- **`docs/SKIN-PRINCIPLES.md`** — the Abyssal Void rules that constrain any styling change.
- **`docs/DECISIONS.md`** — the *why* behind each feature (numbered log; the index below cites `#N`).
- **`docs/BACKLOG.md`** — deferred work.

**IMPORTANT:** Before changing behavior in any component or token area, read its section in `docs/DESIGN-SYSTEM.md` (and the cited `docs/DECISIONS.md` entries) first. The index below is a map of *what exists* — not a substitute for those docs.

#### Capability index

**Platform**
- npm workspaces monorepo (`packages/ds` + `apps/preview`), source-level subpath exports (`@stasho/ds/*`)
- Next.js static-export preview app: responsive sidebar nav, route per component, dark default + light toggle, theme choice persisted to `localStorage` with pre-paint `<head>` script to avoid flash (#110)
- CI: lint + typecheck + test + build on PRs and main pushes; npm publish of raw TS source on GitHub Release

**Tokens & theming**
- Three-layer token system: OKLCH scales 50–950 → semantic tokens → Tailwind mapping
- Abyssal Void skin: electric-blue primary + cyan accent + teal/amber/blood-orange semantics, same hex in both modes (#78)
- Observatory Mono dark surface ladder + violet-tinted light ladder; `--surface`/`--edge` visibility tuning (#95)
- Radius vocabulary 4/6/8 hard floor; `rounded-full` reserved for round-by-design (#100, #89)
- Light/dark switching via `.theme-dark` class + `@custom-variant dark`
- Typography: Anybody (headings), Inter (body), Departure Mono (telemetry, self-hosted) (#83)
- Shared overlay/popover motion keyframes (`pop`/`overlay`), all `motion-safe:` gated (#102); every animated component respects prefers-reduced-motion
- Phosphor Icons for UI chrome and consumer use

**Form controls**
- Button — 7 variants, xs–lg, instrument chassis + cyan LED, dual-dot loading chase (#81, #82, #95, #99)
- Input / Textarea — flat-slot chassis, cyan hairline focus, error rail (#84); shared `field-chassis` class constants across Input/Textarea/Select/Combobox/MultiSelect (#110)
- NumberInput — wrapper-chassis flat slot, native `stepUp`/`stepDown` clamping, hidden spinners + Phosphor caret pair, sm/md (#110)
- Checkbox / RadioGroup — flat-slot chassis, 14/16/20 size ladder (#85, #90)
- Switch — thumb matches Checkbox at sm/md, per-mode bevel (#92, #96)
- Select / Combobox / MultiSelect — flat-slot triggers, popover-token dropdowns; MultiSelect tags + clear-all (#84, #87)
- Slider — bevel track, cyan fill, aperture thumb, single/range, optional tooltip (#89)
- SelectableCard family — SelectableCardGroup / SelectableCard / ActionCard on Radix ToggleGroup (#97)
- FormField — label/helper/error wrapper with auto-wired accessibility (#84)

**Feedback & status**
- Alert — 4 variants, dismissible, auto-dismiss with progress, gradient backgrounds (#88)
- Badge — 5 variants × solid/outline, Departure Mono UC (#88, #90)
- StatusDot, Skeleton, Loader (standalone dual-dot chase, #94), EmptyState (#103)
- ProgressBar — determinate/indeterminate, bevel track, cyan fill (#90)
- Stepper — 7-part compound, horizontal/vertical, cyan halo active (#88)

**Data display & navigation**
- Card — default (hairline) + ghost variants (#90, #100)
- Table — generic typing, sortable + controlled-sort, activeKey highlight (#93)
- Tabs — underline/pill variants, sliding indicator, overflow collapse + maxVisible (#86)
- Pagination (#88), Breadcrumb (#86), Accordion (slide+settle motion, #101)
- CopyableText — middle-ellipsis + fluid width-aware mode, copy animation (#98)

**Overlays & shell**
- Tooltip, Popover, DropdownMenu (non-modal default), Dialog (`locked` prop), Drawer (#87, #100, #102, #104)
- Sidebar + Header primitive families (#104), ProjectSwitcher — grouped searchable cmdk switcher (#105)

**Brand**
- Logo family — `Logo`, `LogoWordmark`, `LogoLetter`, `LogoMark` badge; all real outlines, no font dependency; downloadable brand assets + favicons (#106–#108)
