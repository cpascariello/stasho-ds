"use client";

import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { XCircle } from "@phosphor-icons/react";
import { cn } from "../../lib/cn";

type AlertVariant = "warning" | "error" | "info" | "success";

const VARIANT_LABELS: Record<AlertVariant, string> = {
  warning: "Warning",
  error: "Error",
  info: "Info",
  success: "Success",
};

const VARIANT_BG_CLASS: Record<AlertVariant, string> = {
  warning: "alert-bg-warning",
  error: "alert-bg-error",
  info: "alert-bg-info",
  success: "alert-bg-success",
};

// Mirrors the root's `duration-200` exit transition; the fallback timer below
// resolves a dismissal whose `transitionend` never arrives.
const EXIT_DURATION_MS = 200;
const EXIT_FALLBACK_MS = EXIT_DURATION_MS + 50;

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true
  );
}

const alertVariants = cva(
  [
    "relative overflow-hidden rounded-sm border",
    "px-3 py-2",
    "transition-all duration-200",
    "motion-reduce:transition-none",
  ].join(" "),
  {
    variants: {
      variant: {
        warning: "border-warning",
        error: "border-error",
        info: "border-accent",
        success: "border-success",
      },
    },
    defaultVariants: {
      variant: "warning",
    },
  },
);

const labelVariants = cva(
  "font-mono uppercase tracking-wider text-[11px] leading-normal pb-1",
  {
    variants: {
      variant: {
        warning: "text-warning-500 dark:text-warning",
        error: "text-error-500 dark:text-error",
        info: "text-accent-500 dark:text-accent",
        success: "text-success-500 dark:text-success",
      },
    },
  },
);

const progressVariants = cva("absolute bottom-0 left-0 h-0.5", {
  variants: {
    variant: {
      warning: "bg-warning",
      error: "bg-error",
      info: "bg-accent",
      success: "bg-success",
    },
  },
});

type AlertProps = Omit<HTMLAttributes<HTMLDivElement>, "title"> &
  VariantProps<typeof alertVariants> & {
    title?: string;
    onDismiss?: () => void;
    dismissAfter?: number;
    children: ReactNode;
  };

const Alert = forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      variant = "warning",
      title,
      onDismiss,
      dismissAfter,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const [isDismissing, setIsDismissing] = useState(false);
    const [progressActive, setProgressActive] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout>>(null);
    const fallbackRef = useRef<ReturnType<typeof setTimeout>>(null);
    const dismissedRef = useRef(false);
    const resolvedVariant: AlertVariant = variant ?? "warning";

    const label = VARIANT_LABELS[resolvedVariant];

    useEffect(() => {
      if (!dismissAfter || !onDismiss) return;

      requestAnimationFrame(() => {
        setProgressActive(true);
      });

      timerRef.current = setTimeout(startDismiss, dismissAfter);

      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }, [dismissAfter, onDismiss]);

    useEffect(() => {
      return () => {
        if (fallbackRef.current) clearTimeout(fallbackRef.current);
      };
    }, []);

    function finishDismiss() {
      if (dismissedRef.current) return;
      dismissedRef.current = true;
      if (fallbackRef.current) clearTimeout(fallbackRef.current);
      onDismiss?.();
    }

    function startDismiss() {
      if (timerRef.current) clearTimeout(timerRef.current);
      setIsDismissing(true);
      if (prefersReducedMotion()) {
        finishDismiss();
        return;
      }
      fallbackRef.current = setTimeout(finishDismiss, EXIT_FALLBACK_MS);
    }

    function handleTransitionEnd() {
      if (isDismissing) finishDismiss();
    }

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          alertVariants({ variant }),
          VARIANT_BG_CLASS[resolvedVariant],
          isDismissing && "opacity-0 -translate-y-2",
          className,
        )}
        onTransitionEnd={handleTransitionEnd}
        {...rest}
      >
        <span className={labelVariants({ variant })}>
          {label}
        </span>

        {title ? (
          <p
            data-alert-title=""
            className="font-sans font-bold text-sm text-foreground mt-0.5"
          >
            {title}
          </p>
        ) : null}

        {/* eslint-disable-next-line -- nested selectors for auto-styled links */}
        <div className={cn(
          "font-sans italic text-xs text-foreground leading-relaxed",
          "[&_a]:font-bold [&_a]:not-italic [&_a]:underline",
          "[&_a]:after:content-['↗'] [&_a]:after:ml-0.5 [&_a]:after:text-[10px] [&_a]:after:no-underline [&_a]:after:inline-block",
        )}>
          {children}
        </div>

        {onDismiss ? (
          <button
            type="button"
            onClick={startDismiss}
            className={cn(
              "absolute top-2 right-2 cursor-pointer",
              labelVariants({ variant }),
            )}
            aria-label="Dismiss"
          >
            <XCircle weight="fill" className="size-3.5" />
          </button>
        ) : null}

        {dismissAfter && onDismiss ? (
          <div
            data-alert-progress=""
            className={cn(
              progressVariants({ variant }),
              "motion-reduce:transition-none",
            )}
            style={{
              width: progressActive ? "0%" : "100%",
              transitionProperty: "width",
              transitionDuration: `${dismissAfter}ms`,
              transitionTimingFunction: "linear",
            }}
          />
        ) : null}
      </div>
    );
  },
);

Alert.displayName = "Alert";

export { Alert, alertVariants, type AlertProps };
