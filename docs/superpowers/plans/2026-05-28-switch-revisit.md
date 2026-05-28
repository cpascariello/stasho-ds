# Switch Revisit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply three coupled visual fixes to the Switch component — 2px symmetric breathing inside the border, light-mode-tuned bevel, and a real light-mode disabled sink — while preserving the public API and Decision #92's thumb-matches-Checkbox rule.

**Architecture:** Single-file CVA edit. `switchVariants` gets new size dimensions, a split light/dark bevel, and a deeper light-mode disabled fill. `thumbVariants` translate values shift to track the larger inner box. No new tokens, no new files, no API surface change.

**Tech Stack:** React 19 · Radix UI Switch primitive · class-variance-authority · Tailwind CSS 4 with CSS custom properties (`--muted`, `--edge`, `--edge-hover`, `--background`, `--accent`).

**Source spec:** `docs/superpowers/specs/2026-05-28-switch-revisit-design.md`

**Integration branch:** `skin/paraplu` (Abyssal Void skin). Chunk branch: `skin/switch-revisit`.

---

## File Structure

**Modify:**
- `packages/ds/src/components/switch/switch.tsx` — only file that changes for the visual fix
- `docs/SKIN-PRINCIPLES.md` — amend § 5 "Switch thumb mirrors Checkbox at the same size step" (track formula + bevel exception)
- `docs/DECISIONS.md` — add Decision #96
- `docs/DESIGN-SYSTEM.md` — update Switch sizes at line 1022 (dimensions block)
- `CLAUDE.md` — update the Switch entry in Current Features
- `docs/BACKLOG.md` — none expected (no deferred items from this work)

**Unchanged:**
- `packages/ds/src/components/switch/switch.test.tsx` — existing API tests still pass; no behavior change.
- `apps/preview/src/app/components/switch/page.tsx` — preview already exercises all sizes + states; verifies visually.

---

## Task 1: Set up chunk branch + worktree

**Files:** none (git only)

- [ ] **Step 1: Push main first**

Per CLAUDE.md, unpushed main commits cause divergence after squash-merge. The spec commit is on main.

Run:
```bash
git push origin main
```
Expected: `main → main` push succeeds (`4612ca7` lands on origin).

- [ ] **Step 2: Sync the integration worktree (or create one)**

Check if a worktree already exists for `skin/paraplu`:
```bash
git worktree list
```

If no `skin/paraplu` worktree appears, create one (parallel to the main repo):
```bash
git fetch origin skin/paraplu
git worktree add ../stasho-ds-skin-paraplu skin/paraplu
```

If it exists, change into it and pull:
```bash
cd <skin-paraplu-worktree-path>
git checkout skin/paraplu
git pull --ff-only origin skin/paraplu
```

- [ ] **Step 3: Create the chunk branch off skin/paraplu**

From inside the `skin/paraplu` worktree:
```bash
git checkout -b skin/switch-revisit
```

Expected: `Switched to a new branch 'skin/switch-revisit'`.

All subsequent edits happen in this worktree on this branch.

---

## Task 2: Update Switch geometry (size variants + translates)

**Files:**
- Modify: `packages/ds/src/components/switch/switch.tsx:21-32` (`switchVariants.size`)
- Modify: `packages/ds/src/components/switch/switch.tsx:46-57` (`thumbVariants.size`)

- [ ] **Step 1: Replace the `switchVariants.size` block**

In `packages/ds/src/components/switch/switch.tsx`, find:
```ts
      size: {
        xs: "h-4 w-7",
        sm: "h-5 w-9",
        md: "h-6 w-11",
      },
```

Replace with:
```ts
      size: {
        xs: "h-[18px] w-8",
        sm: "h-[22px] w-10",
        md: "h-[26px] w-[47px]",
      },
```

Rationale: track outer = thumb + 6 (4px breathing + 2px border). Width ratio 1.78-1.82, within the 1.75-1.83 band.

- [ ] **Step 2: Replace the `thumbVariants.size` block**

Find:
```ts
      size: {
        xs: "size-3 data-[state=checked]:translate-x-[12px]",
        sm: "size-4 data-[state=checked]:translate-x-[16px]",
        md: "size-5 data-[state=checked]:translate-x-[20px]",
      },
```

