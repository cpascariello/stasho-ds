# Architecture

Technical patterns and decisions.

---

## Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router, static export) |
| Language | TypeScript 5.9 (strict) |
| Styling | Tailwind CSS 4 + CSS custom properties |
| Database | None |
| Deployment | Static export (`out/` directory) |

---

## Project Structure

```
src/
├── app/
│   ├── globals.css       # Tailwind + token imports
│   ├── layout.tsx        # Root layout with font loading
│   └── page.tsx          # Preview page
├── components/
│   ├── preview-tabs.tsx  # Tab navigation
│   ├── theme-switcher.tsx # Light/dark toggle
│   └── tabs/
│       ├── colors-tab.tsx
│       ├── typography-tab.tsx
│       ├── spacing-tab.tsx
│       ├── effects-tab.tsx
│       └── icons-tab.tsx
└── styles/
    └── tokens.css        # Three-layer token system
docs/
├── plans/                # Design + implementation plans
├── ARCHITECTURE.md
├── DECISIONS.md
└── BACKLOG.md
```

---

## Patterns

### Three-Layer Token Architecture

**Context:** Need design tokens that work with Tailwind utilities AND support theming.

**Approach:** Layer 1 (`@theme`) defines raw brand values. Layer 2 (`:root`/`.theme-dark`) defines semantic tokens as CSS custom properties. Layer 3 (`@theme inline`) maps semantic tokens to Tailwind's color system.

**Key files:** `src/styles/tokens.css`

**Notes:** `@theme inline` tells Tailwind to resolve at runtime (not compile time), enabling theme switching.

### Theme Switching

**Context:** Support light/dark themes without JS-based CSS-in-JS.

**Approach:** Toggle `.theme-dark` class on `<html>` element. CSS custom properties in `:root` vs `.theme-dark` swap automatically.

**Key files:** `src/styles/tokens.css`, `src/components/theme-switcher.tsx`

---

## Recipes

### Adding a New Semantic Token

1. Add light value to `:root` block in `src/styles/tokens.css`
2. Add dark value to `.theme-dark` block
3. Add Tailwind mapping in `@theme inline` block (e.g., `--color-new-token: var(--new-token)`)
4. Use as Tailwind class: `bg-new-token`, `text-new-token`, etc.
