import { getSupabaseAdminClient } from './supabaseAdmin.js';
import {
  StoreSettings,
  UpdateSettingsInput,
  DEFAULT_STORE_SETTINGS,
} from '../types/settings.js';
import { AppError } from '../middleware/errorHandler.js';

/**
 * Fetch the single store settings record from Supabase.
 * Returns default settings if no record is found in the database.
 *
 * @returns StoreSettings
 */
export async function getSettings(): Promise<StoreSettings> {
  const supabase = getSupabaseAdminClient();

  const { data, error } = await supabase
    .from('store_settings')
    .select('*')
    .eq('id', 'default')
    .maybeSingle();

  if (error) {
    throw new AppError(
      `Failed to fetch store settings: ${error.message}`,
      500,
      'SETTINGS_FETCH_FAILED',
    );
  }

  if (!data) {
    // If missing from DB, auto-seed default row
    try {
      const { data: seeded, error: seedError } = await supabase
        .from('store_settings')
        .upsert(DEFAULT_STORE_SETTINGS, { onConflict: 'id' })
        .select()
        .maybeSingle();

      if (!seedError && seeded) {
        return seeded as StoreSettings;
      }
    } catch {
      // Fallback to in-memory defaults
    }
    return DEFAULT_STORE_SETTINGS;
  }

  return {
    ...DEFAULT_STORE_SETTINGS,
    ...(data as StoreSettings),
    shipping_fee: Number(data.shipping_fee ?? DEFAULT_STORE_SETTINGS.shipping_fee),
    free_shipping_threshold: Number(
      data.free_shipping_threshold ?? DEFAULT_STORE_SETTINGS.free_shipping_threshold,
    ),
    tax_percentage: Number(
      data.tax_percentage ?? DEFAULT_STORE_SETTINGS.tax_percentage,
    ),
  };
}

/**
 * Update store settings in Supabase (Admin Only).
 * Updates the 'default' record and sets updated_at.
 *
 * @param input Partial store settings update
 * @returns Updated StoreSettings
 */
export async function updateSettings(
  input: UpdateSettingsInput,
): Promise<StoreSettings> {
  const supabase = getSupabaseAdminClient();

  const updates: Record<string, unknown> = {
    id: 'default',
    updated_at: new Date().toISOString(),
  };

  if (input.store_name !== undefined) {
    updates['store_name'] = input.store_name.trim();
  }
  if (input.tagline !== undefined) {
    updates['tagline'] = input.tagline ? input.tagline.trim() : null;
  }
  if (input.contact_email !== undefined) {
    updates['contact_email'] = input.contact_email.trim().toLowerCase();
  }
  if (input.contact_phone !== undefined) {
    updates['contact_phone'] = input.contact_phone.trim();
  }
  if (input.store_address !== undefined) {
    updates['store_address'] = input.store_address ? input.store_address.trim() : null;
  }
  if (input.shipping_fee !== undefined) {
    updates['shipping_fee'] = Number(input.shipping_fee);
  }
  if (input.free_shipping_threshold !== undefined) {
    updates['free_shipping_threshold'] = Number(input.free_shipping_threshold);
  }
  if (input.tax_percentage !== undefined) {
    updates['tax_percentage'] = Number(input.tax_percentage);
  }
  if (input.currency_symbol !== undefined) {
    updates['currency_symbol'] = input.currency_symbol.trim();
  }
  if (input.is_cod_enabled !== undefined) {
    updates['is_cod_enabled'] = Boolean(input.is_cod_enabled);
  }

  const { data, error } = await supabase
    .from('store_settings')
    .upsert(updates, { onConflict: 'id' })
    .select()
    .single();

  if (error) {
    throw new AppError(
      `Failed to update store settings: ${error.message}`,
      500,
      'SETTINGS_UPDATE_FAILED',
    );
  }

  return {
    ...DEFAULT_STORE_SETTINGS,
    ...(data as StoreSettings),
    shipping_fee: Number(data.shipping_fee ?? DEFAULT_STORE_SETTINGS.shipping_fee),
    free_shipping_threshold: Number(
      data.free_shipping_threshold ?? DEFAULT_STORE_SETTINGS.free_shipping_threshold,
    ),
    tax_percentage: Number(
      data.tax_percentage ?? DEFAULT_STORE_SETTINGS.tax_percentage,
    ),
  };
}
