import { z } from 'zod';

export const shippingAddressSchema = z.object({
  fullName: z.string().min(2, 'Full name is required (min 2 characters)'),
  phone: z.string().regex(/^\d{10}$/, 'Valid 10-digit mobile number is required'),
  email: z.string().email('Valid email address is required').optional().or(z.literal('')),
  addressLine1: z.string().min(5, 'Address is required (min 5 characters)'),
  addressLine2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().regex(/^\d{6}$/, 'Valid 6-digit Indian PIN code is required'),
  landmark: z.string().optional(),
});

export const checkoutItemSchema = z.object({
  product: z.object({
    id: z.string().uuid('Valid product UUID is required'),
    name: z.string(),
    price: z.number().positive('Price must be greater than 0'),
  }),
  quantity: z.number().int().positive('Quantity must be at least 1'),
  selectedColor: z.string().optional(),
  selectedSize: z.string().optional(),
});

export const checkoutPayloadSchema = z.object({
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(10),
  shippingAddress: shippingAddressSchema,
  subtotal: z.number().nonnegative(),
  discount: z.number().nonnegative().optional(),
  shipping: z.number().nonnegative(),
  total: z.number().positive(),
  cartItems: z.array(checkoutItemSchema).min(1, 'Cart cannot be empty'),
  paymentMethod: z.enum(['cod', 'razorpay', 'upi', 'card']).default('cod'),
  guestToken: z.string().optional(),
});

export type ValidatedCheckoutPayload = z.infer<typeof checkoutPayloadSchema>;
