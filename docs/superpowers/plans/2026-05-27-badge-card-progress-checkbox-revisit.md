# Badge · Card · ProgressBar · Checkbox revisit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply wave-1 followup polish across Badge (flat saturated solid + tinted-hairline outline at 2px radius, info → cyan), Card (always-on `border-edge` hairline on default variant), ProgressBar (`bg-primary` → `bg-accent` + beveled track, no glow), Checkbox + Radio cascade (rest `bg-background dark:bg-surface`, sizes 14/16/20, `rounded-none` cleanup, Phosphor `<Check />`).

**Architecture:** Five-component CVA refresh with paired test updates per component (TDD red phase). Component changes are independent — each gets its own commit. Doc fanout bundles at the end. No new tokens, no new components, no API changes.

**Tech Stack:** Tailwind CSS 4, CVA (class-variance-authority), Radix UI primitives (`Checkbox`, `RadioGroup`), Phosphor Icons (`@phosphor-icons/react`), Vitest + Testing Library, oxlint, TypeScript 5.9, Next.js 16 preview app.

**Spec:** `docs/superpowers/specs/2026-05-27-badge-card-progress-checkbox-revisit-design.md`

**Integration branch:** `skin/paraplu`. This chunk lives on `skin/badge-card-progress-checkbox` (created off `skin/paraplu` at Task 1), PRs into `skin/paraplu`, and squash-merges. Does NOT target main.

---

## File map

| File | What changes | Owner |
|---|---|---|
| `packages/ds/src/components/badge/badge.tsx` | Rewrite `compoundVariants` end-to-end (5 variants × 2 fills = 10 entries); base `rounded-none` → `rounded-[2px]`. | Tasks 2–3 |
| `packages/ds/src/components/badge/badge.test.tsx` | Rewrite class-presence tests for new tokens; add light-mode `-500` carve-out coverage. | Tasks 2–3 |
| `packages/ds/src/components/card/card.tsx` | Add `border border-edge` to `default` variant. | Tasks 4–5 |
| `packages/ds/src/components/card/card.test.tsx` | Add hairline assertion. | Tasks 4–5 |
| `packages/ds/src/components/progress-bar/progress-bar.tsx` | Track: `bg-surface` → `bg-muted dark:bg-neutral-900` + bevel shadow. Fill: `bg-primary` → `bg-accent`. | Tasks 6–7 |
| `packages/ds/src/components/progress-bar/progress-bar.test.tsx` | Add class-presence tests for the new tokens. | Tasks 6–7 |
| `packages/ds/src/components/checkbox/checkbox.tsx` | Base array adds `bg-background dark:bg-surface`. Sizes: `size-4/5/6` → `size-3.5/4/5`, all `rounded-none`. Replace inline `<svg>` with Phosphor `<Check />`. | Tasks 8–9 |
| `packages/ds/src/components/checkbox/checkbox.test.tsx` | Add size + rest-fill class assertions; assert Check icon renders. | Tasks 8–9 |
| `packages/ds/src/components/radio-group/radio-group.tsx` | Base array adds `bg-background dark:bg-surface`. Sizes: same shrink as Checkbox. | Tasks 10–11 |
| `packages/ds/src/components/radio-group/radio-group.test.tsx` | Mirror Checkbox class assertions. | Tasks 10–11 |
| `apps/preview/src/app/components/{badge,card,progress-bar,checkbox,radio-group}/page.tsx` | Visual verification only — no API change. | Task 12 |
| `docs/SKIN-PRINCIPLES.md` | § 4 chip-row split + radii-table cleanup; § 6 Direction C amendment for ProgressBar fill. | Task 13 |
| `docs/DESIGN-SYSTEM.md` | Refresh Badge, Card, ProgressBar, Checkbox, RadioGroup sections. | Task 14 |
| `docs/DECISIONS.md` | Prepend Decision #90. | Task 15 |
| `docs/BACKLOG.md` | Add Switch ladder + Switch focus pattern follow-ups. | Task 15 |
| `CLAUDE.md` | Refresh Current Features entries (5 components). | Task 15 |

---

## Task 1: Verify branch + create chunk branch

**Files:** None.

- [ ] **Step 1: Confirm we're in the integration worktree on `skin/paraplu`**

```bash
cd /Users/dio/Library/CloudStorage/Dropbox/Claudio/repos/stasho-ds/.claude/worktrees/skin+paraplu
git status
git branch --show-current
git log --oneline -3
```

Expected: branch is `skin/paraplu`. Most recent commit is `eccfa73 docs(skin): spec — Badge · Card · ProgressBar · Checkbox revisit`. Working tree may carry a stray `apps/preview/next-env.d.ts` modification (Next.js auto-regen — ignore).

If `skin/paraplu` is behind origin, sync first:

```bash
git pull --ff-only origin skin/paraplu
```

- [ ] **Step 2: Create + checkout the chunk branch**

```bash
git checkout -b skin/badge-card-progress-checkbox
git branch --show-current
```

Expected: branch is `skin/badge-card-progress-checkbox`.

No commit. Branch setup only.

---

## Task 2: Badge — failing tests (red phase)

**Files:**
- Modify: `packages/ds/src/components/badge/badge.test.tsx` (rewrite the `describe("fill=solid (default)", …)` and `describe("fill=outline", …)` blocks; update the `describe("badgeVariants export", …)` block; update the `applies rounded-none` test under `describe("base styles", …)`).

**Steps:**

- [ ] **Step 1: Replace the `fill=solid` block with new assertions**

In `packages/ds/src/components/badge/badge.test.tsx`, find:

```tsx
  describe("fill=solid (default)", () => {
    it("applies gradient-fill-info for default variant", () => {
      const { container } = render(<Badge>Label</Badge>);
      expect(container.firstElementChild?.className).toContain(
        "gradient-fill-info",
      );
    });

    it("applies gradient-fill-success for success variant", () => {
      const { container } = render(
        <Badge variant="success">Label</Badge>,
      );
      expect(container.firstElementChild?.className).toContain(
        "gradient-fill-success",
      );
    });

    it("applies gradient-fill-warning for warning variant", () => {
      const { container } = render(
        <Badge variant="warning">Label</Badge>,
      );
      expect(container.firstElementChild?.className).toContain(
        "gradient-fill-warning",
      );
    });

    it("applies gradient-fill-error for error variant", () => {
      const { container } = render(
        <Badge variant="error">Label</Badge>,
      );
      expect(container.firstElementChild?.className).toContain(
        "gradient-fill-error",
      );
    });

    it("applies neutral bg for info variant", () => {
      const { container } = render(
        <Badge variant="info">Label</Badge>,
      );
      const cls = container.firstElementChild?.className ?? "";
      expect(cls).toContain("bg-neutral-100");
      expect(cls).not.toContain("gradient-fill");
    });
  });
```

Replace with:

```tsx
  describe("fill=solid (default)", () => {
    it("default solid uses bg-muted + text-foreground", () => {
      const { container } = render(<Badge>Label</Badge>);
      const cls = container.firstElementChild?.className ?? "";
      expect(cls).toContain("bg-muted");
      expect(cls).toContain("text-foreground");
      expect(cls).not.toContain("gradient-fill");
    });

    it("success solid uses bg-success + text-neutral-950", () => {
      const { container } = render(<Badge variant="success">Label</Badge>);
      const cls = container.firstElementChild?.className ?? "";
      expect(cls).toContain("bg-success");
      expect(cls).toContain("text-neutral-950");
    });

    it("warning solid uses bg-warning + text-neutral-950", () => {
      const { container } = render(<Badge variant="warning">Label</Badge>);
      const cls = container.firstElementChild?.className ?? "";
      expect(cls).toContain("bg-warning");
      expect(cls).toContain("text-neutral-950");
    });

    it("error solid uses bg-error + text-neutral-950", () => {
      const { container } = render(<Badge variant="error">Label</Badge>);
      const cls = container.firstElementChild?.className ?? "";
      expect(cls).toContain("bg-error");
      expect(cls).toContain("text-neutral-950");
    });

    it("info solid uses bg-accent + text-neutral-950", () => {
      const { container } = render(<Badge variant="info">Label</Badge>);
      const cls = container.firstElementChild?.className ?? "";
      expect(cls).toContain("bg-accent");
      expect(cls).toContain("text-neutral-950");
    });

    it("no solid variant carries a gradient-fill class", () => {
      for (const variant of [
        "default",
        "success",
        "warning",
        "error",
        "info",
      ] as const) {
        const { container } = render(<Badge variant={variant}>L</Badge>);
        expect(container.firstElementChild?.className).not.toContain(
          "gradient-fill",
        );
      }
    });
  });
```

- [ ] **Step 2: Replace the `fill=outline` block with new assertions**

Find:

