import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { NavList, NavRow } from "./nav-list";

describe("NavList / NavRow", () => {
  it("renders an in-app row as an anchor with the label and an inline arrow after it", () => {
    render(
      <NavList>
        <NavRow href="/projects/p1/deployments">View deployments</NavRow>
      </NavList>,
    );
    const link = screen.getByRole("link", { name: "View deployments" });
    expect(link.getAttribute("href")).toBe("/projects/p1/deployments");
    expect(link.getAttribute("target")).toBeNull();
    expect(link.children[1]?.tagName).toBe("svg");
  });

  it("external rows open in a new tab with rel noopener", () => {
    render(
      <NavRow href="https://myapp.example.com" external mono>
        myapp.example.com
      </NavRow>,
    );
    const link = screen.getByRole("link", { name: "myapp.example.com" });
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toBe("noopener noreferrer");
    expect(link.className).toContain("font-mono");
  });

  it("asChild lends the chassis and the arrow to the child element", () => {
    render(
      <NavRow asChild>
        <a href="/vm" data-custom="yes">
          View App VM
        </a>
      </NavRow>,
    );
    const link = screen.getByRole("link", { name: "View App VM" });
    expect(link.getAttribute("data-custom")).toBe("yes");
    expect(link.className).toContain("px-3");
    expect(link.querySelector("svg")).toBeTruthy();
  });

  it("leading sits before the label, trailing after the arrow at the row's end", () => {
    render(
      <NavRow href="/projects/p1/domains" leading={<i data-testid="dot" />} trailing="pending setup">
        staging.example.com
      </NavRow>,
    );
    const link = screen.getByRole("link", { name: /staging\.example\.com/ });
    const kids = Array.from(link.children);
    expect(kids[0]?.querySelector("[data-testid=dot]")).toBeTruthy();
    expect(kids[1]?.textContent).toBe("staging.example.com");
    expect(kids[2]?.tagName).toBe("svg");
    expect(kids[3]?.textContent).toBe("pending setup");
    expect(kids[3]?.className).toContain("ml-auto");
  });

  it("a trailing node renders as-is, only string/number trailing gets the muted text", () => {
    render(
      <NavRow href="/a" trailing={<b data-testid="badge">LIVE</b>}>
        Node
      </NavRow>,
    );
    const slot = screen.getByTestId("badge").parentElement as HTMLElement;
    expect(slot.className).toContain("ml-auto");
    expect(slot.className).not.toContain("text-muted-foreground");
    render(
      <NavRow href="/b" trailing={3}>
        Count
      </NavRow>,
    );
    expect(screen.getByText("3").className).toContain("text-muted-foreground");
  });

  it("tone=muted drops the row to muted text (the arrow inherits it)", () => {
    render(
      <NavRow href="/done" tone="muted">
        Done step
      </NavRow>,
    );
    const link = screen.getByRole("link", { name: "Done step" });
    expect(link.className).toContain("text-muted-foreground");
    expect(link.className).not.toContain("text-foreground");
    expect(link.querySelector("svg")?.getAttribute("fill")).toBe("currentColor");
  });

  it("without href the row is a button with the same layout and arrow", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<NavRow onClick={onClick}>Copy address</NavRow>);
    const button = screen.getByRole("button", { name: "Copy address" });
    expect(button.getAttribute("type")).toBe("button");
    expect(button.className).toContain("px-3");
    expect(button.className).toContain("focus-visible:ring-accent");
    expect(button.children[1]?.tagName).toBe("svg");
    await user.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("the list divides rows with hairlines inside one bordered box", () => {
    const { container } = render(
      <NavList>
        <NavRow href="/a">A</NavRow>
        <NavRow href="/b">B</NavRow>
      </NavList>,
    );
    const cls = container.firstElementChild?.className ?? "";
    expect(cls).toContain("divide-y");
    expect(cls).toContain("border-edge");
    expect(cls).toContain("rounded-sm");
  });
});
