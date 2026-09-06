"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const requireAuth_js_1 = require("../middleware/requireAuth.js");
const authController_js_1 = require("../controllers/authController.js");
const router = (0, express_1.Router)();
router.get('/me', requireAuth_js_1.requireAuth, authController_js_1.getMe);
exports.default = router;
//# sourceMappingURL=auth.js.map