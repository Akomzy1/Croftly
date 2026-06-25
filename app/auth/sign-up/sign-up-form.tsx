"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { roleHome, type Role } from "@/lib/auth/roles";
import { Button } from "@/components/croftly/button";
import { Field, Input, Select } from "@/components/croftly/field";

type AreaOption = { id: string; name: string; region: string };

export function SignUpForm({ role, areas }: { role: Role; areas: AreaOption[] }) {
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [areaId, setAreaId] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [checkEmail, setCheckEmail] = React.useState(false);

  const farmer = role === "farmer";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const supabase = createClient();
    if (!supabase) {
      setError("Accounts aren't configured yet — connect a Supabase project to enable sign-up.");
      return;
    }
    setSubmitting(true);
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { role, name, area_id: areaId || null },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${roleHome(role)}`,
      },
    });
    setSubmitting(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }
    // Auto-confirm on → session present → straight to the app. Otherwise the
    // user must confirm their email first.
    if (data.session) {
      router.push(roleHome(role));
      router.refresh();
    } else {
      setCheckEmail(true);
    }
  }

  if (checkEmail) {
    return (
      <div style={{ display: "grid", gap: "var(--space-3)" }}>
        <p style={{ margin: 0, fontFamily: "var(--font-body)", fontSize: "var(--text-regular)", color: "var(--color-neutral-dark)", lineHeight: "var(--leading-normal)" }}>
          Almost there — we&apos;ve sent a confirmation link to <strong>{email}</strong>. Click it to
          finish setting up your {farmer ? "farm" : "account"}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} style={{ display: "grid", gap: "var(--space-6)" }}>
      <Field label={farmer ? "Farm name" : "Your name"}>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={farmer ? "e.g. Hartley's Field" : "e.g. Sam Taylor"} required autoComplete="name" />
      </Field>
      <Field label="Email">
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required autoComplete="email" />
      </Field>
      <Field label="Password" hint="At least 6 characters.">
        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a password" required autoComplete="new-password" minLength={6} />
      </Field>
      <Field label="Your area" hint={areas.length === 0 ? "We're opening areas region by region — pick yours later." : "Where you'll shop or sell."}>
        <Select value={areaId} onChange={(e) => setAreaId(e.target.value)} disabled={areas.length === 0}>
          <option value="">{areas.length === 0 ? "No areas live yet" : "Select your area"}</option>
          {areas.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name} — {a.region}
            </option>
          ))}
        </Select>
      </Field>

      {error && (
        <p style={{ margin: 0, fontFamily: "var(--font-body)", fontSize: "var(--text-small)", color: "var(--color-potters-clay-dark)", background: "var(--color-tulip-tree-lighter)", border: "1px solid var(--color-tulip-tree-light)", borderRadius: "var(--radius-input)", padding: "0.625rem 0.75rem" }}>
          {error}
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={submitting}
        style={{ width: "100%", justifyContent: "center", ...(farmer ? { background: "var(--color-potters-clay)", borderColor: "var(--color-potters-clay)" } : {}) }}
      >
        {submitting ? "Creating…" : farmer ? "Create my farm account" : "Create my account"}
      </Button>

      <p style={{ margin: 0, textAlign: "center", fontFamily: "var(--font-body)", fontSize: "var(--text-small)", color: "var(--color-neutral)" }}>
        {farmer ? "Want to shop instead? " : "Are you a farmer? "}
        <Link href={`/auth/sign-up?role=${farmer ? "household" : "farmer"}`} style={{ color: "var(--color-olive-drab-dark)", fontWeight: "var(--weight-medium)", textDecoration: "none" }}>
          {farmer ? "Create a shopper account" : "Sell your produce"}
        </Link>
      </p>
    </form>
  );
}
