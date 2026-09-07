import { Router } from 'express';
import { getDashboardStats } from '../controllers/orderController.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireAdmin } from '../middleware/requireAdmin.js';

const router = Router();

// Enforce authentication and admin privileges
router.use(requireAuth, requireAdmin);

/**
 * @route   GET /api/admin/dashboard-stats
 * @desc    Get aggregated dashboard stats (products, orders, customers, recent orders)
 * @access  Private (Admin)
 */
router.get('/', getDashboardStats);

export default router;
