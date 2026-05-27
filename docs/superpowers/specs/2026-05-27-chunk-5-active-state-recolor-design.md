# Chunk 5 · Active-state recolor + TabsList chrome polish — Design

**Date:** 2026-05-27
**Wave:** 1 (chunks 4–7)
**Components:** Tabs, Breadcrumb
**Integration branch:** `skin/paraplu`
**Chunk branch:** `skin/active-state-recolor` (off `skin/paraplu`)
**Source spec:** `docs/superpowers/specs/2026-05-27-wave1-design.md` § 5

---

## 1 · Scope changes from wave-1

Wave-1 § 5 listed Pagination under chunk 5. Pagination moved into chunk-4 conversation, didn't ship with chunk-4 PR, and is now scheduled as its own short chunk (`skin/pagination-recolor`) after chunk 5. Wave-1 spec for Pagination (§ 5.1) stands as the design source — no re-brainstorm needed.

Wave-1 § 5 marked TabsList chrome (underline border-b thickness, pill list `bg-muted`) as "skin-correct, leave alone". Brainstorming for chunk 5 reopened both as in-scope:
- **Underline border-b at 2px (sm) / 4px (md)** violates SKIN-PRINCIPLES § 4 "1px hairlines, never thick"
- **Pill list with `bg-muted` and no border** misses the chunk-4 Decision #84 chrome vocabulary (1px `--edge` hairline for slot surfaces)
- **`rounded-full` on pill list + pill triggers** sits on the SKIN-PRINCIPLES § 4 reserved-list exception "Tabs pill variant (segmented control is pill-shaped by convention)" — re-litigated and removed

Chunk 5 now covers **Tabs (cyan recolor + chrome polish) + Breadcrumb (cyan recolor)**.

---

## 2 · Problem

Tabs and Breadcrumb today signal "active" with `text-primary-600 dark:text-primary-400` and `bg-primary-*`. Under Abyssal Void, `--primary` is the brand action (Button chassis). The wave's active-state language is `--accent` (cyan `#00E1FA`).

Separately, TabsList's chrome predates the strict 0/0/2/4 + hairline-only geometry rules from Decisions #78 + #82 + #84. The underline border-b is at thick chrome scale, the pill list misses the chunk-4 hairline vocabulary, and the pill list + triggers carry `rounded-full` that the broader skin doesn't justify.

Chunk 5 does five things:

