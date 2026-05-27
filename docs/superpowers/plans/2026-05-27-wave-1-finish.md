# Wave‑1 finish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle Pagination, Switch, Stepper, and Alert onto the Abyssal Void wave‑1 vocabulary — drop primary‑blue active states, swap Alert to semantic tokens with a top‑down gradient, swap Switch + Stepper indicators off `rounded-full`, bring Stepper indicators into the LED‑signature pattern, and close the wave.

**Architecture:** Five layers of change — (a) Pagination class restyle (no API change), (b) Switch radius swap (two CVA literals), (c) Stepper full restyle plus one additive API prop on `StepperConnector` (`completed?: boolean`) and an auto‑Check glyph in `StepperIndicator` when state is completed, (d) Alert token swap + `alert-bg-*` rewrite in `tokens.css` to use semantic tokens via `oklch(from var(--token) …)` with a 180deg gradient, (e) principle + doc updates capturing the rounded‑full reserved‑list shrink, the active‑states clause extension, and the light‑mode carve‑out generalisation. No new tokens, no new CSS classes, no new component variants.

**Tech Stack:** Tailwind CSS 4 with `@theme`, CVA, Radix UI primitives (Switch), Phosphor Icons (Check, CaretDoubleLeft, CaretLeft, CaretRight, CaretDoubleRight, XCircle), Vitest, oxlint, TypeScript.

**Spec:** `docs/superpowers/specs/2026-05-27-wave-1-finish-design.md`

**Integration branch:** `skin/paraplu`. This chunk lives on `skin/wave-1-finish` (already created off `skin/paraplu`), PRs into `skin/paraplu`, and squash-merges. It does NOT target main.

---

## File map

| File | What changes | Owner |
|---|---|---|
| `packages/ds/src/components/pagination/pagination.tsx` | `NAV_BUTTON`, `NAV_DISABLED`, `PAGE_BUTTON`, `PAGE_ACTIVE` constants (lines 81–105) + ellipsis className (line 167). All primary‑blue swapped to foreground/accent; numbers shrink to 26×26. | Task 2 |
| `packages/ds/src/components/switch/switch.tsx` | Two CVA strings: track `rounded-full` → `rounded-[2px]` (line 9), thumb `rounded-full` → `rounded-[2px]` (line 36). | Task 3 |
| `packages/ds/src/components/stepper/stepper.tsx` | Indicator base + state classes (lines 117–122), drop ring animation (lines 127–132), connector class + add `completed` prop (lines 189–209), import Check icon, auto‑Check on completed. | Task 4 |
| `packages/ds/src/components/stepper/stepper.test.tsx` | Update line 394–424 (`h-1`/`w-1` → `h-px`/`w-px`); add tests for `completed` prop + auto‑Check behavior. | Task 5 |
| `apps/preview/src/app/components/stepper/page.tsx` | Drop the preview‑only `ConnectorFill` workaround (lines 22–40), use new `<StepperConnector completed />` API and let `<StepperIndicator>` auto‑swap to Check. | Task 6 |
| `packages/ds/src/components/alert/alert.tsx` | `alertVariants` borders (lines 41–45), `labelVariants` text colors (lines 57–63), `progressVariants` bg (lines 70–74). Swap to semantic tokens + light‑mode carve‑out for label text. | Task 7 |
| `packages/ds/src/styles/tokens.css` | Rewrite `.alert-bg-*` classes (lines 301–341) — single 180deg gradient using `oklch(from var(--token) …)`, drop the dark‑mode override blocks. | Task 7 |
| `docs/SKIN-PRINCIPLES.md` | § 2 active‑states clause extension + carve‑out generalisation, § 4 reserved list update, § 6 Direction C extension to Stepper. | Task 9 |
| `docs/DESIGN-SYSTEM.md` | Refresh Pagination, Switch, Stepper, Alert entries; add `StepperConnector` `completed` prop doc; restate carve‑out. | Task 10 |
| `docs/ARCHITECTURE.md` | Note `StepperConnector` `completed` API addition + `StepperIndicator` auto‑Check; note `alert-bg-*` rewrite. | Task 10 |
| `docs/DECISIONS.md` | Decision #88 entry covering all four components, both rounded‑full removals, light‑mode carve‑out generalisation. | Task 10 |
| `docs/BACKLOG.md` | Move "Pagination active‑state recolor" to Completed; update "Rounded‑full audit" item (Switch + Stepper removed; MultiSelect chips + Slider thumb remaining). | Task 10 |
| `CLAUDE.md` | Update Current Features list for Pagination, Switch, Stepper, Alert. | Task 10 |

---

## Task 1: Verify branch + clean state

**Files:** None. Verification only.

- [ ] **Step 1: Confirm we're on `skin/wave-1-finish` off `skin/paraplu`**

```bash
cd /Users/dio/Library/CloudStorage/Dropbox/Claudio/repos/stasho-ds/.claude/worktrees/skin+paraplu
git status
git branch --show-current
git log --oneline -2
```

Expected: branch is `skin/wave-1-finish`. Most recent commit is `716b9ff docs(skin): spec wave-1 finish …`. Working tree clean (or expected workspace artifacts only — screenshots from prior chunks are fine to delete).

- [ ] **Step 2: Sync from origin (no‑op if already current)**

```bash
git fetch origin skin/paraplu
git log --oneline skin/paraplu..HEAD
```

Expected: HEAD ahead of `skin/paraplu` only by the spec commit (`716b9ff`).

---

## Task 2: Pagination restyle

**Files:**
- Modify: `packages/ds/src/components/pagination/pagination.tsx:81-105` (the four shared class constants)
- Modify: `packages/ds/src/components/pagination/pagination.tsx:167` (ellipsis className)

**Steps:**

- [ ] **Step 1: Replace the four class constants**

In `packages/ds/src/components/pagination/pagination.tsx`, find this block (around lines 81–105):

```ts
const NAV_BUTTON = [
  "inline-flex items-center justify-center",
  "size-8 rounded-none",
  "text-primary-600 dark:text-primary-400",
  "hover:bg-primary-100 dark:hover:bg-primary-200/10",
  "transition-colors cursor-pointer",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500",
].join(" ");

const NAV_DISABLED = "opacity-50 pointer-events-none";

const PAGE_BUTTON = [
  "inline-flex items-center justify-center",
  "size-8 rounded-none",
  "font-mono text-sm",
  "text-primary-600 dark:text-primary-400",
  "hover:bg-primary-100 dark:hover:bg-primary-200/10",
  "transition-colors cursor-pointer",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500",
].join(" ");

const PAGE_ACTIVE = [
  "bg-primary-400 text-white dark:bg-primary-600 dark:text-white",
  "hover:bg-primary-400 dark:hover:bg-primary-600",
].join(" ");
```

Replace with:

```ts
const NAV_BUTTON = [
  "inline-flex items-center justify-center",
  "size-8 rounded-none",
  "text-foreground/60 hover:text-accent-500 dark:hover:text-accent",
  "transition-colors cursor-pointer",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
].join(" ");

const NAV_DISABLED = "text-foreground/30 cursor-not-allowed";

const PAGE_BUTTON = [
  "inline-flex items-center justify-center",
  "size-[26px] rounded-none",
  "font-mono text-sm",
  "text-foreground/60 hover:text-accent-500 dark:hover:text-accent",
  "transition-colors cursor-pointer",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
].join(" ");

const PAGE_ACTIVE = [
  "bg-accent/15 text-accent-500 dark:text-accent",
  "hover:text-accent-500 dark:hover:text-accent",
].join(" ");
```

Changes:
- `NAV_BUTTON`: drop primary‑blue text + hover bg; foreground at 60% with cyan on hover; focus outline cyan
- `NAV_DISABLED`: swap opacity/pointer‑events for the wave‑1 disabled pattern
- `PAGE_BUTTON`: drop `size-8` for `size-[26px]`; same color treatment as nav (kept separate for readability)
- `PAGE_ACTIVE`: tinted cyan cell over inactive text/bg; preserve cyan on hover

