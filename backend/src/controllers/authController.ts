import { Response } from 'express';
import { AuthenticatedRequest, ApiSuccess } from '../types/index.js';
import { AuthUser } from '../types/index.js';

/**
 * GET /api/auth/me
 *
 * Returns the verified user identity attached by requireAuth.
 * Useful for the frontend to confirm a token is still valid and
 * fetch the server-resolved role without a separate Supabase call.
 *
 * Protected by: requireAuth
 */
export function getMe(
  req: AuthenticatedRequest,
  res: Response<ApiSuccess<AuthUser>>,
): void {
  // req.user is always defined here — requireAuth runs before this handler
  // and forwards a 401 to the error handler if the token is missing/invalid.
  res.status(200).json({
    status: 'ok',
    data: req.user!,
  });
}
