# Button Loading — Dual-Dot Chase Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the LED pulse loading animation with a dual-dot chase. The chase displaces both the static LED and any `iconLeft` during loading; both return when loading ends.

**Architecture:** Single-file CSS swap in `tokens.css` (remove `button-led-pulse`, add `button-chase-a/b`). Single-file refactor of `button.tsx`'s `leadingSlot` IIFE — loading branch moves to the top of the order. Tests are rewritten to assert the new `[data-led-chase]` sentinel and the iconLeft-displacement behavior. Docs follow.

**Tech Stack:** TypeScript 5.9, React 19, CVA, Tailwind CSS 4 (arbitrary-value utilities), Vitest + Testing Library, Phosphor Icons.

**Spec:** [`docs/superpowers/specs/2026-05-26-button-loading-chase-design.md`](../specs/2026-05-26-button-loading-chase-design.md)
**Skin principles:** [`docs/SKIN-PRINCIPLES.md`](../../SKIN-PRINCIPLES.md)
**Integration:** chunk of `skin/paraplu`. Lands on the existing open PR `skin/buttons → skin/paraplu` (#1) as additional commits — not a separate PR.

---

### Task 1: Swap `button-led-pulse` for `button-chase-a/b` in tokens.css

**Files:**
- Modify: `packages/ds/src/styles/tokens.css` (replace the "Button LED pulse" block added in PR #1)

- [ ] **Step 1: Find and replace the existing pulse block**

Open `packages/ds/src/styles/tokens.css`. Locate the block introduced by PR #1, starting with the section header comment `/* ── Button LED pulse (loading state) ─────────── */`. Replace the entire block (from the section header through the closing `}` of the `@media (prefers-reduced-motion: reduce)` override) with EXACTLY this:

```css
/* ── Button dual-dot chase (loading state) ───── */

@keyframes button-chase-a {
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.25; }
}

@keyframes button-chase-b {
  0%, 100% { opacity: 0.25; }
  50%      { opacity: 1; }
}

.animate-button-chase-a { animation: button-chase-a 0.9s ease-in-out infinite; }
.animate-button-chase-b { animation: button-chase-b 0.9s ease-in-out infinite; }

@media (prefers-reduced-motion: reduce) {
  .animate-button-chase-a,
  .animate-button-chase-b {
    animation: none;
    opacity: 1;
  }
}
```

Notes:
- "Replace, don't deprecate" (CLAUDE.md): the old `button-led-pulse` keyframe and `.animate-button-led` utility are GONE entirely. No alias, no fallback class.
- Reduced-motion forces `opacity: 1` so both dots stay visibly "lit" when motion is suppressed — the loading state must remain visible.

- [ ] **Step 2: Verify no orphaned references in CSS**

Run: `rg 'button-led-pulse|animate-button-led' packages/ apps/`
Expected: no matches.

- [ ] **Step 3: Verify CSS lints**

Run: `npm run lint`
Expected: PASS, 0 warnings.

- [ ] **Step 4: Commit**

```bash
git add packages/ds/src/styles/tokens.css
git commit -m "refactor(skin): swap button-led-pulse keyframe for button-chase-a/b"
```

---

### Task 2: Rewrite `button.test.tsx` for the chase contract (failing tests)

**Files:**
- Modify: `packages/ds/src/components/button/button.test.tsx` (complete replacement)

This task writes the new contract first. Tests for the chase will fail against the current `button.tsx` (which still uses `data-led` + `data-led-icon` for loading) — that's the TDD red checkpoint.

- [ ] **Step 1: Replace the file contents in full**

Open `packages/ds/src/components/button/button.test.tsx` and replace its entire contents with EXACTLY this:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "./button";

const filledLedVariants = [
  "primary",
  "secondary",
  "destructive",
  "warning",
  "success",
  "outline",
] as const;

describe("Button", () => {
  it("renders a button element with children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: "Click me" })).toBeTruthy();
  });

  describe("LED indicator (resting state)", () => {
    it.each(filledLedVariants)("renders LED on %s variant by default", (variant) => {
      render(<Button variant={variant}>Action</Button>);
      const button = screen.getByRole("button");
      expect(button.querySelector("[data-led]")).toBeTruthy();
    });

    it("does NOT render LED on ghost variant", () => {
      render(<Button variant="ghost">Cancel</Button>);
      const button = screen.getByRole("button");
      expect(button.querySelector("[data-led]")).toBeNull();
    });

    it("does NOT render LED when iconLeft is provided", () => {
      render(
        <Button iconLeft={<svg data-testid="left-icon" />}>Deploy</Button>,
      );
      const button = screen.getByRole("button");
      expect(button.querySelector("[data-led]")).toBeNull();
      expect(screen.getByTestId("left-icon")).toBeTruthy();
    });
  });

  describe("icons", () => {
    it("renders iconLeft before children", () => {
      render(
        <Button iconLeft={<svg data-testid="left-icon" />}>Label</Button>,
      );
      const button = screen.getByRole("button");
      const icon = screen.getByTestId("left-icon");
      const children = Array.from(button.children);
      const iconIndex = children.findIndex((c) => c.contains(icon));
      const labelIndex = children.findIndex((c) => c.textContent === "Label");
      expect(iconIndex).toBeLessThan(labelIndex);
    });

    it("renders iconRight after children", () => {
      render(
        <Button iconRight={<svg data-testid="right-icon" />}>Label</Button>,
      );
      const button = screen.getByRole("button");
      const icon = screen.getByTestId("right-icon");
      const children = Array.from(button.children);
      const iconIndex = children.findIndex((c) => c.contains(icon));
      const labelIndex = children.findIndex((c) => c.textContent === "Label");
      expect(iconIndex).toBeGreaterThan(labelIndex);
    });
  });

  describe("loading (dual-dot chase)", () => {
    it("renders the chase with exactly 2 dots on non-ghost variants", () => {
      render(<Button loading>Loading</Button>);
      const button = screen.getByRole("button");
      const chase = button.querySelector("[data-led-chase]");
      expect(chase).toBeTruthy();
      expect(chase?.children.length).toBe(2);
      expect(chase?.children[0]?.className).toContain("animate-button-chase-a");
      expect(chase?.children[1]?.className).toContain("animate-button-chase-b");
    });

    it("renders the chase even when iconLeft is provided (icon is hidden)", () => {
      render(
        <Button loading iconLeft={<svg data-testid="left-icon" />}>
          Loading
        </Button>,
      );
      const button = screen.getByRole("button");
      expect(button.querySelector("[data-led-chase]")).toBeTruthy();
      expect(screen.queryByTestId("left-icon")).toBeNull();
    });

    it("does NOT render the chase on ghost variant", () => {
      render(
        <Button variant="ghost" loading>
          Cancel
        </Button>,
      );
      const button = screen.getByRole("button");
      expect(button.querySelector("[data-led-chase]")).toBeNull();
    });

    it("does NOT render data-led sentinel when loading", () => {
      render(<Button loading>Loading</Button>);
      const button = screen.getByRole("button");
      expect(button.querySelector("[data-led]")).toBeNull();
    });

    it("does NOT render a separate spinner element when loading", () => {
      render(<Button loading>Loading</Button>);
      const button = screen.getByRole("button");
      expect(button.querySelector("svg.animate-spin")).toBeNull();
    });

    it("sets aria-busy when loading", () => {
      render(<Button loading>Loading</Button>);
      expect(screen.getByRole("button").getAttribute("aria-busy")).toBe("true");
    });

    it("sets aria-busy on ghost when loading", () => {
      render(
        <Button variant="ghost" loading>
          Cancel
        </Button>,
      );
      expect(screen.getByRole("button").getAttribute("aria-busy")).toBe("true");
    });

    it("hides iconRight when loading", () => {
      render(
        <Button loading iconRight={<svg data-testid="right-icon" />}>
          Loading
        </Button>,
      );
      expect(screen.queryByTestId("right-icon")).toBeNull();
    });
  });

  describe("disabled", () => {
    it("sets disabled attribute", () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole("button");
      expect((button as HTMLButtonElement).disabled).toBe(true);
    });
  });

  describe("asChild", () => {
    it("renders child element instead of button", () => {
      render(
        <Button asChild variant="primary">
          <a href="/test">Link</a>
        </Button>,
      );
      const link = screen.getByRole("link", { name: "Link" });
      expect(link).toBeTruthy();
      expect(link.tagName).toBe("A");
      expect(link.getAttribute("href")).toBe("/test");
    });
  });

  describe("className merging", () => {
    it("merges custom className with variant classes", () => {
      render(<Button className="custom-class">Merge</Button>);
      const button = screen.getByRole("button");
      expect(button.className).toContain("custom-class");
    });
  });

  describe("accessibility", () => {
    it("forwards aria-label", () => {
      render(<Button aria-label="Close dialog">X</Button>);
      expect(
        screen.getByRole("button", { name: "Close dialog" }),
      ).toBeTruthy();
    });
  });
});
```

Differences from PR #1's test file:
- The two "pulses the LED" / "pulses the iconLeft wrapper" tests are gone.
- New: "renders the chase with exactly 2 dots", "renders the chase even when iconLeft is provided", "does NOT render the chase on ghost variant", "does NOT render data-led sentinel when loading", "sets aria-busy on ghost when loading".
- The previous review gap (ghost + loading not covered) is closed by the new ghost-loading tests.

- [ ] **Step 2: Run the tests — they MUST fail**

Run: `npm run test -w @stasho/ds -- button`
Expected: multiple failures. The current `button.tsx` (from PR #1) renders `data-led-icon` when iconLeft is provided during loading, has no `data-led-chase` sentinel, and applies `animate-button-led` instead of `animate-button-chase-*`. Specifically, expect failures on:
- "renders the chase with exactly 2 dots on non-ghost variants" (no `[data-led-chase]` in DOM)
- "renders the chase even when iconLeft is provided" (chase missing; iconLeft still rendered)
- "does NOT render the chase on ghost variant" (passes vacuously — chase doesn't exist anywhere — but keep it for the future contract)
- "does NOT render data-led sentinel when loading" (current code still emits `data-led` when loading without iconLeft)

The remaining tests should still pass — the resting-state LED contract and the rest of the suite are unchanged.

- [ ] **Step 3: Commit the failing tests as a checkpoint**

```bash
git add packages/ds/src/components/button/button.test.tsx
git commit -m "test(button): describe dual-dot chase loading contract (failing)"
```

This documents the new contract before any implementation lands.

---

### Task 3: Restructure `button.tsx` `leadingSlot` for the chase

**Files:**
- Modify: `packages/ds/src/components/button/button.tsx` (replace the `leadingSlot` IIFE and remove the icon-as-LED logic)

- [ ] **Step 1: Read the current file**

Open `packages/ds/src/components/button/button.tsx`. The file currently (after PR #1) has:
- An `iconGlowClass` Record used to glow iconLeft on filled variants AND to apply during loading via the icon-as-LED wrapper.
- A `showLed` variable: `const showLed = !iconLeft && v !== "ghost";`
- A `leadingSlot` IIFE with `if (iconLeft) { ...maybe with data-led-icon + animate-button-led... } if (showLed) { ...maybe with animate-button-led... } return null;`

All of those need to change.

- [ ] **Step 2: Replace the leadingSlot IIFE**

Find the block that starts:

```tsx
    const showLed = !iconLeft && v !== "ghost";

    const leadingSlot = (() => {
```

…and ends with the IIFE's closing `})();`. Replace that entire block (including the `showLed` line above it) with EXACTLY this:

```tsx
    const leadingSlot = (() => {
      // Loading replaces everything in the leading slot (except on ghost).
      if (loading && v !== "ghost") {
        return (
          <span
            data-led-chase
            aria-hidden="true"
            className="inline-flex shrink-0 gap-[3px]"
          >
            <span
              className={cn(
                "inline-block rounded-full",
                ledSizeClass[s],
                ledColorClass[v],
                "animate-button-chase-a",
              )}
            />
            <span
              className={cn(
                "inline-block rounded-full",
                ledSizeClass[s],
                ledColorClass[v],
                "animate-button-chase-b",
              )}
            />
          </span>
        );
      }
      // Resting state with iconLeft.
      if (iconLeft) {
        return (
          <span
            aria-hidden="true"
            className={cn(
              "inline-flex items-center justify-center shrink-0",
              iconSizeClass[s],
              iconGlowClass[v],
            )}
          >
            {iconLeft}
          </span>
        );
      }
      // Resting state with static LED (non-ghost variants).
      if (v !== "ghost") {
        return (
          <span
            data-led
            aria-hidden="true"
            className={cn(
              "inline-block rounded-full shrink-0",
              ledSizeClass[s],
              ledColorClass[v],
            )}
          />
        );
      }
      return null;
    })();
