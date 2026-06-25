import { redirect } from "next/navigation";
import { getSessionState } from "@/lib/auth/session";
import { roleHome } from "@/lib/auth/roles";
import { AppShell } from "@/components/site/app-shell";
import { Button } from "@/components/croftly/button";

// Household home. Guards by role; the matched box itself is built in Prompt 6.
export default async function ShopPage() {
  const session = await getSessionState();
  if (session.status === "anonymous") redirect("/auth/sign-in");
  if (session.status === "authenticated" && session.role !== "household") {
    redirect(roleHome(session.role));
  }

  const preview = session.status === "unconfigured";

  return (
    <AppShell role="household" email={preview ? null : session.status === "authenticated" ? session.email : null} preview={preview}>
      <div style={{ maxWidth: "44rem", display: "grid", gap: "var(--space-6)" }}>
        <h1 style={{ margin: 0, fontSize: "var(--text-h3)", color: "var(--color-neutral-darkest)" }}>
          This week&apos;s box
        </h1>
        <p style={{ margin: 0, fontFamily: "var(--font-body)", fontSize: "var(--text-large)", color: "var(--color-neutral-dark)", lineHeight: "var(--leading-normal)" }}>
          Tell us what you like and we&apos;ll match it to what nearby farms have this week. Your
          composed box and money-split will appear here.
        </p>
        <div>
          <Button href="/shop/setup" size="lg">Set my food intent</Button>
        </div>
      </div>
    </AppShell>
  );
}
