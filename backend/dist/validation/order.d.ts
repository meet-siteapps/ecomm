import { z } from 'zod';
export declare const orderItemInputSchema: z.ZodObject<{
    productId: z.ZodString;
    quantity: z.ZodNumber;
    selectedSize: z.ZodOptional<z.ZodString>;
    selectedColor: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    quantity: number;
    productId: string;
    selectedSize?: string | undefined;
    selectedColor?: string | undefined;
}, {
    quantity: number;
    productId: string;
    selectedSize?: string | undefined;
    selectedColor?: string | undefined;
}>;
export declare const shippingAddressSchema: z.ZodObject<{
    fullName: z.ZodString;
    phone: z.ZodString;
    email: z.ZodOptional<z.ZodString>;
    addressLine1: z.ZodString;
    addressLine2: z.ZodOptional<z.ZodString>;
    city: z.ZodString;
    state: z.ZodString;
    pincode: z.ZodString;
    landmark: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    fullName: string;
    phone: string;
    addressLine1: string;
    city: string;
    state: string;
    pincode: string;
    email?: string | undefined;
    addressLine2?: string | undefined;
    landmark?: string | undefined;
}, {
    fullName: string;
    phone: string;
    addressLine1: string;
    city: string;
    state: string;
    pincode: string;
    email?: string | undefined;
    addressLine2?: string | undefined;
    landmark?: string | undefined;
}>;
export declare const createOrderSchema: z.ZodObject<{
    items: z.ZodArray<z.ZodObject<{
        productId: z.ZodString;
        quantity: z.ZodNumber;
        selectedSize: z.ZodOptional<z.ZodString>;
        selectedColor: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        quantity: number;
        productId: string;
        selectedSize?: string | undefined;
        selectedColor?: string | undefined;
    }, {
        quantity: number;
        productId: string;
        selectedSize?: string | undefined;
        selectedColor?: string | undefined;
    }>, "many">;
    shippingAddress: z.ZodObject<{
        fullName: z.ZodString;
        phone: z.ZodString;
        email: z.ZodOptional<z.ZodString>;
        addressLine1: z.ZodString;
        addressLine2: z.ZodOptional<z.ZodString>;
        city: z.ZodString;
        state: z.ZodString;
        pincode: z.ZodString;
        landmark: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        fullName: string;
        phone: string;
        addressLine1: string;
        city: string;
        state: string;
        pincode: string;
        email?: string | undefined;
        addressLine2?: string | undefined;
        landmark?: string | undefined;
    }, {
        fullName: string;
        phone: string;
        addressLine1: string;
        city: string;
        state: string;
        pincode: string;
        email?: string | undefined;
        addressLine2?: string | undefined;
        landmark?: string | undefined;
    }>;
    paymentMethod: z.ZodEnum<["cod", "razorpay"]>;
}, "strip", z.ZodTypeAny, {
    items: {
        quantity: number;
        productId: string;
        selectedSize?: string | undefined;
        selectedColor?: string | undefined;
    }[];
    shippingAddress: {
        fullName: string;
        phone: string;
        addressLine1: string;
        city: string;
        state: string;
        pincode: string;
        email?: string | undefined;
        addressLine2?: string | undefined;
        landmark?: string | undefined;
    };
    paymentMethod: "cod" | "razorpay";
}, {
    items: {
        quantity: number;
        productId: string;
        selectedSize?: string | undefined;
        selectedColor?: string | undefined;
    }[];
    shippingAddress: {
        fullName: string;
        phone: string;
        addressLine1: string;
        city: string;
        state: string;
        pincode: string;
        email?: string | undefined;
        addressLine2?: string | undefined;
        landmark?: string | undefined;
    };
    paymentMethod: "cod" | "razorpay";
}>;
export type CreateOrderInputSchema = z.infer<typeof createOrderSchema>;
export declare const orderIdParamSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
export type OrderIdParamInput = z.infer<typeof orderIdParamSchema>;
//# sourceMappingURL=order.d.ts.map