# Abyssal · Void Edition Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Aleph-Cloud-inherited purple+lime skin with the locked Abyssal Void edition — deep-purple primary, cyan accent, blood-orange error, cool-teal success, amber warn, Observatory Mono dark surfaces, 0/0/2/4 brutalist radius, Anybody + Inter + Departure Mono typography.

**Architecture:** The three-layer token system in `packages/ds/src/styles/tokens.css` stays intact. Layer 1 OKLCH color scales regenerate around new hue anchors. Layer 2 semantic tokens use the same-hex rule for `--primary`/`--accent`/`--success`/`--warn`/`--error`. Layer 3 Tailwind bridge extends to surface the new semantic tokens. Components only change where they currently use `rounded-full`/`rounded-2xl`/`rounded-md` on elements that the spec calls out — intentionally-round elements (StatusDot, ProgressBar tracks, Slider, Switch thumb, Stepper indicators, MultiSelect tag chips, Tabs pill variant) keep their current radius.

**Tech Stack:** Tailwind CSS 4 + CSS custom properties, OKLCH color space, npm workspaces (`@stasho/ds` + `@stasho/preview`), TypeScript 5.9 strict, vitest + Testing Library, oxlint.

**Spec:** [`docs/superpowers/specs/2026-05-26-abyssal-void-design.md`](../specs/2026-05-26-abyssal-void-design.md)
**Decision:** #78 (supersedes #77)

---

### Task 1: Replace Layer 1 color scales in tokens.css

Five OKLCH scales (primary, accent, success, warning, error) get new hue anchors. Neutral and base get adjusted hues to match the new cooler palette.

**Files:**
- Modify: `packages/ds/src/styles/tokens.css:5-99`

- [ ] **Step 1: Read tokens.css to confirm current Layer 1 structure**

Run: `grep -n "color-primary-\|color-accent-\|color-success-\|color-warning-\|color-error-\|color-neutral-\|color-base-" packages/ds/src/styles/tokens.css | head -50`

Expected: existing scales for primary (H 285.48), accent (H 121.30), success (H 145), warning (H 75), error (H 12), neutral (H 265), base (H 280).

- [ ] **Step 2: Replace the primary scale block (lines 5–16)**

Find this block in `packages/ds/src/styles/tokens.css`:

```css
  /* Primary (brand purple, H: 285.48) — 600 = brand #5100CD */
  --color-primary-50: oklch(0.96 0.02 301.63);
  --color-primary-100: oklch(0.93 0.040 285.48);
  --color-primary-200: oklch(0.87 0.080 285.48);
  --color-primary-300: oklch(0.77 0.140 285.48);
  --color-primary-400: oklch(0.64 0.210 285.48);
  --color-primary-500: oklch(0.50 0.254 285.48);
  --color-primary-600: oklch(0.372 0.254 285.48);
  --color-primary-700: oklch(0.31 0.224 285.48);
  --color-primary-800: oklch(0.25 0.174 285.48);
  --color-primary-900: oklch(0.20 0.114 285.48);
  --color-primary-950: oklch(0.15 0.064 285.48);
```

Replace with:

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

- [ ] **Step 3: Replace the accent scale block (lines 18–29)**

Find this block:

```css
  /* Accent (brand lime, H: 121.30) — 300 = brand #D4FF00 */
  --color-accent-50: oklch(0.98 0.030 121.30);
  --color-accent-100: oklch(0.96 0.100 121.30);
  --color-accent-200: oklch(0.94 0.180 121.30);
  --color-accent-300: oklch(0.929 0.228 121.30);
  --color-accent-400: oklch(0.82 0.200 121.30);
  --color-accent-500: oklch(0.72 0.175 121.30);
  --color-accent-600: oklch(0.62 0.150 121.30);
  --color-accent-700: oklch(0.52 0.120 121.30);
  --color-accent-800: oklch(0.42 0.085 121.30);
  --color-accent-900: oklch(0.32 0.055 121.30);
  --color-accent-950: oklch(0.22 0.030 121.30);
```

Replace with:

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

- [ ] **Step 4: Replace the success scale block (lines 31–42)**

Find this block:

```css
  /* Success (green, H: 145) — 500 = #36D846 */
  --color-success-50: oklch(0.98 0.020 145);
  --color-success-100: oklch(0.94 0.050 145);
  --color-success-200: oklch(0.88 0.100 145);
  --color-success-300: oklch(0.81 0.160 145);
  --color-success-400: oklch(0.76 0.200 145);
  --color-success-500: oklch(0.72 0.230 145);
  --color-success-600: oklch(0.60 0.200 145);
  --color-success-700: oklch(0.50 0.170 145);
  --color-success-800: oklch(0.40 0.130 145);
  --color-success-900: oklch(0.30 0.085 145);
  --color-success-950: oklch(0.20 0.045 145);
```

Replace with:

```css
  /* Success (cool teal-green, H: 160) — 400 = brand #2BD58E */
  --color-success-50: oklch(0.98 0.020 160);
  --color-success-100: oklch(0.95 0.045 160);
  --color-success-200: oklch(0.90 0.085 160);
  --color-success-300: oklch(0.84 0.125 160);
  --color-success-400: oklch(0.78 0.155 160);
  --color-success-500: oklch(0.68 0.150 160);
  --color-success-600: oklch(0.55 0.135 160);
  --color-success-700: oklch(0.45 0.115 160);
  --color-success-800: oklch(0.35 0.090 160);
  --color-success-900: oklch(0.25 0.065 160);
  --color-success-950: oklch(0.16 0.040 160);
```

- [ ] **Step 5: Replace the warning scale block (lines 44–55)**

Find this block:

```css
  /* Warning (amber, H: 75) — 500 = #FBAE18 */
  --color-warning-50: oklch(0.98 0.020 75);
  --color-warning-100: oklch(0.95 0.050 75);
  --color-warning-200: oklch(0.90 0.100 75);
  --color-warning-300: oklch(0.86 0.140 75);
  --color-warning-400: oklch(0.83 0.165 75);
  --color-warning-500: oklch(0.80 0.180 75);
  --color-warning-600: oklch(0.70 0.165 75);
  --color-warning-700: oklch(0.60 0.140 75);
  --color-warning-800: oklch(0.48 0.110 75);
  --color-warning-900: oklch(0.35 0.075 75);
  --color-warning-950: oklch(0.24 0.045 75);
```

Replace with:

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

- [ ] **Step 6: Replace the error scale block (lines 57–68)**

Find this block:

