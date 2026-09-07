import { z } from 'zod';
export declare const updateSettingsSchema: z.ZodEffects<z.ZodObject<{
    store_name: z.ZodOptional<z.ZodString>;
    tagline: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    contact_email: z.ZodOptional<z.ZodString>;
    contact_phone: z.ZodOptional<z.ZodString>;
    store_address: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    shipping_fee: z.ZodOptional<z.ZodNumber>;
    free_shipping_threshold: z.ZodOptional<z.ZodNumber>;
    tax_percentage: z.ZodOptional<z.ZodNumber>;
    currency_symbol: z.ZodOptional<z.ZodString>;
    is_cod_enabled: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    shipping_fee?: number | undefined;
    store_name?: string | undefined;
    tagline?: string | null | undefined;
    contact_email?: string | undefined;
    contact_phone?: string | undefined;
    store_address?: string | null | undefined;
    free_shipping_threshold?: number | undefined;
    tax_percentage?: number | undefined;
    currency_symbol?: string | undefined;
    is_cod_enabled?: boolean | undefined;
}, {
    shipping_fee?: number | undefined;
    store_name?: string | undefined;
    tagline?: string | null | undefined;
    contact_email?: string | undefined;
    contact_phone?: string | undefined;
    store_address?: string | null | undefined;
    free_shipping_threshold?: number | undefined;
    tax_percentage?: number | undefined;
    currency_symbol?: string | undefined;
    is_cod_enabled?: boolean | undefined;
}>, {
    shipping_fee?: number | undefined;
    store_name?: string | undefined;
    tagline?: string | null | undefined;
    contact_email?: string | undefined;
    contact_phone?: string | undefined;
    store_address?: string | null | undefined;
    free_shipping_threshold?: number | undefined;
    tax_percentage?: number | undefined;
    currency_symbol?: string | undefined;
    is_cod_enabled?: boolean | undefined;
}, {
    shipping_fee?: number | undefined;
    store_name?: string | undefined;
    tagline?: string | null | undefined;
    contact_email?: string | undefined;
    contact_phone?: string | undefined;
    store_address?: string | null | undefined;
    free_shipping_threshold?: number | undefined;
    tax_percentage?: number | undefined;
    currency_symbol?: string | undefined;
    is_cod_enabled?: boolean | undefined;
}>;
export type UpdateSettingsSchemaInput = z.infer<typeof updateSettingsSchema>;
//# sourceMappingURL=settings.d.ts.map