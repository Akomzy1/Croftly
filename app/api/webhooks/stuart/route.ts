import { NextResponse } from "next/server";
import { applyCourierEvent, verifyHmacHex } from "@/lib/fulfilment/webhook";

// Stuart delivery-status webhook (the food-specialist FALLBACK on-demand courier).
// Verifies the signed payload, updates the matching courier_jobs leg, and recomputes
// the order status. Kept as the reference endpoint for the Stuart fallback adapter.
export async function POST(request: Request) {
  const raw = await request.text();

  const secret = process.env.STUART_WEBHOOK_SECRET;
  if (secret) {
    const sig = request.headers.get("x-stuart-signature");
    if (!verifyHmacHex(raw, sig, secret)) {
      return NextResponse.json({ error: "invalid signature" }, { status: 401 });
    }
  } // else: no secret configured (dev) — accept unsigned. // PRODUCTION: require a secret.

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }

  // Stuart sends job/delivery events in slightly different shapes; extract defensively.
  // We stored provider_job_id = the Stuart JOB id.
  type StuartEventData = {
    id?: string | number;
    status?: string;
    tracking_url?: string;
    job?: { id?: string | number };
    deliveries?: Array<{ status?: string; tracking_url?: string }>;
  };
  const d = ((payload.data as StuartEventData) ?? (payload as StuartEventData)) ?? {};
  const jobId = String(d.job?.id ?? d.id ?? "");
  const status = d.status ?? d.deliveries?.[0]?.status ?? "";
  const trackingUrl = d.deliveries?.[0]?.tracking_url ?? d.tracking_url ?? null;

  const result = await applyCourierEvent({ jobId, status, trackingUrl });
  return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}
