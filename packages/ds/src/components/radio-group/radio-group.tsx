import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { RadioGroup as RadioGroupPrimitive } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";

const radioItemVariants = cva(
  [
    "peer shrink-0 rounded-full",
    "bg-background dark:bg-surface",
    "border border-edge",
    "hover:border-edge-hover",
    "focus-visible:outline-none",
    "focus-visible:border-accent-700 dark:focus-visible:border-accent",
    "disabled:bg-muted dark:disabled:bg-background",
    "disabled:border-edge/50",
    "disabled:cursor-not-allowed",
    "disabled:[&_span]:bg-foreground/30",
    "disabled:data-[state=checked]:border-edge/50",
    "data-[state=checked]:border-accent",
    "transition-colors",
  ].join(" "),
  {
    variants: {
      size: {
        xs: "size-3.5",
        sm: "size-4",
        md: "size-5",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

type RadioGroupProps = ComponentPropsWithoutRef<
  typeof RadioGroupPrimitive.Root
> & {
  size?: "xs" | "sm" | "md";
};

const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, ...rest }, ref) => {
    return (
      <RadioGroupPrimitive.Root
        ref={ref}
        className={cn("flex flex-col gap-2", className)}
        {...rest}
      />
    );
  },
);
RadioGroup.displayName = "RadioGroup";

type RadioGroupItemProps = Omit<
  ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>,
  "size"
> &
  VariantProps<typeof radioItemVariants>;

const RadioGroupItem = forwardRef<HTMLButtonElement, RadioGroupItemProps>(
  ({ size, className, ...rest }, ref) => {
    return (
      <RadioGroupPrimitive.Item
        ref={ref}
        className={cn(radioItemVariants({ size }), className)}
        {...rest}
      >
        <RadioGroupPrimitive.Indicator
          forceMount
          className={cn(
            "flex size-full items-center justify-center",
            "[clip-path:circle(0%_at_50%_50%)]",
            "data-[state=checked]:[clip-path:circle(100%_at_50%_50%)]",
            "transition-[clip-path] duration-200 ease-in-out motion-reduce:transition-none",
          )}
        >
          <span className="block size-[80%] rounded-full bg-accent" />
        </RadioGroupPrimitive.Indicator>
      </RadioGroupPrimitive.Item>
    );
  },
);
RadioGroupItem.displayName = "RadioGroupItem";

export {
  RadioGroup,
  RadioGroupItem,
  radioItemVariants,
  type RadioGroupProps,
  type RadioGroupItemProps,
};
