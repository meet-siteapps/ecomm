import { Request, Response } from 'express';
import { ApiError } from '../types/index.js';

export function notFound(req: Request, res: Response): void {
  const body: ApiError = {
    status: 'error',
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    code: 'NOT_FOUND',
  };
  res.status(404).json(body);
}
