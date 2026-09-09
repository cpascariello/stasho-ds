import {
  cloneElement,
  forwardRef,
  isValidElement,
  type AnchorHTMLAttributes,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "../../lib/cn";

type SectionNavProps = HTMLAttributes<HTMLElement> & {
  /** Accessible name of the `<nav>`; defaults to "Sections". */
  label?: string;
};

/**
 * An in-page section list for a settings-style page: one text link per
 * section URL in a vertical column, the active one in accent. Owns the list
 * only — the column it sits in and any breakpoint fallback are the
 * consumer's. No context, no provider: it renders anywhere.
 */
const SectionNav = forwardRef<HTMLElement, SectionNavProps>(
  ({ label = "Sections", className, children, ...rest }, ref) => (
    <nav ref={ref} aria-label={label} className={cn("w-full", className)} {...rest}>
      <ul className="flex flex-col gap-0.5">{children}</ul>
    </nav>
  ),
);
SectionNav.displayName = "SectionNav";

type SectionNavItemProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & (
  | {
      /** The section's URL. */
      href: string;
      asChild?: false;
    }
  | {
      /** Lend the classes and `aria-current` to the child element (a router Link). */
      asChild: true;
      /** Optional; when given it overrides the child's own href, as `NavRow` does. */
      href?: string;
    }
) & {
  /** The section the page is currently on; renders `aria-current="page"`. */
  active?: boolean;
  /** Optional leading slot, an icon at 16px. */
  icon?: ReactNode;
  children?: ReactNode;
};

/**
 * One row of a `SectionNav`: an `<li>` wrapping the section link. Same
 * chassis as the app-shell `SidebarItem` (accent active, muted hover).
 */
const SectionNavItem = forwardRef<HTMLAnchorElement, SectionNavItemProps>(
  ({ href, active = false, icon, asChild = false, className, children, ...rest }, ref) => {
    const classes = cn(
      "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium",
      "transition-colors duration-150 motion-reduce:transition-none",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
      active ? "bg-accent/10 text-accent" : "text-foreground/80 hover:bg-muted hover:text-foreground",
      className,
    );
    const ariaCurrent = active ? "page" : undefined;
    const content = (label: ReactNode) => (
      <>
        {icon ? (
          <span className="inline-flex shrink-0 items-center [&>svg]:size-4" aria-hidden="true">
            {icon}
          </span>
        ) : null}
        <span className="min-w-0 truncate">{label}</span>
      </>
    );

    if (asChild && isValidElement(children)) {
      const label = (children.props as { children?: ReactNode }).children;
      return (
        <li>
          {cloneElement(
            children as ReactElement<Record<string, unknown>>,
            {
              className: classes,
              ref,
              "aria-current": ariaCurrent,
              ...(href === undefined ? {} : { href }),
              ...rest,
            },
            content(label),
          )}
        </li>
      );
    }

    return (
      <li>
        <a ref={ref} className={classes} href={href} aria-current={ariaCurrent} {...rest}>
          {content(children)}
        </a>
      </li>
    );
  },
);
SectionNavItem.displayName = "SectionNavItem";

export { SectionNav, SectionNavItem, type SectionNavProps, type SectionNavItemProps };
