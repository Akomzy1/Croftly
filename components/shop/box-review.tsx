"use client";

import * as React from "react";
import { Card } from "@/components/croftly/card";
import { Badge } from "@/components/croftly/badge";
import { Button } from "@/components/croftly/button";
import { Icon } from "@/components/croftly/icon";
import { MoneySplit } from "@/components/croftly/money-split";
import { formatPence } from "@/lib/money";
import { splitLine, boxFinancials } from "@/lib/commission";
import { track } from "@/lib/analytics";
import type { ComposedLine } from "@/lib/matching";

type Slot = { line: ComposedLine; removed: boolean; approved: boolean };

const tierLabel: Record<string, string> = { standard: "Standard", forward: "Forward", glut: "Glut" };

export function BoxReview({
  lines,
  alternatives,
  explanation,
  budgetPence,
}: {
  lines: ComposedLine[];
  alternatives: ComposedLine[];
  explanation: string | null;
  budgetPence: number;
}) {
  const [slots, setSlots] = React.useState<Slot[]>(() => lines.map((line) => ({ line, removed: false, approved: false })));
  const [pool, setPool] = React.useState<ComposedLine[]>(alternatives);

  // "Silence is not consent": a single unusually expensive item must be explicitly
  // approved before it counts or checkout unlocks.
  const unusualThreshold = Math.max(800, Math.round(0.35 * budgetPence));
  const isUnusual = (l: ComposedLine) => l.line_pence >= unusualThreshold;

  const counts = (s: Slot) => !s.removed && (!isUnusual(s.line) || s.approved);
  const included = slots.filter(counts).map((s) => s.line);
  const fin = boxFinancials(included);
  const pendingUnusual = slots.some((s) => !s.removed && isUnusual(s.line) && !s.approved);
  const canCheckout = included.length > 0 && !pendingUnusual && fin.subtotal_pence <= budgetPence;

  function remove(i: number) {
    setSlots((prev) => prev.map((s, j) => (j === i ? { ...s, removed: !s.removed } : s)));
  }
  function approve(i: number) {
    setSlots((prev) => prev.map((s, j) => (j === i ? { ...s, approved: true } : s)));
  }
  function swap(i: number) {
    setSlots((prev) => {
      const slot = prev[i];
      const includedSubtotal = prev.filter(counts).reduce((sum, s) => sum + s.line.line_pence, 0);
      const slotContribution = counts(slot) ? slot.line.line_pence : 0;
      const headroom = budgetPence - (includedSubtotal - slotContribution);
      // Prefer a same-category alternative that fits the spend cap.
      const pick =
        pool.find((a) => a.category === slot.line.category && a.line_pence <= headroom) ??
        pool.find((a) => a.line_pence <= headroom);
      if (!pick) return prev; // nothing fits — leave as-is
      setPool((p) => [...p.filter((a) => a.product_id !== pick.product_id), slot.line]);
      return prev.map((s, j) => (j === i ? { line: pick, removed: false, approved: false } : s));
    });
  }

  return (
    <div className="build-grid" style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: "var(--space-12)", alignItems: "start" }}>
      {/* ---- box contents ---- */}
      <div className="grid gap-6">
        {explanation && (
          <Card padding="lg" style={{ background: "var(--color-olive-drab-lightest)", border: "1px solid var(--color-olive-drab-light)" }}>
            <div style={{ display: "flex", gap: "0.625rem", alignItems: "flex-start" }}>
              <span style={{ color: "var(--color-olive-drab-dark)", flexShrink: 0, marginTop: "0.1rem" }}>
                <Icon name="sparkles" size={20} stroke={2} />
              </span>
              <p style={{ margin: 0, fontFamily: "var(--font-body)", fontSize: "var(--text-regular)", color: "var(--color-neutral-darker)", lineHeight: "var(--leading-normal)" }}>{explanation}</p>
            </div>
          </Card>
        )}

        <Card padding="none">
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {slots.map((s, i) => {
              const sp = splitLine(s.line.line_pence, s.line);
              const muted = s.removed;
              const needsApproval = !s.removed && isUnusual(s.line) && !s.approved;
              return (
                <li key={s.line.product_id} style={{ padding: "var(--space-5) var(--space-6)", borderTop: i === 0 ? "none" : "1px solid var(--color-ink-15)", opacity: muted ? 0.5 : 1 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "var(--space-4)" }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                        <span style={{ fontFamily: "var(--font-heading)", fontWeight: "var(--weight-medium)", fontSize: "var(--text-regular)", color: "var(--color-neutral-darkest)", textDecoration: muted ? "line-through" : "none" }}>{s.line.name}</span>
                        {s.line.is_glut && <Badge variant="solid" tone="rescued" size="sm">Rescued · less waste</Badge>}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginTop: "0.2rem", fontFamily: "var(--font-body)", fontSize: "var(--text-small)", color: "var(--color-neutral)" }}>
                        <Icon name="mapPin" size={14} stroke={2} />
                        {s.line.producer_name} · {s.line.unit}
                      </div>
                      <div style={{ marginTop: "0.35rem", fontFamily: "var(--font-body)", fontSize: "var(--text-small)", color: "var(--color-neutral)" }}>
                        Farmer keeps <strong style={{ color: "var(--color-olive-drab-dark)" }}>{formatPence(sp.farmer_pence)}</strong> · Croftly {formatPence(sp.commission_pence)} ({tierLabel[sp.tier]} {Math.round(sp.commission_rate * 100)}%)
                      </div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontFamily: "var(--font-heading)", fontWeight: "var(--weight-semibold)", fontSize: "var(--text-regular)", color: "var(--color-neutral-darkest)" }}>{formatPence(s.line.line_pence)}</div>
                      <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.4rem", justifyContent: "flex-end" }}>
                        <button type="button" onClick={() => swap(i)} style={linkBtn}>Swap</button>
                        <button type="button" onClick={() => remove(i)} style={linkBtn}>{muted ? "Add back" : "Remove"}</button>
                      </div>
                    </div>
                  </div>

                  {needsApproval && (
                    <div style={{ marginTop: "var(--space-4)", padding: "0.6rem 0.85rem", borderRadius: "var(--radius-input)", background: "var(--color-tulip-tree-lighter)", border: "1px solid var(--color-tulip-tree-light)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-3)", flexWrap: "wrap" }}>
                      <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-small)", color: "var(--color-potters-clay-dark)" }}>
                        This is a larger-than-usual item — please confirm you want it before checkout.
                      </span>
                      <Button type="button" size="sm" onClick={() => approve(i)} style={{ background: "var(--color-potters-clay)", borderColor: "var(--color-potters-clay)" }}>
                        Approve this item
                      </Button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </Card>

        <p style={{ margin: 0, fontFamily: "var(--font-body)", fontSize: "var(--text-small)", color: "var(--color-neutral)" }}>
          Swap or remove anything before you approve. Your box never exceeds your {formatPence(budgetPence)} budget, and
          allergies you set are always respected.
        </p>
      </div>

      {/* ---- the signature money-split + checkout ---- */}
      <div style={{ position: "sticky", top: "1.5rem", display: "grid", gap: "var(--space-6)" }}>
        <Card padding="lg">
          <h2 style={{ margin: "0 0 var(--space-5)", fontFamily: "var(--font-heading)", fontWeight: "var(--weight-medium)", fontSize: "var(--text-h6)", color: "var(--color-neutral-darkest)" }}>
            Where your money goes
          </h2>
          <MoneySplit
            total={fin.subtotal_pence / 100}
            segments={[
              { label: "Farmers keep", amount: fin.farmer_pence / 100, color: "var(--color-olive-drab)" },
              { label: "Croftly", amount: fin.platform_pence / 100, color: "var(--color-tulip-tree)" },
            ]}
          />
          <p style={{ margin: "var(--space-5) 0 0", paddingTop: "var(--space-4)", borderTop: "1px solid var(--color-ink-15)", fontFamily: "var(--font-body)", fontSize: "var(--text-small)", color: "var(--color-neutral-dark)", lineHeight: "var(--leading-normal)" }}>
            Farmers keep <strong style={{ color: "var(--color-neutral-darkest)" }}>{fin.farmer_pct}%</strong> of this box.
            Commission is 15% standard, 10% forward, 8% on rescued surplus. Card &amp; courier are added at checkout.
          </p>
        </Card>

        <Card padding="lg" style={{ display: "grid", gap: "var(--space-4)" }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
            <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-regular)", color: "var(--color-neutral-dark)" }}>This week&apos;s box</span>
            <span style={{ fontFamily: "var(--font-heading)", fontWeight: "var(--weight-semibold)", fontSize: "var(--text-h5)", color: "var(--color-neutral-darkest)" }}>{formatPence(fin.subtotal_pence)}</span>
          </div>
          {pendingUnusual && (
            <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-small)", color: "var(--color-potters-clay-dark)" }}>
              Approve the flagged item above to continue.
            </span>
          )}
          {canCheckout ? (
            <Button href="/shop/checkout" size="lg" onClick={() => track("box_approved", { total: fin.subtotal_pence })} style={{ width: "100%", justifyContent: "center" }} iconRight={<Icon name="check" size={18} stroke={2.2} />}>
              Approve &amp; checkout
            </Button>
          ) : (
            <Button type="button" size="lg" disabled style={{ width: "100%", justifyContent: "center", background: "var(--color-neutral-lighter)", borderColor: "var(--color-neutral-lighter)", color: "var(--color-neutral-dark)", cursor: "not-allowed" }}>
              Approve &amp; checkout
            </Button>
          )}
          <p style={{ margin: 0, textAlign: "center", fontFamily: "var(--font-body)", fontSize: "var(--text-small)", color: "var(--color-neutral)" }}>
            Nothing&apos;s charged until you approve. Skip any week.
          </p>
        </Card>
      </div>
    </div>
  );
}

const linkBtn: React.CSSProperties = {
  background: "transparent",
  border: "none",
  padding: 0,
  cursor: "pointer",
  fontFamily: "var(--font-body)",
  fontSize: "var(--text-small)",
  fontWeight: "var(--weight-medium)",
  color: "var(--color-olive-drab-dark)",
};
