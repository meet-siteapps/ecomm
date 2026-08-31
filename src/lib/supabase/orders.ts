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
  guestToken?: string;
}

/**
 * Securely validates stock and creates an order in Supabase.
 * Primary: Uses atomic PostgreSQL RPC `create_checkout_order` with transaction safety.
 * Fallback: Uses standard Supabase inserts strictly adhering to secure RLS rules.
 */
export async function validateStockAndCreatePendingOrder(
  payloadOrItems: CheckoutPayload | CartItem[],
  argShippingAddress?: ShippingAddress,
  argPaymentMethod?: string,
  argUserId?: string | null,
  argEmail?: string
): Promise<{ success: boolean; order?: Order; orderNumber?: string; orderId?: string; guestToken?: string; error?: string }> {
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
    let guestToken: string | undefined;

    if (Array.isArray(payloadOrItems)) {
      items = payloadOrItems;
      shippingAddress = argShippingAddress!;
      customerName = shippingAddress?.fullName || (shippingAddress as any)?.full_name || '';
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
      guestToken = payloadOrItems.guestToken;
    }

    if (!items || items.length === 0) {
      return { success: false, error: 'Your shopping cart is empty.' };
    }

    const secureGuestToken = !userId
      ? guestToken || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `gst_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`)
      : undefined;

    // Prepared JSON items payload for RPC or direct insert
    const preparedItems = items.map((item) => ({
      product_id: item.product.id,
      product_name: item.product.name,
      product_image: item.product.images && item.product.images.length > 0 ? item.product.images[0] : '',
      selected_size: item.selectedSize || '',
      selected_colour: item.selectedColor || '',
      purchase_price: item.product.price,
      quantity: item.quantity,
    }));

    // =========================================================================
    // METHOD 1: ATOMIC RPC (create_checkout_order)
    // =========================================================================
    try {
      const { data: rpcResult, error: rpcError } = await supabase.rpc('create_checkout_order', {
        p_customer_name: customerName.trim(),
        p_customer_email: customerEmail.trim(),
        p_customer_phone: customerPhone.trim(),
        p_shipping_address: shippingAddress,
        p_subtotal: subtotal,
        p_discount: discount,
        p_shipping: shipping,
        p_total: total,
        p_items: preparedItems,
        p_payment_method: paymentMethod,
        p_guest_token: secureGuestToken || null,
      });

      if (!rpcError && rpcResult) {
        if (rpcResult.success) {
          return {
            success: true,
            orderId: rpcResult.order_id,
            orderNumber: rpcResult.order_number,
            guestToken: rpcResult.guest_token || secureGuestToken,
            order: {
              id: rpcResult.order_id,
              user_id: userId,
              order_number: rpcResult.order_number,
              customer_name: customerName.trim(),
              customer_email: customerEmail.trim(),
              customer_phone: customerPhone.trim(),
              shipping_address: shippingAddress,
              subtotal,
              discount,
              shipping,
              total,
              payment_status: 'pending',
              order_status: 'pending',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          };
        } else if (rpcResult.error) {
          return { success: false, error: rpcResult.error };
        }
      }
    } catch (rpcEx: any) {
      console.warn('RPC create_checkout_order not active, using direct RLS path:', rpcEx?.message || rpcEx);
    }

    // =========================================================================
    // METHOD 2: DIRECT RLS-COMPLIANT INSERT (Fallback)
    // =========================================================================
    // 1. Stock Check against live products
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
    const orderId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `ord_${Date.now()}`;
    const orderNumber = generateOrderNumber();
    const orderToInsert: any = {
      id: orderId,
      user_id: userId || null, // Guest: null, Authenticated: userId
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
      guest_token: secureGuestToken || null,
    };

    // 3. Insert Master Order
    // Note: We do not do .select().single() to avoid guest SELECT RLS rejections
    const { error: orderErr } = await supabase
      .from('orders')
      .insert([orderToInsert]);

    if (orderErr) {
      console.error('Failed to insert order in Supabase:', orderErr);
      return { success: false, error: orderErr.message || 'Failed to place order in database.' };
    }

    // 4. Insert Order Items
    const itemsToInsert = items.map((item) => ({
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : undefined,
      order_id: orderId,
      product_id: item.product.id,
      product_name: item.product.name,
      product_image: item.product.images && item.product.images.length > 0 ? item.product.images[0] : '',
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

    // 5. Decrement product stock if authorized
    for (const item of items) {
      try {
        const currentStock = item.product.stock;
        if (typeof currentStock === 'number' && currentStock >= item.quantity) {
          await supabase
            .from('products')
            .update({ stock: Math.max(0, currentStock - item.quantity) })
            .eq('id', item.product.id);
        }
      } catch {
        // Handled silently if client cannot update products table directly
      }
    }

    return {
      success: true,
      order: { ...orderToInsert, id: orderId } as Order,
      orderNumber,
      orderId,
      guestToken: secureGuestToken,
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
 * Fetch all orders for a specific authenticated customer from Supabase
 */
export async function getUserOrders(userId: string): Promise<Order[]> {
  try {
    if (!userId) return [];
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
 * Securely fetch guest order details by matching order ID + secret guest token
 */
export async function getGuestOrderDetails(orderId: string, guestToken: string): Promise<Order | null> {
  try {
    if (!orderId || !guestToken) return null;
    const supabase = createClient();

    // 1. Try secure RPC
    try {
      const { data: rpcData, error: rpcErr } = await supabase.rpc('get_guest_order_by_token', {
        p_order_id: orderId,
        p_guest_token: guestToken,
      });

      if (!rpcErr && rpcData) {
        return rpcData as Order;
      }
    } catch {
      // Fallback
    }

    return null;
  } catch (err) {
    console.error('Error in getGuestOrderDetails:', err);
    return null;
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
 * Fetch a single order by ID or order number (Authenticated / Admin)
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
