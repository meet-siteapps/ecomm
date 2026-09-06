"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productController_js_1 = require("../controllers/productController.js");
const requireAuth_js_1 = require("../middleware/requireAuth.js");
const requireAdmin_js_1 = require("../middleware/requireAdmin.js");
const index_js_1 = require("../validation/index.js");
const product_js_1 = require("../validation/product.js");
const router = (0, express_1.Router)();
router.use(requireAuth_js_1.requireAuth, requireAdmin_js_1.requireAdmin);
router.get('/', productController_js_1.listAllProductsAdmin);
router.post('/', (0, index_js_1.validate)(product_js_1.createProductSchema, 'body'), productController_js_1.createProduct);
router.put('/:id', (0, index_js_1.validate)(product_js_1.productIdParamSchema, 'params'), (0, index_js_1.validate)(product_js_1.updateProductSchema, 'body'), productController_js_1.updateProduct);
router.delete('/:id', (0, index_js_1.validate)(product_js_1.productIdParamSchema, 'params'), productController_js_1.deleteProduct);
router.patch('/:id/status', (0, index_js_1.validate)(product_js_1.productIdParamSchema, 'params'), (0, index_js_1.validate)(product_js_1.toggleProductStatusSchema, 'body'), productController_js_1.toggleStatus);
exports.default = router;
//# sourceMappingURL=adminProducts.js.map