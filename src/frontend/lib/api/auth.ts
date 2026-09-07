/**
 * Thin client for the Express auth API.
 *
 * Wraps GET /api/auth/me, POST /api/auth/ensure-profile, and PUT /api/auth/profile.
 * Follows the same pattern as src/frontend/lib/api/products.ts.
 *
 * Response shape from the backend:
 *   { status: 'ok', data: UserProfile }                  — success
 *   { status: 'error', message: string, code?: string }  — error
 *
 * Environment variable priority (all are NEXT_PUBLIC_ so they are inlined at
 * build time by Next.js):
 *   1. NEXT_PUBLIC_API_URL        — preferred name set in Vercel dashboard
 *   2. NEXT_PUBLIC_BACKEND_URL    — legacy name used in .env.local
 *   3. Hard-coded Render URL      — production fallback so deploys never break
 */

import { UserProfile } from '@/frontend/types/user';

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

export interface EnsureProfileInput {
  email: string;
  name: string;
  phone?: string;
}

export interface UpdateProfileInput {
  name?: string;
  phone?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function apiAuthFetch<T>(
  path: string,
  accessToken: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
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
 * Fetch the authenticated user's profile from the Express backend.
 * Calls GET /api/auth/me with Authorization: Bearer <accessToken>
 */
export async function fetchMyProfile(accessToken: string): Promise<UserProfile> {
  return apiAuthFetch<UserProfile>('/api/auth/me', accessToken, {
    method: 'GET',
  });
}

/**
 * Ensures a user profile exists in the Express backend (auto-provision if missing).
 * Calls POST /api/auth/ensure-profile with Authorization: Bearer <accessToken>
 */
export async function ensureProfile(
  accessToken: string,
  input: EnsureProfileInput
): Promise<UserProfile> {
  return apiAuthFetch<UserProfile>('/api/auth/ensure-profile', accessToken, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

/**
 * Updates the authenticated user's profile (name and/or phone).
 * Calls PUT /api/auth/profile with Authorization: Bearer <accessToken>
 */
export async function updateProfile(
  accessToken: string,
  input: UpdateProfileInput
): Promise<UserProfile> {
  return apiAuthFetch<UserProfile>('/api/auth/profile', accessToken, {
    method: 'PUT',
    body: JSON.stringify(input),
  });
}
