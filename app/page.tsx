import type { Metadata } from "next";
import * as React from "react";
import { Icon } from "@/components/croftly/icon";
import { Button } from "@/components/croftly/button";
import { Card } from "@/components/croftly/card";
import { MoneySplit } from "@/components/croftly/money-split";
import { Pillar } from "@/components/croftly/pillar";
import { Steps } from "@/components/croftly/steps";
import { Nav } from "@/components/site/nav";
import { SiteFooter } from "@/components/site/footer";
import { FSection, Eyebrow, SectionHead, TrustStrip } from "@/components/site/section";
import { QuietLink, FarmTile, MatchVisual, Testimonial, ForkCard } from "@/components/site/home-parts";

// Home — reproduced faithfully from /design-reference/Croftly Home (standalone).html
// (decoded page assembly + home helpers). Dual-audience marketplace landing.
// SSR / crawlable. DEVIATION: the hero video + farm photos are styled placeholders
// (no media shipped); footer reuses the shared SiteFooter ("Areas we serve").

export const metadata: Metadata = {
  title: "Croftly — Fresh from the farm, fair to all",
  description:
    "Croftly connects UK family farms directly to households. Tell us what you want to eat; we match it to nearby farms this week. Farmers sell direct and keep 85%+.",
};

const Chev = <Icon name="arrowRight" size={18} />;

