import { Response } from 'express';
import { AuthenticatedRequest, ApiSuccess } from '../types/index.js';
import { AuthUser } from '../types/index.js';
export declare function getMe(req: AuthenticatedRequest, res: Response<ApiSuccess<AuthUser>>): void;
//# sourceMappingURL=authController.d.ts.map