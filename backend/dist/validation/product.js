"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productIdParamSchema = exports.productListQuerySchema = void 0;
const zod_1 = require("zod");
exports.productListQuerySchema = zod_1.z.object({
    search: zod_1.z.string().trim().optional(),
    category: zod_1.z.string().trim().optional(),
    ageGroup: zod_1.z.string().trim().optional(),
    maxPrice: zod_1.z.coerce
        .number()
        .positive('maxPrice must be a positive number')
        .optional(),
    sortBy: zod_1.z
        .enum(['featured', 'price-low', 'price-high', 'discount'])
        .optional(),
    limit: zod_1.z.coerce
        .number()
        .int()
        .min(1)
        .max(200)
        .optional(),
});
exports.productIdParamSchema = zod_1.z.object({
    id: zod_1.z.string().uuid({ message: 'Product id must be a valid UUID' }),
});
//# sourceMappingURL=product.js.map