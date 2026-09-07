export interface StoreSettings {
    id: string;
    store_name: string;
    tagline?: string | null;
    contact_email: string;
    contact_phone: string;
    store_address?: string | null;
    shipping_fee: number;
    free_shipping_threshold: number;
    tax_percentage: number;
    currency_symbol: string;
    is_cod_enabled: boolean;
    updated_at?: string;
}
export interface UpdateSettingsInput {
    store_name?: string;
    tagline?: string | null;
    contact_email?: string;
    contact_phone?: string;
    store_address?: string | null;
    shipping_fee?: number;
    free_shipping_threshold?: number;
    tax_percentage?: number;
    currency_symbol?: string;
    is_cod_enabled?: boolean;
}
export declare const DEFAULT_STORE_SETTINGS: StoreSettings;
//# sourceMappingURL=settings.d.ts.map