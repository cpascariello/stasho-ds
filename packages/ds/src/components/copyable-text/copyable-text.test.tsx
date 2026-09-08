import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, afterEach } from "vitest";
import { CopyableText } from "./copyable-text";

const LONG_TEXT = "0x1234567890abcdef1234567890abcdef12345678";
const SHORT_TEXT = "0x1234abcd";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("CopyableText", () => {
  describe("truncation", () => {
    it("shows middle-ellipsis for long text", () => {
      render(<CopyableText text={LONG_TEXT} />);
      expect(screen.getByText("0x1234...5678")).toBeTruthy();
    });

    it("shows full text when shorter than startChars + endChars", () => {
      render(
        <CopyableText text={SHORT_TEXT} startChars={6} endChars={4} />,
      );
      expect(screen.getByText(SHORT_TEXT)).toBeTruthy();
    });

    it("respects custom startChars and endChars", () => {
      render(
        <CopyableText text={LONG_TEXT} startChars={4} endChars={6} />,
      );
      expect(screen.getByText("0x12...345678")).toBeTruthy();
    });
  });

  describe("copy", () => {
    it("copies full text to clipboard on click", async () => {
      const user = userEvent.setup();
      render(<CopyableText text={LONG_TEXT} />);

      const spy = vi
        .spyOn(navigator.clipboard, "writeText")
        .mockResolvedValue(undefined);

      const copyBtn = screen.getByRole("button", {
        name: "Copy to clipboard",
      });

      await user.click(copyBtn);

      expect(spy).toHaveBeenCalledWith(LONG_TEXT);
    });

    it("shows Copied label after click", async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      const user = userEvent.setup({
        advanceTimers: vi.advanceTimersByTime,
      });
      render(<CopyableText text={LONG_TEXT} />);

      vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue(
        undefined,
      );

      await user.click(
        screen.getByRole("button", { name: "Copy to clipboard" }),
      );

      expect(
        screen.getByRole("button", { name: "Copied" }),
      ).toBeTruthy();

      act(() => {
        vi.advanceTimersByTime(1500);
      });

      expect(
        screen.getByRole("button", { name: "Copy to clipboard" }),
      ).toBeTruthy();

      vi.useRealTimers();
    });
  });

  describe("external link", () => {
    it("does not render link icon when href is absent", () => {
      render(<CopyableText text={LONG_TEXT} />);
      expect(screen.queryByRole("link")).toBeNull();
    });

    it("renders link with correct attributes when href is external", () => {
      render(
        <CopyableText text={LONG_TEXT} href="https://example.com" />,
      );
      const link = screen.getByRole("link", { name: "Open in new tab" });
      expect(link).toBeTruthy();
      expect(link.getAttribute("target")).toBe("_blank");
      expect(link.getAttribute("rel")).toBe("noopener noreferrer");
      expect(link.getAttribute("href")).toBe("https://example.com");
    });

    it("makes truncated text a clickable link when href is external", () => {
      render(
        <CopyableText text={LONG_TEXT} href="https://example.com" />,
      );
      const links = screen.getAllByRole("link");
      const textLink = links.find(
        (link) => link.textContent === "0x1234...5678",
      );
      expect(textLink).toBeTruthy();
      expect(textLink?.getAttribute("href")).toBe("https://example.com");
      expect(textLink?.getAttribute("target")).toBe("_blank");
    });
  });

  describe("internal link", () => {
    it("does not open in new tab for internal href", () => {
      render(
        <CopyableText text={LONG_TEXT} href="/nodes/abc123" />,
      );
      const links = screen.getAllByRole("link");
      const textLink = links.find(
        (link) => link.textContent === "0x1234...5678",
      );
      expect(textLink).toBeTruthy();
      expect(textLink?.getAttribute("href")).toBe("/nodes/abc123");
      expect(textLink?.getAttribute("target")).toBeNull();
      expect(textLink?.getAttribute("rel")).toBeNull();
    });

    it("does not render ArrowUpRight icon for internal href", () => {
      render(
        <CopyableText text={LONG_TEXT} href="/nodes/abc123" />,
      );
      expect(
        screen.queryByRole("link", { name: "Open in new tab" }),
      ).toBeNull();
    });
  });

  describe("props", () => {
    it("merges custom className", () => {
      const { container } = render(
        <CopyableText text={LONG_TEXT} className="custom-class" />,
      );
      expect(container.firstElementChild?.className).toContain(
        "custom-class",
      );
    });

    it("forwards ref", () => {
      const ref = { current: null } as React.RefObject<HTMLSpanElement | null>;
      render(<CopyableText ref={ref} text={LONG_TEXT} />);
      expect(ref.current).toBeInstanceOf(HTMLElement);
    });
  });

  describe("fluid mode", () => {
    it("renders head and tail as separate text nodes", () => {
      render(<CopyableText text={LONG_TEXT} fluid endChars={6} />);
      expect(
        screen.getByText("0x1234567890abcdef1234567890abcdef12"),
      ).toBeTruthy();
      expect(screen.getByText("345678")).toBeTruthy();
    });

    it("shows the full untruncated string (no ellipsis)", () => {
      const { container } = render(
        <CopyableText text={LONG_TEXT} fluid endChars={6} />,
      );
      expect(container.textContent).toBe(LONG_TEXT);
      expect(container.textContent).not.toContain("...");
    });

    it("uses flex + w-full on the wrapper", () => {
      const { container } = render(<CopyableText text={LONG_TEXT} fluid />);
      const cls = container.firstElementChild?.className ?? "";
      expect(cls).toContain("w-full");
      expect(cls).not.toContain("inline-flex");
    });

    it("uses inline-flex on the wrapper by default", () => {
      const { container } = render(<CopyableText text={LONG_TEXT} />);
      expect(container.firstElementChild?.className).toContain("inline-flex");
    });

    it("sets title to the full text in fluid mode", () => {
      render(<CopyableText text={LONG_TEXT} fluid />);
      expect(screen.getByTitle(LONG_TEXT)).toBeTruthy();
    });

    it("does not set a title in fixed mode", () => {
      render(<CopyableText text={LONG_TEXT} />);
      expect(screen.queryByTitle(LONG_TEXT)).toBeNull();
    });

    it("renders full text without splitting when text.length <= endChars", () => {
      render(<CopyableText text="0x1a2b" fluid endChars={10} />);
      expect(screen.getByText("0x1a2b")).toBeTruthy();
    });

    it("copies the full text in fluid mode", async () => {
      const user = userEvent.setup();
      render(<CopyableText text={LONG_TEXT} fluid />);
      const spy = vi
        .spyOn(navigator.clipboard, "writeText")
        .mockResolvedValue(undefined);
      await user.click(
        screen.getByRole("button", { name: "Copy to clipboard" }),
      );
      expect(spy).toHaveBeenCalledWith(LONG_TEXT);
    });

    it("wraps the head/tail region in a link when fluid + external href", () => {
      render(
        <CopyableText
          text={LONG_TEXT}
          fluid
          endChars={6}
          href="https://example.com"
        />,
      );
      const textLink = screen
        .getAllByRole("link")
        .find((l) => l.textContent === LONG_TEXT);
      expect(textLink).toBeTruthy();
      expect(textLink?.getAttribute("href")).toBe("https://example.com");
      expect(textLink?.getAttribute("target")).toBe("_blank");
    });
  });

  describe("field variant", () => {
    it("keeps the inline rendering by default (no box chassis)", () => {
      const { container } = render(<CopyableText text={LONG_TEXT} />);
      const cls = container.firstElementChild?.className ?? "";
      expect(cls).toContain("inline-flex");
      expect(cls).not.toContain("border-edge");
      expect(cls).not.toContain("dark:bg-base-700");
    });

    it("renders the read-only box chassis and implies fluid layout", () => {
      const { container } = render(
        <CopyableText text={LONG_TEXT} variant="field" size="sm" />,
      );
      const cls = container.firstElementChild?.className ?? "";
      for (const token of [
        "border-edge",
        "dark:bg-base-700",
        "w-full",
        "min-w-0",
        "px-3",
        "py-2.5",
        "text-xs",
      ]) {
        expect(cls).toContain(token);
      }
      expect(cls).not.toContain("inline-flex");
      expect(container.textContent).toBe(LONG_TEXT);
      expect(screen.getByTitle(LONG_TEXT)).toBeTruthy();
    });

    it("seats a 22px square copy control on the surface fill", () => {
      render(<CopyableText text={LONG_TEXT} variant="field" size="sm" />);
      const btn = screen.getByRole("button", { name: "Copy to clipboard" });
      for (const token of [
        "size-5.5",
        "rounded-sm",
        "border-edge",
        "bg-surface",
        "text-muted-foreground",
        "hover:text-foreground",
      ]) {
        expect(btn.className).toContain(token);
      }
    });

    it("does not give the inline copy control the field chassis", () => {
      render(<CopyableText text={LONG_TEXT} size="sm" />);
      const btn = screen.getByRole("button", { name: "Copy to clipboard" });
      expect(btn.className).toContain("size-4");
      expect(btn.className).not.toContain("border-edge");
      expect(btn.className).not.toContain("bg-surface");
    });

    it("gives the external-link control the same 22px chassis", () => {
      render(
        <CopyableText
          text={LONG_TEXT}
          variant="field"
          size="sm"
          href="https://example.com"
        />,
      );
      const link = screen.getByRole("link", { name: "Open in new tab" });
      expect(link.className).toContain("size-5.5");
      expect(link.className).toContain("border-edge");
      expect(link.className).toContain("bg-surface");
    });

    it("copies the full text in field variant", async () => {
      const user = userEvent.setup();
      render(<CopyableText text={LONG_TEXT} variant="field" size="sm" />);
      const spy = vi
        .spyOn(navigator.clipboard, "writeText")
        .mockResolvedValue(undefined);
      await user.click(
        screen.getByRole("button", { name: "Copy to clipboard" }),
      );
      expect(spy).toHaveBeenCalledWith(LONG_TEXT);
    });

    it("keeps size=md working in field variant", () => {
      const { container } = render(
        <CopyableText text={LONG_TEXT} variant="field" size="md" />,
      );
      const cls = container.firstElementChild?.className ?? "";
      expect(cls).toContain("text-sm");
      expect(cls).toContain("border-edge");
    });
  });
});
