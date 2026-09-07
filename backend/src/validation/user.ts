import { z } from 'zod';

/**
 * Validates the request body for POST /api/auth/ensure-profile.
 * Ensures profile existence right after signup or OAuth authentication.
 */
export const ensureProfileSchema = z.object({
  email: z.string().trim().email('Invalid email address').max(255, 'Email cannot exceed 255 characters'),
  name: z.string().trim().min(1, 'Name is required').max(200, 'Name cannot exceed 200 characters'),
  phone: z.string().trim().max(20, 'Phone cannot exceed 20 characters').optional(),
});

export type EnsureProfileSchemaInput = z.infer<typeof ensureProfileSchema>;

/**
 * Validates the request body for PUT /api/auth/profile.
 * Allows updating name and/or phone. At least one field must be provided.
 * Role cannot be updated through this endpoint.
 */
export const updateProfileSchema = z
  .object({
    name: z.string().trim().min(1, 'Name cannot be empty').max(200, 'Name cannot exceed 200 characters').optional(),
    phone: z.string().trim().max(20, 'Phone cannot exceed 20 characters').optional(),
  })
  .refine(
    (data) => data.name !== undefined || data.phone !== undefined,
    { message: 'At least one field (name or phone) must be provided for update' },
  );

export type UpdateProfileSchemaInput = z.infer<typeof updateProfileSchema>;
