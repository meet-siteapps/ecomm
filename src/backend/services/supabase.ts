import { createServerClient } from '@supabase/ssr';
import { createClient as createSupabaseJsClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

/**
 * Creates a server-side Supabase client for Server Components, Server Actions, and Route Handlers.
 * Automatically manages session cookies securely on the server with user's authenticated session.
 */
export async function getServerSupabaseClient() {
  const cookieStore = await cookies();

  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase URL or public key is missing from environment variables.');
  }

  return createServerClient(supabaseUrl, supabaseKey, {
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
          // Can be safely ignored if invoked inside a Server Component
        }
      },
    },
  });
}

/**
 * Creates an elevated Admin Supabase client using the Service Role Key.
 * NEVER expose this or invoke this on the client side.
 * Fails clearly if the privileged service role key is missing.
 */
export function getAdminSupabaseClient() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    throw new Error(
      'Critical: SUPABASE_SERVICE_ROLE_KEY is not configured in server environment. Admin operations cannot proceed without privileged key.'
    );
  }

  if (!supabaseUrl) {
    throw new Error('Critical: NEXT_PUBLIC_SUPABASE_URL is missing from environment variables.');
  }

  return createSupabaseJsClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
