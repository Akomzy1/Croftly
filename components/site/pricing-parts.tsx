import * as React from "react";
import { Icon } from "@/components/croftly/icon";
import { Card } from "@/components/croftly/card";
import { Badge } from "@/components/croftly/badge";
import { Button } from "@/components/croftly/button";
import { PhotoSlot } from "@/components/site/home-parts";

// Pricing page helpers — reproduced from the prototype Pricing helpers.
type Tone = "fresh" | "rescued" | "sky" | "earth";
const TONES: Record<Tone, { bg: string; fg: string; solid: string }> = {
  fresh: { bg: "var(--color-olive-drab-lightest)", fg: "var(--color-olive-drab-dark)", solid: "var(--color-olive-drab)" },
  rescued: { bg: "var(--color-tulip-tree-lighter)", fg: "var(--color-tulip-tree-dark)", solid: "var(--color-tulip-tree)" },
  sky: { bg: "var(--color-danube-lighter)", fg: "var(--color-danube-dark)", solid: "var(--color-danube)" },
  earth: { bg: "var(--color-potters-clay-lighter)", fg: "var(--color-potters-clay-dark)", solid: "var(--color-potters-clay)" },
};

const prPaths: Record<string, React.ReactNode> = {
  percent: (<><line x1="19" x2="5" y1="5" y2="19" /><circle cx="6.5" cy="6.5" r="2.5" /><circle cx="17.5" cy="17.5" r="2.5" /></>),
  lock: (<><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>),
  recycle: (<><path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5" /><path d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12" /><path d="m14 16-3 3 3 3" /><path d="M8.293 13.596 7.196 9.5 3.1 10.598" /><path d="m9.344 5.811 1.093-1.892A1.83 1.83 0 0 1 11.985 3a1.784 1.784 0 0 1 1.546.888l3.943 6.843" /><path d="m13.378 9.633 4.096 1.098 1.097-4.096" /></>),
  gift: (<><rect x="3" y="8" width="18" height="4" rx="1" /><path d="M12 8v13" /><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" /><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" /></>),
  calendarCheck: (<><path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" /><path d="m9 16 2 2 4-4" /></>),
  home: (<><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" /><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></>),
  badgePound: (<><circle cx="12" cy="12" r="9" /><path d="M9.5 16.5h5" /><path d="M10 16.5c1.2-1 1.4-2.2 1.1-3.5M9.7 12h3.4" /><path d="M10.4 12c-.3-1-.5-1.8-.5-2.6 0-1.4 1-2.4 2.4-2.4 1 0 1.8.5 2.2 1.2" /></>),
  plus: (<><path d="M5 12h14" /><path d="M12 5v14" /></>),
  info: (<><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></>),
};

export function PrIcon({ name, size = 24, stroke = 1.8 }: { name: keyof typeof prPaths; size?: number; stroke?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }} aria-hidden="true">
      {prPaths[name]}
    </svg>
  );
}

function PrIconChip({ children, tone = "fresh", size = "3.25rem" }: { children: React.ReactNode; tone?: Tone; size?: string }) {
  const t = TONES[tone];
  return <span style={{ width: size, height: size, flexShrink: 0, borderRadius: "var(--radius-card)", background: t.bg, color: t.fg, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{children}</span>;
}

export function CheckList({ points, tone = "fresh" }: { points: string[]; tone?: Tone }) {
  const t = TONES[tone];
  return (
    <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: "var(--space-3)" }}>
      {points.map((p, i) => (
        <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem", fontFamily: "var(--font-body)", fontSize: "var(--text-regular)", color: "var(--color-neutral-darker)", lineHeight: "var(--leading-snug)" }}>
          <span style={{ flexShrink: 0, color: t.solid, marginTop: "1px" }}><Icon name="check" size={18} stroke={2.4} /></span>
          {p}
        </li>
      ))}
    </ul>
  );
}

export function SplitLine({ swatch, label, amount, note }: { swatch: string; label: string; amount: string; note: string }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", paddingBlock: "var(--space-4)", borderTop: "1px solid var(--color-ink-15)" }}>
      <span style={{ width: "0.85rem", height: "0.85rem", borderRadius: "4px", background: swatch, flexShrink: 0, marginTop: "0.3rem" }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "var(--font-heading)", fontWeight: "var(--weight-medium)", fontSize: "var(--text-regular)", color: "var(--color-neutral-darkest)" }}>{label}</div>
        <div style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-small)", color: "var(--color-neutral)", lineHeight: "var(--leading-snug)", marginTop: "0.1rem" }}>{note}</div>
      </div>
      <span style={{ fontFamily: "var(--font-heading)", fontWeight: "var(--weight-semibold)", fontSize: "var(--text-h6)", color: "var(--color-neutral-darkest)", whiteSpace: "nowrap" }}>{amount}</span>
    </div>
  );
}

