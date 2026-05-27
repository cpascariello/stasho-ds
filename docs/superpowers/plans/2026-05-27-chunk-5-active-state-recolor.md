# Chunk 5 — Active-state recolor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Swap every `primary-*` active/hover treatment in Tabs and Breadcrumb to `--accent` cyan, plus five alignment fixes per spec: Tabs focus → Button outline pattern (#82), Tabs disabled → semantic flatten (#84), pill active fill → tinted cyan, TabsList underline → 1px hairline (track + indicator), TabsList pill → `rounded-[2px]` + 1px `border-edge` hairline (removes Tabs pill from the SKIN-PRINCIPLES § 4 round-by-design list).

**Architecture:** Mechanical class-string swaps inside two component files. No new tokens, no new files, no API changes. Each component subtree gets a focused commit; docs land in one final commit. Tests are class-name-agnostic per ARCHITECTURE Testing Philosophy — existing tests should pass unchanged, no new tests added for visual class changes.

**Tech Stack:** React 19, Tailwind CSS 4 (with `@custom-variant dark`), Radix UI primitives (Tabs, DropdownMenu, Slot), Vitest, oxlint, TypeScript.

**Spec:** `docs/superpowers/specs/2026-05-27-chunk-5-active-state-recolor-design.md`

**Integration branch:** `skin/paraplu`. This chunk lives on a short-lived branch off `skin/paraplu`, PRs into `skin/paraplu`, and squash-merges. It does NOT target main.

---

## File map

| File | What changes | Owner |
|---|---|---|
| `packages/ds/src/components/tabs/tabs.tsx` | TabsList className (underline border-b + pill chrome — lines 357–376), TabsList sliding indicator (lines 388–411), TabsTrigger className block (lines 428–458), OverflowTrigger className + DropdownMenu Item active (lines 202–224, 257–265) | Tasks 2 · 3 · 4 |
| `packages/ds/src/components/breadcrumb/breadcrumb.tsx` | BreadcrumbLink hover (~ line 70), BreadcrumbSeparator (~ line 95), BreadcrumbPage (~ line 113) | Task 5 |
| `docs/SKIN-PRINCIPLES.md` | Append § 2 amendment per spec § 7 | Task 8 |
| `docs/DESIGN-SYSTEM.md` | Refresh Tabs + Breadcrumb entries | Task 8 |
| `docs/DECISIONS.md` | Append Decision #86 | Task 8 |
| `docs/BACKLOG.md` | Move chunk-5 backlog item to Completed | Task 8 |
| `CLAUDE.md` | Update Current Features for Tabs + Breadcrumb | Task 8 |

---

## Task 1: Create chunk branch off `skin/paraplu`

**Files:**
- No file edits. Branch operation only.

**Steps:**

- [ ] **Step 1: Verify we are on `skin/paraplu` and clean**

```bash
git status
git branch --show-current
```

Expected: `skin/paraplu`. Working tree clean (or only untracked files from the brainstorm session, which are gitignored).

- [ ] **Step 2: Sync `skin/paraplu` from origin**

```bash
git pull --ff-only origin skin/paraplu
```

Expected: `Already up to date` OR a fast-forward with no merge commits.

- [ ] **Step 3: Create chunk branch**

```bash
git checkout -b skin/active-state-recolor
```

Expected: `Switched to a new branch 'skin/active-state-recolor'`.

---

## Task 2: Tabs — TabsList chrome (underline thickness + pill shape + indicators)

**Files:**
- Modify: `packages/ds/src/components/tabs/tabs.tsx:357-411` (the `TabsList` container className and the indicator `<div>` inside it)

**Steps:**

- [ ] **Step 1: Run existing Tabs tests as baseline**

```bash
cd /Users/dio/Library/CloudStorage/Dropbox/Claudio/repos/stasho-ds/.claude/worktrees/skin+paraplu
npm run test -w packages/ds -- tabs.test
```

Expected: all existing Tabs tests pass. Clean baseline before touching styling.

- [ ] **Step 2: Replace the TabsList container className**

