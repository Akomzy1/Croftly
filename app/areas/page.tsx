import type { Metadata } from "next";
import { Icon, type IconName } from "@/components/croftly/icon";
import { SiteFooter } from "@/components/site/footer";
import { FSection, Eyebrow } from "@/components/site/section";
import { AreasInteractive, DemandCapture } from "@/components/site/areas-parts";

// Reproduced faithfully from /design-reference/Croftly Areas (standalone).html.
// SSR / crawlable (the region directory is the local-SEO long tail). The map +
// directory are a client island for the hover cross-highlight, still prerendered.
export const metadata: Metadata = {
  title: "Croftly — Where we deliver: farm-to-door areas across the UK",
  description:
    "Croftly grows region by region — signing up nearby farms and couriers before opening boxes, so food travels a short hop. Find your area or tell us where to come next.",
};

const GROW: { icon: IconName; h: string; b: string }[] = [
  { icon: "route", h: "Short hops, not long hauls", b: "We only open an area once enough nearby farms and couriers are signed up, so your food never travels far." },
  { icon: "store", h: "Collection points first", b: "Free pick-up points — a local shop, café or farm stall — go live before doorstep delivery in every new area." },
  { icon: "compass", h: "Led by demand", b: "Where you ask, we go next. Postcodes from this page directly shape which region we open after." },
];

export default function AreasPage() {
  return (
    <>
      {/* Nav lives inside AreasInteractive's header */}
      <AreasInteractive />

      {/* HOW WE GROW */}
      <FSection scheme="scheme-soft" id="how-we-grow">
        <div className="cards-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-8)" }}>
          {GROW.map((it, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
              <span style={{ width: "3.25rem", height: "3.25rem", borderRadius: "var(--radius-card)", background: "var(--color-olive-drab-lightest)", color: "var(--color-olive-drab-dark)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name={it.icon} size={26} stroke={1.8} />
              </span>
              <h3 style={{ margin: 0, fontFamily: "var(--font-heading)", fontWeight: "var(--weight-medium)", fontSize: "var(--text-h6)", color: "var(--scheme-text)" }}>{it.h}</h3>
              <p style={{ margin: 0, fontFamily: "var(--font-body)", fontSize: "var(--text-regular)", color: "var(--scheme-text-muted)", lineHeight: "var(--leading-normal)", textWrap: "pretty" }}>{it.b}</p>
            </div>
          ))}
        </div>
      </FSection>

      {/* NOT YET — demand capture */}
      <FSection scheme="scheme-dark" id="request">
        <div style={{ textAlign: "center", maxWidth: "44rem", marginInline: "auto", marginBottom: "var(--space-10)" }}>
          <Eyebrow style={{ color: "var(--scheme-accent)" }}>Not in your area yet?</Eyebrow>
          <h2 style={{ margin: 0, fontSize: "var(--text-h2)", color: "var(--scheme-text)", textWrap: "balance" }}>Tell us where to come next</h2>
          <p style={{ margin: "var(--space-6) auto 0", maxWidth: "46ch", fontFamily: "var(--font-body)", fontSize: "var(--text-large)", lineHeight: "var(--leading-normal)", color: "var(--scheme-text-muted)", textWrap: "pretty" }}>
            Drop your postcode and email. We open new areas where demand is strongest — every request genuinely moves your area up the list, and we&apos;ll email the day a farm near you goes live.
          </p>
        </div>
        <DemandCapture />
      </FSection>

      <SiteFooter />
    </>
  );
}
