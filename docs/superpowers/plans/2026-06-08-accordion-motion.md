# Accordion Motion + Doc Gap Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add hover (caret nudge) + open/close (slide + settle) animations to the Accordion, respect reduced-motion, and close its documentation gap (preview page + nav + DESIGN-SYSTEM / CLAUDE).

**Architecture:** Height animation rides Radix's `--radix-accordion-content-height` via new `@keyframes accordion-down/up` in `tokens.css`; the answer content adds a fade/settle transition; the trigger caret gains a hover nudge. All gated by `prefers-reduced-motion`. Then a preview page demonstrates it and the docs document it.

**Tech Stack:** React, Radix `Accordion`, Tailwind CSS 4 (CSS-variable keyframes), CVA-free component, Vitest + Testing Library, Next.js static-export preview app.

---

## Spec

Source: `docs/superpowers/specs/2026-06-08-accordion-motion-design.md`. Approved defaults: Accordion under **Data Display** in the nav; settle delay 60ms symmetric.

## File map

- `packages/ds/src/styles/tokens.css` — add accordion keyframes + utilities + reduced-motion block.
- `packages/ds/src/components/accordion/accordion.tsx` — caret nudge on `AccordionTrigger`; height keyframes + content settle on `AccordionContent`.
- `packages/ds/src/components/accordion/accordion.test.tsx` — add class-presence tests; keep behavioral tests.
- `apps/preview/src/app/components/accordion/page.tsx` — **new** preview page.
- `apps/preview/src/components/sidebar.tsx` — add Accordion nav entry.
- Docs: `DESIGN-SYSTEM.md`, `ARCHITECTURE.md`, `DECISIONS.md`, `CLAUDE.md`.

---

## Setup: branch

- [ ] **Step 1: Branch from main**

```bash
git checkout main
git pull --ff-only origin main
git checkout -b feature/accordion-motion
```

Expected: clean `feature/accordion-motion` off latest main. (The spec commit `a32463e` is on local main and will ride along.)

---

## Task 1: Accordion keyframes in tokens.css

**Files:**
- Modify: `packages/ds/src/styles/tokens.css`

No unit test (keyframes aren't jsdom-testable) — verified via build + the component tasks. Add after the existing button-chase block (the file's keyframe convention).

- [ ] **Step 1: Append the keyframes + utilities + reduced-motion block**

Add at the end of the keyframes region (after the `button-chase` `@media (prefers-reduced-motion: reduce)` block):

```css
/* ── Accordion open/close (height) ───────────── */

@keyframes accordion-down {
  from { height: 0; }
  to   { height: var(--radix-accordion-content-height); }
}

@keyframes accordion-up {
  from { height: var(--radix-accordion-content-height); }
  to   { height: 0; }
}

.animate-accordion-down { animation: accordion-down 200ms ease-out; }
.animate-accordion-up   { animation: accordion-up   200ms ease-out; }

@media (prefers-reduced-motion: reduce) {
  .animate-accordion-down,
  .animate-accordion-up { animation: none; }
}
```

- [ ] **Step 2: Verify the DS still builds/tests clean**

Run: `npm run check`
Expected: PASS (no class consumes the keyframes yet; nothing breaks).

- [ ] **Step 3: Commit**

```bash
git add packages/ds/src/styles/tokens.css
git commit -m "feat(tokens): accordion-down/up keyframes for height animation"
```

---

## Task 2: Open/close motion on AccordionContent

**Files:**
- Modify: `packages/ds/src/components/accordion/accordion.tsx`
- Test: `packages/ds/src/components/accordion/accordion.test.tsx`

