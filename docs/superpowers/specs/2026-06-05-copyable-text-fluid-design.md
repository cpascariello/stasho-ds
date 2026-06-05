# CopyableText — Fluid (width-aware) truncation

**Date:** 2026-06-05
**Status:** Approved (brainstorm), pending implementation plan
**Component:** `packages/ds/src/components/copyable-text/copyable-text.tsx`

## Context

`CopyableText` today does **static** middle truncation: it always renders
`text.slice(0, startChars) + "…" + text.slice(-endChars)` regardless of how much
room it has, and the wrapper is `inline-flex` so it shrink-wraps to that fixed
string. The truncation is decided by character counts, not by available space.

We want a **long / width-aware** mode that reacts to its container: show the full
hash/address when there's room, and truncate as the container squeezes. This is
additive — the existing fixed behavior stays the default and is untouched.

## Decision summary (from brainstorm)

| Question | Choice |
|---|---|
| Truncation style when squeezed | **Fixed tail, flexing head** (pinned suffix, head truncates with a native ellipsis). Pure CSS two-span flexbox trick — chosen over JS-measured centered-middle to avoid `ResizeObserver`. |
| Reveal hidden chars | **Native `title` attribute** on the text region. No DS Tooltip dependency. |
| API | One new boolean prop `fluid` (default `false`). |
| Width | Fluid mode fills its parent (`w-full`); consumer constrains via the parent / `className`. |

This becomes **Decision #98** in `docs/DECISIONS.md` on merge.

## API

```tsx
<CopyableText
  text="0x1234567890abcdef1234567890abcdef12345678"
  fluid              // NEW — opt into width-aware truncation (default: false)
  endChars={6}       // pinned tail length (reused prop; default 4)
  href="https://…"   // optional link — unchanged
  size="md"          // "sm" | "md" — unchanged
  className="max-w-[320px]"  // optional width cap — unchanged
/>
```

### Prop table (delta)

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `fluid` | `boolean` | `false` | **NEW.** `true` → width-aware truncation. |
| `endChars` | `number` | `4` | In fluid mode, the pinned tail length. |
| `startChars` | `number` | `6` | **Ignored when `fluid`** (head flexes freely). Used only in fixed mode. |
| `text`, `href`, `size`, `className` | — | — | Unchanged. |

## Behavior

### Fluid mode (`fluid: true`)

1. **Outer element** becomes `flex w-full items-center` (instead of `inline-flex`),
   so it fills its parent's width and reflows when the parent resizes.
2. **Text region** is a flex child (`flex-1 min-w-0`) containing two spans:
   - `head` = `text.slice(0, -endChars)` → `flex-[0_1_auto] min-w-0 overflow-hidden
     text-ellipsis whitespace-nowrap`
   - `tail` = `text.slice(-endChars)` → `flex-none whitespace-nowrap`
3. **Result across widths:**
   - Wide enough → head shows fully, no ellipsis, full string visible.
   - Narrowing → head truncates with a native `text-overflow: ellipsis`; the
     ellipsis drifts left as it shrinks.
   - Floor → head collapses toward `0x…`; the pinned tail + copy button stay put.
4. **Reveal:** `title={text}` on the text region. Set unconditionally in fluid mode
   (detecting actual truncation purely is impossible without the JS overflow check
   that the pure-CSS approach was chosen to avoid; echoing the visible text when not
   truncated is harmless).
5. **Short-text guard:** if `text.length <= endChars`, render the full text in a
   single span with no head/tail split.
6. **Pure CSS** — no measurement, no `ResizeObserver`, no new dependencies.

### Fixed mode (`fluid: false`, default — unchanged)

- Outer stays `inline-flex` (shrink-wraps to content).
- Static middle truncation via `truncateMiddle(text, startChars, endChars)`.
- Existing props, tests, and callsites behave exactly as today.

### Shared across both modes

- Copy button (clipboard write + stroke-draw check animation) — unchanged,
  `shrink-0`.
- Optional external/internal link rules (`isExternalUrl`, `target="_blank"` only
  for external) — unchanged, `shrink-0`.
- `size` variants (`text-xs`/`text-sm`, gaps, icon/button sizing) — unchanged.
- Copy always writes the **full** `text`, never the truncated view.

## Architecture

- One component; CVA + `forwardRef` as today. No new files in the package.
- The only structural change is the text-rendering branch:
  - fluid → render the two-span head/tail region (or single span for short text);
  - fixed → render `truncateMiddle(...)` as today.
- When `fluid` **and** `href`, the `<a>` wraps the two-span region and itself
  carries `flex min-w-0 overflow-hidden` so the link is the flex/clipping context.
- Outer `className` composition: `inline-flex` (fixed) vs `flex w-full` (fluid) is
  selected before merging consumer `className`, so a consumer `max-w-*` / `w-*`
  still wins via `tailwind-merge`.
- Consumer note (docs): in a flex parent, the parent must allow shrink
  (`min-w-0`) for fluid mode to narrow below content width — standard flexbox.

## Testing (additions to `copyable-text.test.tsx`)

- Fluid renders head (`text.slice(0,-endChars)`) and tail (`text.slice(-endChars)`)
  as separate text nodes.
- Fluid outer carries `flex` + `w-full`; fixed-mode outer stays `inline-flex`.
- Fluid sets `title={text}` on the text region.
- Fluid + short text (`text.length <= endChars`) → full text, single span, no split.
- Fluid still copies the **full** string on copy-button click.
- Fluid + external `href` wraps the head/tail region in the link with correct
  `target`/`rel`.
- Existing fixed-mode tests remain and continue to pass unchanged.

## Preview app

- Add a **Fluid** section to `apps/preview/src/app/components/copyable-text/page.tsx`
  with a resizable container (e.g., a `resize-x overflow-auto` wrapper, or a couple
  of fixed-width cards) so the reflow is visible. Include: a card, a table cell, and
  a narrow column to mirror the brainstorm demo.

## Files to create/modify

- `packages/ds/src/components/copyable-text/copyable-text.tsx` — add `fluid` prop +
  two-span render branch.
- `packages/ds/src/components/copyable-text/copyable-text.test.tsx` — fluid tests.
- `apps/preview/src/app/components/copyable-text/page.tsx` — fluid demo section.

## Docs to update on merge

- `docs/DESIGN-SYSTEM.md` — `fluid` prop + width-aware behavior.
- `docs/ARCHITECTURE.md` — two-span middle-truncation pattern (pure CSS), title-reveal note.
- `docs/DECISIONS.md` — Decision #98 (fluid CopyableText: fixed-tail two-span over JS-measured centered; native `title` reveal).
- `CLAUDE.md` — CopyableText feature line: add fluid/width-aware mode.
- `docs/BACKLOG.md` — move/close any related item; note deferred ideas (e.g., DS Tooltip reveal, JS-measured centered mode) if raised.

## Out of scope / deferred

- JS-measured **centered** middle truncation (approach A) — rejected for now to
  keep the component pure-CSS and dependency-free.
- DS Tooltip reveal (approach 2) — deferred; native `title` is the chosen reveal.
- A guaranteed minimum head length in fluid mode — native ellipsis handles the head
  collapse; no min-head guarantee.
