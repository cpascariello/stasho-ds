import { forwardRef, type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";

const statusDotVariants = cva("inline-block rounded-full shrink-0", {
  variants: {
    status: {
      healthy: "bg-success-500 animate-pulse motion-reduce:animate-none",
      live: "bg-accent-500 dark:bg-accent animate-pulse motion-reduce:animate-none",
      degraded: "bg-warning-500",
      error: "bg-error-500",
      offline: "bg-neutral-400",
      unknown: "bg-neutral-300",
    },
    size: {
      sm: "size-2",
      md: "size-3",
    },
  },
  defaultVariants: {
    status: "unknown",
    size: "md",
  },
});

type StatusDotProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof statusDotVariants> & {
    /**
     * Hide the dot from assistive tech (`aria-hidden`, no `role` or
     * `aria-label`) when the text next to it already states the status —
     * an `AccordionTrigger` or `NavRow` `leading` slot whose title or
     * summary carries it. Default: announced as `role="status"`.
     */
    decorative?: boolean;
  };

const statusLabels: Record<NonNullable<StatusDotProps["status"]>, string> = {
  healthy: "Healthy",
  live: "Live",
  degraded: "Degraded",
  error: "Error",
  offline: "Offline",
  unknown: "Unknown",
};

const StatusDot = forwardRef<HTMLSpanElement, StatusDotProps>(
  ({ status, size, decorative = false, className, ...rest }, ref) => {
    const resolvedStatus = status ?? "unknown";
    const a11y = decorative
      ? { "aria-hidden": true }
      : { role: "status", "aria-label": statusLabels[resolvedStatus] };
    return (
      <span
        ref={ref}
        {...a11y}
        className={cn(statusDotVariants({ status, size }), className)}
        {...rest}
      />
    );
  },
);

StatusDot.displayName = "StatusDot";

export { StatusDot, statusDotVariants, type StatusDotProps };
