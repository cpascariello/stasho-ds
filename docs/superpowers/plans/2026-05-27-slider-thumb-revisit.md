# Slider thumb revisit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the solid cyan disc Slider thumb with a 1.5px cyan ring (aperture) on a `bg-background` interior, shrink sizes from md=20 / sm=16 to md=14 / sm=12, and adopt fill-on-hover as a documented carve-out from the wave's "hover intensifies, doesn't repaint" rule.

**Architecture:** Two layers of change — (a) a `thumbVariants` CVA rewrite in `slider.tsx` (chassis class, sizes, hover fill, error hover fill) plus the existing `error` conditional gaining `hover:bg-error`, and (b) doc updates capturing the principled justification for keeping `rounded-full` on the thumb and the Slider-specific carve-out from § 5 "hover intensifies, doesn't repaint". No new tokens, no new component variants, no API change.

**Tech Stack:** Tailwind CSS 4 with `@theme`, CVA (class-variance-authority), Radix UI Slider primitive (Thumb / Range rendered as `<span>` → `data-[disabled]:*` variants), Vitest + Testing Library, oxlint, TypeScript.

**Spec:** `docs/superpowers/specs/2026-05-27-slider-thumb-revisit-design.md`

**Integration branch:** `skin/paraplu`. This chunk lives on `skin/slider-thumb-revisit` (created off `skin/paraplu` at Task 1), PRs into `skin/paraplu`, and squash-merges. It does NOT target main.

---

## File map

| File | What changes | Owner |
|---|---|---|
| `packages/ds/src/components/slider/slider.tsx` | `thumbVariants` base classes (lines 25–35), size variants (lines 38–41), error conditional `className` (line 107–108). Range className unchanged. | Tasks 2–3 |
| `packages/ds/src/components/slider/slider.test.tsx` | Add four new tests for thumb classes at rest + per size. | Task 2 |
| `apps/preview/src/app/components/slider/page.tsx` | No code change. Visual verification only. | Task 4 |
| `docs/SKIN-PRINCIPLES.md` | § 4 reserved-list Slider line (line 151) + § 4 Source line (line 157) + § 6 Direction C How line (line 249) + § 6 Direction C Source line (line 250). | Task 5 |
| `docs/DESIGN-SYSTEM.md` | Radius-table explanatory paragraph (line 336), Slider section Sizes line (line 1658), Slider section Visual-style line (line 1662), Slider section Error line (line 1664). | Task 6 |
| `docs/DECISIONS.md` | Prepend Decision #89 entry. | Task 7 |
| `docs/BACKLOG.md` | Edit "Rounded-full audit" item — remove Slider thumb from remaining list. | Task 7 |
| `CLAUDE.md` | Refresh Slider entry in Current Features list. | Task 7 |

---

## Task 1: Verify branch + create chunk branch

**Files:** None. Branch setup only.

- [ ] **Step 1: Confirm we're in the integration worktree on `skin/paraplu`**

```bash
cd /Users/dio/Library/CloudStorage/Dropbox/Claudio/repos/stasho-ds/.claude/worktrees/skin+paraplu
git status
git branch --show-current
git log --oneline -2
```

Expected: branch is `skin/paraplu`. Most recent commit is `8f9d2e4 feat(skin): wave-1 finish — Pagination · Switch · Stepper · Alert (#8)`. Working tree clean.

If the worktree is still on `skin/wave-1-finish` (the chunk branch that already merged), switch and pull first:

```bash
git checkout skin/paraplu
git pull --ff-only origin skin/paraplu
```

- [ ] **Step 2: Create + checkout the chunk branch**

```bash
git checkout -b skin/slider-thumb-revisit
git branch --show-current
```

Expected: branch is `skin/slider-thumb-revisit`.

No commit. Branch setup only.

---

## Task 2: Write failing tests for the ring chassis

**Files:**
- Modify: `packages/ds/src/components/slider/slider.test.tsx` — append four tests after the existing `"sets correct values on range thumbs"` test (around line 140, before the closing `});` of the `describe("Slider", ...)` block).

**Steps:**

- [ ] **Step 1: Add four class-presence tests**

In `packages/ds/src/components/slider/slider.test.tsx`, find the closing `});` of the `describe("Slider", ...)` block (the test file has a single describe; the close is on line 141 in the current file). Insert the four tests below right before that closing `});`:

```tsx
  it("renders thumb with bg-background interior at rest", () => {
    render(<Slider defaultValue={[50]} />);
    const thumb = screen.getByRole("slider");
    expect(thumb.className).toContain("bg-background");
  });

  it("renders thumb with 1.5px cyan ring at rest", () => {
    render(<Slider defaultValue={[50]} />);
    const thumb = screen.getByRole("slider");
    expect(thumb.className).toContain("border-[1.5px]");
    expect(thumb.className).toContain("border-accent");
  });

  it("renders md thumb at size-3.5 (14px)", () => {
    render(<Slider defaultValue={[50]} size="md" />);
    const thumb = screen.getByRole("slider");
    expect(thumb.className).toContain("size-3.5");
  });

  it("renders sm thumb at size-3 (12px)", () => {
    render(<Slider defaultValue={[50]} size="sm" />);
    const thumb = screen.getByRole("slider");
    expect(thumb.className).toContain("size-3");
  });
```

