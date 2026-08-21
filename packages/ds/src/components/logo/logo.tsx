import { type ComponentPropsWithoutRef, forwardRef } from "react";

import { cn } from "@ac/lib/cn";

type LogoProps = Omit<ComponentPropsWithoutRef<"svg">, "viewBox" | "xmlns">;

/**
 * stasho icon mark (two circles + two arcs).
 * Inherits color from parent via `currentColor`.
 */
const Logo = forwardRef<SVGSVGElement, LogoProps>(
  ({ className, ...rest }, ref) => (
    <svg
      ref={ref}
      viewBox="0 0 209 209"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      className={cn("shrink-0", className)}
      {...rest}
    >
      <path d="M170.448 76.895c21.371 0 38.552-17.181 38.552-38.447C209 17.18 191.714 0 170.448 0c-21.372 0-38.552 17.181-38.552 38.448 0 21.266 17.18 38.447 38.552 38.447Z" />
      <path d="M38.553 208.057c21.371 0 38.552-17.181 38.552-38.448 0-21.267-17.286-38.448-38.552-38.448C17.181 131.161 0 148.342 0 169.609c-.104 21.267 17.182 38.448 38.553 38.448Z" />
      <path d="M143.106 11.314C106.544-3.772 62.858 3.457 33.106 33 3.353 62.647-3.875 106.019 11.21 142.476L143.106 11.314Z" />
      <path d="M65.792 196.847c36.562 15.086 80.247 7.857 110-21.686 29.752-29.647 36.98-73.018 21.895-109.475L65.792 196.847Z" />
    </svg>
  ),
);

Logo.displayName = "Logo";

/**
 * stasho full logo (icon + "stasho" wordmark).
 * Inherits color from parent via `currentColor`.
 */
const LogoFull = forwardRef<SVGSVGElement, LogoProps>(
  ({ className, ...rest }, ref) => (
    <svg
      ref={ref}
      viewBox="0 0 1383 229"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      className={cn("shrink-0", className)}
      {...rest}
    >
      {/* Wordmark: "stasho" (placeholder — visual rebrand deferred) */}
      <text
        x="261"
        y="180"
        fill="currentColor"
        fontFamily="inherit"
        fontSize="200"
        fontWeight="600"
      >
        stasho
      </text>
      {/* Icon mark */}
      <path d="M170.448 76.895c21.371 0 38.552-17.181 38.552-38.447C209 17.18 191.714 0 170.448 0c-21.372 0-38.552 17.181-38.552 38.448 0 21.266 17.18 38.447 38.552 38.447Z" />
      <path d="M38.553 208.056c21.371 0 38.552-17.18 38.552-38.447 0-21.267-17.286-38.448-38.552-38.448C17.181 131.161 0 148.342 0 169.609c-.104 21.267 17.182 38.447 38.553 38.447Z" />
      <path d="M143.106 11.314C106.544-3.772 62.858 3.457 33.106 33 3.353 62.647-3.875 106.019 11.21 142.476L143.106 11.314Z" />
      <path d="M65.792 196.847c36.562 15.086 80.247 7.857 110-21.686 29.752-29.647 36.98-73.018 21.895-109.475L65.792 196.847Z" />
    </svg>
  ),
);

LogoFull.displayName = "LogoFull";

/**
 * stasho wordmark only, no icon (placeholder logotype, rebrand still deferred).
 * Set in Anybody 800 italic to match the brand headings; the consuming app must
 * load Anybody or it falls back to sans-serif. Inherits color from parent via
 * `currentColor`.
 *
 * The wordmark is live `<text>`, so its width is decided by whichever faces the
 * consuming app actually loaded — not by anything this component controls. The
 * viewBox must therefore clear the WIDEST realistic rendering: overflow clips a
 * glyph, while underflow only leaves benign trailing space. Measured at
 * font-size 200, `font-stretch: normal` (Chromium, 2026-08-21): Anybody 800/900
 * italic 848.9, Anybody 800 upright 833.1, Anybody 700 italic 777.6, generic
 * sans-serif fallback ~650. 880 clears the widest with headroom.
 *
 * Two known ways past 880, both requiring a consumer to opt in: Anybody ships a
 * `wdth` 75..125 axis, and `font-stretch` inherits into SVG `<text>` — at
 * `wdth` 125 this measures 1046. Nothing sets it today; the numbers above
 * assume `wdth` 100.
 *
 * The previous 654 was fitted to the generic sans-serif FALLBACK, not to
 * Anybody, and clipped the trailing "o" by ~30% wherever Anybody loaded.
 */
const LogoWordmark = forwardRef<SVGSVGElement, LogoProps>(
  ({ className, ...rest }, ref) => (
    <svg
      ref={ref}
      viewBox="0 0 880 229"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      className={cn("shrink-0", className)}
      {...rest}
    >
      <text
        x="0"
        y="180"
        fill="currentColor"
        fontFamily="Anybody, sans-serif"
        fontSize="200"
        fontWeight="800"
        fontStyle="italic"
      >
        stasho
      </text>
    </svg>
  ),
);

LogoWordmark.displayName = "LogoWordmark";

/**
 * stasho letter mark "s", for collapsed / compact placements (placeholder
 * logotype, rebrand still deferred). Set in Anybody 800 italic to match the
 * brand headings; the consuming app must load Anybody or it falls back to
 * sans-serif. Inherits color from parent via `currentColor`.
 *
 * Same live-`<text>` sizing rule as LogoWordmark above — the viewBox clears the
 * widest realistic rendering. Measured at font-size 200 (Chromium, 2026-08-21):
 * Anybody 800/900 italic "s" 157.9. 164 clears it with ~3.9% headroom. The
 * previous 119 clipped the single glyph by ~33%.
 */
const LogoLetter = forwardRef<SVGSVGElement, LogoProps>(
  ({ className, ...rest }, ref) => (
    <svg
      ref={ref}
      viewBox="0 0 164 229"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      className={cn("shrink-0", className)}
      {...rest}
    >
      <text
        x="0"
        y="180"
        fill="currentColor"
        fontFamily="Anybody, sans-serif"
        fontSize="200"
        fontWeight="800"
        fontStyle="italic"
      >
        s
      </text>
    </svg>
  ),
);

LogoLetter.displayName = "LogoLetter";

export { Logo, LogoFull, LogoWordmark, LogoLetter };
export type { LogoProps };
