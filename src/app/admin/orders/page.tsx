'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShoppingCart,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  AlertCircle,
  ChevronDown,
  Loader2,
  ExternalLink,
  RefreshCw,
  Package,
  Eye,
  X,
  MapPin,
  Mail,
  Phone,
  Check
} from 'lucide-react';
import { Order, OrderStatus, PaymentStatus } from '@/frontend/types/order';
import { fetchAllOrdersAdmin, updateOrderStatusAdmin } from '@/frontend/lib/api/orders';

const STATUS_BADGES: Record<OrderStatus, { label: string; bg: string; text: string; border: string }> = {
  pending: { label: 'Pending', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  confirmed: { label: 'Confirmed', bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' },
  processing: { label: 'Processing', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  shipped: { label: 'Shipped', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  delivered: { label: 'Delivered', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  cancelled: { label: 'Cancelled', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
};

const PAYMENT_BADGES: Record<PaymentStatus, { label: string; bg: string; text: string; border: string }> = {
  pending: { label: 'Pending', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  paid: { label: 'Paid', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  failed: { label: 'Failed', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  refunded: { label: 'Refunded', bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAllOrdersAdmin();
      setOrders(data);
    } catch (err) {
      console.error('Failed to load admin orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingId(orderId);
    try {
      await updateOrderStatusAdmin(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, order_status: newStatus } : o))
      );
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, order_status: newStatus } : null));
      }
      setFeedback({ type: 'success', message: `Order status updated to ${newStatus}.` });
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to update order status.' });
    } finally {
      setUpdatingId(null);
    }
  };

  const handlePaymentStatusChange = async (orderId: string, newPaymentStatus: PaymentStatus) => {
    setUpdatingId(orderId);
    try {
      await updateOrderStatusAdmin(orderId, undefined, newPaymentStatus);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, payment_status: newPaymentStatus } : o))
      );
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, payment_status: newPaymentStatus } : null));
      }
      setFeedback({ type: 'success', message: `Payment status updated to ${newPaymentStatus}.` });
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to update payment status.' });
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchNum = order.order_number.toLowerCase().includes(q);
      const matchName = order.customer_name.toLowerCase().includes(q);
      const matchEmail = order.customer_email.toLowerCase().includes(q);
      const matchPhone = order.customer_phone.toLowerCase().includes(q);
      if (!matchNum && !matchName && !matchEmail && !matchPhone) return false;
    }

    if (statusFilter !== 'all' && order.order_status !== statusFilter) {
      return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] tracking-tight">
            Customer Orders
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Track order fulfillment: Pending → Confirmed → Processing → Shipped → Delivered
          </p>
        </div>

        <button
          type="button"
          onClick={loadOrders}
          disabled={isLoading}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors shadow-2xs"
          title="Refresh orders"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {feedback && (
        <div
          className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 animate-in fade-in ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order #, customer name, email, phone..."
            className="w-full bg-gray-50 text-xs text-[#1F2937] placeholder-gray-400 rounded-xl pl-9 pr-3 py-2 border border-gray-200 focus:bg-white focus:border-[#4DA3FF] focus:outline-none"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="w-full sm:w-56">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-gray-50 text-xs text-[#1F2937] font-medium rounded-xl px-3 py-2 border border-gray-200 focus:bg-white focus:border-[#4DA3FF] focus:outline-none cursor-pointer"
          >
            <option value="all">All Order Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-16 text-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#4DA3FF] mx-auto" />
            <p className="text-xs text-gray-500 font-medium">Loading orders from database...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <ShoppingCart className="w-10 h-10 text-gray-300 mx-auto" />
            <h3 className="text-sm font-bold text-[#1F2937]">No orders found</h3>
            <p className="text-xs text-gray-400">
              When customers complete checkouts, their orders will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700">
              <thead className="bg-gray-50/80 text-[11px] font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100">
                <tr>
                  <th className="px-5 py-3.5">Order #</th>
                  <th className="px-4 py-3.5">Customer</th>
                  <th className="px-4 py-3.5">Date</th>
                  <th className="px-4 py-3.5">Total</th>
                  <th className="px-4 py-3.5">Payment</th>
                  <th className="px-4 py-3.5">Order Status</th>
                  <th className="px-5 py-3.5 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((order) => {
                  const statusBadge = STATUS_BADGES[order.order_status] || STATUS_BADGES.pending;
                  const paymentBadge = PAYMENT_BADGES[order.payment_status] || PAYMENT_BADGES.pending;

                  return (
                    <tr key={order.id} className="hover:bg-gray-50/70 transition-colors">
                      {/* Order Number */}
                      <td className="px-5 py-4 font-bold text-[#1F2937]">
                        <span className="font-mono text-xs text-[#4DA3FF] block">
                          {order.order_number}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {order.items?.length || 0} {(order.items?.length === 1) ? 'item' : 'items'}
                        </span>
                      </td>

                      {/* Customer */}
                      <td className="px-4 py-4">
                        <span className="font-bold text-[#1F2937] block">
                          {order.customer_name}
                        </span>
                        <span className="text-[11px] text-gray-500 block">
                          {order.customer_email}
                        </span>
                        <span className="text-[10px] text-gray-400">{order.customer_phone}</span>
                      </td>

                      {/* Date */}
                      <td className="px-4 py-4 text-gray-500 text-[11px]">
                        {order.created_at
                          ? new Date(order.created_at).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : '—'}
                      </td>

                      {/* Total */}
                      <td className="px-4 py-4">
                        <span className="font-extrabold text-[#1F2937] text-sm">
                          ₹{order.total.toLocaleString('en-IN')}
                        </span>
                        {order.shipping > 0 && (
                          <span className="text-[10px] text-gray-400 block">
                            incl. ₹{order.shipping} ship
                          </span>
                        )}
                      </td>

                      {/* Payment Status Dropdown */}
                      <td className="px-4 py-4">
                        <select
                          value={order.payment_status}
                          disabled={updatingId === order.id}
                          onChange={(e) =>
                            handlePaymentStatusChange(order.id, e.target.value as PaymentStatus)
                          }
                          className={`text-xs font-bold rounded-lg px-2.5 py-1 border cursor-pointer focus:outline-none uppercase text-[10px] ${paymentBadge.bg} ${paymentBadge.text} ${paymentBadge.border}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                          <option value="failed">Failed</option>
                          <option value="refunded">Refunded</option>
                        </select>
                      </td>

                      {/* Order Status Selector: Pending → Confirmed → Processing → Shipped → Delivered / Cancelled */}
                      <td className="px-4 py-4">
                        <select
                          value={order.order_status}
                          disabled={updatingId === order.id}
                          onChange={(e) =>
                            handleStatusChange(order.id, e.target.value as OrderStatus)
                          }
                          className={`text-xs font-bold rounded-lg px-2.5 py-1.5 border cursor-pointer focus:outline-none capitalize ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>

                      {/* View Action */}
                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className="inline-flex items-center gap-1 p-2 rounded-xl text-gray-500 hover:text-[#4DA3FF] hover:bg-[#EAF6FF] transition-colors"
                          title="View Order Details"
                        >
                          <Eye className="w-4 h-4" />
                          <span className="text-xs font-semibold">View</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl border border-gray-200 animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#4DA3FF]">
                  Order Overview
                </span>
                <h3 className="text-xl font-extrabold text-[#1F2937] font-mono">
                  {selectedOrder.order_number}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer & Shipping Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-gray-50/80 border border-gray-100 space-y-1.5">
                <span className="font-bold text-[#1F2937] uppercase text-[10px] tracking-wider block text-gray-400">
                  Customer & Shipping
                </span>
                <p className="font-bold text-sm text-[#1F2937]">
                  {selectedOrder.shipping_address?.fullName || selectedOrder.customer_name}
                </p>
                <p className="text-gray-600">{selectedOrder.shipping_address?.addressLine1}</p>
                {selectedOrder.shipping_address?.addressLine2 && (
                  <p className="text-gray-600">{selectedOrder.shipping_address.addressLine2}</p>
                )}
                <p className="text-gray-600 font-medium">
                  {selectedOrder.shipping_address?.city}, {selectedOrder.shipping_address?.state} -{' '}
                  {selectedOrder.shipping_address?.pincode}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50/80 border border-gray-100 space-y-2">
                <span className="font-bold text-[#1F2937] uppercase text-[10px] tracking-wider block text-gray-400">
                  Contact Information
                </span>
                <p className="flex items-center gap-2 text-gray-700">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>{selectedOrder.customer_email}</span>
                </p>
                <p className="flex items-center gap-2 text-gray-700">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{selectedOrder.customer_phone}</span>
                </p>
                <p className="flex items-center gap-2 text-gray-500 pt-1 text-[11px]">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  <span>
                    {selectedOrder.created_at
                      ? new Date(selectedOrder.created_at).toLocaleString('en-IN')
                      : '—'}
                  </span>
                </p>
              </div>
            </div>

            {/* Line Items */}
            <div className="space-y-3">
              <span className="font-bold text-[#1F2937] text-xs uppercase tracking-wider block">
                Purchased Items ({selectedOrder.items?.length || 0})
              </span>
              <div className="border border-gray-200/80 rounded-2xl divide-y divide-gray-100 overflow-hidden">
                {selectedOrder.items && selectedOrder.items.length > 0 ? (
                  selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="p-3.5 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <span className="font-bold text-[#1F2937] block">{item.product_name}</span>
                        <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-0.5">
                          <span>Qty: {item.quantity}</span>
                          {item.selected_colour && <span>• Color: {item.selected_colour}</span>}
                          {item.selected_size && <span>• Size: {item.selected_size}</span>}
                        </div>
                      </div>
                      <span className="font-extrabold text-[#1F2937]">
                        ₹{item.total.toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-xs text-gray-400">No item details recorded</div>
                )}
              </div>
            </div>

            {/* Price Summary */}
            <div className="space-y-1.5 text-xs text-gray-600 border-t border-gray-100 pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-[#1F2937]">
                  ₹{selectedOrder.subtotal.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-semibold text-[#1F2937]">
                  ₹{selectedOrder.shipping.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-[#1F2937] pt-2 border-t border-gray-100">
                <span>Total Amount</span>
                <span>₹{selectedOrder.total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
