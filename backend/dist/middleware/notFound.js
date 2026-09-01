"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = notFound;
function notFound(req, res) {
    const body = {
        status: 'error',
        message: `Route not found: ${req.method} ${req.originalUrl}`,
        code: 'NOT_FOUND',
    };
    res.status(404).json(body);
}
//# sourceMappingURL=notFound.js.map