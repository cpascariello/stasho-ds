# Chunk 4 — Boolean / range chassis reset Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace pre-Abyssal chrome on Checkbox, RadioGroup, Switch, and Slider with the new chassis defined in `docs/superpowers/specs/2026-05-27-wave1-design.md` §§ 2 + 4. Switch and Slider gain bevel chassis and cyan thumb-glow on hover/focus per Direction C; Checkbox and Radio flatten to 1px hairlines with cyan fill on checked (no glow); all four lose `border-3`, `ring-3 ring-primary-500`, and `opacity-50` disabled treatment.

**Architecture:** Mechanical CVA class-string swaps inside each component's existing `cva()` call, plus inline class fixes on the wrapper `cn()` calls (for `error` overrides). No new tokens, no new files, no shared chassis file (project convention is inline CVA per component — see Decision #84). Each component is one focused commit; docs land in one final commit.

**Tech Stack:** React 19, Tailwind CSS 4 (with `@custom-variant dark`), CVA (class-variance-authority), Radix UI primitives, Vitest, oxlint, TypeScript.

**Spec:** `docs/superpowers/specs/2026-05-27-wave1-design.md`

**Integration branch:** `skin/paraplu`. This chunk lives on a short-lived branch off `skin/paraplu`, PRs into `skin/paraplu`, and squash-merges. It does NOT target main.

---

## File map

| File | What changes | Owner |
|---|---|---|
| `packages/ds/src/components/checkbox/checkbox.tsx` | `checkboxVariants` base block (lines 6–17), error override (line 47), check glyph color (lines 56, 67) | Task 2 |
| `packages/ds/src/components/radio-group/radio-group.tsx` | `radioItemVariants` base block (lines 6–16), indicator dot color (line 73) | Task 3 |
| `packages/ds/src/components/switch/switch.tsx` | `switchVariants` base block (lines 6–17), `thumbVariants` base block (lines 32–37) | Task 4 |
| `packages/ds/src/components/slider/slider.tsx` | `trackVariants` base block (lines 6–10), `thumbVariants` base block (lines 24–31), error treatment (line 97), disabled treatment (line 83), range fill (line 100), tooltip background (line 111) | Task 5 |
| `docs/SKIN-PRINCIPLES.md` | Append "Direction C — LED scales by role" sub-rule under § 6 | Task 8 |
| `docs/DESIGN-SYSTEM.md` | Refresh Checkbox, RadioGroup, Switch, Slider entries | Task 8 |
| `docs/DECISIONS.md` | New Decision #85 entry | Task 8 |
| `docs/BACKLOG.md` | Move chunk-4 backlog item to Completed | Task 8 |
| `CLAUDE.md` | Update Current Features for Checkbox, RadioGroup, Switch, Slider | Task 8 |

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

Expected: `skin/paraplu`. Working tree should have no staged changes. Untracked files in `.superpowers/brainstorm/` are fine (gitignored).

- [ ] **Step 2: Sync `skin/paraplu` from origin**

```bash
git pull --ff-only origin skin/paraplu
```

Expected: `Already up to date` OR a fast-forward with no merge commits.

- [ ] **Step 3: Create chunk branch**

```bash
git checkout -b skin/boolean-range-reset
```

Expected: `Switched to a new branch 'skin/boolean-range-reset'`.

---

## Task 2: Checkbox chassis update

**Files:**
- Modify: `packages/ds/src/components/checkbox/checkbox.tsx:6-17, 47, 56, 67`

**Steps:**

- [ ] **Step 1: Run existing Checkbox tests as baseline**

```bash
cd /Users/dio/Library/CloudStorage/Dropbox/Claudio/repos/stasho-ds/.claude/worktrees/skin+paraplu
npm run test -w packages/ds -- checkbox.test
```

Expected: all existing tests in `checkbox.test.tsx` pass. (Clean baseline before changing chassis.)

- [ ] **Step 2: Replace `checkboxVariants` base block**

Open `packages/ds/src/components/checkbox/checkbox.tsx`. Find lines 6–17:

```tsx
const checkboxVariants = cva(
  [
    "peer shrink-0 bg-surface",
    "border-3 border-edge",
    "hover:border-edge-hover",
    "focus-visible:outline-none focus-visible:ring-3",
    "focus-visible:ring-primary-500",
    "disabled:opacity-50 disabled:pointer-events-none",
    "data-[state=checked]:bg-primary data-[state=checked]:border-primary",
    "data-[state=checked]:text-primary-foreground",
    "transition-colors",
  ].join(" "),
```

Replace with:

```tsx
const checkboxVariants = cva(
  [
    "peer shrink-0 bg-transparent",
    "border border-edge",
    "hover:border-edge-hover",
    "focus-visible:outline-none",
    "focus-visible:border-accent-700 dark:focus-visible:border-accent",
    "disabled:bg-muted dark:disabled:bg-background",
    "disabled:border-edge/50",
    "disabled:text-foreground/30",
    "disabled:cursor-not-allowed",
    "data-[state=checked]:bg-accent data-[state=checked]:border-accent",
    "data-[state=checked]:text-neutral-950",
    "transition-colors",
  ].join(" "),
```

