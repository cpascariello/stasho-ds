# Skin Sweep · Wave 1

**Date:** 2026-05-27
**Integration branch:** `skin/paraplu`
**Spec type:** umbrella — four chunks share one design discussion, ship in four PRs
**Scope:**

| Chunk | Components | Theme |
|---|---|---|
| **4 · Boolean / range** | Checkbox · RadioGroup · Switch · Slider | Form-control chassis reset |
| **5 · Active-state recolor** | Pagination · Tabs · Breadcrumb | `primary` → `accent` |
| **6 · Container surfaces** | Card · Dialog · Tooltip | Audit + small fixes |
| **7 · Data-display chrome** | StatusDot · ProgressBar · Skeleton · Stepper | Telemetry + indicators |

---

## 1 · Problem

After chunks 1–3 land (Button family + typography reset + text-input chassis reset), the rest of the DS still ships pre-Abyssal chrome in three flavors:

1. **Primary-blue everywhere it shouldn't be.** Active tabs, active pagination, breadcrumb hover, Slider range, ProgressBar fill, Switch on-state, Checkbox checked, Radio dot, Stepper indicators, focus rings — all use `text-primary-*` / `bg-primary-*` / `ring-primary-*`. SKIN-PRINCIPLES § 2 reserves `--primary` for "the brand action — the thing the user came to do" and gives `--accent` the role of "live / active / listening." The system currently makes every selected/active/in-progress signal compete with Button Primary for visual weight.
2. **Pre-skin chassis legacy.** Boolean/range controls (Checkbox, Radio, Switch, Slider) carry the same `border-3`, `ring-3 ring-primary-500`, `opacity-50` block that the text-input chunk just removed from Input/Textarea/Select/Combobox/MultiSelect. SKIN-PRINCIPLES § 4 ("Hairline borders, never thick") + § 6 ("Disabled flattens") have never been applied here.
3. **Container chassis drift.** Dialog uses `shadow-brand-lg` and `ring-primary-400` for its close button — a focus signal that should be cyan per § 5. Card and Tooltip mostly survive, but haven't been audited against the new tokens.
4. **Telemetry chrome unaligned.** ProgressBar fill is `bg-primary` (should be `--accent` per § 5: "Cyan is the moving signal"). Stepper indicators inherit pre-skin styles. StatusDot and Skeleton look fine but warrant a token check.

The scope-shape question ("can we do them all?") was answered with **Mode 2 — plan together, ship as four**. One brainstorm establishes the through-line and per-chunk specifics; four small PRs land them in `skin/paraplu` at the established cadence.

---

## 2 · Foundation (through-line)

These hold across all four chunks. They're the design language; per-chunk sections only call out where they apply.

### 2.1 · Primary = action. Accent = active/live/selected.

SKIN-PRINCIPLES § 2 already maps these roles. The wave executes that mapping. **Every** `primary-*` reference outside Button-chassis-related code becomes either `accent` (when the role is "active / live / selected") or `muted` / `foreground` (when the role is "chrome / structure"). Specifically:

| Today | Becomes | Why |
|---|---|---|
| `bg-primary-*` fill on Switch/Slider/Checkbox/Radio when on | `bg-accent` | Selected state = live signal |
| `text-primary-*` on active Tab/Pagination/Breadcrumb | `text-accent` | "You are here" = live signal |
| `ring-primary-500` on form-control focus | `border-accent` (light: `border-accent-700`) hairline | Cyan focus per § 5 |
| `bg-primary-*` ProgressBar fill | `bg-accent` | "Live signal" per § 5 |
| `border-primary-500` on Slider thumb | `border-accent` | Live signal on the focal moving element |
| `bg-primary-100` Pagination hover background | `bg-accent/10` (faint cyan tint) | See § 2.3 Direction C |

### 2.2 · Direction C — glow where the lit thing IS the active surface

