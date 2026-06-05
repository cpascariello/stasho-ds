# Radius floor + card-family unification — Design

**Date:** 2026-06-05
**Status:** Approved (brainstorm), pending spec review
**Topic:** Retire the 0px corner, set a 4px radius floor, soften the edge hairline, unify the card surface language.

---

## Context

Abyssal Void's geometry was built on sharp 0px corners (`0/0/2/4` ladder, SKIN-PRINCIPLES § 1 + § 4). The user has decided to retire the brutalist edge entirely: **4px becomes the minimum radius across the whole system — nothing is sharper.** Alongside this, two adjacent changes surfaced and were approved:

- The soft 1px hairline used in the brainstorm mockups should become the DS default (`--edge` opacity drops).
- The three card-like surfaces (`Card`, `SelectableCard`/`ActionCard`, `Dialog`) should share one surface language instead of drifting.

This is a skin-identity change. It rewrites SKIN-PRINCIPLES § 1 (Identity — "Sharp 0px corners on functional surfaces") and § 4 (Geometry — the `0/0/2/4` ladder), and overrides the border-less-Dialog rule from Decision #87.

---

## The three moves

### 1 · Radius vocabulary — hard floor at 4

The new ladder replaces `0/0/2/4`:

| Radius | Tier | Components | Was |
|---|---|---|---|
| **4px** | Functional controls + floating chrome | button, input, textarea, select (trigger/menu/items), combobox, multi-select (trigger/menu/items/chips/indicators), badge, checkbox, switch (track/thumb), tabs (pill/list/indicator + overflow menu/items), pagination cells, stepper indicator, alert, tooltip, slider tooltip, copyable-text buttons, dialog close, skeleton | `0` / `2` |
| **6px** | Object surfaces | Card, SelectableCard, ActionCard | `2` |
| **8px** | Modal overlays | Dialog content | `4` |
| **full** | Round-by-design (unchanged) | StatusDot, Slider thumb/track/range, RadioGroup item, ProgressBar track/fill, Button LED dots, Loader dots | — |

**Floor is universal.** Every previously-`0px` or `2px` element moves to 4px, including small controls (checkbox, switch, tabs pill, stepper indicator). The only exceptions are the `round-by-design` set, which stays `rounded-full` because roundness is their semantic, not decoration (a dot IS round, a radio IS round, a slider thumb IS an aperture).

**Steps chosen:** `4 / 6 / 8` (the "tight" ladder — +2 per tier). Rejected: `4 / 8 / 12` (even) and `4 / 8 / 16` (generous) — both read more "rounded app" than "instrument."

### 2 · Edge hairline — softer, one concept across modes

`--edge` thickness stays 1px (§ 4 "hairline, never thick" is unchanged). Only opacity moves, and light mode switches from a solid grey to a translucent black so `--edge` is a single idea — "foreground at low alpha" — in both modes.

| Mode | `--edge` | `--edge-hover` | Was |
|---|---|---|---|
| Dark (`.theme-dark`) | `rgba(255,255,255,0.10)` | `rgba(255,255,255,0.20)` | `0.16` / `0.24` |
| Light (`:root`) | `rgba(0,0,0,0.14)` | `rgba(0,0,0,0.22)` | `oklch(0.87…)` / `oklch(0.80…)` solid |

This is a global token change — it ripples to **every** component that borders with `border-edge` (inputs, dialogs, dropdowns, tables, cards…), which is the intent of "make it the default."

### 3 · Card family — one surface language

Define the card surface once and have each role add only its own layer:

