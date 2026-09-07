import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest, ApiSuccess } from '../types/index.js';
import { StoreSettings } from '../types/settings.js';
import {
  getSettings as getSettingsService,
  updateSettings as updateSettingsService,
} from '../services/settingsService.js';
import { UpdateSettingsSchemaInput } from '../validation/settings.js';

/**
 * GET /api/settings
 *
 * Public endpoint to fetch store settings (store name, contact info, shipping rules).
 * Used by the storefront footer, checkout calculations, and contact pages.
 */
export async function getSettings(
  _req: Request,
  res: Response<ApiSuccess<StoreSettings>>,
  next: NextFunction,
): Promise<void> {
  try {
    const settings = await getSettingsService();
    res.status(200).json({
      status: 'ok',
      data: settings,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/admin/settings
 *
 * Admin-only endpoint to update store configuration.
 *
 * Protected by: requireAuth, requireAdmin
 */
export async function updateSettings(
  req: AuthenticatedRequest,
  res: Response<ApiSuccess<StoreSettings>>,
  next: NextFunction,
): Promise<void> {
  try {
    const settings = await updateSettingsService(
      req.body as UpdateSettingsSchemaInput,
    );
    res.status(200).json({
      status: 'ok',
      data: settings,
    });
  } catch (err) {
    next(err);
  }
}
