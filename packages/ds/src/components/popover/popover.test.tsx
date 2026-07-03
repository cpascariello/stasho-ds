import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "./popover";

function TestPopover() {
  return (
    <Popover>
      <PopoverTrigger>Open</PopoverTrigger>
      <PopoverContent>
        <p>Panel body</p>
        <PopoverClose>Dismiss</PopoverClose>
      </PopoverContent>
    </Popover>
  );
}

describe("Popover", () => {
  it("is closed by default", () => {
    render(<TestPopover />);
    expect(screen.queryByText("Panel body")).toBeNull();
  });

  it("opens on trigger click and renders content", async () => {
    const user = userEvent.setup();
    render(<TestPopover />);
    await user.click(screen.getByText("Open"));
    expect(await screen.findByText("Panel body")).toBeTruthy();
  });

  it("closes on PopoverClose", async () => {
    const user = userEvent.setup();
    render(<TestPopover />);
    await user.click(screen.getByText("Open"));
    expect(await screen.findByText("Panel body")).toBeTruthy();
    await user.click(screen.getByText("Dismiss"));
    expect(screen.queryByText("Panel body")).toBeNull();
  });

  it("closes on Escape", async () => {
    const user = userEvent.setup();
    render(<TestPopover />);
    await user.click(screen.getByText("Open"));
    expect(await screen.findByText("Panel body")).toBeTruthy();
    await user.keyboard("{Escape}");
    expect(screen.queryByText("Panel body")).toBeNull();
  });
});
