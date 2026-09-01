import { z } from 'zod';

export const productInputSchema = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters'),
  brand: z.string().default(''),
  category: z.string().min(1, 'Category is required'),
  subcategory: z.string().default(''),
  images: z.array(z.string().url()).min(1, 'At least one product image is required'),
  mrp: z.number().positive('MRP must be greater than 0'),
  price: z.number().positive('Selling price must be greater than 0'),
  discount: z.number().min(0).max(100).default(0),
  age_group: z.string().default(''),
  size: z.string().default(''),
  colour: z.string().default(''),
  material: z.string().default(''),
  description: z.string().default(''),
  whats_included: z.array(z.string()).default([]),
  key_features: z.array(z.string()).default([]),
  care_instructions: z.string().default(''),
  stock: z.number().int().nonnegative('Stock cannot be negative').default(0),
  is_active: z.boolean().default(true),
});

export type ValidatedProductInput = z.infer<typeof productInputSchema>;