Notes:
- `screen.getByRole("slider")` returns the thumb element (Radix renders the Thumb as a `<span role="slider">`).
- For range mode the file already covers `screen.getAllByRole("slider")` — keep the new tests scoped to single-thumb so the assertion target is unambiguous.

- [ ] **Step 2: Run the four new tests and confirm they FAIL**

```bash
cd /Users/dio/Library/CloudStorage/Dropbox/Claudio/repos/stasho-ds/.claude/worktrees/skin+paraplu
npm run test -- slider
```

Expected: the four new tests fail with messages like `Expected className to contain "bg-background"` (the current chassis has `bg-accent`, `border border-accent` (no `[1.5px]`), `size-5` for md, `size-4` for sm). All eight pre-existing tests pass.

If any pre-existing test fails: stop. Diagnose before continuing — the test scaffolding (jsdom polyfills at the top of the file) may have shifted.

- [ ] **Step 3: Commit the failing tests (TDD red phase)**

```bash
git add packages/ds/src/components/slider/slider.test.tsx
git commit -m "test(slider): red — ring chassis + new size variants"
```

---

## Task 3: Rewrite the Slider thumb CVA

**Files:**
- Modify: `packages/ds/src/components/slider/slider.tsx` — `thumbVariants` base array (lines 25–35), size variants (lines 38–41), and the `error` conditional `className` (lines 107–108).

**Steps:**

- [ ] **Step 1: Replace `thumbVariants` base array (lines 25–35)**

In `packages/ds/src/components/slider/slider.tsx`, find this block:

```ts
const thumbVariants = cva(
  [
    "block rounded-full bg-accent",
    "border border-accent",
    "transition-shadow motion-reduce:transition-none",
    "hover:shadow-[0_0_6px_var(--accent),0_0_12px_rgba(0,225,250,0.5)]",
    "focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2",
    "focus-visible:shadow-[0_0_6px_var(--accent),0_0_12px_rgba(0,225,250,0.5)]",
    "data-[disabled]:bg-foreground/30 data-[disabled]:border-foreground/30",
    "data-[disabled]:shadow-none data-[disabled]:cursor-not-allowed",
  ].join(" "),
```

Replace with:

```ts
const thumbVariants = cva(
  [
    "block rounded-full bg-background",
    "border-[1.5px] border-accent",
    "transition-[background-color,box-shadow] motion-reduce:transition-none",
    "hover:bg-accent",
    "hover:shadow-[0_0_6px_var(--accent),0_0_12px_rgba(0,225,250,0.5)]",
    "focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2",
    "focus-visible:shadow-[0_0_6px_var(--accent),0_0_12px_rgba(0,225,250,0.5)]",
    "data-[disabled]:bg-background data-[disabled]:border-foreground/30",
    "data-[disabled]:hover:bg-background",
    "data-[disabled]:shadow-none data-[disabled]:cursor-not-allowed",
  ].join(" "),
```

Changes:
- `bg-accent` → `bg-background` (interior is page background — auto-flips in light mode)
- `border` (1px) → `border-[1.5px]` (1.5px ring)
- `transition-shadow` → `transition-[background-color,box-shadow]` (bg fades in on hover too)
- Added `hover:bg-accent` (interior fills cyan on hover — the carve-out from § 5 "doesn't repaint")
- `data-[disabled]:bg-foreground/30` → `data-[disabled]:bg-background` (disabled interior stays dark, not filled grey)
- Added `data-[disabled]:hover:bg-background` (compound variant — prevents `hover:bg-accent` from firing when disabled)

- [ ] **Step 2: Replace size variants (lines 38–41)**

In the same file, find:

```ts
      size: {
        sm: "size-4",
        md: "size-5",
      },
```

Replace with:

```ts
      size: {
        sm: "size-3",
        md: "size-3.5",
      },
```

Changes: `size-4` (16px) → `size-3` (12px); `size-5` (20px) → `size-3.5` (14px). Tailwind 4's default spacing scale has `size-3 = 12px` and `size-3.5 = 14px`.

- [ ] **Step 3: Update the `error` conditional className (lines 107–108)**

Find:

```tsx
              error &&
                "border-error hover:shadow-[0_0_6px_var(--error),0_0_12px_rgba(255,61,0,0.5)] focus-visible:shadow-[0_0_6px_var(--error),0_0_12px_rgba(255,61,0,0.5)] focus-visible:outline-error",
```

Replace with:

