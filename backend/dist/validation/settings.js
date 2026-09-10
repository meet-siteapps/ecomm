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
        .max(200, 'Store name cannot exceed 200 characters')
        .optional(),
    tagline: zod_1.z
        .string()
        .trim()
        .max(300, 'Tagline cannot exceed 300 characters')
        .optional()
        .nullable(),
    contact_email: zod_1.z
        .string()
        .trim()
        .email('Invalid contact email address')
        .max(255, 'Contact email cannot exceed 255 characters')
        .optional(),
    contact_phone: zod_1.z
        .string()
        .trim()
        .min(1, 'Contact phone cannot be empty')
        .max(30, 'Contact phone cannot exceed 30 characters')
        .optional(),
    whatsapp_number: zod_1.z
        .string()
        .trim()
        .max(30, 'WhatsApp number cannot exceed 30 characters')
        .optional()
        .nullable(),
    upi_id: zod_1.z
        .string()
        .trim()
        .max(50, 'UPI ID cannot exceed 50 characters')
        .optional()
        .nullable(),
    store_address: zod_1.z
        .string()
        .trim()
        .max(500, 'Store address cannot exceed 500 characters')
        .optional()
        .nullable(),
    shipping_fee: zod_1.z
        .coerce
        .number()
        .min(0, 'Shipping fee must be non-negative')
        .max(100_000, 'Shipping fee cannot exceed 100,000')
        .optional(),
    free_shipping_threshold: zod_1.z
        .coerce
        .number()
        .min(0, 'Free shipping threshold must be non-negative')
        .max(1_000_000, 'Free shipping threshold cannot exceed 1,000,000')
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
        .max(10, 'Currency symbol cannot exceed 10 characters')
        .optional(),
    is_cod_enabled: zod_1.z
        .boolean()
        .optional(),
})
    .refine((data) => Object.keys(data).some((key) => data[key] !== undefined), { message: 'At least one field must be provided for update' });
//# sourceMappingURL=settings.js.map