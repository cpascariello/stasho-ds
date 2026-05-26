# Text-Input Chassis Reset Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the inherited Aleph-Cloud-era chassis on Input, Textarea, Select trigger, Combobox trigger, and MultiSelect trigger with a flat-slot chassis (per-mode resting fill + 1px hairline edge), and fix FormField's two `text-error-600` references to the canonical `text-error` token.

**Architecture:** Mechanical Tailwind class swaps in the existing CVA configurations of 5 components plus inline class fixes in FormField. No new tokens, no architectural changes, no shared chassis file (project convention is inline CVA). Each component gets one focused commit; docs get a single commit at the end. SKIN-PRINCIPLES.md gains a new "Flat slot for typed input" sub-section under § 6.

**Tech Stack:** React 19, Tailwind CSS 4 (with `@custom-variant dark`), CVA (class-variance-authority), Radix UI primitives, cmdk, Vitest, oxlint, TypeScript.

**Spec:** `docs/superpowers/specs/2026-05-27-text-inputs-reset-design.md`

**Integration branch:** `skin/paraplu`. This chunk lives on a short-lived branch off `skin/paraplu`, PRs into `skin/paraplu`, and squash-merges. It does NOT target main.

---

## Shared chassis class block (reference — to be inlined per component)

This is the new resting+focus+disabled chassis. Variants per component are noted below the block.

```ts
[
  "w-full font-sans text-foreground",
  "bg-background dark:bg-surface",
  "border border-edge rounded-none",
  "placeholder:text-muted-foreground",
  "focus-visible:outline-none",
  "focus-visible:border-accent-700 dark:focus-visible:border-accent",
  "disabled:bg-muted dark:disabled:bg-background",
  "disabled:border-edge/50",
  "disabled:text-foreground/30",
  "disabled:placeholder:text-muted-foreground/50",
  "disabled:cursor-not-allowed",
  "transition-colors",
].join(" ")
```

**Per-component variations:**
- `Input`, `Textarea`: use the block as-is. Textarea adds `resize-y` after `transition-colors`.
- `Select`, `Combobox`: add `inline-flex items-center justify-between` at the top and `hover:border-edge-hover` (one step brighter than `--edge`) before `transition-colors`.
- `MultiSelect`: substitute `disabled:` selectors with `aria-disabled:` selectors (the trigger is a `<div role="button">`, not a native disabled control). Add `inline-flex items-center gap-1.5` at the top and `hover:aria-disabled:border-edge hover:border-edge-hover` (hover brightens only when not disabled).

**Error prop override** (all 5 components, on the wrapper `cn()` call): replace `error && "border-3 border-error-400 hover:border-error-500"` with `error && "border-error hover:border-error focus-visible:border-error dark:focus-visible:border-error"`. The 1px width from the base block stays; only the color overrides via `tailwind-merge`. The explicit `hover:`/`focus-visible:` overrides ensure error wins over the hover-brighten cue (Select/Combobox/MultiSelect) and the focus cyan border (all 5) per spec ("Error wins — fault has priority over focus location"). Input/Textarea don't have a `hover:` base rule but the `hover:border-error` is harmless there.

**Sizes:** unchanged. `sm` and `md` size variants keep their current `py-*`, `px-*`, `text-*`, `min-h-*` values.

---

## File map

| File | What changes | Owner |
|---|---|---|
| `packages/ds/src/components/input/input.tsx` | CVA base block (lines 5–14), error override (line 41) | Task 2 |
| `packages/ds/src/components/textarea/textarea.tsx` | CVA base block (lines 5–14), error override (line 44) | Task 3 |
| `packages/ds/src/components/select/select.tsx` | `triggerVariants` base (lines 7–18), error override (line 73) | Task 4 |
| `packages/ds/src/components/combobox/combobox.tsx` | `triggerVariants` base (lines 8–17), error override (line 85) | Task 5 |
| `packages/ds/src/components/multi-select/multi-select.tsx` | `triggerVariants` base (lines 8–17), error override (line 140) | Task 6 |
| `packages/ds/src/components/form-field/form-field.tsx` | `text-error-600` → `text-error` (lines 50, 57) | Task 7 |
| `docs/SKIN-PRINCIPLES.md` | Append "Flat slot for typed input" sub-section under § 6 Component patterns | Task 10 |
| `docs/DESIGN-SYSTEM.md` | Refresh entries for Input, Textarea, Select, Combobox, MultiSelect, FormField | Task 10 |
| `docs/ARCHITECTURE.md` | Note the shared chassis convention if absent | Task 10 |
| `docs/DECISIONS.md` | New Decision #84 entry | Task 10 |
| `docs/BACKLOG.md` | Move "Text-input chassis reset" to Completed | Task 10 |
| `CLAUDE.md` | Update Current Features entries for Input, Textarea, Select, Combobox, MultiSelect, FormField | Task 10 |

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

