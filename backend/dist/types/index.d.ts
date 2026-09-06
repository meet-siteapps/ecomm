import { Request, Response, NextFunction } from 'express';
export interface AuthUser {
    id: string;
    email: string;
    role: 'customer' | 'admin';
}
export interface AuthenticatedRequest extends Request {
    user?: AuthUser;
}
export interface ApiSuccess<T = unknown> {
    status: 'ok';
    data: T;
}
export interface ApiError {
    status: 'error';
    message: string;
    code?: string;
    stack?: string;
}
export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError;
export interface TypedRequest<TBody = unknown, TQuery = unknown, TParams = unknown> extends Request {
    body: TBody;
    query: TQuery & Record<string, string | string[] | undefined>;
    params: TParams & Record<string, string>;
}
export type TypedResponse<T = unknown> = Response<ApiResponse<T>>;
export type TypedNextFunction = NextFunction;
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
//# sourceMappingURL=index.d.ts.map