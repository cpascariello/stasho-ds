import type { ReactNode } from "react";
import { cn } from "../../lib/cn";
import { fieldHelper, fieldLabel, fieldStack } from "../../lib/field-layout";

type DetailFieldProps = {
  /** Label text, or a node when a control rides beside it (an info popover). */
  label: ReactNode;
  /** Short qualifier rendered inline after the label, separated by a middot. */
  hint?: string;
  /** Line under the value. */
  helperText?: string;
  /** Color of the helper line. */
  tone?: "muted" | "warning";
  /** The value: a `CopyableText variant="field"`, a `Field`, or anything. */
  children: ReactNode;
  className?: string;
};

const helperTone: Record<NonNullable<DetailFieldProps["tone"]>, string> = {
  muted: "text-muted-foreground",
  warning: "text-warning-500 dark:text-warning",
};

/**
 * Read-only sibling of `FormField` for label + value + helper stacks in
 * detail cards. Shares FormField's label, helper, and gap classes so a form
 * and a detail card built side by side keep one rhythm. Nothing here is
 * focusable, so the label is a plain `<span>` rather than a `<label>`.
 *
 * Sibling rhythm: two `DetailField`s in one card sit 16px apart. Stack them in
 * a `flex flex-col gap-4` container; there is no wrapper component for it.
 */
function DetailField({
  label,
  hint,
  helperText,
  tone = "muted",
  children,
  className,
}: DetailFieldProps) {
  return (
    <div className={cn(fieldStack, className)}>
      <span className={fieldLabel}>
        {label}
        {hint ? (
          <span className="font-normal text-muted-foreground"> · {hint}</span>
        ) : null}
      </span>
      {children}
      {helperText ? (
        <p className={cn(fieldHelper, helperTone[tone])}>{helperText}</p>
      ) : null}
    </div>
  );
}

DetailField.displayName = "DetailField";

export { DetailField, type DetailFieldProps };
