# Radius Hard-Floor + Card-Family Unification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Retire the 0px corner system-wide — set a 4px radius floor (`4/6/8` ladder), soften the `--edge` hairline, and unify the three card surfaces (Card, SelectableCard, Dialog) under one surface language.

**Architecture:** One token edit in `tokens.css` flips cards (`rounded-lg`→6px) and dialogs (`rounded-xl`→8px) automatically because those classes are token-driven. Controls use **hardcoded** `rounded-none`/`rounded-[2px]`, so they're swept to `rounded-sm` (which the same token edit points at 4px). Dialog gains the shared `border-edge` hairline. No new abstraction — the "surface language" is the existing `bg-surface + border-edge + tier-radius` pattern, now applied consistently.

**Tech Stack:** Tailwind CSS 4 (CSS-variable radius scale), CVA, React, Vitest + Testing Library. Commands: `npm run check` (lint + typecheck + test), `npm run dev` (preview), `npm run build` (static export).

---

## Spec

Source spec: `docs/superpowers/specs/2026-06-05-radius-floor-card-unification-design.md`

Reviewed open questions (all resolved "as written"): small controls (checkbox/switch/tabs-pill/stepper) round to 4px; `--radius-md` stays an alias of the floor; Alert + Skeleton sit at 4px chrome.

## File map

**Tokens (foundation):**
- `packages/ds/src/styles/tokens.css` — radius scale, light + dark `--edge`/`--edge-hover`, vocabulary comment, `@source inline` safelist.

**Component sweep — `rounded-none` → `rounded-sm`:**
- input, textarea, select, combobox, multi-select, button, checkbox, tabs, pagination, alert, tooltip, slider, copyable-text, ui/skeleton, dialog (close button).

**Component sweep — `rounded-[2px]` → `rounded-sm`:**
- badge, switch, multi-select (chips + indicators), tabs (pill), stepper.

**Dialog hairline:**
- `packages/ds/src/components/dialog/dialog.tsx` — add `border border-edge` to content.

**Test updates:** badge, checkbox, tabs (assertion class). card + selectable-card: comment-only (class assertions stay valid).

**Docs:** SKIN-PRINCIPLES, DESIGN-SYSTEM, ARCHITECTURE, DECISIONS, BACKLOG, CLAUDE.

---

## Setup: branch

- [ ] **Step 1: Branch from main**

```bash
git checkout main
git pull --ff-only origin main
git checkout -b feature/radius-floor-card-unification
```

Expected: on a clean `feature/radius-floor-card-unification` off latest main. (This chunk targets main directly — `skin/paraplu` already merged; new DS chunks branch off main.)

---

## Task 1: Radius + edge tokens

**Files:**
- Modify: `packages/ds/src/styles/tokens.css`

This task alone makes Card render at 6px and Dialog at 8px (token-driven classes). Controls stay 0px/2px until swept in later tasks. No test changes — existing tests assert class names, not pixels.

- [ ] **Step 1: Update the radius scale + comment**

Replace lines 122–126:

```css
  /* Radius vocabulary (Abyssal Void — 0/0/2/4, full reserved for round-by-design) */
  --radius-sm: 0;
  --radius-md: 0;
  --radius-lg: 2px;
  --radius-xl: 4px;
```

with:

```css
  /* Radius vocabulary (Abyssal Void — 4/6/8 hard floor, full reserved for round-by-design) */
  --radius-sm: 4px;
  --radius-md: 4px;
  --radius-lg: 6px;
  --radius-xl: 8px;
```

- [ ] **Step 2: Soften the light-mode edge**

In the `:root` block, replace:

```css
  --edge: oklch(0.87 0.013 270);
  --edge-hover: oklch(0.80 0.015 270);
```

with:

```css
  --edge: rgba(0, 0, 0, 0.14);
  --edge-hover: rgba(0, 0, 0, 0.22);
```

- [ ] **Step 3: Soften the dark-mode edge**

In the `.theme-dark` block, replace:

```css
  --edge: rgba(255, 255, 255, 0.16);
  --edge-hover: rgba(255, 255, 255, 0.24);
```

with:

```css
  --edge: rgba(255, 255, 255, 0.10);
  --edge-hover: rgba(255, 255, 255, 0.20);
```

- [ ] **Step 4: Update the pill safelist**

