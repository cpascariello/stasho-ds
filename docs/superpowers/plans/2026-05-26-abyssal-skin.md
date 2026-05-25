# Abyssal Skin Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Aleph-Cloud-inherited "purple + lime" skin with the locked Abyssal palette (deep purple `#2A0563` primary, bright cyan `#00E1FA` accent, amber `#ffc53d` warn), Observatory Mono dark surfaces, faintly-purple-tinted off-white light surfaces, tighter radius vocabulary (2/4/6/10), and Space Grotesk + Inter typography. Spec captured in `docs/DECISIONS.md` #77.

**Architecture:** The three-layer token system in `packages/ds/src/styles/tokens.css` stays intact. Layer 1 color scales get regenerated around new hues (270 for primary, 215 for accent). Layer 2 semantic tokens use same-hex rule — `--primary`, `--accent`, `--warn` resolve to identical values in `:root` and `.theme-dark`. Layer 3 Tailwind bridge unchanged. Components only change where they currently use `rounded-full` on pill-button-style elements (Button, Input, Combobox, Pagination). Intentionally-round elements (StatusDot, ProgressBar tracks, Slider, MultiSelect chips) keep `rounded-full`.

**Tech Stack:** Tailwind CSS 4 + CSS custom properties, OKLCH color space, npm workspaces (`@stasho/ds` + `@stasho/preview`), TypeScript strict, vitest + Testing Library, oxlint.

---

### Task 1: Replace primary color scale

**Files:**
- Modify: `packages/ds/src/styles/tokens.css:6-16`

- [ ] **Step 1: Read the file to confirm current state**

Run: `grep -n 'color-primary-' packages/ds/src/styles/tokens.css | head -15`

Expected: lines 6-16 show the existing primary scale anchored at hue 285.48 with brand at primary-600.

- [ ] **Step 2: Replace the primary scale**

In `packages/ds/src/styles/tokens.css`, replace the block at lines 5-16 (the `/* Primary ... */` comment plus the 11 OKLCH lines) with:

```css
  /* Primary (Abyssal deep purple, H: 270) — 800 = brand #2A0563 */
  --color-primary-50: oklch(0.97 0.015 270);
  --color-primary-100: oklch(0.93 0.030 270);
  --color-primary-200: oklch(0.86 0.060 270);
  --color-primary-300: oklch(0.75 0.110 270);
  --color-primary-400: oklch(0.60 0.165 270);
  --color-primary-500: oklch(0.45 0.200 270);
  --color-primary-600: oklch(0.35 0.200 270);
  --color-primary-700: oklch(0.30 0.190 270);
  --color-primary-800: oklch(0.27 0.180 270);
  --color-primary-900: oklch(0.20 0.140 270);
  --color-primary-950: oklch(0.14 0.090 270);
```

- [ ] **Step 3: Verify typecheck still passes**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add packages/ds/src/styles/tokens.css
git commit -m "feat(skin): replace primary scale with Abyssal deep purple (H 270)"
```

---

### Task 2: Replace accent color scale

**Files:**
- Modify: `packages/ds/src/styles/tokens.css:18-29`

- [ ] **Step 1: Replace the accent scale**

Replace the block at lines 18-29 (the `/* Accent ... */` comment plus the 11 OKLCH lines) with:

```css
  /* Accent (Abyssal bright cyan, H: 215) — 300 = brand #00E1FA */
  --color-accent-50: oklch(0.98 0.020 215);
  --color-accent-100: oklch(0.95 0.040 215);
  --color-accent-200: oklch(0.92 0.070 215);
  --color-accent-300: oklch(0.85 0.130 215);
  --color-accent-400: oklch(0.77 0.140 215);
  --color-accent-500: oklch(0.67 0.140 215);
  --color-accent-600: oklch(0.55 0.130 215);
  --color-accent-700: oklch(0.45 0.115 215);
  --color-accent-800: oklch(0.35 0.095 215);
  --color-accent-900: oklch(0.25 0.075 215);
  --color-accent-950: oklch(0.16 0.050 215);
