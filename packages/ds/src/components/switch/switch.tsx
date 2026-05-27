import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Switch as SwitchPrimitive } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@ac/lib/cn";

const switchVariants = cva(
  [
    "peer inline-flex shrink-0 cursor-pointer",
    "items-center rounded-full",
    "border border-edge bg-muted dark:bg-neutral-900",
    "shadow-[inset_0_1px_0_rgba(255,255,255,0.06),inset_0_-1px_0_rgba(0,0,0,0.4)]",
    "focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2",
    "disabled:bg-muted dark:disabled:bg-background",
    "disabled:border-edge/50 disabled:shadow-none",
    "disabled:cursor-not-allowed",
    "disabled:data-[state=checked]:border-edge/50",
    "data-[state=checked]:border-accent/30",
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
    "pointer-events-none block rounded-full",
    "bg-edge data-[state=checked]:bg-accent",
    "transition-all motion-reduce:transition-none",
    "data-[state=unchecked]:translate-x-0.5",
    "group-hover/sw:data-[state=checked]:shadow-[0_0_5px_var(--accent),0_0_10px_rgba(0,225,250,0.6)]",
    "group-focus-visible/sw:data-[state=checked]:shadow-[0_0_5px_var(--accent),0_0_10px_rgba(0,225,250,0.6)]",
    "group-disabled/sw:bg-foreground/30 group-disabled/sw:data-[state=checked]:bg-foreground/30",
    "group-disabled/sw:shadow-none",
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
        className={cn("group/sw", switchVariants({ size }), className)}
        {...rest}
      >
        <SwitchPrimitive.Thumb className={thumbVariants({ size })} />
      </SwitchPrimitive.Root>
    );
  },
);

Switch.displayName = "Switch";

export { Switch, switchVariants, type SwitchProps };
