import type { Metadata } from "next";
import { PageHeader } from "@preview/components/page-header";

export const metadata: Metadata = {
  title: "Paraplu — Skin Direction v2",
};

const FONT_LINK =
  "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap";

const titleFontFamily = "'Space Grotesk', system-ui, sans-serif";
const bodyFontFamily = "'Inter', system-ui, sans-serif";

type Tokens = {
  void: string;
  base: string;
  raised: string;
  elevated: string;
  edge: string;
  text: string;
  muted: string;
  primary: string;
  primaryFg: string;
  accent: string;
  accentFg: string;
  warn: string;
  warnFg: string;
};

const darkSurfaces = {
  void: "#07080a",
  base: "#0d0d0d",
  raised: "#101111",
  elevated: "#161718",
  edge: "#242728",
  text: "oklch(0.96 0.005 273)",
  muted: "oklch(0.62 0.012 273)",
};

function makeLightSurfaces(hue: number) {
  return {
    void: `oklch(0.99 0.005 ${hue})`,
    base: `oklch(0.97 0.007 ${hue})`,
    raised: `oklch(0.94 0.009 ${hue})`,
    elevated: `oklch(0.90 0.011 ${hue})`,
    edge: `oklch(0.87 0.013 ${hue})`,
    text: `oklch(0.22 0.015 ${hue})`,
    muted: `oklch(0.55 0.014 ${hue})`,
  };
}

type AccentSet = {
  id: string;
  name: string;
  tagline: string;
  primary: { hex: string; name: string };
  primaryFg: string;
  accent: { hex: string; name: string };
  accentFg: string;
  warn: { hex: string; name: string };
  warnFg: string;
  lightHue: number;
};

const accentSets: AccentSet[] = [
  {
    id: "abyssal",
    name: "Abyssal — locked",
    tagline: "Deep purple primary (#2A0563) + bright cyan accent (#00E1FA) + amber warn. Same hex both modes.",
    primary: { hex: "#2A0563", name: "Deep purple" },
    primaryFg: "#ffffff",
    accent: { hex: "#00E1FA", name: "Bright cyan" },
    accentFg: "#001a1f",
    warn: { hex: "#ffc53d", name: "Radix Amber-9" },
    warnFg: "#1a1000",
    lightHue: 270,
  },
];

const sampleHeadline = "Pulse of the deep field";

export default function ParapluPage() {
  return (
    <>
      <link rel="stylesheet" href={FONT_LINK} />
      <div className="mx-auto max-w-7xl px-6 py-10">
        <PageHeader
          title="Paraplu — Skin Direction"
          description="Locked. Abyssal accents (deep purple #2A0563 + bright cyan #00E1FA + amber warn), Observatory Mono surfaces, 2/4/6/10 radius, Space Grotesk + Inter (parked from Grilli). Same hex in both modes."
        />

        <div className="mt-2 space-y-16">
          {accentSets.map((set) => (
            <AccentSetPane key={set.id} set={set} />
          ))}
        </div>

        <SectionHeading
          title="Typography — parked"
          description="Grilli decision deferred. Working choice for now: Space Grotesk for headings (geometric, crystalline character, name aligns with the theme) and Inter for body. Both free via Google Fonts."
        />
        <TypographyNote />

        <SectionHeading
          title="Radius vocabulary — tighter"
          description="Crisper than v1. full reserved for badges, avatars, status dots — never buttons."
        />
        <RadiusChips />

        <DecisionNotes />
      </div>
    </>
  );
}

function SectionHeading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mt-12 mb-5">
      <h3 className="mb-1 font-heading text-xl font-bold">{title}</h3>
      <p className="max-w-3xl text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function AccentSetPane({ set }: { set: AccentSet }) {
  const darkTokens: Tokens = {
    ...darkSurfaces,
    primary: set.primary.hex,
    primaryFg: set.primaryFg,
    accent: set.accent.hex,
    accentFg: set.accentFg,
    warn: set.warn.hex,
    warnFg: set.warnFg,
  };
  const lightTokens: Tokens = {
    ...makeLightSurfaces(set.lightHue),
    primary: set.primary.hex,
    primaryFg: set.primaryFg,
    accent: set.accent.hex,
    accentFg: set.accentFg,
    warn: set.warn.hex,
    warnFg: set.warnFg,
  };

  return (
    <section className="space-y-4">
      <div>
        <h4 className="text-2xl font-heading font-bold">{set.name}</h4>
        <p className="text-sm text-muted-foreground">{set.tagline}</p>
      </div>

      <div className="flex flex-wrap gap-6">
        <SwatchChip label="primary" hex={set.primary.hex} name={set.primary.name} />
        <SwatchChip label="accent" hex={set.accent.hex} name={set.accent.name} />
        <SwatchChip label="warn" hex={set.warn.hex} name={set.warn.name} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChromePane tokens={darkTokens} label="Dark" />
        <ChromePane tokens={lightTokens} label="Light" />
      </div>
    </section>
  );
}

