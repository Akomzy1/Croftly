"use client";

import * as React from "react";

// Croftly DS form controls — reproduced verbatim from the DS (components/forms/*).
// Input is underlined (bottom border only) with optional leading icon/prefix;
// Textarea is a full outlined box; Checkbox is a 4px box, olive when checked.

export function Input({
  icon,
  prefix,
  invalid = false,
  style = {},
  onFocus,
  onBlur,
  ...props
}: {
  icon?: React.ReactNode;
  prefix?: React.ReactNode;
  invalid?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const [focus, setFocus] = React.useState(false);
  const borderColor = invalid
    ? "var(--color-tulip-tree-dark)"
    : focus
      ? "var(--color-olive-drab)"
      : "var(--scheme-border, var(--color-ink-15))";
  return (
    <div style={{ display: "flex", alignItems: "center", width: "100%", borderBottom: `1px solid ${borderColor}`, transition: "border-color var(--dur-base) var(--ease-standard)" }}>
      {prefix && (
        <span style={{ fontFamily: "var(--font-body)", color: "var(--color-neutral)", paddingRight: "0.25rem", fontSize: "var(--text-regular)" }}>{prefix}</span>
      )}
      {icon && <span style={{ display: "inline-flex", color: "var(--color-neutral)", marginRight: "0.5rem" }}>{icon}</span>}
      <input
        onFocus={(e) => {
          setFocus(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocus(false);
          onBlur?.(e);
        }}
        style={{
          flex: 1,
          minWidth: 0,
          border: "none",
          outline: "none",
          background: "transparent",
          padding: "0.625rem 0",
          fontFamily: "var(--font-body)",
          fontSize: "var(--text-regular)",
          color: "var(--scheme-text, var(--color-neutral-darkest))",
          ...style,
        }}
        {...props}
      />
    </div>
  );
}

export function Textarea({
  invalid = false,
  style = {},
  onFocus,
  onBlur,
  ...props
}: { invalid?: boolean } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const [focus, setFocus] = React.useState(false);
  const borderColor = invalid
    ? "var(--color-tulip-tree-dark)"
    : focus
      ? "var(--color-olive-drab)"
      : "var(--scheme-border, var(--color-ink-15))";
  return (
    <textarea
      onFocus={(e) => {
        setFocus(true);
        onFocus?.(e);
      }}
      onBlur={(e) => {
        setFocus(false);
        onBlur?.(e);
      }}
      style={{
        width: "100%",
        minHeight: "7rem",
        border: `1px solid ${borderColor}`,
        borderRadius: "var(--radius-input)",
        background: "var(--scheme-foreground, var(--color-white))",
        padding: "0.75rem 0.875rem",
        fontFamily: "var(--font-body)",
        fontSize: "var(--text-regular)",
        color: "var(--scheme-text, var(--color-neutral-darkest))",
        outline: "none",
        resize: "vertical",
        transition: "border-color var(--dur-base) var(--ease-standard)",
        ...style,
      }}
      {...props}
    />
  );
}

export function Radio({
  label,
  checked,
  defaultChecked,
  onChange,
  style = {},
  ...props
}: {
  label?: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const [internal, setInternal] = React.useState(!!defaultChecked);
  const isControlled = checked !== undefined;
  const on = isControlled ? checked : internal;
  const toggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) setInternal(e.target.checked);
    onChange?.(e);
  };
  return (
    <label style={{ display: "inline-flex", alignItems: "center", gap: "0.625rem", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "var(--text-regular)", color: "var(--scheme-text, var(--color-neutral-darkest))", ...style }}>
      <span
        style={{
          width: "1.25rem",
          height: "1.25rem",
          borderRadius: "999px",
          border: `1px solid ${on ? "var(--color-olive-drab)" : "var(--scheme-border, var(--color-ink-20))"}`,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          transition: "border-color var(--dur-fast) var(--ease-standard)",
        }}
      >
        {on && <span style={{ width: "0.625rem", height: "0.625rem", borderRadius: "999px", background: "var(--color-olive-drab)" }} />}
      </span>
      <input type="radio" checked={on} onChange={toggle} style={{ position: "absolute", opacity: 0, width: 0, height: 0 }} {...props} />
      {label}
    </label>
  );
}

export function Checkbox({
  label,
  checked,
  defaultChecked,
  onChange,
  style = {},
  ...props
}: {
  label?: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const [internal, setInternal] = React.useState(!!defaultChecked);
  const isControlled = checked !== undefined;
  const on = isControlled ? checked : internal;
  const toggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) setInternal(e.target.checked);
    onChange?.(e);
  };
  return (
    <label style={{ display: "inline-flex", alignItems: "center", gap: "0.625rem", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "var(--text-regular)", color: "var(--scheme-text, var(--color-neutral-darkest))", ...style }}>
      <span
        style={{
          width: "1.25rem",
          height: "1.25rem",
          borderRadius: "var(--radius-checkbox)",
          border: `1px solid ${on ? "var(--color-olive-drab)" : "var(--scheme-border, var(--color-ink-20))"}`,
          background: on ? "var(--color-olive-drab)" : "transparent",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          transition: "background var(--dur-fast) var(--ease-standard), border-color var(--dur-fast) var(--ease-standard)",
        }}
      >
        {on && (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </span>
      <input type="checkbox" checked={on} onChange={toggle} style={{ position: "absolute", opacity: 0, width: 0, height: 0 }} {...props} />
      {label}
    </label>
  );
}
