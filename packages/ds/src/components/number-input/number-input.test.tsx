import { createRef } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { NumberInput } from "./number-input";

describe("NumberInput", () => {
  it("renders with a value", () => {
    render(<NumberInput aria-label="Quantity" defaultValue={5} />);
    expect(
      (screen.getByRole("spinbutton", { name: "Quantity" }) as HTMLInputElement)
        .value,
    ).toBe("5");
  });

  it("increments the value and fires onChange when the up stepper is clicked", () => {
    const onChange = vi.fn();
    render(
      <NumberInput
        aria-label="Quantity"
        defaultValue={5}
        onChange={onChange}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Increase value" }));
    expect(
      (screen.getByRole("spinbutton", { name: "Quantity" }) as HTMLInputElement)
        .value,
    ).toBe("6");
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("decrements the value and fires onChange when the down stepper is clicked", () => {
    const onChange = vi.fn();
    render(
      <NumberInput
        aria-label="Quantity"
        defaultValue={5}
        onChange={onChange}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Decrease value" }));
    expect(
      (screen.getByRole("spinbutton", { name: "Quantity" }) as HTMLInputElement)
        .value,
    ).toBe("4");
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("clamps at max when stepping up past the boundary", () => {
    render(
      <NumberInput aria-label="Quantity" defaultValue={10} max={10} />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Increase value" }));
    expect(
      (screen.getByRole("spinbutton", { name: "Quantity" }) as HTMLInputElement)
        .value,
    ).toBe("10");
  });

  it("clamps at min when stepping down past the boundary", () => {
    render(<NumberInput aria-label="Quantity" defaultValue={0} min={0} />);
    fireEvent.click(screen.getByRole("button", { name: "Decrease value" }));
    expect(
      (screen.getByRole("spinbutton", { name: "Quantity" }) as HTMLInputElement)
        .value,
    ).toBe("0");
  });

  it("disables the steppers and applies the sink classes when disabled", () => {
    const onChange = vi.fn();
    render(
      <NumberInput
        aria-label="Quantity"
        defaultValue={5}
        disabled
        onChange={onChange}
      />,
    );
    const upButton = screen.getByRole("button", { name: "Increase value" });
    expect(upButton).toBeDisabled();
    fireEvent.click(upButton);
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole("spinbutton", { name: "Quantity" })).toBeDisabled();
  });

  it("applies the error border", () => {
    render(<NumberInput aria-label="Quantity" error />);
    const wrapper = screen.getByRole("spinbutton").parentElement;
    expect(wrapper?.className).toContain("border-error");
    // Guards the focus-within precedence fix: the rest-state focus-within
    // accent classes must not survive tailwind-merge once error is set,
    // or the cyan ring would beat the error rail while the input is focused.
    expect(wrapper?.className).not.toContain("focus-within:border-accent-700");
  });

  it("renders both sizes", () => {
    const { rerender } = render(
      <NumberInput aria-label="Quantity" size="sm" />,
    );
    expect(screen.getByRole("spinbutton").parentElement?.className).toContain(
      "text-sm",
    );
    rerender(<NumberInput aria-label="Quantity" size="md" />);
    expect(screen.getByRole("spinbutton").parentElement?.className).toContain(
      "text-base",
    );
  });

  it("forwards ref to the input element", () => {
    const ref = createRef<HTMLInputElement>();
    render(<NumberInput ref={ref} aria-label="Quantity" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
