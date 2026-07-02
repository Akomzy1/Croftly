import type { ColdChainClass } from "@/lib/supabase/types";
import type { CourierProvider, CourierQuote, CourierJob, FulfilmentLeg, Address } from "./types";

// (Status mapping now lives in providers/status.ts → mapCourierStatus, shared with
// Uber Direct.)

// Stuart — the FIRST REAL on-demand courier provider (chilled / same-day layer).
// SANDBOX by default; selected via COURIER_PROVIDER=stuart (or as the default when
// Stuart keys are present). Stuart is the food-specialist fallback long-term; Uber
// Direct is the intended LEAD (wider UK coverage) once approved. DETERMINISTIC, no
// LLM (CLAUDE.md rule 4); the platform integrates couriers, never runs a fleet (rule 2).
//
// This adapter never leaks into checkout/order code — callers only use the seam
// (lib/fulfilment/quote.ts). Keys/URLs are env-based; nothing is hard-coded.
//
// PRODUCTION notes:
// - SANDBOX-ONLY here: real bookings are blocked unless STUART_ALLOW_PRODUCTION=1.
// - Cold-chain "chilled" isn't a first-class Stuart param; we map cold-chain ->
//   transport type as a best-effort proxy. Real temperature-controlled needs a
//   specialist contract.
// - Sandbox only operates within supported cities (e.g. London) — addresses must
//   resolve there. Region coverage must be confirmed for the chosen pilot region.

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
      // SAFETY: this project is sandbox-only. Refuse to dispatch a REAL courier
      // against production unless explicitly opted in. // PRODUCTION: remove this
      // guard (or set STUART_ALLOW_PRODUCTION=1) for a genuine launch.
      const isProd = !creds.base.includes("sandbox");
      if (isProd && process.env.STUART_ALLOW_PRODUCTION !== "1") {
        throw new Error("Refusing to create a real Stuart job against production (sandbox-only). Set STUART_ALLOW_PRODUCTION=1 to override.");
      }
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

/** Returns a Stuart provider, or null when creds are absent (graceful fallback to mock). */
export function getStuart(): CourierProvider | null {
  const id = process.env.STUART_CLIENT_ID;
  const secret = process.env.STUART_CLIENT_SECRET;
  if (!id || !secret) return null;
  // Base URL is configurable; defaults to sandbox. // PRODUCTION: set STUART_ENV=production
  // (or STUART_BASE_URL) + STUART_ALLOW_PRODUCTION=1 for real bookings.
  const base =
    process.env.STUART_BASE_URL ||
    (process.env.STUART_ENV === "production" ? "https://api.stuart.com" : "https://api.sandbox.stuart.com");
  return makeStuart({ id, secret, base });
}
