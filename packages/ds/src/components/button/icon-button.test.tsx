import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { IconButton } from "./icon-button";

describe("IconButton", () => {
  it("renders a button with the icon child and the aria-label as its name", () => {
    render(
      <IconButton aria-label="Notifications">
        <svg data-testid="glyph" />
      </IconButton>,
    );
    expect(screen.getByRole("button", { name: "Notifications" })).toBeTruthy();
    expect(screen.getByTestId("glyph")).toBeTruthy();
  });

  it("forwards ref to the underlying button (Radix-trigger contract)", () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <IconButton ref={ref} aria-label="Help">
        <svg />
      </IconButton>,
    );
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("spreads arbitrary props onto the button (onClick, data-state, aria-expanded)", () => {
    render(
      <IconButton aria-label="Account" aria-expanded data-state="open">
        <svg />
      </IconButton>,
    );
    const button = screen.getByRole("button", { name: "Account" });
    expect(button.getAttribute("aria-expanded")).toBe("true");
    expect(button.getAttribute("data-state")).toBe("open");
  });

  it("defaults to type=button and ghost variant", () => {
    render(
      <IconButton aria-label="Dismiss">
        <svg />
      </IconButton>,
    );
    const button = screen.getByRole("button");
    expect(button.getAttribute("type")).toBe("button");
    // ghost has no LED
    expect(button.querySelector("[data-led]")).toBeNull();
  });

  it("applies a square padding class for the given size", () => {
    render(
      <IconButton aria-label="Info" size="xs">
        <svg />
      </IconButton>,
    );
    expect(screen.getByRole("button").className).toContain("p-1");
  });

  it("merges a custom className", () => {
    render(
      <IconButton aria-label="Dismiss" className="text-warning-600">
        <svg />
      </IconButton>,
    );
    expect(screen.getByRole("button").className).toContain("text-warning-600");
  });
});
