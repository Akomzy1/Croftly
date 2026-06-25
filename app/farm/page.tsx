import { redirect } from "next/navigation";
import { getSessionState } from "@/lib/auth/session";
import { roleHome } from "@/lib/auth/roles";
import { AppShell } from "@/components/site/app-shell";
import { Button } from "@/components/croftly/button";

// Farmer home. Guards by role; the supply-broadcast console is built in Prompt 4.
export default async function FarmPage() {
  const session = await getSessionState();
  if (session.status === "anonymous") redirect("/auth/sign-in");
  if (session.status === "authenticated" && session.role !== "farmer") {
    redirect(roleHome(session.role));
  }

  const preview = session.status === "unconfigured";

  return (
    <AppShell role="farmer" email={preview ? null : session.status === "authenticated" ? session.email : null} preview={preview}>
      <div style={{ maxWidth: "44rem", display: "grid", gap: "var(--space-6)" }}>
        <h1 style={{ margin: 0, fontSize: "var(--text-h3)", color: "var(--color-neutral-darkest)" }}>
          Your listings
        </h1>
        <p style={{ margin: 0, fontFamily: "var(--font-body)", fontSize: "var(--text-large)", color: "var(--color-neutral-dark)", lineHeight: "var(--leading-normal)" }}>
          List what you have, take forward orders and clear gluts — keep 85% of every order, up to
          92% on surplus. We match every order to a courier, so there&apos;s no delivery to run.
        </p>
        <div>
          <Button href="/farm/listings/new" size="lg" style={{ background: "var(--color-potters-clay)", borderColor: "var(--color-potters-clay)" }}>
            Add a product
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
