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

import { Product } from '@/types/product';
import { getValidAccessToken } from '@/lib/supabase/client';

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

export interface AdminDashboardRecentOrder {
  id: string;
  order_number?: string;
  customer_name: string;
  amount: number;
  status: string;
  date: string;
}

export interface AdminDashboardStats {
  totalProducts: number;
  activeProducts: number;
  lowStockProducts: number;
  totalCustomers: number;
  totalOrders: number;
  pendingOrders: number;
  recentOrders: AdminDashboardRecentOrder[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function apiFetch<T>(path: string): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
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

async function apiAuthFetch<T>(
  path: string,
  accessToken?: string | null,
  options: RequestInit = {}
): Promise<T> {
  let token = accessToken;
  if (!token) {
    token = await getValidAccessToken();
  }

  if (!token) {
    throw new Error('Authentication required for administrative operations.');
  }

  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
    cache: 'no-store',
  });

  let json: BackendResponse<T>;
  try {
    json = await res.json();
  } catch {
    throw new Error(`HTTP ${res.status}: Failed to parse JSON response from ${url}`);
  }

  if (json.status === 'error') {
    const error = new Error(json.message || `API error from ${url}`);
    (error as any).code = json.code;
    (error as any).status = res.status;
    throw error;
  }

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} from ${url}`);
  }

  return json.data;
}

export interface FetchProductsOptions {
  limit?: number;
  category?: string;
  ageGroup?: string;
  maxPrice?: number;
  sortBy?: 'featured' | 'price-low' | 'price-high' | 'discount';
  search?: string;
}

/**
 * Fetch all active products from the Express backend.
 * Returns a plain Product[] for the storefront catalog.
 */
export async function fetchProducts(options?: FetchProductsOptions): Promise<Product[]> {
  const queryParams = new URLSearchParams();
  if (options?.limit) queryParams.set('limit', String(options.limit));
  if (options?.category) queryParams.set('category', options.category);
  if (options?.ageGroup) queryParams.set('ageGroup', options.ageGroup);
  if (options?.maxPrice) queryParams.set('maxPrice', String(options.maxPrice));
  if (options?.sortBy) queryParams.set('sortBy', options.sortBy);
  if (options?.search) queryParams.set('search', options.search);

  const qs = queryParams.toString();
  const path = qs ? `/api/products?${qs}` : '/api/products';
  try {
    const data = await apiFetch<ProductListData>(path);
    return data.products;
  } catch (err) {
    console.warn(`[fetchProducts] Warning: Could not reach backend API at ${path}. Returning empty list. Ensure backend is running.`, err);
    return [];
  }
}

export const getProducts = fetchProducts;

/**
 * Fetch a single product by UUID from the Express backend.
 * Returns null when the backend responds 404.
 */
export async function fetchProductById(id: string): Promise<Product | null> {
  try {
    return await apiFetch<Product>(`/api/products/${encodeURIComponent(id)}`);
  } catch (err) {
    if (err instanceof Error && err.message.includes('404')) return null;
    console.warn(`[fetchProductById] Failed to fetch product ${id}:`, err);
    return null;
  }
}

export const getProductById = fetchProductById;

/**
 * Admin: Fetch all products (including inactive) for inventory management.
 */
export async function fetchAllProductsAdmin(accessToken?: string | null): Promise<Product[]> {
  return apiAuthFetch<Product[]>('/api/admin/products', accessToken, {
    method: 'GET',
  });
}

// Compatibility alias matching legacy getAllProductsAdmin
export const getAllProductsAdmin = fetchAllProductsAdmin;

/**
 * Admin: Create a new product.
 */
export async function createProduct(
  payload: Partial<Product>,
  accessToken?: string | null
): Promise<Product> {
  return apiAuthFetch<Product>('/api/admin/products', accessToken, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * Admin: Update an existing product.
 */
export async function updateProduct(
  id: string,
  payload: Partial<Product>,
  accessToken?: string | null
): Promise<Product> {
  return apiAuthFetch<Product>(`/api/admin/products/${encodeURIComponent(id)}`, accessToken, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

/**
 * Admin: Soft delete a product (sets is_active = false).
 */
export async function deleteProduct(
  id: string,
  accessToken?: string | null
): Promise<Product> {
  return apiAuthFetch<Product>(`/api/admin/products/${encodeURIComponent(id)}`, accessToken, {
    method: 'DELETE',
  });
}

/**
 * Admin: Permanently delete a product (hard delete, allowed only if 0 order history).
 */
export async function permanentDeleteProduct(
  id: string,
  accessToken?: string | null
): Promise<{ id: string }> {
  return apiAuthFetch<{ id: string }>(
    `/api/admin/products/${encodeURIComponent(id)}/permanent`,
    accessToken,
    {
      method: 'DELETE',
    }
  );
}

/**
 * Admin: Toggle product active status.
 */
export async function toggleProductStatus(
  id: string,
  isActive: boolean,
  accessToken?: string | null
): Promise<Product> {
  return apiAuthFetch<Product>(`/api/admin/products/${encodeURIComponent(id)}/status`, accessToken, {
    method: 'PATCH',
    body: JSON.stringify({ is_active: isActive }),
  });
}

/**
 * Admin: Fetch aggregated dashboard stats.
 */
export async function fetchDashboardStats(
  accessToken?: string | null
): Promise<AdminDashboardStats> {
  return apiAuthFetch<AdminDashboardStats>('/api/admin/dashboard-stats', accessToken, {
    method: 'GET',
  });
}

// Compatibility alias matching legacy getAdminDashboardStats
export const getAdminDashboardStats = fetchDashboardStats;
