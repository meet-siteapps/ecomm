import { Router } from 'express';
import {
  createPaymentOrder,
  verifyPayment,
} from '../controllers/paymentController.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { validate } from '../validation/index.js';
import {
  createPaymentOrderSchema,
  verifyPaymentSchema,
} from '../validation/payment.js';

const router = Router();

/**
 * @route   POST /api/payments/create-order
 * @desc    Initiate a Razorpay payment order for an internal pending order
 * @access  Private — requires Bearer token
 */
router.post(
  '/create-order',
  requireAuth,
  validate(createPaymentOrderSchema, 'body'),
  createPaymentOrder,
);

/**
 * @route   POST /api/payments/verify
 * @desc    Verify Razorpay HMAC SHA-256 signature and confirm order payment
 * @access  Private — requires Bearer token
 */
router.post(
  '/verify',
  requireAuth,
  validate(verifyPaymentSchema, 'body'),
  verifyPayment,
);

export default router;
