"use client";

import * as React from "react";
import { Card } from "@/components/croftly/card";
import { Badge } from "@/components/croftly/badge";
import { Button } from "@/components/croftly/button";
import { Icon } from "@/components/croftly/icon";
import { Radio } from "@/components/croftly/ds-form";
import { HwIcon } from "@/components/site/hiw";

// "Approve before charged" trust device — reproduced from the prototype HiW helper.
export function ApproveCard() {
  const [approved, setApproved] = React.useState(false);
  return (
    <Card padding="lg" style={{ background: "var(--color-white)", display: "grid", gap: "var(--space-6)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-4)" }}>
        <div>
          <p style={{ margin: "0 0 0.15rem", fontFamily: "var(--font-body)", fontWeight: "var(--weight-semibold)", fontSize: "var(--text-small)", letterSpacing: "0.02em", textTransform: "uppercase", color: "var(--color-neutral)" }}>Your box · this week</p>
          <div style={{ fontFamily: "var(--font-heading)", fontWeight: "var(--weight-medium)", fontSize: "var(--text-h6)", color: "var(--color-neutral-darkest)" }}>Seasonal veg + eggs · £24.00</div>
        </div>
        <Badge variant="solid" tone="fresh">Not charged yet</Badge>
      </div>

      <div style={{ display: "grid", gap: "var(--space-4)", padding: "var(--space-5)", borderRadius: "var(--radius-card)", background: "var(--color-tulip-tree-lighter)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontFamily: "var(--font-heading)", fontWeight: "var(--weight-medium)", fontSize: "var(--text-regular)", color: "var(--color-potters-clay-dark)" }}>
          <HwIcon name="shield" size={20} stroke={2} /> Allergies you set are never sent
        </div>
        <p style={{ margin: 0, fontFamily: "var(--font-body)", fontSize: "var(--text-small)", color: "var(--color-neutral-darker)", lineHeight: "var(--leading-normal)" }}>
          You&apos;ve told us to <strong>always avoid nuts and shellfish</strong>. These farms and substitutes are filtered before your box is ever built.
        </p>
      </div>

      <div style={{ display: "grid", gap: "var(--space-3)" }}>
        <p style={{ margin: 0, fontFamily: "var(--font-body)", fontWeight: "var(--weight-semibold)", fontSize: "var(--text-small)", color: "var(--color-neutral)" }}>If a farm runs short, you&apos;d like us to…</p>
        <Radio name="sub" value="similar" label="Swap for something similar from another nearby farm" defaultChecked />
        <Radio name="sub" value="ask" label="Ask me first before swapping anything" />
        <Radio name="sub" value="refund" label="Leave it out and refund that item" />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)", flexWrap: "wrap", paddingTop: "var(--space-2)" }}>
        <Button onClick={() => setApproved(true)} iconRight={approved ? <Icon name="check" size={18} stroke={2.4} /> : undefined}>
          {approved ? "Box approved" : "Approve this box"}
        </Button>
        <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-small)", color: "var(--color-neutral)" }}>
          {approved ? "Card charged only now — never before." : "Nothing leaves your card until you tap approve."}
        </span>
      </div>
    </Card>
  );
}
