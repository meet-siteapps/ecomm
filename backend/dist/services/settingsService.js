"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSettings = getSettings;
exports.updateSettings = updateSettings;
const supabaseAdmin_js_1 = require("./supabaseAdmin.js");
const settings_js_1 = require("../types/settings.js");
const errorHandler_js_1 = require("../middleware/errorHandler.js");
async function getSettings() {
    const supabase = (0, supabaseAdmin_js_1.getSupabaseAdminClient)();
    const { data, error } = await supabase
        .from('store_settings')
        .select('*')
        .eq('id', 'default')
        .maybeSingle();
    if (error) {
        throw new errorHandler_js_1.AppError(`Failed to fetch store settings: ${error.message}`, 500, 'SETTINGS_FETCH_FAILED');
    }
    if (!data) {
        try {
            const { data: seeded, error: seedError } = await supabase
                .from('store_settings')
                .upsert(settings_js_1.DEFAULT_STORE_SETTINGS, { onConflict: 'id' })
                .select()
                .maybeSingle();
            if (!seedError && seeded) {
                return seeded;
            }
        }
        catch {
        }
        return settings_js_1.DEFAULT_STORE_SETTINGS;
    }
    return {
        ...settings_js_1.DEFAULT_STORE_SETTINGS,
        ...data,
        shipping_fee: Number(data.shipping_fee ?? settings_js_1.DEFAULT_STORE_SETTINGS.shipping_fee),
        free_shipping_threshold: Number(data.free_shipping_threshold ?? settings_js_1.DEFAULT_STORE_SETTINGS.free_shipping_threshold),
        tax_percentage: Number(data.tax_percentage ?? settings_js_1.DEFAULT_STORE_SETTINGS.tax_percentage),
    };
}
async function updateSettings(input) {
    const supabase = (0, supabaseAdmin_js_1.getSupabaseAdminClient)();
    const updates = {
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
        throw new errorHandler_js_1.AppError(`Failed to update store settings: ${error.message}`, 500, 'SETTINGS_UPDATE_FAILED');
    }
    return {
        ...settings_js_1.DEFAULT_STORE_SETTINGS,
        ...data,
        shipping_fee: Number(data.shipping_fee ?? settings_js_1.DEFAULT_STORE_SETTINGS.shipping_fee),
        free_shipping_threshold: Number(data.free_shipping_threshold ?? settings_js_1.DEFAULT_STORE_SETTINGS.free_shipping_threshold),
        tax_percentage: Number(data.tax_percentage ?? settings_js_1.DEFAULT_STORE_SETTINGS.tax_percentage),
    };
}
//# sourceMappingURL=settingsService.js.map