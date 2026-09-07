import { Response, NextFunction } from 'express';
import { getSupabaseClient } from '../services/supabase.js';
import { getSupabaseAdminClient } from '../services/supabaseAdmin.js';
import { AppError } from './errorHandler.js';
import { AuthenticatedRequest } from '../types/index.js';

/**
 * requireAuth — Express middleware that verifies a Supabase JWT.
 *
 * Expects:  Authorization: Bearer <supabase-access-token>
 * On success: attaches req.user = { id, email, role } and calls next()
 * On failure: forwards a 401 AppError to the centralized error handler
 *
 * HOW IT WORKS
 * ─────────────
 * The Supabase anon-key client exposes `auth.getUser(token)` which:
 *   1. Validates the JWT signature against Supabase's JWKS
 *   2. Checks expiry
 *   3. Returns the decoded user on success
 *
 * This means we verify tokens without storing secrets beyond the anon key
 * (which is already public). The service-role key is never needed here.
 *
 * ROLE RESOLUTION
 * ────────────────
 * Role is read from the `profiles` table (source of truth for custom roles).
 * If the profile row doesn't exist yet, we fall back to `user_metadata.role`
 * set at registration, then default to 'customer'.
 */
export async function requireAuth(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const authHeader = req.headers['authorization'];

    if (!authHeader?.startsWith('Bearer ')) {
      throw new AppError(
        'Missing or malformed Authorization header. Expected: Bearer <token>',
        401,
        'MISSING_TOKEN',
      );
    }

    const token = authHeader.slice(7); // strip "Bearer "

    const supabase = getSupabaseClient();
    let { data, error } = await supabase.auth.getUser(token);

    // Fallback to adminClient if anon client failed
    if ((error || !data.user) && process.env['SUPABASE_SERVICE_ROLE_KEY']) {
      try {
        const adminClient = getSupabaseAdminClient();
        const adminAuthResult = await adminClient.auth.getUser(token);
        if (adminAuthResult.data?.user && !adminAuthResult.error) {
          data = adminAuthResult.data;
          error = null;
        }
      } catch {
        // ignore fallback errors
      }
    }

    if (error || !data.user) {
      throw new AppError(
        'Invalid or expired access token.',
        401,
        'INVALID_TOKEN',
      );
    }

    const supabaseUser = data.user;

    // ── Resolve role from profiles table, fall back to metadata ───────────
    let role: 'customer' | 'admin' = 'customer';

    try {
      const adminClient = getSupabaseAdminClient();
      const { data: profile } = await adminClient
        .from('profiles')
        .select('role')
        .eq('id', supabaseUser.id)
        .maybeSingle();

      if (profile?.role === 'admin' || profile?.role === 'customer') {
        role = profile.role;
      } else {
        const metaRole = supabaseUser.user_metadata?.['role'];
        if (metaRole === 'admin' || metaRole === 'customer') {
          role = metaRole;
        }
      }
    } catch {
      const metaRole = supabaseUser.user_metadata?.['role'];
      if (metaRole === 'admin' || metaRole === 'customer') {
        role = metaRole;
      }
    }

    // ── Attach verified identity to request ───────────────────────────────
    (req as AuthenticatedRequest).user = {
      id: supabaseUser.id,
      email: supabaseUser.email ?? '',
      role,
    };

    next();
  } catch (err) {
    next(err);
  }
}
