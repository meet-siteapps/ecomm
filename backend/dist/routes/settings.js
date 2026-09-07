"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const settingsController_js_1 = require("../controllers/settingsController.js");
const requireAuth_js_1 = require("../middleware/requireAuth.js");
const requireAdmin_js_1 = require("../middleware/requireAdmin.js");
const index_js_1 = require("../validation/index.js");
const settings_js_1 = require("../validation/settings.js");
const router = (0, express_1.Router)();
router.get('/', settingsController_js_1.getSettings);
router.get('/settings', settingsController_js_1.getSettings);
router.put('/', requireAuth_js_1.requireAuth, requireAdmin_js_1.requireAdmin, (0, index_js_1.validate)(settings_js_1.updateSettingsSchema, 'body'), settingsController_js_1.updateSettings);
router.put('/admin/settings', requireAuth_js_1.requireAuth, requireAdmin_js_1.requireAdmin, (0, index_js_1.validate)(settings_js_1.updateSettingsSchema, 'body'), settingsController_js_1.updateSettings);
exports.default = router;
//# sourceMappingURL=settings.js.map