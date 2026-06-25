import * as React from "react";

// Croftly Avatar — round image (or initials fallback) for people & farms.
// Reproduced verbatim from the DS (components/core/Avatar.jsx).
export function Avatar({
  src,
  alt = "",
  initials,
  size = 48,
  ring = false,
  style = {},
}: {
  src?: string;
  alt?: string;
  initials?: string;
  size?: number | string;
  ring?: boolean;
  style?: React.CSSProperties;
}) {
  const dim = typeof size === "number" ? `${size}px` : size;
  const base: React.CSSProperties = {
    width: dim,
    height: dim,
    borderRadius: "999px",
    objectFit: "cover",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    background: "var(--color-olive-drab-lightest)",
    color: "var(--color-olive-drab-dark)",
    fontFamily: "var(--font-heading)",
    fontWeight: "var(--weight-semibold)",
    fontSize: `calc(${dim} * 0.4)`,
    border: ring ? "2px solid var(--color-white)" : "none",
    boxShadow: ring ? "0 0 0 1px var(--color-ink-15)" : "none",
    overflow: "hidden",
  };
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} style={{ ...base, ...style }} />;
  }
  return <span style={{ ...base, ...style }}>{initials}</span>;
}
