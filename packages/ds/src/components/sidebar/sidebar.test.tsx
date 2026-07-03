import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Sidebar, SidebarCollapseToggle, SidebarItem } from "./sidebar";

describe("SidebarItem", () => {
  it("renders an anchor without target/rel by default", () => {
    render(
      <Sidebar>
        <SidebarItem
          icon={<span data-testid="icon" />}
          label="Settings"
          href="/dashboard/settings"
        />
      </Sidebar>,
    );
    const link = screen.getByRole("link", { name: /settings/i });
    expect(link.getAttribute("target")).toBeNull();
    expect(link.getAttribute("rel")).toBeNull();
  });

  it("forwards target and rel to the rendered anchor", () => {
    render(
      <Sidebar>
        <SidebarItem
          icon={<span data-testid="icon" />}
          label="Docs"
          href="https://docs.stasho.xyz"
          target="_blank"
          rel="noopener noreferrer"
        />
      </Sidebar>,
    );
    const link = screen.getByRole("link", { name: /docs/i });
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toBe("noopener noreferrer");
  });
});

describe("Sidebar collapse", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("uncontrolled: honors defaultCollapsed", () => {
    const { container } = render(
      <Sidebar defaultCollapsed>
        <div>body</div>
      </Sidebar>,
    );
    const aside = container.querySelector("aside");
    expect(aside?.getAttribute("data-collapsed")).toBe("true");
    expect(aside?.className).toContain("w-14");
  });

  it("uncontrolled: hydrates from storageKey and persists on toggle", async () => {
    const user = userEvent.setup();
    window.localStorage.setItem("sb", "false");
    render(
      <Sidebar storageKey="sb">
        <SidebarCollapseToggle />
      </Sidebar>,
    );
    await user.click(
      screen.getByRole("button", { name: "Collapse sidebar" }),
    );
    expect(window.localStorage.getItem("sb")).toBe("true");
  });

  it("controlled: does not self-update, reports via onCollapsedChange", async () => {
    const user = userEvent.setup();
    const onCollapsedChange = vi.fn();
    const { container } = render(
      <Sidebar collapsed={false} onCollapsedChange={onCollapsedChange}>
        <SidebarCollapseToggle />
      </Sidebar>,
    );
    await user.click(
      screen.getByRole("button", { name: "Collapse sidebar" }),
    );
    expect(onCollapsedChange).toHaveBeenCalledWith(true);
    // Controlled: width stays until the parent flips the prop.
    expect(container.querySelector("aside")?.className).toContain("w-60");
  });
});
