import { Button } from "@ac/components/button/button";
import { FormField } from "@ac/components/form-field/form-field";
import { Input } from "@ac/components/input/input";
import { Textarea } from "@ac/components/textarea/textarea";

const variants = [
  "primary",
  "secondary",
  "outline",
  "text",
  "destructive",
  "warning",
] as const;

const sizes = ["xs", "sm", "md", "lg"] as const;

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-10">
      <h3 className="text-lg font-bold mb-4">{title}</h3>
      {children}
    </div>
  );
}

function PlaceholderIcon({ label }: { label: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <title>{label}</title>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4v16m8-8H4"
      />
    </svg>
  );
}

export function ComponentsTab() {
  return (
    <div>
      <Section title="Variants">
        <div className="flex flex-wrap items-center gap-3">
          {variants.map((v) => (
            <Button key={v} variant={v}>
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </Button>
          ))}
        </div>
      </Section>

      <Section title="Sizes">
        <div className="flex flex-wrap items-end gap-3">
          {sizes.map((s) => (
            <Button key={s} size={s}>
              Size {s}
            </Button>
          ))}
        </div>
      </Section>

      <Section title="With Icons">
        <div className="flex flex-wrap items-center gap-3">
          <Button iconLeft={<PlaceholderIcon label="Add" />}>
            Icon Left
          </Button>
          <Button iconRight={<PlaceholderIcon label="Arrow" />}>
            Icon Right
          </Button>
          <Button
            iconLeft={<PlaceholderIcon label="Add" />}
            iconRight={<PlaceholderIcon label="Arrow" />}
          >
            Both Icons
          </Button>
        </div>
      </Section>

      <Section title="Loading">
        <div className="flex flex-wrap items-center gap-3">
          {variants.map((v) => (
            <Button key={v} variant={v} loading>
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </Button>
          ))}
        </div>
      </Section>

      <Section title="Disabled">
        <div className="flex flex-wrap items-center gap-3">
          {variants.map((v) => (
            <Button key={v} variant={v} disabled>
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </Button>
          ))}
        </div>
      </Section>

      <Section title="As Link">
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild variant="primary">
            <a href="#demo">Primary Link</a>
          </Button>
          <Button asChild variant="text">
            <a href="#demo">Text Link</a>
          </Button>
        </div>
      </Section>

      <Section title="Input Sizes">
        <div className="grid gap-4 max-w-md">
          <Input size="sm" placeholder="Small input" aria-label="Small input" />
          <Input size="md" placeholder="Medium input" aria-label="Medium input" />
        </div>
      </Section>

      <Section title="Input States">
        <div className="grid gap-4 max-w-md">
          <Input placeholder="Default" aria-label="Default" />
          <Input error placeholder="Error state" aria-label="Error" />
          <Input disabled placeholder="Disabled" aria-label="Disabled" />
        </div>
      </Section>

      <Section title="Textarea">
        <div className="grid gap-4 max-w-md">
          <Textarea placeholder="Default textarea" aria-label="Default textarea" />
          <Textarea error placeholder="Error textarea" aria-label="Error textarea" />
        </div>
      </Section>

      <Section title="Form Fields">
        <div className="grid gap-6 max-w-md">
          <FormField label="Username" helperText="Choose a unique username">
            <Input placeholder="aleph_user" />
          </FormField>
          <FormField label="Email" required error="Please enter a valid email">
            <Input type="email" placeholder="you@example.com" error />
          </FormField>
          <FormField label="Bio" helperText="Tell us about yourself">
            <Textarea placeholder="I build on Aleph Cloud..." />
          </FormField>
        </div>
      </Section>
    </div>
  );
}
