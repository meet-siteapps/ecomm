"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listProducts = listProducts;
exports.getProduct = getProduct;
const productService_js_1 = require("../services/productService.js");
const errorHandler_js_1 = require("../middleware/errorHandler.js");
async function listProducts(req, res, next) {
    try {
        const result = await (0, productService_js_1.getProducts)(req.query);
        res.status(200).json({
            status: 'ok',
            data: result,
        });
    }
    catch (err) {
        next(err);
    }
}
async function getProduct(req, res, next) {
    try {
        const product = await (0, productService_js_1.getProductById)(req.params.id);
        if (!product) {
            throw new errorHandler_js_1.AppError(`Product not found: ${req.params.id}`, 404, 'PRODUCT_NOT_FOUND');
        }
        res.status(200).json({
            status: 'ok',
            data: product,
        });
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=productController.js.map