Replace with:
```ts
      size: {
        xs: "size-3 data-[state=checked]:translate-x-[16px]",
        sm: "size-4 data-[state=checked]:translate-x-[20px]",
        md: "size-5 data-[state=checked]:translate-x-[23px]",
      },
```

Thumb sizes (`size-3` / `size-4` / `size-5` = 12/16/20px) unchanged — preserves Decision #92. Off-state translate (`data-[state=unchecked]:translate-x-0.5`) on the parent thumb className is also unchanged.

- [ ] **Step 3: Run typecheck**

```bash
cd <repo-root> && npm run typecheck
```
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add packages/ds/src/components/switch/switch.tsx
git commit -m "feat(switch): 2px breathing geometry — new size + translate values"
```

---

## Task 3: Split bevel into light + dark

**Files:**
- Modify: `packages/ds/src/components/switch/switch.tsx:11` (the `shadow-[…]` line in `switchVariants` base)

- [ ] **Step 1: Replace the single bevel with light + dark pair**

Find:
```ts
    "shadow-[inset_0_1px_0_rgba(255,255,255,0.06),inset_0_-1px_0_rgba(0,0,0,0.4)]",
```

Replace with two lines (default is light; `dark:` overrides):
```ts
    "[box-shadow:inset_0_1px_0_rgba(255,255,255,0.7),inset_0_-1px_0_rgba(0,0,0,0.10)]",
    "dark:[box-shadow:inset_0_1px_0_rgba(255,255,255,0.06),inset_0_-1px_0_rgba(0,0,0,0.4)]",
```

- [ ] **Step 2: Update the `disabled:shadow-none` line so it still wins**

Tailwind's `shadow-none` resets `box-shadow`, but since we're now using arbitrary `[box-shadow:…]` it's safer to be explicit. Find:
```ts
    "disabled:border-edge/50 disabled:shadow-none",
```

Replace with (we'll touch the border in Task 4 — for now only the shadow):
```ts
    "disabled:border-edge/50 disabled:[box-shadow:none]",
```

- [ ] **Step 3: Run typecheck**

```bash
npm run typecheck
```
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add packages/ds/src/components/switch/switch.tsx
git commit -m "feat(switch): tune light-mode bevel — bright highlight, faint shadow"
```

---

## Task 4: Light-mode disabled sink (`bg-edge` + `border-edge-hover`)

**Files:**
- Modify: `packages/ds/src/components/switch/switch.tsx:13` (`disabled:bg-muted dark:disabled:bg-background`)
- Modify: `packages/ds/src/components/switch/switch.tsx:14` (`disabled:border-edge/50 disabled:[box-shadow:none]` — touched in Task 3)
- Modify: `packages/ds/src/components/switch/switch.tsx:16` (`disabled:data-[state=checked]:border-edge/50`)

- [ ] **Step 1: Replace the light disabled fill**

Find:
```ts
    "disabled:bg-muted dark:disabled:bg-background",
```

Replace with:
```ts
    "disabled:bg-edge dark:disabled:bg-background",
```

- [ ] **Step 2: Replace the disabled border (off-state)**

Find (the line touched in Task 3):
```ts
    "disabled:border-edge/50 disabled:[box-shadow:none]",
```

Replace with:
```ts
    "disabled:border-edge-hover dark:disabled:border-edge/50 disabled:[box-shadow:none]",
```

The light disabled border deepens to `--edge-hover` (oklch 0.80) so it stays visible against the now-darker fill. Dark mode keeps `border-edge/50`.

- [ ] **Step 3: Replace the disabled+on compound border**

Find:
```ts
    "disabled:data-[state=checked]:border-edge/50",
```

Replace with:
```ts
    "disabled:data-[state=checked]:border-edge-hover dark:disabled:data-[state=checked]:border-edge/50",
```

- [ ] **Step 4: Run typecheck and unit tests**

```bash
npm run typecheck
npm run test -- switch
```
Expected: typecheck clean; all 9 Switch tests pass.

- [ ] **Step 5: Commit**

