/**
 * Supabase credentials.
 *
 * Supabase renamed its API keys: the browser-safe `anon` key is now the
 * "publishable" key (sb_publishable_…), and the server-only `service_role` key is now
 * the "secret" key (sb_secret_…). Both naming schemes are accepted here — new projects
 * get the new names, older ones may still have the legacy JWT keys.
 *
 * NEXT_PUBLIC_* vars are inlined at build time, so they must be referenced literally.
 */

// The dashboard shows the REST endpoint (…supabase.co/rest/v1/) in some places, but the
// client wants the bare project URL — tolerate either.
export const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "")
  .trim()
  .replace(/\/rest\/v1\/?$/, "")
  .replace(/\/+$/, "");

/** Browser-safe key. Row-level security still applies to every request made with it. */
export const SUPABASE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "";

/** Server-only key — bypasses row-level security. Never expose to the browser. */
export const SUPABASE_SECRET_KEY =
  process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

/** True once the Supabase env vars are filled in (see SETUP-PORTAL.md). */
export function supabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY);
}
