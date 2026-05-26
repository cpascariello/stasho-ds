import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Checkbox as CheckboxPrimitive } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@ac/lib/cn";

const checkboxVariants = cva(
  [
    "peer shrink-0 bg-transparent",
    "border border-edge",
    "hover:border-edge-hover",
    "focus-visible:outline-none",
    "focus-visible:border-accent-700 dark:focus-visible:border-accent",
    "disabled:bg-muted dark:disabled:bg-background",
    "disabled:border-edge/50",
    "disabled:text-foreground/30",
    "disabled:cursor-not-allowed",
    "disabled:data-[state=checked]:text-foreground/30",
    "data-[state=checked]:bg-accent data-[state=checked]:border-accent",
    "data-[state=checked]:text-neutral-950",
    "transition-colors",
  ].join(" "),
  {
    variants: {
      size: {
        xs: "size-4 rounded",
        sm: "size-5 rounded-md",
        md: "size-6 rounded-md",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

type CheckboxProps = Omit<
  ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
  "size"
> &
  VariantProps<typeof checkboxVariants> & {
    error?: boolean;
  };

const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ size, error = false, className, ...rest }, ref) => {
    return (
      <CheckboxPrimitive.Root
        ref={ref}
        className={cn(
          checkboxVariants({ size }),
          error &&
            "border-error hover:border-error focus-visible:border-error dark:focus-visible:border-error",
          className,
        )}
        aria-invalid={error || undefined}
        {...rest}
      >
        <CheckboxPrimitive.Indicator
          forceMount
          className={cn(
            "flex size-full items-center justify-center text-current",
            "[clip-path:circle(0%_at_0%_75%)]",
            "data-[state=checked]:[clip-path:circle(100%_at_50%_50%)]",
            "transition-[clip-path] duration-200 ease-in-out motion-reduce:transition-none",
          )}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-[90%]"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
    );
  },
);

Checkbox.displayName = "Checkbox";

export { Checkbox, checkboxVariants, type CheckboxProps };
