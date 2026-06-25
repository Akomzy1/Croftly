import * as React from "react";

// Croftly brand logo: Sprout-C mark + Sora wordmark (with the "ft" furrow
// crossbar). Reproduced verbatim from the prototype design system.
export function CroftlyLogo({
  onDark = false,
  size = 26,
}: {
  onDark?: boolean;
  size?: number;
}) {
  const c = onDark
    ? { arc: "#81B869", stem: "#FBF8F1", lfL: "#FBF8F1", lfR: "#A7CE92", seed: "#F2A541", text: "#FBF8F1", cross: "#F2A541" }
    : { arc: "#4C9A2A", stem: "#3C7B21", lfL: "#81B869", lfR: "#4C9A2A", seed: "#D6452F", text: "#162E0C", cross: "#D6452F" };
  const ic = Math.round(size * 1.5);
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: size * 0.3 }}>
      <svg viewBox="0 0 64 64" width={ic} height={ic} style={{ display: "block", flexShrink: 0 }} aria-label="Croftly">
        <path d="M48 17 A 22 22 0 1 0 48 47" fill="none" stroke={c.arc} strokeWidth="8.5" strokeLinecap="round" />
        <path d="M31 45 C29 37 31 32 31 25" fill="none" stroke={c.stem} strokeWidth="3.2" strokeLinecap="round" />
        <path d="M31 34 C23 35 20 29 21 23 C29 22 31.5 27 31 34 Z" fill={c.lfL} />
        <path d="M31 31 C39 32 42 26 41 20 C33 19 30.5 24 31 31 Z" fill={c.lfR} />
        <circle cx="31" cy="23" r="2.6" fill={c.seed} />
      </svg>
      <span
        style={{
          fontFamily: "var(--font-heading)",
          fontWeight: 600,
          fontSize: size,
          letterSpacing: "-0.022em",
          lineHeight: 1,
          color: c.text,
          whiteSpace: "nowrap",
        }}
      >
        Cro
        <span style={{ position: "relative" }}>
          ft
          <span
            style={{
              position: "absolute",
              left: "-0.01em",
              right: "0.05em",
              top: "0.475em",
              height: "0.082em",
              background: c.cross,
              borderRadius: "1em",
            }}
          />
        </span>
        ly
      </span>
    </span>
  );
}
