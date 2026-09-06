export interface Product {
    id: string;
    name: string;
    brand: string;
    category: string;
    subcategory?: string;
    images: string[];
    mrp: number;
    price: number;
    discount: number;
    age_group?: string;
    size?: string;
    colour?: string;
    material?: string;
    description?: string;
    whats_included?: string[];
    key_features?: string[];
    care_instructions?: string;
    stock: number;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
}
export interface ProductListQuery {
    search?: string;
    category?: string;
    ageGroup?: string;
    maxPrice?: number;
    sortBy?: 'featured' | 'price-low' | 'price-high' | 'discount';
    limit?: number;
}
export interface ProductListResponse {
    products: Product[];
    total: number;
}
export interface CreateProductInput {
    name: string;
    brand?: string;
    category: string;
    subcategory?: string;
    images?: string[];
    mrp: number;
    price: number;
    discount?: number;
    age_group?: string;
    size?: string;
    colour?: string;
    material?: string;
    description?: string;
    whats_included?: string[];
    key_features?: string[];
    care_instructions?: string;
    stock?: number;
    is_active?: boolean;
}
export interface UpdateProductInput {
    name?: string;
    brand?: string;
    category?: string;
    subcategory?: string;
    images?: string[];
    mrp?: number;
    price?: number;
    discount?: number;
    age_group?: string;
    size?: string;
    colour?: string;
    material?: string;
    description?: string;
    whats_included?: string[];
    key_features?: string[];
    care_instructions?: string;
    stock?: number;
    is_active?: boolean;
}
export interface ToggleProductStatusInput {
    is_active: boolean;
}
//# sourceMappingURL=product.d.ts.map