"use client";

import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type HTMLAttributes,
} from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { X } from "@phosphor-icons/react";
import { cn } from "../../lib/cn";

/* ── Direct re-exports ─────────────────────────── */

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogClose = DialogPrimitive.Close;

/* ── DialogContent (Portal + Overlay + Content) ── */

type DialogContentProps = ComponentPropsWithoutRef<
  typeof DialogPrimitive.Content
> & {
  locked?: boolean;
};

const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className, children, locked, ...rest }, ref) => (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay
        className={cn(
          "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm",
          "motion-safe:data-[state=open]:animate-overlay-in",
          "motion-safe:data-[state=closed]:animate-overlay-out",
        )}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <DialogPrimitive.Content
          ref={ref}
          className={cn(
            "relative w-full max-w-md rounded-xl border border-edge bg-surface p-6",
            "motion-safe:data-[state=open]:animate-pop-in",
            "motion-safe:data-[state=closed]:animate-pop-out",
            className,
          )}
          {...(locked
            ? {
                onInteractOutside: (e: Event) => e.preventDefault(),
                onEscapeKeyDown: (e: KeyboardEvent) => e.preventDefault(),
              }
            : {})}
          {...rest}
        >
          {children}
          {locked ? null : (
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
          )}
        </DialogPrimitive.Content>
      </div>
    </DialogPrimitive.Portal>
  ),
);

DialogContent.displayName = "DialogContent";

/* ── DialogTitle ───────────────────────────────── */

const DialogTitle = forwardRef<
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

DialogTitle.displayName = "DialogTitle";

/* ── DialogDescription ─────────────────────────── */

const DialogDescription = forwardRef<
  HTMLParagraphElement,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...rest }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...rest}
  />
));

DialogDescription.displayName = "DialogDescription";

/* ── Layout helpers (plain divs) ───────────────── */

function DialogHeader({
  className,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)} {...rest} />
  );
}

function DialogFooter({
  className,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex justify-end gap-3 pt-4", className)}
      {...rest}
    />
  );
}

/* ── Exports ───────────────────────────────────── */

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  type DialogContentProps,
};