function SwatchChip({
  label,
  hex,
  name,
}: {
  label: string;
  hex: string;
  name: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="h-10 w-10 rounded border border-edge"
        style={{ background: hex }}
      />
      <div className="text-xs leading-tight">
        <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          {label}
        </div>
        <div className="font-mono text-foreground">{hex}</div>
        <div className="text-muted-foreground">{name}</div>
      </div>
    </div>
  );
}

function ChromePane({ tokens, label }: { tokens: Tokens; label: string }) {
  return (
    <article
      className="overflow-hidden rounded-xl border"
      style={{
        background: tokens.base,
        borderColor: tokens.edge,
        color: tokens.text,
        fontFamily: bodyFontFamily,
      }}
    >
      <div
        className="border-b px-5 py-3 text-[11px] uppercase tracking-[0.18em]"
        style={{ borderColor: tokens.edge, color: tokens.muted }}
      >
        {label}
      </div>

      <div className="space-y-5 p-5">
        <div
          className="rounded-md p-4"
          style={{
            background: tokens.raised,
            border: `1px solid ${tokens.edge}`,
          }}
        >
          <div
            className="mb-1 text-[10px] uppercase tracking-[0.16em]"
            style={{ color: tokens.muted }}
          >
            Validator
          </div>
          <div
            className="mb-3 text-xl"
            style={{ fontFamily: titleFontFamily, fontWeight: 600 }}
          >
            {sampleHeadline}
          </div>
          <div className="mb-4 flex items-center gap-2 text-xs">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{
                background: tokens.accent,
                boxShadow: `0 0 8px ${tokens.accent}`,
              }}
            />
            <span>Active · 99.7% uptime</span>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="whitespace-nowrap px-3 py-1.5 text-xs font-medium"
              style={{
                background: tokens.primary,
                color: tokens.primaryFg,
                borderRadius: 4,
              }}
            >
              View details
            </button>
            <button
              type="button"
              className="whitespace-nowrap px-3 py-1.5 text-xs font-medium"
              style={{
                background: "transparent",
                color: tokens.text,
                border: `1px solid ${tokens.edge}`,
                borderRadius: 4,
              }}
            >
              History
            </button>
            <button
              type="button"
              className="whitespace-nowrap px-3 py-1.5 text-xs font-medium"
              style={{
                background: "transparent",
                color: tokens.accent,
                borderRadius: 4,
                textDecoration: "underline",
                textUnderlineOffset: "3px",
              }}
            >
              Open in Explorer ↗
            </button>
          </div>
        </div>

        <input
          type="text"
          placeholder="search nodes…"
          className="w-full px-3 py-2 text-sm outline-none"
          style={{
            background: tokens.raised,
            border: `1px solid ${tokens.edge}`,
            borderRadius: 4,
            color: tokens.text,
          }}
        />

        <div className="flex flex-wrap gap-1.5">
          <ChromeBadge bg={tokens.primary} fg={tokens.primaryFg} edge="transparent">
            Live
          </ChromeBadge>
          <ChromeBadge bg={tokens.accent} fg={tokens.accentFg} edge="transparent">
            Beta
          </ChromeBadge>
          <ChromeBadge bg={tokens.warn} fg={tokens.warnFg} edge="transparent">
            Pending
          </ChromeBadge>
          <ChromeBadge bg="transparent" fg={tokens.text} edge={tokens.edge}>
            v2.1
          </ChromeBadge>
        </div>

        <div
          className="text-xs leading-relaxed"
          style={{ color: tokens.muted }}
        >
          Body copy reads cleanly against the surface. Links use the{" "}
          <span
            style={{
              color: tokens.accent,
              textDecoration: "underline",
              textUnderlineOffset: "2px",
            }}
          >
            secondary accent
          </span>{" "}
          so they stay visually distinct from primary actions.
        </div>
      </div>
    </article>
  );
}

function ChromeBadge({
  bg,
  fg,
  edge,
  children,
}: {
  bg: string;
  fg: string;
  edge: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className="inline-block px-2 py-0.5 text-[10px] uppercase tracking-[0.16em]"
      style={{
        background: bg,
        color: fg,
        border: `1px solid ${edge}`,
        borderRadius: 3,
      }}
    >
      {children}
    </span>
  );
}

