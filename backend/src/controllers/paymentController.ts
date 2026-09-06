import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, ApiSuccess } from '../types/index.js';
import {
  CreatePaymentOrderPayload,
  CreatePaymentOrderResponse,
  VerifyPaymentPayload,
} from '../types/payment.js';
import { Order } from '../types/order.js';
import {
  createRazorpayOrder,
  verifyPaymentSignature,
} from '../services/razorpayService.js';
import {
  getOrderById,
  attachRazorpayOrderId,
  confirmPayment,
  markPaymentFailed,
} from '../services/orderService.js';
import { AppError } from '../middleware/errorHandler.js';

/**
 * POST /api/payments/create-order
 *
 * Initializes a Razorpay order for an existing pending internal order.
 * - Confirms order ownership and pending status.
 * - Computes/verifies amount against server-side database totals.
 * - Calls Razorpay API to generate a checkout order.
 * - Links Razorpay order ID to the internal database record.
 * - Returns public checkout parameters (including RAZORPAY_KEY_ID) to the client.
 *
 * @param req - Authenticated request with orderId in body
 * @param res - Express response with ApiSuccess<CreatePaymentOrderResponse>
 * @param next - Express next function
 */
export async function createPaymentOrder(
  req: AuthenticatedRequest,
  res: Response<ApiSuccess<CreatePaymentOrderResponse>>,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError(
        'Unauthorized: Authenticated user context is required.',
        401,
        'UNAUTHORIZED',
      );
    }

    const { orderId } = req.body as CreatePaymentOrderPayload;
    const order = await getOrderById(orderId, userId);

    if (!order) {
      throw new AppError(`Order not found: ${orderId}`, 404, 'ORDER_NOT_FOUND');
    }

    if (order.order_status !== 'pending') {
      throw new AppError(
        `Cannot initiate payment for order in '${order.order_status}' status.`,
        400,
        'INVALID_ORDER_STATUS',
      );
    }

    if (order.payment_status === 'paid') {
      throw new AppError(
        'Order has already been paid for.',
        400,
        'ORDER_ALREADY_PAID',
      );
    }

    // Generate Razorpay Order
    const razorpayOrder = await createRazorpayOrder(
      order.total,
      order.order_number || order.id,
    );

    // Attach Razorpay Order ID to the DB order record
    await attachRazorpayOrderId(order.id, razorpayOrder.id);

    const keyId = process.env['RAZORPAY_KEY_ID'] ?? '';

    res.status(200).json({
      status: 'ok',
      data: {
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        keyId,
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/payments/verify
 *
 * Cryptographically verifies Razorpay payment signature from client checkout callback.
 * - Computes expected HMAC-SHA256 signature using RAZORPAY_KEY_SECRET.
 * - Compares securely with client signature.
 * - If valid: confirms order payment and updates order status to 'confirmed'.
 * - If invalid: marks order payment as 'failed' and returns 400 error.
 *
 * @param req - Authenticated request containing payment tokens in body
 * @param res - Express response with ApiSuccess<Order>
 * @param next - Express next function
 */
export async function verifyPayment(
  req: AuthenticatedRequest,
  res: Response<ApiSuccess<Order>>,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError(
        'Unauthorized: Authenticated user context is required.',
        401,
        'UNAUTHORIZED',
      );
    }

    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } =
      req.body as VerifyPaymentPayload;

    // Cryptographic signature check — NEVER trust frontend client claims alone
    const isValid = verifyPaymentSignature(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    );

    if (!isValid) {
      await markPaymentFailed(orderId, userId);
      throw new AppError(
        'Payment verification failed: Invalid cryptographic signature.',
        400,
        'PAYMENT_VERIFICATION_FAILED',
      );
    }

    // Confirm order payment in database
    const updatedOrder = await confirmPayment(
      orderId,
      userId,
      razorpayPaymentId,
      razorpaySignature,
    );

    res.status(200).json({
      status: 'ok',
      data: updatedOrder,
    });
  } catch (err) {
    next(err);
  }
}
