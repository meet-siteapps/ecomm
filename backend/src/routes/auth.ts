import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { getMe } from '../controllers/authController.js';

const router = Router();

/**
 * @route  GET /api/auth/me
 * @desc   Returns the verified user identity (id, email, role).
 *         Confirms the JWT is valid and returns the server-resolved role.
 * @access Private — requires Bearer token
 */
router.get('/me', requireAuth, getMe);

// Future auth routes (Phase 6+):
// router.post('/profile',  requireAuth, updateProfile);
// router.get('/admin/me',  requireAuth, requireAdmin, getAdminProfile);

export default router;
