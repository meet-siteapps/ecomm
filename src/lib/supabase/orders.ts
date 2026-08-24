import { createClient } from './client';
import { Order, OrderItem, OrderStatus, PaymentStatus } from '@/types/order';

/**
 * Generate a friendly human-readable Order Number (e.g. ORD-2026-9482)
 */
export function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `ORD-${year}-${randomSuffix}`;
}

/**
 * Create a new order with its associated snapshot line items in Supabase
 */
export async function createOrder(
  orderData: Omit<Order, 'id' | 'created_at' | 'updated_at' | 'items'>,
  items: Omit<OrderItem, 'id' | 'order_id' | 'created_at'>[]
): Promise<Order> {
  const supabase = createClient();

  // 1. Insert the main order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert([orderData])
    .select()
    .single();

  if (orderError) {
    console.error('Failed to create order in Supabase:', orderError);
    throw new Error(orderError.message || 'Failed to place order');
  }

  // 2. Insert line items with the order's new ID
  if (items && items.length > 0) {
    const itemsToInsert = items.map((item) => ({
      ...item,
      order_id: order.id,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(itemsToInsert);

    if (itemsError) {
      console.error('Failed to insert order items:', itemsError);
    }
  }

  return order as Order;
}

/**
 * Fetch all orders for a specific customer
 */
export async function getUserOrders(userId: string): Promise<Order[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Error fetching customer orders:', error.message);
      return [];
    }

    return (data as any[]).map((row) => ({
      ...row,
      items: row.order_items || [],
    }));
  } catch (err) {
    console.error('Error in getUserOrders:', err);
    return [];
  }
}

/**
 * Fetch all orders for Admin Management
 */
export async function getAllOrdersAdmin(): Promise<Order[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Error fetching admin orders:', error.message);
      return [];
    }

    return (data as any[]).map((row) => ({
      ...row,
      items: row.order_items || [],
    }));
  } catch (err) {
    console.error('Error in getAllOrdersAdmin:', err);
    return [];
  }
}

/**
 * Fetch a single order by ID or order number
 */
export async function getOrderDetails(orderId: string): Promise<Order | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .or(`id.eq.${orderId},order_number.eq.${orderId}`)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return {
      ...(data as any),
      items: (data as any).order_items || [],
    };
  } catch (err) {
    console.error('Error in getOrderDetails:', err);
    return null;
  }
}

/**
 * Update order status (Admin)
 */
export async function updateOrderStatus(
  orderId: string,
  orderStatus: OrderStatus,
  paymentStatus?: PaymentStatus
): Promise<boolean> {
  const supabase = createClient();
  const updates: any = {
    order_status: orderStatus,
    updated_at: new Date().toISOString(),
  };

  if (paymentStatus) {
    updates.payment_status = paymentStatus;
  }

  const { error } = await supabase
    .from('orders')
    .update(updates)
    .eq('id', orderId);

  if (error) {
    console.error('Failed to update order status:', error);
    throw new Error(error.message);
  }

  return true;
}
