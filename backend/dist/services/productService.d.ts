import { Product, ProductListQuery, ProductListResponse } from '../types/product.js';
export declare function getProducts(options?: ProductListQuery): Promise<ProductListResponse>;
export declare function getProductById(id: string): Promise<Product | null>;
//# sourceMappingURL=productService.d.ts.map