export function CommissionCard({ tone, icon, rate, label, title, body, keep, flag }: { tone: Tone; icon: React.ReactNode; rate: string; label: string; title: string; body: string; keep: string; flag?: string }) {
  const t = TONES[tone];
  return (
    <Card padding="lg" style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)", height: "100%", borderColor: flag ? t.solid : "var(--color-ink-15)", borderWidth: flag ? "2px" : "1px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-4)" }}>
        <PrIconChip tone={tone}>{icon}</PrIconChip>
        {flag && <Badge variant="solid" tone={tone === "sky" ? "info" : tone}>{flag}</Badge>}
      </div>
      <div>
        <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
          <span style={{ fontFamily: "var(--font-heading)", fontWeight: "var(--weight-medium)", fontSize: "var(--text-h1)", lineHeight: 1, letterSpacing: "var(--tracking-tight)", color: t.fg }}>{rate}</span>
          <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-regular)", color: "var(--color-neutral)" }}>commission</span>
        </div>
        <p style={{ margin: "var(--space-3) 0 0", fontFamily: "var(--font-body)", fontWeight: "var(--weight-semibold)", fontSize: "var(--text-small)", letterSpacing: "0.02em", textTransform: "uppercase", color: "var(--color-neutral)" }}>{label}</p>
        <h3 style={{ margin: "var(--space-1) 0 0", fontFamily: "var(--font-heading)", fontWeight: "var(--weight-medium)", fontSize: "var(--text-h5)", color: "var(--color-neutral-darkest)" }}>{title}</h3>
      </div>
      <p style={{ margin: 0, fontFamily: "var(--font-body)", fontSize: "var(--text-regular)", color: "var(--color-neutral-dark)", lineHeight: "var(--leading-normal)", flex: 1, textWrap: "pretty" }}>{body}</p>
      <div style={{ marginTop: "auto", paddingTop: "var(--space-5)", borderTop: "1px solid var(--color-ink-15)", display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
        <span style={{ fontFamily: "var(--font-heading)", fontWeight: "var(--weight-semibold)", fontSize: "var(--text-h6)", color: "var(--color-olive-drab)" }}>{keep}</span>
        <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-small)", color: "var(--color-neutral)" }}>stays with the farmer</span>
      </div>
    </Card>
  );
}

export function PriceTier({ tone, icon, title, price, priceNote, body, points, flag }: { tone: Tone; icon: React.ReactNode; title: string; price: string; priceNote: string; body: string; points: string[]; flag?: string }) {
  const t = TONES[tone];
  return (
    <Card padding="lg" style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)", height: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
        <PrIconChip tone={tone}>{icon}</PrIconChip>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
            <h3 style={{ margin: 0, fontFamily: "var(--font-heading)", fontWeight: "var(--weight-medium)", fontSize: "var(--text-h5)", color: "var(--color-neutral-darkest)" }}>{title}</h3>
            {flag && <Badge variant="solid" tone={tone === "sky" ? "info" : tone}>{flag}</Badge>}
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.4rem", marginTop: "0.15rem" }}>
            <span style={{ fontFamily: "var(--font-heading)", fontWeight: "var(--weight-semibold)", fontSize: "var(--text-h5)", color: t.fg }}>{price}</span>
            <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-small)", color: "var(--color-neutral)" }}>{priceNote}</span>
          </div>
        </div>
      </div>
      <p style={{ margin: 0, fontFamily: "var(--font-body)", fontSize: "var(--text-regular)", color: "var(--color-neutral-dark)", lineHeight: "var(--leading-normal)", textWrap: "pretty" }}>{body}</p>
      <CheckList points={points} tone={tone} />
    </Card>
  );
}

function PerkRow({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div style={{ display: "flex", gap: "var(--space-4)", alignItems: "flex-start", paddingBlock: "var(--space-4)", borderTop: "1px solid var(--color-ink-15)" }}>
      <span style={{ flexShrink: 0, color: "var(--color-olive-drab)", marginTop: "0.1rem" }}>{icon}</span>
      <div>
        <div style={{ fontFamily: "var(--font-heading)", fontWeight: "var(--weight-medium)", fontSize: "var(--text-regular)", color: "var(--color-neutral-darkest)" }}>{title}</div>
        <div style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-small)", color: "var(--color-neutral-dark)", lineHeight: "var(--leading-snug)", marginTop: "0.1rem", maxWidth: "40ch" }}>{body}</div>
      </div>
    </div>
  );
}

