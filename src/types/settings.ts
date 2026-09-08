export interface StoreSettings {
  id?: string;
  store_name: string;
  tagline?: string;
  contact_email: string;
  contact_phone: string;
  store_address: string;
  shipping_fee: number;
  free_shipping_threshold: number;
  tax_percentage: number;
  currency_symbol: string;
  is_cod_enabled: boolean;
  updated_at?: string;
}

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  id: 'default',
  store_name: 'Baby Ladoo',
  tagline: 'Curated baby & kids essentials',
  contact_email: 'support@babyladoo.com',
  contact_phone: '+91 98765 43210',
  store_address: 'Ahmedabad, Gujarat, India',
  shipping_fee: 99,
  free_shipping_threshold: 999,
  tax_percentage: 0,
  currency_symbol: '₹',
  is_cod_enabled: true,
};
