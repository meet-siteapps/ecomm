import { z } from 'zod';

/**
 * Validates the request body for POST /api/auth/ensure-profile.
 * Ensures profile existence right after signup or OAuth authentication.
 */
export const ensureProfileSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
  name: z.string().trim().min(1, 'Name is required'),
  phone: z.string().trim().optional(),
});

export type EnsureProfileSchemaInput = z.infer<typeof ensureProfileSchema>;

/**
 * Validates the request body for PUT /api/auth/profile.
 * Allows updating name and/or phone. At least one field must be provided.
 * Role cannot be updated through this endpoint.
 */
export const updateProfileSchema = z
  .object({
    name: z.string().trim().min(1, 'Name cannot be empty').optional(),
    phone: z.string().trim().optional(),
  })
  .refine(
    (data) => data.name !== undefined || data.phone !== undefined,
    { message: 'At least one field (name or phone) must be provided for update' },
  );

export type UpdateProfileSchemaInput = z.infer<typeof updateProfileSchema>;
