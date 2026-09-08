import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createBrowserClient(supabaseUrl, supabaseKey);
}

/**
 * Returns a valid Supabase access token, automatically refreshing the session
 * if the access token has expired or is within 60 seconds of expiry.
 */
export async function getValidAccessToken(): Promise<string | null> {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) return null;

  const now = Math.floor(Date.now() / 1000);
  const isExpiringSoon = !session.expires_at || session.expires_at <= now + 60;

  if (isExpiringSoon) {
    try {
      const { data: refreshData, error } = await supabase.auth.refreshSession();
      if (!error && refreshData?.session?.access_token) {
        return refreshData.session.access_token;
      }
    } catch {
      // Return existing token as fallback if refresh fails
    }
  }

  return session.access_token || null;
}
