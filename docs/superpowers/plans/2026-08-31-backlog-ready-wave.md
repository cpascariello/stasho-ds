# Backlog ready-wave — 5 ready-to-execute items

Executes the "Ready to execute" tier of the 2026-08-31 backlog triage: Button outline dark-disabled fix, form-control chassis dedup, NumberInput component, preview theme persistence, DESIGN-SYSTEM composition recipes, plus the mandatory docs task. The font-loading backlog item (2026-03-01) was found already resolved (preconnect + `display=swap` in `apps/preview/src/app/layout.tsx`, self-hosted Departure Mono with `font-display: swap` in `globals.css`) — Task 6 moves it to Completed; no implementation task.

## Global Constraints

- **Working directory:** `/Users/dio/Library/CloudStorage/Dropbox/Claudio/repos/stasho-ds`, branch `feature/backlog-ready-wave`. Before ANY edit, run `pwd` and `git branch --show-current` and verify both. Never `cd` elsewhere, never commit to `main`.
- **No new dependencies.** Compose from what's installed (React, CVA, Radix, Phosphor, cn()).
- **Skin rules (docs/SKIN-PRINCIPLES.md):** radius floor `rounded-sm` (4px) on controls; focus = cyan hairline `focus-visible:border-accent-700 dark:focus-visible:border-accent` for single-surface controls; error rail `border-error`; disabled = flat sink `disabled:bg-muted dark:disabled:bg-background` + `disabled:text-foreground/30` + `cursor-not-allowed`; no accent-tinted chrome at rest; cyan is the only moving/active signal.
- **Component conventions:** one `.tsx` per component under `packages/ds/src/components/<name>/`, colocated `<name>.test.tsx`, subpath export in `packages/ds/package.json`, preview page at `apps/preview/src/app/components/<name>/page.tsx`, sidebar entry in `apps/preview/src/components/sidebar.tsx`.
- **Checks:** `npm run check` (lint + typecheck + test, all workspaces) must be green at the end of every task. Zero warnings.
- One commit per task, imperative subject ≤72 chars.
- Do not touch `apps/preview/next-env.d.ts` (pre-existing generated churn; leave uncommitted).

## Task 1: Button outline dark-mode disabled chassis