Open `packages/ds/src/components/tabs/tabs.tsx`. Find the `<TabsPrimitive.List>` near lines 357–376 (inside `TabsList`'s return):

```tsx
      <TabsPrimitive.List
        ref={setRefs}
        data-variant={variant}
        data-size={size}
        className={cn(
          "group relative flex",
          isPill
            ? [
                "rounded-full bg-muted",
                isSmall ? "p-0.5" : "p-1",
                !isCollapse && "inline-flex",
              ]
            : isSmall
              ? "border-b-2 border-edge/40"
              : "border-b-4 border-edge/40",
          className,
        )}
        {...rest}
      >
```

Replace with:

```tsx
      <TabsPrimitive.List
        ref={setRefs}
        data-variant={variant}
        data-size={size}
        className={cn(
          "group relative flex",
          isPill
            ? [
                "rounded-[2px] bg-muted border border-edge",
                isSmall ? "p-0.5" : "p-1",
                !isCollapse && "inline-flex",
              ]
            : "border-b border-edge/40",
          className,
        )}
        {...rest}
      >
```

Changes:
- Pill: `rounded-full bg-muted` → `rounded-[2px] bg-muted border border-edge` (Q6 — adds hairline + Card-grade radius)
- Underline (sm + md collapse): `border-b-2 border-edge/40` / `border-b-4 border-edge/40` → `border-b border-edge/40` (Q5 — 1px hairline for both sizes; the `isSmall ? ... : ...` ternary collapses to a single class)

- [ ] **Step 3: Replace the indicator `<div>` className**

In the same file, find the indicator `<div>` near lines 388–411:

```tsx
        <div
          ref={indicatorRef}
          className={cn(
            "absolute left-0",
            isPill
              ? [
                  isSmall ? "inset-y-0.5" : "inset-y-1",
                  "rounded-full bg-primary-600 dark:bg-primary-500",
                  ready ? "opacity-100" : "opacity-0",
                  ready
                    ? "transition-[transform,width,opacity] duration-200 ease-out"
                    : "",
                ]
              : [
                  isSmall ? "-bottom-0.5 h-0.5" : "-bottom-1 h-1",
                  "bg-primary-600 dark:bg-primary-400",
                  ready
                    ? "transition-[transform,width] duration-200 ease-out"
                    : "",
                ],
            "motion-reduce:transition-none",
          )}
          aria-hidden
        />
```

Replace with:

```tsx
        <div
          ref={indicatorRef}
          className={cn(
            "absolute left-0",
            isPill
              ? [
                  isSmall ? "inset-y-0.5" : "inset-y-1",
                  "rounded-[2px] bg-accent/15",
                  ready ? "opacity-100" : "opacity-0",
                  ready
                    ? "transition-[transform,width,opacity] duration-200 ease-out"
                    : "",
                ]
              : [
                  "-bottom-px h-px bg-accent",
                  ready
                    ? "transition-[transform,width] duration-200 ease-out"
                    : "",
                ],
            "motion-reduce:transition-none",
          )}
          aria-hidden
        />
```

Changes:
- Pill: `rounded-full bg-primary-600 dark:bg-primary-500` → `rounded-[2px] bg-accent/15` (Q1 + Q6)
- Underline (sm + md collapse): the `isSmall ? "-bottom-0.5 h-0.5" : "-bottom-1 h-1"` ternary + `bg-primary-600 dark:bg-primary-400` collapse to `"-bottom-px h-px bg-accent"` (Q5 — both sizes use 1px hairline; `-bottom-px` is Tailwind for `bottom: -1px`)

The underline indicator stays a solid bar (no glow) per Direction C — text/slot indicators are flat cyan, not lit surfaces.

- [ ] **Step 4: Run Tabs tests**

```bash
npm run test -w packages/ds -- tabs.test
```

Expected: all tests pass. (Class-name changes don't break behavior tests.)

**Implementation note:** if `-bottom-px` doesn't resolve in your Tailwind 4 build (it should — `px` is the 1px scale token), fallback is `[bottom:-1px]` arbitrary value. Same for `h-px` → `[height:1px]`. Both are standard Tailwind utilities and should just work.

- [ ] **Step 5: Commit**

```bash
git add packages/ds/src/components/tabs/tabs.tsx
git commit -m "feat(skin): Tabs — TabsList hairline underline + pill rounded-[2px] + cyan indicators"
```

---

## Task 3: Tabs — TabsTrigger (incl. pill overrides)

**Files:**
- Modify: `packages/ds/src/components/tabs/tabs.tsx:421-466` (the `TabsTrigger` component)

**Steps:**

- [ ] **Step 1: Replace the TabsTrigger className block**

Open `packages/ds/src/components/tabs/tabs.tsx`. Find `TabsTrigger` near lines 421–466:

```tsx
const TabsTrigger = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...rest }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      [
        "inline-flex items-center gap-2 px-4 py-3",
        "font-sans font-semibold text-sm",
        "text-foreground",
        "transition-[color,transform] duration-200 ease-out",
        "hover:text-primary-600 dark:hover:text-primary-400",
        "data-[state=active]:text-primary-600",
        "dark:data-[state=active]:text-primary-400",
        "data-[state=active]:-translate-y-0.5",
        "disabled:opacity-20 disabled:pointer-events-none",
        "focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-primary-400 focus-visible:ring-offset-2",
        "motion-reduce:transition-none",
        // Small size overrides (underline)
        "group-data-[size=sm]:px-3 group-data-[size=sm]:py-1.5",
        "group-data-[size=sm]:text-sm group-data-[size=sm]:gap-1.5",
        // Pill variant overrides (via group data attribute on TabsList)
        "group-data-[variant=pill]:relative group-data-[variant=pill]:z-10",
        "group-data-[variant=pill]:rounded-full",
        "group-data-[variant=pill]:px-5 group-data-[variant=pill]:py-1.5",
        "group-data-[variant=pill]:text-sm",
        "group-data-[variant=pill]:text-muted-foreground",
        "group-data-[variant=pill]:translate-y-0",
        "group-data-[variant=pill]:hover:text-foreground",
        "group-data-[variant=pill]:data-[state=active]:text-white",
        "group-data-[variant=pill]:data-[state=active]:translate-y-0",
        "group-data-[variant=pill]:focus-visible:ring-offset-0",
        // Small pill overrides (compound group selector)
        "group-[[data-variant=pill][data-size=sm]]:px-3",
        "group-[[data-variant=pill][data-size=sm]]:py-1",
        "group-[[data-variant=pill][data-size=sm]]:text-xs",
      ].join(" "),
      className,
    )}
    {...rest}
  />
));
```

Replace with:

```tsx
const TabsTrigger = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...rest }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      [
        "inline-flex items-center gap-2 px-4 py-3",
        "font-sans font-semibold text-sm",
        "text-foreground",
        "transition-[color,transform] duration-200 ease-out",
        "hover:text-accent",
        "data-[state=active]:text-accent",
        "data-[state=active]:-translate-y-0.5",
        "disabled:text-foreground/30 disabled:cursor-not-allowed",
        "focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2",
        "motion-reduce:transition-none",
        // Small size overrides (underline)
        "group-data-[size=sm]:px-3 group-data-[size=sm]:py-1.5",
        "group-data-[size=sm]:text-sm group-data-[size=sm]:gap-1.5",
        // Pill variant overrides (via group data attribute on TabsList)
        "group-data-[variant=pill]:relative group-data-[variant=pill]:z-10",
        "group-data-[variant=pill]:rounded-[2px]",
        "group-data-[variant=pill]:px-5 group-data-[variant=pill]:py-1.5",
        "group-data-[variant=pill]:text-sm",
        "group-data-[variant=pill]:text-muted-foreground",
        "group-data-[variant=pill]:translate-y-0",
        "group-data-[variant=pill]:hover:text-accent",
        "group-data-[variant=pill]:data-[state=active]:text-accent",
        "group-data-[variant=pill]:data-[state=active]:translate-y-0",
        // Small pill overrides (compound group selector)
        "group-[[data-variant=pill][data-size=sm]]:px-3",
        "group-[[data-variant=pill][data-size=sm]]:py-1",
        "group-[[data-variant=pill][data-size=sm]]:text-xs",
      ].join(" "),
      className,
    )}
    {...rest}
  />
));
```

Key changes:
- `hover:text-primary-600 dark:hover:text-primary-400` → `hover:text-accent` (one line, no dark variant)
- `data-[state=active]:text-primary-600` + `dark:data-[state=active]:text-primary-400` → `data-[state=active]:text-accent` (one line)
- `disabled:opacity-20 disabled:pointer-events-none` → `disabled:text-foreground/30 disabled:cursor-not-allowed`
- `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2` → `focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2` (drop ring + outline-none; native outline replaces ring shadow)
- Pill: `group-data-[variant=pill]:rounded-full` → `group-data-[variant=pill]:rounded-[2px]` (Q6 — matches the new pill list shape from Task 2)
- Pill: `group-data-[variant=pill]:hover:text-foreground` → `group-data-[variant=pill]:hover:text-accent`
- Pill: `group-data-[variant=pill]:data-[state=active]:text-white` → `group-data-[variant=pill]:data-[state=active]:text-accent`
- Pill: drop `group-data-[variant=pill]:focus-visible:ring-offset-0` (outline pattern doesn't use ring-offset; nothing to override)

Same-hex rule: `--accent` is `#00E1FA` in both modes, so `text-accent` / `outline-accent` need no `dark:` variants.

**Implementation note:** if Tailwind's `outline-2` doesn't render the focus outline crisply in your build (older browsers used to swallow outline on flex containers), the fallback is `[outline:2px_solid_var(--accent)] outline-offset-2`. The Button focus uses the regular `outline-*` utilities — should compose the same way here.

- [ ] **Step 2: Run Tabs tests**

```bash
npm run test -w packages/ds -- tabs.test
```

Expected: all tests pass.

- [ ] **Step 3: Commit**

```bash
git add packages/ds/src/components/tabs/tabs.tsx
git commit -m "feat(skin): Tabs — TabsTrigger cyan hover/active, outline focus, semantic disabled"
```

---

## Task 4: Tabs — OverflowTrigger + DropdownMenu items

**Files:**
- Modify: `packages/ds/src/components/tabs/tabs.tsx:194-274` (the `OverflowTrigger` component)

**Steps:**

- [ ] **Step 1: Replace the OverflowTrigger button className**

Open `packages/ds/src/components/tabs/tabs.tsx`. Find the `<button>` inside `OverflowTrigger` near lines 198–227:

```tsx
        <button
          ref={ref}
          type="button"
          aria-label="More tabs"
          className={cn(
            "inline-flex items-center justify-center shrink-0",
            "font-sans font-semibold",
            hasActiveHidden && isPill
              ? "text-white"
              : hasActiveHidden
                ? "text-primary-600 dark:text-primary-400"
                : "text-muted-foreground",
            "transition-colors duration-200",
            "hover:text-primary-600 dark:hover:text-primary-400",
            "focus-visible:outline-none focus-visible:ring-2",
            "focus-visible:ring-primary-400 focus-visible:ring-offset-2",
            "motion-reduce:transition-none",
            isPill
              ? cn(
                  "relative z-10 rounded-full",
                  isSmall ? "px-2 py-0.5 text-xs" : "px-3 py-1.5 text-sm",
                )
              : isSmall
                ? "px-3 py-1.5 text-sm"
                : "px-4 py-3 text-sm",
            !visible && "invisible",
          )}
        >
```

Replace with:

```tsx
        <button
          ref={ref}
          type="button"
          aria-label="More tabs"
          className={cn(
            "inline-flex items-center justify-center shrink-0",
            "font-sans font-semibold",
            hasActiveHidden ? "text-accent" : "text-muted-foreground",
            "transition-colors duration-200",
            "hover:text-accent",
            "focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2",
            "motion-reduce:transition-none",
            isPill
              ? cn(
                  "relative z-10 rounded-[2px]",
                  isSmall ? "px-2 py-0.5 text-xs" : "px-3 py-1.5 text-sm",
                )
              : isSmall
                ? "px-3 py-1.5 text-sm"
                : "px-4 py-3 text-sm",
            !visible && "invisible",
          )}
        >
```

Key changes:
- Active-hidden ternary collapses: `hasActiveHidden && isPill ? "text-white" : hasActiveHidden ? "text-primary-600 dark:text-primary-400" : "text-muted-foreground"` becomes `hasActiveHidden ? "text-accent" : "text-muted-foreground"`. The pill carve-out (`text-white`) is no longer needed because both pill and non-pill active states use the same `text-accent` now — the cyan reads against both the tinted pill indicator and the underline track.
- `hover:text-primary-600 dark:hover:text-primary-400` → `hover:text-accent`
- Focus: ring → outline (same swap as TabsTrigger)
- Pill branch: `"relative z-10 rounded-full"` → `"relative z-10 rounded-[2px]"` (Q6 — matches the new pill list + trigger shape)

- [ ] **Step 2: Replace the DropdownMenu Item active styling**

In the same file, find the `<DropdownMenu.Item>` near lines 241–268. Look for the `tab.triggerEl.dataset["state"] === "active" &&` conditional class on line ~263:

```tsx
                tab.triggerEl.dataset["state"] === "active" &&
                  "text-primary-600 dark:text-primary-400 font-semibold",
```

Replace with:

```tsx
                tab.triggerEl.dataset["state"] === "active" &&
                  "text-accent font-semibold",
```

(One-line change — `text-primary-600 dark:text-primary-400` collapses to `text-accent`.)

**Out of scope (deferred to chunk 6):** the `<DropdownMenu.Content>` className still has `rounded-md` (should become `rounded-none` per the 0/0/2/4 vocabulary) and `shadow-brand` (audit pending). Leave both untouched in this chunk.

- [ ] **Step 3: Run Tabs tests**

```bash
npm run test -w packages/ds -- tabs.test
```

Expected: all tests pass.

- [ ] **Step 4: Commit**

```bash
git add packages/ds/src/components/tabs/tabs.tsx
git commit -m "feat(skin): Tabs — OverflowTrigger + DropdownMenu cyan active state"
```

---

## Task 5: Breadcrumb — link hover, separator, current page

**Files:**
- Modify: `packages/ds/src/components/breadcrumb/breadcrumb.tsx:61-117`

**Steps:**

- [ ] **Step 1: Run existing Breadcrumb tests as baseline**

```bash
npm run test -w packages/ds -- breadcrumb.test
```

Expected: all existing Breadcrumb tests pass.

- [ ] **Step 2: Replace BreadcrumbLink hover class**

Open `packages/ds/src/components/breadcrumb/breadcrumb.tsx`. Find `BreadcrumbLink` around lines 61–79:

```tsx
const BreadcrumbLink = forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
  ({ asChild, className, ...rest }, ref) => {
    const Comp = asChild ? Slot.Root : "a";
    return (
      <Comp
        ref={ref}
        className={cn(
          "text-foreground",
          "transition-colors duration-150",
          "hover:text-primary-600 dark:hover:text-primary-400",
          "motion-reduce:transition-none",
          className,
        )}
        {...rest}
      />
    );
  },
);
```

Replace the hover line:

```tsx
const BreadcrumbLink = forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
  ({ asChild, className, ...rest }, ref) => {
    const Comp = asChild ? Slot.Root : "a";
    return (
      <Comp
        ref={ref}
        className={cn(
          "text-foreground",
          "transition-colors duration-150",
          "hover:text-accent",
          "motion-reduce:transition-none",
          className,
        )}
        {...rest}
      />
    );
  },
);
```

(One-line change: `hover:text-primary-600 dark:hover:text-primary-400` → `hover:text-accent`.)

- [ ] **Step 3: Replace BreadcrumbSeparator color**

Find `BreadcrumbSeparator` around lines 88–101:

```tsx
const BreadcrumbSeparator = forwardRef<
  HTMLLIElement,
  BreadcrumbSeparatorProps
>(({ children, className, ...rest }, ref) => (
  <li
    ref={ref}
    aria-hidden="true"
    className={cn("text-primary opacity-40", className)}
    {...rest}
  >
    {children ?? "/"}
  </li>
));
```

Replace the className:

```tsx
const BreadcrumbSeparator = forwardRef<
  HTMLLIElement,
  BreadcrumbSeparatorProps
>(({ children, className, ...rest }, ref) => (
  <li
    ref={ref}
    aria-hidden="true"
    className={cn("text-foreground/25", className)}
    {...rest}
  >
    {children ?? "/"}
  </li>
));
```

(One-line change: `text-primary opacity-40` → `text-foreground/25`.)

- [ ] **Step 4: Replace BreadcrumbPage color**

Find `BreadcrumbPage` around lines 106–117:

```tsx
const BreadcrumbPage = forwardRef<
  HTMLSpanElement,
  HTMLAttributes<HTMLSpanElement>
>(({ className, ...rest }, ref) => (
  <span
    ref={ref}
    aria-current="page"
    className={cn("text-neutral opacity-40", className)}
    {...rest}
  />
));
```

Replace the className:

```tsx
const BreadcrumbPage = forwardRef<
  HTMLSpanElement,
  HTMLAttributes<HTMLSpanElement>
>(({ className, ...rest }, ref) => (
  <span
    ref={ref}
    aria-current="page"
    className={cn("text-accent", className)}
    {...rest}
  />
));
```

(One-line change: `text-neutral opacity-40` → `text-accent`. Note: spec § 5.3 flagged that the code drifted from spec assumption — old value was `text-neutral opacity-40`, not `text-primary opacity-40`. New value is the same regardless.)

- [ ] **Step 5: Run Breadcrumb tests, confirm pass**

```bash
npm run test -w packages/ds -- breadcrumb.test
```

Expected: all tests pass.

- [ ] **Step 6: Commit**

```bash
git add packages/ds/src/components/breadcrumb/breadcrumb.tsx
git commit -m "feat(skin): Breadcrumb — cyan current page, quieter separators, cyan link hover"
```

---

## Task 6: Run full check suite

**Files:**
- No file edits. Verification only.

**Steps:**

- [ ] **Step 1: Run lint + typecheck + test across all workspaces**

```bash
npm run check
```

Expected: all three (lint, typecheck, test) pass with zero warnings. This is the gate before visual review.

If anything fails, fix it before moving to the next task. Do not paper over warnings — the project enforces a zero-warning policy.

---

## Task 7: Visual verification in preview app

**Files:**
- Visual review only — no code changes expected.

**Steps:**

- [ ] **Step 1: Start the dev server**

```bash
npm run dev
```

Open the printed URL (typically `http://localhost:3000`).

- [ ] **Step 2: Verify Tabs underline variant**

Navigate to `/components/tabs`. Check the underline variant section.

Expected:
- Underline track is 1px (hairline) at both sm and md sizes — not the prior 2px/4px chrome
- Sliding indicator is 1px solid cyan (`#00E1FA`) — overlays the track at active position
- Active trigger text is cyan, nudged up 2px above the indicator bar
- Hover on a non-active trigger turns the text cyan
- Focused trigger shows a 2px cyan outline at 2px offset (Tab to it from another control to test)
- Disabled trigger renders at 30% foreground opacity with `not-allowed` cursor — not faded at 20% opacity

Toggle the theme switcher (top right). Verify the cyan stays the same hex in both modes (same-hex rule). The 1px cyan indicator should remain readable in both modes; if it disappears against a busy background, flag for fallback to 2px.

- [ ] **Step 3: Verify Tabs pill variant**

Same page, scroll to the pill variant section.

Expected:
- Pill list shape is `rounded-[2px]` (Card-grade rounded corners) — not the prior pill/capsule shape
- Pill list has a 1px `border-edge` hairline framing the segmented control
- Pill list background is still `bg-muted` (the cyan-tinted indicator slides on top)
- Pill triggers are also `rounded-[2px]` (matches the list shape)
- Active pill background is a soft cyan tint (`bg-accent/15`), not a solid colored pill
- Active text is cyan
- Hover on non-active pill turns text cyan
- Disabled pill: text at 30% foreground opacity

Check both md (default) and sm sizes if both are shown. Toggle theme — the tinted indicator may look more subtle in light mode (warning in spec § 9); if it's hard to see, note for follow-up. The 2px rounded corners on the list may feel "boxy" compared to the prior pill — this is intentional per the SKIN-PRINCIPLES § 4 amendment; confirm the read is "instrument switch panel" not "broken pill control".

- [ ] **Step 4: Verify Tabs overflow + dropdown**

If the preview demonstrates `overflow="collapse"` or `maxVisible`, narrow the browser window until the "..." trigger appears. Click an overflowed tab.

Expected:
- When an overflowed tab is active, the "..." button text is cyan
- Hover on "..." turns it cyan
- Click "..." to open the dropdown — the active hidden tab in the list shows `text-accent font-semibold`
- The dropdown bubble itself (rounded-md, shadow-brand) is unchanged — that's chunk 6 territory

- [ ] **Step 5: Verify Breadcrumb**

Navigate to `/components/breadcrumb`. Check each demo.

Expected:
- Link text rests as foreground; hover turns it cyan
- Separators (`/`) render at 25% foreground opacity — barely there but legible
- Current page (`BreadcrumbPage`) is full cyan, no opacity
- Custom separator demos (if any) still work

- [ ] **Step 6: Verify accessibility**

In Tabs:
- Tab into a trigger — focus outline should be visible
- Arrow keys cycle between triggers (Radix behavior, no regression)
- Disabled trigger is skipped by keyboard (Radix behavior)

In Breadcrumb:
- Last item should have `aria-current="page"` (inspect DOM to confirm)
- Separators have `aria-hidden="true"` (inspect to confirm — should already be set)

- [ ] **Step 7: Report**

If anything looks off (light-mode pill tint too subtle, separator too quiet, focus outline jagged), report back before proceeding to docs. The spec's risks section pre-empted the light-mode pill concern as a likely visual-review finding.

---

## Task 8: Update docs

**Files:**
- Modify: `docs/SKIN-PRINCIPLES.md`
- Modify: `docs/DESIGN-SYSTEM.md`
- Modify: `docs/DECISIONS.md`
- Modify: `docs/BACKLOG.md`
- Modify: `CLAUDE.md`

**Steps:**

- [ ] **Step 1: Update SKIN-PRINCIPLES.md — § 2 amendment (active states)**

Open `docs/SKIN-PRINCIPLES.md`. Find § 2 Color → "Semantic color mapping" sub-section. After the table mapping `--primary` / `--accent` / etc. to their roles, add a new paragraph (or extend the existing `--accent` row's "Role" description):

```markdown
**Active states.** Selected / checked / active states on form controls and navigation (Switch, Slider, Checkbox, Radio, active Tab, active Breadcrumb, ProgressBar) use `--accent`. Primary's chassis role (Button only) is preserved.
**Source:** Decision #86.
```

Place this after the existing "Semantic color mapping" paragraph and before "No decorative texture". Match the existing prose voice — short, declarative, sourced.

- [ ] **Step 1b: Update SKIN-PRINCIPLES.md — § 4 round-by-design list**

Same file. Find § 4 Geometry → "`full` is for round-by-design only" sub-section. The current list reads:

```markdown
- StatusDot (a dot IS round)
- Slider thumb / Switch thumb (a control puck IS round)
- ProgressBar track (the rounded ends are a graph convention)
- MultiSelect tag chips (tags carry "soft / removable" semantics)
- Stepper indicators (a step ring IS round)
- Tabs pill variant (segmented control is pill-shaped by convention)
```

**Remove the Tabs pill entry** — chunk 5 reshapes the pill list and triggers to `rounded-[2px]`. Also update the rule's prose to clarify that "by convention" alone is not sufficient justification (the list is "round-by-design", not "round-by-precedent"):

```markdown
- StatusDot (a dot IS round)
- Slider thumb / Switch thumb (a control puck IS round)
- ProgressBar track (the rounded ends are a graph convention)
- MultiSelect tag chips (tags carry "soft / removable" semantics) — **flagged for audit**
- Stepper indicators (a step ring IS round) — **flagged for audit**

**Source:** Decision #86 (Tabs pill removed). The `--accent` round-by-design list is "round-by-design only, never round-by-convention" — entries on this list need a semantic reason for the round shape, not a precedent from other DSs. MultiSelect chips and Stepper indicators carry the same convention-only justification that Tabs pill did and should be revisited in a dedicated rounded-full audit chunk after chunk 5 ships.
```

(Switch track is already round per "Switch thumb" being on the list — the *track* shape is implicit in `rounded-full` on the container. The audit should also revisit whether Switch track needs `rounded-full` or can move to `rounded-[2px]`.)

- [ ] **Step 2: Update DESIGN-SYSTEM.md — Tabs entry**

Open `docs/DESIGN-SYSTEM.md`. Find the Tabs component entry. Update any references to the active-state color (primary blue) to cyan accent. Specifically:
- Underline variant: "active sliding indicator in primary blue" → "active sliding indicator in cyan accent (`--accent` / `bg-accent`)"
- Pill variant: any mention of the solid primary pill → "active pill renders as cyan-tinted fill (`bg-accent/15`) with cyan text"
- Active trigger text: any mention of primary color → cyan accent
- Focus treatment: mention the outline-based focus (matches Button pattern)
- Disabled trigger: mention the semantic flatten (`text-foreground/30 cursor-not-allowed`), no `opacity-20`

If the entry has a code example, update it to reflect default rendering with cyan.

- [ ] **Step 3: Update DESIGN-SYSTEM.md — Breadcrumb entry**

Same file. Find the Breadcrumb entry. Update:
- BreadcrumbLink hover: cyan accent (no longer primary)
- BreadcrumbSeparator: `text-foreground/25` (replaces the previous opacity-40 primary)
- BreadcrumbPage (current page): `text-accent` (replaces the previous faded neutral)

- [ ] **Step 4: Append Decision #86 to DECISIONS.md**

Open `docs/DECISIONS.md`. Append a new entry at the top of the decision log (after the header / format docs). Copy this verbatim, substituting the actual date:

```markdown
## Decision #86 — 2026-05-27

**Context:** Tabs and Breadcrumb signaled active/hover with `text-primary-600 dark:text-primary-400` / `bg-primary-*` — primary blue's chassis role from Button competing with active-state navigation for visual weight. Wave-1 spec § 5 committed conceptually to cyan accent as the wave's active-state language; chunk 5 implements that swap across Tabs (TabsList indicators, TabsTrigger, OverflowTrigger, DropdownMenu items) and Breadcrumb (link hover, separator, current page). Separately, TabsList chrome (underline border-b at 2px/4px, pill list with `bg-muted` no border and `rounded-full` shape + triggers) predated the strict 0/0/2/4 + hairline-only geometry of Decisions #78 / #82 / #84. Brainstorming resolved six visual questions: pill active fill, underline nudge, breadcrumb current page, breadcrumb separator, underline track + indicator thickness, and pill list/trigger shape (including whether `rounded-full` survives the "round-by-design" rule).
**Decision:** Adopt cyan `--accent` for active and hover across Tabs and Breadcrumb. **Tabs underline:** track + indicator collapse to 1px hairline at both sm and md (`border-b border-edge/40` + `-bottom-px h-px bg-accent`); active trigger text becomes `text-accent` with the `-translate-y-0.5` lift kept. **Tabs pill list:** moves from `rounded-full bg-muted` (no border) to `rounded-[2px] bg-muted border border-edge` — adds the chunk-4 hairline chrome vocabulary, drops Tabs pill from the SKIN-PRINCIPLES § 4 round-by-design reserved list. **Tabs pill triggers + sliding indicator:** `rounded-full` → `rounded-[2px]` to match the new list shape; indicator becomes `bg-accent/15` (tinted, not solid); active trigger text becomes `text-accent`, hover text becomes `text-accent`. **Tabs trigger alignment:** focus moves from `ring-primary-400 ring-offset-2` to `outline-2 outline-accent outline-offset-2` (Decision #82); disabled moves from `opacity-20` to `text-foreground/30 cursor-not-allowed` (Decision #84). **OverflowTrigger** mirrors TabsTrigger active/hover/focus; per-pill `text-white` carve-out collapses to `text-accent`; pill branch `rounded-full` → `rounded-[2px]`. **DropdownMenu** active hidden-tab item becomes `text-accent font-semibold`. **Breadcrumb:** link hover → `text-accent`, separator → `text-foreground/25`, current page → `text-accent` (drops the opacity-40 workaround). **Cascade flagged for follow-up:** Switch track, MultiSelect tag chips, Stepper indicators carry the same convention-only `rounded-full` justification — handled in a dedicated rounded-full audit chunk after chunk 5 ships. Out of scope: DropdownMenu Content `rounded-md` + `shadow-brand` (chunk 6 popover audit).
**Rationale:** **Pill-tinted fill over solid** — fully saturated cyan pill would be the loudest single cyan surface in the wave and put a navigation control on the same visual plane as Button. Tinted carries "active" via colour without committing the pill area to brand saturation. **Underline nudge kept** — position + colour both signal active; with cyan replacing primary, the nudge becomes additive emphasis. **Underline collapse to 1px hairline** — SKIN-PRINCIPLES § 4 mandates hairline borders; the previous 4px chrome was a pre-Abyssal carve-out, and with cyan as the active signal, both track and indicator can honour the rule without losing the slide-between-tabs read. **Pill list `rounded-[2px]` + hairline border** — two principles converge: the chunk-4 chrome vocabulary (text inputs adopted 1px `--edge` hairlines as the "slot" framing — segmented controls deserve the same), and the round-by-design rule (Tabs pill was on the reserved list under "by convention", which doesn't survive scrutiny — convention is not a skin principle). `rounded-[2px]` (Card grade) over `rounded-none` because the 2px softening matches Card and Dialog and gives a useful visual ladder ("contained group" vs "primitive control"). **Current page in full cyan** — consistent with active-state vocabulary across chunk 4 and Tabs; previous `opacity-40` read as "deprioritised", the opposite of what current page is. **Separator at 25%** — with the current page now cyan, separators recede so the cyan reads cleanly; 40% would compete, `text-edge` would disappear. **Disabled flatten** — `opacity-20` reads "loading"; `foreground/30 + cursor-not-allowed` reads "semantically broken" (Decision #84 vocabulary). **Focus outline over ring** — composes with the trigger's translate-y nudge (box-shadow ring would replace the bevel; outline sits at the chassis edge and matches Button). Same-hex rule: `text-accent` / `outline-accent` need no `dark:` variants.
**Alternatives considered:** Solid cyan pill fill (loudest — rejected for noise-budget). Outlined cyan chip on pill mirroring Pagination chunk-4 treatment (rejected — segmented control benefits from a fill cue more than navigation chip does). Drop underline nudge (rejected — colour alone is enough but the nudge gives a second cue). Hairline underline track + 2px indicator (rejected — middle-ground; the 1px/1px treatment reads cleanly with cyan doing the lifting). Keep `rounded-full` on pill (rejected — "by convention" is not a principle; the skin is committedly brutalist). `rounded-none` on pill (rejected — loses the Card-grade "contained group" softening that distinguishes pill list from text input chassis). Neutral current breadcrumb page (rejected — too implicit; trail needs a visible focal point). Cyan dot prefix + neutral page text (rejected — borrows StatusDot vocabulary). Separator at `text-foreground/40` (rejected — direct port of opacity but doesn't yield to the new cyan focal point). Separator at `text-edge` (rejected — too quiet). Keep `ring-primary-400` focus (rejected — ring + outline-none was needed for the primary-tinted shadow ring; native outline composes more cleanly). Keep `opacity-20` disabled (rejected — Decision #84 ruled opacity tricks out of chassis vocabulary). Bundle Switch track + MultiSelect chips + Stepper indicators into this chunk (rejected — Switch is shipped, MultiSelect + Stepper are chunk 6+ scope; a focused rounded-full audit chunk is more reviewable).
```

- [ ] **Step 5: Update BACKLOG.md — completed entry + two new open items**

Open `docs/BACKLOG.md`. If there is an Open Item for chunk 5 / active-state recolor, move it under `## Completed / Rejected`. If there isn't one, add a Completed entry under that section:

```markdown
- [x] 2026-05-27 — Chunk 5 active-state recolor + TabsList chrome polish (Tabs + Breadcrumb): `primary-*` → cyan `--accent` on active/hover; pill indicator → `bg-accent/15` tinted; underline track + indicator collapse to 1px hairline (both sizes); pill list adds 1px `border-edge` hairline + moves to `rounded-[2px]`; pill triggers + sliding indicator + OverflowTrigger pill branch all move to `rounded-[2px]`; Tabs focus → outline-accent pattern (Decision #82 alignment); Tabs disabled → semantic flatten (Decision #84 alignment); Breadcrumb current page → `text-accent`; Breadcrumb separator → `text-foreground/25`. SKIN-PRINCIPLES § 2 + § 4 amended.
```

Then add two new entries under `## Open Items` (the section above `## Completed / Rejected`) to capture the chunk-5 cascade:

```markdown
### 2026-05-27 — Pagination active-state recolor

**Source:** Wave-1 spec § 5.1; pulled out of chunk 5 to keep both chunks reviewable
**Description:** Apply the wave-1 § 5.1 change table to Pagination — `text-primary-*` → cyan accent on number color, hover, and ellipsis; active number becomes outlined chip (`bg-muted dark:bg-neutral-900` + `border border-accent` + `text-accent`); number button size drops to 26×26 (nav arrows stay 32×32). Own short chunk: `skin/pagination-recolor` off `skin/paraplu`.
**Priority:** High (blocks the visual cohesion of the wave — pagination is the last component still rendering primary-blue active state)

### 2026-05-27 — Rounded-full audit

**Source:** Decision #86 cascade
**Description:** SKIN-PRINCIPLES § 4 amendment ("round-by-design only, never round-by-convention") flags three remaining components on the reserved list that share the convention-only justification Tabs pill just lost: Switch track (currently `rounded-full` — shipped in chunk 4), MultiSelect tag chips (chunks 6+ territory, unshipped), Stepper indicators (chunk 7 territory, unshipped). Audit each and either keep `rounded-full` with a new semantic justification or move to `rounded-[2px]` to match the Tabs pill treatment. Single chunk: `skin/rounded-full-audit` off `skin/paraplu`.
**Priority:** Medium (does not block the wave but completes the principle work started in chunk 5)
```

- [ ] **Step 6: Update CLAUDE.md — Current Features**

Open `CLAUDE.md`. Find the Current Features list. Update the Tabs entry — the existing entry describes the underline + pill variants in detail; replace any mention of primary-blue active treatment with cyan accent. Match the existing voice and structure (the chunk-4 features entries are good templates).

Update the Breadcrumb entry similarly — current page is `text-accent`, hover is `text-accent`, separator is `text-foreground/25`.

- [ ] **Step 7: Verify checks still pass after docs edits**

```bash
npm run check
```

Expected: pass. (Docs-only changes shouldn't break anything, but the markdown linter — if enabled — may complain about list formatting; fix any issues before committing.)

- [ ] **Step 8: Commit docs**

```bash
git add docs/SKIN-PRINCIPLES.md docs/DESIGN-SYSTEM.md docs/DECISIONS.md docs/BACKLOG.md CLAUDE.md
git commit -m "docs(skin): chunk 5 active-state recolor — Decision #86, principles + features update"
```

---

## Task 9: Push branch and open PR into `skin/paraplu`

**Files:**
- No file edits. Branch and PR operations.

**Steps:**

- [ ] **Step 1: Push the chunk branch**

```bash
git push -u origin skin/active-state-recolor
```

Expected: branch created on origin, tracking set up.

- [ ] **Step 2: Open PR targeting `skin/paraplu` (NOT main)**

```bash
gh pr create \
  --base skin/paraplu \
  --title "feat(skin): active-state recolor across Tabs + Breadcrumb" \
  --body "$(cat <<'EOF'
## Summary

Chunk 5 of the wave-1 skin sweep. Swaps every `primary-*` active/hover treatment in Tabs and Breadcrumb to cyan `--accent`, plus three alignment fixes:

- Tabs focus moves to the Button outline pattern (`outline-2 outline-accent outline-offset-2`) — Decision #82 alignment
- Tabs disabled drops `opacity-20` for `text-foreground/30 cursor-not-allowed` — Decision #84 alignment
- Pill-variant active fill is the tinted middle option (`bg-accent/15`), not solid cyan — visual review picked the quieter treatment

Pagination moved out of chunk 5 (now lives in chunk 4). DropdownMenu Content `rounded-md` + `shadow-brand` deferred to chunk 6 (popover surfaces audit).

Spec: `docs/superpowers/specs/2026-05-27-chunk-5-active-state-recolor-design.md`
Decision: #86 (see `docs/DECISIONS.md`)

## Test plan

- [ ] `npm run check` passes (lint + typecheck + test)
- [ ] Tabs underline: sliding indicator is solid cyan, active text is cyan + nudged up 2px
- [ ] Tabs pill: indicator is tinted cyan (`bg-accent/15`), active text is cyan
- [ ] Tabs focus shows native cyan outline at 2px offset (Tab into a trigger)
- [ ] Tabs disabled renders at 30% foreground + `not-allowed` cursor
- [ ] Tabs overflow + DropdownMenu: "..." text turns cyan when overflowed tab is active; dropdown active item is `text-accent font-semibold`
- [ ] Breadcrumb: link hover is cyan, separator at 25% foreground opacity, current page is full cyan
- [ ] Theme toggle: same-hex cyan in light and dark
- [ ] Reduced motion: focus and active transitions still readable with `prefers-reduced-motion: reduce`
EOF
)"
```

Expected: PR created against `skin/paraplu`. The CI workflow (`.github/workflows/ci.yml`) does NOT run on chunk PRs into the integration branch — it only runs on PRs to `main`. The `npm run check` gate from Task 6 + Task 8 is the safety net.

- [ ] **Step 3: Squash-merge the PR**

```bash
gh pr merge <pr-number> --squash --delete-branch
```

Replace `<pr-number>` with the actual number from Step 2's output. This merges the chunk into `skin/paraplu` and deletes the remote chunk branch.

- [ ] **Step 4: Sync the local integration branch**

```bash
git checkout skin/paraplu
git pull --ff-only origin skin/paraplu
```

Expected: fast-forward to the squash commit.

- [ ] **Step 5: Delete the local chunk branch**

```bash
git branch -D skin/active-state-recolor
```

Expected: local branch deleted.

- [ ] **Step 6: Verify worktree state**

```bash
git status
git branch -vv
```

Expected: on `skin/paraplu`, up to date with origin, no stray chunk branches. Chunk 5 is shipped into the integration branch. Chunks 6 (container surfaces) and 7 (data-display chrome) remain.
