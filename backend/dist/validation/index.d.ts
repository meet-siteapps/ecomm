import { z, ZodType, ZodTypeDef } from 'zod';
import { Request, Response, NextFunction } from 'express';
type ValidationTarget = 'body' | 'query' | 'params';
export declare function validate<T = unknown>(schema: ZodType<T, ZodTypeDef, unknown>, target?: ValidationTarget): (req: Request, _res: Response, next: NextFunction) => void;
export declare const paginationSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    page: number;
}, {
    limit?: number | undefined;
    page?: number | undefined;
}>;
export declare const uuidParamSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
export { z };
//# sourceMappingURL=index.d.ts.map