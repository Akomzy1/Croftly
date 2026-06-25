import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isRole, type Role } from "@/lib/auth/roles";
import { AuthShell } from "@/components/site/auth-shell";
import { SignUpForm } from "./sign-up-form";

export const metadata: Metadata = {
  title: "Create your Croftly account",
};

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const { role: roleParam } = await searchParams;
  const role: Role = isRole(roleParam) ? roleParam : "household";

  // Fetch live areas for the picker (empty until a Supabase project + seed exist).
  const supabase = await createClient();
  const { data: areas } = supabase
    ? await supabase.from("areas").select("id, name, region").order("name")
    : { data: null };

  const farmer = role === "farmer";

  return (
    <AuthShell
      title={farmer ? "Sell direct on Croftly" : "Get fresh food from farms near you"}
      subtitle={
        farmer
          ? "Free to list. Keep 85% of every order — up to 92% on surplus. No delivery to run."
          : "Free to join, no membership fee. Pause, skip or cancel any week."
      }
      footer={
        <>
          Already with us?{" "}
          <Link href="/auth/sign-in" style={{ color: "var(--color-olive-drab-dark)", fontWeight: "var(--weight-medium)", textDecoration: "none" }}>
            Sign in
          </Link>
        </>
      }
    >
      <SignUpForm role={role} areas={areas ?? []} />
    </AuthShell>
  );
}
