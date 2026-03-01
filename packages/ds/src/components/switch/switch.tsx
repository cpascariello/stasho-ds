import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Switch as SwitchPrimitive } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@ac/lib/cn";

const switchVariants = cva(
  [
    "peer inline-flex shrink-0 cursor-pointer",
    "items-center rounded-full",
    "border-3 border-edge bg-muted",
    "hover:border-edge-hover",
    "focus-visible:outline-none focus-visible:ring-3",
    "focus-visible:ring-primary-500",
    "disabled:opacity-50 disabled:pointer-events-none",
    "data-[state=checked]:bg-primary data-[state=checked]:border-primary",
    "transition-colors",
  ].join(" "),
  {
    variants: {
      size: {
        xs: "h-5 w-9",
        sm: "h-[26px] w-12",
        md: "h-8 w-[60px]",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

const thumbVariants = cva(
  [
    "pointer-events-none block rounded-full bg-white",
    "shadow-sm transition-transform motion-reduce:transition-none",
    "data-[state=unchecked]:translate-x-0.5",
  ].join(" "),
  {
    variants: {
      size: {
        xs: "size-3 data-[state=checked]:translate-x-[18px]",
        sm: "size-[18px] data-[state=checked]:translate-x-[24px]",
        md: "size-6 data-[state=checked]:translate-x-[30px]",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

type SwitchProps = Omit<
  ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>,
  "size"
> &
  VariantProps<typeof switchVariants>;

const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  ({ size, className, ...rest }, ref) => {
    return (
      <SwitchPrimitive.Root
        ref={ref}
        className={cn(switchVariants({ size }), className)}
        {...rest}
      >
        <SwitchPrimitive.Thumb className={thumbVariants({ size })} />
      </SwitchPrimitive.Root>
    );
  },
);

Switch.displayName = "Switch";

export { Switch, switchVariants, type SwitchProps };
