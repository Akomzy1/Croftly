"use client";

import * as React from "react";
import Link from "next/link";
import { Icon } from "@/components/croftly/icon";
import { Card } from "@/components/croftly/card";
import { Button } from "@/components/croftly/button";
import { Input } from "@/components/croftly/ds-form";
import { Nav } from "@/components/site/nav";
import { FSection, SectionHead } from "@/components/site/section";

// "Areas we serve" interactive surfaces — reproduced from the prototype areas
// helpers + page. The map ↔ directory cross-highlight shares one activeId.
// This is a client island, but Next still SSR-prerenders it, so all region text
// (counties, towns — the local-SEO long tail) is crawlable.

type Status = "live" | "soon" | "wait";
type Region = {
  id: string;
  name: string;
  short: string;
  status: Status;
  counties: string[];
  farms?: number;
  points?: number;
  towns?: number;
  pin: { top: string; left: string };
  note?: string;
  areas: { name: string; href: string }[];
};

export const REGIONS: Region[] = [
  { id: "thames", name: "Thames Valley & Chilterns", short: "Thames Valley", status: "live", counties: ["Oxfordshire", "Berkshire", "Buckinghamshire"], farms: 22, points: 14, towns: 19, pin: { top: "62%", left: "55%" }, areas: [{ name: "Oxfordshire", href: "/areas/oxfordshire" }, { name: "Reading", href: "#" }, { name: "Aylesbury", href: "#" }] },
  { id: "cotswolds", name: "Cotswolds & Severn", short: "Cotswolds", status: "live", counties: ["Gloucestershire", "Worcestershire", "Herefordshire"], farms: 18, points: 11, towns: 16, pin: { top: "55%", left: "44%" }, areas: [{ name: "Cheltenham", href: "#" }, { name: "Hereford", href: "#" }, { name: "Stroud", href: "#" }] },
  { id: "southwest", name: "South West", short: "South West", status: "live", counties: ["Devon", "Somerset", "Dorset", "Cornwall"], farms: 26, points: 17, towns: 23, pin: { top: "82%", left: "34%" }, areas: [{ name: "Exeter", href: "#" }, { name: "Bristol", href: "#" }, { name: "Taunton", href: "#" }] },
  { id: "southeast", name: "South East", short: "South East", status: "live", counties: ["Hampshire", "Surrey", "Sussex", "Kent"], farms: 21, points: 13, towns: 18, pin: { top: "76%", left: "66%" }, areas: [{ name: "Winchester", href: "#" }, { name: "Guildford", href: "#" }, { name: "Canterbury", href: "#" }] },
  { id: "midlands", name: "Warwickshire & the shires", short: "Midlands shires", status: "live", counties: ["Warwickshire", "Northamptonshire", "Shropshire"], farms: 15, points: 9, towns: 14, pin: { top: "48%", left: "52%" }, areas: [{ name: "Warwick", href: "#" }, { name: "Shrewsbury", href: "#" }, { name: "Rugby", href: "#" }] },
  { id: "east", name: "East of England", short: "East of England", status: "live", counties: ["Cambridgeshire", "Suffolk", "Norfolk"], farms: 17, points: 10, towns: 15, pin: { top: "52%", left: "70%" }, areas: [{ name: "Cambridge", href: "#" }, { name: "Norwich", href: "#" }, { name: "Bury St Edmunds", href: "#" }] },
  { id: "northwest", name: "North West", short: "North West", status: "soon", counties: ["Cheshire", "Lancashire"], pin: { top: "34%", left: "45%" }, note: "Farms and couriers are signing up now around Chester, Preston and the Ribble Valley. We expect to open boxes here within a couple of months.", areas: [] },
  { id: "yorkshire", name: "Yorkshire & Humber", short: "Yorkshire", status: "soon", counties: ["West Yorkshire", "North Yorkshire"], pin: { top: "30%", left: "55%" }, note: "Strong demand around Leeds, York and Harrogate has moved Yorkshire up the list. We're matching the first market gardens and dairies to couriers now.", areas: [] },
  { id: "scotland", name: "Scotland — Central Belt", short: "Central Belt", status: "wait", counties: ["Edinburgh", "Glasgow", "Stirling"], pin: { top: "13%", left: "44%" }, note: "Not yet — but the waitlist is growing fast across Edinburgh and Glasgow. Add your postcode and you'll help decide whether Scotland is where we open next.", areas: [] },
];

