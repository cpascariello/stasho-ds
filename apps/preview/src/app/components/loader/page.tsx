"use client";

import { Loader } from "@stasho/ds/loader";
import { Button } from "@stasho/ds/button";
import { Card } from "@stasho/ds/card";
import { PageHeader } from "@preview/components/page-header";
import { DemoSection } from "@preview/components/demo-section";

const sizes = ["xs", "sm", "md"] as const;

export default function LoaderPage() {
  return (
    <>
      <PageHeader
        title="Loader"
        description="Standalone loading indicator. Dual-dot cyan chase — the same animation Button's loading state uses, extracted as a primitive for inline use outside a button."
      />

      <DemoSection title="Sizes">
        <div className="flex flex-wrap items-center gap-6">
          {sizes.map((s) => (
            <div key={s} className="flex flex-col items-start gap-2">
              <span className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
                {s}
              </span>
              <Loader size={s} />
            </div>
          ))}
        </div>
      </DemoSection>

      <DemoSection title="With inline label">
        <div className="flex flex-col gap-3">
          <Loader size="xs">Loading…</Loader>
          <Loader size="sm">Fetching data…</Loader>
          <Loader size="md">Saving changes…</Loader>
        </div>
      </DemoSection>

      <DemoSection title="In context">
        <div className="flex flex-col gap-4">
          <Card padding="md">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Sync status</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  Pulling latest from upstream
                </div>
              </div>
              <Loader size="sm" aria-label="Syncing" />
            </div>
          </Card>

          <div className="flex items-center gap-3">
            <Button disabled>
              <Loader size="xs" aria-label="Saving" />
              <span>Save draft</span>
            </Button>
            <span className="text-sm text-muted-foreground">
              Or use{" "}
              <code className="text-xs bg-muted px-1 py-0.5">
                {`<Button loading>`}
              </code>{" "}
              for the button-native chase.
            </span>
          </div>
        </div>
      </DemoSection>

      <DemoSection title="Accessibility">
        <p className="text-sm text-foreground/80 max-w-2xl">
          Loader renders with <code className="text-xs bg-muted px-1">role=&quot;status&quot;</code>.
          When children are provided, the visible label is the accessible name.
          When no children are present, <code className="text-xs bg-muted px-1">aria-label</code>{" "}
          defaults to &quot;Loading&quot; and can be overridden by the consumer.
          The chase animation pauses under <code className="text-xs bg-muted px-1">prefers-reduced-motion: reduce</code>.
        </p>
      </DemoSection>
    </>
  );
}
