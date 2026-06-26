import * as React from "react";
import Link from "next/link";
import { Icon } from "@/components/croftly/icon";
import { Card } from "@/components/croftly/card";
import { Badge } from "@/components/croftly/badge";
import { Avatar } from "@/components/croftly/avatar";
import { Button } from "@/components/croftly/button";

// Home presentational helpers — reproduced from the prototype home helpers.
// DEVIATION: real-photo `image-slot`s and the hero video are rendered as styled
// placeholders (no asset shipped); export real farm photography for production.

export function QuietLink({ children, href = "#" }: { children: React.ReactNode; href?: string }) {
  return (
    <Link href={href} className="croftly-quietlink">
      {children}
      <Icon name="arrowRight" size={17} />
    </Link>
  );
}

export function PhotoSlot({ label, aspect = "3 / 2" }: { label: string; aspect?: string }) {
  return (
    <div className="croftly-photo-slot" style={{ width: "100%", aspectRatio: aspect }}>
      {label}
    </div>
  );
}

export function FarmTile({ name, location, blurb, tags, placeholder }: { name: string; location: string; blurb: string; tags: string[]; placeholder: string }) {
  return (
    <Card interactive padding="none" style={{ display: "flex", flexDirection: "column" }}>
      <PhotoSlot label={placeholder} aspect="3 / 2" />
      <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontFamily: "var(--font-body)", fontSize: "var(--text-small)", color: "var(--color-neutral)" }}>
          <Icon name="mapPin" size={15} stroke={2} />
          {location}
        </div>
        <h3 style={{ margin: 0, fontFamily: "var(--font-heading)", fontWeight: "var(--weight-medium)", fontSize: "var(--text-h5)", color: "var(--color-neutral-darkest)" }}>{name}</h3>
        <p style={{ margin: 0, fontFamily: "var(--font-body)", fontSize: "var(--text-regular)", color: "var(--color-neutral-dark)", lineHeight: "var(--leading-normal)", flex: 1 }}>{blurb}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.5rem" }}>
          {tags.map((t) => (
            <Badge key={t} size="sm">{t}</Badge>
          ))}
        </div>
      </div>
    </Card>
  );
}

function Chip({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "fresh" }) {
  const tones = {
    neutral: { bg: "var(--color-neutral-lightest)", fg: "var(--color-neutral-darker)", bd: "var(--color-ink-15)" },
    fresh: { bg: "var(--color-olive-drab-lightest)", fg: "var(--color-olive-drab-dark)", bd: "var(--color-olive-drab-light)" },
  } as const;
  const t = tones[tone];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", fontFamily: "var(--font-body)", fontSize: "var(--text-small)", fontWeight: "var(--weight-medium)", color: t.fg, background: t.bg, border: `1px solid ${t.bd}`, padding: "0.4rem 0.75rem", borderRadius: "var(--radius-pill)" }}>{children}</span>
  );
}

function MatchRow({ initials, name, area, crop }: { initials: string; name: string; area: string; crop: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.875rem", paddingBlock: "0.75rem", borderTop: "1px solid var(--color-ink-15)" }}>
      <Avatar initials={initials} size={40} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "var(--font-heading)", fontWeight: "var(--weight-medium)", fontSize: "var(--text-regular)", color: "var(--color-neutral-darkest)" }}>{name}</div>
        <div style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-small)", color: "var(--color-neutral)" }}>{crop}</div>
      </div>
      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", fontFamily: "var(--font-body)", fontSize: "var(--text-small)", color: "var(--color-neutral)", whiteSpace: "nowrap" }}>
        <Icon name="mapPin" size={14} stroke={2} />
        {area}
      </span>
    </div>
  );
}

