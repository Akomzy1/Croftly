import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/site/auth-shell";
import { SignInForm } from "./sign-in-form";

export const metadata: Metadata = {
  title: "Sign in to Croftly",
};

export default function SignInPage() {
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to your Croftly account."
      footer={
        <>
          New to Croftly?{" "}
          <Link href="/get-started" style={{ color: "var(--color-olive-drab-dark)", fontWeight: "var(--weight-medium)", textDecoration: "none" }}>
            Get started
          </Link>
        </>
      }
    >
      <SignInForm />
    </AuthShell>
  );
}
