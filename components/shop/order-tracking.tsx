import * as React from "react";
import { Icon } from "@/components/croftly/icon";
import { mapCourierStatus } from "@/lib/fulfilment";
import type { OrderStatus } from "@/lib/supabase/types";

// Courier tracking: driven by the order status + per-farm legs that the courier
// webhook updates. One job per farm → we show each pickup leg + a link. (Courier
// dispatch is simulated in the prototype; this renders whatever status is recorded.)

export type TrackingLeg = { producer_name: string; status: string; tracking_url: string | null };

const STEPS = ["Confirmed", "Farms preparing", "Out for delivery", "Delivered"];
const STEP_INDEX: Record<OrderStatus, number> = {
  pending: 0,
  confirmed: 0,
  preparing: 1,
  ready: 1,
  out_for_delivery: 2,
  delivered: 3,
  cancelled: 0,
};

const LEG_LABEL: Record<OrderStatus, string> = {
  pending: "Scheduled",
  confirmed: "Scheduled",
  preparing: "At the farm",
  ready: "Ready",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export function OrderTracking({ status, legs }: { status: OrderStatus; legs: TrackingLeg[] }) {
  const current = STEP_INDEX[status];
  const cancelled = status === "cancelled";

  return (
    <div>
      <p style={{ margin: "0 0 var(--space-4)", fontFamily: "var(--font-body)", fontWeight: "var(--weight-semibold)", fontSize: "var(--text-small)", letterSpacing: "0.02em", textTransform: "uppercase", color: "var(--color-neutral)" }}>
        Delivery tracking
      </p>

      {cancelled ? (
        <p style={{ margin: "0 0 var(--space-4)", fontFamily: "var(--font-body)", fontSize: "var(--text-regular)", color: "var(--color-potters-clay-dark)" }}>
          This delivery was cancelled.
        </p>
      ) : (
        <ol style={{ listStyle: "none", margin: "0 0 var(--space-5)", padding: 0, display: "grid", gap: 0 }}>
          {STEPS.map((label, i) => {
            const done = i <= current;
            const last = i === STEPS.length - 1;
            return (
              <li key={label} style={{ display: "flex", gap: "0.75rem" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <span style={{ width: "1.5rem", height: "1.5rem", borderRadius: "999px", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: done ? "var(--color-olive-drab)" : "var(--color-neutral-lightest)", color: done ? "var(--color-white)" : "var(--color-neutral)", border: done ? "none" : "1px solid var(--color-ink-15)" }}>
                    {done ? <Icon name="check" size={13} stroke={3} /> : <span style={{ width: "0.4rem", height: "0.4rem", borderRadius: "999px", background: "var(--color-neutral-light)" }} />}
                  </span>
                  {!last && <span style={{ width: "1px", flex: 1, minHeight: "1.1rem", background: "var(--color-ink-15)" }} />}
                </div>
                <span style={{ paddingBottom: last ? 0 : "var(--space-4)", fontFamily: "var(--font-body)", fontSize: "var(--text-regular)", color: i === current ? "var(--color-neutral-darkest)" : "var(--color-neutral-dark)", fontWeight: i === current ? "var(--weight-medium)" : "var(--weight-regular)" }}>
                  {label}
                </span>
              </li>
            );
          })}
        </ol>
      )}

      {/* Per-farm legs (one courier job per farm). */}
      <div style={{ display: "grid", gap: "0.5rem", paddingTop: "var(--space-4)", borderTop: "1px solid var(--color-ink-15)" }}>
        {legs.map((leg, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem" }}>
            <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-small)", color: "var(--color-neutral-darkest)" }}>
              {leg.producer_name} <span style={{ color: "var(--color-neutral)" }}>· {LEG_LABEL[mapCourierStatus(leg.status)]}</span>
            </span>
            {leg.tracking_url && (
              <a href={leg.tracking_url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", fontFamily: "var(--font-body)", fontSize: "var(--text-small)", color: "var(--color-olive-drab-dark)", textDecoration: "none" }}>
                Track <Icon name="arrowRight" size={14} stroke={2} />
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