- **Shared base:** `bg-surface` + 1px `border-edge` + tier radius.
- **Card** = base, radius 6, static. (`ghost` variant unchanged: `bg-transparent`, no fill/border — the opt-out.)
- **SelectableCard / ActionCard** = base, radius 6, + hover (`border-edge-hover`) / focus (`outline-accent`) / selected (`border-accent` + `bg-accent/5` + check badge).
- **Dialog** = base, radius 8, + elevation (frosted overlay + shadow), **+ the 1px hairline** (new — was border-less per Decision #87).

The unification's visible change is **Dialog gaining `border border-edge`**. With the softer 0.10 edge it crisps the modal's boundary against the backdrop blur without adding weight. Card and SelectableCard already share `bg-surface border border-edge`; Dialog joining makes all three consistent.

---

## Implementation mechanism

The radius tokens live in the first `:root` block of `packages/ds/src/styles/tokens.css` and are consumed by Tailwind's `rounded-*` utilities via `var(--radius-*)`.

**Token edits (`tokens.css`):**

```css
/* Radius vocabulary (Abyssal Void — 4/6/8 hard floor, full reserved for round-by-design) */
--radius-sm: 4px;   /* was 0 */
--radius-md: 4px;   /* was 0 */
--radius-lg: 6px;   /* was 2px — cards */
--radius-xl: 8px;   /* was 4px — modals */
```

```css
/* :root (light) */
--edge: rgba(0, 0, 0, 0.14);        /* was oklch(0.87 0.013 270) */
--edge-hover: rgba(0, 0, 0, 0.22);  /* was oklch(0.80 0.015 270) */

/* .theme-dark */
--edge: rgba(255, 255, 255, 0.10);  /* was 0.16 */
--edge-hover: rgba(255, 255, 255, 0.20); /* was 0.24 */
```

**Why the token edit isn't enough on its own:** `rounded-lg` (Card, SelectableCard) and `rounded-xl` (Dialog) are token-driven, so they update to 6px/8px automatically. But controls use **hardcoded** `rounded-none` (= `border-radius: 0`, ignores tokens) and `rounded-[2px]` (literal). Those must be swept to `rounded-sm` (→ `var(--radius-sm)` = 4px).

**Component sweep:**

- `rounded-none` → `rounded-sm` in: alert, button (chassis), checkbox (xs/sm/md), combobox (trigger/content/items), copyable-text (copy button + link), dialog (close button), input, multi-select (trigger/content/items), pagination (both cell sizes), select (trigger/content/items), slider (tooltip), tabs (overflow content + items), textarea, tooltip, ui/skeleton.
- `rounded-[2px]` → `rounded-sm` in: badge, multi-select (chips + indicators), stepper (indicator), switch (track + thumb), tabs (pill list/indicator/trigger/pill).
- `@source inline(...)` safelist in tokens.css: `group-data-[variant=pill]:rounded-[2px]` → `…rounded-sm`.
- **Leave untouched:** all `rounded-full` (round-by-design), `rounded-lg` (cards — token handles it), `rounded-xl` (dialog — token handles it).

**Dialog hairline:** add `border border-edge` to `DialogContent`'s class string (dialog.tsx:41).

**Tests:** update assertions that pin old values — badge (`rounded-[2px]`→`rounded-sm`), checkbox (`rounded-none`→`rounded-sm`), tabs (`rounded-[2px]`→`rounded-sm`), card/selectable-card comments referencing "2px" → "6px" (the `rounded-lg` class assertions stay valid). Add a Dialog test for the new `border-edge` hairline.

---

## Out of scope

- **Interactive Card variant** (giving plain `Card` an optional clickable/hover/focus mode so it converges with `ActionCard`). Explicitly deferred — clickable cards keep using `ActionCard`. Logged to BACKLOG.
- **Card composition slots** (CardHeader/Content/Footer), elevation variants, media slots. Not part of this change.
- Slider/ProgressBar track bevel tuning (the Switch light-mode bevel exception from Decision #96 stands; not revisited here).

---

## Doc updates required (definition of done)

- [ ] **SKIN-PRINCIPLES.md** — rewrite § 1 (drop "Sharp 0px corners… not rounded") and § 4 (new `4/6/8` ladder + surface-radii table + round-by-design list). Update § 6 "Elevation is neutral" / Dialog references for the new hairline.
- [ ] **DESIGN-SYSTEM.md** — radius vocabulary, edge token values, unified card surface, Dialog hairline.
- [ ] **ARCHITECTURE.md** — the token-vs-literal radius mechanism (why the sweep was needed), shared surface language.
- [ ] **DECISIONS.md** — new Decision: hard-floor radius + edge softening + Dialog hairline (overrides #78, #87, #90 geometry/edge clauses; supersedes the `0/0/2/4` ladder).
- [ ] **BACKLOG.md** — add interactive-Card / card-anatomy as deferred; note CLAUDE.md SelectableCard `rounded-2xl` doc drift is resolved by this change.
- [ ] **CLAUDE.md** — update the radius-vocabulary line and every component feature line that names a now-stale radius (`rounded-none`/`rounded-[2px]`/"2px"/"4px") in the Current Features list.

---

## Open questions for review

1. **Small controls at 4px** — checkbox (14–20px), switch thumb, tabs pill, stepper indicator all round to 4px under the universal floor. This is the literal "nothing sharper than 4" decision; flagging it explicitly because 4px on a 14px checkbox is a visible change. Object now if any small control should be an exception.
2. **`--radius-md`** — set to 4px (mirrors the old `sm=md` floor). No component currently uses `rounded-md`; it's a harmless alias of the floor. OK to leave as-is?
3. **Alert / Skeleton** — both currently `rounded-none`. Treated as 4px chrome here. Confirm Alert (notification surface) reads right at 4px rather than the 6px object tier.
