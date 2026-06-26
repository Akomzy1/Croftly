import * as React from "react";
import { Icon } from "@/components/croftly/icon";

// Order status / tracking stub (Prompt 8). The platform owns the delivery
// promise and shows status regardless of who carries the box.
// PRODUCTION: drive this from real order events + the courier API webhook.
export function OrderStatusStub({ fulfilment }: { fulfilment: "collection" | "courier" }) {
  const steps =
    fulfilment === "courier"
      ? ["Confirmed", "Farms preparing", "Picked up by courier", "Out for delivery", "Delivered"]
      : ["Confirmed", "Farms preparing", "Ready to collect", "Collected"];
  const current = 0; // preview: the journey starts once you've approved & paid

  return (
    <div>
      <p style={{ margin: "0 0 var(--space-4)", fontFamily: "var(--font-body)", fontWeight: "var(--weight-semibold)", fontSize: "var(--text-small)", letterSpacing: "0.02em", textTransform: "uppercase", color: "var(--color-neutral)" }}>
        What happens next
      </p>
      <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: "0" }}>
        {steps.map((label, i) => {
          const done = i <= current;
          const last = i === steps.length - 1;
          return (
            <li key={label} style={{ display: "flex", gap: "0.75rem" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span
                  style={{
                    width: "1.5rem",
                    height: "1.5rem",
                    borderRadius: "999px",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    background: done ? "var(--color-olive-drab)" : "var(--color-neutral-lightest)",
                    color: done ? "var(--color-white)" : "var(--color-neutral)",
                    border: done ? "none" : "1px solid var(--color-ink-15)",
                  }}
                >
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
    </div>
  );
}
