/**
 * Thin client for the Express product API.
 *
 * Wraps GET /api/products and GET /api/products/:id.
 * Matches the same function signatures as the Supabase-direct implementation
 * in src/backend/products/products.ts so call sites need minimal changes.
 *
 * Response shape from the backend:
 *   { status: 'ok', data: { products: Product[], total: number } }  — list
 *   { status: 'ok', data: Product }                                  — detail
 *   { status: 'error', message: string, code: string }               — error
 *
 * Environment variable priority (all are NEXT_PUBLIC_ so they are inlined at
 * build time by Next.js):
 *   1. NEXT_PUBLIC_API_URL        — preferred name set in Vercel dashboard
 *   2. NEXT_PUBLIC_BACKEND_URL    — legacy name used in .env.local
 *   3. Hard-coded Render URL      — production fallback so deploys never break
 */

import { Product } from '@/frontend/types/product';

const PRODUCTION_URL = 'https://ecomm-backend-u88t.onrender.com';

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  process.env.NEXT_PUBLIC_BACKEND_URL ??
  PRODUCTION_URL;

// ─── Types mirroring the backend response envelope ───────────────────────────

interface BackendSuccess<T> {
  status: 'ok';
  data: T;
}

interface BackendError {
  status: 'error';
  message: string;
  code?: string;
}

type BackendResponse<T> = BackendSuccess<T> | BackendError;

interface ProductListData {
  products: Product[];
  total: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function apiFetch<T>(path: string): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    // No credentials needed for public read-only product endpoints
    cache: 'no-store',
  });

  const json: BackendResponse<T> = await res.json();

  if (json.status === 'error') {
    throw new Error(json.message ?? `API error from ${url}`);
  }

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} from ${url}`);
  }

  return json.data;
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Fetch all active products from the Express backend.
 * Returns a plain Product[] — same type as the Supabase version —
 * so the products page can drop this in with a one-line import change.
 */
export async function fetchProducts(): Promise<Product[]> {
  const data = await apiFetch<ProductListData>('/api/products');
  return data.products;
}

/**
 * Fetch a single product by UUID from the Express backend.
 * Returns null when the backend responds 404, re-throws everything else.
 */
export async function fetchProductById(id: string): Promise<Product | null> {
  try {
    return await apiFetch<Product>(`/api/products/${encodeURIComponent(id)}`);
  } catch (err) {
    // 404 from the backend becomes a null return, matching Supabase behaviour
    if (err instanceof Error && err.message.includes('404')) return null;
    throw err;
  }
}
