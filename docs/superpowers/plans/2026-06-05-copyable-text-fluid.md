# Fluid CopyableText Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `fluid` mode to `CopyableText` that shows the full string when there's room and truncates (fixed tail, flexing head) as its container narrows.

**Architecture:** Pure-CSS two-span flexbox truncation — the head (`text.slice(0,-endChars)`) flexes and ellipsizes; the tail (`text.slice(-endChars)`) stays pinned. No JS measurement, no `ResizeObserver`, no new dependencies. A new boolean prop `fluid` (default `false`) gates the behavior; the existing static-truncation default is untouched.

**Tech Stack:** React + TypeScript, CVA, Tailwind CSS 4, Vitest + Testing Library. Monorepo (`packages/ds` + `apps/preview`).

**Spec:** `docs/superpowers/specs/2026-06-05-copyable-text-fluid-design.md`

---

## File Structure

| File | Responsibility | Action |
|------|----------------|--------|
| `packages/ds/src/components/copyable-text/copyable-text.tsx` | Component — add `fluid` cva variant + `renderTextContent` branch + `title` | Modify |
| `packages/ds/src/components/copyable-text/copyable-text.test.tsx` | Add fluid-mode tests; keep existing fixed-mode tests | Modify |
| `apps/preview/src/app/components/copyable-text/page.tsx` | Add a resizable "Fluid" demo section | Modify |
| `docs/DESIGN-SYSTEM.md`, `docs/ARCHITECTURE.md`, `docs/DECISIONS.md`, `CLAUDE.md`, `docs/BACKLOG.md` | Doc updates | Modify |

---

## Task 0: Create feature branch

**Files:** none (git only)

- [ ] **Step 1: Branch from main**

The spec and this plan are local commits on `main`. Branch from `main` so they ride along into the feature branch (they get squashed into the feature commit on merge — no direct push to `main` needed).

Run:
```bash
git checkout -b feature/copyable-text-fluid
git status
```
Expected: on branch `feature/copyable-text-fluid`, clean tree.

---

## Task 1: Add fluid mode to the component

**Files:**
- Modify: `packages/ds/src/components/copyable-text/copyable-text.tsx`
- Test: `packages/ds/src/components/copyable-text/copyable-text.test.tsx`

- [ ] **Step 1: Add the failing fluid tests**

Append these tests inside the top-level `describe("CopyableText", () => { ... })` block in `copyable-text.test.tsx` (after the existing `describe("props", ...)` block, before the final closing `});`). They use the existing `LONG_TEXT` constant (`"0x1234567890abcdef1234567890abcdef12345678"`, 42 chars). With `endChars={6}` the tail is `"345678"` and the head is `"0x1234567890abcdef1234567890abcdef12"`.