```

- [ ] **Step 2: Verify typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add packages/ds/src/styles/tokens.css
git commit -m "feat(skin): replace accent scale with Abyssal bright cyan (H 215)"
```

---

### Task 3: Shift warning scale hue to match Radix Amber-9

**Files:**
- Modify: `packages/ds/src/styles/tokens.css:44-55`

- [ ] **Step 1: Replace warning scale to anchor at #ffc53d**

The existing warning scale uses hue 75 anchored at #FBAE18 (warning-500). Shift to hue 87 with warning-400 ≈ #ffc53d:

```css
  /* Warning (Radix Amber-9, H: 87) — 400 = brand #ffc53d */
  --color-warning-50: oklch(0.98 0.020 87);
  --color-warning-100: oklch(0.95 0.050 87);
  --color-warning-200: oklch(0.90 0.100 87);
  --color-warning-300: oklch(0.87 0.140 87);
  --color-warning-400: oklch(0.84 0.160 87);
  --color-warning-500: oklch(0.78 0.165 87);
  --color-warning-600: oklch(0.68 0.155 87);
  --color-warning-700: oklch(0.58 0.135 87);
  --color-warning-800: oklch(0.46 0.105 87);
  --color-warning-900: oklch(0.34 0.075 87);
  --color-warning-950: oklch(0.23 0.045 87);
```

- [ ] **Step 2: Verify typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add packages/ds/src/styles/tokens.css
git commit -m "feat(skin): shift warning scale to Radix Amber-9 hue (87)"
```

---

### Task 4: Replace base surface scale with Observatory Mono

**Files:**
- Modify: `packages/ds/src/styles/tokens.css:96-99`

- [ ] **Step 1: Replace base scale**

The existing `--color-base-700/800/900` uses a tone-on-tone dark indigo at H 280. Replace with the Observatory Mono near-black ladder:

```css
  /* Base (Observatory Mono near-black dark surfaces) */
  --color-base-700: oklch(0.21 0.005 273);  /* #161718 elevated */
  --color-base-800: oklch(0.18 0.004 273);  /* #101111 raised */
  --color-base-900: oklch(0.16 0.003 273);  /* #0d0d0d base */
  --color-base-950: oklch(0.10 0.002 273);  /* #07080a void */
```

Note: We add `--color-base-950` for the "void" level since the locked dark ladder has four steps.

- [ ] **Step 2: Verify typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add packages/ds/src/styles/tokens.css
git commit -m "feat(skin): replace base scale with Observatory Mono dark surfaces"
```

---

### Task 5: Rewrite Layer 2 semantic tokens

**Files:**
- Modify: `packages/ds/src/styles/tokens.css:122-162`

This is the largest change in tokens.css. The `:root` and `.theme-dark` blocks both need updating to use the same-hex Abyssal accents.

- [ ] **Step 1: Replace the `:root` block (light mode)**

Replace lines 125-145 with:

```css
:root {
  --background: oklch(0.99 0.005 270);
  --foreground: oklch(0.22 0.015 270);
  --primary: #2A0563;
  --primary-foreground: #ffffff;
  --accent: #00E1FA;
  --accent-foreground: oklch(0.20 0.030 215);
  --warn: #ffc53d;
  --warn-foreground: oklch(0.25 0.04 60);
  --muted: oklch(0.94 0.009 270);
  --muted-foreground: oklch(0.55 0.014 270);
  --surface: oklch(0.94 0.009 270);
  --surface-foreground: oklch(0.22 0.015 270);
  --edge: oklch(0.87 0.013 270);
  --edge-hover: oklch(0.80 0.015 270);

  --gradient-main: var(--gradient-main-base);

  --duration-fast: 200ms;
  --duration-normal: 500ms;
  --duration-slow: 700ms;
  --timing: ease-in-out;
}
```

