# Decisions Log

Key decisions made during development. When you wonder "why did we do X?", the answer should be here.

---

## How Decisions Are Logged

Decisions are captured when these phrases appear:
- "decided" / "let's go with" / "rejected"
- "choosing X because" / "not doing X because"
- "actually, let's" / "changed my mind"

Each entry includes:
- Context (what we were working on)
- Decision (what was chosen)
- Rationale (why - the most important part)

---

## Decision #5 — 2026-02-26

**Context:** CSS import of token file
**Decision:** Use relative path (`../styles/tokens.css`) instead of path alias (`@ac/styles/tokens.css`)
**Rationale:** CSS `@import` is processed by PostCSS, which doesn't read tsconfig paths. Only TypeScript files benefit from the `@ac/*` alias.

## Decision #4 — 2026-02-26

**Context:** Module resolution for TypeScript
**Decision:** Use `module: "esnext"` and `moduleResolution: "bundler"` instead of `nodenext`
**Rationale:** Next.js uses a bundler (Turbopack/webpack), not Node's native module resolution. `nodenext` requires explicit file extensions and doesn't resolve tsconfig paths properly in a bundler context.

## Decision #3 — 2026-02-26

**Context:** Breakpoint values — front-core uses 576/992/1200/1400
**Decision:** Use Tailwind defaults (640/768/1024/1280/1536)
**Rationale:** Close enough that custom breakpoints aren't worth the complexity. Tailwind defaults are well-tested and documented.

## Decision #2 — 2026-02-26

**Context:** Color space for brand colors
**Decision:** OKLCH for brand colors, hex for semantic tokens
**Rationale:** OKLCH provides perceptually uniform color manipulation. Brand purple (#5100CD) converts cleanly. Hex used for semantic tokens because they're simpler static values.

## Decision #1 — 2026-02-26

**Context:** Choosing architecture for design token system
**Decision:** Three-layer Tailwind-first architecture (@theme + CSS custom properties + @theme inline)
**Rationale:** Lets all default Tailwind classes work out of the box while adding brand-specific tokens. CSS custom properties enable theme switching without JS runtime. Proven pattern from data-terminal project.
**Alternatives considered:** CSS-in-JS (styled-components — rejected, what we're replacing), standalone CSS variables without Tailwind integration