```tsx
  describe("fill=outline", () => {
    it("applies border class", () => {
      const { container } = render(
        <Badge fill="outline">Label</Badge>,
      );
      expect(container.firstElementChild?.className).toContain("border");
    });

    it("applies border-success-400 for success variant", () => {
      const { container } = render(
        <Badge fill="outline" variant="success">Label</Badge>,
      );
      expect(container.firstElementChild?.className).toContain(
        "border-success-400",
      );
    });

    it("applies border-error-400 for error variant", () => {
      const { container } = render(
        <Badge fill="outline" variant="error">Label</Badge>,
      );
      expect(container.firstElementChild?.className).toContain(
        "border-error-400",
      );
    });

    it("applies border-primary-300 for default variant", () => {
      const { container } = render(
        <Badge fill="outline" variant="default">Label</Badge>,
      );
      expect(container.firstElementChild?.className).toContain(
        "border-primary-300",
      );
    });

    it("does not apply gradient-fill classes", () => {
      const { container } = render(
        <Badge fill="outline" variant="success">Label</Badge>,
      );
      expect(container.firstElementChild?.className).not.toContain(
        "gradient-fill",
      );
    });
  });
```

Replace with:

```tsx
  describe("fill=outline", () => {
    it("applies the 1px border class", () => {
      const { container } = render(<Badge fill="outline">Label</Badge>);
      expect(container.firstElementChild?.className).toContain("border");
    });

    it("default outline uses border-edge + foreground/70 text", () => {
      const { container } = render(
        <Badge fill="outline" variant="default">Label</Badge>,
      );
      const cls = container.firstElementChild?.className ?? "";
      expect(cls).toContain("border-edge");
      expect(cls).toContain("text-foreground/70");
      expect(cls).not.toContain("border-primary");
    });

    it("success outline uses bg-success/15 + border-success/40 + text-success-500 dark:text-success", () => {
      const { container } = render(
        <Badge fill="outline" variant="success">Label</Badge>,
      );
      const cls = container.firstElementChild?.className ?? "";
      expect(cls).toContain("bg-success/15");
      expect(cls).toContain("border-success/40");
      expect(cls).toContain("text-success-500");
      expect(cls).toContain("dark:text-success");
    });

    it("warning outline uses bg-warning/15 + border-warning/40 + text-warning-500 dark:text-warning", () => {
      const { container } = render(
        <Badge fill="outline" variant="warning">Label</Badge>,
      );
      const cls = container.firstElementChild?.className ?? "";
      expect(cls).toContain("bg-warning/15");
      expect(cls).toContain("border-warning/40");
      expect(cls).toContain("text-warning-500");
      expect(cls).toContain("dark:text-warning");
    });

    it("error outline uses bg-error/15 + border-error/40 + text-error-500 dark:text-error", () => {
      const { container } = render(
        <Badge fill="outline" variant="error">Label</Badge>,
      );
      const cls = container.firstElementChild?.className ?? "";
      expect(cls).toContain("bg-error/15");
      expect(cls).toContain("border-error/40");
      expect(cls).toContain("text-error-500");
      expect(cls).toContain("dark:text-error");
    });

    it("info outline uses bg-accent/15 + border-accent/40 + text-accent-500 dark:text-accent", () => {
      const { container } = render(
        <Badge fill="outline" variant="info">Label</Badge>,
      );
      const cls = container.firstElementChild?.className ?? "";
      expect(cls).toContain("bg-accent/15");
      expect(cls).toContain("border-accent/40");
      expect(cls).toContain("text-accent-500");
      expect(cls).toContain("dark:text-accent");
    });

    it("does not apply gradient-fill classes", () => {
      const { container } = render(
        <Badge fill="outline" variant="success">Label</Badge>,
      );
      expect(container.firstElementChild?.className).not.toContain(
        "gradient-fill",
      );
    });
  });
```

- [ ] **Step 3: Update the rounded-none assertion to rounded-[2px]**

Find:

```tsx
    it("applies rounded-none", () => {
      const { container } = render(<Badge>Label</Badge>);
      expect(container.firstElementChild?.className).toContain("rounded-none");
    });
```

Replace with:

```tsx
    it("applies rounded-[2px]", () => {
      const { container } = render(<Badge>Label</Badge>);
      expect(container.firstElementChild?.className).toContain("rounded-[2px]");
    });
```

- [ ] **Step 4: Update the badgeVariants export test**

Find:

```tsx
  describe("badgeVariants export", () => {
    it("accepts fill parameter", () => {
      const cls = badgeVariants({ fill: "outline", variant: "success" });
      expect(cls).toContain("border");
      expect(cls).toContain("border-success-400");
    });
  });
```

Replace with:

```tsx
  describe("badgeVariants export", () => {
    it("accepts fill parameter and emits semantic-token border", () => {
      const cls = badgeVariants({ fill: "outline", variant: "success" });
      expect(cls).toContain("border");
      expect(cls).toContain("border-success/40");
    });
  });
```

- [ ] **Step 5: Run the badge tests and confirm new tests FAIL, plus the rewritten existing tests FAIL**

```bash
cd /Users/dio/Library/CloudStorage/Dropbox/Claudio/repos/stasho-ds/.claude/worktrees/skin+paraplu
npm run test -- badge
```

Expected: most tests in the rewritten blocks fail (the current impl still emits `gradient-fill-*` and `border-success-400`, not `bg-success` and `border-success/40`). The base-style `rounded-[2px]` test fails. Tests outside the rewritten blocks (icons, children rendering, ref forwarding) still pass.

If the file doesn't compile (TypeScript error): stop and fix the compile error before continuing.

- [ ] **Step 6: Commit the failing tests (TDD red phase)**

```bash
git add packages/ds/src/components/badge/badge.test.tsx
git commit -m "test(badge): red — flat saturated solid, tinted hairline outline, 2px radius"
```

---

## Task 3: Badge — implementation (green phase)

**Files:**
- Modify: `packages/ds/src/components/badge/badge.tsx`.

**Steps:**

- [ ] **Step 1: Rewrite the entire `badgeVariants` block**

Open `packages/ds/src/components/badge/badge.tsx` and replace the existing `badgeVariants` declaration (currently lines 5–105) with:

```tsx
const badgeVariants = cva(
  [
    "inline-flex items-center justify-center gap-1.5",
    "rounded-[2px] font-mono uppercase tracking-wider",
    "whitespace-nowrap select-none",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "",
        success: "",
        warning: "",
        error: "",
        info: "",
      },
      fill: {
        solid: "",
        outline: "border",
      },
      size: {
        sm: "px-3 py-0.5 text-[10px]",
        md: "px-4 py-1 text-xs",
      },
    },
    compoundVariants: [
      // ── SOLID ─────────────────────────────────────────
      {
        fill: "solid",
        variant: "default",
        className: "bg-muted text-foreground",
      },
      {
        fill: "solid",
        variant: "success",
        className: "bg-success text-neutral-950",
      },
      {
        fill: "solid",
        variant: "warning",
        className: "bg-warning text-neutral-950",
      },
      {
        fill: "solid",
        variant: "error",
        className: "bg-error text-neutral-950",
      },
      {
        fill: "solid",
        variant: "info",
        className: "bg-accent text-neutral-950",
      },
      // ── OUTLINE ───────────────────────────────────────
      {
        fill: "outline",
        variant: "default",
        className: "bg-transparent border-edge text-foreground/70",
      },
      {
        fill: "outline",
        variant: "success",
        className:
          "bg-success/15 border-success/40 text-success-500 dark:text-success",
      },
      {
        fill: "outline",
        variant: "warning",
        className:
          "bg-warning/15 border-warning/40 text-warning-500 dark:text-warning",
      },
      {
        fill: "outline",
        variant: "error",
        className:
          "bg-error/15 border-error/40 text-error-500 dark:text-error",
      },
      {
        fill: "outline",
        variant: "info",
        className:
          "bg-accent/15 border-accent/40 text-accent-500 dark:text-accent",
      },
    ],
    defaultVariants: {
      variant: "default",
      fill: "solid",
      size: "md",
    },
  },
);
```

Key changes:
- Base class swaps `rounded-none` → `rounded-[2px]`.
- All `gradient-fill-*` classes removed.
- All scale-step tokens (`-100`, `-300`, `-400`, `-900/20`) replaced with semantic tokens + opacity modifiers.
- Default-outline drops `border-primary-300` → `border-edge`.
- Info both fills move to `--accent` (cyan).
- Light-mode text uses `text-{token}-500 dark:text-{token}` per Decision #88 carve-out (all four semantic variants).
- The rest of the file (Badge component, exports) is unchanged.

- [ ] **Step 2: Run the badge tests and confirm all pass**

```bash
npm run test -- badge
```

Expected: all badge tests pass. The 14+ rewritten/new assertions + the icon/render/ref tests should all be green.

If any test fails: read the failure, fix the regression. Do not loosen tests — match the class names in `badge.tsx` to whatever the failing assertion expects.

- [ ] **Step 3: Run lint + typecheck**

```bash
npm run lint
npm run typecheck
```

Expected: clean exit.

- [ ] **Step 4: Commit the implementation**

```bash
git add packages/ds/src/components/badge/badge.tsx
git commit -m "feat(skin): badge — flat solid + tinted hairline outline at 2px, info → cyan"
```

---

## Task 4: Card — failing test (red phase)

**Files:**
- Modify: `packages/ds/src/components/card/card.test.tsx`.

**Steps:**

- [ ] **Step 1: Add hairline + default-variant assertions**

In `packages/ds/src/components/card/card.test.tsx`, insert the following tests immediately before the closing `});` of the `describe("Card", …)` block (after the `omits title heading when not provided` test):