```

Notes:
- The `data-led-icon` attribute is gone — chase fully owns the loading visual, so the icon-as-LED escape hatch is no longer needed.
- The iconLeft wrapper no longer carries `loading && "animate-button-led"`. iconLeft only appears at rest.
- The static LED span no longer carries `loading && "animate-button-led"`. The LED only appears at rest.

- [ ] **Step 3: Run the tests — they MUST now pass**

Run: `npm run test -w @stasho/ds -- button`
Expected: 22/22 tests PASS (the chase contract from Task 2 + the unchanged resting-state and accessibility tests).

If any test fails: inspect the failure, do NOT silence by mutating the test. The `leadingSlot` order is the most likely root cause — ensure the `loading && v !== "ghost"` branch is first.

- [ ] **Step 4: Run typecheck**

Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 5: Run lint**

Run: `npm run lint`
Expected: PASS, 0 warnings.

- [ ] **Step 6: Commit**

```bash
git add packages/ds/src/components/button/button.tsx
git commit -m "feat(skin): replace LED pulse with dual-dot chase loading"
```

---

### Task 4: Preview app cleanup — drop iconLeft-loading section and exploration page

**Files:**
- Modify: `apps/preview/src/app/components/button/page.tsx`
- Delete: `apps/preview/src/app/loading-explore/page.tsx` (and its directory)

- [ ] **Step 1: Drop the "Loading with iconLeft" DemoSection**

Open `apps/preview/src/app/components/button/page.tsx`. Locate the block:

```tsx
      <DemoSection title="Loading with iconLeft">
        <div className="flex flex-wrap items-center gap-3">
          {variants.map((v) => (
            <Button
              key={v}
              variant={v}
              loading
              iconLeft={<PlaceholderIcon label="Add" />}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </Button>
          ))}
        </div>
      </DemoSection>
