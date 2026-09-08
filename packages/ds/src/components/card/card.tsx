import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";

const cardVariants = cva("rounded-lg", {
  variants: {
    variant: {
      default: "bg-surface text-surface-foreground border border-edge",
      ghost: "bg-transparent",
    },
    padding: {
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    },
  },
  defaultVariants: {
    variant: "default",
    padding: "md",
  },
});

type CardProps = Omit<HTMLAttributes<HTMLDivElement>, "title"> &
  VariantProps<typeof cardVariants> & {
    /** Card heading, 16px in the heading face; the app's page title sits above it, field labels below. */
    title?: ReactNode;
    /** Trailing control on the title row (a link button, a popover trigger). Never wraps; the title does. */
    action?: ReactNode;
  };

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant, padding, title, action, className, children, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, padding }), className)}
        {...rest}
      >
        {title || action ? (
          <div className="mb-4 flex items-start justify-between gap-2">
            {title ? (
              <h3 className="min-w-0 text-base font-heading font-bold">{title}</h3>
            ) : null}
            {action ? <div className="shrink-0">{action}</div> : null}
          </div>
        ) : null}
        {children}
      </div>
    );
  },
);

Card.displayName = "Card";

export { Card, cardVariants, type CardProps };
