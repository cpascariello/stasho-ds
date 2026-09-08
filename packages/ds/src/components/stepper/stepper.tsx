"use client";

import {
  createContext,
  forwardRef,
  useContext,
  type HTMLAttributes,
} from "react";
import { Check } from "@phosphor-icons/react";
import { cn } from "../../lib/cn";

/* ── Stepper context (orientation) ─────────────── */

type StepperContextValue = { orientation: "horizontal" | "vertical" };

const StepperContext = createContext<StepperContextValue>({
  orientation: "horizontal",
});

function useStepperContext(): StepperContextValue {
  return useContext(StepperContext);
}

/* ── StepperItem context (state propagation) ───── */

type StepperItemState = "completed" | "active" | "inactive";

type StepperItemContextValue = { state: StepperItemState };

const StepperItemContext = createContext<StepperItemContextValue>({
  state: "inactive",
});

function useStepperItemContext(): StepperItemContextValue {
  return useContext(StepperItemContext);
}

/* ── Stepper (nav root) ────────────────────────── */

type StepperProps = HTMLAttributes<HTMLElement> & {
  /** Layout direction. Default "horizontal". */
  orientation?: "horizontal" | "vertical";
};

const Stepper = forwardRef<HTMLElement, StepperProps>(
  ({ orientation = "horizontal", className, ...rest }, ref) => (
    <StepperContext.Provider value={{ orientation }}>
      <nav
        ref={ref}
        data-orientation={orientation}
        className={cn(className)}
        {...rest}
      />
    </StepperContext.Provider>
  ),
);

Stepper.displayName = "Stepper";

/* ── StepperList (ol container) ────────────────── */

type StepperListProps = HTMLAttributes<HTMLOListElement>;

const StepperList = forwardRef<HTMLOListElement, StepperListProps>(
  ({ className, ...rest }, ref) => {
    const { orientation } = useStepperContext();
    return (
      <ol
        ref={ref}
        className={cn(
          "flex gap-2",
          orientation === "horizontal" ? "items-center" : "flex-col",
          className,
        )}
        {...rest}
      />
    );
  },
);

StepperList.displayName = "StepperList";

/* ── StepperItem (li, carries state) ───────────── */

type StepperItemProps = HTMLAttributes<HTMLLIElement> & {
  /** Step state. Propagated as data-state to children. */
  state?: StepperItemState;
};

const StepperItem = forwardRef<HTMLLIElement, StepperItemProps>(
  ({ state = "inactive", className, ...rest }, ref) => (
    <StepperItemContext.Provider value={{ state }}>
      <li
        ref={ref}
        data-state={state}
        aria-current={state === "active" ? "step" : undefined}
        className={cn("flex items-center gap-2", className)}
        {...rest}
      />
    </StepperItemContext.Provider>
  ),
);

StepperItem.displayName = "StepperItem";

/* ── StepperIndicator (div slot) ───────────────── */

type StepperIndicatorProps = HTMLAttributes<HTMLDivElement>;

const StepperIndicator = forwardRef<HTMLDivElement, StepperIndicatorProps>(
  ({ className, children, ...rest }, ref) => {
    const { state } = useStepperItemContext();
    return (
      <div
        ref={ref}
        data-state={state}
        className={cn(
          "relative flex size-8 items-center justify-center rounded-sm",
          "font-sans text-sm font-semibold",
          "border border-edge text-foreground/45 bg-transparent",
          "data-[state=active]:border-accent data-[state=active]:text-accent-500 dark:data-[state=active]:text-accent",
          "data-[state=active]:shadow-[0_0_6px_rgba(0,225,250,0.5),0_0_14px_rgba(0,225,250,0.3)]",
          "data-[state=completed]:border-accent data-[state=completed]:bg-accent data-[state=completed]:text-neutral-950",
          "transition-all duration-200 motion-reduce:transition-colors",
          className,
        )}
        {...rest}
      >
        {state === "completed" ? (
          <Check weight="bold" className="size-4" aria-hidden="true" />
        ) : (
          children
        )}
      </div>
    );
  },
);

StepperIndicator.displayName = "StepperIndicator";

/* ── StepperLabel (span) ───────────────────────── */

type StepperLabelProps = HTMLAttributes<HTMLSpanElement>;

const StepperLabel = forwardRef<HTMLSpanElement, StepperLabelProps>(
  ({ className, ...rest }, ref) => {
    const { state } = useStepperItemContext();
    return (
      <span
        ref={ref}
        data-state={state}
        className={cn(
          "block text-sm text-muted-foreground transition-colors",
          "data-[state=active]:text-foreground data-[state=active]:font-medium",
          "data-[state=completed]:text-foreground",
          className,
        )}
        {...rest}
      />
    );
  },
);

StepperLabel.displayName = "StepperLabel";

/* ── StepperDescription (span) ─────────────────── */

type StepperDescriptionProps = HTMLAttributes<HTMLSpanElement>;

const StepperDescription = forwardRef<
  HTMLSpanElement,
  StepperDescriptionProps
>(({ className, ...rest }, ref) => {
  const { state } = useStepperItemContext();
  return (
    <span
      ref={ref}
      data-state={state}
      className={cn("block text-xs text-muted-foreground mt-0.5", className)}
      {...rest}
    />
  );
});

StepperDescription.displayName = "StepperDescription";

/* ── StepperConnector (li, visual line) ────────── */

type StepperConnectorProps = HTMLAttributes<HTMLLIElement> & {
  /** Mark the connector as filled (cyan) — used between two consecutive completed steps. */
  completed?: boolean;
};

const StepperConnector = forwardRef<HTMLLIElement, StepperConnectorProps>(
  ({ className, completed, ...rest }, ref) => {
    const { orientation } = useStepperContext();
    return (
      <li
        ref={ref}
        aria-hidden="true"
        data-orientation={orientation}
        data-completed={completed ? "" : undefined}
        className={cn(
          "relative overflow-hidden flex-1 bg-edge data-[completed]:bg-accent transition-colors",
          orientation === "horizontal" ? "h-px" : "w-px",
          className,
        )}
        {...rest}
      />
    );
  },
);

StepperConnector.displayName = "StepperConnector";

/* ── Exports ───────────────────────────────────── */

export {
  Stepper,
  StepperConnector,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperLabel,
  StepperList,
  type StepperConnectorProps,
  type StepperDescriptionProps,
  type StepperIndicatorProps,
  type StepperItemProps,
  type StepperLabelProps,
  type StepperListProps,
  type StepperProps,
};
