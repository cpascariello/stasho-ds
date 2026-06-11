"use client";

import {
  forwardRef,
  type ComponentPropsWithoutRef,
} from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { X } from "@phosphor-icons/react";
import { cn } from "@ac/lib/cn";

/* ── Direct re-exports ─────────────────────────── */

const Drawer = DialogPrimitive.Root;
const DrawerTrigger = DialogPrimitive.Trigger;
const DrawerClose = DialogPrimitive.Close;

/* ── DrawerContent (Portal + Overlay + Content) ── */

type DrawerSide = "bottom" | "left" | "right";

const sideClasses: Record<DrawerSide, string> = {
  bottom: cn(
    "inset-x-0 bottom-0 max-h-[85dvh] w-full rounded-t-xl border-t",
    "motion-safe:data-[state=open]:animate-drawer-in-bottom",
    "motion-safe:data-[state=closed]:animate-drawer-out-bottom",
  ),
  left: cn(
    "inset-y-0 left-0 h-dvh w-80 max-w-[85vw] border-r",
    "motion-safe:data-[state=open]:animate-drawer-in-left",
    "motion-safe:data-[state=closed]:animate-drawer-out-left",
  ),
  right: cn(
    "inset-y-0 right-0 h-dvh w-80 max-w-[85vw] border-l",
    "motion-safe:data-[state=open]:animate-drawer-in-right",
    "motion-safe:data-[state=closed]:animate-drawer-out-right",
  ),
};

type DrawerContentProps = ComponentPropsWithoutRef<
  typeof DialogPrimitive.Content
> & {
  side?: DrawerSide;
};

const DrawerContent = forwardRef<HTMLDivElement, DrawerContentProps>(
  ({ className, children, side = "bottom", ...rest }, ref) => (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay
        className={cn(
          "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
          "motion-reduce:animate-none",
        )}
      />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed z-50 border-edge bg-surface p-6",
          "overflow-y-auto overscroll-contain",
          sideClasses[side],
          className,
        )}
        {...rest}
      >
        {children}
        <DialogPrimitive.Close
          className={cn(
            "absolute top-4 right-4 rounded-sm",
            "text-muted-foreground transition-colors hover:text-foreground",
            "focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2",
          )}
          aria-label="Close"
        >
          <X weight="bold" className="size-4" />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  ),
);

DrawerContent.displayName = "DrawerContent";

/* ── DrawerTitle ───────────────────────────────── */

const DrawerTitle = forwardRef<
  HTMLHeadingElement,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...rest }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "font-heading font-bold text-lg text-foreground",
      className,
    )}
    {...rest}
  />
));

DrawerTitle.displayName = "DrawerTitle";

/* ── DrawerDescription ─────────────────────────── */

const DrawerDescription = forwardRef<
  HTMLParagraphElement,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...rest }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...rest}
  />
));

DrawerDescription.displayName = "DrawerDescription";

/* ── Exports ───────────────────────────────────── */

export {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
  type DrawerContentProps,
};
