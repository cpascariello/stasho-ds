# Chunk 6 — Container surfaces Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Lock the chunk-6 container-surface chassis — neutralize shadow tokens, introduce a popover surface token, reskin Tooltip, add Dialog cyan top-rail, align all four popover dropdowns to the new token, and migrate preview-app consumers — per `docs/superpowers/specs/2026-05-27-chunk-6-container-surfaces-design.md`.

**Architecture:** Two layers of change — (a) token migration in `tokens.css` (rename `--shadow-brand-*` → `--shadow-*`, neutralize blue tint, introduce `--popover-bg` / `--popover-border`) and (b) per-component class swaps consuming the new tokens. The token rename is breaking — preview-app consumers (`sidebar.tsx`, `page.tsx`, `foundations/effects/page.tsx`) are migrated in the same PR. No backwards-compatible aliases.

**Tech Stack:** Tailwind CSS 4 with `@theme` and `@custom-variant dark`, CVA (class-variance-authority), Radix UI primitives, cmdk (Combobox/MultiSelect), Vitest, oxlint, TypeScript.

**Spec:** `docs/superpowers/specs/2026-05-27-chunk-6-container-surfaces-design.md`

**Integration branch:** `skin/paraplu`. This chunk lives on a short-lived branch off `skin/paraplu`, PRs into `skin/paraplu`, and squash-merges. It does NOT target main.

---

## File map

| File | What changes | Owner |
|---|---|---|
| `packages/ds/src/styles/tokens.css` | Lines 112–115 (shadow tokens — rename, neutralize, add Tailwind `--shadow-*` bridge). Add `--popover-bg` + `--popover-border` to both `:root` and `.theme-dark`. Bridge through `--color-popover-bg` / `--color-popover-border`. | Task 2 |
| `packages/ds/src/components/dialog/dialog.tsx` | `DialogContent` chassis (lines 38–46) — cyan top-rail + neutral shadow + `rounded-md`. Close button focus chrome (lines 60–63) — Button outline pattern. | Task 3 |
| `packages/ds/src/components/tooltip/tooltip.tsx` | `TooltipContent` chassis (lines 14–25) — full token swap. | Task 4 |
| `packages/ds/src/components/card/card.tsx` | `cardVariants` base (line 5) — `rounded-[2px]` → `rounded-sm`. | Task 5 |
| `packages/ds/src/components/select/select.tsx` | `SelectPrimitive.Content` className (lines 91–94) — popover token + neutral shadow. Item `data-[disabled]` rules (lines 109–110) — disabled-pattern alignment. | Task 6 |
| `packages/ds/src/components/combobox/combobox.tsx` | `Popover.Content` className (lines 112–117) — popover token + neutral shadow. Item `data-[disabled=true]` rules (lines 148–149) — disabled-pattern alignment. | Task 6 |
| `packages/ds/src/components/multi-select/multi-select.tsx` | `Popover.Content` className (lines 232–237) — popover token + neutral shadow. Item `data-[disabled=true]` rules (lines 276–277) — disabled-pattern alignment. Inner indicator checkbox (lines 281–288) — `border-primary bg-primary` → `border-accent bg-accent text-accent-foreground`. | Task 6 |
| `packages/ds/src/components/tabs/tabs.tsx` | `DropdownMenu.Content` className (lines 226–232) — popover token + neutral shadow + `rounded-md` → `rounded-none`. Item `data-[disabled]` rules (line 260) — disabled-pattern alignment. | Task 6 |
| `apps/preview/src/app/page.tsx` | Lines 212 + 218 description strings (`"shadow-brand"` → `"shadow"`). Line 484 hover class (`hover:shadow-brand-sm` → `hover:shadow-sm`). | Task 7 |
| `apps/preview/src/components/sidebar.tsx` | Line 283 (`shadow-brand-lg` → `shadow-lg`). | Task 7 |
| `apps/preview/src/app/foundations/effects/page.tsx` | `SHADOWS` array (lines 4–7) — rename names and class strings. | Task 7 |
| `docs/SKIN-PRINCIPLES.md` | § 6 — add "Elevation is neutral" + "Cyan top-rail = live surface" sub-sections. § 4 — amend Geometry block (popover/modal/card radius rule). | Task 10 |
| `docs/DESIGN-SYSTEM.md` | Card, Dialog, Tooltip, Select, Combobox, MultiSelect entries — refresh visual style notes. Add popover token doc. | Task 10 |
| `docs/DECISIONS.md` | Decision #87 entry. | Task 10 |
| `docs/BACKLOG.md` | Move chunk-6 backlog item to Completed (if a chunk-6 entry exists; add a new Completed entry otherwise). | Task 10 |
| `CLAUDE.md` | Update Current Features for Card, Dialog, Tooltip, Select, Combobox, MultiSelect, Tabs. | Task 10 |

---

## Scope addition (spec carry-over)

The spec (§ 7.2 table) addresses item disabled rules but not the **MultiSelect inner indicator checkbox**, which today renders with `border-primary bg-primary text-primary-foreground` when an item is selected. This is the same brand-color-as-active-state leak the wave has been removing — and since chunk 6 already touches MultiSelect, fixing it here keeps the component whole. Logged as part of Decision #87 with a note that the spec didn't anticipate it.

The inner indicator becomes:
- Resting (unchecked) — `border-edge bg-surface` (unchanged)
- Selected — `border-accent bg-accent text-accent-foreground`

---

## Task 1: Create chunk branch off `skin/paraplu`

**Files:**
- No file edits. Branch operation only.

**Steps:**

- [ ] **Step 1: Verify worktree is on `skin/paraplu` and clean**

```bash
cd /Users/dio/Library/CloudStorage/Dropbox/Claudio/repos/stasho-ds/.claude/worktrees/skin+paraplu
git status
git branch --show-current
```

Expected: `skin/paraplu`. Working tree should have no staged changes. Untracked files in `.superpowers/brainstorm/` are fine (gitignored). Any leftover screenshots like `before-*.png` / `after-*.png` at the repo root from prior chunk visual-verification can be deleted before branching — they are workspace artifacts, not project files.

- [ ] **Step 2: Sync `skin/paraplu` from origin**

```bash
git pull --ff-only origin skin/paraplu
```

Expected: `Already up to date` OR a fast-forward with no merge commits.

- [ ] **Step 3: Create chunk branch**

```bash
git checkout -b skin/container-surfaces
```

