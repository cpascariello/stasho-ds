import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Select as SelectPrimitive } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { CaretDown, Check } from "@phosphor-icons/react";
import { cn } from "@ac/lib/cn";

const triggerVariants = cva(
  [
    "inline-flex items-center justify-between",
    "w-full font-sans text-foreground",
    "bg-background dark:bg-surface",
    "border border-edge rounded-none",
    "hover:border-edge-hover",
    "focus-visible:outline-none",
    "focus-visible:border-accent-700 dark:focus-visible:border-accent",
    "disabled:bg-muted dark:disabled:bg-background",
    "disabled:border-edge/50",
    "disabled:text-foreground/30",
    "disabled:cursor-not-allowed",
    "transition-colors",
    "data-[placeholder]:text-muted-foreground",
    "disabled:data-[placeholder]:text-muted-foreground/50",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "py-1.5 px-4 text-sm",
        md: "py-2 px-5 text-base",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type SelectProps = Omit<
  ComponentPropsWithoutRef<typeof SelectPrimitive.Root>,
  "children"
> &
  VariantProps<typeof triggerVariants> & {
    options: SelectOption[];
    placeholder?: string;
    error?: boolean;
    className?: string;
    id?: string;
    "aria-describedby"?: string;
  };

const Select = forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      options,
      placeholder,
      size,
      error = false,
      className,
      id,
      "aria-describedby": ariaDescribedBy,
      ...rest
    },
    ref,
  ) => {
    return (
      <SelectPrimitive.Root {...rest}>
        <SelectPrimitive.Trigger
          ref={ref}
          id={id}
          aria-describedby={ariaDescribedBy}
          aria-invalid={error || undefined}
          className={cn(
            triggerVariants({ size }),
            error &&
              "border-error hover:border-error focus-visible:border-error dark:focus-visible:border-error",
            className,
          )}
        >
          <SelectPrimitive.Value placeholder={placeholder} />
          <SelectPrimitive.Icon className="ml-2 shrink-0 text-muted-foreground">
            <CaretDown weight="bold" className="size-4" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            className={cn(
              "z-50 overflow-hidden rounded-none",
              "bg-popover-bg border border-popover-border shadow",
            )}
            position="popper"
            sideOffset={4}
          >
            <SelectPrimitive.Viewport className="p-1 min-w-[var(--radix-select-trigger-width)]">
              {options.map((option) => (
                <SelectPrimitive.Item
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled ?? false}
                  className={cn(
                    "relative flex items-center rounded-none px-4 py-2",
                    "text-sm text-foreground cursor-pointer select-none",
                    "outline-none",
                    "data-[highlighted]:bg-muted",
                    "data-[disabled]:text-foreground/30",
                    "data-[disabled]:cursor-not-allowed",
                  )}
                >
                  <SelectPrimitive.ItemText>
                    {option.label}
                  </SelectPrimitive.ItemText>
                  <SelectPrimitive.ItemIndicator className="ml-auto pl-4">
                    <Check weight="bold" className="size-4" />
                  </SelectPrimitive.ItemIndicator>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
    );
  },
);

Select.displayName = "Select";

export { Select, triggerVariants, type SelectProps, type SelectOption };
