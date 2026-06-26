import type { Metadata } from "next";
import { Icon } from "@/components/croftly/icon";
import { Button } from "@/components/croftly/button";
import { Nav } from "@/components/site/nav";
import { SiteFooter } from "@/components/site/footer";
import { FSection, Eyebrow, SectionHead } from "@/components/site/section";
import { HwIcon, IconChip, StepBlock, OptionCard, DeliveryCard } from "@/components/site/hiw";
import { ApproveCard } from "@/components/site/hiw-approve-card";

// Reproduced faithfully from /design-reference/Croftly How It Works (standalone).html.
// SSR / crawlable. Footer reuses the shared SiteFooter (flagged).
export const metadata: Metadata = {
  title: "Croftly — How does buying directly from farmers work?",
  description:
    "You tell us what you like; we match it to what farms near you picked this week, then collect or deliver it — and you approve every box before it's charged.",
};

const Arrow = <Icon name="arrowRight" size={18} />;

const TRUST_ROWS: { icon: "shield" | "sliders"; tone: "earth" | "fresh" | "sky"; h: string; b: string }[] = [
  { icon: "shield", tone: "earth", h: "Allergies are always respected", b: "Set foods to never send and we filter them out before a box is ever built — every week, no exceptions." },
  { icon: "sliders", tone: "fresh", h: "You set the substitution rule", b: "Swap for something similar, ask me first, or just refund the item — whatever you're comfortable with." },
  { icon: "shield", tone: "sky", h: "You approve every box before it's charged", b: "See exactly what's coming and the price, then tap approve. Nothing leaves your card until you do." },
];

