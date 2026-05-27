# Chunk 5 · Active-state recolor — Design

**Date:** 2026-05-27
**Wave:** 1 (chunks 4–7)
**Components:** Tabs, Breadcrumb
**Integration branch:** `skin/paraplu`
**Chunk branch:** `skin/active-state-recolor` (off `skin/paraplu`)
**Source spec:** `docs/superpowers/specs/2026-05-27-wave1-design.md` § 5

---

## 1 · Scope change from wave-1

The wave-1 spec listed Pagination under chunk 5 (§ 5.1). Pagination moved into chunk 4 mid-implementation. Chunk 5 now covers **Tabs + Breadcrumb only**.

The SKIN-PRINCIPLES § 8.3 amendment text shifts accordingly — Pagination drops out of the active-state list, but the principle stands.

---

## 2 · Problem

Both components signal "active" today with `text-primary-600 dark:text-primary-400` and `bg-primary-*`. Under the Abyssal Void skin, `--primary` is the brand action — Button's chassis colour. The wave's active-state language is `--accent` (cyan `#00E1FA` — "live / active / listening"). Active tabs, breadcrumb hover, and the current breadcrumb page all currently compete with Button Primary for visual weight.

Chunk 5 swaps every `primary-*` active/hover treatment in Tabs and Breadcrumb to `--accent`, plus three opportunistic alignment fixes:
- focus ring → Button outline pattern (Decision #82)
- disabled trigger drops `opacity-20` for semantic flatten (Decision #84 vocabulary)
- pill-variant active fill resolves the "is full cyan too loud?" question flagged in wave-1 § 5.2

---

## 3 · Decisions made in brainstorm

Four visual decisions resolved via the visual companion.

### 3.1 · Q1 — Pill variant active fill: tinted

The pill variant's selected fill becomes `bg-accent/15` + `text-accent` instead of solid `bg-accent` + dark text.

**Why:** A fully saturated cyan pill would be the loudest single cyan surface in the wave. Tinted carries "active" via cyan colour without committing the full pill area to brand saturation. Reads cohesive with the quieter Pagination outlined-chip treatment from chunk 4.

**Rejected:** Solid cyan fill (loudest, wave-1 spec default). Outlined chip — cyan border + transparent fill (would borrow Pagination's exact treatment, but a segmented control benefits from a fill cue more than a navigation chip).

### 3.2 · Q2 — Underline nudge: keep

The active trigger keeps its `-translate-y-0.5` lift above the sliding cyan bar.

**Why:** Position + colour both signal active. The nudge predates the recolor and reads as "this tab is selected and slightly raised"; with cyan replacing primary, the nudge becomes additive emphasis rather than the sole signal.

**Rejected:** Drop the nudge — let cyan colour + cyan bar do all the work.

### 3.3 · Q3 — Breadcrumb current page: full cyan

`BreadcrumbPage` becomes `text-accent` (no opacity).

**Why:** Consistent with the active-state vocabulary across Tabs and chunk 4's checkbox/radio/switch/slider. Cyan = "you are here". The current code's `text-neutral opacity-40` reads as "deprioritised", which is the opposite of what the current page is.

**Rejected:** Neutral text (let `aria-current` + last-position carry it — too implicit). Cyan dot prefix + neutral text (borrows from StatusDot vocabulary — dot reads as health/status not navigation).

### 3.4 · Q4 — Breadcrumb separator: foreground/25

Separator drops to `text-foreground/25` — quieter than today's `text-primary opacity-40`, and quieter than the direct-port option `text-foreground/40`.

**Why:** With the current page now cyan, the trail labels and separators want to recede so the cyan reads cleanly. 25% pushes the separator far enough back that the trail reads as "labels with whitespace" rather than "labels and dividers".

**Rejected:** `text-foreground/40` (direct port — fine but doesn't take advantage of the new cyan focal point). `text-edge` (too quiet — separator becomes nearly invisible).

---

## 4 · Tabs change tables

### 4.1 · TabsList — underline variant

| Today | Becomes |
|---|---|
| `border-b-2 border-edge/40` (sm) | unchanged |
| `border-b-4 border-edge/40` (md) | unchanged |
| sliding indicator `bg-primary-600 dark:bg-primary-400` | `bg-accent` |

Indicator stays a solid bar (no glow) per Direction C: text/slot indicators are flat cyan, not lit surfaces.

### 4.2 · TabsList — pill variant

| Today | Becomes |
|---|---|
| sliding indicator `bg-primary-600 dark:bg-primary-500` | `bg-accent/15` (Q1) |

Indicator background is the cyan tint that sits behind the active text. The pill list's own `bg-muted` track is unchanged.

### 4.3 · TabsTrigger

| Today | Becomes |
|---|---|
| `hover:text-primary-600 dark:hover:text-primary-400` | `hover:text-accent` |
| `data-[state=active]:text-primary-600 dark:data-[state=active]:text-primary-400` | `data-[state=active]:text-accent` |
| `data-[state=active]:-translate-y-0.5` | unchanged (Q2) |
| `disabled:opacity-20` | `disabled:text-foreground/30 disabled:cursor-not-allowed` |
| `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2` | `focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2` (drop the ring classes) |

Pill-variant overrides (`group-data-[variant=pill]:`):

| Today | Becomes |
|---|---|
| `group-data-[variant=pill]:text-muted-foreground` (rest) | unchanged |
| `group-data-[variant=pill]:hover:text-foreground` | `group-data-[variant=pill]:hover:text-accent` |
| `group-data-[variant=pill]:data-[state=active]:text-white` | `group-data-[variant=pill]:data-[state=active]:text-accent` |
| `group-data-[variant=pill]:focus-visible:ring-offset-0` | drop (outline pattern doesn't use ring-offset) |

### 4.4 · OverflowTrigger ("..." button + dropdown)

The `OverflowTrigger` mirrors `TabsTrigger`'s active-state colour and inherits the same focus pattern.

| Today | Becomes |
|---|---|
| `text-primary-600 dark:text-primary-400` (when active tab is overflowed, non-pill) | `text-accent` |
| `text-white` (when active tab is overflowed, pill) | `text-accent` |
| `hover:text-primary-600 dark:hover:text-primary-400` | `hover:text-accent` |
| `focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2` | `focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2` |

DropdownMenu items (hidden tab list):

| Today | Becomes |
|---|---|
| `text-primary-600 dark:text-primary-400 font-semibold` (active hidden tab) | `text-accent font-semibold` |
| `rounded-md` on Content | out of scope (chunk 6 — popover surfaces) |
| `shadow-brand` on Content | out of scope (chunk 6) |

---

## 5 · Breadcrumb change table

### 5.1 · BreadcrumbLink

| Today | Becomes |
|---|---|
| `hover:text-primary-600 dark:hover:text-primary-400` | `hover:text-accent` |

### 5.2 · BreadcrumbSeparator

| Today | Becomes |
|---|---|
| `text-primary opacity-40` | `text-foreground/25` (Q4) |

### 5.3 · BreadcrumbPage

| Today | Becomes |
|---|---|
| `text-neutral opacity-40` | `text-accent` (Q3) |

**Code-drift note:** wave-1 § 5.3 assumed `BreadcrumbPage` was `text-primary opacity-40`. The actual code reads `text-neutral opacity-40`. The wave-1 change-table entry was based on a snapshot that didn't match HEAD. The replacement value (`text-accent`) is unchanged; only the "from" column corrects.

---

## 6 · Out of scope

- DropdownMenu Content `rounded-md` and `shadow-brand` (chunk 6 — popover surfaces).
- Tabs pill `bg-muted` track — already skin-correct.
- Tabs underline border-b thickness (kept at 2/4) — chrome role distinct from hairline dividers; serves as the visual track the cyan indicator slides over.
- Pagination (moved to chunk 4).
- No new TabsList variants, no new Breadcrumb parts, no API changes.

---

## 7 · SKIN-PRINCIPLES amendment (after chunk 5 ships)

Per wave-1 § 8.3, add to § 2 Semantic color mapping under `--accent`:

> Selected / checked / active states on form controls and navigation (Switch, Slider, Checkbox, Radio, active Tab, active Breadcrumb, ProgressBar) use `--accent`. Primary's chassis role (Button only) is preserved.

(Pagination drops from this list — its outlined-chip treatment lives in chunk 4's decision entry.)

---

## 8 · Decision to log

**Decision #86 — Chunk 5 (active-state recolor):**
- Tabs + Breadcrumb swap `primary-*` to `--accent` on active and hover.
- Pill-variant active fill: `bg-accent/15` tinted (rejected: solid cyan; outlined chip).
- Underline nudge: kept (rejected: drop nudge).
- Breadcrumb current page: `text-accent` (rejected: neutral; cyan dot prefix).
- Breadcrumb separator: `text-foreground/25` (rejected: `foreground/40` direct port; `text-edge` hairline).
- Tabs disabled trigger drops `opacity-20` for `text-foreground/30 cursor-not-allowed` (aligns with Decision #84 vocabulary — no opacity tricks, semantic flatten).
- Tabs focus aligns with Button outline pattern: `outline-2 outline-accent outline-offset-2` (Decision #82).

---

## 9 · Risks and notes

- **Pill-tinted fill at 15% in light mode.** The cyan tint sits on the pill list's `bg-muted` track. In dark mode `bg-muted` is dark, and `bg-accent/15` reads as a soft cyan glow over it. In light mode `bg-muted` is near-white, and the same 15% tint may read closer to white-with-cyan-hue than to "this is selected". Light-mode visual review is mandatory during implementation; fallback is bumping to `bg-accent/20` or `bg-accent/25` per-mode.
- **Separator at 25% opacity.** `BreadcrumbSeparator` is decorative (`aria-hidden="true"`), so WCAG non-text contrast doesn't apply. Verify the `/` glyph still reads at 12px on light mode.
- **OverflowTrigger pill active state.** Currently `text-white` sits against the now-tinted pill background — needs to swap to `text-accent` to stay legible (white on tinted cyan would lose contrast).

---

## 10 · Files touched

| File | Change |
|---|---|
| `packages/ds/src/components/tabs/tabs.tsx` | TabsList indicator (both variants), TabsTrigger (incl. pill overrides), OverflowTrigger, DropdownMenu item active |
| `packages/ds/src/components/breadcrumb/breadcrumb.tsx` | BreadcrumbLink hover, BreadcrumbSeparator, BreadcrumbPage |
| `packages/ds/src/components/tabs/tabs.test.tsx` | No expected change — tests should pass; only class strings change |
| `packages/ds/src/components/breadcrumb/breadcrumb.test.tsx` | Same |
| `apps/preview/src/app/components/tabs/page.tsx` | Visual verification only — no source change expected |
| `apps/preview/src/app/components/breadcrumb/page.tsx` | Visual verification only — no source change expected |
| `docs/SKIN-PRINCIPLES.md` | § 2 amendment per § 7 above |
| `docs/DESIGN-SYSTEM.md` | Refresh Tabs + Breadcrumb entries |
| `docs/DECISIONS.md` | Append Decision #86 |
| `docs/BACKLOG.md` | Move chunk-5 backlog item to Completed |
| `CLAUDE.md` | Update Current Features for Tabs + Breadcrumb |
