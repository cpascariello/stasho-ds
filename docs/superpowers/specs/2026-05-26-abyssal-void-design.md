# Abyssal · Void Edition — Design Spec

**Date:** 2026-05-26
**Status:** Approved (supersedes the prior Abyssal palette in Decision #77; logged as Decision #78)

## Goal

Replace the Aleph-Cloud-inherited purple+lime skin with a darker, edgier brutalist variant of Abyssal — the deep-purple + bright-cyan + amber palette stays, joined by a new blood-orange `error` color, set on Observatory Mono dark surfaces, with brutalist 0/0/2/4 radius and an industrial-signage typographic voice.

## Background

Decision #77 locked the original Abyssal palette (deep purple `#2A0563` primary, cyan `#00E1FA` accent, amber `#ffc53d` warn, Observatory Mono surfaces, radius 2/4/6/10, Space Grotesk + Inter). On review it felt "composed but reserved" — the brief was always "bold but cohesive accents," and the original lacked the edge.

This iteration kept everything in #77 that survived the gut-check (palette anchors, surface family, same-hex rule, three-layer token architecture) and changed everything that read too safe (radius, typography, error color, plus a new hot signal). Each change was driven by a side-by-side comparison rendered in the brainstorming visual companion — not by intuition alone.

## Architecture

The three-layer token system in `packages/ds/src/styles/tokens.css` is unchanged:

- **Layer 1** — raw OKLCH scales in `@theme`
- **Layer 2** — semantic tokens in `:root` / `.theme-dark` (`--primary`, `--accent`, etc.)
- **Layer 3** — Tailwind bridge in `@theme inline { ... }`

What changes is values. No new architectural layers, no new abstractions.

**Same-hex rule** stays in effect: `--primary`, `--accent`, `--success`, `--warn`, `--error` resolve to the same hex literal in both `:root` and `.theme-dark`. Background and foreground swap; accents do not drift.

## Palette

### Brand & semantic tokens

| Token | Value | Role |
|---|---|---|
| `--primary` | `#2A0563` | Deep purple — primary action, brand presence |
| `--primary-foreground` | `#ffffff` | Text on primary fills |
| `--accent` | `#00E1FA` | Bright cyan — secondary action, links, focus, live indicators |
| `--accent-foreground` | `#001014` | Text on accent fills |
| `--success` | `#2BD58E` | Cool teal-green — ok / nominal / healthy |
| `--success-foreground` | `#00130a` | Text on success fills |
| `--warn` | `#ffc53d` | Amber (Radix Amber-9) — caution, throttled, degraded |
| `--warn-foreground` | `#1a1100` | Text on warn fills |
| `--error` | `#FF3D00` | Blood-orange — critical, destructive, abort, down |
| `--error-foreground` | `#ffffff` | Text on error fills |

The previous error gradient `linear-gradient(#FFAC89 → #DE3668)` is retired. Blood-orange is a flat fill — gradients only on primary, accent, success, warn for interior highlights.

### OKLCH scales (Layer 1)

Color scales 50–950 regenerate around new hue anchors. Brand stop is documented per scale.

| Scale | Hue | Brand stop |
|---|---|---|
| `primary` | 270 | `--color-primary-800 = #2A0563` |
| `accent` | 215 | `--color-accent-300 = #00E1FA` |
| `success` | 160 | `--color-success-400 = #2BD58E` |
| `warning` | 87 | `--color-warning-400 = #ffc53d` |
| `error` | 25 | `--color-error-500 = #FF3D00` |
| `neutral` | 273 | full 50–950 ramp, subtle cool tint |

The exact OKLCH ladders are derived during implementation — the plan file owns the literal values per scale.

## Surfaces

### Dark mode (default — Observatory Mono ladder)

| Token | Hex | Use |
|---|---|---|
| `--background` | `#07080a` | Page background |
| `--surface` | `#0d0d0d` | Default raised surface (cards, inputs) |
| `--muted` | `#101111` | Elevated surface (modals' resting state) |
| `--raised` (Layer 1: `--color-base-700`) | `#161718` | Highest surface (popovers, dialog over modal) |
| `--edge` | `rgba(255, 255, 255, 0.08)` | Hairline border |
| `--edge-hover` | `rgba(255, 255, 255, 0.14)` | Hover state |

### Light mode (off-white with hue-270 tint)

| Token | OKLCH | Use |
|---|---|---|
| `--background` | `oklch(0.99 0.005 270)` | Page background |
| `--surface` | `oklch(0.94 0.009 270)` | Default raised surface |
| `--muted` | `oklch(0.94 0.009 270)` | Subtle fills |
| `--edge` | `oklch(0.87 0.013 270)` | Hairline border |
| `--edge-hover` | `oklch(0.80 0.015 270)` | Hover state |
| `--foreground` | `oklch(0.22 0.015 270)` | Body text |
| `--muted-foreground` | `oklch(0.55 0.014 270)` | Secondary text |

## Geometry

Radius vocabulary: **0 / 0 / 2 / 4**.

| Element class | Radius | Examples |
|---|---|---|
| Form controls | `--radius-sm: 0` | Button, Input, Textarea, Select trigger, Combobox trigger, MultiSelect trigger, Pagination buttons, Tabs (rest variant), segmented controls, Badge, Alert, Tooltip |
| Chips / dropdowns | `--radius-md: 0` | Dropdown menus, popovers, Select content panel, Combobox content panel |
| Cards / panels | `--radius-lg: 2` | Card, telemetry panel, sidebar tiles |
| Modals / large surfaces | `--radius-xl: 4` | Dialog content |

`--radius-full` (`9999px`) stays reserved for elements that are visually round by definition: StatusDot, Slider thumb, ProgressBar tracks, Switch thumb, MultiSelect tag chips (inside the trigger), avatar shapes.

Borders are **1px white-at-low-opacity hairlines** (`var(--edge)`). Accent colors (primary purple, cyan, blood-orange) are never used in chrome — they are reserved for content (text, fills, indicators). This keeps each accent reading as a deliberate signal, not decoration.

## Typography

| Role | Family | Source | Usage |
|---|---|---|---|
| Headings | **Anybody** | Google Fonts (free) | `--font-heading`. Weight 900, uppercase, letter-spacing `-0.02em`. Variable axes available (weight 100-900, width 50%-150%). |
| Body | **Inter** | Google Fonts (free) | `--font-sans`. Weights 400 / 500 / 600 / 700. |
| Mono | **Departure Mono** | departuremono.com (free) | `--font-mono`. Single weight (400). Used for telemetry, labels, code, version strings, all-caps short tags. |

Body and headings load via Google Fonts `<link>` in `apps/preview/src/app/layout.tsx`. Departure Mono is **self-hosted** in `apps/preview/public/fonts/DepartureMono.woff2` and declared via `@font-face` in `tokens.css` or a separate `fonts.css`. Consumers of `@stasho/ds` are responsible for loading their own copies (DS ships tokens that reference family names, not the font binaries — this matches the existing pattern).

**Why these three:**

- Anybody — variable brutalist sans inspired by 70s industrial signage. Pairs harder with the Void aesthetic than Space Grotesk. Width axis available for compressed vertical labels in future components.
- Inter — proven body face, already in plan #77, no change.
- Departure Mono — CRT/pixel terminal aesthetic. Reinforces the "deep-sea probe telemetry" brief. Less ubiquitous than JetBrains Mono / IBM Plex Mono / Geist Mono.

Headings default to uppercase via component-level `text-transform`, not a global rule — body and mono stay mixed case.

## Component impact

Components that need updating beyond just token consumption:

| Component | Change |
|---|---|
| Button | `rounded-md` → `rounded-none` (0px). Secondary variant switches from `gradient-fill-lime` to `gradient-fill-accent` (cyan gradient). Error variant becomes solid blood-orange. |
| Input, Textarea | `rounded-md` → `rounded-none`. Hairline border stays. |
| Select, Combobox, MultiSelect | Trigger `rounded-md` → `rounded-none`. Dropdown content panel `rounded-md` → `rounded-none`. Tag chips inside MultiSelect retain `rounded-full`. |
| Pagination | Page buttons `rounded-full` → `rounded-none`. |
| Card | `rounded-md` → `rounded-sm` (2px). Hairline border picks up `var(--edge)`. |
| Dialog | Content `rounded-lg` → `rounded` (4px). |
| Alert | Background gradients re-derived. Error variant gradient = `linear-gradient(90deg, rgba(255,61,0,0.10), rgba(255,61,0,0.04))`. |
| Badge | Default `rounded` → `rounded-none`. |
| StatusDot, Spinner, ProgressBar, Slider, Switch, Stepper indicator | Geometry unchanged (round by design). |
| Tabs (default), Breadcrumb | Indicator and link styles unaffected; pill variant of Tabs keeps its pill shape (it's a segmented control, not a button). |
| CopyableText | Hover/active backgrounds stay; radius drops to 0 on the wrapper. |

The `gradient-fill-lime` CSS utility class is deleted. A new `gradient-fill-accent` utility is added in `tokens.css`. The `gradient-fill-main` utility remains (primary gradient).

## Same-hex rule — light mode contrast risk

The same-hex rule means accents pop the same way in both modes. The known tradeoff: **accent-colored text on light backgrounds can be low-contrast**. Specifically:

- Cyan `#00E1FA` text on `oklch(0.99 0.005 270)` white surface — fails WCAG AA for body text.
- Teal-green `#2BD58E` text on white — borderline.
- Blood-orange `#FF3D00` and amber `#ffc53d` — also borderline for body text.

**Resolution:** This DS already has the convention (established in Decision #68) of using a darker step for light-mode link text and a lighter step for dark-mode link text. CopyableText already does this with primary. We extend the pattern: any component that renders accent-colored text inline (not as a fill) uses `text-{color}-700 dark:text-{color}-300` (or equivalent step-pair) instead of the same-hex semantic token. The same-hex rule applies to **fills, borders, indicators, and decoration** — not to text used at body sizes.

When light-mode contrast issues are spotted during the implementation, the fix is always "use the appropriate scale step," never "drift the semantic hex."

## What's parked / rejected (this iteration)

| Direction | Status |
|---|---|
| Pure-black surface ladder (option L) | Parked — Observatory Mono retained for the tonal warmth. |
| Accent-tinted hairlines (cyan/purple at low opacity) | Rejected — diluted accent colors into chrome. |
| Cyan-as-primary role swap (Voltage / option C) | Rejected — purple primary holds the brand presence; cyan as accent is the right hierarchy. |
| Saturated green `#36D846` for success | Replaced by cooler teal `#2BD58E` — palette-coherent with the cool-tone bias. |
| Adding a new `danger` token alongside `error` | Rejected — blood-orange replaces the old error gradient; no double-warm-token confusion. |
| Blood-orange as purely visual accent (no semantic) | Rejected — teams would reach for it as error anyway; mapping it to `error` is honest. |
| Space Grotesk, Bricolage Grotesque, Major Mono Display | Rejected during typography selection in favor of Anybody + Departure Mono. |
| Martian Mono, Geist Mono, Fragment Mono | Rejected during mono selection. |

Grilli Type for headings remains parked pending budget approval (carried over from #77).

## Plan handoff

The existing plan at `docs/superpowers/plans/2026-05-26-abyssal-skin.md` was written against the original Abyssal direction. It needs to be rewritten — most tasks survive in spirit (rewrite tokens.css, update component radii, run checks) but the target values change throughout. The next step is to invoke `writing-plans` against this spec and replace the existing plan file in place.

## Self-review

- **Placeholders:** None. All values are concrete or explicitly deferred to plan-level decisions (OKLCH scale ladders).
- **Internal consistency:** Radius vocabulary, surface ladder, palette, and component impact table cross-reference correctly. Same-hex rule is applied consistently to fills and excluded for body text.
- **Scope:** Single coherent feature — skin replacement. Fits one implementation plan.
- **Ambiguity:** "Brand stop" for each OKLCH scale is named (e.g., `primary-800` is the brand stop) without forcing exact ladder values into the spec — the plan owns those. This is intentional, not vague: the design decision is which hex anchors the brand, not the exact perceptual lightness at every step.
