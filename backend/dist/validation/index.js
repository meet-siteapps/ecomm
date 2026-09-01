"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.z = exports.uuidParamSchema = exports.paginationSchema = void 0;
exports.validate = validate;
const zod_1 = require("zod");
Object.defineProperty(exports, "z", { enumerable: true, get: function () { return zod_1.z; } });
function validate(schema, target = 'body') {
    return (req, _res, next) => {
        const result = schema.safeParse(req[target]);
        if (!result.success) {
            next(result.error);
            return;
        }
        req[target] = result.data;
        next();
    };
}
exports.paginationSchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(20),
});
exports.uuidParamSchema = zod_1.z.object({
    id: zod_1.z.string().uuid({ message: 'id must be a valid UUID' }),
});
//# sourceMappingURL=index.js.map