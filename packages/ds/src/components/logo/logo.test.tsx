import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Logo, LogoFull, LogoLetter, LogoWordmark } from "./logo";

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

  it("renders the stasho wordmark text", () => {
    render(<LogoWordmark data-testid="logo-wordmark" />);
    expect(screen.getByTestId("logo-wordmark").textContent).toBe("stasho");
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

  // The wordmark is live <text>, so the viewBox has to clear the widest font
  // the mark can render in — jsdom has no layout engine, so the width below is
  // a browser measurement (Chromium, font-size 200) pinned as a constant.
  // Narrowing past the widest clips a glyph; widening only adds trailing space.
  // The second assertion pins the PREMISE: 848.9 is only the right number while
  // the type spec below is unchanged, so changing the spec fails here and
  // forces a re-measure rather than silently invalidating the constant.
  it("has a viewBox wide enough for the widest rendering of 'stasho'", () => {
    render(<LogoWordmark data-testid="logo-wordmark" />);
    const svg = screen.getByTestId("logo-wordmark");
    const [, , width] = svg.getAttribute("viewBox")!.split(" ").map(Number);
    // Anybody 800/900 italic — the widest of the faces the mark renders in.
    expect(width).toBeGreaterThanOrEqual(848.9);

    const text = svg.querySelector("text")!;
    expect({
      family: text.getAttribute("font-family"),
      size: text.getAttribute("font-size"),
      weight: text.getAttribute("font-weight"),
      style: text.getAttribute("font-style"),
    }).toEqual({
      family: "Anybody, sans-serif",
      size: "200",
      weight: "800",
      style: "italic",
    });
  });
});

describe("LogoLetter", () => {
  it("renders an svg element", () => {
    render(<LogoLetter data-testid="logo-letter" />);
    expect(screen.getByTestId("logo-letter").tagName).toBe("svg");
  });

  it("renders the single letter s", () => {
    render(<LogoLetter data-testid="logo-letter" />);
    expect(screen.getByTestId("logo-letter").textContent).toBe("s");
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

  it("has a viewBox wide enough for the widest rendering of 's'", () => {
    render(<LogoLetter data-testid="logo-letter" />);
    const svg = screen.getByTestId("logo-letter");
    const [, , width] = svg.getAttribute("viewBox")!.split(" ").map(Number);
    // Anybody 800/900 italic "s" — see LogoWordmark's note above.
    expect(width).toBeGreaterThanOrEqual(157.9);

    const text = svg.querySelector("text")!;
    expect({
      family: text.getAttribute("font-family"),
      size: text.getAttribute("font-size"),
      weight: text.getAttribute("font-weight"),
      style: text.getAttribute("font-style"),
    }).toEqual({
      family: "Anybody, sans-serif",
      size: "200",
      weight: "800",
      style: "italic",
    });
  });
});