```tsx
              error &&
                "border-error hover:bg-error hover:shadow-[0_0_6px_var(--error),0_0_12px_rgba(255,61,0,0.5)] focus-visible:shadow-[0_0_6px_var(--error),0_0_12px_rgba(255,61,0,0.5)] focus-visible:outline-error",
```

Changes: added `hover:bg-error` so the interior fills blood-orange on hover in error state (parallels the cyan fill-on-hover behavior). `tailwind-merge` via `cn()` deduplicates — the later `hover:bg-error` overrides the base `hover:bg-accent`.

- [ ] **Step 4: Run the slider tests and confirm all 12 pass**

```bash
npm run test -- slider
```

Expected: all 12 tests pass (8 pre-existing + 4 added in Task 2).

If any test fails: read the failure, fix the regression. Do not loosen tests to "make them pass" — if `border-[1.5px]` doesn't show up in the rendered className, check the CVA spelling.

- [ ] **Step 5: Run lint + typecheck**

```bash
npm run lint
npm run typecheck
```

Expected: clean exit on both.

- [ ] **Step 6: Commit the implementation**

```bash
git add packages/ds/src/components/slider/slider.tsx
git commit -m "feat(skin): slider thumb — cyan ring aperture, shrink to 14/12, fill+halo on hover"
```

---

## Task 4: Visual verification in dev server

**Files:** None. Manual visual check.

- [ ] **Step 1: Start dev server**

```bash
cd /Users/dio/Library/CloudStorage/Dropbox/Claudio/repos/stasho-ds/.claude/worktrees/skin+paraplu
npm run dev
```

Note the localhost URL (typically `http://localhost:3000`).

- [ ] **Step 2: Walk the Slider preview page and confirm in BOTH themes**

Open `http://localhost:3000/components/slider` in a browser and toggle the theme switcher (top-right) between dark and light.

For each section on the page, confirm:

**Default · md size**
- Thumb is a 14×14 cyan ring with a dark interior (page background); ring weight ~1.5px reads cleanly
- On hover: interior fills cyan + outer halo lights up; thumb visibly intensifies
- On focus (tab to slider): outline 2px ring around thumb at 2px offset + halo
- Tab + hover: outline + filled interior + halo

**Sizes**
- sm (12×12) and md (14×14) clearly distinguish by scale; neither dominates the track
- Rings are visible in both sizes (1.5px on 12px disc gives a ~9px aperture)

**With tooltip**
- Tooltip surface unchanged from chunk 6 (popover-token chassis above thumb on hover)

**Range (two thumbs)**
- Both thumbs render rings; range fill between them stays solid cyan
- Hovering one thumb fills only that thumb (other stays ring)
- The "thumb on cyan range" case: at rest the dark interior reads as an aperture punching through the range; on hover the filled cyan + outer halo reads as a focused glow — confirm the halo extends beyond the thumb so the active position is still locatable when the interior merges with the range

**States · Disabled**
- Ring drops to grey (`border-foreground/30`), interior stays dark (`bg-background`)
- No halo on hover, no fill on hover (`data-[disabled]:hover:bg-background` keeping it dark)
- Cursor shows `not-allowed` on the slider
- Range fades to `bg-foreground/30` (unchanged behavior from chunk 4)

**States · Error**
- Ring becomes blood-orange (`border-error`), interior dark
- Hover: interior fills blood-orange + orange halo
- Focus: outline becomes orange (`outline-error` from the existing error conditional)

**Light mode (toggle switcher)**
- Interior at rest is near-white (light-mode `--background`) instead of dark — reads as a "white aperture" inside a cyan ring
- Filled hover still reads as a glowing cyan dot — outer halo gives the spotlight
- Disabled ring (grey) on light surfaces reads as "off" — confirm contrast is acceptable

**Controlled / FormField sections**
- No regressions — wrapping in FormField doesn't change thumb chassis

- [ ] **Step 3: Stop dev server**

```
Ctrl+C in the dev terminal
```

No commit. Verification only. If anything looks wrong, fix in Task 3 with a fresh commit before continuing.

---

## Task 5: Update SKIN-PRINCIPLES.md

**Files:**
- Modify: `docs/SKIN-PRINCIPLES.md` — § 4 reserved list (line 151), § 4 Source line (line 157), § 6 Direction C How line (line 249), § 6 Direction C Source line (line 250).

**Steps:**

- [ ] **Step 1: Update § 4 reserved-list Slider entry (line 151)**

Find:

```markdown
- Slider thumb (a control puck IS round — same convention argument as Switch, but the visual difference at 16px between square and round thumb is functionally invisible AND Slider thumb shipped with `rounded-full` in chunk 4 as part of the bevel + LED treatment; kept for now, flagged for the rounded-full audit chunk)
```

Replace with:

```markdown
- Slider thumb (the ring IS an aperture — a round shape encodes the "scope reticle / position marker" reading; `rounded-full` is principled, not convention)
```