```tsx
  describe("fluid mode", () => {
    it("renders head and tail as separate text nodes", () => {
      render(<CopyableText text={LONG_TEXT} fluid endChars={6} />);
      expect(
        screen.getByText("0x1234567890abcdef1234567890abcdef12"),
      ).toBeTruthy();
      expect(screen.getByText("345678")).toBeTruthy();
    });

    it("shows the full untruncated string (no ellipsis)", () => {
      const { container } = render(
        <CopyableText text={LONG_TEXT} fluid endChars={6} />,
      );
      expect(container.textContent).toBe(LONG_TEXT);
      expect(container.textContent).not.toContain("...");
    });

    it("uses flex + w-full on the wrapper", () => {
      const { container } = render(<CopyableText text={LONG_TEXT} fluid />);
      const cls = container.firstElementChild?.className ?? "";
      expect(cls).toContain("w-full");
      expect(cls).not.toContain("inline-flex");
    });

    it("uses inline-flex on the wrapper by default", () => {
      const { container } = render(<CopyableText text={LONG_TEXT} />);
      expect(container.firstElementChild?.className).toContain("inline-flex");
    });

    it("sets title to the full text in fluid mode", () => {
      render(<CopyableText text={LONG_TEXT} fluid />);
      expect(screen.getByTitle(LONG_TEXT)).toBeTruthy();
    });

    it("does not set a title in fixed mode", () => {
      render(<CopyableText text={LONG_TEXT} />);
      expect(screen.queryByTitle(LONG_TEXT)).toBeNull();
    });

    it("renders full text without splitting when text.length <= endChars", () => {
      render(<CopyableText text="0x1a2b" fluid endChars={10} />);
      expect(screen.getByText("0x1a2b")).toBeTruthy();
    });

    it("copies the full text in fluid mode", async () => {
      const user = userEvent.setup();
      render(<CopyableText text={LONG_TEXT} fluid />);
      const spy = vi
        .spyOn(navigator.clipboard, "writeText")
        .mockResolvedValue(undefined);
      await user.click(
        screen.getByRole("button", { name: "Copy to clipboard" }),
      );
      expect(spy).toHaveBeenCalledWith(LONG_TEXT);
    });

    it("wraps the head/tail region in a link when fluid + external href", () => {
      render(
        <CopyableText
          text={LONG_TEXT}
          fluid
          endChars={6}
          href="https://example.com"
        />,
      );
      const textLink = screen
        .getAllByRole("link")
        .find((l) => l.textContent === LONG_TEXT);
      expect(textLink).toBeTruthy();
      expect(textLink?.getAttribute("href")).toBe("https://example.com");
      expect(textLink?.getAttribute("target")).toBe("_blank");
    });
  });
```

- [ ] **Step 2: Run the new tests and verify they fail**

Run:
```bash
npm run test -w @stasho/ds -- copyable-text
```
Expected: the new `fluid mode` tests FAIL (e.g. `fluid` prop has no effect — wrapper still `inline-flex`, no `title`, head/tail text nodes absent). Existing tests still PASS.

- [ ] **Step 3: Replace the component file with the fluid implementation**

Overwrite `packages/ds/src/components/copyable-text/copyable-text.tsx` with:

