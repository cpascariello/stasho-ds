# Bootstrap Aleph Cloud Design System

## Context

Aleph Cloud needs a new design system to replace `@aleph-front/core` (styled-components, 162+ npm versions, heavy peer deps). The new DS follows the architecture proven in the `data-terminal` project: Next.js preview app + Tailwind CSS 4 + CSS custom properties + OKLCH colors.

This first version is **tokens + preview only** — no components yet.

## Naming

| Name | Value |
|------|-------|
| Folder | `aleph-cloud-ds` |
| Package | `@aleph-front/ds` |
| Path alias | `@ac/*` |
| License | ISC (matching `@aleph-front/core`) |

## Token Architecture: Tailwind-First

All default Tailwind classes work out of the box. We add three layers:

### Layer 1: Brand Colors (`@theme` block)

Colors that don't exist in Tailwind's default palette:

| Token | Hex | OKLCH | Source |
|-------|-----|-------|--------|
| `brand` | `#5100CD` | `oklch(0.372 0.254 285.48)` | front-core `main0` |
| `brand-lime` | `#D4FF00` | `oklch(0.929 0.228 121.30)` | front-core `main1` |

### Layer 2: Semantic Tokens (CSS custom properties, per theme)

These swap when `.theme-light` / `.theme-dark` is toggled on `<html>`.

| Token | Light value | Dark value | Purpose |
|-------|------------|------------|---------|
| `--background` | `#F9F4FF` (violet-50-ish) | `#141421` | Page background |
| `--foreground` | `#141421` | `#F9F4FF` | Primary text |
| `--primary` | brand | brand (lighter) | Interactive elements |
| `--primary-foreground` | white | white | Text on primary |
| `--accent` | brand-lime | brand-lime | Highlights |
| `--accent-foreground` | `#141421` | `#141421` | Text on accent |
| `--muted` | purple-50/purple-100 range | dark surface | Subdued backgrounds |
| `--muted-foreground` | gray-500 range | gray-400 range | Subdued text |
| `--card` | white | dark surface | Card backgrounds |
| `--card-foreground` | `#141421` | `#F9F4FF` | Card text |
| `--border` | purple-200 range | dark border | Borders |
| `--border-hover` | purple-300 range | lighter border | Hover borders |
| `--success` | `#36D846` | `#36D846` | Success state |
| `--warning` | `#FBAE18` | `#FBAE18` | Warning state |
| `--error` | `#DE3668` | `#DE3668` | Error state |

### Layer 3: Tailwind `@theme inline` mapping

Maps semantic CSS custom properties to Tailwind's color system so `bg-background`, `text-primary`, etc. work as utility classes.

## Typography

From front-core Twentysix theme. Three font families:

| Tailwind class | Font | Source | Use |
|---------------|------|--------|-----|
| `font-heading` | rigid-square (Adobe Typekit) | front-core `font.family.head` | Headings, italic 800 weight |
| `font-sans` | Titillium Web (Google Fonts) | front-core `font.family.body` | Body text |
| `font-mono` | Source Code Pro (Google Fonts) | front-core `font.family.code` | Code blocks |

### Heading Scale (from front-core `typo`)

| Style | Size | Weight | Style | Line height |
|-------|------|--------|-------|-------------|
| h1 | 72px (4.5rem) | 800 | italic | normal |
| h2 | 64px (4rem) | 800 | italic | normal |
| h3 | 48px (3rem) | 800 | italic | normal |
| h4 | 40px (2.5rem) | 800 | italic | normal |
| h5 | 36px (2.25rem) | 800 | italic | normal |
| h6 | 32px (2rem) | 800 | italic | normal |
| h7 | 24px (1.5rem) | 800 | italic | normal |
| header | 128px (8rem) | 800 | italic | normal |

### Body Styles

| Style | Family | Weight | Style | Size | Line height |
|-------|--------|--------|-------|------|-------------|
| body | Titillium Web | 400 | normal | 16px | 1.6 |
| body-bold | Titillium Web | 700 | normal | 16px | 1.6 |
| body-italic | Titillium Web | 400 | italic | 16px | 1.6 |
| code | Source Code Pro | 400 | normal | 16px | 1.6 |

## Gradients

From front-core Twentysix theme:

| Name | CSS | Purpose |
|------|-----|---------|
| `main` | `linear-gradient(90deg, #141421 8.24%, #5100CD 71.81%)` | Primary gradient |
| `lime` | `linear-gradient(90deg, #D6FF00 27.88%, #F5F7DB 100%)` | Accent gradient |
| `success` | `linear-gradient(90deg, #36D846 0%, #63E570 100%)` | Success |
| `warning` | `linear-gradient(90deg, #FFE814 0%, #FBAE18 100%)` | Warning |
| `error` | `linear-gradient(90deg, #FFAC89 0%, #DE3668 90.62%)` | Error |
| `info` | `linear-gradient(90deg, #C8ADF0 22.66%, #5100CD 244.27%)` | Info |

## Shadows

From front-core:

| Name | Value | Purpose |
|------|-------|---------|
| `brand-sm` | `0px 4px 4px #5100cd26` | Subtle brand shadow |
| `brand` | `0px 4px 24px #5100cd26` | Default brand shadow |
| `brand-lg` | `0px 4px 24px #5100cd73` | Strong brand shadow |

## Transitions

| Name | Duration |
|------|----------|
| `--duration-fast` | 200ms |
| `--duration-normal` | 500ms |
| `--duration-slow` | 700ms |
| `--timing` | ease-in-out |

## Breakpoints

Use Tailwind defaults (sm: 640px, md: 768px, lg: 1024px, xl: 1280px, 2xl: 1536px). Front-core's custom breakpoints (576, 992, 1200, 1400) are close enough that Tailwind defaults are fine.

## Icon Sizes

| Name | Size |
|------|------|
| `2xl` | 36px |
| `xl` | 24px |
| `lg` | 16px |
| `md` | 14px |
| `sm` | 12px |
| `xs` | 8px |

## Preview App

Next.js 16 App Router, static export. 5 tabs:

1. **Colors** — brand swatches, semantic tokens (light vs dark), status colors
2. **Typography** — font specimens, heading scale, body styles
3. **Spacing & Layout** — Tailwind spacing scale, breakpoints, border radius
4. **Shadows & Effects** — shadow tokens, gradient swatches
5. **Icons** — icon size tokens (placeholder)

Theme switcher (light/dark) in sticky header. Hash-based tab routing.

## Tech Stack

- Next.js 16 (App Router, `output: "export"`)
- React 19
- TypeScript 5.9 (strict)
- Tailwind CSS 4 + `@tailwindcss/postcss`
- oxlint (typescript, import, unicorn plugins)
- vitest
- pnpm

## Logo

Placeholder for 4 variants (added later):
- Icon only (light)
- Icon only (dark)
- Icon + wordlogo (light)
- Icon + wordlogo (dark)

## Documentation

| File | Content |
|------|---------|
| `CLAUDE.md` | Project context, commands, token inventory, working habits |
| `docs/ARCHITECTURE.md` | Token architecture, theme system, recipes |
| `docs/DESIGN-SYSTEM.md` | Token API reference, usage examples |
| `docs/DECISIONS.md` | Decision log |
| `docs/BACKLOG.md` | Scope parking lot |
