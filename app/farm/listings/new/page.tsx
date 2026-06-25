import Link from "next/link";
import { redirect } from "next/navigation";
import { getFarmData } from "@/lib/farm/queries";
import { AppShell } from "@/components/site/app-shell";
import { Card } from "@/components/croftly/card";
import { ProductForm } from "@/components/farm/product-form";

export default async function NewProductPage() {
  const farm = await getFarmData();
  if (farm.status === "anonymous") redirect("/auth/sign-in");
  if (farm.status === "no_producer") redirect("/shop");

  return (
    <AppShell role="farmer" preview={farm.status === "unconfigured"}>
      <div className="mx-auto grid w-full max-w-[44rem] gap-6">
        <div>
          <Link href="/farm" style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-small)", color: "var(--color-olive-drab-dark)", textDecoration: "none" }}>
            ← Back to listings
          </Link>
          <h1 style={{ margin: "var(--space-3) 0 0", fontSize: "var(--text-h4)", color: "var(--color-neutral-darkest)" }}>Add a product</h1>
          <p style={{ margin: "var(--space-2) 0 0", fontFamily: "var(--font-body)", fontSize: "var(--text-regular)", color: "var(--color-neutral-dark)" }}>
            You set the price and keep at least 85%. Flag anything you&apos;re trying to clear as a glut deal.
          </p>
        </div>
        <Card padding="lg">
          <ProductForm />
        </Card>
      </div>
    </AppShell>
  );
}