The LED-as-signature pattern (SKIN-PRINCIPLES § 6) extends to small "on/active" states **selectively**, not uniformly. Three groups, three treatments:

| Group | Treatment | Components |
|---|---|---|
| **Lit indicators** (the lit thing is the focal active surface) | Glow on hover/focus, solid at rest | Switch thumb, Slider thumb |
| **Active fills** (the fill is itself the signal) | Subtle glow at rest | ProgressBar fill (determinate + indeterminate) |
| **Cyan slots / text** (small selected states, text indicators) | Flat cyan, no glow | Checkbox check, Radio dot, active Tab text + indicator, active Pagination number, active Breadcrumb |

The split is by **role**, not by size. A 14px Switch thumb glows on hover because the thumb IS the indicator; a 14px ticked Checkbox doesn't glow because the check is just the marker on a slot. This matches the logic that already kept text inputs calm in chunk 3.

### 2.3 · Hover intensifies, doesn't repaint (extended)

SKIN-PRINCIPLES § 5 establishes this for Button (chassis static; halo intensifies on hover). The wave extends it to Switch (track static, thumb gains glow on hover) and Slider (track static, thumb gains stronger glow on hover/focus). For Pagination/Tabs/Breadcrumb where hover is just a color preview, hover uses `bg-accent/10` to **preview** the active state.

### 2.4 · Hairlines only

Every `border-3` in the in-scope components is replaced with `border` (1px) per § 4 ("Hairline borders, never thick"). Every `ring-3` focus chrome is replaced with `border-accent` hairline or `outline-2 outline-accent outline-offset-2` (Button pattern), depending on whether the control has its own native border layer.

### 2.5 · Disabled flattens (extended)