```tsx
"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { ArrowUpRight, Copy } from "@phosphor-icons/react";
import { cn } from "@ac/lib/cn";

const copyableTextVariants = cva("items-center font-mono select-none", {
  variants: {
    size: {
      sm: "text-xs gap-1",
      md: "text-sm gap-1.5",
    },
    fluid: {
      true: "flex w-full",
      false: "inline-flex",
    },
  },
  defaultVariants: {
    size: "md",
    fluid: false,
  },
});

const iconSize: Record<"sm" | "md", string> = {
  sm: "size-3.5",
  md: "size-4",
};

const buttonSize: Record<"sm" | "md", string> = {
  sm: "size-4",
  md: "size-5",
};

function isExternalUrl(url: string): boolean {
  return /^https?:\/\//.test(url) || url.startsWith("//");
}

function truncateMiddle(
  text: string,
  startChars: number,
  endChars: number,
): string {
  if (text.length <= startChars + endChars) return text;
  return `${text.slice(0, startChars)}...${text.slice(-endChars)}`;
}

function renderTextContent(
  text: string,
  fluid: boolean,
  startChars: number,
  endChars: number,
): ReactNode {
  if (!fluid) return truncateMiddle(text, startChars, endChars);
  if (text.length <= endChars) return text;
  return (
    <>
      <span className="min-w-0 flex-initial overflow-hidden text-ellipsis whitespace-nowrap">
        {text.slice(0, -endChars)}
      </span>
      <span className="flex-none whitespace-nowrap">
        {text.slice(-endChars)}
      </span>
    </>
  );
}

type CopyableTextProps = Omit<HTMLAttributes<HTMLSpanElement>, "children"> &
  VariantProps<typeof copyableTextVariants> & {
    text: string;
    startChars?: number;
    endChars?: number;
    href?: string;
  };

const CopyableText = forwardRef<HTMLSpanElement, CopyableTextProps>(
  (
    {
      text,
      startChars = 6,
      endChars = 4,
      href,
      size = "md",
      fluid = false,
      className,
      ...rest
    },
    ref,
  ) => {
    const [copied, setCopied] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

    useEffect(() => {
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }, []);

    const handleCopy = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        void navigator.clipboard.writeText(text).then(() => {
          setCopied(true);
          if (timerRef.current) clearTimeout(timerRef.current);
          timerRef.current = setTimeout(() => setCopied(false), 1500);
        });
      },
      [text],
    );

    const resolvedSize = size ?? "md";
    const iconCn = iconSize[resolvedSize];
    const btnCn = buttonSize[resolvedSize];
    const isFluid = fluid ?? false;
    const content = renderTextContent(text, isFluid, startChars, endChars);
    const titleAttr = isFluid ? text : undefined;

    return (
      <span
        ref={ref}
        className={cn(
          copyableTextVariants({ size, fluid }),
          href && "text-accent-500 dark:text-accent",
          className,
        )}
        {...rest}
      >
        {href ? (
          <a
            href={href}
            title={titleAttr}
            {...(isExternalUrl(href)
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "cursor-pointer hover:underline",
              isFluid && "flex min-w-0 flex-1 overflow-hidden",
            )}
          >
            {content}
          </a>
        ) : (
          <span
            title={titleAttr}
            className={cn("cursor-default", isFluid && "flex min-w-0 flex-1")}
          >
            {content}
          </span>
        )}

        <button
          type="button"
          onClick={handleCopy}
          className={cn(
            "relative inline-flex items-center justify-center",
            "rounded-none cursor-pointer shrink-0",
            "hover:bg-foreground/10 transition-colors",
            btnCn,
          )}
          aria-label={copied ? "Copied" : "Copy to clipboard"}
        >
          <Copy
            weight="bold"
            className={cn(
              iconCn,
              "text-muted-foreground",
              "transition-opacity duration-100",
              "motion-reduce:transition-none",
              copied && "opacity-0",
            )}
            aria-hidden="true"
          />
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn(
              iconCn,
              "text-muted-foreground absolute",
              "[stroke-dasharray:20] [stroke-dashoffset:20]",
              "transition-[stroke-dashoffset] duration-300 delay-75 ease-out",
              "motion-reduce:transition-none",
              copied && "[stroke-dashoffset:0]",
            )}
            aria-hidden="true"
          >
            <polyline points="4 12 9 17 20 6" />
          </svg>
        </button>

        {href && isExternalUrl(href) ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "inline-flex items-center justify-center rounded-none shrink-0",
              "text-muted-foreground hover:text-foreground",
              "hover:bg-foreground/10 transition-colors",
              btnCn,
            )}
            aria-label="Open in new tab"
          >
            <ArrowUpRight weight="bold" className={iconCn} aria-hidden="true" />
          </a>
        ) : null}
      </span>
    );
  },
);

CopyableText.displayName = "CopyableText";

export { CopyableText, copyableTextVariants, type CopyableTextProps };
```

Key changes vs the prior version:
- `inline-flex` moved out of the cva base into a `fluid` variant (`false → inline-flex`, `true → flex w-full`); base is now `"items-center font-mono select-none"`.
- New `renderTextContent` helper: fixed → `truncateMiddle`; fluid → two-span head/tail (or full text when `text.length <= endChars`).
- `title={text}` set on the text element only in fluid mode.
- Text wrapper (span or `<a>`) gets `flex min-w-0 flex-1` in fluid mode so the head can shrink and ellipsize; copy/link buttons get explicit `shrink-0`.

- [ ] **Step 4: Run the full test file and verify all pass**

Run:
```bash
npm run test -w @stasho/ds -- copyable-text
```
Expected: all tests PASS (new `fluid mode` block + existing fixed-mode tests).

- [ ] **Step 5: Lint + typecheck the DS package**

