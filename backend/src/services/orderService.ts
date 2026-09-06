import { getSupabaseAdminClient } from './supabaseAdmin.js';
import { CreateOrderInput, Order, OrderItem } from '../types/order.js';
import { AppError } from '../middleware/errorHandler.js';

interface DbProductRow {
  id: string;
  name: string;
  price: number;
  stock: number;
  is_active: boolean;
  images: string[] | null;
}

interface DbOrderItemRow {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  product_image: string | null;
  selected_size: string | null;
  selected_colour: string | null;
  purchase_price: number | string;
  quantity: number;
  total: number | string;
  created_at: string;
}

interface DbOrderRow {
  id: string;
  user_id: string | null;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: Record<string, unknown>;
  subtotal: number | string;
  discount: number | string;
  shipping: number | string;
  total: number | string;
  payment_status: Order['payment_status'];
  order_status: Order['order_status'];
  guest_token?: string | null;
  razorpay_order_id?: string | null;
  razorpay_payment_id?: string | null;
  razorpay_signature?: string | null;
  created_at: string;
  updated_at: string;
  order_items?: DbOrderItemRow[];
}

/**
 * Transforms a raw database order record and joined order_items into the typed Order domain model.
 */
function mapDbOrderToOrder(dbOrder: DbOrderRow): Order {
  const items: OrderItem[] = (dbOrder.order_items ?? []).map((item) => ({
    id: item.id,
    order_id: item.order_id,
    productId: item.product_id ?? '',
    product_id: item.product_id ?? '',
    product_name: item.product_name,
    product_image: item.product_image ?? undefined,
    selected_size: item.selected_size ?? undefined,
    selected_colour: item.selected_colour ?? undefined,
    price: Number(item.purchase_price),
    purchase_price: Number(item.purchase_price),
    quantity: item.quantity,
    total: Number(item.total),
    created_at: item.created_at,
  }));

  return {
    id: dbOrder.id,
    user_id: dbOrder.user_id,
    order_number: dbOrder.order_number,
    customer_name: dbOrder.customer_name,
    customer_email: dbOrder.customer_email,
    customer_phone: dbOrder.customer_phone,
    shipping_address: {
      fullName: String(dbOrder.shipping_address['fullName'] ?? dbOrder.customer_name),
      phone: String(dbOrder.shipping_address['phone'] ?? dbOrder.customer_phone),
      email: dbOrder.shipping_address['email']
        ? String(dbOrder.shipping_address['email'])
        : undefined,
      addressLine1: String(dbOrder.shipping_address['addressLine1'] ?? ''),
      addressLine2: dbOrder.shipping_address['addressLine2']
        ? String(dbOrder.shipping_address['addressLine2'])
        : undefined,
      city: String(dbOrder.shipping_address['city'] ?? ''),
      state: String(dbOrder.shipping_address['state'] ?? ''),
      pincode: String(dbOrder.shipping_address['pincode'] ?? ''),
      landmark: dbOrder.shipping_address['landmark']
        ? String(dbOrder.shipping_address['landmark'])
        : undefined,
    },
    subtotal: Number(dbOrder.subtotal),
    discount: Number(dbOrder.discount),
    shipping: Number(dbOrder.shipping),
    total: Number(dbOrder.total),
    payment_status: dbOrder.payment_status,
    order_status: dbOrder.order_status,
    guest_token: dbOrder.guest_token ?? null,
    razorpay_order_id: dbOrder.razorpay_order_id ?? null,
    razorpay_payment_id: dbOrder.razorpay_payment_id ?? null,
    razorpay_signature: dbOrder.razorpay_signature ?? null,
    created_at: dbOrder.created_at,
    updated_at: dbOrder.updated_at,
    items,
  };
}

/**
 * Generate a friendly human-readable Order Number (e.g. ORD-2026-9482)
 */
function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `ORD-${year}-${randomSuffix}`;
}