```

Delete the entire `<DemoSection>...</DemoSection>` block. The previous demo showed iconLeft pulsing — with the chase model, iconLeft is hidden during loading and the result is visually identical to the "Loading" section above it. Keeping the section would render the same chase twice with no information value.

After deletion the file should flow: `Loading` → `Disabled` → `As Link` (skipping the previous iconLeft-loading section).

- [ ] **Step 2: Delete the throwaway exploration page**

Run:

```bash
rm -rf apps/preview/src/app/loading-explore/
```

This removes both `page.tsx` and the (now empty) directory. The page was uncommitted exploration; nothing depended on it.

- [ ] **Step 3: Run typecheck**

Run: `npm run typecheck`
Expected: PASS. No remaining references to `loading-explore` should exist.

- [ ] **Step 4: Run lint**

Run: `npm run lint`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/preview/src/app/components/button/page.tsx
git commit -m "chore(preview): drop redundant Loading-with-iconLeft demo for dual-dot chase"
```

(The exploration page deletion is untracked — `git add` ignores it since it was never committed. The deletion is invisible in git history, which is correct: the file never landed on any branch.)

---

### Task 5: Update `docs/DESIGN-SYSTEM.md` Button section

**Files:**
- Modify: `docs/DESIGN-SYSTEM.md` (only the "Loading and Disabled" subsection inside the Button section)

