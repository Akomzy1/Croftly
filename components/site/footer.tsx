import * as React from "react";
import Link from "next/link";
import { CroftlyLogo } from "@/components/croftly/logo";

// Site footer — reproduced verbatim from the prototype (areas helpers,
// SiteFooter). scheme-dark-2 band, 4-column grid collapsing to 2 cols < 860px.
const cols = [
  { h: "Shop", links: ["Example boxes", "How it works", "Local farms", "Areas we serve"] },
  { h: "Farmers", links: ["Sell on Croftly", "What you keep", "Clearing a glut", "Farmer stories"] },
  { h: "Croftly", links: ["Our mission", "Less waste", "Help centre", "Contact"] },
];

export function SiteFooter() {
  return (
    <footer
      className="scheme-dark-2"
      style={{ paddingBlock: "var(--section-pad-y)", paddingInline: "var(--section-pad-x)" }}
    >
      <div className="croftly-container">
        <div
          className="footer-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr 1fr 1fr",
            gap: "var(--space-12)",
            paddingBottom: "var(--space-12)",
            borderBottom: "1px solid var(--scheme-border)",
          }}
        >
          <div>
            <div style={{ marginBottom: "var(--space-5)" }}>
              <CroftlyLogo onDark size={24} />
            </div>
            <p
              style={{
                margin: 0,
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-regular)",
                color: "var(--scheme-text-muted)",
                maxWidth: "32ch",
                lineHeight: "var(--leading-normal)",
              }}
            >
              Fresh from farms, fair to all. A UK marketplace connecting local farmers directly to
              households.
            </p>
          </div>
          {cols.map((c) => (
            <div key={c.h}>
              <p
                style={{
                  margin: "0 0 var(--space-5)",
                  fontFamily: "var(--font-heading)",
                  fontWeight: "var(--weight-medium)",
                  fontSize: "var(--text-regular)",
                  color: "var(--scheme-text)",
                }}
              >
                {c.h}
              </p>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: "var(--space-4)" }}>
                {c.links.map((l) => (
                  <li key={l}>
                    <Link
                      href="#"
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "var(--text-regular)",
                        color: "var(--scheme-text-muted)",
                        textDecoration: "none",
                      }}
                    >
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div
          style={{
            paddingTop: "var(--space-8)",
            display: "flex",
            justifyContent: "space-between",
            gap: "var(--space-4)",
            flexWrap: "wrap",
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-small)",
            color: "var(--scheme-text-muted)",
          }}
        >
          <span>© 2026 Croftly Ltd. Made with British farms.</span>
          <span style={{ display: "flex", gap: "var(--space-6)" }}>
            <Link href="#" style={{ color: "inherit", textDecoration: "none" }}>Privacy</Link>
            <Link href="#" style={{ color: "inherit", textDecoration: "none" }}>Terms</Link>
            <Link href="#" style={{ color: "inherit", textDecoration: "none" }}>Cookies</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
