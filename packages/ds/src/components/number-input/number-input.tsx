import { forwardRef, useRef, type InputHTMLAttributes } from "react";
import { CaretDown, CaretUp } from "@phosphor-icons/react";
import { cn } from "../../lib/cn";
import { fieldChassis } from "../../lib/field-chassis";

type NumberInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  size?: "sm" | "md";
  error?: boolean;
};

const sizeClasses = {
  sm: "py-1.5 pl-4 text-sm",
  md: "py-2 pl-5 text-base",
};

const stepButtonClasses =
  "flex items-center justify-center cursor-pointer transition-colors text-foreground/60 hover:text-accent disabled:text-foreground/30 disabled:cursor-not-allowed disabled:hover:text-foreground/30";

const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  ({ size = "md", error = false, disabled = false, className, ...rest }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const setRefs = (node: HTMLInputElement | null) => {
      inputRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    const step = (direction: "up" | "down") => {
      const input = inputRef.current;
      if (!input || disabled) return;
      if (direction === "up") {
        input.stepUp();
      } else {
        input.stepDown();
      }
      input.dispatchEvent(new Event("change", { bubbles: true }));
    };

    return (
      <div
        className={cn(
          "flex w-full items-center font-sans text-foreground",
          fieldChassis,
          "transition-colors",
          "focus-within:border-accent-700 dark:focus-within:border-accent",
          disabled &&
            "bg-muted dark:bg-background border-edge/50 cursor-not-allowed",
          error && [
            "border-error",
            "focus-within:border-error dark:focus-within:border-error",
          ],
          sizeClasses[size],
          className,
        )}
      >
        <input
          ref={setRefs}
          disabled={disabled}
          className={cn(
            "w-full bg-transparent focus-visible:outline-none",
            "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
            "placeholder:text-muted-foreground",
            "disabled:placeholder:text-muted-foreground/50",
            disabled && "text-foreground/30 cursor-not-allowed",
          )}
          aria-invalid={error || undefined}
          {...rest}
          type="number"
        />
        <div className="flex flex-col pr-1 -my-0.5">
          <button
            type="button"
            tabIndex={-1}
            disabled={disabled}
            aria-label="Increase value"
            className={stepButtonClasses}
            onClick={() => step("up")}
          >
            <CaretUp weight="bold" className="size-3" />
          </button>
          <button
            type="button"
            tabIndex={-1}
            disabled={disabled}
            aria-label="Decrease value"
            className={stepButtonClasses}
            onClick={() => step("down")}
          >
            <CaretDown weight="bold" className="size-3" />
          </button>
        </div>
      </div>
    );
  },
);

NumberInput.displayName = "NumberInput";

export { NumberInput, type NumberInputProps };