- [ ] **Step 1: Find the Loading and Disabled code block**

Find the `#### Loading and Disabled` heading under `### Button`. Below it is a single ```tsx code block. The current content is:

```tsx
<Button loading>Saving…</Button>          {/* LED pulses; no spinner element; aria-busy */}
<Button loading iconLeft={<PlusIcon />}>
  Saving…
</Button>                                  {/* Icon pulses instead of LED */}
<Button disabled>Unavailable</Button>      {/* Chassis flattens; LED dims to muted gray */}
```

- [ ] **Step 2: Replace with the new content**

Replace the contents of that code block with EXACTLY this:

```tsx
<Button loading>Saving…</Button>          {/* Dual-dot chase; no spinner element; aria-busy */}
<Button loading iconLeft={<PlusIcon />}>
  Saving…
</Button>                                  {/* iconLeft is suppressed during load; chase replaces it */}
<Button disabled>Unavailable</Button>      {/* Chassis flattens; LED dims to muted gray */}
```

The rest of the Button section (Variants, Sizes, Icons, As Link, Custom composition) stays unchanged.

- [ ] **Step 3: Verify nothing else changed**

Run: `git diff docs/DESIGN-SYSTEM.md`
Expected: a 3-line diff inside the Loading and Disabled code block, nothing else.

- [ ] **Step 4: Commit**

```bash
git add docs/DESIGN-SYSTEM.md
git commit -m "docs(design-system): update Button loading copy for dual-dot chase"
```

---

### Task 6: Update DECISIONS / ARCHITECTURE / CLAUDE / BACKLOG

**Files:**
- Modify: `docs/DECISIONS.md` (prepend Decision #81)
- Modify: `docs/ARCHITECTURE.md` (replace the Button "Loading animation" paragraph)
- Modify: `CLAUDE.md` (update the Button bullet in Current Features)
- Modify: `docs/BACKLOG.md` (touch up the archive entry for accuracy)

All four ship in one commit.

- [ ] **Step 1: Prepend Decision #81 to `docs/DECISIONS.md`**

Find the `## Decision #80 — 2026-05-26` heading. Insert ABOVE it (immediately under the `---` separator that follows the `## Decision #79` block, and immediately before `## Decision #80`):

