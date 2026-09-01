import { Request, Response, NextFunction } from 'express';

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
}
