# Button — Light-Mode Treatment

**Date:** 2026-05-26
**Status:** Approved — proceeding to implementation
**Integration branch:** chunk of `skin/paraplu`. Ships as a new chunk PR targeting `skin/paraplu` (not main).

---

## Problem

The Button component shipped in PR #1 was designed dark-mode-first. Its CVA classes hard-code dark-mode chassis fills (e.g., `bg-[linear-gradient(180deg,var(--color-primary-900)_0%,var(--color-primary-950)_100%)]`) without any `dark:` qualifier — so the same classes apply in light mode, producing wrong reads:

1. **Primary and Secondary look identical** — both render as dark slabs (primary-900/950 navy ≈ neutral-900 black) on the light-violet off-white background. Hierarchy collapses.
2. **Disabled looks active** — the disabled fallback `bg-neutral-900` is a dark filled chassis, which on a light background reads as "filled and intentional," not "broken / inert."
3. **Outline and Ghost are invisible** — Outline uses `text-accent` (cyan) + cyan border at 40% opacity, both invisible on white. Ghost uses `text-white/75`, fully invisible on white.

The fix is a light-mode treatment that the component doesn't currently have. Dark mode stays exactly as it shipped.

## Decision

Adopt **Direction A: brand-blue Primary, light Secondary** for the light-mode Button treatment. Add it as a layer on top of the existing dark-mode treatment using Tailwind's `dark:` variant (the project already configures `@custom-variant dark` against `.theme-dark`). Light-mode classes become the base; the current shipped classes are re-qualified with `dark:` and preserved verbatim.

Direction A locks the following:

