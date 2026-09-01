import { Request, Response, NextFunction } from 'express';
import { getProducts, getProductById } from '../services/productService.js';
import { ProductListQueryInput, ProductIdParamInput } from '../validation/product.js';
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