Expected: `skin/paraplu`. Working tree should have no staged changes from prior tasks. Untracked files in `.superpowers/brainstorm/` are fine.

- [ ] **Step 2: Sync `skin/paraplu` from origin**

```bash
git pull --ff-only origin skin/paraplu
```

Expected: `Already up to date` OR a fast-forward with no merge commits.

- [ ] **Step 3: Create chunk branch**

```bash
git checkout -b skin/text-inputs-reset
```

Expected: `Switched to a new branch 'skin/text-inputs-reset'`.

---

## Task 2: Input chassis update

**Files:**
- Modify: `packages/ds/src/components/input/input.tsx:5-14, 41`

**Steps:**

- [ ] **Step 1: Run existing Input tests as baseline**

```bash
cd /Users/dio/Library/CloudStorage/Dropbox/Claudio/repos/stasho-ds/.claude/worktrees/skin+paraplu
npm run test -w packages/ds -- input.test
```

Expected: all 7 tests in `input.test.tsx` pass. (We want a clean baseline before changing chassis.)

- [ ] **Step 2: Replace `inputVariants` base block in `input.tsx`**

Open `packages/ds/src/components/input/input.tsx`. Find lines 5–14:

```tsx
const inputVariants = cva(
  [
    "w-full font-sans text-foreground bg-primary-100 dark:bg-base-700",
    "border-0 rounded-none",
    "placeholder:text-muted-foreground",
    "focus-visible:outline-none focus-visible:ring-3",
    "focus-visible:ring-primary-500",
    "disabled:opacity-50 disabled:pointer-events-none",
    "ring-0 transition-colors",
  ].join(" "),
```

Replace with:

```tsx
const inputVariants = cva(
  [
    "w-full font-sans text-foreground",
    "bg-background dark:bg-surface",
    "border border-edge rounded-none",
    "placeholder:text-muted-foreground",
    "focus-visible:outline-none",
    "focus-visible:border-accent-700 dark:focus-visible:border-accent",
    "disabled:bg-muted dark:disabled:bg-background",
    "disabled:border-edge/50",
    "disabled:text-foreground/30",
    "disabled:placeholder:text-muted-foreground/50",
    "disabled:cursor-not-allowed",
    "transition-colors",
  ].join(" "),
```

- [ ] **Step 3: Replace error override class on the `cn()` call**

In `input.tsx`, find around line 41:

```tsx
error && "border-3 border-error-400 hover:border-error-500",
```

Replace with:

```tsx
error &&
  "border-error hover:border-error focus-visible:border-error dark:focus-visible:border-error",
```

(The `hover:border-error` is harmless on Input since the base has no `hover:` rule. The `focus-visible:` overrides ensure error wins over the cyan focus border — fault has priority over focus location.)

- [ ] **Step 4: Run Input tests, confirm pass**

```bash
npm run test -w packages/ds -- input.test
```

Expected: all 7 tests pass. The chassis change is class-only; behavioral assertions (renders, ref forwarding, aria-invalid, disabled attribute) are unaffected.

- [ ] **Step 5: Commit**

```bash
git add packages/ds/src/components/input/input.tsx
git commit -m "feat(skin): Input — flat-slot chassis"
```

---

## Task 3: Textarea chassis update

**Files:**
- Modify: `packages/ds/src/components/textarea/textarea.tsx:5-14, 44`

**Steps:**

- [ ] **Step 1: Run existing Textarea tests as baseline**

```bash
npm run test -w packages/ds -- textarea.test
```

Expected: all existing tests pass.

- [ ] **Step 2: Replace `textareaVariants` base block in `textarea.tsx`**

Open `packages/ds/src/components/textarea/textarea.tsx`. Find lines 5–14:

```tsx
const textareaVariants = cva(
  [
    "w-full font-sans text-foreground bg-primary-100 dark:bg-base-700",
    "border-0 rounded-none",
    "placeholder:text-muted-foreground",
    "focus-visible:outline-none focus-visible:ring-3",
    "focus-visible:ring-primary-500",
    "disabled:opacity-50 disabled:pointer-events-none",
    "ring-0 resize-y transition-colors",
  ].join(" "),
```

