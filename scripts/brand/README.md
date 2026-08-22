# Brand asset pipeline

Regenerates the stasho marks from the **font itself**. Nothing here ships in the
npm package — it exists so the marks can be rebuilt when something changes (a
different ring, a new palette, another size) without rediscovering how they were
made.

Outputs live at `apps/preview/public/brand/`; the paths they produce are pasted
into `packages/ds/src/components/logo/`.

## Why this exists at all

Google Fonts serves Anybody with `font-style: normal` only — **there is no
italic face**. The slant is synthesised by the browser. So a mark drawn with
live `<text>` renders differently depending on whether the *consuming* app
loaded the font, which is how the logo viewBoxes came to be fitted to the
fallback face and clipped the trailing glyph for months (Decision #105).

Everything here converts glyphs to real outlines so that can never recur.

## The two numbers everything rests on

| | value | how it was established |
|---|---|---|
| Synthetic-oblique shear | **0.25** | `fit-shear.mjs` sweeps candidate shears, rasterises each against Chromium's own rendering, and keeps the best. Hit **0.000% pixel difference** on both `s` and `S`. |
| Badge ring | **14%** of the frame | Solved numerically in `gen-assets.mjs` against the **inscribed circle**, not the square — platforms crop avatars round, and the circle cuts closest exactly where a slanted `s` reaches furthest. |

## Running

Needs `uv` (for fontTools, pulled per-run — nothing is installed globally) and a
local `npm i` for Playwright.

```bash
cd scripts/brand
npm i
curl -s -o anybody-latin.woff2 "$(curl -s \
  'https://fonts.googleapis.com/css2?family=Anybody:wdth,wght@75..125,900' \
  -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120 Safari/537.36' \
  | awk '/latin *\*\//{f=1} f&&/src: url/{print; exit}' \
  | sed -E 's/.*url\(([^)]+)\).*/\1/')"

uv run --with fonttools --with brotli python glyph.py > glyph.json
node fit-shear.mjs       # re-derives the shear and proves it (writes glyph-fit.json)
node gen-assets.mjs      # badge SVG + PNG set, verifies against the chosen study tile
node ico.mjs             # multi-size favicon.ico from the PNGs
node gen-family.mjs      # logotype paths (wordmark, letter) + their verification
```

`bake.py` and `bake-text.py` are invoked *by* the `.mjs` scripts through the
same `uv run --with fonttools --with brotli python …` form — see `gen-assets.mjs`
for the exact call. Nothing is installed globally.

## Things that will bite you

- **`SVGPathPen` emits `H`.** It collapses straight horizontal runs to a
  one-number command, so splitting a path's numbers into x/y pairs silently
  swaps the axes from that point on. Parse per command. (`logo.test.tsx`'s
  `pathExtents` does this correctly; it was written wrong first and the test
  caught it.)
- **Kerning comes from the browser, not the font tables.** `gen-family.mjs`
  reads per-glyph pen positions with `getStartPositionOfChar()` so multi-glyph
  marks match what live `<text>` produced. Advance-width arithmetic alone will
  drift.
- **The served woff2 is a `wdth`-only variable font** at weight 900. It is
  instantiated to `wdth: 100` before outlines are taken.
- **Verify by rasterising, never by eye.** Every generator ends with a pixel
  comparison against the thing it is supposed to reproduce. The logotype
  conversion was accepted on "zero pixels flipped between ink and ground at 4x",
  not on a screenshot looking right.

See Decisions #106, #107, #108.
