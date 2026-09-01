import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { ApiError } from '../types/index.js';

export class AppError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode: number = 500,
    public readonly code?: string,
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const isDev = process.env['NODE_ENV'] !== 'production';

  // Zod validation errors → 422
  if (err instanceof ZodError) {
    const message = err.errors
      .map((e) => `${e.path.join('.')}: ${e.message}`)
      .join('; ');

    const body: ApiError = {
      status: 'error',
      message,
      code: 'VALIDATION_ERROR',
    };
    res.status(422).json(body);
    return;
  }

  // Known application errors
  if (err instanceof AppError) {
    const body: ApiError = {
      status: 'error',
      message: err.message,
      code: err.code,
      ...(isDev && { stack: err.stack }),
    };
    res.status(err.statusCode).json(body);
    return;
  }

  // Unknown errors → 500
  const message =
    err instanceof Error ? err.message : 'An unexpected error occurred';

  const body: ApiError = {
    status: 'error',
    message: isDev ? message : 'Internal server error',
    code: 'INTERNAL_ERROR',
    ...(isDev && err instanceof Error && { stack: err.stack }),
  };

  console.error('[ErrorHandler]', err);
  res.status(500).json(body);
}
