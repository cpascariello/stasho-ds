import { PageHeader } from "@preview/components/page-header";

const SPACING_SCALE = [
  { name: "0.5", px: "2px" },
  { name: "1", px: "4px" },
  { name: "2", px: "8px" },
  { name: "3", px: "12px" },
  { name: "4", px: "16px" },
  { name: "5", px: "20px" },
  { name: "6", px: "24px" },
  { name: "8", px: "32px" },
  { name: "10", px: "40px" },
  { name: "12", px: "48px" },
  { name: "16", px: "64px" },
  { name: "20", px: "80px" },
  { name: "24", px: "96px" },
] as const;

const BREAKPOINTS = [
  { name: "sm", px: "640px" },
  { name: "md", px: "768px" },
  { name: "lg", px: "1024px" },
  { name: "xl", px: "1280px" },
  { name: "2xl", px: "1536px" },
] as const;

const RADIUS_SCALE = [
  { cls: "rounded-sm", px: "4px", role: "Controls — buttons, inputs, dropdowns, badges" },
  { cls: "rounded-lg", px: "6px", role: "Object surfaces — cards" },
  { cls: "rounded-xl", px: "8px", role: "Modals — dialogs" },
  { cls: "rounded-full", px: "—", role: "Round-by-design — dots, thumbs, radio" },
] as const;

export default function SpacingPage() {
  return (
    <div>
      <PageHeader
        title="Spacing"
        description="Spacing scale, breakpoints, and border radius tokens."
      />
      <div className="space-y-12">
        <section>
          <h3 className="text-lg font-bold mb-4">Spacing Scale</h3>
          <div className="space-y-2">
            {SPACING_SCALE.map(({ name, px }) => (
              <div key={name} className="flex items-center gap-4">
                <span className="w-12 text-sm text-muted-foreground text-right">
                  {name}
                </span>
                <div
                  className="h-4 rounded bg-primary"
                  style={{ width: px }}
                />
                <span className="text-xs text-muted-foreground">{px}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-lg font-bold mb-4">Breakpoints</h3>
          <div className="overflow-x-auto">
            <table className="text-sm">
              <thead>
                <tr className="border-b border-edge">
                  <th className="text-left py-2 pr-8 text-muted-foreground font-medium">
                    Name
                  </th>
                  <th className="text-left py-2 pr-8 text-muted-foreground font-medium">
                    Min-width
                  </th>
                  <th className="text-left py-2 text-muted-foreground font-medium">
                    CSS
                  </th>
                </tr>
              </thead>
              <tbody>
                {BREAKPOINTS.map(({ name, px }) => (
                  <tr key={name} className="border-b border-edge">
                    <td className="py-2 pr-8 font-mono">{name}</td>
                    <td className="py-2 pr-8">{px}</td>
                    <td className="py-2 font-mono text-muted-foreground">
                      @media (min-width: {px})
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-bold mb-4">Border Radius</h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-prose">
            Hard floor at 4px — nothing is sharper (Decision #100). The
            <code className="font-mono text-accent"> 4 / 6 / 8 </code>
            ladder maps to semantic classes; <code className="font-mono">rounded-sm</code>
            {" / "}<code className="font-mono">rounded-md</code> both resolve to the 4px
            floor. <code className="font-mono">rounded-full</code> is reserved for
            round-by-design only.
          </p>
          <div className="flex flex-wrap gap-6">
            {RADIUS_SCALE.map(({ cls, px, role }) => (
              <div key={cls} className="text-center">
                <div className={`w-16 h-16 bg-primary ${cls}`} />
                <p className="font-mono text-sm mt-3">{cls}</p>
                <p className="font-mono text-xs text-accent">{px}</p>
                <p className="text-xs text-muted-foreground mt-1 max-w-28">
                  {role}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
