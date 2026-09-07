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
      .optional(),
    tagline: z
      .string()
      .trim()
      .optional()
      .nullable(),
    contact_email: z
      .string()
      .trim()
      .email('Invalid contact email address')
      .optional(),
    contact_phone: z
      .string()
      .trim()
      .min(1, 'Contact phone cannot be empty')
      .optional(),
    store_address: z
      .string()
      .trim()
      .optional()
      .nullable(),
    shipping_fee: z
      .coerce
      .number()
      .min(0, 'Shipping fee must be non-negative')
      .optional(),
    free_shipping_threshold: z
      .coerce
      .number()
      .min(0, 'Free shipping threshold must be non-negative')
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
