import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AgentPromptButton } from "./agent-prompt";

const PROMPT = "Publish this site with Stasho Drop:\n\n1. Zip the build output.";

const writeText = vi.fn<(text: string) => Promise<void>>();

beforeEach(() => {
  writeText.mockReset();
  writeText.mockResolvedValue(undefined);
  Object.defineProperty(navigator, "clipboard", {
    value: { writeText },
    configurable: true,
  });
});

afterEach(() => {
  vi.useRealTimers();
});

/** Click, then let the clipboard promise settle inside act. */
async function clickAndSettle(button: HTMLElement) {
  await act(async () => {
    fireEvent.click(button);
  });
}

describe("AgentPromptButton", () => {
  it("renders the idle label and not the prompt", () => {
    render(<AgentPromptButton prompt={PROMPT} />);
    expect(
      screen.getByRole("button", { name: "Copy prompt for your agent" }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/Publish this site/)).toBeNull();
  });

  it("announces label changes politely", () => {
    render(<AgentPromptButton prompt={PROMPT} />);
    expect(screen.getByRole("button")).toHaveAttribute("aria-live", "polite");
  });

  it("copies the prompt on click and shows Copied", async () => {
    render(<AgentPromptButton prompt={PROMPT} />);
    await clickAndSettle(screen.getByRole("button"));
    expect(writeText).toHaveBeenCalledWith(PROMPT);
    expect(screen.getByRole("button")).toHaveTextContent("Copied");
  });

  it("shows Copy failed when the clipboard rejects", async () => {
    writeText.mockRejectedValue(new Error("denied"));
    render(<AgentPromptButton prompt={PROMPT} />);
    await clickAndSettle(screen.getByRole("button"));
    expect(screen.getByRole("button")).toHaveTextContent("Copy failed");
  });

  it("shows Copy failed when the clipboard API is absent", async () => {
    Object.defineProperty(navigator, "clipboard", {
      value: undefined,
      configurable: true,
    });
    render(<AgentPromptButton prompt={PROMPT} />);
    await clickAndSettle(screen.getByRole("button"));
    expect(screen.getByRole("button")).toHaveTextContent("Copy failed");
  });

  it("reverts to the idle label after two seconds", async () => {
    vi.useFakeTimers();
    render(<AgentPromptButton prompt={PROMPT} />);
    await clickAndSettle(screen.getByRole("button"));
    expect(screen.getByRole("button")).toHaveTextContent("Copied");

    act(() => {
      vi.advanceTimersByTime(1999);
    });
    expect(screen.getByRole("button")).toHaveTextContent("Copied");

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(screen.getByRole("button")).toHaveTextContent(
      "Copy prompt for your agent",
    );
  });

  it("restarts the revert window on a second click", async () => {
    vi.useFakeTimers();
    render(<AgentPromptButton prompt={PROMPT} />);
    await clickAndSettle(screen.getByRole("button"));
    act(() => {
      vi.advanceTimersByTime(1500);
    });
    await clickAndSettle(screen.getByRole("button"));
    act(() => {
      vi.advanceTimersByTime(1500);
    });
    expect(screen.getByRole("button")).toHaveTextContent("Copied");
  });

  it("uses label as the accessible name while the visible text stays", () => {
    render(<AgentPromptButton prompt={PROMPT} label="Copy the DNS prompt" />);
    const button = screen.getByRole("button", { name: "Copy the DNS prompt" });
    expect(button).toHaveTextContent("Copy prompt for your agent");
  });

  it("sets no aria-label without label", () => {
    render(<AgentPromptButton prompt={PROMPT} />);
    expect(screen.getByRole("button")).not.toHaveAttribute("aria-label");
  });
});
