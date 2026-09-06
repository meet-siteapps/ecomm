"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = requireAdmin;
const errorHandler_js_1 = require("./errorHandler.js");
function requireAdmin(req, _res, next) {
    if (req.user?.role !== 'admin') {
        next(new errorHandler_js_1.AppError('Admin access required. Your account does not have the administrator role.', 403, 'FORBIDDEN'));
        return;
    }
    next();
}
//# sourceMappingURL=requireAdmin.js.map