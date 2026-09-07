export type UserRole = 'customer' | 'admin';

/**
 * User profile representing a registered customer or administrator.
 * Matches the Supabase `profiles` table schema.
 */
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: UserRole;
  created_at?: string;
  updated_at?: string;
  createdAt?: string;
}

/**
 * Payload to ensure profile existence (e.g. after registration or first login).
 */
export interface EnsureProfileInput {
  email: string;
  name: string;
  phone?: string;
}

/**
 * Payload to update profile details (name and phone only).
 */
export interface UpdateProfileInput {
  name?: string;
  phone?: string;
}
