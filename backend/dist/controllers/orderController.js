"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrder = createOrder;
exports.getMyOrders = getMyOrders;
exports.getOrder = getOrder;
const orderService_js_1 = require("../services/orderService.js");
const errorHandler_js_1 = require("../middleware/errorHandler.js");
async function createOrder(req, res, next) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            throw new errorHandler_js_1.AppError('Unauthorized: Authenticated user context is required.', 401, 'UNAUTHORIZED');
        }
        const input = req.body;
        const order = await (0, orderService_js_1.createOrder)(userId, input);
        res.status(201).json({
            status: 'ok',
            data: order,
        });
    }
    catch (err) {
        next(err);
    }
}
async function getMyOrders(req, res, next) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            throw new errorHandler_js_1.AppError('Unauthorized: Authenticated user context is required.', 401, 'UNAUTHORIZED');
        }
        const orders = await (0, orderService_js_1.getUserOrders)(userId);
        res.status(200).json({
            status: 'ok',
            data: orders,
        });
    }
    catch (err) {
        next(err);
    }
}
async function getOrder(req, res, next) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            throw new errorHandler_js_1.AppError('Unauthorized: Authenticated user context is required.', 401, 'UNAUTHORIZED');
        }
        const orderId = req.params.id;
        const isAdmin = req.user?.role === 'admin';
        const order = await (0, orderService_js_1.getOrderById)(orderId, userId, isAdmin);
        if (!order) {
            throw new errorHandler_js_1.AppError(`Order not found: ${orderId}`, 404, 'ORDER_NOT_FOUND');
        }
        res.status(200).json({
            status: 'ok',
            data: order,
        });
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=orderController.js.map