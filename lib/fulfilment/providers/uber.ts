import type { CourierProvider, CourierQuote, CourierJob, FulfilmentLeg, Address } from "./types";

// Uber Direct — the on-demand courier slot.
//
// PRODUCTION: Uber Direct is the intended LEAD (wider UK coverage, ~90% of population)
// once the business account is APPROVED; Stuart is the food-specialist fallback. The
// application is currently pending approval, so Stuart is the working provider for now.
// This adapter is already implemented against the same CourierProvider interface and
// activates via COURIER_PROVIDER=uber the moment UBER_* creds exist — no code change.
//
// DETERMINISTIC, no LLM (CLAUDE.md rule 4); the platform integrates couriers, never
// runs a fleet (rule 2). Never leaks into checkout/order code — callers use the seam.
//
// PRODUCTION notes:
// - Uber Direct has no first-class "chilled" flag; cold-chain is a best-effort proxy.
//   Real temperature-controlled needs passive packaging or the Stuart specialist fallback.
// - manifest_total_value is defaulted here; pass the real box value in production.

type UberCreds = { clientId: string; clientSecret: string; customerId: string };

const AUTH_URL = "https://auth.uber.com/oauth/v2/token";
const API_BASE = "https://api.uber.com/v1";
const DEFAULT_MANIFEST_PENCE = 2000;

function structuredAddress(a: Address): string {
  return JSON.stringify({ street_address: [a.line], city: a.city, state: "", zip_code: a.postcode, country: "GB" });
}
function phone(a: Address): string {
  return a.contactPhone || "+447700900000";
}
function displayName(a: Address): string {
  return a.contactName || "Croftly";
}

// Module-level token cache (client-credentials token is reusable until expiry).
let cachedToken: { value: string; expiresAt: number } | null = null;

async function getToken(creds: UberCreds): Promise<string> {
  const now = Date.now();
  if (cachedToken && cachedToken.expiresAt > now + 60_000) return cachedToken.value;
  const res = await fetch(AUTH_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: creds.clientId,
      client_secret: creds.clientSecret,
      grant_type: "client_credentials",
      scope: "eats.deliveries",
    }),
  });
  if (!res.ok) throw new Error(`Uber auth failed: ${res.status} ${await res.text().catch(() => "")}`);
  const j = (await res.json()) as { access_token: string; expires_in?: number };
  cachedToken = { value: j.access_token, expiresAt: now + (j.expires_in ?? 3600) * 1000 };
  return cachedToken.value;
}

async function uberFetch(creds: UberCreds, path: string, body: unknown) {
  const token = await getToken(creds);
  return fetch(`${API_BASE}/customers/${creds.customerId}${path}`, {
    method: "POST",
    headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

function make(creds: UberCreds): CourierProvider {
  return {
    name: "uber_direct",
    canHandle() {
      // Best-effort across classes; temperature control is a production concern.
      return true;
    },
    async quote(leg: FulfilmentLeg): Promise<CourierQuote | null> {
      try {
        const res = await uberFetch(creds, "/delivery_quotes", {
          pickup_address: structuredAddress(leg.pickup),
          dropoff_address: structuredAddress(leg.dropoff),
          ...(leg.pickup.lat != null ? { pickup_latitude: leg.pickup.lat, pickup_longitude: leg.pickup.lng } : {}),
          ...(leg.dropoff.lat != null ? { dropoff_latitude: leg.dropoff.lat, dropoff_longitude: leg.dropoff.lng } : {}),
          manifest_total_value: DEFAULT_MANIFEST_PENCE,
        });
        if (!res.ok) return null; // out of zone / unservable → caller offers collection
        const j = (await res.json()) as { fee?: number; dropoff_eta?: number };
        if (typeof j.fee !== "number") return null;
        return {
          provider: "Uber Direct",
          service: "Uber Direct (on-demand)",
          fee_pence: j.fee, // GBP minor units
          eta: j.dropoff_eta ? `~${j.dropoff_eta} min` : "Same day · on-demand",
        };
      } catch {
        return null;
      }
    },
    async createJob(leg: FulfilmentLeg): Promise<CourierJob> {
      const res = await uberFetch(creds, "/deliveries", {
        pickup_name: displayName(leg.pickup),
        pickup_address: structuredAddress(leg.pickup),
        pickup_phone_number: phone(leg.pickup),
        dropoff_name: displayName(leg.dropoff),
        dropoff_address: structuredAddress(leg.dropoff),
        dropoff_phone_number: phone(leg.dropoff),
        manifest_items: [{ name: "Croftly farm box", quantity: 1 }],
        manifest_total_value: DEFAULT_MANIFEST_PENCE,
      });
      if (!res.ok) throw new Error(`Uber createDelivery failed: ${res.status} ${await res.text().catch(() => "")}`);
      const j = (await res.json()) as { id: string; tracking_url?: string; status?: string; fee?: number };
      return {
        provider: "Uber Direct",
        providerJobId: String(j.id),
        trackingUrl: j.tracking_url ?? null,
        status: j.status ?? "pending",
        fee_pence: typeof j.fee === "number" ? j.fee : 0,
      };
    },
  };
}

/** Returns a live Uber Direct provider, or null when creds are absent (→ mock fallback). */
export function getUber(): CourierProvider | null {
  const clientId = process.env.UBER_CLIENT_ID;
  const clientSecret = process.env.UBER_CLIENT_SECRET;
  const customerId = process.env.UBER_CUSTOMER_ID;
  if (!clientId || !clientSecret || !customerId) return null;
  return make({ clientId, clientSecret, customerId });
}
