import * as React from "react";
import { Card } from "@/components/croftly/card";
import { Icon } from "@/components/croftly/icon";

// Shared "How it works" helpers — reproduced verbatim from the prototype HiW
// helpers (HwIcon, IconChip, StepBlock, OptionCard, DeliveryCard).

const hwPaths: Record<string, React.ReactNode> = {
  sliders: (
    <>
      <line x1="21" x2="14" y1="4" y2="4" />
      <line x1="10" x2="3" y1="4" y2="4" />
      <line x1="21" x2="12" y1="12" y2="12" />
      <line x1="8" x2="3" y1="12" y2="12" />
      <line x1="21" x2="16" y1="20" y2="20" />
      <line x1="12" x2="3" y1="20" y2="20" />
      <line x1="14" x2="14" y1="2" y2="6" />
      <line x1="8" x2="8" y1="10" y2="14" />
      <line x1="16" x2="16" y1="18" y2="22" />
    </>
  ),
  repeat: (
    <>
      <path d="m17 2 4 4-4 4" />
      <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
      <path d="m7 22-4-4 4-4" />
      <path d="M21 13v1a4 4 0 0 1-4 4H3" />
    </>
  ),
  gift: (
    <>
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <path d="M12 8v13" />
      <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
      <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
    </>
  ),
  calendar: (
    <>
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
      <path d="m9 16 2 2 4-4" />
    </>
  ),
  shield: (
    <>
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  home: (
    <>
      <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
      <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </>
  ),
  wallet: (
    <>
      <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
      <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
    </>
  ),
};

export type HwIconName = keyof typeof hwPaths;

export function HwIcon({ name, size = 24, stroke = 1.8 }: { name: HwIconName; size?: number; stroke?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }} aria-hidden="true">
      {hwPaths[name]}
    </svg>
  );
}

type ChipTone = "fresh" | "rescued" | "sky" | "earth";
const chipTones: Record<ChipTone, { bg: string; fg: string }> = {
  fresh: { bg: "var(--color-olive-drab-lightest)", fg: "var(--color-olive-drab-dark)" },
  rescued: { bg: "var(--color-tulip-tree-lighter)", fg: "var(--color-tulip-tree-dark)" },
  sky: { bg: "var(--color-danube-lighter)", fg: "var(--color-danube-dark)" },
  earth: { bg: "var(--color-potters-clay-lighter)", fg: "var(--color-potters-clay-dark)" },
};

