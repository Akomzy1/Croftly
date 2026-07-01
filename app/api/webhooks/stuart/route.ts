import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { mapStuartStatus } from "@/lib/fulfilment";
import type { OrderStatus } from "@/lib/supabase/types";

// Stuart delivery-status webhook. Verifies the signed payload, updates the matching
// courier_jobs leg, and recomputes the parent order's status. Service-role only.
//
// PRODUCTION: add ret/replay protection (event ids), and reconcile against a poll
// in case a webhook is missed.

// Order of progression — the overall order reflects the SLOWEST leg.
const RANK: Record<OrderStatus, number> = {
  pending: 0,
  confirmed: 1,
  preparing: 2,
  ready: 3,
  out_for_delivery: 4,
  delivered: 5,
  cancelled: -1,
};

function verify(raw: string, signature: string | null, secret: string): boolean {
  if (!signature) return false;
  const digest = crypto.createHmac("sha256", secret).update(raw, "utf8").digest("hex");
  // constant-time compare
  const a = Buffer.from(digest);
  const b = Buffer.from(signature);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  const raw = await request.text();

  const secret = process.env.STUART_WEBHOOK_SECRET;
  if (secret) {
    const sig = request.headers.get("x-stuart-signature") || request.headers.get("X-Stuart-Signature");
    if (!verify(raw, sig, secret)) {
      return NextResponse.json({ error: "invalid signature" }, { status: 401 });
    }
  } // else: no secret configured (dev) — accept unsigned. // PRODUCTION: require a secret.

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }

  // Stuart sends job and delivery events in slightly different shapes; extract
  // defensively. We stored provider_job_id = the Stuart JOB id.
  type StuartEventData = {
    id?: string | number;
    status?: string;
    tracking_url?: string;
    job?: { id?: string | number };
    deliveries?: Array<{ status?: string; tracking_url?: string }>;
  };
  const d = ((payload.data as StuartEventData) ?? (payload as StuartEventData)) ?? {};
  const jobId = String(d.job?.id ?? d.id ?? "");
  const stuartStatus: string | null = d.status ?? d.deliveries?.[0]?.status ?? null;
  const trackingUrl: string | null = d.deliveries?.[0]?.tracking_url ?? d.tracking_url ?? null;
  if (!jobId || !stuartStatus) {
    return NextResponse.json({ ok: true, ignored: "no job id / status" });
  }

  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ error: "service role not configured" }, { status: 500 });

  // Update the matching leg.
  const { data: job } = await admin
    .from("courier_jobs")
    .update({ status: stuartStatus, ...(trackingUrl ? { tracking_url: trackingUrl } : {}) })
    .eq("provider_job_id", jobId)
    .select("order_id")
    .maybeSingle();

  if (!job) return NextResponse.json({ ok: true, ignored: "unknown job " + jobId });

  // Recompute the order status from ALL its legs (slowest non-cancelled leg wins;
  // all delivered → delivered; all cancelled → cancelled).
  const { data: legs } = await admin.from("courier_jobs").select("status").eq("order_id", job.order_id);
  const mapped = (legs ?? []).map((l) => mapStuartStatus(l.status));
  const active = mapped.filter((s) => s !== "cancelled");
  let orderStatus: OrderStatus;
  if (active.length === 0) orderStatus = "cancelled";
  else orderStatus = active.reduce((min, s) => (RANK[s] < RANK[min] ? s : min), active[0]);

  await admin.from("orders").update({ status: orderStatus }).eq("id", job.order_id);

  return NextResponse.json({ ok: true, order: job.order_id, status: orderStatus });
}
