# Monorepo + Preview Restructure Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Restructure the repo into a pnpm monorepo (`packages/ds` + `apps/preview`) and replace the flat tab navigation with a sidebar + route-per-page preview app.

**Architecture:** pnpm workspaces with source-level exports (no build step). DS package exposes `.tsx` files via subpath exports. Preview app imports DS as `@aleph-front/ds/*` and uses Next.js App Router file-based routing with a sidebar layout.

**Tech Stack:** pnpm workspaces, Next.js 16, TypeScript 5.9, Tailwind CSS 4, Vitest

**Design doc:** `docs/plans/2026-02-27-monorepo-preview-restructure-design.md`

---

### Task 1: Create monorepo scaffold

Create the workspace config files and directory structure. No files are moved yet — this is scaffolding only.

**Files:**
- Create: `pnpm-workspace.yaml`
- Create: `tsconfig.base.json`
- Create: `packages/ds/package.json`
- Create: `packages/ds/tsconfig.json`
- Create: `packages/ds/vitest.config.ts`
- Create: `packages/ds/vitest.setup.ts`
- Create: `apps/preview/package.json`
- Create: `apps/preview/tsconfig.json`
- Create: `apps/preview/next.config.ts`
- Create: `apps/preview/postcss.config.mjs`
- Modify: `package.json` (root — strip to workspace root scripts only)

**Step 1: Create `pnpm-workspace.yaml`**

```yaml
packages:
  - "packages/*"
  - "apps/*"
```

**Step 2: Create `tsconfig.base.json`**

Extract the shared compiler options from the current `tsconfig.json`. Do NOT include `paths`, `include`, `exclude`, or Next.js plugin — those are per-workspace.

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["DOM", "DOM.Iterable", "ES2022"],
    "module": "esnext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "verbatimModuleSyntax": true,
    "isolatedModules": true,
    "skipLibCheck": true,
    "noEmit": true,
    "allowJs": true,
    "esModuleInterop": true,
    "resolveJsonModule": true
  }
}
```

**Step 3: Create `packages/ds/package.json`**

```json
{
  "name": "@aleph-front/ds",
  "version": "0.0.0",
  "type": "module",
  "license": "MIT",
  "exports": {
    "./button": "./src/components/button/button.tsx",
    "./input": "./src/components/input/input.tsx",
    "./textarea": "./src/components/textarea/textarea.tsx",
    "./form-field": "./src/components/form-field/form-field.tsx",
    "./ui/spinner": "./src/components/ui/spinner.tsx",
    "./lib/cn": "./src/lib/cn.ts",
    "./styles/tokens.css": "./src/styles/tokens.css"
  },
  "scripts": {
    "lint": "oxlint --import-plugin src/",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "check": "pnpm lint && pnpm typecheck && pnpm test"
  },
  "peerDependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "dependencies": {
    "class-variance-authority": "0.7.1",
    "clsx": "2.1.1",
    "tailwind-merge": "3.5.0"
  },
  "devDependencies": {
    "@testing-library/react": "16.3.2",
    "@types/jsdom": "28.0.0",
    "@types/react": "19.2.14",
    "@types/react-dom": "19.2.3",
    "@vitejs/plugin-react": "5.1.4",
    "jsdom": "28.1.0",
    "oxlint": "1.50.0",
    "react": "19.2.4",
    "react-dom": "19.2.4",
    "typescript": "5.9.3",
    "vitest": "4.0.18"
  }
}
```

Note: `react` and `react-dom` appear in both `peerDependencies` (for consumers) and `devDependencies` (for running tests locally).

**Step 4: Create `packages/ds/tsconfig.json`**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "paths": {
      "@ac/*": ["./src/*"]
    }
  },
  "include": ["src/**/*"]
}
```

**Step 5: Create `packages/ds/vitest.config.ts`**

```typescript
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@ac": resolve(import.meta.dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
  },
});
```

**Step 6: Create `packages/ds/vitest.setup.ts`**

```typescript
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => {
  cleanup();
});
```

**Step 7: Create `apps/preview/package.json`**

```json
{
  "name": "@aleph-front/preview",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "lint": "oxlint --import-plugin src/",
    "typecheck": "tsc --noEmit",
    "check": "pnpm lint && pnpm typecheck"
  },
  "dependencies": {
    "@aleph-front/ds": "workspace:*",
    "next": "16.1.6",
    "react": "19.2.4",
    "react-dom": "19.2.4"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "4.2.1",
    "@types/react": "19.2.14",
    "@types/react-dom": "19.2.3",
    "oxlint": "1.50.0",
    "tailwindcss": "4.2.1",
    "typescript": "5.9.3"
  }
}
```

