import { NextResponse } from "next/server";
import { applyCourierEvent, verifyHmacHex } from "@/lib/fulfilment/webhook";

// Uber Direct delivery-status webhook (the lead on-demand courier). Verifies the
// signed payload, updates the matching courier_jobs leg, and recomputes the order
// status. Service-role only. // PRODUCTION: add replay protection (event ids) + a
// reconciling poll in case an event is missed.
export async function POST(request: Request) {
  const raw = await request.text();

  // Uber signs with the client secret unless a dedicated webhook secret is set.
  const secret = process.env.UBER_WEBHOOK_SECRET || process.env.UBER_CLIENT_SECRET;
  if (secret) {
    const sig = request.headers.get("x-uber-signature");
    if (!verifyHmacHex(raw, sig, secret)) {
      return NextResponse.json({ error: "invalid signature" }, { status: 401 });
    }
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }

  // Uber Direct delivery.status events: the delivery object is under `data`.
  type UberEvent = {
    delivery_id?: string;
    status?: string;
    data?: { id?: string; status?: string; tracking_url?: string };
  };
  const p = payload as UberEvent;
  const jobId = String(p.data?.id ?? p.delivery_id ?? "");
  const status = p.data?.status ?? p.status ?? "";
  const trackingUrl = p.data?.tracking_url ?? null;

  const result = await applyCourierEvent({ jobId, status, trackingUrl });
  return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}
