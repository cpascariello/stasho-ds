# Form Components: Combobox + Slider — Design

**Date:** 2026-03-03
**Status:** Approved

## Scope

Two new form components for the DS package:

1. **Combobox** — searchable select (type to filter, must pick one)
2. **Slider** — single-thumb range input with optional value tooltip

Deferred to backlog: File Upload, Number Stepper, Multi-select dropdown with checkboxes.

---

## Combobox

### Dependencies

- `cmdk` — headless filtering, keyboard nav, ARIA combobox pattern (~3.5KB gzip)
- Radix `Popover` — positioned dropdown portal with collision detection (already in `radix-ui`)

### Consumer API

```tsx
<Combobox
  options={[
    { value: "btc", label: "Bitcoin" },
    { value: "eth", label: "Ethereum", disabled: true },
    { value: "sol", label: "Solana" },
  ]}
  value={selected}
  onValueChange={setSelected}
  placeholder="Select a token..."
  searchPlaceholder="Search tokens..."
  emptyMessage="No tokens found."
  size="md"        // sm | md
  error={false}
  disabled={false}
/>
```

Flat `options` prop, same pattern as Select.

### Architecture

- Radix `Popover.Root` + `Popover.Trigger` + `Popover.Content` for the dropdown portal
- `Command` + `Command.Input` + `Command.List` + `Command.Item` inside Popover content
- Trigger renders like Select trigger: shadow-brand, chevron icon, selected label or placeholder
- Search input auto-focuses when dropdown opens
- Selecting an item closes the popover and fires `onValueChange`
- CVA sizes: `sm` and `md` (matching Select trigger heights)
- Error: `border-3 border-error-400 hover:border-error-500`
- Dark mode: `dark:bg-base-800` on trigger and dropdown
- Motion-reduce: `motion-reduce:transition-none`

### Keyboard

Arrow up/down to navigate, Enter to select, Escape to close, typing filters. All from cmdk.

### FormField Integration

Accepts `error`, `aria-invalid`, `id`, `aria-describedby` via cloneElement injection.

---

## Slider

### Dependencies

- Radix `Slider` primitive (Root, Track, Range, Thumb) — already in `radix-ui`

### Consumer API

```tsx
<Slider
  min={0}
  max={100}
  step={1}
  value={[volume]}
  onValueChange={([v]) => setVolume(v)}
  showTooltip          // shows value on thumb hover/drag
  size="md"            // sm | md
  error={false}
  disabled={false}
/>
```

### Architecture

- Wraps Radix `Slider.Root` + `Slider.Track` + `Slider.Range` + `Slider.Thumb`
- CVA sizes:
  - `sm`: track h-1.5, thumb size-4
  - `md`: track h-2, thumb size-5
- Track: `bg-base-200 dark:bg-base-700`
- Range (filled): `bg-primary-500` (solid color, not gradient — gradients stretch on variable widths)
- Thumb: `bg-white border-2 border-primary-500`, shadow, `focus-visible:ring-3 ring-primary-500`
- Value tooltip: when `showTooltip` is true, a positioned `div` above thumb shows current value on hover/focus/drag. Simple absolute positioning — not the DS Tooltip component (conflicts with Slider's pointer handling)
- Error: track gets error color treatment
- Disabled: `opacity-50 pointer-events-none`
- Motion-reduce: `motion-reduce:transition-none` on thumb/range transitions

### Keyboard

Left/Right arrow for step, Home/End for min/max. All from Radix.

### FormField Integration

Accepts injected props via cloneElement.

---

## Shared Patterns

Both components follow the established DS patterns:

- `forwardRef` for DOM access
- CVA for variant management
- `cn()` for class merging
- `error?: boolean` prop with `aria-invalid`
- Consistent focus ring (`ring-3 ring-primary-500`)
- Dark mode via `dark:` variant
- Motion sensitivity via `motion-reduce:`
- Subpath exports in `package.json`
- Colocated tests (behavior + a11y, not CSS classes)
- Preview pages with DemoSection layout