```markdown
## Decision #81 — 2026-05-26

**Context:** PR #1 (skin/buttons) shipped the redesigned Button with a single-LED pulse animation for loading (`button-led-pulse` keyframe; opacity + halo grow/shrink). During visual review the treatment read passive — "blinking status light" — and didn't reinforce the Abyssal Void skin's "voltage / signal / instrument" identity (Decisions #77, #78, #79). Five alternatives were prototyped at `/loading-explore`: pulse (baseline), horizontal scanline sweep, bottom-edge telemetry bar, sonar ring expansion, dual-dot chase. The dual-dot chase was selected for its active "busy / working" reading and its visual coherence with the LED-as-signature language. A separate question — what happens to consumer-provided iconLeft during loading — was tested with three options (chase replaces iconLeft, iconLeft pulses, chase + iconLeft both visible). The "chase replaces iconLeft" model was chosen.
**Decision:** Replace `@keyframes button-led-pulse` and `.animate-button-led` with `@keyframes button-chase-a` / `@keyframes button-chase-b` and `.animate-button-chase-a` / `.animate-button-chase-b`. The loading state renders `<span data-led-chase>` containing two `<span>` dots (each at the variant's existing LED size + color) animating opacity 1 ↔ 0.25 at 0.9s ease-in-out infinite in anti-phase. The chase displaces both the static LED and any `iconLeft` — loading always looks the same shape regardless of whether iconLeft was passed. When loading ends, iconLeft (or the static LED) returns to the leading slot. Ghost variant: no chase, only `aria-busy` + `cursor-wait`. Reduced-motion parks both dots at opacity 1 (the loading state must remain visible without motion). Supersedes the loading-state portion of Decision #80; the rest of #80 (variants, sizes, typography, geometry, focus model, disabled flatten, semantic palette) stands.
**Rationale:** The dual-dot chase reads as "active processing" rather than "passive status light" — the alternation between two LEDs implies signal flow, matching the "instrument panel" mental model. Replacing iconLeft during loading (rather than pulsing it) gives a shape-stable loading state — every loading button looks the same, which is the right call for a control surface where consistent affordances matter more than preserving the resting-state icon. Forcing the dots to opacity 1 (not 0.25) under reduced-motion ensures the loading state still reads as "lit" — the chase IS the loading signal, so it has to be visible even when motion is suppressed. Speed at 0.9s was tested against 0.6s (twitchy) and 1.2s (sleepy); 0.9s sits in the comfortable middle. Dot count was tested at 2 (chosen — minimum for "alternating signal") and 3 (rejected — KITT-style scanner reads pop-culture and graphic rather than restrained).
**Alternatives considered:** Scanline sweep (rejected — reads "scanning the surface" rather than "instrument doing the work"; loud at saturated chassis colors). Bottom telemetry bar (rejected — too close to standard progress-bar UI; reads as "button has a progress bar inside" rather than as the button's own loading state; strong second place). Sonar ring (rejected — rings escape chassis bounds, loading state grows visually larger than rest). iconLeft pulses instead of chase (rejected — two different loading "shapes" depending on consumer input). Chase + iconLeft both visible (rejected — width grows when loading starts; layout shift). 3-dot KITT chase (rejected — too pop-culture, not restrained). 0.6s speed (rejected — twitchy). 1.2s speed (rejected — sleepy). Keep `button-led-pulse` as a parallel API (rejected — replace, don't deprecate; no backward-compatible shim).

---
```

