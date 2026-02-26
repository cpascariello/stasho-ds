# Button Component Implementation Plan

> **For Claude:** REQUIRED SUB-SKILLS:
> - Use superpowers:executing-plans to implement this plan task-by-task.
> - Use superpowers:dispatching-parallel-agents for independent tasks (e.g., Tasks 3+6, Tasks 5+7 can run in parallel via isolated worktrees).

**Goal:** Build the first reusable component (Button) with OKLCH color scales, CVA variants, and preview app integration.

**Architecture:** CVA-based button with 6 variants, 4 sizes, icon slots, loading/disabled states, and asChild polymorphism. OKLCH color scales (50–950) replace bare semantic tokens. Tailwind class names, no CSS-in-JS.

**Tech Stack:** React 19, TypeScript 5.9, Tailwind CSS 4, CVA, clsx, tailwind-merge, vitest + @testing-library/react

**Design doc:** `docs/plans/2026-02-26-button-component-design.md`

---

### Task 1: Create feature branch

**Step 1: Create and switch to feature branch**

```bash
git checkout -b feature/button-component
```

**Step 2: Verify clean state**

```bash
git status
```

Expected: On branch feature/button-component, clean working tree.

---

### Task 2: Install dependencies and configure vitest

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`

**Step 1: Install runtime dependencies**

```bash
pnpm add class-variance-authority clsx tailwind-merge
```

**Step 2: Install dev dependencies**

```bash
pnpm add -D @testing-library/react @vitejs/plugin-react
```

**Step 3: Create vitest config**

Create `vitest.config.ts`:

```ts
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
  },
});
```

**Step 4: Verify existing tests still pass**

```bash
pnpm test
```

Expected: theme-switcher.test.ts passes.

**Step 5: Commit**

```bash
git add package.json pnpm-lock.yaml vitest.config.ts
git commit -m "chore: add CVA, tailwind-merge, and testing deps"
```

---

### Task 3: Create cn() utility

**Files:**
- Create: `src/lib/cn.ts`

**Step 1: Create the utility**

Create `src/lib/cn.ts`:

```ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```

**Step 2: Verify typecheck**

```bash
pnpm typecheck
```

Expected: No errors.

**Step 3: Commit**

```bash
git add src/lib/cn.ts
git commit -m "feat: add cn() class merge utility"
```

---

### Task 4: Rewrite tokens.css with OKLCH color scales

**Files:**
- Modify: `src/styles/tokens.css`

This is the largest task. Replace the entire file with OKLCH scales + updated semantic tokens.

**Step 1: Replace tokens.css**

Replace `src/styles/tokens.css` with:

```css
/* ──────────────────────────────────────────────
   Layer 1: Color Scales, Gradients, Shadows, Fonts
   ────────────────────────────────────────────── */
