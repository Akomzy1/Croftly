import { createClient } from "@/lib/supabase/server";
import type { Producer, Product } from "@/lib/supabase/types";

export type FarmPayout = {
  id: string;
  order_id: string;
  farmer_pence: number;
  platform_pence: number;
  created_at: string;
};

export type FarmData =
  | { status: "unconfigured" }
  | { status: "anonymous" }
  | { status: "no_producer" }
  | { status: "ok"; producer: Producer; products: Product[]; payouts: FarmPayout[] };

// Load the signed-in farmer's producer row + their products for the console.
export async function getFarmData(): Promise<FarmData> {
  const supabase = await createClient();
  if (!supabase) return { status: "unconfigured" };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { status: "anonymous" };

  const { data: producer } = await supabase
    .from("producers")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!producer) return { status: "no_producer" };

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("producer_id", producer.id)
    .order("created_at", { ascending: false });

  // Incoming orders surface as the producer's payouts (one per order per producer).
  const { data: payouts } = await supabase
    .from("payouts")
    .select("id, order_id, farmer_pence, platform_pence, created_at")
    .eq("producer_id", producer.id)
    .order("created_at", { ascending: false });

  return { status: "ok", producer, products: products ?? [], payouts: payouts ?? [] };
}

// Single product owned by the signed-in farmer (for the edit form).
export async function getOwnedProduct(id: string): Promise<Product | null> {
  const supabase = await createClient();
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: product } = await supabase.from("products").select("*").eq("id", id).maybeSingle();
  if (!product) return null;

  // Verify ownership (defence in depth alongside RLS).
  const { data: producer } = await supabase
    .from("producers")
    .select("id")
    .eq("id", product.producer_id)
    .eq("user_id", user.id)
    .maybeSingle();

  return producer ? product : null;
}