- [ ] **Step 2: Update § 4 reserved-list Source line (line 157)**

Find:

```markdown
**Source:** Decisions #86 (Tabs pill removed), #88 (Switch track + thumb removed; Stepper indicators removed). MultiSelect chips and Slider thumb carry the same convention-only justification and should be revisited in a dedicated rounded-full audit chunk.
```

Replace with:

```markdown
**Source:** Decisions #86 (Tabs pill removed), #88 (Switch track + thumb removed; Stepper indicators removed), #89 (Slider thumb kept on `rounded-full` with principled aperture justification). MultiSelect chips carry the remaining convention-only justification and should be revisited in a dedicated rounded-full audit chunk.
```

- [ ] **Step 3: Update § 6 Direction C How line (line 249)**

Find:

```markdown
**How:** Switch and Slider thumbs gain `box-shadow: 0 0 5px var(--accent), 0 0 10px rgba(0,225,250,0.6)` on hover/focus only (solid cyan at rest). Stepper active indicators carry a persistent halo `box-shadow: 0 0 6px rgba(0,225,250,0.5), 0 0 14px rgba(0,225,250,0.3)` (the indicator IS the "you are here" beacon, so the halo is rest‑state, not hover‑state). Switch and Slider tracks carry the same inset bevel as Button (`inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.4)`). Checkbox / Radio / Tabs / Pagination / Breadcrumb cyan states are flat, as are Stepper completed indicators (solid cyan chip carries the state alone). Disabled cascades for these components require compound variants (`disabled:data-[state=checked]:*` or `data-[disabled]:*` for Radix `<span>`-rendered parts) so the sink wins over the checked-accent rules.
```

Replace with:

```markdown
**How:** Switch thumbs are solid cyan at rest and gain `box-shadow: 0 0 5px var(--accent), 0 0 10px rgba(0,225,250,0.6)` on hover/focus only. Slider thumbs are 1.5px cyan rings on a `bg-background` interior at rest (an aperture); on hover, the interior fills `bg-accent` and an outer halo `0 0 6px var(--accent), 0 0 12px rgba(0,225,250,0.5)` lights up — a documented carve-out from § 5 "hover intensifies, doesn't repaint" because the Slider thumb is a directly-grabbed control and the fill is the "you've got it" cue. The repaint is bounded to the interior of an existing chassis (no border, size, or shape change). Stepper active indicators carry a persistent halo `box-shadow: 0 0 6px rgba(0,225,250,0.5), 0 0 14px rgba(0,225,250,0.3)` (the indicator IS the "you are here" beacon, so the halo is rest‑state, not hover‑state). Switch and Slider tracks carry the same inset bevel as Button (`inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.4)`). Checkbox / Radio / Tabs / Pagination / Breadcrumb cyan states are flat, as are Stepper completed indicators (solid cyan chip carries the state alone). Disabled cascades for these components require compound variants (`disabled:data-[state=checked]:*`, `data-[disabled]:*` for Radix `<span>`-rendered parts, and `data-[disabled]:hover:*` to keep the disabled chassis static under hover) so the sink wins over checked-accent / hover-fill rules.
```

- [ ] **Step 4: Update § 6 Direction C Source line (line 250)**

Find:

```markdown
**Source:** Decisions #85, #88.
```

Replace with:

```markdown
**Source:** Decisions #85, #88, #89.
```

- [ ] **Step 5: Commit**

```bash
git add docs/SKIN-PRINCIPLES.md
git commit -m "docs(skin): SKIN-PRINCIPLES — Slider aperture principled, § 6 Direction C amendment"
```

---

## Task 6: Update DESIGN-SYSTEM.md

**Files:**
- Modify: `docs/DESIGN-SYSTEM.md` — radius-table explanatory paragraph (line 336), Slider Sizes line (line 1658), Slider Visual-style paragraph (line 1662), Slider Error paragraph (line 1664).

**Steps:**

- [ ] **Step 1: Update the radius-table explanatory paragraph (line 336)**

Find:

```markdown
The 2px and 4px steps live at `rounded-lg` / `rounded-xl` so the entire scale is named — no arbitrary `rounded-[2px]` / `rounded-[4px]` values are needed in consumer code. Tailwind's `rounded-sm` and `rounded-md` both resolve to `0` and are interchangeable with `rounded-none`. `rounded-full` is reserved for elements that are round by design (never by convention). Switch track + thumb moved to `rounded-[2px]` in wave-1 (Decision #88); Stepper indicators likewise. Slider thumb remains `rounded-full` for now — flagged for the dedicated rounded-full audit chunk. See SKIN-PRINCIPLES § 4 "Surface radii by role" for the role → class mapping.
```

Replace with:

