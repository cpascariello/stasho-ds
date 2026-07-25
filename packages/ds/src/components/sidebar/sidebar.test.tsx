import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Sidebar,
  SidebarCollapseToggle,
  SidebarItem,
  SidebarNav,
  SidebarSection,
} from "./sidebar";

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

describe("SidebarSection title", () => {
  it("renders a static title with no link role", () => {
    render(
      <Sidebar>
        <SidebarSection title="Recent">
          <li>row</li>
        </SidebarSection>
      </Sidebar>,
    );
    expect(screen.getByText("Recent")).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /recent/i }),
    ).not.toBeInTheDocument();
  });

  it("renders a linked title when titleHref is provided", () => {
    render(
      <Sidebar>
        <SidebarSection title="my-repo" titleHref="/projects/repo/my-repo">
          <li>row</li>
        </SidebarSection>
      </Sidebar>,
    );
    const link = screen.getByRole("link", { name: /my-repo/i });
    expect(link.getAttribute("href")).toBe("/projects/repo/my-repo");
  });

  it("fires onTitleClick when the linked title is clicked", async () => {
    const user = userEvent.setup();
    const onTitleClick = vi.fn();
    render(
      <Sidebar>
        <SidebarSection
          title="my-repo"
          titleHref="/projects/repo/my-repo"
          onTitleClick={onTitleClick}
        >
          <li>row</li>
        </SidebarSection>
      </Sidebar>,
    );
    await user.click(screen.getByRole("link", { name: /my-repo/i }));
    expect(onTitleClick).toHaveBeenCalledTimes(1);
  });

  it("hides the title in both the static and linked variants when collapsed", () => {
    const { rerender } = render(
      <Sidebar collapsed>
        <SidebarSection title="Recent">
          <li>row</li>
        </SidebarSection>
      </Sidebar>,
    );
    expect(screen.queryByText("Recent")).not.toBeInTheDocument();

    rerender(
      <Sidebar collapsed>
        <SidebarSection title="my-repo" titleHref="/projects/repo/my-repo">
          <li>row</li>
        </SidebarSection>
      </Sidebar>,
    );
    expect(screen.queryByText("my-repo")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /my-repo/i }),
    ).not.toBeInTheDocument();
  });
});

describe("SidebarNav structure", () => {
  it("emits valid HTML: no <ul> has a non-<li> direct child", () => {
    const { container } = render(
      <Sidebar>
        <SidebarNav>
          <a href="/back">Back</a>
          <SidebarSection>
            <SidebarItem
              icon={<span />}
              label="Overview"
              href="#overview"
            />
          </SidebarSection>
          <SidebarSection title="Account">
            <SidebarItem icon={<span />} label="Settings" href="#settings" />
          </SidebarSection>
        </SidebarNav>
      </Sidebar>,
    );

    // The nav itself must not be a <ul> that swallows sections/links as
    // invalid non-<li> children (the shell-promotion regression).
    const nav = container.querySelector("nav");
    expect(nav?.tagName).toBe("NAV");
    expect(nav?.querySelector(":scope > ul")).toBeNull();

    // Every <ul> in the tree may only contain <li> element children.
    for (const ul of container.querySelectorAll("ul")) {
      for (const child of ul.children) {
        expect(child.tagName).toBe("LI");
      }
    }
  });

  it("preserves the role=group section semantics", () => {
    render(
      <Sidebar>
        <SidebarNav>
          <SidebarSection title="Account">
            <SidebarItem icon={<span />} label="Settings" href="#settings" />
          </SidebarSection>
        </SidebarNav>
      </Sidebar>,
    );
    expect(
      screen.getByRole("group", { name: "Account" }),
    ).toBeInTheDocument();
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
