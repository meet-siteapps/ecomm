import { Request, Response, NextFunction } from 'express';
import { ProductListQueryInput, ProductIdParamInput, CreateProductSchemaInput, UpdateProductSchemaInput, ToggleProductStatusSchemaInput } from '../validation/product.js';
import { ApiSuccess } from '../types/index.js';
import { ProductListResponse, Product } from '../types/product.js';
export declare function listProducts(req: Request<Record<string, string>, unknown, unknown, ProductListQueryInput>, res: Response<ApiSuccess<ProductListResponse>>, next: NextFunction): Promise<void>;
export declare function getProduct(req: Request<ProductIdParamInput>, res: Response<ApiSuccess<Product>>, next: NextFunction): Promise<void>;
export declare function listAllProductsAdmin(_req: Request, res: Response<ApiSuccess<Product[]>>, next: NextFunction): Promise<void>;
export declare function createProduct(req: Request<Record<string, string>, unknown, CreateProductSchemaInput>, res: Response<ApiSuccess<Product>>, next: NextFunction): Promise<void>;
export declare function updateProduct(req: Request<ProductIdParamInput, unknown, UpdateProductSchemaInput>, res: Response<ApiSuccess<Product>>, next: NextFunction): Promise<void>;
export declare function deleteProduct(req: Request<ProductIdParamInput>, res: Response<ApiSuccess<Product>>, next: NextFunction): Promise<void>;
export declare function toggleStatus(req: Request<ProductIdParamInput, unknown, ToggleProductStatusSchemaInput>, res: Response<ApiSuccess<Product>>, next: NextFunction): Promise<void>;
//# sourceMappingURL=productController.d.ts.map