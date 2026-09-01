"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productController_js_1 = require("../controllers/productController.js");
const index_js_1 = require("../validation/index.js");
const product_js_1 = require("../validation/product.js");
const router = (0, express_1.Router)();
router.get('/', (0, index_js_1.validate)(product_js_1.productListQuerySchema, 'query'), productController_js_1.listProducts);
router.get('/:id', (0, index_js_1.validate)(product_js_1.productIdParamSchema, 'params'), productController_js_1.getProduct);
exports.default = router;
//# sourceMappingURL=products.js.map