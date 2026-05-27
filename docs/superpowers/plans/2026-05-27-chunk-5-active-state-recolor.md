# Chunk 5 — Active-state recolor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Swap every `primary-*` active/hover treatment in Tabs and Breadcrumb to `--accent` cyan, plus three alignment fixes per spec (Tabs focus → Button outline pattern, Tabs disabled → semantic flatten, pill active fill → tinted cyan).

**Architecture:** Mechanical class-string swaps inside two component files. No new tokens, no new files, no API changes. Each component subtree gets a focused commit; docs land in one final commit. Tests are class-name-agnostic per ARCHITECTURE Testing Philosophy — existing tests should pass unchanged, no new tests added for visual class changes.

**Tech Stack:** React 19, Tailwind CSS 4 (with `@custom-variant dark`), Radix UI primitives (Tabs, DropdownMenu, Slot), Vitest, oxlint, TypeScript.

**Spec:** `docs/superpowers/specs/2026-05-27-chunk-5-active-state-recolor-design.md`

**Integration branch:** `skin/paraplu`. This chunk lives on a short-lived branch off `skin/paraplu`, PRs into `skin/paraplu`, and squash-merges. It does NOT target main.

---

## File map

| File | What changes | Owner |
|---|---|---|
| `packages/ds/src/components/tabs/tabs.tsx` | TabsList sliding indicator (~ lines 395, 403), TabsTrigger className block (~ lines 428–458), OverflowTrigger className + DropdownMenu Item active (~ lines 202–224, 257–265) | Tasks 2 · 3 · 4 |
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

## Task 2: Tabs — TabsList sliding indicator (both variants)

**Files:**
- Modify: `packages/ds/src/components/tabs/tabs.tsx:388-410` (the indicator `<div>` inside `TabsList`)

**Steps:**

- [ ] **Step 1: Run existing Tabs tests as baseline**

```bash
cd /Users/dio/Library/CloudStorage/Dropbox/Claudio/repos/stasho-ds/.claude/worktrees/skin+paraplu
npm run test -w packages/ds -- tabs.test
```

Expected: all existing Tabs tests pass. Clean baseline before touching styling.

- [ ] **Step 2: Replace the indicator's variant class arrays**

