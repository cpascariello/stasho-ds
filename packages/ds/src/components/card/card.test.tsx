import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Card } from "./card";

describe("Card", () => {
  it("renders children", () => {
    render(<Card>Content here</Card>);
    expect(screen.getByText("Content here")).toBeTruthy();
  });

  it("renders title when provided", () => {
    render(<Card title="My Title">Body</Card>);
    expect(screen.getByText("My Title")).toBeTruthy();
    expect(screen.getByText("My Title").tagName).toBe("H3");
  });

  it("title is 16px in the heading face", () => {
    render(<Card title="My Title">Body</Card>);
    const cls = screen.getByText("My Title").className;
    expect(cls).toContain("text-base");
    expect(cls).toContain("font-heading");
    expect(cls).not.toContain("text-lg");
  });

  it("renders the action beside the title and keeps it from shrinking", () => {
    render(
      <Card title="Domains" action={<button type="button">Manage</button>}>
        Body
      </Card>,
    );
    const action = screen.getByRole("button", { name: "Manage" });
    const row = screen.getByText("Domains").parentElement;
    expect(row).toBe(action.parentElement?.parentElement);
    expect(action.parentElement?.className).toContain("shrink-0");
    expect(screen.getByText("Domains").className).toContain("min-w-0");
  });

  it("renders the title row for an action with no title", () => {
    const { container } = render(
      <Card action={<button type="button">Only</button>}>Body</Card>,
    );
    expect(container.querySelector("h3")).toBeNull();
    expect(screen.getByRole("button", { name: "Only" })).toBeTruthy();
  });

  it("renders as a div", () => {
    const { container } = render(<Card>Test</Card>);
    expect(container.firstElementChild?.tagName).toBe("DIV");
  });

  it("merges custom className", () => {
    const { container } = render(<Card className="custom">Test</Card>);
    expect(container.firstElementChild?.className).toContain("custom");
  });

  it("omits title heading when not provided", () => {
    const { container } = render(<Card>No title</Card>);
    expect(container.querySelector("h3")).toBeNull();
  });

  it("default variant carries the bg-surface chassis", () => {
    const { container } = render(<Card>Test</Card>);
    expect(container.firstElementChild?.className).toContain("bg-surface");
  });

  it("default variant carries a 1px border-edge hairline", () => {
    const { container } = render(<Card>Test</Card>);
    const cls = container.firstElementChild?.className ?? "";
    expect(cls).toContain("border");
    expect(cls).toContain("border-edge");
  });

  it("ghost variant has no border", () => {
    const { container } = render(<Card variant="ghost">Test</Card>);
    const cls = container.firstElementChild?.className ?? "";
    expect(cls).toContain("bg-transparent");
    expect(cls).not.toContain("border-edge");
  });

  it("applies rounded-lg (6px under Abyssal scale)", () => {
    const { container } = render(<Card>Test</Card>);
    expect(container.firstElementChild?.className).toContain("rounded-lg");
  });
});
