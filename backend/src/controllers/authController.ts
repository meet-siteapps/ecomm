import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, ApiSuccess } from '../types/index.js';
import { UserProfile } from '../types/user.js';
import {
  getProfile as getProfileService,
  ensureProfile as ensureProfileService,
  updateProfile as updateProfileService,
} from '../services/profileService.js';
import {
  EnsureProfileSchemaInput,
  UpdateProfileSchemaInput,
} from '../validation/user.js';

/**
 * GET /api/auth/me
 *
 * Returns the full user profile including name, email, phone, role, and timestamps.
 *
 * Protected by: requireAuth
 */
export async function getMe(
  req: AuthenticatedRequest,
  res: Response<ApiSuccess<UserProfile>>,
  next: NextFunction,
): Promise<void> {
  try {
    const profile = await getProfileService(req.user!.id);
    res.status(200).json({
      status: 'ok',
      data: profile,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/ensure-profile
 *
 * Creates or retrieves the user profile row in Supabase right after signup/OAuth.
 *
 * Protected by: requireAuth
 */
export async function ensureProfile(
  req: AuthenticatedRequest,
  res: Response<ApiSuccess<UserProfile>>,
  next: NextFunction,
): Promise<void> {
  try {
    const profile = await ensureProfileService(
      req.user!.id,
      req.body as EnsureProfileSchemaInput,
    );
    res.status(200).json({
      status: 'ok',
      data: profile,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/auth/profile
 *
 * Updates the user's name and/or phone. Role cannot be updated.
 *
 * Protected by: requireAuth
 */
export async function updateProfile(
  req: AuthenticatedRequest,
  res: Response<ApiSuccess<UserProfile>>,
  next: NextFunction,
): Promise<void> {
  try {
    const profile = await updateProfileService(
      req.user!.id,
      req.body as UpdateProfileSchemaInput,
    );
    res.status(200).json({
      status: 'ok',
      data: profile,
    });
  } catch (err) {
    next(err);
  }
}

