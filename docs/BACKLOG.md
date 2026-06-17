# Backlog

Ideas and scope creep captured for later consideration.

---

## How Items Get Here

- Scope drift detected during focused work (active interrupt)
- Ideas that come up but aren't current priority
- "We should also..." moments
- Features identified but deferred

---

## Open Items

### 2026-06-05 — Interactive Card variant (Card ↔ ActionCard convergence)

**Source:** Deferred while unifying the card family (Decision #100). The radius-floor + unification work scoped out card *anatomy*.
**Description:** Give plain `Card` an optional clickable/interactive mode (hover `border-edge-hover` + `focus-visible:outline-accent`, optional elevation on hover) so a static Card and a clickable `ActionCard` converge on one component instead of two. Also covers the broader card-anatomy ideas (composition slots: CardHeader/Content/Footer, a media slot). Note: the CLAUDE.md SelectableCard `rounded-2xl` doc drift was resolved by Decision #100 (code + docs now `rounded-lg` = 6px).
**Priority:** Low

### 2026-06-05 — CopyableText fluid: centered-middle + DS Tooltip variants

**Source:** Deferred while implementing fluid CopyableText (Decision #98)
**Description:** Two ideas considered and deferred for the `fluid` mode: (1) a JS-measured *centered* middle truncation that keeps the ellipsis dead-center and fills width exactly (accurate with the monospace face, but needs a `ResizeObserver`); (2) a DS Tooltip reveal variant in place of the native `title` (on-brand, instant, styled, but pulls in Radix Tooltip + a provider requirement). Revisit if a callsite needs centered truncation or a styled hover reveal.
**Priority:** Low

### 2026-03-01 — Theme persistence across page reloads

**Source:** Identified during accessibility audit
**Description:** Theme selection resets on page reload. Persist to `localStorage` and apply before first paint (inline `<script>` in `<head>`) to avoid flash of wrong theme.
**Priority:** Medium

### 2026-03-01 — Font loading strategy

**Source:** Identified during accessibility audit
**Description:** External font loading (Typekit, Google Fonts) blocks render and has no fallback strategy. Consider `font-display: swap`, preconnect hints, or self-hosting critical fonts.
**Priority:** Low

### 2026-03-01 — Form control base class deduplication

**Source:** Identified during accessibility audit
**Description:** Input, Textarea, and Select share identical base styles (shadow-brand, focus ring, error border, dark mode bg). Extract shared form control base classes to reduce duplication.
**Priority:** Low

### 2026-02-27 — Form components (remaining)

**Source:** Identified while reviewing component coverage
**Description:** Build remaining form components using the token system and CVA architecture. Checkbox, RadioGroup, Switch, Select, Combobox, and Slider are done. Remaining:
- File Upload — drag-and-drop or click-to-upload area
- Number Input / Stepper — numeric input with +/- buttons
**Priority:** Medium

### 2026-02-27 — Component library (remaining)

**Source:** Design doc
**Description:** Build remaining UI components. Badge, StatusDot, Card, Skeleton, Table, Tooltip are done. Remaining:
- ~~Modal / Dialog~~ — done (see completed)
- ~~Tabs~~ — done (see completed)
- ~~Accordion / Collapsible~~ — done (Radix-based FAQ disclosure + slide/settle motion, Decision #101)
- ~~Alert / Banner~~ — done (see completed)
- Avatar — user image with fallback initials
- ~~Pagination~~ — done (see completed)
- ~~Progress~~ — done (see completed)
- ~~Breadcrumb~~ — done (see completed)
**Priority:** High

### 2026-03-14 — Composition recipes for DESIGN-SYSTEM.md

**Source:** Identified during DESIGN-SYSTEM.md improvement pass
**Description:** Expand the Patterns section with more composition recipes: form layout (FormField + inputs), data table page (Table + Pagination + Tabs), settings panel (Switch + Slider + Card), empty state (Skeleton + CopyableText). Show how components compose together for common product UI patterns.
**Priority:** Low

### 2026-03-17 — Scheduler API endpoint reference

**Source:** External reference from aleph-vm-scheduler repo
**Description:** Track the scheduler API endpoints for building dashboard UI that consumes them. Check periodically for new or changed routes.
**Link:** https://github.com/aleph-im/aleph-vm-scheduler/blob/260302ee7ac4a81f972a7b44b04e4f537091080d/scheduler-api/src/routes/mod.rs#L882
**Priority:** Low

### 2026-04-10 — Restyle app progress bars to use DS ProgressBar

**Source:** Identified during ProgressBar implementation
**Description:** The cloud app has hand-rolled progress bars (likely inline divs with width %). Replace with `@aleph-front/ds/progress-bar` ProgressBar component for consistency and accessibility.
**Priority:** Medium

### 2026-04-10 — Restyle app stepper/pipeline to use DS Stepper

**Source:** Identified during Stepper implementation
**Description:** The cloud app has a StepIndicator and pipeline component for multi-step flows. Replace with `@aleph-front/ds/stepper` compound Stepper for consistency, accessibility, and orientation support.
**Priority:** Medium

### 2026-02-26 — Button icon animations

**Source:** Deferred from button component design
**Description:** Add hover/focus animations to button icons (e.g., arrow slide on hover, plus rotate on focus).
**Priority:** Low

### 2026-05-26 — Adopt Grilli Type for headings

**Source:** Carried over from Decision #77 / #78
**Description:** Replace Anybody (Google Fonts) with a Grilli Type face for headings once budget is approved. Anybody is the free placeholder that matches the industrial brief; Grilli would be the paid upgrade.
**Priority:** Low

### 2026-05-26 — Contrast-aware accent text utility

**Source:** Identified while writing Abyssal Void docs
**Description:** Switch accent-colored body text from raw `text-accent` to a contrast-aware scale step (`text-accent-700 dark:text-accent-300`) once a real cyan-text moment lands in a consumer app. The same-hex rule is right for fills/borders/indicators; inline body text needs a darker step on light surfaces for AA contrast.
**Priority:** Low

### 2026-05-26 — Dark-mode Outline disabled chassis

**Source:** Identified during Button light-mode chunk (Decision #82)
**Description:** Outline disabled in dark mode keeps a transparent chassis (no `dark:disabled:bg-X`) while every other variant flattens to `bg-neutral-900`. Inconsistent with "Disabled flattens" principle. Fix by adding `dark:disabled:bg-neutral-900` to the Outline variant — small dark-mode behavior change, kept out of the light-mode chunk scope.
**Priority:** Low

---

## Completed / Rejected

<details>
<summary>Archived items</summary>

- [x] 2026-02-26 — Typekit font integration (kit ID: `acb7qvn`)
- [x] 2026-02-26 — Global CLAUDE.md: bundler moduleResolution for Next.js
- [x] 2026-02-26 — Button component (CVA variants, OKLCH color scales, TDD)
- [x] 2026-02-27 — Input, Textarea, FormField components (CVA, accessibility, TDD)
- [x] 2026-02-27 — Monorepo + preview restructure (pnpm workspaces, sidebar + routes)
- [x] 2026-02-27 — Gradient button variants (primary=gradient-main, secondary=gradient-lime, outline=gradient border)
- [x] 2026-02-27 — Form components: Checkbox, RadioGroup, Switch, Select (Radix UI wrappers)
- [x] 2026-02-27 — Select dropdown animation classes are dead (removed, no phantom features)
- [x] 2026-03-01 — Dashboard components: Badge, StatusDot, Card, Skeleton, Table, Tooltip
- [x] 2026-03-01 — Accessibility audit & hardening (StatusDot a11y, FormField error injection, Table keyboard nav, motion-reduce support, responsive mobile layout)
- [x] 2026-03-02 — Align color token naming with Tailwind conventions (`destructive` → `error` alias)
- [x] 2026-03-02 — Package publishing to npm (CI/CD pipeline, raw TS source, GitHub Release trigger)
- [x] 2026-03-04 — Combobox component (cmdk + Radix Popover, searchable dropdown, sm/md sizes)
- [x] 2026-03-04 — Slider component (Radix Slider wrapper, track/thumb CVA, tooltip, sm/md sizes)
- [x] 2026-03-04 — Base color scale expansion (merged base into neutral at H:280, full 50-950 ramp)
- [x] 2026-03-05 — Multi-select dropdown with checkboxes (cmdk + Radix Popover, tags with overflow, clear-all)
- [x] 2026-03-06 — Phosphor Icons integration (replaced inline SVGs, added to DS as dependency, preview showcase)
- [x] 2026-03-06 — CopyableText component (middle-ellipsis truncation, clip-path circle reveal, optional external link)
- [x] 2026-03-09 — Logo components (icon mark + full logo, currentColor, 2 components instead of 4 SVGs)
- [x] 2026-03-09 — FX grain backgrounds (4 size variants xs/sm/md/lg, DS token colors, dark mode, preview showcase) — **removed 2026-05-26** in Abyssal Void skin redesign
- [x] 2026-05-26 — Card grain size variants — rejected: fx-grain removed entirely in Abyssal Void
- [x] 2026-03-09 — Tabs component (Radix wrapper, sliding indicator, composable API, badge/subscript support)
- [x] 2026-03-10 — Alert component (4 variants, dismiss with exit animation, auto-dismiss timer, auto-styled links)
- [x] 2026-03-10 — Pagination component (controlled API, configurable siblingCount/showFirstLast, pure buildPageRange function, a11y)
- [x] 2026-03-10 — Breadcrumb component (composable 6-part API, asChild via Radix Slot, semantic nav/ol/li, custom separator)
- [x] 2026-03-12 — Tabs pill variant Tailwind 4 scanner fix (`@source inline()` safelist in tokens.css)
- [x] 2026-03-13 — Dialog component (Radix UI, composable API, frosted overlay, locked dismiss)
- [x] 2026-03-13 — CopyableText: remove tooltip, make text clickable when href provided
- [x] 2026-03-13 — CopyableText: internal links open in new tab (auto-detect relative vs absolute URLs)
- [x] 2026-03-16 — Button `text` variant hover invisible on `surface` background (bumped hover to primary-100, active to primary-200)
- [x] 2026-04-10 — ProgressBar component (determinate + indeterminate, 3 sizes, ProgressBarDescription child)
- [x] 2026-04-10 — Stepper compound component (7 parts, horizontal/vertical orientation, dual-context state propagation)
- [x] 2026-05-01 — Table sort-icon alignment fix on right-aligned headers (inline-flex + flex-row-reverse, no width shift on toggle)
- [x] 2026-05-02 — Table controlled-sort props (`sortColumn`/`sortDirection`/`onSortChange`) so externally paginated tables can sort the full dataset rather than only the current page
- [x] 2026-05-04 — Tabs `maxVisible` prop (count-based cap on visible tab count, stricter-wins composition with `overflow="collapse"`)
- [x] 2026-05-26 — Abyssal Void skin (deep purple + cyan + teal + amber + blood-orange, same-hex rule, 0/0/2/4 radius, Anybody/Inter/Departure Mono)
- [x] 2026-05-26 — Button redesign as instrument-panel control (LED signature, 7 variants, 3 sizes, sentence case Inter, loading via dual-dot chase)
- [x] 2026-05-26 — Button light-mode treatment + dark-mode Primary unification (Decision #82: brand-blue Primary across both modes, raised-light Secondary in light, primary-blue Outline in light, foreground-text Ghost in light, `bg-muted` disabled chassis in light for all filled variants including destructive/warning/success, chassis-static + halo-on-hover for Primary and Secondary)
- [x] 2026-05-26 — Typography reset across 6 components (Decision #83: Alert variant label, Badge, Pagination numbers, Table headers → Departure Mono UC; Breadcrumb, Tabs triggers → Inter Semibold sentence case; Anybody removed from all interactive label roles)
- [x] 2026-05-27 — Text-input chassis reset (Decision #84: flat-slot chassis for Input/Textarea/Select/Combobox/MultiSelect — `bg-background dark:bg-surface` + 1px `border-edge`, cyan hairline focus, `border-error` error rail, chassis sinks one step on disabled; FormField switched from `text-error-600` to semantic `text-error`)
- [x] 2026-05-27 — Chunk 4 boolean/range chassis reset (Decision #85: Checkbox/RadioGroup/Switch/Slider on flat-hairline chassis; Switch + Slider get bevel + cyan thumb-glow on hover/focus per Direction C; all cyan-checked states use `--accent`; disabled flattens to muted-sink chassis; compound `disabled:data-[state=checked]:*` variants for specificity; Slider uses `data-[disabled]:*` because Radix renders Thumb/Range as `<span>`)
- [x] 2026-05-27 — Chunk 5 active-state recolor + TabsList chrome polish (Tabs + Breadcrumb): `primary-*` → cyan `--accent` on active/hover; pill indicator → `bg-accent/15` tinted; underline track + indicator collapse to 1px hairline (both sizes); pill list adds 1px `border-edge` hairline + moves to `rounded-[2px]`; pill triggers + sliding indicator + OverflowTrigger pill branch all move to `rounded-[2px]`; Tabs focus → outline-accent pattern (Decision #82 alignment); Tabs disabled → semantic flatten (Decision #84 alignment); Breadcrumb current page → `text-accent`; Breadcrumb separator → `text-foreground/25`. SKIN-PRINCIPLES § 2 + § 4 amended.
- [x] 2026-05-27 — Chunk 6 container surfaces (Decision #87): shadow tokens renamed + neutralized (`--shadow-brand-*` → `--shadow-*` plain rgba); popover surface tokenized (`--popover-bg` / `--popover-border` resolving through `--surface` / `--edge`); Tooltip + 4 popover dropdowns (Select / Combobox / MultiSelect / Tabs overflow DropdownMenu) aligned to popover token + neutral shadow + flat-sink disabled; Dialog content stays flat (no border, no drop shadow — separation from page via frosted overlay alone) + `rounded-xl` (4px) semantic radius + Button-pattern close focus; MultiSelect inner indicator → `bg-accent border-accent` (cyan, no longer brand-blue) with 1px hairline + 0px radius; Card radius semantic (`rounded-lg` = 2px); preview-app consumers (sidebar.tsx, page.tsx, foundations/effects/page.tsx) migrated. SKIN-PRINCIPLES § 6 gains "Elevation is neutral" + "Popover surface tokens"; § 4 gains "Surface radii by role" table with explicit Tailwind-class → pixel mapping for the Abyssal scale.
- [x] 2026-05-27 — Wave-1 finish: Pagination + Switch + Stepper + Alert (Decision #88: Pagination tinted-cyan active pill + 26×26 numbers + wave-1 disabled; Switch square track + square thumb; Stepper square indicators + cyan halo on active + filled completed chip with auto-Check + StepperConnector `completed` prop; Alert semantic tokens + top→bottom gradient + cyan info; SKIN-PRINCIPLES § 2 active-states + carve-out generalisation, § 4 rounded-full list shrinks, § 6 Direction C extends to Stepper)
- [x] 2026-05-27 — Rounded-full audit: MultiSelect chips (Decision #91: chip + per-tag dismiss X + clear-all X all moved from `rounded-full` to `rounded-[2px]`, joining the wave's "contained group" family — Card, Tabs pill list, Switch, Stepper indicators; SKIN-PRINCIPLES § 4 reserved list final state — StatusDot, Slider thumb, RadioGroup item, ProgressBar tracks; bullet list gains RadioGroup entry that was missing from Decision #90's amendment)
- [x] 2026-05-27 — Switch follow-ups: size ladder revisit + boolean focus pattern principle (Decision #92: Switch thumb sizes match Checkbox/Radio at sm/md = 16/20, xs stays 12 for breathing; tracks proportional 1.75–1.83 ratio = `h-4 w-7` / `h-5 w-9` / `h-6 w-11`; symmetric 2px breathing both ends. Focus pattern documented as principle in SKIN-PRINCIPLES § 6 "Boolean focus pattern split by surface count" — single-surface controls use border-swap, multi-element controls with separately-rendered focal element use external outline; no code change for focus pattern, docs-only as per the backlog item)
- [x] 2026-05-27 — Skin coverage finish (Decision #93 — full-sweep audit closes the wave): CopyableText link `text-primary-500 dark:text-primary-300` → `text-accent-500 dark:text-accent` (§ 2 Color link role); Table activeKey row + row-click hover `bg-primary-600/10` + `inset-shadow primary` → `bg-accent/15` + `inset-shadow accent` (Decision #86/#88 active-state sweep, last pre-skin leak); ui/Spinner removed outright (contradicted § 6 "Loading pulses, never spins"; zero internal consumers; pre-1.0 package; "Replace, don't deprecate"); class-name cleanups `rounded-md`/`rounded-sm` → `rounded-none` on copyable-text copy + external buttons, tabs DropdownMenu item, skeleton (all already resolved to 0px under Abyssal scale — names now honest). DESIGN-SYSTEM.md Spinner section removed + loading taxonomy updated to LED chase. ARCHITECTURE.md motion-reduce key files updated.
- [x] 2026-05-27 — Visibility refresh: dark `--surface` 0.16 → 0.18, dark `--edge` 8% → 16% (Decision #95). Cards + dropdowns + every other component on the surface/edge tokens lift off the page; lg button size restored (15px / py-13 / px-24 / LED size-2 / icon size-4) as opt-in for hero CTAs while md stays the default. SKIN-PRINCIPLES § 3 "Hairline borders" rule depinned from the literal alpha value — now references `--edge` only.
- [x] 2026-06-17 — Bump workflow actions off the Node-20 runtime (hard deadline 2026-06-16): `actions/checkout` 4.3.1→6.0.3, `actions/setup-node` 4.4.0→6.4.0, SHA-pinned with version comments in both `publish.yml` and `ci.yml`; `ci.yml` moved off floating `@v4` tags and hardened (`permissions: contents: read` + `persist-credentials: false`). `actionlint` + `zizmor` clean. `node-version: 22` toolchain pin unchanged.

</details>
