"use client";

import { Children, Fragment, type ReactNode } from "react";
import { Slot } from "radix-ui";
import { cn } from "../../lib/cn";

/* ── Header ────────────────────────────────────── */

export interface HeaderProps {
  children?: ReactNode;
  rightSlot?: ReactNode;
  className?: string;
}

export function Header({ children, rightSlot, className }: HeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30",
        "flex h-16 shrink-0 items-center gap-4",
        "border-b border-edge bg-background px-4",
        className,
      )}
    >
      <a
        href="#main"
        className={cn(
          "sr-only focus:not-sr-only",
          "focus:absolute focus:left-2 focus:top-2 focus:z-50",
          "focus:rounded focus:bg-accent focus:px-3 focus:py-1.5",
          "focus:text-sm focus:font-bold focus:text-accent-foreground",
          "focus:outline-none focus:ring-2 focus:ring-accent",
        )}
      >
        Skip to content
      </a>
      <div className="flex min-w-0 flex-1 items-center gap-3">{children}</div>
      {rightSlot && (
        <div className="flex shrink-0 items-center">{rightSlot}</div>
      )}
    </header>
  );
}

/* ── HeaderBreadcrumb ──────────────────────────── */

export interface HeaderBreadcrumbProps {
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
}

export function HeaderBreadcrumb({
  children,
  className,
  ariaLabel = "Breadcrumb",
}: HeaderBreadcrumbProps) {
  const items = Children.toArray(children);
  return (
    <nav aria-label={ariaLabel} className={cn("min-w-0", className)}>
      <ol className="flex items-center gap-2 text-sm text-foreground/80">
        {items.map((child, idx) => (
          <Fragment key={idx}>
            {idx > 0 && (
              <li aria-hidden="true" className="text-foreground/30">
                /
              </li>
            )}
            {child}
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}

/* ── HeaderBreadcrumbSegment ───────────────────── */

export interface HeaderBreadcrumbSegmentProps {
  children: ReactNode;
  current?: boolean;
  asChild?: boolean;
  className?: string;
}

export function HeaderBreadcrumbSegment({
  children,
  current,
  asChild,
  className,
}: HeaderBreadcrumbSegmentProps) {
  const Comp = asChild ? Slot.Root : "span";
  return (
    <li className={cn("min-w-0 truncate", className)}>
      <Comp
        {...(current ? { "aria-current": "page" } : {})}
        className="truncate text-foreground"
      >
        {children}
      </Comp>
    </li>
  );
}
