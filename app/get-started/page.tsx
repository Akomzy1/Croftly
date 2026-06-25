import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/croftly/icon";
import { Button } from "@/components/croftly/button";
import { Nav } from "@/components/site/nav";
import { SiteFooter } from "@/components/site/footer";

// Reproduced faithfully from /design-reference/Croftly Get Started (standalone).html
// (decoded page assembly + shared helpers). A pure routing page: warm dark header,
// then two large equal cards that send households and farmers to the right signup.

export const metadata: Metadata = {
  title: "Croftly — Get started: shop fresh or sell your produce",
  description:
    "Start with Croftly in a minute. Households shop fresh food direct from local farms; farmers sell direct and keep 85%. Pick your path and create your account.",
};

function Reassure({ children }: { children: React.ReactNode }) {
  return (
    <li
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "0.625rem",
        fontFamily: "var(--font-body)",
        fontSize: "var(--text-regular)",
        color: "var(--color-neutral-dark)",
        lineHeight: "var(--leading-snug)",
      }}
    >
      <span style={{ color: "var(--color-olive-drab)", marginTop: "0.1rem", flexShrink: 0 }}>
        <Icon name="check" size={18} stroke={2.25} />
      </span>
      <span>{children}</span>
    </li>
  );
}

function ForkPanel({
  tone,
  icon,
  eyebrow,
  title,
  blurb,
  points,
  cta,
  footnote,
  href,
}: {
  tone: "fresh" | "earth";
  icon: "basket" | "wheat";
  eyebrow: string;
  title: string;
  blurb: string;
  points: string[];
  cta: string;
  footnote: string;
  href: string;
}) {
  const earth = tone === "earth";
  const bandBg = earth ? "var(--color-tulip-tree-lighter)" : "var(--color-olive-drab-lightest)";
  const chipFg = earth ? "var(--color-potters-clay)" : "var(--color-olive-drab-dark)";
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "var(--color-white)",
        border: "1px solid var(--color-ink-15)",
        borderRadius: "var(--radius-card)",
        overflow: "hidden",
      }}
    >
      {/* tinted top band */}
      <div style={{ background: bandBg, padding: "var(--space-10)", paddingBottom: "var(--space-8)" }}>
        <span
          style={{
            width: "3.5rem",
            height: "3.5rem",
            borderRadius: "var(--radius-card)",
            background: "var(--color-white)",
            color: chipFg,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "var(--space-6)",
          }}
        >
          <Icon name={icon} size={28} stroke={1.8} />
        </span>
        <p
          style={{
            margin: "0 0 var(--space-3)",
            fontFamily: "var(--font-body)",
            fontWeight: "var(--weight-semibold)",
            fontSize: "var(--text-small)",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: chipFg,
          }}
        >
          {eyebrow}
        </p>
        <h2
          style={{
            margin: 0,
            fontFamily: "var(--font-heading)",
            fontWeight: "var(--weight-medium)",
            fontSize: "var(--text-h3)",
            lineHeight: "var(--leading-tight)",
            letterSpacing: "var(--tracking-tight)",
            color: "var(--color-neutral-darkest)",
            textWrap: "balance",
          }}
        >
          {title}
        </h2>
      </div>

      {/* white body */}
      <div
        style={{
          padding: "var(--space-10)",
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-8)",
          flex: 1,
        }}
      >
        <p
          style={{
            margin: 0,
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-large)",
            lineHeight: "var(--leading-normal)",
            color: "var(--color-neutral-dark)",
            textWrap: "pretty",
          }}
        >
          {blurb}
        </p>

        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: "var(--space-4)", flex: 1 }}>
          {points.map((p, i) => (
            <Reassure key={i}>{p}</Reassure>
          ))}
        </ul>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          <Button
            href={href}
            size="lg"
            iconRight={<Icon name="arrowRight" size={18} />}
            style={{
              width: "100%",
              justifyContent: "center",
              ...(earth
                ? { background: "var(--color-potters-clay)", borderColor: "var(--color-potters-clay)" }
                : {}),
            }}
          >
            {cta}
          </Button>
          <p
            style={{
              margin: 0,
              textAlign: "center",
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-small)",
              color: "var(--color-neutral)",
            }}
          >
            {footnote}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function GetStartedPage() {
  return (
    <>
      {/* 1. HEADER — H1 + one warm line */}
      <header
        className="scheme-dark"
        style={{ paddingBlock: "var(--space-12)", paddingInline: "var(--section-pad-x)" }}
      >
        <div className="croftly-container">
          <Nav />
          <div
            style={{
              maxWidth: "40rem",
              marginInline: "auto",
              textAlign: "center",
              paddingTop: "var(--space-8)",
              paddingBottom: "var(--space-4)",
            }}
          >
            <h1
              style={{
                margin: 0,
                fontSize: "var(--text-h1)",
                color: "var(--scheme-text)",
                lineHeight: "var(--leading-tight)",
                letterSpacing: "var(--tracking-tight)",
                textWrap: "balance",
              }}
            >
              Get started with Croftly
            </h1>
            <p
              style={{
                margin: "var(--space-8) auto 0",
                maxWidth: "42ch",
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-large)",
                lineHeight: "var(--leading-normal)",
                color: "var(--scheme-text-muted)",
                textWrap: "pretty",
              }}
            >
              Two doors, same good idea — fresher food and a fairer deal for farms. Pick the one
              that&apos;s you and you&apos;ll be set up in a minute.
            </p>
          </div>
        </div>
      </header>

      {/* 2 + 3. THE FORK — two large cards with reassurance */}
      <section
        className="scheme-light"
        style={{ paddingBlock: "var(--section-pad-y)", paddingInline: "var(--section-pad-x)" }}
      >
        <div className="croftly-container" style={{ maxWidth: "64rem" }}>
          <div
            className="fork-2"
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-8)", alignItems: "stretch" }}
          >
            <ForkPanel
              tone="fresh"
              icon="basket"
              eyebrow="I want to shop"
              title="Get fresh food from farms near you"
              blurb="Tell us what you like and we'll match it to what nearby farms have this week, delivered to your door or a local pick-up point."
              points={[
                "Free to join — no membership fee",
                "Pause, skip or change any week",
                "Cancel anytime, no lock-in",
              ]}
              cta="Create my account"
              footnote="Takes about a minute"
              href="/auth/sign-up?role=household"
            />
            <ForkPanel
              tone="earth"
              icon="wheat"
              eyebrow="I'm a farmer"
              title="Sell direct and keep what you earn"
              blurb="List what you have, take forward orders and clear gluts. We match every order to a courier, so there's no delivery for you to run."
              points={[
                "Free to list your produce",
                "Keep 85% of every order — up to 92% on surplus",
                "No delivery to run — we match couriers",
              ]}
              cta="Sell your produce"
              footnote="Set up your farm in minutes"
              href="/auth/sign-up?role=farmer"
            />
          </div>

          {/* quiet escape hatch for the undecided */}
          <p
            style={{
              margin: "var(--space-12) auto 0",
              textAlign: "center",
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-regular)",
              color: "var(--color-neutral)",
            }}
          >
            Not sure yet?{" "}
            <Link
              href="/how-it-works"
              style={{
                color: "var(--color-olive-drab-dark)",
                fontWeight: "var(--weight-medium)",
                textDecoration: "none",
                textUnderlineOffset: "3px",
              }}
            >
              See how Croftly works
            </Link>{" "}
            &nbsp;·&nbsp; Already with us?{" "}
            <Link
              href="/auth/sign-in"
              style={{
                color: "var(--color-olive-drab-dark)",
                fontWeight: "var(--weight-medium)",
                textDecoration: "none",
              }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
