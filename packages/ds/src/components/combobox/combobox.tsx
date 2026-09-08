import { forwardRef, useState } from "react";
import { Popover } from "radix-ui";
import { Command } from "cmdk";
import { cva, type VariantProps } from "class-variance-authority";
import { CaretDown, Check } from "@phosphor-icons/react";
import { cn } from "../../lib/cn";
import {
  fieldChassis,
  fieldDisabled,
  fieldError,
  fieldFocus,
  fieldTriggerHover,
} from "../../lib/field-chassis";

const triggerVariants = cva(
  [
    "inline-flex items-center justify-between",
    "w-full font-sans text-foreground",
    fieldChassis,
    fieldTriggerHover,
    fieldFocus,
    fieldDisabled,
    "transition-colors",
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

type ComboboxOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type ComboboxProps = VariantProps<typeof triggerVariants> & {
  options: ComboboxOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  size?: "sm" | "md";
  error?: boolean;
  disabled?: boolean;
  className?: string;
  id?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
};

const Combobox = forwardRef<HTMLButtonElement, ComboboxProps>(
  (
    {
      options,
      value,
      onValueChange,
      placeholder = "Select...",
      searchPlaceholder = "Search...",
      emptyMessage = "No results found.",
      size,
      error = false,
      disabled = false,
      className,
      id,
      "aria-describedby": ariaDescribedBy,
      ...rest
    },
    ref,
  ) => {
    const [open, setOpen] = useState(false);
    const selectedLabel = options.find((o) => o.value === value)?.label;

    return (
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger
          ref={ref}
          id={id}
          disabled={disabled}
          aria-describedby={ariaDescribedBy}
          aria-invalid={error || undefined}
          className={cn(
            triggerVariants({ size }),
            error && fieldError,
            !selectedLabel &&
              (disabled ? "text-muted-foreground/50" : "text-muted-foreground"),
            className,
          )}
          {...rest}
        >
          <span className="truncate">
            {selectedLabel ?? placeholder}
          </span>
          <CaretDown
            weight="bold"
            className={cn(
              "ml-2 size-4 shrink-0 text-muted-foreground",
              "transition-transform motion-reduce:transition-none",
              open && "rotate-180",
            )}
            aria-hidden="true"
          />
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            className={cn(
              "z-50 w-[var(--radix-popover-trigger-width)]",
              "overflow-hidden rounded-sm",
              "bg-popover-bg border border-popover-border shadow",
            )}
            sideOffset={4}
            align="start"
          >
            <Command>
              <Command.Input
                placeholder={searchPlaceholder}
                className={cn(
                  "w-full border-b border-edge bg-transparent px-4 py-2.5",
                  "text-sm text-foreground placeholder:text-muted-foreground",
                  "outline-none",
                )}
              />
              <Command.List className="max-h-60 overflow-y-auto p-1">
                <Command.Empty className="px-4 py-6 text-center text-sm text-muted-foreground">
                  {emptyMessage}
                </Command.Empty>
                {options.map((option) => (
                  <Command.Item
                    key={option.value}
                    value={option.label}
                    {...(option.disabled ? { disabled: true } : {})}
                    onSelect={() => {
                      onValueChange?.(option.value);
                      setOpen(false);
                    }}
                    className={cn(
                      "relative flex items-center rounded-sm px-4 py-2",
                      "text-sm text-foreground cursor-pointer select-none",
                      "outline-none",
                      "data-[selected=true]:bg-muted",
                      "data-[disabled=true]:text-foreground/30",
                      "data-[disabled=true]:cursor-not-allowed",
                    )}
                  >
                    <span className="flex-1">{option.label}</span>
                    {value === option.value && (
                      <Check
                        weight="bold"
                        className="ml-auto size-4"
                        aria-hidden="true"
                      />
                    )}
                  </Command.Item>
                ))}
              </Command.List>
            </Command>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    );
  },
);

Combobox.displayName = "Combobox";

export { Combobox, triggerVariants, type ComboboxProps, type ComboboxOption };
