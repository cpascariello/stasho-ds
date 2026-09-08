import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/cn";

/**
 * Read-only box chassis shared by `Field` and `CopyableText variant="field"`.
 * A muted sunk surface in light mode and the raised `base-700` step in dark,
 * inside the same hairline `edge` border and control-floor radius the
 * editable field chassis uses. Padding and monospace face are part of the
 * chassis; the text size is not, so a consumer's size variant can set it.
 */
const fieldBox =
  "w-full min-w-0 rounded-sm border border-edge bg-muted dark:bg-base-700 px-3 py-2.5 font-mono";

type FieldProps = HTMLAttributes<HTMLDivElement>;

/**
 * A read-only bordered box for non-editable content, such as a block of DNS
 * baseline rows or a multi-line value. No copy control; wrap a single copyable
 * value in `CopyableText variant="field"` instead.
 */
const Field = forwardRef<HTMLDivElement, FieldProps>(
  ({ className, children, ...rest }, ref) => {
    return (
      <div ref={ref} className={cn(fieldBox, "text-xs", className)} {...rest}>
        {children}
      </div>
    );
  },
);

Field.displayName = "Field";

export { Field, fieldBox, type FieldProps };
