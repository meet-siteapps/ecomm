"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listProducts = listProducts;
exports.getProduct = getProduct;
exports.listAllProductsAdmin = listAllProductsAdmin;
exports.createProduct = createProduct;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
exports.toggleStatus = toggleStatus;
exports.permanentDeleteProduct = permanentDeleteProduct;
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
async function listAllProductsAdmin(_req, res, next) {
    try {
        const products = await (0, productService_js_1.getAllProductsAdmin)();
        res.status(200).json({
            status: 'ok',
            data: products,
        });
    }
    catch (err) {
        next(err);
    }
}
async function createProduct(req, res, next) {
    try {
        const product = await (0, productService_js_1.createProduct)(req.body);
        res.status(201).json({
            status: 'ok',
            data: product,
        });
    }
    catch (err) {
        next(err);
    }
}
async function updateProduct(req, res, next) {
    try {
        const product = await (0, productService_js_1.updateProduct)(req.params.id, req.body);
        res.status(200).json({
            status: 'ok',
            data: product,
        });
    }
    catch (err) {
        next(err);
    }
}
async function deleteProduct(req, res, next) {
    try {
        const product = await (0, productService_js_1.deleteProduct)(req.params.id);
        res.status(200).json({
            status: 'ok',
            data: product,
        });
    }
    catch (err) {
        next(err);
    }
}
async function toggleStatus(req, res, next) {
    try {
        const product = await (0, productService_js_1.toggleProductStatus)(req.params.id, req.body.is_active);
        res.status(200).json({
            status: 'ok',
            data: product,
        });
    }
    catch (err) {
        next(err);
    }
}
async function permanentDeleteProduct(req, res, next) {
    try {
        const result = await (0, productService_js_1.permanentDeleteProduct)(req.params.id);
        res.status(200).json({
            status: 'ok',
            data: result,
        });
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=productController.js.map