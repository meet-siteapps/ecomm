import { z } from 'zod';

/**
 * Validates query parameters for GET /api/products.
 * All fields are optional — omitting a field means "no filter applied".
 */
export const productListQuerySchema = z.object({
  search: z.string().trim().optional(),

  /** Category name or "all" (case-insensitive ilike on Supabase side) */
  category: z.string().trim().optional(),

  /** Age group prefix, e.g. "0-6 Months". "All Ages" means no filter. */
  ageGroup: z.string().trim().optional(),

  /** Maximum price in INR. Must be a positive number. */
  maxPrice: z.coerce
    .number()
    .positive('maxPrice must be a positive number')
    .optional(),

  /** Sort order */
  sortBy: z
    .enum(['featured', 'price-low', 'price-high', 'discount'])
    .optional(),

  /** Cap total results. 1–200 */
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(200)
    .optional(),
});

export type ProductListQueryInput = z.infer<typeof productListQuerySchema>;

/**
 * Validates the :id route param for GET /api/products/:id.
 * Supabase product IDs are UUIDs.
 */
export const productIdParamSchema = z.object({
  id: z.string().uuid({ message: 'Product id must be a valid UUID' }),
});

export type ProductIdParamInput = z.infer<typeof productIdParamSchema>;
