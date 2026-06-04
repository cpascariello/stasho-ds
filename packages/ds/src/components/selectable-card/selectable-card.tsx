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
    "relative rounded-2xl border border-edge bg-surface text-left",
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

export { ActionCard, selectableCardVariants, type ActionCardProps };
