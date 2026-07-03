"use client";

import { Popover as RadixPopover } from "radix-ui";
import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cn } from "@ac/lib/cn";

export const Popover = RadixPopover.Root;
export const PopoverTrigger = RadixPopover.Trigger;
export const PopoverAnchor = RadixPopover.Anchor;
export const PopoverClose = RadixPopover.Close;

type PopoverContentProps = ComponentPropsWithoutRef<typeof RadixPopover.Content>;

export const PopoverContent = forwardRef<
  HTMLDivElement,
  PopoverContentProps
>(function PopoverContent(
  { className, side = "top", align = "start", sideOffset = 8, ...props },
  ref,
) {
  return (
    <RadixPopover.Portal>
      <RadixPopover.Content
        ref={ref}
        side={side}
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "z-50 rounded-md border border-edge bg-background p-3 shadow-lg",
          "outline-none",
          "motion-safe:data-[state=open]:animate-pop-in",
          "motion-safe:data-[state=closed]:animate-pop-out",
          className,
        )}
        {...props}
      />
    </RadixPopover.Portal>
  );
});

export { type PopoverContentProps };
