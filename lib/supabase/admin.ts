import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

// Service-role Supabase client — bypasses RLS. SERVER-ONLY, used only by
// privileged paths (checkout writes orders/items/payouts). Never import into a
// client component. Returns null when the service-role key isn't configured.
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createSupabaseClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
