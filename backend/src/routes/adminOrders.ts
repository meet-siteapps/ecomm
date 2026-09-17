import { Router } from 'express';
import {
  listAllOrdersAdmin,
  updateOrderStatusAdmin,
  deleteOrderAdmin,
  bulkDeleteOrdersAdmin,
} from '../controllers/orderController.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireAdmin } from '../middleware/requireAdmin.js';
import { writeLimiter } from '../middleware/rateLimiter.js';
import { validate } from '../validation/index.js';
import {
  orderIdParamSchema,
  updateOrderStatusSchema,
  bulkDeleteOrdersSchema,
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

/**
 * @route   POST /api/admin/orders/bulk-delete
 * @desc    Permanently delete multiple orders at once
 * @access  Private (Admin)
 */
router.post(
  '/bulk-delete',
  writeLimiter,
  validate(bulkDeleteOrdersSchema, 'body'),
  bulkDeleteOrdersAdmin,
);

/**
 * @route   DELETE /api/admin/orders/batch
 * @desc    Permanently delete multiple orders at once
 * @access  Private (Admin)
 */
router.delete(
  '/batch',
  writeLimiter,
  validate(bulkDeleteOrdersSchema, 'body'),
  bulkDeleteOrdersAdmin,
);

/**
 * @route   DELETE /api/admin/orders/:id
 * @desc    Permanently delete an order and associated items
 * @access  Private (Admin)
 */
router.delete(
  '/:id',
  writeLimiter,
  validate(orderIdParamSchema, 'params'),
  deleteOrderAdmin,
);

export default router;
