import { getSupabaseAdminClient } from './supabaseAdmin.js';
import { UserProfile, EnsureProfileInput, UpdateProfileInput } from '../types/user.js';
import { AppError } from '../middleware/errorHandler.js';

/**
 * Fetch a user profile by user UUID from Supabase `profiles` table.
 *
 * @param userId Supabase Auth User ID (UUID)
 * @throws AppError 404 if profile does not exist
 * @returns UserProfile
 */
export async function getProfile(userId: string): Promise<UserProfile> {
  const supabase = getSupabaseAdminClient();

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    throw new AppError(
      `Failed to fetch user profile: ${error.message}`,
      500,
      'PROFILE_FETCH_FAILED',
    );
  }

  if (!data) {
    throw new AppError(
      `User profile not found for ID: ${userId}`,
      404,
      'PROFILE_NOT_FOUND',
    );
  }

  return data as UserProfile;
}

/**
 * Ensures a user profile exists in the database.
 * If the profile does not exist, provisions a new record with default role 'customer'.
 * If the profile already exists, returns the existing profile record without overwriting role or data.
 *
 * @param userId Supabase Auth User ID (UUID)
 * @param input EnsureProfileInput (email, name, optional phone)
 * @returns UserProfile
 */
export async function ensureProfile(
  userId: string,
  input: EnsureProfileInput,
): Promise<UserProfile> {
  const supabase = getSupabaseAdminClient();

  // 1. Check if profile already exists
  const { data: existingProfile, error: fetchError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (fetchError) {
    throw new AppError(
      `Failed to check user profile: ${fetchError.message}`,
      500,
      'PROFILE_CHECK_FAILED',
    );
  }

  if (existingProfile) {
    return existingProfile as UserProfile;
  }

  // 2. Insert new profile with customer role
  const newProfile = {
    id: userId,
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    phone: input.phone ? input.phone.trim() : null,
    role: 'customer' as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { data: createdProfile, error: insertError } = await supabase
    .from('profiles')
    .insert([newProfile])
    .select()
    .single();

  if (insertError) {
    // If concurrent insert occurred, attempt to fetch again
    const { data: retryProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (retryProfile) {
      return retryProfile as UserProfile;
    }

    throw new AppError(
      `Failed to create user profile: ${insertError.message}`,
      500,
      'PROFILE_CREATE_FAILED',
    );
  }

  return createdProfile as UserProfile;
}

/**
 * Updates an existing user profile (name and/or phone only).
 * Role changes are strictly forbidden through this endpoint.
 *
 * @param userId Supabase Auth User ID (UUID)
 * @param input UpdateProfileInput (name?, phone?)
 * @throws AppError 404 if profile does not exist
 * @returns UserProfile
 */
export async function updateProfile(
  userId: string,
  input: UpdateProfileInput,
): Promise<UserProfile> {
  const supabase = getSupabaseAdminClient();

  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (input.name !== undefined) {
    updates['name'] = input.name.trim();
  }
  if (input.phone !== undefined) {
    updates['phone'] = input.phone ? input.phone.trim() : null;
  }

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .maybeSingle();

  if (error) {
    throw new AppError(
      `Failed to update profile: ${error.message}`,
      500,
      'PROFILE_UPDATE_FAILED',
    );
  }

  if (!data) {
    throw new AppError(
      `User profile not found for ID: ${userId}`,
      404,
      'PROFILE_NOT_FOUND',
    );
  }

  return data as UserProfile;
}