In the `@source inline(...)` directive, change `group-data-[variant=pill]:rounded-[2px]` to `group-data-[variant=pill]:rounded-sm` (leave every other class in the string untouched).

- [ ] **Step 5: Verify build + tests still green**

Run: `npm run check`
Expected: PASS (no test asserts pixel values; card/selectable-card `rounded-lg` assertions still hold — the class is unchanged).

- [ ] **Step 6: Visual sanity check**

Run: `npm run dev`, open the Card and Dialog preview pages in both themes.
Expected: Card corners visibly softer (6px), Dialog softer still (8px), hairlines lighter. Buttons/inputs still sharp (swept next).

- [ ] **Step 7: Commit**

```bash
git add packages/ds/src/styles/tokens.css
git commit -m "feat(tokens): 4/6/8 radius floor + softened edge hairline"
```

---

## Task 2: Form-control sweep

**Files:**
- Modify: `packages/ds/src/components/input/input.tsx`
- Modify: `packages/ds/src/components/textarea/textarea.tsx`
- Modify: `packages/ds/src/components/select/select.tsx`
- Modify: `packages/ds/src/components/combobox/combobox.tsx`
- Modify: `packages/ds/src/components/multi-select/multi-select.tsx`

No existing radius tests for these — verify via build + completeness grep + visual.

- [ ] **Step 1: Sweep each occurrence** (`rounded-none` and `rounded-[2px]` → `rounded-sm`)

| File | Old fragment | New fragment |
|---|---|---|
| input.tsx | `border border-edge rounded-none` | `border border-edge rounded-sm` |
| textarea.tsx | `border border-edge rounded-none` | `border border-edge rounded-sm` |
| select.tsx | `border border-edge rounded-none` | `border border-edge rounded-sm` |
| select.tsx | `z-50 overflow-hidden rounded-none` | `z-50 overflow-hidden rounded-sm` |
| select.tsx | `relative flex items-center rounded-none px-4 py-2` | `relative flex items-center rounded-sm px-4 py-2` |
| combobox.tsx | `border border-edge rounded-none` | `border border-edge rounded-sm` |
| combobox.tsx | `overflow-hidden rounded-none` | `overflow-hidden rounded-sm` |
| combobox.tsx | `relative flex items-center rounded-none px-4 py-2` | `relative flex items-center rounded-sm px-4 py-2` |
| multi-select.tsx | `border border-edge rounded-none` | `border border-edge rounded-sm` |
| multi-select.tsx | `inline-flex items-center gap-1 rounded-[2px] bg-muted` | `inline-flex items-center gap-1 rounded-sm bg-muted` |
| multi-select.tsx | `shrink-0 rounded-[2px]` (two occurrences) | `shrink-0 rounded-sm` |
| multi-select.tsx | `overflow-hidden rounded-none` | `overflow-hidden rounded-sm` |
| multi-select.tsx | `rounded-none px-3 py-2` | `rounded-sm px-3 py-2` |
| multi-select.tsx | `rounded-none border transition-colors` | `rounded-sm border transition-colors` |

- [ ] **Step 2: Verify no leftovers in these files**

Run: `rg -n 'rounded-(none|\[2px\])' packages/ds/src/components/{input,textarea,select,combobox,multi-select}`
Expected: no output.

- [ ] **Step 3: Run tests**

