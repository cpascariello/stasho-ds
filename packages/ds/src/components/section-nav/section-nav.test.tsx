import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SectionNav, SectionNavItem } from "./section-nav";

describe("SectionNav / SectionNavItem", () => {
  it("renders a labelled nav wrapping a list of anchors with their hrefs", () => {
    render(
      <SectionNav>
        <SectionNavItem href="/settings/general">General</SectionNavItem>
        <SectionNavItem href="/settings/domains">Domains</SectionNavItem>
      </SectionNav>,
    );
    const nav = screen.getByRole("navigation", { name: "Sections" });
    expect(nav.querySelector("ul")).toBeTruthy();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByRole("link", { name: "General" }).getAttribute("href")).toBe(
      "/settings/general",
    );
    expect(screen.getByRole("link", { name: "Domains" }).getAttribute("href")).toBe(
      "/settings/domains",
    );
  });

  it("takes a custom label", () => {
    render(<SectionNav label="Settings sections" />);
    expect(screen.getByRole("navigation", { name: "Settings sections" })).toBeTruthy();
  });

  it("the active item carries aria-current=page and the accent classes, others do not", () => {
    render(
      <SectionNav>
        <SectionNavItem href="/a">Inactive</SectionNavItem>
        <SectionNavItem href="/b" active>
          Active
        </SectionNavItem>
      </SectionNav>,
    );
    const active = screen.getByRole("link", { name: "Active" });
    const inactive = screen.getByRole("link", { name: "Inactive" });
    expect(active.getAttribute("aria-current")).toBe("page");
    expect(active.className).toContain("bg-accent/10");
    expect(active.className).toContain("text-accent");
    expect(inactive.getAttribute("aria-current")).toBeNull();
    expect(inactive.className).not.toContain("bg-accent/10");
    expect(inactive.className).toContain("hover:bg-muted");
  });

  it("asChild lends the classes and aria-current to the child and keeps its href", () => {
    render(
      <SectionNav>
        <SectionNavItem asChild active>
          <a href="/settings/env" data-custom="yes">
            Environment
          </a>
        </SectionNavItem>
      </SectionNav>,
    );
    const link = screen.getByRole("link", { name: "Environment" });
    expect(link.getAttribute("href")).toBe("/settings/env");
    expect(link.getAttribute("data-custom")).toBe("yes");
    expect(link.getAttribute("aria-current")).toBe("page");
    expect(link.className).toContain("px-3");
    expect(link.className).toContain("text-accent");
    expect(link.closest("li")).toBeTruthy();
  });

  it("onClick fires", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn((event: { preventDefault: () => void }) => event.preventDefault());
    render(
      <SectionNav>
        <SectionNavItem href="/a" onClick={onClick}>
          General
        </SectionNavItem>
      </SectionNav>,
    );
    await user.click(screen.getByRole("link", { name: "General" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("the icon slot renders before the label and is hidden from assistive tech", () => {
    render(
      <SectionNav>
        <SectionNavItem href="/a" icon={<svg data-testid="icon" />}>
          General
        </SectionNavItem>
      </SectionNav>,
    );
    const link = screen.getByRole("link", { name: "General" });
    const slot = screen.getByTestId("icon").parentElement as HTMLElement;
    expect(link.firstElementChild).toBe(slot);
    expect(slot.getAttribute("aria-hidden")).toBe("true");
    expect(slot.className).toContain("[&>svg]:size-4");
    expect(link.lastElementChild?.className).toContain("truncate");
  });
});