```markdown
The 2px and 4px steps live at `rounded-lg` / `rounded-xl` so the entire scale is named — no arbitrary `rounded-[2px]` / `rounded-[4px]` values are needed in consumer code. Tailwind's `rounded-sm` and `rounded-md` both resolve to `0` and are interchangeable with `rounded-none`. `rounded-full` is reserved for elements that are round by design (never by convention). Switch track + thumb moved to `rounded-[2px]` in wave-1 (Decision #88); Stepper indicators likewise. Slider thumb stays `rounded-full` with a principled aperture justification (Decision #89). See SKIN-PRINCIPLES § 4 "Surface radii by role" for the role → class mapping.
```

- [ ] **Step 2: Update Slider Sizes line (line 1658)**

Find:

```markdown
**Sizes:** `sm` (1.5px track, 16px thumb) · `md` (2px track, 20px thumb, default)
```

Replace with:

```markdown
**Sizes:** `sm` (6px track, 12px thumb) · `md` (8px track, 14px thumb, default)
```

(The previous text reported track-height in CSS class units — "1.5px track" was `h-1.5` = 6px, "2px track" was `h-2` = 8px. The thumb numbers were wrong as soon as Decision #89 shipped; switching both to actual pixel values removes the ambiguity.)

- [ ] **Step 3: Replace Slider Visual-style paragraph (line 1662)**

Find:

```markdown
**Visual style:** Track carries inset bevel (`inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.4)`) on `bg-muted dark:bg-neutral-900` per SKIN-PRINCIPLES § 5. Range fill and thumb are `bg-accent`; thumb has a 1px `border-accent` ring for circular separation against the cyan range fill. Thumb glows on hover/focus (`box-shadow: 0 0 6px var(--accent), 0 0 12px rgba(0,225,250,0.5)`) per Direction C. Focus uses `outline-2 outline-accent outline-offset-2` on the thumb. Disabled flattens range + thumb to `bg-foreground/30` and removes the bevel; uses `data-[disabled]:*` variants because Radix renders Thumb/Range as `<span>` (not a button), so `:disabled` pseudo-class doesn't apply.
```

Replace with:

```markdown
**Visual style:** Track carries inset bevel (`inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.4)`) on `bg-muted dark:bg-neutral-900` per SKIN-PRINCIPLES § 5. Range fill is `bg-accent`. Thumb is a 1.5px `border-accent` ring on a `bg-background` interior (aperture — the dark interior differentiates the thumb from the cyan range fill; the ring carries the brand color). On hover, the interior fills `bg-accent` and an outer halo lights up (`box-shadow: 0 0 6px var(--accent), 0 0 12px rgba(0,225,250,0.5)`) — a documented carve-out from "hover intensifies, doesn't repaint" because the thumb is directly grabbed (Decision #89). Focus uses `outline-2 outline-accent outline-offset-2` + the same halo; the ring stays open on focus alone. Disabled flattens the ring to `border-foreground/30` (interior stays `bg-background`) and the range to `bg-foreground/30`; uses `data-[disabled]:*` variants because Radix renders Thumb/Range as `<span>` (not a button), so `:disabled` pseudo-class doesn't apply. The compound `data-[disabled]:hover:bg-background` keeps the disabled chassis static under hover.
```

- [ ] **Step 4: Update Slider Error paragraph (line 1664)**

Find:

```markdown
**Error:** `error={true}` swaps the thumb border to `border-error` and replaces the cyan glow with a blood-orange glow on hover/focus. Track is unchanged — at 4–8px height the track is too thin to render a visible 1px error border.
```

Replace with:

```markdown
**Error:** `error={true}` swaps the thumb ring to `border-error` and replaces the cyan glow with a blood-orange glow on hover/focus; the interior fills `bg-error` on hover (parallels the standard hover fill). Track is unchanged — at 4–8px height the track is too thin to render a visible 1px error border.
```

- [ ] **Step 5: Commit**

```bash
git add docs/DESIGN-SYSTEM.md
git commit -m "docs(ds): DESIGN-SYSTEM — Slider aperture chassis, new sizes, error fill on hover"
```

---

## Task 7: Add Decision #89 + update BACKLOG + CLAUDE

