# Form Components Design

Build 4 form components (Checkbox, Radio Group, Switch, Select) using Radix UI primitives, wrapped with CVA + the existing token system.

## Scope

**In scope:** Checkbox, RadioGroup + RadioGroupItem, Switch, Select
**Out of scope:** Combobox, Slider, File Upload, Number Stepper (deferred to future session)

## Dependency

Install `radix-ui` as a dependency of `packages/ds`. Unified tree-shakeable package. Consumers never import Radix directly — the DS facade hides the implementation.

## Architecture

Each component follows the same pattern:

1. Import Radix primitive
2. Wrap with `forwardRef`, apply CVA variants via `className`
3. Use existing semantic tokens (`border-edge`, `bg-card`, `bg-primary`, etc.)
4. Style Radix state via Tailwind `data-[state=checked]:` modifiers
5. Export the wrapped component

File structure (follows existing convention):

```
packages/ds/src/components/
├── checkbox/
│   ├── checkbox.tsx
│   └── checkbox.test.tsx
├── radio-group/
│   ├── radio-group.tsx
│   └── radio-group.test.tsx
├── switch/
│   ├── switch.tsx
│   └── switch.test.tsx
└── select/
    ├── select.tsx
    └── select.test.tsx
```

Each gets a subpath export in `package.json` and a preview page. All 4 work inside `<FormField>` — they accept `id` and `aria-describedby` via prop spreading.

## Component APIs

### Checkbox

```tsx
import { Checkbox } from "@aleph-front/ds/checkbox";

<Checkbox />
<Checkbox defaultChecked />
<Checkbox checked={value} onCheckedChange={setValue} />
<Checkbox disabled />
<Checkbox error />

<FormField label="Accept terms" required>
  <Checkbox />
</FormField>
```

**Props:** `checked`, `defaultChecked`, `onCheckedChange`, `disabled`, `error`, `size` (sm/md), `className`. Forwards ref to Radix root.

**Visuals:** Rounded square (`rounded-md`), `border-2 border-edge`, check icon on `data-[state=checked]` with `bg-primary` fill. Focus ring: `ring-3 ring-primary-500`.

### Radio Group

```tsx
import { RadioGroup, RadioGroupItem } from "@aleph-front/ds/radio-group";

<RadioGroup defaultValue="a" onValueChange={setValue}>
  <RadioGroupItem value="a" />
  <RadioGroupItem value="b" />
  <RadioGroupItem value="c" disabled />
</RadioGroup>

<FormField label="Plan">
  <RadioGroup defaultValue="starter">
    <RadioGroupItem value="starter" />
    <RadioGroupItem value="pro" />
  </RadioGroup>
</FormField>
```

**RadioGroup props:** `value`, `defaultValue`, `onValueChange`, `disabled`, `size` (sm/md), `className`.
**RadioGroupItem props:** `value`, `disabled`, `className`.

**Visuals:** Circle, `border-2 border-edge`, filled dot on `data-[state=checked]` with `bg-primary`. Same focus ring.

### Switch

```tsx
import { Switch } from "@aleph-front/ds/switch";

<Switch />
<Switch defaultChecked />
<Switch checked={value} onCheckedChange={setValue} />
<Switch disabled />

<FormField label="Email notifications">
  <Switch />
</FormField>
```

**Props:** `checked`, `defaultChecked`, `onCheckedChange`, `disabled`, `size` (sm/md), `className`. Forwards ref.

**Visuals:** Pill track (`rounded-full`), sliding thumb. Off = `bg-muted border-edge`, on = `bg-primary` with white thumb. `transition-transform` on the thumb.

### Select

```tsx
import { Select } from "@aleph-front/ds/select";

<Select
  placeholder="Choose..."
  options={[
    { value: "a", label: "Option A" },
    { value: "b", label: "Option B" },
    { value: "c", label: "Option C", disabled: true },
  ]}
/>

<Select value={value} onValueChange={setValue} options={options} />
<Select disabled options={options} />
<Select error options={options} />

<FormField label="Region" required error="Required">
  <Select error placeholder="Select region" options={regions} />
</FormField>
```

**Props:** `value`, `defaultValue`, `onValueChange`, `placeholder`, `options` (array of `{ value, label, disabled? }`), `disabled`, `error`, `size` (sm/md), `className`. Forwards ref.

**Visuals:** Trigger matches Input — `rounded-full`, `border-2 border-edge`, `bg-card`. Chevron icon on right. Dropdown: `rounded-2xl`, `bg-card`, `border border-edge`, `shadow-brand`. Items highlight with `bg-muted`. Selected item shows check icon.

**Why flat `options` prop?** Simpler API for the 90% case. Radix compound children are powerful but verbose for basic selects. The DS wraps that complexity. Grouped options or custom rendering can be added later if needed.

## Styling

### Shared visual language

All 4 components match Input/Textarea conventions:

| Property | Value |
|---|---|
| Border | `border-2 border-edge` |
| Hover border | `border-edge-hover` |
| Focus ring | `ring-3 ring-primary-500` |
| Error state | `border-3 border-error-400` + `aria-invalid` |
| Disabled | `opacity-50 pointer-events-none` |
| Background | `bg-card` (where applicable) |
| Transition | `transition-colors` on borders, `transition-transform` on Switch thumb |

### Sizes

Two sizes (sm/md) matching Input/Textarea:

| Component | sm | md (default) |
|---|---|---|
| Checkbox | 16x16px box | 20x20px box |
| RadioGroupItem | 16x16px circle | 20x20px circle |
| Switch | 32x18px track | 40x22px track |
| Select trigger | Input sm padding | Input md padding |

### Dark mode

No special work needed — semantic tokens (`border-edge`, `bg-card`, `bg-primary`, `bg-muted`) already swap via `.theme-dark`. `data-[state=checked]:bg-primary` resolves to primary-600 (light) or primary-400 (dark) automatically.

## Testing

Test behavior and accessibility only (per ARCHITECTURE.md testing philosophy).

| Component | Tests |
|---|---|
| Checkbox | Toggles `data-state` on click. `aria-invalid` when error. Disabled prevents interaction. Forwards ref. Controlled mode syncs with `onCheckedChange`. |
| RadioGroup | Selection changes `data-state`. Only one selected at a time. Disabled on group disables all. Disabled on item skips it. `onValueChange` fires. |
| Switch | Toggles `data-state` on click. `role="switch"` present. `aria-checked` matches. Disabled prevents toggle. |
| Select | Opens on trigger click. Selects item on click. `onValueChange` fires. Disabled items not selectable. `aria-invalid` when error. Placeholder shows when no value. |

## Preview Pages

Each component gets a page at `apps/preview/src/app/components/<name>/page.tsx`. Added to sidebar under a "Forms" group alongside existing Input, Textarea, FormField entries.

Each page shows: all states (default, checked/selected, disabled, error), both sizes, and FormField integration.

## Doc Updates

- DESIGN-SYSTEM.md — new component docs (Checkbox, RadioGroup, Switch, Select)
- ARCHITECTURE.md — Radix wrapper pattern, updated component recipe
- DECISIONS.md — Radix UI choice and rationale
- BACKLOG.md — form components item moved to completed
- CLAUDE.md — Current Features updated
