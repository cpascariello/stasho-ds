"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@stasho/ds/accordion";
import { StatusDot } from "@stasho/ds/status-dot";
import { PageHeader } from "@preview/components/page-header";
import { DemoSection } from "@preview/components/demo-section";

const FAQ = [
  { q: "Do you offer refunds?", a: "Yes — a full refund within 30 days, no questions asked." },
  { q: "Is there a free tier?", a: "Free forever for solo projects, no card required." },
  { q: "Can I self-host?", a: "Enterprise plans include a self-hosted deployment option." },
];

export default function AccordionPage() {
  return (
    <>
      <PageHeader
        title="Accordion"
        description="FAQ disclosure. Hover a row (the caret dips); open/close slides and settles. Respects reduced motion. variant=cards makes each item a card surface; openOnHash opens the item whose id is in the URL hash."
      />

      <DemoSection title="Single (collapsible)">
        <Accordion type="single" collapsible defaultValue="item-0" className="max-w-2xl">
          {FAQ.map((item, i) => (
            <AccordionItem key={item.q} value={`item-${i}`}>
              <AccordionTrigger>{item.q}</AccordionTrigger>
              <AccordionContent>{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </DemoSection>

      <DemoSection title="Cards variant, with leading + summary">
        <Accordion type="single" collapsible defaultValue="dns" variant="cards" className="max-w-2xl">
          <AccordionItem value="dns" id="dns">
            <AccordionTrigger leading={<StatusDot status="degraded" size="sm" />} summary="1 of 2 records missing">
              DNS
            </AccordionTrigger>
            <AccordionContent>
              Add the TXT record at <code>_stasho.example.com</code>; the A record is already in place.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="genesis" id="genesis">
            <AccordionTrigger leading={<StatusDot status="healthy" size="sm" />} summary="Signed 2 days ago">
              First record
            </AccordionTrigger>
            <AccordionContent>The genesis record is on chain and matches the published key.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </DemoSection>

      <DemoSection title="Opens on hash">
        <p className="mb-3 text-sm text-muted-foreground">
          <a href="#hash-b" className="text-primary underline dark:text-accent">#hash-b</a> opens the second item
          and scrolls to it. Items carry <code>id</code>; the accordion listens on mount and on hashchange.
        </p>
        <Accordion type="multiple" openOnHash className="max-w-2xl">
          {FAQ.map((item, i) => (
            <AccordionItem key={item.q} value={`h-${i}`} id={`hash-${"abc"[i]}`} className="scroll-mt-[calc(var(--ds-header-height)+1rem)]">
              <AccordionTrigger>{item.q}</AccordionTrigger>
              <AccordionContent>{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </DemoSection>

      <DemoSection title="Multiple">
        <Accordion type="multiple" className="max-w-2xl">
          {FAQ.map((item, i) => (
            <AccordionItem key={item.q} value={`m-${i}`}>
              <AccordionTrigger>{item.q}</AccordionTrigger>
              <AccordionContent>{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </DemoSection>
    </>
  );
}
