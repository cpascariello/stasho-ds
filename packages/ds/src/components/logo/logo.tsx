import { type ComponentPropsWithoutRef, forwardRef } from "react";

import { cn } from "@ac/lib/cn";

import { MARK_PALETTES, MARK_PATH, type MarkPalette } from "./logo-mark";

/**
 * The stasho logotype, as real outlines.
 *
 * Every mark here is the Anybody 900 glyph set converted to paths with
 * fontTools and sheared by 0.25 — the exact synthetic-oblique transform
 * Chromium applies, since Google Fonts serves Anybody with `font-style:
 * normal` only and no italic face exists. Per-glyph pen positions were read
 * back from the browser (`getStartPositionOfChar`) so kerning matches what
 * live text produced.
 *
 * These replaced live `<text>` elements, which made every mark depend on the
 * CONSUMING app having loaded Anybody. That dependency is why the viewBoxes
 * were once fitted to the fallback font and clipped the trailing glyph for
 * months (Decision #105). Outlines cannot drift that way.
 *
 * viewBoxes and glyph positions are byte-identical to the `<text>` versions
 * they replace, so nothing moved: verified at 4x against the old rendering
 * with zero pixels flipping between ink and ground (max channel delta 79/255,
 * confined to antialiased edges).
 *
 * The icon paths before this were inherited from the @aleph-front/ds fork —
 * Aleph Cloud's mark, not ours, despite a doc comment that claimed otherwise.
 */
const WORDMARK_PATH =
  "M74.38 180.9Q103.98 180.9 122.71 172.15Q141.45 163.4 147.12 140.7Q151.7 122.4 139.26 114.95Q126.83 107.5 105.73 105.5Q90.58 103.7 80.94 102.85Q71.3 102 72.6 96.8Q73.53 93.1 78 91.2Q82.48 89.3 91.08 89.3Q100.58 89.3 107.06 93.35Q113.55 97.4 114.88 102.9L157.9 88.4Q156.28 72.9 140.49 66.65Q124.7 60.4 98.9 60.4Q71.9 60.4 52.46 68.95Q33.02 77.5 28.18 96.9Q23.45 115.8 34.34 124.65Q45.23 133.5 66.78 135.7Q82.7 137.6 92.86 138.35Q103.03 139.1 101.78 144.1Q100.78 148.1 95.4 150Q90.03 151.9 82.33 151.9Q71.13 151.9 64.35 148Q57.58 144.1 56.38 138.1L13.3 152.8Q15.6 168 32.34 174.45Q49.08 180.9 74.38 180.9ZM212.97 181.7Q228.77 181.7 243.95 178.6L251.35 149Q243.47 151.7 235.97 151.7Q229.37 151.7 226.25 149.2Q223.12 146.7 225.25 138.2L236.75 92.2H270.95L278.65 61.4H244.45L251.27 34.1H206.07L199.25 61.4H172.85L165.15 92.2H191.55L177.65 147.8Q172.92 166.7 183.9 174.2Q194.87 181.7 212.97 181.7ZM309.35 181.4Q316.25 181.4 322.92 180.3Q329.6 179.2 335.42 177.3Q341.25 175.4 345.76 172.95Q350.27 170.5 352.87 167.7L353.8 180H391.3L409.47 107.3Q413.8 90 408.97 79.7Q404.15 69.4 390.8 64.8Q377.45 60.2 355.95 60.2Q344.85 60.2 333.95 61.8Q323.05 63.4 313.37 66.9Q303.7 70.4 295.97 76.3Q288.25 82.2 283.6 90.8L324.57 103.3Q327.47 98.1 331.43 95.25Q335.4 92.4 339.87 91.3Q344.35 90.2 348.65 90.2Q354.85 90.2 358.92 91.5Q363 92.8 364.56 95.95Q366.12 99.1 364.7 104.8L364.02 107.5H327.72Q315.02 107.5 305.12 109.5Q295.22 111.5 288 115.8Q280.77 120.1 276.05 127Q271.32 133.9 268.85 143.8Q266.2 154.4 267.58 161.65Q268.97 168.9 274.28 173.25Q279.6 177.6 288.37 179.5Q297.15 181.4 309.35 181.4ZM326.8 152.8Q323.4 152.8 320.82 152.3Q318.25 151.8 316.63 150.65Q315.02 149.5 314.58 147.45Q314.15 145.4 314.97 142.1Q315.82 138.7 317.25 136.6Q318.67 134.5 320.73 133.45Q322.8 132.4 325.75 132Q328.7 131.6 332.5 131.6H357.3L354.1 144.4Q351.4 146.8 346.86 148.75Q342.32 150.7 337.06 151.75Q331.8 152.8 326.8 152.8ZM474.88 180.9Q504.48 180.9 523.21 172.15Q541.95 163.4 547.62 140.7Q552.2 122.4 539.76 114.95Q527.33 107.5 506.23 105.5Q491.07 103.7 481.44 102.85Q471.8 102 473.1 96.8Q474.02 93.1 478.5 91.2Q482.98 89.3 491.57 89.3Q501.07 89.3 507.56 93.35Q514.05 97.4 515.38 102.9L558.4 88.4Q556.77 72.9 540.99 66.65Q525.2 60.4 499.4 60.4Q472.4 60.4 452.96 68.95Q433.52 77.5 428.68 96.9Q423.95 115.8 434.84 124.65Q445.73 133.5 467.27 135.7Q483.2 137.6 493.36 138.35Q503.52 139.1 502.27 144.1Q501.27 148.1 495.9 150Q490.52 151.9 482.82 151.9Q471.62 151.9 464.85 148Q458.07 144.1 456.88 138.1L413.8 152.8Q416.1 168 432.84 174.45Q449.57 180.9 474.88 180.9ZM551.59 180H596.79L636.04 23H590.84ZM632.19 180H677.29L692.51 119.1Q699.06 92.9 694.06 76.7Q689.06 60.5 664.26 60.5Q637.16 60.5 616.2 77.75Q595.24 95 591.06 111.7L610.91 120.3Q614.24 107 622.4 99.15Q630.56 91.3 639.26 91.3Q647.06 91.3 649.33 96.85Q651.59 102.4 646.84 121.4ZM759.57 180.9Q797.37 180.9 816.19 164.4Q835.02 147.9 841.97 120.1Q848.94 92.2 838.27 76.1Q827.59 60 789.79 60Q752.09 60 733.32 76.1Q714.54 92.2 707.57 120.1Q700.62 147.9 711.24 164.4Q721.87 180.9 759.57 180.9ZM767.14 150.6Q757.44 150.6 752.58 145.25Q747.72 139.9 752.62 120.3Q757.52 100.7 765.02 95.5Q772.52 90.3 782.22 90.3Q792.02 90.3 796.87 95.5Q801.72 100.7 796.82 120.3Q791.92 139.9 784.43 145.25Q776.94 150.6 767.14 150.6Z";

