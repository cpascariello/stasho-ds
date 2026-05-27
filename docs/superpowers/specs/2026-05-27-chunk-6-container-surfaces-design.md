# Chunk 6 — Container surfaces design

**Date:** 2026-05-27
**Integration branch:** `skin/paraplu`
**Chunk branch (planned):** `skin/container-surfaces`
**PR target:** `skin/paraplu`

**Scope (expanded from wave-1):** Card, Dialog, Tooltip, **plus** the popover Content surfaces inside Select, Combobox, MultiSelect, and the Tabs overflow DropdownMenu. Wave-1 framed chunk 6 as "Card + Dialog + Tooltip, mostly audit." Brainstorm expanded scope to include every popover/overlay surface in the DS so the popover identity is locked across the system rather than left as four scattered class incantations.

**Through-line:** Container chrome stops borrowing brand color. Drop shadows lose their primary-blue tint; popovers share one token; Tooltip joins the popover family; Dialog earns a single surface-scale LED signature (cyan top-rail).

---

## 1 · Problem

After chunks 1–5 land, the only remaining brand-color leak is in **elevations and floating surfaces**:

1. **Blue-tinted shadows.** `--shadow-brand-sm/-/lg` resolve to `oklch(0.27 0.180 264 / X)` — primary-blue glows under every popover and Dialog. SKIN-PRINCIPLES § 2 reserves `--primary` for Button chassis; ambient blue shadows on every overlay are the same role-leak the wave has been fixing in foregrounds.
2. **Tooltip out of sync.** Today's Tooltip is `bg-neutral-900 dark:bg-base-800 rounded-lg text-white shadow-brand-sm` — pre-Abyssal vocabulary. Chunk 4 (Slider tooltip) established the popover token `bg-surface border-edge rounded-none text-foreground` but the Tooltip component never adopted it.
3. **Popover surface defined as a three-class incantation.** Select, Combobox, MultiSelect, and Tabs overflow each ship `bg-surface border border-edge shadow-brand` inline. No shared token, no single source of truth. When the popover identity shifts, all four drift independently.
4. **Dialog has no skin identity.** Today's Dialog is a flat `bg-surface` block with a pre-skin focus ring on the close button. It looks like any modal in any DS; nothing about it says "Abyssal."
5. **Popover items still on legacy disabled pattern.** All four dropdown components use `data-[disabled]:opacity-50 data-[disabled]:pointer-events-none` on items — the same legacy block chunk 3 and chunk 4 have already removed from triggers.

---

## 2 · Foundation

### 2.1 · Shadow tokens — neutralized

Rename + retune the three shadow tokens so elevations stop carrying brand color:

| Old | New | Value |
|-----|-----|-------|
| `--shadow-brand-sm` | `--shadow-sm` | `0 2px 4px rgba(0,0,0,0.10)` |
| `--shadow-brand` | `--shadow` | `0 4px 16px rgba(0,0,0,0.20)` |
| `--shadow-brand-lg` | `--shadow-lg` | `0 24px 60px rgba(0,0,0,0.65)` |

Same-hex rule extends naturally — black is black in both modes. Used by:
- `shadow-lg` on `DialogContent`
- `shadow` on every popover dropdown Content (Select, Combobox, MultiSelect, Tabs overflow)
- `shadow-sm` on Tooltip
- Card uses no shadow (unchanged)

The old `shadow-brand-*` Tailwind utility classes are removed from `tokens.css`. No backwards-compatible aliases.

### 2.2 · Popover surface token

Promote the popover surface from three scattered classes to one CSS variable group:

```css
--popover-bg: var(--surface);
--popover-border: var(--edge);
/* radius stays inline (0px popovers per § 4, 4px modals) — no --popover-radius token */
```

These map to Tailwind utilities via the Layer 3 bridge:

```css
--color-popover-bg: var(--popover-bg);
--color-popover-border: var(--popover-border);
```

So consumers write `bg-popover-bg` / `border-popover-border` — the existing semantic-class pattern from chunks 3/4.

The 1px hairline-on-surface combination remains, but now it's named. Re-themes can shift popover identity from one place.