```tsx
  it("default variant carries the bg-surface chassis", () => {
    const { container } = render(<Card>Test</Card>);
    expect(container.firstElementChild?.className).toContain("bg-surface");
  });

  it("default variant carries a 1px border-edge hairline", () => {
    const { container } = render(<Card>Test</Card>);
    const cls = container.firstElementChild?.className ?? "";
    expect(cls).toContain("border");
    expect(cls).toContain("border-edge");
  });

  it("ghost variant has no border", () => {
    const { container } = render(<Card variant="ghost">Test</Card>);
    const cls = container.firstElementChild?.className ?? "";
    expect(cls).toContain("bg-transparent");
    expect(cls).not.toContain("border-edge");
  });

  it("applies rounded-lg (2px under Abyssal scale)", () => {
    const { container } = render(<Card>Test</Card>);
    expect(container.firstElementChild?.className).toContain("rounded-lg");
  });
```

- [ ] **Step 2: Run the card tests and confirm two of the four new tests FAIL**

```bash
npm run test -- card
```

Expected: `default variant carries a 1px border-edge hairline` FAILS (current impl has no border on default). The other three new tests pass (bg-surface, ghost, rounded-lg are already in the impl). The five pre-existing tests pass.

- [ ] **Step 3: Commit the failing tests**

```bash
git add packages/ds/src/components/card/card.test.tsx
git commit -m "test(card): red — default variant carries 1px border-edge hairline"
```

---

## Task 5: Card — implementation (green phase)

**Files:**
- Modify: `packages/ds/src/components/card/card.tsx`.

**Steps:**

- [ ] **Step 1: Add `border border-edge` to the default variant**

In `packages/ds/src/components/card/card.tsx`, find:

```tsx
const cardVariants = cva("rounded-lg", {
  variants: {
    variant: {
      default: "bg-surface text-surface-foreground",
      ghost: "bg-transparent",
    },
```

Replace with:

```tsx
const cardVariants = cva("rounded-lg", {
  variants: {
    variant: {
      default: "bg-surface text-surface-foreground border border-edge",
      ghost: "bg-transparent",
    },
```

- [ ] **Step 2: Run the card tests and confirm all pass**

```bash
npm run test -- card
```

Expected: all 9 tests pass.

- [ ] **Step 3: Run lint + typecheck**

```bash
npm run lint
npm run typecheck
```

Expected: clean exit.

- [ ] **Step 4: Commit the implementation**

```bash
git add packages/ds/src/components/card/card.tsx
git commit -m "feat(skin): card — always-on border-edge hairline on default variant"
```

---

## Task 6: ProgressBar — failing tests (red phase)

**Files:**
- Modify: `packages/ds/src/components/progress-bar/progress-bar.test.tsx`.

**Steps:**

- [ ] **Step 1: Add bevel + cyan fill + recessed track assertions**

Append the following inside the `describe("ProgressBar", …)` block, immediately before the `it("merges custom className onto track", …)` test (around line 127):

```tsx
  describe("chassis tokens (post-revisit)", () => {
    it("track uses bg-muted dark:bg-neutral-900", () => {
      const { container } = render(
        <ProgressBar value={50} label="Progress" />,
      );
      const track = container.querySelector(
        "[role='progressbar']",
      ) as HTMLElement;
      expect(track.className).toContain("bg-muted");
      expect(track.className).toContain("dark:bg-neutral-900");
    });

    it("track carries inset bevel", () => {
      const { container } = render(
        <ProgressBar value={50} label="Progress" />,
      );
      const track = container.querySelector(
        "[role='progressbar']",
      ) as HTMLElement;
      // Tailwind arbitrary-value shadow class — match the literal class name
      expect(track.className).toContain(
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.06),inset_0_-1px_0_rgba(0,0,0,0.4)]",
      );
    });

    it("fill uses bg-accent (cyan)", () => {
      const { container } = render(
        <ProgressBar value={50} label="Progress" />,
      );
      const fill = container.querySelector("[data-fill]") as HTMLElement;
      expect(fill.className).toContain("bg-accent");
      expect(fill.className).not.toContain("bg-primary");
    });

    it("fill does not carry a glow box-shadow", () => {
      const { container } = render(
        <ProgressBar value={50} label="Progress" />,
      );
      const fill = container.querySelector("[data-fill]") as HTMLElement;
      // No "shadow-[0_0_…" arbitrary box-shadow on the fill — bevel + cyan
      // alone carries the lit-surface signal per § 6 Direction C amendment.
      expect(fill.className).not.toMatch(/shadow-\[0_0_/);
    });

    it("indeterminate fill also uses bg-accent", () => {
      const { container } = render(<ProgressBar label="Loading" />);
      const fill = container.querySelector("[data-fill]") as HTMLElement;
      expect(fill.className).toContain("bg-accent");
      expect(fill).toHaveAttribute("data-indeterminate");
    });
  });
```

- [ ] **Step 2: Run the progress-bar tests and confirm 5 fails**

```bash
npm run test -- progress-bar
```

Expected: all 5 new tests in `chassis tokens (post-revisit)` fail (current impl emits `bg-surface` track, no bevel shadow, `bg-primary` fill). All pre-existing tests still pass.

- [ ] **Step 3: Commit the failing tests**

```bash
git add packages/ds/src/components/progress-bar/progress-bar.test.tsx
git commit -m "test(progress-bar): red — cyan fill, beveled muted track, no glow"
```

---

## Task 7: ProgressBar — implementation (green phase)

**Files:**
- Modify: `packages/ds/src/components/progress-bar/progress-bar.tsx`.

**Steps:**

- [ ] **Step 1: Update the track CVA base**

In `packages/ds/src/components/progress-bar/progress-bar.tsx`, find:

```tsx
const progressBarVariants = cva(
  "relative rounded-full bg-surface overflow-hidden",
  {
```

Replace with:

```tsx
const progressBarVariants = cva(
  [
    "relative rounded-full overflow-hidden",
    "bg-muted dark:bg-neutral-900",
    "shadow-[inset_0_1px_0_rgba(255,255,255,0.06),inset_0_-1px_0_rgba(0,0,0,0.4)]",
  ].join(" "),
  {
```

- [ ] **Step 2: Update the fill className**

In the same file, find:

```tsx
        <div
          data-fill=""
          data-indeterminate={indeterminate ? "" : undefined}
          className={cn(
            "h-full rounded-full bg-primary",
            indeterminate
              ? "animate-progress-indeterminate"
              : "transition-all",
            "motion-reduce:animate-none",
          )}
          style={indeterminate ? undefined : { width: `${clampedPercent}%` }}
        />
```

Replace with:

```tsx
        <div
          data-fill=""
          data-indeterminate={indeterminate ? "" : undefined}
          className={cn(
            "h-full rounded-full bg-accent",
            indeterminate
              ? "animate-progress-indeterminate"
              : "transition-all",
            "motion-reduce:animate-none",
          )}
          style={indeterminate ? undefined : { width: `${clampedPercent}%` }}
        />
```

- [ ] **Step 3: Run the progress-bar tests and confirm all pass**

```bash
npm run test -- progress-bar
```

Expected: all tests pass (pre-existing + 5 new).

- [ ] **Step 4: Run lint + typecheck**

```bash
npm run lint
npm run typecheck
```

Expected: clean exit.

- [ ] **Step 5: Commit the implementation**

```bash
git add packages/ds/src/components/progress-bar/progress-bar.tsx
git commit -m "feat(skin): progress-bar — cyan fill + beveled recessed track"
```

---

## Task 8: Checkbox — failing tests (red phase)

**Files:**
- Modify: `packages/ds/src/components/checkbox/checkbox.test.tsx`.

**Steps:**

- [ ] **Step 1: Append five new tests**

In `packages/ds/src/components/checkbox/checkbox.test.tsx`, append the following tests immediately before the closing `});` of the `describe("Checkbox", …)` block (after the `renders with xs size prop` test):

```tsx
  it("rest chassis carries bg-background dark:bg-surface", () => {
    render(<Checkbox />);
    const cls = screen.getByRole("checkbox").className;
    expect(cls).toContain("bg-background");
    expect(cls).toContain("dark:bg-surface");
  });

  it("xs size renders at size-3.5", () => {
    render(<Checkbox size="xs" />);
    expect(screen.getByRole("checkbox").className).toContain("size-3.5");
  });

  it("sm size renders at size-4", () => {
    render(<Checkbox size="sm" />);
    expect(screen.getByRole("checkbox").className).toContain("size-4");
  });

  it("md size renders at size-5", () => {
    render(<Checkbox size="md" />);
    expect(screen.getByRole("checkbox").className).toContain("size-5");
  });

  it("all sizes carry rounded-none", () => {
    for (const size of ["xs", "sm", "md"] as const) {
      const { unmount } = render(<Checkbox size={size} />);
      expect(screen.getByRole("checkbox").className).toContain("rounded-none");
      unmount();
    }
  });

  it("renders the check indicator with Phosphor data attribute or weight signal", () => {
    render(<Checkbox defaultChecked />);
    const checkbox = screen.getByRole("checkbox");
    // The check glyph is rendered as a child <svg>; Phosphor icons set
    // viewBox="0 0 256 256" (vs the hand-rolled 0 0 24 24). Match the new
    // viewBox to confirm Phosphor is in use.
    const svg = checkbox.querySelector("svg");
    expect(svg?.getAttribute("viewBox")).toBe("0 0 256 256");
  });
```

