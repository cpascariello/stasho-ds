import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import { LogoMark, MARK_PALETTES, MARK_PATH } from "./logo-mark";

describe("LogoMark", () => {
  it("renders an svg on the 512 badge canvas", () => {
    render(<LogoMark data-testid="m" />);
    const svg = screen.getByTestId("m");
    expect(svg.tagName).toBe("svg");
    expect(svg.getAttribute("viewBox")).toBe("0 0 512 512");
  });

  it("defaults to the void palette", () => {
    render(<LogoMark data-testid="m" />);
    const svg = screen.getByTestId("m");
    expect(svg.querySelector("rect")?.getAttribute("fill")).toBe("#07080a");
    expect(svg.querySelector("path")?.getAttribute("fill")).toBe("#22d3ee");
  });

  // Literal expectations on purpose: asserting against MARK_PALETTES itself
  // would pass even if a palette's ground and letter were swapped.
  it.each([
    ["void", "#07080a", "#22d3ee"],
    ["cyan", "#22d3ee", "#07080a"],
    ["deep", "#00004e", "#22d3ee"],
    ["mono", "#07080a", "#ffffff"],
  ] as const)("paints %s as %s ground with a %s letter", (palette, bg, fg) => {
    render(<LogoMark data-testid="m" palette={palette} />);
    const svg = screen.getByTestId("m");
    expect(svg.querySelector("rect")?.getAttribute("fill")).toBe(bg);
    expect(svg.querySelector("path")?.getAttribute("fill")).toBe(fg);
  });

  it("covers every exported palette with a literal case above", () => {
    expect(Object.keys(MARK_PALETTES).sort()).toEqual(
      ["cyan", "deep", "mono", "void"],
    );
  });

  it("gives every palette a ground distinct from its letter", () => {
    for (const [name, { bg, fg }] of Object.entries(MARK_PALETTES)) {
      expect(bg, `${name} would be invisible`).not.toBe(fg);
    }
  });

  // The point of this mark. LogoWordmark/LogoLetter render live <text> and so
  // render differently depending on whether the consuming app loaded Anybody —
  // which is exactly how their viewBoxes ended up wrong (stasho-app #391).
  it("carries real outlines, never live text", () => {
    render(<LogoMark data-testid="m" />);
    const svg = screen.getByTestId("m");
    expect(svg.querySelector("text")).toBeNull();
    expect(svg.querySelectorAll("path")).toHaveLength(1);
    expect(MARK_PATH.startsWith("M")).toBe(true);
    expect(MARK_PATH.length).toBeGreaterThan(200);
  });

  // Fixed brand hexes, not currentColor: the mark is exported to PNG and
  // uploaded where our CSS never runs.
  it("does not inherit currentColor the way the line-art Logo does", () => {
    render(<LogoMark data-testid="m" />);
    const svg = screen.getByTestId("m");
    expect(svg.getAttribute("fill")).toBeNull();
    expect(svg.outerHTML).not.toContain("currentColor");
  });

  it("forwards className without dropping its own", () => {
    render(<LogoMark data-testid="m" className="size-8 rounded-full" />);
    const cls = screen.getByTestId("m").getAttribute("class") ?? "";
    expect(cls).toContain("size-8");
    expect(cls).toContain("rounded-full");
    expect(cls).toContain("shrink-0");
  });

  it("forwards a ref and arbitrary svg props", () => {
    const ref = createRef<SVGSVGElement>();
    render(<LogoMark ref={ref} data-testid="m" aria-label="stasho" />);
    expect(ref.current).toBe(screen.getByTestId("m"));
    expect(screen.getByTestId("m").getAttribute("aria-label")).toBe("stasho");
  });
});
