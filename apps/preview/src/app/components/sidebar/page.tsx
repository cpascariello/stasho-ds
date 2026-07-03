"use client";

import {
  BookOpen,
  ChartLine,
  FolderOpen,
  Gear,
  House,
} from "@phosphor-icons/react";
import {
  Sidebar,
  SidebarCollapseToggle,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarNav,
  SidebarSection,
} from "@stasho/ds/sidebar";
import { PageHeader } from "@preview/components/page-header";
import { DemoSection } from "@preview/components/demo-section";

export default function SidebarPage() {
  return (
    <>
      <PageHeader
        title="Sidebar"
        description="Collapsible app-shell navigation rail. Controlled or uncontrolled collapse (with optional localStorage persistence), collapsed-mode icon tooltips, and active-item state. Prop/slot-driven — items take href + onClick, so app routing lives in the composition, not the primitive. Composable API: Sidebar, SidebarHeader, SidebarNav, SidebarSection, SidebarItem, SidebarFooter, SidebarCollapseToggle."
      />

      <DemoSection title="Full shell (uncontrolled, persists to localStorage)">
        <div className="flex overflow-hidden rounded-lg border border-edge">
          <Sidebar storageKey="preview-sidebar" className="h-[520px]">
            <SidebarHeader />
            <SidebarNav>
              <SidebarSection>
                <SidebarItem
                  icon={<House />}
                  label="Overview"
                  href="#overview"
                  active
                />
                <SidebarItem
                  icon={<FolderOpen />}
                  label="Projects"
                  href="#projects"
                />
                <SidebarItem
                  icon={<ChartLine />}
                  label="Analytics"
                  href="#analytics"
                />
              </SidebarSection>
              <SidebarSection title="Account">
                <SidebarItem
                  icon={<Gear />}
                  label="Settings"
                  href="#settings"
                />
                <SidebarItem
                  icon={<BookOpen />}
                  label="Docs"
                  href="https://docs.stasho.xyz"
                  target="_blank"
                  rel="noopener noreferrer"
                />
              </SidebarSection>
            </SidebarNav>
            <SidebarFooter>
              <p className="truncate text-xs text-foreground/50 group-data-[collapsed]/sidebar:hidden">
                Signed in as 0xB136…7fCa
              </p>
            </SidebarFooter>
            <SidebarCollapseToggle />
          </Sidebar>
          <div className="flex-1 p-6 text-sm text-muted-foreground">
            Main content area. Use the toggle at the bottom of the rail to
            collapse it to icons and back — collapsed items reveal their
            label in a tooltip on hover.
          </div>
        </div>
      </DemoSection>
    </>
  );
}