- [ ] **Step 2: Run the checkbox tests and confirm 6 fail**

```bash
npm run test -- checkbox
```

Expected: all 6 new tests fail. Specifically:
- `bg-background dark:bg-surface` — current impl has `bg-transparent`.
- `size-3.5` / `size-4` / `size-5` — current impl uses `size-4 / size-5 / size-6`.
- `rounded-none` for all sizes — current impl uses `rounded` and `rounded-md`.
- Phosphor `viewBox="0 0 256 256"` — current impl uses hand-rolled `viewBox="0 0 24 24"`.

Pre-existing 9 tests still pass.

- [ ] **Step 3: Commit the failing tests**

```bash
git add packages/ds/src/components/checkbox/checkbox.test.tsx
git commit -m "test(checkbox): red — rest fill, 14/16/20 sizes, rounded-none, Phosphor Check"
```

---

## Task 9: Checkbox — implementation (green phase)

**Files:**
- Modify: `packages/ds/src/components/checkbox/checkbox.tsx`.

**Steps:**

- [ ] **Step 1: Add the Phosphor `Check` import**

At the top of `packages/ds/src/components/checkbox/checkbox.tsx`, replace:

```tsx
import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Checkbox as CheckboxPrimitive } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@ac/lib/cn";
```

with:

```tsx
import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Checkbox as CheckboxPrimitive } from "radix-ui";
import { Check } from "@phosphor-icons/react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@ac/lib/cn";
```

- [ ] **Step 2: Add the rest fill to the base array + update sizes**

Find the `checkboxVariants` declaration (currently lines 6–36):

```tsx
const checkboxVariants = cva(
  [
    "peer shrink-0 bg-transparent",
    "border border-edge",
    "hover:border-edge-hover",
    "focus-visible:outline-none",
    "focus-visible:border-accent-700 dark:focus-visible:border-accent",
    "disabled:bg-muted dark:disabled:bg-background",
    "disabled:border-edge/50",
    "disabled:text-foreground/30",
    "disabled:cursor-not-allowed",
    "disabled:data-[state=checked]:text-foreground/30",
    "disabled:data-[state=checked]:bg-muted dark:disabled:data-[state=checked]:bg-background",
    "disabled:data-[state=checked]:border-edge/50",
    "data-[state=checked]:bg-accent data-[state=checked]:border-accent",
    "data-[state=checked]:text-neutral-950",
    "transition-colors",
  ].join(" "),
  {
    variants: {
      size: {
        xs: "size-4 rounded",
        sm: "size-5 rounded-md",
        md: "size-6 rounded-md",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);
```

Replace with:

```tsx
const checkboxVariants = cva(
  [
    "peer shrink-0",
    "bg-background dark:bg-surface",
    "border border-edge",
    "hover:border-edge-hover",
    "focus-visible:outline-none",
    "focus-visible:border-accent-700 dark:focus-visible:border-accent",
    "disabled:bg-muted dark:disabled:bg-background",
    "disabled:border-edge/50",
    "disabled:text-foreground/30",
    "disabled:cursor-not-allowed",
    "disabled:data-[state=checked]:text-foreground/30",
    "disabled:data-[state=checked]:bg-muted dark:disabled:data-[state=checked]:bg-background",
    "disabled:data-[state=checked]:border-edge/50",
    "data-[state=checked]:bg-accent data-[state=checked]:border-accent",
    "data-[state=checked]:text-neutral-950",
    "transition-colors",
  ].join(" "),
  {
    variants: {
      size: {
        xs: "size-3.5 rounded-none",
        sm: "size-4 rounded-none",
        md: "size-5 rounded-none",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);
```

