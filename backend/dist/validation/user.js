"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileSchema = exports.ensureProfileSchema = void 0;
const zod_1 = require("zod");
exports.ensureProfileSchema = zod_1.z.object({
    email: zod_1.z.string().trim().email('Invalid email address'),
    name: zod_1.z.string().trim().min(1, 'Name is required'),
    phone: zod_1.z.string().trim().optional(),
});
exports.updateProfileSchema = zod_1.z
    .object({
    name: zod_1.z.string().trim().min(1, 'Name cannot be empty').optional(),
    phone: zod_1.z.string().trim().optional(),
})
    .refine((data) => data.name !== undefined || data.phone !== undefined, { message: 'At least one field (name or phone) must be provided for update' });
//# sourceMappingURL=user.js.map