```bash
git add packages/ds/src/components/switch/switch.tsx
git commit -m "feat(switch): light-mode disabled sinks to bg-edge"
```

---

## Task 5: Verify visually in preview app

**Files:** none (manual verification step)

- [ ] **Step 1: Start the preview dev server**

```bash
npm run dev
```
Expected: Turbopack reports server ready, typically on `http://localhost:3000`.

- [ ] **Step 2: Open /components/switch**

Open `http://localhost:3000/components/switch` in a browser.

- [ ] **Step 3: Verify against the source-of-truth mockup**

Check the page against `.superpowers/brainstorm/67872-1779959176/content/q4-final-composed.html`. For each:
- **Default** (md size, off + on): 2px breathing inside border visible in both modes; light-mode bevel reads as gentle depth (not scuffed).
- **Sizes** (xs, sm, md off + on): all three have the 2px symmetric breathing.
- **Disabled** (off + on): light-mode track is visibly darker than rest; cyan does not leak in disabled+on.
- **Switch theme**: toggle light/dark via the theme switcher and confirm both modes look right.

If any state diverges from the mockup, return to the relevant earlier task and re-check the class strings before continuing.

- [ ] **Step 4: Stop the dev server**

Stop with `Ctrl+C` in the terminal running `npm run dev`.

---

## Task 6: Run full project check

**Files:** none (verification)

- [ ] **Step 1: Run check**

```bash
npm run check
```
This is the project's combined `lint + typecheck + test` per CLAUDE.md.

Expected: all passing. If anything fails, fix the underlying issue and commit before moving on (do not skip).

---

## Task 7: Update docs — SKIN-PRINCIPLES § 5

**Files:**
- Modify: `docs/SKIN-PRINCIPLES.md:266-268` (the "Switch thumb mirrors Checkbox at the same size step" rule body)
- Modify: `docs/SKIN-PRINCIPLES.md:250` (the line that names the shared bevel — add a Switch exception note)

- [ ] **Step 1: Update the size formula**

Find (around line 268):
```
**How:** xs `h-4 w-7` (16×28) thumb `size-3` (12); sm `h-5 w-9` (20×36) thumb `size-4` (16); md `h-6 w-11` (24×44) thumb `size-5` (20). Thumb translate from `tx-0.5` (2px) to `tx-[thumb_w + 4]` keeps 2px breathing both ends. xs thumb stays 12 (not 14) because a 14-thumb in a 16-track leaves zero breathing room — divergence accepted at xs only.
```

Replace with:
```
**How:** xs `h-[18px] w-8` (18×32) thumb `size-3` (12); sm `h-[22px] w-10` (22×40) thumb `size-4` (16); md `h-[26px] w-[47px]` (26×47) thumb `size-5` (20). Track outer = thumb + 6 (4px symmetric breathing + 2px border). Thumb translate from `tx-0.5` (2px) at off to `tx-[thumb_w + 3]` at on keeps 2px breathing inside the border on both ends. Decision #96 amends the earlier "thumb + 4" formula (Decision #92) — the +4 was outer dim, which left only 1px visible breathing once the 1px border was accounted for.
```

- [ ] **Step 2: Add the Switch bevel exception**

At the end of the long paragraph at line 250 (after "Switch, Slider, and ProgressBar tracks carry the same inset bevel as Button..."), add:

```
**Switch light-mode bevel exception (Decision #96):** Switch's light-mode track uses `inset 0 1px 0 rgba(255,255,255,0.7), inset 0 -1px 0 rgba(0,0,0,0.10)` — bright top highlight, faint bottom shadow. The shared dark-mode bevel (40% black bottom inset) reads as dirt on a light grey track instead of depth; Switch's track is the only one in the trio with a same-tone fill in light mode (`bg-muted` on `bg-background`), so it can't lean on the dark-mode proportions. Slider and ProgressBar tracks are unaffected pending their own review.
```

- [ ] **Step 3: Commit**

```bash
git add docs/SKIN-PRINCIPLES.md
git commit -m "docs(skin-principles): switch revisit — track formula + light bevel exception"
```

---

## Task 8: Add Decision #96

