import {
  forwardRef,
  type ButtonHTMLAttributes,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { ToggleGroup as ToggleGroupPrimitive } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { Check } from "@phosphor-icons/react";
import { cn } from "@ac/lib/cn";

const selectableCardVariants = cva(
  [
    "relative rounded-lg border border-edge bg-surface text-left",
    "transition-[colors,box-shadow]",
    "hover:border-edge-hover",
    "focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-edge",
    // selected (data-[state=on]) — only SelectableCard receives this state
    "data-[state=on]:border-accent data-[state=on]:bg-accent/5",
  ].join(" "),
  {
    variants: {
      padding: {
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
      },
    },
    defaultVariants: {
      padding: "md",
    },
  },
);

type CardPadding = VariantProps<typeof selectableCardVariants>;

type ActionCardProps = ButtonHTMLAttributes<HTMLButtonElement> &
  CardPadding & {
    children: ReactNode;
  };

const ActionCard = forwardRef<HTMLButtonElement, ActionCardProps>(
  ({ padding, className, children, type, ...rest }, ref) => (
    <button
      ref={ref}
      type={type ?? "button"}
      className={cn(selectableCardVariants({ padding }), className)}
      {...rest}
    >
      {children}
    </button>
  ),
);
ActionCard.displayName = "ActionCard";

type SelectableCardGroupProps = ComponentPropsWithoutRef<
  typeof ToggleGroupPrimitive.Root
>;

const SelectableCardGroup = forwardRef<
  HTMLDivElement,
  SelectableCardGroupProps
>(({ className, ...rest }, ref) => (
  <ToggleGroupPrimitive.Root ref={ref} className={className} {...rest} />
));
SelectableCardGroup.displayName = "SelectableCardGroup";

type SelectableCardProps = ComponentPropsWithoutRef<
  typeof ToggleGroupPrimitive.Item
> &
  CardPadding;

const SelectableCard = forwardRef<HTMLButtonElement, SelectableCardProps>(
  ({ padding, className, children, ...rest }, ref) => (
    <ToggleGroupPrimitive.Item
      ref={ref}
      className={cn(selectableCardVariants({ padding }), className)}
      {...rest}
    >
      <span
        data-testid="selectable-card-check"
        aria-hidden="true"
        className={cn(
          "absolute right-3 top-3 text-accent",
          "opacity-0 transition-opacity",
          "[[data-state=on]_&]:opacity-100",
        )}
      >
        <Check weight="bold" />
      </span>
      {children}
    </ToggleGroupPrimitive.Item>
  ),
);
SelectableCard.displayName = "SelectableCard";

export {
  ActionCard,
  SelectableCard,
  SelectableCardGroup,
  selectableCardVariants,
  type ActionCardProps,
  type SelectableCardProps,
  type SelectableCardGroupProps,
};