```css
  /* Error (red, H: 12) — 600 = #DE3668 */
  --color-error-50: oklch(0.98 0.010 12);
  --color-error-100: oklch(0.93 0.040 12);
  --color-error-200: oklch(0.87 0.080 12);
  --color-error-300: oklch(0.79 0.130 12);
  --color-error-400: oklch(0.70 0.170 12);
  --color-error-500: oklch(0.63 0.200 12);
  --color-error-600: oklch(0.57 0.200 12);
  --color-error-700: oklch(0.48 0.175 12);
  --color-error-800: oklch(0.39 0.140 12);
  --color-error-900: oklch(0.30 0.095 12);
  --color-error-950: oklch(0.20 0.055 12);
```

Replace with:

```css
  /* Error (blood-orange, H: 25) — 500 = brand #FF3D00 */
  --color-error-50: oklch(0.97 0.025 25);
  --color-error-100: oklch(0.93 0.055 25);
  --color-error-200: oklch(0.86 0.110 25);
  --color-error-300: oklch(0.78 0.170 25);
  --color-error-400: oklch(0.71 0.220 25);
  --color-error-500: oklch(0.64 0.245 25);
  --color-error-600: oklch(0.56 0.225 25);
  --color-error-700: oklch(0.47 0.190 25);
  --color-error-800: oklch(0.38 0.150 25);
  --color-error-900: oklch(0.28 0.110 25);
  --color-error-950: oklch(0.18 0.070 25);
```

- [ ] **Step 7: Replace the neutral scale block (lines 83–94)**

Find this block:

```css
  /* Neutral (gray with slight purple tint, H: 265) */
  --color-neutral-50: oklch(0.98 0.003 265);
  --color-neutral-100: oklch(0.94 0.006 265);
  --color-neutral-200: oklch(0.90 0.008 265);
  --color-neutral-300: oklch(0.83 0.012 265);
  --color-neutral-400: oklch(0.71 0.015 265);
  --color-neutral-500: oklch(0.55 0.015 265);
  --color-neutral-600: oklch(0.45 0.014 265);
  --color-neutral-700: oklch(0.37 0.012 265);
  --color-neutral-800: oklch(0.29 0.010 265);
  --color-neutral-900: oklch(0.21 0.008 265);
  --color-neutral-950: oklch(0.14 0.005 265);
```

Replace with:

```css
  /* Neutral (cool gray with subtle indigo tint, H: 273) */
  --color-neutral-50: oklch(0.98 0.003 273);
  --color-neutral-100: oklch(0.94 0.006 273);
  --color-neutral-200: oklch(0.90 0.008 273);
  --color-neutral-300: oklch(0.83 0.012 273);
  --color-neutral-400: oklch(0.71 0.015 273);
  --color-neutral-500: oklch(0.55 0.015 273);
  --color-neutral-600: oklch(0.45 0.014 273);
  --color-neutral-700: oklch(0.37 0.012 273);
  --color-neutral-800: oklch(0.29 0.010 273);
  --color-neutral-900: oklch(0.21 0.008 273);
  --color-neutral-950: oklch(0.14 0.005 273);
```

- [ ] **Step 8: Replace the base scale block (lines 96–99)**

Find this block:

```css
  /* Base (dark indigo, H: 280) — tone-sur-tone dark surface palette */
  --color-base-900: oklch(0.22 0.025 280);
  --color-base-800: oklch(0.28 0.030 280);
  --color-base-700: oklch(0.34 0.034 280);
```

Replace with:

```css
  /* Base (Observatory Mono dark surface ladder, H: 273) */
  --color-base-700: oklch(0.21 0.005 273);  /* #161718 raised (popovers) */
  --color-base-800: oklch(0.18 0.004 273);  /* #101111 elevated (modals) */
  --color-base-900: oklch(0.16 0.003 273);  /* #0d0d0d surface (panels)  */
  --color-base-950: oklch(0.10 0.002 273);  /* #07080a void / background */
```

- [ ] **Step 9: Verify typecheck still passes**

Run: `npm run typecheck`
Expected: no errors. (Typecheck is CSS-blind so this only catches TS issues.)

- [ ] **Step 10: Commit**

```bash
git add packages/ds/src/styles/tokens.css
git commit -m "feat(skin): replace Layer 1 color scales with Abyssal Void palette"
```

---

### Task 2: Replace Layer 1 gradients + shadows in tokens.css

**Files:**
- Modify: `packages/ds/src/styles/tokens.css:101-114`

- [ ] **Step 1: Replace the gradient block (lines 101–109)**

Find this block:

```css
  /* Gradients */
  --gradient-main-base: linear-gradient(90deg, #141421 8.24%, #5100CD 71.81%);
  --gradient-main-dark: linear-gradient(90deg, #1C1C32 8.24%, #5100CD 71.81%);
  --gradient-lime: linear-gradient(90deg, #D6FF00 27.88%, #F5F7DB 100%);
  --gradient-success: linear-gradient(90deg, #36D846 0%, #63E570 100%);
  --gradient-warning: linear-gradient(90deg, #FFE814 0%, #FBAE18 100%);
  --gradient-error: linear-gradient(90deg, #FFAC89 0%, #DE3668 90.62%);
  --gradient-info: linear-gradient(90deg, #C8ADF0 22.66%, #5100CD 244.27%);
  --gradient-destructive: var(--gradient-error);
```

Replace with:

```css
  /* Gradients */
  --gradient-main-base: linear-gradient(90deg, #1A0440 8.24%, #2A0563 71.81%);
  --gradient-main-dark: linear-gradient(90deg, #0a0312 8.24%, #2A0563 71.81%);
  --gradient-accent: linear-gradient(90deg, #00B8D4 0%, #00E1FA 100%);
  --gradient-success: linear-gradient(90deg, #2BD58E 0%, #5DDFAB 100%);
  --gradient-warning: linear-gradient(90deg, #FFE14D 0%, #FFC53D 100%);
  --gradient-error: linear-gradient(90deg, #FF6A3D 0%, #FF3D00 100%);
  --gradient-info: linear-gradient(90deg, #00E1FA 22.66%, #2A0563 244.27%);
  --gradient-destructive: var(--gradient-error);
```

Note: `--gradient-lime` is removed. `--gradient-accent` is the new cyan gradient (replaces lime as the secondary-button gradient). The corresponding `.gradient-fill-lime` → `.gradient-fill-accent` utility class swap happens in Task 5.

- [ ] **Step 2: Replace the shadow block (lines 111–114)**

Find this block:

