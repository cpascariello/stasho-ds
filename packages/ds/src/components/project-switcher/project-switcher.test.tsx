// Polyfills for Radix Popover in jsdom — same as combobox.test.tsx
import { vi } from "vitest";

class MockPointerEvent extends Event {
  button: number;
  ctrlKey: boolean;
  pointerType: string;
  constructor(
    type: string,
    props: PointerEventInit & { pointerType?: string } = {},
  ) {
    super(type, props);
    this.button = props.button ?? 0;
    this.ctrlKey = props.ctrlKey ?? false;
    this.pointerType = props.pointerType ?? "mouse";
  }
}
window.PointerEvent = MockPointerEvent as unknown as typeof PointerEvent;
window.HTMLElement.prototype.scrollIntoView = vi.fn();
window.HTMLElement.prototype.hasPointerCapture = vi.fn();
window.HTMLElement.prototype.releasePointerCapture = vi.fn();

if (typeof globalThis.ResizeObserver === "undefined") {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
}

if (typeof globalThis.DOMRect === "undefined") {
  globalThis.DOMRect = class DOMRect {
    x = 0;
    y = 0;
    width = 0;
    height = 0;
    top = 0;
    right = 0;
    bottom = 0;
    left = 0;
    constructor(x = 0, y = 0, width = 0, height = 0) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.top = y;
      this.right = x + width;
      this.bottom = y + height;
      this.left = x;
    }
    toJSON() {
      return JSON.stringify(this);
    }
    static fromRect() {
      return new DOMRect();
    }
  } as unknown as typeof DOMRect;
}

import { type ComponentProps } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ProjectSwitcher } from "./project-switcher";

const GROUPS = [
  {
    id: "hash-mono",
    label: "mono-shop",
    items: [
      { id: "p-web", label: "web", keywords: ["user/mono-shop", "mono-shop-web"] },
      { id: "p-api", label: "api", keywords: ["user/mono-shop", "mono-shop-api"] },
    ],
  },
];

const SOLOS = [
  { id: "p-folio", label: "my-portfolio", keywords: ["user/my-portfolio"] },
  { id: "p-pasta", label: "pasta-drop" },
];

function renderSwitcher(
  overrides: Partial<ComponentProps<typeof ProjectSwitcher>> = {},
) {
  const handlers = {
    onSelect: vi.fn(),
    onViewAll: vi.fn(),
    onNewProject: vi.fn(),
  };
  render(
    <ProjectSwitcher
      groups={GROUPS}
      solos={SOLOS}
      currentId="p-web"
      triggerLabel="mono-shop / web"
      {...handlers}
      {...overrides}
    />,
  );
  return handlers;
}

