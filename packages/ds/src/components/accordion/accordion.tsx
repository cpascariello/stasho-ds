"use client";

import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Accordion as AccordionPrimitive } from "radix-ui";
import { CaretDown } from "@phosphor-icons/react";
import { cn } from "@ac/lib/cn";

const Accordion = AccordionPrimitive.Root;

const AccordionItem = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...rest }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b border-edge", className)}
    {...rest}
  />
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...rest }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "group flex flex-1 items-center justify-between gap-4 py-4",
        "text-left font-sans font-semibold text-foreground",
        "transition-colors duration-200",
        "hover:text-accent-500 dark:hover:text-accent",
        "focus-visible:outline-2 focus-visible:outline-accent-500 dark:focus-visible:outline-accent focus-visible:outline-offset-2",
        "motion-reduce:transition-none",
        className,
      )}
      {...rest}
    >
      {children}
      <CaretDown
        weight="bold"
        aria-hidden="true"
        className={cn(
          "size-4 shrink-0 text-accent-500 dark:text-accent",
          "transition-transform duration-200",
          "group-data-[state=open]:rotate-180",
          "motion-reduce:transition-none",
        )}
      />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = "AccordionTrigger";

const AccordionContent = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...rest }, ref) => (
  <AccordionPrimitive.Content ref={ref} className="overflow-hidden" {...rest}>
    <div
      className={cn(
        "pb-4 text-sm leading-relaxed text-muted-foreground",
        className,
      )}
    >
      {children}
    </div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