### 2.3 · Disabled-item alignment

All four dropdown components currently use:
```
"data-[disabled]:opacity-50 data-[disabled]:pointer-events-none"
```

Aligned with Decision #84 (text inputs) and Decision #85 (boolean/range):
```
"data-[disabled]:text-foreground/30 data-[disabled]:cursor-not-allowed"
```

Radix's native disabled attribute already blocks interaction; `pointer-events-none` blocks the cursor hint. `text-foreground/30` is the semantic "broken" signal.

---

## 3 · Sub-decisions

### 3.1 · Q1 — Tooltip personality? **Match popover token.**

Tooltip joins the popover family: `bg-popover-bg border border-popover-border rounded-none text-foreground shadow-sm`. Tokenization wins over a one-off "transient indicator" inverted-contrast variant. If at implementation the bubble reads too quiet against Card surfaces, we tighten the `--popover` token globally rather than fork.

### 3.2 · Q2 — Dialog identity? **Cyan top-rail.**

Dialog earns a single brand signature: a 2px `--accent` top border with outer cyan glow on the modal surface. Reads as "this surface is listening / awaiting input" at modal scale, using the same LED-as-signature vocabulary as Button (the LED) and ProgressBar (the active-fill glow). Popover dropdowns and Card do NOT get the rail — only interrupting surfaces (modals) earn it.

Alternative considered: full instrument-header bevel under DialogTitle (Direction C in brainstorm). Rejected — breaks Dialogs without titles (Alert-style modals) and the bevel-everywhere risks heavy.

### 3.3 · Q3 — Dialog overlay? **Stays neutral (per wave-1 Q3).**

`bg-black/60 backdrop-blur-sm` unchanged. Wave-1 sub-decision still holds: the skin's energy lives inside the dialog, not in the dimming layer.

### 3.4 · Q4 — Card scope? **Surgical.**

Card is already skin-correct. Only the radius shifts from arbitrary `rounded-[2px]` to semantic `rounded-sm`. No interactive Card variant added; no `outlined` variant added. The `ghost` variant covers no-fill needs; one-off outline use can be applied inline.

---

## 4 · Card

**Today:**

```ts
const cardVariants = cva("rounded-[2px]", {
  variants: {
    variant: {
      default: "bg-surface text-surface-foreground",
      ghost: "bg-transparent",
    },
    padding: { sm: "p-4", md: "p-6", lg: "p-8" },
  },
});
```

**Changes:** `rounded-[2px]` → `rounded-sm`. That's it. Padding, variants, title prop unchanged. The `font-heading font-bold text-lg` Card title stays Anybody Bold (section-heading role per Decision #83).

---

## 5 · Dialog

**Today's `DialogContent` chassis:**

```ts
"relative w-full max-w-md rounded-[4px] bg-surface p-6 shadow-brand-lg"
```

**New chassis:**

```ts
"relative w-full max-w-md rounded-md bg-surface p-6 shadow-lg",
"border-t-2 border-t-accent",
"shadow-[0_24px_60px_rgba(0,0,0,0.65),0_0_8px_rgba(0,225,250,0.5)]"
```

The compound `shadow-[]` arbitrary value carries both the neutral drop and the cyan glow at the same time. The drop component is the new `--shadow-lg` value (`0 24px 60px rgba(0,0,0,0.65)`); the second component is the outer cyan glow that reads from the top-rail. Cyan glow uses the existing same-hex value `rgba(0,225,250, ...)` already standard across the wave.

`motion-reduce:` rules unchanged — the glow is static, doesn't animate.

**Close button — focus chrome:**

```ts
// today
"focus-visible:outline-none focus-visible:ring-2",
"focus-visible:ring-primary-400 focus-visible:ring-offset-2",
// new
"focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
```

