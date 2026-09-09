"use client";

import { Gear, Globe, Key, Rocket, UsersThree } from "@phosphor-icons/react";
import { SectionNav, SectionNavItem } from "@stasho/ds/section-nav";
import { Card } from "@stasho/ds/card";
import { PageHeader } from "@preview/components/page-header";
import { DemoSection } from "@preview/components/demo-section";

const sections = [
  { label: "General", href: "#general", icon: <Gear /> },
  { label: "Domains", href: "#domains", icon: <Globe /> },
  { label: "Environment", href: "#environment", icon: <Key /> },
  { label: "Deployments", href: "#deployments", icon: <Rocket /> },
  { label: "Members", href: "#members", icon: <UsersThree /> },
];

export default function SectionNavPage() {
  return (
    <>
      <PageHeader
        title="SectionNav"
        description="In-page section list for settings-style pages: one link per section URL, the active one in accent. Owns the list only; the column and any breakpoint fallback belong to the page."
      />
      <DemoSection title="Left column beside content">
        <div className="flex gap-6">
          <div className="w-48 shrink-0">
            <SectionNav label="Settings sections">
              {sections.map((s, i) => (
                <SectionNavItem key={s.href} href={s.href} active={i === 2}>
                  {s.label}
                </SectionNavItem>
              ))}
            </SectionNav>
          </div>
          <Card title="Environment" className="min-w-0 flex-1">
            <p className="text-sm text-muted-foreground">
              Placeholder content for the active section. The nav is `w-full` of whatever column it
              sits in; here the column is `w-48`.
            </p>
          </Card>
        </div>
      </DemoSection>
      <DemoSection title="With icons">
        <div className="w-48">
          <SectionNav>
            {sections.map((s, i) => (
              <SectionNavItem key={s.href} href={s.href} icon={s.icon} active={i === 0}>
                {s.label}
              </SectionNavItem>
            ))}
          </SectionNav>
        </div>
      </DemoSection>
    </>
  );
}