Replace with:

```tsx
const textareaVariants = cva(
  [
    "w-full font-sans text-foreground",
    "bg-background dark:bg-surface",
    "border border-edge rounded-none",
    "placeholder:text-muted-foreground",
    "focus-visible:outline-none",
    "focus-visible:border-accent-700 dark:focus-visible:border-accent",
    "disabled:bg-muted dark:disabled:bg-background",
    "disabled:border-edge/50",
    "disabled:text-foreground/30",
    "disabled:placeholder:text-muted-foreground/50",
    "disabled:cursor-not-allowed",
    "resize-y transition-colors",
  ].join(" "),
```

(Note `resize-y` is preserved — that was the only Textarea-specific addition over the shared block.)

- [ ] **Step 3: Replace error override class**

Find around line 44:

```tsx
error && "border-3 border-error-400 hover:border-error-500",
```

Replace with:

```tsx
error &&
  "border-error hover:border-error focus-visible:border-error dark:focus-visible:border-error",
```

- [ ] **Step 4: Run Textarea tests, confirm pass**

```bash
npm run test -w packages/ds -- textarea.test
```

Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add packages/ds/src/components/textarea/textarea.tsx
git commit -m "feat(skin): Textarea — flat-slot chassis"
```

---

## Task 4: Select trigger chassis update

**Files:**
- Modify: `packages/ds/src/components/select/select.tsx:7-18, 73`

**Steps:**

- [ ] **Step 1: Run existing Select tests as baseline**

```bash
npm run test -w packages/ds -- select.test
```

Expected: all existing tests pass.

- [ ] **Step 2: Replace `triggerVariants` base block in `select.tsx`**

Open `packages/ds/src/components/select/select.tsx`. Find lines 7–18:

```tsx
const triggerVariants = cva(
  [
    "inline-flex items-center justify-between",
    "w-full font-sans text-foreground bg-primary-100 dark:bg-base-700",
    "border-0 rounded-none",
    "focus-visible:outline-none focus-visible:ring-3",
    "focus-visible:ring-primary-500",
    "disabled:opacity-50 disabled:pointer-events-none",
    "ring-0 transition-colors",
    "data-[placeholder]:text-muted-foreground",
  ].join(" "),
```

Replace with:

```tsx
const triggerVariants = cva(
  [
    "inline-flex items-center justify-between",
    "w-full font-sans text-foreground",
    "bg-background dark:bg-surface",
    "border border-edge rounded-none",
    "hover:border-edge-hover",
    "focus-visible:outline-none",
    "focus-visible:border-accent-700 dark:focus-visible:border-accent",
    "disabled:bg-muted dark:disabled:bg-background",
    "disabled:border-edge/50",
    "disabled:text-foreground/30",
    "disabled:cursor-not-allowed",
    "transition-colors",
    "data-[placeholder]:text-muted-foreground",
  ].join(" "),
```

(Note: `hover:border-edge-hover` added — the "this opens a menu" cue for dropdown triggers. The `data-[placeholder]:text-muted-foreground` Radix class is preserved.)

- [ ] **Step 3: Replace error override class**

Find around line 73:

```tsx
error && "border-3 border-error-400 hover:border-error-500",
```

Replace with:

```tsx
error &&
  "border-error hover:border-error focus-visible:border-error dark:focus-visible:border-error",
```

(The `hover:border-error` keeps error red on hover instead of switching to `--edge-hover` — error has priority over the menu-hover cue. The `focus-visible:` overrides ensure error also wins over the cyan focus border.)

- [ ] **Step 4: Run Select tests, confirm pass**

```bash
npm run test -w packages/ds -- select.test
```

Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add packages/ds/src/components/select/select.tsx
git commit -m "feat(skin): Select — flat-slot chassis + hover cue"
```

---

## Task 5: Combobox trigger chassis update

**Files:**
- Modify: `packages/ds/src/components/combobox/combobox.tsx:8-17, 85`

**Steps:**

- [ ] **Step 1: Run existing Combobox tests as baseline**

```bash
npm run test -w packages/ds -- combobox.test
```

Expected: all existing tests pass.

- [ ] **Step 2: Replace `triggerVariants` base block in `combobox.tsx`**

Open `packages/ds/src/components/combobox/combobox.tsx`. Find lines 8–17:

```tsx
const triggerVariants = cva(
  [
    "inline-flex items-center justify-between",
    "w-full font-sans text-foreground bg-primary-100 dark:bg-base-700",
    "border-0 rounded-none",
    "focus-visible:outline-none focus-visible:ring-3",
    "focus-visible:ring-primary-500",
    "disabled:opacity-50 disabled:pointer-events-none",
    "ring-0 transition-colors",
  ].join(" "),
```

Replace with:

```tsx
const triggerVariants = cva(
  [
    "inline-flex items-center justify-between",
    "w-full font-sans text-foreground",
    "bg-background dark:bg-surface",
    "border border-edge rounded-none",
    "hover:border-edge-hover",
    "focus-visible:outline-none",
    "focus-visible:border-accent-700 dark:focus-visible:border-accent",
    "disabled:bg-muted dark:disabled:bg-background",
    "disabled:border-edge/50",
    "disabled:text-foreground/30",
    "disabled:cursor-not-allowed",
    "transition-colors",
  ].join(" "),
```

- [ ] **Step 3: Replace error override class**

Find around line 85:

```tsx
error && "border-3 border-error-400 hover:border-error-500",
```

Replace with:

```tsx
error &&
  "border-error hover:border-error focus-visible:border-error dark:focus-visible:border-error",
```

- [ ] **Step 4: Run Combobox tests, confirm pass**

```bash
npm run test -w packages/ds -- combobox.test
```

Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add packages/ds/src/components/combobox/combobox.tsx
git commit -m "feat(skin): Combobox — flat-slot chassis + hover cue"
```

---

## Task 6: MultiSelect trigger chassis update

**Files:**
- Modify: `packages/ds/src/components/multi-select/multi-select.tsx:8-17, 140`

**Steps:**

- [ ] **Step 1: Run existing MultiSelect tests as baseline**

```bash
npm run test -w packages/ds -- multi-select.test
```

Expected: all existing tests pass.

- [ ] **Step 2: Replace `triggerVariants` base block in `multi-select.tsx`**

Open `packages/ds/src/components/multi-select/multi-select.tsx`. Find lines 8–17:

```tsx
const triggerVariants = cva(
  [
    "inline-flex items-center gap-1.5",
    "w-full font-sans text-foreground bg-primary-100 dark:bg-base-700",
    "border-0 rounded-none",
    "focus-visible:outline-none focus-visible:ring-3",
    "focus-visible:ring-primary-500",
    "aria-disabled:opacity-50 aria-disabled:pointer-events-none",
    "ring-0 transition-colors",
  ].join(" "),
```

Replace with:

```tsx
const triggerVariants = cva(
  [
    "inline-flex items-center gap-1.5",
    "w-full font-sans text-foreground",
    "bg-background dark:bg-surface",
    "border border-edge rounded-none",
    "hover:border-edge-hover",
    "focus-visible:outline-none",
    "focus-visible:border-accent-700 dark:focus-visible:border-accent",
    "aria-disabled:bg-muted dark:aria-disabled:bg-background",
    "aria-disabled:border-edge/50",
    "aria-disabled:text-foreground/30",
    "aria-disabled:cursor-not-allowed",
    "transition-colors",
  ].join(" "),
```

(Note: `aria-disabled:` selectors throughout because the trigger is a `<div role="button">`, not a native disabled control. Tag chip styling at lines 31–47 is unchanged — `bg-muted` is already correct.)

- [ ] **Step 3: Replace error override class**

Find around line 140:

```tsx
error &&
  "border-3 border-error-400 hover:border-error-500",
```

Replace with:

```tsx
error &&
  "border-error hover:border-error focus-visible:border-error dark:focus-visible:border-error",
```

- [ ] **Step 4: Run MultiSelect tests, confirm pass**

```bash
npm run test -w packages/ds -- multi-select.test
```

Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add packages/ds/src/components/multi-select/multi-select.tsx
git commit -m "feat(skin): MultiSelect — flat-slot chassis + hover cue"
```

---

## Task 7: FormField token fixes

**Files:**
- Modify: `packages/ds/src/components/form-field/form-field.tsx:50, 57`

**Steps:**

- [ ] **Step 1: Run existing FormField tests as baseline**

```bash
npm run test -w packages/ds -- form-field.test
```

Expected: all existing tests pass.

- [ ] **Step 2: Replace `text-error-600` on the required asterisk**

Open `packages/ds/src/components/form-field/form-field.tsx`. Find around line 50:

```tsx
<span className="text-error-600 ml-0.5" aria-hidden="true">
  *
</span>
```

Replace with:

```tsx
<span className="text-error ml-0.5" aria-hidden="true">
  *
</span>
```

- [ ] **Step 3: Replace `text-error-600` on the error helper paragraph**

Find around line 57:

```tsx
<p id={messageId} role="alert" className="text-xs text-error-600">
  {error}
</p>
```

Replace with:

```tsx
<p id={messageId} role="alert" className="text-xs text-error">
  {error}
</p>
```

- [ ] **Step 4: Run FormField tests, confirm pass**

```bash
npm run test -w packages/ds -- form-field.test
```

Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add packages/ds/src/components/form-field/form-field.tsx
git commit -m "feat(skin): FormField — text-error-600 → text-error"
```

---

## Task 8: Run full check suite

**Files:**
- No file edits.

**Steps:**

- [ ] **Step 1: Run full DS test suite**

```bash
npm run test -w packages/ds
```

Expected: all DS tests pass (Input, Textarea, Select, Combobox, MultiSelect, FormField, plus all other components).

- [ ] **Step 2: Run lint**

```bash
npm run lint
```

Expected: clean. No new oxlint findings.

- [ ] **Step 3: Run typecheck**

```bash
npm run typecheck
```

Expected: clean. No new tsc errors.

- [ ] **Step 4: Run aggregate check command**

```bash
npm run check
```

Expected: lint + typecheck + test all pass.

---

## Task 9: Visual verification in preview app

**Files:**
- No file edits unless a preview page hard-codes stale chassis classes (rare — preview pages mostly compose DS components).

**Steps:**

- [ ] **Step 1: Start the dev server**

```bash
npm run dev
```

Expected: Turbopack starts on `http://localhost:3000` (or the next free port). Console shows no errors.

- [ ] **Step 2: Visit Input preview page in both themes**

Open `http://localhost:3000/components/input` in a browser. Use the theme switcher (top of the sidebar) to toggle between light and dark.

Verify in **both themes**, for **both `sm` and `md` sizes**:

| State | Expected appearance |
|---|---|
| Resting | Flat chassis (light: near-white; dark: surface tone), 1px `--edge` hairline |
| Focus | Hairline turns cyan (light: `--accent-700` darker cyan; dark: `--accent` bright cyan); no halo, caret stays foreground |
| Filled with value | Value text in `--foreground` color; placeholder gone |
| Error | Hairline turns blood-orange `--error`; value text stays foreground |
| Disabled (empty) | Chassis sinks one step (light: `--muted` grey; dark: `--background` deep); hairline at half alpha; placeholder dim |
| Disabled (with value) | Same chassis sink; value text at 30% opacity; cursor `not-allowed` on hover |

If any state looks off, return to the relevant task and adjust the class string.

- [ ] **Step 3: Visit Textarea preview page in both themes**

`http://localhost:3000/components/textarea`. Same state checklist as Input. Also verify `resize-y` corner handle is visible at the bottom-right.

- [ ] **Step 4: Visit Select preview page in both themes**

`http://localhost:3000/components/select`. Same state checklist plus:

| Extra state | Expected appearance |
|---|---|
| Hover (cursor over trigger, menu closed) | Hairline brightens to `--edge-hover` |
| Open menu | Popover renders with `--surface` background, `--edge` border, `shadow-brand` |
| Item highlight (keyboard arrow / mouse hover) | Item gets `bg-muted` highlight (unchanged from today) |

- [ ] **Step 5: Visit Combobox preview page in both themes**

`http://localhost:3000/components/combobox`. Same checklist as Select, plus verify the search input inside the popover still renders correctly (it uses `border-edge bg-transparent` — unchanged).

- [ ] **Step 6: Visit MultiSelect preview page in both themes**

`http://localhost:3000/components/multi-select`. Same checklist as Combobox, plus verify:
- Tag chips render as `bg-muted` `rounded-full` pills (unchanged styling)
- Tag dismiss `×` and clear-all `×` still work
- Disabled state (driven by `aria-disabled`, not native `disabled`) shows the new flat-sunk chassis

- [ ] **Step 7: Visit FormField preview page in both themes**

`http://localhost:3000/components/form-field`. Verify:
- Required asterisk is `--error` blood-orange (not the old `error-600` scale step)
- Error message helper text is `--error` blood-orange
- Helper text (no error) stays muted foreground

- [ ] **Step 8: Dense-form sanity check**

Build (or visit, if already present) a form page with 5+ stacked Inputs inside FormField wrappers. Confirm the stack reads calm — no halo bloom on focus, hairlines frame each slot, focus transition between fields feels controlled rather than busy.

If the preview app doesn't have such a page, the FormField preview's existing demos are sufficient — the relevant question is "tab through them and feel the cadence."

- [ ] **Step 9: Stop the dev server**

`Ctrl+C` in the terminal running `npm run dev`.

---

## Task 10: Update docs

**Files:**
- Modify: `docs/SKIN-PRINCIPLES.md`
- Modify: `docs/DESIGN-SYSTEM.md`
- Modify: `docs/ARCHITECTURE.md`
- Modify: `docs/DECISIONS.md`
- Modify: `docs/BACKLOG.md`
- Modify: `CLAUDE.md`

**Steps:**

- [ ] **Step 1: Append the "Flat slot for typed input" sub-section to SKIN-PRINCIPLES.md**

Open `docs/SKIN-PRINCIPLES.md`. Find the end of `§ 6 · Component patterns` (just before `## 7 · Adding to these principles`). Insert the following new sub-section before `---`:

```markdown
### Flat slot for typed input
**Rule:** Text-entry controls (Input, Textarea, Select trigger, Combobox trigger, MultiSelect trigger) use a flat fill (`--background` in light, `--surface` in dark) with a 1px `--edge` hairline border. No bevel, no chassis gradient — they're the inverse of Button: a slot, not a switch.
**Why:** The instrument-panel metaphor has Button as depth and Input as plane — Button's bevel and LED carry the "switch you press" reading, Input is the "slot you put data into" defined by its hairline. Bevels on inputs would double the visual weight on dense forms and compete with Button's bevel for the eye's "this is interactive hardware" signal.
**How:** Resting chassis = `--background` (light) / `--surface` (dark). Focus = hairline swaps to `--accent` (or `--accent-700` in light for AA). Error = hairline swaps to `--error` + helper text in `--error`, value stays foreground. Disabled = chassis sinks one step (light → `--muted`, dark → `--background`) + value drops to 30% opacity + hairline drops to half-`--edge` alpha. Hover = none for text inputs; hairline brightens to `--edge-hover` for dropdown triggers (Select / Combobox / MultiSelect). No halo at rest, on focus, or on error.
**Source:** Decision #84.
```

- [ ] **Step 2: Refresh DESIGN-SYSTEM.md component entries**

Open `docs/DESIGN-SYSTEM.md`. For each of Input, Textarea, Select, Combobox, MultiSelect, FormField, locate the entry and update any descriptions that reference:
- `bg-primary-100` / `bg-base-700` chassis → "flat-slot chassis (`--background` light / `--surface` dark) with 1px `--edge` hairline"
- "borderless flat fill" → "1px hairline-bordered flat fill"
- `ring-3 ring-primary-500` focus → "cyan hairline focus (`--accent` dark, `--accent-700` light)"
- `border-3 border-error-400` error → "1px `--error` border + helper text in `--error`"
- `opacity-50` disabled → "chassis sinks one step on surface ladder, value at 30% opacity, cursor `not-allowed`"

Add a one-line note under Select/Combobox/MultiSelect: "hover brightens the hairline to `--edge-hover` (dropdown trigger affordance)."

Update FormField: required asterisk and error helper now use the `--error` semantic token (not the `error-600` scale step).

If specific examples (props tables, code snippets) reference the old class names verbatim, keep them as illustrative rather than rewriting wholesale — but the prose descriptions of behavior should match the new chassis.

- [ ] **Step 3: ARCHITECTURE.md note (optional)**

Open `docs/ARCHITECTURE.md`. If there's an existing section describing form-control CVA conventions, add or update the paragraph to note that text-input chassis class strings are intentionally duplicated across 5 components (no shared file) per Decision #84. If no such section exists, no addition is required — the convention is visible in source.

- [ ] **Step 4: Add Decision #84 to DECISIONS.md**

Open `docs/DECISIONS.md`. Insert at the top of the decisions list (just after the "How Decisions Are Logged" preamble), pushing existing decisions down:

```markdown
## Decision #84 — 2026-05-27

**Context:** Five trigger surfaces (Input, Textarea, Select, Combobox, MultiSelect) shared the pre-Abyssal chassis `bg-primary-100 dark:bg-base-700 border-0 rounded-none focus-visible:ring-3 focus-visible:ring-primary-500 disabled:opacity-50` (plus a shared error rail `border-3 border-error-400`). After the skin change (Decisions #77–#79, #82), this block violated the skin in five distinct ways: `primary-100` is now pale electric blue (wrong fill), `base-700` is popover-elevation tone (inconsistent), focus ring is `ring-primary` (cyan is the moving signal per SKIN-PRINCIPLES § Motion), `border-3` violates "1px hairlines, never thick" (§ Geometry), and `disabled:opacity-50` reads "faded" not "semantically broken" (Decision #82 established Disabled flattens). FormField additionally referenced the now-non-canonical `text-error-600` scale step on its required asterisk and error helper text.
**Decision:** Adopt a single "flat slot" chassis for all five trigger surfaces, with calm-by-default state: resting fill `bg-background` (light) / `bg-surface` (dark), 1px `border-edge` hairline; hover unchanged for Input/Textarea, `border-edge-hover` for Select/Combobox/MultiSelect (dropdown trigger cue); focus = hairline swaps to `border-accent-700` light / `border-accent` dark; error = hairline swaps to `border-error` (same hex both modes) + FormField helper text in `text-error`, value stays `text-foreground`; disabled = chassis sinks one step on surface ladder (`bg-muted` light, `bg-background` dark), hairline drops to `border-edge/50`, value to `text-foreground/30`, placeholder to `text-muted-foreground/50`, cursor to `not-allowed` (replaces `pointer-events-none`). MultiSelect uses `aria-disabled:` variants because its trigger is a `<div role="button">`. FormField asterisk + error helper switch from `text-error-600` to `text-error`. Sizes (`sm`, `md`) unchanged. Caret stays foreground (no LED extension to inputs in this chunk). No new tokens. Add "Flat slot for typed input" sub-section to SKIN-PRINCIPLES § 6.
**Rationale:** Each piece. **Flat slot over recessed bevel** (visual front-runner during brainstorming) — dense forms with 5+ stacked inputs would double the depth budget against Button's bevel reading; reserving depth for Button keeps the "switch vs slot" hierarchy clean. **Calm-by-default** (no halos on focus, hover, error) — Button's hover halo extending to input focus would bloom 6 halos when tabbing through a form; halo budget stays with Button. **Caret stays foreground, not cyan** — the LED-as-signature pattern was the strongest "extend the skin" option but lost to the consistent restraint pattern across the brainstorm (chassis B over A, focus A over B/C, error A over B). **Same-hex error border but `accent-700` focus border in light** — cyan at L=0.84 fails AA on white, so the existing Button-Outline carve-out (Decision #82) extends to input focus chrome. **Disabled sinks one step in both modes with asymmetric tokens** — surface ladder is inverted between modes; light has `--background` (white) → `--muted` (grey), dark has `--surface` (`#0d0d0d`) → `--background` (`#07080a`). Initial proposal mirrored Button's `bg-muted` flatten in dark mode, but `--muted` in dark sits ABOVE `--surface`, making the disabled input float up rather than recede. Caught during visual review and corrected. **`disabled:cursor-not-allowed` replaces `disabled:pointer-events-none`** — pointer-events-none blocks the cursor change from showing on hover; the native `<input disabled>` attribute already prevents interaction. **Sizes stay sm/md** — chunk is chassis, not geometry; `sm` is dense-form-friendly, no `xs` because tighter typography breaks down. **FormField switches to semantic `--error` token** — decoupling from scale steps protects against future palette work; the cloneElement aria-wiring stays unchanged.
**Alternatives considered:** Recessed-bevel chassis (rejected — doubled depth budget on dense forms, competed with Button's bevel reading). Keep borderless current chassis with tokens fixed (rejected — "borderless" doesn't frame the slot; without a hairline the input bleeds into light-mode cards). `caret-color: var(--accent)` to make the blinking cursor the LED (rejected — calm-by-default pattern across brainstorm chose restraint, but the option is reversible later if the system feels tonally empty). Cyan focus halo (rejected — halo bloom on tab-through). Blood-orange error halo (rejected — alarmist on a form with multiple errors). 2px bottom rail for error (rejected — broke hairline consistency, required SKIN-PRINCIPLES carve-out). Value text turns red on error (rejected — visual jitter as user types the fix character-by-character; convention across Material/Stripe/Linear is to keep value readable). `opacity-50` disabled (rejected — reads "loading" not "broken"). `bg-muted` disabled in dark mode (rejected — floats up rather than recedes; corrected to `bg-background`). Hover hairline brighten on Input/Textarea (rejected — pure text inputs have the I-beam as their affordance; chassis hover noise in dense forms is the same problem as halos). Shared chassis class file (rejected — project convention is inline CVA per component; duplication is small).
```

- [ ] **Step 5: Move backlog entry to Completed**

Open `docs/BACKLOG.md`. In the `Completed / Rejected` section's `<details><summary>Archived items</summary>` block, add a new completed entry near the top of the list:

```markdown
- [x] 2026-05-27 — Text-input chassis reset (Decision #84: flat-slot chassis for Input/Textarea/Select/Combobox/MultiSelect — `bg-background dark:bg-surface` + 1px `border-edge`, cyan hairline focus, `border-error` error rail, chassis sinks one step on disabled; FormField switched from `text-error-600` to semantic `text-error`)
```

If there's an open backlog item for this work, remove it from `Open Items`.

- [ ] **Step 6: Update CLAUDE.md Current Features**

Open `CLAUDE.md`. Find the Current Features list. Locate the entries for Input, Textarea, Select, Combobox, MultiSelect, FormField (search by name). Update each entry to reflect the new chassis:

- Input: replace any "borderless flat fill" wording with "flat-slot chassis (1px `--edge` hairline on `--background`/`--surface` fill), cyan hairline focus, `--error` border on error, chassis sinks one step on disabled"
- Textarea: same as Input, retain "vertical resize" note
- Select: append "hover hairline brightens to `--edge-hover` (dropdown trigger cue)" to the chassis description
- Combobox: append the same hover note
- MultiSelect: append the same hover note + retain existing tag overflow/clear-all behavior; note that disabled uses `aria-disabled` variants (the trigger is a `<div role="button">`)
- FormField: append "uses semantic `--error` token for required asterisk + error message helper (was `error-600` scale step)"

Edit phrasing for fit — the goal is the Current Features list accurately reflects user-visible behavior post-chunk.

- [ ] **Step 7: Run final check after docs edits**

```bash
npm run check
```

Expected: clean. (Docs changes shouldn't affect this, but verifying once more before commit.)

- [ ] **Step 8: Commit docs**

```bash
git add docs/SKIN-PRINCIPLES.md docs/DESIGN-SYSTEM.md docs/ARCHITECTURE.md docs/DECISIONS.md docs/BACKLOG.md CLAUDE.md
git commit -m "docs(skin): text-input chassis reset (Decision #84)"
```

If `docs/ARCHITECTURE.md` was not edited (the optional step), drop it from the `git add`.

---

## Task 11: Push branch and open PR into `skin/paraplu`

**Files:**
- No file edits.

**Steps:**

- [ ] **Step 1: Push the chunk branch**

```bash
git push -u origin skin/text-inputs-reset
```

Expected: branch is published; GitHub returns a PR-create URL in the output.

- [ ] **Step 2: Open the PR targeting `skin/paraplu`**

```bash
gh pr create --base skin/paraplu --title "feat(skin): text-input chassis reset across 6 components" --body "$(cat <<'EOF'
## Summary

- Replaces inherited Aleph-Cloud chassis (`bg-primary-100 dark:bg-base-700`, `ring-primary` focus, `border-3` error, `opacity-50` disabled) on Input, Textarea, Select trigger, Combobox trigger, MultiSelect trigger
- New chassis: flat fill at `--background` (light) / `--surface` (dark), 1px `--edge` hairline; cyan hairline focus; `--error` border on error; chassis sinks one step on disabled
- Select/Combobox/MultiSelect get `hover:border-edge-hover` as the dropdown-trigger affordance cue
- FormField required asterisk + error helper switch from `text-error-600` to semantic `text-error`
- Adds "Flat slot for typed input" pattern to SKIN-PRINCIPLES § 6
- Logged as Decision #84

Spec: `docs/superpowers/specs/2026-05-27-text-inputs-reset-design.md`
Plan: `docs/superpowers/plans/2026-05-27-text-inputs-reset.md`

## Test plan

- [x] `npm run check` passes locally (lint + typecheck + tests)
- [ ] Visual review in `/components/input`, `/components/textarea`, `/components/select`, `/components/combobox`, `/components/multi-select`, `/components/form-field` — both themes, both sizes, all states (rest / focus / error / disabled / error+focused / disabled+filled)
- [ ] Dense-form smoke (tab through 5+ stacked inputs) — confirm no halo bloom, calm cadence
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

When approved, squash-merge the chunk into `skin/paraplu` and delete the local + remote branch:

```bash
gh pr merge <pr-number> --squash --delete-branch
```

- [ ] **Step 5: Sync integration branch worktree**

```bash
git checkout skin/paraplu
git pull --ff-only origin skin/paraplu
git branch -D skin/text-inputs-reset
```

Expected: local `skin/paraplu` advances by one squashed commit; chunk branch is removed.
