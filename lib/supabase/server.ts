import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/lib/supabase/types";
import { getSupabaseEnv } from "@/lib/supabase/env";

// Server Supabase client (RSC / server actions / route handlers). Returns null
// when Supabase isn't configured yet so callers can degrade gracefully.
export async function createClient() {
  const env = getSupabaseEnv();
  if (!env) return null;

  const cookieStore = await cookies();
  return createServerClient<Database>(env.url, env.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Called from a Server Component — safe to ignore when middleware
          // is refreshing the session.
        }
      },
    },
  });
}
