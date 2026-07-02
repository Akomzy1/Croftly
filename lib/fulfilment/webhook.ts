import crypto from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { mapCourierStatus } from "./providers";
import type { OrderStatus } from "@/lib/supabase/types";

// Shared courier-webhook processing (used by the Uber Direct + Stuart routes).
// Verifies an HMAC-SHA256 hex signature, updates the matching courier_jobs leg, and
// recomputes the parent order status from all legs (the SLOWEST leg wins).

export function verifyHmacHex(raw: string, signature: string | null, secret: string): boolean {
  if (!signature) return false;
  const digest = crypto.createHmac("sha256", secret).update(raw, "utf8").digest("hex");
  const a = Buffer.from(digest);
  const b = Buffer.from(signature);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

const RANK: Record<OrderStatus, number> = {
  pending: 0,
  confirmed: 1,
  preparing: 2,
  ready: 3,
  out_for_delivery: 4,
  delivered: 5,
  cancelled: -1,
};

export type CourierEvent = { jobId: string; status: string; trackingUrl?: string | null };
export type CourierEventResult = { ok: boolean; order?: string; status?: OrderStatus; ignored?: string; error?: string };

export async function applyCourierEvent(ev: CourierEvent): Promise<CourierEventResult> {
  if (!ev.jobId || !ev.status) return { ok: true, ignored: "no job id / status" };

  const admin = createAdminClient();
  if (!admin) return { ok: false, error: "service role not configured" };

  const { data: job } = await admin
    .from("courier_jobs")
    .update({ status: ev.status, ...(ev.trackingUrl ? { tracking_url: ev.trackingUrl } : {}) })
    .eq("provider_job_id", ev.jobId)
    .select("order_id")
    .maybeSingle();
  if (!job) return { ok: true, ignored: "unknown job " + ev.jobId };

  const { data: legs } = await admin.from("courier_jobs").select("status").eq("order_id", job.order_id);
  const mapped = (legs ?? []).map((l) => mapCourierStatus(l.status));
  const active = mapped.filter((s) => s !== "cancelled");
  const orderStatus: OrderStatus = active.length === 0 ? "cancelled" : active.reduce((min, s) => (RANK[s] < RANK[min] ? s : min), active[0]);

  await admin.from("orders").update({ status: orderStatus }).eq("id", job.order_id);
  return { ok: true, order: job.order_id, status: orderStatus };
}
