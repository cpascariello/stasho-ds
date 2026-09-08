import {
  cloneElement,
  isValidElement,
  useId,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "../../lib/cn";
import { fieldHelper, fieldLabel, fieldStack } from "../../lib/field-layout";

type FormFieldProps = {
  label: string;
  required?: boolean;
  helperText?: string;
  error?: string;
  children: ReactNode;
  className?: string;
};

function FormField({
  label,
  required = false,
  helperText,
  error,
  children,
  className,
}: FormFieldProps) {
  const id = useId();
  const inputId = `${id}-input`;
  const messageId = `${id}-message`;
  const hasMessage = Boolean(error ?? helperText);

  const hasError = Boolean(error);

  const child = isValidElement(children)
    ? cloneElement(children as ReactElement<Record<string, unknown>>, {
        id: inputId,
        ...(hasMessage ? { "aria-describedby": messageId } : {}),
        ...(hasError ? { error: true, "aria-invalid": true } : {}),
      })
    : children;

  return (
    <div className={cn(fieldStack, className)}>
      <label
        htmlFor={inputId}
        className={fieldLabel}
      >
        {label}
        {required && (
          <span className="text-error ml-0.5" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {child}
      {error ? (
        <p id={messageId} role="alert" className={cn(fieldHelper, "text-error")}>
          {error}
        </p>
      ) : helperText ? (
        <p id={messageId} className={cn(fieldHelper, "text-muted-foreground")}>
          {helperText}
        </p>
      ) : null}
    </div>
  );
}

FormField.displayName = "FormField";

export { FormField, type FormFieldProps };
