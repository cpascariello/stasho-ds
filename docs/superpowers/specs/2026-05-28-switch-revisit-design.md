# Switch — visibility + breathing revisit

**Date:** 2026-05-28
**Status:** design approved
**Integration branch:** `skin/paraplu` (Abyssal Void skin)
**Source artifacts:** brainstorm session 2026-05-28, mockups in `.superpowers/brainstorm/67872-1779959176/content/`

## Context

Three issues observed in the live Abyssal Void Switch:

1. **Light + dark feel inconsistent.** The shared bevel `inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.4)` reads cleanly in dark mode (sunken slot) but smudgy in light mode — 40% black on light grey reads as dirt, not depth.
2. **Thumb-to-stroke gap is too tight.** Visible vertical breathing between thumb and track border is 1px. Decision #92 says "2px symmetric breathing"; the 1px border implicitly ate into the budget.
3. **Light-mode disabled doesn't read as disabled.** Rest track is already `bg-muted`, so `disabled:bg-muted` (the project-wide flat-sink pattern) is a no-op in light mode. Only the border faintly fades.

## Decisions

### 1. Geometry — 2px symmetric breathing inside the 1px border

Track outer = thumb + 6 (4px breathing + 2px border).

| size | track outer (h&times;w) | thumb | translate (off → on) | ratio |
| --- | --- | --- | --- | --- |
| xs | 18&times;32 | 12 | 0.5 → 16px | 1.78 |
| sm | 22&times;40 | 16 | 0.5 → 20px | 1.82 |
| md | 26&times;47 | 20 | 0.5 → 23px | 1.81 |

Thumbs unchanged at 12/16/20 — preserves Decision #92's "thumb matches Checkbox/Radio at same size variant" rule. Ratios stay in the 1.75-1.83 band.

Travel (off → on, in px): xs 14, sm 18, md 21 (up from 10/14/18). Larger track yields slightly more travel — fine.

### 2. Light-mode bevel — bright highlight + faint shadow

| | top inset | bottom inset |
| --- | --- | --- |
| **light (new)** | `rgba(255,255,255,0.70)` | `rgba(0,0,0,0.10)` |
| **dark (unchanged)** | `rgba(255,255,255,0.06)` | `rgba(0,0,0,0.40)` |

Light bevel mirrors Secondary Button's light-mode bevel proportions — bright top highlight + faint bottom shadow read as gentle depth on a light grey track without the "scuffed" look of a heavy black bottom. Dark bevel is preserved.

### 3. Disabled sink — light drops to `bg-edge`

| | rest fill | disabled fill | disabled border |
| --- | --- | --- | --- |
| **light (new)** | `bg-muted` (oklch 0.94) | `bg-edge` (oklch 0.87) | `border-edge-hover` (oklch 0.80) |
| **dark (unchanged)** | `bg-neutral-900` | `bg-background` | `border-edge/50` |

The light-mode track now sinks one ladder step (muted → edge) on disabled, matching the dark-mode "sink one step" pattern. The border deepens to `--edge-hover` so it stays visible against the now-darker fill. `disabled:shadow-none` is preserved in both modes.

Disabled thumb stays `bg-foreground/30` in both modes; disabled+on stays grey (cyan dropped) per Decision #85 compound-variant rule.

## Component changes

Single file: `packages/ds/src/components/switch/switch.tsx`.

### `switchVariants` base

Current:
```
"shadow-[inset_0_1px_0_rgba(255,255,255,0.06),inset_0_-1px_0_rgba(0,0,0,0.4)]"
"disabled:bg-muted dark:disabled:bg-background"
"disabled:border-edge/50 disabled:shadow-none"
```

New:
```
"[box-shadow:inset_0_1px_0_rgba(255,255,255,0.7),inset_0_-1px_0_rgba(0,0,0,0.10)]"
"dark:[box-shadow:inset_0_1px_0_rgba(255,255,255,0.06),inset_0_-1px_0_rgba(0,0,0,0.4)]"
"disabled:bg-edge dark:disabled:bg-background"
"disabled:border-edge-hover dark:disabled:border-edge/50"
"disabled:[box-shadow:none]"
```

The `disabled:data-[state=checked]:border-edge/50` rule (compound for disabled+on) needs a light-mode counterpart: `disabled:data-[state=checked]:border-edge-hover dark:disabled:data-[state=checked]:border-edge/50`.

### `switchVariants.size`

```
xs: "h-[18px] w-8"    // was h-4 w-7
sm: "h-[22px] w-10"   // was h-5 w-9
md: "h-[26px] w-[47px]"  // was h-6 w-11
```

### `thumbVariants.size`

```
xs: "size-3 data-[state=checked]:translate-x-[16px]"  // was translate-x-[12px]
sm: "size-4 data-[state=checked]:translate-x-[20px]"  // was translate-x-[16px]
md: "size-5 data-[state=checked]:translate-x-[23px]"  // was translate-x-[20px]
```

Off-state thumb translate stays `data-[state=unchecked]:translate-x-0.5` (2px from inner box origin → 3px from outer left after the 1px border).

### Unchanged

- Thumb hover/focus glow on on-state (`group-hover/sw:data-[state=checked]:shadow-[…]`, etc.)
- Focus outline (`focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2`)
- Cursor `disabled:cursor-not-allowed`
- On-state border `data-[state=checked]:border-accent/30`
- Radius `rounded-[2px]` on both track and thumb
- Thumb fill rules (off: `bg-edge`, on: `bg-accent`, disabled: `bg-foreground/30`)

## Docs to update

- `docs/SKIN-PRINCIPLES.md` § 5: amend the Decision #92 paraphrase. "Track height = thumb + 6 (4 breathing + 2 border)" replaces "thumb + 4". Add a one-line note that Switch's light-mode bevel uses bright-highlight / faint-shadow proportions because the muted-on-muted track needs a different reading than Button's filled chassis.
- `docs/DECISIONS.md`: new Decision (#96) capturing this revisit and the amendment to #92.
- `CLAUDE.md` Current Features: update the Switch entry — new dimensions, new light bevel, new disabled sink.
- `docs/DESIGN-SYSTEM.md`: if a Switch sizes table exists, update.

## Test plan

- **Visual:** preview app `/switch` route — verify all sizes + states in both modes match `q4-final-composed.html`.
- **Vitest:** existing `switch.test.tsx` passes unchanged (no API changes).
- **A11y:** focus outline visible on track around thumb; disabled retains `cursor-not-allowed` and `aria-disabled` (Radix handles).
- **Form composition:** Switch at md sitting next to a Checkbox at md still reads as the same visual weight (thumbs still 20 vs 20). Increased track height pushes Switch ~2px taller — acceptable; the visual anchor is the thumb, not the track outer.

## Out of scope

- Slider / ProgressBar track bevels (same shared pattern; revisit separately if their light-mode reading also feels off).
- Thumb size changes — Decision #92's "thumb matches Checkbox/Radio" stays.
- Decision #92 itself stays; this is an amendment, not a reversal.