- [ ] **Step 2: Update the ellipsis className**

Find around line 167:

```tsx
className="inline-flex items-center justify-center size-8 font-mono text-sm text-primary-600 dark:text-primary-400 select-none"
```

Replace with:

```tsx
className="inline-flex items-center justify-center size-[26px] font-mono text-sm text-foreground/40 select-none"
```

Changes: `size-8` → `size-[26px]` (matches numbers); drop primary‑blue; quiet at 40% foreground.

- [ ] **Step 3: Run Pagination tests**

```bash
cd /Users/dio/Library/CloudStorage/Dropbox/Claudio/repos/stasho-ds/.claude/worktrees/skin+paraplu
npm run test -- pagination
```

Expected: all existing tests pass. (Tests target behavior/accessibility, not classes — class swaps don't affect them.)

- [ ] **Step 4: Run lint + typecheck**

```bash
npm run lint
npm run typecheck
```

Expected: clean exit on both. If any oxlint warnings on the modified file, fix before moving on.

- [ ] **Step 5: Commit**

```bash
git add packages/ds/src/components/pagination/pagination.tsx
git commit -m "feat(skin): pagination — tinted cyan active pill, cyan hover, wave-1 disabled"
```

---

## Task 3: Switch radius swap

**Files:**
- Modify: `packages/ds/src/components/switch/switch.tsx:9` (track `rounded-full` → `rounded-[2px]`)
- Modify: `packages/ds/src/components/switch/switch.tsx:36` (thumb `rounded-full` → `rounded-[2px]`)

**Steps:**

- [ ] **Step 1: Swap track radius**

In `packages/ds/src/components/switch/switch.tsx`, find line 9:

```ts
    "items-center rounded-full",
```

Replace with:

```ts
    "items-center rounded-[2px]",
```

- [ ] **Step 2: Swap thumb radius**

Find line 36:

```ts
    "pointer-events-none block rounded-full",
```

Replace with:

```ts
    "pointer-events-none block rounded-[2px]",
```

- [ ] **Step 3: Run Switch tests**

```bash
npm run test -- switch
```

Expected: all existing tests pass.

- [ ] **Step 4: Commit**

```bash
git add packages/ds/src/components/switch/switch.tsx
git commit -m "feat(skin): switch — square track + square thumb (rounded-[2px])"
```

---

## Task 4: Stepper restyle + `StepperConnector` `completed` prop + auto‑Check

**Files:**
- Modify: `packages/ds/src/components/stepper/stepper.tsx` — multiple edits across the file

**Steps:**

- [ ] **Step 1: Add Check icon import**

In `packages/ds/src/components/stepper/stepper.tsx`, add the import after the existing imports (around line 9):

```ts
import { Check } from "@phosphor-icons/react";
```

The file already has the React imports + `cn` import. Place this directly after them.

- [ ] **Step 2: Rewrite `StepperIndicator`**

Find the existing `StepperIndicator` block (lines 105–139):

```tsx
const StepperIndicator = forwardRef<HTMLDivElement, StepperIndicatorProps>(
  ({ className, children, ...rest }, ref) => {
    const { state } = useStepperItemContext();
    return (
      <div
        ref={ref}
        data-state={state}
        className={cn(
          "relative flex size-8 items-center justify-center rounded-full",
          "font-heading text-sm font-bold",
          "border-2 border-edge text-muted-foreground",
          "data-[state=active]:border-primary-500 data-[state=active]:bg-primary-500 data-[state=active]:text-white",
          "data-[state=completed]:border-primary-500 data-[state=completed]:bg-primary-500 data-[state=completed]:text-white",
          "transition-all duration-300 motion-reduce:transition-colors",
          className,
        )}
        {...rest}
      >
        {state === "active" && (
          <>
            <span className="absolute -inset-1 rounded-full border-2 border-primary-400/35 animate-[ring-wave_2.4s_ease-in-out_infinite] motion-reduce:animate-none" />
            <span className="absolute -inset-1.5 rounded-full border border-primary-300/25 animate-[ring-wave_2.4s_ease-in-out_-1.2s_infinite] motion-reduce:animate-none" />
          </>
        )}
        {children}
      </div>
    );
  },
);
```

Replace with:

```tsx
const StepperIndicator = forwardRef<HTMLDivElement, StepperIndicatorProps>(
  ({ className, children, ...rest }, ref) => {
    const { state } = useStepperItemContext();
    return (
      <div
        ref={ref}
        data-state={state}
        className={cn(
          "relative flex size-8 items-center justify-center rounded-[2px]",
          "font-sans text-sm font-semibold",
          "border border-edge text-foreground/45 bg-transparent",
          "data-[state=active]:border-accent data-[state=active]:text-accent-500 dark:data-[state=active]:text-accent",
          "data-[state=active]:shadow-[0_0_6px_rgba(0,225,250,0.5),0_0_14px_rgba(0,225,250,0.3)]",
          "data-[state=completed]:border-accent data-[state=completed]:bg-accent data-[state=completed]:text-neutral-950",
          "transition-all duration-200 motion-reduce:transition-colors",
          className,
        )}
        {...rest}
      >
        {state === "completed" ? (
          <Check weight="bold" className="size-4" aria-hidden="true" />
        ) : (
          children
        )}
      </div>
    );
  },
);
```

Changes:
- `rounded-full` → `rounded-[2px]`
- `font-heading text-sm font-bold` → `font-sans text-sm font-semibold` (Decision #83)
- `border-2 border-edge text-muted-foreground` → `border border-edge text-foreground/45 bg-transparent` (1px hairline)
- Active: primary‑blue solid → cyan hairline + halo (LED‑as‑signature at indicator scale)
- Completed: primary‑blue solid → cyan solid chip + dark glyph (matches Checkbox glyph color per Decision #85)
- Transition: 300ms → 200ms (matches the ease curve range in § 5)
- Removed the two `<span class="animate-[ring-wave_…]">` elements entirely
- Completed renders `<Check />` instead of `{children}`; other states render `{children}` unchanged

- [ ] **Step 3: Rewrite `StepperConnector` with `completed` prop**

Find the existing `StepperConnector` block (lines 189–210):

```tsx
type StepperConnectorProps = HTMLAttributes<HTMLLIElement>;

const StepperConnector = forwardRef<HTMLLIElement, StepperConnectorProps>(
  ({ className, ...rest }, ref) => {
    const { orientation } = useStepperContext();
    return (
      <li
        ref={ref}
        aria-hidden="true"
        data-orientation={orientation}
        className={cn(
          "relative overflow-hidden rounded-full bg-edge/50 flex-1",
          orientation === "horizontal" ? "h-1" : "w-1",
          className,
        )}
        {...rest}
      />
    );
  },
);
```

Replace with:

```tsx
type StepperConnectorProps = HTMLAttributes<HTMLLIElement> & {
  /** Mark the connector as filled (cyan) — used between two consecutive completed steps. */
  completed?: boolean;
};

const StepperConnector = forwardRef<HTMLLIElement, StepperConnectorProps>(
  ({ className, completed, ...rest }, ref) => {
    const { orientation } = useStepperContext();
    return (
      <li
        ref={ref}
        aria-hidden="true"
        data-orientation={orientation}
        data-completed={completed ? "" : undefined}
        className={cn(
          "relative overflow-hidden flex-1 bg-edge data-[completed]:bg-accent transition-colors",
          orientation === "horizontal" ? "h-px" : "w-px",
          className,
        )}
        {...rest}
      />
    );
  },
);
```

Changes:
- Adds `completed?: boolean` to props
- Renders `data-completed=""` (Tailwind selector matches presence, not value) when `completed` is true; omits attribute otherwise
- Drops `rounded-full` (invisible at 1px)
- Changes `bg-edge/50` (50% opacity) → `bg-edge` (full hairline) + `data-[completed]:bg-accent` for the cyan fill state
- Drops `h-1`/`w-1` (4px) → `h-px`/`w-px` (1px hairline rule)
- Adds `transition-colors` so the state change animates with the connected step's state change

- [ ] **Step 4: Quick visual sanity in the existing test file**

Tests for the new behavior are added in Task 5. For now, just run the existing tests to surface any breakage from the `h-1`/`w-1` → `h-px`/`w-px` change:

```bash
npm run test -- stepper
```

Expected: the existing `"applies h-1 for horizontal and w-1 for vertical"` test FAILS (because the classes are now `h-px`/`w-px`). All other tests pass. Note the failure — Task 5 fixes the test.

- [ ] **Step 5: Run lint + typecheck**

```bash
npm run lint
npm run typecheck
```

Expected: clean exit. Type system should pick up the new `completed?: boolean` prop on `StepperConnectorProps`.

- [ ] **Step 6: Commit (without test updates yet — those are Task 5 to keep the API change atomic and the test fix scoped)**

```bash
git add packages/ds/src/components/stepper/stepper.tsx
git commit -m "feat(skin): stepper — square indicators, cyan halo on active, filled completed chip, StepperConnector completed prop"
```

---

## Task 5: Update Stepper tests for new hairline + new completed prop

**Files:**
- Modify: `packages/ds/src/components/stepper/stepper.test.tsx:394-424` (update the h‑1/w‑1 assertion)
- Modify: `packages/ds/src/components/stepper/stepper.test.tsx` (add new tests for `completed` prop and auto‑Check)

**Steps:**

- [ ] **Step 1: Update the existing h‑1/w‑1 assertion to h‑px/w‑px**

Find the test starting around line 394:

```tsx
  it("applies h-1 for horizontal and w-1 for vertical", () => {
```

Replace the test name and the two assertions (lines 394 + 408 + 423). The full updated test:

```tsx
  it("applies h-px for horizontal and w-px for vertical", () => {
    const { rerender } = render(
      <Stepper aria-label="Steps">
        <StepperList>
          <StepperItem>
            <StepperLabel>One</StepperLabel>
          </StepperItem>
          <StepperConnector data-testid="conn" />
          <StepperItem>
            <StepperLabel>Two</StepperLabel>
          </StepperItem>
        </StepperList>
      </Stepper>,
    );
    expect(screen.getByTestId("conn").className).toContain("h-px");

    rerender(
      <Stepper orientation="vertical" aria-label="Steps">
        <StepperList>
          <StepperItem>
            <StepperLabel>One</StepperLabel>
          </StepperItem>
          <StepperConnector data-testid="conn" />
          <StepperItem>
            <StepperLabel>Two</StepperLabel>
          </StepperItem>
        </StepperList>
      </Stepper>,
    );
    expect(screen.getByTestId("conn").className).toContain("w-px");
  });
```

- [ ] **Step 2: Add tests for `StepperConnector` `completed` prop**

Inside the existing `describe("StepperConnector", () => { … })` block (ends around line 425), add these tests right before the closing `});`:

```tsx
  it("omits data-completed when completed is not set", () => {
    render(
      <Stepper aria-label="Steps">
        <StepperList>
          <StepperItem>
            <StepperLabel>One</StepperLabel>
          </StepperItem>
          <StepperConnector data-testid="conn" />
          <StepperItem>
            <StepperLabel>Two</StepperLabel>
          </StepperItem>
        </StepperList>
      </Stepper>,
    );
    expect(screen.getByTestId("conn")).not.toHaveAttribute("data-completed");
  });

  it("sets data-completed when completed prop is true", () => {
    render(
      <Stepper aria-label="Steps">
        <StepperList>
          <StepperItem state="completed">
            <StepperLabel>One</StepperLabel>
          </StepperItem>
          <StepperConnector data-testid="conn" completed />
          <StepperItem state="completed">
            <StepperLabel>Two</StepperLabel>
          </StepperItem>
        </StepperList>
      </Stepper>,
    );
    expect(screen.getByTestId("conn")).toHaveAttribute("data-completed", "");
  });
```

- [ ] **Step 3: Add tests for `StepperIndicator` auto‑Check on completed**

Inside the existing `describe("StepperIndicator", () => { … })` block (ends around line 267), add right before the closing `});`:

```tsx
  it("renders children when state is inactive", () => {
    render(
      <Stepper aria-label="Steps">
        <StepperList>
          <StepperItem state="inactive">
            <StepperIndicator>5</StepperIndicator>
          </StepperItem>
        </StepperList>
      </Stepper>,
    );
    expect(screen.getByText("5")).toBeTruthy();
  });

  it("renders children when state is active", () => {
    render(
      <Stepper aria-label="Steps">
        <StepperList>
          <StepperItem state="active">
            <StepperIndicator>5</StepperIndicator>
          </StepperItem>
        </StepperList>
      </Stepper>,
    );
    expect(screen.getByText("5")).toBeTruthy();
  });

  it("replaces children with Check icon when state is completed", () => {
    render(
      <Stepper aria-label="Steps">
        <StepperList>
          <StepperItem state="completed">
            <StepperIndicator data-testid="indicator">5</StepperIndicator>
          </StepperItem>
        </StepperList>
      </Stepper>,
    );
    // The number "5" should not appear as text since it's replaced by the icon
    expect(screen.queryByText("5")).toBeNull();
    // The indicator should contain an SVG (the Check icon)
    expect(screen.getByTestId("indicator").querySelector("svg")).toBeTruthy();
  });
```

- [ ] **Step 4: Run tests**

```bash
npm run test -- stepper
```

Expected: all Stepper tests pass (the renamed h‑px/w‑px test plus the three new completed/Check tests).

- [ ] **Step 5: Commit**

```bash
git add packages/ds/src/components/stepper/stepper.test.tsx
git commit -m "test(stepper): cover completed prop on StepperConnector and auto-Check on StepperIndicator; update hairline assertion"
```

---

## Task 6: Update Stepper preview page to use the new API

**Files:**
- Modify: `apps/preview/src/app/components/stepper/page.tsx` (drop preview‑only `ConnectorFill` workaround; use new API throughout)

**Steps:**

- [ ] **Step 1: Delete the `ConnectorFill` workaround component**

In `apps/preview/src/app/components/stepper/page.tsx`, find and delete this block (around lines 20–40):

```tsx
/* ── Preview-only enhancement (not part of DS) ─── */

function ConnectorFill({
  filled,
  vertical = false,
}: {
  filled: boolean;
  vertical?: boolean;
}) {
  return (
    <span
      className={
        "absolute inset-0 rounded-full bg-primary-500/70 " +
        "transition-transform duration-500 ease-out motion-reduce:transition-none " +
        (vertical
          ? `origin-top ${filled ? "scale-y-100" : "scale-y-0"}`
          : `origin-left ${filled ? "scale-x-100" : "scale-x-0"}`)
      }
    />
  );
}
```

Also remove the leading "use client" line's neighbor block comment if it isolates these lines. Keep the `getStepState` helper that follows.

- [ ] **Step 2: Update all `<StepperConnector>…</StepperConnector>` usages to use the new API**

Find each `<StepperConnector><ConnectorFill filled … /></StepperConnector>` in the file:

```tsx
<StepperConnector>
  <ConnectorFill filled />
</StepperConnector>
```

Replace with:

```tsx
<StepperConnector completed />
```

And each `<StepperConnector><ConnectorFill filled={false} … /></StepperConnector>`:

```tsx
<StepperConnector>
  <ConnectorFill filled={false} />
</StepperConnector>
```

Replace with:

```tsx
<StepperConnector />
```

For vertical orientations keep any `className="ml-4 my-1 min-h-6"` consumer styling, just drop the `<ConnectorFill>` child:

```tsx
<StepperConnector className="ml-4 my-1 min-h-6" completed />
```

(Adjust `completed` per the step state of the surrounding steps.)

Also update the dynamic `<Fragment>` block in `InteractiveStepper` (around lines 75–79):

```tsx
{i < DEPLOY_STEPS.length - 1 && (
  <StepperConnector>
    <ConnectorFill filled={i < step} />
  </StepperConnector>
)}
```

Replace with:

```tsx
{i < DEPLOY_STEPS.length - 1 && (
  <StepperConnector completed={i < step} />
)}
```

- [ ] **Step 3: Simplify the `<StepperIndicator>` content (auto‑Check makes the manual swap redundant)**

Find every `<StepperIndicator>{i < step ? <Check size={14} weight="bold" /> : i + 1}</StepperIndicator>` and similar patterns where the Check icon is manually rendered for completed steps.

In `InteractiveStepper` (around line 67):

```tsx
<StepperIndicator>
  {i < step ? <Check size={14} weight="bold" /> : i + 1}
</StepperIndicator>
```

Replace with:

```tsx
<StepperIndicator>{i + 1}</StepperIndicator>
```

In the "Horizontal (default)" demo (around line 125):

```tsx
<StepperIndicator>
  <Check size={14} weight="bold" />
</StepperIndicator>
```

Replace with:

```tsx
<StepperIndicator>1</StepperIndicator>
```

(The number is what the indicator would show if it weren't completed; the auto‑Check replaces it. Passing the number documents the step ordering for readers of the demo.)

In the "Vertical" demo (around lines 152, 164):

```tsx
<StepperIndicator>
  <Check size={14} weight="bold" />
</StepperIndicator>
```

Replace with:

```tsx
<StepperIndicator>1</StepperIndicator>
```

(and `2` for the second completed step in that demo.)

- [ ] **Step 4: Remove the `Check` import if it's no longer used**

If the `Check` import on line 4 is no longer referenced anywhere in the file, remove it:

```tsx
import { Check } from "@phosphor-icons/react";
```

If `InteractiveStepper`'s reset path or any other section still uses Check directly, keep it.

- [ ] **Step 5: Run lint + typecheck on the preview app**

```bash
npm run lint
npm run typecheck
```

Expected: clean exit. `ConnectorFill` removal + simplification should reduce lines and warning surface.

- [ ] **Step 6: Commit**

```bash
git add apps/preview/src/app/components/stepper/page.tsx
git commit -m "chore(preview): adopt StepperConnector completed prop and StepperIndicator auto-Check"
```

---

## Task 7: Alert restyle + `alert-bg-*` rewrite

**Files:**
- Modify: `packages/ds/src/components/alert/alert.tsx` (`alertVariants` borders, `labelVariants` text colors, `progressVariants` bg)
- Modify: `packages/ds/src/styles/tokens.css:298-341` (rewrite all four `.alert-bg-*` classes; drop the four `.theme-dark` override blocks)

**Steps:**

- [ ] **Step 1: Update `alertVariants` borders**

In `packages/ds/src/components/alert/alert.tsx`, find the `alertVariants` block (around lines 31–51):

```ts
const alertVariants = cva(
  [
    "relative overflow-hidden rounded-none border",
    "px-3 py-2",
    "transition-all duration-200",
    "motion-reduce:transition-none",
  ].join(" "),
  {
    variants: {
      variant: {
        warning: "border-warning-400",
        error: "border-error-300",
        info: "border-primary-300",
        success: "border-success-400",
      },
    },
    defaultVariants: {
      variant: "warning",
    },
  },
);
```

Replace the four variant border classes (keep the base array and defaults unchanged):

```ts
      variant: {
        warning: "border-warning",
        error: "border-error",
        info: "border-accent",
        success: "border-success",
      },
```

Changes: scale steps → semantic tokens. Info moves from primary‑blue to cyan accent.

- [ ] **Step 2: Update `labelVariants` text colors**

Find the `labelVariants` block (around lines 53–65):

```ts
const labelVariants = cva(
  "font-mono uppercase tracking-wider text-[11px] leading-normal pb-1",
  {
    variants: {
      variant: {
        warning: "text-warning-600 dark:text-warning-300",
        error: "text-error-600 dark:text-error-300",
        info: "text-primary-600 dark:text-primary-300",
        success: "text-success-600 dark:text-success-300",
      },
    },
  },
);
```

Replace the four variant colors:

```ts
      variant: {
        warning: "text-warning-500 dark:text-warning",
        error: "text-error-500 dark:text-error",
        info: "text-accent-500 dark:text-accent",
        success: "text-success-500 dark:text-success",
      },
```

Changes: light‑mode uses `<token>-500` scale step for AA contrast on white; dark‑mode uses the semantic same‑hex token directly. Info moves from primary to cyan.

- [ ] **Step 3: Update `progressVariants` bg**

Find the `progressVariants` block (around lines 67–76):

```ts
const progressVariants = cva("absolute bottom-0 left-0 h-0.5", {
  variants: {
    variant: {
      warning: "bg-warning-400",
      error: "bg-error-400",
      info: "bg-primary-400",
      success: "bg-success-400",
    },
  },
});
```

Replace the four variant bg classes:

```ts
const progressVariants = cva("absolute bottom-0 left-0 h-0.5", {
  variants: {
    variant: {
      warning: "bg-warning",
      error: "bg-error",
      info: "bg-accent",
      success: "bg-success",
    },
  },
});
```

- [ ] **Step 4: Rewrite the `.alert-bg-*` CSS classes in `tokens.css`**

In `packages/ds/src/styles/tokens.css`, find the block starting around line 298 (the comment `/* ── Alert gradient backgrounds ──────── */`) and ending at line 341 (closes the `.theme-dark` override blocks).

Replace the entire block (lines 298–341) with:

```css
/* ── Alert gradient backgrounds ──────────────────────── */
/* Variant hue concentrated at top, fading toward background */

.alert-bg-warning {
  background:
    linear-gradient(
      180deg,
      oklch(from var(--warning) l c h / 0.18),
      oklch(from var(--warning) l c h / 0.06)
    ),
    var(--background);
}
.alert-bg-error {
  background:
    linear-gradient(
      180deg,
      oklch(from var(--error) l c h / 0.18),
      oklch(from var(--error) l c h / 0.06)
    ),
    var(--background);
}
.alert-bg-info {
  background:
    linear-gradient(
      180deg,
      oklch(from var(--accent) l c h / 0.18),
      oklch(from var(--accent) l c h / 0.06)
    ),
    var(--background);
}
.alert-bg-success {
  background:
    linear-gradient(
      180deg,
      oklch(from var(--success) l c h / 0.18),
      oklch(from var(--success) l c h / 0.06)
    ),
    var(--background);
}
```

Changes:
- Direction: `90deg` (left→right) → `180deg` (top→bottom)
- Opacity ramp: single 10%/15% → 18% at top, 6% at baseline
- Token source: scale steps (`--color-warning-400` / `-600`) → semantic tokens (`--warning`, `--error`, `--accent`, `--success`) via `oklch(from … )`
- Info: primary → accent
- Dark‑mode override blocks removed entirely — the single gradient lands on `var(--background)` which shifts per theme, so the perceived strength scales naturally

- [ ] **Step 5: Run Alert tests + lint + typecheck**

```bash
npm run test -- alert
npm run lint
npm run typecheck
```

Expected: all existing Alert tests pass (no behavior change). Lint and typecheck clean.

- [ ] **Step 6: Commit**

```bash
git add packages/ds/src/components/alert/alert.tsx packages/ds/src/styles/tokens.css
git commit -m "feat(skin): alert — semantic tokens, top→bottom gradient, cyan info variant"
```

---

## Task 8: Visual verification in dev server

**Files:** None. Manual visual check.

- [ ] **Step 1: Start dev server**

```bash
npm run dev
```

Note the localhost URL (typically `http://localhost:3000`).

- [ ] **Step 2: Walk each component page and confirm visual behavior in both themes**

Open the URL in a browser and visit, then toggle the theme switcher (top‑right) and re‑check each page:

- `/components/pagination` — confirm:
  - Numbers are 26×26, nav arrows 32×32
  - Active page is a tinted cyan cell, no border
  - Inactive numbers are 60% foreground; hover turns them cyan with no bg
  - Disabled nav arrows are 30% foreground with not‑allowed cursor
  - Ellipsis is 40% foreground

- `/components/switch` — confirm:
  - Track and thumb are square (`rounded-[2px]`)
  - Thumb is cyan when on, neutral when off
  - Thumb glow appears on hover/focus of the on state
  - Disabled looks flat (no glow, no bevel)
  - All three sizes (xs/sm/md) look right

- `/components/stepper` — confirm:
  - Indicators are square (`rounded-[2px]`)
  - Inactive: hairline frame, quiet 45% text
  - Active: cyan hairline frame + cyan halo, text is cyan
  - Completed: solid cyan chip with dark Check glyph (number replaced)
  - Connector between completed steps is a thin cyan line
  - Connector between non‑completed steps is a thin edge‑color line
  - No ring animation around active step
  - Vertical orientation works the same

- `/components/alert` — confirm:
  - All four variants render with their semantic border colors
  - Background is a top‑down gradient (brighter at top, fading down)
  - Info variant is cyan (not blue)
  - Variant label text is visible in both light and dark modes (carve‑out working)
  - Progress bar at the bottom is the variant color
  - Auto‑dismiss + manual dismiss both still work

- `/` (overview) — spot‑check Pagination + Switch + Alert + Stepper compositions if any exist; nothing should look broken.

- [ ] **Step 3: Take screenshots for the PR (optional)**

If documenting for the PR, screenshot before/after of at least one alert and one stepper. Skip if not needed.

- [ ] **Step 4: Stop dev server**

```
Ctrl+C in the dev terminal
```

No commit for this task — verification only.

---

## Task 9: Update SKIN‑PRINCIPLES.md

**Files:**
- Modify: `docs/SKIN-PRINCIPLES.md` — § 2 (Active states clause + carve‑out generalisation), § 4 (rounded‑full reserved list shrink), § 6 (Direction C extension to Stepper)

**Steps:**

- [ ] **Step 1: Update § 2 — Active states clause**

In `docs/SKIN-PRINCIPLES.md`, find the "Active states." paragraph in § 2 (currently mentions Switch, Slider, Checkbox, Radio, active Tab, active Breadcrumb, ProgressBar). Replace it with:

```markdown
**Active states.** Selected / checked / active states on form controls, navigation, and informational surfaces use `--accent`. Components: Switch, Slider, Checkbox, Radio, active Tab, active Breadcrumb, ProgressBar, **Pagination current page**, **Stepper active + completed indicators**, **Alert `info` variant**. Primary's chassis role (Button only) is preserved. **Light-mode body text carve-out:** saturated semantic tokens at mid lightness (cyan L≈0.84, amber L≈0.83, teal L≈0.78) fail AA contrast on light surfaces. UI text colored by these tokens uses the `<token>-500` scale step in light mode: `text-accent-500 dark:text-accent`, `text-warning-500 dark:text-warning`, `text-success-500 dark:text-success`, `text-error-500 dark:text-error`. Borders and tinted backgrounds (`bg-<token>/15`) stay same-hex — those are chassis surfaces that lean on accent text on top of them to carry the active signal.
**Source:** Decisions #86, #88.
```

Changes from current:
- Adds Pagination, Stepper, Alert info to the active‑state list
- Carve‑out generalisation: `warning` / `success` / `error` join `accent` on the light‑mode scale‑step pattern
- Updates source line to add #88

- [ ] **Step 2: Update § 4 — rounded‑full reserved list**

Find the "`full` is for round-by-design only" subsection in § 4. Replace its reserved‑list block:

Current:
```markdown
- StatusDot (a dot IS round)
- Slider thumb / Switch thumb (a control puck IS round)
- ProgressBar track (the rounded ends are a graph convention)
- MultiSelect tag chips (tags carry "soft / removable" semantics) — **flagged for audit**
- Stepper indicators (a step ring IS round) — **flagged for audit**
```

Replace with:

```markdown
- StatusDot (a dot IS round)
- Slider thumb (a control puck IS round — same convention argument as Switch, but the visual difference at 16px between square and round thumb is functionally invisible AND Slider thumb shipped with `rounded-full` in chunk 4 as part of the bevel + LED treatment; kept for now, flagged for the rounded-full audit chunk)
- ProgressBar track (the rounded ends are a graph convention)
- MultiSelect tag chips (tags carry "soft / removable" semantics) — **still flagged for audit**
```

Removed: Switch thumb, Stepper indicators.

Update the "Source:" line at the bottom of that subsection:

Current:
```markdown
**Source:** Decision #86 (Tabs pill removed). MultiSelect chips and Stepper indicators carry the same convention-only justification that Tabs pill did and should be revisited in a dedicated rounded-full audit chunk after chunk 5 ships.
```

Replace with:

```markdown
**Source:** Decisions #86 (Tabs pill removed), #88 (Switch track + thumb removed; Stepper indicators removed). MultiSelect chips and Slider thumb carry the same convention-only justification and should be revisited in a dedicated rounded-full audit chunk.
```

- [ ] **Step 3: Update § 6 — Direction C scope extends to Stepper**

Find the "Direction C — LED scales by role, not by size" subsection in § 6. Update its **Rule** and **How** lines to mention Stepper:

Current **Rule** line:
```markdown
**Rule:** The LED treatment extends to small "on/active" states selectively. Glow is reserved for components where the lit element IS the active surface (Switch thumb, Slider thumb, ProgressBar fill). Slot/text indicators (Checkbox check, Radio dot, active Tab text, active Pagination number, active Breadcrumb) stay flat-cyan — they're markers on a surface, not lit surfaces themselves.
```

Replace with:

```markdown
**Rule:** The LED treatment extends to small "on/active" states selectively. Glow is reserved for components where the lit element IS the active surface (Switch thumb, Slider thumb, ProgressBar fill, **Stepper active indicator**). Slot/text indicators (Checkbox check, Radio dot, active Tab text, active Pagination number, active Breadcrumb, **Stepper completed indicator**) stay flat-cyan — they're markers on a surface, not lit surfaces themselves.
```

Current **How** line ends with:
```markdown
**How:** Switch and Slider thumbs gain `box-shadow: 0 0 5px var(--accent), 0 0 10px rgba(0,225,250,0.6)` on hover/focus only (solid cyan at rest). Switch and Slider tracks carry the same inset bevel as Button (`inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.4)`). Checkbox / Radio / Tabs / Pagination / Breadcrumb cyan states are flat. Disabled cascades for these components require compound variants (`disabled:data-[state=checked]:*` or `data-[disabled]:*` for Radix `<span>`-rendered parts) so the sink wins over the checked-accent rules.
```

Replace with:

```markdown
**How:** Switch and Slider thumbs gain `box-shadow: 0 0 5px var(--accent), 0 0 10px rgba(0,225,250,0.6)` on hover/focus only (solid cyan at rest). Stepper active indicators carry a persistent halo `box-shadow: 0 0 6px rgba(0,225,250,0.5), 0 0 14px rgba(0,225,250,0.3)` (the indicator IS the "you are here" beacon, so the halo is rest‑state, not hover‑state). Switch and Slider tracks carry the same inset bevel as Button (`inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.4)`). Checkbox / Radio / Tabs / Pagination / Breadcrumb cyan states are flat, as are Stepper completed indicators (solid cyan chip carries the state alone). Disabled cascades for these components require compound variants (`disabled:data-[state=checked]:*` or `data-[disabled]:*` for Radix `<span>`-rendered parts) so the sink wins over the checked-accent rules.
```

Update the **Source** line:

Current:
```markdown
**Source:** Decision #85.
```

Replace with:

```markdown
**Source:** Decisions #85, #88.
```

- [ ] **Step 4: Commit principle updates**

```bash
git add docs/SKIN-PRINCIPLES.md
git commit -m "docs(skin): SKIN-PRINCIPLES — active-states + carve-out + rounded-full list + Direction C for Stepper"
```

---

## Task 10: Update DESIGN‑SYSTEM, ARCHITECTURE, DECISIONS, BACKLOG, CLAUDE.md

**Files:**
- Modify: `docs/DESIGN-SYSTEM.md` (Pagination, Switch, Stepper, Alert entries; carve‑out note)
- Modify: `docs/ARCHITECTURE.md` (`StepperConnector` API note; `alert-bg-*` rewrite note)
- Modify: `docs/DECISIONS.md` (add Decision #88)
- Modify: `docs/BACKLOG.md` (move Pagination active‑state recolor to Completed; update Rounded‑full audit)
- Modify: `CLAUDE.md` (Current Features list)

**Steps:**

- [ ] **Step 1: DESIGN-SYSTEM.md — refresh component entries**

Open `docs/DESIGN-SYSTEM.md`. Locate the entries for Pagination, Switch, Stepper, Alert. For each, update the props/variant/behavior description to match the new spec.

Key updates per component:

**Pagination:** Update the description to note the tinted‑cyan active cell (`bg-accent/15` + `text-accent-500 dark:text-accent`), the 26×26 number / 32×32 nav size differentiation, the wave‑1 disabled pattern (`text-foreground/30 cursor-not-allowed`), and the no‑bg hover behavior.

**Switch:** Update geometry note from "rounded-full" to "rounded-[2px]" on both track and thumb. Mention the rest of the chassis (bevel, cyan thumb at on, hover/focus glow) is unchanged from chunk 4.

**Stepper:** Update indicator shape ("rounded-[2px]"), font ("Inter Semibold, was Anybody Bold"), active treatment ("cyan hairline + persistent halo"), completed treatment ("solid cyan chip with auto‑rendered Check glyph — number is replaced"), connector treatment ("1px hairline; pass `completed` prop on `<StepperConnector />` between two consecutive completed steps to fill cyan"). Document the new prop:
```
<StepperConnector completed />  // fills cyan between completed steps
<StepperConnector />            // edge color (default)
```

**Alert:** Update bg description ("top→bottom gradient, 18% at top fading to 6% at baseline, semantic‑token sourced"), info variant note ("info uses cyan accent, not primary‑blue, to avoid competing with Button chassis"), variant label color note (mention the light‑mode carve‑out for all four variants).

Add a short note in the "Patterns" or "Tokens" section restating the carve‑out generalisation:

```markdown
### Light-mode carve-out for semantic text colors

Saturated semantic tokens (`--accent`, `--warning`, `--success`, `--error`) fail AA contrast on light surfaces. When using these tokens for UI text, apply the `<token>-500` scale step in light mode:

- `text-accent-500 dark:text-accent`
- `text-warning-500 dark:text-warning`
- `text-success-500 dark:text-success`
- `text-error-500 dark:text-error`

Borders, background fills, and tinted-surface utilities (`bg-<token>/15`) stay same-hex — the carve-out applies only to text where the token is the foreground color on a near-white background.
```

(Place near the existing chunk‑6 / chunk‑5 token documentation.)

- [ ] **Step 2: ARCHITECTURE.md — note Stepper API + Alert bg rewrite**

In `docs/ARCHITECTURE.md`, find the Stepper section. Add a note about the new `completed` prop on `StepperConnector`:

```markdown
**Connector completed state:** `<StepperConnector completed />` renders `data-completed=""` and fills the connector cyan (`bg-accent`). Consumers pass the prop between two consecutive completed steps to show progress. The connector does not derive `completed` from adjacent items — it would require either DOM inspection (fragile) or a third context — so the prop stays explicit at the call site.

**Indicator auto-Check:** When the surrounding `StepperItem` has `state="completed"`, `StepperIndicator` renders a Phosphor `<Check weight="bold" />` icon instead of its `children`. Consumers who pass numeric labels get the swap for free; consumers who need a custom completed glyph can render their own component inside `StepperItem` and inspect `state` externally (the same state value they pass into the item is already in their hands).
```

For Alert, find the relevant section (or add one if no Alert section exists). Add:

```markdown
**Alert `alert-bg-*` classes:** The four variant backgrounds are CSS classes in `tokens.css` rather than Tailwind utilities because the gradient stops use `oklch(from var(--token) l c h / opacity)` syntax which Tailwind's scanner cannot extract from class strings. Each class renders a 180deg gradient layered on `var(--background)` — 18% opacity at the top, 6% at the baseline. The single gradient works in both themes because the underlying `--background` swaps per theme; no `.theme-dark` override block is needed. To add a new variant: add the class in `tokens.css` and add a key to the component's `VARIANT_BG_CLASS` map.
```

- [ ] **Step 3: DECISIONS.md — add Decision #88**

Open `docs/DECISIONS.md`. At the top (after the "How Decisions Are Logged" header), insert a new entry:

```markdown
## Decision #88 — 2026-05-27

**Context:** After chunks 1–6 shipped, four components remained on pre-Abyssal or partly-Abyssal vocabulary: Pagination (primary-blue active state — last component leaking primary into a non-Button role), Switch (chassis on-skin from chunk 4 but track + thumb on the `rounded-full` convention-only justification that Tabs pill lost in chunk 5), Stepper (pre-Abyssal in nearly every dimension — 2px border, Anybody indicator font, primary-blue active + completed fills, primary-tinted ring animation), and Alert (scale-step tokens — `border-warning-400`, `text-warning-600 dark:text-warning-300`, `bg-warning-400`, etc. — and primary-blue info variant). Brainstorming settled six questions: Pagination active style, Switch radius, Stepper indicator emphasis, Alert info variant, Alert background, and Stepper API impact.
**Decision:** Adopt the wave-1 vocabulary on all four. **Pagination:** active page is a tinted cyan cell (`bg-accent/15 text-accent-500 dark:text-accent`), no border. Numbers drop to 26×26; nav arrows stay 32×32; both share quiet `text-foreground/60` rest + `text-accent-500 dark:text-accent` hover with no bg. Ellipsis at `text-foreground/40`. Focus `outline-2 outline-accent outline-offset-2`. Disabled nav swaps `opacity-50 pointer-events-none` for the wave-1 `text-foreground/30 cursor-not-allowed` pattern. **Switch:** track and thumb both `rounded-[2px]`. Everything else from chunk 4 stays (bevel, cyan thumb at on, hover/focus glow, disabled flatten). **Stepper:** indicator is `rounded-[2px] size-8 border border-edge text-foreground/45 bg-transparent`, Inter Semibold (was Anybody Bold). Active = cyan hairline + persistent halo `box-shadow: 0 0 6px rgba(0,225,250,0.5), 0 0 14px rgba(0,225,250,0.3)` + `text-accent-500 dark:text-accent`. Completed = solid cyan chip (`bg-accent`) with dark Check glyph (`text-neutral-950`, matches Checkbox glyph color per Decision #85) — `StepperIndicator` auto-renders `<Check />` instead of `{children}` when state is completed. The two `animate-[ring-wave_…]` rings around the active step are dropped entirely; the halo carries the active signal alone. `StepperConnector` gains a `completed?: boolean` prop — renders `data-completed=""` to fill the connector cyan (`bg-accent`) between two consecutive completed steps. Connector also drops from `h-1`/`w-1` (4px) to `h-px`/`w-px` (1px hairline). **Alert:** borders + variant labels + progress bar all swap from scale steps to semantic tokens. Info variant moves from primary-blue to cyan accent. `.alert-bg-*` CSS classes rewritten in place: direction `90deg` → `180deg`, opacity ramp single-step → `18% → 6%`, token source scale steps → semantic via `oklch(from var(--token) l c h / opacity)`. Dark-mode override blocks dropped (the single gradient lands on `var(--background)` which already shifts per theme). Light-mode carve-out for variant label text uses `text-<token>-500 dark:text-<token>` for AA contrast on white — generalised from the cyan-only pattern in Decision #86 to all four semantic accents. **SKIN-PRINCIPLES updates:** § 2 active-states clause adds Pagination, Stepper, Alert info; carve-out generalisation restated across all four semantic colors. § 4 rounded-full reserved list shrinks — Switch (track + thumb) and Stepper indicators removed. Final reserved list: StatusDot, Slider thumb (kept for now with the same convention-only justification — flagged for the rounded-full audit chunk), ProgressBar track, MultiSelect tag chips (still flagged). § 6 Direction C ("LED scales by role") extends to Stepper — active indicator gets the halo (it IS the "you are here" beacon, a lit surface), completed indicator stays flat-cyan (a marker on a surface).
**Rationale:** Each component. **Pagination tinted-pill active** — outlined hairline chip (the prior backlog spec) would compete with Tabs pill chrome shipped in chunk 5; tinted cyan cell echoes the Tabs pill indicator vocabulary and keeps Pagination quiet. Numbers shrink to 26×26 to distinguish from 32×32 nav, giving the number range a denser scan-able read; nav arrows keep the 32×32 touch target for boundary navigation. No bg on hover (only text color shifts) matches the "no chrome" character of Direction B from the brainstorm. **Switch square radius** — hardware reference (aviation toggle switches, audio rocker hardware) points square; the iOS/Material round convention was the only argument for keeping `rounded-full`, and that's the same convention argument Tabs pill lost in Decision #86. Bevel + cyan LED + glow already carry the "control" reading; rounding adds nothing. **Stepper LED-as-signature** — Direction C "LED scales by role" was extended because the step indicator IS lit when active (it's both a number marker and a "you are here" beacon), satisfying the rule. Completed stays flat (cyan chip carries the state alone; another halo per completed step in a 7-step wizard would create the bloom budget problem Direction C was designed to avoid). Auto-Check on completed gives consumers a free upgrade (numbers get swapped for them); custom completed glyphs stay accessible via wrapping `StepperItem` externally. `StepperConnector` `completed` prop is explicit at the call site rather than derived from adjacent siblings — DOM inspection is fragile, a third context would over-engineer the component for one boolean, and the connector is already a sibling of `StepperItem` (not a child) so context wouldn't reach it cleanly. The two ring animations were dropped because the halo carries the active signal alone — two ring borders + a halo would triple the active-state cue and one of them was leaking primary-blue. **Alert info cyan** — frees the alert family from competing with Button's primary-blue chassis whenever a Primary button sits near an info Alert. Cyan also fits info's role (the "live / listening" alarm hue is exactly what cyan signals in this skin). **Alert top→bottom gradient** — concentrates the variant hue at the top where the eye lands first (variant label band), reads as "atmospheric tint settling onto the surface" rather than the prior left→right "sweep across." The single 18%→6% ramp works in both modes because it lands on `var(--background)` — the dark-mode override block was a workaround for the scale-step gradient that's no longer needed with `oklch(from --token …)` since the semantic tokens are the same hex in both modes. **Light-mode carve-out generalisation** — the same logic that drove `text-accent-500 dark:text-accent` in Decision #86 applies to warning (L≈0.83, fails AA on white), success (L≈0.78, marginal), and error (L≈0.63, mostly OK but consistent treatment is honest). Borders and tinted-bg utilities stay same-hex because contrast against a saturated chassis or against any background is fine at the saturated hex — the carve-out is specific to text where the token IS the foreground on a near-white field. **Rounded-full reserved list shrinks** — § 4's rule is "round-by-design only, never round-by-convention." Switch (track + thumb) and Stepper indicators both sat on convention; with this chunk the rule is enforced. Slider thumb stays for now on the same convention-only justification but with the extra defence that the bevel + LED treatment at 16px makes the round/square visual difference functionally invisible — flagged for the dedicated rounded-full audit chunk.
**Alternatives considered:** Pagination outlined hairline chip (rejected — chrome competes with Tabs pill; tinted cell stays calm). Pagination cyan underline like Tabs underline variant (rejected — no chip means no size differentiation between numbers and nav; the number range loses scan-ability). Pagination number size at 32×32 to keep parity with nav (rejected — the size delta is the spec's affordance for "current cell" reading). Switch capsule track + square thumb (rejected — thumb corners read misaligned against round endcaps). Switch keep round on iOS/Material precedent (rejected — same convention-only argument Tabs pill lost). Stepper restrained tinted (active + completed both `bg-accent/15`, no halo — rejected because the two-state differentiation between active and completed gets lost). Stepper bar + dots (12px round dots replace numbered chips — rejected because it loses the numbered-step affordance for multi-step wizards). Stepper keep ring animation around active step with cyan tint (rejected — the halo carries the active signal cleanly; two ring borders + halo triples the cue for no gain). Stepper completed renders both number + Check (rejected — visually noisy; replacement is honest). `StepperConnector` derives `completed` from adjacent siblings via DOM inspection (rejected — fragile, requires post-render measurement). `StepperConnector` reads adjacent state via a third React context (rejected — over-engineering for one boolean). Alert info keep primary-blue as the "brand info" alert (rejected — two saturated blues on screen when a Primary button sits near an Info alert muddles hierarchy). Alert solid constant-opacity wash instead of gradient (rejected — drops the only decorative element giving Alert visual interest at its size; gradient direction change addressed the prior "sweep across" complaint). Alert left→right gradient kept (rejected on visual review — top→down concentrates the alarm hue where the eye lands first). Carve-out only for `accent` (rejected — warning and success share the same mid-lightness AA problem; generalising the rule is honest). Bundle Slider thumb into this chunk's rounded-full removal (rejected — Slider thumb's bevel + LED treatment at 16px makes the change visually invisible AND the dedicated rounded-full audit chunk is the better place to handle MultiSelect chips + Slider thumb together).
---
```

Place this entry above the existing Decision #87 entry.

- [ ] **Step 4: BACKLOG.md updates**

Open `docs/BACKLOG.md`.

Find the "Pagination active‑state recolor" item under Open Items. Delete that block from Open Items and add to the Completed section (inside the `<details>` block at the bottom):

```markdown
- [x] 2026-05-27 — Wave-1 finish: Pagination + Switch + Stepper + Alert (Decision #88: Pagination tinted-cyan active pill + 26×26 numbers + wave-1 disabled; Switch square track + square thumb; Stepper square indicators + cyan halo on active + filled completed chip with auto-Check + StepperConnector `completed` prop; Alert semantic tokens + top→bottom gradient + cyan info; SKIN-PRINCIPLES § 2 active-states + carve-out generalisation, § 4 rounded-full list shrinks, § 6 Direction C extends to Stepper)
```

Find the "Rounded-full audit" item. Replace its Description with:

```markdown
**Description:** § 4 reserved list after Decision #88 keeps: StatusDot, Slider thumb (kept for now on the same convention-only justification but with the defence that bevel + LED at 16px make the round/square visual difference functionally invisible), ProgressBar track, MultiSelect tag chips (still flagged). This chunk reviews Slider thumb and MultiSelect tag chips and decides whether each keeps `rounded-full` with a stronger semantic justification or moves to `rounded-[2px]`. Single chunk: `skin/rounded-full-audit` off `skin/paraplu`.
```

- [ ] **Step 5: CLAUDE.md — Current Features list**

Open `CLAUDE.md`. Find the Current Features list. Update the entries for:

**Pagination:** Replace the existing entry text with:
```markdown
- Pagination component with controlled API (`page`/`onPageChange`), configurable `siblingCount` (default 1), `showFirstLast` toggle, fixed-slot `buildPageRange()` function (always `2*siblingCount+5` items, no layout shift), position-keyed slots (no DOM flicker), `aria-disabled` boundary nav, `aria-current="page"` active state, `forwardRef` to `<nav>`, Departure Mono text-sm page numbers and ellipsis, 26×26 numbers + 32×32 nav arrows, tinted-cyan active cell (`bg-accent/15` + `text-accent-500 dark:text-accent`), quiet `text-foreground/60` rest with cyan hover (no bg), wave-1 disabled pattern (`text-foreground/30 cursor-not-allowed`)
```

**Switch:** Replace the existing entry text with (preserving everything else, just swapping the `rounded-full` references):
```markdown
- Switch component (Radix UI) with 3 sizes (xs/sm/md), square track (`rounded-[2px]`) + square thumb (`rounded-[2px]`), bevel track (`inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.4)`) per SKIN-PRINCIPLES § 5, neutral `bg-edge` thumb off / cyan `bg-accent` thumb on, thumb gains glow on hover/focus of parent via `group/sw` named group (Direction C — solid at rest, glow on interaction), `outline-2 outline-accent outline-offset-2` focus, flat-sink disabled with compound `group-disabled/sw:data-[state=checked]:bg-foreground/30` so disabled+on shows grey thumb
```

**Stepper:** Replace the existing entry text with:
```markdown
- Stepper compound component with composable 7-part API (Stepper, StepperList, StepperItem, StepperIndicator, StepperLabel, StepperDescription, StepperConnector), horizontal/vertical orientation via `StepperContext`, step state propagation (completed/active/inactive) via `StepperItemContext`, `data-state`/`data-orientation` attributes for consumer styling, `aria-current="step"` on active item, semantic `nav > ol > li` markup. Indicator: square (`rounded-[2px]`) `size-8` hairline-edge chassis with Inter Semibold text; active = cyan hairline + persistent halo (`0 0 6px rgba(0,225,250,0.5), 0 0 14px rgba(0,225,250,0.3)`); completed = solid cyan chip with auto-rendered `<Check />` icon replacing `{children}`. Connector: 1px hairline (`h-px`/`w-px`) `bg-edge` default; pass `completed` prop to fill `bg-accent` between two consecutive completed steps.
```

**Alert:** Replace the existing entry text with:
```markdown
- Alert component with 4 semantic variants (warning/error/info/success), optional title, dismissible with XCircle button and exit animation, auto-dismiss timer with progress bar, auto-styled links (bold, underline, ↗ icon via ::after), 1px hairline border using semantic tokens (`border-warning`, `border-error`, `border-accent` for info, `border-success`), top→bottom gradient backgrounds at 18% → 6% opacity using `oklch(from var(--token) …)` semantic-token source with dark mode handled by `var(--background)` swap, variant label uses Departure Mono UC tracking-wider with light-mode carve-out (`text-warning-500 dark:text-warning` etc.) for AA contrast, info variant uses cyan accent (not primary-blue) to avoid competing with Button chassis
```

- [ ] **Step 6: Commit all doc updates**

```bash
git add docs/DESIGN-SYSTEM.md docs/ARCHITECTURE.md docs/DECISIONS.md docs/BACKLOG.md CLAUDE.md
git commit -m "docs(skin): wave-1 finish — Decision #88, design-system + architecture + backlog + CLAUDE.md updates"
```

---

## Task 11: Final check + push

**Files:** None.

- [ ] **Step 1: Full check**

```bash
npm run check
```

Expected: lint + typecheck + test all pass on both workspaces. Any failures must be resolved before opening the PR.

- [ ] **Step 2: Build preview app**

```bash
npm run build
```

Expected: static export completes cleanly. If any build errors surface (typically from a Tailwind class that's been removed somewhere consumers still reference), fix them and re‑run.

- [ ] **Step 3: Confirm final commit log**

```bash
git log --oneline skin/paraplu..HEAD
```

Expected log (in order, most recent first):
1. `docs(skin): wave-1 finish — Decision #88, design-system + architecture + backlog + CLAUDE.md updates`
2. `docs(skin): SKIN-PRINCIPLES — active-states + carve-out + rounded-full list + Direction C for Stepper`
3. `feat(skin): alert — semantic tokens, top→bottom gradient, cyan info variant`
4. `chore(preview): adopt StepperConnector completed prop and StepperIndicator auto-Check`
5. `test(stepper): cover completed prop on StepperConnector and auto-Check on StepperIndicator; update hairline assertion`
6. `feat(skin): stepper — square indicators, cyan halo on active, filled completed chip, StepperConnector completed prop`
7. `feat(skin): switch — square track + square thumb (rounded-[2px])`
8. `feat(skin): pagination — tinted cyan active pill, cyan hover, wave-1 disabled`
9. `docs(skin): spec wave-1 finish — Pagination · Switch · Stepper · Alert`

- [ ] **Step 4: Push branch**

```bash
git push -u origin skin/wave-1-finish
```

---

## Task 12: Open PR into `skin/paraplu`

**Files:** None. PR creation only.

- [ ] **Step 1: Open the PR with `gh`**

```bash
gh pr create --base skin/paraplu --title "feat(skin): wave-1 finish — Pagination · Switch · Stepper · Alert" --body "$(cat <<'EOF'
## Summary

- Pagination: drop primary-blue active/hover/focus; active page becomes a tinted cyan cell (`bg-accent/15` + `text-accent-500 dark:text-accent`); numbers shrink to 26×26 to distinguish from 32×32 nav; wave-1 disabled pattern.
- Switch: track + thumb both `rounded-[2px]` (was `rounded-full`). Chassis vocabulary from chunk 4 (bevel, cyan thumb glow) unchanged.
- Stepper: square indicators (`rounded-[2px]`), Inter Semibold (was Anybody Bold), 1px hairline (was 2px). Active = cyan hairline + persistent halo. Completed = solid cyan chip with auto-rendered Check glyph (replaces `{children}`). Two-ring active animation dropped — halo carries the signal alone. `StepperConnector` gains `completed?: boolean` prop (`data-completed=""` → `bg-accent`). Connector also drops from 4px to 1px hairline.
- Alert: borders + variant labels + progress bar swap to semantic tokens. Info variant moves from primary-blue to cyan accent. `.alert-bg-*` rewritten — single 180deg gradient (18% top → 6% bottom) using `oklch(from var(--token) …)`; dark-mode override blocks removed.
- SKIN-PRINCIPLES updates: § 2 active-states clause adds the three new components + carve-out generalisation across all four semantic colors. § 4 rounded-full reserved list removes Switch (track + thumb) and Stepper indicators. § 6 Direction C extends to Stepper.

Decision #88. Spec: `docs/superpowers/specs/2026-05-27-wave-1-finish-design.md`. Plan: `docs/superpowers/plans/2026-05-27-wave-1-finish.md`.

## Test plan

- [ ] `npm run check` passes (lint + typecheck + test, both workspaces)
- [ ] `npm run build` passes (preview static export)
- [ ] Visual: `/components/pagination` — tinted cyan active cell, 26/32 size split, cyan hover, disabled nav at 30% foreground
- [ ] Visual: `/components/switch` — square track + thumb in all 3 sizes; thumb glow on hover/focus of on state
- [ ] Visual: `/components/stepper` — square indicators; cyan halo on active step; solid cyan chip + Check on completed; cyan-fill connector between completed steps; no ring animation; vertical orientation OK
- [ ] Visual: `/components/alert` — all 4 variants in both themes; info reads cyan (not blue); top→bottom gradient visible; variant label readable in light mode (carve-out)
- [ ] Visual: `/` overview — no regressions in composed blocks
EOF
)"
```

Expected: PR URL printed. Note it for the squash-merge step.

- [ ] **Step 2: Merge after review**

After review approval:

```bash
gh pr merge <pr-number> --squash --delete-branch
```

- [ ] **Step 3: Sync `skin/paraplu` worktree**

```bash
git checkout skin/paraplu
git pull --ff-only origin skin/paraplu
git branch -D skin/wave-1-finish
```

- [ ] **Step 4: Clean up brainstorm artifacts (optional)**

The `.superpowers/brainstorm/` directory is gitignored. To free disk space:

```bash
ls .superpowers/brainstorm/
# Remove the session directory used during this chunk if you don't want to keep it
```
