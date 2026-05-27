# Wave‑1 finish — Pagination · Switch · Stepper · Alert

**Date:** 2026-05-27
**Integration branch:** `skin/paraplu`
**Chunk branch:** `skin/wave-1-finish`
**PR target:** `skin/paraplu`

**Scope:** Pagination, Switch, Stepper, Alert — the four components still on pre‑Abyssal or partly‑Abyssal vocabulary after chunks 1–6. Pagination is the last component rendering primary‑blue active state; Stepper is pre‑Abyssal in nearly every dimension (border, font, color, animation); Alert uses scale‑step tokens instead of semantic ones and routes its `info` variant through primary‑blue; Switch is on‑skin chassis‑wise (chunk 4) but sits on the `rounded-full` convention‑only justification that Tabs pill lost in chunk 5.

**Through‑line:** Close the wave by removing the last brand‑role leaks (primary‑blue active states on Pagination + Alert info, primary‑blue fills on Stepper, scale‑step tokens on Alert), settle the `rounded-full` audit for Switch and Stepper, and bring Stepper indicators into the LED‑as‑signature vocabulary at the smallest interactive scale.

---

## 1 · Problem

After chunks 1–6 ship, the four remaining components carry one or more of these wave‑1 violations:

1. **Primary‑blue active states still in the system.**
   - Pagination: number color, hover bg, focus outline, and active chip are all `primary‑*`. The backlog has flagged this as "blocks the visual cohesion of the wave" since chunk 5.
   - Alert info variant: border, label, gradient bg, and progress bar are all `primary‑*`. Two saturated blues compete for the eye whenever a primary Button sits near an info Alert.
   - Stepper active + completed indicators: `border-primary-500 bg-primary-500 text-white` with `primary-400/35` ring animation around the active step.

2. **Pre‑Abyssal chrome on Stepper.** `border-2 border-edge` violates the 1px hairline rule (§ 4). `font-heading` (Anybody) on the indicator number violates Decision #83 ("Anybody is for headings only"). The `animate-[ring-wave_…]` two‑ring expansion uses primary‑blue tinted borders.

3. **`rounded-full` on convention‑only justification.** Decision #86 amended § 4 to "round‑by‑design only, never round‑by‑convention." Switch (track + thumb) and Stepper indicators stayed on the reserved list with the same convention argument that Tabs pill lost.

4. **Scale‑step tokens on Alert.** `border-warning-400`, `text-warning-600 dark:text-warning-300`, `bg-warning-400` etc. instead of the semantic `--warning` / `--error` / `--success` tokens. The cyan‑text light‑mode carve‑out from Decision #86 generalises to warning/error/success/info text too — same hex would fail AA on white in some variants.

---

## 2 · Foundation

### 2.1 · Active‑state language already locked

