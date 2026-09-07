"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orderController_js_1 = require("../controllers/orderController.js");
const requireAuth_js_1 = require("../middleware/requireAuth.js");
const requireAdmin_js_1 = require("../middleware/requireAdmin.js");
const router = (0, express_1.Router)();
router.use(requireAuth_js_1.requireAuth, requireAdmin_js_1.requireAdmin);
router.get('/', orderController_js_1.getDashboardStats);
exports.default = router;
//# sourceMappingURL=adminDashboard.js.map