/**
 * Thin client for the Express Orders API.
 *
 * Wraps:
 *   POST  /api/orders                  (Create order for authenticated user)
 *   GET   /api/orders                  (Fetch my orders)
 *   GET   /api/orders/:id              (Fetch single order by UUID)
 *   GET   /api/admin/orders            (Admin list all orders)
 *   PATCH /api/admin/orders/:id/status (Admin update order status)
 *
 * Follows the standard envelope pattern and uses getValidAccessToken() for automatic session refresh.
 */

import { Order, OrderStatus, PaymentStatus, ShippingAddress } from '@/types/order';
import { getValidAccessToken } from '@/lib/supabase/client';

const PRODUCTION_URL = 'https://ecomm-backend-u88t.onrender.com';

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  process.env.NEXT_PUBLIC_BACKEND_URL ??
  PRODUCTION_URL;

// ─── Types mirroring the backend response envelope ───────────────────────────

interface BackendSuccess<T> {
  status: 'ok';
  data: T;
}

interface BackendError {
  status: 'error';
  message: string;
  code?: string;
}

type BackendResponse<T> = BackendSuccess<T> | BackendError;

export interface CreateOrderItemPayload {
  productId: string;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface CreateOrderPayload {
  items: CreateOrderItemPayload[];
  shippingAddress: ShippingAddress;
  paymentMethod: 'cod' | 'razorpay';
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function apiOrderFetch<T>(
  path: string,
  accessToken?: string | null,
  options: RequestInit = {}
): Promise<T> {
  let token = accessToken;
  if (!token) {
    token = await getValidAccessToken();
  }

  if (!token) {
    throw new Error('Authentication required. Please sign in to continue.');
  }

  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
    cache: 'no-store',
  });

  let json: BackendResponse<T>;
  try {
    json = await res.json();
  } catch {
    throw new Error(`HTTP ${res.status}: Failed to parse JSON response from ${url}`);
  }

  if (json.status === 'error') {
    const error = new Error(json.message || `API error from ${url}`);
    (error as any).code = json.code;
    (error as any).status = res.status;
    throw error;
  }

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} from ${url}`);
  }

  return json.data;
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Creates a new order via POST /api/orders
 */
export async function createOrder(
  payload: CreateOrderPayload,
  accessToken?: string | null
): Promise<Order> {
  return apiOrderFetch<Order>('/api/orders', accessToken, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * Fetches the authenticated user's order history via GET /api/orders
 */
export async function fetchUserOrders(accessToken?: string | null): Promise<Order[]> {
  return apiOrderFetch<Order[]>('/api/orders', accessToken, {
    method: 'GET',
  });
}

/**
 * Fetches a single order by UUID via GET /api/orders/:id
 */
export async function fetchOrderById(
  orderId: string,
  accessToken?: string | null
): Promise<Order> {
  return apiOrderFetch<Order>(`/api/orders/${orderId}`, accessToken, {
    method: 'GET',
  });
}

/**
 * Admin: Fetches all store orders via GET /api/admin/orders
 */
export async function fetchAllOrdersAdmin(accessToken?: string | null): Promise<Order[]> {
  return apiOrderFetch<Order[]>('/api/admin/orders', accessToken, {
    method: 'GET',
  });
}

/**
 * Admin: Updates order status and/or payment status via PATCH /api/admin/orders/:id/status
 */
export async function updateOrderStatusAdmin(
  orderId: string,
  status?: OrderStatus,
  paymentStatus?: PaymentStatus,
  accessToken?: string | null
): Promise<Order> {
  return apiOrderFetch<Order>(`/api/admin/orders/${orderId}/status`, accessToken, {
    method: 'PATCH',
    body: JSON.stringify({
      order_status: status,
      payment_status: paymentStatus,
    }),
  });
}
