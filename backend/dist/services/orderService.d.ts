import { CreateOrderInput, Order } from '../types/order.js';
export declare function createOrder(userId: string, input: CreateOrderInput): Promise<Order>;
export declare function getUserOrders(userId: string): Promise<Order[]>;
export declare function getOrderById(orderId: string, userId: string, isAdmin?: boolean): Promise<Order | null>;
export declare function attachRazorpayOrderId(orderId: string, razorpayOrderId: string): Promise<void>;
export declare function confirmPayment(orderId: string, userId: string, razorpayPaymentId: string, razorpaySignature: string): Promise<Order>;
export declare function markPaymentFailed(orderId: string, userId: string): Promise<void>;
export declare function getAllOrdersAdmin(): Promise<Order[]>;
export declare function updateOrderStatusAdmin(orderId: string, orderStatus?: Order['order_status'], paymentStatus?: Order['payment_status']): Promise<Order>;
export declare function getDashboardStats(): Promise<import('../types/order.js').AdminDashboardStats>;
//# sourceMappingURL=orderService.d.ts.map