```css
  /* Shadows */
  --shadow-brand-sm: 0px 4px 4px oklch(0.372 0.254 285.48 / 0.15);
  --shadow-brand: 0px 4px 24px oklch(0.372 0.254 285.48 / 0.1);
  --shadow-brand-lg: 0px 4px 48px oklch(0.372 0.254 285.48 / 0.25);
```

Replace with:

```css
  /* Shadows (anchored on primary-800 oklch(0.27 0.180 270)) */
  --shadow-brand-sm: 0px 4px 4px oklch(0.27 0.180 270 / 0.20);
  --shadow-brand: 0px 4px 24px oklch(0.27 0.180 270 / 0.15);
  --shadow-brand-lg: 0px 4px 48px oklch(0.27 0.180 270 / 0.30);
```

- [ ] **Step 3: Commit**

```bash
git add packages/ds/src/styles/tokens.css
git commit -m "feat(skin): replace gradient + shadow tokens for Abyssal Void"
```

---

### Task 3: Replace fonts + add radius scale in tokens.css

**Files:**
- Modify: `packages/ds/src/styles/tokens.css:116-120`

- [ ] **Step 1: Replace the fonts block (lines 116–119)**

Find this block:

```css
  /* Fonts */
  --font-heading: "rigid-square", ui-sans-serif, system-ui, sans-serif;
  --font-sans: "Titillium Web", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "Source Code Pro", ui-monospace, monospace;
```

Replace with:

```css
  /* Fonts */
  --font-heading: "Anybody", ui-sans-serif, system-ui, sans-serif;
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "Departure Mono", ui-monospace, monospace;

  /* Radius vocabulary (Abyssal Void — 0/0/2/4, full reserved for round-by-design) */
  --radius-sm: 0;
  --radius-md: 0;
  --radius-lg: 2px;
  --radius-xl: 4px;
```

Note: `--radius-full` (`9999px`) is provided by Tailwind defaults; we don't redefine it.

- [ ] **Step 2: Commit**

```bash
git add packages/ds/src/styles/tokens.css
git commit -m "feat(skin): swap fonts to Anybody + Inter + Departure Mono, add radius scale"
```

---

### Task 4: Rewrite Layer 2 semantic tokens

This rewrites the `:root` (light mode) and `.theme-dark` blocks. The same-hex rule means `--primary`, `--accent`, `--success`, `--warn`, `--error` resolve to identical hex literals in both modes.

**Files:**
- Modify: `packages/ds/src/styles/tokens.css:125-162`

- [ ] **Step 1: Replace the `:root` block (lines 125–145)**

Find this block:

```css
:root {
  --background: #F9F4FF;
  --foreground: #141421;
  --primary: var(--color-primary-600);
  --primary-foreground: #ffffff;
  --accent: var(--color-accent-300);
  --accent-foreground: #141421;
  --muted: var(--color-primary-100);
  --muted-foreground: var(--color-neutral-500);
  --surface: var(--color-primary-50);
  --surface-foreground: #141421;
  --edge: var(--color-primary-200);
  --edge-hover: var(--color-primary-300);

  --gradient-main: var(--gradient-main-base);

  --duration-fast: 200ms;
  --duration-normal: 500ms;
  --duration-slow: 700ms;
  --timing: ease-in-out;
}
```

Replace with:

```css
:root {
  --background: oklch(0.99 0.005 270);
  --foreground: oklch(0.22 0.015 270);

  --primary: #2A0563;
  --primary-foreground: #ffffff;
  --accent: #00E1FA;
  --accent-foreground: #001014;
  --success: #2BD58E;
  --success-foreground: #00130a;
  --warn: #ffc53d;
  --warn-foreground: #1a1100;
  --error: #FF3D00;
  --error-foreground: #ffffff;

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

- [ ] **Step 2: Replace the `.theme-dark` block (lines 147–162)**

Find this block:

```css
.theme-dark {
  --background: #141421;
  --foreground: #F9F4FF;
  --primary: var(--color-primary-400);
  --primary-foreground: #ffffff;
  --accent: var(--color-accent-300);
  --accent-foreground: #141421;
  --muted: var(--color-base-900);
  --muted-foreground: var(--color-neutral-400);
  --surface: var(--color-base-900);
  --surface-foreground: #F9F4FF;
  --edge: var(--color-base-800);
  --edge-hover: var(--color-base-700);

  --gradient-main: var(--gradient-main-dark);
}
```

Replace with:

```css
.theme-dark {
  --background: #07080a;
  --foreground: #f3f3f3;

  --primary: #2A0563;
  --primary-foreground: #ffffff;
  --accent: #00E1FA;
  --accent-foreground: #001014;
  --success: #2BD58E;
  --success-foreground: #00130a;
  --warn: #ffc53d;
  --warn-foreground: #1a1100;
  --error: #FF3D00;
  --error-foreground: #ffffff;

  --muted: var(--color-base-800);
  --muted-foreground: oklch(0.62 0.012 273);
  --surface: var(--color-base-900);
  --surface-foreground: #f3f3f3;
  --edge: rgba(255, 255, 255, 0.08);
  --edge-hover: rgba(255, 255, 255, 0.14);

  --gradient-main: var(--gradient-main-dark);
}
```

- [ ] **Step 3: Commit**

```bash
git add packages/ds/src/styles/tokens.css
git commit -m "feat(skin): rewrite Layer 2 semantic tokens with same-hex Abyssal accents"
```

---

### Task 5: Extend Layer 3 Tailwind bridge

Add `--color-success`, `--color-warn`, `--color-error` (and their `-foreground` pairs) to the `@theme inline` block so the new semantic tokens become Tailwind utility classes (`bg-success`, `text-error`, etc.).

**Files:**
- Modify: `packages/ds/src/styles/tokens.css:167-180`

- [ ] **Step 1: Replace the `@theme inline` block (lines 167–180)**

Find this block:

```css
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-surface: var(--surface);
  --color-surface-foreground: var(--surface-foreground);
  --color-edge: var(--edge);
  --color-edge-hover: var(--edge-hover);
}
```

Replace with:

```css
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-success: var(--success);
  --color-success-foreground: var(--success-foreground);
  --color-warn: var(--warn);
  --color-warn-foreground: var(--warn-foreground);
  --color-error: var(--error);
  --color-error-foreground: var(--error-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-surface: var(--surface);
  --color-surface-foreground: var(--surface-foreground);
  --color-edge: var(--edge);
  --color-edge-hover: var(--edge-hover);
}
```

- [ ] **Step 2: Commit**

```bash
git add packages/ds/src/styles/tokens.css
git commit -m "feat(skin): surface success/warn/error semantic tokens in Tailwind bridge"
```

---

### Task 6: Replace `.gradient-fill-lime` with `.gradient-fill-accent`

**Files:**
- Modify: `packages/ds/src/styles/tokens.css:233-245`

- [ ] **Step 1: Replace the `.gradient-fill-lime` block (lines 233–245)**

Find this block:

```css
.gradient-fill-lime {
  background: var(--gradient-lime) border-box;
}
.gradient-fill-lime:hover {
  background:
    linear-gradient(oklch(0 0 0 / 0.06), oklch(0 0 0 / 0.06)) border-box,
    var(--gradient-lime) border-box;
}
.gradient-fill-lime:active {
  background:
    linear-gradient(oklch(0 0 0 / 0.12), oklch(0 0 0 / 0.12)) border-box,
    var(--gradient-lime) border-box;
}
```

Replace with:

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

- [ ] **Step 2: Run lint + typecheck on the DS package**

Run: `npm run lint -w @stasho/ds && npm run typecheck -w @stasho/ds`
Expected: pass.

- [ ] **Step 3: Commit**

```bash
git add packages/ds/src/styles/tokens.css
git commit -m "feat(skin): replace gradient-fill-lime utility with gradient-fill-accent"
```

---

### Task 7: Self-host Departure Mono in preview app

Departure Mono is distributed free from departuremono.com. The DS package itself ships only token references — consumers (including the preview app) are responsible for loading the actual font binary.

**Files:**
- Create: `apps/preview/public/fonts/DepartureMono.woff2`
- Modify: `apps/preview/src/app/globals.css`

- [ ] **Step 1: Create the fonts directory and download the font file**

```bash
mkdir -p apps/preview/public/fonts
curl -fsSL "https://departuremono.com/assets/DepartureMono-Regular.woff2" \
  -o apps/preview/public/fonts/DepartureMono.woff2