describe("ProjectSwitcher", () => {
  it("renders the expanded trigger with the trigger label", () => {
    renderSwitcher();
    expect(
      screen.getByRole("button", { name: "mono-shop / web" }),
    ).toBeDefined();
    expect(screen.getByText("mono-shop / web")).toBeDefined();
  });

  it("collapsed trigger is icon-only with the label as title", () => {
    renderSwitcher({ collapsed: true });
    const trigger = screen.getByRole("button", { name: "mono-shop / web" });
    expect(trigger).toHaveAttribute("title", "mono-shop / web");
    expect(screen.queryByText("mono-shop / web")).toBeNull();
  });

  it("opens on click: search input, group heading, children, solos", async () => {
    const user = userEvent.setup();
    renderSwitcher();
    await user.click(screen.getByRole("button"));
    expect(screen.getByRole("combobox")).toBeDefined();
    expect(screen.getByText("mono-shop")).toBeDefined();
    expect(screen.getByText("web")).toBeDefined();
    expect(screen.getByText("api")).toBeDefined();
    expect(screen.getByText("my-portfolio")).toBeDefined();
    expect(screen.getByText("pasta-drop")).toBeDefined();
  });

  it("group-first filter: a child hit keeps the whole group, drops solos", async () => {
    const user = userEvent.setup();
    renderSwitcher();
    await user.click(screen.getByRole("button"));
    await user.type(screen.getByRole("combobox"), "api");
    expect(screen.getByText("api")).toBeDefined();
    expect(screen.getByText("web")).toBeDefined(); // sibling survives
    expect(screen.getByText("mono-shop")).toBeDefined(); // heading survives
    expect(screen.queryByText("my-portfolio")).toBeNull();
    expect(screen.queryByText("pasta-drop")).toBeNull();
  });

  it("group-label hit surfaces the whole group", async () => {
    const user = userEvent.setup();
    renderSwitcher();
    await user.click(screen.getByRole("button"));
    await user.type(screen.getByRole("combobox"), "mono-sh");
    expect(screen.getByText("web")).toBeDefined();
    expect(screen.getByText("api")).toBeDefined();
  });

  it("keywords match: solo found by its repo keyword", async () => {
    const user = userEvent.setup();
    renderSwitcher();
    await user.click(screen.getByRole("button"));
    await user.type(screen.getByRole("combobox"), "user/my-p");
    expect(screen.getByText("my-portfolio")).toBeDefined();
    expect(screen.queryByText("pasta-drop")).toBeNull();
  });

  it("empty state keeps footer actions visible", async () => {
    const user = userEvent.setup();
    renderSwitcher();
    await user.click(screen.getByRole("button"));
    await user.type(screen.getByRole("combobox"), "zzzz");
    expect(screen.getByText("No matches")).toBeDefined();
    expect(screen.getByText("View all projects")).toBeDefined();
    expect(screen.getByText("New project")).toBeDefined();
  });

  it("selecting an item fires onSelect with the id", async () => {
    const user = userEvent.setup();
    const handlers = renderSwitcher();
    await user.click(screen.getByRole("button"));
    await user.click(screen.getByText("api"));
    expect(handlers.onSelect).toHaveBeenCalledWith("p-api");
  });

  it("marks the current item with aria-current", async () => {
    const user = userEvent.setup();
    renderSwitcher();
    await user.click(screen.getByRole("button"));
    const current = screen.getByText("web").closest("[cmdk-item]");
    expect(current).toHaveAttribute("aria-current", "true");
  });

  it("footer actions fire their callbacks", async () => {
    const user = userEvent.setup();
    const handlers = renderSwitcher();
    await user.click(screen.getByRole("button"));
    await user.click(screen.getByText("View all projects"));
    expect(handlers.onViewAll).toHaveBeenCalled();
  });

  it("query resets when the popover closes", async () => {
    const user = userEvent.setup();
    renderSwitcher();
    await user.click(screen.getByRole("button"));
    await user.type(screen.getByRole("combobox"), "api");
    await user.keyboard("{Escape}");
    await user.click(screen.getByRole("button"));
    expect(screen.getByRole("combobox")).toHaveValue("");
    expect(screen.getByText("pasta-drop")).toBeDefined();
  });

  it("keyboard: Enter selects the auto-highlighted match", async () => {
    const user = userEvent.setup();
    const handlers = renderSwitcher();
    await user.click(screen.getByRole("button"));
    await user.type(screen.getByRole("combobox"), "pasta");
    await user.keyboard("{Enter}");
    expect(handlers.onSelect).toHaveBeenCalledWith("p-pasta");
  });

  it("keyboard: ArrowDown moves off the auto-highlighted first match", async () => {
    // "t" matches both solos (por*t*folio, pas*t*a) but no group member, so
    // the visible rows are the two solos in order: my-portfolio, pasta-drop.
    // cmdk auto-highlights the first match (my-portfolio), so ONE ArrowDown
    // lands on pasta-drop before Enter fires. This pins highlight traversal
    // across the solo/footer boundary.
    const user = userEvent.setup();
    const handlers = renderSwitcher();
    await user.click(screen.getByRole("button"));
    await user.type(screen.getByRole("combobox"), "t");
    expect(screen.getByText("my-portfolio")).toBeDefined();
    expect(screen.getByText("pasta-drop")).toBeDefined();
    expect(screen.queryByText("web")).toBeNull();
    await user.keyboard("{ArrowDown}{Enter}");
    expect(handlers.onSelect).toHaveBeenCalledWith("p-pasta");
  });

  it("labels the search input with an explicit aria-label", async () => {
    const user = userEvent.setup();
    renderSwitcher();
    await user.click(screen.getByRole("button"));
    expect(screen.getByRole("combobox")).toHaveAttribute(
      "aria-label",
      "Search projects…",
    );
  });

  it("aria-label follows the searchPlaceholder override", async () => {
    const user = userEvent.setup();
    renderSwitcher({ searchPlaceholder: "Find a workspace" });
    await user.click(screen.getByRole("button"));
    expect(screen.getByRole("combobox")).toHaveAttribute(
      "aria-label",
      "Find a workspace",
    );
  });
});
