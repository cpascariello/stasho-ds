import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EmptyState } from "./empty-state";

describe("EmptyState", () => {
  it("renders the title", () => {
    render(<EmptyState title="No projects yet" />);
    expect(screen.getByText("No projects yet")).toBeTruthy();
  });

  it("renders the description when provided", () => {
    render(
      <EmptyState title="No projects yet" description="Import a repo to begin." />,
    );
    expect(screen.getByText("Import a repo to begin.")).toBeTruthy();
  });

  it("renders icon and action slots", () => {
    render(
      <EmptyState
        title="No projects yet"
        icon={<svg data-testid="icon" />}
        action={<button type="button">New project</button>}
      />,
    );
    expect(screen.getByTestId("icon")).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "New project" }),
    ).toBeTruthy();
  });

  it("omits description, icon, and action when not provided", () => {
    const { container } = render(<EmptyState title="Nothing here" />);
    expect(container.querySelector("svg")).toBeNull();
    expect(container.querySelector("button")).toBeNull();
  });

  it("merges className and forwards ref", () => {
    let refNode: HTMLDivElement | null = null;
    render(
      <EmptyState
        title="T"
        className="custom-test-class"
        ref={(node) => {
          refNode = node;
        }}
      />,
    );
    expect(refNode).not.toBeNull();
    expect(refNode!.className).toContain("custom-test-class");
  });
});