Matches Button focus pattern (Decision #80) and switch/slider track focus (Decision #85). Rest + hover states unchanged.

**Overlay, animations, locked prop, Title, Description, Header, Footer:** unchanged.

**Other:** `rounded-[4px]` becomes `rounded-md` — same 4px, semantic class name.

---

## 6 · Tooltip

**Today's `TooltipContent`:**

```ts
"z-50 rounded-lg bg-neutral-900 dark:bg-base-800 px-3 py-1.5",
"text-sm text-white shadow-brand-sm",
"animate-in fade-in-0 zoom-in-95",
"data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
"data-[state=closed]:zoom-out-95",
"motion-reduce:animate-none"
```

**New:**

```ts
"z-50 rounded-none bg-popover-bg border border-popover-border px-3 py-1.5",
"text-sm text-foreground shadow-sm",
"animate-in fade-in-0 zoom-in-95",
"data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
"data-[state=closed]:zoom-out-95",
"motion-reduce:animate-none"
```

Five token swaps, no structural change. `sideOffset` default of 6 unchanged.

---

## 7 · Popover dropdowns (Select, Combobox, MultiSelect, Tabs overflow)

### 7.1 · Content surface

All four popover Content elements share one new class block:

```ts
// today (Select, Combobox, MultiSelect, Tabs overflow DropdownMenu Content)
"bg-surface border border-edge shadow-brand"
"rounded-none"

// new
"bg-popover-bg border border-popover-border shadow"
"rounded-none"
```

Width/positioning utilities (`w-[var(--radix-popover-trigger-width)]`, `sideOffset`, `align`, `position="popper"`) are preserved per component.

### 7.2 · Items

| Component | Today's disabled rule | New |
|-----------|----------------------|-----|
| Select | `data-[disabled]:opacity-50 data-[disabled]:pointer-events-none` | `data-[disabled]:text-foreground/30 data-[disabled]:cursor-not-allowed` |
| Combobox (cmdk) | `data-[disabled=true]:opacity-50 data-[disabled=true]:pointer-events-none` | `data-[disabled=true]:text-foreground/30 data-[disabled=true]:cursor-not-allowed` |
| MultiSelect (cmdk) | same as Combobox | same fix |
| Tabs overflow DropdownMenu Item | check + align if uses opacity-50 | align to `text-foreground/30 cursor-not-allowed` |

Highlighted-item rule (`data-[highlighted]:bg-muted` for Select, `data-[selected=true]:bg-muted` for cmdk) is unchanged — already calm and correct.

### 7.3 · Combobox / MultiSelect search input

The `Command.Input` already uses `border-b border-edge bg-transparent` — already skin-correct, unchanged.

---

## 8 · SKIN-PRINCIPLES amendments

### 8.1 · § 6 — new sub-section "Elevation is neutral"

```markdown
### Elevation is neutral
**Rule:** Drop shadows on floating surfaces (Dialog, Tooltip, popover dropdowns) use plain `rgba(0,0,0,X)` — never brand-tinted.
**Why:** The skin's brand color lives in foregrounds (LEDs, halos, active states), not in elevations. Blue-tinted shadows on every popover compete with Button's brand identity and read as "branded chrome" rather than "thing floating in space." Same principle that pushed cyan out of focus chrome on text inputs (Decision #84) — elevations get the same treatment.
**How:** `--shadow-sm / --shadow / --shadow-lg` tokens use neutral black at varying opacity + blur. Old `--shadow-brand-*` tokens are removed; consumers migrate to the renamed utilities.
**Source:** Decision #87.
```

### 8.2 · § 6 — new sub-section "Cyan top-rail = live surface"

```markdown
### Cyan top-rail = live surface
**Rule:** Modal Dialog surfaces carry a 2px `--accent` top border with outer cyan glow as the surface-scale LED-as-signature. Popovers and Card do NOT get the rail.
**Why:** Dialog interrupts the user's flow with a "do this now" surface — the cyan rail reads as "this surface is listening." Popover dropdowns are auxiliary chrome, not interruptions, so they stay calm. Card is a passive container.
**How:** `border-t-2 border-t-accent` + `box-shadow: 0 0 8px rgba(0,225,250,0.5)` on the top edge of Dialog content. Same cyan, smaller dose than Button halo.
**Source:** Decision #87.
```

### 8.3 · § 4 — amend Geometry block

Append: "Popovers (Tooltip + dropdown Contents) use `rounded-none` (0px) per the 0/0/2/4 vocabulary. Modals (Dialog) use `rounded-md` (4px). Cards use `rounded-sm` (2px). Tooltip is a popover, not a card — the radius reflects its role."

---

## 9 · Decision to log

**Decision #87 — Chunk 6 (container surfaces):**
- Shadow tokens renamed + neutralized (`--shadow-brand-*` → `--shadow-*`, blue tint dropped, plain `rgba(0,0,0,X)` at three elevations).
- Popover surface promoted to token (`--popover-bg`, `--popover-border`) used by Tooltip + Select/Combobox/MultiSelect/Tabs overflow.
- Tooltip fully reskinned to popover token (was `bg-neutral-900 dark:bg-base-800 rounded-lg text-white shadow-brand-sm`).
- Dialog earns a cyan top-rail (`border-t-2 border-t-accent` + outer cyan glow) as surface-scale LED signature.
- Dialog close button focus aligned to Button pattern (`outline-2 outline-accent outline-offset-2`).
- All four popover dropdowns' item disabled rule aligned to Decision #84 pattern (`text-foreground/30 cursor-not-allowed`, drops `opacity-50 pointer-events-none`).
- Card radius shifts from arbitrary `rounded-[2px]` to semantic `rounded-sm`.
- SKIN-PRINCIPLES § 6 gains two new sub-sections ("Elevation is neutral", "Cyan top-rail = live surface"); § 4 Geometry block amended.

---

## 10 · Out of scope

- No new Card variants (no interactive `hoverable`, no `outlined`). Future BACKLOG if needed.
- No new Dialog sizes (`max-w-md` etc. unchanged).
- No Tooltip arrow restyling (Radix arrow component unused; if a future request lands, it gets the popover token treatment).
- No Slider tooltip re-touch (already at the popover token via chunk 4).
- No Alert touches (already Abyssal styled).
- Popover Content widths, positioning, `sideOffset`, `align` unchanged per component.
- Combobox/MultiSelect `Command.Input` unchanged (already correct).
- The Tabs underline indicator and pill background recolor are chunk 5 territory, not chunk 6.

---

## 11 · Risks and implementation notes

1. **Tailwind 4 scanner for compound `shadow-[]`** — `shadow-[0_24px_60px_rgba(0,0,0,0.65),0_0_8px_rgba(0,225,250,0.5)]` is a single arbitrary value with two comma-separated shadows. Verify the scanner picks it up; if not, decompose to a CSS variable or fall back to inline style on `DialogContent`.
2. **`shadow-brand-*` consumers outside chunk 6** — grep before removing the tokens. If any non-chunk-6 component still uses them, update inline as a no-op chassis touch in the chunk 6 PR.
3. **Tooltip + Slider tooltip alignment** — chunk 4 established `bg-surface border border-edge rounded-none text-foreground` inline on the Slider tooltip. Chunk 6's `--popover-bg` token resolves to the same value. Verify no visual drift; if exact tokens differ, the Slider tooltip gets a one-line follow-up touch to use `bg-popover-bg` too.
4. **Dialog cyan glow at light-mode visual budget** — the cyan glow (`rgba(0,225,250,0.5)` at 8px) is calibrated for dark mode. On light backgrounds the glow may read different. Visual check during implementation; if glow disappears against light, bump opacity to 0.7 or thicken to 12px.
5. **Card title typography decision** — Decision #83 reserved Anybody for "headings only." Card title via the `title` prop is a section heading within the card body, which falls under the heading umbrella. If implementation review surfaces inconsistency between Card title and other in-card text styling, that's a separate scope (typography sweep #2), not chunk 6.

---

## 12 · Spec → plan handoff

After this spec is committed:

1. `writing-plans` writes `docs/superpowers/plans/2026-05-27-chunk-6-container-surfaces.md` — full task-by-task implementation plan for chunk 6.
2. The plan branches off `skin/paraplu` to `skin/container-surfaces`, ships to `skin/paraplu` via PR.
3. The spec is frozen at this point. If a later review pass overrides a sub-decision (e.g., the cyan rail reads too loud at light-mode), the override lands in `DECISIONS.md` and the chunk's own spec carries the note — this spec doesn't get edited.
