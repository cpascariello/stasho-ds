import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";

const loaderVariants = cva(
  "inline-flex items-center text-foreground",
  {
    variants: {
      size: {
        xs: "gap-1.5 text-xs",
        sm: "gap-2 text-sm",
        md: "gap-2 text-sm",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

const dotSizeClass: Record<NonNullable<VariantProps<typeof loaderVariants>["size"]>, string> = {
  xs: "size-1",
  sm: "size-[5px]",
  md: "size-1.5",
};

type LoaderProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof loaderVariants> & {
    children?: ReactNode;
  };

const Loader = forwardRef<HTMLSpanElement, LoaderProps>(
  ({ size, className, children, "aria-label": ariaLabel, ...rest }, ref) => {
    const s = size ?? "md";
    const dotCn = cn(
      "inline-block rounded-full shrink-0",
      "bg-accent text-accent [box-shadow:0_0_8px_currentColor]",
      dotSizeClass[s],
    );
    return (
      <span
        ref={ref}
        role="status"
        aria-label={children ? undefined : (ariaLabel ?? "Loading")}
        className={cn(loaderVariants({ size }), className)}
        {...rest}
      >
        <span aria-hidden="true" className="inline-flex shrink-0 gap-[3px]">
          <span className={cn(dotCn, "animate-button-chase-a")} />
          <span className={cn(dotCn, "animate-button-chase-b")} />
        </span>
        {children ? <span>{children}</span> : null}
      </span>
    );
  },
);

Loader.displayName = "Loader";

export { Loader, loaderVariants, type LoaderProps };