TDD: assert the animation classes, then add them. Behavioral tests must stay green (jsdom doesn't load `tokens.css`, so `getComputedStyle(content).animationName === "none"` → Radix unmounts on close exactly as today).

- [ ] **Step 1: Write the failing test**

Add inside `describe("Accordion", ...)` in `accordion.test.tsx`:

```tsx
  it("content carries the open/close animation + reduced-motion classes", () => {
    render(
      <Accordion type="single" collapsible defaultValue="a">
        <AccordionItem value="a">
          <AccordionTrigger>Question A</AccordionTrigger>
          <AccordionContent>Answer A</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    // The Radix Content element is the parent of the rendered answer text.
    const inner = screen.getByText("Answer A");
    const content = inner.parentElement as HTMLElement;
    expect(content.className).toContain("data-[state=open]:animate-accordion-down");
    expect(content.className).toContain("data-[state=closed]:animate-accordion-up");
    expect(content.className).toContain("overflow-hidden");
    expect(content.className).toContain("motion-reduce:animate-none");
  });

  it("answer content carries the fade/settle classes", () => {
    render(
      <Accordion type="single" collapsible defaultValue="a">
        <AccordionItem value="a">
          <AccordionTrigger>Question A</AccordionTrigger>
          <AccordionContent>Answer A</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    const inner = screen.getByText("Answer A");
    expect(inner.className).toContain("group-data-[state=open]:opacity-100");
    expect(inner.className).toContain("transition-[opacity,transform]");
    expect(inner.className).toContain("motion-reduce:transition-none");
  });
```

- [ ] **Step 2: Run to confirm failure**

Run: `npm run test --workspace @stasho/ds -- accordion`
Expected: FAIL — the new classes aren't present yet.

- [ ] **Step 3: Update `AccordionContent`**

Replace the current `AccordionContent` body (the `AccordionPrimitive.Content` + inner `div`) with:

```tsx
const AccordionContent = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...rest }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(
      "group overflow-hidden",
      "data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up",
      "motion-reduce:animate-none",
    )}
    {...rest}
  >
    <div
      className={cn(
        "pb-4 text-sm leading-relaxed text-muted-foreground",
        "opacity-0 -translate-y-1 transition-[opacity,transform] duration-200 ease-out",
        "group-data-[state=open]:opacity-100 group-data-[state=open]:translate-y-0",
        "motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0",
        className,
      )}
    >
      {children}
    </div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = "AccordionContent";
```

- [ ] **Step 4: Run to confirm pass (new + existing)**

Run: `npm run test --workspace @stasho/ds -- accordion`
Expected: PASS — both new tests pass AND all existing behavioral tests (open/close/single/multiple/aria) stay green.

- [ ] **Step 5: Commit**

```bash
git add packages/ds/src/components/accordion
git commit -m "feat(accordion): slide + settle open/close motion (reduced-motion safe)"
```

---

## Task 3: Hover caret nudge on AccordionTrigger

**Files:**
- Modify: `packages/ds/src/components/accordion/accordion.tsx`
- Test: `packages/ds/src/components/accordion/accordion.test.tsx`

The caret already has `transition-transform duration-200`, `group-data-[state=open]:rotate-180`, `motion-reduce:transition-none`. Add a downward nudge on hover when closed.

- [ ] **Step 1: Write the failing test**

Add inside `describe("Accordion", ...)`:

```tsx
  it("caret carries the closed-hover nudge class", () => {
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="a">
          <AccordionTrigger>Question A</AccordionTrigger>
          <AccordionContent>Answer A</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    // Caret is the trigger's last element child (the CaretDown svg).
    const trigger = screen.getByRole("button", { name: "Question A" });
    const caret = trigger.lastElementChild as HTMLElement;
    expect(caret.getAttribute("class")).toContain(
      "group-data-[state=closed]:group-hover:translate-y-[3px]",
    );
  });
```

- [ ] **Step 2: Run to confirm failure**

Run: `npm run test --workspace @stasho/ds -- accordion`
Expected: FAIL — nudge class absent.

- [ ] **Step 3: Add the nudge class to the `CaretDown`**

In `AccordionTrigger`, the `CaretDown` `className` currently is:

```
"size-4 shrink-0 text-accent-500 dark:text-accent",
"transition-transform duration-200",
"group-data-[state=open]:rotate-180",
"motion-reduce:transition-none",
```

Add the nudge line so it reads:

```
"size-4 shrink-0 text-accent-500 dark:text-accent",
"transition-transform duration-200",
"group-data-[state=open]:rotate-180",
"group-data-[state=closed]:group-hover:translate-y-[3px]",
"motion-reduce:transition-none",
```

- [ ] **Step 4: Run to confirm pass**

Run: `npm run test --workspace @stasho/ds -- accordion`
Expected: PASS.

- [ ] **Step 5: Verify the compound variant actually generates CSS**

Run: `npm run build`
Then: `CSS=$(fd -e css . apps/preview/out 2>/dev/null | head -1); rg -o 'translate-y-\[3px\]' "$CSS" | head -1`
Expected: a match — Tailwind emitted the `group-data-[state=closed]:group-hover:translate-y-[3px]` utility.
**If no match:** the compound variant didn't compose. Fall back: remove the class, add `accordion-caret` to the `CaretDown` className, and add to `tokens.css`:
```css
.group[data-state="closed"]:hover .accordion-caret { transform: translateY(3px); }
@media (prefers-reduced-motion: reduce) { .group[data-state="closed"]:hover .accordion-caret { transform: none; } }
```
Update the Task-3 test to assert `accordion-caret` instead, re-run, and re-build to confirm.

- [ ] **Step 6: Commit**

```bash
git add packages/ds/src/components/accordion
git commit -m "feat(accordion): caret dips on hover (closed) — previews open direction"
```

---

## Task 4: Preview page

**Files:**
- Create: `apps/preview/src/app/components/accordion/page.tsx`

Match the structure of a sibling page. Reference `apps/preview/src/app/components/tabs/page.tsx` and `apps/preview/src/components/page-header.tsx` / `demo-section.tsx` for the exact `PageHeader` / `DemoSection` props before writing (props must match — read them first).

- [ ] **Step 1: Read the sibling patterns**

Run: `sed -n '1,40p' apps/preview/src/app/components/tabs/page.tsx; echo ---; cat apps/preview/src/components/page-header.tsx; echo ---; cat apps/preview/src/components/demo-section.tsx`
Expected: confirms `PageHeader` (title/description) and `DemoSection` (title/children) signatures + import aliases (`@preview/...`, `@stasho/ds/accordion`).

- [ ] **Step 2: Create the page**

Create `apps/preview/src/app/components/accordion/page.tsx` (adjust `PageHeader`/`DemoSection` props + import paths to whatever Step 1 showed — this uses the conventions visible in the repo):

```tsx
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@stasho/ds/accordion";
import { PageHeader } from "@preview/components/page-header";
import { DemoSection } from "@preview/components/demo-section";

const FAQ = [
  { q: "Do you offer refunds?", a: "Yes — a full refund within 30 days, no questions asked." },
  { q: "Is there a free tier?", a: "Free forever for solo projects, no card required." },
  { q: "Can I self-host?", a: "Enterprise plans include a self-hosted deployment option." },
];

export default function AccordionPage() {
  return (
    <div>
      <PageHeader
        title="Accordion"
        description="FAQ disclosure. Hover a row (the caret dips); open/close slides and settles. Respects reduced motion."
      />
      <div className="space-y-12">
        <DemoSection title="Single (collapsible)">
          <Accordion type="single" collapsible defaultValue="item-0" className="max-w-2xl">
            {FAQ.map((item, i) => (
              <AccordionItem key={item.q} value={`item-${i}`}>
                <AccordionTrigger>{item.q}</AccordionTrigger>
                <AccordionContent>{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </DemoSection>

        <DemoSection title="Multiple">
          <Accordion type="multiple" className="max-w-2xl">
            {FAQ.map((item, i) => (
              <AccordionItem key={item.q} value={`m-${i}`}>
                <AccordionTrigger>{item.q}</AccordionTrigger>
                <AccordionContent>{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </DemoSection>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Typecheck + build**

Run: `npm run typecheck --workspace @stasho/preview && npm run build`
Expected: PASS; the new `/components/accordion` route appears in the static-export page list.

- [ ] **Step 4: Commit**

```bash
git add apps/preview/src/app/components/accordion
git commit -m "feat(preview): accordion demo page"
```

---

## Task 5: Nav entry

**Files:**
- Modify: `apps/preview/src/components/sidebar.tsx`

- [ ] **Step 1: Add Accordion to the Data Display group**

In the `NAV` array, the `"Data Display"` group's `items` currently starts with Badge. Add Accordion as the first entry:

```tsx
      {
        group: "Data Display",
        items: [
          { label: "Accordion", href: "/components/accordion" },
          { label: "Badge", href: "/components/badge" },
          { label: "Card", href: "/components/card" },
          { label: "CopyableText", href: "/components/copyable-text" },
          { label: "StatusDot", href: "/components/status-dot" },
          { label: "Table", href: "/components/table" },
        ],
      },
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck --workspace @stasho/preview`
Expected: PASS.

- [ ] **Step 3: Visual check**

Run: `npm run dev`, open `/components/accordion`. Confirm in dark (default): hover dips the caret + text→cyan; clicking slides open with the answer settling in; collapse reverses; the nav highlights Accordion in cyan (active state from the earlier sidenav change).

- [ ] **Step 4: Commit**

```bash
git add apps/preview/src/components/sidebar.tsx
git commit -m "feat(preview): add Accordion to nav"
```

---

## Task 6: Update docs

Copy this checklist verbatim — it's the definition of done.

- [ ] **DESIGN-SYSTEM.md** — add an Accordion section: parts (`Accordion` / `AccordionItem` / `AccordionTrigger` / `AccordionContent`), `type="single|multiple"` + `collapsible`, and the motion (open/close slide+settle via `--radix-accordion-content-height` keyframes, caret nudge on hover, 180° rotate on open, reduced-motion).
- [ ] **ARCHITECTURE.md** — note the Radix height-animation pattern (`--radix-accordion-content-height` + `@keyframes accordion-down/up`) and the two-layer approach (height keyframe on Content + fade/settle transition on the inner div via `group-data-[state=open]`).
- [ ] **DECISIONS.md** — add **Decision #101**: Accordion motion (open/close slide+settle = option B, hover caret nudge = option A; rejected stagger C and bare-slide A; reduced-motion mandatory) + closing the doc gap (preview page, nav, docs).
- [ ] **BACKLOG.md** — no new item required; add one only if a deferred idea surfaced during implementation.
- [ ] **CLAUDE.md** — add Accordion to Current Features (Radix-based FAQ disclosure, single/multiple + collapsible, slide+settle open/close, caret-nudge hover + text→cyan, 180° caret rotate, reduced-motion); the preview app now has one more route.

- [ ] **Commit docs**

```bash
git add docs CLAUDE.md
git commit -m "docs: document Accordion + motion (Decision #101)"
```

---

## Finish

- [ ] Run final `npm run check` — must pass.
- [ ] Ship via the `ship` skill (push `feature/accordion-motion`, PR to main, CI gate, squash-merge, sync, cleanup). Reset local `main` to `origin/main` before merge so the spec/plan commits squash cleanly (per prior ships).

---

## Self-review notes (author)

- **Spec coverage:** keyframes (Task 1), open/close B (Task 2), hover A + fallback (Task 3), reduced-motion (Tasks 1–3), preview page (Task 4), nav (Task 5), docs incl. Decision #101 (Task 6) — all mapped.
- **No placeholders:** every code step shows the full class strings / file; the Task-4 page notes "match props from Step 1" but provides complete code using the visible conventions.
- **Consistency:** class names (`animate-accordion-down/up`, `group-data-[state=open]`, `group-data-[state=closed]:group-hover:translate-y-[3px]`) match across tasks, tests, and spec.
