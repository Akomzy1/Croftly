import * as React from "react";
import Link from "next/link";
import { CroftlyLogo } from "@/components/croftly/logo";
import { OnlineProvider } from "@/components/pwa/online";
import { OfflineBanner } from "@/components/pwa/offline-banner";
import { InstallBanner } from "@/components/pwa/install-banner";
import type { Role } from "@/lib/auth/roles";

// Role-aware product shell (the logged-in app chrome). The nav differs by role.
// DEVIATION: no prototype exists for the product shell yet; built to Croftly
// tokens, mobile-first, and never premium per CLAUDE.md.

const NAV: Record<Role, { label: string; href: string }[]> = {
  household: [
    { label: "This week's box", href: "/shop" },
    { label: "My intent", href: "/shop/setup" },
    { label: "Orders", href: "/shop/orders" },
  ],
  farmer: [
    { label: "Listings", href: "/farm" },
    { label: "Orders", href: "/farm/orders" },
    { label: "Forward demand", href: "/farm/forward" },
  ],
};

export function AppShell({
  role,
  email,
  preview = false,
  children,
}: {
  role: Role;
  email?: string | null;
  preview?: boolean;
  children: React.ReactNode;
}) {
  const links = NAV[role];
  return (
    <OnlineProvider>
      <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", background: "var(--surface-page)" }}>
        <OfflineBanner />
        <header
        className="scheme-light"
        style={{
          borderBottom: "1px solid var(--border-default)",
          paddingInline: "var(--section-pad-x)",
          paddingBlock: "var(--space-4)",
        }}
      >
        <div
          className="croftly-container"
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-6)", flexWrap: "wrap" }}
        >
          <Link href={role === "farmer" ? "/farm" : "/shop"} aria-label="Croftly home" style={{ display: "inline-flex" }}>
            <CroftlyLogo size={24} />
          </Link>

          <nav style={{ display: "flex", alignItems: "center", gap: "var(--space-6)", flexWrap: "wrap" }}>
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-regular)", color: "var(--color-neutral-dark)", textDecoration: "none" }}
              >
                {l.label}
              </Link>
            ))}
            {!preview && (
              <form action="/auth/sign-out" method="post" style={{ display: "inline" }}>
                <button
                  type="submit"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontWeight: "var(--weight-medium)",
                    fontSize: "var(--text-regular)",
                    color: "var(--color-neutral-darkest)",
                    background: "transparent",
                    border: "1px solid var(--color-ink-15)",
                    borderRadius: "var(--radius-button)",
                    padding: "0.5rem 0.875rem",
                    cursor: "pointer",
                  }}
                >
                  Sign out
                </button>
              </form>
            )}
          </nav>
        </div>
      </header>

      {preview && (
        <div
          style={{
            background: "var(--color-tulip-tree-lighter)",
            color: "var(--color-tulip-tree-darker)",
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-small)",
            textAlign: "center",
            padding: "0.5rem var(--section-pad-x)",
          }}
        >
          Preview — connect a Supabase project to enable accounts and sign-in.
        </div>
      )}

        <main style={{ flex: 1, paddingInline: "var(--section-pad-x)", paddingBlock: "var(--section-pad-y)" }}>
          <div className="croftly-container">{children}</div>
        </main>

        {!preview && <InstallBanner />}
      </div>
    </OnlineProvider>
  );
}
