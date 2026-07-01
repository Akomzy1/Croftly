import type { CourierProvider } from "./types";

// Sendcloud — the chosen ambient / hardy-goods aggregator: European, with deeper
// native UK carrier coverage and built-in rate-shopping (the Match-2 "cheapest
// viable" engine off the shelf). EasyPost is the swap-in if Croftly ever goes
// international.
//
// PRODUCTION: not wired yet. This stub keeps the rate-shop seam aware of Sendcloud
// so adding it later is a one-file change. Returns null until creds + adapter exist.
export function getSendcloud(): CourierProvider | null {
  // const key = process.env.SENDCLOUD_API_KEY; ... implement quote()/createJob()
  return null;
}