Run:
```bash
npm run lint -w @stasho/ds
npm run typecheck -w @stasho/ds
```
Expected: no errors, no warnings.

- [ ] **Step 6: Commit**

```bash
git add packages/ds/src/components/copyable-text/copyable-text.tsx packages/ds/src/components/copyable-text/copyable-text.test.tsx
git commit -m "feat(copyable-text): fluid width-aware truncation mode"
```

---

## Task 2: Add a resizable fluid demo to the preview app

**Files:**
- Modify: `apps/preview/src/app/components/copyable-text/page.tsx`

- [ ] **Step 1: Add the Fluid demo section**

In `apps/preview/src/app/components/copyable-text/page.tsx`, add a new `<DemoSection>` immediately after the existing `"Sizes"` section (inside the returned fragment). The `resize-x overflow-hidden` wrapper lets the user drag the right edge to watch the reflow.

```tsx
      <DemoSection title="Fluid (width-aware)">
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground">
            Drag the right edge of each box to resize. Shows the full string when
            there&apos;s room; truncates (fixed tail, flexing head) as it narrows.
          </p>
          <div className="resize-x overflow-hidden border border-edge bg-surface p-3 min-w-[160px] max-w-full w-[420px]">
            <CopyableText text={HASH} fluid endChars={6} />
          </div>
          <div className="resize-x overflow-hidden border border-edge bg-surface p-3 min-w-[160px] max-w-full w-[300px]">
            <CopyableText
              text="0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
              fluid
              endChars={6}
              href="https://etherscan.io/address/0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
            />
          </div>
        </div>
      </DemoSection>
```

- [ ] **Step 2: Typecheck + lint the preview app**

Run:
```bash
npm run typecheck -w @stasho/preview
npm run lint -w @stasho/preview
```
Expected: no errors. (If the preview workspace name differs, use the name from `apps/preview/package.json`.)

- [ ] **Step 3: Commit**

```bash
git add apps/preview/src/app/components/copyable-text/page.tsx
git commit -m "docs(preview): fluid CopyableText demo"
```

---

## Task 3: Update docs

Copy this checklist verbatim — it is the definition of done.

- [ ] **DESIGN-SYSTEM.md** — new tokens, components, hooks, or patterns
- [ ] **ARCHITECTURE.md** — new patterns, new files, or changed structure
- [ ] **DECISIONS.md** — design decisions made during this feature
- [ ] **BACKLOG.md** — completed items moved, deferred ideas added
- [ ] **CLAUDE.md** — Current Features list if user-facing behavior changed

Concrete edits:

- [ ] **Step 1: DESIGN-SYSTEM.md — document the `fluid` prop**

Run `rg -n "CopyableText" docs/DESIGN-SYSTEM.md` to locate the CopyableText section. Add the `fluid` prop (default `false`): width-aware truncation that fills its container (`flex w-full`), pins the last `endChars` (fixed tail), and lets the head flex + ellipsize; `startChars` is ignored in fluid mode; a native `title` shows the full value on hover. Note the consumer must give the component a constrained-width parent (and `min-w-0` in a flex parent) for it to narrow.

- [ ] **Step 2: ARCHITECTURE.md — document the two-span pattern**

Run `rg -n "CopyableText" docs/ARCHITECTURE.md` to locate the section (or add one). Document: pure-CSS middle truncation via a two-span flexbox (head `flex-initial min-w-0 overflow-hidden text-ellipsis`, tail `flex-none`), chosen over JS-measured centered truncation to avoid `ResizeObserver`; `fluid` toggled via a cva variant that swaps `inline-flex` ↔ `flex w-full`; `title` set unconditionally in fluid mode because pure CSS can't detect actual truncation.

- [ ] **Step 3: DECISIONS.md — log Decision #98**

Append to `docs/DECISIONS.md`:

