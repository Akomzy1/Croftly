"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getShopData } from "@/lib/shop/queries";
import { getStripe } from "@/lib/stripe/client";
import { splitLine } from "@/lib/commission";
import { courierFeePence, belowDeliveryMinimum, deliveryShortfallPence } from "@/lib/fulfilment";
import { formatPence } from "@/lib/money";
import type { FulfilmentType } from "@/lib/supabase/types";

export type PlaceOrderState = { error?: string };

// Checkout (Prompt 9). Creates the order, order_items (with the per-line
// commission/farmer split), and payouts, then shows the money-split confirmation.
//
// NOTE: box edits in /shop/box are a client-side preview; checkout re-composes the
// box deterministically server-side so prices/splits are never trusted from the client.
// PRODUCTION: the box the household approved should be persisted and charged.
export async function placeOrder(_prev: PlaceOrderState, formData: FormData): Promise<PlaceOrderState> {
  const method: FulfilmentType = formData.get("method") === "courier" ? "courier" : "collection";
  const collectionPointId = (formData.get("collection_point_id") as string | null)?.trim() || null;

  const supabase = await createClient();
  if (!supabase) return { error: "Accounts aren't configured yet — connect Supabase to check out." };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/sign-up?role=household");

  const today = new Date().toISOString().slice(0, 10);
  const data = await getShopData(today);
  if (data.status !== "ok") return { error: "We couldn't build your box to check out." };
  const { box, courier } = data;
  if (box.lines.length === 0) return { error: "Your box is empty." };

  // DELIVERY-only soft minimum (D14): courier baskets below MIN_DELIVERY_ORDER_PENCE
  // are nudged toward free collection, not silently rejected. Collection has NO
  // minimum, ever — so this check is gated on the courier path only and the
  // message always offers the no-minimum collection path. (Server-side guard;
  // the UI surfaces the same nudge.)
  if (method === "courier" && belowDeliveryMinimum(box.subtotal_pence)) {
    const more = formatPence(deliveryShortfallPence(box.subtotal_pence));
    return { error: `Add ${more} more for delivery — or collect this order free from a nearby point, with no minimum.` };
  }

  const { data: household } = await supabase.from("households").select("id").eq("user_id", user.id).maybeSingle();
  if (!household) return { error: "We couldn't find your household profile." };

  const admin = createAdminClient();
  if (!admin) return { error: "Checkout isn't fully configured yet (missing service-role key)." };

  // Free delivery once the basket clears FREE_DELIVERY_THRESHOLD_PENCE; otherwise
  // the courier fee is passed through at cost. Collection is always £0.
  const deliveryFee = method === "courier" && courier ? courierFeePence(box.subtotal_pence, courier.fee_pence) : 0;
  const totalPence = box.subtotal_pence + deliveryFee;

  // PRODUCTION: create a Stripe Checkout Session / PaymentIntent and only create
  // the order on confirmed payment (via webhook). The prototype simulates a
  // successful TEST charge; if a test key is present we touch Stripe best-effort.
  const stripe = getStripe();
  if (stripe) {
    try {
      await stripe.paymentIntents.create({
        amount: totalPence,
        currency: "gbp",
        metadata: { household_id: household.id, kind: "croftly_box" },
        automatic_payment_methods: { enabled: true },
      });
    } catch {
      // Non-fatal in the prototype — we still record the order + simulated split.
    }
  }

  // ---- create order ----
  const { data: order, error: oErr } = await admin
    .from("orders")
    .insert({
      household_id: household.id,
      status: "confirmed",
      fulfilment_type: method,
      collection_point_id: method === "collection" ? collectionPointId : null,
      delivery_fee_pence: deliveryFee,
    })
    .select("id")
    .single();
  if (oErr || !order) return { error: oErr?.message ?? "Couldn't create the order." };

  // ---- order_items (per-line commission + farmer split) ----
  const items = box.lines.map((l) => {
    const sp = splitLine(l.line_pence, l);
    return {
      order_id: order.id,
      product_id: l.product_id,
      producer_id: l.producer_id,
      qty: l.qty,
      line_price_pence: l.line_pence,
      commission_rate: sp.commission_rate,
      commission_pence: sp.commission_pence,
      farmer_pence: sp.farmer_pence,
      is_glut: l.is_glut,
      is_forward: l.is_forward,
    };
  });
  const { error: iErr } = await admin.from("order_items").insert(items);
  if (iErr) return { error: iErr.message };

  // ---- payouts per producer (SIMULATED Stripe Connect — recorded & displayed) ----
  const byProducer = new Map<string, { farmer: number; platform: number }>();
  for (const it of items) {
    const cur = byProducer.get(it.producer_id) ?? { farmer: 0, platform: 0 };
    cur.farmer += it.farmer_pence;
    cur.platform += it.commission_pence;
    byProducer.set(it.producer_id, cur);
  }
  const payoutRows = Array.from(byProducer.entries()).map(([producer_id, v]) => ({
    order_id: order.id,
    producer_id,
    farmer_pence: v.farmer,
    platform_pence: v.platform,
    // Courier is paid once at order level (orders.delivery_fee_pence), not per producer.
    courier_pence: 0,
  }));
  // PRODUCTION: Stripe Connect multi-party transfers go here — pay each farmer
  // their farmer_pence, retain platform_pence, and pay the courier. The prototype
  // only RECORDS the split; no real transfers happen.
  const { error: pErr } = await admin.from("payouts").insert(payoutRows);
  if (pErr) return { error: pErr.message };

  redirect(`/shop/orders/${order.id}`);
}
