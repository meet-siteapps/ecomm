import { z, ZodType, ZodTypeDef } from 'zod';
import { Request, Response, NextFunction } from 'express';

// ─── Validation middleware factory ───────────────────────────────────────────

type ValidationTarget = 'body' | 'query' | 'params';

/**
 * Returns an Express middleware that validates req[target] against the given
 * Zod schema. On success, the parsed (coerced/transformed) value is written back to the
 * same property so downstream handlers receive typed data.
 *
 * Errors are forwarded to the centralized error handler via next(err).
 */
export function validate<T = unknown>(
  schema: ZodType<T, ZodTypeDef, unknown>,
  target: ValidationTarget = 'body',
) {

  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);
    if (!result.success) {
      next(result.error);
      return;
    }
    // Write coerced value back
    (req as unknown as Record<string, unknown>)[target] = result.data;
    next();
  };
}

// ─── Reusable primitives ─────────────────────────────────────────────────────

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const uuidParamSchema = z.object({
  id: z.string().uuid({ message: 'id must be a valid UUID' }),
});

export { z };
