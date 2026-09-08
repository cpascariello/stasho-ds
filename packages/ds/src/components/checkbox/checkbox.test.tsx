import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { createRef } from "react";
import { Checkbox } from "./checkbox";

describe("Checkbox", () => {
  it("renders as unchecked by default", () => {
    render(<Checkbox />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();
  });

  it("renders as checked when defaultChecked", () => {
    render(<Checkbox defaultChecked />);
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("toggles on click", async () => {
    const user = userEvent.setup();
    render(<Checkbox />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();
    await user.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  it("calls onCheckedChange when toggled", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Checkbox onCheckedChange={onChange} />);
    await user.click(screen.getByRole("checkbox"));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("does not toggle when disabled", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Checkbox disabled onCheckedChange={onChange} />);
    await user.click(screen.getByRole("checkbox"));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("sets aria-invalid when error is true", () => {
    render(<Checkbox error />);
    expect(screen.getByRole("checkbox")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("forwards ref", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Checkbox ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("merges custom className", () => {
    render(<Checkbox className="custom-class" />);
    expect(screen.getByRole("checkbox")).toHaveClass("custom-class");
  });

  it("renders with xs size prop", () => {
    render(<Checkbox size="xs" />);
    expect(screen.getByRole("checkbox")).toBeDefined();
  });

  it("rest chassis carries bg-background dark:bg-surface", () => {
    render(<Checkbox />);
    const cls = screen.getByRole("checkbox").className;
    expect(cls).toContain("bg-background");
    expect(cls).toContain("dark:bg-surface");
  });

  it("xs size renders at size-3.5", () => {
    render(<Checkbox size="xs" />);
    expect(screen.getByRole("checkbox").className).toContain("size-3.5");
  });

  it("sm size renders at size-4", () => {
    render(<Checkbox size="sm" />);
    expect(screen.getByRole("checkbox").className).toContain("size-4");
  });

  it("md size renders at size-5", () => {
    render(<Checkbox size="md" />);
    expect(screen.getByRole("checkbox").className).toContain("size-5");
  });

  it("all sizes carry rounded-sm", () => {
    for (const size of ["xs", "sm", "md"] as const) {
      const { unmount } = render(<Checkbox size={size} />);
      expect(screen.getByRole("checkbox").className).toContain("rounded-sm");
      unmount();
    }
  });

  it("renders the check indicator with Phosphor data attribute or weight signal", () => {
    render(<Checkbox defaultChecked />);
    const checkbox = screen.getByRole("checkbox");
    const svg = checkbox.querySelector("svg");
    expect(svg?.getAttribute("viewBox")).toBe("0 0 256 256");
  });
});
