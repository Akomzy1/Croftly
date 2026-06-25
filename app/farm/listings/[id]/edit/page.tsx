import Link from "next/link";
import { redirect } from "next/navigation";
import { getFarmData, getOwnedProduct } from "@/lib/farm/queries";
import { AppShell } from "@/components/site/app-shell";
import { Card } from "@/components/croftly/card";
import { ProductForm } from "@/components/farm/product-form";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const farm = await getFarmData();
  if (farm.status === "anonymous") redirect("/auth/sign-in");
  if (farm.status === "no_producer") redirect("/shop");
  // Editing needs a live project + an owned product; otherwise bounce to listings.
  if (farm.status === "unconfigured") redirect("/farm");

  const product = await getOwnedProduct(id);
  if (!product) redirect("/farm");

  return (
    <AppShell role="farmer">
      <div className="mx-auto grid w-full max-w-[44rem] gap-6">
        <div>
          <Link href="/farm" style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-small)", color: "var(--color-olive-drab-dark)", textDecoration: "none" }}>
            ← Back to listings
          </Link>
          <h1 style={{ margin: "var(--space-3) 0 0", fontSize: "var(--text-h4)", color: "var(--color-neutral-darkest)" }}>Edit product</h1>
        </div>
        <Card padding="lg">
          <ProductForm product={product} />
        </Card>
      </div>
    </AppShell>
  );
}
