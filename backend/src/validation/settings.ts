import { z } from 'zod';

/**
 * Schema for updating store settings.
 * All fields are optional, but at least one must be provided.
 */
export const updateSettingsSchema = z
  .object({
    store_name: z
      .string()
      .trim()
      .min(1, 'Store name cannot be empty')
      .max(200, 'Store name cannot exceed 200 characters')
      .optional(),
    tagline: z
      .string()
      .trim()
      .max(300, 'Tagline cannot exceed 300 characters')
      .optional()
      .nullable(),
    contact_email: z
      .string()
      .trim()
      .email('Invalid contact email address')
      .max(255, 'Contact email cannot exceed 255 characters')
      .optional(),
    contact_phone: z
      .string()
      .trim()
      .min(1, 'Contact phone cannot be empty')
      .max(30, 'Contact phone cannot exceed 30 characters')
      .optional(),
    store_address: z
      .string()
      .trim()
      .max(500, 'Store address cannot exceed 500 characters')
      .optional()
      .nullable(),
    shipping_fee: z
      .coerce
      .number()
      .min(0, 'Shipping fee must be non-negative')
      .max(100_000, 'Shipping fee cannot exceed 100,000')
      .optional(),
    free_shipping_threshold: z
      .coerce
      .number()
      .min(0, 'Free shipping threshold must be non-negative')
      .max(1_000_000, 'Free shipping threshold cannot exceed 1,000,000')
      .optional(),
    tax_percentage: z
      .coerce
      .number()
      .min(0, 'Tax percentage must be non-negative')
      .max(100, 'Tax percentage cannot exceed 100')
      .optional(),
    currency_symbol: z
      .string()
      .trim()
      .min(1, 'Currency symbol cannot be empty')
      .max(10, 'Currency symbol cannot exceed 10 characters')
      .optional(),
    is_cod_enabled: z
      .boolean()
      .optional(),
  })
  .refine(
    (data) => Object.keys(data).some((key) => data[key as keyof typeof data] !== undefined),
    { message: 'At least one field must be provided for update' },
  );

export type UpdateSettingsSchemaInput = z.infer<typeof updateSettingsSchema>;