1. Recolor every `primary-*` active/hover treatment in Tabs and Breadcrumb to `--accent`
2. Align Tabs focus to the Button outline pattern (Decision #82)
3. Align Tabs disabled to the semantic flatten (Decision #84 vocabulary)
4. Thin the TabsList underline to 1px hairline (track + indicator)
5. Reshape the TabsList pill to `rounded-[2px]` + add the chunk-4 hairline border vocabulary

Plus the pill-variant active fill question (full / outlined / tinted) resolves to tinted per § 3.1.

---

## 3 · Decisions made in brainstorm

Six visual decisions resolved via the visual companion.

### 3.1 · Q1 — Pill variant active fill: tinted

Pill sliding indicator becomes `bg-accent/15` instead of solid `bg-accent`. Active trigger text becomes `text-accent` (replaces `text-white`).

**Why:** Cyan-saturated full fill would make the pill the loudest single cyan surface in the wave. Tinted carries "active" via colour without committing the pill area to brand saturation.

**Rejected:** Solid cyan fill (wave-1 spec default — too loud). Outlined chip mirroring the Pagination chunk-4 treatment (segmented control benefits from a fill cue more than a navigation chip does).

### 3.2 · Q2 — Underline nudge: keep

Active trigger keeps `-translate-y-0.5` above the cyan sliding bar.

**Why:** Position + colour both signal active. Nudge becomes additive emphasis rather than the sole signal.

**Rejected:** Drop the nudge (colour alone is enough but the second cue improves the active read).

### 3.3 · Q3 — Breadcrumb current page: full cyan

`BreadcrumbPage` becomes `text-accent` (no opacity).

**Why:** Consistent with active-state vocabulary across Tabs and chunk 4 controls. The current `text-neutral opacity-40` reads as "deprioritised" — the opposite of what the current page is.

**Rejected:** Neutral text (let `aria-current` + last-position carry it — too implicit). Cyan dot prefix + neutral text (borrows StatusDot vocabulary; dot reads as health/status not navigation).

### 3.4 · Q4 — Breadcrumb separator: foreground/25

Separator drops to `text-foreground/25` — quieter than today's `text-primary opacity-40` and quieter than the direct-port `text-foreground/40`.

**Why:** With the current page now cyan, separators want to recede so the cyan reads cleanly.

**Rejected:** `text-foreground/40` (direct port — fine but doesn't yield to the new cyan focal point). `text-edge` (too quiet — nearly invisible).

### 3.5 · Q5 — Underline track + indicator thickness: full hairline

Underline `border-b-2 / border-b-4` (sm / md) collapses to `border-b` (1px both sizes). Indicator `h-0.5 / h-1` collapses to `h-px` (1px both sizes). The bottom-offset of the indicator collapses correspondingly to `-bottom-px`.

**Why:** SKIN-PRINCIPLES § 4 says "1px hairlines, never thick". The existing 4px chrome was a pre-Abyssal carve-out. With cyan now carrying the active signal, the track + indicator can both honour the hairline rule without losing the slide-between-tabs read.

**Rejected:** Hairline track + 2px indicator (good middle ground but the 1px indicator reads cleanly with the cyan colour doing the lifting; less is more).

### 3.6 · Q6 — Pill list + trigger shape: rounded-[2px] + add hairline border

Pill list moves from `rounded-full bg-muted` (no border) to `rounded-[2px] bg-muted border border-edge`. Pill triggers and the pill sliding indicator both move from `rounded-full` to `rounded-[2px]`.

**Why:** Two principles converge. **(a) SKIN-PRINCIPLES § 4 hairline rule:** the chunk-4 chrome vocabulary established `border border-edge` as the "slot" framing — text inputs, dropdowns, and now segmented controls all read as defined surfaces rather than tinted blobs. **(b) SKIN-PRINCIPLES § 4 round-by-design:** "pill segmented control by convention" was the only entry on the round-by-design list that wasn't actually round-by-design. Convention is not a skin principle. Dropping it commits the skin to its 0/0/2/4 ladder.

`rounded-[2px]` (Card grade) chosen over `rounded-none` (committed brutalist) because the 2px softening matches Card and Dialog — "a defined container, not a slab". Pure square corners would compete with the trigger text for the eye's "this is a UI element" signal.

**Rejected:** Keep `rounded-full` (today — fails the principle test; the "convention" justification doesn't survive scrutiny in a brutalist skin). `rounded-none` (sharper but loses Card-grade softening; the chunk-4 inputs use 0 radius so reserving Card's 2px for "this is a contained group" gives the skin a useful visual ladder).

**Cascade:** This decision removes "Tabs pill variant" from the SKIN-PRINCIPLES § 4 round-by-design reserved list. Three other entries on that list share the same convention-only justification and should be revisited:
- **Switch track** (already shipped in chunk 4 — handled as part of the rounded-full audit follow-up, **not** this chunk)
- **MultiSelect tag chips** (chunk 6+ territory)
- **Stepper indicators** (chunk 7 — could be addressed when chunk 7 spec is written)

This chunk doesn't touch those components. The amendment is logged as a follow-up under Decision #86's "cascade" note.

---

## 4 · Tabs change tables

### 4.1 · TabsList — underline variant

| Today | Becomes |
|---|---|
| `border-b-2 border-edge/40` (sm) | `border-b border-edge/40` |
| `border-b-4 border-edge/40` (md) | `border-b border-edge/40` |
| sliding indicator `-bottom-0.5 h-0.5 bg-primary-600 dark:bg-primary-400` (sm) | `-bottom-px h-px bg-accent` |
| sliding indicator `-bottom-1 h-1 bg-primary-600 dark:bg-primary-400` (md) | `-bottom-px h-px bg-accent` |

Both sizes converge on a 1px hairline track + 1px cyan indicator (Q5). Indicator stays a solid bar (no glow) per Direction C: text/slot indicators are flat cyan.

### 4.2 · TabsList — pill variant

| Today | Becomes |
|---|---|
| `rounded-full bg-muted` (list shape + fill) | `rounded-[2px] bg-muted border border-edge` (Q6) |
| `p-0.5` (sm) / `p-1` (md) | unchanged |
| sliding indicator `rounded-full bg-primary-600 dark:bg-primary-500` | `rounded-[2px] bg-accent/15` (Q1 + Q6) |
| sliding indicator `inset-y-0.5` (sm) / `inset-y-1` (md) | unchanged |

Pill list gets the chunk-4 hairline border vocabulary. Shape moves to Card grade. The `bg-muted` track is preserved — it still defines the segmented-control region.

### 4.3 · TabsTrigger

Non-pill (underline-relevant) classes:

| Today | Becomes |
|---|---|
| `hover:text-primary-600 dark:hover:text-primary-400` | `hover:text-accent` |
| `data-[state=active]:text-primary-600 dark:data-[state=active]:text-primary-400` | `data-[state=active]:text-accent` |
| `data-[state=active]:-translate-y-0.5` | unchanged (Q2) |
| `disabled:opacity-20` | `disabled:text-foreground/30 disabled:cursor-not-allowed` |
| `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2` | `focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2` (drop ring + outline-none) |

Pill-variant overrides:

| Today | Becomes |
|---|---|
| `group-data-[variant=pill]:rounded-full` | `group-data-[variant=pill]:rounded-[2px]` (Q6) |
| `group-data-[variant=pill]:text-muted-foreground` (rest) | unchanged |
| `group-data-[variant=pill]:hover:text-foreground` | `group-data-[variant=pill]:hover:text-accent` |
| `group-data-[variant=pill]:data-[state=active]:text-white` | `group-data-[variant=pill]:data-[state=active]:text-accent` |
| `group-data-[variant=pill]:focus-visible:ring-offset-0` | drop (outline pattern doesn't use ring-offset) |

### 4.4 · OverflowTrigger ("..." button + dropdown)

| Today | Becomes |
|---|---|
| `text-primary-600 dark:text-primary-400` (active hidden, non-pill) | `text-accent` |
| `text-white` (active hidden, pill) | `text-accent` (collapses the pill carve-out) |
| `hover:text-primary-600 dark:hover:text-primary-400` | `hover:text-accent` |
| `focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2` | `focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2` |

The OverflowTrigger inherits the same pill-variant `rounded-full` → `rounded-[2px]` (it's inside the pill list and matches the trigger shape). Specifically: `relative z-10 rounded-full` → `relative z-10 rounded-[2px]` on the pill branch of the ternary.

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

(Wave-1 § 5.3 assumed `text-primary opacity-40` here — code drifted at some point. New value is the same regardless.)

---

## 6 · Out of scope

- DropdownMenu Content `rounded-md` + `shadow-brand` — chunk 6 (popover surfaces).
- Switch track `rounded-full` — see Cascade in § 3.6. Handled as part of the rounded-full audit follow-up.
- MultiSelect tag chips `rounded-full` — Cascade. Chunks 6+.
- Stepper indicators `rounded-full` — Cascade. Chunk 7.
- Pagination — its own chunk (`skin/pagination-recolor`).
- No new TabsList variants, no new Breadcrumb parts, no API changes.

---

## 7 · SKIN-PRINCIPLES amendments (after chunk 5 ships)

### 7.1 · § 2 — Active states

Per wave-1 § 8.3, add to § 2 Semantic color mapping under `--accent`:

> Selected / checked / active states on form controls and navigation (Switch, Slider, Checkbox, Radio, active Tab, active Breadcrumb, ProgressBar) use `--accent`. Primary's chassis role (Button only) is preserved.

(Pagination removed from this list — its outlined-chip treatment lives in chunk-4-followup territory.)

### 7.2 · § 4 — Round-by-design list

Remove **"Tabs pill variant (segmented control is pill-shaped by convention)"** from the rounded-full reserved list. Add a note that "by convention" alone is not sufficient justification for an exception — the rule is "round-by-design", not "round-by-precedent".

Flag (to be acted on by follow-up chunks):
- Switch track — same convention-only justification, needs the same audit
- MultiSelect tag chips — same
- Stepper indicators — same

---

## 8 · Decision to log

**Decision #86 — Chunk 5 (active-state recolor + TabsList chrome polish):**

- Tabs + Breadcrumb swap `primary-*` to `--accent` on active and hover.
- Pill-variant active fill: `bg-accent/15` tinted (rejected: solid cyan; outlined chip).
- Underline nudge: kept (rejected: drop nudge).
- Breadcrumb current page: `text-accent` (rejected: neutral; cyan dot prefix).
- Breadcrumb separator: `text-foreground/25` (rejected: `foreground/40`; `text-edge`).
- Tabs disabled trigger drops `opacity-20` for `text-foreground/30 cursor-not-allowed` (Decision #84 vocabulary).
- Tabs focus aligns with Button outline pattern: `outline-2 outline-accent outline-offset-2` (Decision #82).
- **Underline track + indicator collapse to 1px hairline** (sm + md both become `border-b border-edge/40` + `-bottom-px h-px bg-accent`) — rejected: hairline track + 2px indicator (middle ground).
- **Pill list adds 1px `border-edge` hairline** + moves from `rounded-full` to `rounded-[2px]` (Card grade) — applied to list, indicator, and pill-variant trigger override. SKIN-PRINCIPLES § 4 amendment removes Tabs pill from the round-by-design reserved list. Rejected: keep `rounded-full` (convention is not a skin principle); `rounded-none` (loses the Card-grade "this is a contained group" softening).

**Cascade flagged for follow-up:** Switch track, MultiSelect tag chips, Stepper indicators carry the same convention-only `rounded-full` justification. A dedicated "rounded-full audit" chunk should revisit all three after chunk 5 ships, with a SKIN-PRINCIPLES § 4 amendment principle ("round-by-design only, never round-by-convention").

---

## 9 · Risks and notes

- **Pill-tinted fill at 15% in light mode.** Cyan tint sits on `bg-muted`. In light mode `bg-muted` is near-white; `bg-accent/15` may read closer to white-with-cyan-hue than to "this is selected". Light-mode visual review is mandatory; fallback is bumping to `bg-accent/20` or `bg-accent/25` per-mode.
- **Underline 1px indicator visibility.** A 1px cyan bar is meaningfully quieter than the prior 4px. The active trigger's `-translate-y-0.5` (2px) nudge and `text-accent` colour carry most of the active signal — the bar becomes a supporting cue rather than the dominant one. If the indicator disappears against complex backgrounds during visual review, fallback is bumping back to 2px (`-bottom-0.5 h-0.5`).
- **Pill list at `rounded-[2px]`.** The Card-grade radius on the list may look "boxy" compared to the rounded-full pattern users are familiar with from iOS/Linear/Notion. This is the point — Abyssal Void is committed to its geometry, not to convention. Visual review should confirm the read is "instrument switch panel", not "broken pill control".
- **Separator at 25% opacity.** `BreadcrumbSeparator` is decorative (`aria-hidden="true"`); WCAG non-text contrast doesn't apply. Verify legibility at 12px on light mode.
- **OverflowTrigger pill active state.** Previously `text-white` on the solid primary pill background; now `text-accent` on the tinted pill background. Cyan-on-cyan-tint may have lower contrast — visual review should confirm.

---

## 10 · Files touched

| File | Change |
|---|---|
| `packages/ds/src/components/tabs/tabs.tsx` | TabsList (both variants — underline thickness, pill chrome + shape), TabsTrigger (incl. pill overrides), OverflowTrigger, DropdownMenu item active |
| `packages/ds/src/components/breadcrumb/breadcrumb.tsx` | BreadcrumbLink hover, BreadcrumbSeparator, BreadcrumbPage |
| `packages/ds/src/components/tabs/tabs.test.tsx` | No expected change — tests should pass; only class strings change |
| `packages/ds/src/components/breadcrumb/breadcrumb.test.tsx` | Same |
| `apps/preview/src/app/components/tabs/page.tsx` | Visual verification only — no source change expected |
| `apps/preview/src/app/components/breadcrumb/page.tsx` | Visual verification only — no source change expected |
| `docs/SKIN-PRINCIPLES.md` | § 2 amendment + § 4 amendment per § 7 above |
| `docs/DESIGN-SYSTEM.md` | Refresh Tabs + Breadcrumb entries |
| `docs/DECISIONS.md` | Append Decision #86 |
| `docs/BACKLOG.md` | Move chunk-5 item to Completed; add "rounded-full audit" follow-up; add "Pagination recolor" follow-up |
| `CLAUDE.md` | Update Current Features for Tabs + Breadcrumb |
