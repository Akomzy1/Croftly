import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Icon } from "@/components/croftly/icon";
import { Button } from "@/components/croftly/button";
import { Card } from "@/components/croftly/card";
import { Nav } from "@/components/site/nav";
import { SiteFooter } from "@/components/site/footer";
import { FSection, Eyebrow, SectionHead } from "@/components/site/section";
import { FarmTile, QuietLink } from "@/components/site/home-parts";
import { LIcon, Breadcrumb, SeasonNow, PointRow, DeliveryPanel, LocalFaq, HeaderStat } from "@/components/site/area-parts";

// Reproduced faithfully from /design-reference/Croftly Area - Oxfordshire (standalone).html.
// Data-driven area landing page (Oxfordshire is the worked example). SSR/crawlable
// for the local-SEO long tail. Add more areas by extending AREAS.
// DEVIATION: farm photos are placeholders.

const OXFORDSHIRE = {
  slug: "oxfordshire",
  name: "Oxfordshire",
  region: "Thames Valley & Chilterns",
  monthIndex: 5,
  stats: [
    { value: "12", label: "local farms" },
    { value: "8", label: "collection points" },
    { value: "OX1–OX18", label: "postcodes" },
  ],
  intro: [
    "Oxfordshire is unusually good farming country, and it's all close to home. Along the Thames and Windrush, gravel-terrace market gardens grow salad, asparagus and summer veg on free-draining soil. Up on the Chiltern chalk above Henley, old orchards still carry heritage apples, plums and cobnuts. The Cherwell valley north of Oxford is hen and dairy country. None of it is more than a short courier hop from the city.",
    "That closeness is the whole point. Instead of produce going to a packhouse and back, an Oxfordshire box is picked on a farm near you and reaches your door — or a collection point round the corner — within a day or two. You get food at its best, the farmer keeps 85% or more, and the miles stay small.",
  ],
  introFacts: [
    "Most farms are within 15 miles of central Oxford",
    "Couriers run out of Oxford and Witney — short, low-mileage trips",
    "Free collection points in Oxford, Abingdon, Witney, Banbury & Henley",
  ],
  season: {
    ready: ["New potatoes", "Broad beans", "Peas", "Courgettes", "Salad leaves", "Spring onions", "Strawberries", "Gooseberries", "Beetroot", "Free-range eggs", "Raw honey"],
    coming: ["Tomatoes", "Sweetcorn", "Runner beans", "Cobnuts", "Plums", "Early apples"],
  },
  farms: [
    { id: "ox-farm-1", name: "Sandy Lane Market Garden", location: "Eynsham", tags: ["No-dig", "Organic"], blurb: "A no-dig market garden on the Thames gravel terraces west of Oxford, growing 50+ veg and salad crops cut to order each week." },
    { id: "ox-farm-2", name: "Cherwell Valley Eggs", location: "Lower Heyford", tags: ["Free-range", "Pasture-fed"], blurb: "Free-range hens roaming pasture along the Cherwell, with eggs collected and packed the same morning they're laid." },
    { id: "ox-farm-3", name: "Otmoor Salads", location: "Charlton-on-Otmoor", tags: ["Hand-cut", "Low-spray"], blurb: "Leaves, herbs and edible flowers grown on the edge of the RSPB Otmoor reserve, hand-cut the day they're delivered." },
    { id: "ox-farm-4", name: "Windrush Dairy", location: "Witney", tags: ["Grass-fed", "Family-run"], blurb: "A grass-fed Jersey herd by the river Windrush — raw milk, yoghurt and soft cheese, on your door within a day of bottling." },
    { id: "ox-farm-5", name: "Chiltern Edge Orchard", location: "Henley-on-Thames", tags: ["Heritage", "Orchard"], blurb: "Heritage apples, plums and cobnuts from old chalk-slope orchards above the Thames, plus pressed juice from the windfalls." },
    { id: "ox-farm-6", name: "Bablock Veg", location: "Northmoor", tags: ["Seasonal", "Riverside"], blurb: "Riverside floodplain veg — asparagus in spring, then sweetcorn, courgettes and squash right through summer and autumn." },
  ],
  points: [
    { name: "The Covered Market", place: "Central Oxford", hours: "Tue–Sat · 9am–5pm", kind: "Indoor stall" },
    { name: "Gloucester Green Market", place: "Oxford", hours: "Wed · 9am–3.30pm", kind: "Market stall" },
    { name: "North Parade", place: "Summertown, Oxford", hours: "Thu–Fri · 8am–6pm", kind: "Shopfront" },
    { name: "Cowley Road pickup", place: "East Oxford", hours: "Wed & Sat · 10am–7pm", kind: "Café partner" },
    { name: "Abingdon Market Place", place: "Abingdon", hours: "Fri · 8.30am–4pm", kind: "Market stall" },
    { name: "Witney Buttercross", place: "Witney", hours: "Thu · 9am–5pm", kind: "Town centre" },
    { name: "Banbury Market", place: "Banbury", hours: "Thu · 8am–2pm", kind: "Market stall" },
    { name: "Henley Town Hall", place: "Henley-on-Thames", hours: "Fri · 9am–4pm", kind: "Pickup point" },
  ],
  delivery: {
    postcodes: "All OX1–OX18, plus neighbouring villages and OX25–OX29",
    days: "Wednesday, Thursday or Friday — you pick the day",
    base: "Oxford & Witney depots",
    fee: "From £2.90",
  },
  faqs: [
    { q: "Which Oxfordshire towns can I get Croftly delivery in?", a: "We deliver across Oxford and the surrounding towns — including Abingdon, Witney, Bicester, Banbury, Kidlington, Henley-on-Thames, Wallingford, Thame, Wantage, Didcot and Chipping Norton — plus the villages in between. If you're on an OX postcode, you're almost certainly covered; pop it in at the top of the page to check." },
    { q: "Where can I collect a box for free in Oxford?", a: "Free pick-up points in the city include the Covered Market, Gloucester Green, North Parade in Summertown and a café partner on the Cowley Road. There are also collection points in Abingdon, Witney, Banbury and Henley. Windows are generous — usually several hours, not a fixed slot — so you can grab your box around work or the school run." },
    { q: "What fruit and veg is grown near Oxford right now?", a: "In late June the Thames-valley market gardens are picking new potatoes, broad beans, peas, courgettes, salad leaves and spring onions, with the first strawberries and gooseberries in. Local hens are laying well and the Chiltern bees are producing. Tomatoes, sweetcorn and runner beans follow through July and August." },
    { q: "Are there organic or low-spray farms near me in Oxfordshire?", a: "Yes. Sandy Lane Market Garden near Eynsham is a certified-organic no-dig grower, and Otmoor Salads works low-spray beside the RSPB reserve. You can filter your box to only include certified-organic or low-spray farms, and every farm's growing method is shown on its profile." },
    { q: "How quickly does a box reach an OX postcode?", a: "Everything is picked just 1–3 days before it reaches you, and our couriers are based in Oxford and Witney — so it's a short, low-mileage trip, not a cross-country haul. You choose your delivery day (Wed, Thu or Fri) and we tell you the window the evening before." },
    { q: "Is there a minimum order or a subscription I'm locked into?", a: "No lock-in. Order a one-off box or set up a recurring one, and pause, skip or cancel any week with no fee. Free collection has no charge at all; doorstep delivery is an honest flat fee from £2.90 that goes to the local courier, not to Croftly." },
  ],
};