Run: `npm run test -- input textarea select combobox multi-select`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add packages/ds/src/components/input packages/ds/src/components/textarea packages/ds/src/components/select packages/ds/src/components/combobox packages/ds/src/components/multi-select
git commit -m "refactor(forms): radius floor — controls + menus to rounded-sm"
```

---

## Task 3: Button, badge, checkbox, switch sweep

**Files:**
- Modify: `packages/ds/src/components/button/button.tsx`
- Modify: `packages/ds/src/components/badge/badge.tsx` + `badge.test.tsx`
- Modify: `packages/ds/src/components/checkbox/checkbox.tsx` + `checkbox.test.tsx`
- Modify: `packages/ds/src/components/switch/switch.tsx`

Badge and checkbox have radius assertions — TDD red-green. Button keeps its `rounded-full` LED dots (do not touch lines using `rounded-full`). Switch has no radius test.

- [ ] **Step 1: Update badge + checkbox test assertions (red)**

In `badge.test.tsx` change the assertion and its `it(...)` label:

```ts
    it("applies rounded-sm", () => {
      // ...
      expect(container.firstElementChild?.className).toContain("rounded-sm");
```

In `checkbox.test.tsx`:

```ts
  it("all sizes carry rounded-sm", () => {
    // ...
      expect(screen.getByRole("checkbox").className).toContain("rounded-sm");
```

- [ ] **Step 2: Run to confirm failure**

Run: `npm run test -- badge checkbox`
Expected: FAIL — components still emit `rounded-[2px]` / `rounded-none`.

- [ ] **Step 3: Sweep the components**

| File | Old fragment | New fragment |
|---|---|---|
| button.tsx | `rounded-none border-0 text-white` | `rounded-sm border-0 text-white` |
| badge.tsx | `rounded-[2px] font-mono uppercase tracking-wider` | `rounded-sm font-mono uppercase tracking-wider` |
| checkbox.tsx | `size-3.5 rounded-none` | `size-3.5 rounded-sm` |
| checkbox.tsx | `size-4 rounded-none` | `size-4 rounded-sm` |
| checkbox.tsx | `size-5 rounded-none` | `size-5 rounded-sm` |
| switch.tsx | `items-center rounded-[2px]` | `items-center rounded-sm` |
| switch.tsx | `pointer-events-none block rounded-[2px]` | `pointer-events-none block rounded-sm` |

Do **not** alter button.tsx lines containing `rounded-full` (LED dots — round-by-design).

- [ ] **Step 4: Run to confirm pass**

Run: `npm run test -- button badge checkbox switch`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/ds/src/components/button packages/ds/src/components/badge packages/ds/src/components/checkbox packages/ds/src/components/switch
git commit -m "refactor(controls): radius floor — button/badge/checkbox/switch to rounded-sm"
```

---

## Task 4: Tabs, pagination, stepper sweep

**Files:**
- Modify: `packages/ds/src/components/tabs/tabs.tsx` + `tabs.test.tsx`
- Modify: `packages/ds/src/components/pagination/pagination.tsx`
- Modify: `packages/ds/src/components/stepper/stepper.tsx`

Tabs has three radius assertions — TDD red-green.

- [ ] **Step 1: Update tabs test assertions (red)**

In `tabs.test.tsx`, change all three `rounded-[2px]` assertions to `rounded-sm`:
- line ~346: `expect(list.className).toContain("rounded-sm");`
- line ~396: `expect(list.className).toContain("rounded-sm");`
- line ~429: `expect(list).toHaveClass("rounded-sm");`

- [ ] **Step 2: Run to confirm failure**

Run: `npm run test -- tabs`
Expected: FAIL — pill list still emits `rounded-[2px]`.

- [ ] **Step 3: Sweep the components**

| File | Old fragment | New fragment |
|---|---|---|
| tabs.tsx | `relative z-10 rounded-[2px]` | `relative z-10 rounded-sm` |
| tabs.tsx | `rounded-none bg-popover-bg border border-popover-border shadow` | `rounded-sm bg-popover-bg border border-popover-border shadow` |
| tabs.tsx | `flex w-full items-center rounded-none px-3 py-2` | `flex w-full items-center rounded-sm px-3 py-2` |
| tabs.tsx | `rounded-[2px] bg-muted border border-edge` | `rounded-sm bg-muted border border-edge` |
| tabs.tsx | `rounded-[2px] bg-accent/15` | `rounded-sm bg-accent/15` |
| tabs.tsx | `group-data-[variant=pill]:rounded-[2px]` | `group-data-[variant=pill]:rounded-sm` |
| pagination.tsx | `size-8 rounded-none` | `size-8 rounded-sm` |
| pagination.tsx | `size-[26px] rounded-none` | `size-[26px] rounded-sm` |
| stepper.tsx | `relative flex size-8 items-center justify-center rounded-[2px]` | `relative flex size-8 items-center justify-center rounded-sm` |

- [ ] **Step 4: Run to confirm pass**

Run: `npm run test -- tabs pagination stepper`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/ds/src/components/tabs packages/ds/src/components/pagination packages/ds/src/components/stepper
git commit -m "refactor(nav): radius floor — tabs/pagination/stepper to rounded-sm"
```

---

## Task 5: Overlays & misc sweep

**Files:**
- Modify: `packages/ds/src/components/alert/alert.tsx`
- Modify: `packages/ds/src/components/tooltip/tooltip.tsx`
- Modify: `packages/ds/src/components/slider/slider.tsx`
- Modify: `packages/ds/src/components/copyable-text/copyable-text.tsx`
- Modify: `packages/ds/src/components/ui/skeleton.tsx`
- Modify: `packages/ds/src/components/dialog/dialog.tsx` (close button only — content hairline is Task 6)

No radius assertions here. Slider thumb/track/range stay `rounded-full` — only the slider tooltip changes.

- [ ] **Step 1: Sweep each occurrence**

| File | Old fragment | New fragment |
|---|---|---|
| alert.tsx | `relative overflow-hidden rounded-none border` | `relative overflow-hidden rounded-sm border` |
| tooltip.tsx | `z-50 rounded-none bg-popover-bg border border-popover-border px-3 py-1.5` | `z-50 rounded-sm bg-popover-bg border border-popover-border px-3 py-1.5` |
| slider.tsx | `rounded-none bg-popover-bg border border-popover-border px-2 py-1` | `rounded-sm bg-popover-bg border border-popover-border px-2 py-1` |
| copyable-text.tsx | `rounded-none cursor-pointer shrink-0` | `rounded-sm cursor-pointer shrink-0` |
| copyable-text.tsx | `inline-flex items-center justify-center rounded-none shrink-0` | `inline-flex items-center justify-center rounded-sm shrink-0` |
| ui/skeleton.tsx | `animate-pulse motion-reduce:animate-none rounded-none bg-muted` | `animate-pulse motion-reduce:animate-none rounded-sm bg-muted` |
| dialog.tsx | `absolute top-4 right-4 rounded-none` | `absolute top-4 right-4 rounded-sm` |

Do **not** touch slider.tsx lines with `rounded-full` (track/thumb/range).

- [ ] **Step 2: Run tests**

Run: `npm run test -- alert tooltip slider copyable-text skeleton dialog`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add packages/ds/src/components/alert packages/ds/src/components/tooltip packages/ds/src/components/slider packages/ds/src/components/copyable-text packages/ds/src/components/ui/skeleton packages/ds/src/components/dialog
git commit -m "refactor(overlays): radius floor — alert/tooltip/slider/copyable/skeleton/dialog-close to rounded-sm"
```

---

## Task 6: Dialog hairline (unify the family)

**Files:**
- Modify: `packages/ds/src/components/dialog/dialog.tsx`
- Test: `packages/ds/src/components/dialog/dialog.test.tsx`

Dialog joins the surface language: `bg-surface + border-edge + radius-8`. Overrides Decision #87's border-less rule.

- [ ] **Step 1: Write the failing test**

Add to `dialog.test.tsx` (inside the existing describe block; match the file's existing render/query style for `DialogContent`):

```tsx
  it("DialogContent carries the border-edge hairline", () => {
    render(
      <Dialog open>
        <DialogContent>
          <DialogTitle>Title</DialogTitle>
        </DialogContent>
      </Dialog>,
    );
    const content = screen.getByRole("dialog");
    expect(content.className).toContain("border");
    expect(content.className).toContain("border-edge");
  });
```

- [ ] **Step 2: Run to confirm failure**

Run: `npm run test -- dialog`
Expected: FAIL — content has no `border-edge`.

- [ ] **Step 3: Add the hairline**

In `dialog.tsx`, change the content class:

```
"relative w-full max-w-md rounded-xl bg-surface p-6",
```

to:

```
"relative w-full max-w-md rounded-xl border border-edge bg-surface p-6",
```

- [ ] **Step 4: Run to confirm pass**

Run: `npm run test -- dialog`
Expected: PASS.

- [ ] **Step 5: Visual check**

Run: `npm run dev`, open a Dialog in both themes.
Expected: a faint 1px hairline crisps the modal boundary against the blurred backdrop; no heavy outline.

- [ ] **Step 6: Commit**

```bash
git add packages/ds/src/components/dialog
git commit -m "feat(dialog): join card surface language — add border-edge hairline"
```

---

## Task 7: Cleanup + completeness verification

**Files:**
- Modify: `packages/ds/src/components/card/card.test.tsx` (comment only)
- Modify: `packages/ds/src/components/selectable-card/selectable-card.test.tsx` (comment only)

- [ ] **Step 1: Fix stale "2px" comments**

In `card.test.tsx`, change the test label `applies rounded-lg (2px under Abyssal scale)` to `applies rounded-lg (6px under Abyssal scale)`. In `selectable-card.test.tsx`, change the comment block referencing `"Cards earn 2px"` to `"Cards earn 6px"`. (Class assertions `rounded-lg` / `not rounded-2xl` stay — still correct.)

- [ ] **Step 2: Completeness grep — no hardcoded sharp/2px corners remain**

Run: `rg -n 'rounded-(none|\[2px\])' packages/ds/src`
Expected: **no output.** (Every functional surface now uses `rounded-sm`; objects `rounded-lg`; modals `rounded-xl`; round-by-design `rounded-full`.)

- [ ] **Step 3: Full check**

Run: `npm run check`
Expected: PASS (lint + typecheck + test, all workspaces).

- [ ] **Step 4: Build**

Run: `npm run build`
Expected: static export succeeds; `rounded-sm` utility generated (Tailwind picks it up from the swept source, mapped to `--radius-sm: 4px`).

- [ ] **Step 5: Full visual pass**

Run: `npm run dev`. In both themes, eyeball: buttons/inputs/badges/checkbox/switch/tabs at 4px; cards + selectable cards at 6px; dialog at 8px; status dot / radio / slider thumb / progress track still fully round; hairlines uniformly soft.

- [ ] **Step 6: Commit**

```bash
git add packages/ds/src/components/card packages/ds/src/components/selectable-card
git commit -m "test: refresh stale 2px radius comments for 6px card tier"
```

---

## Task 8: Update docs

Copy this checklist verbatim — it's the definition of done, not a merge-time afterthought.

- [ ] **DESIGN-SYSTEM.md** — replace the radius vocabulary section with the `4/6/8` ladder + surface-radii table; update `--edge` values (dark `0.10/0.20`, light translucent `0.14/0.22`); note the unified card surface and Dialog's new hairline.
- [ ] **ARCHITECTURE.md** — document the token-vs-literal radius mechanism (why `rounded-lg`/`rounded-xl` followed the token edit but `rounded-none`/`rounded-[2px]` needed a sweep to `rounded-sm`); note the shared `bg-surface + border-edge + tier-radius` surface language.
- [ ] **SKIN-PRINCIPLES.md** — rewrite § 1 (remove "Sharp 0px corners on functional surfaces… not rounded"; the geometry is now a 4px floor) and § 4 (new `4/6/8` ladder, surface-radii table, round-by-design list); update § 6 Dialog references for the hairline (Dialog no longer border-less).
- [ ] **DECISIONS.md** — add the new Decision: hard-floor radius (`4/6/8`, 0px retired), edge softening (one translucent concept across modes), Dialog hairline. Note it supersedes the `0/0/2/4` ladder and overrides the geometry/edge/border-less clauses of Decisions #78, #87, #90.
- [ ] **BACKLOG.md** — add deferred interactive-Card / card-anatomy item; note the CLAUDE.md SelectableCard `rounded-2xl` doc drift is now resolved.
- [ ] **CLAUDE.md** — update the radius-vocabulary line in the skin summary and every Current-Features line that names a now-stale radius (`rounded-none`, `rounded-[2px]`, "0px", "2px", "4px" radii) to the new values.

- [ ] **Commit docs**

```bash
git add docs CLAUDE.md
git commit -m "docs: radius hard-floor + card unification (DECISIONS, SKIN-PRINCIPLES, etc.)"
```

---

## Finish

- [ ] Run final `npm run check` — must pass.
- [ ] Ship via the `ship` skill (or the CLAUDE.md "Finishing a branch" sequence): push `feature/radius-floor-card-unification`, open a PR targeting `main`, squash-merge, sync main, clean up the branch.

---

## Self-review notes (author)

- **Spec coverage:** radius ladder (Tasks 1–5,7), edge softening (Task 1), Dialog hairline / unification (Task 6), small-controls floor (Tasks 3–4), docs (Task 8) — all mapped.
- **No placeholders:** every sweep shows exact old→new fragments; every test step shows the assertion.
- **Type/name consistency:** the swept target class is `rounded-sm` everywhere; token names (`--radius-sm/md/lg/xl`, `--edge`, `--edge-hover`) match across tasks.
