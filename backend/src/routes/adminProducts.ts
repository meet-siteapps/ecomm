import { Router } from 'express';
import {
  listAllProductsAdmin,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleStatus,
} from '../controllers/productController.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireAdmin } from '../middleware/requireAdmin.js';
import { validate } from '../validation/index.js';
import {
  createProductSchema,
  updateProductSchema,
  toggleProductStatusSchema,
  productIdParamSchema,
} from '../validation/product.js';

const router = Router();

// Enforce authentication and admin privileges across all admin product routes
router.use(requireAuth, requireAdmin);

/**
 * @route   GET /api/admin/products
 * @desc    Get all products (both active and inactive) for admin inventory management
 * @access  Private (Admin)
 */
router.get('/', listAllProductsAdmin);

/**
 * @route   POST /api/admin/products
 * @desc    Create a new product with full specifications
 * @access  Private (Admin)
 */
router.post(
  '/',
  validate(createProductSchema, 'body'),
  createProduct,
);

/**
 * @route   PUT /api/admin/products/:id
 * @desc    Update an existing product (supports partial updates)
 * @access  Private (Admin)
 */
router.put(
  '/:id',
  validate(productIdParamSchema, 'params'),
  validate(updateProductSchema, 'body'),
  updateProduct,
);

/**
 * @route   DELETE /api/admin/products/:id
 * @desc    Soft-delete a product by UUID (sets is_active = false)
 * @access  Private (Admin)
 */
router.delete(
  '/:id',
  validate(productIdParamSchema, 'params'),
  deleteProduct,
);

/**
 * @route   PATCH /api/admin/products/:id/status
 * @desc    Quick toggle of product active/inactive status
 * @access  Private (Admin)
 */
router.patch(
  '/:id/status',
  validate(productIdParamSchema, 'params'),
  validate(toggleProductStatusSchema, 'body'),
  toggleStatus,
);

export default router;
