import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, ApiSuccess } from '../types/index.js';
import { Order } from '../types/order.js';
import { OrderIdParamInput } from '../validation/order.js';
export declare function createOrder(req: AuthenticatedRequest, res: Response<ApiSuccess<Order>>, next: NextFunction): Promise<void>;
export declare function getMyOrders(req: AuthenticatedRequest, res: Response<ApiSuccess<Order[]>>, next: NextFunction): Promise<void>;
export declare function getOrder(req: AuthenticatedRequest & {
    params: OrderIdParamInput;
}, res: Response<ApiSuccess<Order>>, next: NextFunction): Promise<void>;
export declare function listAllOrdersAdmin(_req: AuthenticatedRequest, res: Response<ApiSuccess<Order[]>>, next: NextFunction): Promise<void>;
export declare function updateOrderStatusAdmin(req: AuthenticatedRequest & {
    params: OrderIdParamInput;
}, res: Response<ApiSuccess<Order>>, next: NextFunction): Promise<void>;
export declare function getDashboardStats(_req: AuthenticatedRequest, res: Response<ApiSuccess<import('../types/order.js').AdminDashboardStats>>, next: NextFunction): Promise<void>;
//# sourceMappingURL=orderController.d.ts.map