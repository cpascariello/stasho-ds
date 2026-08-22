import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Logo, LogoFull, LogoLetter, LogoWordmark } from "./logo";

/**
 * Bounding box over every point in an absolute-command path. Control points
 * count, so it is an upper bound on the ink — conservative in the right
 * direction for "does anything escape the viewBox".
 *
 * Parsed per command rather than by splitting numbers into pairs: SVGPathPen
 * collapses straight horizontal runs to `H`, which takes a single number, so
 * naive pairing silently swaps x and y from that point on.
 */
const COORDS: Record<string, "xy"[] | "x"[] | "y"[] | []> = {
  M: ["xy"],
  L: ["xy"],
  T: ["xy"],
  Q: ["xy", "xy"],
  S: ["xy", "xy"],
  C: ["xy", "xy", "xy"],
  H: ["x"],
  V: ["y"],
  Z: [],
};

/** viewBox as four numbers, failing loudly rather than yielding undefined. */
function viewBoxOf(svg: Element) {
  const parts = (svg.getAttribute("viewBox") ?? "").split(" ").map(Number);
  if (parts.length !== 4 || parts.some(Number.isNaN)) {
    throw new Error(`unparseable viewBox: ${svg.getAttribute("viewBox")}`);
  }
  const [minX, minY, width, height] = parts as [number, number, number, number];
  return { minX, minY, width, height };
}

function pathExtents(d: string) {
  const xs: number[] = [];
  const ys: number[] = [];
  for (const seg of d.match(/[A-Za-z][^A-Za-z]*/g) ?? []) {
    const cmd = seg[0]!.toUpperCase();
    const shape = COORDS[cmd];
    if (shape === undefined) throw new Error(`unhandled path command: ${cmd}`);
    const nums = (seg.slice(1).match(/-?\d*\.?\d+/g) ?? []).map(Number);
    const arity = shape.reduce((n, k) => n + (k === "xy" ? 2 : 1), 0);
    if (arity === 0) continue;
    // a command may repeat its parameter set without repeating the letter
    for (let base = 0; base + arity <= nums.length; base += arity) {
      let i = base;
      for (const kind of shape) {
        if (kind === "xy") {
          xs.push(nums[i]!);
          ys.push(nums[i + 1]!);
          i += 2;
        } else if (kind === "x") xs.push(nums[i++]!);
        else ys.push(nums[i++]!);
      }
    }
  }
  return {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys),
  };
}


describe("Logo", () => {
  it("renders an svg element", () => {
    render(<Logo data-testid="logo" />);
    const svg = screen.getByTestId("logo");
    expect(svg.tagName).toBe("svg");
  });

  it("uses currentColor for fill", () => {
    render(<Logo data-testid="logo" />);
    const svg = screen.getByTestId("logo");
    expect(svg.getAttribute("fill")).toBe("currentColor");
  });

  it("forwards className", () => {
    render(<Logo data-testid="logo" className="size-8" />);
    const svg = screen.getByTestId("logo");
    expect(svg.classList.contains("size-8")).toBe(true);
  });

  it("forwards aria-label", () => {
    render(<Logo aria-label="stasho" />);
    expect(screen.getByLabelText("stasho")).toBeTruthy();
  });
});

describe("LogoFull", () => {
  it("renders an svg element", () => {
    render(<LogoFull data-testid="logo-full" />);
    const svg = screen.getByTestId("logo-full");
    expect(svg.tagName).toBe("svg");
  });

  it("uses currentColor for fill", () => {
    render(<LogoFull data-testid="logo-full" />);
    const svg = screen.getByTestId("logo-full");
    expect(svg.getAttribute("fill")).toBe("currentColor");
  });

  it("forwards className", () => {
    render(<LogoFull data-testid="logo-full" className="h-10 w-auto" />);
    const svg = screen.getByTestId("logo-full");
    expect(svg.classList.contains("h-10")).toBe(true);
    expect(svg.classList.contains("w-auto")).toBe(true);
  });

  it("forwards aria-label", () => {
    render(<LogoFull aria-label="stasho" />);
    expect(screen.getByLabelText("stasho")).toBeTruthy();
  });
});

describe("LogoWordmark", () => {
  it("renders an svg element", () => {
    render(<LogoWordmark data-testid="logo-wordmark" />);
    expect(screen.getByTestId("logo-wordmark").tagName).toBe("svg");
  });

  // Was: asserted textContent === "stasho" against a live <text> element.
  // The wordmark is outlines now, so the accessible name comes from <title>.
  it("names itself stasho by default", () => {
    render(<LogoWordmark data-testid="logo-wordmark" />);
    expect(screen.getByTestId("logo-wordmark").textContent).toBe("stasho");
    expect(
      screen.getByTestId("logo-wordmark").querySelector("title")?.textContent,
    ).toBe("stasho");
  });

  it("accepts a custom title and drops it entirely on null", () => {
    const { rerender } = render(
      <LogoWordmark data-testid="w" title="Stasho home" />,
    );
    expect(screen.getByTestId("w").querySelector("title")?.textContent).toBe(
      "Stasho home",
    );
    rerender(<LogoWordmark data-testid="w" title={null} />);
    expect(screen.getByTestId("w").querySelector("title")).toBeNull();
  });

  it("uses currentColor for fill", () => {
    render(<LogoWordmark data-testid="logo-wordmark" />);
    expect(screen.getByTestId("logo-wordmark").getAttribute("fill")).toBe(
      "currentColor",
    );
  });

  it("forwards className", () => {
    render(<LogoWordmark data-testid="logo-wordmark" className="h-7 w-auto" />);
    const svg = screen.getByTestId("logo-wordmark");
    expect(svg.classList.contains("h-7")).toBe(true);
    expect(svg.classList.contains("w-auto")).toBe(true);
  });

  it("forwards aria-label", () => {
    render(<LogoWordmark aria-label="Stasho" />);
    expect(screen.getByLabelText("Stasho")).toBeTruthy();
  });

  // Was: a browser-measured width constant, because live <text> could render
  // in whichever face the consuming app had loaded. Outlines have fixed
  // extents, so the guard is now exact — no font, no pinned measurement.
  it("keeps every path point inside the viewBox", () => {
    render(<LogoWordmark data-testid="logo-wordmark" />);
    const svg = screen.getByTestId("logo-wordmark");
    const { width, height } = viewBoxOf(svg);
    const { minX, maxX, minY, maxY } = pathExtents(
      svg.querySelector("path")!.getAttribute("d")!,
    );
    expect(minX).toBeGreaterThanOrEqual(0);
    expect(maxX).toBeLessThanOrEqual(width);
    expect(minY).toBeGreaterThanOrEqual(0);
    expect(maxY).toBeLessThanOrEqual(height);
    // and it actually fills the box — catches a truncated or empty path
    expect(maxX - minX).toBeGreaterThan(width * 0.9);
  });
});

