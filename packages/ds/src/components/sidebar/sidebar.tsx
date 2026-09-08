"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import {
  CaretDoubleLeft,
  CaretDoubleRight,
  CaretRight,
} from "@phosphor-icons/react";
import { LogoLetter, LogoWordmark } from "../logo/logo";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../tooltip/tooltip";
import { cn } from "../../lib/cn";

/* ── Sidebar (root + context) ──────────────────── */

export interface SidebarProps {
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  storageKey?: string;
  children: ReactNode;
  className?: string;
}

interface SidebarContextValue {
  collapsed: boolean;
  toggle: () => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function useSidebarContext(): SidebarContextValue {
  const ctx = useContext(SidebarContext);
  if (!ctx) {
    throw new Error(
      "Sidebar subcomponents must be rendered inside <Sidebar>",
    );
  }
  return ctx;
}

function readPersisted(storageKey: string | undefined): boolean | null {
  if (typeof window === "undefined" || !storageKey) return null;
  const raw = window.localStorage.getItem(storageKey);
  if (raw === "true") return true;
  if (raw === "false") return false;
  return null;
}

export function Sidebar({
  collapsed: controlled,
  defaultCollapsed,
  onCollapsedChange,
  storageKey,
  children,
  className,
}: SidebarProps) {
  const isControlled = controlled !== undefined;
  const [internal, setInternal] = useState<boolean>(() => {
    if (isControlled) return controlled;
    return defaultCollapsed ?? false;
  });

  // Hydrate uncontrolled state from localStorage on mount.
  useEffect(() => {
    if (isControlled || !storageKey) return;
    const persisted = readPersisted(storageKey);
    if (persisted !== null) setInternal(persisted);
  }, [isControlled, storageKey]);

  const collapsed = isControlled ? controlled : internal;

  const toggle = useCallback(() => {
    const next = !collapsed;
    if (!isControlled) setInternal(next);
    if (storageKey && typeof window !== "undefined") {
      window.localStorage.setItem(storageKey, next ? "true" : "false");
    }
    onCollapsedChange?.(next);
  }, [collapsed, isControlled, onCollapsedChange, storageKey]);

  return (
    <SidebarContext.Provider value={{ collapsed, toggle }}>
      <aside
        data-collapsed={collapsed || undefined}
        className={cn(
          "group/sidebar shrink-0",
          "sticky top-0 z-40 h-screen",
          "border-r border-edge bg-background",
          "flex flex-col",
          "transition-[width] duration-200 ease-out",
          "motion-reduce:transition-none",
          collapsed ? "w-14" : "w-60",
          className,
        )}
      >
        {children}
      </aside>
    </SidebarContext.Provider>
  );
}

/* ── SidebarHeader ─────────────────────────────── */

export interface SidebarHeaderProps {
  className?: string;
  children?: ReactNode;
}

export function SidebarHeader({ className, children }: SidebarHeaderProps) {
  return (
    <div
      className={cn(
        "flex h-16 shrink-0 items-center px-4",
        "border-b border-edge",
        "group-data-[collapsed]/sidebar:justify-center",
        className,
      )}
    >
      {children ?? (
        <>
          <LogoWordmark
            aria-label="Stasho"
            className="h-7 text-foreground group-data-[collapsed]/sidebar:hidden"
          />
          <LogoLetter
            aria-label="Stasho"
            className="hidden h-7 text-foreground group-data-[collapsed]/sidebar:block"
          />
        </>
      )}
    </div>
  );
}

/* ── SidebarNav ────────────────────────────────── */

export interface SidebarNavProps {
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
}

export function SidebarNav({
  children,
  className,
  ariaLabel = "Main",
}: SidebarNavProps) {
  return (
    <nav
      aria-label={ariaLabel}
      className={cn(
        "flex flex-1 flex-col gap-1 overflow-y-auto p-2",
        className,
      )}
    >
      {children}
    </nav>
  );
}

/* ── SidebarSection ────────────────────────────── */

export interface SidebarSectionProps {
  title?: string;
  titleHref?: string;
  onTitleClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  children: ReactNode;
  className?: string;
}

export function SidebarSection({
  title,
  titleHref,
  onTitleClick,
  children,
  className,
}: SidebarSectionProps) {
  const { collapsed } = useSidebarContext();
  return (
    <div
      role="group"
      aria-label={title ?? "Section"}
      className={cn("flex flex-col gap-1", className)}
    >
      {title && !collapsed && titleHref && (
        <a
          href={titleHref}
          onClick={onTitleClick}
          className={cn(
            "flex items-center gap-0.5 rounded-sm px-2 pb-1 pt-2",
            "text-[10px] font-semibold uppercase tracking-wider text-foreground/50",
            "transition-colors duration-150 hover:text-foreground",
            "focus-visible:outline-none focus-visible:ring-2",
            "focus-visible:ring-accent focus-visible:ring-offset-2",
            "motion-reduce:transition-none",
          )}
        >
          {title}
          <CaretRight size={10} aria-hidden="true" />
        </a>
      )}
      {title && !collapsed && !titleHref && (
        <div className="px-2 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-foreground/50">
          {title}
        </div>
      )}
      <ul className="flex flex-col gap-1">{children}</ul>
    </div>
  );
}

/* ── SidebarItem ───────────────────────────────── */

export interface SidebarItemProps {
  icon: ReactNode;
  label: string;
  href: string;
  active?: boolean;
  collapsed?: boolean;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  className?: string;
  target?: string;
  rel?: string;
}

export function SidebarItem({
  icon,
  label,
  href,
  active,
  collapsed: collapsedProp,
  onClick,
  className,
  target,
  rel,
}: SidebarItemProps) {
  const ctx = useSidebarContext();
  const collapsed = collapsedProp ?? ctx.collapsed;

  const link = (
    <a
      href={href}
      target={target}
      rel={rel}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group flex items-center gap-3 rounded-md",
        "px-3 py-2 text-sm font-medium",
        "transition-colors duration-150",
        "focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-accent focus-visible:ring-offset-2",
        "motion-reduce:transition-none",
        collapsed && "justify-center px-2",
        active
          ? "bg-accent/10 text-accent"
          : "text-foreground/80 hover:bg-muted hover:text-foreground",
        className,
      )}
    >
      <span
        className={cn(
          "shrink-0 flex items-center justify-center",
          "[&>svg]:size-5",
          active
            ? "text-accent"
            : "text-foreground/60 group-hover:text-foreground",
        )}
        aria-hidden="true"
      >
        {icon}
      </span>
      <span className={cn("truncate", collapsed && "sr-only")}>{label}</span>
    </a>
  );

  return (
    <li>
      {collapsed ? (
        <Tooltip>
          <TooltipTrigger asChild>{link}</TooltipTrigger>
          <TooltipContent side="right">{label}</TooltipContent>
        </Tooltip>
      ) : (
        link
      )}
    </li>
  );
}

