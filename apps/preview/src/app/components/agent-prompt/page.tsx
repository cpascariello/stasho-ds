"use client";

import { AgentPromptButton } from "@stasho/ds/agent-prompt";
import { PageHeader } from "@preview/components/page-header";
import { DemoSection } from "@preview/components/demo-section";

const PROMPT = `Publish this site with Stasho Drop:

1. Build the site and zip the output folder.
2. POST the zip to https://api.stasho.xyz/api/drop as the "artifact" field.
3. Report the URL from the response.`;

export default function AgentPromptPage() {
  return (
    <>
      <PageHeader
        title="AgentPromptButton"
        description="Copies a prompt written for a coding agent. The prompt is not rendered; the label flips to Copied or Copy failed for two seconds."
      />

      <DemoSection title="Default">
        <div className="flex flex-col items-start gap-2">
          <AgentPromptButton prompt={PROMPT} />
          <span className="text-xs text-muted-foreground">
            Paste it into Claude, Cursor, or any agent that can run shell
            commands.
          </span>
        </div>
      </DemoSection>

      <DemoSection title="Two on one surface">
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">
            Each button owns its feedback state. Pass label to give each a
            distinct accessible name; the visible text stays the same.
          </p>
          <div className="flex flex-wrap gap-3">
            <AgentPromptButton prompt={PROMPT} label="Copy the publish prompt" />
            <AgentPromptButton
              prompt="Add the TXT record shown on this page to your DNS zone."
              label="Copy the DNS prompt"
            />
          </div>
        </div>
      </DemoSection>
    </>
  );
}
