import * as React from "react";
import { Card } from "@/components/croftly/card";
import { Badge } from "@/components/croftly/badge";
import { Icon } from "@/components/croftly/icon";
import { formatPence } from "@/lib/money";
import type { ComposedBox } from "@/lib/matching";

// Presentational composed-box display (Prompt 6). The signature money-split and
// the approve/veto flow are the focus of Prompt 7 (/shop/box).
export function ComposedBoxView({ box, explanation }: { box: ComposedBox; explanation: string | null }) {
  if (box.lines.length === 0) {
    return (
      <Card padding="lg">
        <p style={{ margin: 0, fontFamily: "var(--font-body)", fontSize: "var(--text-large)", color: "var(--color-neutral-dark)" }}>
          We couldn&apos;t build a box from what nearby farms have this week within your budget. Try widening
          your tastes or budget — and check back as farms list fresh produce.
        </p>
      </Card>
    );
  }

  return (
    <div className="grid gap-6">
      {explanation && (
        <Card padding="lg" style={{ background: "var(--color-olive-drab-lightest)", border: "1px solid var(--color-olive-drab-light)" }}>
          <div style={{ display: "flex", gap: "0.625rem", alignItems: "flex-start" }}>
            <span style={{ color: "var(--color-olive-drab-dark)", flexShrink: 0, marginTop: "0.1rem" }}>
              <Icon name="sparkles" size={20} stroke={2} />
            </span>
            <p style={{ margin: 0, fontFamily: "var(--font-body)", fontSize: "var(--text-regular)", color: "var(--color-neutral-darker)", lineHeight: "var(--leading-normal)" }}>
              {explanation}
            </p>
          </div>
        </Card>
      )}

      <Card padding="none">
        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {box.lines.map((l, i) => (
            <li
              key={l.product_id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "var(--space-4)",
                padding: "var(--space-5) var(--space-6)",
                borderTop: i === 0 ? "none" : "1px solid var(--color-ink-15)",
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                  <span style={{ fontFamily: "var(--font-heading)", fontWeight: "var(--weight-medium)", fontSize: "var(--text-regular)", color: "var(--color-neutral-darkest)" }}>{l.name}</span>
                  {l.is_glut && <Badge variant="solid" tone="rescued" size="sm">Rescued · less waste</Badge>}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginTop: "0.2rem", fontFamily: "var(--font-body)", fontSize: "var(--text-small)", color: "var(--color-neutral)" }}>
                  <Icon name="mapPin" size={14} stroke={2} />
                  {l.producer_name} · {l.unit}
                </div>
              </div>
              <span style={{ flexShrink: 0, fontFamily: "var(--font-heading)", fontWeight: "var(--weight-semibold)", fontSize: "var(--text-regular)", color: "var(--color-neutral-darkest)" }}>
                {formatPence(l.line_pence)}
              </span>
            </li>
          ))}
        </ul>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "var(--space-5) var(--space-6)",
            borderTop: "1px solid var(--color-ink-15)",
            background: "var(--color-neutral-lightest)",
          }}
        >
          <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-regular)", color: "var(--color-neutral-dark)" }}>
            {box.item_count} items · within your {formatPence(box.budget_pence)} budget
          </span>
          <span style={{ fontFamily: "var(--font-heading)", fontWeight: "var(--weight-semibold)", fontSize: "var(--text-h6)", color: "var(--color-neutral-darkest)" }}>
            {formatPence(box.subtotal_pence)}
          </span>
        </div>
      </Card>

      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.625rem",
          padding: "0.6rem 0.9rem",
          borderRadius: "var(--radius-pill)",
          background: "var(--color-olive-drab-lightest)",
          border: "1px solid var(--color-olive-drab-light)",
          alignSelf: "start",
        }}
      >
        <span style={{ color: "var(--color-olive-drab-dark)", display: "inline-flex" }}>
          <Icon name="check" size={16} stroke={2.4} />
        </span>
        <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-small)", color: "var(--color-olive-drab-dark)" }}>
          Allergies always respected
          {box.excluded_allergen > 0 && <> · {box.excluded_allergen} item{box.excluded_allergen === 1 ? "" : "s"} kept out</>}
        </span>
      </div>
    </div>
  );
}
