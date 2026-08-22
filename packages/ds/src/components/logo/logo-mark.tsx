import { type ComponentPropsWithoutRef, forwardRef } from "react";

import { cn } from "@ac/lib/cn";

/**
 * Palettes for {@link LogoMark}. These are fixed brand hexes, deliberately NOT
 * theme tokens: the mark is exported to PNG, uploaded to third-party surfaces
 * (GitHub App avatar, favicons, social cards) and must render identically
 * everywhere, including where our CSS never loads. `void` matches the cyan and
 * ground already shipped in the app's own `logo.png`.
 */
const MARK_PALETTES = {
  void: { bg: "#07080a", fg: "#22d3ee" },
  cyan: { bg: "#22d3ee", fg: "#07080a" },
  deep: { bg: "#00004e", fg: "#22d3ee" },
  mono: { bg: "#07080a", fg: "#ffffff" },
} as const;

type MarkPalette = keyof typeof MARK_PALETTES;

/**
 * The lowercase "s" of the stasho wordmark, as real outlines.
 *
 * Provenance: Anybody, weight 900, `wdth` axis instantiated to 100, glyph "s"
 * converted to a path with fontTools, then sheared by 0.25 — the exact
 * synthetic-oblique transform Chromium applies, since Google Fonts serves
 * Anybody with `font-style: normal` only and no italic face exists. Verified
 * at 0.000% pixel difference against the browser's own rendering.
 *
 * Outlines, not `<text>`, on purpose: LogoWordmark/LogoLetter render live text
 * and so depend on the consuming app having loaded Anybody, which is what made
 * their viewBoxes wrong for months. This mark has no font dependency at all.
 *
 * Scaled so the glyph's farthest point sits 14% of the frame inside the edge —
 * measured against the inscribed CIRCLE, not the square, so the mark keeps a
 * real ring of air when a platform crops it to a badge.
 */
const MARK_PATH =
  "M230.88 392.47Q297.95 392.47 340.42 372.64Q382.88 352.81 395.74 301.37Q406.11 259.89 377.92 243.01Q349.74 226.13 301.92 221.6Q267.59 217.52 245.75 215.59Q223.91 213.66 226.85 201.88Q228.95 193.49 239.09 189.19Q249.23 184.88 268.72 184.88Q290.25 184.88 304.95 194.06Q319.65 203.24 322.66 215.7L420.16 182.84Q416.48 147.72 380.7 133.55Q344.92 119.39 286.45 119.39Q225.27 119.39 181.22 138.77Q137.17 158.14 126.18 202.11Q115.47 244.94 140.14 264.99Q164.82 285.05 213.65 290.03Q249.74 294.34 272.77 296.04Q295.8 297.74 292.97 309.07Q290.7 318.13 278.52 322.44Q266.34 326.75 248.89 326.75Q223.51 326.75 208.16 317.91Q192.8 309.07 190.08 295.47L92.47 328.79Q97.68 363.23 135.61 377.85Q173.54 392.47 230.88 392.47Z";

interface LogoMarkProps
  extends Omit<ComponentPropsWithoutRef<"svg">, "viewBox" | "xmlns"> {
  /** Brand palette. Defaults to `void` (cyan on near-black). */
  palette?: MarkPalette;
}

/**
 * stasho badge mark — the wordmark's "s" inside a filled square, with a ring of
 * air sized for circular cropping. Use where a platform wants a self-contained
 * avatar (GitHub App, favicon, social profile) rather than the line-art
 * {@link Logo}, which inherits `currentColor`.
 *
 * The mark carries its own background, so it does NOT follow the theme. For a
 * circular badge, round it with a class: `className="rounded-full"`.
 */
const LogoMark = forwardRef<SVGSVGElement, LogoMarkProps>(
  ({ palette = "void", className, ...rest }, ref) => {
    const { bg, fg } = MARK_PALETTES[palette];
    return (
      <svg
        ref={ref}
        viewBox="0 0 512 512"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("shrink-0", className)}
        {...rest}
      >
        <rect width="512" height="512" fill={bg} />
        <path d={MARK_PATH} fill={fg} />
      </svg>
    );
  },
);

LogoMark.displayName = "LogoMark";

export { LogoMark, MARK_PALETTES, MARK_PATH };
export type { LogoMarkProps, MarkPalette };
