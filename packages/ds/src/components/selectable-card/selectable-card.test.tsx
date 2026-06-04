import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { createRef } from "react";
import {
  ActionCard,
  SelectableCard,
  SelectableCardGroup,
} from "@ac/components/selectable-card/selectable-card";

describe("ActionCard", () => {
  it("renders a button with type=button", () => {
    render(<ActionCard>Import from GitHub</ActionCard>);
    const btn = screen.getByRole("button", { name: "Import from GitHub" });
    expect(btn).toHaveAttribute("type", "button");
  });

  it("fires onClick", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<ActionCard onClick={onClick}>Go</ActionCard>);
    await user.click(screen.getByRole("button", { name: "Go" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("has no checkmark (no selected state)", () => {
    render(<ActionCard>Go</ActionCard>);
    expect(screen.queryByTestId("selectable-card-check")).toBeNull();
  });

  it("forwards ref", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<ActionCard ref={ref}>Go</ActionCard>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});

describe("SelectableCardGroup (single)", () => {
  const renderSingle = (props = {}) =>
    render(
      <SelectableCardGroup type="single" {...props}>
        <SelectableCard value="nextjs">Next.js</SelectableCard>
        <SelectableCard value="vite">Vite</SelectableCard>
        <SelectableCard value="astro">Astro</SelectableCard>
      </SelectableCardGroup>,
    );

  // Radix ToggleGroup type="single" renders items as role="radio" / aria-checked
  // (a radiogroup) — verified against radix-ui@1.4.3; mirrors radio-group.test.tsx.
  it("renders all cards as radios", () => {
    renderSingle();
    expect(screen.getAllByRole("radio")).toHaveLength(3);
  });

  it("selects defaultValue on mount", () => {
    renderSingle({ defaultValue: "vite" });
    const cards = screen.getAllByRole("radio");
    expect(cards[1]!).toBeChecked();
    expect(cards[0]!).not.toBeChecked();
  });

  it("selects one and deselects siblings on click", async () => {
    const user = userEvent.setup();
    renderSingle({ defaultValue: "nextjs" });
    const cards = screen.getAllByRole("radio");
    await user.click(cards[1]!);
    expect(cards[0]!).not.toBeChecked();
    expect(cards[1]!).toBeChecked();
  });

  it("calls onValueChange with the chosen value", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderSingle({ onValueChange: onChange });
    await user.click(screen.getAllByRole("radio")[2]!);
    expect(onChange).toHaveBeenCalledWith("astro");
  });

  it("shows data-state=on only on the selected card (drives the checkmark)", () => {
    renderSingle({ defaultValue: "nextjs" });
    // data-state is present in both modes; the checkmark visibility + cva
    // selected styling key off it via the [[data-state=on]_&] selector.
    const cards = screen.getAllByRole("radio");
    expect(cards[0]!).toHaveAttribute("data-state", "on");
    expect(cards[1]!).toHaveAttribute("data-state", "off");
  });

  it("disables a single card", () => {
    render(
      <SelectableCardGroup type="single">
        <SelectableCard value="a">A</SelectableCard>
        <SelectableCard value="b" disabled>
          B
        </SelectableCard>
      </SelectableCardGroup>,
    );
    const cards = screen.getAllByRole("radio");
    expect(cards[0]!).not.toBeDisabled();
    expect(cards[1]!).toBeDisabled();
  });

  it("forwards ref on the group", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <SelectableCardGroup type="single" ref={ref}>
        <SelectableCard value="a">A</SelectableCard>
      </SelectableCardGroup>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe("SelectableCardGroup (multiple)", () => {
  it("toggles cards independently and emits an array", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <SelectableCardGroup type="multiple" onValueChange={onChange}>
        <SelectableCard value="a">A</SelectableCard>
        <SelectableCard value="b">B</SelectableCard>
      </SelectableCardGroup>,
    );
    const cards = screen.getAllByRole("button");
    await user.click(cards[0]!);
    await user.click(cards[1]!);
    expect(cards[0]!).toHaveAttribute("aria-pressed", "true");
    expect(cards[1]!).toHaveAttribute("aria-pressed", "true");
    expect(onChange).toHaveBeenLastCalledWith(["a", "b"]);
  });
});

// SKIN-PRINCIPLES.md radius table: "Cards earn 2px" → rounded-lg, matching the
// DS Card. Lock it so the card never drifts back to a bubble radius.
describe("skin compliance (card radius)", () => {
  it("ActionCard uses rounded-lg, not rounded-2xl", () => {
    render(<ActionCard>Go</ActionCard>);
    const cls = screen.getByRole("button", { name: "Go" }).className;
    expect(cls).toContain("rounded-lg");
    expect(cls).not.toContain("rounded-2xl");
  });

  it("SelectableCard uses rounded-lg, not rounded-2xl", () => {
    render(
      <SelectableCardGroup type="single">
        <SelectableCard value="a">A</SelectableCard>
      </SelectableCardGroup>,
    );
    const cls = screen.getByRole("radio").className;
    expect(cls).toContain("rounded-lg");
    expect(cls).not.toContain("rounded-2xl");
  });
});
