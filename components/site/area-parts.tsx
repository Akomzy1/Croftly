import * as React from "react";
import Link from "next/link";
import { Icon } from "@/components/croftly/icon";
import { Card } from "@/components/croftly/card";
import { Badge } from "@/components/croftly/badge";
import { Accordion, type AccordionItem } from "@/components/croftly/accordion";

// Area landing-page helpers — reproduced from the prototype area helpers
// (LIcon, Breadcrumb, SeasonNow, PointRow, DeliveryPanel, LocalFaq, HeaderStat).

const lPaths: Record<string, React.ReactNode> = {
  calendar: (<><path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" /></>),
  info: (<><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></>),
  navigation: (<><path d="M9.06 4.94 19 12l-7 2-2 7-4.94-16.06a1 1 0 0 1 1.28-1.28Z" /></>),
  clock3: (<><circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15 14" /></>),
  sun: (<><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" /></>),
};

export function LIcon({ name, size = 24, stroke = 1.8 }: { name: keyof typeof lPaths; size?: number; stroke?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }} aria-hidden="true">
      {lPaths[name]}
    </svg>
  );
}

export function Breadcrumb({ trail }: { trail: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" style={{ marginBottom: "var(--space-6)" }}>
      <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.5rem", fontFamily: "var(--font-body)", fontSize: "var(--text-small)" }}>
        {trail.map((t, i) => (
          <li key={t.label} style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
            {t.href ? <Link href={t.href} style={{ color: "var(--scheme-text-muted)", textDecoration: "none" }}>{t.label}</Link> : <span style={{ color: "var(--scheme-text)" }}>{t.label}</span>}
            {i < trail.length - 1 && <span style={{ color: "var(--scheme-text-muted)", opacity: 0.6 }}>/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function SeasonNow({ monthIndex, ready, coming }: { monthIndex: number; ready: string[]; coming: string[] }) {
  return (
    <Card padding="lg" style={{ display: "grid", gap: "var(--space-8)" }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "var(--space-5)", color: "var(--color-olive-drab-dark)" }}>
          <LIcon name="calendar" size={20} stroke={2} />
          <span style={{ fontFamily: "var(--font-body)", fontWeight: "var(--weight-semibold)", fontSize: "var(--text-small)", letterSpacing: "0.02em", textTransform: "uppercase", color: "var(--color-neutral)" }}>Seasonal calendar · {MONTHS[monthIndex]}</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "0.3rem" }}>
          {MONTHS.map((m, i) => {
            const on = i === monthIndex;
            return (
              <div key={m} style={{ textAlign: "center", paddingBlock: "0.5rem", borderRadius: "var(--radius-tag)", background: on ? "var(--color-olive-drab)" : "var(--color-neutral-lightest)", color: on ? "var(--color-white)" : "var(--color-neutral)", fontFamily: "var(--font-body)", fontWeight: on ? "var(--weight-semibold)" : "var(--weight-regular)", fontSize: "var(--text-small)" }}>{m.slice(0, 1)}</div>
            );
          })}
        </div>
      </div>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "var(--space-4)" }}>
          <span style={{ color: "var(--color-olive-drab)" }}><LIcon name="sun" size={18} stroke={2} /></span>
          <span style={{ fontFamily: "var(--font-heading)", fontWeight: "var(--weight-medium)", fontSize: "var(--text-regular)", color: "var(--color-neutral-darkest)" }}>Picked near you right now</span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {ready.map((p) => (
            <span key={p} style={{ display: "inline-flex", alignItems: "center", fontFamily: "var(--font-body)", fontSize: "var(--text-small)", fontWeight: "var(--weight-medium)", color: "var(--color-olive-drab-dark)", background: "var(--color-olive-drab-lightest)", border: "1px solid var(--color-olive-drab-light)", padding: "0.4rem 0.75rem", borderRadius: "var(--radius-pill)" }}>{p}</span>
          ))}
        </div>
      </div>
      <div style={{ paddingTop: "var(--space-6)", borderTop: "1px solid var(--color-ink-15)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "var(--space-4)" }}>
          <span style={{ color: "var(--color-tulip-tree-dark)" }}><Icon name="clock" size={18} stroke={2} /></span>
          <span style={{ fontFamily: "var(--font-heading)", fontWeight: "var(--weight-medium)", fontSize: "var(--text-regular)", color: "var(--color-neutral-darkest)" }}>Coming into season next</span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {coming.map((p) => (
            <span key={p} style={{ display: "inline-flex", alignItems: "center", fontFamily: "var(--font-body)", fontSize: "var(--text-small)", fontWeight: "var(--weight-medium)", color: "var(--color-potters-clay-dark)", background: "var(--color-tulip-tree-lighter)", border: "1px solid var(--color-tulip-tree-light)", padding: "0.4rem 0.75rem", borderRadius: "var(--radius-pill)" }}>{p}</span>
          ))}
        </div>
      </div>
    </Card>
  );
}

export function PointRow({ name, place, hours, kind }: { name: string; place: string; hours: string; kind: string }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "var(--space-5)", paddingBlock: "var(--space-5)", borderTop: "1px solid var(--color-ink-15)" }}>
      <span style={{ flexShrink: 0, width: "2.75rem", height: "2.75rem", borderRadius: "var(--radius-card)", background: "var(--color-danube-lighter)", color: "var(--color-danube-dark)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
        <Icon name="store" size={20} stroke={1.8} />
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "var(--space-4)", flexWrap: "wrap" }}>
          <h4 style={{ margin: 0, fontFamily: "var(--font-heading)", fontWeight: "var(--weight-medium)", fontSize: "var(--text-regular)", color: "var(--color-neutral-darkest)" }}>{name}</h4>
          <Badge size="sm">{kind}</Badge>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem 1rem", marginTop: "0.3rem", fontFamily: "var(--font-body)", fontSize: "var(--text-small)", color: "var(--color-neutral)" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}><Icon name="mapPin" size={14} stroke={2} />{place}</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}><LIcon name="clock3" size={14} stroke={2} />{hours}</span>
        </div>
      </div>
    </div>
  );
}

export function DeliveryPanel({ postcodes, days, base, fee }: { postcodes: string; days: string; base: string; fee: string }) {
  const rows = [
    { icon: <Icon name="mapPin" size={18} stroke={2} />, h: "Postcodes covered", b: postcodes },
    { icon: <LIcon name="calendar" size={18} stroke={2} />, h: "Delivery days", b: days },
    { icon: <LIcon name="navigation" size={18} stroke={2} />, h: "Couriers based in", b: base },
  ];
  return (
    <Card padding="lg" style={{ display: "grid", gap: "var(--space-6)", height: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
        <span style={{ width: "3.25rem", height: "3.25rem", borderRadius: "var(--radius-card)", background: "var(--color-olive-drab-lightest)", color: "var(--color-olive-drab-dark)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="truck" size={26} stroke={1.8} />
        </span>
        <div>
          <h3 style={{ margin: 0, fontFamily: "var(--font-heading)", fontWeight: "var(--weight-medium)", fontSize: "var(--text-h5)", color: "var(--color-neutral-darkest)" }}>Doorstep delivery</h3>
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.4rem", marginTop: "0.15rem" }}>
            <span style={{ fontFamily: "var(--font-heading)", fontWeight: "var(--weight-semibold)", fontSize: "var(--text-h6)", color: "var(--color-olive-drab-dark)" }}>{fee}</span>
            <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-small)", color: "var(--color-neutral)" }}>honest flat fee</span>
          </div>
        </div>
      </div>
      <div style={{ display: "grid", gap: "var(--space-4)" }}>
        {rows.map((r) => (
          <div key={r.h} style={{ display: "flex", gap: "var(--space-4)", alignItems: "flex-start" }}>
            <span style={{ flexShrink: 0, color: "var(--color-olive-drab)", marginTop: "1px" }}>{r.icon}</span>
            <div>
              <div style={{ fontFamily: "var(--font-body)", fontWeight: "var(--weight-semibold)", fontSize: "var(--text-small)", color: "var(--color-neutral-darker)" }}>{r.h}</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-regular)", color: "var(--color-neutral-dark)", lineHeight: "var(--leading-snug)" }}>{r.b}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: "auto", paddingTop: "var(--space-5)", borderTop: "1px solid var(--color-ink-15)", display: "flex", alignItems: "center", gap: "0.5rem", fontFamily: "var(--font-body)", fontSize: "var(--text-small)", color: "var(--color-neutral)" }}>
        <LIcon name="info" size={16} stroke={2} /> Picked 1–3 days before it reaches you — never from a warehouse.
      </div>
    </Card>
  );
}

export function LocalFaq({ items }: { items: AccordionItem[] }) {
  return <Accordion items={items} defaultOpen={[0]} />;
}

export function HeaderStat({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
      <span style={{ fontFamily: "var(--font-heading)", fontWeight: "var(--weight-semibold)", fontSize: "var(--text-h5)", color: "var(--scheme-text)" }}>{value}</span>
      <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-regular)", color: "var(--scheme-text-muted)" }}>{label}</span>
    </div>
  );
}
