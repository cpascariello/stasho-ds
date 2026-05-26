# Typography reset — six components

**Date:** 2026-05-26
**Integration branch:** `skin/paraplu`
**Chunk type:** systematic alignment with `docs/SKIN-PRINCIPLES.md` § Typography
**Scope:** Alert (title), Badge, Breadcrumb, Pagination (page numbers), Table (column headers), Tabs (triggers)

---

## 1 · Problem

Six components currently use `font-heading font-extrabold italic uppercase` (Anybody as a label face) or `font-sans font-semibold uppercase tracking-wide` (Inter as uppercased label face) on their interactive labels. Both treatments predate the Abyssal Void skin and violate `SKIN-PRINCIPLES.md` § Typography in two ways:

1. **Anybody on interactive UI.** The principle reserves Anybody for headings (page titles, section headers). Using it as a label face on buttons-adjacent surfaces reads as poster type, not pressable control.
2. **Uppercase on Inter.** The principle reserves uppercase for Departure Mono (telemetry chrome). Tracked-uppercase Inter reads as marketing banner copy.

Result: the system has no consistent voice for "this is an interactive label" vs "this is system telemetry." Status chips look like editorial headers; column headers look like ad copy.

Audit verdict per component (current state):

| Component | Current | Violation |
|---|---|---|
| Alert title | `font-heading font-extrabold italic text-xs uppercase` | Anybody on a label |
| Badge | `font-heading font-extrabold italic uppercase` | Anybody on a chip |
| Breadcrumb | `font-heading font-extrabold italic uppercase text-xs` | Anybody on nav links |
| Pagination | `font-heading font-bold text-lg` | Anybody on numeric controls |
| Table headers | `font-semibold uppercase tracking-wide` | Inter uppercase |
| Tabs triggers | `font-heading font-bold` (size-md `text-lg`) | Anybody on tab labels |

Button was redesigned in Decisions #80–#82 with Inter sentence case. This chunk applies the same principle to the rest of the DS — every interactive label face becomes either **Inter sentence case** (operational) or **Departure Mono uppercase** (telemetry).

---

## 2 · Decision

**Route each label to one of two voices**, per the role of its content:

### Voice A — Inter sentence case (operational labels)

| Component | Treatment |
|---|---|
| **Alert title** | `font-sans font-semibold text-sm leading-tight` (Inter Semibold 14px, sentence case, no italic). Replaces 12px Anybody UC italic — type goes up one step because Inter at 12px Semibold reads too thin for a banner title. |
| **Breadcrumb** items | `font-sans font-medium text-sm` (Inter Medium 14px, sentence case). Up one step from 12px Anybody UC italic — same reason as Alert. |
| **Tabs** trigger (variant=underline, size=md) | `font-sans font-semibold text-sm` (Inter Semibold 14px). Down one step from current 18px Anybody Bold — `text-lg` was tab-as-page-heading scale, `text-sm` is tab-as-control scale. |
| **Tabs** trigger (variant=underline, size=sm) | `font-sans font-semibold text-sm` (Inter Semibold 14px — same as md). Today's value, font swap only. |
| **Tabs** trigger (variant=pill, size=md) | `font-sans font-semibold text-sm` (font swap only — size unchanged) |
| **Tabs** trigger (variant=pill, size=sm) | `font-sans font-semibold text-xs` (font swap only — size unchanged) |
| **Tabs** OverflowTrigger ("…" menu) | matches the size+variant rules above (font swap + drop `text-lg` on underline-md, like TabsTrigger) |

Why Inter sentence case here: each label IS a sentence or phrase the user reads as content. "Connection lost" / "Home / Settings / Profile" / "Overview" — they don't act as system chrome, they act as text. Sentence case is the de-facto convention for operational UI across modern DSs.

### Voice B — Departure Mono uppercase (telemetry chrome)

| Component | Treatment |
|---|---|
| **Badge** (size=md) | `font-mono uppercase tracking-wider text-xs` (Departure Mono 12px UC, tracking 0.05em). Size unchanged from today, font + tracking swap. |
| **Badge** (size=sm) | `font-mono uppercase tracking-wider text-[10px]` (Departure Mono 10px UC). Size unchanged, font + tracking swap. |
| **Badge** | `text-transform: uppercase` forced via CSS class regardless of consumer string |
| **Pagination** PAGE_BUTTON | `font-mono text-sm` (Departure Mono 14px, no zero-pad). Down one step from 18px Anybody Bold. |
| **Pagination** ellipsis ("…") | `font-mono text-sm` (matches PAGE_BUTTON — currently 18px Anybody Bold) |
| **Pagination** arrow buttons | unchanged — they're already icon-only (Phosphor `CaretLeft` / `CaretRight`), no font class to swap |
| **Table** column headers | `font-mono font-normal uppercase tracking-widest text-[11px]` (Departure Mono 11px UC, tracking 0.1em). Replaces 14px Inter Semibold UC tracking-wide. |