const LETTER_PATH =
  "M74.38 180.9Q103.98 180.9 122.71 172.15Q141.45 163.4 147.12 140.7Q151.7 122.4 139.26 114.95Q126.83 107.5 105.73 105.5Q90.58 103.7 80.94 102.85Q71.3 102 72.6 96.8Q73.53 93.1 78 91.2Q82.48 89.3 91.08 89.3Q100.58 89.3 107.06 93.35Q113.55 97.4 114.88 102.9L157.9 88.4Q156.28 72.9 140.49 66.65Q124.7 60.4 98.9 60.4Q71.9 60.4 52.46 68.95Q33.02 77.5 28.18 96.9Q23.45 115.8 34.34 124.65Q45.23 133.5 66.78 135.7Q82.7 137.6 92.86 138.35Q103.03 139.1 101.78 144.1Q100.78 148.1 95.4 150Q90.03 151.9 82.33 151.9Q71.13 151.9 64.35 148Q57.58 144.1 56.38 138.1L13.3 152.8Q15.6 168 32.34 174.45Q49.08 180.9 74.38 180.9Z";

/** Wordmark shifted to x=261, clearing the icon in {@link LogoFull}. */
const FULL_WORDMARK_PATH =
  "M335.38 180.9Q364.98 180.9 383.71 172.15Q402.45 163.4 408.12 140.7Q412.7 122.4 400.26 114.95Q387.82 107.5 366.73 105.5Q351.57 103.7 341.94 102.85Q332.3 102 333.6 96.8Q334.52 93.1 339 91.2Q343.48 89.3 352.07 89.3Q361.57 89.3 368.06 93.35Q374.55 97.4 375.88 102.9L418.9 88.4Q417.27 72.9 401.49 66.65Q385.7 60.4 359.9 60.4Q332.9 60.4 313.46 68.95Q294.02 77.5 289.18 96.9Q284.45 115.8 295.34 124.65Q306.23 133.5 327.77 135.7Q343.7 137.6 353.86 138.35Q364.02 139.1 362.77 144.1Q361.77 148.1 356.4 150Q351.02 151.9 343.32 151.9Q332.12 151.9 325.35 148Q318.57 144.1 317.38 138.1L274.3 152.8Q276.6 168 293.34 174.45Q310.07 180.9 335.38 180.9ZM473.97 181.7Q489.77 181.7 504.95 178.6L512.35 149Q504.47 151.7 496.97 151.7Q490.37 151.7 487.25 149.2Q484.12 146.7 486.25 138.2L497.75 92.2H531.95L539.65 61.4H505.45L512.27 34.1H467.07L460.25 61.4H433.85L426.15 92.2H452.55L438.65 147.8Q433.92 166.7 444.9 174.2Q455.87 181.7 473.97 181.7ZM570.35 181.4Q577.25 181.4 583.92 180.3Q590.6 179.2 596.42 177.3Q602.25 175.4 606.76 172.95Q611.27 170.5 613.87 167.7L614.8 180H652.3L670.47 107.3Q674.8 90 669.97 79.7Q665.15 69.4 651.8 64.8Q638.45 60.2 616.95 60.2Q605.85 60.2 594.95 61.8Q584.05 63.4 574.37 66.9Q564.7 70.4 556.97 76.3Q549.25 82.2 544.6 90.8L585.57 103.3Q588.47 98.1 592.43 95.25Q596.4 92.4 600.87 91.3Q605.35 90.2 609.65 90.2Q615.85 90.2 619.92 91.5Q624 92.8 625.56 95.95Q627.12 99.1 625.7 104.8L625.02 107.5H588.72Q576.02 107.5 566.12 109.5Q556.22 111.5 549 115.8Q541.77 120.1 537.05 127Q532.32 133.9 529.85 143.8Q527.2 154.4 528.58 161.65Q529.97 168.9 535.28 173.25Q540.6 177.6 549.37 179.5Q558.15 181.4 570.35 181.4ZM587.8 152.8Q584.4 152.8 581.82 152.3Q579.25 151.8 577.63 150.65Q576.02 149.5 575.58 147.45Q575.15 145.4 575.97 142.1Q576.82 138.7 578.25 136.6Q579.67 134.5 581.73 133.45Q583.8 132.4 586.75 132Q589.7 131.6 593.5 131.6H618.3L615.1 144.4Q612.4 146.8 607.86 148.75Q603.32 150.7 598.06 151.75Q592.8 152.8 587.8 152.8ZM735.88 180.9Q765.48 180.9 784.21 172.15Q802.95 163.4 808.62 140.7Q813.2 122.4 800.76 114.95Q788.33 107.5 767.23 105.5Q752.08 103.7 742.44 102.85Q732.8 102 734.1 96.8Q735.02 93.1 739.5 91.2Q743.98 89.3 752.58 89.3Q762.08 89.3 768.56 93.35Q775.05 97.4 776.38 102.9L819.4 88.4Q817.77 72.9 801.99 66.65Q786.2 60.4 760.4 60.4Q733.4 60.4 713.96 68.95Q694.52 77.5 689.67 96.9Q684.95 115.8 695.84 124.65Q706.73 133.5 728.27 135.7Q744.2 137.6 754.36 138.35Q764.52 139.1 763.27 144.1Q762.27 148.1 756.9 150Q751.52 151.9 743.83 151.9Q732.62 151.9 725.85 148Q719.08 144.1 717.88 138.1L674.8 152.8Q677.1 168 693.84 174.45Q710.58 180.9 735.88 180.9ZM812.59 180H857.79L897.04 23H851.84ZM893.19 180H938.29L953.51 119.1Q960.06 92.9 955.06 76.7Q950.06 60.5 925.26 60.5Q898.16 60.5 877.2 77.75Q856.24 95 852.06 111.7L871.91 120.3Q875.24 107 883.4 99.15Q891.56 91.3 900.26 91.3Q908.06 91.3 910.33 96.85Q912.59 102.4 907.84 121.4ZM1020.57 180.9Q1058.37 180.9 1077.19 164.4Q1096.02 147.9 1102.97 120.1Q1109.94 92.2 1099.27 76.1Q1088.59 60 1050.79 60Q1013.09 60 994.32 76.1Q975.54 92.2 968.57 120.1Q961.62 147.9 972.24 164.4Q982.87 180.9 1020.57 180.9ZM1028.14 150.6Q1018.44 150.6 1013.58 145.25Q1008.72 139.9 1013.62 120.3Q1018.52 100.7 1026.02 95.5Q1033.52 90.3 1043.22 90.3Q1053.02 90.3 1057.87 95.5Q1062.72 100.7 1057.82 120.3Q1052.92 139.9 1045.43 145.25Q1037.94 150.6 1028.14 150.6Z";

