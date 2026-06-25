import * as React from "react";
import Link from "next/link";
import { CroftlyLogo } from "@/components/croftly/logo";
import { Button } from "@/components/croftly/button";

// Marketing top navigation — reproduced verbatim from the prototype design
// system (home helpers, Nav). Used inside a scheme-dark section. Links collapse
// (hidden) below 860px via the .croftly-navlinks rule in globals.css.
const links = [
  { label: "How it works", href: "/how-it-works" },
  { label: "Why Croftly", href: "#" },
  { label: "Local farms", href: "/areas" },
  { label: "For farmers", href: "/sell" },
];

export function Nav() {
  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "var(--space-6)",
        marginBottom: "var(--space-16)",
        flexWrap: "wrap",
      }}
    >
      <Link href="/" aria-label="Croftly home" style={{ display: "inline-flex" }}>
        <CroftlyLogo onDark size={26} />
      </Link>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-8)" }}>
        <div className="croftly-navlinks" style={{ display: "flex", gap: "var(--space-8)" }}>
          {links.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-regular)",
                color: "var(--scheme-text-muted)",
                textDecoration: "none",
              }}
            >
              {l.label}
            </Link>
          ))}
        </div>
        <Button href="/auth/sign-in" size="sm" variant="secondary" onDark>
          Sign in
        </Button>
      </div>
    </nav>
  );
}
