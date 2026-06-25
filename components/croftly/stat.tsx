import * as React from "react";

// Croftly Stat — a big citable figure with a label. Reproduced verbatim from
// the DS (components/feedback/Stat.jsx).
export function Stat({
  value,
  label,
  sub,
  align = "left",
  style = {},
  ...props
}: {
  value: React.ReactNode;
  label: React.ReactNode;
  sub?: React.ReactNode;
  align?: React.CSSProperties["textAlign"];
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div style={{ textAlign: align, ...style }} {...props}>
      <div
        style={{
          fontFamily: "var(--font-heading)",
          fontWeight: "var(--weight-medium)",
          fontSize: "var(--text-h1)",
          lineHeight: "var(--leading-tight)",
          letterSpacing: "var(--tracking-tight)",
          color: "var(--scheme-text, var(--color-neutral-darkest))",
        }}
      >
        {value}
      </div>
      <div
        style={{
          marginTop: "0.5rem",
          fontFamily: "var(--font-heading)",
          fontWeight: "var(--weight-medium)",
          fontSize: "var(--text-h6)",
          color: "var(--scheme-text, var(--color-neutral-darkest))",
        }}
      >
        {label}
      </div>
      {sub && (
        <p style={{ margin: "0.375rem 0 0", fontFamily: "var(--font-body)", fontSize: "var(--text-regular)", color: "var(--scheme-text-muted, var(--color-neutral-dark))" }}>
          {sub}
        </p>
      )}
    </div>
  );
}
