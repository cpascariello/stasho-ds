# Combobox + Slider Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add Combobox (searchable select) and Slider (single-thumb range input) components to the DS package.

**Architecture:** Combobox wraps cmdk + Radix Popover for search-filtering and dropdown positioning. Slider wraps Radix Slider primitive. Both follow the existing CVA + forwardRef + cn() pattern with sm/md sizes.

**Tech Stack:** cmdk 1.1.1, Radix Popover (already in radix-ui), Radix Slider (already in radix-ui), CVA, Tailwind CSS 4

**Design doc:** `docs/plans/2026-03-03-form-components-design.md`

---

### Task 1: Install cmdk dependency

**Files:**
- Modify: `packages/ds/package.json`

**Step 1: Install cmdk**

Run from repo root:
```bash
cd packages/ds && pnpm add cmdk@1.1.1
```

**Step 2: Verify installation**

Run: `pnpm install && pnpm typecheck`
Expected: clean install, no type errors

**Step 3: Commit**

```bash
git add packages/ds/package.json pnpm-lock.yaml
git commit -m "deps: add cmdk 1.1.1 for Combobox component"
```

---

### Task 2: Combobox — write failing tests

**Files:**
- Create: `packages/ds/src/components/combobox/combobox.test.tsx`

The Combobox uses Radix Popover internally, which needs the same jsdom polyfills as Select (PointerEvent, scrollIntoView, hasPointerCapture, releasePointerCapture, ResizeObserver, DOMRect). Copy the polyfill block from `packages/ds/src/components/select/select.test.tsx` lines 1–58.

**Step 1: Write the test file**

```tsx
// Polyfills for Radix Popover in jsdom — same as select.test.tsx
import { vi } from "vitest";

class MockPointerEvent extends Event {
  button: number;
  ctrlKey: boolean;
  pointerType: string;
  constructor(
    type: string,
    props: PointerEventInit & { pointerType?: string } = {},
  ) {
    super(type, props);
    this.button = props.button ?? 0;
    this.ctrlKey = props.ctrlKey ?? false;
    this.pointerType = props.pointerType ?? "mouse";
  }
}
window.PointerEvent = MockPointerEvent as unknown as typeof PointerEvent;
window.HTMLElement.prototype.scrollIntoView = vi.fn();
window.HTMLElement.prototype.hasPointerCapture = vi.fn();
window.HTMLElement.prototype.releasePointerCapture = vi.fn();

if (typeof globalThis.ResizeObserver === "undefined") {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
}

if (typeof globalThis.DOMRect === "undefined") {
  globalThis.DOMRect = class DOMRect {
    x = 0;
    y = 0;
    width = 0;
    height = 0;
    top = 0;
    right = 0;
    bottom = 0;
    left = 0;
    constructor(x = 0, y = 0, width = 0, height = 0) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.top = y;
      this.right = x + width;
      this.bottom = y + height;
      this.left = x;
    }
    toJSON() {
      return JSON.stringify(this);
    }
    static fromRect() {
      return new DOMRect();
    }
  } as unknown as typeof DOMRect;
}

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { createRef } from "react";
import { Combobox } from "@ac/components/combobox/combobox";

const OPTIONS = [
  { value: "btc", label: "Bitcoin" },
  { value: "eth", label: "Ethereum" },
  { value: "sol", label: "Solana" },
  { value: "dot", label: "Polkadot", disabled: true },
];

describe("Combobox", () => {
  it("renders a trigger button", () => {
    render(<Combobox options={OPTIONS} />);
    expect(screen.getByRole("button")).toBeDefined();
  });

  it("shows placeholder when no value selected", () => {
    render(<Combobox options={OPTIONS} placeholder="Pick a token..." />);
    expect(screen.getByText("Pick a token...")).toBeDefined();
  });

  it("shows selected label when value is set", () => {
    render(<Combobox options={OPTIONS} value="eth" onValueChange={() => {}} />);
    expect(screen.getByText("Ethereum")).toBeDefined();
  });

  it("opens popover on trigger click and shows search input", async () => {
    const user = userEvent.setup();
    render(<Combobox options={OPTIONS} />);
    await user.click(screen.getByRole("button"));
    expect(screen.getByRole("combobox")).toBeDefined();
  });

  it("filters options when typing in search", async () => {
    const user = userEvent.setup();
    render(<Combobox options={OPTIONS} />);
    await user.click(screen.getByRole("button"));
    const input = screen.getByRole("combobox");
    await user.type(input, "bit");
    expect(screen.getByText("Bitcoin")).toBeDefined();
    expect(screen.queryByText("Solana")).toBeNull();
  });

  it("calls onValueChange when item is selected", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Combobox options={OPTIONS} onValueChange={onChange} />);
    await user.click(screen.getByRole("button"));
    await user.click(screen.getByText("Solana"));
    expect(onChange).toHaveBeenCalledWith("sol");
  });

  it("shows empty message when no options match", async () => {
    const user = userEvent.setup();
    render(
      <Combobox options={OPTIONS} emptyMessage="Nothing found" />,
    );
    await user.click(screen.getByRole("button"));
    await user.type(screen.getByRole("combobox"), "zzzzz");
    expect(screen.getByText("Nothing found")).toBeDefined();
  });

  it("sets aria-invalid when error is true", () => {
    render(<Combobox options={OPTIONS} error />);
    expect(screen.getByRole("button")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("is disabled when disabled prop is true", () => {
    render(<Combobox options={OPTIONS} disabled />);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("forwards ref to trigger button", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Combobox ref={ref} options={OPTIONS} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `cd packages/ds && pnpm vitest run src/components/combobox/combobox.test.tsx`
Expected: FAIL — cannot find module `@ac/components/combobox/combobox`

**Step 3: Commit**

```bash
git add packages/ds/src/components/combobox/combobox.test.tsx
git commit -m "test: add Combobox failing tests"
```

---

### Task 3: Combobox — implement component

**Files:**
- Create: `packages/ds/src/components/combobox/combobox.tsx`
- Modify: `packages/ds/package.json` (add export)

**Step 1: Write the Combobox component**

Reference: `packages/ds/src/components/select/select.tsx` for the trigger pattern, type structure, and export conventions.

```tsx
import { forwardRef, useState, type ComponentPropsWithoutRef } from "react";
import { Popover } from "radix-ui";
import { Command } from "cmdk";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@ac/lib/cn";

