import * as React from "react";

// Croftly CompareTable — side-by-side comparison. Reproduced verbatim from the
// DS (components/marketplace/CompareTable.jsx). First column highlighted as
// Croftly; cells accept a string or true/false (check/cross).
export type CompareRow = { label: string; cells: (string | boolean)[] };

function Cell({ value }: { value: string | boolean }) {
  if (value === true) {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-olive-drab)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    );
  }
  if (value === false) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-neutral-light)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    );
  }
  return <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-regular)", color: "var(--color-neutral-dark)" }}>{value}</span>;
}

export function CompareTable({
  columns,
  rows,
  highlightIndex = 0,
  style = {},
}: {
  columns: string[];
  rows: CompareRow[];
  highlightIndex?: number;
  style?: React.CSSProperties;
}) {
  const gridCols = `minmax(8rem, 1.4fr) ${columns.map(() => "1fr").join(" ")}`;
  return (
    <div style={{ border: "1px solid var(--color-ink-15)", borderRadius: "var(--radius-card)", overflow: "hidden", ...style }}>
      <div style={{ display: "grid", gridTemplateColumns: gridCols }}>
        <div style={{ padding: "1.25rem 1.5rem" }} />
        {columns.map((c, i) => (
          <div
            key={i}
            style={{
              padding: "1.25rem 1.5rem",
              textAlign: "center",
              background: i === highlightIndex ? "var(--color-olive-drab)" : "transparent",
              color: i === highlightIndex ? "var(--color-white)" : "var(--color-neutral-darkest)",
              fontFamily: "var(--font-heading)",
              fontWeight: "var(--weight-semibold)",
              fontSize: "var(--text-medium)",
              borderTopLeftRadius: i === highlightIndex ? "var(--radius-card)" : 0,
              borderTopRightRadius: i === highlightIndex ? "var(--radius-card)" : 0,
            }}
          >
            {c}
          </div>
        ))}
      </div>
      {rows.map((row, ri) => (
        <div key={ri} style={{ display: "grid", gridTemplateColumns: gridCols, borderTop: "1px solid var(--color-ink-15)" }}>
          <div style={{ padding: "1rem 1.5rem", fontFamily: "var(--font-body)", fontWeight: "var(--weight-medium)", fontSize: "var(--text-regular)", color: "var(--color-neutral-darkest)", display: "flex", alignItems: "center" }}>{row.label}</div>
          {row.cells.map((value, ci) => (
            <div key={ci} style={{ padding: "1rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", background: ci === highlightIndex ? "var(--color-olive-drab-lightest)" : "transparent" }}>
              <Cell value={value} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
