import * as React from "react";
import Link from "next/link";
import { CroftlyLogo } from "@/components/croftly/logo";

// Centred auth card on a soft page. DEVIATION: no prototype exists for auth
// screens; built to Croftly tokens (warm, never premium).
export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <main
      className="scheme-soft"
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "var(--space-8)",
        paddingBlock: "var(--space-16)",
        paddingInline: "var(--section-pad-x)",
      }}
    >
      <Link href="/" aria-label="Croftly home" style={{ display: "inline-flex" }}>
        <CroftlyLogo size={28} />
      </Link>

      <div
        style={{
          width: "100%",
          maxWidth: "28rem",
          background: "var(--color-white)",
          border: "1px solid var(--color-ink-15)",
          borderRadius: "var(--radius-card)",
          boxShadow: "var(--shadow-md)",
          padding: "var(--space-10)",
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-8)",
        }}
      >
        <div style={{ display: "grid", gap: "var(--space-3)" }}>
          <h1
            style={{
              margin: 0,
              fontFamily: "var(--font-heading)",
              fontWeight: "var(--weight-medium)",
              fontSize: "var(--text-h4)",
              color: "var(--color-neutral-darkest)",
              textWrap: "balance",
            }}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              style={{
                margin: 0,
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-regular)",
                color: "var(--color-neutral-dark)",
                lineHeight: "var(--leading-normal)",
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
        {children}
      </div>

      {footer && (
        <p
          style={{
            margin: 0,
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-regular)",
            color: "var(--color-neutral)",
          }}
        >
          {footer}
        </p>
      )}
    </main>
  );
}
