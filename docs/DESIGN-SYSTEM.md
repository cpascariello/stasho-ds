# Aleph Cloud Design System

A design system built with Tailwind CSS 4 + CSS custom properties + OKLCH colors. Includes design tokens, fonts, reusable components, and a preview app.

## Component Index

Quick reference for all DS exports. Click component name to jump to its full documentation below.

| Component | Purpose | Import |
|-----------|---------|--------|
| [Alert](#alert) | Dismissible status banner with auto-dismiss timer | `@stasho/ds/alert` |
| [Badge](#badge) | Semantic label for status, counts, categories | `@stasho/ds/badge` |
| [Breadcrumb](#breadcrumb) | Navigation trail with composable 6-part API | `@stasho/ds/breadcrumb` |
| [Button](#button) | Action trigger with 7 variants, 4 sizes, cyan LED signature | `@stasho/ds/button` |
| [Card](#card) | Content container with 2 variants (default/ghost) | `@stasho/ds/card` |
| [Checkbox](#checkbox) | Boolean toggle with 3 sizes, clip-path animation | `@stasho/ds/checkbox` |
| [Combobox](#combobox) | Searchable dropdown selector | `@stasho/ds/combobox` |
| [CopyableText](#copyabletext) | Truncated text with copy-to-clipboard | `@stasho/ds/copyable-text` |
| [Dialog](#dialog) | Modal with composable 8-part API, lock mode | `@stasho/ds/dialog` |
| [FormField](#formfield) | Label + helper + error wrapper with auto-wired a11y | `@stasho/ds/form-field` |
| [Input](#input) | Text input with 2 sizes, borderless flat styling | `@stasho/ds/input` |
| [Loader](#loader) | Standalone dual-dot cyan chase for inline loading | `@stasho/ds/loader` |
| [Logo](#logo) | Brand mark (icon + full wordmark variants) | `@stasho/ds/logo` |
| [MultiSelect](#multiselect) | Searchable multi-selection with tags | `@stasho/ds/multi-select` |
| [Pagination](#pagination) | Controlled page navigation with fixed-slot layout | `@stasho/ds/pagination` |
| [RadioGroup](#radiogroup) | Mutually exclusive option set with 3 sizes | `@stasho/ds/radio-group` |
| [Select](#select) | Dropdown selector with flat options prop | `@stasho/ds/select` |
| [Skeleton](#skeleton) | Animated loading placeholder | `@stasho/ds/ui/skeleton` |
| [Slider](#slider) | Range input, single or two-thumb mode | `@stasho/ds/slider` |
| [StatusDot](#statusdot) | Health status circle with pulse animation | `@stasho/ds/status-dot` |
| [Switch](#switch) | On/off toggle with animated sliding thumb | `@stasho/ds/switch` |
| [Table](#table) | Generic typed table with sorting and row selection | `@stasho/ds/table` |
| [Tabs](#tabs) | Tabbed interface with underline/pill variants | `@stasho/ds/tabs` |
| [Textarea](#textarea) | Multi-line text input with vertical resize | `@stasho/ds/textarea` |
| [Tooltip](#tooltip) | Hover/focus tooltip with DS styling | `@stasho/ds/tooltip` |

## Component Selection Guide

### Status & Feedback

| Need | Use | Not |
|------|-----|-----|
| Inline health indicator next to text | **StatusDot** — compact, semantic colors, pulse on healthy | Badge — too large for inline status |
| Categorical label (count, type, state) | **Badge** — gradient fills, icon slots, Departure Mono UC label (CSS-forced) | StatusDot — no text content |
| Dismissible banner message | **Alert** — auto-dismiss timer, progress bar, semantic variants | Dialog — too interruptive for status messages |
| Blocking user decision | **Dialog** — overlay, focus trap, `locked` mode for forced choice | Alert — can be ignored or dismissed |
| Passive extra info on hover | **Tooltip** — non-blocking, hover/focus triggered | Dialog — too heavy for supplementary info |
| Loading placeholder (content area) | **Skeleton** — consumer-sized via className, pulse animation | ProgressBar — Skeleton is for layout placeholders, ProgressBar is for measurable work |
| Inline loading indicator (button action) | **Button `loading` prop** — animates the LED into a two-dot chase (Decision #81 / § 6 "Loading pulses, never spins") | Standalone Loader — for in-button loading the chase belongs inside the button |
| Standalone loading indicator (outside a button) | **Loader** — extracts Button's chase as a primitive, optional inline label (Decision #94) | Rotating spinner — § 6 "Loading pulses, never spins" |
| Determinate/indeterminate progress | **ProgressBar** — 3 sizes, optional description, value clamping | Skeleton / Loader — ProgressBar shows measurable progress |

### Selection & Input

| Need | Use | Not |
|------|-----|-----|
| Short list, no search needed | **Select** — flat options, Radix portal dropdown | Combobox — search adds unnecessary complexity |
| Long list, user needs to search | **Combobox** — type-to-filter with cmdk | Select — no search, unusable with 50+ options |
| Multiple selections from a list | **MultiSelect** — tags, checkbox indicators, clear-all | Combobox — single selection only |
| Boolean toggle (form context) | **Checkbox** — standard form control | Switch — use for settings/preferences, not form fields |
| On/off preference or setting | **Switch** — visual toggle metaphor | Checkbox — Switch communicates "live toggle" better |
| Mutually exclusive options | **RadioGroup** — visible options, no dropdown | Select — use RadioGroup when ≤5 options and screen space allows |
| Numeric range | **Slider** — visual, supports two-thumb range mode | Input — unless precise numeric entry is needed |

### Layout & Navigation

| Need | Use | Not |
|------|-----|-----|
| Content section | **Card** `variant="default"` — `bg-surface`, borderless | Plain div — Card provides consistent surface fill and theming |
| Transparent grouping (no chrome) | **Card** `variant="ghost"` — no border, no background | Card default — ghost avoids visual nesting when cards are inside cards |
| Location in page hierarchy | **Breadcrumb** — semantic nav/ol, `asChild` for router links | Plain text links — Breadcrumb handles separators and aria |
| Switching between content panels | **Tabs** — underline or pill variant, keyboard navigation | Buttons + conditional rendering — Tabs manages state, a11y, and indicators |
| Paginated data navigation | **Pagination** — fixed-slot layout, no layout shift | Custom prev/next buttons — Pagination handles ellipsis, boundaries, and aria |
| Multi-step workflow indicator | **Stepper** — composable 7-part compound, horizontal/vertical, unstyled | Breadcrumb — Stepper tracks progress state, Breadcrumb tracks location |

## Design Methodology

### Principles

1. **Tokens first, components second.** Every visual decision (color, spacing, shadow, gradient) is a token before it's a component style. Components consume tokens — they never hardcode visual values. This means a rebrand changes one file (`tokens.css`), not every component.

2. **CSS-native theming.** Themes are CSS custom property swaps, not JS runtime logic. The browser handles theme transitions for free. No React context, no provider wrappers, no hydration mismatch. Toggle a class on `<html>` and every token resolves to its new value instantly.

3. **Tailwind as the utility layer, not the design language.** Tailwind classes are the delivery mechanism — the actual design lives in the token system. Components use Tailwind utilities to apply tokens, but the tokens define the visual language. This keeps the design system portable: if Tailwind is replaced, only the delivery layer changes.

4. **Accessibility is structural, not decorative.** Interactive components wrap Radix UI primitives that provide keyboard navigation, ARIA attributes, and focus management by default. Accessibility isn't added after the fact — it's the foundation the visual layer is painted on.

5. **No phantom features.** If a class, prop, or token doesn't resolve to working behavior, it's deleted. Dead code misleads both developers and tools. Better to have less that works than more that doesn't.

### Three-Layer Token Architecture

The token system has three layers, each with a distinct role:

| Layer | CSS Construct | Role | Example |
|-------|--------------|------|---------|
| **1. Brand** | `@theme { }` | Raw brand values — colors, gradients, fonts, shadows. Same in all themes. | `--color-primary-600: oklch(0.44 0.28 285.48)` |
| **2. Semantic** | `:root { }` / `.theme-dark { }` | Purpose-driven aliases that swap per theme. | `--primary: var(--color-primary-600)` (light) / `var(--color-primary-400)` (dark) |
| **3. Tailwind Bridge** | `@theme inline { }` | Maps semantic tokens into Tailwind's `--color-*` namespace so utilities like `bg-primary` resolve at runtime. | `--color-primary: var(--primary)` |

**Why three layers?** Layer 1 is the brand source of truth — it never changes between themes. Layer 2 is where theme-awareness lives — it decides which brand value to use in each context. Layer 3 is mechanical plumbing — it makes Tailwind utilities work with runtime CSS variables (via `inline`, which tells Tailwind to resolve at runtime instead of compile time).

**Promotion rule:** If a Layer 1 value needs to change per theme, it must be promoted to Layer 2. Example: `--gradient-main` has a dark endpoint that blends into the dark mode background, so it was promoted to a semantic token with per-theme variants.

### Component Architecture

Components follow a consistent pattern:

1. **CVA (Class Variance Authority)** defines variant maps — each variant is a key mapping to Tailwind class strings. TypeScript infers prop types from the variant keys automatically.

2. **`forwardRef`** on every component — consumers can attach refs for focus management, measurements, or integration with form libraries.

3. **`cn()` utility** (clsx + tailwind-merge) handles class composition. Always use `cn()` instead of template literals to ensure Tailwind conflict resolution.

4. **Radix UI wrappers** for interactive controls. The DS component is the public API; Radix is an internal implementation detail consumers never import directly.

5. **Flat props over compound children.** Where Radix uses nested `<Item>` components (like Select), the DS wrapper accepts a flat `options` array. This simplifies the consumer API at the cost of flexibility — a tradeoff that's right for most use cases.

### Color Space

All color scales use **OKLCH** — a perceptually uniform color space where equal numeric steps produce equal visual contrast steps. This means a 100-unit jump from `primary-400` to `primary-500` looks the same as from `primary-700` to `primary-800`, unlike HSL where lightness perception varies by hue.

OKLCH also enables Tailwind's `/opacity` modifier (`bg-primary-600/50`) because the color components are expressed independently.

### Testing Philosophy

Test **behavior and accessibility**, not appearance. The preview app is the visual test suite. Automated tests verify:

- Interactive logic (loading state runs the LED chase, hides icons)
- Accessibility attributes (`aria-invalid`, `aria-busy`, `disabled`)
- DOM structure (polymorphic rendering, prop forwarding)
- Edge cases (empty states, disabled interactions)

Tests never assert CSS class names — those are implementation details that break on every visual redesign without catching real bugs.

---

## Installation

Install the DS package in your app:

```bash
npm install @stasho/ds
```

Import tokens in your CSS and components via subpath exports:

```css
@import "tailwindcss";
@import "@stasho/ds/styles/tokens.css";

@custom-variant dark (&:where(.theme-dark, .theme-dark *));
```

```tsx
import { Button } from "@stasho/ds/button";
import { Input } from "@stasho/ds/input";
import { cn } from "@stasho/ds/lib/cn";
```

Consumer apps need `transpilePackages: ["@stasho/ds"]` in their Next.js config (DS exports raw `.tsx` source).

## Themes

Two themes applied via class on `<html>`. Default: light (no class). Dark: `.theme-dark`.

| Theme | Class | Aesthetic |
|-------|-------|-----------|
| Light | (none) | Violet-tinted whites, dark text |
| Dark | `.theme-dark` | Deep purple-black, light text |

Toggle theme in JS:

```ts
document.documentElement.classList.toggle("theme-dark");
```

---

## Color Tokens

Use as Tailwind classes. Semantic tokens resolve to different values per theme.

### Color Scales

Full OKLCH 50–950 scales. Each scale has 11 stops, available as Tailwind classes like `bg-primary-600`, `text-error-500`, etc. Supports `/opacity` modifier: `bg-primary-600/50`.

Anchored on the **Abyssal Void** palette. The semantic accents (`--primary`, `--accent`, `--success`, `--warning`, `--error`) resolve to the **same hex** in both light and dark mode (Radix step-9 convention). Scale steps remain available for tinted backgrounds, hover states, and contrast-aware inline text.

| Scale | Hue | Anchor | Use for |
|-------|-----|--------|---------|
| `primary` | 264 (electric blue) | 500 = brand `#0040FF` | Brand identity, primary actions |
| `accent` | 215 (cyan) | 300 = brand `#00E1FA` | Accents, highlights, CTAs |
| `success` | 160 (teal-green) | 400 = brand `#2BD58E` | Success states |
| `warning` | 87 (amber) | 400 = brand `#ffc53d` | Warning states |
| `error` | 25 (blood-orange) | 500 = brand `#FF3D00` | Error / destructive states |
| `destructive` | (alias → `error`) | — | Convenience alias for shadcn/Tailwind convention |
| `neutral` | 273 (cool indigo tint) | — | Borders, backgrounds, text |

**Light-mode contrast pattern.** Inline body text rendered in an accent color uses the standard "darker step for light, lighter step for dark" pattern: `text-{color}-500 dark:text-{color}-300`. The same-hex rule applies only to *fills, borders, and indicators* — not to text on light surfaces, which needs a darker scale step for AA contrast.

### Semantic Colors

Accents (`primary`/`accent`/`success`/`warning`/`error`) resolve to the **same hex** in both modes. Surfaces (`background`/`foreground`/`muted`/`surface`/`edge`) still swap per theme.

| Token | Tailwind class | Light | Dark | Use for |
|-------|---------------|-------|------|---------|
| `background` | `bg-background` | `oklch(0.99 0.005 270)` | `#07080a` | Page background |
| `foreground` | `text-foreground` | `oklch(0.22 0.015 270)` | `#f3f3f3` | Primary text |
| `primary` | `bg-primary`, `text-primary` | `#0040FF` | `#0040FF` | Interactive elements |
| `primary-foreground` | `text-primary-foreground` | `#ffffff` | `#ffffff` | Text on primary backgrounds |
| `accent` | `bg-accent`, `text-accent` | `#00E1FA` | `#00E1FA` | Highlights, emphasis |
| `accent-foreground` | `text-accent-foreground` | `#001014` | `#001014` | Text on accent backgrounds |
| `success` | `bg-success`, `text-success` | `#2BD58E` | `#2BD58E` | Success indicators |
| `success-foreground` | `text-success-foreground` | `#00130a` | `#00130a` | Text on success backgrounds |
| `warning` | `bg-warning`, `text-warning` | `#ffc53d` | `#ffc53d` | Warning indicators |
| `warning-foreground` | `text-warning-foreground` | `#1a1100` | `#1a1100` | Text on warning backgrounds |
| `error` | `bg-error`, `text-error` | `#FF3D00` | `#FF3D00` | Error / destructive indicators |
| `error-foreground` | `text-error-foreground` | `#ffffff` | `#ffffff` | Text on error backgrounds |
| `muted` | `bg-muted` | `oklch(0.94 0.009 270)` | base-800 | Subdued backgrounds |
| `muted-foreground` | `text-muted-foreground` | `oklch(0.55 0.014 270)` | `oklch(0.62 0.012 273)` | Subdued text, labels |
| `surface` | `bg-surface` | `oklch(0.94 0.009 270)` | base-900 (`#0d0d0d`) | Elevated surfaces (cards, form fields) |
| `surface-foreground` | `text-surface-foreground` | `oklch(0.22 0.015 270)` | `#f3f3f3` | Text on elevated surfaces |
| `edge` | `border-edge` | `oklch(0.87 0.013 270)` | `rgba(255,255,255,0.08)` | Borders, dividers |
| `edge-hover` | `border-edge-hover` | `oklch(0.80 0.015 270)` | `rgba(255,255,255,0.14)` | Hover state borders |

### Surface Ladders

**Dark (Observatory Mono):** four-step ladder from void to raised, all neutral grays with hue 273:

| Token | Hex | Role |
|-------|-----|------|
| `--background` | `#07080a` | Page void |
| `--color-base-900` | `#0d0d0d` | Surface (panels, cards) |
| `--color-base-800` | `#101111` | Elevated (modals, muted) |
| `--color-base-700` | `#161718` | Raised (popovers) |

Borders in dark mode are white-low-opacity hairlines: `rgba(255,255,255,0.08)` resting, `rgba(255,255,255,0.14)` hover. Accents are **never** used in chrome.

**Light:** off-white ladder with a faint hue-270 violet tint, `oklch(0.99 0.005 270) → oklch(0.94 0.009 270) → oklch(0.87 0.013 270)`.

### Usage Examples

```tsx
{/* Scale colors — use specific stops for fine control */}
<div className="bg-primary-100 text-primary-800 p-4 rounded">Light tint</div>
<div className="bg-error-600 text-white p-4 rounded">Error</div>
<div className="bg-neutral-50 border border-neutral-200 p-4 rounded">Subtle</div>

{/* Opacity modifier */}
<div className="bg-primary-600/20 text-primary-700 p-4 rounded">20% opacity</div>

{/* Semantic colors — theme-aware */}
<div className="bg-surface text-surface-foreground rounded-lg border border-edge p-6">
  <h3 className="text-foreground font-bold">Title</h3>
  <p className="text-muted-foreground">Description text</p>
</div>
```

---

## Fonts

| Tailwind class | Font | Source | Use for |
|----------------|------|--------|---------|
| `font-heading` | Anybody | Google Fonts | Headings — weight 900, uppercase, tracking `-0.02em` |
| `font-sans` | Inter | Google Fonts | Body text |
| `font-mono` | Departure Mono | Self-hosted (departuremono.com) | Telemetry, code, labels |

### Consumer Font Loading

The DS ships **token references only** — it never bundles font binaries. Consumers load the fonts themselves:

- **Anybody** + **Inter** — load via Google Fonts in your app's `<head>`.
- **Departure Mono** — self-host. Copy the woff2 from `apps/preview/public/fonts/DepartureMono.woff2` (or download from [departuremono.com](https://departuremono.com)) and declare a single `@font-face` rule in your global stylesheet pointing at `/fonts/DepartureMono.woff2`.

### Heading Scale

All headings use `font-heading` (Anybody) at weight 900, uppercase, with tighter tracking (`-0.02em`).

| Style | Size | Tailwind equivalent |
|-------|------|-------------------|
| Header | 128px (8rem) | `text-[8rem]` |
| H1 | 72px (4.5rem) | `text-[4.5rem]` |
| H2 | 64px (4rem) | `text-[4rem]` |
| H3 | 48px (3rem) | `text-5xl` |
| H4 | 40px (2.5rem) | `text-[2.5rem]` |
| H5 | 36px (2.25rem) | `text-4xl` |
| H6 | 32px (2rem) | `text-[2rem]` |
| H7 | 24px (1.5rem) | `text-2xl` |

### Body Styles

| Style | Class combination |
|-------|------------------|
| Body | `font-sans text-base leading-relaxed` |
| Body bold | `font-sans text-base font-bold leading-relaxed` |
| Body italic | `font-sans text-base italic leading-relaxed` |
| Code | `font-mono text-base leading-relaxed` |

### Usage Examples

```tsx
{/* Page heading */}
<h1 className="font-heading text-[4.5rem] font-black uppercase tracking-[-0.02em]">
  Abyssal Void
</h1>

{/* Section heading */}
<h2 className="font-heading text-[2rem] font-black uppercase tracking-[-0.02em]">
  Features
</h2>

{/* Body text */}
<p className="font-sans text-base leading-relaxed">
  Deep-sea probe telemetry, brought to the surface.
</p>

{/* Telemetry / mono content */}
<pre className="font-mono text-base leading-relaxed bg-muted p-4">
  STATUS: NOMINAL · DEPTH: -4200m · TEMP: 2.1°C
</pre>
```

---

## Radius

Vocabulary is **0 / 0 / 2 / 4** — brutalist by default, with `rounded-full` reserved for elements that are round by design.

| Tailwind class | CSS variable | Value | Use for |
|----------------|--------------|-------|---------|
| `rounded-none` / `rounded-sm` / `rounded-md` | `--radius-sm`, `--radius-md` | `0` | Buttons, inputs, chips, popover dropdowns (Tooltip, Select, Combobox, MultiSelect, Tabs overflow), badges, alerts |
| `rounded-lg` | `--radius-lg` | `2px` | Cards |
| `rounded-xl` | `--radius-xl` | `4px` | Modals (Dialog) |
| `rounded-full` | (Tailwind default) | `9999px` | StatusDot, Slider thumb, RadioGroup item, ProgressBar tracks |

The 2px and 4px steps live at `rounded-lg` / `rounded-xl` so the entire scale is named — no arbitrary `rounded-[2px]` / `rounded-[4px]` values are needed in consumer code. Tailwind's `rounded-sm` and `rounded-md` both resolve to `0` and are interchangeable with `rounded-none`. `rounded-full` is reserved for elements that are round by design (never by convention). Switch track + thumb moved to `rounded-[2px]` in wave-1 (Decision #88); Stepper indicators likewise. Slider thumb stays `rounded-full` with a principled aperture justification (Decision #89). MultiSelect chips moved to `rounded-[2px]` (Decision #91) — convention-only "soft/removable" argument did not survive audit; chips join the wave's "contained group" family. See SKIN-PRINCIPLES § 4 "Surface radii by role" for the role → class mapping.

---

## Gradients

Available as CSS custom properties. Use via `style` attribute.

| Name | CSS variable | Colors | Use for |
|------|-------------|--------|---------|
| `main` | `var(--gradient-main)` | `#00104D` → `#0040FF` (light) / `#00041A` → `#0040FF` (dark) | Primary gradient. Theme-aware — promoted to semantic layer. |
| `accent` | `var(--gradient-accent)` | `#00B8D4` → `#00E1FA` | Secondary button fill, accent CTAs |
| `success` | `var(--gradient-success)` | `#2BD58E` → `#5DDFAB` | Success states |
| `warning` | `var(--gradient-warning)` | `#FFE14D` → `#FFC53D` | Warning states |
| `error` | `var(--gradient-error)` | `#FF6A3D` → `#FF3D00` | Error states |
| `destructive` | `var(--gradient-destructive)` | (alias → `error`) | Convenience alias |
| `info` | `var(--gradient-info)` | `#00E1FA` → `#0040FF` | Info states |

### Gradient Border Utilities

CSS `border-color` doesn't support gradients. These classes (defined in `tokens.css`) use the background-clip trick to render gradient borders with rounded corners. Interactive states (hover, active) are built into the class.

| Class | Gradient | Fill (default → hover → active) |
|-------|----------|--------------------------------|
| `border-gradient-main` | `--gradient-main` | primary-100 → 200 → 300 |

```tsx
{/* Just apply the class — hover/active fills are built in */}
<button className="border-gradient-main border-3 rounded-full">
  Outline Action
</button>
```

### Gradient Fill Utilities

CSS classes for gradient backgrounds with interactive hover/active states. Hover uses a semi-transparent overlay to lighten or darken the gradient without defining new color stops.

| Class | Gradient | Hover | Active |
|-------|----------|-------|--------|
| `gradient-fill-main` | `--gradient-main` | White overlay (lighten) | Black overlay (darken) |
| `gradient-fill-accent` | `--gradient-accent` | Black overlay (subtle darken) | Black overlay (darken) |
| `gradient-fill-success` | `--gradient-success` | — | — |
| `gradient-fill-warning` | `--gradient-warning` | — | — |
| `gradient-fill-error` | `--gradient-error` | — | — |
| `gradient-fill-info` | `--gradient-info` | — | — |

```tsx
{/* Gradient fills with built-in hover/active states */}
<button className="gradient-fill-main text-white px-6 py-3">
  Primary Action
</button>
<button className="gradient-fill-accent text-accent-foreground px-6 py-3">
  Secondary Action
</button>
```

### Usage Examples

```tsx
{/* Hero section with main gradient */}
<div style={{ background: "var(--gradient-main)" }} className="text-white p-12 rounded-lg">
  <h1 className="font-heading text-4xl font-extrabold italic">Welcome</h1>
</div>

{/* CTA button with accent gradient */}
<button
  style={{ background: "var(--gradient-accent)" }}
  className="text-accent-foreground px-6 py-3 font-bold"
>
  Get Started
</button>

{/* Status banner */}
<div style={{ background: "var(--gradient-success)" }} className="text-white px-4 py-2 rounded">
  All systems operational
</div>
```

---

## Shadows

Available as Tailwind utility classes. Neutral drops at three elevations — no brand tint (SKIN-PRINCIPLES § 6 "Elevation is neutral", Decision #87).

| Name | Tailwind class | Value | Use for |
|------|---------------|-------|---------|
| `sm` | `shadow-sm` | `0px 2px 4px rgba(0,0,0,0.10)` | Tight elements (tooltips, hover accents) |
| (default) | `shadow` | `0px 4px 16px rgba(0,0,0,0.20)` | Elevated surfaces (popover dropdowns) |
| `lg` | `shadow-lg` | `0px 24px 60px rgba(0,0,0,0.65)` | Modals, mobile drawers |

### Usage Examples

```tsx
{/* Card with subtle shadow */}
<div className="bg-surface rounded-lg p-6 shadow-sm">
  Subtle card
</div>

{/* Popover dropdown */}
<div className="bg-popover-bg border border-popover-border rounded-none p-1 shadow">
  Dropdown content
</div>

{/* Modal — paired with cyan top-rail per SKIN-PRINCIPLES § 6 "Cyan top-rail = live surface" */}
<div className="bg-surface rounded-xl p-8 border-t-2 border-t-accent
                shadow-[0_24px_60px_rgba(0,0,0,0.65),0_0_8px_rgba(0,225,250,0.5)]">
  Dialog content
</div>

{/* Interactive shadow on hover */}
<div className="bg-surface rounded-lg p-6 shadow-sm hover:shadow transition-shadow">
  Hover for more shadow
</div>
```

### Popover surface tokens

Floating-surface chrome uses two tokens so all popovers re-theme from one place:

| Token | Resolves to | Used by |
|---|---|---|
| `--popover-bg` | `var(--surface)` | Tooltip, Slider tooltip, Select / Combobox / MultiSelect dropdowns, Tabs overflow DropdownMenu |
| `--popover-border` | `var(--edge)` | (same) |

These bridge to Tailwind utilities `bg-popover-bg` and `border-popover-border`. Reach for the popover token on any floating surface — not `bg-surface` + `border-edge` directly — so retheming the popover identity flows through one declaration.

---

## Transitions

Available as CSS custom properties.

| Name | CSS variable | Duration | Use for |
|------|-------------|----------|---------|
| Fast | `var(--duration-fast)` | 200ms | Hover states, micro-interactions |
| Normal | `var(--duration-normal)` | 500ms | Panel transitions, reveals |
| Slow | `var(--duration-slow)` | 700ms | Page transitions, complex animations |

Timing function: `var(--timing)` = `ease-in-out`

### Usage Examples

```tsx
{/* Fast hover transition */}
<button
  className="border border-edge hover:border-edge-hover transition-colors"
  style={{ transitionDuration: "var(--duration-fast)" }}
>
  Hover me
</button>

{/* Animated panel */}
<div
  className="transition-all"
  style={{
    transitionDuration: "var(--duration-normal)",
    transitionTimingFunction: "var(--timing)",
  }}
>
  Animated content
</div>
```

---

## Icons

The DS uses [Phosphor Icons](https://phosphoricons.com/) — 7,000+ icons in 6 weights (Thin, Light, Regular, Bold, Fill, Duotone), MIT licensed.

### Installation

Phosphor is a regular dependency of `@stasho/ds`. Consumers who need additional icons beyond what the DS uses internally can import directly from `@phosphor-icons/react` (installed transitively).

### Usage

```tsx
import { Star, CaretDown, Check } from "@phosphor-icons/react";

<Star weight="bold" className="size-5" />
<CaretDown weight="bold" className="size-4 text-muted-foreground" />
<Check weight="bold" className="size-4" />
```

### Weight Recommendations

| Weight | Use for |
|--------|---------|
| `bold` | DS internal icons (chevrons, checkmarks, close). Default for UI controls. |
| `regular` | Body content icons, navigation items |
| `light` / `thin` | Decorative, large display icons |
| `fill` | Filled state indicators, active states |
| `duotone` | Branded illustrations, feature highlights |

### Size Tokens

Control icon size via Tailwind's `size-*` utilities or `className`:

| Name | Size | Tailwind |
|------|------|----------|
| `2xl` | 36px | `size-9` |
| `xl` | 24px | `size-6` |
| `lg` | 16px | `size-4` |
| `md` | 14px | `size-3.5` |
| `sm` | 12px | `size-3` |
| `xs` | 8px | `size-2` |

### Internal Usage

DS components use Phosphor icons internally for UI chrome:

| Icon | Component | Purpose |
|------|-----------|---------|
| `CaretDown` (bold) | Select, Combobox, MultiSelect | Dropdown indicator |
| `CaretUp` (bold) | Table | Sort direction indicator |
| `Check` (bold) | Select, Combobox, MultiSelect | Selected item indicator |
| `X` (bold) | MultiSelect | Tag dismiss, clear all |

---

## Logo

Two SVG components for the Aleph Cloud brand mark. Both use `fill="currentColor"` to inherit color from the parent, adapting to any theme or background automatically.

### Usage

```tsx
import { Logo, LogoFull } from "@stasho/ds/logo";

{/* Icon mark only */}
<Logo className="size-10" aria-label="Aleph Cloud" />

{/* Icon + "Aleph Cloud" wordmark */}
<LogoFull className="h-8 w-auto" aria-label="Aleph Cloud" />
```

### Variants

| Component | Content | Aspect ratio |
|-----------|---------|-------------|
| `Logo` | Icon mark (two circles + two arcs) | 1:1 — size with `size-*` |
| `LogoFull` | Icon mark + "Aleph Cloud" wordmark | ~6:1 — set height with `h-*`, use `w-auto` |

### Theming

The logos use `currentColor`, so they respond to the parent's text color:

```tsx
{/* Inherits default foreground color */}
<Logo className="size-10" />

{/* On a dark surface */}
<div className="bg-neutral-900 text-white">
  <LogoFull className="h-8 w-auto" />
</div>

{/* Brand tint */}
<Logo className="size-10 text-primary-600" />
```

### Props

Both components accept all standard SVG attributes (`className`, `aria-label`, `aria-hidden`, etc.) and forward refs.

---

## Patterns

### Adding a New Semantic Token

1. Add light value to `:root` block in `packages/ds/src/styles/tokens.css`
2. Add dark value to `.theme-dark` block
3. Add Tailwind mapping in `@theme inline` block: `--color-my-token: var(--my-token);`
4. Use as Tailwind class: `bg-my-token`, `text-my-token`, `border-my-token`

### Light-mode carve-out for semantic text colors

Saturated semantic tokens (`--accent`, `--warning`, `--success`, `--error`) fail AA contrast on light surfaces. When using these tokens for UI text, apply the `<token>-500` scale step in light mode:

- `text-accent-500 dark:text-accent`
- `text-warning-500 dark:text-warning`
- `text-success-500 dark:text-success`
- `text-error-500 dark:text-error`

Borders, background fills, and tinted-surface utilities (`bg-<token>/15`) stay same-hex — the carve-out applies only to text where the token is the foreground color on a near-white background.

### Composing a Card

```tsx
<div className="bg-surface text-surface-foreground rounded-lg border border-edge
                shadow-sm hover:shadow p-6"
     style={{ transitionDuration: "var(--duration-fast)" }}>
  <h3 className="font-heading text-xl font-extrabold italic mb-2">
    Card Title
  </h3>
  <p className="text-muted-foreground leading-relaxed">
    Card description with muted text.
  </p>
  <button className="mt-4 bg-primary text-primary-foreground px-4 py-2 rounded-md">
    Action
  </button>
</div>
```

### Hero Section

```tsx
<section style={{ background: "var(--gradient-main)" }} className="py-24 px-6">
  <div className="mx-auto max-w-5xl">
    <h1 className="font-heading text-[4.5rem] font-black uppercase tracking-[-0.02em] text-white">
      Abyssal Void
    </h1>
    <p className="font-sans text-xl text-white/80 mt-4 max-w-2xl leading-relaxed">
      Deep-sea probe telemetry, brought to the surface.
    </p>
    <button
      style={{ background: "var(--gradient-accent)" }}
      className="mt-8 text-accent-foreground px-8 py-3 font-bold text-lg shadow-lg"
    >
      Get Started
    </button>
  </div>
</section>
```

### Status Indicator

```tsx
<div className="flex items-center gap-2">
  <div className="w-2 h-2 rounded-full bg-success-500" />
  <span className="text-sm text-muted-foreground">All systems operational</span>
</div>
```

---

## Components

### Alert

Dismissible status banner with 4 semantic variants, optional title, auto-dismiss timer with progress bar, and exit animation.

```tsx
import { Alert } from "@stasho/ds/alert";
```

**Visual style:** 1px hairline border using semantic tokens (`border-warning`, `border-error`, `border-accent` for info, `border-success`). Top→bottom gradient background (180deg) using `oklch(from var(--token) l c h / opacity)` — 18% opacity at the top fading to 6% at the baseline — sourced from semantic tokens so dark mode is handled by `var(--background)` swapping (no `.theme-dark` override block needed). Departure Mono UC tracking-wider variant label with light-mode carve-out (`text-warning-500 dark:text-warning` etc.) for AA contrast on near-white backgrounds. Info variant uses cyan accent (`border-accent`, `bg-accent`-derived gradient) — not primary-blue — to avoid competing with Button chassis.

#### Variants

```tsx
<Alert variant="warning">Warning message</Alert>
<Alert variant="error">Error message</Alert>
<Alert variant="info">Info message</Alert>
<Alert variant="success">Success message</Alert>
```

#### With Title

```tsx
<Alert variant="error" title="Instance Paused">
  Something went wrong with your instance.
</Alert>
```

#### Dismissible

```tsx
<Alert variant="info" onDismiss={() => setVisible(false)}>
  Click the X to dismiss.
</Alert>
```

#### Auto-Dismiss with Timer

```tsx
<Alert variant="success" onDismiss={() => setVisible(false)} dismissAfter={5000}>
  This alert will dismiss in 5 seconds.
</Alert>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"warning" \| "error" \| "info" \| "success"` | `"warning"` | Determines colors, border, gradient, and label |
| `title` | `string` | — | Optional bold heading below the label |
| `onDismiss` | `() => void` | — | Shows XCircle dismiss button; called after exit animation |
| `dismissAfter` | `number` | — | Auto-dismiss timer in ms. Requires `onDismiss`. Shows progress bar. |
| `children` | `ReactNode` | — | Message body. Links (`<a>`) are auto-styled (bold, underline, ↗ icon). |
| `className` | `string` | — | Merged via `cn()` |

### Breadcrumb

Composable navigation breadcrumb trail with semantic `<nav>` + `<ol>` + `<li>` markup, `asChild` support via Radix Slot for framework routing, and hover states.

```tsx
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@stasho/ds/breadcrumb";
```

#### Default

```tsx
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="/nodes">Nodes</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Node Details</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

#### With Framework Router (asChild)

```tsx
<BreadcrumbLink asChild>
  <Link href="/dashboard">Dashboard</Link>
</BreadcrumbLink>
```

#### Parts

| Part | Element | Role |
|------|---------|------|
| `Breadcrumb` | `<nav>` | Wrapper with `aria-label="Breadcrumb"` |
| `BreadcrumbList` | `<ol>` | Ordered list with flex layout, Inter Medium sentence case |
| `BreadcrumbItem` | `<li>` | List item wrapper |
| `BreadcrumbLink` | `<a>` / Slot | Navigation link with cyan hover color transition |
| `BreadcrumbSeparator` | `<li>` | Visual separator (`/` default), `aria-hidden="true"`, quiet at 25% foreground |
| `BreadcrumbPage` | `<span>` | Current page with `aria-current="page"`, full cyan accent |

**Visual style:** `font-sans font-medium text-sm` on the list (Inter Medium sentence case). Links use `text-foreground` with `hover:text-accent`. Separators use `text-foreground/25` to recede so the cyan current page reads cleanly. Current page (`BreadcrumbPage`) uses `text-accent` as the focal point of the trail. Same-hex rule — cyan renders identically in light and dark. No CVA — no variants.

### Button

CVA-based instrument-panel button with 7 variants, 4 sizes, icon slots, loading/disabled states, and `asChild` polymorphism. The cyan LED dot in the leading slot is the brand signature for filled interactive controls.

```tsx
import { Button } from "@stasho/ds/button";
```

**Visual style:** Square corners (`rounded-none`), no border on filled variants, `font-body` (Inter) at weight 700, sentence case, `line-height: 1`. Each filled variant has a beveled chassis (inset top-highlight + bottom-shadow). Saturated semantic chassis (destructive/warning/success) carry an outer halo at rest for "electric" energy. Primary and Secondary stay halo-less at rest and gain a chassis-matching outer halo on hover (per Decision #82, SKIN-PRINCIPLES § Filled chassis).

#### Variants

```tsx
<Button variant="primary">Deploy instance</Button>      {/* Brand-blue chassis (both modes), cyan LED, primary-blue halo on hover */}
<Button variant="secondary">Configure</Button>          {/* Raised light chassis (light) / neutral-900 (dark), cyan LED, neutral halo on hover */}
<Button variant="destructive">Delete</Button>           {/* Blood-orange chassis, white LED, blood-orange halo at rest + on hover */}
<Button variant="warning">Force restart</Button>        {/* Amber chassis, dark LED, amber halo at rest + on hover */}
<Button variant="success">Confirm</Button>              {/* Teal-green chassis, dark LED, teal-green halo at rest + on hover */}
<Button variant="outline">Learn more</Button>           {/* Transparent chassis, primary-blue text + border (light) / cyan (dark) */}
<Button variant="ghost">Cancel</Button>                 {/* Pure label, no chassis, no LED */}
```

#### Sizes

```tsx
<Button size="xs">Extra small</Button>   {/* py-[6px] px-3,    text-[11px] */}
<Button size="sm">Small</Button>         {/* py-[7px] px-3.5,  text-xs       */}
<Button size="md">Medium</Button>        {/* py-[9px] px-[18px], text-[13px] — default */}
<Button size="lg">Large</Button>         {/* py-[13px] px-6,   text-[15px]   — opt-in for hero CTAs */}
```

#### Icons

When `iconLeft` is provided on a filled variant, it replaces the LED and inherits the LED's color + glow filter. `iconRight` is always rendered in the variant's foreground color with no glow.

```tsx
<Button iconLeft={<PlusIcon />}>Add item</Button>           {/* Cyan-glowing icon */}
<Button iconRight={<ArrowIcon />}>Next</Button>              {/* White arrow */}
<Button iconLeft={<PlusIcon />} iconRight={<ArrowIcon />}>
  Both
</Button>
```

#### Loading and Disabled

```tsx
<Button loading>Saving…</Button>          {/* Dual-dot chase; no spinner element; aria-busy */}
<Button loading iconLeft={<PlusIcon />}>
  Saving…
</Button>                                  {/* iconLeft is suppressed during load; chase replaces it */}
<Button disabled>Unavailable</Button>      {/* Chassis flattens to bg-muted (light) / neutral-900 (dark); LED keeps variant color */}
```

#### As Link (asChild)

```tsx
<Button asChild variant="primary">
  <a href="/dashboard">Go to dashboard</a>
</Button>

{/* Works with Next.js Link */}
<Button asChild variant="ghost">
  <Link href="/settings">Settings</Link>
</Button>
```

Note: when `asChild` is true, the LED/icon content is not rendered — `asChild` is for "link styled as button", not for "rich content button".

#### Custom composition with buttonVariants

```tsx
import { buttonVariants } from "@stasho/ds/button";

<a href="/docs" className={buttonVariants({ variant: "outline", size: "sm" })}>
  Documentation
</a>
```

#### Theme behavior

Buttons adapt across light and dark themes. Decision #82 governs the layering pattern (light-mode classes as the base; existing dark-mode classes re-qualified with `dark:`).

| Variant | Light mode | Dark mode |
|---|---|---|
| Primary | brand-blue gradient (`primary-400 → primary-500`), white text, cyan LED + glow | **same gradient as light** (unified per Decision #82), cyan LED + glow |
| Primary hover | chassis static, bevel highlight intensifies (0.55 → 0.7), outer halo `0 0 40px rgba(0,64,255,0.35)` | same chassis + bevel intensifies, outer halo `0 0 40px rgba(0,64,255,0.75)` (stronger for dark surface) |
| Secondary | raised light gradient (`--background → --surface`), `--foreground` text, hairline edge, cyan LED | `bg-neutral-900` chassis (verbatim from shipping), white text, cyan LED |
| Secondary hover | chassis static, outer halo `0 0 24px rgba(20,15,40,0.18)` (dark glow on light chassis) | chassis static, outer halo `0 0 32px rgba(255,255,255,0.2)` (white glow on dark chassis) |
| Destructive / Warning / Success | unchanged across modes (same-hex rule on saturated chassis + halo) | unchanged |
| Outline | `text-primary` (primary-blue) + primary-blue border, LED `bg-primary/35` | `text-accent` (cyan) + cyan border, LED `bg-accent/50` |
| Ghost | `text-foreground/75`, `bg-surface` on hover | `text-white/75`, `bg-white/[0.04]` on hover |
| Disabled (all filled variants) | `bg-muted` flat chassis, `text-foreground/30`, hairline edge | `bg-neutral-900` flat chassis, `text-white/30` |
| Disabled Outline | `bg-muted` chassis, `text-foreground/30` | transparent (preserves shipped behavior — see BACKLOG) |
| Focus | `outline-2 outline-accent outline-offset-2` (same in both modes) | same |
| Loading | dual-dot chase per Decision #81 (same in both modes) | same |

### Input

Styled text input with CVA sizing and error state.

```tsx
import { Input } from "@stasho/ds/input";

<Input size="md" placeholder="Enter text" />
<Input size="sm" placeholder="Small" />
<Input error placeholder="Invalid" />
<Input disabled placeholder="Disabled" />
```

**Sizes:** `sm` (py-1.5, text-sm) · `md` (py-2, text-base, default)

**Visuals:** Flat-slot chassis — `bg-background` (light) / `bg-surface` (dark) fill with 1px `border-edge` hairline. `rounded-none` (brutalist per skin vocabulary). No bevel, no gradient. Hover = no change (I-beam affordance is sufficient for pure text inputs).

**Focus:** Hairline swaps to `border-accent-700` (light, for AA on white) / `border-accent` (dark). No ring, no halo.

**Error:** `error={true}` swaps hairline to `border-error`, sets `aria-invalid`. Value stays `text-foreground`.

**Disabled:** Chassis sinks one step on the surface ladder (`bg-muted` light / `bg-background` dark). Hairline drops to `border-edge/50`. Value drops to `text-foreground/30`, placeholder to `text-muted-foreground/50`. `cursor-not-allowed`.

### Textarea

Multi-line text input. Same API as Input, `rounded-none`, flat-slot chassis, vertical resize.

```tsx
import { Textarea } from "@stasho/ds/textarea";

<Textarea placeholder="Enter message" />
<Textarea size="sm" rows={6} />
<Textarea error placeholder="Invalid" />
```

**Defaults:** `rows={4}`, `resize-y`, `size="md"`

**Visuals:** Same flat-slot chassis as Input (`bg-background`/`bg-surface` fill, 1px `border-edge` hairline, `rounded-none`). Focus swaps hairline to `border-accent-700` (light) / `border-accent` (dark). Error swaps hairline to `border-error` and keeps it through hover and focus (`hover:border-error focus-visible:border-error`). Disabled chassis sinks one step (`bg-muted` light, `bg-background` dark), hairline drops to `border-edge/50`, value text to `text-foreground/30`, placeholder to `text-muted-foreground/50`, cursor to `not-allowed`.

### FormField

Layout wrapper that wires label, helper text, and error message to a child input with proper accessibility attributes.

```tsx
import { FormField } from "@stasho/ds/form-field";
import { Input } from "@stasho/ds/input";

<FormField label="Email" required helperText="We'll never share it">
  <Input type="email" placeholder="you@example.com" />
</FormField>

<FormField label="Email" required error="Invalid email">
  <Input type="email" error />
</FormField>
```

**Props:** `label` (required), `required`, `helperText`, `error`, `className`

**Accessibility:** Auto-generates `id`, wires `htmlFor`, `aria-describedby`, and `role="alert"` on errors. When `error` is present, auto-injects `error={true}` and `aria-invalid={true}` into the child input via `cloneElement` — no need to pass `error` to both FormField and Input.

**Visual style:** Required asterisk (`*`) and error helper text use the semantic `--error` token (`text-error`). Previously referenced `text-error-600` — now decoupled from scale steps so future palette changes don't affect the error signal.

### Checkbox

Toggle control for boolean values. Wraps Radix UI Checkbox with CVA styling.

```tsx
import { Checkbox } from "@stasho/ds/checkbox";

<Checkbox />
<Checkbox defaultChecked />
<Checkbox checked={value} onCheckedChange={setValue} />
<Checkbox disabled />
<Checkbox error />
<Checkbox size="sm" />

<FormField label="Accept terms" required>
  <Checkbox />
</FormField>
```

**Props:** `checked`, `defaultChecked`, `onCheckedChange`, `disabled`, `error`, `size` (xs/sm/md), `className`. Forwards ref to `<button>`.

**Sizes:** `xs` (14px) · `sm` (16px) · `md` (20px, default). All sizes use `rounded-none` (vocabulary alignment per Decision #90 — `rounded` / `rounded-md` resolved to 0px under the Abyssal scale).

**Animation:** Check icon reveals with a clip-path circle transition (200ms, bottom-left origin following stroke direction). Uses Radix `forceMount` to keep indicator in DOM. Check glyph is Phosphor `<Check weight="bold" />` (Decision #90 — replaces the prior hand-rolled SVG; matches Stepper completed indicator per Decision #88).

**Visual style:** Flat-slot chassis matching Input — rest fill is `bg-background` (light) / `bg-surface` (dark) with 1px `border-edge` hairline (Decision #90 — the chassis is visible at rest in dark mode, no longer transparent). Checked = `bg-accent` + `border-accent` + dark `text-neutral-950` Phosphor glyph (legible on cyan in both modes). Focus = hairline swaps to `border-accent-700` (light) / `border-accent` (dark). Disabled flattens to muted-sink chassis (`bg-muted` light / `bg-background` dark) with `cursor: not-allowed`; compound `disabled:data-[state=checked]:*` rules keep disabled+checked sunk (no cyan leak).

**Error:** `error={true}` switches to 1px `border-error` semantic token (overrides checked-accent via `data-[state=checked]:border-error`), sets `aria-invalid`.

### RadioGroup

Mutually exclusive option set. Wraps Radix UI RadioGroup with CVA styling.

```tsx
import { RadioGroup, RadioGroupItem } from "@stasho/ds/radio-group";

<RadioGroup defaultValue="a" onValueChange={setValue}>
  <RadioGroupItem value="a" />
  <RadioGroupItem value="b" />
  <RadioGroupItem value="c" disabled />
</RadioGroup>

<FormField label="Plan" required>
  <RadioGroup defaultValue="starter">
    <RadioGroupItem value="starter" />
    <RadioGroupItem value="pro" />
  </RadioGroup>
</FormField>
```

**RadioGroup props:** `value`, `defaultValue`, `onValueChange`, `disabled`, `className`. Forwards ref to `<div>`.

**RadioGroupItem props:** `value`, `disabled`, `size` (xs/sm/md), `className`. Forwards ref to `<button>`.

**Sizes:** `xs` (14px) · `sm` (16px) · `md` (20px, default). Cascade from Checkbox per Decision #90 (chassis is shared per Decision #85). `rounded-full` (round-by-design).

**Animation:** Dot reveals with a clip-path circle transition (200ms, centered origin). Uses Radix `forceMount` to keep indicator in DOM.

**Visual style:** Flat-slot chassis matching Checkbox — rest fill is `bg-background` (light) / `bg-surface` (dark) with 1px `border-edge` → `border-accent` on checked; indicator dot is `bg-accent`. Disabled flattens chassis (muted-sink) and dims the dot via descendant rule (`disabled:[&_span]:bg-foreground/30`) — `peer-disabled:` doesn't apply because Radix nests Indicator as a child of Item.

### Switch

Toggle control for on/off states. Wraps Radix UI Switch with CVA styling and animated thumb.

```tsx
import { Switch } from "@stasho/ds/switch";

<Switch />
<Switch defaultChecked />
<Switch checked={value} onCheckedChange={setValue} />
<Switch disabled />
<Switch size="sm" />

<FormField label="Email notifications">
  <Switch />
</FormField>
```

**Props:** `checked`, `defaultChecked`, `onCheckedChange`, `disabled`, `size` (xs/sm/md), `className`. Forwards ref to `<button>`.

**Sizes:** `xs` (28×16px track, 12px thumb) · `sm` (36×20px track, 16px thumb) · `md` (44×24px track, 20px thumb, default). Thumb sizes match Checkbox/Radio at the same step (sm = 16, md = 20) per Decision #92, so a Switch row reads at the same visual weight as a Checkbox row in forms; xs thumb stays 12 because a 14-thumb in the 16-tall xs track leaves zero breathing. Track ratio is 1.75–1.83 across all sizes (industry-standard switch proportions). Symmetric 2px breathing on both ends of thumb travel.

**Visuals:** Square track (`rounded-[2px]`) with inset bevel (top-highlight `rgba(255,255,255,0.06)`, bottom-shadow `rgba(0,0,0,0.4)`) per SKIN-PRINCIPLES § 5. Off = `bg-muted dark:bg-neutral-900` track + neutral `bg-edge` square thumb (`rounded-[2px]`); on = same track + cyan `bg-accent` thumb. Thumb glows on hover/focus of the parent (`box-shadow: 0 0 5px var(--accent), 0 0 10px rgba(0,225,250,0.6)`) via named group `group/sw` — solid cyan at rest per Direction C. Focus uses `outline-2 outline-accent outline-offset-2` on the track. Disabled flattens chassis (no bevel) and dims thumb to `bg-foreground/30` regardless of on/off state. The rest of the chassis (bevel, cyan on-state, hover/focus glow, disabled flatten) is unchanged from the original chunk 4 implementation.

### Select

Dropdown selector. Wraps Radix UI Select with flat `options` prop API.

```tsx
import { Select } from "@stasho/ds/select";

<Select
  placeholder="Choose..."
  options={[
    { value: "a", label: "Option A" },
    { value: "b", label: "Option B" },
    { value: "c", label: "Option C", disabled: true },
  ]}
/>
<Select value={value} onValueChange={setValue} options={options} />
<Select disabled options={options} />
<Select error options={options} />

<FormField label="Region" required error="Required">
  <Select error placeholder="Select region" options={regions} />
</FormField>
```

**Props:** `value`, `defaultValue`, `onValueChange`, `placeholder`, `options` (array of `{ value, label, disabled? }`), `disabled`, `error`, `size` (sm/md), `className`, `id`, `aria-describedby`. Forwards ref to trigger `<button>`.

**Sizes:** `sm` (Input sm padding) · `md` (Input md padding, default)

**Visuals:** Flat-slot chassis — `bg-background` (light) / `bg-surface` (dark) fill with 1px `border-edge` hairline. `rounded-none`. Hover brightens hairline to `border-edge-hover` (dropdown trigger affordance).

**Focus:** Hairline swaps to `border-accent-700` (light) / `border-accent` (dark). No halo.

**Error:** `error={true}` swaps hairline to `border-error`, sets `aria-invalid`.

**Disabled:** Chassis sinks one step (`bg-muted` light / `bg-background` dark), hairline at `border-edge/50`, value at 30% opacity, `cursor-not-allowed`.

**Dropdown:** `rounded-none`, `bg-popover-bg`, `border border-popover-border`, `shadow`. Items highlight with `bg-muted`. Disabled items use `text-foreground/30 cursor-not-allowed`. Selected shows check icon.

### Badge

Semantic label for status, counts, and categories. Two fill modes (flat saturated solid, tinted hairline outline), optional icon slots, Departure Mono UC label face with CSS-forced uppercase.

```tsx
import { Badge } from "@stasho/ds/badge";
```

#### Fill Modes

**Solid (default):** flat saturated background with dark text. Default uses `bg-muted` + foreground text.

```tsx
<Badge variant="default">Informational</Badge>  {/* bg-muted text-foreground */}
<Badge variant="success">Healthy</Badge>         {/* bg-success text-neutral-950 */}
<Badge variant="warning">In Progress</Badge>     {/* bg-warning text-neutral-950 */}
<Badge variant="error">Failed</Badge>            {/* bg-error text-neutral-950 */}
<Badge variant="info">3 VMs</Badge>              {/* bg-accent text-neutral-950 (cyan) */}
```

**Outline:** tinted background + 1px colored hairline + colored text. Default outline uses neutral `border-edge` + `text-foreground/70`. Each semantic variant uses the light-mode `-500` text carve-out for AA contrast on light surfaces.

```tsx
<Badge fill="outline" variant="success">Healthy</Badge>  {/* bg-success/15 border-success/40 text-success-500 dark:text-success */}
<Badge fill="outline" variant="error">Failed</Badge>
<Badge fill="outline" variant="info">Live</Badge>        {/* cyan accent */}
```

#### Icons

```tsx
<Badge variant="success" iconLeft={<CheckCircle size={12} weight="bold" />}>Active</Badge>
<Badge variant="error" iconRight={<XCircle size={12} weight="bold" />}>Offline</Badge>
```

Icon wrappers scale with badge size: 10px (`size-2.5`) for sm, 12px (`size-3`) for md.

#### Sizes

```tsx
<Badge size="sm">Small</Badge>  {/* px-3, text-[10px] */}
<Badge size="md">Medium</Badge> {/* px-4, text-xs (default) */}
```

#### Custom Composition with badgeVariants

```tsx
import { badgeVariants } from "@stasho/ds/badge";

<span className={badgeVariants({ fill: "outline", variant: "success", size: "sm" })}>Active</span>
```

**Visual style:** `font-mono uppercase tracking-wider` (Departure Mono, CSS-forced uppercase regardless of consumer string), `rounded-[2px]` (contained-marker radius per SKIN-PRINCIPLES § 4 chip-row split — Decision #90). No gradients. Solid fill is a single saturated semantic background + `text-neutral-950` (info uses `bg-accent` cyan; default uses `bg-muted` + `text-foreground`). Outline fill is `bg-{token}/15` + 1px `border-{token}/40` + `text-{token}-500 dark:text-{token}` (light-mode `-500` carve-out generalized across all four semantic variants per Decision #88). Default outline drops to `bg-transparent border-edge text-foreground/70`.

### Card

Content container with semantic background and border. Used for stat cards, panels, and layout grouping.

```tsx
import { Card } from "@stasho/ds/card";
```

#### Variants

```tsx
<Card variant="default">Default card</Card>  {/* bg-surface + 1px border-edge hairline */}
<Card variant="ghost">No border</Card>        {/* transparent, no border */}
```

#### Padding

```tsx
<Card padding="sm">Compact</Card>  {/* p-4 */}
<Card padding="md">Medium</Card>   {/* p-6 (default) */}
<Card padding="lg">Spacious</Card> {/* p-8 */}
```

#### With Title

```tsx
<Card title="Node Health">
  <p>Card content below the heading.</p>
</Card>
```

Renders an `<h3>` heading with `font-heading` and `mb-4` spacing.

**Visual style:** `rounded-lg` (2px under the Abyssal scale), `bg-surface` (default) or transparent (ghost), 1px `border-edge` hairline on default. No drop shadow at rest — pair with `shadow-sm` / `shadow` when elevation is required (e.g., hover affordance on a clickable card).

### CopyableText

Truncated text display with copy-to-clipboard and optional external link. Designed for hashes, wallet addresses, API keys, and other long strings that need to be copiable but not fully visible. Uses a stroke-draw micro-animation on copy (Copy fades out, SVG checkmark draws its stroke via `stroke-dashoffset`).

```tsx
import { CopyableText } from "@stasho/ds/copyable-text";
```

#### Sizes

```tsx
<CopyableText text={hash} size="sm" />  {/* text-xs, gap-1 */}
<CopyableText text={hash} size="md" />  {/* text-sm, gap-1.5 (default) */}
```

#### Custom Truncation

```tsx
{/* Default: startChars=6, endChars=4 → "0x1234...5678" */}
<CopyableText text={hash} />

{/* Custom: startChars=8, endChars=6 → "0x123456...345678" */}
<CopyableText text={hash} startChars={8} endChars={6} />

{/* Short text (no truncation when text.length <= startChars + endChars) */}
<CopyableText text="0x1a2b3c" />
```

#### With External Link

```tsx
<CopyableText
  text={walletAddress}
  href="https://etherscan.io/address/..."
/>
```

When `href` is provided, the truncated text itself becomes a clickable link (opens in new tab), plus an ArrowUpRight icon button. Both use `target="_blank"` and `rel="noopener noreferrer"`. Text color automatically switches to `text-accent-500` (light) / `text-accent` (dark) to indicate a navigable link per § 2 Color link role. Override with `className` if needed.

**Animation:** Copy button plays a reveal animation (circle expand + check icon) on click. Respects `prefers-reduced-motion`.

### Dialog

Modal dialog wrapping Radix UI Dialog with composable API, frosted overlay (`bg-black/60 backdrop-blur-sm`), entry/exit animations (`fade-in/out` + `zoom-in/out-95`), and configurable dismiss locking. Uses the composable re-export pattern (like Tooltip/Tabs).

```tsx
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@stasho/ds/dialog";

{/* Uncontrolled */}
<Dialog>
  <DialogTrigger asChild>
    <Button variant="outline" size="sm">Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description text.</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <DialogClose asChild>
        <Button variant="outline" size="sm">Cancel</Button>
      </DialogClose>
      <Button variant="primary" size="sm">Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

{/* Controlled + locked (no overlay click, no Escape, no close button) */}
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent locked>
    <DialogHeader>
      <DialogTitle>Confirm action</DialogTitle>
      <DialogDescription>You must choose an action.</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="outline" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
      <Button variant="primary" size="sm" onClick={() => setOpen(false)}>Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

**Exports:** `Dialog`, `DialogTrigger`, `DialogContent`, `DialogClose`, `DialogTitle`, `DialogDescription`, `DialogHeader`, `DialogFooter`, `DialogContentProps`

**Visual style:** `bg-surface` content with `rounded-xl` (4px under the Abyssal scale), no border, no drop shadow — the content separates from page via the frosted overlay alone. Close-button focus uses the Button outline pattern (`outline-2 outline-accent outline-offset-2`). Overlay is `bg-black/60 backdrop-blur-sm` — neutral, frosted.

**Props (DialogContent):**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `locked` | `boolean` | `false` | Prevents overlay click, Escape dismiss, and hides the close button |
| `className` | `string` | — | Merged onto the content panel |

Plus all Radix `Dialog.Content` props (`onOpenAutoFocus`, `onCloseAutoFocus`, etc.).

### Pagination

Controlled pagination with fixed-slot layout, configurable sibling count, first/last jump buttons, and ellipsis logic. Pure `buildPageRange()` function always produces `2*siblingCount+5` items when `showFirstLast` is true, eliminating layout shift. Slots are keyed by position so the DOM stays stable during navigation.

```tsx
import { Pagination } from "@stasho/ds/pagination";
```

**Visual style:** 26×26 number buttons + 32×32 nav arrow buttons, Departure Mono text-sm page numbers and ellipsis, active page is a tinted cyan cell (`bg-accent/15` + `text-accent-500 dark:text-accent`). Rest state: quiet `text-foreground/60` with no background. Hover: text shifts to `text-accent-500 dark:text-accent` with no bg change. Ellipsis at `text-foreground/40`. Disabled nav uses wave-1 pattern (`text-foreground/30 cursor-not-allowed` — not `opacity-50 pointer-events-none`). Focus: `outline-2 outline-accent outline-offset-2`. Caret icons from Phosphor.

#### Usage

```tsx
<Pagination page={page} totalPages={20} onPageChange={setPage} />
```

#### Compact (no first/last)

```tsx
<Pagination page={page} totalPages={10} onPageChange={setPage} showFirstLast={false} />
```

#### Desktop Max (wider sibling range)

```tsx
<Pagination page={page} totalPages={10} onPageChange={setPage} siblingCount={2} />
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `page` | `number` | — | Current active page (1-indexed, controlled) |
| `totalPages` | `number` | — | Total number of pages |
| `onPageChange` | `(page: number) => void` | — | Called with new page number on click |
| `siblingCount` | `number` | `1` | Pages shown on each side of current page |
| `showFirstLast` | `boolean` | `true` | Show first/last jump buttons and anchored page numbers |
| `className` | `string` | — | Merged via `cn()` onto the `<nav>` |
| `ref` | `Ref<HTMLElement>` | — | Forwarded to the `<nav>` element |

#### Accessibility

- `<nav aria-label="Pagination">` landmark
- `aria-current="page"` on active page button
- `aria-disabled="true"` on boundary nav buttons (keeps them in tab order for discoverability)
- `aria-label` on all nav buttons ("First page", "Previous page", "Next page", "Last page", "Page N")
- Ellipsis rendered as `aria-hidden="true"` spans

### StatusDot

Small colored circle indicating health status. Used inline with text labels in tables and lists. Accessible by default — includes `role="status"` and auto-derived `aria-label` from the status prop.

```tsx
import { StatusDot } from "@stasho/ds/status-dot";
```

#### Statuses

```tsx
<StatusDot status="healthy" />   {/* success-500, pulse animation */}
<StatusDot status="degraded" />  {/* warning-500 */}
<StatusDot status="error" />     {/* error-500 */}
<StatusDot status="offline" />   {/* neutral-400 */}
<StatusDot status="unknown" />   {/* neutral-300 */}
```

#### Sizes

```tsx
<StatusDot status="healthy" size="sm" />  {/* 8px (size-2) */}
<StatusDot status="healthy" size="md" />  {/* 12px (size-3, default) */}
```

**Accessibility:** Built-in `role="status"` and auto-derived `aria-label` (e.g., `status="healthy"` → `aria-label="Healthy"`). Override with a custom label when more context is needed:

```tsx
<StatusDot status="healthy" aria-label="Node is healthy" />
```

### Table

Generic typed table with sortable columns, alternating rows, hover highlight, row click, keyboard accessibility, and empty state.

```tsx
import { Table, type Column } from "@stasho/ds/table";
```

#### Column Definition

```tsx
type Column<T> = {
  header: string;            // Column header text
  accessor: (row: T) => ReactNode;  // Cell renderer
  sortable?: boolean;        // Enable sort on this column
  sortValue?: (row: T) => string | number;  // Sort comparator
  width?: string;            // CSS width
  align?: "left" | "center" | "right";
};
```

#### Usage

```tsx
const columns: Column<Node>[] = [
  { header: "Name", accessor: (r) => r.name, sortable: true, sortValue: (r) => r.name },
  { header: "CPU", accessor: (r) => `${r.cpu}%`, sortable: true, sortValue: (r) => r.cpu, align: "right" },
];

<Table
  columns={columns}
  data={nodes}
  keyExtractor={(r) => r.id}
  onRowClick={(row) => setSelected(row)}
  emptyState="No nodes found"
/>
```

**Active row:** Pass `activeKey` matching a `keyExtractor` value to highlight the selected row with a primary-tinted background and left inset border. Sets `aria-current="true"` for screen readers.

```tsx
<Table columns={columns} data={nodes} keyExtractor={(r) => r.id} activeKey={selectedId} />
```

**Visual style:** Alternating rows (`even:bg-muted/30`), hover highlight (`hover:bg-muted/50`), clickable rows with `cursor-pointer` and left inset border on hover. Header row uses Departure Mono UC tracking-widest 11px (`font-mono uppercase tracking-widest text-[11px] text-muted-foreground`).

**Keyboard accessibility:** Sortable headers are focusable (`tabIndex={0}`) and respond to Enter/Space. Clickable rows are focusable and respond to Enter. Headers include `aria-sort` (`ascending`/`descending`/`none`). Active row has `aria-current="true"`.

**Sort-icon alignment on right-aligned columns:** Sortable headers always render the sort icon (opacity-0 when inactive) so toggling sort doesn't shift column width. For `align: "right"`, the header content is wrapped in an inline-flex with `flex-row-reverse` so the icon sits to the left of the header text — keeping the text's right edge flush with the right edge of body cells at any width.

**Controlled sort:** By default, the table sorts the `data` array internally — fine when `data` contains every row that should participate in the sort. When the rows passed to `data` are a subset of a larger dataset (for example, the current page of an externally paginated list), pass `sortColumn`, `sortDirection`, and `onSortChange` to operate in controlled mode. The table delegates header clicks via `onSortChange(column, direction)` and renders the indicator from the controlled props; the parent owns the sort state and pre-sorts the full dataset before passing the visible slice.

```tsx
const [sortColumn, setSortColumn] = useState("VMs");
const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
const sorted = applySort(filteredRows, columns, sortColumn, sortDirection);
const pageItems = paginate(sorted);

<Table
  columns={columns}
  data={pageItems}
  keyExtractor={(r) => r.id}
  sortColumn={sortColumn}
  sortDirection={sortDirection}
  onSortChange={(col, dir) => {
    setSortColumn(col);
    setSortDirection(dir);
  }}
/>
```

**Empty state:** Pass `emptyState` (ReactNode) to render a centered message spanning all columns when `data` is empty.

### Tooltip

Radix UI tooltip wrapper with DS styling. Composable API with four exports.

```tsx
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@stasho/ds/tooltip";
```

#### Usage

Wrap your app (or a subtree) with `TooltipProvider`, then compose tooltips:

```tsx
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <button>Hover me</button>
    </TooltipTrigger>
    <TooltipContent>Tooltip text</TooltipContent>
  </Tooltip>
</TooltipProvider>
```

#### Placement

```tsx
<TooltipContent side="top" />     {/* default */}
<TooltipContent side="right" />
<TooltipContent side="bottom" />
<TooltipContent side="left" />
```

**Styling:** Popover surface — `bg-popover-bg border border-popover-border rounded-none text-foreground text-sm shadow-sm px-3 py-1.5`. Same chassis as Select / Combobox / MultiSelect / Tabs overflow dropdowns — re-themable through `--popover-bg` / `--popover-border`. Radix animation attributes (`fade-in-0 zoom-in-95` on enter; reverse on close) unchanged.

### Tabs

Radix UI Tabs with DS styling, sliding active indicator, and text nudge micro-animation. Composable API — Radix Root is re-exported directly; List wraps the indicator logic. Underline variant uses a 1px hairline track at 40% `edge` opacity with a 1px solid cyan accent indicator that slides to the active tab.

```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@stasho/ds/tabs";
```

#### Usage

```tsx
<Tabs defaultValue="compute">
  <TabsList>
    <TabsTrigger value="compute">Compute</TabsTrigger>
    <TabsTrigger value="storage">Storage</TabsTrigger>
    <TabsTrigger value="network">Network</TabsTrigger>
  </TabsList>
  <TabsContent value="compute">...</TabsContent>
  <TabsContent value="storage">...</TabsContent>
  <TabsContent value="network">...</TabsContent>
</Tabs>
```

#### With Badges

Tab triggers accept arbitrary children — badges, subscripts, icons:

```tsx
<TabsTrigger value="vms">
  VMs <Badge size="sm" variant="info">12</Badge>
</TabsTrigger>
```

#### Disabled Tab

```tsx
<TabsTrigger value="upcoming" disabled>Upcoming</TabsTrigger>
```

#### Pill Variant

A segmented-control style framed by a 1px `--edge` hairline with a sliding tinted-cyan indicator. Pass `variant="pill"` to `TabsList`:

```tsx
<Tabs defaultValue="nodes">
  <TabsList variant="pill">
    <TabsTrigger value="vms">VMs</TabsTrigger>
    <TabsTrigger value="nodes">Nodes</TabsTrigger>
  </TabsList>
  <TabsContent value="vms">...</TabsContent>
  <TabsContent value="nodes">...</TabsContent>
</Tabs>
```

#### Small Size

Pass `size="sm"` to `TabsList` for a compact variant. Works with both underline and pill:

```tsx
<Tabs defaultValue="compute">
  <TabsList size="sm">
    <TabsTrigger value="compute">Compute</TabsTrigger>
    <TabsTrigger value="storage">Storage</TabsTrigger>
  </TabsList>
  <TabsContent value="compute">...</TabsContent>
  <TabsContent value="storage">...</TabsContent>
</Tabs>
```

| | md (default) | sm |
|---|---|---|
| **Underline trigger** | `px-4 py-3 text-sm` | `px-3 py-1.5 text-sm` |
| **Underline border** | `border-b`, indicator `h-px` | `border-b`, indicator `h-px` |
| **Pill trigger** | `px-5 py-1.5 text-sm` | `px-3 py-1 text-xs` |
| **Pill container** | `p-1` | `p-0.5` |

#### Overflow Collapse

When many tabs exceed the available width, `overflow="collapse"` on `TabsList` auto-hides trailing tabs into a "..." dropdown menu. Works with both underline and pill variants. The sliding indicator moves behind the "..." trigger when a hidden tab is active.

```tsx
<Tabs defaultValue="compute">
  <TabsList overflow="collapse">
    <TabsTrigger value="compute">Compute</TabsTrigger>
    <TabsTrigger value="storage">Storage</TabsTrigger>
    <TabsTrigger value="network">Network</TabsTrigger>
    <TabsTrigger value="domains">Domains</TabsTrigger>
    <TabsTrigger value="functions">Functions</TabsTrigger>
    <TabsTrigger value="volumes">Volumes</TabsTrigger>
  </TabsList>
  <TabsContent value="compute">...</TabsContent>
  {/* ... */}
</Tabs>
```

**Overflow behavior:** Hidden tabs remain functional (Radix state intact). The dropdown uses `role="menu"` with arrow key navigation. Disabled tabs appear muted in the dropdown. Container height is locked to prevent layout collapse.

#### Max Visible (count cap)

`maxVisible?: number` on `TabsList` hard-caps the number of visible tabs regardless of available width. Trailing tabs collapse into the same overflow dropdown as `overflow="collapse"`. Use this when you need a deterministic count cap (e.g., always show the 3 primary status tabs, send the rest to the dropdown).

```tsx
<Tabs defaultValue="all">
  <TabsList maxVisible={3}>
    <TabsTrigger value="all">All</TabsTrigger>
    <TabsTrigger value="dispatched">Dispatched</TabsTrigger>
    <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
    <TabsTrigger value="running">Running</TabsTrigger>
    <TabsTrigger value="stopped">Stopped</TabsTrigger>
    {/* ...more tabs collapse into the "..." dropdown */}
  </TabsList>
  {/* TabsContent panels */}
</Tabs>
```

`maxVisible` activates the same overflow code path as `overflow="collapse"` — passing it alone is enough; you don't need to also pass `overflow`. When both are set, the **stricter** limit wins: visible = `min(widthFit, maxVisible)`. Hidden tabs go into the dropdown either way.

**Styling (underline):** `font-sans font-semibold text-sm` triggers (Inter Semibold sentence case). 1px hairline track at 40% `edge` opacity, 1px solid cyan accent (`bg-accent`) sliding indicator. Active/hover text uses `text-accent`. Active trigger is nudged up 2px (`-translate-y-0.5`) so the text rests above the indicator bar.

**Styling (pill):** `rounded-[2px] bg-muted` container framed by a 1px `border-edge` hairline. Active indicator is a tinted cyan fill (`bg-accent/15`), rounded `[2px]` to match the list shape. Triggers `text-muted-foreground` inactive, `text-accent` active and on hover, compact `px-5 py-1.5 text-sm`.

**Focus:** native `outline-2 outline-accent outline-offset-2` (matches Button). **Disabled:** `text-foreground/30` + `cursor-not-allowed` (semantic flatten, no `opacity-20`). **Same-hex rule:** cyan `--accent` (`#00E1FA`) renders identically in light and dark — no `dark:` variants needed.

**Exports:** `Tabs` (Root), `TabsList`, `TabsTrigger`, `TabsContent`, `TabsListProps`, `TabsSize`, `TabsVariant`

**Variants:** `TabsList` accepts `variant?: "underline" | "pill"` (default `"underline"`), `size?: "sm" | "md"` (default `"md"`), `overflow?: "collapse"`, and `maxVisible?: number`. All four props compose freely. `overflow` and `maxVisible` both activate the overflow dropdown; when both are set, the stricter limit wins.

**Animations:**
- **Sliding indicator** — slides between tabs on selection change. Initial render positions instantly (no slide-in from origin).
- **Text nudge** — active trigger shifts up 2px (`-translate-y-0.5`) in underline variant only
- All animations respect `prefers-reduced-motion` via `motion-reduce:transition-none`

### Skeleton

Animated loading placeholder. No width/height props — sizing is controlled by the consumer via `className`.

```tsx
import { Skeleton } from "@stasho/ds/ui/skeleton";

<Skeleton className="h-4 w-32" />           {/* Text line */}
<Skeleton className="h-10 w-full" />         {/* Input field */}
<Skeleton className="size-12 rounded-full" /> {/* Avatar */}
```

Uses `animate-pulse bg-muted rounded-none`. Hidden from accessibility tree via `aria-hidden="true"`. Respects `prefers-reduced-motion` via `motion-reduce:animate-none`.

### Loader

Standalone loading indicator. Dual-dot cyan chase extracted from Button's loading state (Decision #94) — the same animation, available outside a button.

```tsx
import { Loader } from "@stasho/ds/loader";

<Loader />                              {/* Default md size, "Loading" aria-label */}
<Loader size="xs" />
<Loader size="sm" />
<Loader>Saving…</Loader>                {/* Inline label */}
<Loader aria-label="Syncing inbox" />   {/* Custom aria-label when no children */}
```

**Props:** `size` (xs/sm/md, default md), `children` (optional inline label), `aria-label` (defaults to "Loading" when no children), `className`. Forwards ref to the root `<span>`.

**Sizes:** Dots match Button's LED ladder.

| Size | Dot | Label |
|------|-----|-------|
| `xs` | `size-1` (4px) | `text-xs` |
| `sm` | `size-[5px]` | `text-sm` |
| `md` | `size-1.5` (6px) | `text-sm` |

**Visuals:** Two `bg-accent` (cyan) dots with `[box-shadow:0_0_8px_currentColor]` glow, alternating opacity via `animate-button-chase-a` / `animate-button-chase-b` keyframes (0.9s ease-in-out infinite). Always cyan per § 5 "Cyan is the moving signal" — no variant colors.

**Accessibility:** `role="status"`. When children are provided, the visible label is the accessible name (`aria-label` is omitted). When no children, `aria-label` defaults to "Loading" and can be overridden by the consumer. Dots are wrapped in `aria-hidden="true"`. Respects `prefers-reduced-motion` — the chase pauses and dots hold full opacity.

**When to use:** Standalone loading indicator outside a button (data fetch, sync status, background work). For loading state inside a Button, use Button's `loading` prop instead — it handles the chase internally and manages `aria-busy`.

### Combobox

Searchable dropdown selector. Wraps cmdk + Radix Popover with flat `options` prop API.

```tsx
import { Combobox } from "@stasho/ds/combobox";

<Combobox
  placeholder="Search tokens..."
  options={[
    { value: "btc", label: "Bitcoin" },
    { value: "eth", label: "Ethereum" },
    { value: "sol", label: "Solana" },
    { value: "dot", label: "Polkadot", disabled: true },
  ]}
/>
<Combobox value={value} onValueChange={setValue} options={options} />
<Combobox disabled options={options} />
<Combobox error options={options} />

<FormField label="Token" required error="Required">
  <Combobox error placeholder="Select a token..." options={tokens} />
</FormField>
```

**Props:** `value`, `onValueChange`, `placeholder`, `searchPlaceholder`, `emptyMessage`, `options` (array of `{ value, label, disabled? }`), `disabled`, `error`, `size` (sm/md), `className`, `id`, `aria-describedby`. Forwards ref to trigger `<button>`.

**Sizes:** `sm` (Input sm padding) · `md` (Input md padding, default)

**Visuals:** Flat-slot chassis — `bg-background` (light) / `bg-surface` (dark) fill with 1px `border-edge` hairline. `rounded-none`. Hover brightens hairline to `border-edge-hover` (dropdown trigger affordance). Chevron rotates on open.

**Focus:** Hairline swaps to `border-accent-700` (light) / `border-accent` (dark). No halo.

**Search:** Type to filter options by label. `emptyMessage` shown when no options match (default: "No results found.").

**Error:** `error={true}` swaps hairline to `border-error`, sets `aria-invalid`.

**Disabled:** Chassis sinks one step (`bg-muted` light / `bg-background` dark), hairline at `border-edge/50`, value at 30% opacity, `cursor-not-allowed`.

**Dropdown:** `rounded-none`, `bg-popover-bg`, `border border-popover-border`, `shadow`. Items highlight with `bg-muted`. Disabled items use `text-foreground/30 cursor-not-allowed`. Selected shows check icon.

### Slider

Range input for selecting numeric values. Wraps Radix Slider primitive with CVA track/thumb variants. Supports single-value and range (two-thumb) modes.

```tsx
import { Slider } from "@stasho/ds/slider";

{/* Single thumb */}
<Slider defaultValue={[50]} />
<Slider min={0} max={1000} step={10} defaultValue={[500]} />
<Slider value={value} onValueChange={setValue} showTooltip />

{/* Range (two thumbs) */}
<Slider defaultValue={[25, 75]} />
<Slider min={0} max={1000} step={10} value={range} onValueChange={setRange} showTooltip />

{/* States */}
<Slider disabled defaultValue={[50]} />
<Slider error defaultValue={[50]} />

<FormField label="Volume" helperText="Adjust the volume level">
  <Slider defaultValue={[50]} showTooltip />
</FormField>
```

**Props:** All Radix Slider Root props (`defaultValue`, `value`, `onValueChange`, `min`, `max`, `step`, `disabled`) plus `size` (sm/md), `error`, `showTooltip`, `className`. Forwards ref to root `<span>`.

**Range mode:** Pass a two-element array (e.g., `defaultValue={[25, 75]}`) to render two thumbs. The filled range spans between the thumbs. Radix prevents thumbs from crossing each other.

**Sizes:** `sm` (6px track, 12px thumb) · `md` (8px track, 14px thumb, default)

**Tooltip:** `showTooltip` shows each thumb's current value on hover. Styled as a flat popover surface — `bg-popover-bg border border-popover-border rounded-none text-foreground`, sharing the chunk-6 popover token with Tooltip and the four dropdown surfaces (Decision #87).

**Visual style:** Track carries inset bevel (`inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.4)`) on `bg-muted dark:bg-neutral-900` per SKIN-PRINCIPLES § 5. Range fill is `bg-accent`. Thumb is a 1.5px `border-accent` ring on a `bg-background` interior (aperture — the dark interior differentiates the thumb from the cyan range fill; the ring carries the brand color). On hover, the interior fills `bg-accent` and an outer halo lights up (`box-shadow: 0 0 6px var(--accent), 0 0 12px rgba(0,225,250,0.5)`) — a documented carve-out from "hover intensifies, doesn't repaint" because the thumb is directly grabbed (Decision #89). Focus uses `outline-2 outline-accent outline-offset-2` + the same halo; the ring stays open on focus alone. Disabled flattens the ring to `border-foreground/30` (interior stays `bg-background`) and the range to `bg-foreground/30`; uses `data-[disabled]:*` variants because Radix renders Thumb/Range as `<span>` (not a button), so `:disabled` pseudo-class doesn't apply. The compound `data-[disabled]:hover:bg-background` keeps the disabled chassis static under hover.

**Error:** `error={true}` swaps the thumb ring to `border-error` and replaces the cyan glow with a blood-orange glow on hover/focus; the interior fills `bg-error` on hover (parallels the standard hover fill). Track is unchanged — at 4–8px height the track is too thin to render a visible 1px error border.

**Keyboard:** Arrow left/right adjusts by `step`. Tab between thumbs in range mode. Fully accessible via Radix.

### MultiSelect

Searchable multi-selection dropdown with tag display, checkbox indicators, and clear-all action. Wraps cmdk + Radix Popover (same stack as Combobox).

```tsx
import { MultiSelect } from "@stasho/ds/multi-select";

<MultiSelect
  placeholder="Select tokens..."
  options={[
    { value: "btc", label: "Bitcoin" },
    { value: "eth", label: "Ethereum" },
    { value: "sol", label: "Solana" },
    { value: "dot", label: "Polkadot", disabled: true },
  ]}
/>
<MultiSelect value={value} onValueChange={setValue} options={options} />
<MultiSelect disabled options={options} />
<MultiSelect error options={options} />

<FormField label="Tokens" required error="Required">
  <MultiSelect error placeholder="Select tokens..." options={tokens} />
</FormField>
```

**Props:** `value` (string[]), `onValueChange`, `placeholder`, `searchPlaceholder`, `emptyMessage`, `options` (array of `{ value, label, disabled? }`), `maxDisplayedTags` (default: 2), `disabled`, `error`, `size` (sm/md), `className`, `id`, `aria-describedby`. Forwards ref to trigger `<div>`.

**Sizes:** `sm` (Input sm padding) · `md` (Input md padding, default)

**Trigger:** Shows selected items as tags (pills) with per-tag dismiss buttons. When more items are selected than `maxDisplayedTags`, shows "+N more" overflow text. Clear-all button appears when any items are selected; chevron shows when empty. Single-row layout — tags overflow-clip rather than growing trigger height.

**Search:** Type to filter options by label. `emptyMessage` shown when no options match (default: "No results found."). Search clears after each selection.

**Selection:** Clicking an item toggles it (adds or removes). Dropdown stays open after selection for multi-toggle. Checkbox visuals on each item indicate selected state.

**Visuals:** Flat-slot chassis — `bg-background` (light) / `bg-surface` (dark) fill with 1px `border-edge` hairline. `rounded-none`. Hover brightens hairline to `border-edge-hover` (dropdown trigger affordance). Trigger uses `<div role="button">` (not `<button>`) to allow nested dismiss buttons without HTML nesting violations.

**Focus:** Hairline swaps to `border-accent-700` (light) / `border-accent` (dark). No halo.

**Error:** `error={true}` swaps hairline to `border-error`, sets `aria-invalid`.

**Disabled:** Uses `aria-disabled:` variants (trigger is a `<div role="button">`, not a native `<input>`). Chassis sinks one step (`bg-muted` light / `bg-background` dark), hairline at `border-edge/50`, value at 30% opacity, `cursor-not-allowed`.

**Dropdown:** `rounded-none`, `bg-popover-bg`, `border border-popover-border`, `shadow`. Items highlight with `bg-muted`. Disabled items use `text-foreground/30 cursor-not-allowed`. Selected items show filled checkbox: `border-accent bg-accent text-accent-foreground` (cyan, 1px hairline, 0px radius — matches Checkbox/Radio cyan-checked treatment).

### ProgressBar

Determinate or indeterminate progress indicator with 3 sizes and optional description.

```tsx
import { ProgressBar, ProgressBarDescription } from "@stasho/ds/progress-bar";

// Determinate — value out of max (default 100)
<ProgressBar value={35} label="Upload progress" />

// Indeterminate — omit value
<ProgressBar label="Loading data" />

// With description (linked via aria-describedby)
<ProgressBar value={75} label="Deployment">
  <ProgressBarDescription>Deploying 3 of 4 services...</ProgressBarDescription>
</ProgressBar>

// Custom max
<ProgressBar value={3} max={5} label="Step progress" />

// Custom fill color via data-fill selector
<ProgressBar value={90} label="Critical" className="[&_[data-fill]]:bg-error-500" />
```

**Props:** `value` (number, omit for indeterminate), `max` (number, default 100), `label` (string, required — becomes `aria-label`), `size` (`"sm"` | `"md"` | `"lg"`, default `"md"`).

**Sizes:** `sm` = 4px, `md` = 6px (default), `lg` = 10px track height.

**Indeterminate mode:** Omit `value`. The fill bar animates a sliding loop. `aria-valuenow` is omitted per WAI-ARIA spec.

**Visual style:** Fill is `bg-accent` (cyan) — applies in both determinate and indeterminate modes. Track is `bg-muted dark:bg-neutral-900` with the Switch/Slider inset bevel (`shadow-[inset_0_1px_0_rgba(255,255,255,0.06),inset_0_-1px_0_rgba(0,0,0,0.4)]`) per SKIN-PRINCIPLES § 5. No glow on the fill (Decision #90 § 6 Direction C amendment — bevel + cyan carries the lit-surface signal without committing to a persistent glow; glow is reserved for directly-grabbed controls and "you are here" beacons).

**Custom colors:** Target the fill via `[&_[data-fill]]` selector in className. Works with any Tailwind `bg-*` class.

### Stepper

Composable multi-step indicator with horizontal/vertical orientation. Ships with Abyssal Void indicator styling by default — consumers can further override via `data-state` and `data-orientation` attribute selectors.

```tsx
import {
  Stepper, StepperList, StepperItem, StepperIndicator,
  StepperLabel, StepperDescription, StepperConnector,
} from "@stasho/ds/stepper";

<Stepper aria-label="Deployment wizard">
  <StepperList>
    <StepperItem state="completed">
      <StepperIndicator className="...">1</StepperIndicator>
      <StepperLabel className="...">Select</StepperLabel>
    </StepperItem>
    <StepperConnector />
    <StepperItem state="active">
      <StepperIndicator className="...">2</StepperIndicator>
      <StepperLabel className="...">Configure</StepperLabel>
      <StepperDescription className="...">Setting up...</StepperDescription>
    </StepperItem>
    <StepperConnector />
    <StepperItem state="inactive">
      <StepperIndicator className="...">3</StepperIndicator>
      <StepperLabel className="...">Deploy</StepperLabel>
    </StepperItem>
  </StepperList>
</Stepper>

// Vertical
<Stepper orientation="vertical" aria-label="Pipeline">
  ...
</Stepper>
```

**Parts:**

| Part | Element | Purpose |
|------|---------|---------|
| `Stepper` | `<nav>` | Root, carries `orientation` context |
| `StepperList` | `<ol>` | Ordered list container |
| `StepperItem` | `<li>` | Step, carries `state` context, sets `data-state` and `aria-current="step"` |
| `StepperIndicator` | `<div>` | Number/icon circle, inherits `data-state` |
| `StepperLabel` | `<span>` | Step title, inherits `data-state` |
| `StepperDescription` | `<span>` | Step subtitle, inherits `data-state` |
| `StepperConnector` | `<li>` | Line between steps, `aria-hidden`, inherits `data-orientation` |

**Indicator style:** Square `rounded-[2px]` `size-8` hairline-edge chassis with Inter Semibold text. Inactive: `border border-edge text-foreground/45 bg-transparent`. Active: cyan hairline + persistent halo (`box-shadow: 0 0 6px rgba(0,225,250,0.5), 0 0 14px rgba(0,225,250,0.3)`) + `text-accent-500 dark:text-accent`. Completed: solid cyan chip (`bg-accent`) with dark check glyph (`text-neutral-950`) — `StepperIndicator` auto-renders `<Check weight="bold" />` replacing `{children}` when the surrounding `StepperItem` has `state="completed"`.

**Connector style:** 1px hairline (`h-px` horizontal / `w-px` vertical) `bg-edge` default. Pass `completed` prop to fill `bg-accent` between two consecutive completed steps:

```tsx
<StepperConnector completed />  {/* fills cyan between completed steps */}
<StepperConnector />            {/* edge color (default) */}
```

**State:** `StepperItem` accepts `state` prop (`"completed"` | `"active"` | `"inactive"`, default `"inactive"`). State propagates as `data-state` to all child parts via React context. Additional styling can be applied via `data-[state=completed]:`, `data-[state=active]:`, etc.

**Orientation:** `Stepper` accepts `orientation` (`"horizontal"` | `"vertical"`, default `"horizontal"`). Propagates as `data-orientation` to `StepperConnector` and layout classes on `StepperList`.

**Connectors are siblings:** `StepperConnector` must be a sibling of `StepperItem` in the list — not a child. Both render as `<li>`.

---

## Token File Reference

All tokens live in `packages/ds/src/styles/tokens.css`. Three layers:

| Layer | CSS construct | Purpose |
|-------|--------------|---------|
| 1. Brand | `@theme { }` | Raw brand values (colors, gradients, shadows, fonts) — extends Tailwind |
| 2. Semantic | `:root { }` / `.theme-dark { }` | Purpose-driven tokens that swap per theme |
| 3. Tailwind bridge | `@theme inline { }` | Maps semantic tokens to Tailwind's `--color-*` namespace |

To modify tokens, edit `packages/ds/src/styles/tokens.css` directly. Changes propagate to all Tailwind classes automatically.

---

## Preview App

Run `npm run dev` and visit http://localhost:3000. Sidebar navigation organized by category:

### Foundations

| Route | Content |
|-------|---------|
| `/` | Overview — foundation cards, component showcase |
| `/foundations/colors` | OKLCH color scales (50-950), semantic tokens, borders |
| `/foundations/typography` | Heading scale (Header-H7), body styles, font families |
| `/foundations/spacing` | Spacing scale, breakpoints table, border radius |
| `/foundations/effects` | Shadow tokens, gradient swatches, transition demos |
| `/foundations/icons` | Phosphor Icons showcase — weights, sizes, usage |
| `/foundations/logo` | Logo and LogoFull variants, theming |

### Components

**Actions**

| Route | Content |
|-------|---------|
| `/components/button` | Variants, sizes, icons, loading, disabled, asChild |

**Data Display**

| Route | Content |
|-------|---------|
| `/components/badge` | Variants, fill modes, sizes, icons |
| `/components/card` | Default/ghost variants, padding sizes, title |
| `/components/copyable-text` | Sizes, truncation, external link, copy animation |
| `/components/status-dot` | Statuses, sizes, inline usage |
| `/components/table` | Sorting, row click, active row, empty state |

**Feedback**

| Route | Content |
|-------|---------|
| `/components/alert` | Variants, title, dismiss, auto-dismiss timer |
| `/components/dialog` | Uncontrolled, controlled, locked mode |
| `/components/progress-bar` | Determinate, indeterminate, sizes, description, custom max, animated, custom colors |
| `/components/skeleton` | Basic shapes, card loading, table row loading |
| `/components/tooltip` | Basic, sides, placement |

**Navigation**

| Route | Content |
|-------|---------|
| `/components/breadcrumb` | Default, custom separator, asChild routing |
| `/components/pagination` | Default, compact, sibling count |
| `/components/stepper` | Horizontal, vertical, interactive, minimal, all-completed |
| `/components/tabs` | Underline, pill, overflow collapse, badges |

**Forms**

| Route | Content |
|-------|---------|
| `/components/checkbox` | Sizes, states, controlled, FormField |
| `/components/combobox` | Sizes, states, search, controlled, FormField |
| `/components/form-field` | Label, helper text, error |
| `/components/input` | Sizes and states |
| `/components/multi-select` | Pre-selected, overflow, sizes, states, FormField |
| `/components/radio-group` | Sizes, states, controlled, FormField |
| `/components/select` | Sizes, states, controlled, FormField |
| `/components/slider` | Sizes, tooltip, range, custom step, states, FormField |
| `/components/switch` | Sizes, disabled, controlled, FormField |
| `/components/textarea` | Default, error, disabled |

Theme switcher in the sticky header toggles light/dark. Responsive layout with mobile drawer navigation (below `lg` breakpoint) and fixed desktop sidebar (`lg+`).

### Motion Sensitivity

All animated components respect `prefers-reduced-motion: reduce` via Tailwind's `motion-reduce:` variant:
- **Continuous animations** (pulse, chase): Disabled entirely with `motion-reduce:animate-none` (Skeleton, StatusDot healthy pulse, Button loading chase, ProgressBar indeterminate)
- **One-shot transitions** (clip-path, transform): Disabled with `motion-reduce:transition-none` (Checkbox, RadioGroup, Switch, Tooltip, Table sort chevron)
