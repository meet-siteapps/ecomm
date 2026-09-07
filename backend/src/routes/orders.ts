import { Router } from 'express';
import {
  createOrder,
  getMyOrders,
  getOrder,
} from '../controllers/orderController.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { writeLimiter } from '../middleware/rateLimiter.js';
import { validate } from '../validation/index.js';
import {
  createOrderSchema,
  orderIdParamSchema,
} from '../validation/order.js';

const router = Router();

/**
 * @route   POST /api/orders
 * @desc    Create a new order from validated cart items and shipping address
 * @access  Private — requires Bearer token
 */
router.post(
  '/',
  writeLimiter,
  requireAuth,
  validate(createOrderSchema, 'body'),
  createOrder,
);

/**
 * @route   GET /api/orders
 * @desc    Get all orders for the authenticated user (newest first)
 * @access  Private — requires Bearer token
 */
router.get('/', requireAuth, getMyOrders);

/**
 * @route   GET /api/orders/:id
 * @desc    Get a single order by UUID for the authenticated user or an admin
 * @access  Private — requires Bearer token
 */
router.get(
  '/:id',
  requireAuth,
  validate(orderIdParamSchema, 'params'),
  getOrder,
);

export default router;
