import { z } from 'zod';
export declare const createPaymentOrderSchema: z.ZodObject<{
    orderId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    orderId: string;
}, {
    orderId: string;
}>;
export type CreatePaymentOrderInput = z.infer<typeof createPaymentOrderSchema>;
export declare const verifyPaymentSchema: z.ZodObject<{
    orderId: z.ZodString;
    razorpayOrderId: z.ZodString;
    razorpayPaymentId: z.ZodString;
    razorpaySignature: z.ZodString;
}, "strip", z.ZodTypeAny, {
    orderId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
}, {
    orderId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
}>;
export type VerifyPaymentInput = z.infer<typeof verifyPaymentSchema>;
//# sourceMappingURL=payment.d.ts.map