- [ ] **Step 2: Replace the `.theme-dark` block**

Replace lines 147-162 with:

```css
.theme-dark {
  --background: #07080a;
  --foreground: oklch(0.96 0.005 273);
  --primary: #2A0563;
  --primary-foreground: #ffffff;
  --accent: #00E1FA;
  --accent-foreground: oklch(0.15 0.030 215);
  --warn: #ffc53d;
  --warn-foreground: oklch(0.20 0.04 60);
  --muted: var(--color-base-800);
  --muted-foreground: oklch(0.62 0.012 273);
  --surface: var(--color-base-900);
  --surface-foreground: oklch(0.96 0.005 273);
  --edge: oklch(0.30 0.005 273);
  --edge-hover: oklch(0.38 0.006 273);

  --gradient-main: var(--gradient-main-dark);
}
```

- [ ] **Step 3: Extend Layer 3 Tailwind bridge to surface `warn`**

Add to the `@theme inline` block (around line 167-180), inside the existing curly braces:

```css
  --color-warn: var(--warn);
  --color-warn-foreground: var(--warn-foreground);
```

- [ ] **Step 4: Verify build**

Run: `npm run check`
Expected: lint, typecheck, tests all pass.

- [ ] **Step 5: Commit**

```bash
git add packages/ds/src/styles/tokens.css
git commit -m "feat(skin): rewrite semantic tokens for Abyssal same-hex accents"
```

---

### Task 6: Update gradient + shadow tokens

**Files:**
- Modify: `packages/ds/src/styles/tokens.css:101-114`

The existing gradients use the old purple + lime brand. Replace with Abyssal-derived gradients.

- [ ] **Step 1: Replace the gradient block (lines 101-109)**

```css
  /* Gradients */
  --gradient-main-base: linear-gradient(90deg, #1A0440 8.24%, #2A0563 71.81%);
  --gradient-main-dark: linear-gradient(90deg, #0a0312 8.24%, #2A0563 71.81%);
  --gradient-accent: linear-gradient(90deg, #00E1FA 0%, #B3F4FC 100%);
  --gradient-success: linear-gradient(90deg, #36D846 0%, #63E570 100%);
  --gradient-warning: linear-gradient(90deg, #ffe14d 0%, #ffc53d 100%);
  --gradient-error: linear-gradient(90deg, #FFAC89 0%, #DE3668 90.62%);
  --gradient-info: linear-gradient(90deg, #00E1FA 22.66%, #2A0563 244.27%);
  --gradient-destructive: var(--gradient-error);
```

Note: the legacy `--gradient-lime` is removed (it was for the secondary button); we'll deal with the Button's reference in Task 9. `--gradient-accent` is the new cyan gradient.

- [ ] **Step 2: Replace the shadow block (lines 111-114)**

```css
  /* Shadows */
  --shadow-brand-sm: 0px 4px 4px oklch(0.27 0.180 270 / 0.20);
  --shadow-brand: 0px 4px 24px oklch(0.27 0.180 270 / 0.15);
  --shadow-brand-lg: 0px 4px 48px oklch(0.27 0.180 270 / 0.30);
```

- [ ] **Step 3: Verify build**

Run: `npm run check`
Expected: lint + typecheck + tests pass. There may be test failures from gradient utility class references — see Task 9.

- [ ] **Step 4: Commit**

```bash
git add packages/ds/src/styles/tokens.css
git commit -m "feat(skin): update gradient and shadow tokens for Abyssal palette"
```

---

### Task 7: Update typography tokens + load fonts in preview

**Files:**
- Modify: `packages/ds/src/styles/tokens.css:116-119`
- Modify: `apps/preview/src/app/layout.tsx:21-26`

- [ ] **Step 1: Replace font tokens in tokens.css**

Replace lines 116-119 with:

```css
  /* Fonts */
  --font-heading: "Space Grotesk", ui-sans-serif, system-ui, sans-serif;
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;
```

