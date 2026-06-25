"use client";

import * as React from "react";

// Croftly Accordion — FAQ-style disclosure. Reproduced verbatim from the DS
// (components/feedback/Accordion.jsx): hairline dividers, chevron rotates,
// grid-rows animation; one open at a time by default.
export type AccordionItem = { q: React.ReactNode; a: React.ReactNode };

export function Accordion({
  items = [],
  allowMultiple = false,
  defaultOpen = [],
  style = {},
}: {
  items?: AccordionItem[];
  allowMultiple?: boolean;
  defaultOpen?: number[];
  style?: React.CSSProperties;
}) {
  const [open, setOpen] = React.useState<Set<number>>(new Set(defaultOpen));
  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(allowMultiple ? prev : []);
      if (prev.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <div style={{ borderTop: "1px solid var(--scheme-border, var(--color-ink-15))", ...style }}>
      {items.map((item, i) => {
        const isOpen = open.has(i);
        return (
          <div key={i} style={{ borderBottom: "1px solid var(--scheme-border, var(--color-ink-15))" }}>
            <button
              onClick={() => toggle(i)}
              aria-expanded={isOpen}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1rem",
                width: "100%",
                padding: "1.25rem 0",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                fontFamily: "var(--font-heading)",
                fontWeight: "var(--weight-medium)",
                fontSize: "var(--text-h6)",
                color: "var(--scheme-text, var(--color-neutral-darkest))",
              }}
            >
              {item.q}
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ flexShrink: 0, transition: "transform var(--dur-slow) var(--ease-standard)", transform: isOpen ? "rotate(180deg)" : "none" }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            <div style={{ display: "grid", gridTemplateRows: isOpen ? "1fr" : "0fr", transition: "grid-template-rows var(--dur-slow) var(--ease-standard)" }}>
              <div style={{ overflow: "hidden" }}>
                <div
                  style={{
                    paddingBottom: "1.25rem",
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--text-regular)",
                    color: "var(--scheme-text-muted, var(--color-neutral-dark))",
                    lineHeight: "var(--leading-normal)",
                    maxWidth: "52ch",
                  }}
                >
                  {item.a}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
