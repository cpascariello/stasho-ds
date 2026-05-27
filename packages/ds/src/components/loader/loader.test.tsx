import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Loader } from "./loader";

describe("Loader", () => {
  it("renders a span with role=status", () => {
    render(<Loader />);
    const loader = screen.getByRole("status");
    expect(loader.tagName).toBe("SPAN");
  });

  it("defaults aria-label to 'Loading' when no children", () => {
    render(<Loader />);
    expect(screen.getByRole("status")).toHaveAttribute("aria-label", "Loading");
  });

  it("allows aria-label override when no children", () => {
    render(<Loader aria-label="Fetching data" />);
    expect(screen.getByLabelText("Fetching data")).toBeTruthy();
  });

  it("renders inline label from children", () => {
    render(<Loader>Saving…</Loader>);
    expect(screen.getByText("Saving…")).toBeTruthy();
  });

  it("omits aria-label when children are provided (children are the label)", () => {
    render(<Loader>Saving…</Loader>);
    expect(screen.getByRole("status")).not.toHaveAttribute("aria-label");
  });

  it("renders two animated dots", () => {
    const { container } = render(<Loader />);
    expect(container.querySelectorAll(".animate-button-chase-a").length).toBe(1);
    expect(container.querySelectorAll(".animate-button-chase-b").length).toBe(1);
  });

  it("merges custom className", () => {
    render(<Loader className="custom" />);
    expect(screen.getByRole("status").className).toContain("custom");
  });

  it("forwards ref to the root span", () => {
    let captured: HTMLSpanElement | null = null;
    render(<Loader ref={(el) => { captured = el; }} />);
    expect(captured).not.toBeNull();
    expect(captured!.tagName).toBe("SPAN");
  });

  it("accepts a size variant", () => {
    const { rerender, container } = render(<Loader size="xs" />);
    expect(container.firstElementChild?.className).toContain("text-xs");
    rerender(<Loader size="md" />);
    expect(container.firstElementChild?.className).toContain("text-sm");
  });
});
