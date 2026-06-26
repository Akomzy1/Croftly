import * as React from "react";

// Croftly Steps — numbered "how it works" sequence. Reproduced verbatim from the
// DS (components/marketplace/Steps.jsx). Vertical by default; horizontal = a row.
export type Step = { title: React.ReactNode; body?: React.ReactNode };

export function Steps({
  steps = [],
  orientation = "vertical",
  style = {},
}: {
  steps: Step[];
  orientation?: "vertical" | "horizontal";
  style?: React.CSSProperties;
}) {
  const isH = orientation === "horizontal";
  return (
    <ol
      style={{
        listStyle: "none",
        margin: 0,
        padding: 0,
        display: isH ? "grid" : "flex",
        gridTemplateColumns: isH ? `repeat(${steps.length}, 1fr)` : undefined,
        flexDirection: isH ? undefined : "column",
        gap: isH ? "2rem" : "0",
        ...style,
      }}
    >
      {steps.map((s, i) => (
        <li
          key={i}
          style={{
            display: "flex",
            flexDirection: isH ? "column" : "row",
            gap: "1rem",
            paddingBottom: isH ? 0 : i === steps.length - 1 ? 0 : "1.75rem",
            position: "relative",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
            <span style={{ width: "2.5rem", height: "2.5rem", borderRadius: "999px", background: "var(--color-olive-drab)", color: "var(--color-white)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-heading)", fontWeight: "var(--weight-semibold)", fontSize: "var(--text-medium)" }}>
              {i + 1}
            </span>
            {!isH && i < steps.length - 1 && (
              <span style={{ width: "1px", flex: 1, marginTop: "0.5rem", background: "var(--scheme-border, var(--color-ink-15))" }} />
            )}
          </div>
          <div style={{ paddingTop: isH ? "0.25rem" : "0.375rem" }}>
            <h4 style={{ margin: 0, fontFamily: "var(--font-heading)", fontWeight: "var(--weight-medium)", fontSize: "var(--text-h6)", color: "var(--scheme-text, var(--color-neutral-darkest))" }}>{s.title}</h4>
            {s.body && (
              <p style={{ margin: "0.375rem 0 0", fontFamily: "var(--font-body)", fontSize: "var(--text-regular)", color: "var(--scheme-text-muted, var(--color-neutral-dark))", lineHeight: "var(--leading-normal)", maxWidth: "44ch" }}>{s.body}</p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