- [ ] **Step 2: Update preview layout font links**

In `apps/preview/src/app/layout.tsx` lines 21-26, replace the existing `<link>` tags inside `<head>` with:

```tsx
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
```

- [ ] **Step 3: Verify build + visual check**

```bash
npm run check
```
Then start dev server and visit `http://localhost:3000`. Confirm headings render in Space Grotesk and body text in Inter.

- [ ] **Step 4: Commit**

```bash
git add packages/ds/src/styles/tokens.css apps/preview/src/app/layout.tsx
git commit -m "feat(skin): swap fonts to Space Grotesk + Inter"
```

---

### Task 8: Add radius tokens to Layer 1

**Files:**
- Modify: `packages/ds/src/styles/tokens.css` (inside the existing `@theme` block, after the fonts section near line 120)

- [ ] **Step 1: Add radius tokens before the closing brace of `@theme`**

Add inside the `@theme` block, after the `--font-mono` line:

```css

  /* Radius vocabulary (Abyssal — subtle by default, full reserved for dots/badges) */
  --radius-sm: 2px;
  --radius-md: 4px;
  --radius-lg: 6px;
  --radius-xl: 10px;
```

Note: `--radius-full` is provided by Tailwind's defaults; we don't redefine it.

- [ ] **Step 2: Verify Tailwind utilities are available**

Run: `npm run dev` and inspect any element with `class="rounded-md"` — confirm computed `border-radius` is `4px`.

- [ ] **Step 3: Commit**

```bash
git add packages/ds/src/styles/tokens.css
git commit -m "feat(skin): add tighter radius scale tokens (2/4/6/10)"
```

---

### Task 9: Drop pill default on Button

**Files:**
- Modify: `packages/ds/src/components/button/button.tsx:17`
- Modify: `packages/ds/src/components/button/button.tsx:30` (secondary variant references `gradient-fill-lime` which no longer exists)
- Modify: `packages/ds/src/components/button/button.test.tsx` (any tests that assert `rounded-full`)

- [ ] **Step 1: Check for button tests asserting rounded-full**

Run: `grep -n "rounded-full" packages/ds/src/components/button/button.test.tsx`
Expected: list of lines to update.

- [ ] **Step 2: Change Button base class from `rounded-full` to `rounded-md`**

In `packages/ds/src/components/button/button.tsx:17`, replace:

```tsx
    "rounded-full border-3 transition-colors",
```

with:

```tsx
    "rounded-md border-3 transition-colors",
```

- [ ] **Step 3: Update Button secondary variant (lines ~29-32)**

Replace:

```tsx
        secondary: [
          "gradient-fill-lime text-neutral-950 border-neutral-950",
          "disabled:opacity-50",
        ].join(" "),
```

with:

```tsx
        secondary: [
          "gradient-fill-accent text-primary-foreground border-transparent",
          "disabled:opacity-50",
        ].join(" "),
```

(The `gradient-fill-accent` utility will be added in the next step.)

- [ ] **Step 4: Add `gradient-fill-accent` utility to tokens.css**

In `packages/ds/src/styles/tokens.css`, find the existing `.gradient-fill-lime` block (around line 233) and replace it with:

```css
.gradient-fill-accent {
  background: var(--gradient-accent) border-box;
}
.gradient-fill-accent:hover {
  background:
    linear-gradient(oklch(0 0 0 / 0.06), oklch(0 0 0 / 0.06)) border-box,
    var(--gradient-accent) border-box;
}
.gradient-fill-accent:active {
  background:
    linear-gradient(oklch(0 0 0 / 0.12), oklch(0 0 0 / 0.12)) border-box,
    var(--gradient-accent) border-box;
}
```

- [ ] **Step 5: Update button tests to expect `rounded-md` (or remove the class assertion entirely)**

In `packages/ds/src/components/button/button.test.tsx`, find any line containing `rounded-full` in a button test context and change to `rounded-md`.

