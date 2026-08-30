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
  paymentMethod?: string;
}

/**
 * Validates current stock and creates a pending order in Supabase.
 * Supports both unified CheckoutPayload object or positional parameters.
 */
export async function validateStockAndCreatePendingOrder(
  payloadOrItems: CheckoutPayload | CartItem[],
  argShippingAddress?: ShippingAddress,
  argPaymentMethod?: string,
  argUserId?: string | null,
  argEmail?: string
): Promise<{ success: boolean; order?: Order; orderNumber?: string; orderId?: string; error?: string }> {
  try {
    const supabase = createClient();

    let items: CartItem[] = [];
    let userId: string | null = null;
    let customerName = '';
    let customerEmail = '';
    let customerPhone = '';
    let shippingAddress: ShippingAddress;
    let subtotal = 0;
    let discount = 0;
    let shipping = 0;
    let total = 0;
    let paymentMethod = 'cod';

    if (Array.isArray(payloadOrItems)) {
      items = payloadOrItems;
      shippingAddress = argShippingAddress!;
      customerName = shippingAddress?.full_name || '';
      customerPhone = shippingAddress?.phone || '';
      customerEmail = argEmail || '';
      userId = argUserId || null;
      paymentMethod = argPaymentMethod || 'cod';

      subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
      shipping = subtotal >= 999 ? 0 : 99;
      total = subtotal + shipping;
    } else {
      items = payloadOrItems.cartItems;
      userId = payloadOrItems.userId || null;
      customerName = payloadOrItems.customerName;
      customerEmail = payloadOrItems.customerEmail;
      customerPhone = payloadOrItems.customerPhone;
      shippingAddress = payloadOrItems.shippingAddress;
      subtotal = payloadOrItems.subtotal;
      discount = payloadOrItems.discount || 0;
      shipping = payloadOrItems.shipping;
      total = payloadOrItems.total;
      paymentMethod = payloadOrItems.paymentMethod || 'cod';
    }

    if (!items || items.length === 0) {
      return { success: false, error: 'Your shopping cart is empty.' };
    }

    // 1. Stock Check against live database
    const productIds = items.map((item) => item.product.id);
    const { data: dbProducts, error: prodError } = await supabase
      .from('products')
      .select('id, name, stock, is_active, price')
      .in('id', productIds);

    if (!prodError && dbProducts && dbProducts.length > 0) {
      for (const item of items) {
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
      user_id: userId || null,
      order_number: orderNumber,
      customer_name: customerName.trim(),
      customer_email: customerEmail.trim(),
      customer_phone: customerPhone.trim(),
      shipping_address: shippingAddress,
      subtotal,
      discount,
      shipping,
      total,
      payment_status: 'pending' as PaymentStatus,
      order_status: 'pending' as OrderStatus,
    };

    // 3. Insert main Order into Supabase
    const { data: createdOrder, error: orderErr } = await supabase
      .from('orders')
      .insert([orderToInsert])
      .select()
      .single();

    if (orderErr) {
      console.error('Failed to create pending order in Supabase:', orderErr);
      return { success: false, error: orderErr.message || 'Failed to place order in database.' };
    }

    // 4. Insert Order Items (Preserving purchase snapshots)
    const itemsToInsert = items.map((item) => ({
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
      console.error('Failed to insert order items into Supabase:', itemsErr);
    }

    // 5. Decrement product stock in live Supabase database
    for (const item of items) {
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
      orderNumber: createdOrder.order_number || orderNumber,
      orderId: createdOrder.id,
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
 * Fetch all orders for a specific customer from Supabase
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
      console.error('Error fetching customer orders from Supabase:', error.message);
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
 * Fetch all orders for Admin Management from Supabase
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
      console.error('Error fetching admin orders from Supabase:', error.message);
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
 * Fetch a single order by ID or order number from Supabase
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
 * Update order status in Supabase (Admin)
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
    console.error('Failed to update order status in Supabase:', error);
    throw new Error(error.message);
  }

  return true;
}