export function IconChip({
  children,
  tone = "fresh",
  size = "3.25rem",
}: {
  children: React.ReactNode;
  tone?: ChipTone;
  size?: string;
}) {
  const t = chipTones[tone] ?? chipTones.fresh;
  return (
    <span style={{ width: size, height: size, flexShrink: 0, borderRadius: "var(--radius-card)", background: t.bg, color: t.fg, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
      {children}
    </span>
  );
}

export function StepBlock({
  n,
  icon,
  tone,
  title,
  body,
}: {
  n: number;
  icon: React.ReactNode;
  tone?: ChipTone;
  title: React.ReactNode;
  body: React.ReactNode;
}) {
  return (
    <Card padding="lg" style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)", height: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <IconChip tone={tone}>{icon}</IconChip>
        <span aria-hidden="true" style={{ fontFamily: "var(--font-heading)", fontWeight: "var(--weight-semibold)", fontSize: "var(--text-h3)", lineHeight: 1, color: "var(--color-ink-15)" }}>
          {String(n).padStart(2, "0")}
        </span>
      </div>
      <div>
        <h3 style={{ margin: 0, fontFamily: "var(--font-heading)", fontWeight: "var(--weight-medium)", fontSize: "var(--text-h5)", color: "var(--color-neutral-darkest)", textWrap: "balance" }}>{title}</h3>
        <p style={{ margin: "var(--space-4) 0 0", fontFamily: "var(--font-body)", fontSize: "var(--text-regular)", color: "var(--color-neutral-dark)", lineHeight: "var(--leading-normal)", textWrap: "pretty" }}>{body}</p>
      </div>
    </Card>
  );
}

// Box-type option card (mode, not product — no price).
export function OptionCard({ icon, tone, label, title, body, points, best }: { icon: React.ReactNode; tone?: ChipTone; label: string; title: string; body: string; points: string[]; best: string }) {
  return (
    <Card padding="lg" style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)", height: "100%" }}>
      <IconChip tone={tone}>{icon}</IconChip>
      <div>
        <p style={{ margin: "0 0 var(--space-2)", fontFamily: "var(--font-body)", fontWeight: "var(--weight-semibold)", fontSize: "var(--text-small)", letterSpacing: "0.02em", textTransform: "uppercase", color: "var(--color-neutral)" }}>{label}</p>
        <h3 style={{ margin: 0, fontFamily: "var(--font-heading)", fontWeight: "var(--weight-medium)", fontSize: "var(--text-h5)", color: "var(--color-neutral-darkest)" }}>{title}</h3>
      </div>
      <p style={{ margin: 0, fontFamily: "var(--font-body)", fontSize: "var(--text-regular)", color: "var(--color-neutral-dark)", lineHeight: "var(--leading-normal)" }}>{body}</p>
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: "var(--space-3)" }}>
        {points.map((p, i) => (
          <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem", fontFamily: "var(--font-body)", fontSize: "var(--text-regular)", color: "var(--color-neutral-darker)", lineHeight: "var(--leading-snug)" }}>
            <span style={{ flexShrink: 0, color: "var(--color-olive-drab)", marginTop: "1px" }}>
              <Icon name="check" size={18} stroke={2.4} />
            </span>
            {p}
          </li>
        ))}
      </ul>
      <div style={{ marginTop: "auto", paddingTop: "var(--space-5)", borderTop: "1px solid var(--color-ink-15)", fontFamily: "var(--font-body)", fontSize: "var(--text-small)", color: "var(--color-neutral)" }}>
        <span style={{ fontWeight: "var(--weight-semibold)", color: "var(--color-neutral-darker)" }}>Best for </span>
        {best}
      </div>
    </Card>
  );
}

// Delivery / collection option card.
export function DeliveryCard({ icon, tone, title, price, priceNote, body, points }: { icon: React.ReactNode; tone?: ChipTone; title: string; price: string; priceNote: string; body: string; points: string[] }) {
  const accent = tone === "sky" ? "var(--color-danube-dark)" : "var(--color-olive-drab-dark)";
  const tick = tone === "sky" ? "var(--color-danube)" : "var(--color-olive-drab)";
  return (
    <Card padding="lg" style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)", height: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
        <IconChip tone={tone}>{icon}</IconChip>
        <div>
          <h3 style={{ margin: 0, fontFamily: "var(--font-heading)", fontWeight: "var(--weight-medium)", fontSize: "var(--text-h5)", color: "var(--color-neutral-darkest)" }}>{title}</h3>
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.4rem", marginTop: "0.15rem" }}>
            <span style={{ fontFamily: "var(--font-heading)", fontWeight: "var(--weight-semibold)", fontSize: "var(--text-h6)", color: accent }}>{price}</span>
            <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-small)", color: "var(--color-neutral)" }}>{priceNote}</span>
          </div>
        </div>
      </div>
      <p style={{ margin: 0, fontFamily: "var(--font-body)", fontSize: "var(--text-regular)", color: "var(--color-neutral-dark)", lineHeight: "var(--leading-normal)", textWrap: "pretty" }}>{body}</p>
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: "var(--space-3)" }}>
        {points.map((p, i) => (
          <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem", fontFamily: "var(--font-body)", fontSize: "var(--text-regular)", color: "var(--color-neutral-darker)", lineHeight: "var(--leading-snug)" }}>
            <span style={{ flexShrink: 0, color: tick, marginTop: "1px" }}>
              <Icon name="check" size={18} stroke={2.4} />
            </span>
            {p}
          </li>
        ))}
      </ul>
    </Card>
  );
}
