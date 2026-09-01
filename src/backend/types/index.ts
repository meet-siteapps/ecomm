import { Order, OrderItem, OrderStatus, PaymentStatus, ShippingAddress } from '@/frontend/types/order';
import { Product, CartItem } from '@/frontend/types/product';
import { UserProfile, UserRole } from '@/frontend/types/user';
import { StoreSettings } from '@/frontend/types/settings';
import { WishlistItem } from '@/frontend/types/wishlist';

export type {
  Order,
  OrderItem,
  OrderStatus,
  PaymentStatus,
  ShippingAddress,
  Product,
  CartItem,
  UserProfile,
  UserRole,
  StoreSettings,
  WishlistItem,
};

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface AdminStatsResponse {
  totalProducts: number;
  activeProducts: number;
  lowStockProducts: number;
  totalCustomers: number;
  totalOrders: number;
  pendingOrders: number;
  recentOrders: Array<{
    id: string;
    order_number: string;
    customer_name: string;
    amount: number;
    status: string;
    date: string;
  }>;
}
