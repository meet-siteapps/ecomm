import { Product, ProductListQuery, ProductListResponse, CreateProductInput, UpdateProductInput } from '../types/product.js';
export declare function getProducts(options?: ProductListQuery): Promise<ProductListResponse>;
export declare function getProductById(id: string): Promise<Product | null>;
export declare function getAllProductsAdmin(): Promise<Product[]>;
export declare function createProduct(input: CreateProductInput): Promise<Product>;
export declare function updateProduct(id: string, input: UpdateProductInput): Promise<Product>;
export declare function deleteProduct(id: string): Promise<Product>;
export declare function toggleProductStatus(id: string, isActive: boolean): Promise<Product>;
export declare function permanentDeleteProduct(id: string): Promise<{
    id: string;
}>;
//# sourceMappingURL=productService.d.ts.map