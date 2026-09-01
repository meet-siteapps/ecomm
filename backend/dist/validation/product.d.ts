import { z } from 'zod';
export declare const productListQuerySchema: z.ZodObject<{
    search: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
    ageGroup: z.ZodOptional<z.ZodString>;
    maxPrice: z.ZodOptional<z.ZodNumber>;
    sortBy: z.ZodOptional<z.ZodEnum<["featured", "price-low", "price-high", "discount"]>>;
    limit: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    search?: string | undefined;
    category?: string | undefined;
    ageGroup?: string | undefined;
    maxPrice?: number | undefined;
    sortBy?: "featured" | "price-low" | "price-high" | "discount" | undefined;
    limit?: number | undefined;
}, {
    search?: string | undefined;
    category?: string | undefined;
    ageGroup?: string | undefined;
    maxPrice?: number | undefined;
    sortBy?: "featured" | "price-low" | "price-high" | "discount" | undefined;
    limit?: number | undefined;
}>;
export type ProductListQueryInput = z.infer<typeof productListQuerySchema>;
export declare const productIdParamSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
export type ProductIdParamInput = z.infer<typeof productIdParamSchema>;
//# sourceMappingURL=product.d.ts.map