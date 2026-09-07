import { Router } from 'express';
import {
  listAllOrdersAdmin,
  updateOrderStatusAdmin,
} from '../controllers/orderController.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireAdmin } from '../middleware/requireAdmin.js';
import { writeLimiter } from '../middleware/rateLimiter.js';
import { validate } from '../validation/index.js';
import {
  orderIdParamSchema,
  updateOrderStatusSchema,
} from '../validation/order.js';

const router = Router();

// Enforce authentication and admin privileges across all admin order routes
router.use(requireAuth, requireAdmin);

/**
 * @route   GET /api/admin/orders
 * @desc    Get all orders with joined line items (newest first)
 * @access  Private (Admin)
 */
router.get('/', listAllOrdersAdmin);

/**
 * @route   PATCH /api/admin/orders/:id/status
 * @desc    Update order status or payment status
 * @access  Private (Admin)
 */
router.patch(
  '/:id/status',
  writeLimiter,
  validate(orderIdParamSchema, 'params'),
  validate(updateOrderStatusSchema, 'body'),
  updateOrderStatusAdmin,
);

export default router;
