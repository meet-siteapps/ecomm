/**
 * Shape of the store_settings table in Supabase.
 * Matches supabase/migrations/04_create_store_settings.sql.
 */
export interface StoreSettings {
  id: string;
  store_name: string;
  tagline?: string | null;
  contact_email: string;
  contact_phone: string;
  whatsapp_number?: string | null;
  upi_id?: string | null;
  store_address?: string | null;
  shipping_fee: number;
  free_shipping_threshold: number;
  tax_percentage: number;
  currency_symbol: string;
  is_cod_enabled: boolean;
  updated_at?: string;
}

/**
 * Payload for updating store settings. All fields are optional (partial update).
 */
export interface UpdateSettingsInput {
  store_name?: string;
  tagline?: string | null;
  contact_email?: string;
  contact_phone?: string;
  whatsapp_number?: string | null;
  upi_id?: string | null;
  store_address?: string | null;
  shipping_fee?: number;
  free_shipping_threshold?: number;
  tax_percentage?: number;
  currency_symbol?: string;
  is_cod_enabled?: boolean;
}

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  id: 'default',
  store_name: 'Baby Ladoo',
  tagline: 'Curated baby & kids essentials',
  contact_email: 'support@babyladoo.com',
  contact_phone: '+91 98765 43210',
  whatsapp_number: '+91 98765 43210',
  upi_id: null,
  store_address: 'Ahmedabad, Gujarat, India',
  shipping_fee: 99,
  free_shipping_threshold: 999,
  tax_percentage: 0,
  currency_symbol: '₹',
  is_cod_enabled: true,
};