Expected: `Switched to a new branch 'skin/container-surfaces'`.

---

## Task 2: Token migration in `tokens.css`

**Files:**
- Modify: `packages/ds/src/styles/tokens.css:112-115` (rename + neutralize shadow tokens; add Tailwind bridge classes)
- Modify: `packages/ds/src/styles/tokens.css` Layer 2 (`:root` and `.theme-dark` blocks — add `--popover-bg` + `--popover-border`)
- Modify: `packages/ds/src/styles/tokens.css` Layer 3 Tailwind bridge (add `--color-popover-bg` + `--color-popover-border`)

**Steps:**

- [ ] **Step 1: Replace the shadow token block (lines 112–115)**

Find:

```css
  /* Shadows (anchored on primary-800 oklch(0.27 0.180 264)) */
  --shadow-brand-sm: 0px 4px 4px oklch(0.27 0.180 264 / 0.20);
  --shadow-brand: 0px 4px 24px oklch(0.27 0.180 264 / 0.15);
  --shadow-brand-lg: 0px 4px 48px oklch(0.27 0.180 264 / 0.30);
```

Replace with:

```css
  /* Shadows — neutral elevation, no brand tint (Decision #87) */
  --shadow-sm: 0px 2px 4px rgba(0, 0, 0, 0.10);
  --shadow: 0px 4px 16px rgba(0, 0, 0, 0.20);
  --shadow-lg: 0px 24px 60px rgba(0, 0, 0, 0.65);
```

The Tailwind utilities `shadow-sm` / `shadow` / `shadow-lg` resolve from these tokens via the `--shadow-*` naming convention (Tailwind 4 picks them up automatically from `@theme`).

- [ ] **Step 2: Add popover token to `:root` (light mode) — Layer 2**

Find the `:root` block in Layer 2 (around line 132 — starts after `Layer 2: Semantic Surface Tokens` comment). After the `--edge-hover` line (line 152), add:

```css
  --popover-bg: var(--surface);
  --popover-border: var(--edge);
```

- [ ] **Step 3: Add popover token to `.theme-dark` (dark mode) — Layer 2**

Find the `.theme-dark` block in Layer 2 (search for `.theme-dark {` in tokens.css). After the corresponding `--edge-hover` declaration, add the same two lines:

```css
  --popover-bg: var(--surface);
  --popover-border: var(--edge);
```

(Both modes resolve through `--surface` / `--edge`, so the dark-mode block intentionally repeats the structure — this lets future skin work re-point the popover surface to a different base without re-editing every consumer.)

- [ ] **Step 4: Add Tailwind bridge utilities — Layer 3**

Find the Layer 3 `@theme` block in tokens.css (search for `@theme` directive). Add these two lines alongside the other `--color-*` bridge entries:

```css
  --color-popover-bg: var(--popover-bg);
  --color-popover-border: var(--popover-border);
```

This makes `bg-popover-bg` and `border-popover-border` available as Tailwind utilities.

- [ ] **Step 5: Run DS test suite to confirm token changes don't break behavior**

```bash
npm run test -w packages/ds
```

Expected: 348/348 (or current count) pass. Tests don't assert on shadow tokens, so this should be a clean pass.

- [ ] **Step 6: Commit**

```bash
git add packages/ds/src/styles/tokens.css
git commit -m "feat(skin): shadow tokens neutral; popover surface tokenized"
```

---

## Task 3: Dialog — cyan top-rail + focus + radius

**Files:**
- Modify: `packages/ds/src/components/dialog/dialog.tsx:38-46` (DialogContent chassis)
- Modify: `packages/ds/src/components/dialog/dialog.tsx:60-63` (close button focus)

**Steps:**

- [ ] **Step 1: Baseline tests**

```bash
npm run test -w packages/ds -- dialog
```

