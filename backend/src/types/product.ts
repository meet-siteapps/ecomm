/**
 * Mirrors the Product interface from src/frontend/types/product.ts exactly.
 * Keep in sync with the Supabase `products` table schema.
 */
export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  subcategory?: string;
  images: string[];
  mrp: number;
  price: number;
  /** Percentage discount (e.g. 20 = 20%) */
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

/** Query parameters accepted by GET /api/products */
export interface ProductListQuery {
  search?: string;
  category?: string;
  ageGroup?: string;
  maxPrice?: number;
  sortBy?: 'featured' | 'price-low' | 'price-high' | 'discount';
  limit?: number;
}

/** Shape of the paginated list response */
export interface ProductListResponse {
  products: Product[];
  total: number;
}
