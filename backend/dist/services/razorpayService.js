"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRazorpayClient = getRazorpayClient;
exports.createRazorpayOrder = createRazorpayOrder;
exports.verifyPaymentSignature = verifyPaymentSignature;
const razorpay_1 = __importDefault(require("razorpay"));
const crypto_1 = __importDefault(require("crypto"));
const errorHandler_js_1 = require("../middleware/errorHandler.js");
let _razorpayClient = null;
function getRazorpayClient() {
    if (_razorpayClient)
        return _razorpayClient;
    const key_id = process.env['RAZORPAY_KEY_ID'];
    const key_secret = process.env['RAZORPAY_KEY_SECRET'];
    if (!key_id || !key_secret) {
        throw new errorHandler_js_1.AppError('Razorpay configuration is missing. Ensure RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are set in environment variables.', 500, 'RAZORPAY_CONFIG_ERROR');
    }
    _razorpayClient = new razorpay_1.default({
        key_id,
        key_secret,
    });
    return _razorpayClient;
}
async function createRazorpayOrder(amount, receiptId) {
    const razorpay = getRazorpayClient();
    const amountInPaise = Math.round(amount * 100);
    try {
        const razorpayOrder = await razorpay.orders.create({
            amount: amountInPaise,
            currency: 'INR',
            receipt: receiptId.slice(0, 40),
        });
        return {
            id: razorpayOrder.id,
            amount: Number(razorpayOrder.amount),
            currency: razorpayOrder.currency,
        };
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown Razorpay error';
        throw new errorHandler_js_1.AppError(`Failed to create Razorpay order: ${message}`, 500, 'RAZORPAY_ORDER_FAILED');
    }
}
function verifyPaymentSignature(orderId, paymentId, signature) {
    const secret = process.env['RAZORPAY_KEY_SECRET'];
    if (!secret) {
        throw new errorHandler_js_1.AppError('Razorpay secret key is not configured on the server.', 500, 'RAZORPAY_CONFIG_ERROR');
    }
    const generatedSignature = crypto_1.default
        .createHmac('sha256', secret)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');
    const signatureBuffer = Buffer.from(signature, 'utf-8');
    const generatedBuffer = Buffer.from(generatedSignature, 'utf-8');
    if (signatureBuffer.length !== generatedBuffer.length) {
        return false;
    }
    return crypto_1.default.timingSafeEqual(signatureBuffer, generatedBuffer);
}
//# sourceMappingURL=razorpayService.js.map