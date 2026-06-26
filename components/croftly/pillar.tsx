import * as React from "react";

// Croftly Pillar — mission-pillar block (icon, question heading, body, one
// citable fact). Reproduced verbatim from the DS (components/marketplace/Pillar.jsx).
type Tone = "fresh" | "rescued" | "info" | "earth";
const tones: Record<Tone, { bg: string; fg: string }> = {
  fresh: { bg: "var(--color-olive-drab-lightest)", fg: "var(--color-olive-drab-dark)" },
  rescued: { bg: "var(--color-tulip-tree-lighter)", fg: "var(--color-tulip-tree-dark)" },
  info: { bg: "var(--color-danube-lighter)", fg: "var(--color-danube-dark)" },
  earth: { bg: "var(--color-potters-clay-lighter)", fg: "var(--color-potters-clay-dark)" },
};

export function Pillar({
  icon,
  title,
  children,
  fact,
  tone = "fresh",
}: {
  icon: React.ReactNode;
  title: React.ReactNode;
  children: React.ReactNode;
  fact?: React.ReactNode;
  tone?: Tone;
}) {
  const t = tones[tone];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <span style={{ width: "3.25rem", height: "3.25rem", borderRadius: "var(--radius-card)", background: t.bg, color: t.fg, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {icon}
      </span>
      <h3 style={{ margin: 0, fontFamily: "var(--font-heading)", fontWeight: "var(--weight-medium)", fontSize: "var(--text-h5)", color: "var(--scheme-text, var(--color-neutral-darkest))" }}>{title}</h3>
      <p style={{ margin: 0, fontFamily: "var(--font-body)", fontSize: "var(--text-regular)", color: "var(--scheme-text-muted, var(--color-neutral-dark))", lineHeight: "var(--leading-normal)" }}>{children}</p>
      {fact && (
        <p style={{ margin: 0, fontFamily: "var(--font-heading)", fontWeight: "var(--weight-semibold)", fontSize: "var(--text-medium)", color: t.fg }}>{fact}</p>
      )}
    </div>
  );
}
