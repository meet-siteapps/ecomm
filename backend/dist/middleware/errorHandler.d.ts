import { Request, Response, NextFunction } from 'express';
export declare class AppError extends Error {
    readonly message: string;
    readonly statusCode: number;
    readonly code?: string | undefined;
    constructor(message: string, statusCode?: number, code?: string | undefined);
}
export declare function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void;
//# sourceMappingURL=errorHandler.d.ts.map