"use client";

import { FolderOpen, MagnifyingGlass, Plus } from "@phosphor-icons/react";
import { Button } from "@stasho/ds/button";
import { Card } from "@stasho/ds/card";
import { EmptyState } from "@stasho/ds/empty-state";
import { PageHeader } from "@preview/components/page-header";
import { DemoSection } from "@preview/components/demo-section";

export default function EmptyStatePage() {
  return (
    <>
      <PageHeader
        title="EmptyState"
        description="Centered placeholder for a zero-item view: optional icon, title, description, and an action slot for one or two buttons. Compose it inside a Card or drop it straight into an empty region."
      />

      <DemoSection title="Icon + description + action">
        <Card variant="default" padding="lg">
          <EmptyState
            icon={<FolderOpen weight="duotone" />}
            title="No projects yet"
            description="Import a repository to deploy your first project. Builds pin to IPFS and go live in seconds."
            action={
              <Button iconLeft={<Plus />}>New project</Button>
            }
          />
        </Card>
      </DemoSection>

      <DemoSection title="Two actions">
        <Card variant="default" padding="lg">
          <EmptyState
            icon={<MagnifyingGlass weight="duotone" />}
            title="No results"
            description="No deployments match these filters. Try widening the range or clearing the search."
            action={
              <>
                <Button variant="outline">Clear filters</Button>
                <Button variant="secondary">Reset search</Button>
              </>
            }
          />
        </Card>
      </DemoSection>

      <DemoSection title="Title only (no icon, no action)">
        <Card variant="default" padding="lg">
          <EmptyState title="No notifications yet" />
        </Card>
      </DemoSection>
    </>
  );
}