export default function HowItWorksPage() {
  return (
    <>
      {/* 1. HEADER */}
      <header className="scheme-dark" style={{ paddingBlock: "var(--space-12)", paddingInline: "var(--section-pad-x)" }}>
        <div className="croftly-container">
          <Nav />
          <div style={{ maxWidth: "60rem" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.4rem 0.8rem", borderRadius: "var(--radius-pill)", border: "1px solid var(--scheme-border)", fontFamily: "var(--font-body)", fontSize: "var(--text-small)", color: "var(--scheme-text-muted)", marginBottom: "var(--space-6)" }}>
              <Icon name="basket" size={16} stroke={2} /> For households
            </span>
            <h1 style={{ margin: 0, fontSize: "var(--text-h1)", color: "var(--scheme-text)", lineHeight: "var(--leading-tight)", letterSpacing: "var(--tracking-tight)", maxWidth: "20ch", textWrap: "balance" }}>
              How does buying directly from farmers work?
            </h1>
            <p style={{ margin: "var(--space-8) 0 0", fontFamily: "var(--font-body)", fontSize: "var(--text-large)", lineHeight: "var(--leading-normal)", color: "var(--scheme-text-muted)", maxWidth: "52ch", textWrap: "pretty" }}>
              You tell us what you like to eat. We match it to what farms near you have picked this week, then it&apos;s collected or delivered to your door — and you approve every box before it&apos;s charged.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-4)", marginTop: "var(--space-10)" }}>
              <Button href="/get-started?role=household" size="lg" iconRight={Arrow}>Start your first box</Button>
              <Button href="/shop/setup" size="lg" variant="secondary" onDark>See example boxes</Button>
            </div>
          </div>
        </div>
      </header>

      {/* 2. THE STEPS */}
      <FSection scheme="scheme-light" id="steps">
        <SectionHead eyebrow="Step by step" title="What happens from sign-up to your first box?" intro="Four simple steps. No long forms, no lock-in, and nothing leaves your card until you say yes." />
        <div className="cards-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "var(--space-8)" }}>
          <StepBlock n={1} tone="fresh" icon={<HwIcon name="sliders" size={26} />} title="Set your tastes, budget and household size" body="Tell us what you love, what to skip, how many you're feeding and roughly what you'd like to spend each week." />
          <StepBlock n={2} tone="rescued" icon={<Icon name="sparkles" size={26} stroke={1.8} />} title="We match boxes from local farms with what's fresh this week" body="We look at what nearby farms have actually picked and build a box that fits your list — real, in-season produce, not a fixed catalogue." />
          <StepBlock n={3} tone="sky" icon={<Icon name="truck" size={26} stroke={1.8} />} title="Choose free collection or courier delivery" body="Pick up free from a local collection point, or have it brought to your door for one honest courier fee. You choose each week." />
          <StepBlock n={4} tone="earth" icon={<HwIcon name="calendar" size={26} />} title="Pause, skip or swap anytime" body="Going away? Fancy a change? Pause a week, skip a delivery or swap anything in your box — no fees and no awkward phone calls." />
        </div>
      </FSection>

      {/* 3. BOX TYPES */}
      <FSection scheme="scheme-soft" id="box-types">
        <SectionHead eyebrow="Your box, your way" title="Which kind of box can I get?" intro="Three ways to shop, and you can switch between them whenever you like. No type costs more to choose — they're just different ways to fill the fridge." />
        <div className="cards-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-8)" }}>
          <OptionCard tone="fresh" icon={<HwIcon name="repeat" size={26} />} label="Set it and forget it" title="Recurring box" body="The same kind of box arrives on your schedule, built fresh from what's in season each week." points={["Pick weekly or fortnightly", "Adjust size and tastes anytime", "Reliable — turns up without you lifting a finger"]} best="busy households who want fresh food on autopilot." />
          <OptionCard tone="rescued" icon={<HwIcon name="gift" size={26} />} label="Matched to your tastes" title="“Surprise me” box" body="We pick the best of what farms have this week around your tastes — often the gluts and surplus, so less goes to waste." points={["A bit of variety every week", "Helps clear farm gluts — up to 40% less waste", "Often the best value of the three"]} best="open-minded cooks who like a seasonal nudge." />
          <OptionCard tone="sky" icon={<Icon name="basket" size={26} stroke={1.8} />} label="Shop across farms yourself" title="À la carte" body="Browse nearby farms and hand-pick exactly what you want, from veg and eggs to bread, honey and more." points={["Choose every single item", "Mix and match across several farms", "Order one-off, whenever you fancy it"]} best="people who like to plan their own meals." />
        </div>
      </FSection>

      {/* 4. CONTROL & TRUST */}
      <FSection scheme="scheme-light" id="control">
        <div className="split-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-16)", alignItems: "center" }}>
          <div>
            <Eyebrow>Control &amp; trust</Eyebrow>
            <h2 style={{ margin: 0, fontSize: "var(--text-h2)", color: "var(--scheme-text)", textWrap: "balance" }}>What if a farm runs short, or I can&apos;t eat something?</h2>
            <p style={{ margin: "var(--space-6) 0 0", fontFamily: "var(--font-body)", fontSize: "var(--text-large)", lineHeight: "var(--leading-normal)", color: "var(--scheme-text-muted)", maxWidth: "46ch", textWrap: "pretty" }}>
              Farming is seasonal, so now and then a crop sells out. You decide what happens next, and your allergies are never up for negotiation.
            </p>
            <div style={{ display: "grid", gap: "var(--space-6)", marginTop: "var(--space-8)" }}>
              {TRUST_ROWS.map((r, i) => (
                <div key={i} style={{ display: "flex", gap: "var(--space-5)", alignItems: "flex-start" }}>
                  <IconChip tone={r.tone} size="2.75rem">
                    <HwIcon name={r.icon} size={22} stroke={2} />
                  </IconChip>
                  <div>
                    <h3 style={{ margin: 0, fontFamily: "var(--font-heading)", fontWeight: "var(--weight-medium)", fontSize: "var(--text-h6)", color: "var(--scheme-text)" }}>{r.h}</h3>
                    <p style={{ margin: "var(--space-2) 0 0", fontFamily: "var(--font-body)", fontSize: "var(--text-regular)", color: "var(--scheme-text-muted)", lineHeight: "var(--leading-normal)", maxWidth: "42ch" }}>{r.b}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <ApproveCard />
        </div>
      </FSection>

      {/* 5. DELIVERY vs COLLECTION */}
      <FSection scheme="scheme-soft" id="delivery">
        <SectionHead eyebrow="Getting it to you" title="Is delivery free, or do I collect?" intro="Both work — pick whichever suits your week. We won't pretend delivery is free; couriers cost money, so we charge what it honestly costs and no more." />
        <div className="cards-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-8)" }}>
          <DeliveryCard tone="fresh" icon={<HwIcon name="home" size={26} />} title="Free collection" price="Free" priceNote="always" body="Pick your box up from a nearby collection point — a local shop, café or farm stall — at a time that suits you. No fee, ever." points={["No charge at all", "Often a stone's throw from home or work", "Generous pick-up windows, not a 30-minute slot"]} />
          <DeliveryCard tone="sky" icon={<Icon name="truck" size={26} stroke={1.8} />} title="Courier delivery" price="From £2.90" priceNote="honest, flat fee" body="Prefer it brought to your door? A local courier drops it off on your chosen day. The fee is the real cost of the trip — not a markup, and not hidden in the box price." points={["One clear fee, shown before you pay", "Matched to a nearby courier — fewer miles", "Goes to the courier, not Croftly's margin"]} />
        </div>
        <p style={{ margin: "var(--space-8) 0 0", fontFamily: "var(--font-body)", fontSize: "var(--text-regular)", color: "var(--scheme-text-muted)", maxWidth: "56ch", textWrap: "pretty" }}>
          Either way, your food is picked just 1–3 days before it reaches you — straight from a farm near you, never a warehouse.
        </p>
      </FSection>

      {/* 6. CTA */}
      <FSection scheme="scheme-dark" id="start">
        <div style={{ maxWidth: "44rem" }}>
          <Eyebrow>Ready when you are</Eyebrow>
          <h2 style={{ margin: 0, fontSize: "var(--text-h2)", color: "var(--scheme-text)", textWrap: "balance" }}>Start your first box</h2>
          <p style={{ margin: "var(--space-6) 0 0", fontFamily: "var(--font-body)", fontSize: "var(--text-large)", lineHeight: "var(--leading-normal)", color: "var(--scheme-text-muted)", maxWidth: "48ch", textWrap: "pretty" }}>
            Tell us a little about how you eat and we&apos;ll show you a box built from farms near you this week. Approve it if you like it — there&apos;s nothing to commit to.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-4)", marginTop: "var(--space-10)" }}>
            <Button href="/get-started?role=household" size="lg" iconRight={Arrow}>Start your first box</Button>
            <Button href="/shop/setup" size="lg" variant="secondary" onDark>See example boxes</Button>
          </div>
          <p style={{ margin: "var(--space-8) 0 0", display: "inline-flex", alignItems: "center", gap: "0.5rem", fontFamily: "var(--font-body)", fontSize: "var(--text-small)", color: "var(--scheme-text-muted)" }}>
            <HwIcon name="shield" size={16} stroke={2} /> No subscription lock-in · pause, skip or cancel anytime
          </p>
        </div>
      </FSection>

      <SiteFooter />
    </>
  );
}