// Croftly+ membership card. PRODUCTION: membership is deferred (PRD) — CTA is inert.
export function MembershipCard() {
  return (
    <Card padding="none" style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ background: "var(--color-olive-drab)", color: "var(--color-white)", padding: "var(--space-8)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontFamily: "var(--font-heading)", fontWeight: "var(--weight-semibold)", fontSize: "var(--text-h5)" }}>
          Croftly
          <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "1.4rem", height: "1.4rem", borderRadius: "999px", background: "var(--color-white)", color: "var(--color-olive-drab)" }}>
            <PrIcon name="plus" size={15} stroke={2.6} />
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", marginTop: "var(--space-5)" }}>
          <span style={{ fontFamily: "var(--font-heading)", fontWeight: "var(--weight-semibold)", fontSize: "var(--text-h1)", lineHeight: 1, letterSpacing: "var(--tracking-tight)" }}>£4</span>
          <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-regular)", opacity: 0.85 }}>a month · or £39 a year</span>
        </div>
        <p style={{ margin: "var(--space-4) 0 0", fontFamily: "var(--font-body)", fontSize: "var(--text-small)", lineHeight: "var(--leading-normal)", opacity: 0.9, maxWidth: "34ch" }}>
          Cancel anytime. Most regular shoppers cover the cost in two deliveries — and we&apos;ll tell you if you&apos;re not.
        </p>
      </div>
      <div style={{ padding: "var(--space-6) var(--space-8) var(--space-8)" }}>
        <PerkRow icon={<Icon name="truck" size={20} stroke={2} />} title="Reduced delivery, every time" body="£1.50 courier fee instead of £2.90 — or free over £35 rather than £45." />
        <PerkRow icon={<PrIcon name="lock" size={20} stroke={2} />} title="Locked box pricing" body="Your recurring box price is held for 12 months, even when a crop gets scarce." />
        <PerkRow icon={<PrIcon name="recycle" size={20} stroke={2} />} title="Early access to rescued deals" body="See glut and surplus boxes a day before everyone else — the best value sells fast." />
        <PerkRow icon={<Icon name="sparkles" size={20} stroke={2} />} title="5% credit back" body="Earn 5% of what you spend back as Croftly credit, towards future boxes." />
        <div style={{ marginTop: "var(--space-6)" }}>
          <Button style={{ width: "100%" }} iconRight={<Icon name="arrowRight" size={18} />}>Add Croftly+</Button>
        </div>
      </div>
    </Card>
  );
}

export function AffordableTile() {
  return (
    <Card padding="none" style={{ display: "flex", flexDirection: "column", borderColor: "var(--color-tulip-tree)", borderWidth: "2px" }}>
      <div style={{ position: "relative" }}>
        <PhotoSlot label="Rescued / glut box photo" aspect="16 / 10" />
        <div style={{ position: "absolute", top: "1rem", left: "1rem" }}>
          <Badge variant="solid" tone="rescued">Rescued · glut box</Badge>
        </div>
      </div>
      <div style={{ padding: "var(--space-8)", display: "flex", flexDirection: "column", gap: "var(--space-4)", flex: 1 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "var(--space-4)" }}>
          <h3 style={{ margin: 0, fontFamily: "var(--font-heading)", fontWeight: "var(--weight-medium)", fontSize: "var(--text-h4)", color: "var(--color-neutral-darkest)" }}>Glut box</h3>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "var(--font-heading)", fontWeight: "var(--weight-semibold)", fontSize: "var(--text-h3)", color: "var(--color-tulip-tree-dark)", lineHeight: 1 }}>£9</div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-small)", color: "var(--color-neutral)" }}>one-off</div>
          </div>
        </div>
        <p style={{ margin: 0, fontFamily: "var(--font-body)", fontSize: "var(--text-regular)", color: "var(--color-neutral-dark)", lineHeight: "var(--leading-normal)", textWrap: "pretty" }}>
          Surplus and perfectly-good &quot;wonky&quot; produce a farm has too much of this week. Same food, picked just as fresh — priced to clear, not to profit.
        </p>
        <CheckList tone="rescued" points={["Roughly 6–9 portions of seasonal veg", "Around supermarket basics prices", "Farmer still keeps 92% — surplus they'd otherwise lose"]} />
      </div>
    </Card>
  );
}
