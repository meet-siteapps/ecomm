"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
const supabase_js_1 = require("../services/supabase.js");
const errorHandler_js_1 = require("./errorHandler.js");
async function requireAuth(req, _res, next) {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader?.startsWith('Bearer ')) {
            throw new errorHandler_js_1.AppError('Missing or malformed Authorization header. Expected: Bearer <token>', 401, 'MISSING_TOKEN');
        }
        const token = authHeader.slice(7);
        const supabase = (0, supabase_js_1.getSupabaseClient)();
        const { data, error } = await supabase.auth.getUser(token);
        if (error || !data.user) {
            throw new errorHandler_js_1.AppError('Invalid or expired access token.', 401, 'INVALID_TOKEN');
        }
        const supabaseUser = data.user;
        let role = 'customer';
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', supabaseUser.id)
            .maybeSingle();
        if (profile?.role === 'admin' || profile?.role === 'customer') {
            role = profile.role;
        }
        else {
            const metaRole = supabaseUser.user_metadata?.['role'];
            if (metaRole === 'admin' || metaRole === 'customer') {
                role = metaRole;
            }
        }
        req.user = {
            id: supabaseUser.id,
            email: supabaseUser.email ?? '',
            role,
        };
        next();
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=requireAuth.js.map