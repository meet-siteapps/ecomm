"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeLimiter = exports.authLimiter = exports.generalLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
function createRateLimiter(windowMs, max, message, code = 'TOO_MANY_REQUESTS') {
    const isDev = (process.env['NODE_ENV'] ?? 'development') !== 'production';
    return (0, express_rate_limit_1.default)({
        windowMs,
        max: isDev ? max * 50 : max,
        standardHeaders: 'draft-7',
        legacyHeaders: false,
        skip: (req) => req.method === 'OPTIONS',
        handler: (_req, res) => {
            const body = {
                status: 'error',
                message,
                code,
            };
            res.status(429).json(body);
        },
    });
}
exports.generalLimiter = createRateLimiter(15 * 60 * 1000, 100, 'Too many requests from this IP, please try again after 15 minutes.', 'RATE_LIMIT_EXCEEDED');
exports.authLimiter = createRateLimiter(15 * 60 * 1000, 10, 'Too many authentication requests from this IP, please try again after 15 minutes.', 'AUTH_RATE_LIMIT_EXCEEDED');
exports.writeLimiter = createRateLimiter(15 * 60 * 1000, 20, 'Too many write requests from this IP, please try again after 15 minutes.', 'WRITE_RATE_LIMIT_EXCEEDED');
//# sourceMappingURL=rateLimiter.js.map