- [ ] **Step 6: Run button tests**

```bash
npm test -- packages/ds/src/components/button
```

Expected: all button tests pass.

- [ ] **Step 7: Visual check in preview app**

Visit `http://localhost:3000/components/button`. Confirm all variants render with subtle 4px radius (not pill).

- [ ] **Step 8: Commit**

```bash
git add packages/ds/src/components/button packages/ds/src/styles/tokens.css
git commit -m "feat(skin): drop pill default on Button, use gradient-fill-accent"
```

---

### Task 10: Drop pill on Input

**Files:**
- Modify: `packages/ds/src/components/input/input.tsx:8`

- [ ] **Step 1: Replace `rounded-full` with `rounded-md` in Input base class**

In `packages/ds/src/components/input/input.tsx:8`, find:

```tsx
    "border-0 rounded-full",
```

and replace with:

```tsx
    "border-0 rounded-md",
```

- [ ] **Step 2: Update Input tests if any assert `rounded-full`**

```bash
grep -n "rounded-full" packages/ds/src/components/input/input.test.tsx
```

Update any matches to `rounded-md`.

- [ ] **Step 3: Run input tests + visual check**

```bash
npm test -- packages/ds/src/components/input
```

Visit `http://localhost:3000/components/input`. Confirm input has subtle radius.

- [ ] **Step 4: Commit**

```bash
git add packages/ds/src/components/input
git commit -m "feat(skin): drop pill default on Input, use rounded-md"
```

---

### Task 11: Drop pill on Combobox + MultiSelect trigger

**Files:**
- Modify: `packages/ds/src/components/combobox/combobox.tsx:12`
- Modify: `packages/ds/src/components/multi-select/multi-select.tsx:160, 190` (only the trigger button radius; tag chips at line 33 stay rounded-full intentionally)

- [ ] **Step 1: Update Combobox base class**

In `packages/ds/src/components/combobox/combobox.tsx:12`, change `rounded-full` to `rounded-md`.

- [ ] **Step 2: Inspect MultiSelect lines 160 + 190**

```bash
grep -n "rounded-full" packages/ds/src/components/multi-select/multi-select.tsx
```

For each match, confirm the role:
- Line 33: tag chip — KEEP rounded-full (chips are pill-style intentionally).
- Lines 160, 190: trigger button or dismiss icon button — change to `rounded-md` if it's the outer trigger; keep round if it's a tiny "x" icon button.

Open the file and decide per-line based on visual role. Default: keep small icon buttons rounded-full, change the main trigger to `rounded-md`.

- [ ] **Step 3: Update tests**

```bash
grep -n "rounded-full" packages/ds/src/components/combobox/combobox.test.tsx packages/ds/src/components/multi-select/multi-select.test.tsx
```

Update assertions that no longer reflect the trigger's class.

- [ ] **Step 4: Run tests**

```bash
npm test -- packages/ds/src/components/combobox packages/ds/src/components/multi-select
```

- [ ] **Step 5: Visual check**

Visit `http://localhost:3000/components/combobox` and `http://localhost:3000/components/multi-select`. Confirm trigger has subtle radius and tag chips inside MultiSelect stay pill-shaped.

- [ ] **Step 6: Commit**

```bash
git add packages/ds/src/components/combobox packages/ds/src/components/multi-select
git commit -m "feat(skin): drop pill on Combobox + MultiSelect trigger"
```

---

### Task 12: Update Pagination buttons

**Files:**
- Modify: `packages/ds/src/components/pagination/pagination.tsx:83, 94`

- [ ] **Step 1: Replace `rounded-full` with `rounded-md` for the page-number buttons**

In `pagination.tsx` lines 83 and 94, change `"size-8 rounded-full"` to `"size-8 rounded-md"`.

- [ ] **Step 2: Update pagination tests if needed**

```bash
grep -n "rounded-full" packages/ds/src/components/pagination/pagination.test.tsx
```