Expected: all existing dialog tests pass. (Note: dialog.test.tsx may or may not exist; if it doesn't, baseline is "test suite still passes with dialog imported.")

- [ ] **Step 2: Replace `DialogContent` chassis className (lines 38–46)**

Find:

```tsx
<DialogPrimitive.Content
  ref={ref}
  className={cn(
    "relative w-full max-w-md rounded-[4px] bg-surface p-6 shadow-brand-lg",
    "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
    "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
    "motion-reduce:animate-none",
    className,
  )}
```

Replace with:

```tsx
<DialogPrimitive.Content
  ref={ref}
  className={cn(
    "relative w-full max-w-md rounded-md bg-surface p-6",
    "border-t-2 border-t-accent",
    "shadow-[0_24px_60px_rgba(0,0,0,0.65),0_0_8px_rgba(0,225,250,0.5)]",
    "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
    "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
    "motion-reduce:animate-none",
    className,
  )}
```

Changes:
- `rounded-[4px]` → `rounded-md` (semantic, same 4px)
- `shadow-brand-lg` → compound arbitrary shadow combining `--shadow-lg` value + cyan top-edge glow
- New: `border-t-2 border-t-accent` (cyan rail)

The compound `shadow-[...]` arbitrary value carries both the neutral drop and the outer cyan top-edge glow. The first shadow is the `--shadow-lg` value spelled out; the second is the cyan glow at low intensity. **Implementation note:** if Tailwind 4's scanner doesn't pick up the compound shadow, fallback is `shadow-lg` + an inline `style={{ boxShadow: '...' }}` override. Verify in Task 8 (visual review).

- [ ] **Step 3: Replace close-button focus chrome (lines 60–63)**

Find:

```tsx
<DialogPrimitive.Close
  className={cn(
    "absolute top-4 right-4 rounded-none",
    "text-muted-foreground transition-colors hover:text-foreground",
    "focus-visible:outline-none focus-visible:ring-2",
    "focus-visible:ring-primary-400 focus-visible:ring-offset-2",
  )}
  aria-label="Close"
>
```

Replace with:

```tsx
<DialogPrimitive.Close
  className={cn(
    "absolute top-4 right-4 rounded-none",
    "text-muted-foreground transition-colors hover:text-foreground",
    "focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2",
  )}
  aria-label="Close"
>
```

(Replaces `ring-primary-400` + `ring-offset-2` with the Button focus outline pattern.)

- [ ] **Step 4: Run dialog tests**

```bash
npm run test -w packages/ds -- dialog
```

Expected: tests still pass. The chassis change is class-only.

- [ ] **Step 5: Commit**

```bash
git add packages/ds/src/components/dialog/dialog.tsx
git commit -m "feat(skin): Dialog — cyan top-rail signature, neutral shadow, accent focus"
```

---

## Task 4: Tooltip — full reskin to popover token

**Files:**
- Modify: `packages/ds/src/components/tooltip/tooltip.tsx:14-25`

**Steps:**

- [ ] **Step 1: Baseline tests**

```bash
npm run test -w packages/ds -- tooltip
```

Expected: all existing tests pass.

- [ ] **Step 2: Replace TooltipContent className**

Find (lines 14–25):

```tsx
<TooltipPrimitive.Content
  ref={ref}
  sideOffset={sideOffset}
  className={cn(
    [
      "z-50 rounded-lg bg-neutral-900 dark:bg-base-800 px-3 py-1.5",
      "text-sm text-white shadow-brand-sm",
      "animate-in fade-in-0 zoom-in-95",
      "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
      "data-[state=closed]:zoom-out-95",
      "motion-reduce:animate-none",
    ].join(" "),
    className,
  )}
  {...rest}
/>
```

Replace with:

```tsx
<TooltipPrimitive.Content
  ref={ref}
  sideOffset={sideOffset}
  className={cn(
    [
      "z-50 rounded-none bg-popover-bg border border-popover-border px-3 py-1.5",
      "text-sm text-foreground shadow-sm",
      "animate-in fade-in-0 zoom-in-95",
      "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
      "data-[state=closed]:zoom-out-95",
      "motion-reduce:animate-none",
    ].join(" "),
    className,
  )}
  {...rest}
/>
```

Five token swaps:
- `rounded-lg` → `rounded-none`
- `bg-neutral-900 dark:bg-base-800` → `bg-popover-bg`
- Added: `border border-popover-border`
- `text-white` → `text-foreground`
- `shadow-brand-sm` → `shadow-sm`

`sideOffset` default of 6 and the animation classes are unchanged.

- [ ] **Step 3: Run tooltip tests**

```bash
npm run test -w packages/ds -- tooltip
```

Expected: pass. If any test asserts on `bg-neutral-900` or `text-white`, STOP and report — the assertion needs updating to a structural check.

- [ ] **Step 4: Commit**

```bash
git add packages/ds/src/components/tooltip/tooltip.tsx
git commit -m "feat(skin): Tooltip — popover token chassis (Decision #87)"
```

---

## Task 5: Card — semantic radius

**Files:**
- Modify: `packages/ds/src/components/card/card.tsx:5`

**Steps:**

- [ ] **Step 1: Baseline tests**

```bash
npm run test -w packages/ds -- card
```

Expected: tests pass.

- [ ] **Step 2: Replace `cardVariants` base radius**

Find:

```tsx
const cardVariants = cva("rounded-[2px]", {
```

Replace with:

```tsx
const cardVariants = cva("rounded-sm", {
```

This is a one-line change. `rounded-sm` resolves to `--radius-sm` which is `0` in the Abyssal tokens — **wait, verify before committing**. Re-check `tokens.css`:

```
--radius-sm: 0;
--radius-md: 0;
--radius-lg: 2px;
--radius-xl: 4px;
```

The 0/0/2/4 vocabulary maps `rounded-sm: 0`, `rounded-md: 0`, `rounded-lg: 2px`, `rounded-xl: 4px`. So `rounded-sm` would resolve to **0px**, NOT 2px. The Card title spec says "2px" but the token vocabulary names that step `rounded-lg`, not `rounded-sm`.

**Correct fix:** use `rounded-lg` (which resolves to 2px in the Abyssal radius scale).

Replace the cva call with:

```tsx
const cardVariants = cva("rounded-lg", {
```

The semantic class `rounded-lg` ≡ 2px under Abyssal tokens. (The spec's verbatim text "rounded-sm" was wrong; this implementation note corrects it.)

- [ ] **Step 3: Run card tests**

```bash
npm run test -w packages/ds -- card
```

Expected: pass.

- [ ] **Step 4: Commit**

```bash
git add packages/ds/src/components/card/card.tsx
git commit -m "feat(skin): Card — semantic radius (rounded-lg = 2px in Abyssal scale)"
```

---

## Task 6: Popover dropdowns — all four surfaces aligned

**Files:**
- Modify: `packages/ds/src/components/select/select.tsx:91-94, 109-110`
- Modify: `packages/ds/src/components/combobox/combobox.tsx:112-117, 148-149`
- Modify: `packages/ds/src/components/multi-select/multi-select.tsx:232-237, 276-277, 281-288`
- Modify: `packages/ds/src/components/tabs/tabs.tsx:226-232, 260`

**Steps:**

- [ ] **Step 1: Baseline tests**

```bash
npm run test -w packages/ds -- select combobox multi-select tabs
```

Expected: all pass. (Note current counts so we can confirm parity after.)

- [ ] **Step 2: Update Select dropdown**

In `packages/ds/src/components/select/select.tsx`:

Find Content className (around line 91–94):

```tsx
<SelectPrimitive.Content
  className={cn(
    "z-50 overflow-hidden rounded-none",
    "bg-surface border border-edge shadow-brand",
  )}
```

Replace with:

```tsx
<SelectPrimitive.Content
  className={cn(
    "z-50 overflow-hidden rounded-none",
    "bg-popover-bg border border-popover-border shadow",
  )}
```

Find Item disabled rules (around line 109–110):

```tsx
"data-[disabled]:opacity-50",
"data-[disabled]:pointer-events-none",
```

Replace with:

```tsx
"data-[disabled]:text-foreground/30",
"data-[disabled]:cursor-not-allowed",
```

- [ ] **Step 3: Update Combobox dropdown**

In `packages/ds/src/components/combobox/combobox.tsx`:

Find Content className (around line 112–117):

```tsx
<Popover.Content
  className={cn(
    "z-50 w-[var(--radix-popover-trigger-width)]",
    "overflow-hidden rounded-none",
    "bg-surface border border-edge shadow-brand",
  )}
```

Replace with:

```tsx
<Popover.Content
  className={cn(
    "z-50 w-[var(--radix-popover-trigger-width)]",
    "overflow-hidden rounded-none",
    "bg-popover-bg border border-popover-border shadow",
  )}
```

Find Item disabled rules (around line 148–149):

```tsx
"data-[selected=true]:bg-muted",
"data-[disabled=true]:opacity-50",
"data-[disabled=true]:pointer-events-none",
```

Replace with:

```tsx
"data-[selected=true]:bg-muted",
"data-[disabled=true]:text-foreground/30",
"data-[disabled=true]:cursor-not-allowed",
```

(Highlighted-on-selected rule unchanged; only disabled rules swap.)

- [ ] **Step 4: Update MultiSelect dropdown (content + items + inner indicator)**

In `packages/ds/src/components/multi-select/multi-select.tsx`:

**(a)** Find Content className (around line 232–237):

```tsx
<Popover.Content
  className={cn(
    "z-50 w-[var(--radix-popover-trigger-width)]",
    "overflow-hidden rounded-none",
    "bg-surface border border-edge shadow-brand",
  )}
```

Replace with:

```tsx
<Popover.Content
  className={cn(
    "z-50 w-[var(--radix-popover-trigger-width)]",
    "overflow-hidden rounded-none",
    "bg-popover-bg border border-popover-border shadow",
  )}
```

**(b)** Find Item disabled rules (around line 276–277):

```tsx
"data-[selected=true]:bg-muted",
"data-[disabled=true]:opacity-50",
"data-[disabled=true]:pointer-events-none",
```

Replace with:

```tsx
"data-[selected=true]:bg-muted",
"data-[disabled=true]:text-foreground/30",
"data-[disabled=true]:cursor-not-allowed",
```

**(c)** Find the inner indicator checkbox span (around line 281–288):

```tsx
<span
  className={cn(
    "flex size-4 shrink-0 items-center",
    "justify-center",
    "rounded border-2 transition-colors",
    selected
      ? "border-primary bg-primary text-primary-foreground"
      : "border-edge bg-surface",
  )}
  aria-hidden="true"
>
```

Replace with:

```tsx
<span
  className={cn(
    "flex size-4 shrink-0 items-center",
    "justify-center",
    "rounded-none border transition-colors",
    selected
      ? "border-accent bg-accent text-accent-foreground"
      : "border-edge bg-surface",
  )}
  aria-hidden="true"
>
```

Changes:
- `rounded` → `rounded-none` (per § 4 — 0px on this kind of indicator)
- `border-2` → `border` (1px hairline per § 4)
- `border-primary bg-primary text-primary-foreground` → `border-accent bg-accent text-accent-foreground` (active state = cyan, per the through-line)

This is the scope addition flagged in the plan preamble.

- [ ] **Step 5: Update Tabs overflow DropdownMenu**

In `packages/ds/src/components/tabs/tabs.tsx`:

Find DropdownMenu.Content className (around line 226–232):

```tsx
<DropdownMenu.Content
  className={cn(
    "z-50 min-w-[8rem]",
    "rounded-md bg-surface border border-edge shadow-brand",
    "p-1",
    "motion-reduce:transition-none",
  )}
```

Replace with:

```tsx
<DropdownMenu.Content
  className={cn(
    "z-50 min-w-[8rem]",
    "rounded-none bg-popover-bg border border-popover-border shadow",
    "p-1",
    "motion-reduce:transition-none",
  )}
```

(Three changes: `rounded-md` → `rounded-none`, surface tokens → popover tokens, `shadow-brand` → `shadow`.)

Find DropdownMenu.Item disabled rule (around line 260):

```tsx
"data-[disabled]:opacity-50 data-[disabled]:pointer-events-none",
```

Replace with:

```tsx
"data-[disabled]:text-foreground/30 data-[disabled]:cursor-not-allowed",
```

- [ ] **Step 6: Run tests for all four components**

```bash
npm run test -w packages/ds -- select combobox multi-select tabs
```

Expected: all pass with the same counts as Step 1. If any test asserts on old classnames (e.g., `border-primary`, `opacity-50`, `bg-surface` in a popover context, `shadow-brand`), STOP and report — flag the assertion and the proposed update.

- [ ] **Step 7: Commit**

```bash
git add packages/ds/src/components/select/select.tsx packages/ds/src/components/combobox/combobox.tsx packages/ds/src/components/multi-select/multi-select.tsx packages/ds/src/components/tabs/tabs.tsx
git commit -m "feat(skin): popover dropdowns — popover token, neutral shadow, disabled align"
```

---

## Task 7: Preview-app consumer migration

**Files:**
- Modify: `apps/preview/src/app/page.tsx:212, 218, 484`
- Modify: `apps/preview/src/components/sidebar.tsx:283`
- Modify: `apps/preview/src/app/foundations/effects/page.tsx:4-7`

**Steps:**

- [ ] **Step 1: Update `apps/preview/src/app/page.tsx` description strings + hover class**

In `apps/preview/src/app/page.tsx`:

Line 212 — find:

```tsx
{ label: "Input", href: "/components/input", description: "2 sizes, shadow-brand style" },
```

Replace with:

```tsx
{ label: "Input", href: "/components/input", description: "2 sizes, flat-slot chassis" },
```

Line 218 — find:

```tsx
{ label: "Textarea", href: "/components/textarea", description: "Vertical resize, shadow-brand" },
```

Replace with:

```tsx
{ label: "Textarea", href: "/components/textarea", description: "Vertical resize, flat-slot chassis" },
```

(Description copy is updated to reflect actual current Input/Textarea behavior post-chunk-3, not just to swap the literal token name.)

Line 484 — find:

```tsx
className="block rounded-lg border border-edge p-3
           hover:border-primary hover:shadow-brand-sm
           transition-all"
```

Replace with:

```tsx
className="block rounded-lg border border-edge p-3
           hover:border-accent hover:shadow-sm
           transition-all"
```

(Two changes: `hover:border-primary` → `hover:border-accent` because this is a hover-active state on a navigation card per § 2.1 of wave-1, and `shadow-brand-sm` → `shadow-sm` for the rename.)

- [ ] **Step 2: Update `apps/preview/src/components/sidebar.tsx` (line 283)**

Find:

```tsx
className={`absolute inset-y-0 left-0 w-80 bg-background border-r border-edge
            overflow-y-auto py-6 px-4 shadow-brand-lg
            transition-transform motion-reduce:transition-none ${
```

Replace with:

```tsx
className={`absolute inset-y-0 left-0 w-80 bg-background border-r border-edge
            overflow-y-auto py-6 px-4 shadow-lg
            transition-transform motion-reduce:transition-none ${
```

(Single rename: `shadow-brand-lg` → `shadow-lg`.)

- [ ] **Step 3: Update `apps/preview/src/app/foundations/effects/page.tsx` SHADOWS array**

Find the SHADOWS constant (around lines 4–7):

```tsx
const SHADOWS = [
  { name: "brand-sm", class: "shadow-brand-sm" },
  { name: "brand", class: "shadow-brand" },
  { name: "brand-lg", class: "shadow-brand-lg" },
] as const;
```

Replace with:

```tsx
const SHADOWS = [
  { name: "sm", class: "shadow-sm" },
  { name: "", class: "shadow" },
  { name: "lg", class: "shadow-lg" },
] as const;
```

(The `name` is the suffix users see in the preview labels. The middle entry's name is intentionally empty because `shadow` has no suffix in the new naming.)

- [ ] **Step 4: Build the preview to confirm token migration**

```bash
npm run build -w apps/preview
```

Expected: build succeeds. Tailwind 4's scanner picks up `shadow-sm` / `shadow` / `shadow-lg` from the new token names and from the migrated consumer call sites.

If the build fails with "unknown utility class shadow-brand-*", grep again for any missed call site:

```bash
rg "shadow-brand" --type ts --type tsx
```

Expected output: empty.

- [ ] **Step 5: Commit**

```bash
git add apps/preview/src/app/page.tsx apps/preview/src/components/sidebar.tsx apps/preview/src/app/foundations/effects/page.tsx
git commit -m "chore(preview): migrate shadow-brand-* consumers to renamed tokens"
```

---

## Task 8: Visual verification in preview app

**Files:**
- No file edits unless visual review surfaces a regression.

**Steps:**

- [ ] **Step 1: Start the dev server**

```bash
npm run dev
```

Expected: Turbopack starts on `http://localhost:3000` (or the next free port). Console shows no errors.

- [ ] **Step 2: Visit Dialog preview page in both themes**

Open `http://localhost:3000/components/dialog` in a browser. Toggle theme (top of the sidebar) between light and dark.

Verify in **both themes**:

| Aspect | Expected appearance |
|---|---|
| Top edge | 2px cyan rail (`--accent`) visible, with faint outer glow (cyan, ~8px) extending above the dialog |
| Surface | `bg-surface` (light: pale tinted white; dark: `#0d0d0d`); 4px radius |
| Drop shadow | Plain dark drop (no blue tint detectable against the overlay) |
| Close button at rest | dim foreground icon, no halo |
| Close button hover | foreground icon, no halo |
| Close button focused (tab to it) | 2px cyan outline 2px offset from the icon (Button focus pattern) |
| Overlay | `bg-black/60 backdrop-blur-sm` — neutral, unchanged from before |
| Title | Anybody Bold, dialog-tone (default `text-foreground`) |
| Locked dialog | rail still rendered, close button hidden, overlay-click + ESC don't close it |

**Specifically verify the compound shadow:** the cyan glow should be visible at the TOP edge of the dialog, fading outward. If the glow doesn't render (Tailwind scanner may miss the compound `shadow-[]` arbitrary value), fallback: split into a `border-t` glow via `filter: drop-shadow(0 0 8px rgba(0,225,250,0.5))` on the rail itself, or use inline `style` on DialogContent. Document the fallback choice and proceed.

- [ ] **Step 3: Visit Tooltip preview page in both themes**

`http://localhost:3000/components/tooltip`. Trigger tooltips on the demo items.

| State | Expected |
|---|---|
| Bubble background | `--surface` color (light: pale white; dark: `#0d0d0d`) |
| Bubble border | 1px `--edge` hairline |
| Bubble radius | 0px (square corners) |
| Text | `text-foreground` (high contrast in both modes) |
| Drop shadow | Subtle plain dark drop (`shadow-sm`) |
| Entry animation | fade-in + zoom-in-95 (unchanged) |

If the tooltip reads too quiet against Card surfaces (visual contrast), flag for post-implementation tuning of `--popover-bg`.

- [ ] **Step 4: Visit Select preview page in both themes**

`http://localhost:3000/components/select`. Open the dropdown.

| Aspect | Expected |
|---|---|
| Popover surface | `--popover-bg` (same as Tooltip) + 1px `--edge` border, 0px radius |
| Popover drop shadow | Plain dark drop (no blue tint) |
| Highlighted item (hover/arrow keys) | `bg-muted` background |
| Disabled item | `text-foreground/30` (visibly dimmed text), cursor changes to `not-allowed` on hover |

Compare against the Tooltip surface — they should look identical (both consume `--popover-bg`).

- [ ] **Step 5: Visit Combobox preview page in both themes**

`http://localhost:3000/components/combobox`. Open and search.

| Aspect | Expected |
|---|---|
| Popover surface | identical to Select |
| Search input | `border-b border-edge` separator from item list |
| Disabled item | `text-foreground/30`, `cursor-not-allowed` |

- [ ] **Step 6: Visit MultiSelect preview page in both themes**

`http://localhost:3000/components/multi-select`. Open, select items.

| Aspect | Expected |
|---|---|
| Popover surface | identical to Select/Combobox |
| Selected item inner indicator (checkbox) | Cyan fill + cyan border (`bg-accent border-accent`), 0px radius, 1px border |
| Unselected item inner indicator | `bg-surface border-edge`, 0px radius, 1px border |
| Disabled item | `text-foreground/30`, `cursor-not-allowed` |

**Specifically check the indicator on selected items** — it should be cyan (matching Checkbox/Radio's `bg-accent`). If it still shows as primary-blue, the chunk-6 update to lines 281–288 was missed.

- [ ] **Step 7: Visit Tabs preview page (overflow variant) in both themes**

`http://localhost:3000/components/tabs`. Find the "overflow / collapse" demo. Click the `…` overflow trigger.

| Aspect | Expected |
|---|---|
| DropdownMenu Content | `--popover-bg` + `--edge` border, **0px radius** (down from 4px), neutral drop shadow |
| Active hidden tab item in menu | `text-accent` |
| Disabled item | `text-foreground/30`, `cursor-not-allowed` |

- [ ] **Step 8: Visit Card preview page in both themes**

`http://localhost:3000/components/card`. Confirm 2px radius is unchanged (visual continuity from before).

- [ ] **Step 9: Visit Effects foundation page**

`http://localhost:3000/foundations/effects`. Confirm the SHADOWS grid renders the three neutral drops (no blue tint). Labels read "sm", "", "lg" (or equivalent text per the updated array).

- [ ] **Step 10: Stop the dev server**

`Ctrl+C` in the terminal running `npm run dev`.

---

## Task 9: Run full check suite

**Files:**
- No file edits.

**Steps:**

- [ ] **Step 1: Run aggregate check**

```bash
npm run check
```

Expected: lint + typecheck + tests all pass. No new oxlint findings; no tsc errors.

If tests fail because an assertion referenced a renamed token, STOP and report — propose the update.

---

## Task 10: Update docs

**Files:**
- Modify: `docs/SKIN-PRINCIPLES.md`
- Modify: `docs/DESIGN-SYSTEM.md`
- Modify: `docs/DECISIONS.md`
- Modify: `docs/BACKLOG.md`
- Modify: `CLAUDE.md`

**Steps:**

- [ ] **Step 1: Append two sub-sections to `docs/SKIN-PRINCIPLES.md` § 6**

Open `docs/SKIN-PRINCIPLES.md`. After the existing "Direction C — LED scales by role" sub-section (the one added by Decision #85), insert these two new sub-sections — keep both adjacent so the elevation/surface rules cluster:

```markdown
### Elevation is neutral
**Rule:** Drop shadows on floating surfaces (Dialog, Tooltip, popover dropdowns) use plain `rgba(0,0,0,X)` — never brand-tinted.
**Why:** The skin's brand color lives in foregrounds (LEDs, halos, active states), not in elevations. Blue-tinted shadows on every popover compete with Button's brand identity and read as "branded chrome" rather than "thing floating in space." Same principle that pushed cyan out of focus chrome on text inputs (Decision #84) — elevations get the same treatment.
**How:** `--shadow-sm / --shadow / --shadow-lg` tokens use neutral black at varying opacity + blur. Old `--shadow-brand-*` tokens are removed; consumers migrate to the renamed utilities.
**Source:** Decision #87.

### Cyan top-rail = live surface
**Rule:** Modal Dialog surfaces carry a 2px `--accent` top border with outer cyan glow as the surface-scale LED-as-signature. Popovers and Card do NOT get the rail.
**Why:** Dialog interrupts the user's flow with a "do this now" surface — the cyan rail reads as "this surface is listening." Popover dropdowns are auxiliary chrome, not interruptions, so they stay calm. Card is a passive container.
**How:** `border-t-2 border-t-accent` + `box-shadow: 0 0 8px rgba(0,225,250,0.5)` on the top edge of Dialog content. Same cyan, smaller dose than Button halo.
**Source:** Decision #87.
```

- [ ] **Step 2: Amend § 4 Geometry block**

In the same file, find the § 4 Geometry section (search for `## 4 ·` or `Hairline borders, never thick`). After the existing radius-vocabulary table or paragraph, append:

```markdown
### Surface radii by role

| Role | Tailwind class | Pixels | Components |
|---|---|---|---|
| Popovers | `rounded-none` | 0px | Tooltip, Select/Combobox/MultiSelect dropdowns, Tabs overflow DropdownMenu |
| Modals | `rounded-md` | 4px | Dialog |
| Cards | `rounded-lg` | 2px | Card |
| Round-by-design | `rounded-full` | — | StatusDot, Slider thumb, Switch thumb, ProgressBar tracks, MultiSelect tag chips, Stepper indicators, Tabs pill variant |

Tooltip is a popover, not a card — the radius reflects its role.
**Source:** Decision #87.
```

(Note the `rounded-lg = 2px` mapping is per the Abyssal radius scale defined in `tokens.css`; verify the scale numbers in case they shift in a future skin.)

- [ ] **Step 3: Refresh `docs/DESIGN-SYSTEM.md` entries**

In `docs/DESIGN-SYSTEM.md`, update these entries:

- **Card** — note radius is now `rounded-lg` (= 2px per Abyssal scale). Variants `default` / `ghost`, padding `sm/md/lg`, title prop unchanged.
- **Dialog** — replace any mention of `shadow-brand-lg` or the old close-button focus chrome. Describe: surface is `bg-surface` with 4px (`rounded-md`) radius, 2px `--accent` top-rail with outer cyan glow, neutral `--shadow-lg` drop. Close button focus is `outline-2 outline-accent outline-offset-2`. Overlay unchanged (`bg-black/60 backdrop-blur-sm`).
- **Tooltip** — describe the new popover-token chassis: `bg-popover-bg border border-popover-border rounded-none text-foreground shadow-sm`. Animation unchanged. (Remove any reference to `bg-neutral-900` / `text-white` / `rounded-lg`.)
- **Select** — popover Content is now `bg-popover-bg border border-popover-border shadow rounded-none`. Disabled items use `text-foreground/30 cursor-not-allowed`.
- **Combobox** — same updates as Select.
- **MultiSelect** — same Content updates as Select. Inner selected-item indicator is now `border-accent bg-accent text-accent-foreground` (cyan, no longer brand-blue).
- **Tabs** — overflow DropdownMenu now matches the popover token; was `rounded-md bg-surface ... shadow-brand`, now `rounded-none bg-popover-bg ... shadow`.

If a new "Popover surface token" subsection in DESIGN-SYSTEM makes sense (the existing Tokens / Theming section may be the right place), add:

```markdown
### Popover surface tokens

Floating-surface chrome uses two tokens:

| Token | Resolves to | Used by |
|---|---|---|
| `--popover-bg` | `var(--surface)` | Tooltip, Select/Combobox/MultiSelect dropdowns, Tabs overflow DropdownMenu |
| `--popover-border` | `var(--edge)` | same |

These map to Tailwind utilities `bg-popover-bg` and `border-popover-border`. Consumers should not reach for `bg-surface` + `border-edge` on popover surfaces — use the popover tokens so retheming the popover identity flows through one place.
```

- [ ] **Step 4: Add Decision #87 to `docs/DECISIONS.md`**

Open `docs/DECISIONS.md`. Insert at the top of the decisions list (just after Decision #86 — chunk 5 — entry, or at the very top if chunk 5 hasn't merged yet). Pattern follows Decision #85.

```markdown
## Decision #87 — 2026-05-27

**Context:** After chunks 1–5 land, the only remaining brand-color leak in the DS is in elevations and floating surfaces: every popover, the Tooltip, and the Dialog ship with `--shadow-brand-*` (blue-tinted at `oklch(0.27 0.180 264 / X)`); Tooltip is still on its pre-Abyssal `bg-neutral-900 dark:bg-base-800 rounded-lg text-white shadow-brand-sm` chassis; the popover surface is defined as a three-class incantation (`bg-surface border border-edge shadow-brand`) duplicated across Select, Combobox, MultiSelect, and the Tabs overflow DropdownMenu; the four dropdowns' items still use the legacy `data-[disabled]:opacity-50 data-[disabled]:pointer-events-none` block; Dialog has no skin identity beyond a flat surface; the MultiSelect inner indicator checkbox renders selected items in `border-primary bg-primary` (the same brand-color-as-active leak the wave has been removing). The wave-1 spec framed chunk 6 as "Card + Dialog + Tooltip mostly audit"; the user's "do it whole" directive expanded scope to include every popover surface and the MultiSelect inner indicator.
**Decision:** Apply container-surface chassis updates across seven surfaces. **Token migration:** rename `--shadow-brand-sm / brand / brand-lg` → `--shadow-sm / shadow / shadow-lg` and neutralize all three to plain `rgba(0,0,0,X)` (same-hex rule extends naturally). Introduce `--popover-bg` (resolves to `--surface`) and `--popover-border` (resolves to `--edge`) tokens in Layer 2 and bridge through `--color-popover-bg / popover-border` in Layer 3 so Tailwind utilities `bg-popover-bg` / `border-popover-border` are available. **Dialog:** add a 2px `--accent` top-rail (`border-t-2 border-t-accent`) with outer cyan glow (`shadow-[0_24px_60px_rgba(0,0,0,0.65),0_0_8px_rgba(0,225,250,0.5)]`); change close-button focus from `ring-2 ring-primary-400 ring-offset-2` to the Button outline pattern `outline-2 outline-accent outline-offset-2`; switch the content radius from arbitrary `rounded-[4px]` to semantic `rounded-md`. **Tooltip:** full reskin from `bg-neutral-900 dark:bg-base-800 rounded-lg text-white shadow-brand-sm` to `bg-popover-bg border border-popover-border rounded-none text-foreground shadow-sm`. **Select / Combobox / MultiSelect / Tabs overflow DropdownMenu:** popover Content all swap to `bg-popover-bg border border-popover-border shadow`; item disabled rules swap from `opacity-50 pointer-events-none` to `text-foreground/30 cursor-not-allowed`; Tabs DropdownMenu radius `rounded-md` → `rounded-none` (the only popover that wasn't already 0px). **MultiSelect inner indicator:** `border-primary bg-primary text-primary-foreground` → `border-accent bg-accent text-accent-foreground`, plus `border-2` → `border` and `rounded` → `rounded-none`. **Card:** `rounded-[2px]` → `rounded-lg` (semantic — the Abyssal scale maps `rounded-lg = 2px`). **Preview-app migration:** three files referenced the renamed tokens; updated inline as part of the same PR (sidebar.tsx, page.tsx, foundations/effects/page.tsx). SKIN-PRINCIPLES § 6 gains two new sub-sections ("Elevation is neutral" and "Cyan top-rail = live surface"); § 4 Geometry gains a Surface radii by role table.
**Rationale:** Each piece. **Neutral shadows** — blue-tinted ambient shadows on every popover are exactly the role-leak the wave has been removing in foregrounds (the active-state recolor, the LED-as-signature reservation, the focus-chrome migration); fixing it in elevations completes the cleanup. Plain `rgba(0,0,0,X)` is the same-hex rule's natural extension to depth — black is black in both modes, no per-mode override. **Popover token over scattered classes** — four components each shipping `bg-surface border border-edge` as inline strings is the kind of token drift that bites later; one source of truth, one re-theme point. The token resolves through existing semantics (`--surface`, `--edge`) so no new visual decisions are encoded, just one less seam. **Dialog cyan top-rail over alternatives** — three directions were considered: A (flat surface, no signature), B (cyan rail), C (instrument header bevel under DialogTitle). A leaves Dialog without skin identity; C breaks dialogs without titles (Alert-style modals) and the bevel-everywhere risks heavy. B uses the existing LED-as-signature vocabulary at surface scale, adds zero geometry weight, works for every Dialog regardless of structure. The rail is reserved for modals because modals interrupt the user's flow — "this surface is listening" is the right reading for interrupters, wrong for popovers and Card. **Tooltip matches popover token (not inverted high-contrast)** — tokenization wins over a one-off "transient indicator" rule. If a transient-indicator personality is needed later, the token can shift; one-off rules for one component multiply maintenance burden. **MultiSelect inner indicator brought to accent** — scope addition the spec didn't anticipate. The fix is structurally identical to chunk 4's Checkbox treatment (1px border, no fill, cyan when checked); leaving it on `border-primary bg-primary` would create an obvious skin inconsistency immediately visible to anyone using MultiSelect with selected items. Including it is honest "do it whole" — not scope creep.
**Alternatives considered:** Keep blue-tinted shadows, just rename (rejected — leaves brand color in elevations). Eliminate shadows entirely, hairlines only (rejected — popovers need depth separation against body content; the hairline alone reads as "stuck" not "floating"). Tooltip as inverted high-contrast dark bubble in both modes (rejected — one-off vocabulary for one component vs tokenized consistency). Dialog identity through bevel header bar (rejected — breaks dialogs without titles, bevel weight risks heavy). Defer MultiSelect inner indicator fix to chunk 7 (rejected — chunk 6 already touches MultiSelect; the indicator is in the immediate visual neighborhood). Keep Card title typography in scope (rejected — Decision #83 already covers heading roles, Card title qualifies as a section heading and stays Anybody Bold). Tabs DropdownMenu kept at `rounded-md` (rejected — spec discovered this radius was the only popover not at 0px; fixing in chunk 6 closes the inconsistency). Add a CSS variable for popover radius (`--popover-radius: 0`) (rejected — radius is one inline class per use site, not enough scatter to justify a token).

---
```

- [ ] **Step 5: Move backlog entry to Completed**

Open `docs/BACKLOG.md`. In the `Completed / Rejected` section's `<details><summary>Archived items</summary>` block, add:

```markdown
- [x] 2026-05-27 — Chunk 6 container surfaces (Decision #87: shadow tokens neutralized, popover token introduced, Tooltip + 4 popover dropdowns aligned, Dialog cyan top-rail signature, MultiSelect inner indicator → accent, Card radius semantic; SKIN-PRINCIPLES § 6 gains "Elevation is neutral" + "Cyan top-rail = live surface", § 4 Geometry gains surface-radii-by-role table)
```

If a chunk-6 entry exists in Open Items, remove it.

- [ ] **Step 6: Update `CLAUDE.md` Current Features**

Open `CLAUDE.md`. Find the entries for Card, Dialog, Tooltip, Select, Combobox, MultiSelect, Tabs and update:

- **Card** — append: "; radius `rounded-lg` (2px per Abyssal scale)"
- **Dialog** — replace any reference to `shadow-brand-lg` and the old close focus. New summary: "composable 8-part API, 2px `--accent` cyan top-rail signature with outer cyan glow + neutral `--shadow-lg` drop, frosted overlay (`backdrop-blur-sm`) on neutral `bg-black/60` dim, 4px (`rounded-md`) content radius, close-button focus uses Button outline pattern (`outline-2 outline-accent outline-offset-2`), entry/exit animations (fade + zoom), `locked` prop, focus trap"
- **Tooltip** — replace summary with: "composable API (Provider, Root, Trigger, Content), popover-token chassis (`bg-popover-bg border border-popover-border rounded-none text-foreground shadow-sm`), fade-in + zoom-in-95 entry animation"
- **Select** / **Combobox** / **MultiSelect** — append to each: "; popover Content uses popover token (`bg-popover-bg border border-popover-border shadow`), disabled items use flat-sink (`text-foreground/30 cursor-not-allowed`)"
- **MultiSelect** — additionally append: "; selected-item inner indicator is `bg-accent border-accent` (cyan, no longer brand-blue), 1px hairline"
- **Tabs** — note that overflow DropdownMenu uses the popover token (0px radius, neutral shadow) and items use the disabled flat-sink pattern

- [ ] **Step 7: Run final check after docs edits**

```bash
npm run check
```

Expected: clean.

- [ ] **Step 8: Commit docs**

```bash
git add docs/SKIN-PRINCIPLES.md docs/DESIGN-SYSTEM.md docs/DECISIONS.md docs/BACKLOG.md CLAUDE.md
git commit -m "docs(skin): chunk 6 container surfaces (Decision #87)"
```

---

## Task 11: Push branch and open PR into `skin/paraplu`

**Files:**
- No file edits.

**Steps:**

- [ ] **Step 1: Push the chunk branch**

```bash
git push -u origin skin/container-surfaces
```

Expected: branch is published; GitHub returns a PR-create URL in the output.

- [ ] **Step 2: Open the PR targeting `skin/paraplu`**

```bash
gh pr create --base skin/paraplu --title "feat(skin): container surfaces — Card · Dialog · Tooltip · popovers (Decision #87)" --body "$(cat <<'EOF'
## Summary

Locks the chunk-6 container-surface chassis across seven surfaces:

- **Shadow tokens** renamed + neutralized: `--shadow-brand-sm / brand / brand-lg` → `--shadow-sm / shadow / shadow-lg`, blue tint dropped, plain `rgba(0,0,0,X)` at three elevations.
- **Popover surface tokenized**: new `--popover-bg` + `--popover-border` resolve through `--surface` / `--edge`. Tailwind utilities `bg-popover-bg` and `border-popover-border` are now the source of truth for popover chassis (Tooltip + Select/Combobox/MultiSelect/Tabs overflow DropdownMenu).
- **Tooltip** fully reskinned from `bg-neutral-900 dark:bg-base-800 rounded-lg text-white shadow-brand-sm` to the popover token.
- **Dialog** earns a cyan top-rail signature (`border-t-2 border-t-accent` + outer cyan glow), neutral `shadow-lg` drop, close-button focus aligned to Button pattern, content radius semantic (`rounded-md`).
- **Four popover dropdowns** aligned to popover token; item disabled rules swapped from `opacity-50 pointer-events-none` to `text-foreground/30 cursor-not-allowed`; Tabs DropdownMenu radius fixed (`rounded-md` → `rounded-none`).
- **MultiSelect inner indicator** brought to accent (`border-primary bg-primary` → `border-accent bg-accent`, plus 1px hairline + 0px radius). Scope addition to keep the component whole.
- **Card** radius semantic (`rounded-[2px]` → `rounded-lg` = 2px per Abyssal scale).
- **Preview-app consumers** of `shadow-brand-*` migrated inline (sidebar.tsx, page.tsx, foundations/effects/page.tsx).

SKIN-PRINCIPLES § 6 gains "Elevation is neutral" + "Cyan top-rail = live surface"; § 4 Geometry gains a Surface radii by role table. Logged as Decision #87.

Spec: `docs/superpowers/specs/2026-05-27-chunk-6-container-surfaces-design.md`
Plan: `docs/superpowers/plans/2026-05-27-chunk-6-container-surfaces.md`

This is chunk 6 of the wave-1 skin sweep. Chunk 7 (data-display chrome) follows as a separate PR.

## Test plan

- [x] `npm run check` passes locally (lint + typecheck + tests)
- [ ] Visual review in `/components/dialog`, `/components/tooltip`, `/components/select`, `/components/combobox`, `/components/multi-select`, `/components/tabs`, `/components/card`, `/foundations/effects` — both themes, all states
- [ ] Specifically verify Dialog cyan top-rail + outer glow renders in both modes
- [ ] Specifically verify Tooltip is identical to popover surface (no token drift)
- [ ] Specifically verify MultiSelect inner indicator is cyan (no primary-blue leak)
- [ ] Specifically verify Tabs overflow DropdownMenu radius is 0px
- [ ] Specifically verify no `shadow-brand-*` references remain (`rg "shadow-brand"` returns empty)
EOF
)"
```

Expected: PR is created with the integration branch (`skin/paraplu`) as the base, branch URL is printed.

- [ ] **Step 3: Verify PR base is correct**

```bash
gh pr view --json baseRefName --jq .baseRefName
```

Expected: `skin/paraplu` (NOT `main`).

- [ ] **Step 4: Wait for review / fix any feedback / merge**

When approved, squash-merge the chunk into `skin/paraplu` and delete the branch:

```bash
gh pr merge <pr-number> --squash --delete-branch
```

- [ ] **Step 5: Sync integration branch worktree**

```bash
git checkout skin/paraplu
git pull --ff-only origin skin/paraplu
git branch -D skin/container-surfaces
```

Expected: local `skin/paraplu` advances by one squashed commit; chunk branch is removed locally.
