import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@ac/components/accordion/accordion";

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

  it("content carries the open/close animation + reduced-motion classes", () => {
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
    expect(content.className).toContain("data-[state=open]:animate-accordion-down");
    expect(content.className).toContain("data-[state=closed]:animate-accordion-up");
    expect(content.className).toContain("overflow-hidden");
    expect(content.className).toContain("motion-reduce:animate-none");
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
});
