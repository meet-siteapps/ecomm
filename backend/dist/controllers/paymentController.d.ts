import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, ApiSuccess } from '../types/index.js';
import { CreatePaymentOrderResponse } from '../types/payment.js';
import { Order } from '../types/order.js';
export declare function createPaymentOrder(req: AuthenticatedRequest, res: Response<ApiSuccess<CreatePaymentOrderResponse>>, next: NextFunction): Promise<void>;
export declare function verifyPayment(req: AuthenticatedRequest, res: Response<ApiSuccess<Order>>, next: NextFunction): Promise<void>;
//# sourceMappingURL=paymentController.d.ts.map