const STATUS: Record<Status, { label: string; dot: string; bg: string; fg: string }> = {
  live: { label: "Delivering now", dot: "var(--color-olive-drab)", bg: "var(--color-olive-drab-lightest)", fg: "var(--color-olive-drab-dark)" },
  soon: { label: "Coming soon", dot: "var(--color-tulip-tree)", bg: "var(--color-tulip-tree-lighter)", fg: "var(--color-tulip-tree-dark)" },
  wait: { label: "Building a waitlist", dot: "var(--color-danube)", bg: "var(--color-danube-lighter)", fg: "var(--color-danube-dark)" },
};

function CoverageMap({ activeId, onHover }: { activeId: string | null; onHover: (id: string | null) => void }) {
  return (
    <div style={{ position: "relative", borderRadius: "var(--radius-card)", border: "1px solid var(--scheme-border)", background: "var(--color-olive-drab-darkest)", overflow: "hidden", aspectRatio: "4 / 5" }}>
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(var(--color-white-20) 1px, transparent 1.4px)", backgroundSize: "22px 22px", opacity: 0.5 }} />
      <svg aria-hidden="true" viewBox="0 0 100 125" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <path d="M52 8 C58 12 56 20 60 24 C66 30 60 38 64 44 C70 52 62 60 66 70 C70 82 58 86 56 96 C54 106 44 110 40 104 C36 98 44 92 38 86 C30 78 38 70 32 62 C26 54 34 46 30 38 C26 30 36 26 38 18 C40 12 46 6 52 8 Z" fill="var(--color-white)" opacity="0.07" stroke="var(--color-olive-drab-light)" strokeOpacity="0.45" strokeWidth="0.5" />
      </svg>
      {REGIONS.map((r) => {
        const s = STATUS[r.status];
        const active = activeId === r.id;
        return (
          <button key={r.id} type="button" onMouseEnter={() => onHover(r.id)} onMouseLeave={() => onHover(null)} aria-label={`${r.name} — ${s.label}`} style={{ position: "absolute", top: r.pin.top, left: r.pin.left, transform: "translate(-50%, -50%)", background: "none", border: "none", padding: 0, cursor: "pointer", zIndex: active ? 5 : 2 }}>
            <span style={{ display: "block", width: active ? "1.05rem" : "0.8rem", height: active ? "1.05rem" : "0.8rem", borderRadius: "999px", background: s.dot, border: "2px solid var(--color-white)", boxShadow: active ? "0 0 0 6px var(--color-white-20), 0 1px 4px rgba(0,0,0,.4)" : "0 1px 4px rgba(0,0,0,.4)", transition: "all var(--dur-base) var(--ease-standard)" }} />
            {active && (
              <span style={{ position: "absolute", top: "-2.1rem", left: "50%", transform: "translateX(-50%)", whiteSpace: "nowrap", background: "var(--color-white)", color: "var(--color-neutral-darkest)", fontFamily: "var(--font-body)", fontWeight: "var(--weight-semibold)", fontSize: "var(--text-small)", padding: "0.3rem 0.6rem", borderRadius: "var(--radius-tag)", boxShadow: "var(--shadow-md)" }}>{r.short}</span>
            )}
          </button>
        );
      })}
      <div style={{ position: "absolute", left: "var(--space-5)", bottom: "var(--space-5)", right: "var(--space-5)", display: "flex", flexWrap: "wrap", gap: "0.5rem 1rem", padding: "0.75rem 1rem", borderRadius: "var(--radius-card)", background: "rgba(7,5,3,.45)", backdropFilter: "blur(6px)", border: "1px solid var(--color-white-20)" }}>
        {(Object.entries(STATUS) as [Status, (typeof STATUS)[Status]][]).map(([k, s]) => (
          <span key={k} style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", fontFamily: "var(--font-body)", fontSize: "var(--text-small)", color: "var(--scheme-text-muted)" }}>
            <span style={{ width: "0.6rem", height: "0.6rem", borderRadius: "999px", background: s.dot, flexShrink: 0 }} />
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function RegionCard({ region, active, onHover }: { region: Region; active: boolean; onHover: (id: string | null) => void }) {
  const s = STATUS[region.status];
  const live = region.status === "live";
  const inner = (
    <Card padding="lg" style={{ height: "100%", display: "flex", flexDirection: "column", gap: "var(--space-5)", outline: active ? "2px solid var(--color-olive-drab)" : "2px solid transparent", outlineOffset: "-1px", transition: "outline-color var(--dur-base) var(--ease-standard)" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "var(--space-4)" }}>
        <h3 style={{ margin: 0, fontFamily: "var(--font-heading)", fontWeight: "var(--weight-medium)", fontSize: "var(--text-h5)", color: "var(--color-neutral-darkest)", textWrap: "balance" }}>{region.name}</h3>
        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", flexShrink: 0, padding: "0.3rem 0.6rem", borderRadius: "var(--radius-pill)", background: s.bg, color: s.fg, fontFamily: "var(--font-body)", fontWeight: "var(--weight-semibold)", fontSize: "var(--text-small)" }}>
          <span style={{ width: "0.5rem", height: "0.5rem", borderRadius: "999px", background: s.dot }} />
          {s.label}
        </span>
      </div>
      <p style={{ margin: 0, display: "flex", alignItems: "flex-start", gap: "0.4rem", fontFamily: "var(--font-body)", fontSize: "var(--text-regular)", color: "var(--color-neutral-dark)", lineHeight: "var(--leading-normal)" }}>
        <span style={{ flexShrink: 0, color: "var(--color-neutral)", marginTop: "2px" }}><Icon name="mapPin" size={16} stroke={2} /></span>
        {region.counties.join(" · ")}
      </p>
      {live ? (
        <div style={{ display: "flex", gap: "var(--space-6)", paddingTop: "var(--space-2)", flexWrap: "wrap" }}>
          {([["farms", "local farms"], ["points", "collection points"], ["towns", "towns covered"]] as const).map(([k, lbl]) => (
            <div key={k}>
              <div style={{ fontFamily: "var(--font-heading)", fontWeight: "var(--weight-semibold)", fontSize: "var(--text-h6)", color: "var(--color-neutral-darkest)" }}>{region[k]}</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-small)", color: "var(--color-neutral)" }}>{lbl}</div>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ margin: 0, fontFamily: "var(--font-body)", fontSize: "var(--text-regular)", color: "var(--color-neutral-dark)", lineHeight: "var(--leading-normal)", flex: 1 }}>{region.note}</p>
      )}
      <div style={{ marginTop: "auto", paddingTop: "var(--space-5)", borderTop: "1px solid var(--color-ink-15)" }}>
        {live ? (
          <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "0.4rem 0.6rem", fontFamily: "var(--font-body)", fontSize: "var(--text-regular)" }}>
            <span style={{ color: "var(--color-neutral)" }}>Areas:</span>
            {region.areas.map((a, i) => (
              <span key={a.name} style={{ display: "inline-flex", alignItems: "center" }}>
                <span style={{ color: a.href !== "#" ? "var(--color-olive-drab-dark)" : "var(--color-neutral-darker)", fontWeight: a.href !== "#" ? "var(--weight-medium)" : "var(--weight-regular)" }}>{a.name}</span>
                {i < region.areas.length - 1 && <span style={{ color: "var(--color-neutral-light)", marginLeft: "0.6rem" }}>·</span>}
              </span>
            ))}
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", color: "var(--color-olive-drab-dark)", fontWeight: "var(--weight-medium)", marginLeft: "0.2rem" }}>
              View region <Icon name="arrowRight" size={16} stroke={2} />
            </span>
          </div>
        ) : (
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", fontFamily: "var(--font-body)", fontSize: "var(--text-regular)", color: "var(--color-neutral)" }}>
            <Icon name="mail" size={16} stroke={2} /> Add your postcode below to be told first
          </span>
        )}
      </div>
    </Card>
  );

  const hoverProps = { onMouseEnter: () => onHover(region.id), onMouseLeave: () => onHover(null) };
  return live ? (
    <Link href={region.areas[0]?.href ?? "#"} style={{ textDecoration: "none", display: "block" }} {...hoverProps}>
      {inner}
    </Link>
  ) : (
    <div style={{ display: "block" }} {...hoverProps}>
      {inner}
    </div>
  );
}

function RegionGroup({ title, intro, regions, activeId, setActiveId }: { title: string; intro: string; regions: Region[]; activeId: string | null; setActiveId: (id: string | null) => void }) {
  if (!regions.length) return null;
  return (
    <div style={{ marginBottom: "var(--space-16)" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: "var(--space-4)", marginBottom: "var(--space-8)", flexWrap: "wrap" }}>
        <h3 style={{ margin: 0, fontFamily: "var(--font-heading)", fontWeight: "var(--weight-medium)", fontSize: "var(--text-h4)", color: "var(--scheme-text)" }}>{title}</h3>
        <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-regular)", color: "var(--scheme-text-muted)" }}>{intro}</span>
      </div>
      <div className="cards-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-8)" }}>
        {regions.map((r) => (
          <RegionCard key={r.id} region={r} active={activeId === r.id} onHover={setActiveId} />
        ))}
      </div>
    </div>
  );
}

export function DemandCapture() {
  const [done, setDone] = React.useState(false);
  const [postcode, setPostcode] = React.useState("");
  return (
    <Card padding="lg" style={{ background: "var(--color-white)", maxWidth: "44rem", marginInline: "auto" }}>
      {!done ? (
        <form onSubmit={(e) => { e.preventDefault(); setDone(true); }} style={{ display: "grid", gap: "var(--space-6)" }}>
          <div className="capture-fields" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-8)" }}>
            <label style={{ display: "grid", gap: "0.4rem" }}>
              <span style={{ fontFamily: "var(--font-body)", fontWeight: "var(--weight-semibold)", fontSize: "var(--text-small)", color: "var(--color-neutral-darker)" }}>Your postcode</span>
              <Input placeholder="e.g. OX1 3HG" value={postcode} onChange={(e) => setPostcode(e.target.value)} icon={<Icon name="mapPin" size={18} stroke={2} />} required />
            </label>
            <label style={{ display: "grid", gap: "0.4rem" }}>
              <span style={{ fontFamily: "var(--font-body)", fontWeight: "var(--weight-semibold)", fontSize: "var(--text-small)", color: "var(--color-neutral-darker)" }}>Your email</span>
              <Input type="email" placeholder="you@example.com" icon={<Icon name="mail" size={18} stroke={2} />} required />
            </label>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-6)", flexWrap: "wrap" }}>
            <Button type="submit" iconRight={<Icon name="send" size={18} stroke={2} />}>Tell me when you reach me</Button>
            <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-small)", color: "var(--color-neutral)", maxWidth: "30ch" }}>We only use your postcode to decide where to open next. No spam, unsubscribe anytime.</span>
          </div>
        </form>
      ) : (
        <div style={{ display: "grid", gap: "var(--space-4)", textAlign: "center", paddingBlock: "var(--space-4)" }}>
          <span style={{ justifySelf: "center", width: "3.25rem", height: "3.25rem", borderRadius: "999px", background: "var(--color-olive-drab-lightest)", color: "var(--color-olive-drab-dark)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="check" size={26} stroke={2.4} />
          </span>
          <h3 style={{ margin: 0, fontFamily: "var(--font-heading)", fontWeight: "var(--weight-medium)", fontSize: "var(--text-h5)", color: "var(--color-neutral-darkest)" }}>You&apos;re on the list{postcode ? ` for ${postcode.toUpperCase()}` : ""}</h3>
          <p style={{ margin: "0 auto", maxWidth: "42ch", fontFamily: "var(--font-body)", fontSize: "var(--text-regular)", color: "var(--color-neutral-dark)", lineHeight: "var(--leading-normal)" }}>
            Thanks — every postcode helps us decide where to bring on farms and couriers next. The more requests from your area, the sooner we get there. We&apos;ll email the moment a farm near you goes live.
          </p>
        </div>
      )}
    </Card>
  );
}

// Header (hero + postcode form + map) and the region directory, sharing activeId.
export function AreasInteractive() {
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const live = REGIONS.filter((r) => r.status === "live");
  const farms = live.reduce((n, r) => n + (r.farms ?? 0), 0);
  const points = live.reduce((n, r) => n + (r.points ?? 0), 0);

  return (
    <>
      <header className="scheme-dark" style={{ paddingBlock: "var(--space-12)", paddingInline: "var(--section-pad-x)" }}>
        <div className="croftly-container">
          <Nav />
          <div className="hero-grid" style={{ display: "grid", gridTemplateColumns: "1.05fr 0.95fr", gap: "var(--space-16)", alignItems: "center" }}>
            <div>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.4rem 0.8rem", borderRadius: "var(--radius-pill)", border: "1px solid var(--scheme-border)", fontFamily: "var(--font-body)", fontSize: "var(--text-small)", color: "var(--scheme-text-muted)", marginBottom: "var(--space-6)" }}>
                <Icon name="mapPin" size={16} stroke={2} /> {live.length} regions delivering · more opening
              </span>
              <h1 style={{ margin: 0, fontSize: "var(--text-h1)", color: "var(--scheme-text)", lineHeight: "var(--leading-tight)", letterSpacing: "var(--tracking-tight)", maxWidth: "16ch", textWrap: "balance" }}>
                Where Croftly delivers
              </h1>
              <p style={{ margin: "var(--space-8) 0 0", fontFamily: "var(--font-body)", fontSize: "var(--text-large)", lineHeight: "var(--leading-normal)", color: "var(--scheme-text-muted)", maxWidth: "50ch", textWrap: "pretty" }}>
                We grow region by region, signing up nearby farms and couriers before we open boxes — so the food always travels a short hop, not across the country. Find your area below, or tell us where to come next.
              </p>
              <form onSubmit={(e) => e.preventDefault()} style={{ display: "flex", gap: "var(--space-4)", marginTop: "var(--space-10)", flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0 1rem", borderRadius: "var(--radius-button)", background: "var(--color-white)", minWidth: "16rem", flex: 1, maxWidth: "22rem" }}>
                  <span style={{ color: "var(--color-neutral)", display: "inline-flex" }}><Icon name="search" size={18} stroke={2} /></span>
                  <input placeholder="Enter your postcode" aria-label="Enter your postcode" style={{ flex: 1, minWidth: 0, border: "none", outline: "none", background: "transparent", padding: "0.85rem 0", fontFamily: "var(--font-body)", fontSize: "var(--text-regular)", color: "var(--color-neutral-darkest)" }} />
                </div>
                <Button size="lg" type="submit">Check my area</Button>
              </form>
              <div style={{ marginTop: "var(--space-10)", paddingTop: "var(--space-8)", borderTop: "1px solid var(--scheme-border)", display: "flex", flexWrap: "wrap", gap: "var(--space-5) var(--space-10)" }}>
                {[[String(live.length), "regions live"], [`${farms}+`, "local farms"], [`${points}+`, "collection points"]].map(([v, l]) => (
                  <div key={l} style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
                    <span style={{ fontFamily: "var(--font-heading)", fontWeight: "var(--weight-semibold)", fontSize: "var(--text-h5)", color: "var(--scheme-text)" }}>{v}</span>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-regular)", color: "var(--scheme-text-muted)" }}>{l}</span>
                  </div>
                ))}
              </div>
            </div>
            <CoverageMap activeId={activeId} onHover={setActiveId} />
          </div>
        </div>
      </header>

      <FSection scheme="scheme-light" id="regions">
        <SectionHead eyebrow="The map, in words" title="Which areas can I get Croftly in?" intro="Every region below has real farms signed up and couriers ready. Pick yours to see local farms, collection points and what's in season this week." max="48rem" />
        <RegionGroup title="Delivering now" intro="Open for boxes today" regions={REGIONS.filter((r) => r.status === "live")} activeId={activeId} setActiveId={setActiveId} />
        <RegionGroup title="Coming soon" intro="Farms signing up — boxes within months" regions={REGIONS.filter((r) => r.status === "soon")} activeId={activeId} setActiveId={setActiveId} />
        <RegionGroup title="On the waitlist" intro="Demand is building — your postcode helps" regions={REGIONS.filter((r) => r.status === "wait")} activeId={activeId} setActiveId={setActiveId} />
      </FSection>
    </>
  );
}
