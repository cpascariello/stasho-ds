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

export { Logo, LogoFull };
export type { LogoProps };