const triggerVariants = cva(
  [
    "inline-flex items-center justify-between",
    "w-full font-sans text-foreground bg-surface dark:bg-base-800",
    "border-0 shadow-brand rounded-full",
    "focus-visible:outline-none focus-visible:ring-3",
    "focus-visible:ring-primary-500",
    "disabled:opacity-50 disabled:pointer-events-none",
    "ring-0 transition-[color,box-shadow]",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "py-1.5 px-4 text-sm",
        md: "py-2 px-5 text-base",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

type ComboboxOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type ComboboxProps = VariantProps<typeof triggerVariants> & {
  options: ComboboxOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  size?: "sm" | "md";
  error?: boolean;
  disabled?: boolean;
  className?: string;
  id?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
};

const Combobox = forwardRef<HTMLButtonElement, ComboboxProps>(
  (
    {
      options,
      value,
      onValueChange,
      placeholder = "Select...",
      searchPlaceholder = "Search...",
      emptyMessage = "No results found.",
      size,
      error = false,
      disabled = false,
      className,
      id,
      "aria-describedby": ariaDescribedBy,
      ...rest
    },
    ref,
  ) => {
    const [open, setOpen] = useState(false);
    const selectedLabel = options.find((o) => o.value === value)?.label;

    return (
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger
          ref={ref}
          id={id}
          disabled={disabled}
          aria-describedby={ariaDescribedBy}
          aria-invalid={error || undefined}
          className={cn(
            triggerVariants({ size }),
            error && "border-3 border-error-400 hover:border-error-500",
            !selectedLabel && "text-muted-foreground",
            className,
          )}
          {...rest}
        >
          <span className="truncate">
            {selectedLabel ?? placeholder}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn(
              "ml-2 size-4 shrink-0 text-muted-foreground transition-transform motion-reduce:transition-none",
              open && "rotate-180",
            )}
            aria-hidden="true"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            className={cn(
              "z-50 w-[var(--radix-popover-trigger-width)] overflow-hidden rounded-2xl",
              "bg-surface border border-edge shadow-brand",
            )}
            sideOffset={4}
            align="start"
          >
            <Command>
              <Command.Input
                placeholder={searchPlaceholder}
                className={cn(
                  "w-full border-b border-edge bg-transparent px-4 py-2.5",
                  "text-sm text-foreground placeholder:text-muted-foreground",
                  "outline-none",
                )}
              />
              <Command.List className="max-h-60 overflow-y-auto p-1">
                <Command.Empty className="px-4 py-6 text-center text-sm text-muted-foreground">
                  {emptyMessage}
                </Command.Empty>
                {options.map((option) => (
                  <Command.Item
                    key={option.value}
                    value={option.label}
                    disabled={option.disabled}
                    onSelect={() => {
                      onValueChange?.(option.value);
                      setOpen(false);
                    }}
                    className={cn(
                      "relative flex items-center rounded-xl px-4 py-2",
                      "text-sm text-foreground cursor-pointer select-none",
                      "outline-none",
                      "data-[selected=true]:bg-muted",
                      "data-[disabled=true]:opacity-50",
                      "data-[disabled=true]:pointer-events-none",
                    )}
                  >
                    <span className="flex-1">{option.label}</span>
                    {value === option.value && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="ml-auto size-4"
                        aria-hidden="true"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </Command.Item>
                ))}
              </Command.List>
            </Command>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    );
  },
);

Combobox.displayName = "Combobox";

export { Combobox, triggerVariants, type ComboboxProps, type ComboboxOption };
```

**Step 2: Add subpath export to package.json**

In `packages/ds/package.json`, add to `"exports"`:
```json
"./combobox": "./src/components/combobox/combobox.tsx",
```

**Step 3: Run tests**

Run: `cd packages/ds && pnpm vitest run src/components/combobox/combobox.test.tsx`
Expected: all tests pass

**Step 4: Fix any failures**

cmdk uses `data-[selected=true]` for highlighted items (not `data-[highlighted]` like Radix Select). If filtering tests fail, check that cmdk's `Command.Item` `value` prop matches the searchable text (use `option.label` as the value so typing filters by label).

If the popover doesn't open in jsdom, ensure the PointerEvent polyfill is in place. cmdk + Radix Popover use pointer events for open/close.

**Step 5: Commit**

```bash
git add packages/ds/src/components/combobox/ packages/ds/package.json
git commit -m "feat: add Combobox component (cmdk + Radix Popover)"
```

---

### Task 4: Slider — write failing tests

**Files:**
- Create: `packages/ds/src/components/slider/slider.test.tsx`

Radix Slider needs the same PointerEvent and ResizeObserver polyfills as Select/Combobox. Copy the polyfill block.

**Step 1: Write the test file**

```tsx
// Polyfills for Radix Slider in jsdom
import { vi } from "vitest";

class MockPointerEvent extends Event {
  button: number;
  ctrlKey: boolean;
  pointerType: string;
  constructor(
    type: string,
    props: PointerEventInit & { pointerType?: string } = {},
  ) {
    super(type, props);
    this.button = props.button ?? 0;
    this.ctrlKey = props.ctrlKey ?? false;
    this.pointerType = props.pointerType ?? "mouse";
  }
}
window.PointerEvent = MockPointerEvent as unknown as typeof PointerEvent;
window.HTMLElement.prototype.scrollIntoView = vi.fn();
window.HTMLElement.prototype.hasPointerCapture = vi.fn();
window.HTMLElement.prototype.releasePointerCapture = vi.fn();

if (typeof globalThis.ResizeObserver === "undefined") {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
}

if (typeof globalThis.DOMRect === "undefined") {
  globalThis.DOMRect = class DOMRect {
    x = 0;
    y = 0;
    width = 0;
    height = 0;
    top = 0;
    right = 0;
    bottom = 0;
    left = 0;
    constructor(x = 0, y = 0, width = 0, height = 0) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.top = y;
      this.right = x + width;
      this.bottom = y + height;
      this.left = x;
    }
    toJSON() {
      return JSON.stringify(this);
    }
    static fromRect() {
      return new DOMRect();
    }
  } as unknown as typeof DOMRect;
}

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { createRef } from "react";
import { Slider } from "@ac/components/slider/slider";

describe("Slider", () => {
  it("renders a slider role element", () => {
    render(<Slider defaultValue={[50]} />);
    expect(screen.getByRole("slider")).toBeDefined();
  });

  it("has correct min/max/value attributes", () => {
    render(<Slider min={0} max={200} defaultValue={[75]} />);
    const slider = screen.getByRole("slider");
    expect(slider).toHaveAttribute("aria-valuemin", "0");
    expect(slider).toHaveAttribute("aria-valuemax", "200");
    expect(slider).toHaveAttribute("aria-valuenow", "75");
  });

  it("responds to keyboard arrow right", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Slider
        min={0}
        max={100}
        step={10}
        defaultValue={[50]}
        onValueChange={onChange}
      />,
    );
    const slider = screen.getByRole("slider");
    await user.click(slider);
    await user.keyboard("{ArrowRight}");
    expect(onChange).toHaveBeenCalledWith([60]);
  });

  it("responds to keyboard arrow left", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Slider
        min={0}
        max={100}
        step={10}
        defaultValue={[50]}
        onValueChange={onChange}
      />,
    );
    const slider = screen.getByRole("slider");
    await user.click(slider);
    await user.keyboard("{ArrowLeft}");
    expect(onChange).toHaveBeenCalledWith([40]);
  });

  it("sets aria-disabled when disabled", () => {
    render(<Slider defaultValue={[50]} disabled />);
    expect(screen.getByRole("slider")).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  it("forwards ref to the root element", () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Slider ref={ref} defaultValue={[50]} />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `cd packages/ds && pnpm vitest run src/components/slider/slider.test.tsx`
Expected: FAIL — cannot find module `@ac/components/slider/slider`

**Step 3: Commit**

```bash
git add packages/ds/src/components/slider/slider.test.tsx
git commit -m "test: add Slider failing tests"
```

---

### Task 5: Slider — implement component

**Files:**
- Create: `packages/ds/src/components/slider/slider.tsx`
- Modify: `packages/ds/package.json` (add export)

**Step 1: Write the Slider component**

Reference: `packages/ds/src/components/switch/switch.tsx` for the Radix wrapper + dual CVA variant pattern (root + child). Reference design doc for sizing decisions.

```tsx
import { forwardRef, useState, type ComponentPropsWithoutRef } from "react";
import { Slider as SliderPrimitive } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@ac/lib/cn";

const trackVariants = cva(
  [
    "relative w-full grow overflow-hidden rounded-full",
    "bg-base-200 dark:bg-base-700",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "h-1.5",
        md: "h-2",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

const thumbVariants = cva(
  [
    "block rounded-full bg-white shadow-sm",
    "border-2 border-primary-500",
    "focus-visible:outline-none focus-visible:ring-3",
    "focus-visible:ring-primary-500",
    "disabled:pointer-events-none",
    "transition-[box-shadow] motion-reduce:transition-none",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "size-4",
        md: "size-5",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

type SliderProps = Omit<
  ComponentPropsWithoutRef<typeof SliderPrimitive.Root>,
  "size"
> &
  VariantProps<typeof trackVariants> & {
    error?: boolean;
    showTooltip?: boolean;
  };

const Slider = forwardRef<
  React.ComponentRef<typeof SliderPrimitive.Root>,
  SliderProps
>(
  (
    {
      size,
      error = false,
      showTooltip = false,
      className,
      disabled,
      ...rest
    },
    ref,
  ) => {
    const [hovering, setHovering] = useState(false);
    const [internalValue, setInternalValue] = useState(
      rest.defaultValue ?? rest.value ?? [0],
    );

    const displayValue = rest.value ?? internalValue;

    return (
      <SliderPrimitive.Root
        ref={ref}
        disabled={disabled}
        className={cn(
          "relative flex w-full touch-none select-none items-center",
          disabled && "opacity-50 pointer-events-none",
          className,
        )}
        onValueChange={(val) => {
          setInternalValue(val);
          rest.onValueChange?.(val);
        }}
        onPointerEnter={() => setHovering(true)}
        onPointerLeave={() => setHovering(false)}
        {...rest}
        // Remove onValueChange from rest since we handle it above
      >
        <SliderPrimitive.Track
          className={cn(
            trackVariants({ size }),
            error && "ring-2 ring-error-400",
          )}
        >
          <SliderPrimitive.Range className="absolute h-full bg-primary-500 rounded-full" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className={cn(thumbVariants({ size }), "relative")}>
          {showTooltip && hovering && (
            <span
              className={cn(
                "absolute bottom-full left-1/2 -translate-x-1/2 mb-2",
                "rounded-md bg-neutral-900 dark:bg-base-700 px-2 py-1",
                "text-xs text-white whitespace-nowrap pointer-events-none",
              )}
            >
              {displayValue[0]}
            </span>
          )}
        </SliderPrimitive.Thumb>
      </SliderPrimitive.Root>
    );
  },
);

Slider.displayName = "Slider";

export { Slider, trackVariants, thumbVariants, type SliderProps };
```

**Important implementation note:** The `onValueChange` prop is in `rest` but we also need to intercept it for the tooltip display value. Destructure `onValueChange` out of `rest` explicitly to avoid passing it twice:

```tsx
const { onValueChange: onValueChangeProp, ...rootProps } = rest;
```

Then use `onValueChangeProp?.(val)` in the handler and spread `rootProps` onto the Root.

**Step 2: Add subpath export to package.json**

In `packages/ds/package.json`, add to `"exports"`:
```json
"./slider": "./src/components/slider/slider.tsx",
```

**Step 3: Run tests**

Run: `cd packages/ds && pnpm vitest run src/components/slider/slider.test.tsx`
Expected: all tests pass

**Step 4: Fix any failures**

Radix Slider renders `<span role="slider">` as the Thumb. The ref goes on the Root which is also a `<span>`. If the ref test fails, check the ref type — it should be `HTMLSpanElement`, not `HTMLDivElement`.

If keyboard tests fail, Radix Slider may need the thumb to be focused before arrow keys work. Ensure the test clicks the slider thumb (role="slider") before pressing arrow keys.

**Step 5: Commit**

```bash
git add packages/ds/src/components/slider/ packages/ds/package.json
git commit -m "feat: add Slider component (Radix Slider wrapper)"
```

---

### Task 6: Run full check suite

**Step 1: Run all checks**

Run: `pnpm check` (from repo root)
Expected: lint + typecheck + all tests pass

**Step 2: Fix any issues**

Common issues:
- oxlint may flag unused imports or variables — fix inline
- TypeScript may complain about cmdk types — check that `cmdk` ships its own `.d.ts` (it does)
- If there are `exactOptionalPropertyTypes` issues with Radix/cmdk props, use conditional spread: `{...(prop ? { key: prop } : {})}`

**Step 3: Commit fixes if any**

```bash
git add -u
git commit -m "fix: resolve lint/type issues in Combobox and Slider"
```

---

### Task 7: Combobox preview page

**Files:**
- Create: `apps/preview/src/app/components/combobox/page.tsx`
- Modify: `apps/preview/src/components/sidebar.tsx` (add nav entry)

**Step 1: Create preview page**

Reference: `apps/preview/src/app/components/select/page.tsx` for structure (PageHeader, DemoSection, controlled state, FormField integration).

```tsx
"use client";

import { useState } from "react";
import { Combobox } from "@aleph-front/ds/combobox";
import { FormField } from "@aleph-front/ds/form-field";
import { PageHeader } from "@preview/components/page-header";
import { DemoSection } from "@preview/components/demo-section";

const TOKENS = [
  { value: "btc", label: "Bitcoin" },
  { value: "eth", label: "Ethereum" },
  { value: "sol", label: "Solana" },
  { value: "dot", label: "Polkadot" },
  { value: "avax", label: "Avalanche" },
  { value: "atom", label: "Cosmos" },
  { value: "deprecated", label: "Legacy Token", disabled: true },
];

const REGIONS = [
  { value: "us-east", label: "US East" },
  { value: "us-west", label: "US West" },
  { value: "eu-west", label: "EU West" },
  { value: "ap-south", label: "Asia Pacific" },
];

export default function ComboboxPage() {
  const [value, setValue] = useState("");

  return (
    <>
      <PageHeader
        title="Combobox"
        description="A searchable dropdown for choosing from a list of options."
      />

      <div className="space-y-12">
        <DemoSection title="Default">
          <div className="max-w-xs">
            <Combobox options={TOKENS} placeholder="Select a token..." />
          </div>
        </DemoSection>

        <DemoSection title="Sizes">
          <div className="max-w-xs space-y-4">
            <Combobox options={REGIONS} placeholder="Small" size="sm" />
            <Combobox options={REGIONS} placeholder="Medium" size="md" />
          </div>
        </DemoSection>

        <DemoSection title="States">
          <div className="max-w-xs space-y-4">
            <Combobox options={REGIONS} disabled placeholder="Disabled" />
            <Combobox options={REGIONS} error placeholder="Error" />
          </div>
        </DemoSection>

        <DemoSection title="Controlled">
          <div className="max-w-xs space-y-2">
            <Combobox
              options={TOKENS}
              value={value}
              onValueChange={setValue}
              placeholder="Search tokens..."
            />
            <p className="text-sm text-muted-foreground">
              Selected: {value || "(none)"}
            </p>
          </div>
        </DemoSection>

        <DemoSection title="With FormField">
          <div className="max-w-sm space-y-4">
            <FormField label="Token" required>
              <Combobox options={TOKENS} placeholder="Select a token..." />
            </FormField>
            <FormField
              label="Region"
              helperText="Choose the closest region"
            >
              <Combobox options={REGIONS} placeholder="Select region..." />
            </FormField>
            <FormField label="Token" required error="Token is required">
              <Combobox options={TOKENS} error placeholder="Select a token..." />
            </FormField>
          </div>
        </DemoSection>
      </div>
    </>
  );
}
```

**Step 2: Add sidebar entry**

In `apps/preview/src/components/sidebar.tsx`, add Combobox to the Forms group (inside the `group: "Forms"` items array), after the Select entry:

```tsx
{ label: "Combobox", href: "/components/combobox" },
```

**Step 3: Verify visually**

Run: `pnpm dev` (from repo root)
Navigate to `/components/combobox` in the browser.
Ask the user to verify the page renders correctly.

**Step 4: Commit**

```bash
git add apps/preview/src/app/components/combobox/ apps/preview/src/components/sidebar.tsx
git commit -m "feat: add Combobox preview page"
```

---

### Task 8: Slider preview page

**Files:**
- Create: `apps/preview/src/app/components/slider/page.tsx`
- Modify: `apps/preview/src/components/sidebar.tsx` (add nav entry)

**Step 1: Create preview page**

```tsx
"use client";

import { useState } from "react";
import { Slider } from "@aleph-front/ds/slider";
import { FormField } from "@aleph-front/ds/form-field";
import { PageHeader } from "@preview/components/page-header";
import { DemoSection } from "@preview/components/demo-section";

export default function SliderPage() {
  const [volume, setVolume] = useState([50]);
  const [price, setPrice] = useState([250]);

  return (
    <>
      <PageHeader
        title="Slider"
        description="A range input for selecting a numeric value by dragging a thumb along a track."
      />

      <div className="space-y-12">
        <DemoSection title="Default">
          <div className="max-w-sm">
            <Slider defaultValue={[50]} />
          </div>
        </DemoSection>

        <DemoSection title="Sizes">
          <div className="max-w-sm space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Small</p>
              <Slider defaultValue={[30]} size="sm" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Medium</p>
              <Slider defaultValue={[70]} size="md" />
            </div>
          </div>
        </DemoSection>

        <DemoSection title="With tooltip">
          <div className="max-w-sm pt-6">
            <Slider defaultValue={[50]} showTooltip />
          </div>
        </DemoSection>

        <DemoSection title="Custom range & step">
          <div className="max-w-sm space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Step: 10 (0–100)
              </p>
              <Slider defaultValue={[50]} min={0} max={100} step={10} showTooltip />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Step: 50 (0–1000)
              </p>
              <Slider defaultValue={[500]} min={0} max={1000} step={50} showTooltip />
            </div>
          </div>
        </DemoSection>

        <DemoSection title="States">
          <div className="max-w-sm space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Disabled</p>
              <Slider defaultValue={[50]} disabled />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Error</p>
              <Slider defaultValue={[50]} error />
            </div>
          </div>
        </DemoSection>

        <DemoSection title="Controlled">
          <div className="max-w-sm space-y-6">
            <div>
              <Slider
                value={volume}
                onValueChange={setVolume}
                showTooltip
              />
              <p className="text-sm text-muted-foreground mt-2">
                Volume: {volume[0]}
              </p>
            </div>
            <div>
              <Slider
                min={0}
                max={1000}
                step={10}
                value={price}
                onValueChange={setPrice}
                showTooltip
              />
              <p className="text-sm text-muted-foreground mt-2">
                Price: ${price[0]}
              </p>
            </div>
          </div>
        </DemoSection>

        <DemoSection title="With FormField">
          <div className="max-w-sm space-y-4">
            <FormField label="Volume" helperText="Adjust the volume level">
              <Slider defaultValue={[50]} showTooltip />
            </FormField>
            <FormField label="Budget" error="Budget must be at least $100">
              <Slider
                min={0}
                max={1000}
                step={10}
                defaultValue={[50]}
                error
                showTooltip
              />
            </FormField>
          </div>
        </DemoSection>
      </div>
    </>
  );
}
```

**Step 2: Add sidebar entry**

In `apps/preview/src/components/sidebar.tsx`, add Slider to the Forms group, after the Combobox entry:

```tsx
{ label: "Slider", href: "/components/slider" },
```

**Step 3: Verify visually**

Run: `pnpm dev` (from repo root)
Navigate to `/components/slider` in the browser.
Ask the user to verify the page renders correctly.

**Step 4: Commit**

```bash
git add apps/preview/src/app/components/slider/ apps/preview/src/components/sidebar.tsx
git commit -m "feat: add Slider preview page"
```

---

### Task 9: Final checks and build verification

**Step 1: Run full check suite**

Run: `pnpm check` (lint + typecheck + test)
Expected: all pass

**Step 2: Build preview app**

Run: `pnpm build`
Expected: static export succeeds

**Step 3: Fix any build issues**

If the build fails, common issues:
- Missing `"use client"` directive on preview pages
- Import path issues with cmdk in Next.js — ensure `transpilePackages` in `apps/preview/next.config.ts` already includes `@aleph-front/ds` (it does, and cmdk is a dependency of the DS package so it will be resolved)

**Step 4: Commit fixes if any**

```bash
git add -u
git commit -m "fix: resolve build issues"
```

---

### Task 10: Update docs

- [ ] DESIGN-SYSTEM.md — add Combobox and Slider component entries (usage examples, props, variants)
- [ ] ARCHITECTURE.md — add cmdk wrapper pattern if it introduces a new architectural pattern worth documenting
- [ ] DECISIONS.md — log key decisions: cmdk for Combobox (not Radix, not Downshift), Radix Slider, simple tooltip (not Radix Tooltip), sm/md sizes matching Select
- [ ] BACKLOG.md — update form components item (mark Combobox + Slider as done)
- [ ] CLAUDE.md — add Combobox and Slider to Current Features list, update preview page count (22 pages)
