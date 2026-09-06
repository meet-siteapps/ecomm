import { Request, Response, NextFunction } from 'express';
import {
  getProducts,
  getProductById,
  getAllProductsAdmin,
  createProduct as createProductService,
  updateProduct as updateProductService,
  deleteProduct as deleteProductService,
  toggleProductStatus as toggleProductStatusService,
} from '../services/productService.js';
import {
  ProductListQueryInput,
  ProductIdParamInput,
  CreateProductSchemaInput,
  UpdateProductSchemaInput,
  ToggleProductStatusSchemaInput,
} from '../validation/product.js';
import { AppError } from '../middleware/errorHandler.js';
import { ApiSuccess } from '../types/index.js';
import { ProductListResponse, Product } from '../types/product.js';

/**
 * GET /api/products
 * Query params (all optional):
 *   search, category, ageGroup, maxPrice, sortBy, limit
 *
 * Validated upstream by the validate() middleware — by the time execution
 * reaches here, req.query is already typed and coerced.
 */
export async function listProducts(
  req: Request<Record<string, string>, unknown, unknown, ProductListQueryInput>,
  res: Response<ApiSuccess<ProductListResponse>>,
  next: NextFunction,
): Promise<void> {
  try {
    const result = await getProducts(req.query);
    res.status(200).json({
      status: 'ok',
      data: result,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/products/:id
 * Route param: id (UUID, validated upstream)
 */
export async function getProduct(
  req: Request<ProductIdParamInput>,
  res: Response<ApiSuccess<Product>>,
  next: NextFunction,
): Promise<void> {
  try {
    const product = await getProductById(req.params.id);

    if (!product) {
      throw new AppError(`Product not found: ${req.params.id}`, 404, 'PRODUCT_NOT_FOUND');
    }

    res.status(200).json({
      status: 'ok',
      data: product,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/admin/products
 * List all products (including inactive) for admin catalog management.
 */
export async function listAllProductsAdmin(
  _req: Request,
  res: Response<ApiSuccess<Product[]>>,
  next: NextFunction,
): Promise<void> {
  try {
    const products = await getAllProductsAdmin();
    res.status(200).json({
      status: 'ok',
      data: products,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/admin/products
 * Create a new product.
 */
export async function createProduct(
  req: Request<Record<string, string>, unknown, CreateProductSchemaInput>,
  res: Response<ApiSuccess<Product>>,
  next: NextFunction,
): Promise<void> {
  try {
    const product = await createProductService(req.body);
    res.status(201).json({
      status: 'ok',
      data: product,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/admin/products/:id
 * Update an existing product (partial or full).
 */
export async function updateProduct(
  req: Request<ProductIdParamInput, unknown, UpdateProductSchemaInput>,
  res: Response<ApiSuccess<Product>>,
  next: NextFunction,
): Promise<void> {
  try {
    const product = await updateProductService(req.params.id, req.body);
    res.status(200).json({
      status: 'ok',
      data: product,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/admin/products/:id
 * Soft delete a product (sets is_active to false).
 */
export async function deleteProduct(
  req: Request<ProductIdParamInput>,
  res: Response<ApiSuccess<Product>>,
  next: NextFunction,
): Promise<void> {
  try {
    const product = await deleteProductService(req.params.id);
    res.status(200).json({
      status: 'ok',
      data: product,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/admin/products/:id/status
 * Toggle product active / inactive status.
 */
export async function toggleStatus(
  req: Request<ProductIdParamInput, unknown, ToggleProductStatusSchemaInput>,
  res: Response<ApiSuccess<Product>>,
  next: NextFunction,
): Promise<void> {
  try {
    const product = await toggleProductStatusService(req.params.id, req.body.is_active);
    res.status(200).json({
      status: 'ok',
      data: product,
    });
  } catch (err) {
    next(err);
  }
}