/* ── SidebarFooter ─────────────────────────────── */

export interface SidebarFooterProps {
  children: ReactNode;
  className?: string;
}

export function SidebarFooter({ children, className }: SidebarFooterProps) {
  return (
    <div className={cn("shrink-0 px-3 py-2 empty:hidden", className)}>
      {children}
    </div>
  );
}

/* ── SidebarCollapseToggle ─────────────────────── */

export interface SidebarCollapseToggleProps {
  className?: string;
}

export function SidebarCollapseToggle({
  className,
}: SidebarCollapseToggleProps) {
  const { collapsed, toggle } = useSidebarContext();
  return (
    <div className={cn("shrink-0 border-t border-edge p-2", className)}>
      <button
        type="button"
        onClick={toggle}
        aria-expanded={!collapsed}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className={cn(
          "flex w-full items-center gap-3 rounded-md px-3 py-2",
          "text-sm font-medium text-foreground/80",
          "transition-colors duration-150",
          "hover:bg-muted hover:text-foreground",
          "focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-accent focus-visible:ring-offset-2",
          "motion-reduce:transition-none",
          collapsed ? "justify-center px-2" : "justify-end",
        )}
      >
        <span
          aria-hidden="true"
          className="shrink-0 flex items-center justify-center text-foreground/60 [&>svg]:size-4"
        >
          {collapsed ? <CaretDoubleRight /> : <CaretDoubleLeft />}
        </span>
      </button>
    </div>
  );
}
