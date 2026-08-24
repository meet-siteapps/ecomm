import { createClient } from './client';
import { Order, OrderItem, OrderStatus, PaymentStatus, ShippingAddress } from '@/types/order';
import { CartItem } from '@/types/product';

/**
 * Generate a friendly human-readable Order Number (e.g. ORD-2026-9482)
 */
export function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `ORD-${year}-${randomSuffix}`;
}

export interface CheckoutPayload {
  userId?: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: ShippingAddress;
  subtotal: number;
  discount?: number;
  shipping: number;
  total: number;
  cartItems: CartItem[];
}

/**
 * Validates current stock and creates a pending order in Supabase
 */
export async function validateStockAndCreatePendingOrder(
  payload: CheckoutPayload
): Promise<{ success: boolean; order?: Order; error?: string }> {
  try {
    const supabase = createClient();

    // 1. Stock Check against live database
    const productIds = payload.cartItems.map((item) => item.product.id);
    const { data: dbProducts, error: prodError } = await supabase
      .from('products')
      .select('id, name, stock, is_active, price')
      .in('id', productIds);

    if (!prodError && dbProducts && dbProducts.length > 0) {
      for (const item of payload.cartItems) {
        const dbProd = dbProducts.find((p) => p.id === item.product.id);
        if (dbProd) {
          if (!dbProd.is_active) {
            return {
              success: false,
              error: `"${dbProd.name}" is currently unavailable. Please remove it from your cart.`,
            };
          }
          if (dbProd.stock < item.quantity) {
            return {
              success: false,
              error: `"${dbProd.name}" only has ${dbProd.stock} units left in stock (you requested ${item.quantity}).`,
            };
          }
        }
      }
    }

    // 2. Prepare Order Data
    const orderNumber = generateOrderNumber();
    const orderToInsert = {
      user_id: payload.userId || null,
      order_number: orderNumber,
      customer_name: payload.customerName.trim(),
      customer_email: payload.customerEmail.trim(),
      customer_phone: payload.customerPhone.trim(),
      shipping_address: payload.shippingAddress,
      subtotal: payload.subtotal,
      discount: payload.discount || 0,
      shipping: payload.shipping,
      total: payload.total,
      payment_status: 'pending' as PaymentStatus,
      order_status: 'pending' as OrderStatus,
    };

    // 3. Insert main Order
    const { data: createdOrder, error: orderErr } = await supabase
      .from('orders')
      .insert([orderToInsert])
      .select()
      .single();

    if (orderErr) {
      console.error('Failed to create pending order:', orderErr);
      return { success: false, error: orderErr.message || 'Failed to place order.' };
    }

    // 4. Insert Order Items (Preserving exact purchase snapshots)
    const itemsToInsert = payload.cartItems.map((item) => ({
      order_id: createdOrder.id,
      product_id: item.product.id,
      product_name: item.product.name,
      product_image:
        item.product.images && item.product.images.length > 0 ? item.product.images[0] : '',
      selected_size: item.selectedSize || '',
      selected_colour: item.selectedColor || '',
      purchase_price: item.product.price,
      quantity: item.quantity,
      total: item.product.price * item.quantity,
    }));

    const { error: itemsErr } = await supabase
      .from('order_items')
      .insert(itemsToInsert);

    if (itemsErr) {
      console.error('Failed to insert order items:', itemsErr);
    }

    // 5. Decrement product stock in database
    for (const item of payload.cartItems) {
      const currentStock = item.product.stock;
      if (typeof currentStock === 'number' && currentStock >= item.quantity) {
        await supabase
          .from('products')
          .update({ stock: Math.max(0, currentStock - item.quantity) })
          .eq('id', item.product.id);
      }
    }

    return {
      success: true,
      order: createdOrder as Order,
    };
  } catch (err: any) {
    console.error('Checkout processing error:', err);
    return {
      success: false,
      error: err.message || 'An unexpected error occurred during checkout.',
    };
  }
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
