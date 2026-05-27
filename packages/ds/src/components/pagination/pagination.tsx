import { forwardRef, type HTMLAttributes } from "react";
import {
  CaretDoubleLeft,
  CaretDoubleRight,
  CaretLeft,
  CaretRight,
} from "@phosphor-icons/react";
import { cn } from "@ac/lib/cn";

type PageItem = number | "ellipsis";

type BuildPageRangeArgs = {
  page: number;
  totalPages: number;
  siblingCount: number;
  showFirstLast: boolean;
};

function buildPageRange({
  page,
  totalPages,
  siblingCount,
  showFirstLast,
}: BuildPageRangeArgs): PageItem[] {
  if (!showFirstLast) {
    const left = Math.max(page - siblingCount, 1);
    const right = Math.min(page + siblingCount, totalPages);
    const items: PageItem[] = [];
    for (let i = left; i <= right; i++) {
      items.push(i);
    }
    return items;
  }

  const maxSlots = 2 * siblingCount + 5;

  if (totalPages <= maxSlots) {
    const items: PageItem[] = [];
    for (let i = 1; i <= totalPages; i++) {
      items.push(i);
    }
    return items;
  }

  const nearStart = page <= siblingCount + 3;
  const nearEnd = page >= totalPages - siblingCount - 2;

  if (nearStart) {
    const items: PageItem[] = [];
    for (let i = 1; i <= maxSlots - 2; i++) {
      items.push(i);
    }
    items.push("ellipsis", totalPages);
    return items;
  }

  if (nearEnd) {
    const items: PageItem[] = [1, "ellipsis"];
    for (let i = totalPages - (maxSlots - 3); i <= totalPages; i++) {
      items.push(i);
    }
    return items;
  }

  const items: PageItem[] = [1, "ellipsis"];
  for (let i = page - siblingCount; i <= page + siblingCount; i++) {
    items.push(i);
  }
  items.push("ellipsis", totalPages);
  return items;
}

type PaginationProps = Omit<HTMLAttributes<HTMLElement>, "onChange"> & {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  showFirstLast?: boolean;
};

const NAV_BUTTON = [
  "inline-flex items-center justify-center",
  "size-8 rounded-none",
  "text-foreground/60 hover:text-accent-500 dark:hover:text-accent",
  "transition-colors cursor-pointer",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
].join(" ");

const NAV_DISABLED = "text-foreground/30 cursor-not-allowed";

const PAGE_BUTTON = [
  "inline-flex items-center justify-center",
  "size-[26px] rounded-none",
  "font-mono text-sm",
  "text-foreground/60 hover:text-accent-500 dark:hover:text-accent",
  "transition-colors cursor-pointer",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
].join(" ");

const PAGE_ACTIVE = [
  "bg-accent/15 text-accent-500 dark:text-accent",
  "hover:text-accent-500 dark:hover:text-accent",
].join(" ");

const Pagination = forwardRef<HTMLElement, PaginationProps>(
  (
    {
      page,
      totalPages,
      onPageChange,
      siblingCount = 1,
      showFirstLast = true,
      className,
      ...rest
    },
    ref,
  ) => {
    const items = buildPageRange({
      page,
      totalPages,
      siblingCount,
      showFirstLast,
    });

    const isFirst = page <= 1;
    const isLast = page >= totalPages;

    return (
      <nav
        ref={ref}
        aria-label="Pagination"
        className={cn("flex items-center gap-4", className)}
        {...rest}
      >
        {showFirstLast && (
          <button
            type="button"
            className={cn(NAV_BUTTON, isFirst && NAV_DISABLED)}
            aria-label="First page"
            aria-disabled={isFirst || undefined}
            onClick={isFirst ? undefined : () => onPageChange(1)}
          >
            <CaretDoubleLeft
              weight="bold"
              className="size-4"
              aria-hidden="true"
            />
          </button>
        )}

        <button
          type="button"
          className={cn(NAV_BUTTON, isFirst && NAV_DISABLED)}
          aria-label="Previous page"
          aria-disabled={isFirst || undefined}
          onClick={isFirst ? undefined : () => onPageChange(page - 1)}
        >
          <CaretLeft weight="bold" className="size-4" aria-hidden="true" />
        </button>

        {items.map((item, i) =>
          item === "ellipsis" ? (
            <span
              key={i}
              className="inline-flex items-center justify-center size-[26px] font-mono text-sm text-foreground/40 select-none"
              aria-hidden="true"
            >
              {"\u2026"}
            </span>
          ) : (
            <button
              key={i}
              type="button"
              className={cn(PAGE_BUTTON, item === page && PAGE_ACTIVE)}
              aria-label={`Page ${item}`}
              aria-current={item === page ? "page" : undefined}
              onClick={item === page ? undefined : () => onPageChange(item)}
            >
              {item}
            </button>
          ),
        )}

        <button
          type="button"
          className={cn(NAV_BUTTON, isLast && NAV_DISABLED)}
          aria-label="Next page"
          aria-disabled={isLast || undefined}
          onClick={isLast ? undefined : () => onPageChange(page + 1)}
        >
          <CaretRight weight="bold" className="size-4" aria-hidden="true" />
        </button>

        {showFirstLast && (
          <button
            type="button"
            className={cn(NAV_BUTTON, isLast && NAV_DISABLED)}
            aria-label="Last page"
            aria-disabled={isLast || undefined}
            onClick={isLast ? undefined : () => onPageChange(totalPages)}
          >
            <CaretDoubleRight
              weight="bold"
              className="size-4"
              aria-hidden="true"
            />
          </button>
        )}
      </nav>
    );
  },
);

Pagination.displayName = "Pagination";

export { buildPageRange, Pagination, type PageItem, type PaginationProps };
