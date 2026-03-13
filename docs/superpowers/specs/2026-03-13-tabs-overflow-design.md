# Tabs Overflow Collapse — Design Spec

## Overview

Add an `overflow="collapse"` prop to `TabsList` that automatically measures available width, hides trailing tabs that don't fit, and renders a "..." trigger that opens a Radix Popover dropdown revealing the hidden tabs.

## API

```tsx
<TabsList variant="pill" overflow="collapse">
  <TabsTrigger value="compute">Compute</TabsTrigger>
  <TabsTrigger value="storage">Storage</TabsTrigger>
  {/* ... 6 more tabs */}
</TabsList>
```

- `overflow?: "collapse"` on `TabsList` — opt-in. Default is `undefined` (current behavior).
- No other new props. The component figures out how many tabs fit automatically.

## DOM Strategy for Hidden Tabs

Hidden `TabsTrigger` elements stay in the DOM using `visibility: hidden; position: absolute; pointer-events: none` — NOT `display: none`. This is critical because:

1. Radix binds `TabsTrigger` to `TabsContent` via `value`. Removing triggers from the DOM (or `display: none`) breaks Radix's internal mapping and prevents content panels from rendering when the hidden tab is active.
2. Keeping triggers in the DOM preserves Radix's state machine — the hidden triggers still receive `data-state="active"` when selected.

## Activating Tabs from the Dropdown

Dropdown item clicks programmatically call `.click()` on the corresponding hidden `TabsTrigger` element. This delegates state management entirely to Radix — no need to wrap `Tabs` with a custom context or intercept `onValueChange`. The `Tabs` export stays as a direct Radix re-export.

Each dropdown item holds a ref (or index) to its corresponding hidden trigger. On click: `hiddenTriggerRef.click()` → Radix updates `data-state` → MutationObserver fires → indicator updates.

## Measurement Logic

1. **ResizeObserver** watches the `TabsList` container (already wired up for the sliding indicator).
2. On each resize, iterate tab children left-to-right using `child.getBoundingClientRect().right - container.getBoundingClientRect().left`. This accounts for flex gaps, padding, and margins naturally (unlike summing `offsetWidth`).
3. When the cumulative right edge + the "..." trigger width exceeds the container's `clientWidth`, mark that index as the breakpoint.
4. The "..." trigger is **always rendered** but hidden with `visibility: hidden` when all tabs fit. This ensures its `offsetWidth` is always measurable — no chicken-and-egg problem.
5. Tabs before the breakpoint stay visible. Tabs at and after the breakpoint are visually hidden (see DOM Strategy) and rendered as items inside the popover dropdown.

## The "..." Trigger

- Rendered as the last child inside `TabsList`, **not** a `TabsTrigger` (it's not a tab, it's a menu button).
- Uses Phosphor `DotsThree` icon (weight="bold") instead of literal "..." text — clearer overflow affordance, consistent with DS icon usage.
- Styled to match `TabsTrigger` visually (same padding, font, colors) but is a plain `<button>` wrapping a Radix `Popover.Trigger`.
- When any hidden tab is active, the "..." button gets active styling (primary color highlight) to signal the current tab is inside.
- `aria-label="More tabs"`, `aria-expanded` from Radix Popover.
- In pill variant, the trigger gets `rounded-full` like other pill triggers.

## Dropdown

- **Radix Popover** (already a dependency via Combobox/MultiSelect).
- Positioned below the "..." trigger, aligned to the end.
- Each item is a `<button>` that programmatically clicks the corresponding hidden `TabsTrigger` (see Activating Tabs section), then closes the popover.
- Active item inside the dropdown gets active styling (primary color).
- Disabled `TabsTrigger` elements remain disabled in the dropdown — non-clickable, visually muted.
- Styled with `rounded-md` (surface corner radius convention), DS tokens for background/border.
- Keyboard: arrow keys navigate items, Enter/Space activates, Escape closes.
- Respects `prefers-reduced-motion` via `motion-reduce:transition-none` on any entry/exit transitions.

## Collapse Direction

Right-to-left. The last tab hides first, then second-to-last, etc. The active tab can be hidden — the "..." trigger's active styling signals it.

## Variant Compatibility

Works with both `underline` and `pill` variants:

- **Underline:** "..." trigger sits inline in the tab bar with underline-style typography. Dropdown items use standard list styling.
- **Pill:** "..." trigger sits inside the pill container with pill styling (`rounded-full`). The container's `rounded-full` still looks correct when "..." is the last visible element. Dropdown items use standard list styling (not pill shapes — vertical list of pills would look odd).

## Sliding Indicator

The existing sliding indicator continues to work for visible tabs. When the active tab is hidden (inside the dropdown), the indicator is hidden — no orphaned indicator bar.

## Focus Management

- If the currently focused tab moves into the overflow dropdown on resize, move focus to the "..." trigger.
- `forwardRef` behavior on `TabsList` is preserved — the ref points to the outer `TabsPrimitive.List` container, not the popover.

## Edge Cases

- **All tabs fit:** "..." trigger is visually hidden (`visibility: hidden`). No behavioral change.
- **Only 1 tab fits:** First tab visible, rest in dropdown.
- **0 tabs fit:** All tabs in dropdown, "..." is the only visible element.
- **Tab added/removed dynamically:** ResizeObserver fires, recalculates breakpoint.
- **Disabled tabs overflow:** Disabled triggers appear as disabled items in the dropdown.
- **SSR:** Initial render shows all tabs (no DOM measurements). First browser paint triggers measurement and hides overflows. Brief flash is acceptable — same tradeoff the sliding indicator already makes.

## Implementation Scope

- All changes in `packages/ds/src/components/tabs/tabs.tsx` — no new files.
- The "..." trigger, popover, and measurement logic are internal to `TabsList`.
- New tests in `tabs.test.tsx`.
- New demo section in the preview page with 8 tabs to showcase overflow.
