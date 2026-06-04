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
