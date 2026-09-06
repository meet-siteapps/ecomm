"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPaymentSchema = exports.createPaymentOrderSchema = void 0;
const zod_1 = require("zod");
exports.createPaymentOrderSchema = zod_1.z.object({
    orderId: zod_1.z.string().uuid({ message: 'orderId must be a valid UUID' }),
});
exports.verifyPaymentSchema = zod_1.z.object({
    orderId: zod_1.z.string().uuid({ message: 'orderId must be a valid UUID' }),
    razorpayOrderId: zod_1.z
        .string()
        .trim()
        .min(1, 'razorpayOrderId is required'),
    razorpayPaymentId: zod_1.z
        .string()
        .trim()
        .min(1, 'razorpayPaymentId is required'),
    razorpaySignature: zod_1.z
        .string()
        .trim()
        .min(1, 'razorpaySignature is required'),
});
//# sourceMappingURL=payment.js.map