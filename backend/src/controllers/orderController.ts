import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, ApiSuccess } from '../types/index.js';
import { CreateOrderInput, Order } from '../types/order.js';
import {
  createOrder as createOrderService,
  getUserOrders as getUserOrdersService,
  getOrderById as getOrderByIdService,
} from '../services/orderService.js';
import { OrderIdParamInput } from '../validation/order.js';
import { AppError } from '../middleware/errorHandler.js';

/**
 * POST /api/orders
 *
 * Handles order creation for the authenticated customer.
 * - Extracts verified userId from req.user (injected by requireAuth)
 * - Delegates validation, DB price resolution, stock check & decrement to orderService
 * - Responds with status 201 and created Order
 *
 * @param req - Authenticated request containing CreateOrderInput body
 * @param res - Express response with ApiSuccess<Order>
 * @param next - Express next function for error forwarding
 */
export async function createOrder(
  req: AuthenticatedRequest,
  res: Response<ApiSuccess<Order>>,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError(
        'Unauthorized: Authenticated user context is required.',
        401,
        'UNAUTHORIZED',
      );
    }

    const input = req.body as CreateOrderInput;
    const order = await createOrderService(userId, input);

    res.status(201).json({
      status: 'ok',
      data: order,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/orders
 *
 * Fetches all orders placed by the currently authenticated user, newest first.
 *
 * @param req - Authenticated request
 * @param res - Express response with ApiSuccess<Order[]>
 * @param next - Express next function for error forwarding
 */
export async function getMyOrders(
  req: AuthenticatedRequest,
  res: Response<ApiSuccess<Order[]>>,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError(
        'Unauthorized: Authenticated user context is required.',
        401,
        'UNAUTHORIZED',
      );
    }

    const orders = await getUserOrdersService(userId);

    res.status(200).json({
      status: 'ok',
      data: orders,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/orders/:id
 *
 * Retrieves a single order by UUID. Verifies ownership so users can only view
 * their own orders (unless the requester has an admin role).
 *
 * @param req - Authenticated request containing order id param
 * @param res - Express response with ApiSuccess<Order>
 * @param next - Express next function for error forwarding
 */
export async function getOrder(
  req: AuthenticatedRequest & { params: OrderIdParamInput },
  res: Response<ApiSuccess<Order>>,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError(
        'Unauthorized: Authenticated user context is required.',
        401,
        'UNAUTHORIZED',
      );
    }

    const orderId = req.params.id;
    const isAdmin = req.user?.role === 'admin';
    const order = await getOrderByIdService(orderId, userId, isAdmin);

    if (!order) {
      throw new AppError(`Order not found: ${orderId}`, 404, 'ORDER_NOT_FOUND');
    }

    res.status(200).json({
      status: 'ok',
      data: order,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/admin/orders
 *
 * Fetches all orders with item details for admin dashboard/order management.
 */
export async function listAllOrdersAdmin(
  _req: AuthenticatedRequest,
  res: Response<ApiSuccess<Order[]>>,
  next: NextFunction,
): Promise<void> {
  try {
    const { getAllOrdersAdmin: getAllOrdersAdminService } = await import('../services/orderService.js');
    const orders = await getAllOrdersAdminService();

    res.status(200).json({
      status: 'ok',
      data: orders,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/admin/orders/:id/status
 *
 * Updates an order's status and/or payment status (Admin action).
 */
export async function updateOrderStatusAdmin(
  req: AuthenticatedRequest & { params: OrderIdParamInput },
  res: Response<ApiSuccess<Order>>,
  next: NextFunction,
): Promise<void> {
  try {
    const orderId = req.params.id;
    const body = req.body as {
      order_status?: Order['order_status'];
      status?: Order['order_status'];
      payment_status?: Order['payment_status'];
    };

    const targetOrderStatus = body.order_status || body.status;
    const { updateOrderStatusAdmin: updateOrderStatusAdminService } = await import('../services/orderService.js');
    const updated = await updateOrderStatusAdminService(
      orderId,
      targetOrderStatus,
      body.payment_status,
    );

    res.status(200).json({
      status: 'ok',
      data: updated,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/admin/dashboard-stats
 *
 * Computes and returns aggregated store metrics for the admin dashboard.
 */
export async function getDashboardStats(
  _req: AuthenticatedRequest,
  res: Response<ApiSuccess<import('../types/order.js').AdminDashboardStats>>,
  next: NextFunction,
): Promise<void> {
  try {
    const { getDashboardStats: getDashboardStatsService } = await import('../services/orderService.js');
    const stats = await getDashboardStatsService();

    res.status(200).json({
      status: 'ok',
      data: stats,
    });
  } catch (err) {
    next(err);
  }
}
