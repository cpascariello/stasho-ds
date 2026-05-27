# Badge · Card · ProgressBar · Checkbox revisit — Design

**Date:** 2026-05-27
**Wave:** 1 (followup polish)
**Components:** Badge, Card, ProgressBar, Checkbox (+ Radio cascade)
**Integration branch:** `skin/paraplu`
**Chunk branch:** `skin/badge-card-progress-checkbox` (off `skin/paraplu`)
**Sequencing:** Independent of `skin/slider-thumb-revisit` (no file overlap — Slider files vs Badge / Card / ProgressBar / Checkbox / Radio files). Can ship in parallel.

---

## 1 · Problem

Four components carry leftover pre-Abyssal vocabulary or under-applied wave-1 principles:

1. **Badge** — solid variants render as `gradient-fill-*` (muddy on saturated tones, "marketing chip" reading); outline variants reference scale steps (`-100` / `-300` / `-400`) instead of semantic tokens; info variant on solid is a neutral pill (should be cyan per #88); outline default leaks `--primary` into a passive marker role.
2. **Card** — default `bg-surface` has no hairline border, so the chassis disappears in nested or light-mode contexts (surface-on-surface melts).
3. **ProgressBar** — fill is `bg-primary` (should be `bg-accent` per #88 + § 2 active-states), track is flat (no bevel like Switch + Slider), and Direction C names ProgressBar fill as a "lit surface" — but the current shipping behavior is flat-primary with no bevel and no glow signal at all.
4. **Checkbox** — already mostly wave-1 (Decision #85), but rest hairline is invisible on dark (`bg-transparent` over `#07080a`), the size ladder is heavy (16/20/24 — md too big), CVA class names misalign with vocabulary (`rounded` / `rounded-md` both resolve to 0px under the Abyssal scale but read as if they're rounded), and the check glyph is a hand-rolled SVG while Stepper completed already uses Phosphor `<Check />`.

---

## 2 · Decision

### 2.1 · Badge

| Aspect | Decision |
|---|---|
| Solid fill | Drop `gradient-fill-*`. Flat saturated background per variant + dark text (`text-neutral-950`). Same hex both modes for the four semantic variants. `default` solid is a neutral mode-aware chip (`bg-edge text-foreground` or equivalent — tokens pinned at plan time). |
| Outline fill | Tinted `bg-{token}/15` + 1px `border-{token}/40` + colored text. Light-mode text uses the `-500` scale step for AA contrast on all four semantic variants — `text-accent-500 dark:text-accent`, `text-warning-500 dark:text-warning`, `text-success-500 dark:text-success`, `text-error-500 dark:text-error` (Decision #88 carve-out, generalized). |
| `info` variant | Cyan (`--accent`) for both fills (per Decision #88 active-state direction). Solid: `bg-accent text-neutral-950`. Outline: `bg-accent/15 border-accent/40 text-accent-500 dark:text-accent`. |
| `default` outline | Drop the `--primary` tint. Neutral hairline + muted foreground text (`border-edge text-foreground/70` or equivalent; exact tokens at plan time). |
| Radius | `rounded-[2px]` (Card grade — was `rounded-none`). |
| Typography | Unchanged. Departure Mono UC tracking-wider; force-uppercase via CSS (sm 10px / md 12px). |
| Sizes | Unchanged. |
| Iconography | Unchanged (`iconLeft` / `iconRight` slots stay). |

The `compoundVariants` block in `badge.tsx` is rewritten end-to-end — every fill × variant combination gets new classes. No new CVA dimension; no API change.

### 2.2 · Card

| Aspect | Decision |
|---|---|
| `default` variant | `bg-surface text-surface-foreground` + always-on `border border-edge` hairline. |
| `ghost` variant | Unchanged (`bg-transparent`, no border). |
| Radius | Unchanged (`rounded-lg` = 2px per Abyssal scale). |
| Padding sizes | Unchanged (sm/md/lg = 16/24/32). |
| Title | Unchanged (Anybody Bold `text-lg` is correct per Decision #83 — Card title IS a section heading). |

Smallest scope of the four. Mechanical change: add `border border-edge` to the default variant CVA.

### 2.3 · ProgressBar

| Aspect | Decision |
|---|---|
| Fill color (determinate + indeterminate) | `bg-primary` → `bg-accent` (cyan, both modes). |
| Track background | `bg-surface` → `bg-muted dark:bg-neutral-900` (matches Switch + Slider track). |
| Track bevel | Add `shadow-[inset_0_1px_0_rgba(255,255,255,0.06),inset_0_-1px_0_rgba(0,0,0,0.4)]` (matches Switch + Slider). |
| Glow on fill | **None.** No `box-shadow` on the fill. The bevel + cyan carries the lit-surface reading. |
| Sizes | Unchanged (sm h-1 = 4px, md h-1.5 = 6px, lg h-2.5 = 10px). |
| Indeterminate animation | Unchanged (`animate-progress-indeterminate`); only the color changes via `bg-accent`. |
| `ProgressBarDescription` | Unchanged. |
| API | Unchanged. |

### 2.4 · Checkbox + Radio cascade

| Aspect | Decision |
|---|---|
| Rest fill | `bg-transparent` → `bg-background dark:bg-surface` (matches Input flat-slot chassis per Decision #84). Makes the hairline visible at rest. |
| Sizes ladder | `xs/sm/md` go from `16/20/24` to **`14/16/20`**. Tailwind utilities become `size-3.5 / size-4 / size-5`. |
| Class names | `rounded` / `rounded-md` → `rounded-none` on all sizes. **No visual change** (both already resolve to 0px under the Abyssal scale per Decision #87) — vocabulary cleanup only. |
| Check glyph | Replace hand-rolled inline `<svg>` polyline with Phosphor `<Check />` (matches Stepper completed indicator per Decision #88). Stroke weight follows Phosphor's standard "regular" weight. |
| Focus pattern | Unchanged (`focus-visible:border-accent-700 dark:focus-visible:border-accent` — border-swap as ratified in Decision #85; small targets carry focus on the chassis hairline itself). |
| Error, disabled, checked | Unchanged (Decision #85 vocabulary holds). |
| Compound disabled+checked rules | Unchanged. |

**Radio mirrors all five changes** (rest fill, size ladder, `rounded-none` cleanup, focus pattern unchanged, error/disabled/checked unchanged). Radio shares the Checkbox chassis per Decision #85 — letting the two diverge here would create an obvious surface inconsistency in form contexts.

### 2.5 · Out of scope, backlogged

- **Switch ladder revisit.** Current Switch sizes (xs/sm/md = ~16/20/24) will read heavy next to Checkbox 14/16/20. Separate audit chunk — flagged for backlog.
- **Switch + Checkbox/Radio focus pattern consistency.** Switch uses `outline-2 outline-accent outline-offset-2`; Checkbox/Radio use border-swap. The split is principled (Decision #85), but a future audit could unify if a real reason emerges. Out of scope.

---

## 3 · Decisions made in brainstorm

### 3.1 · Badge solid + outline directions

Options shown: (A) current gradient solid + scale-step outlines, (B) flat saturated solid + dark text, (C) tinted `bg-{token}/15` + 1px hairline + colored text, (D) outline-only (collapse fill prop).

**Chose B for solid + C for outline.** Keep both fills with a clean visual ladder: B as the loud "thing is on / status is asserted" chip; C as the quiet annotation chip. D was rejected because collapsing the fill prop loses Badge's existing loud/quiet variant pair.

### 3.2 · Badge radius

Options shown: (0) sharp 0px — current and principle-aligned, (2) 2px — Card grade, (4) 4px — Modal grade.

**Chose 2px.** Picks up the Card / Tabs-pill chrome vocabulary (Decisions #86 / #87) — Badge reads as a "contained marker on top of the chassis" rather than a primitive control. 4px puts Badge in the modal radius tier semantically; 0px makes Badge indistinguishable from a Button-shaped readout at small sizes.

Requires § 4 amendment splitting the chip row in the 0/0/2/4 table: primitive controls stay at 0, contained markers (Badge) go to 2.

### 3.3 · Card border

Options shown: (A) current borderless `bg-surface`, (B) `bg-surface` + always-on 1px hairline, (C) hairline-only (no surface fill).

**Chose B.** Hairline + surface step gives Card two cues for "container" and survives nested + light-mode contexts. Aligns with how wave-1 chrome defines its boundaries (Input flat-slot, Tabs pill list, Badge outline — all 1px `--edge` hairlines).

### 3.4 · ProgressBar treatment

Options shown: (A) minimal — swap to cyan only, (B) cyan + bevel on track, (C) cyan + bevel + inner LED glow on fill (full Direction C).

**Chose B.** The bevel + cyan carries the lit-surface reading without committing to a persistent glow. Glow remains reserved for directly-grabbed controls (Slider thumb) and "you are here" beacons (Stepper active indicator) — ProgressBar fill is a passive readout, not either of those. Saves the glow budget for components that earn it.

Requires § 6 Direction C amendment: ProgressBar fill moves from the "lit surfaces glow" list to "lit surfaces flat, bevel + cyan carry signal."

### 3.5 · Checkbox rest visibility + sizes

Two follow-up questions surfaced during visual review:

**Rest visibility:** rest state currently has `bg-transparent`; the `border-edge` hairline on `#07080a` is essentially invisible. Fix: add `bg-background dark:bg-surface` to the chassis, matching the Input flat-slot pattern from Decision #84. Structural — no design choice.

**Size ladder:** options shown: (A) current 16/20/24, (B) 14/16/20, (C) 12/14/18, (D) 14/18/22.

**Chose B (14/16/20).** Mid-ground shrink. Matches industry conventions (Vercel / Linear / Stripe checkboxes at 14–18px). xs=14 ties to Slider md thumb size from Decision #89. md=20 is below the WCAG 24×24 minimum tap target — relying on the surrounding label/wrapper to provide click padding (Radix's `<label>` wrapping is the canonical pattern). The denser ladder reads better in form contexts.

### 3.6 · Checkbox audit findings

Two mechanical changes, both selected:

1. **`rounded` / `rounded-md` → `rounded-none`.** Both resolve to 0px under the Abyssal scale (Decision #87); the existing class names misread as "this is rounded." Zero pixel change; vocabulary alignment only.
2. **Hand-rolled SVG check → Phosphor `<Check />`.** Stepper completed already uses Phosphor (Decision #88). Consistency win; one icon family, one stroke weight.

Two findings rejected:

3. **Size ladder review** — addressed separately above (B picked).
4. **Focus pattern alignment** — keep border-swap (Decision #85 reasoning holds; switching to outline would homogenize a principled split).

---

## 4 · Files changed

| File | What changes |
|---|---|
| `packages/ds/src/components/badge/badge.tsx` | Rewrite `compoundVariants` block end-to-end (5 variants × 2 fills = 10 entries). Base `rounded-none` → `rounded-[2px]`. No API change. |
| `packages/ds/src/components/badge/badge.test.tsx` | Update existing class-presence tests for new tokens. Add light-mode `-500` carve-out coverage for warning + success outline text. |
| `packages/ds/src/components/card/card.tsx` | Add `border border-edge` to `default` variant. `ghost` variant unchanged. |
| `packages/ds/src/components/card/card.test.tsx` | Add test confirming `default` variant carries `border-edge`; confirm `ghost` does not. |
| `packages/ds/src/components/progress-bar/progress-bar.tsx` | Track class: `bg-surface` → `bg-muted dark:bg-neutral-900` + inset bevel `shadow-[inset_0_1px_0_rgba(255,255,255,0.06),inset_0_-1px_0_rgba(0,0,0,0.4)]`. Fill class: `bg-primary` → `bg-accent`. Indeterminate animation unchanged. |
| `packages/ds/src/components/progress-bar/progress-bar.test.tsx` | Update fill / track class-presence tests. |
| `packages/ds/src/components/checkbox/checkbox.tsx` | Base array gains `bg-background dark:bg-surface`. Size CVA: `xs: "size-3.5 rounded-none"`, `sm: "size-4 rounded-none"`, `md: "size-5 rounded-none"`. Replace inline `<svg><polyline>` with `<Check />` import from `@phosphor-icons/react`. |
| `packages/ds/src/components/checkbox/checkbox.test.tsx` | Update size class-presence tests for new sizes; add rest-fill assertion. |
| `packages/ds/src/components/radio-group/radio-group.tsx` | Mirror Checkbox changes: rest fill, size ladder, `rounded-none`. Indicator dot (`<span>`) unchanged. |
| `packages/ds/src/components/radio-group/radio-group.test.tsx` | Mirror Checkbox test updates. |
| `apps/preview/src/app/components/badge/page.tsx` | Visual verification (no API change). |
| `apps/preview/src/app/components/card/page.tsx` | Visual verification. |
| `apps/preview/src/app/components/progress-bar/page.tsx` | Visual verification. |
| `apps/preview/src/app/components/checkbox/page.tsx` | Visual verification + confirm 14/16/20 ladder + Phosphor check glyph. |
| `apps/preview/src/app/components/radio-group/page.tsx` | Visual verification + confirm cascade. |
| `docs/SKIN-PRINCIPLES.md` | § 4 — split chip row in 0/0/2/4 table (primitive controls = 0, contained markers = 2); refresh "Surface radii by role" table to add Markers row + clean stale entries in the "round-by-design" list (Switch thumb, Stepper indicators, Tabs pill were already removed in Decisions #86/#88 but the table line at L142 still lists them). § 6 — Direction C amendment moving ProgressBar fill from glow to flat-with-bevel. |
| `docs/DESIGN-SYSTEM.md` | Refresh Badge, Card, ProgressBar, Checkbox sections with new behavior. |
| `docs/DECISIONS.md` | Prepend Decision #90 entry covering all four components + Radio cascade. |
| `docs/BACKLOG.md` | Add Switch ladder + Switch focus pattern as follow-up items. |
| `CLAUDE.md` | Refresh Current Features entries for Badge, Card, ProgressBar, Checkbox, RadioGroup. |

---

## 5 · Principle deltas

### 5.1 · § 4 — chip row split (0/0/2/4 table)

Current:

| Element | Radius |
|---|---|
| Buttons, inputs, selects, chips, dropdowns, toasts | `0` |
| Cards | `2px` |
| Modals, dialogs | `4px` |

After:

| Element | Radius |
|---|---|
| Buttons, inputs, selects, dropdowns, toasts | `0` |
| Badges, Cards | `2px` |
| Modals, dialogs | `4px` |

### 5.2 · § 4 — "Surface radii by role" table

Add a "Contained markers" row for Badge. Update the "Round-by-design" row to match the bulleted list on L148–151 (which is current — drops Switch thumb / Stepper indicators / Tabs pill that were already removed in Decisions #86 / #88).

| Role | Tailwind class | Pixels | Components |
|---|---|---|---|
| Popovers | `rounded-none` | 0px | Tooltip, Select/Combobox/MultiSelect dropdowns, Tabs overflow DropdownMenu |
| Modals | `rounded-xl` | 4px | Dialog |
| Cards | `rounded-lg` | 2px | Card |
| Contained markers | `rounded-[2px]` | 2px | Badge |
| Round-by-design | `rounded-full` | — | StatusDot, Slider thumb, ProgressBar tracks, MultiSelect tag chips |

### 5.3 · § 6 — Direction C, ProgressBar fill amendment

Current line (after the Slider revisit lands):

> Switch thumb is solid cyan at rest, glow on hover/focus. Slider thumb is a 1.5px cyan ring on a `bg-background` interior at rest (an aperture); on hover, the interior fills `bg-accent` and an outer halo lights up — a documented carve-out from § 5 "hover intensifies, doesn't repaint" because the Slider thumb is a directly-grabbed control and the fill is the "you've got it" cue. The repaint is bounded to the interior of an existing chassis (no border, size, or shape change). Stepper active indicators carry a persistent halo… (etc).

After this chunk:

> Switch thumb is solid cyan at rest, glow on hover/focus. Slider thumb is a 1.5px cyan ring on a `bg-background` interior at rest (an aperture); on hover, the interior fills `bg-accent` and an outer halo lights up — a documented carve-out from § 5 "hover intensifies, doesn't repaint" because the Slider thumb is a directly-grabbed control and the fill is the "you've got it" cue. The repaint is bounded to the interior of an existing chassis (no border, size, or shape change). Stepper active indicators carry a persistent halo (the indicator IS the "you are here" beacon). **ProgressBar fill stays flat cyan on a beveled track — the bevel + cyan carries the lit-surface signal without committing to a persistent glow. Glow is reserved for directly-grabbed controls (Slider thumb) and "you are here" beacons (Stepper active); a passive readout like ProgressBar doesn't earn the glow budget.** Checkbox / Radio / Tabs / Pagination / Breadcrumb cyan states are flat, as are Stepper completed indicators (solid cyan chip carries the state alone)…

The "lit surfaces glow" list contracts to: Switch thumb (hover/focus), Slider thumb (hover/focus), Stepper active indicator (persistent).
The "lit surfaces flat" list expands to: ProgressBar fill, Checkbox check, Radio dot, active Tab text, active Pagination number, active Breadcrumb, Stepper completed indicator.

### 5.4 · § 2 — Active States list (small clarification)

Current line mentions ProgressBar in the active-states list ("Components: Switch, Slider, Checkbox, Radio, active Tab, active Breadcrumb, ProgressBar, …"). No change needed — ProgressBar fill is still cyan; the change is on Direction C category, not on which token carries it.

---

## 6 · Risks

- **Badge `rounded-[2px]` breaks the chip row in § 4.** Mitigated by explicit principle delta — the table split is documented, not silent. Consumers that use Badge get the 2px softening for free; nothing they author breaks.
- **Card border on `ghost` consumers.** If any consumer relies on `default` Card being borderless (e.g., embeds Card inside a custom layout that already supplies a border), the new hairline could double up. Verify in preview against current usages; consumers can override with `className`. Three files in the preview app currently use Card; check each in dev server.
- **ProgressBar without a glow may feel under-committed.** The brainstorm rejected the glow direction; this risk is accepted. If after merge the bevel + cyan alone doesn't read as "live," the principle delta is reversible (move ProgressBar back to the glow category).
- **Checkbox / Radio shrinking to 14/16/20 reduces tap target below WCAG 24×24 at md.** Acceptable because Radix wraps the input in a `<label>` element that provides surrounding click padding — consumers who wrap Checkbox in a labeled FormField get a much larger effective hit target. Confirm in the preview app that the label-wrap pattern is consistent across consumer pages.
- **Phosphor `<Check />` may render at a slightly different stroke weight than the hand-rolled SVG.** The hand-rolled SVG used `strokeWidth={3}`; Phosphor's "regular" weight is closer to 2px. Visual review in the preview app will confirm the difference is acceptable; if not, the chunk falls back to Phosphor "bold" weight before merge.

---

## 7 · Success criteria

- Badge solid variants render as flat saturated chips with dark text in both modes; no gradient artifacts on `success` / `warning` / `error` / `info`.
- Badge outline variants render with semantic-token-backed hairlines and `-500` light-mode text on warning/success/info (AA contrast verified).
- Badge `info` is cyan in both fills.
- Card default variant has a visible hairline in dark + light + nested contexts.
- ProgressBar fill is cyan in both determinate and indeterminate modes; track shows a recessed bevel.
- Checkbox at rest is visible in both themes (chassis fill behind the hairline).
- Checkbox + Radio sizes register as 14×14 / 16×16 / 20×20 in the preview pages.
- Checkbox check glyph is Phosphor `<Check />`, not the prior polyline.
- All existing tests pass; new tests cover the new tokens and classes.
- `npm run check` is clean.
- Visual verification in dev server confirms all five components (including Radio) read correctly in both themes.
- `docs/SKIN-PRINCIPLES.md` § 4 + § 6 amendments land in the same PR as the code.
- `docs/DECISIONS.md` Decision #90 entry captures rationale + alternatives + Radio cascade rule.
