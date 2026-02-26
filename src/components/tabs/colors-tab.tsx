function Swatch({
  label,
  colorClass,
  textClass,
}: {
  label: string;
  colorClass: string;
  textClass: string;
}) {
  return (
    <div className={`rounded-lg p-4 ${colorClass}`}>
      <span className={`text-sm font-medium ${textClass}`}>{label}</span>
    </div>
  );
}

function SwatchRow({
  title,
  swatches,
}: {
  title: string;
  swatches: { label: string; colorClass: string; textClass: string }[];
}) {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold mb-3">{title}</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {swatches.map((s) => (
          <Swatch key={s.label} {...s} />
        ))}
      </div>
    </div>
  );
}

export function ColorsTab() {
  return (
    <div>
      <SwatchRow
        title="Brand"
        swatches={[
          { label: "brand", colorClass: "bg-brand", textClass: "text-white" },
          {
            label: "brand-lime",
            colorClass: "bg-brand-lime",
            textClass: "text-black",
          },
        ]}
      />
      <SwatchRow
        title="Semantic"
        swatches={[
          {
            label: "background",
            colorClass: "bg-background border border-border",
            textClass: "text-foreground",
          },
          {
            label: "foreground",
            colorClass: "bg-foreground",
            textClass: "text-background",
          },
          {
            label: "primary",
            colorClass: "bg-primary",
            textClass: "text-primary-foreground",
          },
          {
            label: "accent",
            colorClass: "bg-accent",
            textClass: "text-accent-foreground",
          },
          {
            label: "muted",
            colorClass: "bg-muted",
            textClass: "text-muted-foreground",
          },
          {
            label: "card",
            colorClass: "bg-card border border-border",
            textClass: "text-card-foreground",
          },
        ]}
      />
      <SwatchRow
        title="Status"
        swatches={[
          {
            label: "success",
            colorClass: "bg-success",
            textClass: "text-white",
          },
          {
            label: "warning",
            colorClass: "bg-warning",
            textClass: "text-black",
          },
          {
            label: "error",
            colorClass: "bg-error",
            textClass: "text-white",
          },
        ]}
      />
      <SwatchRow
        title="Border"
        swatches={[
          {
            label: "border",
            colorClass: "border-2 border-border bg-background",
            textClass: "text-foreground",
          },
          {
            label: "border-hover",
            colorClass: "border-2 border-border-hover bg-background",
            textClass: "text-foreground",
          },
        ]}
      />
    </div>
  );
}
