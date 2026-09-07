"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orderController_js_1 = require("../controllers/orderController.js");
const requireAuth_js_1 = require("../middleware/requireAuth.js");
const requireAdmin_js_1 = require("../middleware/requireAdmin.js");
const rateLimiter_js_1 = require("../middleware/rateLimiter.js");
const index_js_1 = require("../validation/index.js");
const order_js_1 = require("../validation/order.js");
const router = (0, express_1.Router)();
router.use(requireAuth_js_1.requireAuth, requireAdmin_js_1.requireAdmin);
router.get('/', orderController_js_1.listAllOrdersAdmin);
router.patch('/:id/status', rateLimiter_js_1.writeLimiter, (0, index_js_1.validate)(order_js_1.orderIdParamSchema, 'params'), (0, index_js_1.validate)(order_js_1.updateOrderStatusSchema, 'body'), orderController_js_1.updateOrderStatusAdmin);
exports.default = router;
//# sourceMappingURL=adminOrders.js.map