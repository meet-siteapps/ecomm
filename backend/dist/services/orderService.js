"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrder = createOrder;
exports.getUserOrders = getUserOrders;
exports.getOrderById = getOrderById;
exports.attachRazorpayOrderId = attachRazorpayOrderId;
exports.confirmPayment = confirmPayment;
exports.markPaymentFailed = markPaymentFailed;
const supabaseAdmin_js_1 = require("./supabaseAdmin.js");
const errorHandler_js_1 = require("../middleware/errorHandler.js");
function mapDbOrderToOrder(dbOrder) {
    const items = (dbOrder.order_items ?? []).map((item) => ({
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
function generateOrderNumber() {
    const year = new Date().getFullYear();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    return `ORD-${year}-${randomSuffix}`;
}
async function createOrder(userId, input) {
    const supabaseAdmin = (0, supabaseAdmin_js_1.getSupabaseAdminClient)();
    if (!input.items || input.items.length === 0) {
        throw new errorHandler_js_1.AppError('Order must contain at least one item', 400, 'EMPTY_CART');
    }
    const productIds = input.items.map((i) => i.productId);
    const { data: dbProductsData, error: productError } = await supabaseAdmin
        .from('products')
        .select('id, name, price, stock, is_active, images')
        .in('id', productIds);
    if (productError) {
        throw new errorHandler_js_1.AppError(`Failed to fetch products: ${productError.message}`, 500, 'DATABASE_ERROR');
    }
    const dbProducts = (dbProductsData ?? []);
    const productMap = new Map();
    for (const prod of dbProducts) {
        productMap.set(prod.id, prod);
    }
    for (const item of input.items) {
        const dbProduct = productMap.get(item.productId);
        if (!dbProduct) {
            throw new errorHandler_js_1.AppError(`Product with ID ${item.productId} was not found.`, 404, 'PRODUCT_NOT_FOUND');
        }
        if (!dbProduct.is_active) {
            throw new errorHandler_js_1.AppError(`Product "${dbProduct.name}" is currently inactive and unavailable for order.`, 400, 'PRODUCT_INACTIVE');
        }
        if (dbProduct.stock < item.quantity) {
            throw new errorHandler_js_1.AppError(`Insufficient stock for "${dbProduct.name}". Available: ${dbProduct.stock}, requested: ${item.quantity}.`, 400, 'INSUFFICIENT_STOCK');
        }
    }
    const subtotal = input.items.reduce((sum, item) => {
        const dbProduct = productMap.get(item.productId);
        return sum + dbProduct.price * item.quantity;
    }, 0);
    const discount = 0;
    const shipping = subtotal >= 999 ? 0 : 99;
    const totalAmount = subtotal + shipping - discount;
    const orderNumber = generateOrderNumber();
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
        throw new errorHandler_js_1.AppError(`Failed to create order record: ${orderInsertError?.message ?? 'Unknown database error'}`, 500, 'ORDER_INSERT_FAILED');
    }
    const createdOrder = createdOrderData;
    const orderItemsToInsert = input.items.map((item) => {
        const dbProduct = productMap.get(item.productId);
        const itemTotal = dbProduct.price * item.quantity;
        return {
            order_id: createdOrder.id,
            product_id: dbProduct.id,
            product_name: dbProduct.name,
            product_image: dbProduct.images && dbProduct.images.length > 0 ? dbProduct.images[0] : null,
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
        throw new errorHandler_js_1.AppError(`Failed to create order items: ${itemsInsertError.message}`, 500, 'ORDER_ITEMS_INSERT_FAILED');
    }
    for (const item of input.items) {
        const dbProduct = productMap.get(item.productId);
        const newStock = Math.max(0, dbProduct.stock - item.quantity);
        const { error: stockUpdateError } = await supabaseAdmin
            .from('products')
            .update({ stock: newStock, updated_at: new Date().toISOString() })
            .eq('id', dbProduct.id);
        if (stockUpdateError) {
            console.error(`[orderService] Failed to decrement stock for product ${dbProduct.id}:`, stockUpdateError.message);
        }
    }
    const fullOrderRow = {
        ...createdOrder,
        order_items: (createdItemsData ?? []),
    };
    return mapDbOrderToOrder(fullOrderRow);
}
async function getUserOrders(userId) {
    const supabaseAdmin = (0, supabaseAdmin_js_1.getSupabaseAdminClient)();
    const { data, error } = await supabaseAdmin
        .from('orders')
        .select(`
      *,
      order_items (*)
    `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
    if (error) {
        throw new errorHandler_js_1.AppError(`Failed to retrieve orders: ${error.message}`, 500, 'DATABASE_ERROR');
    }
    const rows = (data ?? []);
    return rows.map(mapDbOrderToOrder);
}
async function getOrderById(orderId, userId, isAdmin = false) {
    const supabaseAdmin = (0, supabaseAdmin_js_1.getSupabaseAdminClient)();
    const { data, error } = await supabaseAdmin
        .from('orders')
        .select(`
      *,
      order_items (*)
    `)
        .eq('id', orderId)
        .maybeSingle();
    if (error) {
        throw new errorHandler_js_1.AppError(`Failed to retrieve order ${orderId}: ${error.message}`, 500, 'DATABASE_ERROR');
    }
    if (!data) {
        return null;
    }
    const orderRow = data;
    if (orderRow.user_id !== userId && !isAdmin) {
        throw new errorHandler_js_1.AppError('You do not have permission to view this order.', 403, 'FORBIDDEN');
    }
    return mapDbOrderToOrder(orderRow);
}
async function attachRazorpayOrderId(orderId, razorpayOrderId) {
    const supabaseAdmin = (0, supabaseAdmin_js_1.getSupabaseAdminClient)();
    const { error } = await supabaseAdmin
        .from('orders')
        .update({
        razorpay_order_id: razorpayOrderId,
        updated_at: new Date().toISOString(),
    })
        .eq('id', orderId);
    if (error) {
        throw new errorHandler_js_1.AppError(`Failed to attach Razorpay order ID: ${error.message}`, 500, 'DATABASE_ERROR');
    }
}
async function confirmPayment(orderId, userId, razorpayPaymentId, razorpaySignature) {
    const supabaseAdmin = (0, supabaseAdmin_js_1.getSupabaseAdminClient)();
    const { data: existingOrderData, error: fetchError } = await supabaseAdmin
        .from('orders')
        .select('*, order_items (*)')
        .eq('id', orderId)
        .maybeSingle();
    if (fetchError) {
        throw new errorHandler_js_1.AppError(`Failed to fetch order: ${fetchError.message}`, 500, 'DATABASE_ERROR');
    }
    if (!existingOrderData) {
        throw new errorHandler_js_1.AppError(`Order not found: ${orderId}`, 404, 'ORDER_NOT_FOUND');
    }
    const existingOrder = existingOrderData;
    if (existingOrder.user_id !== userId) {
        throw new errorHandler_js_1.AppError('You do not have permission to confirm payment for this order.', 403, 'FORBIDDEN');
    }
    if (existingOrder.payment_status === 'paid') {
        return mapDbOrderToOrder(existingOrder);
    }
    if (existingOrder.order_status !== 'pending') {
        throw new errorHandler_js_1.AppError(`Cannot confirm payment for order in '${existingOrder.order_status}' status.`, 400, 'INVALID_ORDER_STATUS');
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
        throw new errorHandler_js_1.AppError(`Failed to update order payment status: ${updateError?.message ?? 'Unknown database error'}`, 500, 'DATABASE_ERROR');
    }
    return mapDbOrderToOrder(updatedOrderData);
}
async function markPaymentFailed(orderId, userId) {
    const supabaseAdmin = (0, supabaseAdmin_js_1.getSupabaseAdminClient)();
    const { error } = await supabaseAdmin
        .from('orders')
        .update({
        payment_status: 'failed',
        updated_at: new Date().toISOString(),
    })
        .eq('id', orderId)
        .eq('user_id', userId);
    if (error) {
        console.error(`[orderService] Failed to mark payment as failed for order ${orderId}:`, error.message);
    }
}
//# sourceMappingURL=orderService.js.map