@theme {
  /* Primary (brand purple, H: 285.48) — 600 = brand #5100CD */
  --color-primary-50: oklch(0.97 0.012 285.48);
  --color-primary-100: oklch(0.93 0.040 285.48);
  --color-primary-200: oklch(0.87 0.080 285.48);
  --color-primary-300: oklch(0.77 0.140 285.48);
  --color-primary-400: oklch(0.64 0.210 285.48);
  --color-primary-500: oklch(0.50 0.254 285.48);
  --color-primary-600: oklch(0.372 0.254 285.48);
  --color-primary-700: oklch(0.31 0.224 285.48);
  --color-primary-800: oklch(0.25 0.174 285.48);
  --color-primary-900: oklch(0.20 0.114 285.48);
  --color-primary-950: oklch(0.15 0.064 285.48);

  /* Accent (brand lime, H: 121.30) — 300 = brand #D4FF00 */
  --color-accent-50: oklch(0.98 0.030 121.30);
  --color-accent-100: oklch(0.96 0.100 121.30);
  --color-accent-200: oklch(0.94 0.180 121.30);
  --color-accent-300: oklch(0.929 0.228 121.30);
  --color-accent-400: oklch(0.82 0.200 121.30);
  --color-accent-500: oklch(0.72 0.175 121.30);
  --color-accent-600: oklch(0.62 0.150 121.30);
  --color-accent-700: oklch(0.52 0.120 121.30);
  --color-accent-800: oklch(0.42 0.085 121.30);
  --color-accent-900: oklch(0.32 0.055 121.30);
  --color-accent-950: oklch(0.22 0.030 121.30);

  /* Success (green, H: 145) — 500 = #36D846 */
  --color-success-50: oklch(0.98 0.020 145);
  --color-success-100: oklch(0.94 0.050 145);
  --color-success-200: oklch(0.88 0.100 145);
  --color-success-300: oklch(0.81 0.160 145);
  --color-success-400: oklch(0.76 0.200 145);
  --color-success-500: oklch(0.72 0.230 145);
  --color-success-600: oklch(0.60 0.200 145);
  --color-success-700: oklch(0.50 0.170 145);
  --color-success-800: oklch(0.40 0.130 145);
  --color-success-900: oklch(0.30 0.085 145);
  --color-success-950: oklch(0.20 0.045 145);

  /* Warning (amber, H: 75) — 500 = #FBAE18 */
  --color-warning-50: oklch(0.98 0.020 75);
  --color-warning-100: oklch(0.95 0.050 75);
  --color-warning-200: oklch(0.90 0.100 75);
  --color-warning-300: oklch(0.86 0.140 75);
  --color-warning-400: oklch(0.83 0.165 75);
  --color-warning-500: oklch(0.80 0.180 75);
  --color-warning-600: oklch(0.70 0.165 75);
  --color-warning-700: oklch(0.60 0.140 75);
  --color-warning-800: oklch(0.48 0.110 75);
  --color-warning-900: oklch(0.35 0.075 75);
  --color-warning-950: oklch(0.24 0.045 75);

  /* Error (red, H: 12) — 600 = #DE3668 */
  --color-error-50: oklch(0.98 0.010 12);
  --color-error-100: oklch(0.93 0.040 12);
  --color-error-200: oklch(0.87 0.080 12);
  --color-error-300: oklch(0.79 0.130 12);
  --color-error-400: oklch(0.70 0.170 12);
  --color-error-500: oklch(0.63 0.200 12);
  --color-error-600: oklch(0.57 0.200 12);
  --color-error-700: oklch(0.48 0.175 12);
  --color-error-800: oklch(0.39 0.140 12);
  --color-error-900: oklch(0.30 0.095 12);
  --color-error-950: oklch(0.20 0.055 12);

  /* Neutral (gray with slight purple tint, H: 265) */
  --color-neutral-50: oklch(0.98 0.003 265);
  --color-neutral-100: oklch(0.94 0.006 265);
  --color-neutral-200: oklch(0.90 0.008 265);
  --color-neutral-300: oklch(0.83 0.012 265);
  --color-neutral-400: oklch(0.71 0.015 265);
  --color-neutral-500: oklch(0.55 0.015 265);
  --color-neutral-600: oklch(0.45 0.014 265);
  --color-neutral-700: oklch(0.37 0.012 265);
  --color-neutral-800: oklch(0.29 0.010 265);
  --color-neutral-900: oklch(0.21 0.008 265);
  --color-neutral-950: oklch(0.14 0.005 265);

  /* Gradients */
  --gradient-main: linear-gradient(90deg, #141421 8.24%, #5100CD 71.81%);
  --gradient-lime: linear-gradient(90deg, #D6FF00 27.88%, #F5F7DB 100%);
  --gradient-success: linear-gradient(90deg, #36D846 0%, #63E570 100%);
  --gradient-warning: linear-gradient(90deg, #FFE814 0%, #FBAE18 100%);
  --gradient-error: linear-gradient(90deg, #FFAC89 0%, #DE3668 90.62%);
  --gradient-info: linear-gradient(90deg, #C8ADF0 22.66%, #5100CD 244.27%);

  /* Shadows */
  --shadow-brand-sm: 0px 4px 4px oklch(0.372 0.254 285.48 / 0.15);
  --shadow-brand: 0px 4px 24px oklch(0.372 0.254 285.48 / 0.15);
  --shadow-brand-lg: 0px 4px 24px oklch(0.372 0.254 285.48 / 0.45);

  /* Fonts */
  --font-heading: "rigid-square", ui-sans-serif, system-ui, sans-serif;
  --font-sans: "Titillium Web", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "Source Code Pro", ui-monospace, monospace;
}

/* ──────────────────────────────────────────────
   Layer 2: Semantic Surface Tokens (theme-dependent)
   ────────────────────────────────────────────── */
:root {
  --background: #F9F4FF;
  --foreground: #141421;
  --primary: var(--color-primary-600);
  --primary-foreground: #ffffff;
  --accent: var(--color-accent-300);
  --accent-foreground: #141421;
  --muted: var(--color-primary-100);
  --muted-foreground: var(--color-neutral-500);
  --card: #ffffff;
  --card-foreground: #141421;
  --border: var(--color-primary-200);
  --border-hover: var(--color-primary-300);

  --duration-fast: 200ms;
  --duration-normal: 500ms;
  --duration-slow: 700ms;
  --timing: ease-in-out;
}

.theme-dark {
  --background: #141421;
  --foreground: #F9F4FF;
  --primary: var(--color-primary-400);
  --primary-foreground: #ffffff;
  --accent: var(--color-accent-300);
  --accent-foreground: #141421;
  --muted: var(--color-neutral-900);
  --muted-foreground: var(--color-neutral-400);
  --card: var(--color-neutral-900);
  --card-foreground: #F9F4FF;
  --border: var(--color-neutral-800);
  --border-hover: var(--color-neutral-700);
}

/* ──────────────────────────────────────────────
   Layer 3: Tailwind Bridge (semantic → utilities)
   ────────────────────────────────────────────── */
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-border: var(--border);
  --color-border-hover: var(--border-hover);
}
```

Notes:
- `--color-brand` and `--color-brand-lime` removed (replaced by `primary-600` and `accent-300`)
- `--color-success`, `--color-warning`, `--color-error` removed from Layer 3 (scales in Layer 1 give `bg-success-500` etc. directly)
- Semantic `--primary` now references `var(--color-primary-600)` in light, `var(--color-primary-400)` in dark
- OKLCH values are approximate — fine-tune visually after the dev server is running

**Step 2: Verify dev server compiles**

```bash
pnpm dev
```

Visit http://localhost:3000 — the page should load (colors may look slightly different due to scale values replacing hex values).

**Step 3: Commit**

```bash
git add src/styles/tokens.css
git commit -m "feat: add OKLCH color scales for all semantic colors"
```

---

### Task 5: Update preview app for new token names

**Files:**
- Modify: `src/components/tabs/colors-tab.tsx`

The colors tab references `bg-brand`, `bg-brand-lime`, `bg-primary`, `bg-accent`, `bg-success`, `bg-warning`, `bg-error` — some of these changed.

**Step 1: Update colors-tab.tsx**

Replace the entire `ColorsTab` export with:

```tsx
function Swatch({
  label,
  colorClass,
  textClass,
}: {
  label: string;
  colorClass: string;
  textClass: string;
}) {
  return (
    <div className={`rounded-lg p-4 ${colorClass}`}>
      <span className={`text-sm font-medium ${textClass}`}>{label}</span>
    </div>
  );
}

function SwatchRow({
  title,
  swatches,
}: {
  title: string;
  swatches: { label: string; colorClass: string; textClass: string }[];
}) {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold mb-3">{title}</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {swatches.map((s) => (
          <Swatch key={s.label} {...s} />
        ))}
      </div>
    </div>
  );
}

function ScaleRow({
  title,
  color,
}: {
  title: string;
  color: string;
}) {
  const stops = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold mb-3">{title}</h3>
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-11">
        {stops.map((stop) => (
          <div
            key={stop}
            className={`rounded-lg p-3 bg-${color}-${stop}`}
          >
            <span
              className={`text-xs font-medium ${stop >= 500 ? "text-white" : "text-black"}`}
            >
              {stop}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ColorsTab() {
  return (
    <div>
      <ScaleRow title="Primary" color="primary" />
      <ScaleRow title="Accent" color="accent" />
      <ScaleRow title="Success" color="success" />
      <ScaleRow title="Warning" color="warning" />
      <ScaleRow title="Error" color="error" />
      <ScaleRow title="Neutral" color="neutral" />

      <SwatchRow
        title="Semantic (theme-aware)"
        swatches={[
          {
            label: "background",
            colorClass: "bg-background border border-border",
            textClass: "text-foreground",
          },
          {
            label: "foreground",
            colorClass: "bg-foreground",
            textClass: "text-background",
          },
          {
            label: "primary",
            colorClass: "bg-primary",
            textClass: "text-primary-foreground",
          },
          {
            label: "accent",
            colorClass: "bg-accent",
            textClass: "text-accent-foreground",
          },
          {
            label: "muted",
            colorClass: "bg-muted",
            textClass: "text-muted-foreground",
          },
          {
            label: "card",
            colorClass: "bg-card border border-border",
            textClass: "text-card-foreground",
          },
        ]}
      />
      <SwatchRow
        title="Border"
        swatches={[
          {
            label: "border",
            colorClass: "border-2 border-border bg-background",
            textClass: "text-foreground",
          },
          {
            label: "border-hover",
            colorClass: "border-2 border-border-hover bg-background",
            textClass: "text-foreground",
          },
        ]}
      />
    </div>
  );
}
```

**Important:** The `ScaleRow` component uses dynamic class names like `` bg-${color}-${stop} ``. Tailwind CSS 4 purges classes at build time. Dynamic classes won't be detected. To fix this, add a safelist comment or use `style` instead.

Replace the `ScaleRow` implementation with inline styles that read the CSS variable:

```tsx
function ScaleRow({
  title,
  color,
}: {
  title: string;
  color: string;
}) {
  const stops = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold mb-3">{title}</h3>
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-11">
        {stops.map((stop) => (
          <div
            key={stop}
            className="rounded-lg p-3"
            style={{ backgroundColor: `var(--color-${color}-${stop})` }}
          >
            <span
              className={`text-xs font-medium ${stop >= 500 ? "text-white" : "text-black"}`}
            >
              {stop}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

**Step 2: Verify in browser**

```bash
pnpm dev
```

Visit http://localhost:3000 → Colors tab. Verify:
- 6 color scale rows (Primary through Neutral) with 11 swatches each
- Semantic swatches still show correct theme-aware colors
- Toggle dark mode — semantic swatches swap, scales stay the same

**Step 3: Commit**

```bash
git add src/components/tabs/colors-tab.tsx
git commit -m "feat: update colors tab for OKLCH scale display"
```

---

### Task 6: Create Spinner component

**Files:**
- Create: `src/components/ui/spinner.tsx`

**Step 1: Create the spinner**

Create `src/components/ui/spinner.tsx`:

```tsx
import { cn } from "@ac/lib/cn";

export function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn("animate-spin", className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}
```

**Step 2: Verify typecheck**

```bash
pnpm typecheck
```

Expected: No errors.

**Step 3: Commit**

```bash
git add src/components/ui/spinner.tsx
git commit -m "feat: add Spinner component"
```

---

### Task 7: Write Button tests (TDD — failing tests)

**Files:**
- Create: `src/components/button/button.test.tsx`

Write all tests first. They will fail because the Button component doesn't exist yet.

**Step 1: Create the test file**

Create `src/components/button/button.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "./button";

describe("Button", () => {
  describe("rendering", () => {
    it("renders a button element with children", () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole("button", { name: "Click me" })).toBeTruthy();
    });

    it("applies default variant and size classes", () => {
      render(<Button>Default</Button>);
      const button = screen.getByRole("button");
      expect(button.className).toContain("bg-primary-600");
      expect(button.className).toContain("h-9");
    });
  });

  describe("variants", () => {
    it("applies secondary variant classes", () => {
      render(<Button variant="secondary">Secondary</Button>);
      const button = screen.getByRole("button");
      expect(button.className).toContain("bg-primary-100");
      expect(button.className).toContain("text-primary-700");
    });

    it("applies outline variant classes", () => {
      render(<Button variant="outline">Outline</Button>);
      const button = screen.getByRole("button");
      expect(button.className).toContain("border");
      expect(button.className).toContain("border-neutral-300");
    });

    it("applies text variant classes", () => {
      render(<Button variant="text">Text</Button>);
      const button = screen.getByRole("button");
      expect(button.className).toContain("text-primary-600");
    });

    it("applies destructive variant classes", () => {
      render(<Button variant="destructive">Delete</Button>);
      const button = screen.getByRole("button");
      expect(button.className).toContain("bg-error-600");
    });

    it("applies warning variant classes", () => {
      render(<Button variant="warning">Careful</Button>);
      const button = screen.getByRole("button");
      expect(button.className).toContain("bg-warning-500");
      expect(button.className).toContain("text-warning-950");
    });
  });

  describe("sizes", () => {
    it("applies xs size", () => {
      render(<Button size="xs">XS</Button>);
      expect(screen.getByRole("button").className).toContain("h-7");
    });

    it("applies sm size", () => {
      render(<Button size="sm">SM</Button>);
      expect(screen.getByRole("button").className).toContain("h-8");
    });

    it("applies lg size", () => {
      render(<Button size="lg">LG</Button>);
      expect(screen.getByRole("button").className).toContain("h-10");
    });
  });

  describe("icons", () => {
    it("renders iconLeft before children", () => {
      render(
        <Button iconLeft={<svg data-testid="left-icon" />}>
          Label
        </Button>,
      );
      const button = screen.getByRole("button");
      const icon = screen.getByTestId("left-icon");
      expect(button.contains(icon)).toBe(true);
      const children = Array.from(button.children);
      const iconIndex = children.findIndex((c) => c.contains(icon));
      const labelIndex = children.findIndex(
        (c) => c.textContent === "Label",
      );
      expect(iconIndex).toBeLessThan(labelIndex);
    });

    it("renders iconRight after children", () => {
      render(
        <Button iconRight={<svg data-testid="right-icon" />}>
          Label
        </Button>,
      );
      const button = screen.getByRole("button");
      const icon = screen.getByTestId("right-icon");
      expect(button.contains(icon)).toBe(true);
      const children = Array.from(button.children);
      const iconIndex = children.findIndex((c) => c.contains(icon));
      const labelIndex = children.findIndex(
        (c) => c.textContent === "Label",
      );
      expect(iconIndex).toBeGreaterThan(labelIndex);
    });
  });

  describe("loading", () => {
    it("shows spinner when loading", () => {
      render(<Button loading>Loading</Button>);
      const button = screen.getByRole("button");
      const spinner = button.querySelector("svg.animate-spin");
      expect(spinner).toBeTruthy();
    });

    it("has aria-busy when loading", () => {
      render(<Button loading>Loading</Button>);
      expect(screen.getByRole("button").getAttribute("aria-busy")).toBe(
        "true",
      );
    });

    it("disables pointer events when loading", () => {
      render(<Button loading>Loading</Button>);
      expect(screen.getByRole("button").className).toContain(
        "pointer-events-none",
      );
    });

    it("hides icons when loading", () => {
      render(
        <Button
          loading
          iconLeft={<svg data-testid="left-icon" />}
          iconRight={<svg data-testid="right-icon" />}
        >
          Loading
        </Button>,
      );
      expect(screen.queryByTestId("left-icon")).toBeNull();
      expect(screen.queryByTestId("right-icon")).toBeNull();
    });
  });

  describe("disabled", () => {
    it("sets disabled attribute", () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole("button");
      expect((button as HTMLButtonElement).disabled).toBe(true);
    });
  });

  describe("asChild", () => {
    it("renders child element instead of button", () => {
      render(
        <Button asChild variant="primary">
          <a href="/test">Link</a>
        </Button>,
      );
      const link = screen.getByRole("link", { name: "Link" });
      expect(link).toBeTruthy();
      expect(link.tagName).toBe("A");
      expect(link.getAttribute("href")).toBe("/test");
      expect(link.className).toContain("bg-primary-600");
    });
  });

  describe("className merging", () => {
    it("merges custom className", () => {
      render(<Button className="custom-class">Merge</Button>);
      const button = screen.getByRole("button");
      expect(button.className).toContain("custom-class");
      expect(button.className).toContain("bg-primary-600");
    });
  });

  describe("prop forwarding", () => {
    it("forwards aria-label", () => {
      render(<Button aria-label="Close dialog">X</Button>);
      expect(
        screen.getByRole("button", { name: "Close dialog" }),
      ).toBeTruthy();
    });
  });
});
```

**Step 2: Run tests to verify they fail**

```bash
pnpm test
```

Expected: All Button tests FAIL (module not found). theme-switcher test still passes.

**Step 3: Commit failing tests**

```bash
git add src/components/button/button.test.tsx
git commit -m "test: add Button component tests (red)"
```

---

### Task 8: Implement Button component

**Files:**
- Create: `src/components/button/button.tsx`

**Step 1: Create the component**

Create `src/components/button/button.tsx`:

```tsx
import {
  cloneElement,
  forwardRef,
  isValidElement,
  type ButtonHTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@ac/lib/cn";
import { Spinner } from "@ac/components/ui/spinner";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center",
    "font-heading font-extrabold",
    "rounded-md transition-colors",
    "focus-visible:outline-none focus-visible:ring-2",
    "focus-visible:ring-primary-400 focus-visible:ring-offset-2",
    "disabled:pointer-events-none",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: [
          "bg-primary-600 text-white",
          "hover:bg-primary-700",
          "active:bg-primary-800",
          "disabled:bg-primary-600/50 disabled:text-white/50",
        ].join(" "),
        secondary: [
          "bg-primary-100 text-primary-700",
          "hover:bg-primary-200 hover:text-primary-800",
          "active:bg-primary-300 active:text-primary-800",
          "disabled:bg-primary-100/50 disabled:text-primary-700/50",
        ].join(" "),
        outline: [
          "border border-neutral-300 bg-transparent text-foreground",
          "hover:bg-neutral-50 hover:border-neutral-400",
          "active:bg-neutral-100 active:border-neutral-400",
          "disabled:bg-transparent disabled:text-foreground/50",
          "disabled:border-neutral-300/50",
        ].join(" "),
        text: [
          "bg-transparent text-primary-600",
          "hover:bg-primary-50 hover:text-primary-700",
          "active:bg-primary-100 active:text-primary-800",
          "disabled:bg-transparent disabled:text-primary-600/50",
        ].join(" "),
        destructive: [
          "bg-error-600 text-white",
          "hover:bg-error-700",
          "active:bg-error-800",
          "disabled:bg-error-600/50 disabled:text-white/50",
        ].join(" "),
        warning: [
          "bg-warning-500 text-warning-950",
          "hover:bg-warning-600",
          "active:bg-warning-700",
          "disabled:bg-warning-500/50 disabled:text-warning-950/50",
        ].join(" "),
      },
      size: {
        xs: "h-7 px-2 text-xs gap-1",
        sm: "h-8 px-3 text-sm gap-1.5",
        md: "h-9 px-4 text-sm gap-2",
        lg: "h-10 px-5 text-base gap-2",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

const iconSize = {
  xs: "size-3.5",
  sm: "size-4",
  md: "size-4",
  lg: "size-5",
} as const;

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    iconLeft?: ReactNode;
    iconRight?: ReactNode;
    loading?: boolean;
    asChild?: boolean;
  };

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant,
      size,
      iconLeft,
      iconRight,
      loading = false,
      disabled = false,
      asChild = false,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const sizeKey = size ?? "md";
    const classes = cn(
      buttonVariants({ variant, size }),
      loading && "pointer-events-none",
      className,
    );

    const iconClass = cn("shrink-0", iconSize[sizeKey], "[&>svg]:size-full");

    const content = (
      <>
        {loading ? (
          <Spinner className={cn("shrink-0", iconSize[sizeKey])} />
        ) : iconLeft ? (
          <span className={iconClass}>{iconLeft}</span>
        ) : null}
        <span>{children}</span>
        {!loading && iconRight ? (
          <span className={iconClass}>{iconRight}</span>
        ) : null}
      </>
    );

    if (asChild && isValidElement(children)) {
      return cloneElement(children as ReactElement<Record<string, unknown>>, {
        className: classes,
        ref,
        ...rest,
      });
    }

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled}
        aria-busy={loading || undefined}
        {...rest}
      >
        {content}
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants, type ButtonProps };
```

**Step 2: Run tests**

```bash
pnpm test
```

Expected: All tests pass.

**Step 3: Run typecheck and lint**

```bash
pnpm typecheck && pnpm lint
```

Expected: No errors.

**Step 4: Commit**

```bash
git add src/components/button/button.tsx
git commit -m "feat: implement Button component with CVA variants"
```

---

### Task 9: Add Components tab to preview app

**Files:**
- Create: `src/components/tabs/components-tab.tsx`
- Modify: `src/components/preview-tabs.tsx`

**Step 1: Create the Components tab**

Create `src/components/tabs/components-tab.tsx`:

```tsx
import { Button } from "@ac/components/button/button";

const variants = [
  "primary",
  "secondary",
  "outline",
  "text",
  "destructive",
  "warning",
] as const;

const sizes = ["xs", "sm", "md", "lg"] as const;

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-10">
      <h3 className="text-lg font-bold mb-4">{title}</h3>
      {children}
    </div>
  );
}

function PlaceholderIcon({ label }: { label: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <title>{label}</title>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4v16m8-8H4"
      />
    </svg>
  );
}

export function ComponentsTab() {
  return (
    <div>
      <Section title="Variants">
        <div className="flex flex-wrap items-center gap-3">
          {variants.map((v) => (
            <Button key={v} variant={v}>
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </Button>
          ))}
        </div>
      </Section>

      <Section title="Sizes">
        <div className="flex flex-wrap items-end gap-3">
          {sizes.map((s) => (
            <Button key={s} size={s}>
              Size {s}
            </Button>
          ))}
        </div>
      </Section>

      <Section title="With Icons">
        <div className="flex flex-wrap items-center gap-3">
          <Button iconLeft={<PlaceholderIcon label="Add" />}>
            Icon Left
          </Button>
          <Button iconRight={<PlaceholderIcon label="Arrow" />}>
            Icon Right
          </Button>
          <Button
            iconLeft={<PlaceholderIcon label="Add" />}
            iconRight={<PlaceholderIcon label="Arrow" />}
          >
            Both Icons
          </Button>
        </div>
      </Section>

      <Section title="Loading">
        <div className="flex flex-wrap items-center gap-3">
          {variants.map((v) => (
            <Button key={v} variant={v} loading>
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </Button>
          ))}
        </div>
      </Section>

      <Section title="Disabled">
        <div className="flex flex-wrap items-center gap-3">
          {variants.map((v) => (
            <Button key={v} variant={v} disabled>
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </Button>
          ))}
        </div>
      </Section>

      <Section title="As Link">
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild variant="primary">
            <a href="#demo">Primary Link</a>
          </Button>
          <Button asChild variant="text">
            <a href="#demo">Text Link</a>
          </Button>
        </div>
      </Section>
    </div>
  );
}
```

**Step 2: Add tab to preview-tabs.tsx**

In `src/components/preview-tabs.tsx`, add the import and update the TABS array:

Add import:
```tsx
import { ComponentsTab } from "@ac/components/tabs/components-tab";
```

Change TABS to:
```tsx
const TABS = ["Components", "Colors", "Typography", "Spacing", "Effects", "Icons"] as const;
```

Add case to `TabContent` switch:
```tsx
case "Components":
  return <ComponentsTab />;
```

**Step 3: Verify in browser**

```bash
pnpm dev
```

Visit http://localhost:3000 → Components tab. Verify:
- All 6 variants render with distinct styles
- All 4 sizes render from small to large
- Icons appear in correct positions
- Loading spinners animate
- Disabled buttons are grayed out
- Links render as `<a>` tags

**Step 4: Commit**

```bash
git add src/components/tabs/components-tab.tsx src/components/preview-tabs.tsx
git commit -m "feat: add Components tab with button showcase"
```

---

### Task 10: Run full verification

**Step 1: Run all checks**

```bash
pnpm check
```

This runs lint + typecheck + test. Expected: All pass with zero warnings.

**Step 2: Run production build**

```bash
pnpm build
```

Expected: Static export succeeds.

**Step 3: Fix any issues found**

If anything fails, fix it and commit the fix.

---

### Task 11: Update docs

**Files:**
- Modify: `docs/DESIGN-SYSTEM.md`
- Modify: `docs/ARCHITECTURE.md`
- Modify: `docs/BACKLOG.md`
- Modify: `CLAUDE.md`

**Step 1: Update DESIGN-SYSTEM.md**

Add Button section after the Patterns section. Include:
- Import and basic usage
- All variants with examples
- All sizes
- Icon usage
- Loading and disabled states
- asChild usage for links
- `buttonVariants` export for custom composition

Update Color Tokens section:
- Replace Brand Colors table with "Color Scales" section showing the 6 scales
- Note that each has 50–950 stops in OKLCH
- Show `/opacity` modifier example

Update Preview App section:
- Add Components tab to the table

**Step 2: Update ARCHITECTURE.md**

Add to Patterns section:
- CVA variant pattern (how buttonVariants works, how to add new variants)
- cn() utility pattern

Add to Project Structure:
- `src/components/button/` directory
- `src/components/ui/` directory
- `src/lib/` directory

**Step 3: Update BACKLOG.md**

Move "Component library" to Completed section (buttons are the first component — mark as started, not fully complete).

Add new item: "Icon animations for Button" (deferred from button design).

**Step 4: Update CLAUDE.md**

Update Current Features:
- Add "Button component with 6 variants, 4 sizes, CVA architecture"
- Add "OKLCH color scales (50–950) for primary, accent, success, warning, error, neutral"

**Step 5: Commit docs**

```bash
git add docs/DESIGN-SYSTEM.md docs/ARCHITECTURE.md docs/BACKLOG.md CLAUDE.md
git commit -m "docs: update docs for button component and color scales"
```
