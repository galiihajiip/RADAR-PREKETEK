import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// No generated Database type yet (would need `supabase gen types typescript`
// against the live project), so the client is untyped-schema (any, any, any)
// on purpose: without all three explicit, supabase-js's conditional generics
// collapse table row types to `never` instead of staying permissive.
let client: SupabaseClient<any, any, any> | null = null;

// Service-role client for use in Next.js API route handlers only. Bypasses
// RLS, so it must never be imported into a "use client" component or
// otherwise reach the browser bundle.
export function getSupabaseServerClient(): SupabaseClient<any, any, any> {
  if (client) return client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error(
      "Supabase is not configured: set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or set DEMO_MODE=true)."
    );
  }

  client = createClient<any, any, any>(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
  return client;
}
