"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const health_js_1 = __importDefault(require("./routes/health.js"));
const products_js_1 = __importDefault(require("./routes/products.js"));
const adminProducts_js_1 = __importDefault(require("./routes/adminProducts.js"));
const auth_js_1 = __importDefault(require("./routes/auth.js"));
const orders_js_1 = __importDefault(require("./routes/orders.js"));
const payments_js_1 = __importDefault(require("./routes/payments.js"));
const settings_js_1 = __importDefault(require("./routes/settings.js"));
const rateLimiter_js_1 = require("./middleware/rateLimiter.js");
const errorHandler_js_1 = require("./middleware/errorHandler.js");
const notFound_js_1 = require("./middleware/notFound.js");
const app = (0, express_1.default)();
app.use(rateLimiter_js_1.generalLimiter);
const DEFAULT_ORIGINS = [
    'http://localhost:3000',
    'https://ecommerce-site-dun-phi.vercel.app',
];
const rawOrigins = process.env['CORS_ORIGIN'];
const allowedOrigins = rawOrigins
    ? rawOrigins.split(',').map((o) => o.trim()).filter(Boolean)
    : DEFAULT_ORIGINS;
app.use((0, cors_1.default)({
    origin: (incomingOrigin, callback) => {
        if (!incomingOrigin || allowedOrigins.includes(incomingOrigin)) {
            callback(null, true);
        }
        else {
            callback(new Error(`CORS: origin '${incomingOrigin}' not allowed`));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));
app.use(express_1.default.json({ limit: '1mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '1mb' }));
app.use('/health', health_js_1.default);
app.use('/api/products', products_js_1.default);
app.use('/api/admin/products', adminProducts_js_1.default);
app.use('/api/auth', auth_js_1.default);
app.use('/api/orders', orders_js_1.default);
app.use('/api/payments', payments_js_1.default);
app.use('/api/settings', settings_js_1.default);
app.use('/api/admin/settings', settings_js_1.default);
app.use(notFound_js_1.notFound);
app.use(errorHandler_js_1.errorHandler);
const PORT = Number(process.env['PORT'] ?? 5000);
app.listen(PORT, () => {
    const env = process.env['NODE_ENV'] ?? 'development';
    console.log(`[server] Running in ${env} mode`);
    console.log(`[server] Listening on http://localhost:${PORT}`);
    console.log(`[server] Health check:    http://localhost:${PORT}/health`);
    console.log(`[server] Products list:   http://localhost:${PORT}/api/products`);
});
exports.default = app;
//# sourceMappingURL=server.js.map