ls -l apps/preview/public/fonts/DepartureMono.woff2
```

Expected: file exists, ~17 KB. If the URL returns 404, inspect departuremono.com to locate the current woff2 asset path and retry.

- [ ] **Step 2: Add `@font-face` to `apps/preview/src/app/globals.css`**

Read the current file:

```bash
cat apps/preview/src/app/globals.css
```

After the existing `@import "tailwindcss";` and `@import "../../../../packages/ds/src/styles/tokens.css";` lines (and any `@source` directives), add this block before the `html { ... }` rule:

```css
@font-face {
  font-family: "Departure Mono";
  src: url("/fonts/DepartureMono.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/preview/public/fonts/DepartureMono.woff2 apps/preview/src/app/globals.css
git commit -m "feat(skin): self-host Departure Mono in preview app"
```

---

### Task 8: Update preview app font links (Anybody + Inter)

**Files:**
- Modify: `apps/preview/src/app/layout.tsx:18-25`

- [ ] **Step 1: Replace the `<head>` font links**

Find this block in `apps/preview/src/app/layout.tsx`:

```tsx
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="https://use.typekit.net/acb7qvn.css" />
        <link
          href="https://fonts.googleapis.com/css2?family=Titillium+Web:ital,wght@0,400;0,700;1,400&family=Source+Code+Pro:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
```

Replace with:

```tsx
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Anybody:wdth,wght@75..125,400;75..125,700;75..125,900&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
```

Note: Typekit (`acb7qvn`) loaded `rigid-square` for headings; that link is removed. Departure Mono is self-hosted (Task 7), not in this link.

- [ ] **Step 2: Start the dev server and visually verify fonts**

```bash
npm run dev
```

Open `http://localhost:3000`, confirm:
- Headings render in Anybody (heavy, brutalist, all-caps possible)
- Body text renders in Inter
- Any mono content renders in Departure Mono (pixel/CRT style)

Stop the dev server.

- [ ] **Step 3: Commit**

```bash
git add apps/preview/src/app/layout.tsx
git commit -m "feat(skin): swap preview fonts to Anybody + Inter (Departure self-hosted)"
```

---

### Task 9: Update Button — radius 0, swap lime → accent, update text variant comments

**Files:**
- Modify: `packages/ds/src/components/button/button.tsx:17, 30`

- [ ] **Step 1: Replace base class `rounded-full` with `rounded-none`**

In `packages/ds/src/components/button/button.tsx`, find line 17:

```tsx
    "rounded-full border-3 transition-colors",
```

Replace with:

```tsx
    "rounded-none border-3 transition-colors",
```

- [ ] **Step 2: Update the `secondary` variant to use `gradient-fill-accent`**

Find this block (lines ~29-32):

```tsx
        secondary: [
          "gradient-fill-lime text-neutral-950 border-neutral-950",
          "disabled:opacity-50",
        ].join(" "),
```

Replace with:

```tsx
        secondary: [
          "gradient-fill-accent text-accent-foreground border-transparent",
          "disabled:opacity-50",
        ].join(" "),
```

- [ ] **Step 3: Run button tests**

```bash
npm test -w @stasho/ds -- button/button.test.tsx
```

Expected: all tests pass. The button tests do not assert on radius or the specific lime/accent class — they test variant existence and rendered structure.

- [ ] **Step 4: Commit**

```bash
git add packages/ds/src/components/button/button.tsx
git commit -m "feat(skin): Button radius 0, secondary variant uses gradient-fill-accent"
```

---

### Task 10: Update Input — radius 0

**Files:**
- Modify: `packages/ds/src/components/input/input.tsx:8`

- [ ] **Step 1: Replace `rounded-full` with `rounded-none`**

In `packages/ds/src/components/input/input.tsx`, find line 8:

```tsx
    "border-0 rounded-full",
```

Replace with:

```tsx
    "border-0 rounded-none",
```

- [ ] **Step 2: Run input tests**

```bash
npm test -w @stasho/ds -- input/input.test.tsx
```

Expected: pass.

- [ ] **Step 3: Commit**

```bash
git add packages/ds/src/components/input/input.tsx
git commit -m "feat(skin): Input radius 0"
```

---

### Task 11: Update Textarea — radius 0

**Files:**
- Modify: `packages/ds/src/components/textarea/textarea.tsx:7`

- [ ] **Step 1: Replace `rounded-2xl` with `rounded-none`**

In `packages/ds/src/components/textarea/textarea.tsx`, find line 7:

```tsx
    "border-0 rounded-2xl",
```

Replace with:

```tsx
    "border-0 rounded-none",
```

- [ ] **Step 2: Run textarea tests**

```bash
npm test -w @stasho/ds -- textarea/textarea.test.tsx
```

Expected: pass.

- [ ] **Step 3: Commit**

```bash
git add packages/ds/src/components/textarea/textarea.tsx
git commit -m "feat(skin): Textarea radius 0"
```

---

### Task 12: Update Select — trigger + dropdown radius 0

**Files:**
- Modify: `packages/ds/src/components/select/select.tsx:11, 85`

- [ ] **Step 1: Replace trigger `rounded-full`**

In `packages/ds/src/components/select/select.tsx`, find line 11:

```tsx
    "border-0 rounded-full",
```

Replace with:

```tsx
    "border-0 rounded-none",
```

- [ ] **Step 2: Replace dropdown content `rounded-2xl` and items `rounded-xl`**

Find line 85 (the `SelectPrimitive.Content` className):

```tsx
              "z-50 overflow-hidden rounded-2xl",
```

Replace with:

```tsx
              "z-50 overflow-hidden rounded-none",
```

Find the `SelectPrimitive.Item` className (around line 98):

```tsx
                    "relative flex items-center rounded-xl px-4 py-2",
```

Replace with:

```tsx
                    "relative flex items-center rounded-none px-4 py-2",
```

- [ ] **Step 3: Run select tests**

```bash
npm test -w @stasho/ds -- select/select.test.tsx
```

Expected: pass.

- [ ] **Step 4: Commit**

```bash
git add packages/ds/src/components/select/select.tsx
git commit -m "feat(skin): Select trigger + dropdown radius 0"
```

---

### Task 13: Update Combobox — trigger + dropdown radius 0

**Files:**
- Modify: `packages/ds/src/components/combobox/combobox.tsx:11, 108, 137`

- [ ] **Step 1: Replace trigger `rounded-full`**

In `packages/ds/src/components/combobox/combobox.tsx`, find line 11:

```tsx
    "border-0 rounded-full",
```

Replace with:

```tsx
    "border-0 rounded-none",
```

- [ ] **Step 2: Replace popover content `rounded-2xl` and items `rounded-xl`**

Find the `Popover.Content` className (around line 108):

```tsx
              "overflow-hidden rounded-2xl",
```

Replace with:

```tsx
              "overflow-hidden rounded-none",
```

Find the `Command.Item` className (around line 137):

```tsx
                      "relative flex items-center rounded-xl px-4 py-2",
```

Replace with:

```tsx
                      "relative flex items-center rounded-none px-4 py-2",
```

- [ ] **Step 3: Run combobox tests**

```bash
npm test -w @stasho/ds -- combobox/combobox.test.tsx
```

Expected: pass.

- [ ] **Step 4: Commit**

```bash
git add packages/ds/src/components/combobox/combobox.tsx
git commit -m "feat(skin): Combobox trigger + dropdown radius 0"
```

---

### Task 14: Update MultiSelect — trigger + dropdown radius 0 (tag chips keep round)

The MultiSelect trigger and dropdown switch to square. The tag chips inside the trigger and the per-tag dismiss buttons keep `rounded-full` — chips are intentionally round.

**Files:**
- Modify: `packages/ds/src/components/multi-select/multi-select.tsx:13, 227, 263`

- [ ] **Step 1: Replace trigger `rounded-2xl`**

In `packages/ds/src/components/multi-select/multi-select.tsx`, find line 13:

```tsx
    "border-0 rounded-2xl",
```

Replace with:

```tsx
    "border-0 rounded-none",
```

- [ ] **Step 2: Replace popover content `rounded-2xl`**

Find the `Popover.Content` className (around line 227):

```tsx
              "overflow-hidden rounded-2xl",
```

Replace with:

```tsx
              "overflow-hidden rounded-none",
```

- [ ] **Step 3: Replace `Command.Item` `rounded-xl`**

Find around line 263:

```tsx
                        "rounded-xl px-3 py-2",
```

Replace with:

```tsx
                        "rounded-none px-3 py-2",
```

- [ ] **Step 4: Verify tag chip and dismiss button remain rounded-full**

Run: `grep -n "rounded-full" packages/ds/src/components/multi-select/multi-select.tsx`
Expected: matches on the tag variant (line ~33: `"inline-flex items-center gap-1 rounded-full bg-muted"`), the per-tag dismiss button (line ~160), and the clear-all button (line ~190). These are intentional — leave them.

- [ ] **Step 5: Run multi-select tests**

```bash
npm test -w @stasho/ds -- multi-select/multi-select.test.tsx
```

Expected: pass.

- [ ] **Step 6: Commit**

```bash
git add packages/ds/src/components/multi-select/multi-select.tsx
git commit -m "feat(skin): MultiSelect trigger + dropdown radius 0 (chips stay round)"
```

---

### Task 15: Update Pagination — page + nav buttons radius 0

**Files:**
- Modify: `packages/ds/src/components/pagination/pagination.tsx:83, 94`

- [ ] **Step 1: Replace `NAV_BUTTON` `rounded-full`**

In `packages/ds/src/components/pagination/pagination.tsx`, find the `NAV_BUTTON` constant (lines 81-88):

```tsx
const NAV_BUTTON = [
  "inline-flex items-center justify-center",
  "size-8 rounded-full",
  ...
```

Change `"size-8 rounded-full"` to `"size-8 rounded-none"`.

- [ ] **Step 2: Replace `PAGE_BUTTON` `rounded-full`**

Find the `PAGE_BUTTON` constant (lines 92-100):

```tsx
const PAGE_BUTTON = [
  "inline-flex items-center justify-center",
  "size-8 rounded-full",
  ...
```

Change `"size-8 rounded-full"` to `"size-8 rounded-none"`.

- [ ] **Step 3: Run pagination tests**

```bash
npm test -w @stasho/ds -- pagination/pagination.test.tsx
```

Expected: pass. Pagination tests do not assert on radius (they test page-range computation and active state).

- [ ] **Step 4: Commit**

```bash
git add packages/ds/src/components/pagination/pagination.tsx
git commit -m "feat(skin): Pagination page + nav buttons radius 0"
```

---

### Task 16: Update Card — radius 2px (rounded-sm)

**Files:**
- Modify: `packages/ds/src/components/card/card.tsx:5`

- [ ] **Step 1: Replace `rounded-md` with `rounded-sm`**

In `packages/ds/src/components/card/card.tsx`, find line 5:

```tsx
const cardVariants = cva("rounded-md", {
```

Replace with:

```tsx
const cardVariants = cva("rounded-sm", {
```

Tailwind 4 picks up `--radius-sm` from the `@theme` block we set in Task 3 (which is `0`) for `rounded-sm`. Wait — that maps `rounded-sm` to 0, not 2px. **Use an arbitrary value instead:**

Actually, replace with:

```tsx
const cardVariants = cva("rounded-[2px]", {
```

This gives the card a literal 2px corner radius regardless of the Tailwind radius scale mapping.

- [ ] **Step 2: Run card tests**

```bash
npm test -w @stasho/ds -- card/card.test.tsx
```

Expected: pass. Card tests do not assert on radius.

- [ ] **Step 3: Commit**

```bash
git add packages/ds/src/components/card/card.tsx
git commit -m "feat(skin): Card radius 2px"
```

---

### Task 17: Update Dialog — content radius 4px

**Files:**
- Modify: `packages/ds/src/components/dialog/dialog.tsx:41, 59`

- [ ] **Step 1: Replace content `rounded-md`**

In `packages/ds/src/components/dialog/dialog.tsx`, find line 41:

```tsx
            "relative w-full max-w-md rounded-md bg-surface p-6 shadow-brand-lg",
```

Replace with:

```tsx
            "relative w-full max-w-md rounded-[4px] bg-surface p-6 shadow-brand-lg",
```

- [ ] **Step 2: Update DialogClose `rounded-sm` (the focus ring on the X button)**

Find line 59 (the X close button):

```tsx
                "absolute top-4 right-4 rounded-sm",
```

Replace with:

```tsx
                "absolute top-4 right-4 rounded-none",
```

- [ ] **Step 3: Run dialog tests**

```bash
npm test -w @stasho/ds -- dialog/dialog.test.tsx
```

Expected: pass.

- [ ] **Step 4: Commit**

```bash
git add packages/ds/src/components/dialog/dialog.tsx
git commit -m "feat(skin): Dialog content radius 4px, close button square"
```

---

### Task 18: Update Badge — radius 0 default

**Files:**
- Modify: `packages/ds/src/components/badge/badge.tsx:7`
- Modify: `packages/ds/src/components/badge/badge.test.tsx` (test asserting `rounded-md`)

- [ ] **Step 1: Replace badge base `rounded-md`**

In `packages/ds/src/components/badge/badge.tsx`, find line 7:

```tsx
    "rounded-md font-heading font-extrabold italic uppercase",
```

Replace with:

```tsx
    "rounded-none font-heading font-extrabold italic uppercase",
```

- [ ] **Step 2: Update the badge test that asserts `rounded-md`**

Run: `grep -n "rounded-md" packages/ds/src/components/badge/badge.test.tsx`
Expected: lines 182–184 reference `rounded-md`.

In `packages/ds/src/components/badge/badge.test.tsx`, find these lines (around 182-184):

```tsx
    it("applies rounded-md", () => {
      const { container } = render(<Badge>Tag</Badge>);
      expect(container.firstElementChild?.className).toContain("rounded-md");
```

Replace with:

```tsx
    it("applies rounded-none", () => {
      const { container } = render(<Badge>Tag</Badge>);
      expect(container.firstElementChild?.className).toContain("rounded-none");
```

- [ ] **Step 3: Run badge tests**

```bash
npm test -w @stasho/ds -- badge/badge.test.tsx
```

Expected: pass.

- [ ] **Step 4: Commit**

```bash
git add packages/ds/src/components/badge/badge.tsx packages/ds/src/components/badge/badge.test.tsx
git commit -m "feat(skin): Badge radius 0, update test"
```

---

### Task 19: Update Alert — radius 0

The Alert's gradient background classes (`alert-bg-error`, etc.) re-derive automatically from the new `--color-error-*` / `--color-warning-*` / `--color-success-*` / `--color-primary-*` scales we replaced in Task 1. Only the corner radius needs an explicit change.

**Files:**
- Modify: `packages/ds/src/components/alert/alert.tsx:33`

- [ ] **Step 1: Replace alert `rounded-sm` with `rounded-none`**

In `packages/ds/src/components/alert/alert.tsx`, find line 33:

```tsx
    "relative overflow-hidden rounded-sm border",
```

Replace with:

```tsx
    "relative overflow-hidden rounded-none border",
```

- [ ] **Step 2: Run alert tests**

```bash
npm test -w @stasho/ds -- alert/alert.test.tsx
```

Expected: pass.

- [ ] **Step 3: Commit**

```bash
git add packages/ds/src/components/alert/alert.tsx
git commit -m "feat(skin): Alert radius 0"
```

---

### Task 20: Sweep for remaining `gradient-fill-lime` references

Verify no preview-app or test references to the removed `gradient-fill-lime` utility remain.

- [ ] **Step 1: Grep for any lingering lime references**

```bash
grep -rn "gradient-fill-lime\|gradient-lime" \
  packages/ds/src \
  apps/preview/src \
  --include="*.ts" --include="*.tsx" --include="*.css" --include="*.md" \
  2>/dev/null || echo "(none found)"
```

Expected: no matches (the utility was used only by Button's secondary variant, replaced in Task 9). If any preview-app page or doc references it, update to `gradient-fill-accent`.

- [ ] **Step 2: Grep for `text-neutral-950` on lime-replacement Button usage**

The old secondary variant used `text-neutral-950` for the dark-on-lime text. After Task 9 it became `text-accent-foreground`. If anything in the preview app explicitly relies on `gradient-fill-lime` or `text-neutral-950` for a lime-style fill, update it.

```bash
grep -rn "gradient-fill-lime\|gradient-fill-secondary" apps/preview/src 2>/dev/null || echo "(none found)"
```

Expected: no matches.

- [ ] **Step 3: Commit if anything was fixed**

```bash
git status
# if changes:
git add -A
git commit -m "fix(skin): clean up stale lime references"
```

---

### Task 21: Run full check pipeline

- [ ] **Step 1: Lint, typecheck, and test all workspaces**

```bash
npm run check
```

Expected: lint, typecheck, all tests pass. If anything fails, fix the root cause before continuing.

Common failure mode: a snapshot test or className assertion expecting the old class string. Fix the test to match the new behavior — never preserve the old token name in code just to make a stale test pass.

- [ ] **Step 2: Run the static build**

```bash
npm run build
```

Expected: build succeeds, no Tailwind scanner warnings, static export written to `apps/preview/out/`.

If the build complains about missing CSS variables (e.g., `var(--color-warn)` resolves to nothing), the Layer 3 bridge in Task 5 may have been missed — re-check `packages/ds/src/styles/tokens.css` for the `--color-warn` / `--color-error` / `--color-success` entries inside `@theme inline { ... }`.

- [ ] **Step 3: No commit needed if everything passes**

---

### Task 22: Visual walkthrough in the preview app

- [ ] **Step 1: Start the dev server**

```bash
npm run dev
```

Open `http://localhost:3000`.

- [ ] **Step 2: Verify each preview page in both themes**

Click through these pages, toggling between light and dark theme on each:

- `/` — overview
- `/foundations/colors` — confirm primary scale is deep purple (H 270), accent is cyan (H 215), success is teal-green (H 160), error is blood-orange (H 25)
- `/foundations/typography` — Anybody headings, Inter body, Departure Mono samples
- `/components/button` — all six variants, square corners, secondary is cyan gradient (not lime)
- `/components/input` — square corners
- `/components/textarea` — square corners
- `/components/select` — square trigger and dropdown
- `/components/combobox` — square trigger and dropdown
- `/components/multi-select` — square trigger but tag chips stay round
- `/components/pagination` — square page buttons
- `/components/card` — 2px corner radius
- `/components/dialog` — 4px corner radius, frosted overlay still works
- `/components/badge` — square badges
- `/components/alert` — error variant gradient is blood-orange tinted
- `/components/status-dot` — still round
- `/components/slider` — thumb still round
- `/components/progress-bar` — track still round
- `/components/switch` — thumb still round
- `/components/stepper` — indicators still round
- `/components/tabs` — default tab indicator unchanged; pill variant chips still round

- [ ] **Step 3: Verify same-hex rule via devtools**

On `/foundations/colors`, open browser devtools, inspect a primary swatch and an accent swatch. Toggle theme. Confirm `--primary` and `--accent` show the same hex value (`#2A0563` and `#00E1FA`) in both modes.

- [ ] **Step 4: Stop the dev server. Commit anything that needed fixing.**

If you spotted any issue and fixed it in code:

```bash
git status
git add <files>
git commit -m "fix(skin): <description of what was off>"
```

---

### Task 23: Delete the paraplu exploration page

**Files:**
- Delete: `apps/preview/src/app/paraplu/page.tsx`
- Delete: `apps/preview/src/app/paraplu/` (directory if empty)

- [ ] **Step 1: Confirm no other code references the paraplu route**

```bash
grep -rn "paraplu" apps/preview/src/ packages/ds/src/ 2>/dev/null
```

Expected: matches only inside `apps/preview/src/app/paraplu/page.tsx` itself, and possibly the sidebar nav if a link was added. If the sidebar links to it, remove the entry.

- [ ] **Step 2: Delete the page and directory**

```bash
trash apps/preview/src/app/paraplu/page.tsx
rmdir apps/preview/src/app/paraplu 2>/dev/null || true
```

- [ ] **Step 3: Verify build still works**

```bash
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add -A apps/preview/src/app/paraplu
git commit -m "chore(skin): remove paraplu exploration page now that the palette is locked"
```

---

### Task 24: Delete the obsolete plan file

The earlier plan at `docs/superpowers/plans/2026-05-26-abyssal-skin.md` was written against the original Abyssal direction and is now superseded by this Void edition plan.

- [ ] **Step 1: Delete the old plan file**

```bash
trash docs/superpowers/plans/2026-05-26-abyssal-skin.md
```

- [ ] **Step 2: Commit**

```bash
git add -A docs/superpowers/plans/2026-05-26-abyssal-skin.md
git commit -m "chore(skin): remove superseded abyssal-skin plan (replaced by abyssal-void)"
```

---

### Task 25: Update docs

- [ ] **DESIGN-SYSTEM.md — new tokens, components, hooks, or patterns**

In `docs/DESIGN-SYSTEM.md`, update or add sections to reflect:

- **Colors**: primary deep purple `#2A0563` (H 270), accent cyan `#00E1FA` (H 215), success teal-green `#2BD58E` (H 160), warn amber `#ffc53d` (H 87), error blood-orange `#FF3D00` (H 25). Same-hex rule across light and dark for accents.
- **Surfaces (dark)**: Observatory Mono ladder `#07080a → #0d0d0d → #101111 → #161718` with white-low-opacity hairline borders `rgba(255,255,255,0.08)`.
- **Surfaces (light)**: off-white ladder with hue-270 tint, `oklch(0.99 0.005 270) → oklch(0.87 0.013 270)`.
- **Radius**: vocabulary 0/0/2/4 — buttons, inputs, chips square at 0; cards 2; modals 4; `rounded-full` reserved for StatusDot, Slider thumb, ProgressBar tracks, Switch thumb, MultiSelect chips, Stepper indicators, Tabs pill variant.
- **Typography**: Anybody (headings, weight 900, uppercase, tracking `-0.02em`), Inter (body), Departure Mono (mono — self-hosted, see below).
- **Light-mode contrast pattern**: any inline accent-colored text uses the standard "darker step for light, lighter step for dark" pattern (`text-{color}-500 dark:text-{color}-300`) — same-hex applies only to fills, borders, indicators.
- **Consumer font loading**: DS ships token references; consumers load fonts themselves. Anybody + Inter via Google Fonts. Departure Mono is self-hosted; copy the woff2 from `apps/preview/public/fonts/` or download from departuremono.com and declare via `@font-face`.

- [ ] **ARCHITECTURE.md — new patterns, new files, or changed structure**

In `docs/ARCHITECTURE.md`, document:

- **Same-hex semantic accent rule**: `--primary`, `--accent`, `--success`, `--warn`, `--error` are hex literals (not scale references) in both `:root` and `.theme-dark`. Background, foreground, muted, surface still swap per theme.
- **New Layer 3 bridge entries**: `--color-success`, `--color-warn`, `--color-error` (and `-foreground` pairs) now surfaced as Tailwind utilities.
- **New radius scale**: 0/0/2/4 with `--radius-sm/md` both literally `0`. When you need a small non-zero radius, use a literal arbitrary value like `rounded-[2px]` instead of an out-of-scale Tailwind step.
- **Font loading boundary**: DS package never bundles font binaries. Consumers self-host Departure Mono or load it from a CDN. Reference: Decision #78.

- [ ] **CLAUDE.md — Current Features list if user-facing behavior changed**

In the `## Project: stasho design system` → `### Current Features` list in `CLAUDE.md`, find the bullet describing the current skin (mentions "purple + lime", "gradient-main", or similar Aleph-Cloud references) and replace those bullets with:

```
- Abyssal Void skin: deep purple `#2A0563` primary + cyan `#00E1FA` accent + teal-green `#2BD58E` success + amber `#ffc53d` warn + blood-orange `#FF3D00` error, same hex in both modes (Radix step-9 convention)
- Observatory Mono dark surface ladder (`#07080a → #161718`), faintly violet-tinted off-white light ladder (hue 270)
- Radius vocabulary 0/0/2/4 — `full` reserved for StatusDot, Slider, ProgressBar tracks, Switch thumb, MultiSelect chips, Stepper indicators, Tabs pill variant
- Typography: Anybody (headings), Inter (body), Departure Mono (telemetry/labels — self-hosted)
```

- [ ] **DECISIONS.md — design decisions made during this feature**

Already updated with Decision #78 before plan was written. No further change needed unless a sub-decision came up during execution.

- [ ] **BACKLOG.md — completed items moved, deferred ideas added**

In `docs/BACKLOG.md`:
- If there's an active backlog entry "Adopt new skin" or similar, move it to the Completed section.
- Add any deferred ideas surfaced during implementation, e.g.:
  - "Adopt Grilli Type for headings once budget is approved" (carried over from #77/#78)
  - "Switch accent-colored body text to a contrast-aware scale step (`text-accent-700 dark:text-accent-300`) once a real cyan-text moment lands"

- [ ] **Commit docs**

```bash
git add docs/ CLAUDE.md
git commit -m "docs(skin): update DS docs for Abyssal Void edition"
```

---

### Task 26: Final smoke test, push, open PR

- [ ] **Step 1: Run `npm run check` one final time**

```bash
npm run check
```

Expected: all green.

- [ ] **Step 2: Run the build**

```bash
npm run build
```

Expected: build succeeds, no warnings.

- [ ] **Step 3: Push the branch**

```bash
git push -u origin skin/paraplu
```

- [ ] **Step 4: Open the PR**

```bash
gh pr create --title "Abyssal Void: brutalist edition of the Abyssal skin" --body "$(cat <<'EOF'
## Summary
- Replace primary/accent/success/warning/error color scales with the Abyssal Void palette: deep purple `#2A0563`, cyan `#00E1FA`, teal-green `#2BD58E`, amber `#ffc53d`, blood-orange `#FF3D00`.
- Same-hex rule: accents use identical hex literals in `:root` and `.theme-dark`.
- Observatory Mono dark surfaces (`#07080a → #161718`) with white-low-opacity hairline borders; off-white-with-violet-tint light surfaces.
- Radius vocabulary 0/0/2/4 — buttons, inputs, chips, dropdowns square; cards 2px; modals 4px. `full` reserved for round-by-design elements.
- Typography: Anybody (headings, Google Fonts) + Inter (body, Google Fonts) + Departure Mono (mono, self-hosted in preview app).
- Delete `gradient-fill-lime`, add `gradient-fill-accent` for the new secondary button.

Spec: `docs/superpowers/specs/2026-05-26-abyssal-void-design.md`
Decision: #78 (supersedes #77)

## Test plan
- [ ] `npm run check` passes
- [ ] `npm run build` succeeds (static export)
- [ ] Walk every preview page in both light and dark mode (see plan Task 22)
- [ ] Confirm `--primary` and `--accent` resolve to identical hex in both modes via devtools
- [ ] Confirm intentionally-round elements still render as pills (StatusDot, ProgressBar, Slider, Switch, MultiSelect chips, Tabs pill)
EOF
)"
```

- [ ] **Step 5: Return the PR URL to the user**

---

## Self-Review

**Spec coverage:**

| Spec section | Plan task |
|---|---|
| Layer 1 color scales (primary, accent, success, warn, error, neutral, base) | Task 1 |
| Layer 1 gradients + shadows | Task 2 |
| Layer 1 fonts + radius | Task 3 |
| Layer 2 semantic tokens (:root + .theme-dark, same-hex rule) | Task 4 |
| Layer 3 Tailwind bridge (new success/warn/error utilities) | Task 5 |
| gradient-fill-lime → gradient-fill-accent | Task 6 |
| Departure Mono self-hosting | Task 7 |
| Preview app font links (Anybody + Inter) | Task 8 |
| Button (radius 0, secondary uses accent, error variant text colors derive from new error scale) | Task 9 |
| Input / Textarea / Select / Combobox / MultiSelect / Pagination / Card / Dialog / Badge / Alert radius | Tasks 10–19 |
| Lime cleanup sweep | Task 20 |
| Full check + visual walk | Tasks 21–22 |
| Cleanup (paraplu page, old plan) | Tasks 23–24 |
| Docs (DESIGN-SYSTEM, ARCHITECTURE, CLAUDE.md, BACKLOG) | Task 25 |
| Ship (push, PR) | Task 26 |

**Placeholder scan:** No "TBD" / "TODO" / "implement later" anywhere. Every code step shows the exact old block and the exact new block. Every command has expected output. The DESIGN-SYSTEM.md update in Task 25 lists specific facts to add rather than handing the engineer a paraphrased task — those bullets contain the concrete colors, ladders, and patterns.

**Type / name consistency:**
- `--color-warn` (not `--color-warning`) is used in Layer 3 bridge for Tailwind — the underlying scale variable is `--color-warning-*`, but the semantic token is `--warn`. This matches the original plan's naming and the spec.
- `gradient-fill-accent` referenced in Task 9 step 2 is defined in Task 6.
- `--color-base-950` introduced in Task 1 step 8 is used by `--background` in Task 4's `.theme-dark` (implicitly — we use the literal `#07080a` to avoid coupling).
- `--radius-sm/md` both `0` in Task 3 — Card (Task 16) and Dialog (Task 17) use literal arbitrary values `rounded-[2px]` and `rounded-[4px]` to avoid being captured by the 0 scale step.

**Known risks during execution:**
- Departure Mono URL might 404 if the site reorganizes its CDN paths. Mitigation in Task 7 step 1: fall back to inspecting departuremono.com manually.
- Light-mode contrast on accent text isn't fixed by this plan — it's documented as a pattern in DESIGN-SYSTEM.md (Task 25). Any specific component that ends up rendering accent-colored inline text on a light surface should switch to the `text-{color}-500 dark:text-{color}-300` pattern locally. Address such instances during Task 22 visual walk if spotted.
- Some component tests may still reference removed/changed class strings that grep didn't catch. The check pipeline (Task 21) is the safety net.
