# Button Loading Animation — Dual-Dot Chase

**Date:** 2026-05-26
**Status:** Approved — proceeding to implementation
**Supersedes (partial):** The loading-state portion of [`2026-05-26-button-redesign-design.md`](./2026-05-26-button-redesign-design.md) and the `button-led-pulse` keyframe introduced in Decision #80.
**Integration branch:** chunk of `skin/paraplu`. Lands on the existing open PR `skin/buttons → skin/paraplu` (#1) as additional commits — not a separate PR.

---

## Problem

The original Button redesign (Decision #80, PR #1) used a single LED that pulses opacity + halo for the loading state (`@keyframes button-led-pulse`). When reviewed visually in the preview app, the treatment read as passive — a "blinking status light" — rather than the active "voltage / signal / instrument" identity the Abyssal Void skin is committed to (Decisions #77, #78, #79, SKIN-PRINCIPLES.md § 1).

Five candidates were prototyped in `apps/preview/src/app/loading-explore/` (throwaway page, not committed): pulse (baseline), scanline, bottom telemetry bar, sonar ring, dual-dot chase. The dual-dot chase was selected for its active "busy / working" reading and its visual coherence with the LED-as-signature language — the chase is recognizably two LEDs rather than a wholly different visual vocabulary.

## Decision

Replace the LED pulse animation with a **dual-dot chase**: two dots in the leading slot oscillate brightness in anti-phase during loading.

The chase replaces both the LED *and* any `iconLeft` for the duration of the loading state. When loading ends, iconLeft returns to its resting position (or, with no iconLeft, the static LED returns). This is the "shape-stable loading" model — the loading state always looks the same regardless of whether the consumer passed an icon.

## Visual specification

### Dots

Two `<span>` dots inside a `<span data-led-chase>` wrapper. Each dot:

- Round (`rounded-full`).
- Size matches the existing LED size for the button size:
  - `xs` → `size-1` (4px)
  - `sm` → `size-[5px]`
  - `md` → `size-1.5` (6px)
- Color and static glow inherited from the existing per-variant LED color mapping (`ledColorClass` in `button.tsx`):
  - `primary`, `secondary`, `outline` → `bg-accent` with cyan glow
  - `destructive` → `bg-white` with white glow
  - `warning` → `bg-warn-foreground` (dark, no glow)
  - `success` → `bg-success-foreground` (dark, no glow)
  - `ghost` → chase never renders (see Behavior § Ghost)
- 3px gap between dots, set on the wrapper (`gap-[3px]`).

### Animation

Two CSS keyframes, anti-phase:

```css
@keyframes button-chase-a {
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.25; }
}

@keyframes button-chase-b {
  0%, 100% { opacity: 0.25; }
  50%      { opacity: 1; }
}

.animate-button-chase-a { animation: button-chase-a 0.9s ease-in-out infinite; }
.animate-button-chase-b { animation: button-chase-b 0.9s ease-in-out infinite; }

@media (prefers-reduced-motion: reduce) {
  .animate-button-chase-a,
  .animate-button-chase-b {
    animation: none;
    opacity: 1;
  }
}
```

Notes:
- 0.9s ease-in-out matched the live exploration page. Faster (~0.6s) read as twitchy; slower (~1.2s) read as sleepy. 0.9s is the comfortable middle.
- Reduced-motion override forces both dots to full opacity rather than letting one stay at 0.25 — both dots should read as "lit" when motion is suppressed.

## Behavior

### When `loading={true}` and `variant !== "ghost"`

- The leading slot renders `<span data-led-chase>` containing exactly two `<span>` dots.
- The first dot has class `animate-button-chase-a`; the second has class `animate-button-chase-b`.
- Both `data-led` (the single-LED sentinel from the original spec) and `data-led-icon` (the icon-as-LED sentinel) are NOT present. The chase fully owns the loading visual.
- `iconLeft`, if provided, is not rendered — the chase occupies the leading slot.
- `iconRight` remains suppressed (existing behavior — no change from PR #1).
- `aria-busy="true"` on the button (existing behavior — no change).
- `pointer-events-none cursor-wait` on the button (existing behavior — no change).

### When loading ends (`loading={false}`)

- The chase is removed from the DOM.
- If `iconLeft` was passed, it returns to the leading slot in its resting style (cyan glow filter on filled variants, etc.).
- If no `iconLeft`, the static LED returns in the leading slot.
- `iconRight` returns (existing behavior).

### Ghost variant + loading

- The chase does NOT render (consistent with "ghost has no LED" — Decision #80).
- `aria-busy="true"` still applies. `cursor-wait` still applies. The button signals it's busy via cursor + ARIA only.
- The leading slot remains empty.

## Implementation changes

### `packages/ds/src/styles/tokens.css`

- **Remove** the `@keyframes button-led-pulse` block, the `.animate-button-led` utility, and the corresponding `@media (prefers-reduced-motion: reduce)` override that was added in PR #1.
- **Add** the `button-chase-a` / `button-chase-b` keyframes, the two `.animate-button-chase-*` utilities, and the reduced-motion override above. Place in the same location (after `@keyframes ring-wave`).

Replace, don't deprecate — per project conventions (CLAUDE.md), the old keyframe is gone entirely. No backward-compatible aliases.

### `packages/ds/src/components/button/button.tsx`

- **Remove** the `data-led-icon` branch (icon-as-LED loading wrapper).
- **Remove** the `iconGlowClass` loading interaction. The `iconGlowClass` map itself stays — it still drives iconLeft's resting cyan glow on filled variants.
- **Restructure** the `leadingSlot` IIFE:
  1. If `loading && variant !== "ghost"` → render the chase (two dots), ignoring iconLeft entirely.
  2. Else if `iconLeft` → render iconLeft with its resting glow class (no animation).
  3. Else if `variant !== "ghost"` → render the static LED.
  4. Else → render `null`.

This collapses the previous "if iconLeft → maybe pulse, else if !ghost → maybe pulse LED, else null" into a clearer "loading first, then content".

### `packages/ds/src/components/button/button.test.tsx`

Replace the existing loading tests (LED pulse, icon-as-LED pulse) with the chase contract:

- Loading without iconLeft (any non-ghost variant): `[data-led-chase]` is present, contains exactly 2 children, each child has its respective `animate-button-chase-*` class.
- Loading WITH iconLeft (any non-ghost variant): `[data-led-chase]` is present and contains exactly 2 chase dots. `[data-testid="left-icon"]` (the consumer's iconLeft) is NOT in the DOM.
- Loading on ghost variant: `[data-led-chase]` is NOT present. `aria-busy="true"` is set. The leading slot has no children.
- `data-led` is NEVER present when loading (the single-LED sentinel only appears at rest).
- No `svg.animate-spin` (preserved from PR #1 — defends against a Spinner regression).
- `aria-busy="true"` (preserved).
- iconRight is suppressed when loading (preserved).

The previously-flagged gap (ghost + loading test) is closed here.

### Docs

- `docs/DESIGN-SYSTEM.md` Button section — update "Loading and Disabled" subsection. The line that currently says "LED pulses; no spinner element; aria-busy" becomes "Two-dot chase animates; iconLeft is suppressed during load; no spinner; aria-busy". Remove the `<Button loading iconLeft={...}>` example showing "Icon pulses instead of LED" — replace with a comment that the chase displaces iconLeft.
- `docs/ARCHITECTURE.md` Button section — replace the "Loading animation" paragraph. New text: the chase is two dots driven by two anti-phase keyframes. Both `data-led` and `data-led-icon` go away as sentinels; only `data-led-chase` remains. `prefers-reduced-motion: reduce` parks both dots at full opacity (not zero — the loading state must still be visible without motion).
- `docs/DECISIONS.md` — add Decision #81 capturing the rejection of the pulse animation, the dual-dot chase decision, the shape-stable iconLeft behavior, and the four rejected alternatives (scanline, bottom telemetry bar, sonar ring, plus the iconLeft variants B/C/D). Supersedes the loading portion of Decision #80; the rest of #80 (variants, sizes, typography, geometry, focus model, disabled flatten) stands.
- `CLAUDE.md` Current Features — update the Button bullet's "loading state pulses the LED…" clause to "loading state runs a two-dot chase via `animate-button-chase-a/b` keyframes".

### Throwaway artifact

Delete `apps/preview/src/app/loading-explore/page.tsx`. The exploration page served its purpose; it is not part of the shipping preview app.

## Rejected alternatives

### Loading treatment alternatives (from `/loading-explore` round 1)

- **Pulse (baseline)** — original PR #1 treatment. Rejected for reading passive against the skin's identity.
- **Scanline** — horizontal cyan sweep across the chassis. Rejected: the motion reads "scanning the surface" which conflicts with "the button is the instrument doing the work" (instrument-panel mental model). Visually loud at saturated chassis colors (especially destructive).
- **Bottom telemetry bar** — 2px indeterminate bar at the chassis bottom edge. Rejected: too close to standard progress-bar UI; reads as "the button has a progress bar inside it" rather than as the button's own loading state. Strong second though.
- **Sonar ring** — LED emits expanding rings. Rejected: rings escape the chassis bounds, making the loading state visually larger than the resting button; reads more "transmitting" than "working".

### iconLeft interaction alternatives (from `/loading-explore` round 2)

- **B. iconLeft pulses, no chase** — the original PR #1 behavior. Rejected: two different loading "shapes" depending on whether iconLeft was passed, and the chase / icon-pulse pair don't feel like the same gesture.
- **C. Chase + iconLeft both visible** — chase to the left of the icon. Rejected: button width grows when loading starts (layout shift); leading-slot density spikes.

### Speed alternatives

- 0.6s — twitchy, reads anxious.
- 1.2s — sleepy, doesn't feel like "busy now".
- 0.9s — the chosen middle.

### Dot count alternatives

- 1 dot (just the LED, animated differently) — defeats the purpose; equivalent to the pulse.
- 3 dots (KITT-style scanner) — too graphic / pop-culture; the skin wants restrained signal.
- 2 dots — chosen. The minimum number that reads as "alternating signal".

## Open follow-ups (not in this revision)

Carried over from the PR #1 review — same posture as before, not introduced or worsened by this revision:

- `asChild` doesn't forward `disabled`. For `<a>` children, browser-level `disabled` is semantically meaningless; proper fix needs `aria-disabled` + href removal + onClick block. Separate design conversation.
- `iconRight` slot removal causes width shift on loading. Plan didn't request preserving slot width; a fix needs a separate design decision (visibility:hidden vs fixed-width spacer).

This revision does NOT change either behavior.
