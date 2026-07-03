import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@ac/lib/cn";

type EmptyStateProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "title" | "children"
> & {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
};

const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ title, description, icon, action, className, ...rest }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col items-center gap-4 px-6 py-12 text-center",
        className,
      )}
      {...rest}
    >
      {icon ? (
        <span
          aria-hidden="true"
          className="text-muted-foreground [&>svg]:size-8"
        >
          {icon}
        </span>
      ) : null}
      <div className="flex flex-col gap-1.5">
        <h3 className="font-heading font-bold text-lg text-foreground">
          {title}
        </h3>
        {description ? (
          <p className="mx-auto max-w-sm text-sm text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {action ? (
        <div className="flex flex-wrap items-center justify-center gap-3">
          {action}
        </div>
      ) : null}
    </div>
  ),
);

EmptyState.displayName = "EmptyState";

export { EmptyState, type EmptyStateProps };
