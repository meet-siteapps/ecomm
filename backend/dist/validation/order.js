"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderIdParamSchema = exports.createOrderSchema = exports.shippingAddressSchema = exports.orderItemInputSchema = void 0;
const zod_1 = require("zod");
exports.orderItemInputSchema = zod_1.z.object({
    productId: zod_1.z.string().uuid({ message: 'productId must be a valid UUID' }),
    quantity: zod_1.z
        .number()
        .int('Quantity must be an integer')
        .min(1, 'Quantity must be at least 1'),
    selectedSize: zod_1.z.string().trim().optional(),
    selectedColor: zod_1.z.string().trim().optional(),
});
exports.shippingAddressSchema = zod_1.z.object({
    fullName: zod_1.z.string().trim().min(1, 'Full name is required'),
    phone: zod_1.z
        .string()
        .trim()
        .min(1, 'Phone number is required')
        .regex(/^\+?[0-9]{10,15}$/, 'Invalid phone number format. Must contain 10-15 digits'),
    email: zod_1.z.string().trim().email('Invalid email address').optional(),
    addressLine1: zod_1.z.string().trim().min(1, 'Address line 1 is required'),
    addressLine2: zod_1.z.string().trim().optional(),
    city: zod_1.z.string().trim().min(1, 'City is required'),
    state: zod_1.z.string().trim().min(1, 'State is required'),
    pincode: zod_1.z
        .string()
        .trim()
        .regex(/^\d{6}$/, 'Invalid pincode format. Must be a 6-digit number'),
    landmark: zod_1.z.string().trim().optional(),
});
exports.createOrderSchema = zod_1.z.object({
    items: zod_1.z
        .array(exports.orderItemInputSchema)
        .min(1, 'Order must contain at least one item'),
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
//# sourceMappingURL=order.js.map