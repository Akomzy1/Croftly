import type { Metadata } from "next";
import * as React from "react";
import { Icon } from "@/components/croftly/icon";
import { SellIcon } from "@/components/croftly/sell-icon";
import { Button } from "@/components/croftly/button";
import { Card } from "@/components/croftly/card";
import { MoneySplit } from "@/components/croftly/money-split";
import { Stat } from "@/components/croftly/stat";
import { Avatar } from "@/components/croftly/avatar";
import { Accordion } from "@/components/croftly/accordion";
import { Nav } from "@/components/site/nav";
import { SiteFooter } from "@/components/site/footer";
import { FSection, Eyebrow, SectionHead, TrustStrip } from "@/components/site/section";
import { HwIcon, IconChip, StepBlock } from "@/components/site/hiw";
import { JoinForm } from "./join-form";

// Reproduced faithfully from /design-reference/Croftly Sell (standalone).html
// (decoded page assembly + shared helpers). Farmer-first marketing page.
// DEVIATION: the prototype's footer (HwFooter) labels one link "Delivery &
// collection" where the shared SiteFooter says "Areas we serve"; per CLAUDE.md
// (shared components identical everywhere) we reuse the single SiteFooter.

export const metadata: Metadata = {
  title: "Croftly — Sell direct, keep 85%, we handle the rest",
  description:
    "Sell with Croftly: farmers keep at least 85% of every order (up to 92% on surplus), get forward orders to plant against real demand, clear gluts instead of wasting them, and never run delivery — we match orders to couriers. Free to join, commission only, no lock-in. You set your prices and keep your brand.",
};

const Arrow = <Icon name="arrowRight" size={18} />;

type Tone = "fresh" | "rescued" | "sky" | "earth";

function ValueCard({ icon, tone, title, body, fact }: { icon: React.ReactNode; tone: Tone; title: string; body: string; fact: string }) {
  return (
    <Card padding="lg" style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)", height: "100%" }}>
      <IconChip tone={tone}>{icon}</IconChip>
      <div>
        <h3 style={{ margin: 0, fontFamily: "var(--font-heading)", fontWeight: "var(--weight-medium)", fontSize: "var(--text-h5)", color: "var(--color-neutral-darkest)", textWrap: "balance" }}>{title}</h3>
        <p style={{ margin: "var(--space-4) 0 0", fontFamily: "var(--font-body)", fontSize: "var(--text-regular)", color: "var(--color-neutral-dark)", lineHeight: "var(--leading-normal)", textWrap: "pretty" }}>{body}</p>
      </div>
      <div style={{ marginTop: "auto", paddingTop: "var(--space-5)", borderTop: "1px solid var(--color-ink-15)", display: "flex", alignItems: "center", gap: "0.55rem", fontFamily: "var(--font-body)", fontSize: "var(--text-small)", color: "var(--color-neutral-darker)" }}>
        <span style={{ flexShrink: 0, color: "var(--color-olive-drab)" }}><Icon name="check" size={17} stroke={2.4} /></span>
        <span><strong style={{ fontWeight: "var(--weight-semibold)", color: "var(--color-neutral-darkest)" }}>{fact}</strong></span>
      </div>
    </Card>
  );
}

