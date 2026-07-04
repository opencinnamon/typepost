import { createClient as createSupabaseClient, SupabaseClient } from "@supabase/supabase-js";

export function createServerClient(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    return null;
  }

  return createSupabaseClient(url, key, {
    auth: { persistSession: false },
  });
}
