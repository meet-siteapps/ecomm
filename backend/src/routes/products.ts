import { Router } from 'express';
import { listProducts, getProduct } from '../controllers/productController.js';
import { validate } from '../validation/index.js';
import { productListQuerySchema, productIdParamSchema } from '../validation/product.js';

const router = Router();

/**
 * @route  GET /api/products
 * @desc   List all active products with optional filtering & sorting
 * @access Public
 *
 * Query params (all optional):
 *   search    — full-text search across name, brand, category, description
 *   category  — category name (case-insensitive) or "all"
 *   ageGroup  — age group prefix, e.g. "0-6 Months" — "All Ages" skips filter
 *   maxPrice  — maximum price (INR)
 *   sortBy    — "featured" | "price-low" | "price-high" | "discount"
 *   limit     — max results to return (1–200)
 */
router.get('/', validate(productListQuerySchema, 'query'), listProducts);

/**
 * @route  GET /api/products/:id
 * @desc   Get a single product by UUID
 * @access Public
 */
router.get('/:id', validate(productIdParamSchema, 'params'), getProduct);

export default router;
