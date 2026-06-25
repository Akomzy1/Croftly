"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/supabase/types";
import { getSupabaseEnv } from "@/lib/supabase/env";

// Browser Supabase client. Returns null when Supabase isn't configured yet
// (prototype state) so UI can show an "accounts not configured" message
// instead of crashing.
export function createClient() {
  const env = getSupabaseEnv();
  if (!env) return null;
  return createBrowserClient<Database>(env.url, env.anonKey);
}
