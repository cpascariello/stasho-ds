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

  it("renders all cards as toggle buttons", () => {
    renderSingle();
    expect(screen.getAllByRole("button")).toHaveLength(3);
  });

  it("selects defaultValue on mount (aria-pressed)", () => {
    renderSingle({ defaultValue: "vite" });
    const cards = screen.getAllByRole("button");
    expect(cards[1]!).toHaveAttribute("aria-pressed", "true");
    expect(cards[0]!).toHaveAttribute("aria-pressed", "false");
  });

  it("selects one and deselects siblings on click", async () => {
    const user = userEvent.setup();
    renderSingle({ defaultValue: "nextjs" });
    const cards = screen.getAllByRole("button");
    await user.click(cards[1]!);
    expect(cards[0]!).toHaveAttribute("aria-pressed", "false");
    expect(cards[1]!).toHaveAttribute("aria-pressed", "true");
  });

  it("calls onValueChange with the chosen value", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderSingle({ onValueChange: onChange });
    await user.click(screen.getAllByRole("button")[2]!);
    expect(onChange).toHaveBeenCalledWith("astro");
  });

  it("shows the checkmark only on the selected card", () => {
    renderSingle({ defaultValue: "nextjs" });
    // Every SelectableCard renders a check element; visibility is driven by
    // data-[state=on] on its closest button ancestor.
    const cards = screen.getAllByRole("button");
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
    const cards = screen.getAllByRole("button");
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
