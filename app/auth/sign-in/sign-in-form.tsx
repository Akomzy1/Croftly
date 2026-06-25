"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { roleFromUser, roleHome } from "@/lib/auth/roles";
import { Button } from "@/components/croftly/button";
import { Field, Input } from "@/components/croftly/field";

export function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const supabase = createClient();
    if (!supabase) {
      setError("Accounts aren't configured yet — connect a Supabase project to enable sign-in.");
      return;
    }
    setSubmitting(true);
    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setSubmitting(false);
    if (signInError) {
      setError(signInError.message);
      return;
    }
    router.push(roleHome(roleFromUser(data.user)));
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} style={{ display: "grid", gap: "var(--space-6)" }}>
      <Field label="Email">
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required autoComplete="email" />
      </Field>
      <Field label="Password">
        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" required autoComplete="current-password" />
      </Field>

      {error && (
        <p style={{ margin: 0, fontFamily: "var(--font-body)", fontSize: "var(--text-small)", color: "var(--color-potters-clay-dark)", background: "var(--color-tulip-tree-lighter)", border: "1px solid var(--color-tulip-tree-light)", borderRadius: "var(--radius-input)", padding: "0.625rem 0.75rem" }}>
          {error}
        </p>
      )}

      <Button type="submit" size="lg" disabled={submitting} style={{ width: "100%", justifyContent: "center" }}>
        {submitting ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
