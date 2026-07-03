import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Tooltip as TooltipPrimitive } from "radix-ui";
import { cn } from "@ac/lib/cn";

const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 6, ...rest }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        [
          "z-50 max-w-[260px] rounded-sm bg-popover-bg border border-popover-border px-3 py-1.5",
          "text-xs leading-snug text-foreground shadow-sm",
          "motion-safe:animate-pop-in",
          "motion-safe:data-[state=closed]:animate-pop-out",
        ].join(" "),
        className,
      )}
      {...rest}
    />
  </TooltipPrimitive.Portal>
));

TooltipContent.displayName = "TooltipContent";

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
