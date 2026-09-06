import { z } from 'zod';

/**
 * Validates body for POST /api/payments/create-order
 */
export const createPaymentOrderSchema = z.object({
  orderId: z.string().uuid({ message: 'orderId must be a valid UUID' }),
});

export type CreatePaymentOrderInput = z.infer<typeof createPaymentOrderSchema>;

/**
 * Validates body for POST /api/payments/verify
 */
export const verifyPaymentSchema = z.object({
  orderId: z.string().uuid({ message: 'orderId must be a valid UUID' }),
  razorpayOrderId: z
    .string()
    .trim()
    .min(1, 'razorpayOrderId is required'),
  razorpayPaymentId: z
    .string()
    .trim()
    .min(1, 'razorpayPaymentId is required'),
  razorpaySignature: z
    .string()
    .trim()
    .min(1, 'razorpaySignature is required'),
});

export type VerifyPaymentInput = z.infer<typeof verifyPaymentSchema>;
