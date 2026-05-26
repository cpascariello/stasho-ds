# Button Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reimagine the Button as an instrument-panel hardware control — cyan LED signature, beveled chassis, sentence-case Inter label, 0px corners. Drop `lg` size, rename `text` → `ghost`, add `success` variant.

**Architecture:** Single-file rewrite of `packages/ds/src/components/button/button.tsx` driven by an expanded CVA config (7 variants × 3 sizes). Add one `@keyframes button-led-pulse` block to `packages/ds/src/styles/tokens.css`. The LED is a sibling `<span data-led>` that renders when `!iconLeft && variant !== 'ghost'`. When `iconLeft` is provided on filled variants, the icon wrapper inherits the LED's cyan glow filter. Loading state pulses the LED (or icon-as-LED) — no Spinner swap, no separate loading element.

**Tech Stack:** TypeScript 5.9, React 19, CVA (`class-variance-authority`), Tailwind CSS 4 with arbitrary-value utilities, Vitest + Testing Library, Phosphor Icons.

**Spec:** [`docs/superpowers/specs/2026-05-26-button-redesign-design.md`](../specs/2026-05-26-button-redesign-design.md)
**Skin principles:** [`docs/SKIN-PRINCIPLES.md`](../../SKIN-PRINCIPLES.md)
**Integration branch:** chunk of `skin/paraplu`. PRs target `skin/paraplu`, **not** `main`.

---

### Task 1: Add `button-led-pulse` keyframe to tokens.css

**Files:**
- Modify: `packages/ds/src/styles/tokens.css` (append after the existing `ring-wave` keyframe block, near line 354)

- [ ] **Step 1: Append the keyframe block**

Open `packages/ds/src/styles/tokens.css`. Find the `@keyframes ring-wave` block (around line 351). After its closing `}`, append exactly this:

```css
/* ── Button LED pulse (loading state) ─────────── */

@keyframes button-led-pulse {
  0%, 100% {
    opacity: 0.4;
    box-shadow: 0 0 4px currentColor;
  }
  50% {
    opacity: 1;
    box-shadow: 0 0 14px currentColor, 0 0 24px color-mix(in oklch, currentColor 50%, transparent);
  }
}

.animate-button-led {
  animation: button-led-pulse 1.1s ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  .animate-button-led { animation: none; }
}
```

Notes:
- `currentColor` makes the same animation work whether the LED is cyan (primary/secondary), white (destructive), or dark (warning/success) — the box-shadow inherits the dot's text color.
- `color-mix(in oklch, currentColor 50%, transparent)` computes a half-opaque halo at the dot's color without needing a separate variable.
- Reduced-motion override is mandatory per Decision #39.

- [ ] **Step 2: Verify CSS still parses cleanly**

Run: `npm run lint`
Expected: PASS with no new warnings.

- [ ] **Step 3: Commit**

```bash
git add packages/ds/src/styles/tokens.css
git commit -m "feat(skin): add button-led-pulse keyframe for redesigned button loading state"
```

---

### Task 2: Replace button.test.tsx with the new contract (failing tests)

**Files:**
- Modify: `packages/ds/src/components/button/button.test.tsx` (complete replacement)

This task writes the *new* contract first. Tests will fail against the current `button.tsx` — that's expected and is the failing-test checkpoint.

- [ ] **Step 1: Replace the file contents in full**

Open `packages/ds/src/components/button/button.test.tsx` and replace its entire contents with:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "./button";

const filledLedVariants = [
  "primary",
  "secondary",
  "destructive",
  "warning",
  "success",
  "outline",
] as const;