**Step 8: Create `apps/preview/tsconfig.json`**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "incremental": true,
    "plugins": [
      { "name": "next" }
    ],
    "paths": {
      "@preview/*": ["./src/*"]
    }
  },
  "include": [
    "src/**/*",
    "next-env.d.ts",
    "next.config.ts",
    "postcss.config.mjs",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts"
  ],
  "exclude": ["node_modules"]
}
```

**Step 9: Create `apps/preview/next.config.ts`**

```typescript
import type { NextConfig } from "next";

const config: NextConfig = {
  output: "export",
  transpilePackages: ["@aleph-front/ds"],
};

export default config;
```

Note: `transpilePackages` tells Next.js to compile the DS source files through its own pipeline (required since we export raw `.tsx`).

**Step 10: Create `apps/preview/postcss.config.mjs`**

```javascript
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

**Step 11: Rewrite root `package.json`**

Replace the current root `package.json` with workspace root scripts:

```json
{
  "name": "aleph-cloud-ds",
  "private": true,
  "type": "module",
  "packageManager": "pnpm@10.29.2",
  "scripts": {
    "dev": "pnpm --filter @aleph-front/preview dev",
    "build": "pnpm --filter @aleph-front/preview build",
    "test": "pnpm --filter @aleph-front/ds test",
    "lint": "pnpm -r lint",
    "typecheck": "pnpm -r typecheck",
    "check": "pnpm -r check"
  }
}
```

**Step 12: Commit**

```bash
git add pnpm-workspace.yaml tsconfig.base.json packages/ apps/ package.json
git commit -m "feat: scaffold monorepo with pnpm workspaces"
```

---

### Task 2: Move DS source files into `packages/ds`

Move all design system source files (components, styles, lib) from `src/` into `packages/ds/src/`. No content changes — only file moves.

**Files:**
- Move: `src/components/button/` → `packages/ds/src/components/button/`
- Move: `src/components/input/` → `packages/ds/src/components/input/`
- Move: `src/components/textarea/` → `packages/ds/src/components/textarea/`
- Move: `src/components/form-field/` → `packages/ds/src/components/form-field/`
- Move: `src/components/ui/` → `packages/ds/src/components/ui/`
- Move: `src/styles/tokens.css` → `packages/ds/src/styles/tokens.css`
- Move: `src/lib/cn.ts` → `packages/ds/src/lib/cn.ts`

**Step 1: Move files**

```bash
mkdir -p packages/ds/src/components packages/ds/src/styles packages/ds/src/lib
mv src/components/button packages/ds/src/components/
mv src/components/input packages/ds/src/components/
mv src/components/textarea packages/ds/src/components/
mv src/components/form-field packages/ds/src/components/
mv src/components/ui packages/ds/src/components/
mv src/styles/tokens.css packages/ds/src/styles/
mv src/lib/cn.ts packages/ds/src/lib/
```

**Step 2: Run DS tests to verify nothing broke**

```bash
cd packages/ds && pnpm install && pnpm test
```

Expected: All tests pass. The `@ac/*` alias still resolves because `packages/ds/tsconfig.json` and `packages/ds/vitest.config.ts` define it relative to `packages/ds/`.

**Step 3: Run DS typecheck**

```bash
cd packages/ds && pnpm typecheck
```

Expected: No errors.

**Step 4: Commit**

```bash
git add packages/ds/src/ src/
git commit -m "refactor: move DS source files to packages/ds"
```

---

### Task 3: Create preview app shell (layout + sidebar + theme switcher)

Build the preview app's root layout with sidebar navigation and theme switcher. This is the skeleton that all pages render inside.

**Files:**
- Create: `apps/preview/src/app/globals.css`
- Create: `apps/preview/src/app/layout.tsx`
- Create: `apps/preview/src/components/sidebar.tsx`
- Create: `apps/preview/src/components/theme-switcher.tsx`
- Create: `apps/preview/src/components/page-header.tsx`
- Create: `apps/preview/src/components/demo-section.tsx`

**Step 1: Create `apps/preview/src/app/globals.css`**

```css
@import "tailwindcss";
@import "@aleph-front/ds/styles/tokens.css";

@source "../../src/**/*.{ts,tsx}";
@source "../../../packages/ds/src/**/*.{ts,tsx}";

@custom-variant dark (&:where(.theme-dark, .theme-dark *));

html {
  font-family: var(--font-sans);
  background-color: var(--background);
  color: var(--foreground);
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
  font-weight: 800;
  font-style: italic;
}
```

