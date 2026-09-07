import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import {
  getMe,
  ensureProfile,
  updateProfile,
} from '../controllers/authController.js';
import { validate } from '../validation/index.js';
import {
  ensureProfileSchema,
  updateProfileSchema,
} from '../validation/user.js';

const router = Router();

/**
 * @route   GET /api/auth/me
 * @desc    Returns the full user profile (id, name, email, phone, role, timestamps)
 * @access  Private — requires Bearer token
 */
router.get('/me', requireAuth, getMe);

/**
 * @route   POST /api/auth/ensure-profile
 * @desc    Ensures a profile row exists in the database (called after signup)
 * @access  Private — requires Bearer token
 */
router.post(
  '/ensure-profile',
  authLimiter,
  requireAuth,
  validate(ensureProfileSchema, 'body'),
  ensureProfile,
);

/**
 * @route   PUT /api/auth/profile
 * @desc    Updates user profile details (name, phone)
 * @access  Private — requires Bearer token
 */
router.put(
  '/profile',
  authLimiter,
  requireAuth,
  validate(updateProfileSchema, 'body'),
  updateProfile,
);

export default router;