/** {@link MARK_PATH} is authored on a 512 canvas; LogoFull's icon slot is 209. */
const ICON_SCALE = 209 / 512;

type LogoProps = Omit<
  ComponentPropsWithoutRef<"svg">,
  "viewBox" | "xmlns" | "title"
> & {
  /**
   * Accessible name, rendered as `<title>`. Defaults to "stasho". Pass `null`
   * for a purely decorative mark, or set `aria-hidden` on the element.
   */
  title?: string | null;
};

const DEFAULT_TITLE = "stasho";

function Title({ title }: { title: string | null | undefined }) {
  const value = title === undefined ? DEFAULT_TITLE : title;
  return value === null ? null : <title>{value}</title>;
}

/**
 * stasho icon mark — the wordmark's "s" on a square canvas, sharing its
 * geometry with {@link LogoMark} (14% of the frame clear of the edge, measured
 * against the inscribed circle) but transparent and inheriting
 * `currentColor`. Use for square placements; use `LogoMark` where the mark
 * needs to carry its own background.
 */
const Logo = forwardRef<SVGSVGElement, LogoProps>(
  ({ className, title, ...rest }, ref) => (
    <svg
      ref={ref}
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      className={cn("shrink-0", className)}
      {...rest}
    >
      <Title title={title} />
      <path d={MARK_PATH} />
    </svg>
  ),
);

