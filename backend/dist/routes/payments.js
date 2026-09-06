"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const paymentController_js_1 = require("../controllers/paymentController.js");
const requireAuth_js_1 = require("../middleware/requireAuth.js");
const index_js_1 = require("../validation/index.js");
const payment_js_1 = require("../validation/payment.js");
const router = (0, express_1.Router)();
router.post('/create-order', requireAuth_js_1.requireAuth, (0, index_js_1.validate)(payment_js_1.createPaymentOrderSchema, 'body'), paymentController_js_1.createPaymentOrder);
router.post('/verify', requireAuth_js_1.requireAuth, (0, index_js_1.validate)(payment_js_1.verifyPaymentSchema, 'body'), paymentController_js_1.verifyPayment);
exports.default = router;
//# sourceMappingURL=payments.js.map