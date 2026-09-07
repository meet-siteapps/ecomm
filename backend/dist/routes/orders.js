"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orderController_js_1 = require("../controllers/orderController.js");
const requireAuth_js_1 = require("../middleware/requireAuth.js");
const rateLimiter_js_1 = require("../middleware/rateLimiter.js");
const index_js_1 = require("../validation/index.js");
const order_js_1 = require("../validation/order.js");
const router = (0, express_1.Router)();
router.post('/', rateLimiter_js_1.writeLimiter, requireAuth_js_1.requireAuth, (0, index_js_1.validate)(order_js_1.createOrderSchema, 'body'), orderController_js_1.createOrder);
router.get('/', requireAuth_js_1.requireAuth, orderController_js_1.getMyOrders);
router.get('/:id', requireAuth_js_1.requireAuth, (0, index_js_1.validate)(order_js_1.orderIdParamSchema, 'params'), orderController_js_1.getOrder);
exports.default = router;
//# sourceMappingURL=orders.js.map