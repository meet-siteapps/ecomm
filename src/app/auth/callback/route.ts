import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { EmailOtpType } from '@supabase/supabase-js';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const next = searchParams.get('next') ?? '/account';

  // Sanitize next parameter to prevent open redirect vulnerabilities
  const redirectPath = next.startsWith('/') ? next : '/account';

  // Determine base URL to redirect back to
  const forwardedHost = request.headers.get('x-forwarded-host');
  const isLocalEnv = process.env.NODE_ENV === 'development';
  const baseUrl = isLocalEnv
    ? origin
    : forwardedHost
    ? `https://${forwardedHost}`
    : origin;

  const supabase = await createClient();

  // Handle PKCE auth code exchange
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${baseUrl}${redirectPath}`);
    }
    console.error('Auth callback code exchange error:', error.message);
  }

  // Handle token_hash verification (email OTP / confirmation)
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    if (!error) {
      return NextResponse.redirect(`${baseUrl}${redirectPath}`);
    }
    console.error('Auth callback token_hash error:', error.message);
  }

  // Redirect to login page if verification fails or no code/token provided
  return NextResponse.redirect(`${baseUrl}/login?error=confirmation_failed`);
}
