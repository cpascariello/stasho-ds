# Text-input chassis reset

**Date:** 2026-05-27
**Integration branch:** `skin/paraplu`
**Chunk type:** systematic alignment with `docs/SKIN-PRINCIPLES.md`
**Scope:** Input, Textarea, Select (trigger), Combobox (trigger), MultiSelect (trigger), FormField

---

## 1 · Problem

Five trigger surfaces (`Input`, `Textarea`, `Select`, `Combobox`, `MultiSelect`) share the same chassis class block — written before the Abyssal Void skin landed and never revised:

```ts
"w-full font-sans text-foreground bg-primary-100 dark:bg-base-700"
"border-0 rounded-none"
"focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary-500"
"disabled:opacity-50 disabled:pointer-events-none"
```

Plus a shared error treatment: `border-3 border-error-400 hover:border-error-500`.

That block violates the current skin in five distinct ways:

1. **Background token.** `bg-primary-100 dark:bg-base-700` — `primary` is now electric blue `#0040FF` (Decision #79), so `primary-100` in light mode tints inputs pale blue rather than reading as a neutral fill. `base-700` is the popover-elevation tone (`#161718`) — fine in isolation but inconsistent with how `--background` / `--surface` / `--muted` are supposed to ladder.
2. **Focus ring color.** `ring-primary-500` is now electric blue. SKIN-PRINCIPLES § 5 Motion (cyan is the moving signal) and Button (Decision #82, `outline-accent`) both establish that interactive focus is **cyan** `--accent`, not primary.
3. **Focus ring weight.** `ring-3` is a 3px ring — Button focus uses `outline-2 outline-accent outline-offset-2`. Inputs should be at 1px, not 3px — the brutalist character of the skin came from 1px hairlines (SKIN-PRINCIPLES § 4 Geometry, "Hairline borders, never thick"). The current ring is also rendered via Tailwind `ring-*`, which composes weirdly with focus-only chrome.
4. **Error border weight.** `border-3 border-error-400` — directly violates "1px hairlines, never thick." Also `error-400` is a scale step, not the same-hex `--error` (`#FF3D00`) we should be using per Decision #78.
5. **Disabled treatment.** `disabled:opacity-50` reads "faded," not "semantically broken." Button (Decision #82, Disabled flattens) gave filled controls a flat neutral chassis instead of opacity. Inputs need the same principle extended.

`FormField` is in scope for two small token fixes (`text-error-600` → `text-error`) on the required asterisk and error helper text — same blood-orange semantic, but using the canonical token rather than a scale step that may or may not survive future palette work.

Out-of-scope but worth noting:

- `Checkbox`, `RadioGroup`, `Switch`, `Slider` carry similar chrome issues but their puck/dot/thumb shapes deserve a separate design pass.
- `Select` / `Combobox` / `MultiSelect` dropdown popovers (the content panel) already use `bg-surface border border-edge shadow-brand rounded-none` — skin-correct, no change.
- `MultiSelect` tag chips (`rounded-full`, in the principle-permitted exceptions list) keep their shape; chip background shifts to `var(--muted)` so chips read against the new chassis without inheriting the old primary-100 tint.

---

## 2 · Decision

**Adopt a single "flat slot" chassis for all five trigger surfaces, with a calm-by-default state model** (no halos at rest, on focus, or on error). The full state ladder:

| State | Background | Border | Notes |
|---|---|---|---|
| **Resting** (light) | `var(--background)` (near-white) | `1px solid var(--edge)` | Input plane sits at the top of the light-mode surface ladder |
| **Resting** (dark) | `var(--surface)` (`#0d0d0d`) | `1px solid var(--edge)` | Input plane sits at the second level of the dark-mode surface ladder, with `--background` reserved as the "below" tone for disabled |
| **Hover** (Input/Textarea) | unchanged | unchanged | Cursor change is the affordance |
| **Hover** (Select/Combobox/MultiSelect) | unchanged | `rgba(255,255,255,0.16)` dark / `oklch(0.78 0.018 270)` light | One step brighter than `--edge` — "this opens a menu" cue |
| **Focus** | unchanged | `1px solid var(--accent)` dark / `var(--accent-700)` light | Hairline swap only; no caret tint, no halo |
| **Error** | unchanged | `1px solid var(--error)` (same hex, both modes) | Value text stays `--foreground`; helper text becomes `--error` |
| **Error + focused** | unchanged | `1px solid var(--error)` | Error wins — fault has priority over focus location |
| **Disabled** (light) | `var(--muted)` | `1px solid oklch(0.91 0.009 270)` (half-strength `--edge`) | Sink one step (input falls to the card-tone plane) |
| **Disabled** (dark) | `var(--background)` (`#07080a`) | `1px solid rgba(255,255,255,0.04)` (half-strength `--edge`) | Sink one step (input falls below the surface plane, reads "off the panel") |
| **Disabled — value text** | `text-foreground/30` | — | 30% opacity for typed value |
| **Disabled — placeholder** | `text-muted-foreground/50` | — | Half-opacity for empty disabled fields |
| **Disabled — cursor** | `not-allowed` | — | Replaces today's `pointer-events-none` |

Radius stays `0` (the 0/0/2/4 vocabulary already places inputs at 0). Sizes stay `sm` / `md` (no change — the chunk is chassis, not geometry). The native text cursor (`caret-color`) stays `--foreground`; the LED-as-signature pattern does not extend to inputs in this chunk.

Same-hex deviation: focus uses `--accent-700` in light mode (cyan-darkened) rather than raw `#00E1FA`. Justified by AA contrast — raw cyan on white fails. This is the same exception SKIN-PRINCIPLES § 2 already documents for Button Outline border chrome, applied identically here.

`FormField` updates:

| Element | Today | Becomes |
|---|---|---|
| Required asterisk | `text-error-600` | `text-error` |
| Error message paragraph | `text-xs text-error-600` | `text-xs text-error` |
| Helper text (no error) | `text-xs text-muted-foreground` | unchanged |
| Aria wiring | (existing — clones child with `id`, `aria-describedby`, `error`, `aria-invalid`) | unchanged |

SKIN-PRINCIPLES § 6 (Component patterns) gains a new sub-section codifying the input chassis:

> **Flat slot for typed input**
> Text-entry controls (Input, Textarea, Select trigger, Combobox trigger, MultiSelect trigger) use a flat fill (`--background` in light, `--surface` in dark) with a 1px `--edge` hairline border. No bevel, no chassis gradient — they're the inverse of Button: a slot, not a switch.
> **Why:** The instrument-panel metaphor has Button as depth and Input as plane — Button's bevel and LED carry the "switch you press" reading, Input is the "slot you put data into" defined by its hairline. Bevels on inputs would double the visual weight on dense forms and compete with Button's bevel for the eye's "this is interactive hardware" signal.
> **How:** Resting chassis = `--background` (light) / `--surface` (dark) — top of the light ladder, second-from-top of the dark ladder. Focus = hairline swaps to `--accent` (or `--accent-700` in light for AA). Error = hairline swaps to `--error` + helper text in `--error`, value stays foreground. Disabled = chassis sinks one step (light → `--muted`, dark → `--background`) + value drops to 30% opacity + hairline drops to half-`--edge` alpha. Hover = none for text inputs; hairline brightens one step for dropdown triggers (Select / Combobox / MultiSelect). No halo at rest, on focus, or on error.
> **Source:** Decision #84.

---

## 3 · Rationale

Each piece has its own reason; the chunk is opinionated about restraint at every state.

### Why flat slot, not recessed bevel

A recessed-slot chassis (inverted bevel — dark inset shadow on top, light highlight on bottom) was the most committed "inverse of Button" reading and was the visual front-runner. It was rejected during brainstorming because (a) it doubles the depth budget on dense forms — a settings page with 8 stacked inputs reads as 8 carved channels, which becomes noisy fast; (b) the chassis vocabulary the skin needs to land first is "Button is depth, input is plane" — once that's established, adding depth to inputs later is reversible, but starting with depth on both makes Button less special. Flat fill + hairline does the job: the input still reads as a slot (the hairline frames it), but it doesn't compete with Button's bevel for visual mass.

### Why calm-by-default at every state

A halo on focus was the second visual front-runner — Button's hover halo extended naturally to inputs' focused state. It was rejected for the same dense-forms reason: a form where the user tabs through 6 fields would bloom 6 halos in sequence, which felt busy. Same logic killed the error halo and the "value text turns red" option. The system's halo budget is reserved for Button hover and saturated-semantic-Button rest; spending it on input state changes would weaken those signals where they actually carry weight.

### Why caret stays foreground

A `caret-color: var(--accent)` change would have made the blinking text cursor itself the LED — naturally pulsing browser behavior, no extra animation, ties the LED-as-signature pattern to inputs without adding any new visual element. It was the strongest "extend the signature to inputs" option but lost to the calm-by-default direction. The brainstorm's pattern across chassis (B over A), focus (A over B/C), and error (A over B) consistently chose restraint over voltage extension; the caret decision follows that bias. The pattern is reversible later if the system feels tonally empty at input edges.

### Why same-hex error border but accent-700 focus border

Error `#FF3D00` has enough chroma + lightness contrast against both white and `#07080a` to meet AA on body text (and a fortiori on a 1px border). Cyan `#00E1FA` doesn't — at L=0.84 it floats over white. The same-hex deviation for Button Outline (Decision #82) already established the pattern: same-hex binds chassis fills and glows, but outline chrome may shift between modes when contrast demands it. Inputs use the same exception, same reason.

### Why disabled sinks one step in both modes (with asymmetric token choices)

Filled-Button Disabled flattens to `bg-muted` (light) or `bg-neutral-900` (dark) — a flat neutral chip that visibly stops being a control. Inputs can't flatten the same way because their resting chassis is already neutral; "flattening" by changing background tone needs to **sink** rather than collapse. In both modes, the disabled input falls one step down the surface ladder. The token choice per mode reflects how the ladder is shaped:

- **Light mode** has two surface tones: `--background` (near-white, `oklch(0.99)`) at the top, and `--surface` / `--muted` (grey, `oklch(0.94)`) at the second level. Resting input sits at `--background` (the elevated plane) and sinks to `--muted` when disabled (the card-tone plane). In a real layout, a disabled input ends up the same hex as the Card it lives in — the hairline (at half-`--edge` alpha) still frames it.
- **Dark mode** has three usable surface tones below `--muted`: `--surface` (`#0d0d0d`), `--background` (`#07080a`), and (for raised popovers) `base-700` (`#161718`). Resting input sits at `--surface` and sinks to `--background` when disabled. The dark-mode resting input is the same hex as a Card it sits in (both `--surface`) — again, the hairline frames it. The disabled state sinks visibly below.

The initial direction proposed using `bg-muted` in dark mode, mirroring the light-mode token choice. That was a mistake: `--muted` in dark is **above** `--surface` and `--background`, so the disabled input floated up rather than receded. Caught during visual review and corrected to `--background` for the sink direction. The asymmetric token choices (`--muted` in light, `--background` in dark) deliver symmetric *semantics* — both directions sink one step.

Value text drops to 30% opacity, placeholder to 50% (so empty disabled inputs still read as "an input slot" even with their chassis sunk), cursor to `not-allowed`. The `disabled:pointer-events-none` from today is replaced by `disabled:cursor-not-allowed` to keep the input visually a target with the standard browser-disabled semantics (the underlying `<input disabled>` attribute already blocks interaction).

### Why no hover on text inputs but hover on dropdown triggers

`Input` and `Textarea` are obvious text targets — the I-beam cursor is the hover affordance, no chassis change needed. `Select`, `Combobox`, `MultiSelect` triggers are buttons in disguise — you click them to open a popover, and the user benefits from a "this is interactive beyond just text" cue. The hairline brightening (one step up from `--edge`) is the quietest possible cue: it preserves the chassis but signals interactivity.

### Why sizes stay sm / md

The current size scale works. `sm` (`py-1.5 px-4 text-sm`) is dense-form-friendly; `md` (`py-2 px-5 text-base`) is the default. No `xs` because forms shouldn't be tighter than `sm` — at that density typography breaks down and the eye loses field boundaries. The chunk's focus is chassis; sizing is left alone.

### Why FormField gets a token fix but no structural change

`text-error-600` was the Aleph-era token name; the new skin has `--error` as the canonical semantic. The fix is mechanical (one className per occurrence). The cloneElement aria-wiring, label rendering, and error/helper switching are all correct and stay. Decoupling from scale steps protects FormField from future palette work — if `error-600` were ever renamed or removed, the semantic `--error` would still be there.

---

## 4 · Alternatives considered

### Chassis direction (rejected: recessed bevel)
Inverted-bevel slot with inset top-shadow + bottom-highlight — strongest "instrument panel" reading and the most committed inverse of Button. Rejected because dense forms (5+ stacked inputs) would read as 5+ carved channels, doubling the depth budget. Reversible later if the system feels tonally flat; for now, Button owns depth.

### Chassis direction (rejected: keep current borderless fill, tokens fixed only)
The lowest-risk change — keep `border-0` chassis, just swap the wrong tokens. Rejected because "borderless" doesn't frame the input slot — without a hairline, the input bleeds into the card on light mode, and the resting state has no chrome to swap to cyan on focus.

### Focus (rejected: cyan caret)
`caret-color: var(--accent)` — would have made the blinking text cursor the LED, no extra animation needed. Rejected to keep the calm-by-default direction consistent (the user's brainstorming pattern leaned restraint at every choice). Reversible later if inputs feel tonally empty.

### Focus (rejected: cyan halo)
A 3px soft cyan halo outside the focused hairline — the most committed focus signal, parallel to Button hover halo. Rejected for the dense-forms reason: tabbing through 6 fields would bloom 6 halos in sequence.

### Error (rejected: error halo)
A 3px soft blood-orange halo around the error border. Rejected because error wins-on-priority is already established by border + helper text, and an alarmist halo on a form full of errors would feel hostile.

### Error (rejected: 2px bottom rail)
Drop the full border, replace with a 2px blood-orange rail under the input. Closer to the instrument-panel metaphor (a fault rail under a slot), but breaks the hairline consistency, requires a 2px exception to "1px hairlines, never thick," and would need a SKIN-PRINCIPLES carve-out. Rejected as the wrong amount of departure for the wrong reason.

### Error value text (rejected: turn value red)
The typed value would take `--error` color so the fault is signaled in every channel (border, value, helper). The "instrument panel — bad readout glows red" mental model has logic. Rejected because as the user types the fix character-by-character, the red value would persist until validation clears, then snap to foreground — visual jitter during the action of fixing the field. Material / Stripe / Linear / shadcn all keep value foreground for the same reason: the user has to read what they typed to fix it. Border + helper carry enough volume.

### Disabled (rejected: opacity-50)
The current behavior — `opacity-50` on the whole input. Rejected because "faded" reads as "loading" or "preview," not "semantically broken." A flat tonal shift reads as a broken control more clearly.

### Disabled — dark mode (rejected: chassis goes to muted/neutral-900)
The first proposal extended Button's "flatten to muted" treatment to inputs symmetrically. But in dark mode, the resting input chassis is already at `--background` (`#07080a`) — the floor. Moving up to `--muted` / `bg-neutral-900` made the disabled input **brighter** than the resting one (raised popover-tone), which read as "elevated card" not "broken control." Caught during visual review. Corrected: dark mode's disabled chassis stays at `--background`, but hairline drops to 0.04 alpha and value drops to 30% — the chrome carries the signal instead of the chassis.

### Hover on Input/Textarea (rejected: hairline brighten)
Same hairline-brighten treatment proposed for Select/Combobox/MultiSelect, applied to all six. Rejected because pure text inputs don't need a hover cue — the I-beam cursor is the affordance, and adding chassis hover noise to dense forms is the same problem as halos.

### LED-as-signature for inputs (deferred)
Adding a small cyan indicator (caret-color tint, or a left-edge LED bar, or an iconLeft slot that lights up on focus) was considered as a way to extend the LED signature. Deferred — none felt necessary against the calm-default direction, and Input/Textarea don't naturally have a leading-icon slot to host one. May surface later if the system feels tonally empty.

---

## 5 · Implementation surface

### Files touched

| File | Change |
|---|---|
| `packages/ds/src/components/input/input.tsx` | CVA chassis: bg/border/focus/error/disabled per the table in § 2 |
| `packages/ds/src/components/textarea/textarea.tsx` | Same CVA chassis as Input; keep `resize-y` |
| `packages/ds/src/components/select/select.tsx` | Trigger CVA chassis as above; add hover hairline-brighten; popover content unchanged |
| `packages/ds/src/components/combobox/combobox.tsx` | Trigger CVA chassis as above; add hover hairline-brighten; popover content unchanged |
| `packages/ds/src/components/multi-select/multi-select.tsx` | Trigger CVA chassis as above; add hover hairline-brighten; tag chip background → `var(--muted)`; popover content unchanged |
| `packages/ds/src/components/form-field/form-field.tsx` | `text-error-600` → `text-error` (2 occurrences) |
| `packages/ds/src/styles/tokens.css` | None expected — all needed tokens (`--background`, `--edge`, `--accent`, `--accent-700`, `--error`, `--muted`, `--foreground`) already exist |
| `apps/preview/src/app/components/input/page.tsx` | If hard-coded class showcases stale chassis classes, refresh |
| `apps/preview/src/app/components/textarea/page.tsx` | Same |
| `apps/preview/src/app/components/select/page.tsx` | Same |
| `apps/preview/src/app/components/combobox/page.tsx` | Same |
| `apps/preview/src/app/components/multi-select/page.tsx` | Same |
| `apps/preview/src/app/components/form-field/page.tsx` | Verify error helper reads as `--error`, not stale scale step |
| `packages/ds/src/components/input/*.test.tsx` (and the equivalents) | Update class-snapshot assertions to match new chassis; behavioral assertions (focus, aria-invalid, disabled, change events) unchanged |
| `docs/SKIN-PRINCIPLES.md` | Add "Flat slot for typed input" sub-section under § 6 Component patterns |
| `docs/DESIGN-SYSTEM.md` | Update Input / Textarea / Select / Combobox / MultiSelect / FormField docs to reflect new chassis classes + state behavior |
| `docs/ARCHITECTURE.md` | If the chassis pattern is new architecturally (shared class string across 5 components), document the convention |
| `docs/DECISIONS.md` | Add Decision #84 |
| `docs/BACKLOG.md` | Move text-input chassis reset to Completed |
| `CLAUDE.md` | Update Current Features list — Input/Textarea/Select/Combobox/MultiSelect descriptions |

### Tokens referenced (no new tokens)

`--background`, `--foreground`, `--muted`, `--muted-foreground`, `--edge`, `--accent`, `--accent-700`, `--error`. All exist in `tokens.css` today.

### CVA class strings (target)

The resting chassis will be reusable as a shared class string. Suggested location: `packages/ds/src/components/ui/input-chassis.ts` exporting a CVA function, or inline in each component if the duplication is small. Implementation choice deferred to the plan.

---

## 6 · Tests + verification

- Unit: each component's existing test updated to assert the new chassis classes; focus/error/disabled behavioral assertions kept
- Preview pages re-rendered in light + dark, both `sm` and `md` sizes, for each state (rest / hover / focus / error / disabled / error+focused / error+filled)
- `npm run check` (lint + typecheck + test) clean
- Dense-form smoke: build a stacked-8-input form in the FormField preview and eyeball whether the hairline + cyan focus reads calm

---

## 7 · Out of scope (explicit)

- `Checkbox`, `RadioGroup`, `Switch`, `Slider` — separate boolean/range chunk
- MultiSelect tag chip color depth — chip shape (`rounded-full`) and background (`var(--muted)`) confirmed; full chip redesign deferred
- Select / Combobox / MultiSelect dropdown popover content (item highlight, separator, check icon, etc.) — already skin-correct
- A separate `--input` token — not introduced; reusing existing semantic tokens
- LED-as-signature extension to inputs (caret tint, leading-edge bar) — deferred per § 4 alternatives