Update matches.

- [ ] **Step 3: Run tests + visual check**

```bash
npm test -- packages/ds/src/components/pagination
```

Visit `http://localhost:3000/components/pagination`.

- [ ] **Step 4: Commit**

```bash
git add packages/ds/src/components/pagination
git commit -m "feat(skin): switch Pagination buttons to rounded-md"
```

---

### Task 13: Run full test suite + verify all preview pages

**Files:** none modified in this task — verification only.

- [ ] **Step 1: Run the full check pipeline**

```bash
npm run check
```

Expected: lint, typecheck, all tests pass. If anything fails, investigate before proceeding.

- [ ] **Step 2: Start dev server and walk the preview app**

```bash
npm run dev
```

Visit each of these pages and confirm visual correctness:
- `/` — overview
- `/foundations/colors` — primary scale now deep purple, accent scale now cyan
- `/foundations/typography` — Space Grotesk + Inter rendering
- `/components/button` — all variants, subtle radius, primary fill is deep purple gradient
- `/components/input` — subtle radius
- `/components/combobox` — subtle radius on trigger
- `/components/multi-select` — chips still pill, trigger subtle
- `/components/pagination` — page buttons subtle
- `/components/card` — should look natural with new surface tokens
- `/components/dialog` — frosted overlay still works
- `/components/alert` — gradient backgrounds use new colors

- [ ] **Step 3: Toggle theme switcher**

For each page above, toggle dark/light. Confirm primary purple + cyan accent are the SAME hex in both modes (using browser devtools).

- [ ] **Step 4: Commit anything that needed fixing**

If you made any small fixes during walkthrough, commit them now:

```bash
git status
git add <files>
git commit -m "fix(skin): <description>"
```

---

### Task 14: Delete the paraplu mockup page

**Files:**
- Delete: `apps/preview/src/app/paraplu/page.tsx`

- [ ] **Step 1: Confirm no other code references the page**

```bash
grep -rn "paraplu" apps/preview/src/ packages/ds/src/
```

Expected: no matches outside `apps/preview/src/app/paraplu/page.tsx` itself.

- [ ] **Step 2: Delete the page**

```bash
trash apps/preview/src/app/paraplu/page.tsx
# Also remove the directory if it's now empty:
rmdir apps/preview/src/app/paraplu 2>/dev/null || true
```

- [ ] **Step 3: Verify build still works**

```bash
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add apps/preview/src/app/paraplu
git commit -m "chore(skin): remove paraplu exploration page now that the palette is locked"
```

---

### Task 15: Update docs