Open `packages/ds/src/components/tabs/tabs.tsx`. Find the indicator `<div>` near lines 388–410 (inside `TabsList`'s return):

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

Replace the two `bg-*` lines so the pill indicator becomes a cyan tint and the underline indicator becomes solid cyan:

```tsx
        <div
          ref={indicatorRef}
          className={cn(
            "absolute left-0",
            isPill
              ? [
                  isSmall ? "inset-y-0.5" : "inset-y-1",
                  "rounded-full bg-accent/15",
                  ready ? "opacity-100" : "opacity-0",
                  ready
                    ? "transition-[transform,width,opacity] duration-200 ease-out"
                    : "",
                ]
              : [
                  isSmall ? "-bottom-0.5 h-0.5" : "-bottom-1 h-1",
                  "bg-accent",
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
- Pill: `bg-primary-600 dark:bg-primary-500` → `bg-accent/15`
- Underline: `bg-primary-600 dark:bg-primary-400` → `bg-accent`

The underline indicator stays a solid bar (no glow) per Direction C: text/slot indicators are flat cyan, not lit surfaces.

- [ ] **Step 3: Run Tabs tests, confirm pass**

```bash
npm run test -w packages/ds -- tabs.test
```

Expected: all tests pass. (Class-name changes don't break behavior tests.)

- [ ] **Step 4: Commit**

```bash
git add packages/ds/src/components/tabs/tabs.tsx
git commit -m "feat(skin): Tabs — cyan sliding indicator (underline solid, pill tinted)"
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
        "group-data-[variant=pill]:rounded-full",
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

Key changes:
- Active-hidden ternary collapses: `hasActiveHidden && isPill ? "text-white" : hasActiveHidden ? "text-primary-600 dark:text-primary-400" : "text-muted-foreground"` becomes `hasActiveHidden ? "text-accent" : "text-muted-foreground"`. The pill carve-out (`text-white`) is no longer needed because both pill and non-pill active states use the same `text-accent` now — the cyan reads against both the tinted pill indicator and the underline track.
- `hover:text-primary-600 dark:hover:text-primary-400` → `hover:text-accent`
- Focus: ring → outline (same swap as TabsTrigger)

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
- Sliding indicator is cyan (`#00E1FA`), not blue
- Active trigger text is cyan, nudged up 2px above the indicator bar
- Hover on a non-active trigger turns the text cyan
- Focused trigger shows a 2px cyan outline at 2px offset (Tab to it from another control to test)
- Disabled trigger renders at 30% foreground opacity with `not-allowed` cursor — not faded at 20% opacity

Toggle the theme switcher (top right). Verify the cyan stays the same hex in both modes (same-hex rule).

- [ ] **Step 3: Verify Tabs pill variant**

Same page, scroll to the pill variant section.

Expected:
- Active pill background is a soft cyan tint (`bg-accent/15`), not a solid colored pill
- Active text is cyan
- Hover on non-active pill turns text cyan
- Disabled pill: text at 30% foreground opacity

Check both md (default) and sm sizes if both are shown. Toggle theme — the tinted indicator may look more subtle in light mode (warning in spec § 9); if it's hard to see, note for follow-up.

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

- [ ] **Step 1: Update SKIN-PRINCIPLES.md — § 2 amendment**

Open `docs/SKIN-PRINCIPLES.md`. Find § 2 Color → "Semantic color mapping" sub-section. After the table mapping `--primary` / `--accent` / etc. to their roles, add a new paragraph (or extend the existing `--accent` row's "Role" description):

```markdown
**Active states.** Selected / checked / active states on form controls and navigation (Switch, Slider, Checkbox, Radio, active Tab, active Breadcrumb, ProgressBar) use `--accent`. Primary's chassis role (Button only) is preserved.
**Source:** Decision #86.
```

Place this after the existing "Semantic color mapping" paragraph and before "No decorative texture". Match the existing prose voice — short, declarative, sourced.

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

**Context:** Tabs and Breadcrumb signaled active/hover with `text-primary-600 dark:text-primary-400` / `bg-primary-*` — primary blue's chassis role from Button competing with active-state navigation for visual weight. Wave-1 spec § 5 committed conceptually to cyan accent as the wave's active-state language; chunk 5 implements that swap across Tabs (TabsList indicators, TabsTrigger, OverflowTrigger, DropdownMenu items) and Breadcrumb (link hover, separator, current page). Brainstorming resolved four open visual questions: pill-variant active fill (full vs outlined vs tinted), underline-trigger lift, current-page treatment, and separator weight.
**Decision:** Adopt cyan `--accent` for active and hover across Tabs and Breadcrumb. **Tabs underline:** sliding indicator becomes `bg-accent`, active trigger text becomes `text-accent`, active translate-y-0.5 lift is kept. **Tabs pill:** sliding indicator becomes `bg-accent/15` (tinted, not solid), active trigger text becomes `text-accent`, hover text becomes `text-accent` (replaces `text-foreground`). **Tabs trigger alignment fixes:** focus moves from `ring-primary-400 ring-offset-2` to `outline-2 outline-accent outline-offset-2` (Decision #82 Button pattern); disabled moves from `opacity-20` to `text-foreground/30 cursor-not-allowed` (Decision #84 vocabulary — no opacity tricks, semantic flatten). **OverflowTrigger** mirrors TabsTrigger active/hover/focus; the per-pill `text-white` carve-out collapses to a single `text-accent` (works against both pill and underline backgrounds). **DropdownMenu** active hidden-tab item becomes `text-accent font-semibold`. **Breadcrumb:** link hover becomes `text-accent`, separator drops to `text-foreground/25` (quieter than the direct-port `foreground/40`), current page becomes `text-accent` (drops the opacity-40 workaround). Out of scope: DropdownMenu Content `rounded-md` + `shadow-brand` (chunk 6 popover audit).
**Rationale:** **Pill-tinted fill over solid** — the wave's strongest visual lever already lives on Button chassis; a fully saturated cyan pill would be the loudest single cyan surface in the wave and put a navigation control on the same visual plane as the brand action. Tinted carries "active" via colour without committing the pill area to brand saturation. **Underline nudge kept** — position + colour both signal active; with cyan replacing primary, the nudge becomes additive emphasis rather than the sole signal, and dropping it would break visual continuity with the prior implementation. **Current page in full cyan** — consistent with the active-state vocabulary across chunk 4 (Checkbox, Radio, Switch, Slider) and chunk 5 Tabs; the previous `opacity-40` workaround read as "deprioritised", the opposite of what the current page is. **Separator at 25%** — with the current page now cyan, the trail labels and separators want to recede so the cyan reads cleanly; 40% would compete, `text-edge` (≈8% hairline) would disappear. **Disabled flatten** — opacity-20 reads "loading" or "fading out"; foreground/30 + cursor-not-allowed reads "this control is semantically broken" (the chunk-4 vocabulary). **Focus outline over ring** — composes with the active trigger's translate-y nudge (a box-shadow ring would replace the bevel; outline sits at the chassis edge). Same-hex rule applies — `text-accent` / `outline-accent` need no `dark:` variants.
**Alternatives considered:** Solid cyan pill fill (loudest — rejected for the noise-budget reason above). Outlined cyan chip on pill, mirroring Pagination chunk-4 treatment (rejected — a segmented control benefits from a fill cue more than a navigation chip does). Drop the underline nudge (rejected — colour alone is enough but the nudge gives the active state a second cue and matches the prior implementation's read). Neutral current breadcrumb page (rejected — implicit signal via aria-current + last-position is too quiet; the trail needs a visible focal point). Cyan dot prefix + neutral page text (rejected — borrows from StatusDot vocabulary; dot reads as health/status not navigation). Separator at `text-foreground/40` (rejected — direct port of the opacity but doesn't take advantage of the new cyan focal point). Separator at `text-edge` (rejected — too quiet; separator becomes nearly invisible). Keep `ring-primary-400` focus (rejected — ring + outline-none was needed for the primary-tinted shadow ring; the native outline composes more cleanly with the chassis at 2px outline-offset and matches the Button pattern). Keep `opacity-20` disabled (rejected — Decision #84 ruled opacity tricks out of the chassis vocabulary; semantic flatten is the established replacement).
```

- [ ] **Step 5: Move chunk-5 item to Completed in BACKLOG.md**

Open `docs/BACKLOG.md`. If there is an Open Item for chunk 5 / active-state recolor, move it under `## Completed / Rejected`. If there isn't one, add a Completed entry under that section:

```markdown
- [x] 2026-05-27 — Chunk 5 active-state recolor (Tabs + Breadcrumb): `primary-*` → cyan `--accent` on active/hover; pill indicator → `bg-accent/15` tinted; underline indicator → solid cyan; Tabs focus → outline-accent pattern (Decision #82 alignment); Tabs disabled → semantic flatten (Decision #84 alignment); Breadcrumb current page → `text-accent`; Breadcrumb separator → `text-foreground/25`
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