Make sure the trailing `---` separator + blank line sits between Decision #81 and Decision #80.

- [ ] **Step 2: Replace the Button "Loading animation" paragraph in `docs/ARCHITECTURE.md`**

Open `docs/ARCHITECTURE.md`. Find the `### Button` subsection (added in PR #1, just before `## Testing Philosophy`). Inside that subsection, locate the paragraph that begins:

```
**Loading animation.** The `animate-button-led` class is applied to either the LED span or the iconLeft wrapper depending on which is present.
```

Replace that ENTIRE paragraph (everything from `**Loading animation.**` through the end of that paragraph, up to but not including the next `**...**` paragraph header) with EXACTLY this:

```
**Loading animation.** When `loading={true}` and the variant is not `ghost`, the leading slot renders `<span data-led-chase>` containing two dots that animate in anti-phase via `animate-button-chase-a` and `animate-button-chase-b` (keyframes in `tokens.css`). The chase displaces both the static LED and any consumer-provided iconLeft for the duration of the loading state. The two dots share the variant's existing LED color mapping (cyan / white / dark per variant). `prefers-reduced-motion: reduce` parks both dots at opacity 1 so the loading state stays visible without motion. On the `ghost` variant, no chase renders — `aria-busy` and `cursor-wait` are the only loading signals.
```

The other Button architecture paragraphs (LED render logic, Focus ring, Disabled flatten, asChild limitation) stay unchanged. Note: the "LED render logic" paragraph mentions the icon-as-LED behavior — that paragraph also needs touching up.

- [ ] **Step 3: Touch up the "LED render logic" paragraph in `docs/ARCHITECTURE.md`**

Within the same Button subsection, find the paragraph that begins `**LED render logic.**`. Replace its content (everything from `**LED render logic.**` through the end of the paragraph) with EXACTLY this:

```
**LED render logic.** The LED `<span data-led>` renders at rest when `!iconLeft && variant !== 'ghost'`. When iconLeft is provided on a non-ghost variant, iconLeft takes the LED's leading slot (with the variant's resting glow filter on filled variants). When the variant is `ghost`, no LED renders even without an icon — ghost is the quiet escape hatch. During loading, none of this matters — the chase replaces whatever was in the leading slot (see "Loading animation" below).
```

- [ ] **Step 4: Update the Button bullet in `CLAUDE.md`**

Open `CLAUDE.md`. Find the existing Button bullet in the Current Features list:

```
- Button component with 7 variants (primary, secondary, destructive, warning, success, outline, ghost), 3 sizes (xs/sm/md), CVA architecture, instrument-panel chassis with cyan LED signature, iconLeft inherits LED glow, loading state pulses the LED (or iconLeft) via `animate-button-led` keyframe, focus uses native `outline-accent`
```

Replace with EXACTLY this:

```
- Button component with 7 variants (primary, secondary, destructive, warning, success, outline, ghost), 3 sizes (xs/sm/md), CVA architecture, instrument-panel chassis with cyan LED signature, iconLeft inherits LED glow at rest, loading state runs a two-dot chase (chase displaces iconLeft) via `animate-button-chase-a` / `animate-button-chase-b` keyframes, focus uses native `outline-accent`
```

- [ ] **Step 5: Touch up the BACKLOG archive entry for accuracy**

Open `docs/BACKLOG.md`. Find the line (added in PR #1):

```
- [x] 2026-05-26 — Button redesign as instrument-panel control (LED signature, 7 variants, 3 sizes, sentence case Inter, loading via LED pulse)
```

Replace with:

```
- [x] 2026-05-26 — Button redesign as instrument-panel control (LED signature, 7 variants, 3 sizes, sentence case Inter, loading via dual-dot chase)
```

- [ ] **Step 6: Verify scope of the diff**

Run: `git diff --stat`
Expected: exactly 4 files changed — `docs/DECISIONS.md`, `docs/ARCHITECTURE.md`, `CLAUDE.md`, `docs/BACKLOG.md`. No other files.

- [ ] **Step 7: Commit**

```bash
git add docs/DECISIONS.md docs/ARCHITECTURE.md CLAUDE.md docs/BACKLOG.md
git commit -m "docs: add Decision #81 and update ARCHITECTURE/CLAUDE/BACKLOG for chase"
```

---

### Task 7: Final repo check + push to PR #1

**Files:** none (verification + push only)

- [ ] **Step 1: Run `npm run check`**

Run: `npm run check`
Expected: lint 0/0, typecheck PASS, all DS tests pass. The button suite count should now be 22 (8 LED + icons + 9 chase loading + 1 disabled + 1 asChild + 1 className + 1 accessibility + 1 basic).

If anything fails, root-cause and fix — DO NOT bypass with `--no-verify`.

- [ ] **Step 2: Search for orphaned references**

Run:

```bash
rg 'button-led-pulse|animate-button-led|data-led-icon' apps/ packages/ docs/
```

Expected: NO matches anywhere in code or docs.

If any match appears, investigate before pushing — there's an orphaned reference that needs cleanup.

- [ ] **Step 3: Push to the existing PR branch**

```bash
git push origin skin/buttons
```

PR #1 (`skin/buttons → skin/paraplu`) will pick up the new commits automatically.

- [ ] **Step 4: Update PR #1 description**

The PR description needs the chase to appear in the Summary section. Run:

```bash
gh pr edit 1 --body "$(cat <<'EOF'
## Summary

- Replaces the generic gradient Button with an instrument-panel chassis + cyan LED signature
- 7 variants (added `success`, renamed `text` → `ghost`), 3 sizes (dropped `lg`)
- Typography: Inter 700 sentence case + `leading-none`
- Loading state runs a dual-dot chase in the leading slot (`animate-button-chase-a` / `animate-button-chase-b`) — chase displaces iconLeft during loading; iconLeft returns on completion
- Focus uses native `outline-accent` so the bevel stays intact under focus
- Adds `@keyframes button-chase-a` / `button-chase-b` to `tokens.css`

Specs:
- `docs/superpowers/specs/2026-05-26-button-redesign-design.md` (original redesign)
- `docs/superpowers/specs/2026-05-26-button-loading-chase-design.md` (loading revision)

Decisions: #80 (redesign), #81 (loading revision — supersedes #80's loading-state portion only)

## Breaking changes for consumers

- `variant="text"` → `variant="ghost"`
- `size="lg"` → `size="md"`
- Visual appearance changes drastically. Consumer apps (scheduler-dashboard, cloud-app) need their own follow-up migration once `@stasho/ds` re-publishes.

## Follow-ups (not in this PR)

- **DESIGN-SYSTEM.md package-name sweep:** ~59 remaining `@aleph-front/ds` references in non-Button sections. Pre-existing staleness — not introduced by this change.
- **ARCHITECTURE.md package-name sweep:** active `@aleph-front/ds` references describing the package layout.
- **Open backlog migrations:** two BACKLOG entries reference `@aleph-front/ds/progress-bar` and `@aleph-front/ds/stepper` — rename when the migration ships.
- **`asChild` doesn't forward `disabled`:** for `<a>` children, browser-level `disabled` is semantically meaningless; a proper fix would need `aria-disabled` + href removal + onClick block. Plan did not request this; deferring as a design conversation.
- **`iconRight` removal on loading causes layout shift:** the slot is removed (not visibility-hidden), so button width contracts mid-load. Preserving the slot width is a separate design call.

## Test plan

- [x] `npm run check` passes (lint 0/0, typecheck clean, all tests pass across both workspaces)
- [x] All 7 variants render in `apps/preview` at `/components/button` with correct LED + chase treatment
- [x] iconLeft inherits cyan glow on filled variants at rest; chase replaces it during loading
- [x] Loading row shows two-dot chase on every applicable variant
- [x] Ghost variant + loading: only `cursor-wait` + `aria-busy`, no chase
- [x] Disabled row flattens chassis and dims LED
- [x] As Link (asChild) renders Primary Link with chassis + LED, Ghost Link as pure text
EOF
)"
```

- [ ] **Step 5: Wait for review and merge**

The user reviews the PR and squash-merges. Do NOT auto-merge.

---

### Task 8: Post-merge sync of `skin/paraplu`

(This is unchanged from the original plan's Task 9 — included here as a reminder for the controller.)

- [ ] **Step 1: After user merges PR #1, sync the integration branch**

```bash
git checkout skin/paraplu
git pull --ff-only origin skin/paraplu
git branch -D skin/buttons
```

- [ ] **Step 2: Remove the chunk worktree if separate from integration**

The current worktree (`/Users/dio/Library/CloudStorage/Dropbox/Claudio/repos/stasho-ds/.claude/worktrees/skin+paraplu`) is the integration worktree for `skin/paraplu`. Leave it intact. There is no separate chunk worktree — chunk work happened in-place by checking out `skin/buttons` from this worktree.

`skin/paraplu` itself merges to `main` later when the full Abyssal Void integration is complete (per Decision #79 and CLAUDE.md's integration-branch model).

---

### Task 9: Update docs (final checklist)

Verification list — each item should have been completed in an earlier task.

- [ ] DESIGN-SYSTEM.md — Loading and Disabled subsection (Task 5) ✓
- [ ] ARCHITECTURE.md — Loading animation paragraph + LED render logic paragraph (Task 6 Steps 2–3) ✓
- [ ] DECISIONS.md — Decision #81 added (Task 6 Step 1) ✓
- [ ] BACKLOG.md — archive entry touched up (Task 6 Step 5) ✓
- [ ] CLAUDE.md — Current Features Button bullet updated (Task 6 Step 4) ✓

If any are not done, return to the relevant task and complete it before merging.
