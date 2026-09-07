import { z } from 'zod';

/**
 * Validates query parameters for GET /api/products.
 * All fields are optional — omitting a field means "no filter applied".
 */
export const productListQuerySchema = z.object({
  search: z.string().trim().max(200, 'Search query cannot exceed 200 characters').optional(),

  /** Category name or "all" (case-insensitive ilike on Supabase side) */
  category: z.string().trim().max(100, 'Category cannot exceed 100 characters').optional(),

  /** Age group prefix, e.g. "0-6 Months". "All Ages" means no filter. */
  ageGroup: z.string().trim().max(50, 'Age group cannot exceed 50 characters').optional(),

  /** Maximum price in INR. Must be a positive number. */
  maxPrice: z.coerce
    .number()
    .positive('maxPrice must be a positive number')
    .max(10_000_000, 'maxPrice cannot exceed 10,000,000')
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

/**
 * Schema for creating a new product (POST /api/admin/products).
 * Validates all required and optional product fields, supporting both snake_case
 * and camelCase aliases for developer convenience, and calculates discount if omitted.
 */
export const createProductSchema = z
  .object({
    name: z.string().trim().min(1, 'Product name is required').max(200, 'Product name cannot exceed 200 characters'),
    brand: z.string().trim().max(100, 'Brand cannot exceed 100 characters').optional().default(''),
    category: z.string().trim().min(1, 'Category is required').max(100, 'Category cannot exceed 100 characters'),
    subcategory: z.string().trim().max(100, 'Subcategory cannot exceed 100 characters').optional().default(''),
    images: z
      .array(z.string().url('Each image must be a valid URL').max(1000, 'Image URL cannot exceed 1000 characters'))
      .max(10, 'Product cannot have more than 10 images')
      .optional()
      .default([]),
    mrp: z.coerce.number().positive('MRP must be greater than 0').max(10_000_000, 'MRP cannot exceed 10,000,000'),
    price: z.coerce.number().positive('Price must be greater than 0').max(10_000_000, 'Price cannot exceed 10,000,000'),
    discount: z.coerce.number().min(0).max(100).optional(),

    // Specifications (accept snake_case or camelCase)
    age_group: z.string().trim().max(50, 'Age group cannot exceed 50 characters').optional(),
    ageGroup: z.string().trim().max(50, 'Age group cannot exceed 50 characters').optional(),
    size: z.string().trim().max(50, 'Size cannot exceed 50 characters').optional().default(''),
    colour: z.string().trim().max(50, 'Colour cannot exceed 50 characters').optional().default(''),
    color: z.string().trim().max(50, 'Color cannot exceed 50 characters').optional(),
    material: z.string().trim().max(100, 'Material cannot exceed 100 characters').optional().default(''),
    description: z.string().trim().max(5000, 'Description cannot exceed 5000 characters').optional().default(''),

    whats_included: z
      .array(z.string().trim().max(200, 'Item text cannot exceed 200 characters'))
      .max(20, 'Cannot exceed 20 items')
      .optional(),
    whatsIncluded: z
      .array(z.string().trim().max(200, 'Item text cannot exceed 200 characters'))
      .max(20, 'Cannot exceed 20 items')
      .optional(),
    key_features: z
      .array(z.string().trim().max(300, 'Feature text cannot exceed 300 characters'))
      .max(20, 'Cannot exceed 20 features')
      .optional(),
    keyFeatures: z
      .array(z.string().trim().max(300, 'Feature text cannot exceed 300 characters'))
      .max(20, 'Cannot exceed 20 features')
      .optional(),
    care_instructions: z.string().trim().max(1000, 'Care instructions cannot exceed 1000 characters').optional(),
    careInstructions: z.string().trim().max(1000, 'Care instructions cannot exceed 1000 characters').optional(),

    stock: z.coerce
      .number()
      .int()
      .min(0, 'Stock cannot be negative')
      .max(1_000_000, 'Stock cannot exceed 1,000,000')
      .optional()
      .default(0),
    is_active: z.boolean().optional(),
    isActive: z.boolean().optional(),
  })
  .transform((data) => {
    const mrp = data.mrp;
    const price = data.price;
    const calculatedDiscount =
      data.discount !== undefined
        ? data.discount
        : mrp > 0 && mrp >= price
        ? Math.round(((mrp - price) / mrp) * 100)
        : 0;

    return {
      name: data.name,
      brand: data.brand ?? '',
      category: data.category,
      subcategory: data.subcategory ?? '',
      images: data.images ?? [],
      mrp,
      price,
      discount: calculatedDiscount,
      age_group: data.age_group ?? data.ageGroup ?? '',
      size: data.size ?? '',
      colour: data.colour ?? data.color ?? '',
      material: data.material ?? '',
      description: data.description ?? '',
      whats_included: data.whats_included ?? data.whatsIncluded ?? [],
      key_features: data.key_features ?? data.keyFeatures ?? [],
      care_instructions: data.care_instructions ?? data.careInstructions ?? '',
      stock: data.stock ?? 0,
      is_active: data.is_active ?? data.isActive ?? true,
    };
  });

export type CreateProductSchemaInput = z.infer<typeof createProductSchema>;

/**
 * Schema for updating an existing product (PUT /api/admin/products/:id).
 * All fields are optional to support partial updates.
 */
export const updateProductSchema = z
  .object({
    name: z.string().trim().min(1, 'Product name cannot be empty').max(200, 'Product name cannot exceed 200 characters').optional(),
    brand: z.string().trim().max(100, 'Brand cannot exceed 100 characters').optional(),
    category: z.string().trim().min(1, 'Category cannot be empty').max(100, 'Category cannot exceed 100 characters').optional(),
    subcategory: z.string().trim().max(100, 'Subcategory cannot exceed 100 characters').optional(),
    images: z
      .array(z.string().url('Each image must be a valid URL').max(1000, 'Image URL cannot exceed 1000 characters'))
      .max(10, 'Product cannot have more than 10 images')
      .optional(),
    mrp: z.coerce.number().positive('MRP must be greater than 0').max(10_000_000, 'MRP cannot exceed 10,000,000').optional(),
    price: z.coerce.number().positive('Price must be greater than 0').max(10_000_000, 'Price cannot exceed 10,000,000').optional(),
    discount: z.coerce.number().min(0).max(100).optional(),

    age_group: z.string().trim().max(50, 'Age group cannot exceed 50 characters').optional(),
    ageGroup: z.string().trim().max(50, 'Age group cannot exceed 50 characters').optional(),
    size: z.string().trim().max(50, 'Size cannot exceed 50 characters').optional(),
    colour: z.string().trim().max(50, 'Colour cannot exceed 50 characters').optional(),
    color: z.string().trim().max(50, 'Color cannot exceed 50 characters').optional(),
    material: z.string().trim().max(100, 'Material cannot exceed 100 characters').optional(),
    description: z.string().trim().max(5000, 'Description cannot exceed 5000 characters').optional(),

    whats_included: z
      .array(z.string().trim().max(200, 'Item text cannot exceed 200 characters'))
      .max(20, 'Cannot exceed 20 items')
      .optional(),
    whatsIncluded: z
      .array(z.string().trim().max(200, 'Item text cannot exceed 200 characters'))
      .max(20, 'Cannot exceed 20 items')
      .optional(),
    key_features: z
      .array(z.string().trim().max(300, 'Feature text cannot exceed 300 characters'))
      .max(20, 'Cannot exceed 20 features')
      .optional(),
    keyFeatures: z
      .array(z.string().trim().max(300, 'Feature text cannot exceed 300 characters'))
      .max(20, 'Cannot exceed 20 features')
      .optional(),
    care_instructions: z.string().trim().max(1000, 'Care instructions cannot exceed 1000 characters').optional(),
    careInstructions: z.string().trim().max(1000, 'Care instructions cannot exceed 1000 characters').optional(),

    stock: z.coerce.number().int().min(0, 'Stock cannot be negative').max(1_000_000, 'Stock cannot exceed 1,000,000').optional(),
    is_active: z.boolean().optional(),
    isActive: z.boolean().optional(),
  })
  .transform((data) => {
    const result: Record<string, unknown> = {};

    if (data.name !== undefined) result['name'] = data.name;
    if (data.brand !== undefined) result['brand'] = data.brand;
    if (data.category !== undefined) result['category'] = data.category;
    if (data.subcategory !== undefined) result['subcategory'] = data.subcategory;
    if (data.images !== undefined) result['images'] = data.images;
    if (data.mrp !== undefined) result['mrp'] = data.mrp;
    if (data.price !== undefined) result['price'] = data.price;
    if (data.discount !== undefined) result['discount'] = data.discount;

    const ageGroup = data.age_group ?? data.ageGroup;
    if (ageGroup !== undefined) result['age_group'] = ageGroup;

    if (data.size !== undefined) result['size'] = data.size;
    const colour = data.colour ?? data.color;
    if (colour !== undefined) result['colour'] = colour;
    if (data.material !== undefined) result['material'] = data.material;
    if (data.description !== undefined) result['description'] = data.description;

    const whatsIncluded = data.whats_included ?? data.whatsIncluded;
    if (whatsIncluded !== undefined) result['whats_included'] = whatsIncluded;

    const keyFeatures = data.key_features ?? data.keyFeatures;
    if (keyFeatures !== undefined) result['key_features'] = keyFeatures;

    const careInstructions = data.care_instructions ?? data.careInstructions;
    if (careInstructions !== undefined) result['care_instructions'] = careInstructions;

    if (data.stock !== undefined) result['stock'] = data.stock;

    const isActive = data.is_active ?? data.isActive;
    if (isActive !== undefined) result['is_active'] = isActive;

    return result;
  });

export type UpdateProductSchemaInput = z.infer<typeof updateProductSchema>;

/**
 * Schema for toggling product active status (PATCH /api/admin/products/:id/status).
 */
export const toggleProductStatusSchema = z
  .object({
    is_active: z.boolean().optional(),
    isActive: z.boolean().optional(),
  })
  .refine(
    (data) => data.is_active !== undefined || data.isActive !== undefined,
    { message: 'Either is_active or isActive boolean must be provided' },
  )
  .transform((data) => ({
    is_active: data.is_active ?? data.isActive ?? true,
  }));

export type ToggleProductStatusSchemaInput = z.infer<typeof toggleProductStatusSchema>;

