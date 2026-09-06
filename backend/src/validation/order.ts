import { z } from 'zod';

/**
 * Validates individual item in an order creation request.
 */
export const orderItemInputSchema = z.object({
  productId: z.string().uuid({ message: 'productId must be a valid UUID' }),
  quantity: z
    .number()
    .int('Quantity must be an integer')
    .min(1, 'Quantity must be at least 1'),
  selectedSize: z.string().trim().optional(),
  selectedColor: z.string().trim().optional(),
});

/**
 * Validates shipping address payload.
 */
export const shippingAddressSchema = z.object({
  fullName: z.string().trim().min(1, 'Full name is required'),
  phone: z
    .string()
    .trim()
    .min(1, 'Phone number is required')
    .regex(
      /^\+?[0-9]{10,15}$/,
      'Invalid phone number format. Must contain 10-15 digits',
    ),
  email: z.string().trim().email('Invalid email address').optional(),
  addressLine1: z.string().trim().min(1, 'Address line 1 is required'),
  addressLine2: z.string().trim().optional(),
  city: z.string().trim().min(1, 'City is required'),
  state: z.string().trim().min(1, 'State is required'),
  pincode: z
    .string()
    .trim()
    .regex(/^\d{6}$/, 'Invalid pincode format. Must be a 6-digit number'),
  landmark: z.string().trim().optional(),
});

/**
 * Validates the body for POST /api/orders.
 */
export const createOrderSchema = z.object({
  items: z
    .array(orderItemInputSchema)
    .min(1, 'Order must contain at least one item'),
  shippingAddress: shippingAddressSchema,
  paymentMethod: z.enum(['cod', 'razorpay'], {
    errorMap: () => ({
      message: "Payment method must be either 'cod' or 'razorpay'",
    }),
  }),
});

export type CreateOrderInputSchema = z.infer<typeof createOrderSchema>;

/**
 * Validates the :id route param for GET /api/orders/:id.
 */
export const orderIdParamSchema = z.object({
  id: z.string().uuid({ message: 'Order id must be a valid UUID' }),
});

export type OrderIdParamInput = z.infer<typeof orderIdParamSchema>;
