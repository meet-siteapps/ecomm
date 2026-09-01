import { createClient, SupabaseClient } from '@supabase/supabase-js';

let _client: SupabaseClient | null = null;

/**
 * Returns a singleton Supabase client using the public anon key only.
 * The service-role key is NEVER used here — it must not be included in
 * any environment variable loaded by this module.
 *
 * Row-Level Security policies on Supabase enforce access control.
 * Authenticated requests must pass the user JWT via the Authorization header.
 */
export function getSupabaseClient(): SupabaseClient {
  if (_client) return _client;

  const url = process.env['SUPABASE_URL'];
  const anonKey = process.env['SUPABASE_ANON_KEY'];

  if (!url || !anonKey) {
    throw new Error(
      'Missing Supabase configuration. Ensure SUPABASE_URL and SUPABASE_ANON_KEY are set in your .env file.',
    );
  }

  _client = createClient(url, anonKey, {
    auth: {
      // The backend does not manage user sessions — JWTs come from the client
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  return _client;
}