**Files:**
- Modify: `docs/DESIGN-SYSTEM.md`
- Modify: `docs/ARCHITECTURE.md`
- Modify: `CLAUDE.md`
- Modify: `docs/BACKLOG.md`
- (DECISIONS.md already updated with #77)

- [ ] **Step 1: Update DESIGN-SYSTEM.md**

Add or update the relevant sections to reflect:
- Primary token = deep purple `#2A0563`
- Accent token = bright cyan `#00E1FA`
- Warn token = amber `#ffc53d`
- Same-hex rule explained
- Surface ladder dark = Observatory Mono; light = off-white with hue-270 tint
- Radius vocabulary 2/4/6/10
- Font stack: Space Grotesk + Inter (Grilli parked)

Locate the existing "Colors", "Surfaces", "Radius", "Typography" subsections (or add them if missing) and rewrite each.

- [ ] **Step 2: Update ARCHITECTURE.md**

Document:
- Same-hex pattern: `--primary`, `--accent`, `--warn` are hex literals in both `:root` and `.theme-dark`, not scale references
- Why: research-backed (Radix/Geist convention); see Decision #77

- [ ] **Step 3: Update CLAUDE.md "Current Features" list**

Find the entry for the current skin (mentions "tone-on-tone purple" / "lime accent" etc.) and update to:

> - Abyssal skin: deep purple primary (`#2A0563`) + bright cyan accent (`#00E1FA`) + amber warn (`#ffc53d`), same hex in both modes (Radix step-9 convention)
> - Observatory Mono dark surface ladder (`#07080a → #161718`), faintly violet-tinted off-white light ladder (hue 270)
> - Radius vocabulary 2/4/6/10 — `full` reserved for status dots, ProgressBar tracks, Slider, MultiSelect chips
> - Typography: Space Grotesk (headings) + Inter (body); Grilli Type parked pending budget

Remove any stale descriptions of the old purple+lime skin.

- [ ] **Step 4: Update BACKLOG.md**

Move the "Adopt new skin" item (if it exists in the active backlog) to the Completed section. Add any deferred ideas surfaced during exploration:
- Switch accent text uses to a contrast-aware step (step-11 in light, step-9 in dark) so cyan link text stays legible on white surfaces
- Adopt Grilli Type once budget is approved

- [ ] **Step 5: Commit docs**

```bash
git add docs/ CLAUDE.md
git commit -m "docs(skin): update DS docs for Abyssal palette"
```

---

### Task 16: Final smoke test + ready to merge

**Files:** none modified.

- [ ] **Step 1: Run the full check pipeline one more time**

```bash
npm run check
```

Expected: all pass.

- [ ] **Step 2: Run build to confirm static export still works**

```bash
npm run build
```

Expected: build succeeds.

- [ ] **Step 3: Push the branch**

```bash
git push -u origin skin/paraplu
```

- [ ] **Step 4: Create PR for review**

```bash
gh pr create --title "Abyssal skin: replace Aleph-Cloud palette with deep purple + cyan" --body "$(cat <<'EOF'
## Summary
- Replace primary/accent/warning color scales with Abyssal palette (deep purple `#2A0563` + bright cyan `#00E1FA` + Radix Amber `#ffc53d`)
- Same hex value used in both `:root` and `.theme-dark` (Radix step-9 convention)
- Observatory Mono dark surface ladder; off-white-with-violet-tint light ladder
- Tighter radius vocabulary (2/4/6/10), full reserved for status dots / progress / slider / multi-select chips
- Space Grotesk (heading) + Inter (body); Grilli parked pending budget
- Drop pill default on Button, Input, Combobox, MultiSelect trigger, Pagination

## Test plan
- [ ] `npm run check` passes
- [ ] `npm run build` succeeds (static export)
- [ ] Visual walkthrough of all preview pages in both light and dark mode
- [ ] Confirm `--primary` and `--accent` resolve to the same hex in both modes via devtools
- [ ] Confirm intentionally-round elements (StatusDot, ProgressBar, Slider, MultiSelect chips) still render as pills
EOF
)"
```

---

## Self-Review Notes

**Spec coverage:** DECISIONS.md #77 covers — primary, accent, warn (Tasks 1-3); base/surfaces (Task 4); semantic tokens with same-hex rule (Task 5); gradients/shadows (Task 6); fonts (Task 7); radius (Task 8); components (Tasks 9-12). Verification (13), cleanup (14), docs (15), shipping (16).

**Placeholder scan:** All steps have concrete code or commands. Component test updates reference `grep` first to locate matches rather than assuming exact line numbers — necessary since assertions vary per component.

**Type consistency:** `gradient-fill-accent` defined in Task 9 step 4 matches the reference in step 3. `--warn` and `--warn-foreground` introduced in Task 5 are surfaced via Layer 3 bridge in Task 5 step 3. `--color-base-950` added in Task 4 is the new void-level token; `--color-base-700/800/900` retain their original semantic meaning.

**Known risk:** Some component tests assert on `rounded-full` class strings — handled in each component's task via a `grep` step before edits. If any other component test references the old color tokens (e.g. `oklch(0.372 0.254 285.48)` in snapshots), it'll surface during Task 13 and need a targeted fix.
