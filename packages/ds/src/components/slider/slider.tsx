import { forwardRef, useState, type ComponentPropsWithoutRef } from "react";
import { Slider as SliderPrimitive } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@ac/lib/cn";

const trackVariants = cva(
  [
    "relative w-full grow overflow-hidden rounded-full",
    "bg-muted dark:bg-neutral-900",
    "shadow-[inset_0_1px_0_rgba(255,255,255,0.06),inset_0_-1px_0_rgba(0,0,0,0.4)]",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "h-1.5",
        md: "h-2",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

const thumbVariants = cva(
  [
    "block rounded-full bg-accent",
    "border border-accent",
    "transition-shadow motion-reduce:transition-none",
    "hover:shadow-[0_0_6px_var(--accent),0_0_12px_rgba(0,225,250,0.5)]",
    "focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2",
    "focus-visible:shadow-[0_0_6px_var(--accent),0_0_12px_rgba(0,225,250,0.5)]",
    "data-[disabled]:bg-foreground/30 data-[disabled]:border-foreground/30",
    "data-[disabled]:shadow-none data-[disabled]:cursor-not-allowed",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "size-4",
        md: "size-5",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

type SliderProps = Omit<
  ComponentPropsWithoutRef<typeof SliderPrimitive.Root>,
  "size"
> &
  VariantProps<typeof trackVariants> & {
    error?: boolean;
    showTooltip?: boolean;
  };

const Slider = forwardRef<
  React.ComponentRef<typeof SliderPrimitive.Root>,
  SliderProps
>(
  (
    {
      size,
      error = false,
      showTooltip = false,
      className,
      disabled,
      onValueChange: onValueChangeProp,
      ...rootProps
    },
    ref,
  ) => {
    const [hovering, setHovering] = useState(false);
    const [internalValue, setInternalValue] = useState(
      rootProps.defaultValue ?? rootProps.value ?? [0],
    );

    const displayValue = rootProps.value ?? internalValue;

    return (
      <SliderPrimitive.Root
        ref={ref}
        {...(disabled ? { disabled: true } : {})}
        className={cn(
          "relative flex w-full touch-none select-none items-center",
          disabled && "cursor-not-allowed",
          className,
        )}
        onValueChange={(val) => {
          setInternalValue(val);
          onValueChangeProp?.(val);
        }}
        onPointerEnter={() => setHovering(true)}
        onPointerLeave={() => setHovering(false)}
        {...rootProps}
      >
        <SliderPrimitive.Track className={cn(trackVariants({ size }))}>
          <SliderPrimitive.Range className="absolute h-full bg-accent data-[disabled]:bg-foreground/30 rounded-full" />
        </SliderPrimitive.Track>
        {displayValue.map((val, i) => (
          <SliderPrimitive.Thumb
            key={i}
            className={cn(
              thumbVariants({ size }),
              "relative",
              error &&
                "border-error hover:shadow-[0_0_6px_var(--error),0_0_12px_rgba(255,61,0,0.5)] focus-visible:shadow-[0_0_6px_var(--error),0_0_12px_rgba(255,61,0,0.5)] focus-visible:outline-error",
            )}
          >
            {showTooltip && hovering && (
              <span
                className={cn(
                  "absolute bottom-full left-1/2 -translate-x-1/2 mb-2",
                  "rounded-none bg-surface border border-edge px-2 py-1",
                  "text-xs text-foreground whitespace-nowrap pointer-events-none",
                )}
              >
                {val}
              </span>
            )}
          </SliderPrimitive.Thumb>
        ))}
      </SliderPrimitive.Root>
    );
  },
);

Slider.displayName = "Slider";

export { Slider, trackVariants, thumbVariants, type SliderProps };
