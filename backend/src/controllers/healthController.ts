import { Request, Response } from 'express';

/**
 * GET /health
 * Returns a simple liveness probe response.
 * No auth required — safe for load balancers and uptime monitors.
 */
export function getHealth(_req: Request, res: Response): void {
  res.status(200).json({ status: 'ok' });
}
