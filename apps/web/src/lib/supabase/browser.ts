"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient<any, any, any> | null | undefined;

// Anon-key client for the browser. Returns null (not an error) when running
// against the demo/placeholder Supabase project, so callers can treat "no
// realtime available" as a normal case rather than a failure to handle.
export function getSupabaseBrowserClient(): SupabaseClient<any, any, any> | null {
  if (client !== undefined) return client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const isPlaceholder = !url || !anonKey || url.includes("localhost:54321") || anonKey.startsWith("demo-");

  client = isPlaceholder ? null : createClient<any, any, any>(url, anonKey);
  return client;
}