Note the two `@source` directives: one for preview app classes, one for DS component classes. The token CSS import uses the package's subpath export. If PostCSS can't resolve the package export for CSS `@import`, use the relative path instead: `@import "../../../packages/ds/src/styles/tokens.css";`

**Step 2: Create `apps/preview/src/components/theme-switcher.tsx`**

Copy from current `src/components/theme-switcher.tsx` — no import changes needed (it has no DS imports).

```tsx
"use client";

import { useCallback, useEffect, useState } from "react";

export function ThemeSwitcher() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("theme-dark"));
  }, []);

  const toggle = useCallback(() => {
    document.documentElement.classList.toggle("theme-dark");
    setDark((prev) => !prev);
  }, []);

  return (
    <button
      onClick={toggle}
      className="rounded-md border border-edge px-3 py-1.5 text-sm
                 hover:border-edge-hover transition-colors"
      style={{ transitionDuration: "var(--duration-fast)" }}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
    >
      {dark ? "Light" : "Dark"}
    </button>
  );
}
```

**Step 3: Create `apps/preview/src/components/sidebar.tsx`**

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = { label: string; href: string };
type NavSection = { section: string; items: NavItem[] };
type NavEntry = NavItem | NavSection;

const NAV: NavEntry[] = [
  { label: "Overview", href: "/" },
  {
    section: "Foundations",
    items: [
      { label: "Colors", href: "/foundations/colors" },
      { label: "Typography", href: "/foundations/typography" },
      { label: "Spacing", href: "/foundations/spacing" },
      { label: "Effects", href: "/foundations/effects" },
      { label: "Icons", href: "/foundations/icons" },
    ],
  },
  {
    section: "Components",
    items: [
      { label: "Button", href: "/components/button" },
      { label: "Input", href: "/components/input" },
      { label: "Textarea", href: "/components/textarea" },
      { label: "FormField", href: "/components/form-field" },
    ],
  },
];

