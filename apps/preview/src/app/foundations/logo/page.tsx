"use client";

import { PageHeader } from "@preview/components/page-header";
import { Logo, LogoFull } from "@stasho/ds/logo";
import { LogoMark, MARK_PALETTES } from "@stasho/ds/logo-mark";

const SIZES = [
  { label: "xs", className: "size-6" },
  { label: "sm", className: "size-8" },
  { label: "md", className: "size-10" },
  { label: "lg", className: "size-14" },
  { label: "xl", className: "size-20" },
] as const;

const MARK_SIZES = [16, 24, 32, 48, 64, 96] as const;

const FAVICON_FILES = [
  // .ico can't be rendered by <img> reliably, so preview the 32px PNG it packs
  {
    file: "favicon.ico",
    preview: "stasho-mark-void-32.png",
    label: "16 / 32 / 48",
    px: 32,
  },
  {
    file: "apple-touch-icon.png",
    preview: "apple-touch-icon.png",
    label: "180",
    px: 64,
  },
  {
    file: "stasho-mark-void-192.png",
    preview: "stasho-mark-void-192.png",
    label: "192",
    px: 64,
  },
  {
    file: "stasho-mark-void-512.png",
    preview: "stasho-mark-void-512.png",
    label: "512",
    px: 64,
  },
] as const;

type MarkPaletteKey = keyof typeof MARK_PALETTES;

const FULL_SIZES = [
  { label: "sm", className: "h-6 w-auto" },
  { label: "md", className: "h-8 w-auto" },
  { label: "lg", className: "h-10 w-auto" },
  { label: "xl", className: "h-14 w-auto" },
] as const;

