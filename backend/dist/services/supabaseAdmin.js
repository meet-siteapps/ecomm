"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSupabaseAdminClient = getSupabaseAdminClient;
const supabase_js_1 = require("@supabase/supabase-js");
let _adminClient = null;
function getSupabaseAdminClient() {
    if (_adminClient)
        return _adminClient;
    const url = process.env['SUPABASE_URL'];
    const serviceRoleKey = process.env['SUPABASE_SERVICE_ROLE_KEY'];
    if (!url || !serviceRoleKey) {
        throw new Error('Missing Supabase admin configuration. Ensure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in your .env file.');
    }
    _adminClient = (0, supabase_js_1.createClient)(url, serviceRoleKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false,
        },
    });
    return _adminClient;
}
//# sourceMappingURL=supabaseAdmin.js.map