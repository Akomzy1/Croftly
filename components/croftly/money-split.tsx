import * as React from "react";

// Croftly MoneySplit — the signature transparency device, reproduced verbatim
// from the DS (components/marketplace/MoneySplit.jsx). Shows how a household's
// payment is divided: farmer share vs Croftly vs card/courier — a stacked bar
// plus a legend with amounts. Reuse this exact component wherever the split
// appears (CLAUDE.md: it's the brand signature).
export type MoneySegment = { label: string; amount: number; color: string };

export function MoneySplit({
  total = 10,
  currency = "£",
  segments = [
    { label: "Farmer keeps", amount: 8.5, color: "var(--color-olive-drab)" },
    { label: "Croftly", amount: 1.2, color: "var(--color-tulip-tree)" },
    { label: "Card & courier", amount: 0.3, color: "var(--color-potters-clay-light)" },
  ],
  style = {},
  ...props
}: {
  total?: number;
  currency?: string;
  segments?: MoneySegment[];
} & React.HTMLAttributes<HTMLDivElement>) {
  const sum = segments.reduce((a, s) => a + s.amount, 0) || total;
  const fmt = (n: number) => currency + n.toFixed(2);
  return (
    <div style={{ fontFamily: "var(--font-body)", ...style }} {...props}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "0.875rem" }}>
        <span style={{ fontSize: "var(--text-regular)", color: "var(--scheme-text-muted, var(--color-neutral-dark))" }}>
          On a {fmt(total)} box
        </span>
        <span style={{ fontFamily: "var(--font-heading)", fontWeight: "var(--weight-semibold)", fontSize: "var(--text-h5)", color: "var(--color-olive-drab)" }}>
          {Math.round((segments[0].amount / sum) * 100)}% to the farmer
        </span>
      </div>
      <div style={{ display: "flex", height: "1.25rem", borderRadius: "999px", overflow: "hidden", gap: "2px", background: "transparent" }}>
        {segments.map((s, i) => (
          <div
            key={i}
            title={`${s.label} ${fmt(s.amount)}`}
            style={{ width: `${(s.amount / sum) * 100}%`, background: s.color, borderRadius: "999px" }}
          />
        ))}
      </div>
      <div style={{ display: "grid", gap: "0.625rem", marginTop: "1.125rem" }}>
        {segments.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
            <span style={{ width: "0.75rem", height: "0.75rem", borderRadius: "3px", background: s.color, flexShrink: 0 }} />
            <span style={{ flex: 1, fontSize: "var(--text-regular)", color: "var(--scheme-text, var(--color-neutral-darkest))" }}>{s.label}</span>
            <span style={{ fontFamily: "var(--font-heading)", fontWeight: "var(--weight-semibold)", fontSize: "var(--text-regular)", color: "var(--scheme-text, var(--color-neutral-darkest))" }}>
              {fmt(s.amount)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