The pattern from Button (Decision #82) and text-inputs (Decision #84) extends to boolean/range and data-display:

- Filled controls (Switch, Checkbox checked, Radio checked, Slider track when on, ProgressBar fill) → flatten to `bg-muted` (light) / `bg-neutral-900` (dark)
- Form-control wrappers (Checkbox/Radio frames, Slider track) → sink one step on the surface ladder (chunk-3 pattern)
- `cursor: not-allowed` everywhere; never `pointer-events-none` (blocks the cursor hint)

---

## 3 · Sub-decisions (the four open questions)

### 3.1 · Q1 — Switch glow at rest? **No.**

The Switch thumb is solid cyan when on; glow appears on hover and focus only. Matches Button's halo-on-hover rule (§ 5) and keeps dense settings panels calm — a screen with 10 enabled toggles stays readable. The cyan-on-neutral-track color contrast carries the "on" signal at rest; the glow earns its place by interaction.

### 3.2 · Q2 — Pagination active treatment? **Outlined chip + cyan tint hover, 26×26.**

- Box size: 26×26 (down from 32×32). Reads as instrument-panel readout rather than chunky pill button.
- **Active page:** `bg-muted` fill + 1px `border-accent` + `text-accent`. Outlined-chip metaphor, not filled-chip.
- **Hover (inactive page):** `bg-accent/10` tint + `text-accent`. Previews the active state — "if you click this, the cyan border appears."
- **Rest (inactive page):** transparent fill + `text-foreground/70` (or `--muted-foreground`).

The outlined-active treatment is a deliberate weight reduction. Three cyan reads on the same row (active solid + hovered tint + a nearby Tab indicator) was the concern with filled-cyan active; outlined-active drops the active visual weight enough that the hierarchy stays clean.

### 3.3 · Q3 — Dialog overlay? **Stays neutral.**

Overlay remains `bg-black/60 backdrop-blur-sm`. The skin's energy lives inside the dialog (its border, focus rings, action buttons), not in the dimming layer. Primary-tinted overlay was considered and rejected: in light mode "primary-tinted dim" reads weird (washes the dialog blue, or requires a per-mode override that fights with the rest of the same-hex rule), and in dark mode the neutral darkening is already strong enough that the tint would muddy the destructive action color (orange-on-blue-dim vs orange-on-black-dim).

### 3.4 · Q4 — Stepper completed state? **`--success` teal-green.**

Three distinct states (completed = `bg-success`, active = outlined `border-accent`, inactive = `border-edge` neutral) give the user a faster read of "where am I in the flow" than two-shade cyan. SKIN-PRINCIPLES § 2 explicitly maps `--success` to "confirm / complete / nominal" — the completed step IS that state. The wave introducing a third color (cyan + green + neutral) for Stepper is acceptable because Stepper is the only component where "completed" is a first-class state worth its own semantic.

---

## 4 · Chunk 4 — Boolean / range

**Components:** Checkbox, RadioGroup, Switch, Slider
**Chunk branch:** `skin/boolean-range-reset` (off `skin/paraplu`)
**PR target:** `skin/paraplu`

### 4.1 · Checkbox

Today's legacy:
```ts
"border-3 border-edge"
"focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary-500"
"disabled:opacity-50 disabled:pointer-events-none"
"data-[state=checked]:text-primary-foreground"
```

New state matrix:

| State | Class string |
|---|---|
| Rest (unchecked) | `border border-edge bg-transparent` |
| Hover (unchecked) | `hover:border-edge-hover` (light) / unchanged in dark — minor cue |
| Focus | `focus-visible:border-accent dark:focus-visible:border-accent focus-visible:outline-none` (1px hairline focus, swaps in place of the existing border) |
| Checked | `data-[state=checked]:bg-accent data-[state=checked]:border-accent data-[state=checked]:text-foreground` (cyan fill, dark check glyph against cyan — no glow) |
| Error | `border-error` (replaces old `border-3 border-error-400 hover:border-error-500`) |
| Disabled | `disabled:bg-muted dark:disabled:bg-background disabled:border-edge/50 disabled:text-foreground/30 disabled:cursor-not-allowed` |

The check glyph (Phosphor Check icon, currently `text-primary-foreground`) becomes a dark mark on cyan in both modes. Since `--background` flips between near-white (light) and `#07080a` (dark), it can't be the glyph color — a near-white check on cyan in light mode would have no contrast. **Default:** `text-neutral-950` (dark in both modes) on the checked fill. The same value applies to RadioGroup's indicator dot if it ever needs a foreground glyph layered inside the cyan dot (it currently doesn't — the dot is a solid disc).

### 4.2 · RadioGroup

Today's legacy: same as Checkbox plus the indicator dot is `bg-primary`.

New state matrix mirrors Checkbox. The indicator dot:

| State | Class string |
|---|---|
| Checked | `bg-accent` (cyan fill, no glow per § 3 Direction C — "Cyan slots") |
| Disabled + checked | `bg-foreground/30` (collapses to neutral with checkbox/radio chassis) |

### 4.3 · Switch

Today's legacy:
```ts
"border-3 border-edge bg-muted"
"focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary-500"
"disabled:opacity-50 disabled:pointer-events-none"
```

The Switch track gets a bevel per SKIN-PRINCIPLES § 5 ("Bevels for hardware feel: buttons, switches, sliders"). New state matrix:

| State | Track | Thumb |
|---|---|---|
| Off (rest) | `bg-muted dark:bg-neutral-900` + 1px `border-edge` + bevel `box-shadow: inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.4)` | `bg-edge` neutral, no glow |
| On (rest) | same chassis + bevel + border color swaps to `border-accent/30` (cyan-tinted hint) | `bg-accent`, no glow |
| Off → On (hover) | unchanged | `bg-accent` + glow `box-shadow: 0 0 5px var(--accent), 0 0 10px rgba(0,225,250,0.6)` (Q1 decision) |
| Focus | unchanged | thumb + same hover glow + `outline-2 outline-accent outline-offset-2` halo on the track |
| Disabled (any) | `bg-muted dark:bg-background` flat (no bevel, `border-edge/50`) + `cursor-not-allowed` | `bg-foreground/30` |

Border is 1px in every state (the existing `border-3 border-edge` is replaced); only the color swaps between `--edge` and `--accent/30`. Track radius stays `rounded-full` (per § 4 round-by-design exception list — Switch thumb is listed).

### 4.4 · Slider

Today's legacy:
```ts
"bg-neutral-200 dark:bg-base-700"        // track
"border-2 border-primary-500"             // thumb
"focus-visible:ring-3 focus-visible:ring-primary-500"
"opacity-50 pointer-events-none"          // disabled
"ring-2 ring-error-400"                   // error
"bg-primary-500"                          // range fill
"bg-neutral-900 dark:bg-base-700"         // tooltip
```

New state matrix:

| State | Track | Range fill | Thumb |
|---|---|---|---|
| Rest | `bg-muted dark:bg-neutral-900` + bevel (per § 5) | `bg-accent` (cyan, no glow) | `bg-accent border border-accent` (cyan solid, 1px border for circular outline against the cyan range) |
| Hover (anywhere on track) | unchanged | unchanged | thumb gains glow `box-shadow: 0 0 6px var(--accent), 0 0 12px rgba(0,225,250,0.5)` |
| Focus (thumb) | unchanged | unchanged | thumb gains stronger glow + `outline-2 outline-accent outline-offset-2` halo (matches Button focus pattern) |
| Error | unchanged | unchanged | thumb border swaps to `border-error` (error appears at the focal moving element — track is too thin (4px) to carry a visible error border) |
| Disabled | flat `bg-muted dark:bg-background` (no bevel) | `bg-foreground/30` | `bg-foreground/30 border-foreground/30` + `cursor-not-allowed` |

Border on thumb is 1px (`border`), down from the original `border-2 border-primary-500`. Range fill loses the `bg-primary-500` for `bg-accent`. The tooltip bubble shifts from `bg-neutral-900 dark:bg-base-700` to a single token: `bg-surface` (or `bg-popover` if that token exists) — needs to match Tooltip chunk (chunk 6) for consistency. **Implementation note:** verify the tooltip popover background token; if no shared token, lock to `bg-surface border border-edge` in both Slider tooltip and Tooltip component for consistency.

Sizes (`sm` / `md`) unchanged. Two-thumb range mode unchanged.

### 4.5 · Out of scope (chunk 4)

- Switch / Slider tooltip popover styling is touched only to match the Tooltip chunk (chunk 6); no other tooltip work.
- No new sizes, no new variants.
- Slider "snap-to-tick" / scale-marker design is not introduced.

---

## 5 · Chunk 5 — Active-state recolor

**Components:** Pagination, Tabs, Breadcrumb
**Chunk branch:** `skin/active-state-recolor` (off `skin/paraplu`)
**PR target:** `skin/paraplu`

### 5.1 · Pagination

Per Q2 (§ 3.2 above), Pagination boxes drop to 26×26 and active becomes outlined-not-filled. Class changes:

| Today | Becomes |
|---|---|
| `text-primary-600 dark:text-primary-400` (number color, rest) | `text-foreground/70 dark:text-foreground/70` |
| `hover:bg-primary-100 dark:hover:bg-primary-200/10` (number hover bg) | `hover:bg-accent/10` + `hover:text-accent` |
| `bg-primary-400 text-white dark:bg-primary-600 dark:text-white` (active number) | `bg-muted dark:bg-neutral-900` + `border border-accent` + `text-accent` |
| `hover:bg-primary-400 dark:hover:bg-primary-600` (active hover) | unchanged active — hover on active is a no-op |
| `text-primary-600 dark:text-primary-400` (ellipsis) | `text-foreground/50` |
| Size `size-8` (32×32) | `size-[26px]` for number buttons; nav `‹` / `›` keep `size-8` |

Nav `‹` / `›` button color shifts similarly: rest = `text-foreground/70`, hover = `text-accent`, disabled = `text-foreground/30 cursor-not-allowed`.

### 5.2 · Tabs

The component has multiple variants (underline, pill) and sliding-indicator code; class changes are surgical:

| Today | Becomes |
|---|---|
| `text-primary-600 dark:text-primary-400` (active trigger text) | `text-accent` |
| `hover:text-primary-600 dark:hover:text-primary-400` (hover) | `hover:text-accent` |
| `bg-primary-600 dark:bg-primary-500` (sliding indicator, underline variant) | `bg-accent` |
| `bg-primary-600 dark:bg-primary-400` (sliding indicator, pill variant) | `bg-accent` |
| `text-primary-600 dark:text-primary-400 font-semibold` (active trigger, pill variant) | `text-accent font-semibold` |
| `data-[state=active]:text-primary-600 dark:data-[state=active]:text-primary-400` | `data-[state=active]:text-accent` |

Sliding indicator stays as solid color (no glow). The pill variant's selected fill goes cyan — the strongest visual weight of the chunk, and the most visible test of "cyan as selected fill" beyond Button-chassis territory. Worth a visual check during implementation.

### 5.3 · Breadcrumb

| Today | Becomes |
|---|---|
| `hover:text-primary-600 dark:hover:text-primary-400` (link hover) | `hover:text-accent` |
| `text-primary opacity-40` (BreadcrumbPage current-item) | `text-accent` (drop opacity-40 — current page should read clearly, not faded) |

The `text-primary opacity-40` treatment on current-page was a workaround for "this is the current page but I don't want it to compete with the trail." With `text-accent` (cyan) it doesn't need opacity-40 to subordinate itself; cyan reads as "live indicator" by default and the rest of the breadcrumb (foreground neutral) reads as the trail.

### 5.4 · Out of scope (chunk 5)

- No new Pagination / Tabs / Breadcrumb variants.
- Tabs overflow / `maxVisible` behavior unchanged.
- Pagination `siblingCount` / `showFirstLast` API unchanged.

---

## 6 · Chunk 6 — Container surfaces

**Components:** Card, Dialog, Tooltip
**Chunk branch:** `skin/container-surfaces` (off `skin/paraplu`)
**PR target:** `skin/paraplu`

### 6.1 · Card

**Audit only.** Card today is `bg-surface` + 2px radius + `border border-edge`. Already skin-correct.

If the source reveals any vestigial shadows or hardcoded `primary-*` tokens, they get stripped. Otherwise the file is unchanged.

### 6.2 · Dialog

Two changes:

| Today | Becomes |
|---|---|
| `shadow-brand-lg` on `DialogContent` | `shadow-[0_24px_60px_rgba(0,0,0,0.65)]` (clean drop-shadow, no brand glow) — OR if `shadow-brand-lg` resolves to a non-brand drop shadow already, leave it. **Implementation note:** check `tokens.css` for what `shadow-brand-lg` resolves to before changing. |
| `focus-visible:ring-primary-400 focus-visible:ring-offset-2` (close button) | `focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2` (Button pattern) |

Overlay stays `bg-black/60 backdrop-blur-sm` per Q3 (§ 3.3 above). Title styling (`DialogTitle`) audits to Anybody Bold per § 3 (headings); if it's currently Inter, swap to `font-heading font-extrabold`.

### 6.3 · Tooltip

**Audit only.** Verify the bubble uses `bg-surface border border-edge` and matches the Slider tooltip popover (chunk 4 calls this out). If the bubble currently sits at a different elevation token, align it.

### 6.4 · Out of scope (chunk 6)

- No new Dialog sizes (`max-w-md` etc. unchanged).
- Tooltip arrow visual unchanged (just verify color tokens).
- No new variants for Card.

---

## 7 · Chunk 7 — Data-display chrome

**Components:** StatusDot, ProgressBar, Skeleton, Stepper
**Chunk branch:** `skin/data-display-reset` (off `skin/paraplu`)
**PR target:** `skin/paraplu`

### 7.1 · StatusDot

**Audit only.** Current variants (`healthy=success`, `degraded=warn`, `error=error`, `offline=neutral`, `unknown=muted`) already match § 2 semantic mapping. Pulse animation on `healthy` stays.

If the file uses any `primary-*` tokens, they get audited. Otherwise unchanged.

### 7.2 · ProgressBar

| State | Today | Becomes |
|---|---|---|
| Track | `bg-base-700 dark:bg-base-800` (or similar) | `bg-muted dark:bg-neutral-900` |
| Fill (determinate) | `bg-primary-500` | `bg-accent` + subtle glow `box-shadow: 0 0 6px rgba(0,225,250,0.5)` (Direction C — "Active fills") |
| Fill (indeterminate) | `bg-primary-500` animated via `@keyframes progress-indeterminate` | `bg-accent` with same keyframe; verify keyframe colors don't hardcode primary |
| `motion-reduce` | unchanged | unchanged |

The glow on the fill is subtle — present at rest but not loud. This is the only place in the wave where a "fill" gets glow at rest (Direction C says "active fills" earn that), distinguished from Switch/Slider thumbs which earn glow on interaction.

### 7.3 · Skeleton

**Audit only.** Currently uses a neutral pulsing background. Verify no `primary-*` tokens in the pulse color; should be `bg-muted` or `bg-edge`.

### 7.4 · Stepper

Per Q4 (§ 3.4 above), three-state model with semantic completed. State matrix for `StepperIndicator`:

| State | Background | Border | Glyph |
|---|---|---|---|
| Inactive | transparent | `1px border-edge` | step number, `text-foreground/50` |
| Active | transparent | `1.5px border-accent` (slightly heavier to read as "current") | step number, `text-accent font-bold` |
| Completed | `bg-success` | `1px border-success` | check icon, `text-background` (dark mark on green) |

Connector lines between steps:

| Between two completed | `bg-success` |
| Between completed and active | `bg-success` (the walked path stays green up to the current step) |
| Between active and inactive | `bg-edge` |
| Between two inactive | `bg-edge` |

`StepperLabel` color follows the same hierarchy: inactive `text-foreground/50`, active `text-foreground font-medium`, completed `text-foreground`.

### 7.5 · Out of scope (chunk 7)

- No new Stepper orientation modes (horizontal / vertical compound already exists).
- No new StatusDot variants.
- ProgressBar `ProgressBarDescription` API unchanged.

---

## 8 · SKIN-PRINCIPLES amendments

Each chunk's docs step appends or updates these. Listed here so the umbrella spec is the source of truth on what changes.

### 8.1 · § 6 amendment — "LED-as-signature scales by role, not by size"

After chunk 4 ships, add a sub-section under § 6 LED-as-signature:

> **Direction C — scope.** The LED treatment scales by what the component IS, not by its pixel size. Filled interactive controls where the lit element IS the active surface (Switch thumb, Slider thumb, ProgressBar fill) carry glow. Small slot/text indicators (Checkbox check, Radio dot, active Tab text, active Pagination number, active Breadcrumb) stay flat-cyan — they're markers on a surface, not lit surfaces themselves.

### 8.2 · § 5 amendment — "Switches and Sliders use bevel per the hardware-feel rule"

The existing § 5 already lists "buttons, switches, sliders" as bevel-eligible. After chunk 4 ships, verify the rule's example block mentions Switch + Slider bevels concretely; if not, add: "Switch track and Slider track carry inset top-highlight (`rgba(255,255,255,0.06)`) + inset bottom-shadow (`rgba(0,0,0,0.4)`) bevel."

### 8.3 · § 2 amendment — "Accent is the wave's active-state color"

After chunk 5 ships, add to § 2 Semantic color mapping under `--accent`:

> Selected / checked / active states on form controls and navigation (Switch, Slider, Checkbox, Radio, active Tab, active Pagination, active Breadcrumb, ProgressBar) use `--accent`. Primary's chassis role (Button only) is preserved.

### 8.4 · No § 4 / § 5 / § 7 changes

Hairline rule, motion rule, and "adding to these principles" sections survive as-is.

---

## 9 · Decisions to log

Each chunk's docs step logs a Decision entry. Sketched here:

- **Decision #85 — Chunk 4 (boolean/range chassis):** flat-edge chassis on Checkbox/Radio (no `border-3`), bevel + cyan-thumb-on-hover-glow Switch, bevel + cyan-thumb-on-hover-glow Slider, all cyan signals flat at rest. SKIN-PRINCIPLES § 6 Direction C amendment added.
- **Decision #86 — Chunk 5 (active-state recolor):** primary→accent across active Tab, Pagination, Breadcrumb. Pagination redesigned to outlined-active + 26px chip. § 2 amendment added.
- **Decision #87 — Chunk 6 (container surfaces):** Dialog focus to outline-accent; Dialog overlay stays neutral; Card and Tooltip audit-only.
- **Decision #88 — Chunk 7 (data-display chrome):** ProgressBar fill to accent + subtle glow; Stepper three-state with completed = success; StatusDot and Skeleton audit-only.

---

## 10 · Risks and open implementation questions

1. **Tabs pill variant active fill at full cyan saturation** — the pill variant's selected pill becomes solid cyan, the widest single cyan surface in the wave. Visual review during chunk 5 implementation; if it reads too loud, consider dropping the pill fill to `bg-accent/80` or applying the outlined-chip pattern from Pagination.
2. **Checkbox check glyph color** — resolved in § 4.1 (`text-neutral-950` in both modes). Worth a final visual check at implementation time; if neutral-950 reads muddy against the cyan fill, fallback is `text-black` for maximum contrast.
3. **`shadow-brand-lg` resolution** — chunk 6 Dialog work needs to know what this token resolves to in `tokens.css` before deciding whether to keep or replace. If it's a brand-tinted glow (unlikely), replace; if it's a plain drop-shadow, leave.
4. **Tooltip / Slider tooltip token alignment** — chunk 4 (Slider tooltip) and chunk 6 (Tooltip) both touch popover bubble styles. The chunks ship independently but should reach the same final state; whichever ships first should establish the token, the other follows.
5. **Stepper introduces a third color (success-green) to the wave** — accepted in Q4 decision, but worth a final visual check in context with all four chunks merged. If the green looks isolated, fallback is to revert Stepper completed to `--accent` cyan (B option from Q4).

---

## 11 · Out of scope (wave-wide)

- Form components not yet built: File Upload, Number Input/Stepper (backlog, not in this wave).
- Component library gaps: Accordion, Avatar (backlog, not in this wave).
- Dark-mode Outline disabled chassis (still-deferred backlog from chunk 1; will fix in its own chunk).
- Theme persistence across reloads (backlog).
- Restyling consumer apps (scheduler-dashboard, cloud) to use the new components (backlog).

---

## 12 · Spec → plan handoff

After this spec is committed:

1. `writing-plans` writes `docs/superpowers/plans/2026-05-27-chunk-4-boolean-range.md` — full implementation plan for chunk 4 alone.
2. Chunks 5/6/7 reference this spec for design and get their own implementation plans in their own sessions (so each plan's context window stays focused on the one chunk being shipped).
3. The spec is **frozen** at this point. If a later chunk's brainstorm needs to override a sub-decision (e.g., visual review reveals Tabs pill cyan is too loud), that decision lands in `DECISIONS.md` and the override is noted in that chunk's spec — this umbrella spec doesn't get edited.
