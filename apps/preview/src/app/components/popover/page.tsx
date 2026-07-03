"use client";

import { Button } from "@stasho/ds/button";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@stasho/ds/popover";
import { PageHeader } from "@preview/components/page-header";
import { DemoSection } from "@preview/components/demo-section";

export default function PopoverPage() {
  return (
    <>
      <PageHeader
        title="Popover"
        description="Floating panel anchored to a trigger, on Radix Popover. Portalled, outside-click and Escape dismiss, fade + zoom motion. Composable API: Popover, PopoverTrigger, PopoverAnchor, PopoverContent, PopoverClose."
      />

      <DemoSection title="Default (side=top, align=start)">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              Open popover
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <p className="text-sm text-foreground">
              Anchored floating panel. Click outside or press Escape to
              dismiss.
            </p>
            <div className="mt-3 flex justify-end">
              <PopoverClose asChild>
                <Button variant="ghost" size="xs">
                  Close
                </Button>
              </PopoverClose>
            </div>
          </PopoverContent>
        </Popover>
      </DemoSection>

      <DemoSection title="Bottom, aligned end">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              Open below
            </Button>
          </PopoverTrigger>
          <PopoverContent side="bottom" align="end" className="w-64">
            <p className="text-sm text-foreground">
              A wider panel opening downward, aligned to the trigger&apos;s
              end edge.
            </p>
          </PopoverContent>
        </Popover>
      </DemoSection>
    </>
  );
}
