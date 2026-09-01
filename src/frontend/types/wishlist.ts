import { Product } from './product';

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at?: string;
  product?: Product;
}
