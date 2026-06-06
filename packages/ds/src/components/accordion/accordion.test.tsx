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
});
