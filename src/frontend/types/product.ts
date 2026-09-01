export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  subcategory?: string;
  images: string[];
  mrp: number;
  price: number;
  discount: number; // percentage discount (e.g. 20)
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

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}
