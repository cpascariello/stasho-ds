import { forwardRef, type InputHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@ac/lib/cn";

const inputVariants = cva(
  [
    "w-full font-sans text-foreground",
    "bg-background dark:bg-surface",
    "border border-edge rounded-sm",
    "placeholder:text-muted-foreground",
    "focus-visible:outline-none",
    "focus-visible:border-accent-700 dark:focus-visible:border-accent",
    "disabled:bg-muted dark:disabled:bg-background",
    "disabled:border-edge/50",
    "disabled:text-foreground/30",
    "disabled:placeholder:text-muted-foreground/50",
    "disabled:cursor-not-allowed",
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
          error &&
            "border-error hover:border-error focus-visible:border-error dark:focus-visible:border-error",
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
