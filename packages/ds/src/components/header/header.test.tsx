import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  Header,
  HeaderBreadcrumb,
  HeaderBreadcrumbSegment,
} from "./header";

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