Key changes:
- `bg-surface` → `bg-transparent` (unchecked is transparent; checked fill is cyan via `data-[state=checked]:bg-accent`)
- `border-3` → `border` (1px hairline per § 4)
- `focus-visible:ring-3 focus-visible:ring-primary-500` → `focus-visible:border-accent-700 dark:focus-visible:border-accent` (cyan hairline focus, swaps in place of edge border)
- `disabled:opacity-50 disabled:pointer-events-none` → flat-sink chassis + `cursor-not-allowed` (matches Decision #84)
- `data-[state=checked]:bg-primary` → `data-[state=checked]:bg-accent` (cyan checked fill per § 3.1)
- `data-[state=checked]:text-primary-foreground` → `data-[state=checked]:text-neutral-950` (dark check glyph on cyan in both modes per spec § 4.1)

- [ ] **Step 3: Replace error override class**

Find around line 47:

```tsx
error && "border-3 border-error-400 hover:border-error-500",
```

Replace with:

```tsx
error &&
  "border-error hover:border-error focus-visible:border-error dark:focus-visible:border-error",
```

- [ ] **Step 4: Run Checkbox tests, confirm pass**

```bash
npm run test -w packages/ds -- checkbox.test
```

Expected: all tests pass. The chassis change is class-only; behavioral assertions (renders, ref forwarding, aria-invalid, checked toggle, indicator render) are unaffected.

- [ ] **Step 5: Commit**

```bash
git add packages/ds/src/components/checkbox/checkbox.tsx
git commit -m "feat(skin): Checkbox — flat-hairline chassis, cyan checked fill"
```

---

## Task 3: RadioGroup chassis update

**Files:**
- Modify: `packages/ds/src/components/radio-group/radio-group.tsx:6-16, 73`

**Steps:**

- [ ] **Step 1: Run existing RadioGroup tests as baseline**

```bash
npm run test -w packages/ds -- radio-group.test
```

Expected: all existing tests pass.

- [ ] **Step 2: Replace `radioItemVariants` base block**

Open `packages/ds/src/components/radio-group/radio-group.tsx`. Find lines 6–16:

```tsx
const radioItemVariants = cva(
  [
    "peer shrink-0 rounded-full bg-surface",
    "border-3 border-edge",
    "hover:border-edge-hover",
    "focus-visible:outline-none focus-visible:ring-3",
    "focus-visible:ring-primary-500",
    "disabled:opacity-50 disabled:pointer-events-none",
    "data-[state=checked]:border-primary",
    "transition-colors",
  ].join(" "),
```

Replace with:

```tsx
const radioItemVariants = cva(
  [
    "peer shrink-0 rounded-full bg-transparent",
    "border border-edge",
    "hover:border-edge-hover",
    "focus-visible:outline-none",
    "focus-visible:border-accent-700 dark:focus-visible:border-accent",
    "disabled:bg-muted dark:disabled:bg-background",
    "disabled:border-edge/50",
    "disabled:cursor-not-allowed",
    "data-[state=checked]:border-accent",
    "transition-colors",
  ].join(" "),
```

Key changes match Checkbox:
- `bg-surface` → `bg-transparent`
- `border-3` → `border`
- `ring-3 ring-primary-500` focus → cyan hairline border focus
- `opacity-50 pointer-events-none` disabled → flat-sink + cursor-not-allowed
- `data-[state=checked]:border-primary` → `data-[state=checked]:border-accent`

- [ ] **Step 3: Replace indicator dot color**

Find around line 73:

```tsx
<span className="block size-[80%] rounded-full bg-primary" />
```

Replace with:

```tsx
<span className="block size-[80%] rounded-full bg-accent peer-disabled:bg-foreground/30" />
```

Note: `peer-disabled:bg-foreground/30` cascades when the parent `RadioGroupPrimitive.Item` is disabled, dimming the indicator dot to neutral. Verify the `peer` class on the Item exists (it does — line 7 of the new variants block has `peer`).

**Implementation note:** Radix renders the Indicator inside the Item, not adjacent to it, so `peer-disabled:` may not match. If the test in Step 4 confirms the dot doesn't dim, fallback: add `disabled:[&_span]:bg-foreground/30` to the variants block instead. Test will catch it.

- [ ] **Step 4: Run RadioGroup tests, confirm pass**

```bash
npm run test -w packages/ds -- radio-group.test
```

Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add packages/ds/src/components/radio-group/radio-group.tsx
git commit -m "feat(skin): RadioGroup — flat-hairline chassis, cyan dot"
```

---

## Task 4: Switch chassis + bevel + thumb glow

**Files:**
- Modify: `packages/ds/src/components/switch/switch.tsx:6-17, 32-37`

**Steps:**

- [ ] **Step 1: Run existing Switch tests as baseline**

```bash
npm run test -w packages/ds -- switch.test
```

Expected: all existing tests pass.

- [ ] **Step 2: Replace `switchVariants` base block (track)**

Open `packages/ds/src/components/switch/switch.tsx`. Find lines 6–17:

```tsx
const switchVariants = cva(
  [
    "peer inline-flex shrink-0 cursor-pointer",
    "items-center rounded-full",
    "border-3 border-edge bg-muted",
    "hover:border-edge-hover",
    "focus-visible:outline-none focus-visible:ring-3",
    "focus-visible:ring-primary-500",
    "disabled:opacity-50 disabled:pointer-events-none",
    "data-[state=checked]:bg-primary data-[state=checked]:border-primary",
    "transition-colors",
  ].join(" "),
```

Replace with:

```tsx
const switchVariants = cva(
  [
    "peer inline-flex shrink-0 cursor-pointer",
    "items-center rounded-full",
    "border border-edge bg-muted dark:bg-neutral-900",
    "shadow-[inset_0_1px_0_rgba(255,255,255,0.06),inset_0_-1px_0_rgba(0,0,0,0.4)]",
    "focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2",
    "focus-visible:outline-none focus-visible:[outline-style:solid]",
    "disabled:bg-muted dark:disabled:bg-background",
    "disabled:border-edge/50 disabled:shadow-none",
    "disabled:cursor-not-allowed",
    "data-[state=checked]:border-accent/30",
    "transition-colors",
  ].join(" "),
```

Key changes:
- `border-3` → `border` (1px hairline per § 4)
- Added bevel shadow (`shadow-[inset_0_1px_0...]`) per § 5 ("Switches use bevel") and spec § 4.3 matrix
- `bg-muted` → `bg-muted dark:bg-neutral-900` (explicit per-mode)
- `focus-visible:ring-3 focus-visible:ring-primary-500` → `outline-2 outline-accent outline-offset-2` (Button focus pattern, matches spec § 4.3)
- Note: keeping `focus-visible:outline-none` AND `focus-visible:[outline-style:solid]` is intentional — the first is overridden by the second once outline-2 applies; without it Tailwind's default outline interferes. **Implementation note:** simpler: drop both lines, use only `focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2`. Test in Step 5; the simpler version usually works.
- `hover:border-edge-hover` removed — the bevel does the visual cue; hover behavior moves to the thumb (see Step 3)
- `disabled:opacity-50 disabled:pointer-events-none` → flat-sink with `disabled:shadow-none` (kill the bevel on disabled) + `cursor-not-allowed`
- `data-[state=checked]:bg-primary data-[state=checked]:border-primary` → `data-[state=checked]:border-accent/30` (track stays muted color; only the border tints cyan to hint "on")

- [ ] **Step 3: Replace `thumbVariants` base block**

Find lines 32–37:

```tsx
const thumbVariants = cva(
  [
    "pointer-events-none block rounded-full bg-white",
    "shadow-sm transition-transform motion-reduce:transition-none",
    "data-[state=unchecked]:translate-x-0.5",
  ].join(" "),
```

Replace with:

```tsx
const thumbVariants = cva(
  [
    "pointer-events-none block rounded-full",
    "bg-edge data-[state=checked]:bg-accent",
    "transition-all motion-reduce:transition-none",
    "data-[state=unchecked]:translate-x-0.5",
    "group-hover/sw:data-[state=checked]:shadow-[0_0_5px_var(--accent),0_0_10px_rgba(0,225,250,0.6)]",
    "group-focus-visible/sw:data-[state=checked]:shadow-[0_0_5px_var(--accent),0_0_10px_rgba(0,225,250,0.6)]",
    "group-disabled/sw:bg-foreground/30 group-disabled/sw:shadow-none",
  ].join(" "),
```

Key changes:
- `bg-white` → `bg-edge data-[state=checked]:bg-accent` (neutral when off, cyan when on per Q1)
- `shadow-sm` dropped — the thumb itself is a small disc, drop shadow doesn't fit the bevel-on-track aesthetic
- `transition-transform` → `transition-all` (so shadow transitions on hover work smoothly)
- Added two hover/focus rules that apply the cyan glow only when checked (Q1 decision: glow on hover/focus, solid at rest)
- Added disabled rule to flatten thumb to neutral foreground/30

**Note on `group-hover/sw:` syntax:** This requires the parent `<SwitchPrimitive.Root>` to carry the `group/sw` class. Step 4 adds that.

- [ ] **Step 4: Add `group/sw` to SwitchPrimitive.Root className composition**

Find around line 63:

```tsx
<SwitchPrimitive.Root
  ref={ref}
  className={cn(switchVariants({ size }), className)}
  {...rest}
>
```

Replace with:

```tsx
<SwitchPrimitive.Root
  ref={ref}
  className={cn("group/sw", switchVariants({ size }), className)}
  {...rest}
>
```

The `group/sw` named group lets the thumb's `group-hover/sw:` and `group-focus-visible/sw:` selectors match without colliding with any consumer's own `group` usage.

- [ ] **Step 5: Run Switch tests, confirm pass**

```bash
npm run test -w packages/ds -- switch.test
```

Expected: all tests pass. If a test asserts on the exact class string ("bg-white"), update the assertion to match the new structural class (e.g., assert that the thumb is present and toggled by `data-state`, not its background color).

If the simpler `focus-visible:outline-2 outline-accent outline-offset-2` from Step 2's implementation note isn't working visually (Task 7), revisit the focus chrome.

- [ ] **Step 6: Commit**

```bash
git add packages/ds/src/components/switch/switch.tsx
git commit -m "feat(skin): Switch — bevel chassis, cyan thumb with hover-glow"
```

---

## Task 5: Slider chassis + bevel + thumb glow + error treatment

**Files:**
- Modify: `packages/ds/src/components/slider/slider.tsx:6-10, 24-31, 83, 97, 100, 111`

**Steps:**

- [ ] **Step 1: Run existing Slider tests as baseline**

```bash
npm run test -w packages/ds -- slider.test
```

Expected: all existing tests pass.

- [ ] **Step 2: Replace `trackVariants` base block**

Open `packages/ds/src/components/slider/slider.tsx`. Find lines 6–10:

```tsx
const trackVariants = cva(
  [
    "relative w-full grow overflow-hidden rounded-full",
    "bg-neutral-200 dark:bg-base-700",
  ].join(" "),
```

Replace with:

```tsx
const trackVariants = cva(
  [
    "relative w-full grow overflow-hidden rounded-full",
    "bg-muted dark:bg-neutral-900",
    "shadow-[inset_0_1px_0_rgba(255,255,255,0.06),inset_0_-1px_0_rgba(0,0,0,0.4)]",
  ].join(" "),
```

Key changes:
- `bg-neutral-200 dark:bg-base-700` → `bg-muted dark:bg-neutral-900` (align with surface ladder + Switch track)
- Added bevel shadow (per § 5 + spec § 4.4)

- [ ] **Step 3: Replace `thumbVariants` base block**

Find lines 24–31:

```tsx
const thumbVariants = cva(
  [
    "block rounded-full bg-white",
    "border-2 border-primary-500",
    "focus-visible:outline-none focus-visible:ring-3",
    "focus-visible:ring-primary-500",
    "disabled:pointer-events-none",
  ].join(" "),
```

Replace with:

```tsx
const thumbVariants = cva(
  [
    "block rounded-full bg-accent",
    "border border-accent",
    "transition-shadow motion-reduce:transition-none",
    "hover:shadow-[0_0_6px_var(--accent),0_0_12px_rgba(0,225,250,0.5)]",
    "focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2",
    "focus-visible:shadow-[0_0_6px_var(--accent),0_0_12px_rgba(0,225,250,0.5)]",
    "disabled:bg-foreground/30 disabled:border-foreground/30",
    "disabled:shadow-none disabled:cursor-not-allowed",
  ].join(" "),
```

Key changes:
- `bg-white` → `bg-accent` (cyan thumb per Direction C)
- `border-2 border-primary-500` → `border border-accent` (1px hairline outline against the cyan range)
- `focus-visible:ring-3 focus-visible:ring-primary-500` → `outline-2 outline-accent outline-offset-2` (Button focus pattern)
- Added hover glow (per Q1 — glow on hover/focus only, solid at rest)
- Added disabled flatten

- [ ] **Step 4: Replace range fill color (line 100)**

Find:

```tsx
<SliderPrimitive.Range className="absolute h-full bg-primary-500 rounded-full" />
```

Replace with:

```tsx
<SliderPrimitive.Range className="absolute h-full bg-accent rounded-full" />
```

- [ ] **Step 5: Replace error treatment (line 97)**

Find around lines 94–98:

```tsx
<SliderPrimitive.Track
  className={cn(
    trackVariants({ size }),
    error && "ring-2 ring-error-400",
  )}
>
```

Replace with:

```tsx
<SliderPrimitive.Track className={cn(trackVariants({ size }))}>
```

(Drop the track-level error treatment entirely.) Then update the thumb instantiation around line 105 to apply error to the thumb:

```tsx
{displayValue.map((val, i) => (
  <SliderPrimitive.Thumb
    key={i}
    className={cn(
      thumbVariants({ size }),
      "relative",
      error && "border-error hover:shadow-[0_0_6px_var(--error),0_0_12px_rgba(255,61,0,0.5)] focus-visible:shadow-[0_0_6px_var(--error),0_0_12px_rgba(255,61,0,0.5)] focus-visible:outline-error",
    )}
  >
```

Key changes:
- Error moves from track ring to thumb border (the track is only 4–8px tall; a 1px error border barely renders — the thumb is the focal element)
- Error border swaps cyan → blood-orange
- Hover/focus glow under error swaps cyan glow → orange glow
- Focus outline under error also swaps to `outline-error` so the focus ring matches the error chassis

- [ ] **Step 6: Replace disabled treatment on the Root (line 83)**

Find:

```tsx
className={cn(
  "relative flex w-full touch-none select-none items-center",
  disabled && "opacity-50 pointer-events-none",
  className,
)}
```

Replace with:

```tsx
className={cn(
  "relative flex w-full touch-none select-none items-center",
  disabled && "cursor-not-allowed",
  className,
)}
```

(Drop `opacity-50 pointer-events-none`; the Radix `disabled` prop already blocks interaction, and the per-element `disabled:` classes in trackVariants and thumbVariants now handle the visual flatten. `cursor-not-allowed` gives the hover hint.)

- [ ] **Step 7: Update tooltip background (line 111)**

Find around line 111:

```tsx
"rounded-md bg-neutral-900 dark:bg-base-700 px-2 py-1",
```

Replace with:

```tsx
"rounded-none bg-surface border border-edge px-2 py-1",
```

Key changes:
- `rounded-md` → `rounded-none` (per § 4 — tooltips earn 0px radius)
- `bg-neutral-900 dark:bg-base-700` → `bg-surface border border-edge` (align with Tooltip component — chunk 6 will confirm/lock this token)

**Implementation note:** if chunk 6 hasn't shipped yet (it ships after chunk 4 per the wave order), this is the establishing call for the popover token. Chunk 6 will match it.

- [ ] **Step 8: Run Slider tests, confirm pass**

```bash
npm run test -w packages/ds -- slider.test
```

Expected: all tests pass. If a test asserts on `bg-primary-500`, update to `bg-accent`. If a test asserts on `ring-2 ring-error-400`, update to `border-error` on the thumb.

- [ ] **Step 9: Commit**

```bash
git add packages/ds/src/components/slider/slider.tsx
git commit -m "feat(skin): Slider — bevel chassis, cyan thumb with hover-glow, error on thumb"
```

---

## Task 6: Run full check suite

**Files:**
- No file edits.

**Steps:**

- [ ] **Step 1: Run full DS test suite**

```bash
npm run test -w packages/ds
```

Expected: all DS tests pass (Checkbox, RadioGroup, Switch, Slider — plus every other component that wasn't touched).

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

## Task 7: Visual verification in preview app

**Files:**
- No file edits unless a preview page hard-codes stale chassis classes.

**Steps:**

- [ ] **Step 1: Start the dev server**

```bash
npm run dev
```

Expected: Turbopack starts on `http://localhost:3000` (or the next free port). Console shows no errors.

- [ ] **Step 2: Visit Checkbox preview page in both themes**

Open `http://localhost:3000/components/checkbox` in a browser. Toggle theme (top of the sidebar) between light and dark.

Verify in **both themes**, for **all three sizes** (xs/sm/md):

| State | Expected appearance |
|---|---|
| Unchecked, rest | 1px `--edge` hairline border, transparent fill |
| Unchecked, hover | hairline brightens to `--edge-hover` |
| Unchecked, focus | hairline swaps to cyan (`--accent-700` light, `--accent` dark); no halo |
| Checked, rest | cyan fill, cyan border, dark check glyph |
| Checked, focus | cyan border (focus = same color as checked border in this state) |
| Error | blood-orange border |
| Disabled, unchecked | `--muted` fill (light) / `--background` fill (dark), half-alpha border, cursor `not-allowed` |
| Disabled, checked | same chassis sink, check at `text-foreground/30`, cursor `not-allowed` |

**Specifically verify the check glyph is legible** on cyan in both themes (per spec § 10 risk #2). If muddy, fallback is `text-black`.

- [ ] **Step 3: Visit RadioGroup preview page in both themes**

`http://localhost:3000/components/radio-group`. Same checklist as Checkbox, plus:

- Unchecked dot: not rendered
- Checked dot: cyan filled circle inside the round chassis
- Disabled + checked dot: dot dims to `foreground/30`

If the disabled dot doesn't dim (per implementation note in Task 3, Step 3), apply the fallback `disabled:[&_span]:bg-foreground/30` to the variants block and re-test.

- [ ] **Step 4: Visit Switch preview page in both themes**

`http://localhost:3000/components/switch`. For all three sizes:

| State | Expected appearance |
|---|---|
| Off, rest | Neutral muted track with bevel (top-highlight + bottom-shadow), neutral thumb |
| Off, hover | unchanged (no visible hover cue on off-state — design intentional per spec § 4.3) |
| On, rest | Same muted track + bevel, thumb is cyan (solid, no glow at rest per Q1) |
| On, hover | Cyan thumb glow appears (`0 0 5px var(--accent), 0 0 10px rgba(0,225,250,0.6)`); smooth transition |
| On, focus | Outline halo around the track (`outline-accent outline-offset-2`) + thumb glow |
| Disabled, off | Flat muted chassis (no bevel), neutral thumb, `cursor: not-allowed` |
| Disabled, on | Flat muted chassis, thumb at `foreground/30`, `cursor: not-allowed` |

**Specifically hover the on-state switch** — the glow should fade in (transition-all), not pop instantly. If it pops, the `transition-all` from Task 4 Step 3 isn't applying — verify the class survived `cn()` merge.

- [ ] **Step 5: Visit Slider preview page in both themes**

`http://localhost:3000/components/slider`. For both sizes (sm/md):

| State | Expected appearance |
|---|---|
| Rest | Muted track with bevel, cyan range fill from 0 to thumb position, cyan thumb |
| Hover (anywhere on track / thumb) | Thumb gains glow |
| Focus (keyboard tab to thumb) | Thumb gains glow + cyan outline halo |
| Range mode (two thumbs) | Both thumbs cyan, range between them filled cyan |
| Error | Thumb border turns blood-orange; track unchanged; hovering thumb glows blood-orange |
| Disabled | Flat chassis, range at `foreground/30`, thumb at `foreground/30`, `cursor: not-allowed` |
| Tooltip (if `showTooltip` enabled) | `bg-surface` + 1px `--edge` border, 0px radius, white text |

**Specifically test the range slider with both thumbs at the same position** — confirm thumbs remain visible (the 1px border outline distinguishes them from the cyan range fill).

- [ ] **Step 6: Dense-form smoke test**

Build (or visit) a form page combining Checkbox, RadioGroup, and Switch in a stack of 10+ controls. Confirm:
- No halo bloom — only hovered thumbs glow (per Q1)
- Selected states are clearly readable (cyan reads as "on" across all three control types)
- Disabled controls stop reading as active

- [ ] **Step 7: Stop the dev server**

`Ctrl+C` in the terminal running `npm run dev`.

---

## Task 8: Update docs

**Files:**
- Modify: `docs/SKIN-PRINCIPLES.md`
- Modify: `docs/DESIGN-SYSTEM.md`
- Modify: `docs/DECISIONS.md`
- Modify: `docs/BACKLOG.md`
- Modify: `CLAUDE.md`

**Steps:**

- [ ] **Step 1: Append "Direction C — LED scales by role" to SKIN-PRINCIPLES.md § 6 and verify § 5 bevel rule**

Open `docs/SKIN-PRINCIPLES.md`. First verify § 5 "Bevels for hardware feel" already names switches and sliders in its **Rule:** line — it does (existing text reads "Interactive chassis (buttons, switches, sliders) use inset top-highlight..."). If the **How:** example block doesn't mention Switch + Slider concretely, append to it: "Switch track and Slider track carry inset top-highlight (`rgba(255,255,255,0.06)`) + inset bottom-shadow (`rgba(0,0,0,0.4)`)." Then find the existing "### LED-as-signature for filled interactive controls" sub-section under § 6 (around line 187). After its closing **Source:** line, insert this new sub-section:

```markdown
### Direction C — LED scales by role, not by size
**Rule:** The LED treatment extends to small "on/active" states selectively. Glow is reserved for components where the lit element IS the active surface (Switch thumb, Slider thumb, ProgressBar fill). Slot/text indicators (Checkbox check, Radio dot, active Tab text, active Pagination number, active Breadcrumb) stay flat-cyan — they're markers on a surface, not lit surfaces themselves.
**Why:** A 14px Switch thumb glows because the thumb IS the on/off indicator. A 14px ticked Checkbox doesn't glow because the check is just a marker on a slot. A form with 10 ticked checkboxes would bloom into 10 cyan halos under uniform LED treatment — Direction C keeps it calm by extending the rule by role.
**How:** Switch and Slider thumbs gain `box-shadow: 0 0 5px var(--accent), 0 0 10px rgba(0,225,250,0.6)` on hover/focus only (solid cyan at rest per Q1). ProgressBar fill gains subtle `box-shadow: 0 0 6px rgba(0,225,250,0.5)` at rest (Direction C "active fills"). Checkbox / Radio / Tabs / Pagination / Breadcrumb cyan states are flat.
**Source:** Decision #85.
```

- [ ] **Step 2: Refresh DESIGN-SYSTEM.md component entries**

Open `docs/DESIGN-SYSTEM.md`. For each of Checkbox, RadioGroup, Switch, Slider, locate the entry and update any descriptions that reference:
- `border-3 border-edge` chassis → "1px `--edge` hairline border, flat fill (transparent unchecked, `bg-accent` checked)"
- `ring-3 ring-primary-500` focus → "cyan hairline focus (`--accent` dark, `--accent-700` light) — Switch / Slider use `outline-2 outline-accent outline-offset-2` per Button pattern"
- `border-3 border-error-400` error → "1px `--error` border" (Slider: "on the thumb, not the track")
- `opacity-50 pointer-events-none` disabled → "chassis flattens to muted, value/dot at 30% opacity, cursor `not-allowed`"
- Switch: append "track carries inset bevel (top-highlight + bottom-shadow); thumb is cyan when on, gains glow on hover/focus only"
- Slider: append "track carries inset bevel; range and thumb cyan, thumb gains glow on hover/focus; error renders on the thumb border (not the track)"

If the entries contain props tables or code snippets, keep them as illustrative; the prose descriptions of behavior should match the new chassis.

- [ ] **Step 3: Add Decision #85 to DECISIONS.md**

Open `docs/DECISIONS.md`. Insert at the top of the decisions list (just after the "How Decisions Are Logged" preamble), pushing existing decisions down:

```markdown
## Decision #85 — 2026-05-27

**Context:** Four boolean/range controls (Checkbox, RadioGroup, Switch, Slider) shared a pre-Abyssal chassis block: `border-3 border-edge`, `ring-3 ring-primary-500` focus, `opacity-50 pointer-events-none` disabled, `bg-primary` / `border-primary` / `text-primary-foreground` checked. After Decisions #82 (Button) and #84 (text inputs) established the new chassis vocabulary (1px hairlines, cyan focus, flat-sink disabled, cyan for active/live), these four were the last form-control family still on the old block. The wave-1 brainstorm settled on Direction C ("glow where the lit thing IS the active surface") as the through-line: Switch and Slider thumbs glow on hover/focus, Checkbox and Radio stay flat-cyan when checked.
**Decision:** Apply the wave-1 chassis to all four. **Checkbox:** transparent fill unchecked → `bg-accent` checked, 1px `border-edge` → `border-accent` on focus/checked, 1px `border-error` on error, flat-sink disabled, dark check glyph (`text-neutral-950`) on cyan fill in both modes. **RadioGroup:** same chassis treatment; indicator dot becomes `bg-accent` (dims to `foreground/30` when disabled). **Switch:** track gains inset bevel (`inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.4)`) per SKIN-PRINCIPLES § 5 "switches use bevel"; thumb is `bg-edge` (off) / `bg-accent` (on, solid at rest per Q1); thumb gains glow `box-shadow: 0 0 5px var(--accent), 0 0 10px rgba(0,225,250,0.6)` on hover/focus of the parent (via `group/sw` named group); focus is `outline-2 outline-accent outline-offset-2` on the track. **Slider:** track gains bevel; range and thumb are `bg-accent`; thumb has 1px `border-accent` for circular separation against the cyan range fill; thumb glows on hover/focus; error moves from `ring-2 ring-error-400` on the track to `border-error` on the thumb (track is too thin for a visible error border); tooltip popover aligns to `bg-surface border border-edge rounded-none`. SKIN-PRINCIPLES § 6 gains a new "Direction C — LED scales by role" sub-section.
**Rationale:** Each piece. **Direction C over A (bright) or B (restrained)** — A would bloom in dense forms (10 ticked checkboxes = 10 glows); B left the skin under-committed (cyan-as-fill alone is generic). C scales the LED by what the component IS, matching the logic from chunk 3 (text inputs stay calm). **Switch thumb solid at rest, glow on hover (Q1)** — matches Button's "Hover intensifies, doesn't repaint" (§ 5). The cyan-on-neutral-track color contrast already carries "on" at rest; glow earns its place on interaction. **Bevel on Switch + Slider tracks (§ 5 "switches and sliders use bevel")** — physical-hardware reading, matches Button's bevel vocabulary. **Slider error on thumb, not track** — track is only 4–8px tall; a 1px error border there is invisible. Thumb is the focal interactive surface; error appears where the user is. **Slider tooltip bg-surface border border-edge** — establishes the popover token for chunk 4 + chunk 6 (Tooltip) to share. **Disabled flatten + cursor-not-allowed** — extends Decision #82/#84 pattern: disabled controls look semantically broken, not "loading." `cursor: not-allowed` replaces `pointer-events-none` because pointer-events-none blocks the cursor hint. **Checkbox check glyph `text-neutral-950`** — same-hex dark mark on cyan in both modes; cyan is the same hex per Decision #77, so a single dark color works. `text-background` would flip to near-white in light mode and have no contrast on cyan.
**Alternatives considered:** Direction A "bright LED everywhere" (rejected — halo bloom in dense forms; the failure mode Button already avoided per § 6 filled chassis). Direction B "cyan as fill, no glow" (rejected — under-committed to the instrument metaphor). Switch thumb glow at rest (rejected — Q1; conflicts with Button's hover-only halo rule). Slider error as `ring-2 ring-error-400` on track (rejected — invisible at 4–8px track height). Slider tooltip kept at `bg-neutral-900 dark:bg-base-700` (rejected — out of step with surface ladder; chunk 4 establishes the token, chunk 6 mirrors). Checkbox check glyph `text-background` (rejected — flips to near-white in light mode, no contrast on cyan). Switch with `hover:border-edge-hover` chrome cue (rejected — bevel + thumb glow already cue interactivity; another cue duplicates).
```

- [ ] **Step 4: Move backlog entry to Completed in BACKLOG.md**

Open `docs/BACKLOG.md`. In the `Completed / Rejected` section's `<details><summary>Archived items</summary>` block, add a new completed entry near the top of the list:

```markdown
- [x] 2026-05-27 — Chunk 4 boolean/range chassis reset (Decision #85: Checkbox/RadioGroup/Switch/Slider on flat-hairline chassis; Switch + Slider get bevel + cyan thumb-glow on hover/focus per Direction C; all cyan-checked states use `--accent`; disabled flattens to muted-sink chassis)
```

If an open backlog item exists for this work in `Open Items`, remove it.

- [ ] **Step 5: Update CLAUDE.md Current Features**

Open `CLAUDE.md`. Find the Current Features list. Locate the entries for Checkbox, RadioGroup, Switch, Slider (search by name). Update each entry to reflect the new chassis:

- Checkbox: replace any "border-3 primary border" or "primary fill" wording with "1px `--edge` hairline (flat fill, transparent unchecked), `bg-accent` checked with dark check glyph, cyan hairline focus, `--error` border on error, flat-sink disabled"
- RadioGroup: same shape as Checkbox; indicator dot is `bg-accent`
- Switch: append "bevel chassis (per § 5 hardware-feel), neutral thumb when off / cyan thumb when on, thumb gains glow on hover/focus only (Direction C), `outline-2 outline-accent` focus, flat-sink disabled"
- Slider: append "bevel chassis, cyan range + cyan thumb, thumb glows on hover/focus (Direction C), error renders on thumb border (track too thin for visible error border), tooltip uses `bg-surface border-edge`"

Edit phrasing for fit — the goal is the Current Features list accurately reflects user-visible behavior post-chunk.

- [ ] **Step 6: Run final check after docs edits**

```bash
npm run check
```

Expected: clean. (Docs changes shouldn't affect this, but verifying once more before commit.)

- [ ] **Step 7: Commit docs**

```bash
git add docs/SKIN-PRINCIPLES.md docs/DESIGN-SYSTEM.md docs/DECISIONS.md docs/BACKLOG.md CLAUDE.md
git commit -m "docs(skin): chunk 4 boolean/range chassis (Decision #85)"
```

---

## Task 9: Push branch and open PR into `skin/paraplu`

**Files:**
- No file edits.

**Steps:**

- [ ] **Step 1: Push the chunk branch**

```bash
git push -u origin skin/boolean-range-reset
```

Expected: branch is published; GitHub returns a PR-create URL in the output.

- [ ] **Step 2: Open the PR targeting `skin/paraplu`**

```bash
gh pr create --base skin/paraplu --title "feat(skin): boolean/range chassis reset (Checkbox · RadioGroup · Switch · Slider)" --body "$(cat <<'EOF'
## Summary

- Replaces pre-Abyssal chassis (`border-3 border-edge`, `ring-3 ring-primary-500`, `opacity-50 pointer-events-none`, `bg-primary`/`border-primary` checked) on Checkbox, RadioGroup, Switch, Slider
- Direction C: glow where the lit thing IS the active surface — Switch + Slider thumbs glow on hover/focus, Checkbox + Radio stay flat-cyan when checked
- Switch + Slider tracks gain inset bevel per SKIN-PRINCIPLES § 5 (hardware feel)
- Cyan focus chrome (`border-accent` for Checkbox/Radio; `outline-2 outline-accent outline-offset-2` for Switch/Slider)
- Slider error moves from track ring to thumb border (track too thin for visible error border)
- Disabled flattens to muted-sink chassis + `cursor: not-allowed` (extends Decision #82, #84 pattern)
- Adds "Direction C — LED scales by role" sub-rule to SKIN-PRINCIPLES § 6
- Logged as Decision #85

Spec: `docs/superpowers/specs/2026-05-27-wave1-design.md`
Plan: `docs/superpowers/plans/2026-05-27-chunk-4-boolean-range.md`

This is chunk 4 of the wave-1 skin sweep (chunks 5/6/7 follow as separate PRs).

## Test plan

- [x] `npm run check` passes locally (lint + typecheck + tests)
- [ ] Visual review in `/components/checkbox`, `/components/radio-group`, `/components/switch`, `/components/slider` — both themes, all sizes, all states (rest / hover / focus / checked / error / disabled)
- [ ] Specifically verify check glyph legibility on cyan in light mode
- [ ] Specifically verify Switch thumb glow fades smoothly (transition-all)
- [ ] Specifically verify two-thumb Slider range with thumbs near each other (1px border separation visible)
- [ ] Dense-form smoke (10+ stacked controls) — no halo bloom
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
git branch -D skin/boolean-range-reset
```

Expected: local `skin/paraplu` advances by one squashed commit; chunk branch is removed.