Cyan accent for selected / checked / active / current per § 2 (Decision #86). This chunk applies it to the four remaining components. Light‑mode body‑text carve‑out (`text-accent-500 dark:text-accent`) extends naturally — and analogously to warning/error/success text on Alert.

### 2.2 · Disabled language already locked

Wave‑1 pattern: `text-foreground/30 cursor-not-allowed` (Decisions #82, #84, #85, #87). Pagination's `opacity-50 pointer-events-none` carve‑out joins it.

### 2.3 · `rounded-full` reserved list shrinks

§ 4 amendment: remove Switch (track + thumb) and Stepper indicators from the round‑by‑design list. Final reserved list after this chunk:

- StatusDot (a dot IS round)
- Slider thumb (a control puck IS round — same convention argument as Switch, but the visual difference at 16px between square and round thumb is functionally invisible AND Slider thumb shipped with `rounded-full` in chunk 4 as part of the bevel + LED treatment; kept for now, flagged)
- ProgressBar track (rounded ends are a graph convention)
- MultiSelect tag chips (still flagged — same convention‑only justification as the removals; deferred to the rounded‑full audit chunk)

### 2.4 · No new tokens, no new CSS classes

Alert's `alert-bg-*` gradient classes are rewritten in place (gradient direction + token source change). One small API addition only: `<StepperConnector completed />` boolean. No new component variants.

---

## 3 · Sub‑decisions

### 3.1 · Q1 — Pagination active style? **Tinted pill.**

`bg-accent/15` + `text-accent-500 dark:text-accent`, no border. Echoes the Tabs pill indicator from chunk 5 — current page reads as "current cell" rather than "current chip." Numbers drop to 26×26 to distinguish from 32×32 nav arrows; both share the same color treatment (quiet at rest, cyan on hover/active).

Alternatives considered: outlined hairline chip with explicit `border-accent` border (heavier, fights with Tabs pill); cyan underline matching Tabs underline variant (no chip, but loses the size differentiation that makes the number range scan‑able).

### 3.2 · Q2 — Switch radius? **Square (`rounded-[2px]`).**

Track and thumb both `rounded-[2px]`. Hardware reference (aviation toggle switches, audio rocker hardware) points square — closer to "instrument panel" than the iOS/Material round convention. The convention‑only justification was the same one Tabs pill lost in chunk 5.

Alternative considered: capsule track + square thumb (visually unusual; thumb corners read misaligned against round endcaps).

### 3.3 · Q3 — Stepper indicator emphasis? **Filled completed + halo on active.**

Completed = solid cyan chip with dark check (`text-neutral-950`, same dark glyph color as Checkbox per Decision #85). Active = hairline frame + cyan halo (`0 0 6px rgba(0,225,250,0.5), 0 0 14px rgba(0,225,250,0.3)`) — the LED‑signature vocabulary scaled to a step indicator (a step indicator IS lit when active, satisfies the "Direction C — LED scales by role" rule from § 6).

Alternatives considered: restrained tinted (active + completed both `bg-accent/15`; no halo budget cost but no two‑state differentiation either); bar + dots (indicators shrink to 12px round dots; closest to a progress‑bar‑with‑markers read but loses the numbered‑step affordance).

### 3.4 · Q4 — Alert info variant? **Cyan accent.**

Info uses `border-accent` + `text-accent-500 dark:text-accent` + cyan gradient bg + `bg-accent` progress bar. Frees the alert family from competing with Button's primary‑blue chassis and gives info a fitting role (the "live / listening" alarm hue matches cyan's system meaning).

Alternative considered: keep primary‑blue for info as the brand‑info alert. Rejected — two saturated blues on screen whenever a Primary button sits near an info Alert muddles the hierarchy.

### 3.5 · Q5 — Alert background? **Top→bottom gradient, 18% → 6%.**

Variant hue concentrated at the top (18% opacity), fading down to near‑background (6%) at the progress‑bar baseline. Reads as "atmospheric tint settling onto the surface" rather than the prior left→right "sweep across" — and concentrates the alarm hue where the eye lands first (variant label band).

Alternative considered: solid constant‑opacity wash (cleaner brutalist read but drops the only decorative element giving Alert visual interest at its size).

---

## 4 · Pagination

**Today:** `text-primary-600 dark:text-primary-400`, `hover:bg-primary-100 dark:hover:bg-primary-200/10`, `focus-visible:outline-primary-500`, active = `bg-primary-400 text-white dark:bg-primary-600`. Nav and number buttons both `size-8`. Disabled nav = `opacity-50 pointer-events-none`.

**Target:**

- **Number button:** `size-[26px] rounded-none font-mono text-sm text-foreground/60 hover:text-accent-500 dark:hover:text-accent cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2`
- **Active number:** add `bg-accent/15 text-accent-500 dark:text-accent` (override the inactive text + add the tinted bg). Active retains its size (26×26); the chip's 26×26 sits flush with surrounding numbers.
- **Nav button (« ‹ › »):** `size-8 rounded-none text-foreground/60 hover:text-accent-500 dark:hover:text-accent cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2`
- **Disabled nav:** swap `opacity-50 pointer-events-none` → `text-foreground/30 cursor-not-allowed` (wave‑1 pattern). Click handler still no‑ops via `onClick={isFirst ? undefined : …}` — no change needed there.
- **Ellipsis:** `inline-flex items-center justify-center size-[26px] font-mono text-sm text-foreground/40 select-none`
- **Hover backgrounds removed entirely.** Only text color changes on hover. Matches Pagination B's "no chrome" character.

API unchanged. Sizes unchanged elsewhere. `buildPageRange` unchanged.

---

## 5 · Switch

**Today (chunk 4):** Track `rounded-full bg-muted dark:bg-neutral-900` + bevel + `border-edge` + `data-[state=checked]:border-accent/30`. Thumb `rounded-full bg-edge data-[state=checked]:bg-accent` + cyan glow on hover/focus.

**Target:**

- **Track:** swap `rounded-full` → `rounded-[2px]`. Everything else (bevel, chunk‑4 disabled rules, checked border) unchanged.
- **Thumb:** swap `rounded-full` → `rounded-[2px]`. Everything else (size variants, translate distances, color, glow rules) unchanged.

The cyan glow on hover/focus stays — it remains the on‑skin signature for the "thumb IS lit" reading even though the puck is now square.

Sizes unchanged: `xs h-5 w-9` / `sm h-[26px] w-12` / `md h-8 w-[60px]`. Translate distances unchanged.

---

## 6 · Stepper

**Today:** Indicator is `rounded-full size-8 border-2 border-edge font-heading text-sm font-bold text-muted-foreground`. Active/completed both fill `bg-primary-500 text-white`. Active step also renders two animated rings (`border-primary-400/35` + `border-primary-300/25`) via `animate-[ring-wave_2.4s_…]`. Connector is `rounded-full bg-edge/50` with no progress‑fill behavior.

**Target:**

- **`StepperIndicator` base:** `relative flex size-8 items-center justify-center rounded-[2px] font-sans text-sm font-semibold border border-edge text-foreground/45 bg-transparent transition-all duration-200 motion-reduce:transition-colors`

- **Active:** `data-[state=active]:border-accent data-[state=active]:text-accent-500 dark:data-[state=active]:text-accent data-[state=active]:shadow-[0_0_6px_rgba(0,225,250,0.5),0_0_14px_rgba(0,225,250,0.3)]`

- **Completed:** `data-[state=completed]:border-accent data-[state=completed]:bg-accent data-[state=completed]:text-neutral-950`

- **Completed glyph:** When `state === "completed"`, `StepperIndicator` renders `<Check weight="bold" className="size-4" aria-hidden />` instead of `{children}` — unconditionally. The number passed as children is hidden once the step is done; the check replaces it. Consumers who need a custom completed glyph swap `StepperIndicator` with their own component (the indicator is just a presentational div — consumers can render any wrapper inside `StepperItem` that responds to the externally‑managed `state` they already pass in). No new exports needed.

- **Drop ring animation entirely.** Remove the two `<span class="animate-[ring-wave_…]">` elements. The halo carries the active signal alone. Reduces DOM nodes, removes the primary‑tinted leftover, halves the motion budget for the component.

- **`StepperLabel`:** stays `block text-sm text-muted-foreground transition-colors` with `data-[state=active]:text-foreground data-[state=active]:font-medium data-[state=completed]:text-foreground`. Already on‑skin.

- **`StepperConnector`:** add a `completed?: boolean` prop. Class becomes:
   ```
   relative overflow-hidden flex-1
   data-[orientation=horizontal]:h-px data-[orientation=vertical]:w-px
   bg-edge data-[completed]:bg-accent
   ```
   Drop the `rounded-full` (no longer needed at 1px; visually invisible anyway). Height/width drops to 1px (was `h-1` / `w-1`) to match the hairline rule.

   Connector renders `data-completed` attribute when the `completed` prop is true so the Tailwind selector matches.

- **Font change scope:** `font-heading` → `font-sans` on the indicator. `text-sm font-bold` → `text-sm font-semibold` to match Inter Semibold vocabulary established by Tabs triggers (chunk 3).

**API additions:**
- `StepperConnector` gains `completed?: boolean` prop.

**API unchanged:** `Stepper` (root nav), `StepperList`, `StepperItem` (state prop unchanged), `StepperIndicator` props, `StepperLabel` props, `StepperDescription` props.

**Consumer update required:** existing consumers of `StepperConnector` need to pass `completed={true}` between any two consecutive completed items to get the cyan‑fill behavior. Without the prop, connectors stay neutral — matches today's behavior, so existing usage doesn't visually regress. The preview page demo gets updated to show the completed‑fill pattern.

---

## 7 · Alert

**Today:** `border-warning-400 / -error-300 / -primary-300 / -success-400`. Variant label `text-warning-600 dark:text-warning-300` etc. Background CSS classes (`alert-bg-warning` etc.) use scale‑step `oklch(from var(--color-warning-400) …)`. Progress bar `bg-warning-400` etc. Info variant uses `--color-primary-*` throughout. Border uses `linear-gradient(90deg, …)`.

**Target:**

- **Border:** swap to semantic tokens:
  - `warning` → `border-warning`
  - `error` → `border-error`
  - `info` → `border-accent` (info variant moves from primary‑blue to cyan accent)
  - `success` → `border-success`

- **Variant label:** swap to semantic + light‑mode carve‑out:
  - `warning` → `text-warning-500 dark:text-warning`
  - `error` → `text-error-500 dark:text-error`
  - `info` → `text-accent-500 dark:text-accent`
  - `success` → `text-success-500 dark:text-success`

  (Carve‑out pattern from Decision #86 generalised across all semantic colors for AA contrast on light surfaces.)

- **Progress bar:** swap to semantic:
  - `warning` → `bg-warning`
  - `error` → `bg-error`
  - `info` → `bg-accent`
  - `success` → `bg-success`

- **Background CSS classes (rewrite in place):**

   ```css
   .alert-bg-warning {
     background:
       linear-gradient(180deg,
         oklch(from var(--warning) l c h / 0.18),
         oklch(from var(--warning) l c h / 0.06)),
       var(--background);
   }
   .alert-bg-error {
     background:
       linear-gradient(180deg,
         oklch(from var(--error) l c h / 0.18),
         oklch(from var(--error) l c h / 0.06)),
       var(--background);
   }
   .alert-bg-info {
     background:
       linear-gradient(180deg,
         oklch(from var(--accent) l c h / 0.18),
         oklch(from var(--accent) l c h / 0.06)),
       var(--background);
   }
   .alert-bg-success {
     background:
       linear-gradient(180deg,
         oklch(from var(--success) l c h / 0.18),
         oklch(from var(--success) l c h / 0.06)),
       var(--background);
   }
   ```

   Changes from today: gradient direction (`90deg` → `180deg`), opacity ramp (single 10% → 18%→6% top‑down ramp), token source (scale steps → semantic via `oklch(from …)`).

   Drop the dark‑mode 15%‑opacity variant — the single 18%→6% ramp reads correctly in both modes because the gradient lands on `var(--background)` which already shifts per theme. Verify in preview; if dark‑mode reads weak, tune the top stop to 0.22.

- **Dismiss button:** XCircle stays. Wrapper class still pulls `labelVariants({ variant })` so the icon color follows the variant label's semantic token. No other changes.

- **Italic body kept** (Decision #83 carve‑out for running prose).

- **Geometry kept:** 1px hairline border, `rounded-none`, `px-3 py-2`, exit animation, auto‑dismiss timer, auto‑styled link `[&_a]:after:content-['↗']` rule.

**API unchanged.** Same `AlertProps` shape, same `variant | title | onDismiss | dismissAfter | children`. `VARIANT_LABELS` map unchanged; `VARIANT_BG_CLASS` map unchanged (classes are rewritten but names stay).

---

## 8 · Principle updates

### SKIN‑PRINCIPLES § 4 — `rounded-full` reserved list

Replace the current reserved list with:

| Element | Justification |
|---|---|
| StatusDot | A dot IS round. |
| Slider thumb | A control puck IS round. Visual difference at 16px between square and round thumb is functionally invisible AND Slider thumb's bevel + cyan LED treatment shipped with `rounded-full` in chunk 4 — kept for now, flagged for the rounded‑full audit chunk. |
| ProgressBar track | Rounded ends are a graph convention. |
| MultiSelect tag chips | Soft / removable semantic. **Still flagged for audit** — same convention argument as Switch / Stepper removals; deferred. |

Removed: Switch (track + thumb), Stepper indicators.

### SKIN‑PRINCIPLES § 6 — Direction C extends to Stepper

The "LED scales by role" sub‑section (currently Switch + Slider thumbs) gains Stepper active indicators. Active step indicators get the halo (`0 0 6px rgba(0,225,250,0.5), 0 0 14px rgba(0,225,250,0.3)`) because the step indicator IS lit when active — it's both a number marker AND the "you are here" beacon. Completed indicators do NOT get the halo (solid cyan chip carries the state alone); inactive indicators have no LED treatment at all.

### SKIN‑PRINCIPLES § 2 — Active‑states clause extends

The "Active states" sub‑section (currently lists Switch, Slider, Checkbox, Radio, active Tab, active Breadcrumb, ProgressBar) gains: **Pagination current page**, **Stepper active + completed**, **Alert info variant**. The light‑mode body‑text carve‑out (`text-accent-500 dark:text-accent`) is restated in this section AND generalised: "the same carve‑out applies to `text-warning`, `text-error`, `text-success` when those tokens are used for UI text on light surfaces."

---

## 9 · Light‑mode carve‑out generalisation

All four semantic accents (`--warning`, `--error`, `--success`, `--accent`) hold the same hex in both modes per § 2. At their respective lightness:
- `--warning` `#ffc53d` — L≈0.83
- `--error` `#FF3D00` — L≈0.63
- `--success` `#2BD58E` — L≈0.78
- `--accent` `#00E1FA` — L≈0.84

The first three pass AA contrast on dark surfaces and on the variant's own tinted background (chunk 6 Alert), but warning and success fail AA against a pure light background. Pattern across the wave (Decision #86 for cyan): use `text-<token>-500 dark:text-<token>` where the token surfaces as UI text on light backgrounds — `accent-500`, `warning-500`, `success-500`, `error-500`. These scale steps exist in the Layer 1 OKLCH scales.

Applied here on:
- Pagination number text (active + hover)
- Stepper indicator text (active)
- Alert variant label (all four variants)

NOT applied on:
- Borders (`border-warning` etc. — borders against any background are fine at the saturated hex)
- Progress bars / chip fills (the surface IS the saturated color; contrast against text/glyph on top is the concern, handled separately)
- Backgrounds (gradient is at low opacity on `var(--background)` — no contrast issue)

---

## 10 · Out of scope

- **MultiSelect tag chips rounded‑full audit.** Deferred to its own focused chunk (already on backlog as "rounded‑full audit").
- **Slider thumb rounded‑full audit.** Decided to keep for now (see § 8 reserved list); revisit in the same rounded‑full audit chunk.
- **Status surface chassis identity for Alert** (e.g. cyan top‑rail like Dialog). Decision #87 reserved cyan top‑rail for "interrupting surfaces" (modals); Alert is informational and stays without the rail.
- **Alert auto‑dismiss timer behavior changes.** Progress bar color follows variant per the spec above; timing behavior unchanged.
- **Pagination accessibility refactor.** Keyboard handling, ARIA attributes, `aria-current="page"` all unchanged.
- **Stepper compound component restructure.** The 7‑part API stays as is. Only `StepperConnector` gets the small additive `completed` prop.
- **Theme persistence, font loading, form‑control base dedup** and other open backlog items.

---

## 11 · Verification

**Visual:**

- Pagination: 12‑page state at page 1 (boundary), page 6 (middle), page 12 (boundary). All four states (active / inactive / hover / disabled‑nav) visible in both themes.
- Switch: xs / sm / md sizes × on / off / disabled‑on × hover / focus states in both themes. Confirm thumb glow reads against the new square chassis.
- Stepper: 5‑step horizontal + 5‑step vertical. Mix of completed (1‑2) + active (3) + inactive (4‑5). Confirm connector fills cyan between completed steps and stays edge between others. Both themes.
- Alert: all four variants (warning / error / info / success) with and without title, with and without dismiss button, with and without auto‑dismiss progress bar. Both themes. Confirm `info` reads as a sibling of the other three (cyan no longer collides with Primary button blue).

**Automated:**

- `npm run check` — lint + typecheck + test pass.
- `npm run dev` — preview pages render correctly for all four components and overview page.
- Existing tests for Pagination, Switch, Stepper, Alert all pass (tests target behavior + accessibility, not appearance, per the Testing Philosophy).

**Doc updates** (mandatory final task in the plan):

- `docs/DESIGN-SYSTEM.md` — refresh Pagination, Switch, Stepper, Alert entries; add `StepperConnector completed` prop doc; restate light‑mode carve‑out generalisation.
- `docs/ARCHITECTURE.md` — note `StepperConnector` API addition; note `alert-bg-*` rewrite (semantic tokens + 180deg gradient).
- `docs/SKIN-PRINCIPLES.md` — § 2 active‑states clause, § 4 reserved list, § 6 Direction C extension, § 2 carve‑out generalisation across semantic colors.
- `docs/DECISIONS.md` — Decision #88 entry covering all four components, both rounded‑full removals, light‑mode carve‑out generalisation.
- `docs/BACKLOG.md` — move "Pagination active‑state recolor" to Completed; update "Rounded‑full audit" item to reflect Switch + Stepper removed (MultiSelect chips + Slider thumb remaining).
- `CLAUDE.md` Current Features — Pagination, Switch, Stepper, Alert entries.
