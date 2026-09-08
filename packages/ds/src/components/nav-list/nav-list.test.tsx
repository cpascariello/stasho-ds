import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { NavList, NavRow } from "./nav-list";

describe("NavList / NavRow", () => {
  it("renders an in-app row as an anchor with the label and an inline arrow after it", () => {
    render(
      <NavList>
        <NavRow href="/projects/p1/deployments">View deployments</NavRow>
      </NavList>,
    );
    const link = screen.getByRole("link", { name: "View deployments" });
    expect(link.getAttribute("href")).toBe("/projects/p1/deployments");
    expect(link.getAttribute("target")).toBeNull();
    expect(link.lastElementChild?.tagName).toBe("svg");
  });

  it("external rows open in a new tab with rel noopener", () => {
    render(
      <NavRow href="https://myapp.example.com" external mono>
        myapp.example.com
      </NavRow>,
    );
    const link = screen.getByRole("link", { name: "myapp.example.com" });
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toBe("noopener noreferrer");
    expect(link.className).toContain("font-mono");
  });

  it("asChild lends the chassis and the arrow to the child element", () => {
    render(
      <NavRow asChild>
        <a href="/vm" data-custom="yes">
          View App VM
        </a>
      </NavRow>,
    );
    const link = screen.getByRole("link", { name: "View App VM" });
    expect(link.getAttribute("data-custom")).toBe("yes");
    expect(link.className).toContain("px-3");
    expect(link.lastElementChild?.tagName).toBe("svg");
  });

  it("the list divides rows with hairlines inside one bordered box", () => {
    const { container } = render(
      <NavList>
        <NavRow href="/a">A</NavRow>
        <NavRow href="/b">B</NavRow>
      </NavList>,
    );
    const cls = container.firstElementChild?.className ?? "";
    expect(cls).toContain("divide-y");
    expect(cls).toContain("border-edge");
    expect(cls).toContain("rounded-sm");
  });
});
