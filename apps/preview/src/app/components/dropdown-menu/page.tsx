"use client";

import { Copy, Download, Trash } from "@phosphor-icons/react";
import { Button } from "@stasho/ds/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@stasho/ds/dropdown-menu";
import { PageHeader } from "@preview/components/page-header";
import { DemoSection } from "@preview/components/demo-section";

export default function DropdownMenuPage() {
  return (
    <>
      <PageHeader
        title="DropdownMenu"
        description="Trigger-anchored action menu on Radix DropdownMenu. Non-modal by default (no scroll-lock page shift), keyboard-navigable, fade + zoom motion. Composable API: DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel, DropdownMenuGroup."
      />

      <DemoSection title="Row actions">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Copy className="size-4" />
              Copy CID
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Download className="size-4" />
              Download logs
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-error">
              <Trash className="size-4" />
              Abandon deploy
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </DemoSection>
    </>
  );
}
