# Slider thumb revisit — Design

**Date:** 2026-05-27
**Wave:** 1 (revisit of chunk 4)
**Component:** Slider
**Integration branch:** `skin/paraplu`
**Chunk branch:** `skin/slider-thumb-revisit` (off `skin/paraplu`)
**Sequencing:** Standalone chunk. The active `skin/wave-1-finish` branch (Pagination · Switch · Stepper · Alert) does not touch Slider; this chunk can ship before, in parallel with, or after wave-1-finish without conflict.

---

## 1 · Problem

Slider shipped in chunk 4 (Decision #85) with a solid cyan thumb on a cyan range fill. The thumb is `bg-accent` with `border border-accent` — border and fill are the same hex, so the border adds nothing at rest. Differentiation from the range fill comes only from the silhouette extending past the track height. On the range side the thumb reads as "a swelling" rather than "a control".

Three issues confirmed by visual review:

1. **Melts into range.** Solid cyan on solid cyan provides no visual handle.
2. **Lacks character.** A generic disc doesn't carry the wave's instrument-panel identity the way Button's LED or Switch's bevel do.
3. **Too large.** Current `md` = 20×20, `sm` = 16×16 — visually heavy against the thin track.

---

## 2 · Decision

Replace the solid-disc thumb with a **cyan ring** (aperture / reticle). Shrink both sizes. Repaint to solid cyan + halo on hover/focus as a documented carve-out from "hover intensifies, doesn't repaint".

### 2.1 · Shape

- **Round** (`rounded-full` retained). The reservation is now principled — the ring IS round-by-design (aperture / reticle shape) rather than convention-only. Removes Slider thumb from the SKIN-PRINCIPLES § 4 "flagged for audit" list.
- **Ring chassis:** 1.5px `border-accent` on a `bg-background` interior. The interior tracks `--background` so it auto-flips light/dark (near-white in light mode, `#07080a` in dark).
- **Ring weight:** 1.5px. 1px reads too thin at the 12×12 `sm` size; 2px eats too much of the interior aperture at 14×14 `md`. 1.5px is the comfortable middle.

### 2.2 · Sizes

| Variant | Thumb | Track (unchanged) |
|---|---|---|
| `md` (default) | 14×14 (was 20×20) | h-2 (8px) |
| `sm` | 12×12 (was 16×16) | h-1.5 (6px) |

### 2.3 · State map

| State | Treatment |
|---|---|
| Rest | Cyan ring · `bg-background` interior · no halo |
| Hover | Interior fills `bg-accent` · outer halo `0 0 6px var(--accent), 0 0 12px rgba(0,225,250,0.5)` |
| Focus | `outline-2 outline-accent outline-offset-2` · same halo · ring stays open (interior `bg-background`) |
| Focus + hover | Outline + filled interior + halo |
| Disabled | Ring drops to `border-foreground/30` · no halo · `cursor-not-allowed` · range fades to `bg-foreground/30` (unchanged from chunk 4) |
| Error | Ring becomes `border-error` · interior `bg-background` · no halo |
| Error + hover | Interior fills `bg-error` · orange halo `0 0 6px var(--error), 0 0 12px rgba(255,61,0,0.5)` |

The `data-[disabled]:*` variant pattern from chunk 4 is preserved (Radix renders Thumb as `<span>`; `:disabled` doesn't match).

### 2.4 · Tooltip

Unchanged from chunk 4. Opt-in via `showTooltip` prop, popover-token chassis (`bg-popover-bg border border-popover-border rounded-none text-foreground`), positioned above the thumb, shown while hovering the slider.

### 2.5 · Track + range

Unchanged from chunk 4. Bevel track stays (`shadow-[inset_0_1px_0_rgba(255,255,255,0.06),inset_0_-1px_0_rgba(0,0,0,0.4)]`). Range fill stays solid `bg-accent`. Range `rounded-full` stays.

---

## 3 · Decisions made in brainstorm

### 3.1 · Q1 — Thumb shape: cyan ring

Options shown: (A) dark chassis + cyan LED dot, (B) cyan ring with dark interior, (C) playhead bar.

**Chose B.** The ring carries the brand colour, the dark interior carries differentiation from the range fill, the silhouette reads as an aperture / reticle (telemetry vibe without being literal).

**Rejected:** A — dark chip with LED echoes Switch/Button vocabulary too closely; risks reading as a tiny button rather than a slider thumb. C — strongest telemetry reading but breaks the round-thumb convention; users expect a roughly round-ish thumb on a slider and the orthogonal silhouette would be surprising in dense forms.

### 3.2 · Q2 — Hover behavior: fill + halo (D)

Options shown: (A) halo only, (B) ring fills cyan, (C) ring thickens, (D) fill + halo combo.

**Chose D.** Interior fills cyan AND outer halo lights up. Strongest interaction feedback — reads as "the aperture closed and the dot is fully lit".

**Carve-out from "hover intensifies, doesn't repaint" (§ 5):** Slider thumb is a directly-grabbed control where the fill is the "you've got it" cue. The repaint is intentional and bounded to the interior of an existing chassis (no border/shape change). Filed as a documented exception in § 6 Direction C amendment.

**Rejected:** A (halo only) — principle-faithful but reads as a passing hover, not a "grabbable" cue. B (fill only) — repaints without the halo cue; merges visually with the cyan range fill. C (thicken) — too subtle to register at 14px.

### 3.3 · Q3 — Focus behavior: outline + halo, ring stays open

Focus gets `outline-2 outline-accent outline-offset-2` (the chunk-4 Slider focus pattern, unchanged) plus the hover halo. The ring stays open — interior does NOT fill cyan on focus alone. Fill is reserved for hover (mouse-confirmed intent) and the focus+hover compound.

**Why:** Keyboard focus is a "where am I" cue, not a "grabbing" cue. Outline + halo says "the aperture is selected"; filling the interior would conflate focus with active interaction.

### 3.4 · Q4 — Sizes: 14 / 12

**Chose md 14 / sm 12.** Down from 20 / 16. Comfortable against the 8px / 6px tracks — the thumb extends ~3px above and below the track, enough to register as a focal point without dominating.

**Rejected:** md 16 / sm 12 (compromise — 16 is still close to current 20 and doesn't push the "lighter" intent far enough).

### 3.5 · Q5 — Ring weight: 1.5px

**Chose 1.5px.**

**Rejected:** 1px (strict hairline) — reads thin at the 12px `sm` size, ring almost disappears. 2px — eats the dark interior; aperture closes too tightly.

---

## 4 · Files changed

| File | What changes |
|---|---|
| `packages/ds/src/components/slider/slider.tsx` | `thumbVariants` CVA: size shrink (md 20→14, sm 16→12), ring class (`bg-background border-[1.5px] border-accent`), hover fill (`hover:bg-accent`), error fill on hover, focus outline kept. `SliderPrimitive.Range` className unchanged. |
| `packages/ds/src/components/slider/slider.test.tsx` | Confirm existing tests pass under new classes. Add coverage for thumb's `bg-background` rest state and `border-accent` ring. |
| `apps/preview/src/app/components/slider/page.tsx` | No API change. Visual verification only — confirm size, ring, hover, focus, disabled, error all read correctly in both themes. |
| `docs/SKIN-PRINCIPLES.md` | § 4 reserved list: Slider thumb's "flagged for audit" qualifier removed; new principled justification. § 6 Direction C: amendment for Slider thumb behaviour (ring at rest, fill + halo on hover/focus — documented carve-out from § 5 "doesn't repaint"). |
| `docs/DESIGN-SYSTEM.md` | Refresh Slider entry: new sizes, ring shape, state map. |
| `docs/DECISIONS.md` | New Decision entry (next available number) covering shape, hover repaint carve-out, ring weight, sizes, principle deltas. |
| `docs/BACKLOG.md` | Update "Rounded-full audit" — remove Slider thumb (now principled); MultiSelect chips remain. |
| `CLAUDE.md` | Current Features list update for Slider. |

---

## 5 · Out of scope

- **Track shape** — `rounded-full` track stays. The rounded ends are a graph convention (existing § 4 reserved-list entry).
- **Range fill** — solid `bg-accent` stays. The rounded-full Range tail stays.
- **Bevel** — inset shadow on track unchanged.
- **Sizes beyond sm/md** — no new `xs` or `lg` variant. Two sizes match the chunk-4 commitment.
- **Tooltip API** — opt-in `showTooltip` prop unchanged. Surface tokens already on the chunk-6 popover token.
- **Single vs range mode** — no behaviour change; both modes inherit the new thumb chassis.
- **Marks/ticks** — not in scope, never shipped.
- **Accessibility** — `aria-*` and keyboard behaviour unchanged.

---

## 6 · Principle deltas

### 6.1 · § 4 Geometry — reserved list

The Slider thumb entry in the reserved list becomes:

> - Slider thumb (the ring IS an aperture — a round shape encodes the "scope reticle / position marker" reading; `rounded-full` is principled, not convention)

This replaces whichever Slider-thumb line is current at implementation time — either the original "Slider thumb / Switch thumb (a control puck IS round)" entry (if this chunk ships before wave-1-finish) or the wave-1-finish revision flagging it for audit (if wave-1-finish ships first). Either way the slot is the same; only the justification text changes.

### 6.2 · § 6 Direction C — Slider amendment

Current line (from Decision #85):
> Switch and Slider thumbs gain `box-shadow: 0 0 5px var(--accent), 0 0 10px rgba(0,225,250,0.6)` on hover/focus only (solid cyan at rest).

After this chunk:
> Switch thumb is solid cyan at rest, glow on hover/focus. Slider thumb is a 1.5px cyan ring on a `bg-background` interior at rest (an aperture); on hover, the interior fills `bg-accent` and an outer halo `0 0 6px var(--accent), 0 0 12px rgba(0,225,250,0.5)` lights up — a documented carve-out from § 5 "hover intensifies, doesn't repaint" because the Slider thumb is a directly-grabbed control and the fill is the "you've got it" cue. The repaint is bounded to the interior of an existing chassis (no border, size, or shape change).

---

## 7 · Risks

- **Ring at 12px `sm` may register as thin in bright environments.** 1.5px on a 12px disc gives a ~9px interior aperture. Mitigation: ring colour is cyan against `bg-background` (high contrast in both modes). If field reports show issues, bump `sm` ring to 2px as a follow-up (decision recorded so it's clear what to change).
- **Filled hover on cyan range may look like the thumb disappears into the range** — visually the cyan interior + cyan range merge, but the outer halo extends 12px beyond the thumb, leaving a glowing focal zone ~38px wide. Verified in mockups: reads as a "spotlight on the range", not a vanishing thumb. Confirm in dev server during implementation.
- **Light mode interior is near-white**, not literally black — when sitting on the cyan range in light mode, the white interior is the differentiator. Reads consistently as an aperture, just inverted. Confirm in dev server.

---

## 8 · Success criteria

- Slider thumb reads as a control on the cyan range (not as a swelling)
- Thumb is visually lighter than before (14px md vs 20px md)
- Hover/focus produce strong, unambiguous interaction feedback
- Disabled reads as "broken" (not "loading"), error reads as "wrong" (not "decorative")
- All existing tests pass; new tests cover the ring and fill-on-hover
- Visual verification in dev server confirms both themes, both sizes, single + range modes
