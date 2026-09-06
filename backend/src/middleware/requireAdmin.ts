import { Response, NextFunction } from 'express';
import { AppError } from './errorHandler.js';
import { AuthenticatedRequest } from '../types/index.js';

/**
 * requireAdmin — Express middleware that enforces admin-only access.
 *
 * MUST be used AFTER requireAuth in the middleware chain:
 *   router.get('/admin-route', requireAuth, requireAdmin, handler)
 *
 * requireAuth guarantees req.user is set and the JWT is valid.
 * requireAdmin then checks that req.user.role === 'admin'.
 *
 * Returns 403 Forbidden (not 401) because the user IS authenticated —
 * they just lack the required privilege level.
 */
export function requireAdmin(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
): void {
  if (req.user?.role !== 'admin') {
    next(
      new AppError(
        'Admin access required. Your account does not have the administrator role.',
        403,
        'FORBIDDEN',
      ),
    );
    return;
  }
  next();
}
