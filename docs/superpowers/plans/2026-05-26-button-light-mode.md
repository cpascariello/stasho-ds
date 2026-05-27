# Button Light-Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a light-mode treatment to the Button component so Primary/Secondary/Outline/Ghost are legible and differentiated on the light-violet off-white background, and Disabled visibly flattens. Dark mode preserved verbatim.

**Architecture:** Light-mode classes become the base in each CVA variant; existing dark-mode classes are re-qualified with `dark:` and preserved. No new tokens, keyframes, or component files. Direction A from the spec: brand-blue Primary chassis, light raised Secondary chassis, primary-blue Outline.

**Tech Stack:** TypeScript, React, CVA, Tailwind 4 with `@custom-variant dark` against `.theme-dark`, Vitest, Next.js 16 preview app.

**Reference:** [`docs/superpowers/specs/2026-05-26-button-light-mode-design.md`](../specs/2026-05-26-button-light-mode-design.md)

---

## File Structure

**Modify:**
- `packages/ds/src/components/button/button.tsx` — CVA variant class strings + `ledColorClass` + `iconGlowClass` maps.
- `docs/SKIN-PRINCIPLES.md` — § 2 Same-hex rule, § 6 Disabled flattens.
- `docs/DESIGN-SYSTEM.md` — Button section, add light-mode subsection.
- `docs/DECISIONS.md` — log Decision #82.
- `docs/BACKLOG.md` — move "Button light-mode treatment" to Completed.
- `CLAUDE.md` — Current Features Button line.

