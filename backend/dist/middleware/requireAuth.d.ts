import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
export declare function requireAuth(req: AuthenticatedRequest, _res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=requireAuth.d.ts.map