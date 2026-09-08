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

/**
 * A boxed list of destinations for the foot of a card: one hairline-divided
 * row per link, the whole row is the target. The list exists so the reader
 * can tell at a glance which parts of a card are clickable (the rows) and
 * which are not (everything above them).
 */
const NavList = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...rest }, ref) => (
    <div
      ref={ref}
      className={cn("divide-y divide-edge rounded-sm border border-edge", className)}
      {...rest}
    />
  ),
);
NavList.displayName = "NavList";

const arrowClass = "size-3.5 shrink-0";

function ArrowUpRight() {
  return (
    <svg className={arrowClass} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path d="M192,64V168a8,8,0,0,1-16,0V83.31L69.66,189.66a8,8,0,0,1-11.32-11.32L164.69,72H80a8,8,0,0,1,0-16H184A8,8,0,0,1,192,64Z" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg className={arrowClass} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z" />
    </svg>
  );
}

type NavRowProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  /** Outbound: opens in a new tab and carries the ↗ arrow; in-app rows carry →. */
  external?: boolean;
  /** Monospace label, for hosts and paths. */
  mono?: boolean;
  /** Lend the row's chassis to the child element (a router Link). */
  asChild?: boolean;
  children?: ReactNode;
};

/**
 * One row of a `NavList`. Renders an anchor, or with `asChild` lends its
 * classes and arrow to the child (a Next `Link`, say). The arrow rides
 * inline right after the label, never at the far edge of the row.
 */
const NavRow = forwardRef<HTMLAnchorElement, NavRowProps>(
  ({ external = false, mono = false, asChild = false, className, children, ...rest }, ref) => {
    const classes = cn(
      "flex w-full items-center gap-1.5 px-3 py-2 text-sm font-medium text-foreground",
      "transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
      mono && "font-mono",
      className,
    );
    const arrow = external ? <ArrowUpRight /> : <ArrowRight />;

    if (asChild && isValidElement(children)) {
      const label = (children.props as { children?: ReactNode }).children;
      return cloneElement(
        children as ReactElement<Record<string, unknown>>,
        { className: classes, ref, ...rest },
        <>
          {label}
          {arrow}
        </>,
      );
    }

    return (
      <a
        ref={ref}
        className={classes}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...rest}
      >
        {children}
        {arrow}
      </a>
    );
  },
);
NavRow.displayName = "NavRow";

export { NavList, NavRow, type NavRowProps };
