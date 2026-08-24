import { createClient } from './client';
import { StoreSettings, DEFAULT_STORE_SETTINGS } from '@/types/settings';

/**
 * Fetch Store Settings from Supabase
 */
export async function getStoreSettings(): Promise<StoreSettings> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('store_settings')
      .select('*')
      .eq('id', 'default')
      .maybeSingle();

    if (error || !data) {
      return DEFAULT_STORE_SETTINGS;
    }

    return {
      ...DEFAULT_STORE_SETTINGS,
      ...data,
    };
  } catch (err) {
    console.error('Error fetching store settings:', err);
    return DEFAULT_STORE_SETTINGS;
  }
}

/**
 * Save / Update Store Settings in Supabase (Admin Only)
 */
export async function updateStoreSettings(
  settings: Partial<StoreSettings>
): Promise<StoreSettings> {
  const supabase = createClient();

  const payload = {
    ...settings,
    id: 'default',
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('store_settings')
    .upsert(payload, { onConflict: 'id' })
    .select()
    .single();

  if (error) {
    console.error('Failed to update store settings:', error);
    throw new Error(error.message || 'Failed to save store settings.');
  }

  return data as StoreSettings;
}
