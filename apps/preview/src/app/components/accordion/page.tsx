"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@stasho/ds/accordion";
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
        description="FAQ disclosure. Hover a row (the caret dips); open/close slides and settles. Respects reduced motion."
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
