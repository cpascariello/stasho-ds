import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";

function TestMenu({ onSelect }: { onSelect?: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem {...(onSelect ? { onSelect } : {})}>
          First
        </DropdownMenuItem>
        <DropdownMenuSeparator data-testid="sep" />
        <DropdownMenuItem>Second</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

describe("DropdownMenu", () => {
  it("opens on trigger click and renders items + separator", async () => {
    const user = userEvent.setup();
    render(<TestMenu />);
    await user.click(screen.getByText("Open menu"));
    expect(await screen.findByText("First")).toBeTruthy();
    expect(screen.getByText("Second")).toBeTruthy();
    expect(screen.getByTestId("sep")).toBeTruthy();
  });

  it("fires onSelect when an item is chosen", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<TestMenu onSelect={onSelect} />);
    await user.click(screen.getByText("Open menu"));
    await user.click(await screen.findByText("First"));
    expect(onSelect).toHaveBeenCalled();
  });

  it("does not lock body scroll (modal={false})", async () => {
    const user = userEvent.setup();
    render(<TestMenu />);
    await user.click(screen.getByText("Open menu"));
    await screen.findByText("First");
    // A modal Radix menu sets overflow:hidden + scrollbar padding on <body>.
    // The non-modal default must leave the body untouched (Decision #172).
    expect(document.body.style.overflow).not.toBe("hidden");
  });
});
