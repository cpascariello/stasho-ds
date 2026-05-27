# Typography Reset Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Strip `font-heading` (Anybody) from all interactive label roles in six components and route each label to one of two voices — Inter sentence case (operational) or Departure Mono uppercase (telemetry).

**Architecture:** Mechanical Tailwind class swaps in the existing CVA configurations. No new tokens, no architectural changes, no new components. Each component gets one focused commit. SKIN-PRINCIPLES.md gets three clarification rules appended.

**Tech Stack:** React 19, Tailwind CSS 4, CVA (class-variance-authority), Vitest, oxlint, TypeScript.

**Spec:** `docs/superpowers/specs/2026-05-26-typography-reset-design.md`

**Integration branch:** `skin/paraplu`. This chunk lives on a short-lived branch off `skin/paraplu`, PRs into `skin/paraplu`, and squash-merges. It does NOT target main.

---

## File map

| File | What changes | Owner |
|---|---|---|
| `packages/ds/src/components/alert/alert.tsx` | `labelVariants` base class (line 54) — Anybody UC italic → Departure Mono UC | Task 2 |
| `packages/ds/src/components/alert/alert.test.tsx` | rename test description (line 15) | Task 2 |
| `packages/ds/src/components/badge/badge.tsx` | CVA base class (line 8) — Anybody UC italic → Departure Mono UC tracking-wider | Task 3 |
| `packages/ds/src/components/badge/badge.test.tsx` | update existing typography assertion (line 175); add textContent preservation test | Task 3 |
| `packages/ds/src/components/breadcrumb/breadcrumb.tsx` | list base class (line 30) — Anybody UC italic → Inter Medium sentence | Task 4 |
| `packages/ds/src/components/pagination/pagination.tsx` | PAGE_BUTTON const (line 95) + ellipsis inline (line 167) — Anybody Bold text-lg → Departure Mono text-sm | Task 5 |
| `packages/ds/src/components/table/table.tsx` | `<th>` className (line 168) — Inter Semibold UC tracked → Departure Mono UC tracked text-[11px] | Task 6 |
| `packages/ds/src/components/tabs/tabs.tsx` | TabsTrigger base (line 430) + OverflowTrigger base (line 204) + size override (line 222) + dropdown active (line 264) — Anybody Bold → Inter Semibold; text-lg → text-sm on underline-md | Task 7 |
| `docs/SKIN-PRINCIPLES.md` | append 3 clarification rules under § Typography | Task 9 |
| `docs/DESIGN-SYSTEM.md` | refresh component entries for the 6 components | Task 9 |
| `docs/DECISIONS.md` | new Decision #83 entry | Task 9 |
| `docs/BACKLOG.md` | move "Typography reset (chunk 1)" to Completed | Task 9 |
| `CLAUDE.md` | update Current Features entries for the 6 components | Task 9 |

---

## Task 1: Create chunk branch off `skin/paraplu`

**Files:**
- No file edits. Branch operation only.

**Steps:**

- [ ] **Step 1: Verify we are on `skin/paraplu` and clean**

```bash
git status
git branch --show-current
```

Expected: `skin/paraplu`. Working tree should have no staged changes from prior tasks. Untracked PNG files in repo root are fine.

- [ ] **Step 2: Sync `skin/paraplu` from origin**

```bash
git pull --ff-only origin skin/paraplu
```

Expected: Already up to date OR fast-forward with no merge.

- [ ] **Step 3: Create chunk branch**

```bash
git checkout -b skin/typography-reset
```

Expected: `Switched to a new branch 'skin/typography-reset'`.

---

## Task 2: Alert variant label → Departure Mono UC

**Files:**
- Modify: `packages/ds/src/components/alert/alert.tsx:54`
- Modify: `packages/ds/src/components/alert/alert.test.tsx:15`

**Steps:**

- [ ] **Step 1: Update `labelVariants` base in `alert.tsx`**

Open `packages/ds/src/components/alert/alert.tsx`. At line 54, find:

```tsx
const labelVariants = cva(
  "font-heading font-extrabold italic text-xs uppercase leading-normal pb-1",
```

Replace with:

```tsx
const labelVariants = cva(
  "font-mono uppercase tracking-wider text-[11px] leading-normal pb-1",
```

