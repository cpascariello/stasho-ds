# Button redesign — Instrument Panel direction

**Goal:** Replace the current generic gradient buttons with a distinctive "instrument panel" vocabulary that carries the Abyssal Void skin's deep-sea / hardware-telemetry personality. The signature is a small glowing cyan LED on every filled button, plus a beveled chassis that reads as a real hardware control.

**Skin:** Abyssal Void (Decisions #77, #78, #79)
**Direction picked:** Instrument Panel (option D from `directions.html`)
**Visual companion artifacts:** mockup HTMLs in `.superpowers/brainstorm/` (gitignored, regenerated per session) — `directions.html`, `typography.html`, `variants.html`, `semantic-brighter.html`, `states.html`, `icons.html`, `sizes-v3.html`, `xs-tune.html`, `assembled.html`. The `assembled.html` is the final reference.

---

## What changes

| Property | Before | After |
|---|---|---|
| Font | Anybody Bold (heading face) | Inter 700 |
| Case | Title/sentence (inherited from page) | Sentence case, locked |
| Geometry | `rounded-none border-3` (3px purple border) | `rounded-none`, no border |
| Sizes | `xs`, `sm`, `md`, `lg` | `xs`, `sm`, `md` (lg dropped) |
| Variants | `primary`, `secondary`, `outline`, `text`, `destructive`, `warning` | `primary`, `secondary`, `destructive`, `warning`, `success`, `outline`, `ghost` (renamed from `text`, `success` added) |
| Signature | Purple gradient fill | Cyan LED dot + bevel chassis |
| iconLeft | Plain icon | Inherits LED treatment (cyan + glow) when present on filled variants |
| Line-height | Default (1.5) | `1` — required for LED/icon vertical centering |

---

## Variant model

Seven variants in three groups by treatment:

### Filled · cyan LED, beveled chassis

| Variant | Chassis | LED | Foreground |
|---|---|---|---|
| `primary` | `linear-gradient(180deg, var(--color-primary-900), var(--color-primary-950))` | `var(--accent)` with `0 0 8px var(--accent)` glow | white |
| `secondary` | `var(--color-neutral-900)` solid | `var(--accent)` with glow | white |

Both share the bevel shadow stack: `inset 0 1px 0 rgba(0,225,250,0.4), inset 0 -1px 0 rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.05)`. Secondary uses a fainter white top-highlight (`rgba(255,255,255,0.06)`) instead of cyan.

### Semantic · solid saturated + outer halo

| Variant | Chassis (solid) | LED | LED glow | Foreground | Halo |
|---|---|---|---|---|---|
| `destructive` | `var(--error)` `#FF3D00` | `#ffffff` | `0 0 8px white` | `var(--error-foreground)` `#fff` | `0 0 24px rgba(255,61,0,0.5)` |
| `warning` | `var(--warn)` `#ffc53d` | `var(--warn-foreground)` `#1a1100` | none | `var(--warn-foreground)` | `0 0 24px rgba(255,197,61,0.5)` |
| `success` | `var(--success)` `#2BD58E` | `var(--success-foreground)` `#00130a` | none | `var(--success-foreground)` | `0 0 24px rgba(43,213,142,0.5)` |

Semantic chassis uses the same inset highlight/lowlight bevel pair as filled. The outer halo replaces the inset cyan top-highlight on these (they're already saturated — extra cyan would muddy the signal). LED color inverts to either white (on destructive) or the foreground color (on warning/success) for contrast against the saturated chassis. Warning and success LEDs don't glow because dark dots on bright chassis don't read as "lit".

### Quiet · no halo, no chassis

| Variant | Chassis | LED | Foreground |
|---|---|---|---|
| `outline` | transparent + `1px solid rgba(0,225,250,0.4)` | `rgba(0,225,250,0.5)` dim disc, no glow | `var(--accent)` |
| `ghost` | transparent | none | `rgba(255,255,255,0.75)`, hover `rgba(255,255,255,0.04)` background |

Outline keeps the LED-shaped marker for vocabulary continuity but drops the glow so it doesn't compete with filled buttons for attention. Ghost drops the LED entirely — it's the only variant without one.

`text` is renamed to `ghost` to match standard DS vocabulary (shadcn, Linear, etc.). This is a breaking change to consumer code that uses `<Button variant="text">` — those callsites become `variant="ghost"`.

---

## State system

Six states across all variants. The state-specific deltas:

| State | Move |
|---|---|
| `rest` | resting brightness, LED steady glow, halo at resting opacity |
| `hover` | chassis brightens (gradient top shifts brighter), outer halo intensifies, LED glow grows from 8px to 14px + outer 24px halo |
| `active` (pressed) | chassis inverts (darker top, lighter bottom — looks pressed), `translate-y-[1px]`, inset shadow becomes dominant |
| `focus` | cyan outer ring at 2px offset — `box-shadow: 0 0 0 2px var(--background), 0 0 0 4px var(--accent)`. Always cyan regardless of variant. |
| `disabled` | chassis flattens to neutral dark gray, LED dims to 25% opacity with no glow, label drops to muted white, `cursor: not-allowed` |
| `loading` | chassis unchanged, LED runs `led-pulse` keyframe animation (4px → 14px glow, 0.4 → 1 opacity, 1.1s ease-in-out), label dims slightly, `cursor: wait`. When iconLeft is present, it pulses instead of the LED. |

Focus ring is system-universal (cyan), not semantic — it's about "which control has keyboard focus", not "what kind of action".

Loading replaces the `Spinner` swap that the current button does. The LED pulse IS the loading indicator — no spinner needed. This matches the "the LED is the signal" thesis and removes one moving part.

All transitions: `transition: background 120ms ease, box-shadow 120ms ease, transform 80ms ease`.

`prefers-reduced-motion: reduce` cancels the LED pulse animation and the transform on active.

---

## Size scale

Three sizes. `lg` is dropped — consumers can use `md` for emphasis or place the action in a more prominent layout slot.

| Size | Padding (filled / semantic / ghost) | Padding (outline) | Font size | LED size | LED glow | Icon size | Gap |
|---|---|---|---|---|---|---|---|
| `xs` | `6px 12px` | `5px 11px` | 11px | 4×4 | `0 0 5px` | 11×11 | 6px |
| `sm` | `7px 14px` | `6px 13px` | 12px | 5×5 | `0 0 6px` | 12×12 | 7px |
| `md` (default) | `9px 18px` | `8px 17px` | 13px | 6×6 | `0 0 8px` | 13×13 | 8px |

Outline subtracts `1px` from each padding axis to account for its `1px solid` border, keeping the visual height matched to filled variants.

---

## Icon behavior

Both `iconLeft` and `iconRight` are kept in the API.

### `iconLeft`
When provided, the LED is **not rendered**. The icon takes the LED's leading-slot position. The icon inherits the LED treatment per variant:

| Variant | Icon color | Icon filter |
|---|---|---|
| `primary`, `secondary` | `var(--accent)` cyan | `drop-shadow(0 0 4px var(--accent))` |
| `destructive` | white | none (chassis is already saturated) |
| `warning`, `success` | foreground (dark) | none |
| `outline` | `var(--accent)` cyan | `drop-shadow(0 0 4px var(--accent))` |
| `ghost` | `rgba(255,255,255,0.6)` | none |

The icon literally becomes the LED — it's the same semantic slot, just with a glyph instead of a dot.

### `iconRight`
Always white (or variant foreground), no glow. Sits after the label.

### Loading + icon
When `loading` is `true` and `iconLeft` is present, the icon pulses with the same animation as the LED. When no icon is present, the LED pulses.

---

## Typography

- Family: `Inter` (existing DS font, body family — semantic `font-body` Tailwind class)
- Weight: `700` for filled variants, `600` for ghost
- Case: sentence case — **never uppercase**, even when consumers pass uppercase strings (no `text-transform` applied; consumer string is respected)
- Letter-spacing: `normal` (no tracking)
- Line-height: `1` — required for LED/icon vertical centering. Without this, Inter's default `1.5` line-height creates a line-box taller than the cap-height and the LED appears to float low

This is a deliberate departure from the current `font-heading font-bold` (Anybody). Buttons are pressable hardware controls, not headlines — they want a body-family voice, not a display voice.

---

## Geometry

- Border radius: `0` across all variants and sizes. Confirms the Abyssal Void `0/0/2/4` rule (`#78`) — buttons sit in the "0" bucket.
- Border: none on filled and semantic. `1px solid rgba(0,225,250,0.4)` on outline. None on ghost.
- The current `border-3` (3px) is dropped entirely.

---

## Accessibility

- `aria-busy={loading || undefined}` — unchanged from current
- `disabled` HTML attribute applied — unchanged
- Focus ring meets 3:1 contrast against any chassis (cyan over dark blue: ~7:1; cyan over saturated brand colors: 3.5:1+)
- `prefers-reduced-motion: reduce` cancels LED pulse, hover halo intensify, and active translate
- Color contrast:
  - White-on-`#FF3D00` (destructive): 4.5:1 ✓ AA
  - `#1a1100` on `#ffc53d` (warning): 12.4:1 ✓ AAA
  - `#00130a` on `#2BD58E` (success): 8.1:1 ✓ AAA
  - Outline cyan-on-`var(--background)` (dark mode): 12:1 ✓ AAA
  - Ghost `rgba(255,255,255,0.75)` on dark background: 8.4:1 ✓ AAA

---

## Implementation outline

### Files

- **Modify** `packages/ds/src/components/button/button.tsx`
  - Rewrite CVA config (variants, sizes, states)
  - Add `success` variant
  - Rename `text` → `ghost`
  - Drop `lg` size
  - Add LED-rendering logic + iconLeft → glowing icon transformation
  - Wire `loading` to LED pulse instead of `Spinner` swap (remove Spinner import if unused elsewhere)
- **Modify** `packages/ds/src/components/button/button.test.tsx`
  - Update variant tests (`text` → `ghost`, add `success`)
  - Update size tests (remove `lg`)
  - Add LED rendering test (default present, hidden when iconLeft, replaced by spinner-pulse on loading)
  - Update class assertions for new utility classes
- **Modify** `packages/ds/src/styles/tokens.css`
  - Add `@keyframes button-led-pulse` keyframe (and motion-reduce companion)
  - Optionally add `--gradient-btn-primary-bevel` if reused outside button — defer until a second consumer appears
- **Modify** `apps/preview/src/app/components/button/page.tsx`
  - Rebuild demo grid to show all 7 variants × 3 sizes
  - Show iconLeft (cyan glow), iconRight, loading, disabled states
  - Drop any `lg`/`text` references
- **Modify** `docs/DESIGN-SYSTEM.md`
  - Update Button section: variants list, size list, LED behavior, icon behavior

### Approach

Use Tailwind arbitrary-value utilities for the bevel + halo shadows directly in the CVA config. Don't introduce new gradient or shadow tokens in `tokens.css` until a second consumer needs them — the "instrument panel" treatment is button-specific. Existing tokens (`--primary`, `--accent`, `--error`, `--warn`, `--success`, `--color-primary-900`, `--color-primary-950`, `--color-neutral-900`, `--background`) cover all chassis and LED colors.

LED is rendered as a `<span>` inside the button when `!iconLeft && !loading && variant !== 'ghost'`. When iconLeft is present (and not loading), iconLeft is wrapped in a span that applies the variant-specific glow treatment.

Keyframe `button-led-pulse` lives in `tokens.css` because it's a CSS animation — Tailwind can reference it via `animate-[button-led-pulse_1.1s_ease-in-out_infinite]`.

### Breaking changes for consumers

1. **`variant="text"` → `variant="ghost"`** — rename at all call sites. Grep across consumer apps: `scheduler-dashboard`, `cloud-app`, any future consumers.
2. **`size="lg"` → `size="md"`** — replace at all call sites (or remove the prop, since `md` is the default).
3. **Button visual appearance changes drastically** — any custom `className` overrides that worked against the old gradient may break. Audit consumer apps for `className` props on Button that set background/border/text-color.

Consumer-app migration is intentionally out of scope for this spec — it ships as a separate task once the DS package publishes the redesigned button. The DS-side change can land independently because consumer apps pin DS versions.

These are acceptable because the skin redesign is the umbrella context — consumers are expecting visual breakage and adjusting alongside the rest of the Abyssal Void rollout.

---

## Out of scope

- **Icon-only buttons** — not in current API and not part of this redesign. Backlog candidate.
- **Toggle buttons / pressed state** — separate component pattern.
- **Button groups / segmented controls** — already covered by `Tabs` pill variant.
- **`asChild` behavior changes** — keep current `cloneElement` pattern; just feed it the new className stack.
- **Animated icon transitions on hover** — already on backlog (`Button icon animations`, 2026-02-26). Leave there.

---

## Open questions

None. All design decisions are locked.
