"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = getMe;
function getMe(req, res) {
    res.status(200).json({
        status: 'ok',
        data: req.user,
    });
}
//# sourceMappingURL=authController.js.map