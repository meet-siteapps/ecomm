export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  subcategory?: string;
  images: string[];
  mrp: number;
  price: number;
  discount: number; // in percentage e.g. 20
  stock: number;
  is_active: boolean;
  
  // Basic Info
  description?: string;

  // Optional specifications (Dynamically rendered only when populated)
  age_group?: string;
  size?: string;
  colour?: string;
  material?: string;
  dimensions?: string;
  weight?: string;
  key_features?: string[];
  whats_included?: string[];
  care_instructions?: string;
  
  created_at?: string;
  updated_at?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}