describe("LogoLetter", () => {
  it("renders an svg element", () => {
    render(<LogoLetter data-testid="logo-letter" />);
    expect(screen.getByTestId("logo-letter").tagName).toBe("svg");
  });

  // One glyph, not six: the wordmark's path is far longer. (Both are named
  // "stasho" for assistive tech — the letter still stands for the brand.)
  it("draws a single glyph, unlike the wordmark", () => {
    render(<LogoLetter data-testid="logo-letter" />);
    render(<LogoWordmark data-testid="logo-wordmark" />);
    const letter = screen
      .getByTestId("logo-letter")
      .querySelector("path")!
      .getAttribute("d")!;
    const wordmark = screen
      .getByTestId("logo-wordmark")
      .querySelector("path")!
      .getAttribute("d")!;
    expect(letter.length).toBeLessThan(wordmark.length / 4);
  });

  it("uses currentColor for fill", () => {
    render(<LogoLetter data-testid="logo-letter" />);
    expect(screen.getByTestId("logo-letter").getAttribute("fill")).toBe(
      "currentColor",
    );
  });

  it("forwards aria-label", () => {
    render(<LogoLetter aria-label="Stasho" />);
    expect(screen.getByLabelText("Stasho")).toBeTruthy();
  });

  it("keeps every path point inside the viewBox", () => {
    render(<LogoLetter data-testid="logo-letter" />);
    const svg = screen.getByTestId("logo-letter");
    const { width, height } = viewBoxOf(svg);
    const { minX, maxX, minY, maxY } = pathExtents(
      svg.querySelector("path")!.getAttribute("d")!,
    );
    expect(minX).toBeGreaterThanOrEqual(0);
    expect(maxX).toBeLessThanOrEqual(width);
    expect(minY).toBeGreaterThanOrEqual(0);
    expect(maxY).toBeLessThanOrEqual(height);
    expect(maxX - minX).toBeGreaterThan(width * 0.8);
  });
});

// The whole reason these were converted: live <text> made each mark depend on
// the consuming app having loaded Anybody, which is how the viewBoxes ended up
// fitted to the fallback font (Decision #105).
describe("logotype is font-independent", () => {
  it.each([
    ["Logo", Logo],
    ["LogoFull", LogoFull],
    ["LogoWordmark", LogoWordmark],
    ["LogoLetter", LogoLetter],
  ])("%s draws outlines and no <text>", (_name, Component) => {
    render(<Component data-testid="m" />);
    const svg = screen.getByTestId("m");
    expect(svg.querySelector("text")).toBeNull();
    const paths = svg.querySelectorAll("path");
    expect(paths.length).toBeGreaterThan(0);
    for (const p of paths) {
      expect(p.getAttribute("d")?.startsWith("M")).toBe(true);
    }
  });

  it("keeps the viewBoxes the <text> versions used, so nothing resizes", () => {
    const cases = [
      [<LogoFull key="f" data-testid="f" />, "f", "0 0 1383 229"],
      [<LogoWordmark key="w" data-testid="w" />, "w", "0 0 880 229"],
      [<LogoLetter key="l" data-testid="l" />, "l", "0 0 164 229"],
    ] as const;
    for (const [el, id, box] of cases) {
      render(el);
      expect(screen.getByTestId(id).getAttribute("viewBox")).toBe(box);
    }
  });

  it("LogoFull locks a filled badge up with the wordmark", () => {
    render(<LogoFull data-testid="f" />);
    const svg = screen.getByTestId("f");
    // a disc, not a bare letter: "s stasho" reads as a stutter without it
    const disc = svg.querySelector("circle");
    expect(disc?.getAttribute("fill")).toBe("#07080a");
    expect(svg.querySelectorAll("path")).toHaveLength(2);
    // badge glyph carries the palette; the wordmark inherits currentColor
    const [badge, wordmark] = svg.querySelectorAll("path");
    expect(badge?.getAttribute("fill")).toBe("#22d3ee");
    expect(wordmark?.getAttribute("fill")).toBeNull();
  });

  it("LogoFull takes a badge palette without touching the wordmark", () => {
    render(<LogoFull data-testid="f" palette="cyan" />);
    const svg = screen.getByTestId("f");
    expect(svg.querySelector("circle")?.getAttribute("fill")).toBe("#22d3ee");
    expect(svg.querySelectorAll("path")[0]?.getAttribute("fill")).toBe(
      "#07080a",
    );
    expect(svg.querySelectorAll("path")[1]?.getAttribute("fill")).toBeNull();
  });
});