function TierRow({ icon, tone, name, commission, keeps, when, highlight }: { icon: React.ReactNode; tone: Tone; name: string; commission: string; keeps: string; when: string; highlight?: boolean }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "auto 1fr auto",
        gap: "var(--space-5)",
        alignItems: "center",
        padding: "var(--space-6)",
        borderRadius: "var(--radius-card)",
        border: "1px solid " + (highlight ? "var(--color-olive-drab-light)" : "var(--color-ink-15)"),
        background: highlight ? "var(--color-olive-drab-lightest)" : "var(--color-white)",
      }}
    >
      <IconChip tone={tone} size="2.75rem">{icon}</IconChip>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
          <span style={{ fontFamily: "var(--font-heading)", fontWeight: "var(--weight-medium)", fontSize: "var(--text-h6)", color: "var(--color-neutral-darkest)" }}>{name}</span>
          <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-small)", color: "var(--color-neutral)" }}>{commission} commission</span>
        </div>
        <p style={{ margin: "0.2rem 0 0", fontFamily: "var(--font-body)", fontSize: "var(--text-regular)", color: "var(--color-neutral-dark)", lineHeight: "var(--leading-snug)" }}>{when}</p>
      </div>
      <div style={{ textAlign: "right", whiteSpace: "nowrap" }}>
        <div style={{ fontFamily: "var(--font-heading)", fontWeight: "var(--weight-semibold)", fontSize: "var(--text-h4)", lineHeight: 1, color: highlight ? "var(--color-olive-drab-dark)" : "var(--color-neutral-darkest)" }}>{keeps}</div>
        <div style={{ marginTop: "0.3rem", fontFamily: "var(--font-body)", fontSize: "var(--text-small)", color: "var(--color-neutral)" }}>you keep</div>
      </div>
    </div>
  );
}

function TrustPoint({ icon, tone, h, b }: { icon: React.ReactNode; tone: Tone; h: string; b: string }) {
  return (
    <div style={{ display: "flex", gap: "var(--space-5)", alignItems: "flex-start" }}>
      <IconChip tone={tone} size="2.75rem">{icon}</IconChip>
      <div>
        <h3 style={{ margin: 0, fontFamily: "var(--font-heading)", fontWeight: "var(--weight-medium)", fontSize: "var(--text-h6)", color: "var(--scheme-text)" }}>{h}</h3>
        <p style={{ margin: "var(--space-2) 0 0", fontFamily: "var(--font-body)", fontSize: "var(--text-regular)", color: "var(--scheme-text-muted)", lineHeight: "var(--leading-normal)", maxWidth: "44ch", textWrap: "pretty" }}>{b}</p>
      </div>
    </div>
  );
}

