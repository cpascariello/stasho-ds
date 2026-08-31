"use client";

import { NumberInput } from "@stasho/ds/number-input";
import { FormField } from "@stasho/ds/form-field";
import { PageHeader } from "@preview/components/page-header";
import { DemoSection } from "@preview/components/demo-section";

export default function NumberInputPage() {
  return (
    <>
      <PageHeader
        title="Number Input"
        description="Numeric input with stepper buttons, min/max clamping, error and disabled states."
      />
      <DemoSection title="Sizes">
        <div className="grid gap-4 max-w-xs">
          <NumberInput size="sm" defaultValue={1} aria-label="Small number input" />
          <NumberInput size="md" defaultValue={1} aria-label="Medium number input" />
        </div>
      </DemoSection>
      <DemoSection title="Min / max / step">
        <div className="grid gap-4 max-w-xs">
          <NumberInput
            defaultValue={0}
            min={0}
            max={10}
            step={1}
            aria-label="Bounded number input"
          />
        </div>
      </DemoSection>
      <DemoSection title="States">
        <div className="grid gap-4 max-w-xs">
          <NumberInput defaultValue={1} aria-label="Default number input" />
          <NumberInput error defaultValue={1} aria-label="Error number input" />
          <NumberInput disabled defaultValue={1} aria-label="Disabled number input" />
        </div>
      </DemoSection>
      <DemoSection title="With FormField">
        <div className="max-w-xs">
          <FormField label="Quantity" helperText="Between 1 and 20">
            <NumberInput defaultValue={1} min={1} max={20} />
          </FormField>
        </div>
      </DemoSection>
    </>
  );
}
