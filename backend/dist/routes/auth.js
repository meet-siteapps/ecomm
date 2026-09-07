"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const requireAuth_js_1 = require("../middleware/requireAuth.js");
const authController_js_1 = require("../controllers/authController.js");
const index_js_1 = require("../validation/index.js");
const user_js_1 = require("../validation/user.js");
const router = (0, express_1.Router)();
router.get('/me', requireAuth_js_1.requireAuth, authController_js_1.getMe);
router.post('/ensure-profile', requireAuth_js_1.requireAuth, (0, index_js_1.validate)(user_js_1.ensureProfileSchema, 'body'), authController_js_1.ensureProfile);
router.put('/profile', requireAuth_js_1.requireAuth, (0, index_js_1.validate)(user_js_1.updateProfileSchema, 'body'), authController_js_1.updateProfile);
exports.default = router;
//# sourceMappingURL=auth.js.map