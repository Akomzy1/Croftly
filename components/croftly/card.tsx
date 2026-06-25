"use client";

import * as React from "react";

// Croftly Card — outlined container primitive. Reproduced verbatim from the DS
// (components/core/Card.jsx): 1px border, 16px radius, white fill, optional
// soft shadow; overflow:hidden so images bleed to the rounded edge.
type Padding = "none" | "sm" | "md" | "lg";
type Shadow = "none" | "sm" | "md" | "lg";

const pads: Record<Padding, string | number> = { none: 0, sm: "1rem", md: "1.5rem", lg: "2rem" };
const shadows: Record<Shadow, string> = {
  none: "none",
  sm: "var(--shadow-sm)",
  md: "var(--shadow-md)",
  lg: "var(--shadow-lg)",
};

export function Card({
  interactive = false,
  padding = "lg",
  shadow = "none",
  children,
  style = {},
  ...props
}: {
  interactive?: boolean;
  padding?: Padding;
  shadow?: Shadow;
} & React.HTMLAttributes<HTMLDivElement>) {
  const [hover, setHover] = React.useState(false);
  const base: React.CSSProperties = {
    background: "var(--scheme-foreground, var(--color-white))",
    border: "1px solid var(--scheme-border, var(--color-ink-15))",
    borderRadius: "var(--radius-card)",
    overflow: "hidden",
    padding: pads[padding],
    boxShadow: interactive && hover ? "var(--shadow-md)" : shadows[shadow],
    transition:
      "box-shadow var(--dur-base) var(--ease-standard), transform var(--dur-base) var(--ease-standard), border-color var(--dur-base) var(--ease-standard)",
    transform: interactive && hover ? "translateY(-2px)" : "none",
    cursor: interactive ? "pointer" : "default",
  };
  return (
    <div
      style={{ ...base, ...style }}
      onMouseEnter={interactive ? () => setHover(true) : undefined}
      onMouseLeave={interactive ? () => setHover(false) : undefined}
      {...props}
    >
      {children}
    </div>
  );
}
