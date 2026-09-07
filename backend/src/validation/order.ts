import { z } from 'zod';

/**
 * Validates individual item in an order creation request.
 */
export const orderItemInputSchema = z.object({
  productId: z.string().uuid({ message: 'productId must be a valid UUID' }),
  quantity: z
    .number()
    .int('Quantity must be an integer')
    .min(1, 'Quantity must be at least 1')
    .max(100, 'Quantity cannot exceed 100 per item'),
  selectedSize: z.string().trim().max(50, 'Size cannot exceed 50 characters').optional(),
  selectedColor: z.string().trim().max(50, 'Color cannot exceed 50 characters').optional(),
});

/**
 * Validates shipping address payload.
 */
export const shippingAddressSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, 'Full name is required')
    .max(200, 'Full name cannot exceed 200 characters'),
  phone: z
    .string()
    .trim()
    .min(1, 'Phone number is required')
    .max(20, 'Phone number cannot exceed 20 characters')
    .regex(
      /^\+?[0-9]{10,15}$/,
      'Invalid phone number format. Must contain 10-15 digits',
    ),
  email: z
    .string()
    .trim()
    .email('Invalid email address')
    .max(255, 'Email cannot exceed 255 characters')
    .optional(),
  addressLine1: z
    .string()
    .trim()
    .min(1, 'Address line 1 is required')
    .max(500, 'Address line 1 cannot exceed 500 characters'),
  addressLine2: z
    .string()
    .trim()
    .max(500, 'Address line 2 cannot exceed 500 characters')
    .optional(),
  city: z
    .string()
    .trim()
    .min(1, 'City is required')
    .max(100, 'City cannot exceed 100 characters'),
  state: z
    .string()
    .trim()
    .min(1, 'State is required')
    .max(100, 'State cannot exceed 100 characters'),
  pincode: z
    .string()
    .trim()
    .regex(/^\d{6}$/, 'Invalid pincode format. Must be a 6-digit number'),
  landmark: z
    .string()
    .trim()
    .max(200, 'Landmark cannot exceed 200 characters')
    .optional(),
});

/**
 * Validates the body for POST /api/orders.
 */
export const createOrderSchema = z.object({
  items: z
    .array(orderItemInputSchema)
    .min(1, 'Order must contain at least one item')
    .max(50, 'Order cannot contain more than 50 items'),
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
