import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, ApiSuccess } from '../types/index.js';
import { UserProfile } from '../types/user.js';
export declare function getMe(req: AuthenticatedRequest, res: Response<ApiSuccess<UserProfile>>, next: NextFunction): Promise<void>;
export declare function ensureProfile(req: AuthenticatedRequest, res: Response<ApiSuccess<UserProfile>>, next: NextFunction): Promise<void>;
export declare function updateProfile(req: AuthenticatedRequest, res: Response<ApiSuccess<UserProfile>>, next: NextFunction): Promise<void>;
//# sourceMappingURL=authController.d.ts.map