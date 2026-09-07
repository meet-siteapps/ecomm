"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = getMe;
exports.ensureProfile = ensureProfile;
exports.updateProfile = updateProfile;
const profileService_js_1 = require("../services/profileService.js");
async function getMe(req, res, next) {
    try {
        const profile = await (0, profileService_js_1.getProfile)(req.user.id);
        res.status(200).json({
            status: 'ok',
            data: profile,
        });
    }
    catch (err) {
        next(err);
    }
}
async function ensureProfile(req, res, next) {
    try {
        const profile = await (0, profileService_js_1.ensureProfile)(req.user.id, req.body);
        res.status(200).json({
            status: 'ok',
            data: profile,
        });
    }
    catch (err) {
        next(err);
    }
}
async function updateProfile(req, res, next) {
    try {
        const profile = await (0, profileService_js_1.updateProfile)(req.user.id, req.body);
        res.status(200).json({
            status: 'ok',
            data: profile,
        });
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=authController.js.map