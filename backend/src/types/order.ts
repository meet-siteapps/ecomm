export type PaymentStatus =
  | 'unpaid'
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded';
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';
export type PaymentMethod = 'cod' | 'razorpay';

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
}

export interface CreateOrderItemInput {
  productId: string;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface CreateOrderInput {
  items: CreateOrderItemInput[];
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
}

export interface OrderItem {
  id?: string;
  order_id?: string;
  productId: string;
  product_id?: string;
  product_name?: string;
  product_image?: string;
  selected_size?: string;
  selected_colour?: string;
  price: number;
  purchase_price?: number;
  quantity: number;
  total?: number;
  created_at?: string;
}

export interface Order {
  id: string;
  user_id?: string | null;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: ShippingAddress;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  payment_method?: PaymentMethod;
  guest_token?: string | null;
  razorpay_order_id?: string | null;
  razorpay_payment_id?: string | null;
  razorpay_signature?: string | null;
  razorpayOrderId?: string | null;
  razorpayPaymentId?: string | null;
  razorpaySignature?: string | null;
  created_at?: string;
  updated_at?: string;
  items?: OrderItem[];
}