/**
 * Creates a new order for an authenticated user.
 *
 * Steps:
 * 1. Fetches current prices and inventory from the database for all requested items.
 * 2. Validates product availability and stock quantities against current DB values.
 * 3. Calculates subtotal, shipping fee, and total amount server-side.
 * 4. Inserts the master record into the `orders` table using supabaseAdmin.
 * 5. Inserts matching item rows into the `order_items` table.
 * 6. Decrements stock levels in the `products` table.
 * 7. Returns the fully created order record including joined items.
 *
 * @param userId - Verified Supabase user UUID from auth token
 * @param input - Order payload containing items, shipping address, and payment method
 * @returns Fully populated Order object with created items
 */
export async function createOrder(
  userId: string,
  input: CreateOrderInput,
): Promise<Order> {
  const supabaseAdmin = getSupabaseAdminClient();

  if (!input.items || input.items.length === 0) {
    throw new AppError('Order must contain at least one item', 400, 'EMPTY_CART');
  }

  // 1. Fetch current prices & stock directly from DB for each productId
  const productIds = input.items.map((i) => i.productId);
  const { data: dbProductsData, error: productError } = await supabaseAdmin
    .from('products')
    .select('id, name, price, stock, is_active, images')
    .in('id', productIds);

  if (productError) {
    throw new AppError(
      `Failed to fetch products: ${productError.message}`,
      500,
      'DATABASE_ERROR',
    );
  }

  const dbProducts = (dbProductsData ?? []) as DbProductRow[];
  const productMap = new Map<string, DbProductRow>();
  for (const prod of dbProducts) {
    productMap.set(prod.id, prod);
  }

  // 2. Validate availability and stock
  for (const item of input.items) {
    const dbProduct = productMap.get(item.productId);

    if (!dbProduct) {
      throw new AppError(
        `Product with ID ${item.productId} was not found.`,
        404,
        'PRODUCT_NOT_FOUND',
      );
    }

    if (!dbProduct.is_active) {
      throw new AppError(
        `Product "${dbProduct.name}" is currently inactive and unavailable for order.`,
        400,
        'PRODUCT_INACTIVE',
      );
    }

    if (dbProduct.stock < item.quantity) {
      throw new AppError(
        `Insufficient stock for "${dbProduct.name}". Available: ${dbProduct.stock}, requested: ${item.quantity}.`,
        400,
        'INSUFFICIENT_STOCK',
      );
    }
  }

  // 3. Calculate totals server-side
  const subtotal = input.items.reduce((sum, item) => {
    const dbProduct = productMap.get(item.productId)!;
    return sum + dbProduct.price * item.quantity;
  }, 0);

  const discount = 0;
  const shipping = subtotal >= 999 ? 0 : 99; // Free shipping over ₹999, else flat ₹99
  const totalAmount = subtotal + shipping - discount;
  const orderNumber = generateOrderNumber();

  // 4. Insert into `orders` table using supabaseAdmin
  const orderInsertPayload = {
    user_id: userId,
    order_number: orderNumber,
    customer_name: input.shippingAddress.fullName.trim(),
    customer_email: input.shippingAddress.email?.trim() || '',
    customer_phone: input.shippingAddress.phone.trim(),
    shipping_address: input.shippingAddress,
    subtotal,
    discount,
    shipping,
    total: totalAmount,
    payment_status: 'pending',
    order_status: 'pending',
  };

  const { data: createdOrderData, error: orderInsertError } = await supabaseAdmin
    .from('orders')
    .insert(orderInsertPayload)
    .select('*')
    .single();

  if (orderInsertError || !createdOrderData) {
    throw new AppError(
      `Failed to create order record: ${orderInsertError?.message ?? 'Unknown database error'}`,
      500,
      'ORDER_INSERT_FAILED',
    );
  }

  const createdOrder = createdOrderData as DbOrderRow;

  // 5. Insert matching rows into `order_items` table
  const orderItemsToInsert = input.items.map((item) => {
    const dbProduct = productMap.get(item.productId)!;
    const itemTotal = dbProduct.price * item.quantity;
    return {
      order_id: createdOrder.id,
      product_id: dbProduct.id,
      product_name: dbProduct.name,
      product_image:
        dbProduct.images && dbProduct.images.length > 0 ? dbProduct.images[0] : null,
      selected_size: item.selectedSize || null,
      selected_colour: item.selectedColor || null,
      purchase_price: dbProduct.price,
      quantity: item.quantity,
      total: itemTotal,
    };
  });

  const { data: createdItemsData, error: itemsInsertError } = await supabaseAdmin
    .from('order_items')
    .insert(orderItemsToInsert)
    .select('*');

  if (itemsInsertError) {
    throw new AppError(
      `Failed to create order items: ${itemsInsertError.message}`,
      500,
      'ORDER_ITEMS_INSERT_FAILED',
    );
  }

  // 6. Decrement stock in `products` table
  for (const item of input.items) {
    const dbProduct = productMap.get(item.productId)!;
    const newStock = Math.max(0, dbProduct.stock - item.quantity);

    const { error: stockUpdateError } = await supabaseAdmin
      .from('products')
      .update({ stock: newStock, updated_at: new Date().toISOString() })
      .eq('id', dbProduct.id);

    if (stockUpdateError) {
      console.error(
        `[orderService] Failed to decrement stock for product ${dbProduct.id}:`,
        stockUpdateError.message,
      );
    }
  }

  // 7. Return the created order with items
  const fullOrderRow: DbOrderRow = {
    ...createdOrder,
    order_items: (createdItemsData ?? []) as DbOrderItemRow[],
  };

  return mapDbOrderToOrder(fullOrderRow);
}

