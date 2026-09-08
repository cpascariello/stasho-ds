import { type ComponentPropsWithoutRef, forwardRef } from "react";

import { cn } from "../../lib/cn";

import { MARK_PATH } from "./logo-mark";

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
 * The icon is the Stasho mark: the wordmark's own "s" glyph, sharing the
 * {@link MARK_PATH} outline with {@link LogoMark}.
 *
 * There is deliberately no combined "icon + wordmark" lockup. With the icon
 * being the letter "s", any lockup repeats the word's own first letter, and a
 * badge-plus-wordmark version was tried and rejected. The full logo IS the
 * wordmark; use {@link Logo} or {@link LogoMark} where a standalone mark is
 * wanted.
 */
const WORDMARK_PATH =
  "M74.38 180.9Q103.98 180.9 122.71 172.15Q141.45 163.4 147.12 140.7Q151.7 122.4 139.26 114.95Q126.83 107.5 105.73 105.5Q90.58 103.7 80.94 102.85Q71.3 102 72.6 96.8Q73.53 93.1 78 91.2Q82.48 89.3 91.08 89.3Q100.58 89.3 107.06 93.35Q113.55 97.4 114.88 102.9L157.9 88.4Q156.28 72.9 140.49 66.65Q124.7 60.4 98.9 60.4Q71.9 60.4 52.46 68.95Q33.02 77.5 28.18 96.9Q23.45 115.8 34.34 124.65Q45.23 133.5 66.78 135.7Q82.7 137.6 92.86 138.35Q103.03 139.1 101.78 144.1Q100.78 148.1 95.4 150Q90.03 151.9 82.33 151.9Q71.13 151.9 64.35 148Q57.58 144.1 56.38 138.1L13.3 152.8Q15.6 168 32.34 174.45Q49.08 180.9 74.38 180.9ZM212.97 181.7Q228.77 181.7 243.95 178.6L251.35 149Q243.47 151.7 235.97 151.7Q229.37 151.7 226.25 149.2Q223.12 146.7 225.25 138.2L236.75 92.2H270.95L278.65 61.4H244.45L251.27 34.1H206.07L199.25 61.4H172.85L165.15 92.2H191.55L177.65 147.8Q172.92 166.7 183.9 174.2Q194.87 181.7 212.97 181.7ZM309.35 181.4Q316.25 181.4 322.92 180.3Q329.6 179.2 335.42 177.3Q341.25 175.4 345.76 172.95Q350.27 170.5 352.87 167.7L353.8 180H391.3L409.47 107.3Q413.8 90 408.97 79.7Q404.15 69.4 390.8 64.8Q377.45 60.2 355.95 60.2Q344.85 60.2 333.95 61.8Q323.05 63.4 313.37 66.9Q303.7 70.4 295.97 76.3Q288.25 82.2 283.6 90.8L324.57 103.3Q327.47 98.1 331.43 95.25Q335.4 92.4 339.87 91.3Q344.35 90.2 348.65 90.2Q354.85 90.2 358.92 91.5Q363 92.8 364.56 95.95Q366.12 99.1 364.7 104.8L364.02 107.5H327.72Q315.02 107.5 305.12 109.5Q295.22 111.5 288 115.8Q280.77 120.1 276.05 127Q271.32 133.9 268.85 143.8Q266.2 154.4 267.58 161.65Q268.97 168.9 274.28 173.25Q279.6 177.6 288.37 179.5Q297.15 181.4 309.35 181.4ZM326.8 152.8Q323.4 152.8 320.82 152.3Q318.25 151.8 316.63 150.65Q315.02 149.5 314.58 147.45Q314.15 145.4 314.97 142.1Q315.82 138.7 317.25 136.6Q318.67 134.5 320.73 133.45Q322.8 132.4 325.75 132Q328.7 131.6 332.5 131.6H357.3L354.1 144.4Q351.4 146.8 346.86 148.75Q342.32 150.7 337.06 151.75Q331.8 152.8 326.8 152.8ZM474.88 180.9Q504.48 180.9 523.21 172.15Q541.95 163.4 547.62 140.7Q552.2 122.4 539.76 114.95Q527.33 107.5 506.23 105.5Q491.07 103.7 481.44 102.85Q471.8 102 473.1 96.8Q474.02 93.1 478.5 91.2Q482.98 89.3 491.57 89.3Q501.07 89.3 507.56 93.35Q514.05 97.4 515.38 102.9L558.4 88.4Q556.77 72.9 540.99 66.65Q525.2 60.4 499.4 60.4Q472.4 60.4 452.96 68.95Q433.52 77.5 428.68 96.9Q423.95 115.8 434.84 124.65Q445.73 133.5 467.27 135.7Q483.2 137.6 493.36 138.35Q503.52 139.1 502.27 144.1Q501.27 148.1 495.9 150Q490.52 151.9 482.82 151.9Q471.62 151.9 464.85 148Q458.07 144.1 456.88 138.1L413.8 152.8Q416.1 168 432.84 174.45Q449.57 180.9 474.88 180.9ZM551.59 180H596.79L636.04 23H590.84ZM632.19 180H677.29L692.51 119.1Q699.06 92.9 694.06 76.7Q689.06 60.5 664.26 60.5Q637.16 60.5 616.2 77.75Q595.24 95 591.06 111.7L610.91 120.3Q614.24 107 622.4 99.15Q630.56 91.3 639.26 91.3Q647.06 91.3 649.33 96.85Q651.59 102.4 646.84 121.4ZM759.57 180.9Q797.37 180.9 816.19 164.4Q835.02 147.9 841.97 120.1Q848.94 92.2 838.27 76.1Q827.59 60 789.79 60Q752.09 60 733.32 76.1Q714.54 92.2 707.57 120.1Q700.62 147.9 711.24 164.4Q721.87 180.9 759.57 180.9ZM767.14 150.6Q757.44 150.6 752.58 145.25Q747.72 139.9 752.62 120.3Q757.52 100.7 765.02 95.5Q772.52 90.3 782.22 90.3Q792.02 90.3 796.87 95.5Q801.72 100.7 796.82 120.3Q791.92 139.9 784.43 145.25Q776.94 150.6 767.14 150.6Z";

const LETTER_PATH =
  "M74.38 180.9Q103.98 180.9 122.71 172.15Q141.45 163.4 147.12 140.7Q151.7 122.4 139.26 114.95Q126.83 107.5 105.73 105.5Q90.58 103.7 80.94 102.85Q71.3 102 72.6 96.8Q73.53 93.1 78 91.2Q82.48 89.3 91.08 89.3Q100.58 89.3 107.06 93.35Q113.55 97.4 114.88 102.9L157.9 88.4Q156.28 72.9 140.49 66.65Q124.7 60.4 98.9 60.4Q71.9 60.4 52.46 68.95Q33.02 77.5 28.18 96.9Q23.45 115.8 34.34 124.65Q45.23 133.5 66.78 135.7Q82.7 137.6 92.86 138.35Q103.03 139.1 101.78 144.1Q100.78 148.1 95.4 150Q90.03 151.9 82.33 151.9Q71.13 151.9 64.35 148Q57.58 144.1 56.38 138.1L13.3 152.8Q15.6 168 32.34 174.45Q49.08 180.9 74.38 180.9Z";

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

export { Logo, LogoWordmark, LogoLetter };
export type { LogoProps };