- **Primary**: light-mode chassis becomes brand-blue at scale step 400→500 (visibly blue, matching `--primary` `#0040FF`).
- **Secondary**: light-mode chassis becomes a raised light gradient using semantic `--background → --surface` tokens, with dark foreground text.
- **Outline**: light-mode flips from cyan accent to primary-blue text + border. This is a deliberate departure from the dark-mode "cyan = outline role" principle, motivated by AA contrast on light surfaces and clearer differentiation from Ghost.
- **Ghost**: light-mode foreground text replaces dark-mode white text, hover background becomes `--surface`.
- **Disabled (all variants)**: light-mode chassis flattens to `--muted` (light gray), label drops to `text-foreground/30`. Hairline at `rgba(20,15,40,0.06)` provides an edge against the page. The LED stays its variant color (matches existing dark-mode behavior — the flat chassis is what communicates "broken").
- **Destructive / Warning / Success**: unchanged. Saturated brand colors (same hex in both modes per Decision #77) already work on light surfaces with their existing white-tinted bevels + outer halos.
- **Focus**: unchanged. Cyan accent outline composes on both modes.
- **Loading**: unchanged. Dual-dot chase from Decision #81 runs as today.

## Visual specification

### Primary

| Slot | Light mode | Dark mode (unchanged) |
|---|---|---|
| Chassis fill | `linear-gradient(180deg, var(--color-primary-400) 0%, var(--color-primary-500) 100%)` | `linear-gradient(180deg, var(--color-primary-900) 0%, var(--color-primary-950) 100%)` |
| Text | `text-white` | `text-white` |
| Bevel | `inset 0 1px 0 rgba(0,225,250,0.55), inset 0 -1px 0 rgba(0,0,0,0.35)` | `inset 0 1px 0 rgba(0,225,250,0.4), inset 0 -1px 0 rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.05)` |
| LED | cyan + glow (no change) | cyan + glow |
| Hover chassis | gradient one step lighter: `primary-300 → primary-400` | gradient one step lighter: `primary-700 → primary-900` |
| Hover halo | `0 0 20px rgba(0,64,255,0.35)` added to inset bevels | `0 0 20px rgba(0,64,255,0.4)` added to inset bevels |

### Secondary

| Slot | Light mode | Dark mode (unchanged) |
|---|---|---|
| Chassis fill | `linear-gradient(180deg, var(--background) 0%, var(--surface) 100%)` | `bg-neutral-900` |
| Text | `text-foreground` | `text-white` |
| Bevel | `inset 0 1px 0 rgba(255,255,255,0.9), inset 0 -1px 0 rgba(0,0,0,0.12), inset 0 0 0 1px rgba(20,15,40,0.10)` | `inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.4)` |
| LED | cyan + glow (no change) | cyan + glow |
| Hover chassis | gradient inverts subtly (`var(--surface) → var(--background)`) — chassis "lifts" | `bg-neutral-800` |
| Hover edge | inner hairline darkens to `var(--edge-hover)` | n/a |

### Destructive / Warning / Success — UNCHANGED

These variants use saturated brand color tokens (`--error`, `--warn`, `--success`) which hold the same hex in both modes (Decision #77 same-hex rule). Their existing white-tinted bevel + outer halo treatment reads correctly on both light and dark surfaces. No new classes added.

### Outline

| Slot | Light mode | Dark mode (unchanged) |
|---|---|---|
| Chassis | `bg-transparent` | `bg-transparent` |
| Text | `text-primary` (`#0040FF`) | `text-accent` (`#00E1FA`) |
| Border | `inset 0 0 0 1px rgba(0,64,255,0.55)` (primary at 55%) | 1px cyan at 40% opacity |
| LED (resting) | dim primary disc: `rgba(0,64,255,0.35)`, no glow | dim cyan disc |
| Hover | border to full primary (`#0040FF`), chassis stays transparent (no fill) | border to full cyan |

The light-mode shift from cyan → primary blue is the only variant where light-mode is not a tonal restatement of dark-mode. Rationale: cyan-on-white fails AA at any opacity above `accent-700`, and switching to a darker cyan step reads as teal (a different color) rather than as cyan. Primary blue is the same brand family, AA-compliant, and visually echoes the new Primary chassis — Outline reads as "a quieter Primary," which matches the hierarchy intent.

### Ghost

| Slot | Light mode | Dark mode (unchanged) |
|---|---|---|
| Chassis | `bg-transparent` | `bg-transparent` |
| Text | `text-foreground/75` (`#2a2932` at 75% opacity) | `text-white/75` |
| LED | none (ghost never renders an LED) | none |
| Hover chassis | `bg-surface` | `bg-white/[0.04]` |
| Hover text | `text-foreground` | `text-white` |

### Disabled (applies to every variant)

| Slot | Light mode | Dark mode (unchanged) |
|---|---|---|
| Chassis fill | `bg-muted` (≈ `#eeebf0`, oklch(0.94 0.009 270)) | `bg-neutral-900` |
| Chassis bg-image | `bg-none` (removes gradient) | `bg-none` |
| Text | `text-foreground/30` | `text-white/30` |
| Bevel | `inset 0 0 0 1px rgba(20,15,40,0.06)` (hairline edge only) | `inset 0 1px 0 rgba(255,255,255,0.03), inset 0 -1px 0 rgba(0,0,0,0.3)` |
| LED | keeps variant color (no opacity dim) | keeps variant color (no opacity dim) |
| Cursor | `cursor-not-allowed` (no change) | `cursor-not-allowed` |

The Disabled state is identical across all variants in light mode (same as the dark-mode behavior). This is intentional — Disabled communicates "no signal, no temperature," and that meaning is the same regardless of the originating variant.

**Note on the LED:** the LED keeps its variant color when disabled. This matches existing dark-mode behavior (the small LED reads as a static color chip against the flat disabled chassis — the chassis change is what carries the "broken" signal). SKIN-PRINCIPLES § Disabled flattens currently overstates this as "LED dims to ~25% opacity with no glow" — that language describes an intent that the implementation has never matched. The principle text gets updated in this chunk to match the actual (and intended) behavior.

### Focus

Unchanged. `outline-2 outline-accent outline-offset-2` reads on both light and dark surfaces.

### Loading

Unchanged. The dual-dot chase from Decision #81 runs in both modes. Per-variant LED colors apply automatically.

## Implementation

### `button.tsx` — CVA class updates

Each variant's class string gets light-mode classes added as the base; the existing dark-mode classes are re-qualified with `dark:`. Pattern:

```ts
primary: [
  // light (base)
  "bg-[linear-gradient(180deg,var(--color-primary-400)_0%,var(--color-primary-500)_100%)]",
  "[box-shadow:inset_0_1px_0_rgba(0,225,250,0.55),inset_0_-1px_0_rgba(0,0,0,0.35)]",
  "hover:bg-[linear-gradient(180deg,var(--color-primary-300)_0%,var(--color-primary-400)_100%)]",
  "hover:[box-shadow:inset_0_1px_0_rgba(0,225,250,0.7),inset_0_-1px_0_rgba(0,0,0,0.35),0_0_20px_rgba(0,64,255,0.35)]",
  "disabled:bg-muted disabled:bg-none disabled:text-foreground/30",
  "disabled:[box-shadow:inset_0_0_0_1px_rgba(20,15,40,0.06)]",
  // dark (overrides — current shipped behavior, verbatim)
  "dark:bg-[linear-gradient(180deg,var(--color-primary-900)_0%,var(--color-primary-950)_100%)]",
  "dark:[box-shadow:inset_0_1px_0_rgba(0,225,250,0.4),inset_0_-1px_0_rgba(0,0,0,0.6),0_1px_0_rgba(255,255,255,0.05)]",
  "dark:hover:bg-[linear-gradient(180deg,var(--color-primary-700)_0%,var(--color-primary-900)_100%)]",
  "dark:hover:[box-shadow:inset_0_1px_0_rgba(0,225,250,0.6),inset_0_-1px_0_rgba(0,0,0,0.6),0_0_20px_rgba(0,64,255,0.4)]",
  "dark:disabled:bg-neutral-900 dark:disabled:bg-none dark:disabled:text-white/30",
  "dark:disabled:[box-shadow:inset_0_1px_0_rgba(255,255,255,0.03),inset_0_-1px_0_rgba(0,0,0,0.3)]",
].join(" "),
```

Same shape for `secondary`, `outline`, `ghost`. `destructive`, `warning`, `success` get no new classes — they already work in both modes.

### `ledColorClass` and `iconGlowClass` maps

These two maps in `button.tsx` hard-code colors per variant. Only the `outline` and `ghost` entries need light-mode pairs (others are already mode-stable):

```ts
const ledColorClass: Record<Variant, string> = {
  primary: "bg-accent text-accent [box-shadow:0_0_8px_currentColor]",
  secondary: "bg-accent text-accent [box-shadow:0_0_8px_currentColor]",
  destructive: "bg-white text-white [box-shadow:0_0_8px_currentColor]",
  warning: "bg-warn-foreground text-warn-foreground",
  success: "bg-success-foreground text-success-foreground",
  outline: "bg-primary/50 text-primary dark:bg-accent/50 dark:text-accent",
  ghost: "",
};

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

### Tokens, keyframes — no changes

No new CSS tokens. No new keyframes. The light-mode treatment uses only existing semantic tokens (`--background`, `--surface`, `--muted`, `--foreground`, `--edge-hover`) and the existing primary OKLCH scale (`primary-300/400/500`).

### Tailwind `@source inline` — verify

The existing CVA pattern already produces all classes statically (no template-string interpolation), so Tailwind's scanner picks them up. No `@source inline()` entries needed. If a future scanner edge case appears, add to `tokens.css` per the precedent set in Decision #67.

## Tests

`packages/ds/src/components/button/button.test.tsx` already covers structural behavior — variant rendering, loading state, asChild composition, disabled. No new unit tests required; visual treatment isn't unit-testable.

Visual regression is manual: `npm run dev`, navigate to `/button`, toggle theme via the sidebar, confirm:

- Primary reads as bright brand-blue in light, deep navy in dark.
- Secondary reads as a raised light chassis in light, dark slab in dark — and is clearly distinct from Primary in both.
- Outline reads with primary-blue chrome in light, cyan chrome in dark.
- Ghost label is visible in light (was invisible before).
- All variants' Disabled rows look flat and "broken" — no leftover saturated chassis.
- Hover transitions don't flash or jump; the cyan focus ring sits cleanly on both surfaces.

## Decisions to log

**Decision #82 (to be logged):** Button light-mode treatment — adopt Direction A (brand-blue Primary chassis, light Secondary chassis, primary-blue Outline). Capture the rationale for switching Outline to primary-blue in light mode despite the dark-mode "cyan = outline role" principle, and the choice to keep Disabled visually uniform across variants in both modes.

## Docs to update (definition of done)

- [ ] `docs/DESIGN-SYSTEM.md` — Button section: add a "light mode" subsection describing each variant's light-mode treatment.
- [ ] `docs/SKIN-PRINCIPLES.md`:
  - § 2 Color → Same-hex rule: clarify that the rule applies to filled chassis fills/glows, not to outline borders/text which can shift to a contrast-paired accent in light mode.
  - § 6 Component patterns → Disabled flattens: update "neutral dark gray" to "a neutral gray matching the mode," and remove the "LED dims to ~25% opacity with no glow" claim — the actual behavior is that the LED keeps its variant color and the chassis change carries the disabled signal.
- [ ] `docs/ARCHITECTURE.md` — no changes (no new patterns).
- [ ] `docs/DECISIONS.md` — log Decision #82.
- [ ] `docs/BACKLOG.md` — add "Button light-mode treatment" to Completed when this chunk merges.
- [ ] `CLAUDE.md` — Current Features: amend the Button feature line to mention the light-mode treatment.

## Out of scope

- Dark-mode adjustments to the Button (preserved verbatim).
- Other components' light-mode treatments (separate chunks per component as needed).
- New tokens or scale steps.
- Visual regression tooling (Chromatic, Percy, etc.) — manual visual check stays.
