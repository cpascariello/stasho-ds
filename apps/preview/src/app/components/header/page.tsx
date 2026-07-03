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
    </>
  );
}
