"use client";

import { Button } from "@stasho/ds/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@stasho/ds/drawer";
import { PageHeader } from "@preview/components/page-header";
import { DemoSection } from "@preview/components/demo-section";

const PLACEHOLDER_PARAGRAPHS = [
  "Deployment bafy…3k9d was built from commit 4f2a1c9 on main and pinned to IPFS at 14:32 UTC. The build completed in 1m 48s across 3 pipeline stages.",
  "The content identifier was written on-chain as a STORE message under the project owner's address. Anyone can independently verify the pinned content matches the hash recorded in the message.",
  "Custom domains pointing at this project resolve through the gateway's dnslink chain. After a deploy, the gateway typically begins serving the new CID within fifteen seconds.",
  "Rolling back re-points the live pointer to a prior CID without a rebuild. The previous deployment remains pinned, so a rollback is instant and fully reversible.",
  "Build logs, the workflow run, and the exact toolchain versions are retained with each deployment record so provenance can be audited end to end.",
];

export default function DrawerPage() {
  return (
    <>
      <PageHeader
        title="Drawer"
        description="Edge-anchored panel on the Dialog primitive: focus trap, frosted overlay, Escape and overlay dismiss. Slides from the bottom, left, or right. Composable API: Drawer, DrawerTrigger, DrawerContent, DrawerTitle, DrawerDescription, DrawerClose."
      />

      <DemoSection title="Bottom sheet (side=bottom)">
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline" size="sm">
              Open bottom sheet
            </Button>
          </DrawerTrigger>
          <DrawerContent side="bottom">
            <DrawerTitle>Deployment detail</DrawerTitle>
            <DrawerDescription>
              Capped at 85dvh — overflowing content scrolls inside the
              sheet.
            </DrawerDescription>
            <div className="mt-4 space-y-3">
              {PLACEHOLDER_PARAGRAPHS.map((text) => (
                <p key={text} className="text-sm text-foreground">
                  {text}
                </p>
              ))}
            </div>
            <div className="flex justify-end pt-4">
              <DrawerClose asChild>
                <Button variant="outline" size="sm">
                  Close
                </Button>
              </DrawerClose>
            </div>
          </DrawerContent>
        </Drawer>
      </DemoSection>

      <DemoSection title="Left drawer (side=left)">
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline" size="sm">
              Open left drawer
            </Button>
          </DrawerTrigger>
          <DrawerContent side="left">
            <DrawerTitle>Navigation</DrawerTitle>
            <DrawerDescription>
              Full-height panel anchored to the left edge.
            </DrawerDescription>
            <div className="mt-4 space-y-3">
              {PLACEHOLDER_PARAGRAPHS.map((text) => (
                <p key={text} className="text-sm text-foreground">
                  {text}
                </p>
              ))}
            </div>
          </DrawerContent>
        </Drawer>
      </DemoSection>
    </>
  );
}
