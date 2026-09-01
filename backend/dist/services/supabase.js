"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSupabaseClient = getSupabaseClient;
const supabase_js_1 = require("@supabase/supabase-js");
let _client = null;
function getSupabaseClient() {
    if (_client)
        return _client;
    const url = process.env['SUPABASE_URL'];
    const anonKey = process.env['SUPABASE_ANON_KEY'];
    if (!url || !anonKey) {
        throw new Error('Missing Supabase configuration. Ensure SUPABASE_URL and SUPABASE_ANON_KEY are set in your .env file.');
    }
    _client = (0, supabase_js_1.createClient)(url, anonKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false,
        },
    });
    return _client;
}
//# sourceMappingURL=supabase.js.map