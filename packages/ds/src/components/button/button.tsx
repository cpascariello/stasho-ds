import {
  cloneElement,
  forwardRef,
  isValidElement,
  type ButtonHTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@ac/lib/cn";

const buttonVariants = cva(
  [
    "inline-flex items-center font-body font-bold leading-none",
    "rounded-none border-0 text-white",
    "transition-[background,box-shadow,transform] duration-150 ease-out",
    "active:translate-y-px",
    "focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2",
    "disabled:pointer-events-none disabled:cursor-not-allowed",
    "motion-reduce:transition-none motion-reduce:active:translate-y-0",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: [
          // unified brand-blue chassis (both modes)
          "bg-[linear-gradient(180deg,var(--color-primary-400)_0%,var(--color-primary-500)_100%)]",
          "[box-shadow:inset_0_1px_0_rgba(0,225,250,0.55),inset_0_-1px_0_rgba(0,0,0,0.35)]",
          // hover: chassis static, bevel highlight intensifies, halo appears (color matches chassis-500)
          "hover:[box-shadow:inset_0_1px_0_rgba(0,225,250,0.7),inset_0_-1px_0_rgba(0,0,0,0.35),0_0_40px_rgba(0,64,255,0.35)]",
          "dark:hover:[box-shadow:inset_0_1px_0_rgba(0,225,250,0.7),inset_0_-1px_0_rgba(0,0,0,0.35),0_0_40px_rgba(0,64,255,0.75)]",
          "disabled:bg-muted disabled:bg-none disabled:text-foreground/30",
          "disabled:[box-shadow:inset_0_0_0_1px_rgba(20,15,40,0.06)]",
        ].join(" "),
        secondary: [
          // light (base): raised light chassis, dark text, hairline edge
          "bg-[linear-gradient(180deg,var(--background)_0%,var(--surface)_100%)] text-foreground",
          "[box-shadow:inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-1px_0_rgba(0,0,0,0.12),inset_0_0_0_1px_rgba(20,15,40,0.10)]",
          // hover: chassis static, dark/neutral halo extends chassis outward
          "hover:[box-shadow:inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-1px_0_rgba(0,0,0,0.12),inset_0_0_0_1px_rgba(20,15,40,0.10),0_0_24px_rgba(20,15,40,0.18)]",
          "disabled:bg-muted disabled:bg-none disabled:text-foreground/30",
          "disabled:[box-shadow:inset_0_0_0_1px_rgba(20,15,40,0.06)]",
          // dark (overrides — current shipped behavior)
          "dark:bg-neutral-900 dark:bg-none dark:text-white",
          "dark:[box-shadow:inset_0_1px_0_rgba(255,255,255,0.06),inset_0_-1px_0_rgba(0,0,0,0.4)]",
          // dark hover: chassis static, white halo extends chassis outward
          "dark:hover:[box-shadow:inset_0_1px_0_rgba(255,255,255,0.06),inset_0_-1px_0_rgba(0,0,0,0.4),0_0_32px_rgba(255,255,255,0.2)]",
          "dark:disabled:bg-neutral-900 dark:disabled:text-white/30",
          "dark:disabled:[box-shadow:inset_0_1px_0_rgba(255,255,255,0.03),inset_0_-1px_0_rgba(0,0,0,0.3)]",
        ].join(" "),
        destructive: [
          "bg-error text-error-foreground",
          "[box-shadow:inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-1px_0_rgba(0,0,0,0.25),0_0_24px_rgba(255,61,0,0.5)]",
          "hover:[box-shadow:inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(0,0,0,0.25),0_0_40px_rgba(255,61,0,0.75)]",
          // light (base): flat muted chassis when disabled
          "disabled:bg-muted disabled:text-foreground/30",
          "disabled:[box-shadow:inset_0_0_0_1px_rgba(20,15,40,0.06)]",
          // dark (overrides — current shipped behavior)
          "dark:disabled:bg-neutral-900 dark:disabled:text-white/30",
          "dark:disabled:[box-shadow:inset_0_1px_0_rgba(255,255,255,0.03),inset_0_-1px_0_rgba(0,0,0,0.3)]",
        ].join(" "),
        warning: [
          "bg-warn text-warn-foreground",
          "[box-shadow:inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-1px_0_rgba(0,0,0,0.15),0_0_24px_rgba(255,197,61,0.5)]",
          "hover:[box-shadow:inset_0_1px_0_rgba(255,255,255,0.6),inset_0_-1px_0_rgba(0,0,0,0.15),0_0_40px_rgba(255,197,61,0.75)]",
          // light (base): flat muted chassis when disabled
          "disabled:bg-muted disabled:text-foreground/30",
          "disabled:[box-shadow:inset_0_0_0_1px_rgba(20,15,40,0.06)]",
          // dark (overrides — current shipped behavior)
          "dark:disabled:bg-neutral-900 dark:disabled:text-white/30",
          "dark:disabled:[box-shadow:inset_0_1px_0_rgba(255,255,255,0.03),inset_0_-1px_0_rgba(0,0,0,0.3)]",
        ].join(" "),
        success: [
          "bg-success text-success-foreground",
          "[box-shadow:inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(0,0,0,0.2),0_0_24px_rgba(43,213,142,0.5)]",
          "hover:[box-shadow:inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-1px_0_rgba(0,0,0,0.2),0_0_40px_rgba(43,213,142,0.75)]",
          // light (base): flat muted chassis when disabled
          "disabled:bg-muted disabled:text-foreground/30",
          "disabled:[box-shadow:inset_0_0_0_1px_rgba(20,15,40,0.06)]",
          // dark (overrides — current shipped behavior)
          "dark:disabled:bg-neutral-900 dark:disabled:text-white/30",
          "dark:disabled:[box-shadow:inset_0_1px_0_rgba(255,255,255,0.03),inset_0_-1px_0_rgba(0,0,0,0.3)]",
        ].join(" "),
        outline: [
          // light (base): primary-blue text + border, flat chassis when disabled
          "bg-transparent text-primary border border-[rgba(0,64,255,0.55)]",
          "hover:border-primary",
          "disabled:text-foreground/30 disabled:border-[rgba(20,15,40,0.15)] disabled:bg-muted",
          // dark (overrides — current shipped behavior preserved)
          "dark:text-accent dark:border-[rgba(0,225,250,0.4)]",
          "dark:hover:border-accent",
          "dark:disabled:text-white/30 dark:disabled:border-white/10 dark:disabled:bg-transparent",
        ].join(" "),
        ghost: [
          // light (base): foreground text, surface hover
          "bg-transparent text-foreground/75 font-semibold",
          "hover:bg-surface hover:text-foreground",
          "disabled:text-foreground/30 disabled:bg-transparent",
          // dark (overrides — current shipped behavior)
          "dark:text-white/75",
          "dark:hover:bg-white/[0.04] dark:hover:text-white",
          "dark:disabled:text-white/30 dark:disabled:bg-transparent",
        ].join(" "),
      },
      size: {
        xs: "py-[6px] px-3 text-[11px] gap-1.5",
        sm: "py-[7px] px-3.5 text-xs gap-[7px]",
        md: "py-[9px] px-[18px] text-[13px] gap-2",
      },
    },
    compoundVariants: [
      // Outline subtracts 1px from each padding axis to compensate for its 1px border.
      { variant: "outline", size: "xs", class: "py-[5px] px-[11px]" },
      { variant: "outline", size: "sm", class: "py-[6px] px-[13px]" },
      { variant: "outline", size: "md", class: "py-[8px] px-[17px]" },
    ],
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

type Variant = NonNullable<VariantProps<typeof buttonVariants>["variant"]>;
type Size = NonNullable<VariantProps<typeof buttonVariants>["size"]>;

// LED dimensions per size. text-* sets the LED's currentColor.
const ledSizeClass: Record<Size, string> = {
  xs: "size-1",
  sm: "size-[5px]",
  md: "size-1.5",
};

// Icon dimensions per size (used for both iconLeft wrapper and iconRight wrapper).
const iconSizeClass: Record<Size, string> = {
  xs: "size-[11px]",
  sm: "size-3",
  md: "size-[13px]",
};

// LED color + static glow per variant.
const ledColorClass: Record<Variant, string> = {
  primary: "bg-accent text-accent [box-shadow:0_0_8px_currentColor]",
  secondary: "bg-accent text-accent [box-shadow:0_0_8px_currentColor]",
  destructive: "bg-white text-white [box-shadow:0_0_8px_currentColor]",
  warning: "bg-warn-foreground text-warn-foreground",
  success: "bg-success-foreground text-success-foreground",
  outline: "bg-primary/35 text-primary dark:bg-accent/50 dark:text-accent",
  // ghost: LED is never rendered for ghost, so this entry is a sentinel.
  ghost: "",
};

// iconLeft glow treatment per variant — applied to the wrapper span.
const iconGlowClass: Record<Variant, string> = {
  primary: "text-accent [filter:drop-shadow(0_0_4px_var(--accent))]",
  secondary: "text-accent [filter:drop-shadow(0_0_4px_var(--accent))]",
  destructive: "text-white",
  warning: "text-warn-foreground",
  success: "text-success-foreground",
  outline: "text-primary dark:text-accent [filter:drop-shadow(0_0_4px_currentColor)]",
  ghost: "text-foreground/60 dark:text-white/60",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    iconLeft?: ReactNode;
    iconRight?: ReactNode;
    loading?: boolean;
    asChild?: boolean;
  };

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant,
      size,
      iconLeft,
      iconRight,
      loading = false,
      disabled = false,
      asChild = false,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const v: Variant = variant ?? "primary";
    const s: Size = size ?? "md";

    const classes = cn(
      buttonVariants({ variant: v, size: s }),
      loading && "pointer-events-none cursor-wait",
      className,
    );

    const leadingSlot = (() => {
      // Loading replaces everything in the leading slot (except on ghost).
      if (loading && v !== "ghost") {
        return (
          <span
            data-led-chase
            aria-hidden="true"
            className="inline-flex shrink-0 gap-[3px]"
          >
            <span
              className={cn(
                "inline-block rounded-full",
                ledSizeClass[s],
                ledColorClass[v],
                "animate-button-chase-a",
              )}
            />
            <span
              className={cn(
                "inline-block rounded-full",
                ledSizeClass[s],
                ledColorClass[v],
                "animate-button-chase-b",
              )}
            />
          </span>
        );
      }
      // Resting state with iconLeft.
      if (iconLeft) {
        return (
          <span
            aria-hidden="true"
            className={cn(
              "inline-flex items-center justify-center shrink-0",
              iconSizeClass[s],
              iconGlowClass[v],
            )}
          >
            {iconLeft}
          </span>
        );
      }
      // Resting state with static LED (non-ghost variants).
      if (v !== "ghost") {
        return (
          <span
            data-led
            aria-hidden="true"
            className={cn(
              "inline-block rounded-full shrink-0",
              ledSizeClass[s],
              ledColorClass[v],
            )}
          />
        );
      }
      return null;
    })();

    const content = (
      <>
        {leadingSlot}
        <span className="inline-flex items-center leading-none">
          {children}
        </span>
        {!loading && iconRight ? (
          <span
            aria-hidden="true"
            className={cn(
              "inline-flex items-center justify-center shrink-0",
              iconSizeClass[s],
            )}
          >
            {iconRight}
          </span>
        ) : null}
      </>
    );

    if (asChild && isValidElement(children)) {
      return cloneElement(children as ReactElement<Record<string, unknown>>, {
        className: classes,
        ref,
        ...rest,
      });
    }

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled}
        aria-busy={loading || undefined}
        {...rest}
      >
        {content}
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants, type ButtonProps };
