import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest, ApiSuccess } from '../types/index.js';
import { StoreSettings } from '../types/settings.js';
export declare function getSettings(_req: Request, res: Response<ApiSuccess<StoreSettings>>, next: NextFunction): Promise<void>;
export declare function updateSettings(req: AuthenticatedRequest, res: Response<ApiSuccess<StoreSettings>>, next: NextFunction): Promise<void>;
//# sourceMappingURL=settingsController.d.ts.map