const AREAS = { oxfordshire: OXFORDSHIRE };
const Arrow = <Icon name="arrowRight" size={18} />;

export function generateStaticParams() {
  return Object.keys(AREAS).map((area) => ({ area }));
}

export async function generateMetadata({ params }: { params: Promise<{ area: string }> }): Promise<Metadata> {
  const { area } = await params;
  const a = AREAS[area as keyof typeof AREAS];
  if (!a) return { title: "Croftly — Area" };
  return {
    title: `Farm-to-door delivery in ${a.name} | Croftly local farms & boxes`,
    description: `Fresh food from ${a.name} farms — picked days ago, delivered to your door or a nearby collection point. Local growers, a fair deal for them, never a warehouse.`,
  };
}

export default async function AreaPage({ params }: { params: Promise<{ area: string }> }) {
  const { area } = await params;
  const AREA = AREAS[area as keyof typeof AREAS];
  if (!AREA) notFound();

  return (
    <>
      {/* 1. HEADER */}
      <header className="scheme-dark" style={{ paddingBlock: "var(--space-12)", paddingInline: "var(--section-pad-x)" }}>
        <div className="croftly-container">
          <Nav />
          <div style={{ maxWidth: "64rem" }}>
            <Breadcrumb trail={[{ label: "Croftly", href: "/" }, { label: "Areas we serve", href: "/areas" }, { label: AREA.name }]} />
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.4rem 0.8rem", borderRadius: "var(--radius-pill)", border: "1px solid var(--scheme-border)", fontFamily: "var(--font-body)", fontSize: "var(--text-small)", color: "var(--scheme-text-muted)", marginBottom: "var(--space-6)" }}>
              <Icon name="mapPin" size={16} stroke={2} /> {AREA.region} · delivering now
            </span>
            <h1 style={{ margin: 0, fontSize: "var(--text-h1)", color: "var(--scheme-text)", lineHeight: "var(--leading-tight)", letterSpacing: "var(--tracking-tight)", maxWidth: "18ch", textWrap: "balance" }}>
              Farm-to-door delivery in {AREA.name}
            </h1>
            <p style={{ margin: "var(--space-8) 0 0", fontFamily: "var(--font-body)", fontSize: "var(--text-large)", lineHeight: "var(--leading-normal)", color: "var(--scheme-text-muted)", maxWidth: "54ch", textWrap: "pretty" }}>
              Fresh food from {AREA.name} farms, picked days ago and brought to your door — or a collection point nearby. Real local growers, a fair deal for them, and never a warehouse in between.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-4)", marginTop: "var(--space-10)" }}>
              <Button href="/get-started?role=household" size="lg" iconRight={Arrow}>Start an {AREA.name} box</Button>
              <Button href="#farms" size="lg" variant="secondary" onDark>See local farms</Button>
            </div>
            <div style={{ marginTop: "var(--space-10)", paddingTop: "var(--space-8)", borderTop: "1px solid var(--scheme-border)", display: "flex", flexWrap: "wrap", gap: "var(--space-5) var(--space-12)" }}>
              {AREA.stats.map((s) => <HeaderStat key={s.label} value={s.value} label={s.label} />)}
            </div>
          </div>
        </div>
      </header>

      {/* 2. LOCAL INTRO + SEASON */}
      <FSection scheme="scheme-light" id="about">
        <div className="split-grid" style={{ display: "grid", gridTemplateColumns: "1fr 0.92fr", gap: "var(--space-16)", alignItems: "start" }}>
          <div>
            <Eyebrow>Local food, {AREA.name}</Eyebrow>
            <h2 style={{ margin: 0, fontSize: "var(--text-h2)", color: "var(--scheme-text)", textWrap: "balance" }}>What grows around {AREA.name}, and how it reaches you</h2>
            {AREA.intro.map((p, i) => (
              <p key={i} style={{ margin: "var(--space-6) 0 0", fontFamily: "var(--font-body)", fontSize: "var(--text-large)", lineHeight: "var(--leading-normal)", color: "var(--scheme-text-muted)", maxWidth: "54ch", textWrap: "pretty" }}>{p}</p>
            ))}
            <div style={{ display: "grid", gap: "var(--space-4)", marginTop: "var(--space-8)" }}>
              {AREA.introFacts.map((t) => (
                <div key={t} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                  <span style={{ flexShrink: 0, width: "1.5rem", height: "1.5rem", borderRadius: "999px", background: "var(--color-olive-drab-lightest)", color: "var(--color-olive-drab-dark)", display: "inline-flex", alignItems: "center", justifyContent: "center", marginTop: "1px" }}>
                    <Icon name="check" size={14} stroke={2.4} />
                  </span>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-regular)", color: "var(--scheme-text)", lineHeight: "var(--leading-normal)" }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
          <SeasonNow monthIndex={AREA.monthIndex} ready={AREA.season.ready} coming={AREA.season.coming} />
        </div>
      </FSection>

      {/* 3. LOCAL FARMS */}
      <FSection scheme="scheme-soft" id="farms">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "var(--space-8)", flexWrap: "wrap", marginBottom: "var(--space-12)" }}>
          <SectionHead eyebrow="The growers" title={`Which farms are near you in ${AREA.name}?`} intro={`A few of the family farms and market gardens around ${AREA.name} selling direct on Croftly. Your box is built from whoever has the best of it this week.`} max="46rem" />
          <div style={{ marginBottom: "var(--space-2)" }}><QuietLink href="#">Browse all {AREA.name} farms</QuietLink></div>
        </div>
        <div className="cards-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-8)" }}>
          {AREA.farms.map((f) => (
            <FarmTile key={f.id} name={f.name} location={f.location} blurb={f.blurb} tags={f.tags} placeholder={`Drop a photo of ${f.name}`} />
          ))}
        </div>
      </FSection>

      {/* 4. COLLECTION + DELIVERY */}
      <FSection scheme="scheme-light" id="collection">
        <SectionHead eyebrow="Getting it to you" title={`Collection points and delivery in ${AREA.name}`} intro="Collect free from a spot near you, or have it brought to your door for an honest courier fee. You choose each week." max="48rem" />
        <div className="split-grid" style={{ display: "grid", gridTemplateColumns: "1.25fr 0.75fr", gap: "var(--space-12)", alignItems: "start" }}>
          <Card padding="lg">
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)", marginBottom: "var(--space-2)" }}>
              <span style={{ width: "3.25rem", height: "3.25rem", borderRadius: "var(--radius-card)", background: "var(--color-danube-lighter)", color: "var(--color-danube-dark)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="store" size={26} stroke={1.8} />
              </span>
              <div>
                <h3 style={{ margin: 0, fontFamily: "var(--font-heading)", fontWeight: "var(--weight-medium)", fontSize: "var(--text-h5)", color: "var(--color-neutral-darkest)" }}>Free collection points</h3>
                <p style={{ margin: "0.15rem 0 0", fontFamily: "var(--font-body)", fontSize: "var(--text-small)", color: "var(--color-neutral)" }}>{AREA.points.length} spots across {AREA.name} · no fee, ever</p>
              </div>
            </div>
            <div style={{ marginTop: "var(--space-4)" }}>
              {AREA.points.map((p) => <PointRow key={p.name} {...p} />)}
            </div>
          </Card>
          <DeliveryPanel {...AREA.delivery} />
        </div>
      </FSection>

      {/* 5. LOCAL FAQ */}
      <FSection scheme="scheme-soft" id="faq">
        <div className="split-grid" style={{ display: "grid", gridTemplateColumns: "0.85fr 1.15fr", gap: "var(--space-16)", alignItems: "start" }}>
          <div>
            <Eyebrow>Local questions</Eyebrow>
            <h2 style={{ margin: 0, fontSize: "var(--text-h2)", color: "var(--scheme-text)", textWrap: "balance" }}>Common questions about Croftly in {AREA.name}</h2>
            <p style={{ margin: "var(--space-6) 0 0", fontFamily: "var(--font-body)", fontSize: "var(--text-large)", lineHeight: "var(--leading-normal)", color: "var(--scheme-text-muted)", maxWidth: "40ch", textWrap: "pretty" }}>
              Everything households around {AREA.name} ask before their first box. Still unsure? Add your postcode and we&apos;ll confirm exactly what&apos;s available on your street.
            </p>
            <div style={{ marginTop: "var(--space-8)" }}>
              <Button href="/areas" variant="secondary" iconRight={Arrow}>Check my postcode</Button>
            </div>
          </div>
          <LocalFaq items={AREA.faqs} />
        </div>
      </FSection>

      {/* 6. CTA */}
      <FSection scheme="scheme-dark" id="start">
        <div style={{ maxWidth: "46rem" }}>
          <Eyebrow style={{ color: "var(--scheme-accent)" }}>Ready when you are</Eyebrow>
          <h2 style={{ margin: 0, fontSize: "var(--text-h2)", color: "var(--scheme-text)", textWrap: "balance" }}>Start your first {AREA.name} box</h2>
          <p style={{ margin: "var(--space-6) 0 0", fontFamily: "var(--font-body)", fontSize: "var(--text-large)", lineHeight: "var(--leading-normal)", color: "var(--scheme-text-muted)", maxWidth: "48ch", textWrap: "pretty" }}>
            Tell us how you eat and we&apos;ll build a box from {AREA.name} farms picking this week. Approve it if you like it — collect free or get it delivered, with nothing to commit to.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-4)", marginTop: "var(--space-10)" }}>
            <Button href="/get-started?role=household" size="lg" iconRight={Arrow}>Start an {AREA.name} box</Button>
            <Button href="/shop/setup" size="lg" variant="secondary" onDark>See example boxes</Button>
          </div>
          <p style={{ margin: "var(--space-8) 0 0", display: "inline-flex", alignItems: "center", gap: "0.5rem", fontFamily: "var(--font-body)", fontSize: "var(--text-small)", color: "var(--scheme-text-muted)" }}>
            <LIcon name="info" size={16} stroke={2} /> No subscription lock-in · pause, skip or cancel anytime
          </p>
        </div>
      </FSection>

      <SiteFooter />
    </>
  );
}
