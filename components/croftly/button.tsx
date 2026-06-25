"use client";

import * as React from "react";
import Link from "next/link";

// Croftly Button — the primary action element, reproduced verbatim from the
// prototype design system (components/core/Button.jsx). Solid olive-drab
// primary, outlined secondary (light/onDark), light, and inline link variants.
// Sentence-case labels, 12px radius, 200ms hover.

type Variant = "primary" | "secondary" | "light" | "link";
type Size = "sm" | "md" | "lg";

const sizes: Record<Size, React.CSSProperties> = {
  sm: { padding: "0.5rem 0.875rem", fontSize: "var(--text-small)" },
  md: { padding: "0.6875rem 1.25rem", fontSize: "var(--text-regular)" },
  lg: { padding: "0.875rem 1.625rem", fontSize: "var(--text-medium)" },
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  onDark?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
};

type ButtonAsButton = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & {
    href?: undefined;
  };

type ButtonAsLink = CommonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button(props: ButtonProps) {
  const {
    variant = "primary",
    size = "md",
    iconLeft,
    iconRight,
    onDark = false,
    children,
    style = {},
    ...rest
  } = props;
  const [hover, setHover] = React.useState(false);

  const base: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.625rem",
    fontFamily: "var(--font-body)",
    fontWeight: "var(--weight-medium)",
    lineHeight: 1,
    border: "1px solid transparent",
    borderRadius: "var(--radius-button)",
    cursor: "pointer",
    whiteSpace: "nowrap",
    textDecoration: "none",
    transition:
      "background-color var(--dur-base) var(--ease-standard), border-color var(--dur-base) var(--ease-standard), color var(--dur-base) var(--ease-standard)",
    ...(variant !== "link"
      ? sizes[size]
      : { padding: 0, fontSize: sizes[size].fontSize }),
  };

  const variants: Record<Variant, React.CSSProperties> = {
    primary: {
      background: hover ? "var(--color-olive-drab-dark)" : "var(--color-olive-drab)",
      borderColor: hover ? "var(--color-olive-drab-dark)" : "var(--color-olive-drab)",
      color: "var(--color-white)",
    },
    secondary: onDark
      ? {
          background: hover ? "var(--color-white-10)" : "transparent",
          borderColor: "var(--color-white-20)",
          color: "var(--color-white)",
          backdropFilter: "blur(10px)",
        }
      : {
          background: hover ? "var(--color-ink-5)" : "transparent",
          borderColor: "var(--color-ink-15)",
          color: "var(--color-neutral-darkest)",
          backdropFilter: "blur(10px)",
        },
    light: {
      background: hover ? "var(--color-neutral-lightest)" : "var(--color-white)",
      borderColor: hover ? "var(--color-neutral-lightest)" : "var(--color-white)",
      color: "var(--color-neutral-darkest)",
    },
    link: {
      background: "transparent",
      borderColor: "transparent",
      color: onDark ? "var(--color-white)" : "var(--color-neutral-darkest)",
      gap: "0.5rem",
      textDecoration: hover ? "underline" : "none",
      textUnderlineOffset: "3px",
    },
  };

  const composedStyle: React.CSSProperties = { ...base, ...variants[variant], ...style };
  const inner = (
    <>
      {iconLeft}
      {children}
      {iconRight}
    </>
  );

  if ("href" in props && props.href !== undefined) {
    const { href, ...anchorRest } = rest as React.AnchorHTMLAttributes<HTMLAnchorElement> & {
      href: string;
    };
    return (
      <Link
        href={href}
        style={composedStyle}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        {...anchorRest}
      >
        {inner}
      </Link>
    );
  }

  return (
    <button
      style={composedStyle}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {inner}
    </button>
  );
}
