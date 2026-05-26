import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "./button";

const filledLedVariants = [
  "primary",
  "secondary",
  "destructive",
  "warning",
  "success",
  "outline",
] as const;

describe("Button", () => {
  it("renders a button element with children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: "Click me" })).toBeTruthy();
  });

  describe("LED indicator", () => {
    it.each(filledLedVariants)("renders LED on %s variant by default", (variant) => {
      render(<Button variant={variant}>Action</Button>);
      const button = screen.getByRole("button");
      expect(button.querySelector("[data-led]")).toBeTruthy();
    });

    it("does NOT render LED on ghost variant", () => {
      render(<Button variant="ghost">Cancel</Button>);
      const button = screen.getByRole("button");
      expect(button.querySelector("[data-led]")).toBeNull();
    });

    it("does NOT render LED when iconLeft is provided", () => {
      render(
        <Button iconLeft={<svg data-testid="left-icon" />}>Deploy</Button>,
      );
      const button = screen.getByRole("button");
      expect(button.querySelector("[data-led]")).toBeNull();
      expect(screen.getByTestId("left-icon")).toBeTruthy();
    });
  });

  describe("icons", () => {
    it("renders iconLeft before children", () => {
      render(
        <Button iconLeft={<svg data-testid="left-icon" />}>Label</Button>,
      );
      const button = screen.getByRole("button");
      const icon = screen.getByTestId("left-icon");
      const children = Array.from(button.children);
      const iconIndex = children.findIndex((c) => c.contains(icon));
      const labelIndex = children.findIndex((c) => c.textContent === "Label");
      expect(iconIndex).toBeLessThan(labelIndex);
    });

    it("renders iconRight after children", () => {
      render(
        <Button iconRight={<svg data-testid="right-icon" />}>Label</Button>,
      );
      const button = screen.getByRole("button");
      const icon = screen.getByTestId("right-icon");
      const children = Array.from(button.children);
      const iconIndex = children.findIndex((c) => c.contains(icon));
      const labelIndex = children.findIndex((c) => c.textContent === "Label");
      expect(iconIndex).toBeGreaterThan(labelIndex);
    });
  });

  describe("loading", () => {
    it("pulses the LED when loading without iconLeft", () => {
      render(<Button loading>Loading</Button>);
      const button = screen.getByRole("button");
      const led = button.querySelector("[data-led]");
      expect(led).toBeTruthy();
      expect(led?.className).toContain("animate-button-led");
    });

    it("pulses the iconLeft wrapper when loading with iconLeft", () => {
      render(
        <Button loading iconLeft={<svg data-testid="left-icon" />}>
          Loading
        </Button>,
      );
      const button = screen.getByRole("button");
      const iconWrapper = button.querySelector("[data-led-icon]");
      expect(iconWrapper).toBeTruthy();
      expect(iconWrapper?.className).toContain("animate-button-led");
      expect(screen.getByTestId("left-icon")).toBeTruthy();
    });

    it("does NOT render a separate spinner element when loading", () => {
      render(<Button loading>Loading</Button>);
      const button = screen.getByRole("button");
      expect(button.querySelector("svg.animate-spin")).toBeNull();
    });

    it("sets aria-busy when loading", () => {
      render(<Button loading>Loading</Button>);
      expect(screen.getByRole("button").getAttribute("aria-busy")).toBe("true");
    });

    it("hides iconRight when loading", () => {
      render(
        <Button loading iconRight={<svg data-testid="right-icon" />}>
          Loading
        </Button>,
      );
      expect(screen.queryByTestId("right-icon")).toBeNull();
    });
  });

  describe("disabled", () => {
    it("sets disabled attribute", () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole("button");
      expect((button as HTMLButtonElement).disabled).toBe(true);
    });
  });

  describe("asChild", () => {
    it("renders child element instead of button", () => {
      render(
        <Button asChild variant="primary">
          <a href="/test">Link</a>
        </Button>,
      );
      const link = screen.getByRole("link", { name: "Link" });
      expect(link).toBeTruthy();
      expect(link.tagName).toBe("A");
      expect(link.getAttribute("href")).toBe("/test");
    });
  });

  describe("className merging", () => {
    it("merges custom className with variant classes", () => {
      render(<Button className="custom-class">Merge</Button>);
      const button = screen.getByRole("button");
      expect(button.className).toContain("custom-class");
    });
  });

  describe("accessibility", () => {
    it("forwards aria-label", () => {
      render(<Button aria-label="Close dialog">X</Button>);
      expect(
        screen.getByRole("button", { name: "Close dialog" }),
      ).toBeTruthy();
    });
  });
});
