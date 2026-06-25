import { createClient } from "@/lib/supabase/server";
import { roleFromUser, type Role } from "@/lib/auth/roles";

export type SessionState =
  | { status: "unconfigured" }
  | { status: "anonymous" }
  | { status: "authenticated"; email: string | null; role: Role };

// Resolve the current auth state server-side. "unconfigured" means no Supabase
// project is connected yet (prototype) — callers can render a preview instead
// of redirecting into an auth loop.
export async function getSessionState(): Promise<SessionState> {
  const supabase = await createClient();
  if (!supabase) return { status: "unconfigured" };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { status: "anonymous" };

  return { status: "authenticated", email: user.email ?? null, role: roleFromUser(user) };
}
