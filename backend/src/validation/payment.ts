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
    .min(1, 'razorpayOrderId is required')
    .max(255, 'razorpayOrderId cannot exceed 255 characters'),
  razorpayPaymentId: z
    .string()
    .trim()
    .min(1, 'razorpayPaymentId is required')
    .max(255, 'razorpayPaymentId cannot exceed 255 characters'),
  razorpaySignature: z
    .string()
    .trim()
    .min(1, 'razorpaySignature is required')
    .max(512, 'razorpaySignature cannot exceed 512 characters'),
});

export type VerifyPaymentInput = z.infer<typeof verifyPaymentSchema>;
