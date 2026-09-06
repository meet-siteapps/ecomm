"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPaymentOrder = createPaymentOrder;
exports.verifyPayment = verifyPayment;
const razorpayService_js_1 = require("../services/razorpayService.js");
const orderService_js_1 = require("../services/orderService.js");
const errorHandler_js_1 = require("../middleware/errorHandler.js");
async function createPaymentOrder(req, res, next) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            throw new errorHandler_js_1.AppError('Unauthorized: Authenticated user context is required.', 401, 'UNAUTHORIZED');
        }
        const { orderId } = req.body;
        const order = await (0, orderService_js_1.getOrderById)(orderId, userId);
        if (!order) {
            throw new errorHandler_js_1.AppError(`Order not found: ${orderId}`, 404, 'ORDER_NOT_FOUND');
        }
        if (order.order_status !== 'pending') {
            throw new errorHandler_js_1.AppError(`Cannot initiate payment for order in '${order.order_status}' status.`, 400, 'INVALID_ORDER_STATUS');
        }
        if (order.payment_status === 'paid') {
            throw new errorHandler_js_1.AppError('Order has already been paid for.', 400, 'ORDER_ALREADY_PAID');
        }
        const razorpayOrder = await (0, razorpayService_js_1.createRazorpayOrder)(order.total, order.order_number || order.id);
        await (0, orderService_js_1.attachRazorpayOrderId)(order.id, razorpayOrder.id);
        const keyId = process.env['RAZORPAY_KEY_ID'] ?? '';
        res.status(200).json({
            status: 'ok',
            data: {
                razorpayOrderId: razorpayOrder.id,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                keyId,
            },
        });
    }
    catch (err) {
        next(err);
    }
}
async function verifyPayment(req, res, next) {
    try {
        const userId = req.user?.id;
        if (!userId) {
            throw new errorHandler_js_1.AppError('Unauthorized: Authenticated user context is required.', 401, 'UNAUTHORIZED');
        }
        const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
        const isValid = (0, razorpayService_js_1.verifyPaymentSignature)(razorpayOrderId, razorpayPaymentId, razorpaySignature);
        if (!isValid) {
            await (0, orderService_js_1.markPaymentFailed)(orderId, userId);
            throw new errorHandler_js_1.AppError('Payment verification failed: Invalid cryptographic signature.', 400, 'PAYMENT_VERIFICATION_FAILED');
        }
        const updatedOrder = await (0, orderService_js_1.confirmPayment)(orderId, userId, razorpayPaymentId, razorpaySignature);
        res.status(200).json({
            status: 'ok',
            data: updatedOrder,
        });
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=paymentController.js.map