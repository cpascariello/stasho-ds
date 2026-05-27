# Abyssal Void · Skin Principles

The principles that make Abyssal Void feel like Abyssal Void. Use this when designing or restyling any component — it's the north star for decisions the existing skin spec doesn't explicitly cover.

For full rationale behind any rule, follow the linked decision (`#N` in `docs/DECISIONS.md`). For consumer-facing component docs, see `docs/DESIGN-SYSTEM.md`. For implementation patterns and internals, see `docs/ARCHITECTURE.md`.

---

## 1 · Identity

### What it is

- **Aesthetic:** dark, scientific, abstract. The system feels like a control surface for something serious — research equipment, deep-sea probes, spacecraft consoles.
- **Mental model:** the user is operating an instrument panel. Components are switches, gauges, readouts, indicators — not friendly stickers or marketing cards.
- **Energy:** voltage / signal. Cyan `#00E1FA` is the system's constant pulse — the indicator that something is live, active, listening. Semantic colors are alarms (blood-orange = abort, amber = caution, teal-green = nominal).
- **Geometry:** committed and brutalist, but restrained. Sharp 0px corners on functional surfaces. No decoration. No noise. No grain. Mass comes from saturation, not from texture.
- **Voice:** spare and factual. Sentence case in UI, uppercase in telemetry. No exclamation points, no emoji, no marketing adjectives.

### What it isn't