**Tests:** `packages/ds/src/components/button/button.test.tsx` — no changes (existing structural assertions cover all behavior; visual treatment isn't unit-testable).

**Out of scope for this chunk:** dark-mode Outline disabled chassis (currently transparent — a pre-existing inconsistency with other variants). Will file as backlog.

---

## Task 1: Create chunk branch

**Files:** none (git only)

- [ ] **Step 1: Verify we're on `skin/paraplu` and clean**

Run: `git status`
Expected: `On branch skin/paraplu` and working tree clean (untracked PNGs are fine — leave them).

- [ ] **Step 2: Pull latest integration branch state**

Run: `git pull --ff-only origin skin/paraplu`
Expected: fast-forward or already up to date.

- [ ] **Step 3: Create the chunk branch**

Run: `git checkout -b skin/button-light-mode`
Expected: switched to a new branch.

---

## Task 2: Update Primary variant in button.tsx

**Files:**
- Modify: `packages/ds/src/components/button/button.tsx:25-32`

- [ ] **Step 1: Replace the Primary variant class block**

Find the existing `primary:` entry in the `buttonVariants` CVA variants config (currently spans lines 25–32) and replace it with:

```ts
        primary: [
          // light (base): brand-blue chassis at primary-400/500
          "bg-[linear-gradient(180deg,var(--color-primary-400)_0%,var(--color-primary-500)_100%)]",
          "[box-shadow:inset_0_1px_0_rgba(0,225,250,0.55),inset_0_-1px_0_rgba(0,0,0,0.35)]",
          "hover:bg-[linear-gradient(180deg,var(--color-primary-300)_0%,var(--color-primary-400)_100%)]",
          "hover:[box-shadow:inset_0_1px_0_rgba(0,225,250,0.7),inset_0_-1px_0_rgba(0,0,0,0.35),0_0_20px_rgba(0,64,255,0.35)]",
          "disabled:bg-muted disabled:bg-none disabled:text-foreground/30",
          "disabled:[box-shadow:inset_0_0_0_1px_rgba(20,15,40,0.06)]",
          // dark (overrides — current shipped behavior)
          "dark:bg-[linear-gradient(180deg,var(--color-primary-900)_0%,var(--color-primary-950)_100%)]",
          "dark:[box-shadow:inset_0_1px_0_rgba(0,225,250,0.4),inset_0_-1px_0_rgba(0,0,0,0.6),0_1px_0_rgba(255,255,255,0.05)]",
          "dark:hover:bg-[linear-gradient(180deg,var(--color-primary-700)_0%,var(--color-primary-900)_100%)]",
          "dark:hover:[box-shadow:inset_0_1px_0_rgba(0,225,250,0.6),inset_0_-1px_0_rgba(0,0,0,0.6),0_0_20px_rgba(0,64,255,0.4)]",
          "dark:disabled:bg-neutral-900 dark:disabled:bg-none dark:disabled:text-white/30",
          "dark:disabled:[box-shadow:inset_0_1px_0_rgba(255,255,255,0.03),inset_0_-1px_0_rgba(0,0,0,0.3)]",
        ].join(" "),
```

---

## Task 3: Update Secondary variant in button.tsx

**Files:**
- Modify: `packages/ds/src/components/button/button.tsx:33-38`

- [ ] **Step 1: Replace the Secondary variant class block**

Find the existing `secondary:` entry and replace it with:

```ts
        secondary: [
          // light (base): raised light chassis, dark text, hairline edge
          "bg-[linear-gradient(180deg,var(--background)_0%,var(--surface)_100%)] text-foreground",
          "[box-shadow:inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-1px_0_rgba(0,0,0,0.12),inset_0_0_0_1px_rgba(20,15,40,0.10)]",
          "hover:bg-[linear-gradient(180deg,var(--surface)_0%,var(--background)_100%)]",
          "hover:[box-shadow:inset_0_1px_0_rgba(255,255,255,0.95),inset_0_-1px_0_rgba(0,0,0,0.14),inset_0_0_0_1px_var(--edge-hover)]",
          "disabled:bg-muted disabled:bg-none disabled:text-foreground/30",
          "disabled:[box-shadow:inset_0_0_0_1px_rgba(20,15,40,0.06)]",
          // dark (overrides — current shipped behavior)
          "dark:bg-neutral-900 dark:bg-none dark:text-white",
          "dark:[box-shadow:inset_0_1px_0_rgba(255,255,255,0.06),inset_0_-1px_0_rgba(0,0,0,0.4)]",
          "dark:hover:bg-neutral-800 dark:hover:bg-none",
          "dark:hover:[box-shadow:inset_0_1px_0_rgba(255,255,255,0.06),inset_0_-1px_0_rgba(0,0,0,0.4)]",
          "dark:disabled:bg-neutral-900 dark:disabled:text-white/30",
          "dark:disabled:[box-shadow:inset_0_1px_0_rgba(255,255,255,0.03),inset_0_-1px_0_rgba(0,0,0,0.3)]",
        ].join(" "),
```

Note: `dark:bg-none` is added to dark variants to defeat tailwind-merge picking the light gradient in dark mode. The CVA base class adds `text-white` to all variants via the parent string (`rounded-none border-0 text-white` at line 15) — Secondary's `text-foreground` overrides in light mode; `dark:text-white` reverts in dark mode.

---

## Task 4: Update Outline variant in button.tsx

**Files:**
- Modify: `packages/ds/src/components/button/button.tsx:60-64`

- [ ] **Step 1: Replace the Outline variant class block**

Find the existing `outline:` entry and replace it with:

```ts
        outline: [
          // light (base): primary-blue text + border, flat chassis when disabled
          "bg-transparent text-primary border border-[rgba(0,64,255,0.55)]",
          "hover:border-primary",
          "disabled:text-foreground/30 disabled:border-[rgba(20,15,40,0.15)] disabled:bg-muted",
          // dark (overrides — current shipped behavior preserved)
          "dark:text-accent dark:border-[rgba(0,225,250,0.4)]",
          "dark:hover:border-accent",
          "dark:disabled:text-white/30 dark:disabled:border-white/10 dark:disabled:bg-transparent",
        ].join(" "),
```

Note: dark-mode disabled Outline keeps its current behavior (no chassis fill). Light-mode disabled Outline gets a `bg-muted` chassis to communicate "broken" — without it, the disabled Outline would be invisible on the light surface.

---

## Task 5: Update Ghost variant in button.tsx

**Files:**
- Modify: `packages/ds/src/components/button/button.tsx:65-69`

- [ ] **Step 1: Replace the Ghost variant class block**

Find the existing `ghost:` entry and replace it with:

```ts
        ghost: [
          // light (base): foreground text, surface hover
          "bg-transparent text-foreground/75 font-semibold",
          "hover:bg-surface hover:text-foreground",
          "disabled:text-foreground/30 disabled:bg-transparent",
          // dark (overrides — current shipped behavior)
          "dark:text-white/75",
          "dark:hover:bg-white/[0.04] dark:hover:text-white",
          "dark:disabled:text-white/30 dark:disabled:bg-transparent",
        ].join(" "),
```

---

## Task 6: Update `ledColorClass` and `iconGlowClass` maps

**Files:**
- Modify: `packages/ds/src/components/button/button.tsx:108-128`

- [ ] **Step 1: Replace the `ledColorClass` map**

Find the `const ledColorClass: Record<Variant, string> = { ... }` block and replace it with:

```ts
const ledColorClass: Record<Variant, string> = {
  primary: "bg-accent text-accent [box-shadow:0_0_8px_currentColor]",
  secondary: "bg-accent text-accent [box-shadow:0_0_8px_currentColor]",
  destructive: "bg-white text-white [box-shadow:0_0_8px_currentColor]",
  warning: "bg-warn-foreground text-warn-foreground",
  success: "bg-success-foreground text-success-foreground",
  outline: "bg-primary/50 text-primary dark:bg-accent/50 dark:text-accent",
  // ghost: LED is never rendered for ghost, so this entry is a sentinel.
  ghost: "",
};
```

- [ ] **Step 2: Replace the `iconGlowClass` map**

Find the `const iconGlowClass: Record<Variant, string> = { ... }` block and replace it with:

```ts
const iconGlowClass: Record<Variant, string> = {
  primary: "text-accent [filter:drop-shadow(0_0_4px_var(--accent))]",
  secondary: "text-accent [filter:drop-shadow(0_0_4px_var(--accent))]",
  destructive: "text-white",
  warning: "text-warn-foreground",
  success: "text-success-foreground",
  outline: "text-primary dark:text-accent [filter:drop-shadow(0_0_4px_currentColor)]",
  ghost: "text-foreground/60 dark:text-white/60",
};
```

---

## Task 7: Run lint, typecheck, tests

**Files:** none (just verification)

- [ ] **Step 1: Run the full check pipeline**

Run: `npm run check`
Expected: lint passes, typecheck passes, all tests in `packages/ds/src/components/button/button.test.tsx` pass (24 tests).

If any test fails, the structural behavior was broken — the change should be purely class-level. Re-inspect the diff for accidental code changes.

- [ ] **Step 2: Commit the code change**

```bash
git add packages/ds/src/components/button/button.tsx
git commit -m "feat(skin): add light-mode treatment to Button

Primary becomes brand-blue (primary-400/500 gradient), Secondary
becomes a raised light chassis (background→surface), Outline uses
primary-blue text+border in light mode, Ghost uses foreground text.
Disabled flattens to bg-muted in light mode. Dark mode preserved
verbatim via dark: prefix on the existing classes."
```

---

## Task 8: Visual regression check

**Files:** none (manual browser check)

- [ ] **Step 1: Start the preview app**

Run: `npm run dev`
Expected: Next.js dev server starts (Turbopack), prints local URL (usually `http://localhost:3000`).

- [ ] **Step 2: Navigate to the Button page**

Open `http://localhost:3000/button` in a browser.

- [ ] **Step 3: Confirm dark mode (default) is unchanged**

Compare against the recently merged PR #1 button page. Check that every section (Variants, Sizes, With Icons, Loading, Disabled, As Link) looks identical to before.

- [ ] **Step 4: Toggle to light mode via sidebar theme switcher**

Confirm:
- Primary reads as bright electric-blue chassis with cyan LED.
- Secondary reads as a raised white-ish chassis with cyan LED, clearly distinct from Primary.
- Destructive / Warning / Success unchanged (already worked on light).
- Outline shows primary-blue text + border with a dim primary disc as the LED.
- Ghost label is visible (was invisible before).
- All variants' Disabled rows look flat — no leftover saturated chassis.
- Loading chase animation still runs in both modes.
- Focus ring (Tab key) is the cyan accent outline on both surfaces.
- Hover transitions are smooth in both modes.

- [ ] **Step 5: Stop the dev server**

Press `Ctrl+C` in the terminal running the dev server.

---

## Task 9: Update SKIN-PRINCIPLES.md

**Files:**
- Modify: `docs/SKIN-PRINCIPLES.md`

- [ ] **Step 1: Amend § 2 Color → Same-hex rule**

Find this paragraph in `docs/SKIN-PRINCIPLES.md` § 2 Color:

```
**How:** Only surface/background/foreground tokens differ between modes. Never create `--primary-dark` / `--primary-light` siblings. If accent contrast against light surfaces is an AA risk for body text, use the existing primary scale (`text-primary-700 dark:text-primary-300`), not a different hex.
```

Replace with:

```
**How:** Only surface/background/foreground tokens differ between modes. Never create `--primary-dark` / `--primary-light` siblings. The rule applies to filled chassis fills and glows — it does NOT bind outline borders or text, which can shift to a contrast-paired accent in light mode (e.g., Button Outline uses `text-accent`/`border-accent` in dark mode but `text-primary`/`border-primary` in light, per Decision #82). For body text where AA contrast against light surfaces is a risk, use a scale step (`text-primary-700 dark:text-primary-300`) rather than a different hex.
```

- [ ] **Step 2: Amend § 6 Component patterns → Disabled flattens**

Find this paragraph in `docs/SKIN-PRINCIPLES.md` § 6 Component patterns:

```
### Disabled flattens
**Rule:** Disabled chassis collapse to neutral dark gray, LED dims to ~25% opacity with no glow, label drops to muted white. `cursor: not-allowed`.
**Why:** The disabled state should look semantically broken — no light, no signal, no temperature. If you can squint and still see a primary-blue chassis, the disabled state is wrong.
```

Replace with:

```
### Disabled flattens
**Rule:** Disabled chassis collapse to a neutral gray matching the mode (`bg-neutral-900` in dark, `bg-muted` in light). The chassis change carries the disabled signal — the LED keeps its variant color, since the small disabled chip already reads as inert against the flat chassis. Label drops to `text-foreground/30` (light) or `text-white/30` (dark). `cursor: not-allowed`.
**Why:** The disabled state should look semantically broken — no light, no signal, no temperature. The flat neutral chassis carries this on its own; trying to also dim the LED tends to make it disappear at small sizes (4–6px) rather than read as "off".
**Source:** Decision #82.
```

---

## Task 10: Update DESIGN-SYSTEM.md

**Files:**
- Modify: `docs/DESIGN-SYSTEM.md`

- [ ] **Step 1: Find the Button section and locate where variants are described**

Run: `grep -n "^## Button\|^### Variants" docs/DESIGN-SYSTEM.md | head -5`
Expected: identifies the Button section heading and the Variants subsection inside it.

- [ ] **Step 2: Add a light-mode subsection after the Variants table**

Inside `docs/DESIGN-SYSTEM.md` Button section, right after the variants table (and before any other subsection like "Sizes"), insert:

```markdown
### Light mode

Buttons adapt across themes. Dark mode is the primary design surface (Abyssal Void skin). Light mode is the legible alternative on the off-white `--background`:

| Variant | Light-mode chassis | Notes |
|---|---|---|
| Primary | brand-blue gradient (`primary-400 → primary-500`) with white text | Reads as the brand action |
| Secondary | raised light gradient (`--background → --surface`) with `--foreground` text + hairline edge | Distinct from Primary by lightness, kept on the LED axis with the cyan dot |
| Destructive / Warning / Success | unchanged (same hex in both modes per skin same-hex rule) | Saturated chassis + outer halo work on both surfaces |
| Outline | `text-primary` + primary-blue border (instead of dark-mode cyan) | Contrast-paired accent — see SKIN-PRINCIPLES § Same-hex rule |
| Ghost | `text-foreground/75`, `bg-surface` hover | Same as dark, just inverted text/hover tone |
| Disabled (all variants) | `bg-muted` (light gray) flat chassis, `text-foreground/30` label | Same shape as dark-mode disabled — LED keeps variant color, chassis carries the signal |
```

---

## Task 11: Log Decision #82 in DECISIONS.md

**Files:**
- Modify: `docs/DECISIONS.md`

- [ ] **Step 1: Insert Decision #82 entry after the existing top divider**

Open `docs/DECISIONS.md`. Find the existing `## Decision #81 — 2026-05-26` heading. Insert this block immediately ABOVE it (so #82 sits at the top of the chronologically-ordered list):

```markdown
## Decision #82 — 2026-05-26

**Context:** The Button shipped in PR #1 (`feat(skin): redesign Button as instrument-panel control`) was designed dark-mode-first. Its CVA classes hard-code dark-mode chassis fills (e.g., `bg-[linear-gradient(180deg,var(--color-primary-900)_0%,var(--color-primary-950)_100%)]`) with no `dark:` qualifier — so the same classes apply in light mode, producing three failure modes: (1) Primary and Secondary both render as dark slabs and look indistinguishable, (2) Disabled `bg-neutral-900` looks active not broken, (3) Outline (cyan-on-white) and Ghost (`text-white/75`-on-white) are invisible. Direction A was selected from three alternatives in a visual brainstorm: brand-blue Primary chassis + raised light Secondary chassis + primary-blue Outline + foreground-text Ghost + `bg-muted` disabled chassis (Direction B was "stay dark, push primary toward blue"; Direction C was "silver-panel instrument"). Outline switched from cyan → primary-blue in light mode after a separate three-option visual; cyan-darkened (option 2, principled) was rejected because it reads "teal" not "cyan," and the consistency loss is acceptable given Outline's hierarchy role.

**Decision:** Add a light-mode treatment to Button by layering light-mode classes as the base in each CVA variant and re-qualifying the existing dark-mode classes with `dark:`. Primary chassis becomes `linear-gradient(primary-400 → primary-500)` with cyan-tinted bevel highlight and dark bottom shadow. Secondary chassis becomes `linear-gradient(--background → --surface)` with bright top highlight, faint bottom shadow, and an inset hairline at `rgba(20,15,40,0.10)`. Outline becomes `text-primary` + primary-blue border in light mode (cyan stays in dark). Ghost becomes `text-foreground/75` with `bg-surface` hover. Disabled flattens to `bg-muted` chassis with `text-foreground/30` text. Destructive / Warning / Success unchanged (same-hex rule). Update SKIN-PRINCIPLES § 2 Same-hex rule to note the rule binds chassis fills/glows but not outline chrome, and update § 6 Disabled flattens to describe per-mode chassis colors and remove the "LED dims to 25%" claim (which the implementation never matched). One pre-existing dark-mode inconsistency stays out of scope: Outline disabled in dark mode keeps its transparent chassis (no `dark:disabled:bg-X`) — to be fixed in a follow-up.

**Rationale:** Direction A solves all three failure modes with the strongest hierarchy read: Primary becomes recognizably the brand color (the user came to do this), Secondary becomes a raised neutral chassis (a clear lower-emphasis alternative), Disabled becomes a flat gray chip that visibly stops being a control. The Outline shift to primary-blue is the only same-hex deviation in the chunk and is justified twice — once by AA contrast (cyan-on-white fails everywhere above accent-700, and accent-700 reads "teal" not "cyan"), and once by hierarchy (Outline reads as "a quieter Primary," which matches the role). Keeping Disabled's LED at variant color matches existing dark-mode behavior — the small LED chip carries no real "broken" signal at 4–6px anyway, and the flat chassis is doing the work. The dark-mode-Outline-disabled gap is acknowledged but deferred because fixing it would require a small dark-mode behavior change (adding `dark:disabled:bg-neutral-900`), and the spec scope was "preserve dark mode verbatim."

**Alternatives considered:** Direction B "stay dark, push primary toward blue" (rejected — two dark slabs still feel weighty on white; Primary↔Secondary differentiation comes from hue alone, weaker than Direction A's lightness contrast). Direction C "silver-panel instrument" (rejected — Primary↔Secondary differentiation too subtle, bright cyan LED swamps the quiet chassis). Outline option 2 "darkened cyan / accent-700" (rejected — reads as teal, breaks LED-vs-border color match). Outline option 3 "neutral foreground outline" (rejected — loses the "outline = signal" identity entirely, reads generic). Fixing dark-mode-Outline-disabled chassis in this chunk (deferred — small dark-mode behavior change outside the chunk's "preserve dark mode verbatim" scope; filed in BACKLOG). Dimming the LED on disabled in both modes (rejected — current dark-mode implementation never did this, and at 4–6px the LED dim is imperceptible vs. just leaving it; updated SKIN-PRINCIPLES to remove the unmet claim).

---

```

---

## Task 12: Update BACKLOG.md

**Files:**
- Modify: `docs/BACKLOG.md`

- [ ] **Step 1: Add a follow-up backlog item for dark-mode Outline disabled chassis**

In the Open Items section of `docs/BACKLOG.md`, add this entry (place it chronologically — after the most recent dated entry, currently `2026-05-26 — Contrast-aware accent text utility`):

```markdown
### 2026-05-26 — Dark-mode Outline disabled chassis

**Source:** Identified during Button light-mode chunk (Decision #82)
**Description:** Outline disabled in dark mode keeps a transparent chassis (no `dark:disabled:bg-X`) while every other variant flattens to `bg-neutral-900`. Inconsistent with "Disabled flattens" principle. Fix by adding `dark:disabled:bg-neutral-900` to the Outline variant — small dark-mode behavior change, kept out of the light-mode chunk scope.
**Priority:** Low
```

- [ ] **Step 2: Add the completed entry for this chunk**

In the Completed / Rejected `<details>` section (toward the bottom), add this line (chronologically, after the existing 2026-05-26 entries):

```markdown
- [x] 2026-05-26 — Button light-mode treatment (Direction A: brand-blue Primary chassis, light Secondary chassis, primary-blue Outline, foreground-text Ghost, `bg-muted` disabled)
```

---

## Task 13: Update CLAUDE.md Current Features

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: Find and amend the Button feature line**

In `CLAUDE.md` Current Features, find the existing Button line (it currently reads "Button component with 7 variants (primary, secondary, destructive, warning, success, outline, ghost), 3 sizes (xs/sm/md), CVA architecture, instrument-panel chassis with cyan LED signature, iconLeft inherits LED glow at rest, loading state runs a two-dot chase ...").

Replace the segment "instrument-panel chassis with cyan LED signature" with:

```
instrument-panel chassis with cyan LED signature (dark mode) / brand-blue chassis (light mode), light-mode Outline uses primary-blue text+border, Ghost uses foreground text, Disabled flattens to `bg-muted` in light and `bg-neutral-900` in dark
```

Result: the line should now describe both light and dark behavior in one breath.

---

## Task 14: Final doc commit, push, open PR

**Files:** none (git only)

- [ ] **Step 1: Verify all doc changes are in place**

Run: `git status`
Expected: 5 modified files — `docs/SKIN-PRINCIPLES.md`, `docs/DESIGN-SYSTEM.md`, `docs/DECISIONS.md`, `docs/BACKLOG.md`, `CLAUDE.md`.

- [ ] **Step 2: Commit the doc updates**

```bash
git add docs/SKIN-PRINCIPLES.md docs/DESIGN-SYSTEM.md docs/DECISIONS.md docs/BACKLOG.md CLAUDE.md
git commit -m "docs(skin): document Button light-mode treatment

Logs Decision #82 (Direction A — brand-blue Primary, light Secondary,
primary-blue Outline). Updates SKIN-PRINCIPLES § Same-hex rule to
note the rule binds chassis fills/glows but not outline chrome, and
§ Disabled flattens to describe per-mode chassis colors. Adds a
'Light mode' subsection to the Button page in DESIGN-SYSTEM. Adds a
backlog item for the pre-existing dark-mode Outline disabled gap.
Moves the completed item under BACKLOG."
```

- [ ] **Step 3: Run checks one more time before pushing**

Run: `npm run check`
Expected: passes.

- [ ] **Step 4: Push the chunk branch**

Run: `git push -u origin skin/button-light-mode`
Expected: branch pushed, tracking origin/skin/button-light-mode.

- [ ] **Step 5: Open PR targeting `skin/paraplu`**

Run:
```bash
gh pr create --base skin/paraplu --title "feat(skin): button light-mode treatment" --body "$(cat <<'EOF'
## Summary

Adds a light-mode treatment to the Button component. Dark mode preserved verbatim.

- Primary: brand-blue gradient chassis (`primary-400 → primary-500`)
- Secondary: raised light gradient chassis (`--background → --surface`), distinct from Primary by lightness
- Outline: primary-blue text + border (light) / cyan accent (dark)
- Ghost: `text-foreground/75` + `bg-surface` hover (light) / current behavior (dark)
- Disabled (all variants): flat `bg-muted` chassis with `text-foreground/30` text in light; current behavior in dark

Decision #82 in `docs/DECISIONS.md` — Direction A from a 3-option visual brainstorm.

## Test plan

- [x] `npm run check` passes (lint + typecheck + 24 unit tests)
- [x] Visual regression: `npm run dev`, `/button` page, toggled theme — dark mode identical to PR #1; light mode shows the new treatment
- [x] Loading chase animation runs in both modes
- [x] Focus ring (Tab key) is cyan accent on both surfaces
- [x] Disabled row reads "broken" on both surfaces
EOF
)"
```
Expected: PR URL printed.

---

## Task 15: Update docs (definition of done — verbatim checklist)

This is the project's standard pre-merge checklist (per `CLAUDE.md` § Plans Must Include Doc Updates).

- [ ] DESIGN-SYSTEM.md — new tokens, components, hooks, or patterns (covered in Task 10)
- [ ] ARCHITECTURE.md — new patterns, new files, or changed structure (none — no entry)
- [ ] DECISIONS.md — design decisions made during this feature (covered in Task 11)
- [ ] BACKLOG.md — completed items moved, deferred ideas added (covered in Task 12)
- [ ] CLAUDE.md — Current Features list if user-facing behavior changed (covered in Task 13)