Why Departure Mono UC here: status chips, numeric indices, and column metadata are textbook "instrument readout" material. Their value to a user is "this is system-emitted data," and Departure Mono's pixel-CRT proportions earn their keep there.

Tracking uses Tailwind named utilities (`tracking-wider` = 0.05em, `tracking-widest` = 0.1em) — no arbitrary values.

### Two interpretive calls inside Voice B

1. **Badge forces uppercase via CSS** (`text-transform: uppercase`) regardless of consumer string. A `<Badge>active</Badge>` renders as `ACTIVE`. This trades flexibility for systemic consistency: every Badge in every consumer app reads as the same telemetry vocabulary, with no team-discipline tax.

2. **Pagination renders numbers as-is, no zero-padding.** `1`, `2`, `12`, `247` — not `01`, `02`, etc. Departure Mono's fixed-width glyphs do enough of the lifting; zero-padding would push the component out of standard pagination UX into flight-data territory.

---

## 3 · Out of scope

Explicitly NOT changed in this chunk:

- **Alert message body** — already `font-sans font-italic text-xs`. Italic stays here (it carries a "supporting / secondary" voice register and reads fine on Inter at small sizes — the italic-on-label problem doesn't apply to running prose).
- **Table body cells** — already `font-sans` sentence case (only headers change).
- **Tabs content panel** — no typography changes (consumers control their own children).
- **FormField labels** — already `font-sans` Medium sentence case.
- **Page titles, section headings, dialog titles, modal headers** — Anybody continues to be the heading face. This chunk only removes Anybody from *label* roles, not from heading roles.
- **Button** — already Inter Semibold sentence case (Decisions #80, #82).
- **Tokens** — no changes to `tokens.css`. Same `font-sans` / `font-mono` / `font-heading` families; only Tailwind utility classes on components change.

---

## 4 · Italic

Italic styling is removed from all six components. Reasoning:

- Italic + Anybody created the "Anybody as label" feel — a register Anybody isn't built for.
- Inter Semibold without italic matches the Button treatment shipped in #80–#82 and reads as a clean, modern interactive label.
- Departure Mono has no italic by design (it's a single-style pixel font), so this is a non-question for Voice B.

Italic survives only on Alert message body, where it carries a "supporting prose" register and reads well on Inter sentence-case text.

---

## 5 · Cross-cutting rules to add to SKIN-PRINCIPLES.md § Typography

After this chunk lands, append these clarifications to `SKIN-PRINCIPLES.md`:

> **Anybody is for headings only.** Page titles, section headers, dialog titles. Never on labels, chips, links, controls, or anywhere a user reads the text as part of operating the UI.
>
> **Departure Mono is the telemetry voice.** Status chips, column headers, numeric indices, version strings, ID strings, telemetry labels. Force uppercase via CSS at the component level where the role is unambiguous (Badge), or apply uppercase utility selectively (Table headers).
>
> **No italic on interactive labels.** Italic stays out of buttons, chips, links, headers, tab triggers, and breadcrumb items. Italic is allowed on running prose where the register adds something (Alert message body).

These three rules already follow from the existing § Typography section, but stating them explicitly will prevent the next contributor from sliding back into Anybody-as-label.

---

## 6 · Component-level changes (file-by-file)

Each row below identifies the exact line and the class swap. Active-state colors and other non-typography concerns are deliberately preserved (see "Out of scope" below).

| File:line | Remove | Add |
|---|---|---|
| `alert/alert.tsx:54` (title CVA base) | `font-heading font-extrabold italic text-xs uppercase leading-normal pb-1` | `font-sans font-semibold text-sm leading-tight pb-1` |
| `badge/badge.tsx:8` (CVA base) | `font-heading font-extrabold italic uppercase` | `font-mono uppercase tracking-wider` |
| `badge/badge.tsx:25` (size=sm) | `px-3 py-0.5 text-[10px]` | unchanged — `text-[10px]` stays |
| `badge/badge.tsx:26` (size=md) | `px-4 py-1 text-xs` | unchanged — `text-xs` stays |
| `breadcrumb/breadcrumb.tsx:30` | `font-heading font-extrabold italic uppercase text-xs` | `font-sans font-medium text-sm` |
| `pagination/pagination.tsx:95` (PAGE_BUTTON const) | `font-heading font-bold text-lg` | `font-mono text-sm` |
| `pagination/pagination.tsx:167` (ellipsis span) | `font-heading font-bold text-lg` (preserve `text-primary-600 dark:text-primary-400 select-none`) | `font-mono text-sm` (preserve active color classes) |
| `table/table.tsx:168` (`<th>` className) | `text-sm font-semibold uppercase tracking-wide` | `font-mono font-normal uppercase tracking-widest text-[11px]` |
| `tabs/tabs.tsx:204` (OverflowTrigger base) | `font-heading font-bold` | `font-sans font-semibold` |
| `tabs/tabs.tsx:222` (OverflowTrigger underline-md size) | `px-4 py-3 text-lg` | `px-4 py-3 text-sm` |
| `tabs/tabs.tsx:264` (Overflow dropdown active item) | `text-primary-600 dark:text-primary-400 font-bold` | `text-primary-600 dark:text-primary-400 font-semibold` |
| `tabs/tabs.tsx:430` (TabsTrigger base) | `font-heading font-bold text-lg` | `font-sans font-semibold text-sm` |

Notes:

- **Active-state colors are preserved** (Pagination's `text-primary-600 dark:text-primary-400`, Tabs trigger's `data-[state=active]:text-primary-600`, Breadcrumb's `text-primary` hover). These are chunk 4 (active-state recolor primary → accent). Avoid scope creep.
- **Sliding tab indicator (`bg-primary-X`) is preserved.** Same reasoning.
- **Removing italic + uppercase from Tabs's `font-bold` overflow active item** — the active dropdown item now uses `font-semibold` instead of `font-bold`, matching the parent trigger's Semibold weight. Visual consistency, not a semantic change.
- **Badge size handling** — `text-xs` (md=12px) and `text-[10px]` (sm) are unchanged. The font swap from Anybody UC italic to Departure Mono UC at the same size keeps overall optical weight similar. Badge becomes denser per character but lighter per pixel — net feel is "same scale, different voice."
- **Tabs `text-lg` → `text-sm` is a deliberate size drop** on the underline-md variant only. 18px Anybody Bold reads as "page section heading"; 14px Inter Semibold reads as "tab control." Confirmed in the composed-preview screen.
- **Table `<th>` size also drops** from `text-sm` (14px) Inter Semibold UC tracked, to `text-[11px]` Departure Mono UC tracked. Smaller mono-UC reads denser and more telemetry-like at the same optical weight.

---

## 7 · Tests

For each component, the existing test suite covers behavior — no test logic changes. But each component's snapshot test (if present) will need regeneration after the class changes.

New assertion to add to `badge.test.tsx`: render Badge with a lowercase children string, assert the rendered DOM still includes the lowercase string in `textContent` (CSS uppercase doesn't change DOM content) — this proves the API contract is unchanged for consumers reading the rendered text in tests.

No new tests needed for Alert, Breadcrumb, Pagination, Table, Tabs — typography is presentational and covered by existing render assertions.

---

## 8 · Documentation updates required

Per `CLAUDE.md` working habits, this chunk must update:

- **DESIGN-SYSTEM.md** — Badge, Pagination, Table, Tabs entries to reflect new label voice. Alert/Breadcrumb entries already terse enough to leave alone but verify.
- **ARCHITECTURE.md** — no new architectural patterns; skip unless a new pattern emerges during implementation.
- **DECISIONS.md** — single new decision entry covering all 6 components (this is one cohesive design call, not six).
- **BACKLOG.md** — move the "Typography reset (chunk 1)" entry to Completed.
- **SKIN-PRINCIPLES.md** — append the three clarification rules from §5 of this spec.
- **CLAUDE.md** Current Features — update entries for the 6 components to reflect the new label voice.

---

## 9 · What this chunk does NOT touch (followups, for clarity)

| Concern | Next chunk |
|---|---|
| Form input chassis (`bg-primary-100` → surface neutral) | Chunk 2 (visualize first) |
| Thick borders on form controls (`border-2/3` → 1px hairline) | Chunk 3 |
| Active-state color drift (primary → accent on Pagination/Tabs/Table) | Chunk 4 |
| Stepper motion + indicator border | Chunk 5 |
| CopyableText / Tooltip radius polish | Chunk 6 |
| LED-as-signature on Combobox/Select triggers | Future chunk (LED expansion) |

---

## 10 · Acceptance criteria

This chunk is done when:

1. None of the six components reference `font-heading` in their `.tsx` files. Search `grep -r "font-heading" packages/ds/src/components/{alert,badge,breadcrumb,pagination,table,tabs}` returns zero matches. (Tests may still reference the old class names if asserting on the rendered class string — those tests get updated.)
2. Badge renders as `text-transform: uppercase` regardless of consumer string. Test in §7 passes.
3. Pagination page numbers render in Departure Mono without zero-padding.
4. Table headers render in Departure Mono UC tracking-wider.
5. `npm run check` passes (lint + typecheck + test).
6. Composed preview view of the dashboard pages in the preview app reads as cohesive — Inter sentence and Departure Mono UC coexist without one drowning the other.
7. All docs in §8 are updated before the chunk PR squash-merges into `skin/paraplu`.