**Files:**
- Modify: `docs/DECISIONS.md` (top of file, above Decision #95)

- [ ] **Step 1: Insert the new decision at the top**

At the very top of `docs/DECISIONS.md` (above `## Decision #95`), insert:

```markdown
## Decision #96 — 2026-05-28

**Context:** Switch component felt off in two ways — light + dark had a different feel because of the heavy shared bevel, and the thumb-to-stroke gap was visibly tight. Disabled also didn't read as disabled in light mode because rest was already `bg-muted`.
**Decision:** Three coupled changes:
1. **Geometry:** track outer = thumb + 6 (4px breathing + 2px border). New dims: xs 18×32, sm 22×40, md 26×47. Thumbs unchanged (12/16/20). Amends Decision #92's "thumb + 4" formula (the +4 was outer dim, which left only 1px visible breathing).
2. **Light-mode bevel:** `inset 0 1px 0 rgba(255,255,255,0.7), inset 0 -1px 0 rgba(0,0,0,0.10)` — bright soft top + faint bottom. Dark bevel unchanged. Switch is the only track in the shared-bevel trio (Switch/Slider/ProgressBar) with a same-tone-as-page fill in light mode, so it can't lean on the dark-mode bevel proportions.
3. **Disabled sink:** light track drops from `bg-muted` (rest) to `bg-edge` (disabled) with border `border-edge-hover`; mirrors the dark "sink one ladder step" pattern.
**Rationale:** All three are visibility refinements that bring Switch in line with how the rest of the system reads in light mode without changing the public API or the thumb-matches-Checkbox rule (Decision #92, preserved).
**Alternatives considered:** (1) Drop the border to get 2px breathing without growing the track — rejected, the stroke is part of the visual contract. (2) Invert the bevel direction (top dark, bottom light) for a true "depressed slot" reading — rejected, would force a coupled change to Slider/ProgressBar without a clear win. (3) `opacity: 0.4` for disabled — rejected, lets cyan bleed through in disabled+on.
```

- [ ] **Step 2: Commit**

```bash
git add docs/DECISIONS.md
git commit -m "docs(decisions): add #96 — switch visibility + breathing revisit"
```

---

## Task 9: Update DESIGN-SYSTEM.md Switch sizes

**Files:**
- Modify: `docs/DESIGN-SYSTEM.md:1022`

- [ ] **Step 1: Replace the dimensions sentence**

Find (line 1022):
```
**Sizes:** `xs` (28×16px track, 12px thumb) · `sm` (36×20px track, 16px thumb) · `md` (44×24px track, 20px thumb, default). Thumb sizes match Checkbox/Radio at the same step (sm = 16, md = 20) per Decision #92, so a Switch row reads at the same visual weight as a Checkbox row in forms; xs thumb stays 12 because a 14-thumb in the 16-tall xs track leaves zero breathing. Track ratio is 1.75–1.83 across all sizes (industry-standard switch proportions). Symmetric 2px breathing on both ends of thumb travel.
```

Replace with:
```
**Sizes:** `xs` (32×18px track, 12px thumb) · `sm` (40×22px track, 16px thumb) · `md` (47×26px track, 20px thumb, default). Thumb sizes match Checkbox/Radio at the same step (sm = 16, md = 20) per Decision #92. Track outer = thumb + 6 (4px symmetric breathing + 2px border) per Decision #96 — amends the earlier "thumb + 4" formula that yielded only 1px visible breathing. Track ratio is 1.78–1.82 across all sizes (within the 1.75–1.83 band).
```

- [ ] **Step 2: Commit**

```bash
git add docs/DESIGN-SYSTEM.md
git commit -m "docs(design-system): update switch sizes for revisit"
```

---

## Task 10: Update CLAUDE.md Current Features

**Files:**
- Modify: `CLAUDE.md` — the Switch line in the Current Features list

- [ ] **Step 1: Find the existing Switch feature line**

Open `CLAUDE.md`. Search for `Switch component (Radix UI)`. The line currently starts:

> Switch component (Radix UI) with 3 sizes (xs/sm/md = track 28×16 / 36×20 / 44×24, thumb 12/16/20 — thumb matches Checkbox/Radio at sm/md per Decision #92, 1.75–1.83 track ratio), square track (`rounded-[2px]`) + square thumb (`rounded-[2px]`), bevel track (`inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.4)`) per SKIN-PRINCIPLES § 5 …

- [ ] **Step 2: Replace it**

Replace that entire feature line with:

> Switch component (Radix UI) with 3 sizes (xs/sm/md = track 32×18 / 40×22 / 47×26, thumb 12/16/20 — thumb matches Checkbox/Radio at sm/md per Decision #92, 1.78–1.82 track ratio with 2px symmetric breathing inside the 1px border per Decision #96), square track (`rounded-[2px]`) + square thumb (`rounded-[2px]`), tuned per-mode bevel — dark `inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.4)`, light `inset 0 1px 0 rgba(255,255,255,0.7), inset 0 -1px 0 rgba(0,0,0,0.10)` (Decision #96 — light bevel exception, Slider/ProgressBar unchanged), neutral `bg-edge` thumb off / cyan `bg-accent` thumb on, thumb gains glow on hover/focus of parent via `group/sw` named group (Direction C — solid at rest, glow on interaction), `outline-2 outline-accent outline-offset-2` focus on the track (external-outline pattern per SKIN-PRINCIPLES § 6 boolean focus split — multi-element control with separately-rendered focal thumb), flat-sink disabled with light track dropping to `bg-edge` (border `border-edge-hover`) and dark dropping to `bg-background` (border `border-edge/50`), compound `group-disabled/sw:data-[state=checked]:bg-foreground/30` so disabled+on shows grey thumb

- [ ] **Step 3: Commit**

```bash
git add CLAUDE.md
git commit -m "docs(claude.md): update Switch feature line for Decision #96"
```

---

## Task 11: Update docs

The plan-wide doc audit. Spec already covered SKIN-PRINCIPLES, DECISIONS, DESIGN-SYSTEM, CLAUDE.md (Tasks 7-10). This is the checklist confirmation step.

- [ ] **DESIGN-SYSTEM.md** — new tokens, components, hooks, or patterns → done in Task 9
- [ ] **ARCHITECTURE.md** — new patterns, new files, or changed structure → N/A (no new files, no architectural change)
- [ ] **DECISIONS.md** — design decisions made during this feature → done in Task 8
- [ ] **BACKLOG.md** — completed items moved, deferred ideas added → N/A (no backlog item drove this; no deferred items)
- [ ] **CLAUDE.md** — Current Features list if user-facing behavior changed → done in Task 10

Confirm the four bullets above are all done. If any are missing, complete them now.

---

## Task 12: PR into skin/paraplu and clean up

**Files:** none (git only)

- [ ] **Step 1: Push the chunk branch**

From the worktree on `skin/switch-revisit`:
```bash
git push -u origin skin/switch-revisit
```

- [ ] **Step 2: Open PR targeting skin/paraplu**

```bash
gh pr create --base skin/paraplu --title "feat(switch): visibility refresh — breathing, light bevel, disabled sink (Decision #96)" --body "$(cat <<'EOF'
## Summary
- 2px symmetric breathing inside the 1px border (new dims: xs 32×18, sm 40×22, md 47×26)
- Light-mode bevel tuned to bright highlight + faint shadow (dark unchanged)
- Light-mode disabled sinks to `bg-edge` so the state actually reads

Implements Decision #96. Spec: `docs/superpowers/specs/2026-05-28-switch-revisit-design.md`.

## Test plan
- [x] `npm run check` passes (lint + typecheck + test)
- [x] Preview app `/components/switch` matches `q4-final-composed.html` in both modes
- [x] Existing 9 Switch unit tests still pass (no API change)
EOF
)"
```

- [ ] **Step 3: Squash-merge the chunk PR**

```bash
gh pr merge <number> --squash --delete-branch
```

- [ ] **Step 4: Sync the integration branch in the worktree**

```bash
git checkout skin/paraplu
git pull --ff-only origin skin/paraplu
```

- [ ] **Step 5: Delete the local chunk branch**

```bash
git branch -D skin/switch-revisit
```

The integration worktree stays — `skin/paraplu` won't merge to main until the full skin is shipped.
