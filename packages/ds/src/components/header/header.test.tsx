import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  Header,
  HeaderBreadcrumb,
  HeaderBreadcrumbSegment,
} from "./header";
import tokens from "../../styles/tokens.css?raw";

describe("Header", () => {
  it("renders children, rightSlot, and the skip link", () => {
    render(
      <Header rightSlot={<button type="button">Account</button>}>
        <span>Breadcrumbs</span>
      </Header>,
    );
    expect(screen.getByText("Breadcrumbs")).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "Account" }),
    ).toBeTruthy();
    const skip = screen.getByText("Skip to content");
    expect(skip.getAttribute("href")).toBe("#main");
  });
});

describe("Header height token", () => {
  it("the bar reads its height from --ds-header-height, which tokens.css defines", () => {
    const { container } = render(<Header>bar</Header>);
    const header = container.querySelector("header") as HTMLElement;
    expect(header.className).toContain("h-(--ds-header-height)");
    expect(header.className).not.toContain("h-16");
    expect(tokens).toMatch(/--ds-header-height:\s*4rem;/);
  });
});

describe("HeaderBreadcrumb", () => {
  it("renders each segment with separators between them", () => {
    render(
      <HeaderBreadcrumb>
        <HeaderBreadcrumbSegment>Projects</HeaderBreadcrumbSegment>
        <HeaderBreadcrumbSegment current>my-app</HeaderBreadcrumbSegment>
      </HeaderBreadcrumb>,
    );
    expect(screen.getByText("Projects")).toBeTruthy();
    expect(screen.getByText("my-app")).toBeTruthy();
    expect(
      screen.getByRole("navigation", { name: "Breadcrumb" }),
    ).toBeTruthy();
  });
});

describe("HeaderBreadcrumbSegment", () => {
  it("sets aria-current='page' when current", () => {
    render(<HeaderBreadcrumbSegment current>Now</HeaderBreadcrumbSegment>);
    expect(screen.getByText("Now").getAttribute("aria-current")).toBe(
      "page",
    );
  });

  it("clones the child element when asChild", () => {
    render(
      <HeaderBreadcrumbSegment asChild>
        <a href="/projects">Projects</a>
      </HeaderBreadcrumbSegment>,
    );
    const link = screen.getByRole("link", { name: "Projects" });
    expect(link.getAttribute("href")).toBe("/projects");
    expect(link.className).toContain("truncate");
  });
});