Backlog 2026-05-26 (deferred from Decision #82). In `packages/ds/src/components/button/button.tsx`, the `outline` variant keeps a transparent chassis when disabled in dark mode, while every other variant flattens to `bg-neutral-900`. Add `dark:disabled:bg-neutral-900` to the outline variant's class list (keep the existing light-mode disabled treatment untouched). Read the file first and match the exact formatting of the variant's class array. Extend `button.test.tsx` with one assertion that the outline variant carries `dark:disabled:bg-neutral-900` (mirror how existing per-variant class tests are written in that file).

## Task 2: Form-control chassis dedup

Backlog 2026-03-01 (description predates the skin; the duplication is now the flat-slot chassis). Input, Textarea, Select trigger, Combobox trigger, and MultiSelect trigger each repeat the same chassis class strings: `bg-background dark:bg-surface`, `border border-edge rounded-sm`, cyan focus pair, disabled-sink cluster, error rail application.

- Create `packages/ds/src/lib/field-chassis.ts` exporting named string constants (e.g. `fieldChassis` for the rest surface + border + radius, `fieldFocus`, `fieldDisabled`; group exactly as the real shared subsets fall out — read all five components first and extract only what is genuinely identical across a group; dropdown triggers additionally carry `hover:border-edge-hover`, which stays component-side or becomes a separate `fieldTriggerHover` constant).
- Replace the duplicated literals in the five components with the constants (inside their existing cva/cn compositions).
- **Behavior-preserving:** the rendered `className` output of every component must be unchanged. Do not edit any test expectations — the existing suites passing unmodified is the proof. If a component's string differs slightly from the others, that difference is either a bug to flag in your report (do NOT silently normalize) or a component-specific class that stays out of the shared constant.
- Add a small test for the new module only if it contains logic; plain string exports need none.

## Task 3: NumberInput component

Backlog 2026-02-27 ("Number Input / Stepper — numeric input with +/- buttons"). New component `@stasho/ds/number-input`.

**API:** `NumberInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & { size?: "sm" | "md"; error?: boolean }` — native `min`/`max`/`step`/`value`/`defaultValue`/`onChange`/`disabled` pass through to the inner input. `forwardRef` to the `<input>`. Displayname `"NumberInput"`.

**Structure:** outer `<div>` carrying the flat-slot chassis (compose from Task 2's `field-chassis` constants; use `focus-within:` in place of `focus-visible:` for the cyan hairline since focus lives on the inner input), with:
- `<input type="number">` — borderless/transparent inside the chassis (`bg-transparent focus-visible:outline-none w-full`), native spinners hidden (`[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`), sizes matching Input's text ladder (sm `text-sm`, md `text-base`; padding lives on the wrapper).
- A right-edge vertical pair of stepper buttons (Phosphor `<CaretUp weight="bold" />` / `<CaretDown weight="bold" />`, icon `size-3`), `type="button"`, `tabIndex={-1}` (keyboard steps via the input's native ArrowUp/ArrowDown), `aria-label="Increase value"` / `"Decrease value"`. Click calls the input's native `stepUp()` / `stepDown()` then dispatches `new Event("change", { bubbles: true })` (wrapped via `input.dispatchEvent`) so React `onChange` fires and min/max clamping is native. Buttons rest at `text-foreground/60`, `hover:text-accent`, `disabled:text-foreground/30 disabled:cursor-not-allowed disabled:hover:text-foreground/30`; they take `disabled` from the component's `disabled` prop.
- Disabled state: wrapper sinks (`bg-muted dark:bg-background`, `border-edge/50`), value dims to 30% (`text-foreground/30`), `cursor-not-allowed` — mirror Input's disabled cluster but expressed on the wrapper (the wrapper can't use `disabled:` pseudo — derive from the prop with conditional classes).
- Error: `border-error` on the wrapper (beats the focus-within accent — ensure precedence like Input does).
- Must accept injected `error` and `aria-invalid` so `FormField` auto-wiring works (spread `...rest` onto the input; `error` consumed on the wrapper).

**Tests** (`number-input.test.tsx`, mirror Input/Checkbox test style): renders with value; stepper up/down clicks change value and fire `onChange`; respects `min`/`max` clamping at boundaries; disabled blocks stepper clicks and applies sink classes; error applies `border-error`; both sizes render; `ref` reaches the input.

**Wiring:** `./number-input` subpath export in `packages/ds/package.json` (alphabetical placement matching existing entries); preview page `apps/preview/src/app/components/number-input/page.tsx` (basic, sizes, min/max/step, disabled, error, FormField composition — copy the structure of the Input preview page); sidebar entry in the Forms group (alphabetical).

## Task 4: Preview theme persistence

Backlog 2026-03-01. Theme resets on reload; persist and apply pre-paint.

- `apps/preview/src/components/theme-switcher.tsx`: on toggle, write `localStorage.setItem("stasho-preview-theme", next ? "dark" : "light")` wrapped in try/catch (private mode). Initial `useEffect` state read stays DOM-derived (unchanged).
- `apps/preview/src/app/layout.tsx`: read the file first — `<html>` currently ships with `theme-dark` (dark default). Inject an inline pre-paint script in `<head>` via `<script dangerouslySetInnerHTML>`: read `localStorage.getItem("stasho-preview-theme")` in a try/catch; if `"light"`, remove `theme-dark` from `document.documentElement.classList`; if `"dark"` or absent, leave the server-rendered default. Keep the script a single compact statement; no external file.
- Test: extend or add a theme-switcher test asserting toggle writes the localStorage key (jsdom provides localStorage) and that a storage failure doesn't throw. The pre-paint script itself is not unit-testable in jsdom — state that in the report rather than faking a test.

## Task 5: Composition recipes in DESIGN-SYSTEM.md

Backlog 2026-03-14. Extend `docs/DESIGN-SYSTEM.md` § Patterns with four recipes, each a short intro sentence + one JSX code block using REAL current props (read each component's section/source first — wrong props in docs are the failure mode):

1. **Form layout** — `FormField` wrapping `Input`, `Select`, `Textarea`; submit row with `Button` (primary + ghost cancel).
2. **Data-table page** — `Tabs` above a `Table` with controlled sort + `Pagination` below (use Table's controlled-sort props with externally paginated data, per its docs).
3. **Settings panel** — `Card` containing `FormField`-wrapped `Switch` rows and a `Slider`.
4. **Empty / loading state** — `EmptyState` with an action `Button` for zero-data; `Skeleton` rows for loading; `CopyableText` in a populated row example.

Match the existing Patterns section's voice and formatting. NumberInput (Task 3) may appear in recipe 1 if it reads naturally, citing its real props.

## Task 6: Update docs

- [ ] DESIGN-SYSTEM.md — new tokens, components, hooks, or patterns
- [ ] ARCHITECTURE.md — new patterns, new files, or changed structure
- [ ] DECISIONS.md — design decisions made during this feature
- [ ] BACKLOG.md — completed items moved, deferred ideas added
- [ ] CLAUDE.md — Current Features list if user-facing behavior changed

Specifics for this wave: DESIGN-SYSTEM.md gains a NumberInput § Components section + Component Index/Selection Guide rows (Task 5 already added Patterns). ARCHITECTURE.md notes the `field-chassis` shared-constants pattern and (if novel) the pre-paint theme script. DECISIONS.md gets one entry (#110) covering the wave: dedup approach, NumberInput API shape (native `stepUp`/`stepDown` + hidden spinners + caret pair), theme-persistence mechanism, and the font-loading item found already-resolved. BACKLOG.md: move Dark-mode Outline disabled chassis, Form control base class deduplication, Theme persistence, Composition recipes, Font loading strategy (mark as "already resolved — preconnect + swap shipped earlier"), and the Number Input line of the remaining-form-components item to Completed. CLAUDE.md capability index: one NumberInput line under Form controls citing (#110); theme persistence folded into the preview-app Platform line.
