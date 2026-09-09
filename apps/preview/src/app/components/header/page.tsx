"use client";

import { Button } from "@stasho/ds/button";
import {
  Header,
  HeaderBreadcrumb,
  HeaderBreadcrumbSegment,
} from "@stasho/ds/header";
import { PageHeader } from "@preview/components/page-header";
import { DemoSection } from "@preview/components/demo-section";

export default function HeaderPage() {
  return (
    <>
      <PageHeader
        title="Header"
        description="App-shell top bar: sticky, a keyboard skip-link, a min-width content slot for breadcrumbs, and a right slot for the utility cluster. Prop/slot-driven — app copy and routing live in the composition. Composable API: Header, HeaderBreadcrumb, HeaderBreadcrumbSegment (asChild for framework links)."
      />

      <DemoSection title="Breadcrumb + right slot">
        <div className="overflow-hidden rounded-lg border border-edge">
          <Header
            rightSlot={
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  Docs
                </Button>
                <Button size="sm">Deploy</Button>
              </div>
            }
          >
            <HeaderBreadcrumb>
              <HeaderBreadcrumbSegment asChild>
                <a href="#projects">Projects</a>
              </HeaderBreadcrumbSegment>
              <HeaderBreadcrumbSegment current>
                my-portfolio
              </HeaderBreadcrumbSegment>
            </HeaderBreadcrumb>
          </Header>
          <div className="p-6 text-sm text-muted-foreground">
            Content below the bar. The header stays pinned to the top on
            scroll; tab into the page to reveal the skip-link.
          </div>
        </div>
      </DemoSection>

      <DemoSection title="Sticking below the bar">
        <p className="mb-3 text-sm text-muted-foreground">
          The bar reads its height from <code>--ds-header-height</code> (4rem, set in tokens.css). Offset
          anything that sticks under it, or a hash target that scrolls under it, from the same variable
          instead of a hard-coded <code>top-20</code>:
        </p>
        <pre className="overflow-x-auto rounded-sm border border-edge bg-surface p-4 font-mono text-xs">
{`<aside className="sticky top-[calc(var(--ds-header-height)+1rem)]">…</aside>
<section id="dns" className="scroll-mt-[calc(var(--ds-header-height)+1rem)]">…</section>`}
        </pre>
      </DemoSection>
    </>
  );
}
