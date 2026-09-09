"use client";

import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { Accordion as AccordionPrimitive } from "radix-ui";
import { CaretDown } from "@phosphor-icons/react";
import { cn } from "../../lib/cn";

type AccordionVariant = "default" | "cards";

const VariantContext = createContext<AccordionVariant>("default");

type AccordionProps = ComponentPropsWithoutRef<typeof AccordionPrimitive.Root> & {
  /** `cards`: each item is its own card surface; the open item's content sits in an inset panel. */
  variant?: AccordionVariant;
  /**
   * Open the item whose `id` matches the location hash (on mount and on
   * `hashchange`) and scroll it into view. Give the target items an `id`.
   */
  openOnHash?: boolean;
};

function prefersReducedMotion(): boolean {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;
}

function openHashItem(root: HTMLDivElement) {
  const id = decodeURIComponent(window.location.hash.slice(1));
  if (!id) return;
  const item = document.getElementById(id);
  if (!item || !root.contains(item) || !item.hasAttribute("data-state")) return;
  const trigger = item.querySelector<HTMLButtonElement>("button[aria-expanded]");
  if (trigger?.getAttribute("aria-expanded") === "false") trigger.click();
  item.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
}

const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  ({ variant = "default", openOnHash = false, className, ...rest }, ref) => {
    const rootRef = useRef<HTMLDivElement>(null);
    useImperativeHandle(ref, () => rootRef.current as HTMLDivElement);

    useEffect(() => {
      if (!openOnHash) return;
      const run = () => {
        if (rootRef.current) openHashItem(rootRef.current);
      };
      run();
      window.addEventListener("hashchange", run);
      return () => window.removeEventListener("hashchange", run);
    }, [openOnHash]);

    return (
      <VariantContext.Provider value={variant}>
        <AccordionPrimitive.Root
          ref={rootRef}
          data-variant={variant}
          className={cn(variant === "cards" && "flex flex-col gap-3", className)}
          {...rest}
        />
      </VariantContext.Provider>
    );
  },
);
Accordion.displayName = "Accordion";

const AccordionItem = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...rest }, ref) => {
  const variant = useContext(VariantContext);
  return (
    <AccordionPrimitive.Item
      ref={ref}
      className={cn(
        variant === "cards"
          ? "rounded-lg border border-edge bg-surface text-surface-foreground"
          : "border-b border-edge",
        className,
      )}
      {...rest}
    />
  );
});
AccordionItem.displayName = "AccordionItem";

type AccordionTriggerProps = ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & {
  /** Before the title: a StatusDot, an icon. */
  leading?: ReactNode;
  /** One muted line under the title. */
  summary?: ReactNode;
};

const AccordionTrigger = forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ className, children, leading, summary, ...rest }, ref) => {
    const variant = useContext(VariantContext);
    return (
      <AccordionPrimitive.Header className="flex">
        <AccordionPrimitive.Trigger
          ref={ref}
          className={cn(
            "group flex flex-1 items-center gap-3 py-4",
            variant === "cards" && "px-4",
            "text-left font-sans font-semibold text-foreground",
            "transition-colors duration-200",
            "hover:text-accent-500 dark:hover:text-accent",
            "focus-visible:outline-2 focus-visible:outline-accent-500 dark:focus-visible:outline-accent focus-visible:outline-offset-2",
            "motion-reduce:transition-none",
            className,
          )}
          {...rest}
        >
          {leading ? <span className="inline-flex shrink-0 items-center">{leading}</span> : null}
          <span className="min-w-0 flex-1">
            <span className="block">{children}</span>
            {summary ? (
              <span className="block truncate text-sm font-normal text-muted-foreground">
                {summary}
              </span>
            ) : null}
          </span>
          <CaretDown
            weight="bold"
            aria-hidden="true"
            className={cn(
              "size-4 shrink-0 text-accent-500 dark:text-accent",
              "transition-transform duration-200",
              "group-data-[state=open]:rotate-180",
              "group-data-[state=closed]:group-hover:translate-y-[3px]",
              "motion-reduce:transition-none",
            )}
          />
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
    );
  },
);
AccordionTrigger.displayName = "AccordionTrigger";

const AccordionContent = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...rest }, ref) => {
  const variant = useContext(VariantContext);
  return (
    <AccordionPrimitive.Content
      ref={ref}
      className={cn(
        "group overflow-hidden",
        "motion-safe:data-[state=open]:animate-accordion-down",
        "motion-safe:data-[state=closed]:animate-accordion-up",
      )}
      {...rest}
    >
      <div
        className={cn(
          "text-sm leading-relaxed text-muted-foreground",
          variant === "cards"
            ? "mx-4 mb-4 rounded-sm border border-edge bg-background p-4"
            : "pb-4",
          "opacity-0 -translate-y-1 transition-[opacity,transform] duration-200 ease-out",
          "group-data-[state=open]:opacity-100 group-data-[state=open]:translate-y-0",
          "motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0",
          className,
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Content>
  );
});
AccordionContent.displayName = "AccordionContent";

export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  type AccordionProps,
  type AccordionTriggerProps,
};
