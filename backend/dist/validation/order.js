"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatusSchema = exports.orderIdParamSchema = exports.createOrderSchema = exports.shippingAddressSchema = exports.orderItemInputSchema = void 0;
const zod_1 = require("zod");
exports.orderItemInputSchema = zod_1.z.object({
    productId: zod_1.z.string().uuid({ message: 'productId must be a valid UUID' }),
    quantity: zod_1.z
        .number()
        .int('Quantity must be an integer')
        .min(1, 'Quantity must be at least 1')
        .max(100, 'Quantity cannot exceed 100 per item'),
    selectedSize: zod_1.z.string().trim().max(50, 'Size cannot exceed 50 characters').optional(),
    selectedColor: zod_1.z.string().trim().max(50, 'Color cannot exceed 50 characters').optional(),
});
exports.shippingAddressSchema = zod_1.z.object({
    fullName: zod_1.z
        .string()
        .trim()
        .min(1, 'Full name is required')
        .max(200, 'Full name cannot exceed 200 characters'),
    phone: zod_1.z
        .string()
        .trim()
        .min(1, 'Phone number is required')
        .max(20, 'Phone number cannot exceed 20 characters')
        .regex(/^\+?[0-9]{10,15}$/, 'Invalid phone number format. Must contain 10-15 digits'),
    email: zod_1.z
        .string()
        .trim()
        .email('Invalid email address')
        .max(255, 'Email cannot exceed 255 characters')
        .optional(),
    addressLine1: zod_1.z
        .string()
        .trim()
        .min(1, 'Address line 1 is required')
        .max(500, 'Address line 1 cannot exceed 500 characters'),
    addressLine2: zod_1.z
        .string()
        .trim()
        .max(500, 'Address line 2 cannot exceed 500 characters')
        .optional(),
    city: zod_1.z
        .string()
        .trim()
        .min(1, 'City is required')
        .max(100, 'City cannot exceed 100 characters'),
    state: zod_1.z
        .string()
        .trim()
        .min(1, 'State is required')
        .max(100, 'State cannot exceed 100 characters'),
    pincode: zod_1.z
        .string()
        .trim()
        .regex(/^\d{6}$/, 'Invalid pincode format. Must be a 6-digit number'),
    landmark: zod_1.z
        .string()
        .trim()
        .max(200, 'Landmark cannot exceed 200 characters')
        .optional(),
});
exports.createOrderSchema = zod_1.z.object({
    items: zod_1.z
        .array(exports.orderItemInputSchema)
        .min(1, 'Order must contain at least one item')
        .max(50, 'Order cannot contain more than 50 items'),
    shippingAddress: exports.shippingAddressSchema,
    paymentMethod: zod_1.z.enum(['cod', 'razorpay'], {
        errorMap: () => ({
            message: "Payment method must be either 'cod' or 'razorpay'",
        }),
    }),
});
exports.orderIdParamSchema = zod_1.z.object({
    id: zod_1.z.string().uuid({ message: 'Order id must be a valid UUID' }),
});
exports.updateOrderStatusSchema = zod_1.z
    .object({
    order_status: zod_1.z
        .enum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'], {
        errorMap: () => ({ message: 'Invalid order status' }),
    })
        .optional(),
    status: zod_1.z
        .enum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'], {
        errorMap: () => ({ message: 'Invalid order status' }),
    })
        .optional(),
    payment_status: zod_1.z
        .enum(['pending', 'paid', 'failed', 'refunded', 'unpaid'], {
        errorMap: () => ({ message: 'Invalid payment status' }),
    })
        .optional(),
})
    .refine((data) => data.order_status !== undefined ||
    data.status !== undefined ||
    data.payment_status !== undefined, {
    message: 'At least one of order_status, status, or payment_status must be provided',
});
//# sourceMappingURL=order.js.map