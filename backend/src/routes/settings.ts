import { Router } from 'express';
import {
  getSettings,
  updateSettings,
} from '../controllers/settingsController.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireAdmin } from '../middleware/requireAdmin.js';
import { writeLimiter } from '../middleware/rateLimiter.js';
import { validate } from '../validation/index.js';
import { updateSettingsSchema } from '../validation/settings.js';

const router = Router();

/**
 * @route   GET /api/settings
 * @desc    Get store settings (public read for storefront, footer, contact info)
 * @access  Public
 */
router.get('/', getSettings);
router.get('/settings', getSettings);

/**
 * @route   PUT /api/admin/settings or PUT /api/settings
 * @desc    Update store settings
 * @access  Private (Admin)
 */
router.put(
  '/',
  writeLimiter,
  requireAuth,
  requireAdmin,
  validate(updateSettingsSchema, 'body'),
  updateSettings,
);
router.put(
  '/admin/settings',
  writeLimiter,
  requireAuth,
  requireAdmin,
  validate(updateSettingsSchema, 'body'),
  updateSettings,
);

export default router;
