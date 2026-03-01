import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatusDot } from "./status-dot";

describe("StatusDot", () => {
  it("renders a span element", () => {
    render(<StatusDot status="healthy" />);
    const dot = screen.getByRole("status");
    expect(dot.tagName).toBe("SPAN");
  });

  it("has role=status", () => {
    render(<StatusDot status="degraded" />);
    expect(screen.getByRole("status")).toBeTruthy();
  });

  it("derives aria-label from status prop", () => {
    render(<StatusDot status="offline" />);
    expect(screen.getByRole("status")).toHaveAttribute(
      "aria-label",
      "Offline",
    );
  });

  it("defaults to Unknown label when status is omitted", () => {
    render(<StatusDot />);
    expect(screen.getByRole("status")).toHaveAttribute(
      "aria-label",
      "Unknown",
    );
  });

  it("allows consumer to override aria-label", () => {
    render(<StatusDot status="healthy" aria-label="Node is healthy" />);
    expect(screen.getByLabelText("Node is healthy")).toBeTruthy();
  });

  it("merges custom className", () => {
    render(<StatusDot status="healthy" className="custom" />);
    const dot = screen.getByRole("status");
    expect(dot.className).toContain("custom");
  });

  it("applies status variant", () => {
    const { container } = render(<StatusDot status="offline" />);
    const dot = container.firstElementChild;
    expect(dot?.className).toBeTruthy();
  });

  it("applies size variant", () => {
    const { container } = render(
      <StatusDot status="healthy" size="sm" />,
    );
    const dot = container.firstElementChild;
    expect(dot?.className).toBeTruthy();
  });
});