**Files:**
- Modify: `docs/DECISIONS.md` (prepend a new Decision #89 block above the existing Decision #88).
- Modify: `docs/BACKLOG.md` (edit the "Rounded-full audit" item).
- Modify: `CLAUDE.md` (Slider entry in Current Features list).

**Steps:**

- [ ] **Step 1: Prepend Decision #89 to DECISIONS.md**

Open `docs/DECISIONS.md` and locate the existing block:

```markdown
## Decision #88 — 2026-05-27
```

(The file is reverse-chronological — newest decisions first, right after the "How Decisions Are Logged" preamble.)

Insert this new block ABOVE `## Decision #88`, followed by a `---` separator and a blank line, so the new block sits between the preamble's separator and the existing #88 block:

```markdown
## Decision #89 — 2026-05-27

**Context:** Wave-1-finish merged Slider into `skin/paraplu` with the chunk-4 chassis — solid `bg-accent` disc, 1px `border-accent` (same hex as fill, so the border contributed nothing at rest), `size-5` md / `size-4` sm. Visual review against the cyan range fill showed the thumb melted into the range (no differentiation), lacked the wave's instrument-panel character (generic disc), and read too large against the thin track. Wave-1-finish's plan kept Slider thumb on `rounded-full` with a convention-only justification and flagged it for the dedicated rounded-full audit chunk; this revisit pre-empts that audit with a principled redesign.
**Decision:** Replace the solid-disc thumb with a **1.5px cyan ring on a `bg-background` interior** (aperture). Shrink sizes: md `size-5` (20px) → `size-3.5` (14px); sm `size-4` (16px) → `size-3` (12px). On hover, interior fills `bg-accent` and the outer halo `0 0 6px var(--accent), 0 0 12px rgba(0,225,250,0.5)` lights up — a documented carve-out from SKIN-PRINCIPLES § 5 "hover intensifies, doesn't repaint" because Slider thumb is a directly-grabbed control and the fill is the "you've got it" cue. Focus stays `outline-2 outline-accent outline-offset-2` + halo with the ring still open (interior `bg-background`). Disabled: ring drops to `border-foreground/30`, interior stays `bg-background`, compound `data-[disabled]:hover:bg-background` keeps the interior dark under hover. Error: ring becomes `border-error`, hover fills `bg-error` with orange halo. Range fill, track bevel, track shape, tooltip API, and size variant names (`sm`/`md`) unchanged. Keep `rounded-full` on the thumb — the round shape is principled (aperture / reticle reading), no longer convention-only — remove Slider thumb from the rounded-full audit list. SKIN-PRINCIPLES § 4 reserved-list entry and § 6 Direction C "How" both amended; DESIGN-SYSTEM Slider Sizes / Visual-style / Error paragraphs + Radius table footnote refreshed.
**Rationale:** Each piece. **Ring + dark interior over solid disc** — the chunk-4 thumb's `bg-accent` interior gave the eye nothing to grab on the cyan range; differentiation came only from silhouette extending past the track height, which reads as "swelling" rather than "control". The ring carries brand color where it works (a hairline-grade chrome edge) and the interior carries differentiation (`bg-background` always contrasts with the range fill in either mode). **Aperture reading** also carries the telemetry vibe the wave wants without resorting to a different shape (a vertical playhead bar was rejected at brainstorming for breaking the round-thumb convention). **Sizes drop to 14/12** — current 20/16 dominated the 8/6 track. 14×14 lets the thumb extend ~3px above/below the track, registering as focal without dominating. 12×12 sm matches the same proportion. **Ring weight 1.5px** — 1px reads thin at sm (the chassis hairline rule of § 4 is strict but the visual reality at 12px loses the cyan); 2px eats too much of the dark interior at 14px. 1.5px is the comfortable middle. **Fill + halo on hover (Direction D from brainstorm)** — the strongest interaction feedback option; reads as "the aperture closed and the dot is fully lit". The repaint is documented as a Slider-specific carve-out from § 5 because the thumb is a directly-grabbed control and the fill is the "you've got it" cue — bounded to the interior of an existing chassis (no border, shape, or size change). Halo-only (option A) was the principle-faithful choice but reads as a passing hover, not a grab cue. **Focus stays open ring** — keyboard focus is a "where am I" signal, not a "grabbing" signal; filling the interior on focus alone would conflate the two states. **`rounded-full` becomes principled** — the chunk-4 justification was convention-only ("a control puck IS round") which the wave-1-finish audit footnote already flagged as weak; the aperture reading provides a semantic reason for the round shape (a reticle / scope is round because that's what the symbol IS), so the entry is rewritten with the principled justification and removed from the audit list. **Compound `data-[disabled]:hover:bg-background`** — necessary because base `hover:bg-accent` and `data-[disabled]:bg-background` are equal specificity; without the compound, disabled+hover would fill cyan. Same family of specificity guardrails as Decision #85's `disabled:data-[state=checked]:*` rules.
**Alternatives considered:** Dark chassis + cyan LED dot (option A in brainstorm — rejected; echoes Switch/Button vocabulary too closely, risks reading as a tiny button rather than a slider thumb). Playhead bar (option C — rejected; strongest telemetry reading but breaks the round-thumb convention which is too aggressive a departure for a wave-1 revisit). Halo-only hover (option A — too passive for a grabbed control). Ring fills cyan without halo (option B — repaints AND visually merges with the cyan range, halo provides the locating cue when the interior matches the range). Ring thickens on hover (option C — 1.5px → 3px — too subtle to register at 14px). Keep md at 16px / sm at 12px (rejected; 16px still close enough to the original 20 to leave "feels too large" partially unresolved). 1px ring weight (rejected; reads thin at 12px sm). 2px ring weight (rejected; eats too much of the dark interior at 14px). Move Slider thumb to `rounded-[2px]` (rejected at brainstorm; the aperture reading is round-by-design, not convention — `rounded-[2px]` would be a square frame with no shape vocabulary that ties to "reticle"). Defer revisit to the planned rounded-full audit chunk (rejected; the issues are immediately visible on the slider preview page after wave-1-finish merged and the audit chunk's scope is broader / further out).

---
```

The block ends with `---` (followed by a blank line) per the file's existing convention.

- [ ] **Step 2: Update BACKLOG.md — "Rounded-full audit" item**

In `docs/BACKLOG.md`, find the open item:

```markdown
### 2026-05-27 — Rounded-full audit

**Source:** Decision #86 cascade
**Description:** SKIN-PRINCIPLES § 4 amendment ("round-by-design only, never round-by-convention") flags three remaining components on the reserved list that share the convention-only justification Tabs pill just lost: Switch track (currently `rounded-full` — shipped in chunk 4), MultiSelect tag chips (chunks 6+ territory, unshipped), Stepper indicators (chunk 7 territory, unshipped). Audit each and either keep `rounded-full` with a new semantic justification or move to `rounded-[2px]` to match the Tabs pill treatment. Single chunk: `skin/rounded-full-audit` off `skin/paraplu`.
**Priority:** Medium (does not block the wave but completes the principle work started in chunk 5)
```

Replace with:

```markdown
### 2026-05-27 — Rounded-full audit (MultiSelect chips remaining)

**Source:** Decision #86 cascade
**Description:** SKIN-PRINCIPLES § 4 amendment ("round-by-design only, never round-by-convention") flagged Switch track + thumb, Stepper indicators, Slider thumb, and MultiSelect tag chips as carrying convention-only `rounded-full` justifications. Switch + Stepper resolved in wave-1-finish (Decision #88 — both moved to `rounded-[2px]`). Slider thumb resolved in Decision #89 — `rounded-full` kept with a principled aperture / reticle justification. Only **MultiSelect tag chips** remain — audit and either keep with a new semantic justification or move to `rounded-[2px]`. Single chunk: `skin/multiselect-chips-audit` off `skin/paraplu`.
**Priority:** Low (final principle cleanup — does not block any feature work)
```

- [ ] **Step 3: Update CLAUDE.md — Slider Current Features entry**

In `CLAUDE.md`, find the existing Slider entry in the Current Features list:

```markdown
- Slider component (Radix Slider) with CVA track/thumb variants, 2 sizes (sm/md), single or range (two-thumb) mode, bevel track (per SKIN-PRINCIPLES § 5) on `bg-muted dark:bg-neutral-900`, cyan range fill + cyan thumb with 1px `border-accent` separation, thumb glows on hover/focus (Direction C), error renders on thumb border with blood-orange glow swap (track too thin for visible 1px error border), optional hover tooltip styled as flat popover surface (`bg-popover-bg border border-popover-border rounded-none text-foreground` — shares the chunk-6 popover token with Tooltip and the four dropdown surfaces, Decision #87), uses `data-[disabled]:*` variants because Radix renders Thumb/Range as `<span>` (the `:disabled` pseudo-class only matches form elements), keyboard accessible
```

Replace with:

```markdown
- Slider component (Radix Slider) with CVA track/thumb variants, 2 sizes (sm: 12px thumb on 6px track / md: 14px thumb on 8px track), single or range (two-thumb) mode, bevel track (per SKIN-PRINCIPLES § 5) on `bg-muted dark:bg-neutral-900`, cyan range fill, thumb is a 1.5px `border-accent` ring on a `bg-background` interior (aperture — interior contrasts with the cyan range), interior fills `bg-accent` + outer halo lights up on hover (Decision #89 — documented carve-out from "hover intensifies, doesn't repaint" because the thumb is directly grabbed), focus stays open ring + outline + halo, disabled flattens ring to `border-foreground/30` with compound `data-[disabled]:hover:bg-background` keeping the interior dark, error renders blood-orange ring + orange fill on hover (track too thin for visible 1px error border), optional hover tooltip styled as flat popover surface (`bg-popover-bg border border-popover-border rounded-none text-foreground` — shares the chunk-6 popover token with Tooltip and the four dropdown surfaces, Decision #87), uses `data-[disabled]:*` variants because Radix renders Thumb/Range as `<span>` (the `:disabled` pseudo-class only matches form elements), `rounded-full` thumb is principled (aperture / reticle reading — Decision #89), keyboard accessible
```

- [ ] **Step 4: Commit the three doc updates together**

```bash
git add docs/DECISIONS.md docs/BACKLOG.md CLAUDE.md
git commit -m "docs(skin): Decision #89 + BACKLOG audit shrink + CLAUDE Slider features"
```

---

## Task 8: Run all checks, push, open PR, doc-update checklist

**Files:** None. Project-wide verification + PR creation.

**Steps:**

- [ ] **Step 1: Run all checks**

```bash
cd /Users/dio/Library/CloudStorage/Dropbox/Claudio/repos/stasho-ds/.claude/worktrees/skin+paraplu
npm run check
```

`npm run check` runs lint + typecheck + test across both workspaces (DS package + preview app). Expected: clean exit. If anything fails: fix in a new commit before pushing.

- [ ] **Step 2: Confirm the doc-update checklist (per project CLAUDE.md convention)**

Read the four commits you just made (`git log --oneline -4`) and confirm every doc was touched. Use this exact checklist:

- [x] DESIGN-SYSTEM.md — Slider Sizes line, Visual-style paragraph, Error paragraph, radius-table footnote (Task 6)
- [x] ARCHITECTURE.md — N/A. No new files, no changed patterns. Slider's component architecture (Radix wrapper + CVA + `data-[disabled]:*` for `<span>`-rendered parts) is unchanged. The compound `data-[disabled]:hover:*` variant is in scope for SKIN-PRINCIPLES § 6 Direction C (where the cascade guidance lives), not ARCHITECTURE
- [x] DECISIONS.md — Decision #89 prepended (Task 7)
- [x] BACKLOG.md — Rounded-full audit shrunk to MultiSelect chips only (Task 7)
- [x] CLAUDE.md — Slider feature entry refreshed (Task 7)

If any item is missing: add the missing edits in a new commit before pushing. Do not push with incomplete doc updates.

- [ ] **Step 3: Push the chunk branch**

```bash
git push -u origin skin/slider-thumb-revisit
```

Expected: branch pushed and tracking origin.

- [ ] **Step 4: Open the PR targeting `skin/paraplu` (NOT main)**

```bash
gh pr create --base skin/paraplu --title "feat(skin): slider thumb — cyan ring aperture (Decision #89)" --body "$(cat <<'EOF'
## Summary
- Slider thumb: solid cyan disc → 1.5px cyan ring on `bg-background` interior (aperture); shrinks md from 20→14, sm from 16→12
- Hover fills the ring's interior cyan and lights an outer halo — a documented carve-out from "hover intensifies, doesn't repaint" because the thumb is directly grabbed
- Disabled / focus / error states updated to match; compound `data-[disabled]:hover:bg-background` keeps disabled chassis static
- `rounded-full` kept on the thumb with a principled aperture / reticle justification (no longer convention-only — removes Slider from the rounded-full audit list)
- SKIN-PRINCIPLES § 4 reserved list + § 6 Direction C amended; DESIGN-SYSTEM Slider section + radius-table footnote refreshed; CLAUDE Slider entry updated; Decision #89 added; BACKLOG audit shrunk to MultiSelect chips only

Spec: `docs/superpowers/specs/2026-05-27-slider-thumb-revisit-design.md`
Plan: `docs/superpowers/plans/2026-05-27-slider-thumb-revisit.md`

## Test plan
- [ ] Slider preview page at `/components/slider` reviewed in both themes
- [ ] All seven states confirmed (rest, hover, focus, focus+hover, disabled, error, error+hover)
- [ ] Range mode confirms aperture reading on the cyan range (left thumb at range start, right thumb at range end)
- [ ] Light-mode interior is near-white (not literally dark) and still reads as aperture
- [ ] All 12 slider tests pass (8 pre-existing + 4 added in Task 2)
- [ ] `npm run check` is clean
EOF
)"
```

Expected: PR created. Save the PR URL for the merge step.

- [ ] **Step 5: Squash-merge after CI/review**

```bash
gh pr merge <PR_NUMBER> --squash --delete-branch
```

(Run only after the PR is reviewed and approved — do not merge unattended.)

- [ ] **Step 6: Sync the integration worktree back to `skin/paraplu`**

```bash
git checkout skin/paraplu
git pull --ff-only origin skin/paraplu
git branch -d skin/slider-thumb-revisit
```

Expected: integration worktree now tracks `skin/paraplu` with the slider revisit squash-merged in. Local chunk branch deleted.

---

## Notes for the agent executing this plan

- **TDD red phase is real** — Task 2 commits failing tests deliberately so Task 3's implementation has a verification target. Do not skip Task 2 or fold it into Task 3.
- **Specificity edge cases** — the `data-[disabled]:hover:bg-background` compound is necessary because base `hover:bg-accent` and `data-[disabled]:bg-background` are equal specificity. If a future hover-state class is added, mirror the compound pattern.
- **Visual verification (Task 4) is part of the definition of done** — class assertions don't catch "aperture merges into cyan range" or "halo doesn't extend beyond the thumb". Walk the preview page before committing the impl as final.
- **All doc updates must land in this PR** — per project CLAUDE.md convention, no follow-up "docs catch-up" PRs. The checklist in Task 8 Step 2 is the gate.
- **No squash-merge to main** — this PR targets `skin/paraplu` (integration branch). Main only gets the integration branch when the whole Abyssal Void integration is ready.