```markdown
## Decision #98 - 2026-06-05
**Context:** Adding a width-aware ("long") mode to CopyableText that shows the full hash/address when there's room and truncates as its container narrows.
**Decision:** Fluid mode uses a pure-CSS two-span flexbox (pinned tail = last `endChars`, flexing head that ellipsizes). The reveal of hidden characters is the native `title` attribute, set unconditionally in fluid mode. Gated by a new `fluid` boolean prop (default false); fixed-mode behavior unchanged.
**Rationale:** The monospace face would make JS-measured centered truncation accurate, but it requires a ResizeObserver. The fixed-tail two-span gives the same "full when roomy, truncated when squeezed" outcome with zero JS, no new deps, and no resize listeners — fits the skin's no-over-engineering bias. Native `title` avoids pulling Radix Tooltip + a provider into the component; detecting "only when truncated" purely is impossible without the JS overflow check the approach was chosen to avoid, so it's always set (harmless echo when not truncated).
**Alternatives considered:** (A) JS-measured centered middle truncation (rejected — ResizeObserver cost). (2) DS Tooltip reveal (deferred — heavier). (3) No reveal (rejected — hidden chars need a recovery path).
```

- [ ] **Step 4: CLAUDE.md — update the CopyableText feature line**

Run `rg -n "CopyableText component" CLAUDE.md` and extend the feature bullet to mention the `fluid` width-aware mode (fills container, fixed-tail two-span truncation, native `title` reveal, `startChars` ignored in fluid).

- [ ] **Step 5: BACKLOG.md — record deferred ideas**

Run `rg -n "CopyableText" docs/BACKLOG.md`. Move any completed CopyableText item to the Completed section. Add deferred ideas: JS-measured centered-middle fluid mode; DS Tooltip reveal variant.

- [ ] **Step 6: Commit**

```bash
git add docs/DESIGN-SYSTEM.md docs/ARCHITECTURE.md docs/DECISIONS.md CLAUDE.md docs/BACKLOG.md
git commit -m "docs: fluid CopyableText (design-system, architecture, decision #98)"
```

---

## Task 4: Final verification

- [ ] **Step 1: Run the full project check**

Run:
```bash
npm run check
```
Expected: lint + typecheck + test all pass across workspaces, no warnings.

- [ ] **Step 2: Visually confirm in the preview app**

Run `npm run dev`, open the CopyableText page, drag the resizable boxes in the Fluid section, and confirm: full string when wide, head truncates with ellipsis as it narrows, tail + copy button stay pinned, hover shows the full value (native tooltip).

- [ ] **Step 3: Ship**

Hand off to the `ship` skill (or follow CLAUDE.md "Finishing a branch"): push `feature/copyable-text-fluid`, open a PR to `main`, squash-merge, sync local main. CI runs on the PR to main.

---

## Self-Review

**Spec coverage:**
- Fluid two-span (fixed tail / flexing head) → Task 1 Step 3 (`renderTextContent`) + tests.
- `flex w-full` outer in fluid, `inline-flex` default → Task 1 (cva `fluid` variant) + wrapper-class tests.
- `title={text}` in fluid only → Task 1 (`titleAttr`) + title tests.
- `startChars` ignored in fluid / `endChars` = tail → covered by `renderTextContent` (uses only `endChars` in fluid).
- Short-text guard (`text.length <= endChars`) → Task 1 + test.
- Copy always full text; fluid + href link → Task 1 + tests.
- Fixed mode unchanged → existing tests retained, default `fluid=false`.
- Preview demo → Task 2.
- Docs (DESIGN-SYSTEM, ARCHITECTURE, DECISIONS #98, CLAUDE.md, BACKLOG) → Task 3.

**Placeholder scan:** No TBD/TODO; all code shown in full; doc steps name exact files and the `rg` command to locate sections.

**Type consistency:** `renderTextContent(text, fluid, startChars, endChars)` signature matches its single call site; `fluid` flows from prop → cva variant → `isFluid` → helper consistently; `copyableTextVariants({ size, fluid })` matches the cva variant keys.