function TypographyNote() {
  return (
    <article
      className="overflow-hidden rounded-xl border"
      style={{
        background: darkSurfaces.base,
        borderColor: darkSurfaces.edge,
        color: darkSurfaces.text,
        fontFamily: bodyFontFamily,
      }}
    >
      <div className="space-y-3 p-6">
        <div
          className="leading-[1.05]"
          style={{
            fontFamily: titleFontFamily,
            fontWeight: 600,
            fontSize: "3.2rem",
          }}
        >
          Pulse of the deep field
        </div>
        <div
          className="leading-[1.1]"
          style={{
            fontFamily: titleFontFamily,
            fontWeight: 500,
            fontSize: "1.6rem",
          }}
        >
          Section header — observatory readings
        </div>
        <div
          className="leading-[1.5] text-sm"
          style={{ color: darkSurfaces.muted }}
        >
          Body copy uses Inter for legibility at small sizes. Numbers stay tabular
          where it matters (0xa3f…7c1 · 99.7%). When we lock the Grilli budget
          later, swap titleFontFamily for the real face and the rest stays put.
        </div>
        <div
          className="flex flex-wrap gap-3 pt-3 text-xs"
          style={{
            borderTop: `1px solid ${darkSurfaces.edge}`,
            color: darkSurfaces.muted,
          }}
        >
          <span>· Title — Space Grotesk 500/600/700</span>
          <span>· Body — Inter 400/500/700</span>
          <span>· Free via Google Fonts</span>
        </div>
      </div>
    </article>
  );
}

function RadiusChips() {
  const oldRadii = [
    { name: "sm", value: 4 },
    { name: "md", value: 6 },
    { name: "lg", value: 10 },
    { name: "xl", value: 16 },
    { name: "full", value: 9999 },
  ];
  const newRadii = [
    { name: "sm", value: 2 },
    { name: "md", value: 4 },
    { name: "lg", value: 6 },
    { name: "xl", value: 10 },
    { name: "full", value: 9999 },
  ];

  return (
    <div className="space-y-6">
      <RadiusRow label="v2 (proposed, tighter)" radii={newRadii} />
      <RadiusRow label="v1 (previous)" radii={oldRadii} muted />
    </div>
  );
}

function RadiusRow({
  label,
  radii,
  muted = false,
}: {
  label: string;
  radii: { name: string; value: number }[];
  muted?: boolean;
}) {
  return (
    <div>
      <div
        className={`mb-3 text-[10px] uppercase tracking-[0.18em] ${
          muted ? "text-muted-foreground/60" : "text-muted-foreground"
        }`}
      >
        {label}
      </div>
      <div className="flex flex-wrap gap-6">
        {radii.map((r) => (
          <div key={r.name} className="text-center">
            <div
              className="h-16 w-16 border bg-surface"
              style={{
                borderColor: "var(--edge)",
                borderRadius: r.value,
                opacity: muted ? 0.5 : 1,
              }}
            />
            <div className="mt-2 text-xs font-medium">{r.name}</div>
            <div className="text-[10px] text-muted-foreground">
              {r.value === 9999 ? "∞" : `${r.value}px`}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DecisionNotes() {
  return (
    <section className="mt-12 rounded-xl border border-edge bg-surface p-6">
      <h3 className="mb-3 font-heading text-xl font-bold">
        Locked + remaining decisions
      </h3>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <div className="mb-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Locked
          </div>
          <ul className="space-y-1.5 text-sm">
            <li>· Surface ladder dark — Observatory Mono (#07080a → #161718)</li>
            <li>· Surface ladder light — off-white with violet-purple tint (hue 270)</li>
            <li>· Primary — Deep purple #2A0563, both modes</li>
            <li>· Accent — Bright cyan #00E1FA, both modes</li>
            <li>· Warn — Radix Amber-9 #ffc53d, both modes</li>
            <li>· Radius — 2 / 4 / 6 / 10, full reserved for badges/avatars</li>
            <li>· Type (parked) — Space Grotesk + Inter, free</li>
          </ul>
        </div>
        <div>
          <div className="mb-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Next
          </div>
          <ol className="list-inside list-decimal space-y-1.5 text-sm">
            <li>Bake Abyssal tokens into packages/ds/src/styles/tokens.css</li>
            <li>Drop pill radius on Button, switch to md (4px)</li>
            <li>Re-skin Card, Dialog, Input one at a time on this branch</li>
            <li>Revisit Grilli when budget is real</li>
          </ol>
        </div>
      </div>
    </section>
  );
}
