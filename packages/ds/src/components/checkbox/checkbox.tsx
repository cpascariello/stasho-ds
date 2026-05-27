import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Checkbox as CheckboxPrimitive } from "radix-ui";
import { Check } from "@phosphor-icons/react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@ac/lib/cn";

const checkboxVariants = cva(
  [
    "peer shrink-0",
    "bg-background dark:bg-surface",
    "border border-edge",
    "hover:border-edge-hover",
    "focus-visible:outline-none",
    "focus-visible:border-accent-700 dark:focus-visible:border-accent",
    "disabled:bg-muted dark:disabled:bg-background",
    "disabled:border-edge/50",
    "disabled:text-foreground/30",
    "disabled:cursor-not-allowed",
    "disabled:data-[state=checked]:text-foreground/30",
    "disabled:data-[state=checked]:bg-muted dark:disabled:data-[state=checked]:bg-background",
    "disabled:data-[state=checked]:border-edge/50",
    "data-[state=checked]:bg-accent data-[state=checked]:border-accent",
    "data-[state=checked]:text-neutral-950",
    "transition-colors",
  ].join(" "),
  {
    variants: {
      size: {
        xs: "size-3.5 rounded-none",
        sm: "size-4 rounded-none",
        md: "size-5 rounded-none",
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
            "border-error data-[state=checked]:border-error hover:border-error focus-visible:border-error dark:focus-visible:border-error",
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
          <Check weight="bold" className="size-[80%]" />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
    );
  },
);

Checkbox.displayName = "Checkbox";

export { Checkbox, checkboxVariants, type CheckboxProps };