export default function HomePage() {
  return (
    <>
      {/* 1. HERO */}
      <header className="scheme-dark" style={{ paddingBlock: "var(--space-12)", paddingInline: "var(--section-pad-x)" }}>
        <div className="croftly-container">
          <Nav />
          <div className="hero-grid" style={{ display: "grid", gridTemplateColumns: "1.02fr 0.98fr", gap: "var(--space-16)", alignItems: "center" }}>
            <div>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.4rem 0.8rem", borderRadius: "var(--radius-pill)", border: "1px solid var(--scheme-border)", fontFamily: "var(--font-body)", fontSize: "var(--text-small)", color: "var(--scheme-text-muted)", marginBottom: "var(--space-6)" }}>
                <Icon name="sprout" size={16} stroke={2} /> Direct from UK family farms
              </span>
              <h1 style={{ margin: 0, fontSize: "var(--text-h1)", color: "var(--scheme-text)", lineHeight: "var(--leading-tight)", letterSpacing: "var(--tracking-tight)", maxWidth: "15ch", textWrap: "balance" }}>
                Fresh from the farm, straight to your door — and farmers keep 85%
              </h1>
              <p style={{ margin: "var(--space-8) 0 0", fontFamily: "var(--font-body)", fontSize: "var(--text-large)", lineHeight: "var(--leading-normal)", color: "var(--scheme-text-muted)", maxWidth: "46ch", textWrap: "pretty" }}>
                Tell us what you want to eat. We match it to what nearby farms have this week, then get it to your door. Farmers sell direct and skip the delivery headache.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-4)", marginTop: "var(--space-10)" }}>
                <Button href="/get-started?role=household" size="lg" iconRight={Chev}>Shop fresh from local farms</Button>
                <Button href="/sell" size="lg" variant="secondary" onDark>Sell your produce</Button>
              </div>
              <div style={{ marginTop: "var(--space-10)", paddingTop: "var(--space-8)", borderTop: "1px solid var(--scheme-border)" }}>
                <TrustStrip
                  items={[
                    { value: "90+", label: "local farms" },
                    { value: "1,200+", label: "households fed weekly" },
                    { value: "85%+", label: "kept by farmers" },
                  ]}
                />
              </div>
            </div>

            <div style={{ position: "relative" }}>
              <div className="croftly-photo-slot" style={{ width: "100%", aspectRatio: "4 / 5", borderRadius: "20px", border: "1px solid var(--scheme-border)" }}>
                Farm photography
              </div>
              <div style={{ position: "absolute", left: "var(--space-5)", bottom: "var(--space-5)", right: "var(--space-5)", display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "var(--space-4)", pointerEvents: "none" }}>
                <div style={{ background: "var(--color-white)", borderRadius: "var(--radius-card)", padding: "0.75rem 1rem", boxShadow: "var(--shadow-md)", maxWidth: "16rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--color-olive-drab-dark)" }}>
                    <Icon name="clock" size={18} stroke={2} />
                    <span style={{ fontFamily: "var(--font-heading)", fontWeight: "var(--weight-semibold)", fontSize: "var(--text-regular)", color: "var(--color-neutral-darkest)" }}>Picked 1–3 days ago</span>
                  </div>
                  <p style={{ margin: "0.25rem 0 0", fontFamily: "var(--font-body)", fontSize: "var(--text-small)", color: "var(--color-neutral-dark)" }}>Straight from a farm near you — never a warehouse.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 2. HOW IT WORKS */}
      <FSection scheme="scheme-light" id="how-it-works">
        <SectionHead
          eyebrow="How it works"
          title="How does buying from local farms work?"
          intro="Three simple steps. No subscriptions you can't skip, no mystery boxes you didn't choose — just fresh food from farms near you."
        />
        <Card padding="lg">
          <Steps
            orientation="horizontal"
            steps={[
              { title: "Tell us your tastes", body: "Set what you love, what to avoid, and a weekly budget. Recurring box, surprise me, or pick à la carte." },
              { title: "We match local farms", body: "Our matching finds what nearby farms have this week and builds your order from real, in-season produce." },
              { title: "Collect free or get it delivered", body: "Pick up free from a local point, or pay one honest courier fee to your door. Picked 1–3 days before." },
            ]}
          />
        </Card>
        <div style={{ marginTop: "var(--space-8)", display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
          <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-regular)", color: "var(--scheme-text-muted)" }}>Grow food rather than buy it?</span>
          <QuietLink href="/sell">See how selling on Croftly works</QuietLink>
        </div>
      </FSection>

      {/* 3. PILLARS */}
      <FSection scheme="scheme-soft" id="why-croftly">
        <SectionHead
          eyebrow="Why Croftly"
          title="Why shop direct from farmers?"
          intro="We're not the cheapest, and we don't pretend to be. We compete on three things that actually matter."
        />
        <div className="cards-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-8)" }}>
          <Card padding="lg" style={{ height: "100%" }}>
            <Pillar icon={<Icon name="sprout" />} tone="rescued" title="Does buying direct cut food waste?" fact="Up to 40% less wasted">
              Forward orders and glut deals let farms sell what they grow before it spoils — preventing waste, not just rescuing it.
            </Pillar>
          </Card>
          <Card padding="lg" style={{ height: "100%" }}>
            <Pillar icon={<Icon name="leaf" />} tone="fresh" title="Is the food really fresher?" fact="Picked 1–3 days before">
              Short supply chains mean seasonal whole food, picked riper and eaten sooner — not stored for weeks in transit.
            </Pillar>
          </Card>
          <Card padding="lg" style={{ height: "100%" }}>
            <Pillar icon={<Icon name="scale" />} tone="earth" title="Do farmers get a fair deal?" fact="Farmers keep 85%+">
              Farms sell direct and keep 85% or more — up to 92% on surplus — with the split shown openly on every order.
            </Pillar>
          </Card>
        </div>
      </FSection>

      {/* 4. MONEY-SPLIT SNAPSHOT */}
      <FSection scheme="scheme-dark-2" id="money-split">
        <div className="split-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-16)", alignItems: "center" }}>
          <div>
            <Eyebrow>Money</Eyebrow>
            <h2 style={{ margin: 0, fontSize: "var(--text-h2)", color: "var(--scheme-text)", textWrap: "balance" }}>Where does every pound go?</h2>
            <p style={{ margin: "var(--space-6) 0 0", fontFamily: "var(--font-body)", fontSize: "var(--text-large)", lineHeight: "var(--leading-normal)", color: "var(--scheme-text-muted)", maxWidth: "44ch", textWrap: "pretty" }}>
              On a £10 box, the farmer keeps £8.50. Croftly takes £1.20. Card and courier costs are £0.30. No hidden margins, no mystery fees — you see exactly where your money goes.
            </p>
            <div style={{ marginTop: "var(--space-8)" }}>
              <Button href="/how-it-works" variant="secondary" onDark iconRight={Chev}>See example boxes</Button>
            </div>
          </div>
          <Card padding="lg" style={{ background: "var(--color-white)", ...({ "--scheme-text": "var(--color-neutral-darkest)", "--scheme-text-muted": "var(--color-neutral-dark)" } as React.CSSProperties) }}>
            <MoneySplit total={10} />
          </Card>
        </div>
      </FSection>

      {/* 5. FEATURED FARMS */}
      <FSection scheme="scheme-light" id="local-farms">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "var(--space-8)", flexWrap: "wrap", marginBottom: "var(--space-12)" }}>
          <SectionHead eyebrow="Seasonal" title="Which farms are near you?" intro="A few of the family farms and market gardens already selling direct on Croftly." max="40rem" />
          <div style={{ marginBottom: "var(--space-2)" }}>
            <QuietLink href="/areas">Browse all local farms</QuietLink>
          </div>
        </div>
        <div className="cards-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "var(--space-8)" }}>
          <FarmTile name="Hartley's Field" location="Devon" placeholder="Drop a farm photo" blurb="A family veg farm growing 40+ seasonal crops on regenerative no-dig beds." tags={["Organic", "No-dig"]} />
          <FarmTile name="Lower Brook Eggs" location="Somerset" placeholder="Drop a farm photo" blurb="Free-range hens roaming orchard pasture, with eggs collected the same morning." tags={["Free-range", "Pasture-fed"]} />
          <FarmTile name="Oakwell Market Garden" location="Herefordshire" placeholder="Drop a farm photo" blurb="Small-scale salads, herbs and spring veg, hand-picked to order each week." tags={["Hand-picked", "Low-spray"]} />
          <FarmTile name="Mereside Orchard" location="Worcestershire" placeholder="Drop a farm photo" blurb="Heritage apples, pears and plums, plus pressed juice from the day's windfalls." tags={["Heritage", "Family-run"]} />
        </div>
      </FSection>

      {/* 6. MATCHING */}
      <FSection scheme="scheme-soft" id="matching">
        <div className="split-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-16)", alignItems: "center" }}>
          <div>
            <Eyebrow>Matching</Eyebrow>
            <h2 style={{ margin: 0, fontSize: "var(--text-h2)", color: "var(--scheme-text)", textWrap: "balance" }}>How does Croftly know what to send?</h2>
            <p style={{ margin: "var(--space-6) 0 0", fontFamily: "var(--font-body)", fontSize: "var(--text-large)", lineHeight: "var(--leading-normal)", color: "var(--scheme-text-muted)", maxWidth: "44ch", textWrap: "pretty" }}>
              Tell us what you like; our matching finds it from farms near you this week. You stay in control — swap anything, skip a week, or set foods to always avoid.
            </p>
            <div style={{ display: "grid", gap: "var(--space-4)", marginTop: "var(--space-8)" }}>
              {["Matched on taste, budget and what's in season", "Only farms close enough to deliver fresh", "Review and tweak before anything's charged"].map((t, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                  <span style={{ flexShrink: 0, width: "1.5rem", height: "1.5rem", borderRadius: "999px", background: "var(--color-olive-drab-lightest)", color: "var(--color-olive-drab-dark)", display: "inline-flex", alignItems: "center", justifyContent: "center", marginTop: "1px" }}>
                    <Icon name="check" size={14} stroke={2.4} />
                  </span>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-regular)", color: "var(--scheme-text)", lineHeight: "var(--leading-normal)" }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
          <MatchVisual />
        </div>
      </FSection>

      {/* 7. TESTIMONIALS */}
      <FSection scheme="scheme-light" id="stories">
        <SectionHead eyebrow="In their words" title="What do households and farmers say?" center />
        <div className="cards-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-8)", maxWidth: "64rem", marginInline: "auto" }}>
          <Testimonial tone="fresh" quote="“It actually tastes like something. The veg lasts the week, I waste less, and I know which farm it came from. It's not the cheapest — but it's worth it.”" initials="PR" name="Priya R." role="Household · Bristol" />
          <Testimonial tone="earth" quote="“Croftly sells what I grow before I've picked it, and I keep most of the price. No haggling with a buyer, no running my own van. I just farm.”" initials="TM" name="Tom M." role="Hartley's Field · Devon" />
        </div>
      </FSection>

      {/* 8. FINAL CTA */}
      <FSection scheme="scheme-dark" id="for-farmers">
        <div style={{ maxWidth: "44rem", marginBottom: "var(--space-12)" }}>
          <Eyebrow>Get started</Eyebrow>
          <h2 style={{ margin: 0, fontSize: "var(--text-h2)", color: "var(--scheme-text)", textWrap: "balance" }}>Fresher food, fairer farming — pick your side</h2>
          <p style={{ margin: "var(--space-6) 0 0", fontFamily: "var(--font-body)", fontSize: "var(--text-large)", lineHeight: "var(--leading-normal)", color: "var(--scheme-text-muted)", maxWidth: "46ch", textWrap: "pretty" }}>
            Whether you&apos;re filling the fridge or selling the harvest, Croftly connects you directly — no supermarket in the middle.
          </p>
        </div>
        <div className="cards-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-8)" }}>
          <ForkCard tone="fresh" icon={<Icon name="basket" />} eyebrow="For households" title="Shop fresh from local farms" body="Build a box around what you love, see exactly where your money goes, and eat food picked days — not weeks — ago." cta="Shop fresh" href="/get-started?role=household" />
          <ForkCard tone="earth" icon={<Icon name="wheat" />} eyebrow="For farmers" title="Sell your produce direct" body="List what you have, get forward orders, clear gluts, and keep 85%+ of every sale. We match orders to couriers — you never run deliveries." cta="Sell your produce" href="/sell" />
        </div>
      </FSection>

      <SiteFooter />
    </>
  );
}
