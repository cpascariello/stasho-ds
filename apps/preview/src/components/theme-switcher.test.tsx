import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ThemeSwitcher } from "@preview/components/theme-switcher";

describe("ThemeSwitcher", () => {
  beforeEach(() => {
    document.documentElement.classList.remove("theme-dark");
    localStorage.clear();
  });

  afterEach(() => {
    document.documentElement.classList.remove("theme-dark");
  });

  it("writes the theme to localStorage on toggle", async () => {
    document.documentElement.classList.add("theme-dark");
    const user = userEvent.setup();
    render(<ThemeSwitcher />);

    await user.click(screen.getByRole("button"));
    expect(localStorage.getItem("stasho-preview-theme")).toBe("light");

    await user.click(screen.getByRole("button"));
    expect(localStorage.getItem("stasho-preview-theme")).toBe("dark");
  });

  it("does not throw when localStorage.setItem fails", async () => {
    const setItemSpy = vi
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(() => {
        throw new Error("QuotaExceededError");
      });
    const user = userEvent.setup();
    render(<ThemeSwitcher />);

    await expect(user.click(screen.getByRole("button"))).resolves.not.toThrow();

    setItemSpy.mockRestore();
  });
});
