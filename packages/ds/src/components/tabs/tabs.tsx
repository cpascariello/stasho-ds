"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
} from "react";
import { Tabs as TabsPrimitive, DropdownMenu } from "radix-ui";
import { DotsThree } from "@phosphor-icons/react";
import { cn } from "../../lib/cn";

/* ── Root (direct re-export) ─────────────────── */

const Tabs = TabsPrimitive.Root;

/* ── List (with sliding indicator) ───────────── */

type TabsVariant = "underline" | "pill";
type TabsSize = "sm" | "md";

type TabsListProps = ComponentPropsWithoutRef<typeof TabsPrimitive.List> & {
  variant?: TabsVariant;
  size?: TabsSize;
  overflow?: "collapse";
  maxVisible?: number;
};

/* ── Overflow hook ───────────────────────────── */

function useOverflow(
  listRef: React.RefObject<HTMLElement | null>,
  overflowTriggerRef: React.RefObject<HTMLElement | null>,
  enabled: boolean,
  maxVisible: number | undefined,
) {
  const [hiddenTabs, setHiddenTabs] = useState<HiddenTab[]>([]);

  const measure = useCallback(() => {
    const list = listRef.current;
    const trigger = overflowTriggerRef.current;
    if (!list || !trigger || !enabled) {
      setHiddenTabs([]);
      return;
    }

    const tabs = Array.from(
      list.querySelectorAll<HTMLElement>('[role="tab"]'),
    );

    // Reset all tabs to normal flow for measurement
    for (const tab of tabs) {
      tab.style.visibility = "";
      tab.style.position = "";
      tab.style.pointerEvents = "";
    }
    list.style.minHeight = "";

    // Snapshot container height before hiding tabs so the tallest
    // tab's height is captured. Applied as min-height after hiding
    // to prevent layout collapse when the tallest tab overflows.
    const containerHeight = list.offsetHeight;
    const containerLeft = list.getBoundingClientRect().left;
    const containerWidth = list.clientWidth;
    const triggerWidth = trigger.offsetWidth;
    const rights = tabs.map(
      (tab) => tab.getBoundingClientRect().right - containerLeft,
    );

    const widthBreakIndex = rights.findIndex(
      (right) => right + triggerWidth > containerWidth,
    );

    // Final break index — stricter of width-based and count-based limits.
    // null means no overflow.
    let newBreakIndex: number | null = null;
    if (widthBreakIndex !== -1 && maxVisible !== undefined) {
      newBreakIndex = Math.min(widthBreakIndex, maxVisible);
    } else if (widthBreakIndex !== -1) {
      newBreakIndex = widthBreakIndex;
    } else if (maxVisible !== undefined && maxVisible < tabs.length) {
      newBreakIndex = maxVisible;
    }

    if (newBreakIndex === null) {
      setHiddenTabs([]);
      return;
    }

    // The active tab always keeps a slot in the row: past the break it takes
    // the last visible slot, and the row gives up more slots if it is wider
    // than the tab it displaces.
    const activeIndex = tabs.findIndex(
      (tab) => tab.dataset["state"] === "active",
    );
    let visibleCount = newBreakIndex;
    if (activeIndex >= visibleCount) {
      visibleCount = Math.max(0, visibleCount - 1);
      const activeWidth =
        tabs[activeIndex]?.getBoundingClientRect().width ?? 0;
      while (
        visibleCount > 0 &&
        (rights[visibleCount - 1] ?? 0) + activeWidth + triggerWidth >
          containerWidth
      ) {
        visibleCount--;
      }
    }
    const hidden = tabs.filter(
      (_, i) => i >= visibleCount && i !== activeIndex,
    );

    for (const tab of hidden) {
      tab.style.visibility = "hidden";
      tab.style.position = "absolute";
      tab.style.pointerEvents = "none";
    }

    // Lock container height so it doesn't collapse when the
    // tallest tab is removed from flow by position:absolute
    list.style.minHeight = `${String(containerHeight)}px`;

    // Focus management: move focus to trigger if focused tab overflowed
    const focused = document.activeElement;
    if (
      focused instanceof HTMLElement &&
      hidden.some((tab) => tab === focused || tab.contains(focused))
    ) {
      trigger.focus();
    }

    setHiddenTabs(
      hidden.map((tab) => ({
        value: tab.getAttribute("data-value") ?? tab.id,
        label: tab.textContent ?? "",
        disabled: tab.hasAttribute("disabled"),
        triggerEl: tab,
      })),
    );
  }, [listRef, overflowTriggerRef, enabled, maxVisible]);

  useEffect(() => {
    const list = listRef.current;
    if (!list || !enabled) return;

    measure();

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(list);

    const mutationObserver = new MutationObserver(measure);
    mutationObserver.observe(list, {
      attributes: true,
      subtree: true,
      attributeFilter: ["data-state"],
    });

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [enabled, measure]);

  return hiddenTabs;
}

/* ── Overflow types & trigger ────────────────── */

type HiddenTab = {
  value: string;
  label: string;
  disabled: boolean;
  triggerEl: HTMLElement;
};

type OverflowTriggerProps = {
  isPill: boolean;
  isSmall: boolean;
  hiddenTabs: HiddenTab[];
  visible: boolean;
};

const OverflowTrigger = forwardRef<HTMLButtonElement, OverflowTriggerProps>(
  ({ isPill, isSmall, hiddenTabs, visible }, ref) => (
    // Non-modal: Radix's modal scroll-lock pads <body> for the missing
    // scrollbar, visibly shifting/squeezing the page on mobile viewports.
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger asChild>
        <button
          ref={ref}
          type="button"
          aria-label="More tabs"
          className={cn(
            "inline-flex items-center justify-center shrink-0",
            "font-sans font-semibold text-muted-foreground",
            "transition-colors duration-200",
            "hover:text-accent-500 dark:hover:text-accent",
            "focus-visible:outline-2 focus-visible:outline-accent-500 dark:focus-visible:outline-accent focus-visible:outline-offset-2",
            "motion-reduce:transition-none",
            isPill
              ? cn(
                  "relative z-10 rounded-sm",
                  isSmall ? "px-2 py-0.5 text-xs" : "px-3 py-1.5 text-sm",
                )
              : isSmall
                ? "px-3 py-1.5 text-sm"
                : "px-4 py-3 text-sm",
            !visible && "invisible",
          )}
        >
          <DotsThree weight="bold" className="size-5" aria-hidden="true" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className={cn(
            "z-50 min-w-[8rem]",
            "rounded-sm bg-popover-bg border border-popover-border shadow",
            "p-1",
            "motion-reduce:transition-none",
          )}
          sideOffset={4}
          align="end"
        >
          {hiddenTabs.map((tab) => (
            <DropdownMenu.Item
              key={tab.value}
              disabled={tab.disabled}
              onSelect={() => {
                const el = tab.triggerEl;
                // Defer focus until after DropdownMenu closes and
                // releases its focus trap. Restoring visibility lets
                // the trigger receive focus, which activates the tab
                // via Radix. measure() re-hides via MutationObserver
                // after data-state updates.
                requestAnimationFrame(() => {
                  el.style.visibility = "";
                  el.style.pointerEvents = "";
                  el.focus();
                });
              }}
              className={cn(
                "flex w-full items-center rounded-sm px-3 py-2",
                "text-sm text-foreground cursor-pointer select-none",
                "outline-none",
                "hover:bg-muted focus-visible:bg-muted",
                "data-[disabled]:text-foreground/30 data-[disabled]:cursor-not-allowed",
              )}
            >
              {tab.label}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  ),
);

OverflowTrigger.displayName = "OverflowTrigger";

const TabsList = forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, children, variant = "underline", size = "md", overflow, maxVisible, ...rest }, ref) => {
    const innerRef = useRef<HTMLDivElement>(null);
    const indicatorRef = useRef<HTMLDivElement>(null);
    const overflowTriggerRef = useRef<HTMLButtonElement>(null);
    const [ready, setReady] = useState(false);
    const isPill = variant === "pill";
    const isSmall = size === "sm";
    const isCollapse = overflow === "collapse";
    // maxVisible activates the same overflow code path; isCollapse stays
    // bound to overflow="collapse" so layout (full-width pill) only changes
    // when the consumer opts into width-based collapse.
    const showOverflow = isCollapse || maxVisible !== undefined;

    const setRefs = (node: HTMLDivElement | null) => {
      innerRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    };

    const hiddenTabs = useOverflow(
      innerRef,
      overflowTriggerRef,
      showOverflow,
      maxVisible,
    );

    // hiddenTabs is a dep so the indicator re-measures after every collapse
    // pass: measure() only touches inline styles, which no observer sees.
    useEffect(() => {
      const list = innerRef.current;
      const indicator = indicatorRef.current;
      if (!list || !indicator) return;

      function updateIndicator() {
        const activeTab = list!.querySelector<HTMLElement>(
          '[data-state="active"]',
        );
        if (!activeTab || !indicator) return;
        // A newly activated tab can still be collapsed until measure()
        // runs; the hiddenTabs dep re-runs this once it is back in the row.
        if (activeTab.style.visibility === "hidden") return;

        const left = activeTab.offsetLeft;
        const width = activeTab.offsetWidth;
        indicator.style.transform = `translateX(${String(left)}px)`;
        indicator.style.width = `${String(width)}px`;
        if (!ready) setReady(true);
      }

      updateIndicator();

      const observer = new MutationObserver(updateIndicator);
      observer.observe(list, {
        attributes: true,
        subtree: true,
        attributeFilter: ["data-state"],
      });

      const resizeObserver = new ResizeObserver(updateIndicator);
      resizeObserver.observe(list);

      return () => {
        observer.disconnect();
        resizeObserver.disconnect();
      };
    }, [ready, hiddenTabs]);

    return (
      <TabsPrimitive.List
        ref={setRefs}
        data-variant={variant}
        data-size={size}
        className={cn(
          "group relative flex",
          isPill
            ? [
                "rounded-sm bg-muted border border-edge",
                isSmall ? "p-0.5" : "p-1",
                !isCollapse && "inline-flex",
              ]
            : "border-b border-edge/40",
          className,
        )}
        {...rest}
      >
        {children}
        {showOverflow && (
          <OverflowTrigger
            ref={overflowTriggerRef}
            isPill={isPill}
            isSmall={isSmall}
            hiddenTabs={hiddenTabs}
            visible={hiddenTabs.length > 0}
          />
        )}
        <div
          ref={indicatorRef}
          className={cn(
            "absolute left-0",
            isPill
              ? [
                  isSmall ? "inset-y-0.5" : "inset-y-1",
                  "rounded-sm bg-accent/15",
                  ready ? "opacity-100" : "opacity-0",
                  ready
                    ? "transition-[transform,width,opacity] duration-200 ease-out"
                    : "",
                ]
              : [
                  "-bottom-px h-px bg-accent-500 dark:bg-accent",
                  ready
                    ? "transition-[transform,width] duration-200 ease-out"
                    : "",
                ],
            "motion-reduce:transition-none",
          )}
          aria-hidden
        />
      </TabsPrimitive.List>
    );
  },
);

TabsList.displayName = "TabsList";

/* ── Trigger ─────────────────────────────────── */

const TabsTrigger = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...rest }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      [
        "inline-flex items-center gap-2 px-4 py-3",
        "font-sans font-semibold text-sm",
        "text-foreground",
        "transition-[color,transform] duration-200 ease-out",
        "hover:text-accent-500 dark:hover:text-accent",
        "data-[state=active]:text-accent-500 dark:data-[state=active]:text-accent",
        "data-[state=active]:-translate-y-0.5",
        "disabled:text-foreground/30 disabled:cursor-not-allowed",
        "focus-visible:outline-2 focus-visible:outline-accent-500 dark:focus-visible:outline-accent focus-visible:outline-offset-2",
        "motion-reduce:transition-none",
        // Small size overrides (underline)
        "group-data-[size=sm]:px-3 group-data-[size=sm]:py-1.5",
        "group-data-[size=sm]:text-sm group-data-[size=sm]:gap-1.5",
        // Pill variant overrides (via group data attribute on TabsList)
        "group-data-[variant=pill]:relative group-data-[variant=pill]:z-10",
        "group-data-[variant=pill]:rounded-sm",
        "group-data-[variant=pill]:px-5 group-data-[variant=pill]:py-1.5",
        "group-data-[variant=pill]:text-sm",
        "group-data-[variant=pill]:text-muted-foreground",
        "group-data-[variant=pill]:translate-y-0",
        "group-data-[variant=pill]:hover:text-accent-500 dark:group-data-[variant=pill]:hover:text-accent",
        "group-data-[variant=pill]:data-[state=active]:text-accent-500 dark:group-data-[variant=pill]:data-[state=active]:text-accent",
        "group-data-[variant=pill]:data-[state=active]:translate-y-0",
        // Small pill overrides (compound group selector)
        "group-[[data-variant=pill][data-size=sm]]:px-3",
        "group-[[data-variant=pill][data-size=sm]]:py-1",
        "group-[[data-variant=pill][data-size=sm]]:text-xs",
      ].join(" "),
      className,
    )}
    {...rest}
  />
));

TabsTrigger.displayName = "TabsTrigger";

/* ── Content ─────────────────────────────────── */

const TabsContent = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...rest }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn("mt-4", className)}
    {...rest}
  />
));

TabsContent.displayName = "TabsContent";

/* ── Exports ─────────────────────────────────── */

export {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  type TabsListProps,
  type TabsSize,
  type TabsVariant,
};
