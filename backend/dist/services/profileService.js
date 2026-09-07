"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = getProfile;
exports.ensureProfile = ensureProfile;
exports.updateProfile = updateProfile;
const supabaseAdmin_js_1 = require("./supabaseAdmin.js");
const errorHandler_js_1 = require("../middleware/errorHandler.js");
async function getProfile(userId) {
    const supabase = (0, supabaseAdmin_js_1.getSupabaseAdminClient)();
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
    if (error) {
        throw new errorHandler_js_1.AppError(`Failed to fetch user profile: ${error.message}`, 500, 'PROFILE_FETCH_FAILED');
    }
    if (!data) {
        throw new errorHandler_js_1.AppError(`User profile not found for ID: ${userId}`, 404, 'PROFILE_NOT_FOUND');
    }
    return data;
}
async function ensureProfile(userId, input) {
    const supabase = (0, supabaseAdmin_js_1.getSupabaseAdminClient)();
    const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
    if (fetchError) {
        throw new errorHandler_js_1.AppError(`Failed to check user profile: ${fetchError.message}`, 500, 'PROFILE_CHECK_FAILED');
    }
    if (existingProfile) {
        return existingProfile;
    }
    const newProfile = {
        id: userId,
        name: input.name.trim(),
        email: input.email.trim().toLowerCase(),
        phone: input.phone ? input.phone.trim() : null,
        role: 'customer',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };
    const { data: createdProfile, error: insertError } = await supabase
        .from('profiles')
        .insert([newProfile])
        .select()
        .single();
    if (insertError) {
        const { data: retryProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .maybeSingle();
        if (retryProfile) {
            return retryProfile;
        }
        throw new errorHandler_js_1.AppError(`Failed to create user profile: ${insertError.message}`, 500, 'PROFILE_CREATE_FAILED');
    }
    return createdProfile;
}
async function updateProfile(userId, input) {
    const supabase = (0, supabaseAdmin_js_1.getSupabaseAdminClient)();
    const updates = {
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
        throw new errorHandler_js_1.AppError(`Failed to update profile: ${error.message}`, 500, 'PROFILE_UPDATE_FAILED');
    }
    if (!data) {
        throw new errorHandler_js_1.AppError(`User profile not found for ID: ${userId}`, 404, 'PROFILE_NOT_FOUND');
    }
    return data;
}
//# sourceMappingURL=profileService.js.map