function isSection(entry: NavEntry): entry is NavSection {
  return "section" in entry;
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="w-60 shrink-0 border-r border-edge overflow-y-auto py-6 px-4">
      {NAV.map((entry) => {
        if (isSection(entry)) {
          return (
            <div key={entry.section} className="mb-6">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 px-2">
                {entry.section}
              </p>
              <ul className="space-y-0.5">
                {entry.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`block rounded-md px-2 py-1.5 text-sm transition-colors ${
                        pathname === item.href
                          ? "bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200 font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                      style={{ transitionDuration: "var(--duration-fast)" }}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        }
        return (
          <Link
            key={entry.href}
            href={entry.href}
            className={`block rounded-md px-2 py-1.5 text-sm mb-4 transition-colors ${
              pathname === entry.href
                ? "bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200 font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
            style={{ transitionDuration: "var(--duration-fast)" }}
          >
            {entry.label}
          </Link>
        );
      })}
    </nav>
  );
}
```

**Step 4: Create `apps/preview/src/components/page-header.tsx`**

```tsx
type PageHeaderProps = {
  title: string;
  description: string;
};

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="mb-10">
      <h2 className="text-3xl font-heading font-extrabold italic mb-2">
        {title}
      </h2>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
```

**Step 5: Create `apps/preview/src/components/demo-section.tsx`**

```tsx
type DemoSectionProps = {
  title: string;
  children: React.ReactNode;
};

export function DemoSection({ title, children }: DemoSectionProps) {
  return (
    <section className="mb-10">
      <h3 className="text-lg font-bold mb-4">{title}</h3>
      {children}
    </section>
  );
}
```

**Step 6: Create `apps/preview/src/app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { Sidebar } from "@preview/components/sidebar";
import { ThemeSwitcher } from "@preview/components/theme-switcher";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aleph Cloud Design System",
  description: "Token preview for @aleph-front/ds",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/acb7qvn.css" />
        <link
          href="https://fonts.googleapis.com/css2?family=Titillium+Web:ital,wght@0,400;0,700;1,400&family=Source+Code+Pro:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-background text-foreground">
        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-10 flex items-center justify-between
                             bg-background/80 backdrop-blur-sm px-6 py-4
                             border-b border-edge">
            <h1 className="text-2xl font-heading font-extrabold italic">
              Aleph Cloud DS
            </h1>
            <ThemeSwitcher />
          </header>
          <div className="flex flex-1">
            <Sidebar />
            <main className="flex-1 overflow-y-auto px-8 py-8">
              <div className="mx-auto max-w-4xl">
                {children}
              </div>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
```

**Step 7: Commit**

```bash
git add apps/preview/src/
git commit -m "feat: add preview app shell with sidebar layout"
```

---

### Task 4: Create foundation pages

Convert the current tab components into individual route pages. Each page uses `PageHeader` + `DemoSection` and imports DS tokens via CSS variables (no DS component imports needed — foundations display tokens, not components).

**Files:**
- Create: `apps/preview/src/app/foundations/colors/page.tsx`
- Create: `apps/preview/src/app/foundations/typography/page.tsx`
- Create: `apps/preview/src/app/foundations/spacing/page.tsx`
- Create: `apps/preview/src/app/foundations/effects/page.tsx`
- Create: `apps/preview/src/app/foundations/icons/page.tsx`

**Step 1: Create colors page**

Adapt `src/components/tabs/colors-tab.tsx` content. Replace the top-level component with a default export page. Add `PageHeader`. Keep the `ScaleRow`, `Swatch`, and `SwatchRow` helpers as local functions in the same file.

```tsx
// apps/preview/src/app/foundations/colors/page.tsx
import { PageHeader } from "@preview/components/page-header";

// Keep ScaleRow, Swatch, SwatchRow as local helpers (same code as colors-tab.tsx)
// Replace `export function ColorsTab()` with:

export default function ColorsPage() {
  return (
    <>
      <PageHeader
        title="Colors"
        description="OKLCH color scales (50–950) and semantic theme-aware tokens."
      />
      {/* Same content as ColorsTab, using ScaleRow and SwatchRow */}
    </>
  );
}
```

**Step 2: Create typography page**

Same pattern. Adapt `typography-tab.tsx` into a page with `PageHeader`.

**Step 3: Create spacing page**

Same pattern. Adapt `spacing-tab.tsx`.

**Step 4: Create effects page**

Same pattern. Adapt `effects-tab.tsx`.

**Step 5: Create icons page**

Same pattern. Adapt `icons-tab.tsx`.

**Step 6: Install dependencies and verify dev server**

```bash
cd apps/preview && pnpm install
cd ../.. && pnpm dev
```

Navigate to `http://localhost:3000/foundations/colors` and verify the color scales render. Check each foundation route.

**Step 7: Commit**

```bash
git add apps/preview/src/app/foundations/
git commit -m "feat: add foundation pages (colors, typography, spacing, effects, icons)"
```

---

### Task 5: Create component pages

Split the current monolithic `components-tab.tsx` into one page per component. Each page imports from `@aleph-front/ds/*`.

**Files:**
- Create: `apps/preview/src/app/components/button/page.tsx`
- Create: `apps/preview/src/app/components/input/page.tsx`
- Create: `apps/preview/src/app/components/textarea/page.tsx`
- Create: `apps/preview/src/app/components/form-field/page.tsx`

**Step 1: Create button page**

```tsx
// apps/preview/src/app/components/button/page.tsx
import { Button } from "@aleph-front/ds/button";
import { PageHeader } from "@preview/components/page-header";
import { DemoSection } from "@preview/components/demo-section";

const variants = ["primary", "secondary", "outline", "text", "destructive", "warning"] as const;
const sizes = ["xs", "sm", "md", "lg"] as const;

// Keep PlaceholderIcon as a local helper

export default function ButtonPage() {
  return (
    <>
      <PageHeader
        title="Button"
        description="6 variants, 4 sizes, icon slots, loading/disabled states, and asChild polymorphism."
      />
      <DemoSection title="Variants">
        <div className="flex flex-wrap items-center gap-3">
          {variants.map((v) => (
            <Button key={v} variant={v}>
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </Button>
          ))}
        </div>
      </DemoSection>
      {/* Sizes, With Icons, Loading, Disabled, As Link sections — same content as components-tab.tsx */}
    </>
  );
}
```

**Step 2: Create input page**

```tsx
// apps/preview/src/app/components/input/page.tsx
import { Input } from "@aleph-front/ds/input";
import { PageHeader } from "@preview/components/page-header";
import { DemoSection } from "@preview/components/demo-section";

export default function InputPage() {
  return (
    <>
      <PageHeader
        title="Input"
        description="Text input with 2 sizes, error and disabled states."
      />
      <DemoSection title="Sizes">
        {/* Input Sizes content from components-tab.tsx */}
      </DemoSection>
      <DemoSection title="States">
        {/* Input States content from components-tab.tsx */}
      </DemoSection>
    </>
  );
}
```

**Step 3: Create textarea page**

Same pattern with `@aleph-front/ds/textarea`.

**Step 4: Create form-field page**

Same pattern with `@aleph-front/ds/form-field` and `@aleph-front/ds/input` + `@aleph-front/ds/textarea`.

**Step 5: Verify all component pages render**

```bash
pnpm dev
```

Navigate to `/components/button`, `/components/input`, `/components/textarea`, `/components/form-field`. Verify each renders correctly in both light and dark themes.

**Step 6: Commit**

```bash
git add apps/preview/src/app/components/
git commit -m "feat: add component pages (button, input, textarea, form-field)"
```

---

### Task 6: Create overview landing page

Build the overview page that serves as the entry point (`/`).

**Files:**
- Create: `apps/preview/src/app/page.tsx`

**Step 1: Create overview page**

The overview should include:
- A brief description of the DS
- Quick-reference cards linking to foundation pages (color palette thumbnails, font specimens)
- Component list linking to each component page

Use `Link` from `next/link` for navigation. Keep it simple — this is a wayfinding page, not a showcase.

```tsx
// apps/preview/src/app/page.tsx
import Link from "next/link";
import { PageHeader } from "@preview/components/page-header";

const FOUNDATIONS = [
  { label: "Colors", href: "/foundations/colors", description: "OKLCH scales and semantic tokens" },
  { label: "Typography", href: "/foundations/typography", description: "Heading scale, body styles, font families" },
  { label: "Spacing", href: "/foundations/spacing", description: "Spacing scale, breakpoints, border radius" },
  { label: "Effects", href: "/foundations/effects", description: "Shadows, gradients, transitions" },
  { label: "Icons", href: "/foundations/icons", description: "Icon size tokens" },
];

const COMPONENTS = [
  { label: "Button", href: "/components/button", description: "6 variants, 4 sizes, icons, loading" },
  { label: "Input", href: "/components/input", description: "Text input with sizes and error state" },
  { label: "Textarea", href: "/components/textarea", description: "Multi-line input with resize" },
  { label: "FormField", href: "/components/form-field", description: "Label + input wrapper with accessibility" },
];

export default function OverviewPage() {
  return (
    <>
      <PageHeader
        title="Aleph Cloud DS"
        description="Tokens-first design system with OKLCH color scales, semantic theming, and accessible components."
      />
      {/* Render FOUNDATIONS and COMPONENTS as card grids linking to their pages */}
    </>
  );
}
```

**Step 2: Verify**

```bash
pnpm dev
```

Navigate to `/`. Verify links work and navigate to the correct pages.

**Step 3: Commit**

```bash
git add apps/preview/src/app/page.tsx
git commit -m "feat: add overview landing page"
```

---

### Task 7: Clean up old files and verify

Remove the old single-package structure. Delete files that have been moved or replaced. Verify everything still works.

**Files:**
- Delete: `src/` directory (all contents moved to `packages/ds/` or `apps/preview/`)
- Delete: `next.config.ts` (replaced by `apps/preview/next.config.ts`)
- Delete: `postcss.config.mjs` (replaced by `apps/preview/postcss.config.mjs`)
- Delete: `vitest.config.ts` (replaced by `packages/ds/vitest.config.ts`)
- Delete: `vitest.setup.ts` (replaced by `packages/ds/vitest.setup.ts`)
- Delete: `tsconfig.json` (replaced by `tsconfig.base.json` + per-workspace configs)

**Step 1: Delete old files**

```bash
rm -rf src/
rm next.config.ts postcss.config.mjs vitest.config.ts vitest.setup.ts tsconfig.json
```

**Step 2: Install workspace dependencies**

```bash
pnpm install
```

**Step 3: Run full check from root**

```bash
pnpm check
```

Expected: lint + typecheck + test all pass across both workspaces.

**Step 4: Run dev server and verify**

```bash
pnpm dev
```

Navigate through all pages. Verify:
- Overview page loads at `/`
- All foundation pages render correctly
- All component pages render correctly
- Sidebar highlights the active route
- Theme switching works on every page
- Static export works: `pnpm build` completes without errors

**Step 5: Commit**

```bash
git add -A
git commit -m "refactor: remove old single-package structure"
```

---

### Task 8: Update docs

- [ ] DESIGN-SYSTEM.md — update import paths to `@aleph-front/ds/*`, update preview app section to describe sidebar + routes instead of tabs
- [ ] ARCHITECTURE.md — update project structure diagram, add monorepo workspace pattern, update import alias section, update "Adding a New Component" recipe
- [ ] DECISIONS.md — log monorepo decision, source exports decision, deep imports decision, sidebar over tabs decision
- [ ] BACKLOG.md — move "Package publishing" closer to ready (monorepo enables it), add any deferred items discovered during implementation
- [ ] CLAUDE.md — update Key Directories, Commands (paths changed), Current Features (sidebar + routes)

**Commit:**

```bash
git add docs/ CLAUDE.md
git commit -m "docs: update all docs for monorepo restructure"
```