- **Not friendly** — no soft curves, no pastel palette, no smiling iconography.
- **Not consumer** — not aimed at "delight"; aimed at clarity for someone who knows what they're doing.
- **Not gradient-heavy** — gradients exist (primary chassis, semantic halos) but are functional, not decorative. No "rainbow" or "vibrant" backgrounds.
- **Not rounded** — pill buttons, bubble cards, and rounded inputs read as a different system entirely.
- **Not textured** — no grain, no noise, no patterned fills. Decoration is rejected entirely (`fx-grain` was removed for this reason — Decision #79).
- **Not headline-driven** — buttons are pressable hardware controls, not page headers. Avoid heading-weight typography on interactive elements.

---

## 2 · Color

### Same-hex rule
**Rule:** Accent tokens (`--primary`, `--accent`, `--success`, `--warning`, `--error`) hold the same hex value in `:root` and `.theme-dark`.
**Why:** Saturated colors at mid-to-low lightness read identically across modes (Radix / Geist convention). Drift between dark and light variants creates a system that feels like two skins glued together.
**How:** Only surface/background/foreground tokens differ between modes. Never create `--primary-dark` / `--primary-light` siblings. The rule applies to **filled chassis fills and glows** — Primary's chassis uses the same gradient (`primary-400 → primary-500`) in both modes, and saturated semantic chassis hold their hex. It does NOT bind **outline chrome** (border + text), which can shift to a contrast-paired accent in light mode (e.g., Button Outline uses `text-accent`/`border-accent` in dark mode but `text-primary`/`border-primary` in light, per Decision #82). For body text where AA contrast against light surfaces is a risk, use a scale step (`text-primary-700 dark:text-primary-300`) rather than a different hex.
**Source:** Decisions #77, #78, #82.

### Semantic color mapping
**Rule:** Each accent has one job. Don't redirect them.

| Token | Role |
|---|---|
| `--primary` `#0040FF` | The brand action. The thing the user came to do. |
| `--accent` `#00E1FA` | "This is live / active / listening." The signal pulse. Used as LED, focus ring, link, and outline border. |
| `--error` `#FF3D00` | Destructive / abort / down. The one heat note in an otherwise cold palette. |
| `--warning` `#ffc53d` | Caution. Pending consequences. |
| `--success` `#2BD58E` | Confirm / complete / nominal. |

**How:** Don't use `--success` for "selected" or `--accent` for "warning". The role mapping is what makes the palette legible at a glance.
**Source:** Decisions #78, #79.

**Active states.** Selected / checked / active states on form controls, navigation, and informational surfaces use `--accent`. Components: Switch, Slider, Checkbox, Radio, active Tab, active Breadcrumb, ProgressBar, **Pagination current page**, **Stepper active + completed indicators**, **Alert `info` variant**. Primary's chassis role (Button only) is preserved. **Light-mode body text carve-out:** saturated semantic tokens at mid lightness (cyan L≈0.84, amber L≈0.83, teal L≈0.78) fail AA contrast on light surfaces. UI text colored by these tokens uses the `<token>-500` scale step in light mode: `text-accent-500 dark:text-accent`, `text-warning-500 dark:text-warning`, `text-success-500 dark:text-success`, `text-error-500 dark:text-error`. Borders and tinted backgrounds (`bg-<token>/15`) stay same-hex — those are chassis surfaces that lean on accent text on top of them to carry the active signal.
**Source:** Decisions #86, #88.

### No decorative texture
**Rule:** No grain, noise, patterns, or texture fills on any surface.
**Why:** The skin's depth comes from gradient + halo + bevel — visual mass from light, not from material. Texture conflicts with that vocabulary and pulls the system toward "designed object" instead of "control instrument".
**How:** If a surface feels flat, reach for a halo, bevel, or hairline border. Never reach for grain.
**Source:** Decision #79 (fx-grain removal).

### Surface ladder
**Rule:** Dark mode uses the Observatory Mono ladder: `#07080a → #0d0d0d → #101111 → #161718`. Light mode uses faintly violet-tinted off-white at hue 270.
**Why:** A neutral ladder reads tonally empty against the saturated accents; the warm-violet floor (`#07`) gives surfaces presence without competing with brand colors. Light mode's hue 270 ties surfaces to the brand even when the actual primary is removed from the background.
**How:** Use semantic tokens (`--background`, `--surface`, `--muted`) — don't pull scale colors directly for surfaces. New elevations get a new semantic token, not an arbitrary OKLCH value.
**Source:** Decisions #77, #78.

### Hairline borders
**Rule:** Borders use `rgba(255,255,255,0.08)` (or the `--edge` token), 1px width, never accent-tinted.
**Why:** Accent-tinted chrome dilutes accents as content signals. A cyan-bordered card competes with a cyan-LED button for the user's "this is live" eye.
**How:** All chrome is white-at-low-opacity (or the `--edge` token). Accents only appear where they carry meaning — LED, focus ring, link text, active indicators.
**Source:** Decision #78.

---

## 3 · Typography

### Three voices, never mixed at the same role

| Face | Role | Case |
|---|---|---|
| **Anybody** | Headings (page titles, section headers) | Title or sentence case |
| **Inter** | Body, interactive labels, captions | Sentence case |
| **Departure Mono** | Telemetry, micro-labels, ALL CAPS chrome, mono data | Uppercase preferred |

**Rule:** A given role uses one face. Don't mix Anybody and Inter for headings; don't mix Inter and Departure Mono for buttons.
**Why:** Each face carries a register. Mixing them muddles the voice. Anybody is editorial-industrial; Inter is operational; Departure is instrument-readout. Stay in lane.
**Source:** Decisions #77, #78.

### Sentence case for UI
**Rule:** Buttons, inputs, menu items, links, and body labels are sentence case. Never `text-transform: uppercase` on Inter.
**Why:** Uppercase tracked Inter reads as a heading or banner — not as a pressable control. The brutalist character comes from geometry (0px, hard halos), not from caps.
**How:** Respect the consumer's string verbatim. If you find yourself wanting CAPS for emphasis, you probably want Departure Mono instead.
**Source:** Button redesign spec (`docs/superpowers/specs/2026-05-26-button-redesign-design.md`).

### Uppercase belongs to Departure Mono
**Rule:** Where uppercase is correct (telemetry labels, axis ticks, status chips, system chrome), use Departure Mono.
**Why:** Departure Mono's pixel-CRT proportions match the "probe readout" role. Uppercase Inter trying to do the same job ends up reading as marketing copy.

### Line-height: 1 for compact controls
**Rule:** Buttons, chips, badges, and any control where a glyph (LED, icon) must vertically center against text use `line-height: 1`.
**Why:** Inter's default 1.5 line-height creates a line-box taller than cap-height, leaving a small glyph (4–6px LED, 11–13px icon) floating relative to lowercase x-height.
**How:** Apply `line-height: 1` on the control + wrap the label in a flex span so vertical centering operates against the actual text bounds, not the inflated line-box.

### Anybody is for headings only
**Rule:** Page titles, section headers, dialog titles. Never on labels, chips, links, controls, tab triggers, or anywhere a user reads the text as part of operating the UI.
**Why:** Anybody is editorial-industrial. Applied to labels it reads as a poster headline grafted onto a control surface — the system feels "themed" rather than coherent.
**Source:** Decision #83.

### Departure Mono is the telemetry voice
**Rule:** Status chips, column headers, numeric indices, version strings, ID strings, telemetry micro-labels. Force uppercase via CSS at the component level where the role is unambiguous (Badge, Alert variant label) — apply `uppercase` utility selectively where consumer strings might want mixed case (e.g., Table headers when consumers pass already-uppercase strings).
**Why:** Departure Mono's pixel-CRT proportions carry "this is system-emitted data" in a way Inter cannot. Forcing uppercase keeps the vocabulary consistent across consumer surfaces without depending on usage discipline.
**Source:** Decision #83.

### No italic on interactive labels
**Rule:** Italic stays out of buttons, chips, links, headers, tab triggers, breadcrumb items, and badges. Italic is allowed on running prose where the register adds something (Alert message body).
**Why:** Italic on a label reads as "secondary / supporting" — wrong register for "press this" or "current location." The first generation of the skin used italic as decoration; the new generation drops it from labels and keeps it for prose.
**Source:** Decision #83.

---

## 4 · Geometry

### 0/0/2/4 radius vocabulary
**Rule:** Sharp by default. Cards earn 2px. Modals earn 4px. Anything more is wrong for this skin.

| Element | Radius |
|---|---|
| Buttons, inputs, selects, chips, dropdowns, toasts | `0` |
| Cards | `2px` |
| Modals, dialogs | `4px` |

**Why:** The 0/0/2/4 ladder pushes the brutalist character at every interactive surface, and reserves rounding for the few elements where it carries meaning (cards as physical objects, modals as floating overlays).
**Source:** Decision #78.

### Surface radii by role

| Role | Tailwind class | Pixels | Components |
|---|---|---|---|
| Popovers | `rounded-none` | 0px | Tooltip, Select/Combobox/MultiSelect dropdowns, Tabs overflow DropdownMenu |
| Modals | `rounded-xl` | 4px | Dialog |
| Cards | `rounded-lg` | 2px | Card |
| Round-by-design | `rounded-full` | — | StatusDot, Slider thumb, Switch thumb, ProgressBar tracks, MultiSelect tag chips, Stepper indicators, Tabs pill variant |

Tooltip is a popover, not a card — the radius reflects its role. The Abyssal radius scale maps `rounded-sm / rounded-md` to 0px, `rounded-lg` to 2px, `rounded-xl` to 4px; reach for the semantic class that matches the intended pixel value rather than guessing from shadcn-era defaults.
**Source:** Decision #87.

### `full` is for round-by-design only
**Rule:** `rounded-full` is reserved for elements where roundness is the semantic, not decoration:

- StatusDot (a dot IS round)
- Slider thumb (a control puck IS round — same convention argument as Switch, but the visual difference at 16px between square and round thumb is functionally invisible AND Slider thumb shipped with `rounded-full` in chunk 4 as part of the bevel + LED treatment; kept for now, flagged for the rounded-full audit chunk)
- ProgressBar track (the rounded ends are a graph convention)
- MultiSelect tag chips (tags carry "soft / removable" semantics) — **still flagged for audit**

**Why:** Once you allow `rounded-full` on a button or input, the entire vocabulary collapses — every component starts asking "but should I be round?". The reserved list keeps the rule legible. The list is "round-by-design only, never round-by-convention" — entries need a semantic reason for the round shape, not a precedent from other DSs.
**How:** Adding a new element to this list requires a decision in `docs/DECISIONS.md`.
**Source:** Decisions #86 (Tabs pill removed), #88 (Switch track + thumb removed; Stepper indicators removed). MultiSelect chips and Slider thumb carry the same convention-only justification and should be revisited in a dedicated rounded-full audit chunk.

### Hairline borders, never thick
**Rule:** 1px borders. No `border-2`, no `border-3`.
**Why:** Thick borders read as styling, not structure. The skin's mass comes from saturation and halo, not from chrome.

### No accent-tinted chrome
**Rule:** Borders, dividers, separators are white-at-low-opacity, never accent-colored.
(See Color § Hairline borders for the full rule.)

---

## 5 · Motion

### Cyan is the moving signal
**Rule:** The cyan `--accent` is the system's animation budget. It pulses, glows, slides, and intensifies. Other colors hold still.
**Why:** A moving cyan reads as "live / active / loading / focused" — the same eye-attractor across all interactive states. If destructive red or warning amber also moved, the system would have three competing "look here" signals.
**How:** Loading pulses the LED. Focus is a cyan ring. Active states intensify cyan halos. Hover brightens cyan glows. Other colors transition position/opacity but don't independently animate.

### Bevels for hardware feel
**Rule:** Interactive chassis (buttons, switches, sliders) use inset top-highlight + inset bottom-shadow to read as a physical, lit object.
**Why:** A flat-fill button reads as a clickable area. A beveled button reads as a control. This is the difference between "the screen contains a button" and "the screen contains an instrument".
**How:** Pair `inset 0 1px 0 [highlight]` + `inset 0 -1px 0 [shadow]` on filled variants. Use cyan-tinted highlight (`rgba(0,225,250,0.4)`) on primary; white-tinted (`rgba(255,255,255,0.3)`) on saturated semantic chassis.

### Active states depress
**Rule:** Pressed/active controls invert the bevel (dark top, light bottom) AND shift `translate-y-[1px]`.
**Why:** Two cues for "pressed" — visual (bevel inversion) and positional (downward nudge) — together read as a real physical press. One cue alone is ambiguous.

### `prefers-reduced-motion` is mandatory
**Rule:** Every animated component respects `prefers-reduced-motion: reduce`. Continuous animations stop; transitions become instant.
**Why:** Motion is a system signal here, and accessibility law for users with vestibular sensitivities.
**How:** Tailwind `motion-reduce:animate-none` on continuous loops; `motion-reduce:transition-none` on one-shot transitions. No JS-driven motion that bypasses the media query.
**Source:** Decision #39.

### Short ease curves, no bounce
**Rule:** Transitions are 80–200ms with `ease` or `ease-out`. No spring bounces, no overshoot, no elastic.
**Why:** Bounce is friendly. Friendly is rejected (see Identity § What it isn't).

---

## 6 · Component patterns

These are the patterns we've discovered while building components for this skin. New components should follow them by default; departures require a decision entry.

### LED-as-signature for filled interactive controls
**Rule:** Filled controls (buttons, primary selects, action chips) carry a small glowing LED dot or glowing icon in the leading slot.
**Why:** The LED is the brand's primary visual signature in this skin. It says "this is an active hardware control" in a way no other element can.
**How:** Cyan LED on primary/secondary chassis. Variant-specific LED on saturated semantic chassis (white on destructive, dark on warning/success). When `iconLeft` is provided, it replaces the LED and inherits the LED's color + glow.
**Source:** Button redesign spec.

### Hover intensifies, doesn't repaint
**Rule:** Hover keeps the chassis static and lets the bevel / LED / halo carry the change. It does NOT shift the chassis to a different color.
**Why:** Repainting on hover reads as "different state". Intensifying on hover reads as "same state, but the system noticed you". The instrument metaphor is "the indicator gets brighter when you reach for it", not "the indicator changes color when you reach for it".
**How:** For filled variants (Primary, Secondary), the chassis gradient stays at its resting steps. The inset bevel highlight strengthens (e.g., cyan top from 0.55 → 0.7), and a chassis-matching outer halo appears (see § Filled chassis below). For semantic variants (destructive / warning / success), the existing rest-state outer halo grows from 24px → 40px and intensifies from 0.5 → 0.75 opacity.
**Source:** Decision #82.

### Loading pulses, never spins
**Rule:** Loading state animates the existing LED (or icon-as-LED) with a glow/opacity pulse. No spinner swap.
**Why:** A separate spinner element breaks the "the LED is the signal" thesis — suddenly there's a different moving thing. The LED already exists, already signals "live"; the loading state is just "the signal is now pulsing".
**How:** `@keyframes` that cycles glow box-shadow from `0 0 4px` to `0 0 14px + 0 0 24px halo` over ~1.1s. The label can be appended with "…" if helpful.
**Source:** Button redesign spec.

### Saturated semantic chassis = solid + outer halo
**Rule:** Destructive, warning, success chassis are solid saturated brand colors. Add an outer halo (`0 0 24px [variant-color]/0.5`) to deliver "electric" energy without making the chassis bigger.
**Why:** A gradient on a saturated color reads muddy. A solid color on a saturated chassis reads flat. A solid color with an outer halo reads as glowing-hot — exactly the affect those states want.
**Source:** Button redesign spec (option C from `semantic-brighter.html`).

### Filled chassis = bevel + cyan LED at rest, halo on hover
**Rule:** Primary and secondary chassis use bevel + cyan LED at rest. They do NOT carry an outer halo at rest. On hover, a chassis-matching outer halo appears — primary-blue (`#0040FF`) on Primary, neutral (dark on light, white on dark) on Secondary. The halo is the hover intensification signal.
**Why:** If filled variants glowed continuously, every screen would be drowned in halos and the saturated-semantic "alarm light is on" reading would weaken. Reserving the halo for hover gives clear feedback ("the system noticed you") without continuous visual noise. The chassis stays static during hover per § Motion → "Hover intensifies, doesn't repaint" — the halo carries all the change.
**How:** Primary hover halo: `0 0 40px rgba(0,64,255,0.35)` in light, `0 0 40px rgba(0,64,255,0.75)` in dark. Secondary hover halo: `0 0 24px rgba(20,15,40,0.18)` in light (dark glow on light chassis), `0 0 32px rgba(255,255,255,0.2)` in dark (white glow on dark chassis).
**Source:** Decisions #80, #82.

### Quiet variants are quiet
**Rule:** Outline and ghost variants drop both the halo AND the LED glow (outline keeps a dim disc, ghost has nothing). No glow, no halo, no chassis.
**Why:** Quiet variants are for lower-emphasis actions. Giving them any glow puts them on the same visual plane as filled controls and breaks the hierarchy.

### Disabled flattens
**Rule:** Disabled chassis collapse to a neutral gray matching the mode (`bg-muted` in light, `bg-neutral-900` in dark). Label drops to `text-foreground/30` (light) or `text-white/30` (dark). LED keeps its variant color. `cursor: not-allowed`.
**Why:** The disabled state should look semantically broken — no light, no signal, no temperature. The flat neutral chassis carries this on its own; trying to also dim the LED tends to make it disappear at 4–6px rather than read as "off".
**How:** All variants (including Outline in light mode) flatten to the muted chassis when disabled. Outline disabled in dark mode preserves shipped behavior (no chassis change — a deferred backlog item).
**Source:** Decision #82.

### Flat slot for typed input
**Rule:** Text-entry controls (Input, Textarea, Select trigger, Combobox trigger, MultiSelect trigger) use a flat fill (`--background` in light, `--surface` in dark) with a 1px `--edge` hairline border. No bevel, no chassis gradient — they're the inverse of Button: a slot, not a switch.
**Why:** The instrument-panel metaphor has Button as depth and Input as plane — Button's bevel and LED carry the "switch you press" reading, Input is the "slot you put data into" defined by its hairline. Bevels on inputs would double the visual weight on dense forms and compete with Button's bevel for the eye's "this is interactive hardware" signal.
**How:** Resting chassis = `--background` (light) / `--surface` (dark). Focus = hairline swaps to `--accent` (or `--accent-700` in light for AA). Error = hairline swaps to `--error` + helper text in `--error`, value stays foreground. Disabled = chassis sinks one step (light → `--muted`, dark → `--background`) + value drops to 30% opacity + hairline drops to half-`--edge` alpha. Hover = none for text inputs; hairline brightens to `--edge-hover` for dropdown triggers (Select / Combobox / MultiSelect). No halo at rest, on focus, or on error.
**Source:** Decision #84.

### Direction C — LED scales by role, not by size
**Rule:** The LED treatment extends to small "on/active" states selectively. Glow is reserved for components where the lit element IS the active surface (Switch thumb, Slider thumb, ProgressBar fill, **Stepper active indicator**). Slot/text indicators (Checkbox check, Radio dot, active Tab text, active Pagination number, active Breadcrumb, **Stepper completed indicator**) stay flat-cyan — they're markers on a surface, not lit surfaces themselves.
**Why:** A 14px Switch thumb glows because the thumb IS the on/off indicator. A 14px ticked Checkbox doesn't glow because the check is just a marker on a slot. A form with 10 ticked checkboxes would bloom into 10 cyan halos under uniform LED treatment — Direction C keeps it calm by extending the rule by role.
**How:** Switch and Slider thumbs gain `box-shadow: 0 0 5px var(--accent), 0 0 10px rgba(0,225,250,0.6)` on hover/focus only (solid cyan at rest). Stepper active indicators carry a persistent halo `box-shadow: 0 0 6px rgba(0,225,250,0.5), 0 0 14px rgba(0,225,250,0.3)` (the indicator IS the "you are here" beacon, so the halo is rest‑state, not hover‑state). Switch and Slider tracks carry the same inset bevel as Button (`inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.4)`). Checkbox / Radio / Tabs / Pagination / Breadcrumb cyan states are flat, as are Stepper completed indicators (solid cyan chip carries the state alone). Disabled cascades for these components require compound variants (`disabled:data-[state=checked]:*` or `data-[disabled]:*` for Radix `<span>`-rendered parts) so the sink wins over the checked-accent rules.
**Source:** Decisions #85, #88.

### Elevation is neutral
**Rule:** Drop shadows on floating surfaces (Dialog, Tooltip, popover dropdowns) use plain `rgba(0,0,0,X)` — never brand-tinted.
**Why:** The skin's brand color lives in foregrounds (LEDs, halos, active states), not in elevations. Blue-tinted shadows on every popover compete with Button's brand identity and read as "branded chrome" rather than "thing floating in space." Same principle that pushed cyan out of focus chrome on text inputs (Decision #84) — elevations get the same treatment.
**How:** `--shadow-sm / --shadow / --shadow-lg` tokens carry neutral black at varying opacity + blur (`0.10` / `0.20` / `0.65`). The old `--shadow-brand-*` tokens are removed; consumers migrate to the renamed utilities (`shadow-sm`, `shadow`, `shadow-lg`).
**Source:** Decision #87.

### Popover surface tokens
**Rule:** All floating surfaces that aren't modals share a single popover token: `bg-popover-bg border border-popover-border`. The token resolves through `--surface` / `--edge`, so retheming the popover identity flows through one declaration.
**Why:** Tooltip + Slider tooltip + four dropdown surfaces all carrying inline `bg-surface border border-edge` would drift into six subtly different popovers over time. One token, one re-theme seam.
**How:** `--popover-bg: var(--surface)` and `--popover-border: var(--edge)` in both `:root` and `.theme-dark`; bridged through `--color-popover-bg` / `--color-popover-border` in the Tailwind `@theme inline` block so `bg-popover-bg` / `border-popover-border` are utility classes. Popover Content gets `rounded-none` per the radii table.
**Source:** Decision #87.

---

## 7 · Adding to these principles

When designing a new component:

1. Read this doc.
2. If you find a rule that doesn't fit your component, **don't quietly deviate** — log a `docs/DECISIONS.md` entry explaining the exception and link it from the rule.
3. If you discover a new pattern that should generalize (e.g., a third quiet treatment, a different motion signal), propose it as an addition to the relevant section here. Add the new rule + rationale + source decision.
4. Treat this doc as living. It gets richer as components get redesigned.

The principles travel with the skin. If a future skin replaces Abyssal Void, this file is replaced wholesale — not edited piecemeal — because the next skin's principles emerge from its own identity, not from layered amendments to this one.
