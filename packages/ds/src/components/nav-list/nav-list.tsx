import {
  cloneElement,
  forwardRef,
  isValidElement,
  type AnchorHTMLAttributes,
  type ForwardedRef,
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

type NavRowProps = HTMLAttributes<HTMLElement> &
  Pick<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "target" | "rel" | "download"> & {
    /** Outbound: opens in a new tab and carries the ↗ arrow; in-app rows carry →. */
    external?: boolean;
    /** Monospace label, for hosts and paths. */
    mono?: boolean;
    /** Lend the row's chassis to the child element (a router Link). */
    asChild?: boolean;
    /**
     * A statement, not a destination (a done step, "Cool-down · 39h left"):
     * a `<div>` with the row's layout and slots but no arrow, hover, focus
     * ring or role.
     */
    static?: boolean;
    /** `muted` for a row whose step is done: label and arrow in muted text. */
    tone?: "default" | "muted";
    /** Before the label: a StatusDot, an icon. */
    leading?: ReactNode;
    /**
     * After the arrow, pushed to the row's end. A string or number renders in
     * muted small text (a status word, a count); any other node (a Badge)
     * renders as-is.
     */
    trailing?: ReactNode;
    children?: ReactNode;
  };

/**
 * One row of a `NavList`. Renders an anchor when given `href`, a
 * `<button type="button">` without one (a copy, an in-page action), a plain
 * `<div>` with `static` (a statement row), or with `asChild` lends its
 * classes and arrow to the child (a Next `Link`, say). The arrow rides inline
 * right after the label, never at the far edge of the row, and only on rows
 * that can be clicked.
 */
const NavRow = forwardRef<HTMLElement, NavRowProps>(
  (
    {
      external = false,
      mono = false,
      asChild = false,
      static: isStatic = false,
      tone = "default",
      leading,
      trailing,
      href,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const classes = cn(
      "flex w-full items-center gap-1.5 px-3 py-2 text-left text-sm font-medium",
      tone === "muted" ? "text-muted-foreground" : "text-foreground",
      !isStatic &&
        "transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
      mono && "font-mono",
      className,
    );
    const arrow = external ? <ArrowUpRight /> : <ArrowRight />;
    const trailingIsText = typeof trailing === "string" || typeof trailing === "number";
    const content = (label: ReactNode) => (
      <>
        {leading ? <span className="inline-flex shrink-0 items-center">{leading}</span> : null}
        <span className="min-w-0 truncate">{label}</span>
        {isStatic ? null : arrow}
        {trailing ? (
          <span
            className={cn(
              "ml-auto shrink-0 pl-2",
              trailingIsText && "text-xs font-normal text-muted-foreground",
            )}
          >
            {trailing}
          </span>
        ) : null}
      </>
    );

    if (isStatic) {
      return (
        <div ref={ref as ForwardedRef<HTMLDivElement>} className={classes} {...rest}>
          {content(children)}
        </div>
      );
    }

    if (asChild && isValidElement(children)) {
      const label = (children.props as { children?: ReactNode }).children;
      return cloneElement(
        children as ReactElement<Record<string, unknown>>,
        { className: classes, ref, ...(href === undefined ? {} : { href }), ...rest },
        content(label),
      );
    }

    if (href === undefined) {
      return (
        <button
          ref={ref as ForwardedRef<HTMLButtonElement>}
          type="button"
          className={classes}
          {...rest}
        >
          {content(children)}
        </button>
      );
    }

    return (
      <a
        ref={ref as ForwardedRef<HTMLAnchorElement>}
        className={classes}
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...rest}
      >
        {content(children)}
      </a>
    );
  },
);
NavRow.displayName = "NavRow";

export { NavList, NavRow, type NavRowProps };
