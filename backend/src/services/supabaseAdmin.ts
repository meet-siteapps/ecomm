import { createClient, SupabaseClient } from '@supabase/supabase-js';

let _adminClient: SupabaseClient | null = null;

/**
 * Returns a singleton Supabase client initialized with the SERVICE ROLE KEY.
 *
 * IMPORTANT SECURITY RULES:
 * - This client bypasses Row-Level Security (RLS) entirely.
 * - It MUST NEVER be exposed to the frontend or included in client bundles.
 * - It is strictly for privileged server-side operations (e.g. order creation,
 *   admin inventory decrements, and admin order lookups).
 */
export function getSupabaseAdminClient(): SupabaseClient {
  if (_adminClient) return _adminClient;

  const url = process.env['SUPABASE_URL'];
  const serviceRoleKey = process.env['SUPABASE_SERVICE_ROLE_KEY'];

  if (!url || !serviceRoleKey) {
    throw new Error(
      'Missing Supabase admin configuration. Ensure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in your .env file.',
    );
  }

  _adminClient = createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  return _adminClient;
}
