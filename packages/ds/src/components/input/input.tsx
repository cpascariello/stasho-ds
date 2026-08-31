import { forwardRef, type InputHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@ac/lib/cn";
import {
  fieldChassis,
  fieldDisabled,
  fieldError,
  fieldFocus,
} from "@ac/lib/field-chassis";

const inputVariants = cva(
  [
    "w-full font-sans text-foreground",
    fieldChassis,
    "placeholder:text-muted-foreground",
    fieldFocus,
    fieldDisabled,
    "disabled:placeholder:text-muted-foreground/50",
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

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> &
  VariantProps<typeof inputVariants> & {
    error?: boolean;
  };

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ size, error = false, className, ...rest }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          inputVariants({ size }),
          error && fieldError,
          className,
        )}
        aria-invalid={error || undefined}
        {...rest}
      />
    );
  },
);

Input.displayName = "Input";

export { Input, inputVariants, type InputProps };