describe("Button", () => {
  it("renders a button element with children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: "Click me" })).toBeTruthy();
  });

  describe("LED indicator", () => {
    it.each(filledLedVariants)("renders LED on %s variant by default", (variant) => {
      render(<Button variant={variant}>Action</Button>);
      const button = screen.getByRole("button");
      expect(button.querySelector("[data-led]")).toBeTruthy();
    });

    it("does NOT render LED on ghost variant", () => {
      render(<Button variant="ghost">Cancel</Button>);
      const button = screen.getByRole("button");
      expect(button.querySelector("[data-led]")).toBeNull();
    });

    it("does NOT render LED when iconLeft is provided", () => {
      render(
        <Button iconLeft={<svg data-testid="left-icon" />}>Deploy</Button>,
      );
      const button = screen.getByRole("button");
      expect(button.querySelector("[data-led]")).toBeNull();
      expect(screen.getByTestId("left-icon")).toBeTruthy();
    });
  });

  describe("icons", () => {
    it("renders iconLeft before children", () => {
      render(
        <Button iconLeft={<svg data-testid="left-icon" />}>Label</Button>,
      );
      const button = screen.getByRole("button");
      const icon = screen.getByTestId("left-icon");
      const children = Array.from(button.children);
      const iconIndex = children.findIndex((c) => c.contains(icon));
      const labelIndex = children.findIndex((c) => c.textContent === "Label");
      expect(iconIndex).toBeLessThan(labelIndex);
    });

    it("renders iconRight after children", () => {
      render(
        <Button iconRight={<svg data-testid="right-icon" />}>Label</Button>,
      );
      const button = screen.getByRole("button");
      const icon = screen.getByTestId("right-icon");
      const children = Array.from(button.children);
      const iconIndex = children.findIndex((c) => c.contains(icon));
      const labelIndex = children.findIndex((c) => c.textContent === "Label");
      expect(iconIndex).toBeGreaterThan(labelIndex);
    });
  });

  describe("loading", () => {
    it("pulses the LED when loading without iconLeft", () => {
      render(<Button loading>Loading</Button>);
      const button = screen.getByRole("button");
      const led = button.querySelector("[data-led]");
      expect(led).toBeTruthy();
      expect(led?.className).toContain("animate-button-led");
    });

    it("pulses the iconLeft wrapper when loading with iconLeft", () => {
      render(
        <Button loading iconLeft={<svg data-testid="left-icon" />}>
          Loading
        </Button>,
      );
      const button = screen.getByRole("button");
      const iconWrapper = button.querySelector("[data-led-icon]");
      expect(iconWrapper).toBeTruthy();
      expect(iconWrapper?.className).toContain("animate-button-led");
      expect(screen.getByTestId("left-icon")).toBeTruthy();
    });

    it("does NOT render a separate spinner element when loading", () => {
      render(<Button loading>Loading</Button>);
      const button = screen.getByRole("button");
      expect(button.querySelector("svg.animate-spin")).toBeNull();
    });

    it("sets aria-busy when loading", () => {
      render(<Button loading>Loading</Button>);
      expect(screen.getByRole("button").getAttribute("aria-busy")).toBe("true");
    });

    it("hides iconRight when loading", () => {
      render(
        <Button loading iconRight={<svg data-testid="right-icon" />}>
          Loading
        </Button>,
      );
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
    });
  });

  describe("className merging", () => {
    it("merges custom className with variant classes", () => {
      render(<Button className="custom-class">Merge</Button>);
      const button = screen.getByRole("button");
      expect(button.className).toContain("custom-class");
    });
  });

  describe("accessibility", () => {
    it("forwards aria-label", () => {
      render(<Button aria-label="Close dialog">X</Button>);
      expect(
        screen.getByRole("button", { name: "Close dialog" }),
      ).toBeTruthy();
    });
  });
});
```

- [ ] **Step 2: Run the tests — they MUST fail**

Run: `npm run test -w @stasho/ds -- button`
Expected: multiple failures. The current button.tsx exports `text`/`destructive`/`warning` only (no `success`, no `ghost`); has no `[data-led]` element; renders a `Spinner` when loading. All new tests targeting these miss.

- [ ] **Step 3: Commit the failing tests as a checkpoint**

```bash
git add packages/ds/src/components/button/button.test.tsx
git commit -m "test(button): describe new instrument-panel contract (failing)"
```

This commit is intentional. It documents the new contract in code form before any implementation lands.

---

### Task 3: Rewrite `button.tsx` to satisfy the new contract

**Files:**
- Modify: `packages/ds/src/components/button/button.tsx` (complete replacement — drops `Spinner` import, drops `text` variant, drops `lg` size, adds `success` + `ghost`, adds LED render logic + icon-as-LED wrapper)

- [ ] **Step 1: Replace the file contents in full**

Open `packages/ds/src/components/button/button.tsx` and replace its entire contents with:

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

const buttonVariants = cva(
  [
    "inline-flex items-center font-body font-bold leading-none",
    "rounded-none border-0 text-white",
    "transition-[background,box-shadow,transform] duration-150 ease-out",
    "active:translate-y-px",
    "focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2",
    "disabled:pointer-events-none disabled:cursor-not-allowed",
    "motion-reduce:transition-none motion-reduce:active:translate-y-0",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: [
          "bg-[linear-gradient(180deg,var(--color-primary-900)_0%,var(--color-primary-950)_100%)]",
          "[box-shadow:inset_0_1px_0_rgba(0,225,250,0.4),inset_0_-1px_0_rgba(0,0,0,0.6),0_1px_0_rgba(255,255,255,0.05)]",
          "hover:bg-[linear-gradient(180deg,var(--color-primary-700)_0%,var(--color-primary-900)_100%)]",
          "hover:[box-shadow:inset_0_1px_0_rgba(0,225,250,0.6),inset_0_-1px_0_rgba(0,0,0,0.6),0_0_20px_rgba(0,64,255,0.4)]",
          "disabled:bg-neutral-900 disabled:bg-none disabled:text-white/30",
          "disabled:[box-shadow:inset_0_1px_0_rgba(255,255,255,0.03),inset_0_-1px_0_rgba(0,0,0,0.3)]",
        ].join(" "),
        secondary: [
          "bg-neutral-900",
          "[box-shadow:inset_0_1px_0_rgba(255,255,255,0.06),inset_0_-1px_0_rgba(0,0,0,0.4)]",
          "hover:bg-neutral-800",
          "disabled:text-white/30",
        ].join(" "),
        destructive: [
          "bg-error text-error-foreground",
          "[box-shadow:inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-1px_0_rgba(0,0,0,0.25),0_0_24px_rgba(255,61,0,0.5)]",
          "hover:[box-shadow:inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(0,0,0,0.25),0_0_40px_rgba(255,61,0,0.75)]",
          "disabled:bg-neutral-900 disabled:text-white/30",
          "disabled:[box-shadow:inset_0_1px_0_rgba(255,255,255,0.03),inset_0_-1px_0_rgba(0,0,0,0.3)]",
        ].join(" "),
        warning: [
          "bg-warn text-warn-foreground",
          "[box-shadow:inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-1px_0_rgba(0,0,0,0.15),0_0_24px_rgba(255,197,61,0.5)]",
          "hover:[box-shadow:inset_0_1px_0_rgba(255,255,255,0.6),inset_0_-1px_0_rgba(0,0,0,0.15),0_0_40px_rgba(255,197,61,0.75)]",
          "disabled:bg-neutral-900 disabled:text-white/30",
          "disabled:[box-shadow:inset_0_1px_0_rgba(255,255,255,0.03),inset_0_-1px_0_rgba(0,0,0,0.3)]",
        ].join(" "),
        success: [
          "bg-success text-success-foreground",
          "[box-shadow:inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(0,0,0,0.2),0_0_24px_rgba(43,213,142,0.5)]",
          "hover:[box-shadow:inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-1px_0_rgba(0,0,0,0.2),0_0_40px_rgba(43,213,142,0.75)]",
          "disabled:bg-neutral-900 disabled:text-white/30",
          "disabled:[box-shadow:inset_0_1px_0_rgba(255,255,255,0.03),inset_0_-1px_0_rgba(0,0,0,0.3)]",
        ].join(" "),
        outline: [
          "bg-transparent text-accent border border-[rgba(0,225,250,0.4)]",
          "hover:border-accent",
          "disabled:text-white/30 disabled:border-white/10",
        ].join(" "),
        ghost: [
          "bg-transparent text-white/75 font-semibold",
          "hover:bg-white/[0.04] hover:text-white",
          "disabled:text-white/30 disabled:bg-transparent",
        ].join(" "),
      },
      size: {
        xs: "py-[6px] px-3 text-[11px] gap-1.5",
        sm: "py-[7px] px-3.5 text-xs gap-[7px]",
        md: "py-[9px] px-[18px] text-[13px] gap-2",
      },
    },
    compoundVariants: [
      // Outline subtracts 1px from each padding axis to compensate for its 1px border.
      { variant: "outline", size: "xs", class: "py-[5px] px-[11px]" },
      { variant: "outline", size: "sm", class: "py-[6px] px-[13px]" },
      { variant: "outline", size: "md", class: "py-[8px] px-[17px]" },
    ],
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

type Variant = NonNullable<VariantProps<typeof buttonVariants>["variant"]>;
type Size = NonNullable<VariantProps<typeof buttonVariants>["size"]>;

// LED dimensions per size. text-* sets the LED's currentColor.
const ledSizeClass: Record<Size, string> = {
  xs: "size-1",
  sm: "size-[5px]",
  md: "size-1.5",
};

// Icon dimensions per size (used for both iconLeft wrapper and iconRight wrapper).
const iconSizeClass: Record<Size, string> = {
  xs: "size-[11px]",
  sm: "size-3",
  md: "size-[13px]",
};

// LED color + static glow per variant. currentColor on the box-shadow lets the
// animate-button-led keyframe inherit the dot's color.
const ledColorClass: Record<Variant, string> = {
  primary: "bg-accent text-accent [box-shadow:0_0_8px_currentColor]",
  secondary: "bg-accent text-accent [box-shadow:0_0_8px_currentColor]",
  destructive: "bg-white text-white [box-shadow:0_0_8px_currentColor]",
  warning: "bg-warn-foreground text-warn-foreground",
  success: "bg-success-foreground text-success-foreground",
  outline: "bg-accent/50 text-accent",
  // ghost: LED is never rendered for ghost, so this entry is a sentinel.
  ghost: "",
};

// iconLeft glow treatment per variant — applied to the wrapper span.
const iconGlowClass: Record<Variant, string> = {
  primary: "text-accent [filter:drop-shadow(0_0_4px_var(--accent))]",
  secondary: "text-accent [filter:drop-shadow(0_0_4px_var(--accent))]",
  destructive: "text-white",
  warning: "text-warn-foreground",
  success: "text-success-foreground",
  outline: "text-accent [filter:drop-shadow(0_0_4px_var(--accent))]",
  ghost: "text-white/60",
};

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
    const v: Variant = variant ?? "primary";
    const s: Size = size ?? "md";

    const classes = cn(
      buttonVariants({ variant: v, size: s }),
      loading && "pointer-events-none cursor-wait",
      className,
    );

    const showLed = !iconLeft && v !== "ghost";

    const leadingSlot = (() => {
      if (iconLeft) {
        return (
          <span
            aria-hidden="true"
            {...(loading ? { "data-led-icon": true } : {})}
            className={cn(
              "inline-flex items-center justify-center shrink-0",
              iconSizeClass[s],
              iconGlowClass[v],
              loading && "animate-button-led",
            )}
          >
            {iconLeft}
          </span>
        );
      }
      if (showLed) {
        return (
          <span
            data-led
            aria-hidden="true"
            className={cn(
              "inline-block rounded-full shrink-0",
              ledSizeClass[s],
              ledColorClass[v],
              loading && "animate-button-led",
            )}
          />
        );
      }
      return null;
    })();

    const content = (
      <>
        {leadingSlot}
        <span className="inline-flex items-center leading-none">
          {children}
        </span>
        {!loading && iconRight ? (
          <span
            aria-hidden="true"
            className={cn(
              "inline-flex items-center justify-center shrink-0",
              iconSizeClass[s],
            )}
          >
            {iconRight}
          </span>
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

Implementation notes:
- `Spinner` import is removed. The Spinner component itself still exports from `@stasho/ds/ui/spinner` for direct consumers — only the button stops using it.
- `font-body` is the Inter Tailwind utility (Inter is the body face). The current code uses `font-heading` (Anybody) — this is the typography swap from spec § Typography.
- `leading-none` (line-height: 1) is required for LED/icon vertical centering — see spec § Typography.
- Focus uses `outline` not `box-shadow ring`. Outline doesn't compose with `box-shadow`, so the variant bevel shadows stay intact while focus shows a 2px cyan outline at 2px offset. Border-radius is 0 so the outline is square — matches spec.
- The `data-led` and `data-led-icon` attributes are present for the tests; they have no styling impact.
- `aria-hidden` on the LED and icon wrappers prevents screen readers from announcing them — they're visual signals, not content.

- [ ] **Step 2: Run the tests — they MUST now pass**

Run: `npm run test -w @stasho/ds -- button`
Expected: all tests PASS.

- [ ] **Step 3: Run typecheck**

Run: `npm run typecheck`
Expected: PASS with no errors. (CVA's `VariantProps` should generate union types `"primary" | ... | "ghost"` and `"xs" | "sm" | "md"` automatically.)

- [ ] **Step 4: Run lint**

Run: `npm run lint`
Expected: PASS with no new warnings.

- [ ] **Step 5: Commit**

```bash
git add packages/ds/src/components/button/button.tsx
git commit -m "feat(skin): redesign Button as instrument-panel control with LED signature"
```

---

### Task 4: Update preview app button page

**Files:**
- Modify: `apps/preview/src/app/components/button/page.tsx` (complete replacement of the variants/sizes arrays + demo sections)

- [ ] **Step 1: Replace the file contents in full**

Open `apps/preview/src/app/components/button/page.tsx` and replace its entire contents with:

```tsx
"use client";

