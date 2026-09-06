import { Request, Response, NextFunction } from 'express';

// ─── Authenticated request ────────────────────────────────────────────────────

/**
 * Shape of the verified Supabase user attached to req.user by requireAuth.
 * Only what the Express backend actually needs — not the full Supabase User object.
 */
export interface AuthUser {
  id: string;
  email: string;
  role: 'customer' | 'admin';
}

/** Express Request extended with the verified user, set by requireAuth middleware. */
export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}

// ─── Standard API response shapes ───────────────────────────────────────────

export interface ApiSuccess<T = unknown> {
  status: 'ok';
  data: T;
}

export interface ApiError {
  status: 'error';
  message: string;
  code?: string;
  /** Only populated in development */
  stack?: string;
}

export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError;

// ─── Extended Express types ──────────────────────────────────────────────────

/** Typed request with a validated body */
export interface TypedRequest<TBody = unknown, TQuery = unknown, TParams = unknown>
  extends Request {
  body: TBody;
  query: TQuery & Record<string, string | string[] | undefined>;
  params: TParams & Record<string, string>;
}

export type TypedResponse<T = unknown> = Response<ApiResponse<T>>;
export type TypedNextFunction = NextFunction;

// ─── Environment ─────────────────────────────────────────────────────────────

export interface Env {
  PORT: number;
  NODE_ENV: 'development' | 'production' | 'test';
  CORS_ORIGIN: string;
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  RAZORPAY_KEY_ID?: string;
  RAZORPAY_KEY_SECRET?: string;
}


