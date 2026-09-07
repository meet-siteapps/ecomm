"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSettingsSchema = void 0;
const zod_1 = require("zod");
exports.updateSettingsSchema = zod_1.z
    .object({
    store_name: zod_1.z
        .string()
        .trim()
        .min(1, 'Store name cannot be empty')
        .optional(),
    tagline: zod_1.z
        .string()
        .trim()
        .optional()
        .nullable(),
    contact_email: zod_1.z
        .string()
        .trim()
        .email('Invalid contact email address')
        .optional(),
    contact_phone: zod_1.z
        .string()
        .trim()
        .min(1, 'Contact phone cannot be empty')
        .optional(),
    store_address: zod_1.z
        .string()
        .trim()
        .optional()
        .nullable(),
    shipping_fee: zod_1.z
        .coerce
        .number()
        .min(0, 'Shipping fee must be non-negative')
        .optional(),
    free_shipping_threshold: zod_1.z
        .coerce
        .number()
        .min(0, 'Free shipping threshold must be non-negative')
        .optional(),
    tax_percentage: zod_1.z
        .coerce
        .number()
        .min(0, 'Tax percentage must be non-negative')
        .max(100, 'Tax percentage cannot exceed 100')
        .optional(),
    currency_symbol: zod_1.z
        .string()
        .trim()
        .min(1, 'Currency symbol cannot be empty')
        .optional(),
    is_cod_enabled: zod_1.z
        .boolean()
        .optional(),
})
    .refine((data) => Object.keys(data).some((key) => data[key] !== undefined), { message: 'At least one field must be provided for update' });
//# sourceMappingURL=settings.js.map