Key changes:
- `bg-transparent` removed; `bg-background dark:bg-surface` added (flat-slot chassis per Decision #84).
- Sizes drop one step (`size-4/5/6` → `size-3.5/4/5` = 14/16/20).
- `rounded` / `rounded-md` → `rounded-none` (vocabulary alignment; visual values were already 0px under Abyssal scale).

- [ ] **Step 3: Replace the hand-rolled SVG with Phosphor `<Check />`**

Find the `Checkbox` component body (currently lines 46–86):

```tsx
const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ size, error = false, className, ...rest }, ref) => {
    return (
      <CheckboxPrimitive.Root
        ref={ref}
        className={cn(
          checkboxVariants({ size }),
          error &&
            "border-error data-[state=checked]:border-error hover:border-error focus-visible:border-error dark:focus-visible:border-error",
          className,
        )}
        aria-invalid={error || undefined}
        {...rest}
      >
        <CheckboxPrimitive.Indicator
          forceMount
          className={cn(
            "flex size-full items-center justify-center text-current",
            "[clip-path:circle(0%_at_0%_75%)]",
            "data-[state=checked]:[clip-path:circle(100%_at_50%_50%)]",
            "transition-[clip-path] duration-200 ease-in-out motion-reduce:transition-none",
          )}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-[90%]"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
    );
  },
);
```

Replace with:

```tsx
const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ size, error = false, className, ...rest }, ref) => {
    return (
      <CheckboxPrimitive.Root
        ref={ref}
        className={cn(
          checkboxVariants({ size }),
          error &&
            "border-error data-[state=checked]:border-error hover:border-error focus-visible:border-error dark:focus-visible:border-error",
          className,
        )}
        aria-invalid={error || undefined}
        {...rest}
      >
        <CheckboxPrimitive.Indicator
          forceMount
          className={cn(
            "flex size-full items-center justify-center text-current",
            "[clip-path:circle(0%_at_0%_75%)]",
            "data-[state=checked]:[clip-path:circle(100%_at_50%_50%)]",
            "transition-[clip-path] duration-200 ease-in-out motion-reduce:transition-none",
          )}
        >
          <Check weight="bold" className="size-[80%]" />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
    );
  },
);
```

Key changes:
- Inline `<svg>` polyline replaced with Phosphor `<Check weight="bold" />`.
- Icon container drops from `size-[90%]` to `size-[80%]` (Phosphor icons render at full canvas; 80% is the safe inner-padding analogue to the prior 90%-of-24-viewBox sizing).

- [ ] **Step 4: Run the checkbox tests and confirm all pass**

```bash
npm run test -- checkbox
```

Expected: all 15 tests pass (9 pre-existing + 6 new). The Phosphor viewBox assertion confirms the swap.

- [ ] **Step 5: Run lint + typecheck**

```bash
npm run lint
npm run typecheck
```

Expected: clean exit.

- [ ] **Step 6: Commit the implementation**

```bash
git add packages/ds/src/components/checkbox/checkbox.tsx
git commit -m "feat(skin): checkbox — flat-slot rest, 14/16/20 sizes, rounded-none, Phosphor Check"
```

---

## Task 10: RadioGroup — failing tests (red phase)

**Files:**
- Modify: `packages/ds/src/components/radio-group/radio-group.test.tsx`.

**Steps:**

- [ ] **Step 1: Append four new tests**

Append the following tests immediately before the closing `});` of the `describe("RadioGroup", …)` block (after the `renders with xs size prop` test):

```tsx
  it("item rest chassis carries bg-background dark:bg-surface", () => {
    render(
      <RadioGroup>
        <RadioGroupItem value="a" />
      </RadioGroup>,
    );
    const cls = screen.getByRole("radio").className;
    expect(cls).toContain("bg-background");
    expect(cls).toContain("dark:bg-surface");
  });

  it("xs size renders item at size-3.5", () => {
    render(
      <RadioGroup>
        <RadioGroupItem value="a" size="xs" />
      </RadioGroup>,
    );
    expect(screen.getByRole("radio").className).toContain("size-3.5");
  });

  it("sm size renders item at size-4", () => {
    render(
      <RadioGroup>
        <RadioGroupItem value="a" size="sm" />
      </RadioGroup>,
    );
    expect(screen.getByRole("radio").className).toContain("size-4");
  });

  it("md size renders item at size-5", () => {
    render(
      <RadioGroup>
        <RadioGroupItem value="a" size="md" />
      </RadioGroup>,
    );
    expect(screen.getByRole("radio").className).toContain("size-5");
  });
```

- [ ] **Step 2: Run the radio-group tests and confirm 4 fail**

```bash
npm run test -- radio-group
```

Expected: all 4 new tests fail. Pre-existing tests still pass.

- [ ] **Step 3: Commit the failing tests**

```bash
git add packages/ds/src/components/radio-group/radio-group.test.tsx
git commit -m "test(radio-group): red — flat-slot rest, 14/16/20 sizes"
```

---

## Task 11: RadioGroup — implementation (green phase)

**Files:**
- Modify: `packages/ds/src/components/radio-group/radio-group.tsx`.

**Steps:**

- [ ] **Step 1: Update the `radioItemVariants` base array + sizes**

In `packages/ds/src/components/radio-group/radio-group.tsx`, find the `radioItemVariants` declaration (currently lines 6–33):

```tsx
const radioItemVariants = cva(
  [
    "peer shrink-0 rounded-full bg-transparent",
    "border border-edge",
    "hover:border-edge-hover",
    "focus-visible:outline-none",
    "focus-visible:border-accent-700 dark:focus-visible:border-accent",
    "disabled:bg-muted dark:disabled:bg-background",
    "disabled:border-edge/50",
    "disabled:cursor-not-allowed",
    "disabled:[&_span]:bg-foreground/30",
    "disabled:data-[state=checked]:border-edge/50",
    "data-[state=checked]:border-accent",
    "transition-colors",
  ].join(" "),
  {
    variants: {
      size: {
        xs: "size-4",
        sm: "size-5",
        md: "size-6",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);
```

Replace with:

```tsx
const radioItemVariants = cva(
  [
    "peer shrink-0 rounded-full",
    "bg-background dark:bg-surface",
    "border border-edge",
    "hover:border-edge-hover",
    "focus-visible:outline-none",
    "focus-visible:border-accent-700 dark:focus-visible:border-accent",
    "disabled:bg-muted dark:disabled:bg-background",
    "disabled:border-edge/50",
    "disabled:cursor-not-allowed",
    "disabled:[&_span]:bg-foreground/30",
    "disabled:data-[state=checked]:border-edge/50",
    "data-[state=checked]:border-accent",
    "transition-colors",
  ].join(" "),
  {
    variants: {
      size: {
        xs: "size-3.5",
        sm: "size-4",
        md: "size-5",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);
```

Key changes:
- `bg-transparent` → `bg-background dark:bg-surface` (rest visibility, matches Input flat-slot).
- Sizes `size-4/5/6` → `size-3.5/4/5` (14/16/20, cascade from Checkbox per Decision #85 chassis sharing).
- `rounded-full` stays — RadioGroup is round-by-design (Radio dots are conventionally round).

- [ ] **Step 2: Run the radio-group tests and confirm all pass**

```bash
npm run test -- radio-group
```

Expected: all tests pass.

- [ ] **Step 3: Run lint + typecheck**

```bash
npm run lint
npm run typecheck
```

Expected: clean exit.

- [ ] **Step 4: Commit the implementation**

```bash
git add packages/ds/src/components/radio-group/radio-group.tsx
git commit -m "feat(skin): radio — flat-slot rest, 14/16/20 sizes (cascade from checkbox)"
```

---

## Task 12: Visual verification in dev server

**Files:** None. Manual visual check.

- [ ] **Step 1: Start dev server**

```bash
cd /Users/dio/Library/CloudStorage/Dropbox/Claudio/repos/stasho-ds/.claude/worktrees/skin+paraplu
npm run dev
```

Note the localhost URL (typically `http://localhost:3000`). Open it.

- [ ] **Step 2: Walk the Badge preview page in both themes**

Open `http://localhost:3000/components/badge` and toggle the theme switcher between dark and light.

For each variant (default, success, warning, error, info) × each fill (solid, outline) × each size (sm, md), confirm:

- Solid: flat saturated background, dark text (`text-neutral-950`), no gradient. Info is cyan.
- Outline: tinted bg + 1px colored hairline + colored text. Light-mode text legible (warning, success, info, error all use `-500` step).
- Default-outline reads quietly (`text-foreground/70`); no primary tint.
- All chips read at 2px radius (slight softening vs Button trigger).
- Icons (when `iconLeft` / `iconRight` provided) render at the same size and stay aligned.

- [ ] **Step 3: Walk the Card preview page in both themes**

Open `http://localhost:3000/components/card`. Confirm:

- Default Card has a visible 1px hairline in both themes.
- Cards stacked next to each other (or nested) read as distinct, not melted.
- Ghost Card has no border, transparent background.
- Title (when provided) renders as Anybody Bold h3 at text-lg (unchanged).

- [ ] **Step 4: Walk the ProgressBar preview page in both themes**

Open `http://localhost:3000/components/progress-bar`. Confirm:

- Track has a recessed/beveled appearance in both themes (`bg-muted` light / `bg-neutral-900` dark, inset shadow).
- Fill is cyan, both determinate (any percentage) and indeterminate (animated sweep).
- No primary-blue anywhere on the component.
- No glow box-shadow on the fill (flat cyan).
- All three sizes (sm 4px, md 6px, lg 10px) read correctly.
- `ProgressBarDescription` (when provided) renders below the track.

- [ ] **Step 5: Walk the Checkbox preview page in both themes**

Open `http://localhost:3000/components/checkbox`. Confirm:

- Rest checkbox is visible in dark mode (bg-surface fill behind the hairline — no longer invisible).
- All three sizes register at 14×14 / 16×16 / 20×20.
- Check glyph is Phosphor Bold (cleaner stroke than the prior hand-rolled). Stroke weight reads comfortable.
- Checked state: cyan fill + dark glyph. Unchanged from chunk-4.
- Disabled rest + disabled+checked: sink chassis, grey edge, grey glyph.
- Error: blood-orange border. Error+checked: cyan fill + blood-orange border.
- Focus: cyan hairline (border-swap pattern).

- [ ] **Step 6: Walk the RadioGroup preview page in both themes**

Open `http://localhost:3000/components/radio-group`. Confirm:

- Rest radio is visible in dark mode (bg-surface fill).
- Sizes register at 14 / 16 / 20.
- Round shape preserved (`rounded-full`).
- Indicator dot (cyan) renders centered when checked.
- Disabled, error (where applicable) match Checkbox treatment.

- [ ] **Step 7: Stop dev server**

```
Ctrl+C in the dev terminal
```

No commit. Verification only. If anything looks wrong (Phosphor stroke too thin/heavy, sizes feel off, etc.), fix in a follow-up commit on top of the implementation commits before continuing.

---

## Task 13: Update SKIN-PRINCIPLES.md

**Files:**
- Modify: `docs/SKIN-PRINCIPLES.md` — § 4 chip-row split + radii-table cleanup + § 6 Direction C amendment.

**Steps:**

- [ ] **Step 1: Update § 4 — split chip row in the 0/0/2/4 table**

In `docs/SKIN-PRINCIPLES.md`, find:

```markdown
| Element | Radius |
|---|---|
| Buttons, inputs, selects, chips, dropdowns, toasts | `0` |
| Cards | `2px` |
| Modals, dialogs | `4px` |
```

Replace with:

```markdown
| Element | Radius |
|---|---|
| Buttons, inputs, selects, dropdowns, toasts | `0` |
| Badges, Cards | `2px` |
| Modals, dialogs | `4px` |
```

- [ ] **Step 2: Refresh the "Surface radii by role" table**

In the same file, find:

```markdown
| Role | Tailwind class | Pixels | Components |
|---|---|---|---|
| Popovers | `rounded-none` | 0px | Tooltip, Select/Combobox/MultiSelect dropdowns, Tabs overflow DropdownMenu |
| Modals | `rounded-xl` | 4px | Dialog |
| Cards | `rounded-lg` | 2px | Card |
| Round-by-design | `rounded-full` | — | StatusDot, Slider thumb, Switch thumb, ProgressBar tracks, MultiSelect tag chips, Stepper indicators, Tabs pill variant |
```

Replace with:

```markdown
| Role | Tailwind class | Pixels | Components |
|---|---|---|---|
| Popovers | `rounded-none` | 0px | Tooltip, Select/Combobox/MultiSelect dropdowns, Tabs overflow DropdownMenu |
| Modals | `rounded-xl` | 4px | Dialog |
| Cards | `rounded-lg` | 2px | Card |
| Contained markers | `rounded-[2px]` | 2px | Badge |
| Round-by-design | `rounded-full` | — | StatusDot, Slider thumb, RadioGroup item, ProgressBar tracks, MultiSelect tag chips |
```

Key changes:
- Add **Contained markers** row for Badge.
- Round-by-design row: drop Switch thumb (Decision #88), Stepper indicators (Decision #88), Tabs pill variant (Decision #86) — already removed. Add RadioGroup item (round-by-design, never previously listed). Reflects current shipped state.

- [ ] **Step 3: Update § 6 Direction C — ProgressBar amendment**

In the same file, find the § 6 Direction C **How** paragraph (the long line that starts with "Switch thumbs are solid cyan at rest…" — currently it includes Slider's behavior post Decision #89).

The current line (after Slider revisit landed):

```markdown
**How:** Switch thumbs are solid cyan at rest and gain `box-shadow: 0 0 5px var(--accent), 0 0 10px rgba(0,225,250,0.6)` on hover/focus only. Slider thumbs are 1.5px cyan rings on a `bg-background` interior at rest (an aperture); on hover, the interior fills `bg-accent` and an outer halo `0 0 6px var(--accent), 0 0 12px rgba(0,225,250,0.5)` lights up — a documented carve-out from § 5 "hover intensifies, doesn't repaint" because the Slider thumb is a directly-grabbed control and the fill is the "you've got it" cue. The repaint is bounded to the interior of an existing chassis (no border, size, or shape change). Stepper active indicators carry a persistent halo `box-shadow: 0 0 6px rgba(0,225,250,0.5), 0 0 14px rgba(0,225,250,0.3)` (the indicator IS the "you are here" beacon, so the halo is rest‑state, not hover‑state). Switch and Slider tracks carry the same inset bevel as Button (`inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.4)`). Checkbox / Radio / Tabs / Pagination / Breadcrumb cyan states are flat, as are Stepper completed indicators (solid cyan chip carries the state alone). Disabled cascades for these components require compound variants (`disabled:data-[state=checked]:*`, `data-[disabled]:*` for Radix `<span>`-rendered parts, and `data-[disabled]:hover:*` to keep the disabled chassis static under hover) so the sink wins over checked-accent / hover-fill rules.
```

Replace with:

```markdown
**How:** Switch thumbs are solid cyan at rest and gain `box-shadow: 0 0 5px var(--accent), 0 0 10px rgba(0,225,250,0.6)` on hover/focus only. Slider thumbs are 1.5px cyan rings on a `bg-background` interior at rest (an aperture); on hover, the interior fills `bg-accent` and an outer halo `0 0 6px var(--accent), 0 0 12px rgba(0,225,250,0.5)` lights up — a documented carve-out from § 5 "hover intensifies, doesn't repaint" because the Slider thumb is a directly-grabbed control and the fill is the "you've got it" cue. The repaint is bounded to the interior of an existing chassis (no border, size, or shape change). Stepper active indicators carry a persistent halo `box-shadow: 0 0 6px rgba(0,225,250,0.5), 0 0 14px rgba(0,225,250,0.3)` (the indicator IS the "you are here" beacon, so the halo is rest‑state, not hover‑state). ProgressBar fill stays flat cyan on a beveled track — the bevel + cyan carries the lit-surface signal without committing to a persistent glow. Glow is reserved for directly-grabbed controls (Slider thumb) and "you are here" beacons (Stepper active); a passive readout like ProgressBar doesn't earn the glow budget. Switch, Slider, and ProgressBar tracks carry the same inset bevel as Button (`inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.4)`). Checkbox / Radio / Tabs / Pagination / Breadcrumb cyan states are flat, as are Stepper completed indicators (solid cyan chip carries the state alone). Disabled cascades for these components require compound variants (`disabled:data-[state=checked]:*`, `data-[disabled]:*` for Radix `<span>`-rendered parts, and `data-[disabled]:hover:*` to keep the disabled chassis static under hover) so the sink wins over checked-accent / hover-fill rules.
```

Key changes:
- Insert the ProgressBar sentence between Stepper and "Switch and Slider tracks carry the same inset bevel as Button…".
- Update the bevel sentence to include ProgressBar in the list ("Switch, Slider, and ProgressBar tracks").

- [ ] **Step 4: Update § 6 Direction C — Rule line to reflect the new flat list**

Find:

```markdown
**Rule:** The LED treatment extends to small "on/active" states selectively. Glow is reserved for components where the lit element IS the active surface (Switch thumb, Slider thumb, ProgressBar fill, **Stepper active indicator**). Slot/text indicators (Checkbox check, Radio dot, active Tab text, active Pagination number, active Breadcrumb, **Stepper completed indicator**) stay flat-cyan — they're markers on a surface, not lit surfaces themselves.
```

Replace with:

```markdown
**Rule:** The LED treatment extends to small "on/active" states selectively. Glow is reserved for components where the lit element IS the active surface AND is either directly grabbed or carries a persistent "you are here" reading (Switch thumb on hover/focus, Slider thumb on hover/focus, **Stepper active indicator** persistent). Lit surfaces that are passive readouts (ProgressBar fill) stay flat-cyan on a beveled track — the bevel + cyan carries the signal without committing to glow. Slot/text indicators (Checkbox check, Radio dot, active Tab text, active Pagination number, active Breadcrumb, **Stepper completed indicator**) likewise stay flat-cyan — they're markers on a surface, not lit surfaces themselves.
```

- [ ] **Step 5: Update § 6 Direction C — Source line**

Find:

```markdown
**Source:** Decisions #85, #88, #89.
```

Replace with:

```markdown
**Source:** Decisions #85, #88, #89, #90.
```

- [ ] **Step 6: Commit**

```bash
git add docs/SKIN-PRINCIPLES.md
git commit -m "docs(skin): SKIN-PRINCIPLES — § 4 chip split + radii cleanup, § 6 ProgressBar amendment"
```

---

## Task 14: Update DESIGN-SYSTEM.md

**Files:**
- Modify: `docs/DESIGN-SYSTEM.md` — Badge, Card, ProgressBar, Checkbox, RadioGroup sections.

**Steps:**

- [ ] **Step 1: Refresh the Badge section**

Search `docs/DESIGN-SYSTEM.md` for `## Badge` (or the equivalent heading). Update the description to reflect:

- 2px radius (was 0px).
- Solid: flat saturated background + `text-neutral-950` for all four semantic variants; default uses `bg-muted text-foreground`; info uses `bg-accent` (cyan).
- Outline: tinted `bg-{token}/15` + 1px `border-{token}/40` + light-mode `-500` text carve-out for all four semantic variants. Default outline uses `border-edge` + `text-foreground/70`.
- No `gradient-fill-*` classes.

If the section names exact class names or tokens, swap them to match the new implementation. Preserve API/prop documentation as-is (no API change).

- [ ] **Step 2: Refresh the Card section**

Find the Card section. Update:

- Default variant now carries an always-on 1px `border-edge` hairline.
- Ghost variant unchanged.
- Padding sizes and title typography unchanged.

- [ ] **Step 3: Refresh the ProgressBar section**

Find the ProgressBar section. Update:

- Fill is `bg-accent` (cyan), not `bg-primary`. Applies in both determinate + indeterminate modes.
- Track is `bg-muted dark:bg-neutral-900` with inset bevel (`shadow-[inset_0_1px_0_rgba(255,255,255,0.06),inset_0_-1px_0_rgba(0,0,0,0.4)]`) — matches Switch + Slider.
- No glow on fill (deliberate — flat cyan; § 6 Direction C amendment).
- Sizes unchanged (sm 4px / md 6px / lg 10px).

- [ ] **Step 4: Refresh the Checkbox section**

Find the Checkbox section. Update:

- Sizes are 14×14 / 16×16 / 20×20 (`xs` / `sm` / `md`) — Tailwind utilities `size-3.5` / `size-4` / `size-5`.
- Rest chassis is `bg-background dark:bg-surface` + `border-edge` hairline (matches Input flat-slot per Decision #84).
- All sizes use `rounded-none`.
- Check glyph is Phosphor `<Check weight="bold" />`, not the prior hand-rolled SVG.

- [ ] **Step 5: Refresh the RadioGroup section**

Find the RadioGroup section. Update:

- Sizes are 14 / 16 / 20 (cascade from Checkbox per Decision #85 chassis sharing).
- Rest chassis matches Checkbox (`bg-background dark:bg-surface` + `border-edge`).
- `rounded-full` (round-by-design — RadioGroup item stays round).
- Indicator dot unchanged.

- [ ] **Step 6: Commit**

```bash
git add docs/DESIGN-SYSTEM.md
git commit -m "docs(ds): DESIGN-SYSTEM — refresh Badge/Card/ProgressBar/Checkbox/RadioGroup"
```

---

## Task 15: Add Decision #90 + BACKLOG + CLAUDE.md

**Files:**
- Modify: `docs/DECISIONS.md` (prepend Decision #90).
- Modify: `docs/BACKLOG.md` (add Switch ladder + Switch focus pattern items).
- Modify: `CLAUDE.md` (Current Features entries for 5 components).

**Steps:**

- [ ] **Step 1: Prepend Decision #90 to DECISIONS.md**

Open `docs/DECISIONS.md`. Find the existing block:

```markdown
## Decision #89 — 2026-05-27
```

Insert this new block ABOVE `## Decision #89`, followed by a `---` separator and a blank line:

```markdown
## Decision #90 — 2026-05-27

**Context:** After wave-1 + Slider revisit shipped, four components carried leftover pre-Abyssal vocabulary or under-applied wave-1 principles. Badge solid used `gradient-fill-*` (muddy on saturated tones); Badge outline referenced scale steps (`-100` / `-300` / `-400`) instead of semantic tokens; Badge info solid was a neutral pill (should be cyan per #88); Badge outline default leaked `--primary`. Card default had no hairline and melted on light/nested contexts. ProgressBar fill was `bg-primary` (should be `bg-accent`) with no bevel and no Direction C treatment despite § 6 explicitly naming ProgressBar fill as a lit surface. Checkbox rest hairline was invisible on dark (`bg-transparent` over `#07080a`); sizes were heavy (16/20/24); class names misaligned with vocabulary (`rounded` / `rounded-md` resolved to 0px but read as rounded); check glyph was hand-rolled. Brainstorming settled five direction questions: Badge solid/outline fill, Badge radius, Card border, ProgressBar treatment, Checkbox rest + sizes.

**Decision:** Apply wave-1 followup polish across all four components plus Radio cascade. **Badge:** Solid drops `gradient-fill-*` and renders as flat saturated background + `text-neutral-950` for the four semantic variants; default solid uses `bg-muted text-foreground`. Outline becomes tinted `bg-{token}/15` + 1px `border-{token}/40` + colored text with the light-mode `-500` carve-out generalized to all four semantic variants (`text-accent-500 dark:text-accent`, `text-warning-500 dark:text-warning`, `text-success-500 dark:text-success`, `text-error-500 dark:text-error`). Default outline = `bg-transparent border-edge text-foreground/70`. Info variant becomes cyan in both fills. Base radius moves from `rounded-none` to `rounded-[2px]` (Card grade). **Card:** Default variant gains always-on `border border-edge` hairline; ghost variant unchanged. **ProgressBar:** Fill swaps `bg-primary` → `bg-accent`. Track swaps `bg-surface` → `bg-muted dark:bg-neutral-900` and gains the Switch/Slider inset bevel (`shadow-[inset_0_1px_0_rgba(255,255,255,0.06),inset_0_-1px_0_rgba(0,0,0,0.4)]`). No glow on fill — bevel + cyan carries the lit-surface signal. **Checkbox:** Rest chassis adds `bg-background dark:bg-surface` (matches Input flat-slot per Decision #84). Sizes 16/20/24 → 14/16/20 (`size-3.5` / `size-4` / `size-5`). `rounded` / `rounded-md` → `rounded-none` on all sizes (no visual change; class-name vocabulary alignment only — both Tailwind utilities resolved to 0px under the Abyssal scale per Decision #87). Hand-rolled `<svg>` check glyph replaced with Phosphor `<Check weight="bold" />` (matches Stepper completed per Decision #88). **RadioGroup cascade:** Rest chassis + size shrink mirror Checkbox (chassis is shared per Decision #85). `rounded-full` stays (round-by-design). **SKIN-PRINCIPLES amendments:** § 4 0/0/2/4 table splits the chip row — primitive controls (Buttons, inputs, selects, dropdowns, toasts) stay at 0px, contained markers (Badges) join Cards at 2px. § 4 "Surface radii by role" table gains a Contained markers row for Badge; round-by-design row cleaned to reflect current state (drops Switch thumb / Stepper indicators / Tabs pill from #86 + #88; adds RadioGroup item which was always round-by-design but never listed). § 6 Direction C "How" paragraph + "Rule" line amended: ProgressBar fill moves from the "lit surfaces glow" list to "lit surfaces flat — bevel + cyan carries signal." Glow remains reserved for directly-grabbed controls (Slider thumb on hover/focus, Switch thumb on hover/focus) and "you are here" beacons (Stepper active persistent halo). A passive readout like ProgressBar doesn't earn the glow budget.

**Rationale:** Each piece. **Badge gradient → flat saturated** — gradients on saturated chassis read muddy (§ 6 saturated semantic chassis rule, originally for Button); Badge inherits the same vocabulary. Dark text on saturated backgrounds passes AAA contrast at all four semantic hues. **Badge tinted outline + hairline** — picks up Pagination tinted-active vocabulary (Decision #88) and adds a 1px border so Badge reads as a chip, not a pill cell. The `/40` border opacity reserves saturation; the carve-out text token (`-500 dark:default`) ensures AA contrast on light. **Badge info → cyan** — frees the badge family from primary-blue (Decision #88 made cyan the active/live signal across the system; info badge fits that role). **Badge 2px radius** — picks up the Card / Tabs-pill chrome vocabulary; Badge is a contained marker (sits on top of a chassis), not a primitive control (the chassis itself). Splits the § 4 chip row cleanly. 0px would make Badge indistinguishable from a Button-shaped readout at small sizes; 4px would put Badge in the modal radius tier semantically (badges are markers, not overlays). **Card hairline** — surface ladder alone (`bg-surface` over `bg-background`) is whisper-thin in light mode and disappears in nested contexts. The hairline gives Card two cues for "container" (tone shift + frame), survives all contexts, and aligns Card with how the rest of the wave-1 chrome (Input flat-slot, Tabs pill list, Badge outline) defines its boundaries. **ProgressBar cyan + bevel, no glow** — § 6 Direction C named ProgressBar fill as a lit surface, but visual review showed glow on a 4–10px fill is wasted budget; the bevel + cyan reads as "live" without the persistent halo. Saves the glow vocabulary for components that genuinely earn it (Slider thumb directly grabbed, Stepper active "you are here" beacon). Track bevel completes the Switch + Slider family ("recessed channel with a lit fill"). **Checkbox rest fill** — `bg-transparent` over `#07080a` made the chassis invisible at rest in dark mode, breaking the "slot you fill" reading. Adding `bg-background dark:bg-surface` matches the Input flat-slot pattern from Decision #84 — Checkbox is the inverse of Input (you put a checkmark into a slot the way you put text into an input). **Checkbox 14/16/20** — current 16/20/24 read heavy; md=24 dominated forms. New ladder ties to industry conventions (Vercel / Linear / Stripe at 14–18px) and to Slider md thumb (14px). md=20 below WCAG 24×24 — acceptable because Radix's `<label>` wrapping pattern provides surrounding click padding. **Class-name cleanup** — `rounded` and `rounded-md` both resolved to 0px under the Abyssal scale (Decision #87) but the class names lied; future readers reaching for the file would wonder why "rounded" looked square. `rounded-none` makes the intent explicit. **Phosphor `<Check />`** — Stepper completed already uses Phosphor (Decision #88); Checkbox alignment is the obvious consistency win. `weight="bold"` matches the hand-rolled `strokeWidth={3}` feel. **Radio cascade** — Checkbox and Radio share the chassis pattern per Decision #85; letting them diverge here would create an immediately-visible form-context inconsistency. **§ 4 chip row split** — Badge at 2px is not "chip = 0"; the table needs to acknowledge two chip classes. The split is honest naming, not a workaround. **§ 6 Direction C amendment** — distinguishes between "lit surfaces" (the category Direction C named) and "lit surfaces that earn glow" (the narrower set Direction C is actually about). The new rule wording — "directly grabbed OR persistent 'you are here'" — makes the category decidable for future components.

**Alternatives considered:** Badge outline collapses solid+outline into one fill prop (rejected — Badge loses the loud-vs-quiet visual ladder). Badge radius 0px (rejected — indistinguishable from Button-shaped trigger at sm 10px font). Badge radius 4px (rejected — puts Badge in modal radius tier; "tag, not chip" reading was felt to be too loose). Card hairline-only with no surface fill (rejected — reads insubstantial next to Input chassis which also uses hairline). Card on bg-background instead of bg-surface (rejected — loses the surface-ladder step that helps the chassis read as elevated). ProgressBar with full Direction C glow (rejected — wasted budget on a passive readout; Slider thumb + Stepper beacon are the components that earn it). ProgressBar without bevel (rejected — leaves the track flat, inconsistent with Switch + Slider). Checkbox sizes 12/14/18 (rejected — md=18 reads as tight chassis element rather than focal control; xs=12 risks fuzzy rendering). Checkbox sizes 14/18/22 (rejected — smaller delta from current, doesn't address "md too big" enough). Phosphor `weight="regular"` (rejected — too thin against the prior hand-rolled stroke; visual review picked Bold). Bundle Switch ladder shrink into this chunk (rejected — separate audit needed; Switch ladder cascade would balloon the PR). Defer RadioGroup cascade to a follow-up (rejected — shared chassis per #85, divergence would be immediately visible).

---
```

The block ends with `---` (followed by a blank line) per the file's existing convention.

- [ ] **Step 2: Update BACKLOG.md — add Switch follow-ups**

In `docs/BACKLOG.md`, find the `## Open Items` heading. Insert these two items at the top of the open-items list (immediately after the heading + intro):

```markdown
### 2026-05-27 — Switch size ladder revisit (cascade from Checkbox/Radio shrink)

**Source:** Decision #90 brainstorm
**Description:** Checkbox and Radio shrunk to xs/sm/md = 14/16/20 in Decision #90. Switch still ships at ~16/20/24 (chunk-4 sizes). The visual mismatch between Switch and Checkbox/Radio in form contexts will read heavy on Switch. Audit Switch sizes and either shrink to match (most likely outcome) or document why Switch keeps its heavier ladder. Single chunk: `skin/switch-ladder-revisit` off `skin/paraplu`.
**Priority:** Medium

### 2026-05-27 — Boolean form focus pattern consistency

**Source:** Decision #90 brainstorm (out of scope, flagged)
**Description:** Switch + Slider use `outline-2 outline-accent outline-offset-2` focus (separately-rendered thumbs need external outline). Checkbox + Radio use border-swap focus (small targets where the chassis hairline carries focus). The split is principled per Decision #85, but a future audit could unify if a real reason emerges. Document the split + decision criteria; no code change implied unless an issue surfaces.
**Priority:** Low
```

- [ ] **Step 3: Move the (current) item "Rounded-full audit (MultiSelect chips remaining)" if it still mentions Slider**

In the same file, find the rounded-full audit item. Verify its current text reflects only MultiSelect chips as the remaining unresolved item (Slider was resolved in #89). No change needed unless the text is stale; if it still mentions Slider, update the text accordingly.

- [ ] **Step 4: Update CLAUDE.md — refresh five Current Features entries**

In `CLAUDE.md`, find the Current Features list (likely under `### Current Features` or similar). Update the five relevant entries.

**Badge entry** — find the current text starting "Badge component" and replace with:

```markdown
- Badge component with 5 semantic variants (default/success/warning/error/info), 2 fill modes (solid/outline), 2 sizes, optional iconLeft/iconRight slots, Departure Mono UC label face with CSS-forced uppercase (DOM textContent preserves consumer case), 2px radius (`rounded-[2px]` — contained marker per § 4 split, Decision #90), solid uses flat saturated background + `text-neutral-950` for the four semantic variants (default solid uses `bg-muted text-foreground`, info uses `bg-accent`), outline uses tinted `bg-{token}/15` + 1px `border-{token}/40` + colored text with light-mode `-500` carve-out for all four semantic variants per Decision #88
```

**Card entry** — find the current text starting "Card component" and replace with:

```markdown
- Card component with 2 variants (default/ghost), 3 padding sizes, optional title prop, `rounded-lg` (2px under the Abyssal scale) per Decision #87. Default variant now carries an always-on 1px `border-edge` hairline (Decision #90) — survives nested + light-mode contexts. Ghost variant unchanged (`bg-transparent`, no border).
```

**ProgressBar entry** — find the current text starting "ProgressBar component" and replace with:

```markdown
- ProgressBar component with determinate (value/max) and indeterminate (omit value) modes, 3 sizes (sm/md/lg), CVA track variants, `ProgressBarDescription` child linked via `aria-describedby`, clamped value, `motion-reduce:animate-none`, custom indeterminate animation keyframes in tokens.css. Fill uses `bg-accent` (cyan) per Decision #90 (was `bg-primary`); track is `bg-muted dark:bg-neutral-900` with Switch/Slider-style inset bevel; no glow on fill (bevel + cyan carries the lit-surface signal per § 6 Direction C amendment).
```

**Checkbox entry** — find the current text starting "Checkbox component" and replace with:

```markdown
- Checkbox component (Radix UI) with 3 sizes (xs/sm/md = 14/16/20 per Decision #90), flat-slot rest chassis (`bg-background dark:bg-surface` + 1px `border-edge` hairline, matches Input per Decision #84), `bg-accent` checked with dark `text-neutral-950` Phosphor `<Check weight="bold" />` glyph (replaces hand-rolled SVG per Decision #90, matches Stepper completed per #88), cyan hairline focus (`border-accent-700` light / `border-accent` dark), `border-error` semantic error token with `data-[state=checked]:border-error` for specificity, flat-sink disabled (`bg-muted` light / `bg-background` dark, `cursor-not-allowed`); compound `disabled:data-[state=checked]:*` rules keep disabled+checked sunk (Decision #85); `rounded-none` on all sizes (Tailwind `rounded` / `rounded-md` both resolve to 0px under Abyssal scale per #87 — Decision #90 renames for vocabulary alignment); clip-path reveal animation
```

**RadioGroup entry** — find the current text starting "RadioGroup component" and replace with:

```markdown
- RadioGroup component (Radix UI) with 3 sizes (xs/sm/md = 14/16/20 per Decision #90 — cascade from Checkbox per Decision #85 chassis sharing), flat-slot rest chassis (`bg-background dark:bg-surface` + 1px `border-edge` hairline, matches Checkbox), `bg-accent` indicator dot, descendant `disabled:[&_span]:bg-foreground/30` rule dims the dot (Radix nests Indicator as child of Item — `peer-disabled:` doesn't match), group/item-level disabled, clip-path reveal animation, `rounded-full` (round-by-design)
```

- [ ] **Step 5: Commit the three doc updates together**

```bash
git add docs/DECISIONS.md docs/BACKLOG.md CLAUDE.md
git commit -m "docs(skin): Decision #90 + BACKLOG Switch followups + CLAUDE features refresh"
```

---

## Task 16: Run all checks, push, open PR, doc-update checklist

**Files:** None. Project-wide verification + PR creation.

**Steps:**

- [ ] **Step 1: Run all checks**

```bash
cd /Users/dio/Library/CloudStorage/Dropbox/Claudio/repos/stasho-ds/.claude/worktrees/skin+paraplu
npm run check
```

`npm run check` runs lint + typecheck + test across both workspaces (DS package + preview app). Expected: clean exit. If anything fails: fix in a new commit before pushing.

- [ ] **Step 2: Confirm the doc-update checklist (per project CLAUDE.md convention)**

Read recent commits (`git log --oneline -12`) and confirm every doc was touched. Use this exact checklist:

- [x] DESIGN-SYSTEM.md — Badge, Card, ProgressBar, Checkbox, RadioGroup sections (Task 14)
- [x] ARCHITECTURE.md — N/A. No new files, no new patterns. The flat-slot rest pattern for Checkbox/Radio extends Decision #84's existing Input pattern; no new architectural decision.
- [x] DECISIONS.md — Decision #90 prepended (Task 15)
- [x] BACKLOG.md — Switch ladder + Switch focus pattern follow-ups added (Task 15)
- [x] CLAUDE.md — 5 feature entries refreshed (Task 15)
- [x] SKIN-PRINCIPLES.md — § 4 chip row split + radii table cleanup + § 6 Direction C amendment (Task 13)

If any item is missing: add the missing edits in a new commit before pushing.

- [ ] **Step 3: Push the chunk branch**

```bash
git push -u origin skin/badge-card-progress-checkbox
```

Expected: branch pushed and tracking origin.

- [ ] **Step 4: Open the PR targeting `skin/paraplu` (NOT main)**

```bash
gh pr create --base skin/paraplu --title "feat(skin): badge · card · progress-bar · checkbox · radio (Decision #90)" --body "$(cat <<'EOF'
## Summary
- **Badge:** flat saturated solid + tinted hairline outline, 2px radius, info → cyan, light-mode `-500` text carve-out across all four semantic variants
- **Card:** always-on 1px `border-edge` hairline on default variant
- **ProgressBar:** `bg-accent` fill + `bg-muted dark:bg-neutral-900` track with Switch/Slider inset bevel, no glow on fill
- **Checkbox:** flat-slot rest (`bg-background dark:bg-surface`), 14/16/20 sizes, `rounded-none` on all sizes, Phosphor `<Check />` glyph
- **RadioGroup (cascade):** mirrors Checkbox rest + size changes; `rounded-full` stays
- **Principle deltas:** § 4 chip row split (Badge to contained-markers @ 2px), § 4 radii table cleanup (Switch thumb / Stepper indicators / Tabs pill removed from round-by-design — stale since #86/#88; RadioGroup added), § 6 Direction C amendment (ProgressBar fill moves from glow to flat-with-bevel)

Spec: `docs/superpowers/specs/2026-05-27-badge-card-progress-checkbox-revisit-design.md`
Plan: `docs/superpowers/plans/2026-05-27-badge-card-progress-checkbox-revisit.md`

## Test plan
- [ ] Badge preview page at `/components/badge` reviewed in both themes (all 10 variant×fill combos read correctly)
- [ ] Card preview page reviewed; default variant carries hairline in both themes; nested cards stay distinct
- [ ] ProgressBar preview page reviewed; cyan fill + recessed track in both themes; no glow on fill
- [ ] Checkbox preview page reviewed; rest visible in dark; 14/16/20 sizes register correctly; Phosphor check glyph reads comfortable
- [ ] RadioGroup preview page reviewed; rest visible in dark; sizes match Checkbox
- [ ] All component tests pass (badge, card, progress-bar, checkbox, radio-group)
- [ ] `npm run check` is clean
EOF
)"
```

Expected: PR created. Save the PR URL for the merge step.

- [ ] **Step 5: Squash-merge after CI/review**

```bash
gh pr merge <PR_NUMBER> --squash --delete-branch
```

(Run only after the PR is reviewed and approved.)

- [ ] **Step 6: Sync the integration worktree back to `skin/paraplu`**

```bash
git checkout skin/paraplu
git pull --ff-only origin skin/paraplu
git branch -d skin/badge-card-progress-checkbox
```

Expected: integration worktree now tracks `skin/paraplu` with the four-component revisit squash-merged in. Local chunk branch deleted.

---

## Notes for the agent executing this plan

- **TDD red phase is real per component.** Tasks 2/4/6/8/10 commit failing tests deliberately so the implementation tasks have a verification target. Do not skip them or fold into the green-phase tasks.
- **CVA classes are exact strings.** When updating a class name, copy the exact spelling (`bg-muted` not `bg-muted-500`, `bg-accent/15` not `bg-accent-50`). Tailwind 4 doesn't tolerate ambiguity in arbitrary-value classes.
- **Phosphor `weight="bold"` is the chosen stroke.** If visual review finds it too heavy, fall back to `weight="regular"` before the squash-merge — but don't change it preemptively.
- **Class-name cleanup on Checkbox (rounded → rounded-none) has zero visual impact.** Both resolved to 0px under the Abyssal scale (Decision #87). If you notice no visual change after the rename, that's correct.
- **Radio cascade is in scope.** Do not split it into a follow-up PR. RadioGroup shares the Checkbox chassis per Decision #85; divergence would be immediately visible.
- **Switch is out of scope.** Don't touch Switch sizes or focus pattern in this chunk — it's backlogged.
- **Visual verification (Task 12) is part of the definition of done.** Class assertions don't catch "rest checkbox still invisible because the hairline got brighter but the fill got darker." Walk the preview pages before the doc commits land.
- **All doc updates must land in this PR** — per project CLAUDE.md convention, no follow-up "docs catch-up" PRs. The checklist in Task 16 Step 2 is the gate.
- **No squash-merge to main** — this PR targets `skin/paraplu` (integration branch). Main only gets the integration branch when the whole Abyssal Void integration is ready.