export function MatchVisual() {
  return (
    <Card padding="lg" style={{ background: "var(--color-white)", display: "grid", gap: "var(--space-8)" }}>
      <div>
        <p style={{ margin: "0 0 var(--space-4)", fontFamily: "var(--font-body)", fontWeight: "var(--weight-semibold)", fontSize: "var(--text-small)", letterSpacing: "0.02em", textTransform: "uppercase", color: "var(--color-neutral)" }}>You tell us</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          <Chip tone="fresh">Leafy greens</Chip>
          <Chip tone="fresh">Free-range eggs</Chip>
          <Chip>No coriander</Chip>
          <Chip>~£25 a week</Chip>
          <Chip>Collect nearby</Chip>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", color: "var(--color-olive-drab)", fontFamily: "var(--font-body)", fontWeight: "var(--weight-semibold)", fontSize: "var(--text-regular)" }}>
        <Icon name="sparkles" size={20} stroke={2} />
        Croftly matches it to farms near you this week
      </div>
      <div>
        <p style={{ margin: "0 0 var(--space-2)", fontFamily: "var(--font-body)", fontWeight: "var(--weight-semibold)", fontSize: "var(--text-small)", letterSpacing: "0.02em", textTransform: "uppercase", color: "var(--color-neutral)" }}>This week&apos;s match</p>
        <MatchRow initials="HF" name="Hartley's Field" crop="Chard, kale & salad leaves" area="4 mi" />
        <MatchRow initials="LB" name="Lower Brook Eggs" crop="Free-range eggs" area="6 mi" />
        <MatchRow initials="OW" name="Oakwell Market Garden" crop="Spring onions & herbs" area="9 mi" />
      </div>
    </Card>
  );
}

export function Testimonial({ quote, initials, name, role, tone = "fresh" }: { quote: string; initials: string; name: string; role: string; tone?: "fresh" | "earth" }) {
  return (
    <Card padding="lg" style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)", height: "100%" }}>
      <span style={{ color: tone === "earth" ? "var(--color-potters-clay)" : "var(--color-olive-drab)" }}>
        <Icon name="quote" size={30} stroke={2} />
      </span>
      <p style={{ margin: 0, fontFamily: "var(--font-heading)", fontWeight: 500, fontSize: "var(--text-h6)", lineHeight: "var(--leading-snug)", color: "var(--color-neutral-darkest)", textWrap: "pretty", flex: 1 }}>{quote}</p>
      <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
        <Avatar initials={initials} size={48} ring />
        <div>
          <div style={{ fontFamily: "var(--font-heading)", fontWeight: "var(--weight-medium)", fontSize: "var(--text-regular)", color: "var(--color-neutral-darkest)" }}>{name}</div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-small)", color: "var(--color-neutral)" }}>{role}</div>
        </div>
      </div>
    </Card>
  );
}

export function ForkCard({ icon, tone, eyebrow, title, body, cta, href }: { icon: React.ReactNode; tone: "fresh" | "earth"; eyebrow: string; title: string; body: string; cta: string; href: string }) {
  return (
    <Card padding="lg" style={{ background: "var(--color-white)", display: "flex", flexDirection: "column", gap: "var(--space-5)", height: "100%" }}>
      <span style={{ width: "3.25rem", height: "3.25rem", borderRadius: "var(--radius-card)", background: tone === "earth" ? "var(--color-tulip-tree-lighter)" : "var(--color-olive-drab-lightest)", color: tone === "earth" ? "var(--color-tulip-tree-dark)" : "var(--color-olive-drab-dark)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{icon}</span>
      <div>
        <p style={{ margin: "0 0 var(--space-2)", fontFamily: "var(--font-body)", fontWeight: "var(--weight-semibold)", fontSize: "var(--text-small)", letterSpacing: "0.02em", textTransform: "uppercase", color: "var(--color-neutral)" }}>{eyebrow}</p>
        <h3 style={{ margin: 0, fontFamily: "var(--font-heading)", fontWeight: "var(--weight-medium)", fontSize: "var(--text-h5)", color: "var(--color-neutral-darkest)" }}>{title}</h3>
      </div>
      <p style={{ margin: 0, fontFamily: "var(--font-body)", fontSize: "var(--text-regular)", color: "var(--color-neutral-dark)", lineHeight: "var(--leading-normal)", flex: 1 }}>{body}</p>
      <div>
        <Button href={href} iconRight={<Icon name="arrowRight" size={18} />} style={tone === "earth" ? { background: "var(--color-potters-clay)", borderColor: "var(--color-potters-clay)" } : {}}>
          {cta}
        </Button>
      </div>
    </Card>
  );
}
