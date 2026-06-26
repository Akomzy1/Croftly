import type { Metadata } from "next";
import { Icon } from "@/components/croftly/icon";
import { Button } from "@/components/croftly/button";
import { MoneySplit } from "@/components/croftly/money-split";
import { CompareTable } from "@/components/croftly/compare-table";
import { Nav } from "@/components/site/nav";
import { SiteFooter } from "@/components/site/footer";
import { FSection, Eyebrow, SectionHead } from "@/components/site/section";
import { PrIcon, CheckList, SplitLine, CommissionCard, PriceTier, MembershipCard, AffordableTile } from "@/components/site/pricing-parts";

// Reproduced faithfully from /design-reference/Croftly Pricing (standalone).html.
// SSR / crawlable. Footer reuses the shared SiteFooter (flagged).
export const metadata: Metadata = {
  title: "Croftly — Honest pricing: see exactly where your money goes",
  description:
    "No mystery margins. On every order Croftly shows what the farmer keeps (85%+), what runs the platform, and what delivery actually costs — before you pay.",
};

const PArrow = <Icon name="arrowRight" size={18} />;

export default function PricingPage() {
  return (
    <>
      {/* 1. HEADER */}
      <header className="scheme-dark" style={{ paddingBlock: "var(--space-12)", paddingInline: "var(--section-pad-x)" }}>
        <div className="croftly-container">
          <Nav />
          <div style={{ maxWidth: "62rem" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.4rem 0.8rem", borderRadius: "var(--radius-pill)", border: "1px solid var(--scheme-border)", fontFamily: "var(--font-body)", fontSize: "var(--text-small)", color: "var(--scheme-text-muted)", marginBottom: "var(--space-6)" }}>
              <PrIcon name="percent" size={16} stroke={2} /> Pricing &amp; transparency
            </span>
            <h1 style={{ margin: 0, fontSize: "var(--text-h1)", color: "var(--scheme-text)", lineHeight: "var(--leading-tight)", letterSpacing: "var(--tracking-tight)", maxWidth: "18ch", textWrap: "balance" }}>
              Honest pricing — see exactly where your money goes
            </h1>
            <p style={{ margin: "var(--space-8) 0 0", fontFamily: "var(--font-body)", fontSize: "var(--text-large)", lineHeight: "var(--leading-normal)", color: "var(--scheme-text-muted)", maxWidth: "56ch", textWrap: "pretty" }}>
              No mystery margins, no clever bundling, nothing buried in the box price. On every order we show what the farmer keeps, what runs the platform, and what delivery actually costs — before you pay.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-4)", marginTop: "var(--space-10)" }}>
              <Button href="/shop/setup" size="lg" iconRight={PArrow}>See example boxes</Button>
              <Button href="/sell" size="lg" variant="secondary" onDark>Sell your produce</Button>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-6) var(--space-12)", marginTop: "var(--space-12)", paddingTop: "var(--space-8)", borderTop: "1px solid var(--scheme-border)" }}>
              {[
                { v: "85%+", l: "goes to the farmer" },
                { v: "£0", l: "hidden fees" },
                { v: "Free", l: "collection, always" },
              ].map((t, i) => (
                <div key={i} style={{ display: "flex", alignItems: "baseline", gap: "0.6rem" }}>
                  <span style={{ fontFamily: "var(--font-heading)", fontWeight: "var(--weight-semibold)", fontSize: "var(--text-h4)", color: "var(--scheme-text)" }}>{t.v}</span>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-regular)", color: "var(--scheme-text-muted)" }}>{t.l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* 2. MONEY-SPLIT */}
      <FSection scheme="scheme-light" id="money-split">
        <SectionHead eyebrow="Where every pound goes" title="Where does the money from a £24 box go?" intro="Here's a real veg box, broken down to the penny. The farmer takes the lion's share — the rest is just enough to run a marketplace that pays them fairly." max="56rem" />
        <div className="split-grid" style={{ display: "grid", gridTemplateColumns: "1.05fr 0.95fr", gap: "var(--space-16)", alignItems: "center" }}>
          <div style={{ padding: "var(--space-10)", borderRadius: "var(--radius-card)", border: "1px solid var(--color-ink-15)", background: "var(--color-white)" }}>
            <MoneySplit
              total={24}
              segments={[
                { label: "Farmer keeps", amount: 20.4, color: "var(--color-olive-drab)" },
                { label: "Croftly platform", amount: 2.9, color: "var(--color-tulip-tree)" },
                { label: "Card & payment", amount: 0.7, color: "var(--color-potters-clay-light)" },
              ]}
            />
            <p style={{ margin: "var(--space-8) 0 0", paddingTop: "var(--space-6)", borderTop: "1px solid var(--color-ink-15)", display: "flex", alignItems: "flex-start", gap: "0.5rem", fontFamily: "var(--font-body)", fontSize: "var(--text-small)", color: "var(--color-neutral)", lineHeight: "var(--leading-normal)" }}>
              <span style={{ flexShrink: 0, color: "var(--color-danube)", marginTop: "0.1rem" }}><PrIcon name="info" size={16} stroke={2} /></span>
              Delivery is never folded into this. If you choose courier, you&apos;ll see that fee added separately — and it goes to the courier, not us.
            </p>
          </div>
          <div>
            <h3 style={{ margin: 0, fontFamily: "var(--font-heading)", fontWeight: "var(--weight-medium)", fontSize: "var(--text-h5)", color: "var(--scheme-text)" }}>What each part pays for</h3>
            <div style={{ marginTop: "var(--space-6)" }}>
              <SplitLine swatch="var(--color-olive-drab)" label="£20.40 — the farmer keeps 85%" amount="£20.40" note="Picked, packed and sold direct. The biggest farmer share in UK grocery." />
              <SplitLine swatch="var(--color-tulip-tree)" label="£2.90 — Croftly platform" amount="£2.90" note="Matching your tastes to farms, software, support, and coordinating couriers." />
              <SplitLine swatch="var(--color-potters-clay-light)" label="£0.70 — card & payment" amount="£0.70" note="What the bank and card networks charge to take the payment. We don't mark it up." />
            </div>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "var(--space-4)", marginTop: "var(--space-2)", paddingTop: "var(--space-5)", borderTop: "2px solid var(--color-neutral-darkest)" }}>
              <span style={{ fontFamily: "var(--font-heading)", fontWeight: "var(--weight-medium)", fontSize: "var(--text-h6)", color: "var(--color-neutral-darkest)" }}>You pay</span>
              <span style={{ fontFamily: "var(--font-heading)", fontWeight: "var(--weight-semibold)", fontSize: "var(--text-h5)", color: "var(--color-neutral-darkest)" }}>£24.00</span>
            </div>
          </div>
        </div>
      </FSection>

      {/* 3. COMMISSION */}
      <FSection scheme="scheme-soft" id="commission">
        <SectionHead eyebrow="For farmers" title="What commission does Croftly take from farmers?" intro="Our fee is public, and it drops when you do something that helps everyone — planning ahead and clearing surplus. The less waste and uncertainty, the less we charge." max="56rem" />
        <div className="cards-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-8)" }}>
          <CommissionCard tone="sky" icon={<PrIcon name="badgePound" size={26} />} rate="15%" label="Standard" title="Everyday orders" body="The flat rate on a normal order placed this week. No listing fees, no monthly charge, no payment for better placement — you only pay when you sell." keep="85%" />
          <CommissionCard tone="fresh" icon={<PrIcon name="calendarCheck" size={26} />} rate="10%" label="Forward orders" title="Sold before you grow it" body="When a household orders ahead and you've committed the crop, your risk drops — so does our fee. Predictable income, planted with confidence." keep="90%" flag="Rewards planning" />
          <CommissionCard tone="rescued" icon={<PrIcon name="recycle" size={26} />} rate="8%" label="Glut & surplus" title="Clearing what would be wasted" body="On surplus and 'wonky' produce sold through a rescued box, we take the least we can. Income on food that would otherwise have been ploughed back in." keep="92%" flag="Cuts waste" />
        </div>
        <p style={{ margin: "var(--space-8) 0 0", fontFamily: "var(--font-body)", fontSize: "var(--text-regular)", color: "var(--scheme-text-muted)", maxWidth: "60ch", textWrap: "pretty" }}>
          Compare that to the 40–60% a supermarket supply chain can swallow before food reaches the shelf. We never own your stock, set your prices, or charge to list.
        </p>
      </FSection>

      {/* 4. DELIVERY */}
      <FSection scheme="scheme-light" id="delivery">
        <SectionHead eyebrow="Getting it to you" title="Is delivery free, or do I pay for it?" intro="Collection is free and always will be — it's the affordable default. Doorstep delivery costs real money to a real person, so we charge what it honestly costs and never hide it in the box price." max="56rem" />
        <div className="cards-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-8)" }}>
          <PriceTier tone="fresh" icon={<PrIcon name="home" size={26} />} title="Free collection" price="Free" priceNote="always" flag="Default" body="Pick your box up from a nearby collection point — a local shop, café or farm stall — whenever suits you. This is the cheapest way to shop Croftly." points={["No charge, ever", "Usually a short walk from home or work", "Generous pick-up windows, not a 30-minute slot"]} />
          <PriceTier tone="sky" icon={<Icon name="truck" size={26} stroke={1.8} />} title="Courier delivery" price="£2.90" priceNote="flat, honest fee" body="Prefer it brought to your door? A local courier drops it off on your chosen day. The fee is the real cost of that trip — not a markup, and not a margin for us." points={["One clear fee, shown before you pay", "Goes to the courier, not Croftly", "Matched to a nearby round — fewer miles"]} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-5)", marginTop: "var(--space-8)", padding: "var(--space-6) var(--space-8)", borderRadius: "var(--radius-card)", background: "var(--color-olive-drab-lightest)", border: "1px solid var(--color-olive-drab-light)", flexWrap: "wrap" }}>
          <span style={{ color: "var(--color-olive-drab-dark)" }}><Icon name="check" size={24} stroke={2.4} /></span>
          <div style={{ flex: 1, minWidth: "16rem" }}>
            <div style={{ fontFamily: "var(--font-heading)", fontWeight: "var(--weight-medium)", fontSize: "var(--text-h6)", color: "var(--color-olive-drab-dark)" }}>Delivery is free over £45</div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-regular)", color: "var(--color-neutral-dark)", marginTop: "0.15rem" }}>Fill the week&apos;s shop in one order and the courier fee is on us — the bigger the box, the easier that is.</div>
          </div>
        </div>
      </FSection>

      {/* 5. MEMBERSHIP */}
      <FSection scheme="scheme-soft" id="membership">
        <div className="split-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-16)", alignItems: "center" }}>
          <div>
            <Eyebrow>Optional · Croftly+</Eyebrow>
            <h2 style={{ margin: 0, fontSize: "var(--text-h2)", color: "var(--scheme-text)", textWrap: "balance" }}>Is the membership worth it for me?</h2>
            <p style={{ margin: "var(--space-6) 0 0", fontFamily: "var(--font-body)", fontSize: "var(--text-large)", lineHeight: "var(--leading-normal)", color: "var(--scheme-text-muted)", maxWidth: "46ch", textWrap: "pretty" }}>
              Croftly works fully without it — collection is always free and the box prices on the left are the real prices. Croftly+ just pays for itself if you order most weeks and like a doorstep drop.
            </p>
            <div style={{ marginTop: "var(--space-8)" }}>
              <CheckList tone="fresh" points={["Cheaper, sometimes free, doorstep delivery", "Your box price held for a year, even in a shortage", "First look at the best rescued and glut deals", "5% of your spend back as credit"]} />
            </div>
            <p style={{ margin: "var(--space-8) 0 0", display: "inline-flex", alignItems: "center", gap: "0.5rem", fontFamily: "var(--font-body)", fontSize: "var(--text-small)", color: "var(--scheme-text-muted)" }}>
              <PrIcon name="info" size={16} stroke={2} /> If you&apos;re not getting your money&apos;s worth, we&apos;ll email you to pause it.
            </p>
          </div>
          <MembershipCard />
        </div>
      </FSection>

      {/* 6. AFFORDABLE */}
      <FSection scheme="scheme-light" id="affordable">
        <SectionHead eyebrow="The affordable way in" title="What's the cheapest way to eat well on Croftly?" intro="The rescued box. It's surplus a farm already has — priced close to supermarket basics, picked just as fresh, and it stops good food going to waste. Collect it free and it's our most affordable shop, full stop." max="56rem" />
        <div className="split-grid" style={{ display: "grid", gridTemplateColumns: "0.85fr 1.15fr", gap: "var(--space-16)", alignItems: "center" }}>
          <AffordableTile />
          <div>
            <h3 style={{ margin: "0 0 var(--space-6)", fontFamily: "var(--font-heading)", fontWeight: "var(--weight-medium)", fontSize: "var(--text-h5)", color: "var(--scheme-text)" }}>How a rescued box compares</h3>
            <CompareTable
              columns={["Croftly rescued", "Supermarket basics"]}
              rows={[
                { label: "Box price", cells: ["£9", "~£8–10"] },
                { label: "Picked within", cells: ["1–3 days", "Often 1–2 weeks"] },
                { label: "Farmer paid fairly", cells: [true, false] },
                { label: "Cuts food waste", cells: [true, false] },
                { label: "Free collection", cells: [true, false] },
              ]}
            />
            <p style={{ margin: "var(--space-6) 0 0", fontFamily: "var(--font-body)", fontSize: "var(--text-regular)", color: "var(--scheme-text-muted)", maxWidth: "48ch", textWrap: "pretty" }}>
              Roughly the same outlay as the cheapest supermarket veg — but fresher, fairer, and food that would otherwise have been wasted.
            </p>
          </div>
        </div>
      </FSection>

      {/* 7. HONEST CTA */}
      <FSection scheme="scheme-dark" id="honest">
        <div style={{ maxWidth: "50rem" }}>
          <Eyebrow>Straight with you</Eyebrow>
          <h2 style={{ margin: 0, fontSize: "var(--text-h1)", color: "var(--scheme-text)", lineHeight: "var(--leading-tight)", letterSpacing: "var(--tracking-tight)", textWrap: "balance" }}>
            We&apos;re not the cheapest. We&apos;re the fairest, and the most transparent.
          </h2>
          <p style={{ margin: "var(--space-8) 0 0", fontFamily: "var(--font-body)", fontSize: "var(--text-large)", lineHeight: "var(--leading-normal)", color: "var(--scheme-text-muted)", maxWidth: "54ch", textWrap: "pretty" }}>
            You can usually find a cheaper tomato. You can&apos;t find one where 85% went to the person who grew it, picked days ago, with every penny of the price shown to you up front. That&apos;s the trade we ask you to make — and we&apos;ll always show our working.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-4)", marginTop: "var(--space-10)" }}>
            <Button href="/shop/setup" size="lg" iconRight={PArrow}>See example boxes</Button>
            <Button href="/sell" size="lg" variant="secondary" onDark>Sell your produce</Button>
          </div>
          <p style={{ margin: "var(--space-8) 0 0", display: "inline-flex", alignItems: "center", gap: "0.5rem", fontFamily: "var(--font-body)", fontSize: "var(--text-small)", color: "var(--scheme-text-muted)" }}>
            <Icon name="check" size={16} stroke={2.4} /> Free collection · no subscription lock-in · prices shown before you pay
          </p>
        </div>
      </FSection>

      <SiteFooter />
    </>
  );
}
