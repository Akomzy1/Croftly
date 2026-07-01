import type { ComposedBox } from "@/lib/matching";
import type { Household, ProducerPickup } from "@/lib/supabase/types";
import { boxColdChainClass } from "./coldChain";
import { enabledProviders, type Address, type CourierQuote, type CourierJob, type FulfilmentLeg } from "./providers";

// Box-level courier orchestration. A box can span multiple farms; a courier job is
// one pickup→one dropoff, so we run ONE LEG PER DISTINCT PRODUCER (farm → household)
// and sum the fees (decision: point-to-point per farm; batching deferred per PRD).
// Selection is DETERMINISTIC: cheapest viable provider per leg (CLAUDE.md rule 4).

export type PickupInfo = { producer_name: string; pickup: Address };

export type BoxCourierLeg = { producer_id: string; producer_name: string; quote: CourierQuote };
export type BoxCourierQuote = {
  provider: string; // single provider name, or "mixed"
  total_fee_pence: number;
  eta: string;
  legs: BoxCourierLeg[];
};

export type BoxCourierJobs = {
  provider: string;
  total_fee_pence: number;
  jobs: Array<{ producer_id: string; job: CourierJob }>;
};

const PACKAGE_SIZE = "large" as const; // a Croftly veg box

function distinctProducerIds(box: ComposedBox): string[] {
  return [...new Set(box.lines.map((l) => l.producer_id))];
}

function producerName(box: ComposedBox, producerId: string): string {
  return box.lines.find((l) => l.producer_id === producerId)?.producer_name ?? "A local farm";
}

/** Build a delivery (dropoff) Address from a household row; null if it has no usable address. */
export function addressFromHousehold(h: Pick<Household, "address_line" | "city" | "postcode" | "lat" | "lng" | "contact_name" | "contact_phone">): Address | null {
  if (!h.address_line || !h.city || !h.postcode) return null;
  return { line: h.address_line, city: h.city, postcode: h.postcode, lat: h.lat, lng: h.lng, contactName: h.contact_name, contactPhone: h.contact_phone };
}

/** Build a pickup Address from a producer_pickup row. */
export function addressFromPickup(p: ProducerPickup): Address {
  return { line: p.address_line, city: p.city, postcode: p.postcode, lat: p.lat, lng: p.lng, contactName: p.contact_name, contactPhone: p.contact_phone };
}

function legFor(pickup: Address, dropoff: Address, box: ComposedBox): FulfilmentLeg {
  return { pickup, dropoff, coldChain: boxColdChainClass(box.lines), packageSize: PACKAGE_SIZE };
}

/**
 * Live quote for the whole box: cheapest viable provider per farm leg, fees summed.
 * Returns null if courier isn't viable (no provider can carry the cold-chain class,
 * a farm has no pickup address, or any leg is unservable) — caller offers collection.
 */
export async function quoteBoxCourier(box: ComposedBox, pickups: Map<string, PickupInfo>, dropoff: Address): Promise<BoxCourierQuote | null> {
  const coldChain = boxColdChainClass(box.lines);
  const providers = enabledProviders().filter((p) => p.canHandle(coldChain));
  if (providers.length === 0) return null;

  const legs: BoxCourierLeg[] = [];
  for (const pid of distinctProducerIds(box)) {
    const info = pickups.get(pid);
    if (!info) return null; // a farm with no pickup address → not courier-servable
    const leg = legFor(info.pickup, dropoff, box);
    const quotes = (await Promise.all(providers.map((p) => p.quote(leg).catch(() => null)))).filter((q): q is CourierQuote => q !== null);
    if (quotes.length === 0) return null; // a leg is unservable → whole courier option off
    quotes.sort((a, b) => a.fee_pence - b.fee_pence);
    legs.push({ producer_id: pid, producer_name: info.producer_name, quote: quotes[0] });
  }

  const total = legs.reduce((s, l) => s + l.quote.fee_pence, 0);
  const names = [...new Set(legs.map((l) => l.quote.provider))];
  return { provider: names.length === 1 ? names[0] : "mixed", total_fee_pence: total, eta: legs[0]?.quote.eta ?? "", legs };
}

/**
 * Book the box: one job per farm via the cheapest viable provider. Throws if a leg
 * can't be created (caller should surface an error and not finalise courier).
 */
export async function createBoxCourierJobs(box: ComposedBox, pickups: Map<string, PickupInfo>, dropoff: Address): Promise<BoxCourierJobs | null> {
  const coldChain = boxColdChainClass(box.lines);
  const providers = enabledProviders().filter((p) => p.canHandle(coldChain));
  if (providers.length === 0) return null;

  const jobs: Array<{ producer_id: string; job: CourierJob }> = [];
  for (const pid of distinctProducerIds(box)) {
    const info = pickups.get(pid);
    if (!info) return null;
    const leg = legFor(info.pickup, dropoff, box);
    // Choose cheapest provider by quote, then book on it.
    const quoted = (await Promise.all(providers.map(async (p) => ({ p, q: await p.quote(leg).catch(() => null) })))).filter((x) => x.q);
    if (quoted.length === 0) return null;
    quoted.sort((a, b) => a.q!.fee_pence - b.q!.fee_pence);
    const job = await quoted[0].p.createJob(leg);
    jobs.push({ producer_id: pid, job });
  }

  const total = jobs.reduce((s, j) => s + j.job.fee_pence, 0);
  const names = [...new Set(jobs.map((j) => j.job.provider))];
  return { provider: names.length === 1 ? names[0] : "mixed", total_fee_pence: total, jobs };
}

export { producerName };
