import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";

const badgeVariants = cva(
  [
    "inline-flex items-center justify-center gap-1.5",
    "rounded-sm font-mono uppercase tracking-wider",
    "whitespace-nowrap select-none",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "",
        success: "",
        warning: "",
        error: "",
        info: "",
      },
      fill: {
        solid: "",
        outline: "border",
      },
      size: {
        // Explicit line-height + min-height so icon-only badges match the
        // height of text badges (a lone icon otherwise yields a shorter
        // line-box than text, and the inherited line-height is non-deterministic).
        sm: "px-3 py-0.5 text-[10px] leading-[14px] min-h-5",
        md: "px-4 py-1 text-xs leading-[16px] min-h-[26px]",
      },
    },
    compoundVariants: [
      {
        fill: "solid",
        variant: "default",
        className: "bg-muted text-foreground",
      },
      {
        fill: "solid",
        variant: "success",
        className: "bg-success text-neutral-950",
      },
      {
        fill: "solid",
        variant: "warning",
        className: "bg-warning text-neutral-950",
      },
      {
        fill: "solid",
        variant: "error",
        className: "bg-error text-neutral-950",
      },
      {
        fill: "solid",
        variant: "info",
        className: "bg-accent text-neutral-950",
      },
      {
        fill: "outline",
        variant: "default",
        className: "bg-transparent border-edge text-foreground/70",
      },
      {
        fill: "outline",
        variant: "success",
        className:
          "bg-success/15 border-success/40 text-success-500 dark:text-success",
      },
      {
        fill: "outline",
        variant: "warning",
        className:
          "bg-warning/15 border-warning/40 text-warning-500 dark:text-warning",
      },
      {
        fill: "outline",
        variant: "error",
        className:
          "bg-error/15 border-error/40 text-error-500 dark:text-error",
      },
      {
        fill: "outline",
        variant: "info",
        className:
          "bg-accent/15 border-accent/40 text-accent-500 dark:text-accent",
      },
    ],
    defaultVariants: {
      variant: "default",
      fill: "solid",
      size: "md",
    },
  },
);

type BadgeProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants> & {
    iconLeft?: ReactNode;
    iconRight?: ReactNode;
  };

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    { variant, fill, size, iconLeft, iconRight, className, children, ...rest },
    ref,
  ) => {
    const iconSize = size === "sm" ? "size-2.5" : "size-3";
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant, fill, size }), className)}
        {...rest}
      >
        {iconLeft && (
          <span className={cn(iconSize, "shrink-0")}>{iconLeft}</span>
        )}
        {children}
        {iconRight && (
          <span className={cn(iconSize, "shrink-0")}>{iconRight}</span>
        )}
      </span>
    );
  },
);

Badge.displayName = "Badge";

export { Badge, badgeVariants, type BadgeProps };