/**
 * Fetches all orders belonging to a specific user, sorted newest first, with order_items joined.
 *
 * @param userId - Verified user UUID
 * @returns Array of orders with attached item details
 */
export async function getUserOrders(userId: string): Promise<Order[]> {
  const supabaseAdmin = getSupabaseAdminClient();

  const { data, error } = await supabaseAdmin
    .from('orders')
    .select(
      `
      *,
      order_items (*)
    `,
    )
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new AppError(
      `Failed to retrieve orders: ${error.message}`,
      500,
      'DATABASE_ERROR',
    );
  }

  const rows = (data ?? []) as DbOrderRow[];
  return rows.map(mapDbOrderToOrder);
}

/**
 * Fetches a single order by UUID, verifying ownership against the authenticated userId
 * (unless the requester has an admin role).
 *
 * @param orderId - Target order UUID
 * @param userId - Requesting user UUID
 * @param isAdmin - Whether the requesting user is an administrator
 * @returns Order object or null if not found
 */
export async function getOrderById(
  orderId: string,
  userId: string,
  isAdmin: boolean = false,
): Promise<Order | null> {
  const supabaseAdmin = getSupabaseAdminClient();

  const { data, error } = await supabaseAdmin
    .from('orders')
    .select(
      `
      *,
      order_items (*)
    `,
    )
    .eq('id', orderId)
    .maybeSingle();

  if (error) {
    throw new AppError(
      `Failed to retrieve order ${orderId}: ${error.message}`,
      500,
      'DATABASE_ERROR',
    );
  }

  if (!data) {
    return null;
  }

  const orderRow = data as DbOrderRow;

  // Authorization check: User can only view their own order unless they are an admin
  if (orderRow.user_id !== userId && !isAdmin) {
    throw new AppError(
      'You do not have permission to view this order.',
      403,
      'FORBIDDEN',
    );
  }

  return mapDbOrderToOrder(orderRow);
}

/**
 * Attaches a Razorpay order ID to an existing pending order.
 *
 * @param orderId - Internal order UUID
 * @param razorpayOrderId - Razorpay generated order ID (e.g. order_xxx)
 */
