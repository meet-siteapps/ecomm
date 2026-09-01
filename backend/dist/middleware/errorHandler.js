"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
exports.errorHandler = errorHandler;
const zod_1 = require("zod");
class AppError extends Error {
    message;
    statusCode;
    code;
    constructor(message, statusCode = 500, code) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.code = code;
        this.name = 'AppError';
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
function errorHandler(err, _req, res, _next) {
    const isDev = process.env['NODE_ENV'] !== 'production';
    if (err instanceof zod_1.ZodError) {
        const message = err.errors
            .map((e) => `${e.path.join('.')}: ${e.message}`)
            .join('; ');
        const body = {
            status: 'error',
            message,
            code: 'VALIDATION_ERROR',
        };
        res.status(422).json(body);
        return;
    }
    if (err instanceof AppError) {
        const body = {
            status: 'error',
            message: err.message,
            code: err.code,
            ...(isDev && { stack: err.stack }),
        };
        res.status(err.statusCode).json(body);
        return;
    }
    const message = err instanceof Error ? err.message : 'An unexpected error occurred';
    const body = {
        status: 'error',
        message: isDev ? message : 'Internal server error',
        code: 'INTERNAL_ERROR',
        ...(isDev && err instanceof Error && { stack: err.stack }),
    };
    console.error('[ErrorHandler]', err);
    res.status(500).json(body);
}
//# sourceMappingURL=errorHandler.js.map