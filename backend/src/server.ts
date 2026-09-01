import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import healthRouter from './routes/health.js';
import productsRouter from './routes/products.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';

// ─── App ──────────────────────────────────────────────────────────────────────

const app = express();

// ─── Global middleware ────────────────────────────────────────────────────────

// CORS — restrict to the configured origin in production
const allowedOrigin = process.env['CORS_ORIGIN'] ?? 'http://localhost:3000';

app.use(
  cors({
    origin: allowedOrigin,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// ─── Routes ───────────────────────────────────────────────────────────────────

app.use('/health', healthRouter);
app.use('/api/products', productsRouter);

// Future route groups:
// app.use('/api/orders',   ordersRouter);
// app.use('/api/auth',     authRouter);

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
