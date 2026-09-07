import { z } from 'zod';
export declare const ensureProfileSchema: z.ZodObject<{
    email: z.ZodString;
    name: z.ZodString;
    phone: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    email: string;
    phone?: string | undefined;
}, {
    name: string;
    email: string;
    phone?: string | undefined;
}>;
export type EnsureProfileSchemaInput = z.infer<typeof ensureProfileSchema>;
export declare const updateProfileSchema: z.ZodEffects<z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    phone?: string | undefined;
}, {
    name?: string | undefined;
    phone?: string | undefined;
}>, {
    name?: string | undefined;
    phone?: string | undefined;
}, {
    name?: string | undefined;
    phone?: string | undefined;
}>;
export type UpdateProfileSchemaInput = z.infer<typeof updateProfileSchema>;
//# sourceMappingURL=user.d.ts.map