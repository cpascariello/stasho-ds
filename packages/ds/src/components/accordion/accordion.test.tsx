import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion";
import { StatusDot } from "../status-dot/status-dot";

function renderAccordion() {
  return render(
    <Accordion type="single" collapsible>
      <AccordionItem value="a">
        <AccordionTrigger>Question A</AccordionTrigger>
        <AccordionContent>Answer A</AccordionContent>
      </AccordionItem>
      <AccordionItem value="b">
        <AccordionTrigger>Question B</AccordionTrigger>
        <AccordionContent>Answer B</AccordionContent>
      </AccordionItem>
    </Accordion>,
  );
}

describe("Accordion", () => {
  it("renders triggers as buttons, content hidden by default", () => {
    renderAccordion();
    expect(screen.getByRole("button", { name: "Question A" })).toBeDefined();
    expect(screen.queryByText("Answer A")).toBeNull();
  });

  it("expands an item on click", async () => {
    const user = userEvent.setup();
    renderAccordion();
    await user.click(screen.getByRole("button", { name: "Question A" }));
    expect(screen.getByText("Answer A")).toBeDefined();
  });

  it("collapses an open item on re-click (collapsible)", async () => {
    const user = userEvent.setup();
    renderAccordion();
    const trigger = screen.getByRole("button", { name: "Question A" });
    await user.click(trigger);
    expect(screen.getByText("Answer A")).toBeDefined();
    await user.click(trigger);
    expect(screen.queryByText("Answer A")).toBeNull();
  });

  it("opening one item closes the other (single)", async () => {
    const user = userEvent.setup();
    renderAccordion();
    await user.click(screen.getByRole("button", { name: "Question A" }));
    await user.click(screen.getByRole("button", { name: "Question B" }));
    expect(screen.queryByText("Answer A")).toBeNull();
    expect(screen.getByText("Answer B")).toBeDefined();
  });

  it("sets aria-expanded on the trigger", async () => {
    const user = userEvent.setup();
    renderAccordion();
    const trigger = screen.getByRole("button", { name: "Question A" });
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    await user.click(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
  });

  it("opens the defaultValue item on mount", () => {
    render(
      <Accordion type="single" collapsible defaultValue="a">
        <AccordionItem value="a">
          <AccordionTrigger>Question A</AccordionTrigger>
          <AccordionContent>Answer A</AccordionContent>
        </AccordionItem>
        <AccordionItem value="b">
          <AccordionTrigger>Question B</AccordionTrigger>
          <AccordionContent>Answer B</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    expect(screen.getByText("Answer A")).toBeDefined();
  });

  it("content carries the motion-safe-gated open/close animation classes", () => {
    render(
      <Accordion type="single" collapsible defaultValue="a">
        <AccordionItem value="a">
          <AccordionTrigger>Question A</AccordionTrigger>
          <AccordionContent>Answer A</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    // The Radix Content element is the parent of the rendered answer text.
    const inner = screen.getByText("Answer A");
    const content = inner.parentElement as HTMLElement;
    expect(content.className).toContain("overflow-hidden");
    // motion-safe gating (not motion-reduce:animate-none): a data-[state] attribute
    // selector out-specifies motion-reduce:animate-none, so the animation must be
    // gated INTO motion-safe rather than disabled OUT via motion-reduce.
    expect(content.className).toContain("motion-safe:data-[state=open]:animate-accordion-down");
    expect(content.className).toContain("motion-safe:data-[state=closed]:animate-accordion-up");
  });

  it("answer content carries the fade/settle classes", () => {
    render(
      <Accordion type="single" collapsible defaultValue="a">
        <AccordionItem value="a">
          <AccordionTrigger>Question A</AccordionTrigger>
          <AccordionContent>Answer A</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    const inner = screen.getByText("Answer A");
    expect(inner.className).toContain("group-data-[state=open]:opacity-100");
    expect(inner.className).toContain("transition-[opacity,transform]");
    expect(inner.className).toContain("motion-reduce:transition-none");
  });

  it("caret carries the closed-hover nudge class", () => {
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="a">
          <AccordionTrigger>Question A</AccordionTrigger>
          <AccordionContent>Answer A</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    // Caret is the trigger's last element child (the CaretDown svg).
    const trigger = screen.getByRole("button", { name: "Question A" });
    const caret = trigger.lastElementChild as HTMLElement;
    expect(caret.getAttribute("class")).toContain(
      "group-data-[state=closed]:group-hover:translate-y-[3px]",
    );
  });

  it("keeps multiple items open (type=multiple)", async () => {
    const user = userEvent.setup();
    render(
      <Accordion type="multiple">
        <AccordionItem value="a">
          <AccordionTrigger>Question A</AccordionTrigger>
          <AccordionContent>Answer A</AccordionContent>
        </AccordionItem>
        <AccordionItem value="b">
          <AccordionTrigger>Question B</AccordionTrigger>
          <AccordionContent>Answer B</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    await user.click(screen.getByRole("button", { name: "Question A" }));
    await user.click(screen.getByRole("button", { name: "Question B" }));
    expect(screen.getByText("Answer A")).toBeDefined();
    expect(screen.getByText("Answer B")).toBeDefined();
  });

  it("cards variant: each item is its own surface, content sits in an inset panel", () => {
    render(
      <Accordion type="single" collapsible defaultValue="a" variant="cards">
        <AccordionItem value="a">
          <AccordionTrigger>Question A</AccordionTrigger>
          <AccordionContent>Answer A</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    const trigger = screen.getByRole("button", { name: "Question A" });
    const item = trigger.parentElement?.parentElement as HTMLElement;
    expect(item.className).toContain("rounded-lg");
    expect(item.className).toContain("bg-surface");
    expect(item.className).not.toContain("border-b");
    expect(item.parentElement?.className).toContain("gap-3");
    expect(item.parentElement?.getAttribute("data-variant")).toBe("cards");
    expect(trigger.className).toContain("px-4");
    const inner = screen.getByText("Answer A");
    expect(inner.className).toContain("bg-background");
    expect(inner.className).toContain("border-edge");
  });

  it("default variant keeps the hairline item and the plain content", () => {
    render(
      <Accordion type="single" collapsible defaultValue="a">
        <AccordionItem value="a">
          <AccordionTrigger>Question A</AccordionTrigger>
          <AccordionContent>Answer A</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    const trigger = screen.getByRole("button", { name: "Question A" });
    const item = trigger.parentElement?.parentElement as HTMLElement;
    expect(item.className).toContain("border-b");
    expect(item.className).not.toContain("bg-surface");
    expect(trigger.className).not.toContain("px-4");
    expect(screen.getByText("Answer A").className).toContain("pb-4");
  });

  it("a leading StatusDot contributes its label to the trigger's accessible name by default", () => {
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="a">
          <AccordionTrigger leading={<StatusDot status="degraded" />}>DNS</AccordionTrigger>
          <AccordionContent>Answer A</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    expect(screen.getByRole("button", { name: /Degraded/ })).toBeTruthy();
    expect(screen.getByRole("status", { name: "Degraded" })).toBeTruthy();
  });

  it("a decorative leading StatusDot stays out of the trigger's accessible name", () => {
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="a">
          <AccordionTrigger leading={<StatusDot decorative status="degraded" />}>DNS</AccordionTrigger>
          <AccordionContent>Answer A</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    expect(screen.getByRole("button", { name: "DNS" })).toBeTruthy();
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("trigger renders leading before the title and a muted summary under it", () => {
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="a">
          <AccordionTrigger leading={<i data-testid="dot" />} summary="Two records missing">
            DNS
          </AccordionTrigger>
          <AccordionContent>Answer A</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    const trigger = screen.getByRole("button", { name: /DNS/ });
    const kids = Array.from(trigger.children);
    expect(kids[0]?.querySelector("[data-testid=dot]")).toBeTruthy();
    expect(kids[1]?.children[0]?.textContent).toBe("DNS");
    const summary = screen.getByText("Two records missing");
    expect(summary.parentElement).toBe(kids[1]);
    expect(summary.className).toContain("text-muted-foreground");
    expect(summary.className).toContain("truncate");
    expect(trigger.lastElementChild?.tagName.toLowerCase()).toBe("svg");
  });

  describe("openOnHash", () => {
    afterEach(() => {
      window.location.hash = "";
      vi.unstubAllGlobals();
    });

    function renderHashAccordion(type: "single" | "multiple" = "single") {
      const scrollIntoView = vi.fn();
      Element.prototype.scrollIntoView = scrollIntoView;
      render(
        type === "single" ? (
          <Accordion type="single" collapsible openOnHash>
            <AccordionItem value="a" id="dns">
              <AccordionTrigger>Question A</AccordionTrigger>
              <AccordionContent>Answer A</AccordionContent>
            </AccordionItem>
            <AccordionItem value="b" id="records">
              <AccordionTrigger>Question B</AccordionTrigger>
              <AccordionContent>Answer B</AccordionContent>
            </AccordionItem>
          </Accordion>
        ) : (
          <Accordion type="multiple" defaultValue={["a"]} openOnHash>
            <AccordionItem value="a" id="dns">
              <AccordionTrigger>Question A</AccordionTrigger>
              <AccordionContent>Answer A</AccordionContent>
            </AccordionItem>
            <AccordionItem value="b" id="records">
              <AccordionTrigger>Question B</AccordionTrigger>
              <AccordionContent>Answer B</AccordionContent>
            </AccordionItem>
          </Accordion>
        ),
      );
      return scrollIntoView;
    }

    it("opens the item whose id matches the hash on mount and scrolls it into view", () => {
      window.location.hash = "#records";
      const scrollIntoView = renderHashAccordion();
      expect(screen.getByText("Answer B")).toBeDefined();
      expect(screen.queryByText("Answer A")).toBeNull();
      expect(scrollIntoView).toHaveBeenCalledTimes(1);
      expect(scrollIntoView.mock.instances[0]).toBe(document.getElementById("records"));
      expect(scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth", block: "start" });
    });

    it("scrolls without smoothing under prefers-reduced-motion", () => {
      vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({ matches: true }));
      window.location.hash = "#dns";
      const scrollIntoView = renderHashAccordion();
      expect(scrollIntoView).toHaveBeenCalledWith({ behavior: "auto", block: "start" });
    });

    it("follows hashchange and adds to the open set under type=multiple", () => {
      window.location.hash = "";
      renderHashAccordion("multiple");
      expect(screen.queryByText("Answer B")).toBeNull();
      act(() => {
        window.location.hash = "#records";
        window.dispatchEvent(new HashChangeEvent("hashchange"));
      });
      expect(screen.getByText("Answer A")).toBeDefined();
      expect(screen.getByText("Answer B")).toBeDefined();
    });

    it("ignores a hash that is not one of its items", () => {
      window.location.hash = "#elsewhere";
      const scrollIntoView = renderHashAccordion();
      expect(screen.queryByText("Answer A")).toBeNull();
      expect(scrollIntoView).not.toHaveBeenCalled();
    });
  });
});
