# Accordion (FAQ) motion + doc gap — Design

**Date:** 2026-06-08
**Status:** Approved (brainstorm), pending spec review
**Topic:** Add hover + open/close animations to the Accordion, and close its documentation gap (it ships exported but undocumented — no preview page, not in the nav, absent from DESIGN-SYSTEM / CLAUDE).

---

## Context

The Accordion is the DS's FAQ pattern (Radix `Accordion`, exported as `@stasho/ds/accordion`). Today:
- **Hover** already transitions the trigger text to cyan (`hover:text-accent-500 dark:hover:text-accent`) and the caret is cyan + rotates 180° on open.
- **Open/close has no animation** — the content snaps in/out; Radix's `--radix-accordion-content-height` is unused.
- The component is a "ghost": no preview page, not in the preview sidebar, no DESIGN-SYSTEM entry, not in CLAUDE Current Features. Only `accordion.tsx` + `accordion.test.tsx` exist.

This adds the two requested motions and, in the same pass, makes the component demonstrable + documented.

---

## The design

### 1 · Open/close — "slide + settle" (option B)

Two layers:
- **Height:** the content height animates open/closed via Radix's `--radix-accordion-content-height` CSS var, driven by `@keyframes accordion-down` / `accordion-up` (~200ms `ease-out`). Standard Radix + Tailwind pattern.
- **Content settle:** the inner answer fades in and settles down (`opacity 0→1`, `translateY(-5px → 0)`, ~170ms `ease`, ~60ms delay so it trails the height open). Collapse reverses both.

### 2 · Hover — "caret nudge" (option A)

On top of the existing text → cyan: the cyan caret dips down **3px** on hover, but **only when closed** (a downward nudge previews the open direction; nudging the rotated-open caret would read wrong). Pure motion, no chassis repaint — fits § 5 "hover intensifies, doesn't repaint" and "cyan is the moving signal."

### 3 · Caret rotation (unchanged)

The 180° rotate-on-open already ships and stays.

### 4 · Reduced motion (mandatory, § 5)

`prefers-reduced-motion: reduce` collapses everything to instant: height keyframes → `animation: none`, content settle + caret nudge + caret rotation → no transition. The trigger and caret already carry `motion-reduce:transition-none`; the new bits add it too, and the keyframes get a reduced-motion media block.

---

## Implementation

### `packages/ds/src/styles/tokens.css` — keyframes (mirror the button-chase block)

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

### `packages/ds/src/components/accordion/accordion.tsx`

**AccordionTrigger** — add the caret nudge to the existing `CaretDown` classes (which already have `transition-transform duration-200`, `group-data-[state=open]:rotate-180`, `motion-reduce:transition-none`):

```
"group-data-[state=closed]:group-hover:translate-y-[3px]",
```

(Verify this compound variant composes in Tailwind v4 — it should generate the "closed AND hovered ancestor" selector. If it doesn't, fall back to a tiny rule in tokens.css: `.group[data-state="closed"]:hover .accordion-caret { transform: translateY(3px); }` with a class hook. Build + visual check decides.)

**AccordionContent** — add the height keyframes + `group`, and the content settle on the inner div:

```tsx
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
```

### Why the existing tests still pass

`accordion.test.tsx` asserts content is removed from the DOM after collapse. Radix `Presence` only waits for `animationend` when `getComputedStyle(el).animationName !== "none"`. Vitest's jsdom doesn't load the compiled `tokens.css`, so the keyframe never resolves and `animationName` is `none` → Radix unmounts immediately on close, exactly as today. Run the suite to confirm; no behavioral test should change.

---

## Preview page + nav (close the doc gap)

- **Create** `apps/preview/src/app/components/accordion/page.tsx` — a FAQ demo using `PageHeader` + `DemoSection` (match sibling pages like `tabs/page.tsx`): a `type="single" collapsible` FAQ with a `defaultValue`, and a `type="multiple"` example. The live page is where hover + open/close motion is verified by eye.
- **Add to nav** `apps/preview/src/components/sidebar.tsx` — `{ label: "Accordion", href: "/components/accordion" }` under the **Data Display** group (alphabetically first). (Adjacent to Tabs in "Navigation" is also defensible — Data Display chosen because the FAQ is a content container; trivially movable.)

---

## Testing

Extend `accordion.test.tsx` (keep all existing behavioral tests):
- Content carries the open/close animation classes (`animate-accordion-down` / `animate-accordion-up` via `data-[state=...]`) and `motion-reduce:animate-none`.
- The caret carries the nudge class and the existing `rotate` + `motion-reduce` classes.
- Behavioral tests (open/close/single/multiple/aria) still green (per the jsdom note above).

Class-presence assertions match the repo's established test style (Badge/Checkbox/Tabs radius tests).

---

## Out of scope

- No change to the Accordion's API (props, parts) — purely motion + classes.
- No new variants (bordered/separated/filled). The current `border-b` item style stays.
- No stagger (option C) — rejected as too heavy for a content FAQ.

---

## Doc updates required (definition of done)

- [ ] **DESIGN-SYSTEM.md** — new Accordion section: parts (`Accordion` / `AccordionItem` / `AccordionTrigger` / `AccordionContent`), `type="single|multiple"` + `collapsible`, and the motion (slide + settle open/close, caret nudge on hover, reduced-motion).
- [ ] **ARCHITECTURE.md** — note the Radix height-animation pattern (`--radix-accordion-content-height` + `@keyframes accordion-down/up`) and the two-layer (height keyframe + content settle transition) approach.
- [ ] **DECISIONS.md** — **Decision #101**: Accordion motion (open/close slide+settle, hover caret nudge, reduced-motion) + closing the doc gap.
- [ ] **BACKLOG.md** — nothing new required (the doc gap is closed here); note if any deferred idea surfaces.
- [ ] **CLAUDE.md** — add Accordion to Current Features (Radix-based FAQ disclosure, single/multiple, slide+settle open/close, caret nudge hover, cyan trigger, reduced-motion); add the new preview page to the route count.

---

## Open questions for review

1. **Nav group** — Accordion under **Data Display** (chosen) vs **Navigation** (next to Tabs). Either is fine; flag if you prefer Navigation.
2. **Content-settle delay** — 60ms enter delay so the fade trails the height. Symmetric on collapse (acceptable) vs immediate fade-out on close. Defaulting to symmetric; trivially tunable.