Rationale: removes Anybody-as-label, applies Voice B (Departure Mono UC tracking-wider 11px). The variant-color rules in the `variants.variant` block stay unchanged.

- [ ] **Step 2: Update test description in `alert.test.tsx`**

Open `packages/ds/src/components/alert/alert.test.tsx`. At line 15, find:

```tsx
  it("renders the variant label in uppercase", () => {
    render(<Alert variant="error">Message</Alert>);
    expect(screen.getByText("Error")).toBeTruthy();
  });
```

Replace with:

```tsx
  it("renders the variant label", () => {
    render(<Alert variant="error">Message</Alert>);
    expect(screen.getByText("Error")).toBeTruthy();
  });
```

Rationale: the assertion is unchanged (DOM text still says "Error"; CSS uppercase doesn't mutate DOM). Only the test name is misleading now — the label is uppercased by CSS at multiple points in history, the description shouldn't promise it.

- [ ] **Step 3: Run alert tests, verify pass**

```bash
npm test -- --run packages/ds/src/components/alert
```

Expected: all alert tests pass. If any test asserts on `font-heading` in the className, update it to assert `font-mono` instead.

- [ ] **Step 4: Commit**

```bash
git add packages/ds/src/components/alert/
git commit -m "feat(skin): alert variant label uses Departure Mono UC"
```

---

## Task 3: Badge → Departure Mono UC (force uppercase)

**Files:**
- Modify: `packages/ds/src/components/badge/badge.tsx:8`
- Modify: `packages/ds/src/components/badge/badge.test.tsx:174-180` (existing typography assertion)
- Modify: `packages/ds/src/components/badge/badge.test.tsx` (add new textContent test)

**Steps:**

- [ ] **Step 1: Update Badge CVA base in `badge.tsx`**

Open `packages/ds/src/components/badge/badge.tsx`. At line 5–10, find:

```tsx
const badgeVariants = cva(
  [
    "inline-flex items-center justify-center gap-1.5",
    "rounded-none font-heading font-extrabold italic uppercase",
    "whitespace-nowrap select-none",
  ].join(" "),
```

Replace with:

```tsx
const badgeVariants = cva(
  [
    "inline-flex items-center justify-center gap-1.5",
    "rounded-none font-mono uppercase tracking-wider",
    "whitespace-nowrap select-none",
  ].join(" "),
```

Rationale: `font-mono` swaps Anybody → Departure Mono. `uppercase` stays — it's the CSS that forces UC regardless of consumer string. `italic` is removed. `font-extrabold` is removed (Departure Mono has no weight variants). `tracking-wider` (0.05em) replaces the visual character that `italic` carried. Size variants (`text-xs` for md, `text-[10px]` for sm) are unchanged.

- [ ] **Step 2: Update existing typography assertion in `badge.test.tsx`**

Open `packages/ds/src/components/badge/badge.test.tsx`. At line 175–180, find:

```tsx
    it("applies heading font and uppercase", () => {
      const { container } = render(<Badge>Label</Badge>);
      const cls = container.firstElementChild?.className ?? "";
      expect(cls).toContain("font-heading");
      expect(cls).toContain("uppercase");
    });
```

Replace with:

```tsx
    it("applies mono font and uppercase", () => {
      const { container } = render(<Badge>Label</Badge>);
      const cls = container.firstElementChild?.className ?? "";
      expect(cls).toContain("font-mono");
      expect(cls).toContain("uppercase");
      expect(cls).toContain("tracking-wider");
    });
```

- [ ] **Step 3: Add textContent preservation test**

In the same file, inside the `describe("base styles", ...)` block (immediately after the assertion edited in Step 2), add:

```tsx
    it("preserves consumer string case in DOM (CSS uppercases the rendered text only)", () => {
      const { container } = render(<Badge>active</Badge>);
      // DOM text content stays lowercase — CSS text-transform: uppercase
      // changes rendering, not DOM. This contract matters for assertions
      // using getByText("active") in consumer test suites.
      expect(container.firstElementChild?.textContent).toBe("active");
    });
```

Rationale: documents and enforces the API contract — `<Badge>active</Badge>` renders visually as "ACTIVE" but `textContent` stays "active". Consumer test suites that use `getByText("active")` continue to work.

- [ ] **Step 4: Run badge tests, verify pass**

```bash
npm test -- --run packages/ds/src/components/badge
```

Expected: all badge tests pass including the two updated assertions and the new textContent test.

- [ ] **Step 5: Commit**

```bash
git add packages/ds/src/components/badge/
git commit -m "feat(skin): badge uses Departure Mono UC, forced via CSS"
```

---

## Task 4: Breadcrumb → Inter Medium sentence case

**Files:**
- Modify: `packages/ds/src/components/breadcrumb/breadcrumb.tsx:30`

**Steps:**

- [ ] **Step 1: Update `BreadcrumbList` (ol) className**

Open `packages/ds/src/components/breadcrumb/breadcrumb.tsx`. Find the `BreadcrumbList` declaration around line 22–35. The `<ol>` className currently reads:

```tsx
    className={cn(
      "flex flex-wrap items-center gap-1",
      "font-heading font-extrabold italic uppercase text-xs",
      className,
    )}
```

Change the second class string:

Find: `"font-heading font-extrabold italic uppercase text-xs"`

Replace with: `"font-sans font-medium text-sm"`

Rationale: removes Anybody-as-label and uppercase. Inter Medium 14px sentence case matches Tabs underline-md and Alert title (already font-sans).

- [ ] **Step 2: Run breadcrumb tests**

```bash
npm test -- --run packages/ds/src/components/breadcrumb
```

Expected: all tests pass. If any test asserts on the old class names, update.

- [ ] **Step 3: Commit**

```bash
git add packages/ds/src/components/breadcrumb/
git commit -m "feat(skin): breadcrumb uses Inter Medium sentence case"
```

---

## Task 5: Pagination → Departure Mono numbers

**Files:**
- Modify: `packages/ds/src/components/pagination/pagination.tsx:95`
- Modify: `packages/ds/src/components/pagination/pagination.tsx:167`

**Steps:**

- [ ] **Step 1: Update `PAGE_BUTTON` const**

Open `packages/ds/src/components/pagination/pagination.tsx`. At line 95, find:

```tsx
const PAGE_BUTTON = cn(
  "font-heading font-bold text-lg",
```

Or, more precisely (the line may contain the string in one form):

Find: `"font-heading font-bold text-lg"`

Replace with: `"font-mono text-sm"`

Rationale: removes Anybody-as-numerical-label. Departure Mono at 14px reads as numerical telemetry. Drop from text-lg (18px) to text-sm (14px) tightens the page-number ladder against arrow icons (size-4 = 16px). Other classes on the const stay.

- [ ] **Step 2: Update ellipsis inline className (line 167)**

Find the ellipsis span at line ~167:

```tsx
              className="inline-flex items-center justify-center size-8 font-heading font-bold text-lg text-primary-600 dark:text-primary-400 select-none"
```

Replace with:

```tsx
              className="inline-flex items-center justify-center size-8 font-mono text-sm text-primary-600 dark:text-primary-400 select-none"
```

Rationale: same font + size update. Preserve the `text-primary-600 dark:text-primary-400` color — that's chunk 4's concern, not this chunk's.

- [ ] **Step 3: Run pagination tests**

```bash
npm test -- --run packages/ds/src/components/pagination
```

Expected: all tests pass.

- [ ] **Step 4: Commit**

```bash
git add packages/ds/src/components/pagination/
git commit -m "feat(skin): pagination numbers use Departure Mono text-sm"
```

---

## Task 6: Table headers → Departure Mono UC tracked

**Files:**
- Modify: `packages/ds/src/components/table/table.tsx:168`

**Steps:**

- [ ] **Step 1: Update `<th>` className**

Open `packages/ds/src/components/table/table.tsx`. At line 168, find:

```tsx
                  "px-4 py-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground",
```

Replace with:

```tsx
                  "px-4 py-3 font-mono font-normal uppercase tracking-widest text-[11px] text-muted-foreground",
```

Rationale: Inter Semibold 14px UC tracked → Departure Mono Normal 11px UC tracking-widest (0.1em). Smaller mono-UC reads as denser telemetry chrome at the same optical weight. `text-muted-foreground` color is preserved.

- [ ] **Step 2: Run table tests**

```bash
npm test -- --run packages/ds/src/components/table
```

Expected: all tests pass. Sortable column tests, alignment tests, controlled-sort tests are not affected by typography.

- [ ] **Step 3: Commit**

```bash
git add packages/ds/src/components/table/
git commit -m "feat(skin): table headers use Departure Mono UC tracking-widest"
```

---

## Task 7: Tabs triggers → Inter Semibold sentence (drop text-lg on underline-md)

**Files:**
- Modify: `packages/ds/src/components/tabs/tabs.tsx:204` (OverflowTrigger base)
- Modify: `packages/ds/src/components/tabs/tabs.tsx:222` (OverflowTrigger underline-md size override)
- Modify: `packages/ds/src/components/tabs/tabs.tsx:264` (dropdown active item)
- Modify: `packages/ds/src/components/tabs/tabs.tsx:430` (TabsTrigger base)

**Steps:**

- [ ] **Step 1: Update OverflowTrigger base (line 204)**

Open `packages/ds/src/components/tabs/tabs.tsx`. At line 204, find:

```tsx
            "font-heading font-bold",
```

Replace with:

```tsx
            "font-sans font-semibold",
```

- [ ] **Step 2: Update OverflowTrigger underline-md size override (line ~222)**

Find the size override line (currently `"px-4 py-3 text-lg"`):

```tsx
                : "px-4 py-3 text-lg",
```

Replace with:

```tsx
                : "px-4 py-3 text-sm",
```

Rationale: 18px → 14px. Matches new TabsTrigger underline-md.

- [ ] **Step 3: Update dropdown active item (line ~264)**

Find:

```tsx
                tab.triggerEl.dataset["state"] === "active" &&
                  "text-primary-600 dark:text-primary-400 font-bold",
```

Replace with:

```tsx
                tab.triggerEl.dataset["state"] === "active" &&
                  "text-primary-600 dark:text-primary-400 font-semibold",
```

Rationale: matches the new Voice A Semibold weight. Color is preserved (chunk 4 will recolor primary → accent later).

- [ ] **Step 4: Update TabsTrigger base (line ~430)**

Find:

```tsx
        "font-heading font-bold text-lg",
```

Replace with:

```tsx
        "font-sans font-semibold text-sm",
```

Rationale: removes Anybody, drops underline-md size from text-lg (18px) to text-sm (14px). The size-sm override `group-data-[size=sm]:text-sm` stays, but now both sizes are text-sm at base for underline — see Step 5.

- [ ] **Step 5: Verify size cascade is correct**

The TabsTrigger now has `text-sm` at base, with these overrides further down:

```tsx
"group-data-[size=sm]:text-sm group-data-[size=sm]:gap-1.5",
...
"group-data-[variant=pill]:text-sm",
...
"group-[[data-variant=pill][data-size=sm]]:text-xs",
```

The pill+md → `text-sm` (stays). The pill+sm → `text-xs` (stays). The underline+md → `text-sm` (was text-lg). The underline+sm → `text-sm` (unchanged, but base + override now coincide — no visual change). All four combinations resolve correctly.

- [ ] **Step 6: Run tabs tests**

```bash
npm test -- --run packages/ds/src/components/tabs
```

Expected: all tests pass. Tests on sliding indicator, overflow collapse, maxVisible are not affected by typography.

- [ ] **Step 7: Commit**

```bash
git add packages/ds/src/components/tabs/
git commit -m "feat(skin): tabs use Inter Semibold sentence (drop text-lg on underline-md)"
```

---

## Task 8: Full check + visual verification

**Files:**
- No edits. Verification only.

**Steps:**

- [ ] **Step 1: Run full check**

```bash
npm run check
```

Expected: lint, typecheck, and all tests pass across all workspaces. If any fail (likely test class-name assertions in components not touched above), fix the assertion to match the new class string, do NOT roll back the component change.

- [ ] **Step 2: Start preview dev server**

```bash
npm run dev
```

Expected: Turbopack starts on `http://localhost:3000`.

- [ ] **Step 3: Visit each component page in the browser**

Open each URL and visually confirm against the spec:

- `http://localhost:3000/components/alert` — variant label "WARNING" / "ERROR" renders in Departure Mono UC at ~11px, in variant color. Optional title prop (where shown) still renders as Inter Bold 14px.
- `http://localhost:3000/components/badge` — every badge renders in Departure Mono UC regardless of consumer string (try lowercase in DevTools to verify).
- `http://localhost:3000/components/breadcrumb` — list items render in Inter Medium 14px sentence case.
- `http://localhost:3000/components/pagination` — page numbers render in Departure Mono ~14px. Ellipsis matches.
- `http://localhost:3000/components/table` — column headers render in Departure Mono UC tracking-widest 11px.
- `http://localhost:3000/components/tabs` — triggers (underline md and sm, pill md and sm) all render in Inter Semibold sentence case. Underline md is 14px (down from 18px). Sliding indicator still tracks correctly.

Toggle dark mode on each page (theme switcher in sidebar) and re-verify — no color regression, no typography regression.

- [ ] **Step 4: Visit the overview page**

`http://localhost:3000/` — confirms the composed showcase blocks (mocking real product UI) read as cohesive. Both Inter sentence and Departure Mono UC coexist without one drowning the other.

- [ ] **Step 5: Stop dev server**

`Ctrl+C` in the terminal where `npm run dev` is running.

- [ ] **Step 6: Note any visual regressions**

If anything looks wrong (wrong size, wrong weight, wrong color), do NOT commit yet — return to the relevant Task 2–7 and adjust, then re-run check and visual verify.

---

## Task 9: Update docs

**Files:**
- Modify: `docs/SKIN-PRINCIPLES.md` (append rules to § Typography)
- Modify: `docs/DESIGN-SYSTEM.md` (refresh 6 component entries)
- Modify: `docs/DECISIONS.md` (add Decision #83)
- Modify: `docs/BACKLOG.md` (move to Completed)
- Modify: `CLAUDE.md` (update Current Features)

**Steps:**

- [ ] **Step 1: Append clarification rules to SKIN-PRINCIPLES.md § Typography**

Open `docs/SKIN-PRINCIPLES.md`. Find the § Typography section. After the existing "Three voices, never mixed at the same role" subsection, add a new subsection:

```markdown
### Anybody is for headings only
**Rule:** Page titles, section headers, dialog titles. Never on labels, chips, links, controls, tab triggers, or anywhere a user reads the text as part of operating the UI.
**Why:** Anybody is editorial-industrial. Applied to labels it reads as a poster headline grafted onto a control surface — the system feels "themed" rather than coherent.
**Source:** Decision #83.

### Departure Mono is the telemetry voice
**Rule:** Status chips, column headers, numeric indices, version strings, ID strings, telemetry micro-labels. Force uppercase via CSS at the component level where the role is unambiguous (Badge, Alert variant label) — apply `uppercase` utility selectively where consumer strings might want mixed case (e.g., Table headers when consumers pass already-uppercase strings).
**Why:** Departure Mono's pixel-CRT proportions carry "this is system-emitted data" in a way Inter cannot. Forcing uppercase keeps the vocabulary consistent across consumer surfaces without depending on usage discipline.
**Source:** Decision #83.

### No italic on interactive labels
**Rule:** Italic stays out of buttons, chips, links, headers, tab triggers, breadcrumb items, and badges. Italic is allowed on running prose where the register adds something (Alert message body).
**Why:** Italic on a label reads as "secondary / supporting" — wrong register for "press this" or "current location." The first generation of the skin used italic as decoration; the new generation drops it from labels and keeps it for prose.
**Source:** Decision #83.
```

- [ ] **Step 2: Refresh DESIGN-SYSTEM.md component entries**

Open `docs/DESIGN-SYSTEM.md`. Most component docs in this file are usage-focused (imports, props, examples) and don't describe typography. The one explicit typography mention to fix is in the "Decision matrix" section around line 44:

Find: `**Badge** — gradient fills, icon slots, uppercase heading font`

Replace with: `**Badge** — gradient fills, icon slots, Departure Mono UC label (CSS-forced)`

Run `grep -n "heading font\|font-heading\|uppercase" docs/DESIGN-SYSTEM.md` to find any other stale references — there should be very few. Fix them or leave them if they're explaining a different concept.

If nothing else needs updating in DESIGN-SYSTEM.md, that's fine — the principle of "what the component looks like" is captured in SKIN-PRINCIPLES.

- [ ] **Step 3: Add Decision #83 to DECISIONS.md**

Open `docs/DECISIONS.md`. After Decision #82 (top of file), insert a new Decision #83 block:

```markdown
## Decision #83 — 2026-05-26

**Context:** Six DS components (Alert variant label, Badge, Breadcrumb, Pagination numbers, Table headers, Tabs triggers) were styled in the previous Aleph-Cloud-era skin using `font-heading font-extrabold italic uppercase` (Anybody as a label face) or `font-sans font-semibold uppercase tracking-wide` (Inter uppercased). Both treatments predate the Abyssal Void skin (Decisions #77–#79) and violate SKIN-PRINCIPLES.md § Typography in two ways: Anybody used as a label face (it's reserved for headings) and Inter rendered uppercase (uppercase belongs to Departure Mono). Button was redesigned in #80–#82 with Inter sentence case; this chunk applies the same principle to the rest of the DS.
**Decision:** Route each label to one of two voices per its role. **Voice A (Inter sentence case)** for operational labels — Breadcrumb items (`font-sans font-medium text-sm`), Tabs triggers (`font-sans font-semibold text-sm`, with underline-md size dropping from text-lg to text-sm). **Voice B (Departure Mono uppercase)** for telemetry chrome — Alert variant label (`font-mono uppercase tracking-wider text-[11px]`), Badge (`font-mono uppercase tracking-wider`, with `text-transform: uppercase` forced via CSS regardless of consumer string), Pagination page numbers and ellipsis (`font-mono text-sm`, no zero-padding), Table column headers (`font-mono uppercase tracking-widest text-[11px]`). Append three clarification rules to SKIN-PRINCIPLES § Typography: "Anybody is for headings only", "Departure Mono is the telemetry voice", "No italic on interactive labels". Active-state colors (primary on Pagination, Tabs, Breadcrumb) are explicitly preserved — they're chunk 4 (active-state recolor primary → accent).
**Rationale:** The split between operational and telemetry maps cleanly to a "is this content or is this chrome?" question for each label. Alert's variant label, Badge contents, Pagination indices, and Table column headers are all system-emitted data — single tokens, unambiguous semantics, "instrument readout" mental model — and Departure Mono's pixel-CRT proportions earn their keep there. Breadcrumb segments and Tabs triggers are interactive text the user reads as content ("Home / Settings / Billing", "Overview") — Inter sentence case is the standard treatment across modern DSs. Forcing uppercase on Badge via CSS (`text-transform: uppercase`) gives systemic consistency at the cost of "12 NEW" reading shouty; the trade was accepted because the alternative ("respect consumer string") puts the burden of case discipline on every product team and produces visual drift over time. Pagination skips zero-padding to stay in standard pagination UX territory — Departure Mono does enough of the lifting. The text-lg → text-sm drop on Tabs underline-md (18px → 14px) is intentional: 18px Anybody Bold read as "page section heading"; 14px Inter Semibold reads as "tab control." Italic is dropped from all six components — it was the Anybody-era marker for "this is a label" and reads as a secondary register that's wrong for primary interactive UI.
**Alternatives considered:** All-Inter (route all 6 to Voice A, defer Departure Mono until a real telemetry surface exists) — rejected because Badge, Table headers, and the Alert variant label are textbook telemetry chrome; deferring loses the voice contrast the skin needs. Consumer-controlled case on Badge instead of CSS force-uppercase — rejected because case discipline degrades across teams over time, and the count-badge "shouty UC" cost was deemed acceptable given the systemic win. Zero-padding Pagination numbers ("001 / 002") — rejected because it pushes the component out of standard pagination UX into flight-data territory. Keeping Tabs underline-md at text-lg — rejected after live visual review; 18px Inter Semibold reads as page-section-heading even in Inter and continues the wrong scale ladder. Bumping Alert variant label to text-xs (12px) to match Badge md — rejected because the alert label is a supporting chrome element, not the focal element; 11px sits one step below Badge's 12px and reinforces the hierarchy.
```

- [ ] **Step 4: Move "Typography reset (chunk 1)" to Completed in BACKLOG.md**

Open `docs/BACKLOG.md`. If a backlog item exists for "Typography reset" or "Chunk 1 typography", move it to the Completed section. If no item was logged (this chunk emerged from the DS audit, not a prior backlog entry), add to Completed:

```markdown
- [x] 2026-05-26 — Typography reset across 6 components (Decision #83: Alert variant label, Badge, Pagination numbers, Table headers → Departure Mono UC; Breadcrumb, Tabs triggers → Inter Semibold sentence case; Anybody removed from all interactive label roles)
```

- [ ] **Step 5: Update Current Features in CLAUDE.md**

Open `CLAUDE.md`. Find the "Current Features" section. Update each of the 6 component entries to reflect the new typography. For example, the Badge line should read something like:

```
- Badge component with 5 semantic variants (default/success/warning/error/info), 2 fill modes (solid gradient/outline), 2 sizes, optional iconLeft/iconRight slots, Departure Mono UC label face with CSS-forced uppercase
```

Apply equivalent updates to Alert, Breadcrumb, Pagination, Table, Tabs entries.

- [ ] **Step 6: Commit doc updates**

```bash
git add docs/ CLAUDE.md
git commit -m "docs(skin): typography reset — SKIN-PRINCIPLES, DESIGN-SYSTEM, DECISIONS #83"
```

---

## Task 10: Push branch + open PR into `skin/paraplu`

**Files:**
- No file edits. Git operations only.

**Steps:**

- [ ] **Step 1: Run final check**

```bash
npm run check
```

Expected: all checks pass. Do NOT proceed to push if anything fails.

- [ ] **Step 2: Push branch**

```bash
git push -u origin skin/typography-reset
```

Expected: branch pushed, tracking set.

- [ ] **Step 3: Open PR targeting `skin/paraplu` (NOT main)**

```bash
gh pr create --base skin/paraplu --title "feat(skin): typography reset across 6 components" --body "$(cat <<'EOF'
## Summary

- Routes Alert variant label, Badge, Pagination numbers, Table headers to Departure Mono UC (Voice B — telemetry chrome)
- Routes Breadcrumb items and Tabs triggers to Inter Semibold sentence case (Voice A — operational labels)
- Drops Tabs underline-md size from text-lg (18px) to text-sm (14px)
- Forces uppercase on Badge via CSS `text-transform: uppercase` — consumer string case is preserved in DOM
- Appends three clarification rules to SKIN-PRINCIPLES § Typography ("Anybody for headings only", "Departure Mono is the telemetry voice", "No italic on interactive labels")
- Active-state colors (primary on Pagination/Tabs/Breadcrumb) are explicitly preserved — they're chunk 4

## Test plan

- [ ] `npm run check` passes (lint + typecheck + test, all workspaces)
- [ ] Preview pages render correctly in light + dark mode for each of the 6 components
- [ ] Composed overview at `/` reads as cohesive (two voices coexist)
- [ ] Badge DOM `textContent` preserves consumer string case (new test in `badge.test.tsx`)

Spec: `docs/superpowers/specs/2026-05-26-typography-reset-design.md`
Plan: `docs/superpowers/plans/2026-05-26-typography-reset.md`
Decision: `#83`
EOF
)"
```

Expected: PR URL printed. Capture it.

- [ ] **Step 4: Squash-merge after user approval**

DO NOT auto-merge. Wait for user confirmation before running:

```bash
gh pr merge <pr-number> --squash --delete-branch
```

- [ ] **Step 5: Sync the integration branch worktree**

After merge completes:

```bash
git checkout skin/paraplu
git pull --ff-only origin skin/paraplu
git branch -D skin/typography-reset
```

Expected: `skin/paraplu` advances with the squashed commit. Local chunk branch removed.

---

## Definition of done

This chunk is complete when:

1. All 6 components no longer reference `font-heading` in their `.tsx` files. Verify:
   ```bash
   grep -r "font-heading" packages/ds/src/components/{alert,badge,breadcrumb,pagination,table,tabs}
   ```
   Expected: zero matches.
2. Badge `textContent` preservation test passes (`badge.test.tsx`).
3. `npm run check` passes.
4. Visual verification at `localhost:3000` confirms each component reads as designed in both light and dark modes.
5. SKIN-PRINCIPLES.md contains the three new clarification rules under § Typography.
6. DECISIONS.md contains Decision #83.
7. BACKLOG.md item moved to Completed.
8. CLAUDE.md Current Features updated for the 6 components.
9. PR merged into `skin/paraplu`. Local chunk branch deleted.
