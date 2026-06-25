import * as React from "react";

// Shared section scaffolding — reproduced verbatim from the prototype home
// helpers (FSection, Eyebrow, SectionHead, TrustStrip).

export function FSection({
  scheme = "scheme-light",
  id,
  children,
  style = {},
}: {
  scheme?: "scheme-light" | "scheme-soft" | "scheme-dark" | "scheme-dark-2";
  id?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <section className={scheme} id={id} style={{ paddingBlock: "var(--section-pad-y)", paddingInline: "var(--section-pad-x)", ...style }}>
      <div className="croftly-container">{children}</div>
    </section>
  );
}

export function Eyebrow({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <p style={{ margin: "0 0 var(--space-4)", fontFamily: "var(--font-body)", fontWeight: "var(--weight-semibold)", fontSize: "var(--text-regular)", color: "var(--scheme-accent)", ...style }}>
      {children}
    </p>
  );
}

export function SectionHead({
  eyebrow,
  title,
  intro,
  center = false,
  max = "52rem",
  titleSize = "var(--text-h2)",
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  intro?: React.ReactNode;
  center?: boolean;
  max?: string;
  titleSize?: string;
}) {
  return (
    <div style={{ maxWidth: max, marginInline: center ? "auto" : 0, textAlign: center ? "center" : "left", marginBottom: "var(--space-12)" }}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 style={{ margin: 0, fontSize: titleSize, color: "var(--scheme-text)", textWrap: "balance" }}>{title}</h2>
      {intro && (
        <p
          style={{
            margin: "var(--space-6) 0 0",
            marginInline: center ? "auto" : 0,
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-large)",
            lineHeight: "var(--leading-normal)",
            color: "var(--scheme-text-muted)",
            textWrap: "pretty",
            maxWidth: center ? "44ch" : "none",
          }}
        >
          {intro}
        </p>
      )}
    </div>
  );
}

export function TrustStrip({ items }: { items: { value: React.ReactNode; label: React.ReactNode }[] }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-5) var(--space-8)", alignItems: "center" }}>
      {items.map((it, i) => (
        <div key={i} style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
          <span style={{ fontFamily: "var(--font-heading)", fontWeight: "var(--weight-semibold)", fontSize: "var(--text-h6)", color: "var(--scheme-text)" }}>{it.value}</span>
          <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-regular)", color: "var(--scheme-text-muted)" }}>{it.label}</span>
        </div>
      ))}
    </div>
  );
}
