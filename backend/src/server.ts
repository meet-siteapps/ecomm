import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import healthRouter from './routes/health.js';
import productsRouter from './routes/products.js';
import adminProductsRouter from './routes/adminProducts.js';
import adminOrdersRouter from './routes/adminOrders.js';
import adminDashboardRouter from './routes/adminDashboard.js';
import authRouter from './routes/auth.js';
import ordersRouter from './routes/orders.js';
import paymentsRouter from './routes/payments.js';
import settingsRouter from './routes/settings.js';
import { generalLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';

// ─── App ──────────────────────────────────────────────────────────────────────

const app = express();

// ─── Global middleware ────────────────────────────────────────────────────────

// 1. CORS — explicit allowlist, no wildcards.
// MUST be mounted before rate limiter so OPTIONS preflights and 429 errors include CORS headers.
const DEFAULT_ORIGINS = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3001',
  'https://ecommerce-site-dun-phi.vercel.app',
];

const rawOrigins = process.env['CORS_ORIGIN'];
const allowedOrigins: string[] = rawOrigins
  ? rawOrigins.split(',').map((o) => o.trim()).filter(Boolean)
  : DEFAULT_ORIGINS;

app.use(
  cors({
    origin: (incomingOrigin, callback) => {
      // Allow server-to-server requests (no Origin header) and listed origins
      if (!incomingOrigin || allowedOrigins.includes(incomingOrigin)) {
        callback(null, true);
      } else {
        // Return false to gracefully reject disallowed origins without breaking CORS headers
        callback(null, false);
      }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
);

// 2. Global rate limiter (applied after CORS headers are attached)
app.use(generalLimiter);

// 3. Body size limits (prevents payload flood abuse)
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// ─── Routes ───────────────────────────────────────────────────────────────────

app.use('/health', healthRouter);
app.use('/api/products', productsRouter);
app.use('/api/admin/products', adminProductsRouter);
app.use('/api/admin/orders', adminOrdersRouter);
app.use('/api/admin/dashboard-stats', adminDashboardRouter);
app.use('/api/auth', authRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/admin/settings', settingsRouter);


// ─── 404 & error handling ─────────────────────────────────────────────────────

app.use(notFound);
app.use(errorHandler);

// ─── Start ────────────────────────────────────────────────────────────────────

const PORT = Number(process.env['PORT'] ?? 5000);

app.listen(PORT, () => {
  const env = process.env['NODE_ENV'] ?? 'development';
  console.log(`[server] Running in ${env} mode`);
  console.log(`[server] Listening on http://localhost:${PORT}`);
  console.log(`[server] Health check:    http://localhost:${PORT}/health`);
  console.log(`[server] Products list:   http://localhost:${PORT}/api/products`);
});

export default app;