export async function attachRazorpayOrderId(
  orderId: string,
  razorpayOrderId: string,
): Promise<void> {
  const supabaseAdmin = getSupabaseAdminClient();

  const { error } = await supabaseAdmin
    .from('orders')
    .update({
      razorpay_order_id: razorpayOrderId,
      updated_at: new Date().toISOString(),
    })
    .eq('id', orderId);

  if (error) {
    throw new AppError(
      `Failed to attach Razorpay order ID: ${error.message}`,
      500,
      'DATABASE_ERROR',
    );
  }
}

/**
 * Confirms payment for an order after cryptographic verification.
 *
 * Steps:
 * 1. Verifies order ownership and existence.
 * 2. Checks order status is still 'pending' to prevent double-payment.
 * 3. Updates payment_status to 'paid', order_status to 'confirmed', and saves payment IDs.
 * 4. Returns the updated order with joined items.
 *
 * @param orderId - Order UUID
 * @param userId - Requesting user UUID
 * @param razorpayPaymentId - Verified Razorpay payment ID
 * @param razorpaySignature - Verified Razorpay cryptographic signature
 * @returns Updated Order object
 */
export async function confirmPayment(
  orderId: string,
  userId: string,
  razorpayPaymentId: string,
  razorpaySignature: string,
): Promise<Order> {
  const supabaseAdmin = getSupabaseAdminClient();

  const { data: existingOrderData, error: fetchError } = await supabaseAdmin
    .from('orders')
    .select('*, order_items (*)')
    .eq('id', orderId)
    .maybeSingle();

  if (fetchError) {
    throw new AppError(
      `Failed to fetch order: ${fetchError.message}`,
      500,
      'DATABASE_ERROR',
    );
  }

  if (!existingOrderData) {
    throw new AppError(`Order not found: ${orderId}`, 404, 'ORDER_NOT_FOUND');
  }

  const existingOrder = existingOrderData as DbOrderRow;

  if (existingOrder.user_id !== userId) {
    throw new AppError(
      'You do not have permission to confirm payment for this order.',
      403,
      'FORBIDDEN',
    );
  }

  // Idempotency: if already marked paid, return current order
  if (existingOrder.payment_status === 'paid') {
    return mapDbOrderToOrder(existingOrder);
  }

  if (existingOrder.order_status !== 'pending') {
    throw new AppError(
      `Cannot confirm payment for order in '${existingOrder.order_status}' status.`,
      400,
      'INVALID_ORDER_STATUS',
    );
  }

  const { data: updatedOrderData, error: updateError } = await supabaseAdmin
    .from('orders')
    .update({
      payment_status: 'paid',
      order_status: 'confirmed',
      razorpay_payment_id: razorpayPaymentId,
      razorpay_signature: razorpaySignature,
      updated_at: new Date().toISOString(),
    })
    .eq('id', orderId)
    .select('*, order_items (*)')
    .single();

  if (updateError || !updatedOrderData) {
    throw new AppError(
      `Failed to update order payment status: ${updateError?.message ?? 'Unknown database error'}`,
      500,
      'DATABASE_ERROR',
    );
  }

  return mapDbOrderToOrder(updatedOrderData as DbOrderRow);
}

/**
 * Marks an order's payment status as 'failed' following unsuccessful signature verification.
 *
 * @param orderId - Order UUID
 * @param userId - Requesting user UUID
 */
export async function markPaymentFailed(
  orderId: string,
  userId: string,
): Promise<void> {
  const supabaseAdmin = getSupabaseAdminClient();

  const { error } = await supabaseAdmin
    .from('orders')
    .update({
      payment_status: 'failed',
      updated_at: new Date().toISOString(),
    })
    .eq('id', orderId)
    .eq('user_id', userId);

  if (error) {
    console.error(
      `[orderService] Failed to mark payment as failed for order ${orderId}:`,
      error.message,
    );
  }
}

