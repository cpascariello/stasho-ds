import { forwardRef, useState } from "react";
import { Popover } from "radix-ui";
import { Command } from "cmdk";
import {
  CaretDown,
  Check,
  List,
  Plus,
  SquaresFour,
} from "@phosphor-icons/react";
import { cn } from "@ac/lib/cn";

type ProjectSwitcherItem = {
  id: string;
  label: string;
  /** Extra search terms (e.g. full repo name, stored project name). */
  keywords?: string[];
};

type ProjectSwitcherGroup = {
  /** Stable key — labels are not unique (encrypted placeholders collide). */
  id: string;
  label: string;
  items: ProjectSwitcherItem[];
};

type ProjectSwitcherProps = {
  groups: ProjectSwitcherGroup[];
  solos: ProjectSwitcherItem[];
  currentId: string;
  triggerLabel: string;
  collapsed?: boolean;
  onSelect: (id: string) => void;
  onViewAll: () => void;
  onNewProject: () => void;
  searchPlaceholder?: string;
  emptyMessage?: string;
  viewAllLabel?: string;
  newProjectLabel?: string;
  className?: string;
};

function itemMatches(item: ProjectSwitcherItem, needle: string): boolean {
  if (item.label.toLowerCase().includes(needle)) return true;
  return (item.keywords ?? []).some((k) => k.toLowerCase().includes(needle));
}

const itemClasses = (isCurrent: boolean, indent: boolean) =>
  cn(
    "flex cursor-pointer select-none items-center gap-2 rounded-sm",
    "px-3 py-2 text-sm text-foreground outline-none",
    "data-[selected=true]:bg-muted",
    indent && "pl-6",
    isCurrent && "font-semibold",
  );

const actionClasses = cn(
  "flex cursor-pointer select-none items-center gap-2 rounded-sm",
  "px-3 py-2 text-sm text-foreground outline-none",
  "data-[selected=true]:bg-muted",
);

const ProjectSwitcher = forwardRef<HTMLButtonElement, ProjectSwitcherProps>(
  (
    {
      groups,
      solos,
      currentId,
      triggerLabel,
      collapsed = false,
      onSelect,
      onViewAll,
      onNewProject,
      searchPlaceholder = "Search projects…",
      emptyMessage = "No matches",
      viewAllLabel = "View all projects",
      newProjectLabel = "New project",
      className,
    },
    ref,
  ) => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const needle = query.trim().toLowerCase();

    // Group-first filtering: a group stays WHOLE when its own label or any
    // child matches; solos filter individually. Manual (shouldFilter=false)
    // because cmdk's scorer would re-rank rows and break the caller's
    // deterministic ordering.
    const visibleGroups = needle
      ? groups.filter(
          (g) =>
            g.label.toLowerCase().includes(needle) ||
            g.items.some((i) => itemMatches(i, needle)),
        )
      : groups;
    const visibleSolos = needle
      ? solos.filter((i) => itemMatches(i, needle))
      : solos;
    const nothingMatches =
      visibleGroups.length === 0 && visibleSolos.length === 0;

    const close = () => {
      setOpen(false);
      setQuery("");
    };

    const renderItem = (item: ProjectSwitcherItem, indent: boolean) => (
      <Command.Item
        key={item.id}
        value={item.id}
        onSelect={() => {
          close();
          onSelect(item.id);
        }}
        aria-current={item.id === currentId || undefined}
        className={itemClasses(item.id === currentId, indent)}
      >
        <span className="truncate">{item.label}</span>
        {item.id === currentId && (
          <Check
            weight="bold"
            className="ml-auto size-3.5 shrink-0 text-accent"
            aria-hidden="true"
          />
        )}
      </Command.Item>
    );

    return (
      <Popover.Root
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) setQuery("");
        }}
      >
        <Popover.Trigger
          ref={ref}
          aria-label={triggerLabel}
          title={collapsed ? triggerLabel : undefined}
          className={cn(
            "flex w-full items-center rounded-md",
            "text-sm font-semibold text-foreground",
            "hover:bg-muted",
            "focus-visible:outline-none focus-visible:ring-2",
            "focus-visible:ring-accent",
            collapsed
              ? "h-9 justify-center px-0"
              : "gap-2 border border-edge bg-surface px-3 py-2",
            className,
          )}
        >
          {collapsed ? (
            <SquaresFour size={20} aria-hidden="true" />
          ) : (
            <>
              <span className="flex-1 truncate text-left">{triggerLabel}</span>
              <CaretDown
                size={12}
                aria-hidden="true"
                className="shrink-0 text-foreground/60"
              />
            </>
          )}
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            align="start"
            sideOffset={4}
            className={cn(
              "z-50 w-72 overflow-hidden rounded-sm",
              "bg-popover-bg border border-popover-border shadow",
            )}
          >
            <Command shouldFilter={false}>
              <Command.Input
                value={query}
                onValueChange={setQuery}
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder}
                className={cn(
                  "w-full border-b border-edge bg-transparent px-4 py-2.5",
                  "text-sm text-foreground placeholder:text-muted-foreground",
                  "outline-none",
                )}
              />
              <Command.List className="max-h-64 overflow-y-auto p-1">
                {nothingMatches && (
                  <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                    {emptyMessage}
                  </div>
                )}
                {visibleGroups.map((g) => (
                  <Command.Group
                    key={g.id}
                    value={g.id}
                    heading={g.label}
                    className={cn(
                      "[&_[cmdk-group-heading]]:px-3",
                      "[&_[cmdk-group-heading]]:pb-1",
                      "[&_[cmdk-group-heading]]:pt-2",
                      "[&_[cmdk-group-heading]]:text-[11px]",
                      "[&_[cmdk-group-heading]]:uppercase",
                      "[&_[cmdk-group-heading]]:tracking-wider",
                      "[&_[cmdk-group-heading]]:text-muted-foreground",
                    )}
                  >
                    {g.items.map((i) => renderItem(i, true))}
                  </Command.Group>
                ))}
                {visibleSolos.map((i) => renderItem(i, false))}
                <Command.Separator
                  alwaysRender
                  className="my-1 h-px bg-edge"
                />
                <Command.Item
                  value="__view-all"
                  onSelect={() => {
                    close();
                    onViewAll();
                  }}
                  className={actionClasses}
                >
                  <List size={14} aria-hidden="true" />
                  {viewAllLabel}
                </Command.Item>
                <Command.Item
                  value="__new-project"
                  onSelect={() => {
                    close();
                    onNewProject();
                  }}
                  className={actionClasses}
                >
                  <Plus size={14} aria-hidden="true" />
                  {newProjectLabel}
                </Command.Item>
              </Command.List>
            </Command>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    );
  },
);

ProjectSwitcher.displayName = "ProjectSwitcher";

export {
  ProjectSwitcher,
  type ProjectSwitcherProps,
  type ProjectSwitcherGroup,
  type ProjectSwitcherItem,
};
