"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const health_js_1 = __importDefault(require("./routes/health.js"));
const errorHandler_js_1 = require("./middleware/errorHandler.js");
const notFound_js_1 = require("./middleware/notFound.js");
const app = (0, express_1.default)();
const allowedOrigin = process.env['CORS_ORIGIN'] ?? 'http://localhost:3000';
app.use((0, cors_1.default)({
    origin: allowedOrigin,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));
app.use(express_1.default.json({ limit: '1mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '1mb' }));
app.use('/health', health_js_1.default);
app.use(notFound_js_1.notFound);
app.use(errorHandler_js_1.errorHandler);
const PORT = Number(process.env['PORT'] ?? 5000);
app.listen(PORT, () => {
    const env = process.env['NODE_ENV'] ?? 'development';
    console.log(`[server] Running in ${env} mode`);
    console.log(`[server] Listening on http://localhost:${PORT}`);
    console.log(`[server] Health check: http://localhost:${PORT}/health`);
});
exports.default = app;
//# sourceMappingURL=server.js.map