export default function SellPage() {
  return (
    <>
      {/* 1. HEADER — H1 promise + plain answer */}
      <header className="scheme-dark" style={{ paddingBlock: "var(--space-12)", paddingInline: "var(--section-pad-x)" }}>
        <div className="croftly-container">
          <Nav />
          <div className="hero-grid" style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: "var(--space-16)", alignItems: "center" }}>
            <div>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.4rem 0.8rem", borderRadius: "var(--radius-pill)", border: "1px solid var(--scheme-border)", fontFamily: "var(--font-body)", fontSize: "var(--text-small)", color: "var(--scheme-text-muted)", marginBottom: "var(--space-6)" }}>
                <SellIcon name="seedling" size={16} stroke={2} /> For farmers &amp; small producers
              </span>
              <h1 style={{ margin: 0, fontSize: "var(--text-h1)", color: "var(--scheme-text)", lineHeight: "var(--leading-tight)", letterSpacing: "var(--tracking-tight)", maxWidth: "16ch", textWrap: "balance" }}>
                Sell direct. Keep 85%. We handle the rest.
              </h1>
              <p style={{ margin: "var(--space-8) 0 0", fontFamily: "var(--font-body)", fontSize: "var(--text-large)", lineHeight: "var(--leading-normal)", color: "var(--scheme-text-muted)", maxWidth: "48ch", textWrap: "pretty" }}>
                Fairer pay, forward orders you can plant against, and you never touch delivery. List what you have this week — we match it to nearby households and to a courier.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-4)", marginTop: "var(--space-10)" }}>
                <Button href="#join" size="lg" iconRight={Arrow}>Join as a farm</Button>
                <Button href="#cost" size="lg" variant="secondary" onDark>See what you&apos;d keep</Button>
              </div>
              <div style={{ marginTop: "var(--space-12)" }}>
                <TrustStrip
                  items={[
                    { value: "85%+", label: "you keep, always" },
                    { value: "Up to 92%", label: "on surplus" },
                    { value: "£0", label: "to list" },
                    { value: "No vans", label: "to run" },
                  ]}
                />
              </div>
            </div>

            {/* Money split — the signature transparency device, on the farmer's side */}
            <Card padding="lg" style={{ background: "var(--color-white)" }}>
              <p style={{ margin: "0 0 var(--space-2)", fontFamily: "var(--font-body)", fontWeight: "var(--weight-semibold)", fontSize: "var(--text-small)", letterSpacing: "0.02em", textTransform: "uppercase", color: "var(--color-neutral)" }}>Where a £10 order goes</p>
              <MoneySplit
                total={10}
                segments={[
                  { label: "You keep", amount: 8.5, color: "var(--color-olive-drab)" },
                  { label: "Croftly commission", amount: 1.2, color: "var(--color-tulip-tree)" },
                  { label: "Card & courier", amount: 0.3, color: "var(--color-potters-clay-light)" },
                ]}
              />
              <p style={{ margin: "var(--space-6) 0 0", paddingTop: "var(--space-5)", borderTop: "1px solid var(--color-ink-15)", fontFamily: "var(--font-body)", fontSize: "var(--text-small)", color: "var(--color-neutral-dark)", lineHeight: "var(--leading-normal)" }}>
                No listing fees, no shelf rent, no penalties. You&apos;re charged commission only when an order actually sells.
              </p>
            </Card>
          </div>
        </div>
      </header>

      {/* 2. VALUE PROP */}
      <FSection scheme="scheme-light" id="value">
        <SectionHead
          eyebrow="Why sell direct"
          title="What do you actually get out of selling on Croftly?"
          intro="The supermarket sets the price, takes the lion's share, and still sends produce back. Selling direct flips that — fairer pay, orders you can plan around, and none of the delivery headache."
        />
        <div className="cards-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "var(--space-8)" }}>
          <ValueCard tone="fresh" icon={<SellIcon name="coins" size={26} />} title="Keep the lion's share of every sale" body="You set the price and keep at least 85% of it — up to 92% on surplus. No mystery deductions, no haggling you down at the gate." fact="85%+ kept · up to 92% on surplus" />
          <ValueCard tone="sky" icon={<HwIcon name="calendar" size={26} />} title="Get forward orders, so you plant against real demand" body="Households commit ahead of the season. You see what's actually wanted before a seed goes in — fewer guesses, steadier income, less grown for nothing." fact="Plan weeks ahead, not week to week" />
          <ValueCard tone="rescued" icon={<SellIcon name="recycle" size={26} />} title="Clear your gluts instead of wasting them" body="Bumper crop or a wonky batch the wholesaler won't take? List it as a glut deal and shift it fast to households who want it — at a fair price, not the bin." fact="Surplus sold at up to 92% kept" />
          <ValueCard tone="earth" icon={<Icon name="truck" size={26} stroke={1.8} />} title="No delivery to run — we match you a courier" body="Pack the order and hand it off. We match it to a local courier, or you self-deliver if you'd rather. Either way, no vans to buy and no routes to plan." fact="Couriers matched for you, or self-deliver" />
        </div>
      </FSection>

      {/* 3. HOW IT WORKS FOR FARMERS */}
      <FSection scheme="scheme-soft" id="how">
        <SectionHead
          eyebrow="Step by step"
          title="How does selling on Croftly actually work?"
          intro="Four steps, most of it from your phone in the yard. No barcodes, no pallet specs, no buyer to chase."
        />
        <div className="cards-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "var(--space-8)" }}>
          <StepBlock n={1} tone="fresh" icon={<SellIcon name="clipboard" size={26} />} title="List what you've got this week" body="Add your produce, set your own prices and the quantities you can spare. Takes minutes — flag anything you're trying to clear as a glut deal." />
          <StepBlock n={2} tone="sky" icon={<Icon name="sparkles" size={26} stroke={1.8} />} title="Get matched to nearby households" body="We match what you have to households near you who already want it — including forward orders placed before the season, so you're rarely starting cold." />
          <StepBlock n={3} tone="earth" icon={<Icon name="truck" size={26} stroke={1.8} />} title="Hand off to a courier — or self-deliver" body="Pack the order and we match it to a local courier for collection. Prefer to drop it yourself on a round you already do? That's fine too." />
          <StepBlock n={4} tone="rescued" icon={<SellIcon name="coins" size={26} />} title="Get paid" body="Money lands in your account on a clear, predictable schedule. You can see every order, what it earned and what's coming up — no invoices to write." />
        </div>
      </FSection>

      {/* 4. WHAT IT COSTS */}
      <FSection scheme="scheme-light" id="cost">
        <SectionHead
          eyebrow="Pricing"
          title="How much does it cost, and how much do farmers keep?"
          intro="It's free to join and free to list. We only earn when you sell — a single commission, shown on every order. There are no listing fees, subscriptions or hidden deductions."
        />
        <div className="split-grid" style={{ display: "grid", gridTemplateColumns: "0.92fr 1.08fr", gap: "var(--space-16)", alignItems: "start" }}>
          <div>
            <div style={{ display: "grid", gap: "var(--space-5)" }}>
              <Stat value="From 8%" label="commission — and never more than 15%" sub="You keep 85–92% of every order, before card and courier costs." />
            </div>
            <p style={{ margin: "var(--space-8) 0 0", fontFamily: "var(--font-body)", fontSize: "var(--text-large)", lineHeight: "var(--leading-normal)", color: "var(--scheme-text-muted)", maxWidth: "40ch", textWrap: "pretty" }}>
              The rate drops the more you help us cut waste. <strong style={{ color: "var(--scheme-text)", fontWeight: "var(--weight-semibold)" }}>You keep more when you plan ahead and clear surplus</strong> — so the fairest outcome for farmers and the lowest-waste outcome are the same thing.
            </p>
            <div style={{ marginTop: "var(--space-8)", padding: "var(--space-6)", borderRadius: "var(--radius-card)", border: "1px solid var(--color-ink-15)", background: "var(--color-neutral-lightest)", display: "flex", gap: "var(--space-4)", alignItems: "flex-start" }}>
              <span style={{ flexShrink: 0, color: "var(--color-olive-drab)" }}><HwIcon name="wallet" size={22} stroke={2} /></span>
              <p style={{ margin: 0, fontFamily: "var(--font-body)", fontSize: "var(--text-regular)", color: "var(--color-neutral-darker)", lineHeight: "var(--leading-normal)" }}>
                On a £10 order at the standard rate, you keep <strong style={{ color: "var(--color-neutral-darkest)", fontWeight: "var(--weight-semibold)" }}>£8.50</strong>. Croftly takes £1.20; card and courier costs are about £0.30. That&apos;s the whole sum.
              </p>
            </div>
          </div>

          <div style={{ display: "grid", gap: "var(--space-5)" }}>
            <TierRow tone="fresh" highlight name="Standard" commission="15%" keeps="85%" icon={<Icon name="basket" size={22} stroke={2} />} when="Everyday orders — list what you have and sell it this week." />
            <TierRow tone="sky" name="Forward orders" commission="10%" keeps="90%" icon={<HwIcon name="calendar" size={22} stroke={2} />} when="Orders placed ahead of the season, so we both plan against real demand." />
            <TierRow tone="rescued" name="Glut & surplus" commission="8%" keeps="92%" icon={<SellIcon name="recycle" size={22} stroke={2} />} when="Bumper crops and wonky batches you'd otherwise waste — cleared fast." />
            <p style={{ margin: "var(--space-2) 0 0", fontFamily: "var(--font-body)", fontSize: "var(--text-small)", color: "var(--scheme-text-muted)", lineHeight: "var(--leading-normal)" }}>
              Card processing and the courier fee are passed through at cost and shown separately — Croftly doesn&apos;t mark them up.
            </p>
          </div>
        </div>
      </FSection>

      {/* 5. TRUST */}
      <FSection scheme="scheme-dark" id="trust">
        <div className="split-grid" style={{ display: "grid", gridTemplateColumns: "0.85fr 1.15fr", gap: "var(--space-16)", alignItems: "start" }}>
          <div>
            <Eyebrow>No catch</Eyebrow>
            <h2 style={{ margin: 0, fontSize: "var(--text-h2)", color: "var(--scheme-text)", textWrap: "balance" }}>What do I have to give up to sell here?</h2>
            <p style={{ margin: "var(--space-6) 0 0", fontFamily: "var(--font-body)", fontSize: "var(--text-large)", lineHeight: "var(--leading-normal)", color: "var(--scheme-text-muted)", maxWidth: "40ch", textWrap: "pretty" }}>
              Nothing that matters. You keep control of your prices, your name and your customers. Croftly is a way to reach more households — not a buyer that owns you.
            </p>
          </div>
          <div style={{ display: "grid", gap: "var(--space-8)" }}>
            <TrustPoint tone="fresh" icon={<SellIcon name="unlock" size={22} stroke={2} />} h="No lock-in, no exclusivity" b="Sell at the farm gate, at market and through Croftly all at once. List for a week or a decade — leave whenever you like, and take your data with you." />
            <TrustPoint tone="sky" icon={<SellIcon name="tag" size={22} stroke={2} />} h="You set your own prices" b="You decide what your produce is worth — not a buyer, not an algorithm. Change prices whenever you want; we never quietly discount your work." />
            <TrustPoint tone="fresh" icon={<SellIcon name="shield" size={22} stroke={2} />} h="You set a price floor — never undercut below it" b="Alongside your price, set the lowest you'll accept. Even when we surface best-value matches to households, your produce is never sold below that floor. No race to the bottom, no surprise discounts." />
            <TrustPoint tone="earth" icon={<SellIcon name="store" size={22} stroke={2} />} h="You keep your brand and your customers" b="Your farm name, your story and your photos go in front of the household — they know exactly whose food they're eating, and they can follow you back." />
            <TrustPoint tone="rescued" icon={<SellIcon name="users" size={22} stroke={2} />} h="No single-buyer dependency" b="Instead of one supermarket account that can drop you overnight, you sell to many households across your area. If one stops, the rest carry on." />
          </div>
        </div>
      </FSection>

      {/* 6. FARMER TESTIMONIAL */}
      <FSection scheme="scheme-soft" id="voice">
        <figure style={{ margin: 0, maxWidth: "56rem", marginInline: "auto", textAlign: "center", display: "grid", gap: "var(--space-8)", justifyItems: "center" }}>
          <span style={{ color: "var(--color-olive-drab)" }}><Icon name="quote" size={44} stroke={2} /></span>
          <blockquote style={{ margin: 0, fontFamily: "var(--font-heading)", fontWeight: "var(--weight-medium)", fontSize: "var(--text-h3)", lineHeight: "var(--leading-snug)", letterSpacing: "var(--tracking-tight)", color: "var(--scheme-text)", textWrap: "balance" }}>
            “For years I sold to one wholesaler who set the price and sent half of it back. Now households order my veg before I&apos;ve picked it, I keep most of what they pay, and I&apos;ve not driven a delivery round in months. It&apos;s the first spring I&apos;ve known what I&apos;d earn by autumn.”
          </blockquote>
          <figcaption style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
            <Avatar initials="SW" size={52} ring />
            <div style={{ textAlign: "left" }}>
              <div style={{ fontFamily: "var(--font-heading)", fontWeight: "var(--weight-medium)", fontSize: "var(--text-regular)", color: "var(--scheme-text)" }}>Sarah Whitlock</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-small)", color: "var(--scheme-text-muted)" }}>Brook End Farm · near Ludlow, Shropshire</div>
            </div>
          </figcaption>
        </figure>
      </FSection>

      {/* 7. FAQ */}
      <FSection scheme="scheme-light" id="faq">
        <div className="split-grid" style={{ display: "grid", gridTemplateColumns: "0.8fr 1.2fr", gap: "var(--space-16)", alignItems: "start" }}>
          <div>
            <Eyebrow>Questions farmers ask</Eyebrow>
            <h2 style={{ margin: "var(--space-3) 0 0", fontSize: "var(--text-h2)", color: "var(--scheme-text)", textWrap: "balance" }}>What do farmers want to know before joining?</h2>
            <p style={{ margin: "var(--space-6) 0 0", fontFamily: "var(--font-body)", fontSize: "var(--text-large)", lineHeight: "var(--leading-normal)", color: "var(--scheme-text-muted)", maxWidth: "38ch", textWrap: "pretty" }}>
              Straight answers, no small print. If yours isn&apos;t here, a grower from the Croftly team will talk it through with you.
            </p>
          </div>
          <Accordion
            defaultOpen={[0]}
            items={[
              { q: "How much do farmers keep?", a: "You keep at least 85% of every order, and up to 92% on glut and surplus. Croftly's commission is 15% on standard orders, 10% on forward orders placed ahead of the season, and 8% on glut and surplus. You set the price, so you always know the figure before you list." },
              { q: "How do I get paid?", a: "Money lands in your bank account on a clear, predictable schedule after each order is delivered — no invoices to write and no buyer to chase. You can see every order, what it earned and what's coming up, in one place." },
              { q: "Do I need to deliver myself?", a: "No. You pack the order and we match it to a local courier for collection. If you'd rather drop it yourself — say it's on a round you already do — you can choose to self-deliver instead. Either way there are no vans to buy and no routes to plan." },
              { q: "What is the price floor?", a: "Alongside your price, you set the lowest price you'll accept for each item. Even when Croftly surfaces best-value matches to households, your produce is never sold below that floor. It's there so there's no race to the bottom and no surprise discounting of your work." },
              { q: "Can I leave anytime?", a: "Yes. There's no lock-in and no exclusivity — sell at the farm gate, at market and through Croftly all at once, and leave whenever you like. Your farm, your prices, your customers and your data stay yours." },
            ]}
          />
        </div>
      </FSection>

      {/* 8. CTA + JOIN FORM */}
      <FSection scheme="scheme-soft" id="join">
        <div className="split-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-16)", alignItems: "center" }}>
          <div>
            <Eyebrow>Start selling</Eyebrow>
            <h2 style={{ margin: 0, fontSize: "var(--text-h2)", color: "var(--scheme-text)", textWrap: "balance" }}>Ready to sell direct?</h2>
            <p style={{ margin: "var(--space-6) 0 0", fontFamily: "var(--font-body)", fontSize: "var(--text-large)", lineHeight: "var(--leading-normal)", color: "var(--scheme-text-muted)", maxWidth: "44ch", textWrap: "pretty" }}>
              Tell us a little about your farm and what you grow. A grower from the Croftly team — someone who knows the work — will help you set up your first listing.
            </p>
            <ul style={{ listStyle: "none", margin: "var(--space-8) 0 0", padding: 0, display: "grid", gap: "var(--space-4)" }}>
              {[
                "Free to join — you're only charged commission when you sell",
                "You set your prices and keep 85–92% of every order",
                "No delivery to run, no lock-in, no single buyer to depend on",
              ].map((t, i) => (
                <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem", fontFamily: "var(--font-body)", fontSize: "var(--text-regular)", color: "var(--color-neutral-darker)", lineHeight: "var(--leading-snug)" }}>
                  <span style={{ flexShrink: 0, color: "var(--color-olive-drab)", marginTop: "1px" }}><Icon name="check" size={18} stroke={2.4} /></span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <JoinForm />
        </div>
      </FSection>

      <SiteFooter />
    </>
  );
}
