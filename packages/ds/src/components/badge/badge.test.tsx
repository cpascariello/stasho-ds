import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge, badgeVariants } from "./badge";

describe("Badge", () => {
  it("renders children", () => {
    render(<Badge>Active</Badge>);
    expect(screen.getByText("Active")).toBeTruthy();
  });

  it("renders as a span", () => {
    render(<Badge>Test</Badge>);
    expect(screen.getByText("Test").tagName).toBe("SPAN");
  });

  it("merges custom className", () => {
    render(<Badge className="custom">Test</Badge>);
    expect(screen.getByText("Test").className).toContain("custom");
  });

  describe("fill=solid (default)", () => {
    it("default solid uses bg-muted + text-foreground", () => {
      const { container } = render(<Badge>Label</Badge>);
      const cls = container.firstElementChild?.className ?? "";
      expect(cls).toContain("bg-muted");
      expect(cls).toContain("text-foreground");
      expect(cls).not.toContain("gradient-fill");
    });

    it("success solid uses bg-success + text-neutral-950", () => {
      const { container } = render(<Badge variant="success">Label</Badge>);
      const cls = container.firstElementChild?.className ?? "";
      expect(cls).toContain("bg-success");
      expect(cls).toContain("text-neutral-950");
    });

    it("warning solid uses bg-warning + text-neutral-950", () => {
      const { container } = render(<Badge variant="warning">Label</Badge>);
      const cls = container.firstElementChild?.className ?? "";
      expect(cls).toContain("bg-warning");
      expect(cls).toContain("text-neutral-950");
    });

    it("error solid uses bg-error + text-neutral-950", () => {
      const { container } = render(<Badge variant="error">Label</Badge>);
      const cls = container.firstElementChild?.className ?? "";
      expect(cls).toContain("bg-error");
      expect(cls).toContain("text-neutral-950");
    });

    it("info solid uses bg-accent + text-neutral-950", () => {
      const { container } = render(<Badge variant="info">Label</Badge>);
      const cls = container.firstElementChild?.className ?? "";
      expect(cls).toContain("bg-accent");
      expect(cls).toContain("text-neutral-950");
    });

    it("no solid variant carries a gradient-fill class", () => {
      for (const variant of [
        "default",
        "success",
        "warning",
        "error",
        "info",
      ] as const) {
        const { container } = render(<Badge variant={variant}>L</Badge>);
        expect(container.firstElementChild?.className).not.toContain(
          "gradient-fill",
        );
      }
    });
  });

  describe("fill=outline", () => {
    it("applies the 1px border class", () => {
      const { container } = render(<Badge fill="outline">Label</Badge>);
      expect(container.firstElementChild?.className).toContain("border");
    });

    it("default outline uses border-edge + foreground/70 text", () => {
      const { container } = render(
        <Badge fill="outline" variant="default">Label</Badge>,
      );
      const cls = container.firstElementChild?.className ?? "";
      expect(cls).toContain("border-edge");
      expect(cls).toContain("text-foreground/70");
      expect(cls).not.toContain("border-primary");
    });

    it("success outline uses bg-success/15 + border-success/40 + text-success-500 dark:text-success", () => {
      const { container } = render(
        <Badge fill="outline" variant="success">Label</Badge>,
      );
      const cls = container.firstElementChild?.className ?? "";
      expect(cls).toContain("bg-success/15");
      expect(cls).toContain("border-success/40");
      expect(cls).toContain("text-success-500");
      expect(cls).toContain("dark:text-success");
    });

    it("warning outline uses bg-warning/15 + border-warning/40 + text-warning-500 dark:text-warning", () => {
      const { container } = render(
        <Badge fill="outline" variant="warning">Label</Badge>,
      );
      const cls = container.firstElementChild?.className ?? "";
      expect(cls).toContain("bg-warning/15");
      expect(cls).toContain("border-warning/40");
      expect(cls).toContain("text-warning-500");
      expect(cls).toContain("dark:text-warning");
    });

    it("error outline uses bg-error/15 + border-error/40 + text-error-500 dark:text-error", () => {
      const { container } = render(
        <Badge fill="outline" variant="error">Label</Badge>,
      );
      const cls = container.firstElementChild?.className ?? "";
      expect(cls).toContain("bg-error/15");
      expect(cls).toContain("border-error/40");
      expect(cls).toContain("text-error-500");
      expect(cls).toContain("dark:text-error");
    });

    it("info outline uses bg-accent/15 + border-accent/40 + text-accent-500 dark:text-accent", () => {
      const { container } = render(
        <Badge fill="outline" variant="info">Label</Badge>,
      );
      const cls = container.firstElementChild?.className ?? "";
      expect(cls).toContain("bg-accent/15");
      expect(cls).toContain("border-accent/40");
      expect(cls).toContain("text-accent-500");
      expect(cls).toContain("dark:text-accent");
    });

    it("does not apply gradient-fill classes", () => {
      const { container } = render(
        <Badge fill="outline" variant="success">Label</Badge>,
      );
      expect(container.firstElementChild?.className).not.toContain(
        "gradient-fill",
      );
    });
  });

  describe("icons", () => {
    it("renders iconLeft before children", () => {
      const { container } = render(
        <Badge iconLeft={<svg data-testid="icon-left" />}>Label</Badge>,
      );
      const badge = container.firstElementChild!;
      const iconWrapper = badge.firstElementChild as HTMLElement;
      expect(iconWrapper.tagName).toBe("SPAN");
      expect(iconWrapper.querySelector("[data-testid='icon-left']")).toBeTruthy();
    });

    it("renders iconRight after children", () => {
      const { container } = render(
        <Badge iconRight={<svg data-testid="icon-right" />}>Label</Badge>,
      );
      const badge = container.firstElementChild!;
      const iconWrapper = badge.lastElementChild as HTMLElement;
      expect(iconWrapper.tagName).toBe("SPAN");
      expect(
        iconWrapper.querySelector("[data-testid='icon-right']"),
      ).toBeTruthy();
    });

    it("renders both icons", () => {
      const { container } = render(
        <Badge
          iconLeft={<svg data-testid="left" />}
          iconRight={<svg data-testid="right" />}
        >
          Label
        </Badge>,
      );
      const badge = container.firstElementChild!;
      expect(badge.querySelector("[data-testid='left']")).toBeTruthy();
      expect(badge.querySelector("[data-testid='right']")).toBeTruthy();
      expect(badge.children).toHaveLength(2);
    });

    it("does not render icon wrappers when no icons provided", () => {
      const { container } = render(<Badge>Label</Badge>);
      const badge = container.firstElementChild!;
      expect(badge.children).toHaveLength(0);
    });

    it("uses size-3 wrapper for md size", () => {
      const { container } = render(
        <Badge size="md" iconLeft={<svg />}>Label</Badge>,
      );
      const iconWrapper = container.firstElementChild!
        .firstElementChild as HTMLElement;
      expect(iconWrapper.className).toContain("size-3");
    });

    it("uses size-2.5 wrapper for sm size", () => {
      const { container } = render(
        <Badge size="sm" iconLeft={<svg />}>Label</Badge>,
      );
      const iconWrapper = container.firstElementChild!
        .firstElementChild as HTMLElement;
      expect(iconWrapper.className).toContain("size-2.5");
    });
  });

  describe("base styles", () => {
    it("applies mono font and uppercase", () => {
      const { container } = render(<Badge>Label</Badge>);
      const cls = container.firstElementChild?.className ?? "";
      expect(cls).toContain("font-mono");
      expect(cls).toContain("uppercase");
      expect(cls).toContain("tracking-wider");
    });

    it("preserves consumer string case in DOM (CSS uppercases the rendered text only)", () => {
      const { container } = render(<Badge>active</Badge>);
      // DOM text content stays lowercase — CSS text-transform: uppercase
      // changes rendering, not DOM. This contract matters for assertions
      // using getByText("active") in consumer test suites.
      expect(container.firstElementChild?.textContent).toBe("active");
    });

    it("applies rounded-sm", () => {
      const { container } = render(<Badge>Label</Badge>);
      expect(container.firstElementChild?.className).toContain("rounded-sm");
    });
  });

  describe("badgeVariants export", () => {
    it("accepts fill parameter and emits semantic-token border", () => {
      const cls = badgeVariants({ fill: "outline", variant: "success" });
      expect(cls).toContain("border");
      expect(cls).toContain("border-success/40");
    });
  });
});
