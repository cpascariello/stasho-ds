import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";
import { buttonVariants } from "./button";

// Square inset per size. The glyph dimensions are consumer-controlled (e.g. <Bell size={18} />);
// the button stays square because the padding is symmetric.
const squareSizeClass = {
  xs: "p-1",
  sm: "p-1.5",
  md: "p-2",
  lg: "p-2.5",
} as const;

type Variant = NonNullable<VariantProps<typeof buttonVariants>["variant"]>;
type Size = keyof typeof squareSizeClass;

// aria-label is required: an icon-only button must carry an accessible name.
type IconButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "aria-label"
> & {
  variant?: Variant;
  size?: Size;
  "aria-label": string;
  children: ReactNode;
};

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ variant = "ghost", size = "md", className, children, ...rest }, ref) => (
    <button
      ref={ref}
      type="button"
      className={cn(
        // reuse Button's color/chassis; tailwind-merge collapses the default
        // rectangular size padding into the square p-* appended after it.
        buttonVariants({ variant }),
        "justify-center shrink-0",
        squareSizeClass[size],
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  ),
);

IconButton.displayName = "IconButton";

export { IconButton, type IconButtonProps };