Logo.displayName = "Logo";

/** Radius/centre of the badge disc in {@link LogoFull}'s 1383x229 canvas. */
const LOCKUP_BADGE = 209 / 2;

type LogoFullProps = LogoProps & {
  /** Badge palette. Defaults to `void`. The wordmark stays `currentColor`. */
  palette?: MarkPalette;
};

/**
 * Badge + "stasho" wordmark lockup. Set the height and use `w-auto`.
 *
 * The badge carries its own ground (like {@link LogoMark}) while the wordmark
 * inherits `currentColor`. That split is deliberate: with an "s" as the icon, a
 * bare line-art letter beside the word reads as a stutter — "s stasho" — where
 * a filled disc reads as a lockup. The disc is a circle rather than a rounded
 * square because the mark's 14% ring was solved against the inscribed circle.
 *
 * The default `void` disc is near-black, so on our own dark canvas it merges
 * with the page and the lockup reads as a cyan "s" beside the wordmark; on a
 * light ground the disc appears and it reads as a badge. Both are intended.
 * Pass `palette="cyan"` where the disc must be visible on any ground.
 */
const LogoFull = forwardRef<SVGSVGElement, LogoFullProps>(
  ({ className, title, palette = "void", ...rest }, ref) => {
    const { bg, fg } = MARK_PALETTES[palette];
    return (
      <svg
        ref={ref}
        viewBox="0 0 1383 229"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        className={cn("shrink-0", className)}
        {...rest}
      >
        <Title title={title} />
        <circle
          cx={LOCKUP_BADGE}
          cy={LOCKUP_BADGE}
          r={LOCKUP_BADGE}
          fill={bg}
        />
        <g transform={`scale(${ICON_SCALE})`}>
          <path d={MARK_PATH} fill={fg} />
        </g>
        <path d={FULL_WORDMARK_PATH} />
      </svg>
    );
  },
);

LogoFull.displayName = "LogoFull";

/** "stasho" wordmark, no icon. Set the height and use `w-auto`. */
const LogoWordmark = forwardRef<SVGSVGElement, LogoProps>(
  ({ className, title, ...rest }, ref) => (
    <svg
      ref={ref}
      viewBox="0 0 880 229"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      className={cn("shrink-0", className)}
      {...rest}
    >
      <Title title={title} />
      <path d={WORDMARK_PATH} />
    </svg>
  ),
);

LogoWordmark.displayName = "LogoWordmark";

/**
 * Single "s" for collapsed placements. Shares {@link Logo}'s glyph but keeps
 * the wordmark's 229-tall box and baseline, so it lines up with
 * {@link LogoWordmark} when the two are swapped in place — which is exactly
 * what the Sidebar does when it collapses.
 */
const LogoLetter = forwardRef<SVGSVGElement, LogoProps>(
  ({ className, title, ...rest }, ref) => (
    <svg
      ref={ref}
      viewBox="0 0 164 229"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      className={cn("shrink-0", className)}
      {...rest}
    >
      <Title title={title} />
      <path d={LETTER_PATH} />
    </svg>
  ),
);

LogoLetter.displayName = "LogoLetter";

export { Logo, LogoFull, LogoWordmark, LogoLetter };
export type { LogoProps, LogoFullProps };