export default function LogoPage() {
  return (
    <div>
      <PageHeader
        title="Logo"
        description="stasho brand marks. The line-art logo follows currentColor; the badge mark carries fixed brand colors so it survives export."
      />
      <div className="space-y-12">
        {/* Icon mark */}
        <section>
          <h3 className="text-lg font-bold mb-2">Icon Mark</h3>
          <p className="text-sm text-muted-foreground mb-6">
            The standalone icon mark. Size it with Tailwind utilities like{" "}
            <code>size-10</code>.
          </p>
          <div className="flex items-end gap-6">
            {SIZES.map(({ label, className }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <Logo className={className} aria-hidden="true" />
                <span className="text-xs text-muted-foreground font-mono">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Full logo */}
        <section>
          <h3 className="text-lg font-bold mb-2">Full Logo</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Icon mark + &quot;stasho&quot; wordmark. Set the height and use{" "}
            <code>w-auto</code> for the correct aspect ratio.
          </p>
          <div className="space-y-6">
            {FULL_SIZES.map(({ label, className }) => (
              <div key={label} className="flex items-center gap-4">
                <span className="w-8 text-xs text-muted-foreground font-mono text-right">
                  {label}
                </span>
                <LogoFull className={className} aria-hidden="true" />
              </div>
            ))}
          </div>
        </section>

        {/* On dark surface */}
        <section>
          <h3 className="text-lg font-bold mb-2">On Dark Surface</h3>
          <p className="text-sm text-muted-foreground mb-6">
            The logo inherits <code>currentColor</code>, so it works on any
            background by setting the parent text color.
          </p>
          <div className="rounded-2xl bg-neutral-900 p-8 flex items-center gap-8 text-white">
            <Logo className="size-12" aria-hidden="true" />
            <LogoFull className="h-10 w-auto" aria-hidden="true" />
          </div>
        </section>

        {/* Colored */}
        <section>
          <h3 className="text-lg font-bold mb-2">Brand Color</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Apply any text color to tint the logo. Cyan (<code>accent</code>) is
            the brand signal; <code>primary</code> is reserved for the CTA.
          </p>
          <div className="flex items-center gap-8">
            <Logo className="size-12 text-accent" aria-hidden="true" />
            <LogoFull className="h-10 w-auto text-accent" aria-hidden="true" />
          </div>
        </section>

        {/* Badge mark */}
        <section>
          <h3 className="text-lg font-bold mb-2">Badge Mark</h3>
          <p className="text-sm text-muted-foreground mb-6">
            The wordmark&apos;s &quot;s&quot; as real outlines inside a filled
            square. Unlike the logo above it does <strong>not</strong> follow
            the theme — it carries its own ground, because it gets exported to
            PNG and uploaded where our CSS never runs (GitHub App avatar,
            favicon, social cards). Round it with{" "}
            <code>className=&quot;rounded-full&quot;</code> for a badge.
          </p>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {(Object.keys(MARK_PALETTES) as MarkPaletteKey[]).map((palette) => (
              <div key={palette} className="flex flex-col gap-3">
                <LogoMark
                  palette={palette}
                  className="w-full rounded-md border border-edge"
                  aria-label={`stasho badge mark, ${palette}`}
                />
                <LogoMark
                  palette={palette}
                  className="size-12 rounded-full border border-edge"
                  aria-hidden="true"
                />
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-mono">{palette}</span>
                  <span className="text-xs text-muted-foreground font-mono">
                    {MARK_PALETTES[palette].bg} / {MARK_PALETTES[palette].fg}
                  </span>
                  <span className="flex gap-2 text-xs">
                    <a
                      className="text-primary dark:text-accent underline"
                      href={`/brand/stasho-mark-${palette}.svg`}
                      download
                    >
                      SVG
                    </a>
                    <a
                      className="text-primary dark:text-accent underline"
                      href={`/brand/stasho-mark-${palette}-512.png`}
                      download
                    >
                      PNG 512
                    </a>
                    <a
                      className="text-primary dark:text-accent underline"
                      href={`/brand/stasho-mark-${palette}-128.png`}
                      download
                    >
                      128
                    </a>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* At real size */}
        <section>
          <h3 className="text-lg font-bold mb-2">At Real Size</h3>
          <p className="text-sm text-muted-foreground mb-6">
            The mark is scaled so its farthest point sits 14% inside the frame,
            measured against the inscribed <em>circle</em> — so the ring of air
            survives a platform cropping it round.
          </p>
          <div className="flex items-end gap-6">
            {MARK_SIZES.map((size) => (
              <div key={size} className="flex flex-col items-center gap-2">
                <LogoMark
                  className="rounded-full border border-edge"
                  style={{ width: size, height: size }}
                  aria-hidden="true"
                />
                <span className="text-xs text-muted-foreground font-mono">
                  {size}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Favicon */}
        <section>
          <h3 className="text-lg font-bold mb-2">Favicon</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Generated from the same outlines. The <code>.ico</code> packs 16,
            32 and 48px; <code>apple-touch-icon.png</code> is 180px.
          </p>
          <div className="flex flex-wrap items-end gap-8">
            {FAVICON_FILES.map(({ file, label, preview, px }) => (
              <div key={file} className="flex flex-col items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/brand/${preview}`}
                  alt={`stasho favicon at ${label}`}
                  width={px}
                  height={px}
                  className="rounded-sm border border-edge"
                  style={{ width: px, height: px }}
                />
                <span className="text-xs text-muted-foreground font-mono">
                  {label}
                </span>
                <a
                  href={`/brand/${file}`}
                  download
                  className="text-xs text-primary dark:text-accent underline font-mono"
                >
                  {file}
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Usage */}
        <section>
          <h3 className="text-lg font-bold mb-2">Usage</h3>
          <div className="rounded-2xl bg-muted/50 p-6 font-mono text-sm space-y-1.5 text-muted-foreground">
            <p>
              <span className="text-primary-400">import</span>
              {" { Logo, LogoFull } "}
              <span className="text-primary-400">from</span>
              {' "@stasho/ds/logo"'}
            </p>
            <p className="mt-3">
              {'<Logo className="size-10" aria-label="stasho" />'}
            </p>
            <p>
              {'<LogoFull className="h-8 w-auto" aria-label="stasho" />'}
            </p>
            <p className="mt-3">
              <span className="text-primary-400">import</span>
              {" { LogoMark } "}
              <span className="text-primary-400">from</span>
              {' "@stasho/ds/logo-mark"'}
            </p>
            <p className="mt-3">
              {'<LogoMark palette="void" className="size-10 rounded-full" />'}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
