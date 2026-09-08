/**
 * Thin client for the Express store settings API.
 *
 * Wraps GET /api/settings and PUT /api/admin/settings.
 * Follows the same pattern as src/frontend/lib/api/products.ts and auth.ts.
 *
 * Response shape from the backend:
 *   { status: 'ok', data: StoreSettings }                — success
 *   { status: 'error', message: string, code?: string }  — error
 *
 * Environment variable priority (all are NEXT_PUBLIC_ so they are inlined at
 * build time by Next.js):
 *   1. NEXT_PUBLIC_API_URL        — preferred name set in Vercel dashboard
 *   2. NEXT_PUBLIC_BACKEND_URL    — legacy name used in .env.local
 *   3. Hard-coded Render URL      — production fallback so deploys never break
 */

import { StoreSettings, DEFAULT_STORE_SETTINGS } from '@/types/settings';

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

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
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

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Fetch the public store settings from the Express backend.
 * Calls GET /api/settings (no auth needed).
 * Falls back to DEFAULT_STORE_SETTINGS if network/backend fails.
 */
export async function fetchStoreSettings(): Promise<StoreSettings> {
  try {
    return await apiFetch<StoreSettings>('/api/settings', {
      method: 'GET',
    });
  } catch (err) {
    console.warn('Could not fetch store settings from API, using defaults:', err);
    return DEFAULT_STORE_SETTINGS;
  }
}

/**
 * Update store settings in the Express backend (Admin only).
 * Calls PUT /api/admin/settings with Authorization: Bearer <accessToken>.
 */
export async function updateStoreSettings(
  accessToken: string,
  input: Partial<StoreSettings>
): Promise<StoreSettings> {
  return apiFetch<StoreSettings>('/api/admin/settings', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(input),
  });
}
