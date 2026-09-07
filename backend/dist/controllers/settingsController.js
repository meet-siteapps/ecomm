"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSettings = getSettings;
exports.updateSettings = updateSettings;
const settingsService_js_1 = require("../services/settingsService.js");
async function getSettings(_req, res, next) {
    try {
        const settings = await (0, settingsService_js_1.getSettings)();
        res.status(200).json({
            status: 'ok',
            data: settings,
        });
    }
    catch (err) {
        next(err);
    }
}
async function updateSettings(req, res, next) {
    try {
        const settings = await (0, settingsService_js_1.updateSettings)(req.body);
        res.status(200).json({
            status: 'ok',
            data: settings,
        });
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=settingsController.js.map