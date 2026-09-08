import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Field } from "./field";

describe("Field", () => {
  it("renders children inside the read-only chassis", () => {
    const { container } = render(<Field>ns1.example.com.</Field>);
    expect(screen.getByText("ns1.example.com.")).toBeTruthy();
    const cls = container.firstElementChild?.className ?? "";
    for (const token of [
      "border-edge",
      "dark:bg-base-700",
      "font-mono",
      "text-xs",
      "w-full",
      "min-w-0",
    ]) {
      expect(cls).toContain(token);
    }
  });

  it("merges custom className", () => {
    const { container } = render(<Field className="custom-class">x</Field>);
    expect(container.firstElementChild?.className).toContain("custom-class");
  });

  it("passes div attributes through", () => {
    render(<Field data-testid="baseline">x</Field>);
    expect(screen.getByTestId("baseline").tagName).toBe("DIV");
  });

  it("forwards ref", () => {
    const ref = { current: null } as React.RefObject<HTMLDivElement | null>;
    render(<Field ref={ref}>x</Field>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
