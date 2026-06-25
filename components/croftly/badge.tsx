import * as React from "react";

// Croftly Badge / Tag — small status & category labels. Reproduced verbatim
// from the DS (components/core/Badge.jsx).
type Tone = "fresh" | "rescued" | "info" | "earth";
type Variant = "outline" | "solid" | "dot";

const tones: Record<Tone, { bg: string; fg: string; bd: string }> = {
  fresh: { bg: "var(--color-olive-drab-lightest)", fg: "var(--color-olive-drab-dark)", bd: "transparent" },
  rescued: { bg: "var(--color-tulip-tree-lighter)", fg: "var(--color-tulip-tree-dark)", bd: "transparent" },
  info: { bg: "var(--color-danube-lighter)", fg: "var(--color-danube-dark)", bd: "transparent" },
  earth: { bg: "var(--color-potters-clay-lighter)", fg: "var(--color-potters-clay-dark)", bd: "transparent" },
};

const dotColors: Record<Tone, string> = {
  fresh: "var(--color-olive-drab)",
  rescued: "var(--color-tulip-tree)",
  info: "var(--color-danube)",
  earth: "var(--color-potters-clay)",
};

export function Badge({
  variant = "outline",
  tone,
  size = "md",
  children,
  style = {},
  ...props
}: {
  variant?: Variant;
  tone?: Tone;
  size?: "sm" | "md";
} & React.HTMLAttributes<HTMLSpanElement>) {
  const base: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.375rem",
    fontFamily: "var(--font-body)",
    fontWeight: "var(--weight-semibold)",
    fontSize: size === "sm" ? "var(--text-tiny)" : "var(--text-small)",
    lineHeight: 1,
    padding: size === "sm" ? "0.3125rem 0.5rem" : "0.4375rem 0.6875rem",
    borderRadius: "var(--radius-badge)",
    whiteSpace: "nowrap",
  };
  let skin: React.CSSProperties;
  if (variant === "solid" && tone) {
    skin = { background: tones[tone].bg, color: tones[tone].fg, border: `1px solid ${tones[tone].bd}` };
  } else {
    skin = {
      background: "transparent",
      color: "var(--scheme-text, var(--color-neutral-darkest))",
      border: "1px solid var(--scheme-border, var(--color-ink-15))",
    };
  }
  return (
    <span style={{ ...base, ...skin, ...style }} {...props}>
      {variant === "dot" && (
        <span style={{ width: "0.5rem", height: "0.5rem", borderRadius: "999px", background: tone ? dotColors[tone] : "var(--color-olive-drab)", flexShrink: 0 }} />
      )}
      {children}
    </span>
  );
}
