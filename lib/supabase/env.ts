// Supabase env access. Returns null when keys are not configured so the app
// degrades gracefully (prototype: no live project connected yet) instead of
// throwing at module load / on every request.
export function getSupabaseEnv(): { url: string; anonKey: string } | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  return { url, anonKey };
}

export const isSupabaseConfigured = () => getSupabaseEnv() !== null;