import { Button } from "@stasho/ds/button";
import { PageHeader } from "@preview/components/page-header";
import { DemoSection } from "@preview/components/demo-section";

const variants = [
  "primary",
  "secondary",
  "destructive",
  "warning",
  "success",
  "outline",
  "ghost",
] as const;

const sizes = ["xs", "sm", "md"] as const;

function PlaceholderIcon({ label }: { label: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <title>{label}</title>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  );
}

function ArrowIcon({ label }: { label: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <title>{label}</title>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export default function ButtonPage() {
  return (
    <>
      <PageHeader
        title="Button"
        description="Instrument-panel control with cyan LED signature. 7 variants, 3 sizes, icon slots, loading/disabled states, and asChild polymorphism."
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
      <DemoSection title="Sizes">
        <div className="flex flex-wrap items-end gap-3">
          {sizes.map((s) => (
            <Button key={s} size={s}>
              Size {s}
            </Button>
          ))}
        </div>
      </DemoSection>
      <DemoSection title="With Icons">
        <div className="flex flex-wrap items-center gap-3">
          <Button iconLeft={<PlaceholderIcon label="Add" />}>Icon Left</Button>
          <Button iconRight={<ArrowIcon label="Next" />}>Icon Right</Button>
          <Button
            iconLeft={<PlaceholderIcon label="Add" />}
            iconRight={<ArrowIcon label="Next" />}
          >
            Both Icons
          </Button>
        </div>
      </DemoSection>
      <DemoSection title="Loading">
        <div className="flex flex-wrap items-center gap-3">
          {variants.map((v) => (
            <Button key={v} variant={v} loading>
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </Button>
          ))}
        </div>
      </DemoSection>
      <DemoSection title="Loading with iconLeft">
        <div className="flex flex-wrap items-center gap-3">
          {variants.map((v) => (
            <Button
              key={v}
              variant={v}
              loading
              iconLeft={<PlaceholderIcon label="Add" />}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </Button>
          ))}
        </div>
      </DemoSection>
      <DemoSection title="Disabled">
        <div className="flex flex-wrap items-center gap-3">
          {variants.map((v) => (
            <Button key={v} variant={v} disabled>
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </Button>
          ))}
        </div>
      </DemoSection>
      <DemoSection title="As Link">
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild variant="primary">
            <a href="#demo">Primary Link</a>
          </Button>
          <Button asChild variant="ghost">
            <a href="#demo">Ghost Link</a>
          </Button>
        </div>
      </DemoSection>
    </>
  );
}
```

Changes from previous: removed `text` from variants; added `success`, `ghost`; removed `lg` from sizes; added "Loading with iconLeft" section to demo the icon-as-LED pulse; renamed "Text Link" → "Ghost Link" in As Link section; updated PageHeader description.

- [ ] **Step 2: Confirm no remaining `text` variant or `lg` size in this file**

Run: `rg 'variant=["\047]text["\047]|size=["\047]lg["\047]' apps/preview/src/app/components/button/page.tsx`
Expected: no matches.

- [ ] **Step 3: Run typecheck**

Run: `npm run typecheck`
Expected: PASS. Any consumer of `@stasho/ds/button` that uses `variant="text"` or `size="lg"` would now type-error.

- [ ] **Step 4: Boot the dev server and verify visually**

Run: `npm run dev`
Open: `http://localhost:3000/components/button`

Verify by eye:
- All 7 variant labels render: Primary, Secondary, Destructive, Warning, Success, Outline, Ghost
- Primary has a cyan LED with cyan glow; secondary same; destructive has a white LED; warning/success have dark LEDs (no glow); outline has a dim cyan disc; ghost has no LED
- All 3 sizes render with progressively larger padding and font (xs/sm/md)
- iconLeft replaces the LED. On primary/secondary/outline the icon is cyan with a glow; on destructive the icon is white; on warning/success the icon is dark; on ghost the icon is muted white
- iconRight is white (or variant foreground), no glow
- Loading row: every variant pulses (cursor: wait; aria-busy). For ghost, since it has no LED, only the cursor changes
- Loading with iconLeft row: the icon pulses with the LED animation
- Disabled row: all variants flatten to dark gray with low-contrast text. LED dims and stops glowing
- "As Link" renders an `<a>` styled as a button (test the keyboard tab order — links should be focusable with the cyan outline)

Stop the dev server when done.

- [ ] **Step 5: Commit**

```bash
git add apps/preview/src/app/components/button/page.tsx
git commit -m "chore(preview): rebuild button demo for instrument-panel redesign"
```

---

### Task 5: Update DESIGN-SYSTEM.md Button section

**Files:**
- Modify: `docs/DESIGN-SYSTEM.md` — line 14 (Component Index row), lines 760–828 (Button section)

- [ ] **Step 1: Update the Component Index row for Button**

Find this line (around line 14):

```
| [Button](#button) | Action trigger with 6 variants, 4 sizes, gradient fills | `@aleph-front/ds/button` |
```

Replace with:

```
| [Button](#button) | Action trigger with 7 variants, 3 sizes, cyan LED signature | `@stasho/ds/button` |
```

- [ ] **Step 2: Replace the entire Button section**

Find the `### Button` heading (around line 760) and replace everything from that heading up to (but not including) the next `### Input` heading with:

```markdown
### Button

CVA-based instrument-panel button with 7 variants, 3 sizes, icon slots, loading/disabled states, and `asChild` polymorphism. The cyan LED dot in the leading slot is the brand signature for filled interactive controls.

```tsx
import { Button } from "@stasho/ds/button";
```

**Visual style:** Square corners (`rounded-none`), no border on filled variants, `font-body` (Inter) at weight 700, sentence case, `line-height: 1`. Each filled variant has a beveled chassis (inset top-highlight + bottom-shadow). Saturated semantic chassis (destructive/warning/success) add an outer halo for "electric" energy.

#### Variants

```tsx
<Button variant="primary">Deploy instance</Button>      {/* Deep-blue chassis, cyan LED */}
<Button variant="secondary">Configure</Button>          {/* Neutral chassis, cyan LED */}
<Button variant="destructive">Delete</Button>           {/* Blood-orange chassis, white LED, halo */}
<Button variant="warning">Force restart</Button>        {/* Amber chassis, dark LED, halo */}
<Button variant="success">Confirm</Button>              {/* Teal-green chassis, dark LED, halo */}
<Button variant="outline">Learn more</Button>           {/* Transparent, cyan border + cyan text */}
<Button variant="ghost">Cancel</Button>                 {/* Pure label, no chassis, no LED */}
```

#### Sizes

```tsx
<Button size="xs">Extra small</Button>   {/* py-[6px] px-3,  text-[11px] */}
<Button size="sm">Small</Button>         {/* py-[7px] px-3.5, text-xs */}
<Button size="md">Medium</Button>        {/* py-[9px] px-[18px], text-[13px] — default */}
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
<Button loading>Saving…</Button>          {/* LED pulses; no spinner element; aria-busy */}
<Button loading iconLeft={<PlusIcon />}>
  Saving…
</Button>                                  {/* Icon pulses instead of LED */}
<Button disabled>Unavailable</Button>      {/* Chassis flattens; LED dims to muted gray */}
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
```

- [ ] **Step 3: Commit**

```bash
git add docs/DESIGN-SYSTEM.md
git commit -m "docs(design-system): update Button section for instrument-panel redesign"
```

---

### Task 6: Update remaining docs

**Files:**
- Modify: `docs/ARCHITECTURE.md` (append a Button-specific subsection in the Components section)
- Modify: `docs/DECISIONS.md` (prepend a new Decision #80)
- Modify: `docs/BACKLOG.md` (mark redesign completed in archived items)
- Modify: `CLAUDE.md` (update the Current Features bullet for Button)

- [ ] **Step 1: Add Decision #80 to `docs/DECISIONS.md`**

Find the `## Decision #79 — 2026-05-26` heading and insert above it (just under the `---` separator at line 19, before `## Decision #79`):

```markdown
## Decision #80 — 2026-05-26

**Context:** Existing Button used `font-heading` (Anybody) with purple gradient fills and a 3px border, reading as generic against the Abyssal Void skin. A full redesign brainstorm explored four directions (Voltage, Telemetry, Brutalist Stencil, Instrument Panel) and landed on Instrument Panel — a beveled chassis with a glowing cyan LED dot as the brand signature. Variant model expanded to add `success`, `text` renamed to `ghost`, `lg` size dropped, typography swapped to Inter sentence case with `line-height: 1`, geometry kept at 0px radius. Loading state changed from Spinner swap to LED-pulse animation. Spec captured in `docs/superpowers/specs/2026-05-26-button-redesign-design.md`.
**Decision:** Adopt the Instrument Panel button family. Seven variants in three groups: **filled** (primary, secondary) use bevel + cyan LED + no halo; **semantic** (destructive, warning, success) use solid saturated brand color + outer halo, with LED color inverted for contrast (white on destructive, dark on warning/success); **quiet** (outline, ghost) drop the halo and LED glow. Three sizes (xs 6×12, sm 7×14, md 9×18) — `lg` dropped. Typography: Inter 700 (600 for ghost), sentence case, `leading-none`. Geometry: `rounded-none`, no border on filled variants, 1px cyan on outline. `iconLeft` replaces the LED on filled variants and inherits the LED's cyan glow filter — the icon literally becomes the LED. Loading state pulses the LED via a `button-led-pulse` keyframe (or pulses the iconLeft when present). Focus uses native `outline-2 outline-accent outline-offset-2` rather than box-shadow ring so it composes with the variant bevel.
**Rationale:** The cyan LED is the strongest brand signature this skin can carry on filled controls — it ties buttons to the "voltage / signal / instrument" mental model from Decisions #77, #78, #79, and gives the eye a single thing to track for "this is live hardware". The bevel chassis vs flat fill is the difference between "the screen contains a button" and "the screen contains an instrument" — bevel reads as material. Filled (primary/secondary) gets bevel + LED; semantic (destructive/warning/success) gets solid + halo because gradients on saturated colors read muddy. `ghost` rename matches DS convention across shadcn/Linear/etc. — `text` was inconsistent. `lg` was dropped because review found `md` was already at the upper bound of what felt right (Abyssal Void wants restraint over emphasis). `outline` works as `outline` not `box-shadow` so bevels remain intact during focus. LED pulse replaces Spinner swap because a separate moving thing breaks the "LED is the signal" thesis — the loading indicator should be the LED.
**Alternatives considered:** Voltage direction with electric gradient halo (rejected — primary's gradient + halo competed with the LED signature). Telemetry direction with Departure Mono ALL CAPS labels (rejected — too costume-y at button scale, hurts long labels and i18n). Brutalist Stencil with Anybody max weight + offset hard-shadows (rejected — read as poster type, not pressable control). Keep `text` variant name (rejected — non-standard, `ghost` is the DS convention). Keep `lg` size (rejected — review found `md` was already borderline; trimming creates a clearer ladder). Inter ALL CAPS tracked (rejected during typography brainstorm — read as banner not control). LED color shifts per variant (rejected at first — locked to cyan-always — but reverted because saturated semantic chassis swallowed a cyan LED; semantic LED color now inverts to white/dark for contrast within the LED-as-signature umbrella). LED pulse + a separate Spinner element (rejected — two moving things compete; LED pulse alone is honest).
```

- [ ] **Step 2: Append a Button architecture subsection to `docs/ARCHITECTURE.md`**

Open `docs/ARCHITECTURE.md`. Find the section about other components (search for `### Tabs` or `### Dialog` as anchors). Append after the last component section (just before the next major heading or end-of-file):

```markdown
### Button

The Button is the only DS component that renders a brand "signature" element — the cyan LED dot — that isn't part of the consumer-provided content.

**LED render logic.** The LED `<span data-led>` renders when `!iconLeft && variant !== 'ghost'`. When iconLeft is provided on a non-ghost variant, the icon takes the LED's leading slot and its wrapper inherits the LED's color + drop-shadow filter (so the glyph "becomes" the LED). When the variant is `ghost`, no LED renders even without an icon — ghost is the quiet escape hatch.

**Loading animation.** The `animate-button-led` class is applied to either the LED span or the iconLeft wrapper depending on which is present. The keyframe `button-led-pulse` (in `tokens.css`) uses `currentColor` for the box-shadow so the same animation works whether the lit element is cyan (primary/secondary/outline), white (destructive), or dark (warning/success). `prefers-reduced-motion: reduce` cancels the animation.

**Focus ring uses outline, not box-shadow.** Variant chassis use stacked `box-shadow` for the bevel (inset highlights + drop shadow + halo for semantic variants). A focus ring drawn via `box-shadow` would replace the bevel during focus. Using native `outline` keeps the two visual channels separate — the bevel persists when focused, and the cyan outline sits at 2px offset around the chassis.

**Disabled visual flatten.** Every variant's `disabled:` classes collapse the chassis to `bg-neutral-900` with a faint inset bevel, regardless of the variant's resting chassis color. The LED dims via `opacity` inheritance and stops glowing because its `bg-` color is also overridden through `disabled:text-white/30`. This unifies disabled state — a disabled destructive button reads the same as a disabled primary, which is the correct semantics (both are inert).

**`asChild` limitation.** When `asChild` is true, the rendered element is the consumer's child via `cloneElement`. The LED and icon content are NOT carried over — `asChild` exists for "link styled as button", not "rich content button". Consumers who need a link with an LED should compose `buttonVariants({...})` manually onto their link element and add the LED span themselves.
```

- [ ] **Step 3: Mark backlog item completed in `docs/BACKLOG.md`**

Open `docs/BACKLOG.md`. Find the Completed section (`<details><summary>Archived items</summary>`). Append a new entry near the bottom of the archive, after the `2026-05-26 — Abyssal Void skin` line:

```markdown
- [x] 2026-05-26 — Button redesign as instrument-panel control (LED signature, 7 variants, 3 sizes, sentence case Inter, loading via LED pulse)
```

- [ ] **Step 4: Update CLAUDE.md Current Features button bullet**

Open `CLAUDE.md`. Find the existing Button bullet in the "Current Features" list:

```
- Button component with 6 variants, 4 sizes, CVA architecture, square corners (primary uses gradient-fill-main, secondary uses gradient-fill-accent, outline uses gradient border)
```

Replace with:

```
- Button component with 7 variants (primary, secondary, destructive, warning, success, outline, ghost), 3 sizes (xs/sm/md), CVA architecture, instrument-panel chassis with cyan LED signature, iconLeft inherits LED glow, loading state pulses the LED (or iconLeft) via `animate-button-led` keyframe, focus uses native `outline-accent`
```

Also find the Spinner bullet — Spinner is still its own exported component, but the wording "Spinner component for loading states" no longer reflects how the button uses loading. The Spinner bullet itself can stay as-is (Spinner remains a public export for direct use), but to be accurate add a parenthetical:

```
- Spinner component for loading states (still exported standalone — Button no longer uses it internally)
```

- [ ] **Step 5: Commit all doc updates as one logical change**

```bash
git add docs/DECISIONS.md docs/ARCHITECTURE.md docs/BACKLOG.md CLAUDE.md
git commit -m "docs: capture button redesign rationale and update component features"
```

---

### Task 7: Final full-repo check

- [ ] **Step 1: Run `npm run check`**

Run: `npm run check`
Expected: lint + typecheck + tests all PASS across both workspaces (`@stasho/ds` and `@stasho/preview`).

If anything fails, fix the root cause — do NOT bypass with `--no-verify` on commit (see CLAUDE.md hook policy).

- [ ] **Step 2: Search the worktree for any stale references**

Run these in parallel:

```bash
rg 'variant=["\047]text["\047]' --type tsx --type ts
rg 'size=["\047]lg["\047]' --type tsx --type ts apps/ packages/
rg 'from "@aleph-front/ds' apps/ packages/
```

Expected:
- First two: zero matches.
- Third: matches inside `docs/DESIGN-SYSTEM.md` are stale and OUT OF SCOPE for this plan. Note them in the PR description as a follow-up sweep (not a blocker for this chunk).

---

### Task 8: Push and open the PR (target = `skin/paraplu`)

- [ ] **Step 1: Confirm branch name + push**

The current branch should be `skin/buttons` (or similar) — a chunk branch off `skin/paraplu`, not `main`. Verify with:

```bash
git branch --show-current
git log --oneline origin/skin/paraplu..HEAD
```

If on `skin/paraplu` directly, the chunk needs its own branch. Create one off the integration branch:

```bash
git checkout -b skin/buttons
```

Then push:

```bash
git push -u origin skin/buttons
```

- [ ] **Step 2: Open the PR targeting `skin/paraplu`**

```bash
gh pr create --base skin/paraplu --title "feat(skin): redesign Button as instrument-panel control" --body "$(cat <<'EOF'
## Summary

- Replaces the generic gradient Button with an instrument-panel chassis + cyan LED signature
- 7 variants (added `success`, renamed `text` → `ghost`), 3 sizes (dropped `lg`)
- Typography: Inter 700 sentence case + `leading-none`
- Loading state pulses the LED (or iconLeft) via `animate-button-led` — no Spinner swap
- Focus uses native `outline-accent` so the bevel stays intact under focus
- Adds `@keyframes button-led-pulse` to `tokens.css`

Spec: `docs/superpowers/specs/2026-05-26-button-redesign-design.md`
Decision: #80

## Breaking changes for consumers

- `variant="text"` → `variant="ghost"`
- `size="lg"` → `size="md"`
- Visual appearance changes drastically. Consumer apps (scheduler-dashboard, cloud-app) need their own follow-up migration once `@stasho/ds` re-publishes.

## Follow-ups (not in this PR)

- Sweep `docs/DESIGN-SYSTEM.md` for remaining `@aleph-front/ds` import path references (pre-existing staleness, not introduced by this change).
- Consumer-app `variant="text"` / `size="lg"` migration once the DS package republishes.

## Test plan

- [x] `npm run check` passes (lint + typecheck + test across workspaces)
- [x] All 7 variants render in `apps/preview` at `/components/button` with correct LED treatment
- [x] iconLeft inherits cyan glow on filled variants; iconRight stays white
- [x] Loading row pulses LED (or iconLeft) on every applicable variant
- [x] Disabled row flattens chassis and dims LED
- [x] Focus shows cyan outline at 2px offset with bevel intact
EOF
)"
```

- [ ] **Step 3: Wait for the user to review the PR**

The user merges. Do not auto-merge.

- [ ] **Step 4: After user merges, sync `skin/paraplu`**

```bash
git checkout skin/paraplu
git pull --ff-only origin skin/paraplu
git branch -D skin/buttons
```

Per CLAUDE.md's integration-branch model — the chunk has now merged INTO `skin/paraplu`, which remains open. `skin/paraplu` itself merges to `main` later when the full Abyssal Void integration is complete (Decision #79).

---

### Task 9: Update docs (final checklist)

Confirm each doc was updated in the appropriate earlier task. This is a verification list, not new work.

- [ ] DESIGN-SYSTEM.md — Button section + Component Index row (Task 5) ✓
- [ ] ARCHITECTURE.md — Button subsection appended (Task 6 Step 2) ✓
- [ ] DECISIONS.md — Decision #80 added (Task 6 Step 1) ✓
- [ ] BACKLOG.md — completed entry added (Task 6 Step 3) ✓
- [ ] CLAUDE.md — Current Features Button bullet updated (Task 6 Step 4) ✓

If any are not done, return to the relevant task and complete it before merging.
