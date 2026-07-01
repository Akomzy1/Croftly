import type { ColdChainClass, OrderStatus } from "@/lib/supabase/types";
import type { CourierProvider, CourierQuote, CourierJob, FulfilmentLeg, Address } from "./types";

// Map a Stuart job/delivery status onto Croftly's order_status enum. Used by the
// webhook to advance the order. Unknown statuses fall back to "confirmed".
export function mapStuartStatus(status: string): OrderStatus {
  switch (status) {
    case "new":
    case "scheduled":
    case "pending":
      return "confirmed";
    case "picking":
    case "almost_picking":
    case "waiting_at_pickup":
    case "in_progress":
      return "preparing";
    case "delivering":
    case "almost_delivering":
    case "waiting_at_dropoff":
      return "out_for_delivery";
    case "delivered":
    case "finished":
      return "delivered";
    case "cancelled":
    case "canceled":
    case "expired":
    case "failed":
      return "cancelled";
    default:
      return "confirmed";
  }
}

// Stuart — on-demand courier adapter. Stuart is the food-specialist FALLBACK for the
// chilled/same-day layer (better for fresh/chilled but denser in cities, thinner in
// rural areas); Uber Direct is the intended LEAD (widest UK coverage). DETERMINISTIC,
// no LLM (CLAUDE.md rule 4); the platform integrates couriers, never runs a fleet
// (rule 2).
//
// PROTOTYPE: this adapter is a DOCUMENTED FALLBACK — it is NOT wired into provider
// selection (see providers/index.ts → enabledProviders()), so no real API call is
// made in the prototype. Kept as the reference implementation for the future
// on-demand integration.
//
// PRODUCTION notes:
// - Cold-chain "chilled" isn't a first-class param here; we map cold-chain ->
//   transport type as a best-effort proxy. Real temperature-controlled delivery
//   needs a specialist contract.
// - Sandbox only operates within supported cities (e.g. London) — addresses must
//   resolve there.

type StuartCreds = { id: string; secret: string; base: string };

// Cold-chain -> transport type. A veg box is "large", which needs car/van.
function transportFor(coldChain: ColdChainClass): "car" | "van" {
  return coldChain === "highly_perishable" ? "van" : "car";
}

function addressString(a: Address): string {
  return `${a.line}, ${a.city} ${a.postcode}`.trim();
}

function contact(a: Address) {
  return {
    firstname: a.contactName?.split(" ")[0] || "Croftly",
    lastname: a.contactName?.split(" ").slice(1).join(" ") || "Croftly",
    phone: a.contactPhone || "+447700900000",
  };
}

// Module-level token cache (client-credentials token is reusable until expiry).
let cachedToken: { value: string; expiresAt: number } | null = null;

async function getToken(creds: StuartCreds): Promise<string> {
  const now = Date.now();
  if (cachedToken && cachedToken.expiresAt > now + 60_000) return cachedToken.value;
  const res = await fetch(`${creds.base}/oauth/token`, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: creds.id,
      client_secret: creds.secret,
      grant_type: "client_credentials",
      scope: "api",
    }),
  });
  if (!res.ok) throw new Error(`Stuart auth failed: ${res.status} ${await res.text().catch(() => "")}`);
  const j = (await res.json()) as { access_token: string; expires_in?: number };
  cachedToken = { value: j.access_token, expiresAt: now + (j.expires_in ?? 3600) * 1000 };
  return cachedToken.value;
}

async function stuartFetch(creds: StuartCreds, path: string, body: unknown) {
  const token = await getToken(creds);
  return fetch(`${creds.base}${path}`, {
    method: "POST",
    headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

function jobBody(leg: FulfilmentLeg, withTransport: boolean) {
  return {
    job: {
      ...(withTransport ? { transport_type: transportFor(leg.coldChain) } : {}),
      pickups: [{ address: addressString(leg.pickup), contact: contact(leg.pickup) }],
      dropoffs: [
        {
          address: addressString(leg.dropoff),
          package_type: leg.packageSize,
          contact: contact(leg.dropoff),
        },
      ],
    },
  };
}

function makeStuart(creds: StuartCreds): CourierProvider {
  return {
    name: "stuart",
    canHandle() {
      // Best-effort: Stuart can carry all classes in sandbox (transport-type proxy).
      return true;
    },
    async quote(leg: FulfilmentLeg): Promise<CourierQuote | null> {
      try {
        const res = await stuartFetch(creds, "/v2/jobs/pricing", jobBody(leg, false));
        if (!res.ok) return null; // unservable (out of zone, etc.) -> caller disables courier
        const j = (await res.json()) as { amount?: number; currency?: string };
        if (typeof j.amount !== "number") return null;
        return {
          provider: "stuart",
          service: `Stuart · ${transportFor(leg.coldChain)}`,
          fee_pence: Math.round(j.amount * 100),
          eta: "On-demand · same-day",
        };
      } catch {
        return null;
      }
    },
    async createJob(leg: FulfilmentLeg): Promise<CourierJob> {
      const res = await stuartFetch(creds, "/v2/jobs", jobBody(leg, true));
      if (!res.ok) throw new Error(`Stuart createJob failed: ${res.status} ${await res.text().catch(() => "")}`);
      const j = (await res.json()) as {
        id: number | string;
        status?: string;
        pricing?: { price_tax_included?: number };
        deliveries?: Array<{ tracking_url?: string }>;
      };
      const feePounds = j.pricing?.price_tax_included;
      return {
        provider: "stuart",
        providerJobId: String(j.id),
        trackingUrl: j.deliveries?.[0]?.tracking_url ?? null,
        status: j.status ?? "scheduled",
        fee_pence: typeof feePounds === "number" ? Math.round(feePounds * 100) : 0,
      };
    },
  };
}

/** Returns a live Stuart provider, or null when creds are absent (graceful fallback to mock). */
export function getStuart(): CourierProvider | null {
  const id = process.env.STUART_CLIENT_ID;
  const secret = process.env.STUART_CLIENT_SECRET;
  if (!id || !secret) return null;
  const base = process.env.STUART_ENV === "production" ? "https://api.stuart.com" : "https://api.sandbox.stuart.com";
  return makeStuart({ id, secret, base });
}
