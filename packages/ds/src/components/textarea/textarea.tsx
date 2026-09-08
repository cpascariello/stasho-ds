import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";
import {
  fieldChassis,
  fieldDisabled,
  fieldError,
  fieldFocus,
} from "../../lib/field-chassis";

const textareaVariants = cva(
  [
    "w-full font-sans text-foreground",
    fieldChassis,
    "placeholder:text-muted-foreground",
    fieldFocus,
    fieldDisabled,
    "disabled:placeholder:text-muted-foreground/50",
    "resize-y transition-colors",
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

type TextareaProps = Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  "size"
> &
  VariantProps<typeof textareaVariants> & {
    error?: boolean;
  };

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ size, error = false, rows = 4, className, ...rest }, ref) => {
    return (
      <textarea
        ref={ref}
        rows={rows}
        className={cn(
          textareaVariants({ size }),
          error && fieldError,
          className,
        )}
        aria-invalid={error || undefined}
        {...rest}
      />
    );
  },
);

Textarea.displayName = "Textarea";

export { Textarea, textareaVariants, type TextareaProps };
