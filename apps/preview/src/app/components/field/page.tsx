"use client";

import { Field } from "@stasho/ds/field";
import { DetailField } from "@stasho/ds/detail-field";
import { PageHeader } from "@preview/components/page-header";
import { DemoSection } from "@preview/components/demo-section";

const BASELINE = [
  ["NS", "ns1.example.com."],
  ["A", "203.0.113.10"],
] as const;

export default function FieldPage() {
  return (
    <>
      <PageHeader
        title="Field"
        description="Read-only bordered box for non-editable content. Same hairline edge and radius as the input chassis, on a sunk fill. No copy control; wrap a single copyable value in CopyableText variant=&quot;field&quot; instead."
      />

      <DemoSection title="Block of rows">
        <div className="max-w-md">
          <Field>
            <dl className="grid grid-cols-[4rem_1fr] gap-y-1">
              {BASELINE.map(([type, value]) => (
                <div key={type} className="contents">
                  <dt className="text-muted-foreground">{type}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </Field>
        </div>
      </DemoSection>

      <DemoSection title="Inside a DetailField">
        <div className="max-w-md">
          <DetailField label="Baseline" hint="captured 6d ago">
            <Field>
              <dl className="grid grid-cols-[4rem_1fr] gap-y-1">
                {BASELINE.map(([type, value]) => (
                  <div key={type} className="contents">
                    <dt className="text-muted-foreground">{type}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </Field>
          </DetailField>
        </div>
      </DemoSection>

      <DemoSection title="Multi-line value">
        <div className="max-w-md">
          <Field className="whitespace-pre-wrap">
            {"v=1\nvault=solana:GyGKxMyg1p9SsHfm15MkNUu1u9TN2JtTspcdmrtGUdse"}
          </Field>
        </div>
      </DemoSection>
    </>
  );
}
