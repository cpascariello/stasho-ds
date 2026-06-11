import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "./drawer";

function renderDrawer(side?: "bottom" | "left" | "right") {
  return render(
    <Drawer>
      <DrawerTrigger>Open</DrawerTrigger>
      <DrawerContent {...(side ? { side } : {})}>
        <DrawerTitle>Deployment</DrawerTitle>
        <DrawerDescription>Detail for one deployment.</DrawerDescription>
        <p>Body</p>
      </DrawerContent>
    </Drawer>,
  );
}

describe("Drawer", () => {
  it("is closed by default and opens via the trigger", async () => {
    const user = userEvent.setup();
    renderDrawer();
    expect(screen.queryByRole("dialog")).toBeNull();
    await user.click(screen.getByText("Open"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Body")).toBeInTheDocument();
  });

  it("defaults to side=bottom styling", async () => {
    const user = userEvent.setup();
    renderDrawer();
    await user.click(screen.getByText("Open"));
    const content = screen.getByRole("dialog");
    expect(content.className).toContain("bottom-0");
    expect(content.className).toContain("rounded-t-xl");
  });

  it("applies side=left styling", async () => {
    const user = userEvent.setup();
    renderDrawer("left");
    await user.click(screen.getByText("Open"));
    const content = screen.getByRole("dialog");
    expect(content.className).toContain("inset-y-0");
    expect(content.className).toContain("left-0");
  });

  it("applies side=right styling", async () => {
    const user = userEvent.setup();
    renderDrawer("right");
    await user.click(screen.getByText("Open"));
    expect(screen.getByRole("dialog").className).toContain("right-0");
  });

  it("links title via aria-labelledby", async () => {
    const user = userEvent.setup();
    renderDrawer();
    await user.click(screen.getByText("Open"));
    const dialog = screen.getByRole("dialog");
    const labelId = dialog.getAttribute("aria-labelledby");
    expect(labelId).toBeTruthy();
    expect(document.getElementById(labelId!)).toBe(
      screen.getByText("Deployment"),
    );
  });

  it("links description via aria-describedby", async () => {
    const user = userEvent.setup();
    renderDrawer();
    await user.click(screen.getByText("Open"));
    const dialog = screen.getByRole("dialog");
    const descId = dialog.getAttribute("aria-describedby");
    expect(descId).toBeTruthy();
    expect(document.getElementById(descId!)).toBe(
      screen.getByText("Detail for one deployment."),
    );
  });

  it("closes on Escape via controlled onOpenChange", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Drawer open onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerTitle>Deployment</DrawerTitle>
          <DrawerDescription>Detail.</DrawerDescription>
        </DrawerContent>
      </Drawer>,
    );
    await user.keyboard("{Escape}");
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("renders an accessible close button", async () => {
    const user = userEvent.setup();
    renderDrawer();
    await user.click(screen.getByText("Open"));
    expect(screen.getByLabelText("Close")).toBeInTheDocument();
  });
});
