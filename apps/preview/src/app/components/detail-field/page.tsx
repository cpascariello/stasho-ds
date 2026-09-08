"use client";

import { Card } from "@stasho/ds/card";
import { CopyableText } from "@stasho/ds/copyable-text";
import { DetailField } from "@stasho/ds/detail-field";
import { Field } from "@stasho/ds/field";
import { FormField } from "@stasho/ds/form-field";
import { Input } from "@stasho/ds/input";
import { PageHeader } from "@preview/components/page-header";
import { DemoSection } from "@preview/components/demo-section";

const CURRENT_KEY = "GyGKxMyg1p9SsHfm15MkNUu1u9TN2JtTspcdmrtGUdse";
const PENDING_KEY = "EdmxWPmx2WH6WgFfTdu9xfkYf3k1g5wD1zccTVySEEh1";

export default function DetailFieldPage() {
  return (
    <>
      <PageHeader
        title="DetailField"
        description="Read-only sibling of FormField: label, value, optional inline hint and helper line, sharing FormField's rhythm so forms and detail cards stack alike. The label is a span; nothing is focusable."
      />

      <DemoSection title="Detail card">
        <p className="text-xs text-muted-foreground mb-4">
          Siblings sit 16px apart: stack them in a <code>flex flex-col gap-4</code>{" "}
          container. There is no wrapper component for it.
        </p>
        <Card title="Publishing key" className="max-w-2xl">
          <div className="flex flex-col gap-4">
            <DetailField
              label="Current key"
              hint="keeps publishing until an operator confirms the transfer"
            >
              <CopyableText text={CURRENT_KEY} variant="field" size="sm" />
            </DetailField>
            <DetailField
              label="Pending key"
              helperText="Waiting on an operator to confirm the transfer"
              tone="warning"
            >
              <CopyableText text={PENDING_KEY} variant="field" size="sm" />
            </DetailField>
          </div>
        </Card>
      </DemoSection>

      <DemoSection title="With a Field value">
        <Card title="DNS tripwire" className="max-w-2xl">
          <div className="flex flex-col gap-4">
            <DetailField label="TXT host">
              <CopyableText
                text="_stasho-vf.api.example.com"
                variant="field"
                size="sm"
              />
            </DetailField>
            <DetailField
              label="TXT value"
              helperText="Re-checks run while a binding is waiting for DNS or cooling down."
            >
              <CopyableText
                text={`v=1 vault=solana:${CURRENT_KEY}`}
                variant="field"
                size="sm"
              />
            </DetailField>
            <DetailField label="Baseline" hint="captured 6d ago">
              <Field>
                <dl className="grid grid-cols-[4rem_1fr] gap-y-1">
                  <dt className="text-muted-foreground">NS</dt>
                  <dd>ns1.example.com.</dd>
                  <dt className="text-muted-foreground">A</dt>
                  <dd>203.0.113.10</dd>
                </dl>
              </Field>
            </DetailField>
          </div>
        </Card>
      </DemoSection>

      <DemoSection title="Beside a FormField">
        <p className="text-xs text-muted-foreground mb-4">
          Same label, gap, and helper classes, so an editable and a read-only
          field share one rhythm.
        </p>
        <div className="flex flex-col gap-4 max-w-md">
          <FormField label="Display name" helperText="Shown on the status page">
            <Input defaultValue="api.example.com" size="sm" />
          </FormField>
          <DetailField label="Domain" helperText="Set at binding time">
            <CopyableText text="api.example.com" variant="field" size="sm" />
          </DetailField>
        </div>
      </DemoSection>
    </>
  );
}
