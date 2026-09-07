"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileSchema = exports.ensureProfileSchema = void 0;
const zod_1 = require("zod");
exports.ensureProfileSchema = zod_1.z.object({
    email: zod_1.z.string().trim().email('Invalid email address').max(255, 'Email cannot exceed 255 characters'),
    name: zod_1.z.string().trim().min(1, 'Name is required').max(200, 'Name cannot exceed 200 characters'),
    phone: zod_1.z.string().trim().max(20, 'Phone cannot exceed 20 characters').optional(),
});
exports.updateProfileSchema = zod_1.z
    .object({
    name: zod_1.z.string().trim().min(1, 'Name cannot be empty').max(200, 'Name cannot exceed 200 characters').optional(),
    phone: zod_1.z.string().trim().max(20, 'Phone cannot exceed 20 characters').optional(),
})
    .refine((data) => data.name !== undefined || data.phone !== undefined, { message: 'At least one field (name or phone) must be provided for update' });
//# sourceMappingURL=user.js.map