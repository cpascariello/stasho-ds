import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DetailField } from "./detail-field";

describe("DetailField", () => {
  it("renders the label as a span, not a label element", () => {
    render(<DetailField label="Current key">value</DetailField>);
    const label = screen.getByText("Current key");
    expect(label.tagName).toBe("SPAN");
    expect(label.className).toContain("font-medium");
  });

  it("renders children as the value", () => {
    render(
      <DetailField label="Current key">
        <span data-testid="value">abc</span>
      </DetailField>,
    );
    expect(screen.getByTestId("value").textContent).toBe("abc");
  });

  it("renders the hint inline after the label with a middot", () => {
    render(
      <DetailField label="Current key" hint="keeps publishing">
        value
      </DetailField>,
    );
    const label = screen.getByText("Current key");
    expect(label.textContent).toBe("Current key · keeps publishing");
    const hint = screen.getByText("· keeps publishing");
    expect(hint.className).toContain("text-muted-foreground");
    expect(hint.className).toContain("font-normal");
  });

  it("omits the hint span when hint is absent", () => {
    render(<DetailField label="Current key">value</DetailField>);
    expect(screen.getByText("Current key").children.length).toBe(0);
  });

  it("renders muted helper text by default", () => {
    render(
      <DetailField label="Pending key" helperText="Waiting on an operator">
        value
      </DetailField>,
    );
    const helper = screen.getByText("Waiting on an operator");
    expect(helper.tagName).toBe("P");
    expect(helper.className).toContain("text-xs");
    expect(helper.className).toContain("text-muted-foreground");
  });

  it("renders warning helper text with the warning tone", () => {
    render(
      <DetailField
        label="Pending key"
        helperText="Waiting on an operator"
        tone="warning"
      >
        value
      </DetailField>,
    );
    const helper = screen.getByText("Waiting on an operator");
    expect(helper.className).toContain("dark:text-warning");
    expect(helper.className).not.toContain("text-muted-foreground");
  });

  it("renders no helper element when helperText is omitted", () => {
    const { container } = render(
      <DetailField label="Pending key">value</DetailField>,
    );
    expect(container.querySelector("p")).toBeNull();
  });

  it("merges custom className on the wrapper", () => {
    const { container } = render(
      <DetailField label="x" className="custom-wrapper">
        value
      </DetailField>,
    );
    const cls = container.firstElementChild?.className ?? "";
    expect(cls).toContain("custom-wrapper");
    expect(cls).toContain("gap-1.5");
  });
});
