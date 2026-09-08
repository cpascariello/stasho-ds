"use client";

import { DropdownMenu as RadixMenu } from "radix-ui";
import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cn } from "../../lib/cn";

/** Non-modal by default: Radix's modal scroll-lock pads the body for the
    missing scrollbar, visibly shifting the whole page when a menu opens. */
export function DropdownMenu(
  props: ComponentPropsWithoutRef<typeof RadixMenu.Root>,
) {
  return <RadixMenu.Root modal={false} {...props} />;
}
export const DropdownMenuTrigger = RadixMenu.Trigger;
export const DropdownMenuPortal = RadixMenu.Portal;
export const DropdownMenuGroup = RadixMenu.Group;
export const DropdownMenuLabel = RadixMenu.Label;
export const DropdownMenuSeparator = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof RadixMenu.Separator>
>(function DropdownMenuSeparator({ className, ...props }, ref) {
  return (
    <RadixMenu.Separator
      ref={ref}
      className={cn("my-1 h-px bg-edge", className)}
      {...props}
    />
  );
});

type ContentProps = ComponentPropsWithoutRef<typeof RadixMenu.Content>;

export const DropdownMenuContent = forwardRef<HTMLDivElement, ContentProps>(
  function DropdownMenuContent(
    { className, side = "bottom", align = "start", sideOffset = 6, ...props },
    ref,
  ) {
    return (
      <RadixMenu.Portal>
        <RadixMenu.Content
          ref={ref}
          side={side}
          align={align}
          sideOffset={sideOffset}
          className={cn(
            "z-50 min-w-[12rem] rounded-md border border-edge bg-background p-1 shadow-lg",
            "outline-none",
            "motion-safe:data-[state=open]:animate-pop-in",
            "motion-safe:data-[state=closed]:animate-pop-out",
            className,
          )}
          {...props}
        />
      </RadixMenu.Portal>
    );
  },
);

type ItemProps = ComponentPropsWithoutRef<typeof RadixMenu.Item>;

export const DropdownMenuItem = forwardRef<HTMLDivElement, ItemProps>(
  function DropdownMenuItem({ className, ...props }, ref) {
    return (
      <RadixMenu.Item
        ref={ref}
        className={cn(
          "flex cursor-pointer select-none items-center gap-2 rounded px-2 py-1.5 text-sm",
          "outline-none",
          "data-[highlighted]:bg-muted data-[highlighted]:text-foreground",
          "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
          className,
        )}
        {...props}
      />
    );
  },
);
