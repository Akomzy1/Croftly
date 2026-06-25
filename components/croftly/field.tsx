import * as React from "react";

// Minimal token-faithful form controls. DEVIATION: no prototype exists for
// forms/auth yet, so these are built to the Croftly design tokens (radius-input,
// border-default, olive focus ring) per CLAUDE.md rather than a prototype.

export function Field({
  label,
  htmlFor,
  children,
  hint,
}: {
  label: string;
  htmlFor?: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label htmlFor={htmlFor} style={{ display: "grid", gap: "0.4rem" }}>
      <span
        style={{
          fontFamily: "var(--font-body)",
          fontWeight: "var(--weight-semibold)",
          fontSize: "var(--text-small)",
          color: "var(--color-neutral-darker)",
        }}
      >
        {label}
      </span>
      {children}
      {hint && (
        <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-small)", color: "var(--color-neutral)" }}>
          {hint}
        </span>
      )}
    </label>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className="croftly-input" {...props} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className="croftly-select" {...props} />;
}
