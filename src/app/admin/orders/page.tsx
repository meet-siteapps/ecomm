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
  Package
} from 'lucide-react';
import { Order, OrderStatus } from '@/types/order';
import { getAllOrdersAdmin, updateOrderStatus } from '@/lib/supabase/orders';

const STATUS_BADGES: Record<OrderStatus, { label: string; bg: string; text: string; border: string }> = {
  pending: { label: 'Pending', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  processing: { label: 'Processing', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  shipped: { label: 'Shipped', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  delivered: { label: 'Delivered', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  cancelled: { label: 'Cancelled', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const data = await getAllOrdersAdmin();
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
      await updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, order_status: newStatus } : o))
      );
      setFeedback({ type: 'success', message: `Order status updated to ${newStatus}.` });
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to update order status.' });
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
      if (!matchNum && !matchName && !matchEmail) return false;
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
            Track order fulfillment, payment status, and customer shipping details
          </p>
        </div>

        <button
          type="button"
          onClick={loadOrders}
          disabled={isLoading}
          className="self-start sm:self-auto p-2.5 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors shadow-2xs"
          title="Refresh orders"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
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
            placeholder="Search by order #, customer name, email..."
            className="w-full bg-gray-50 text-xs text-[#1F2937] placeholder-gray-400 rounded-xl pl-9 pr-3 py-2 border border-gray-200 focus:bg-white focus:border-[#4DA3FF] focus:outline-none"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="w-full sm:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-gray-50 text-xs text-[#1F2937] font-medium rounded-xl px-3 py-2 border border-gray-200 focus:bg-white focus:border-[#4DA3FF] focus:outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
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
                  <th className="px-5 py-3.5">Order</th>
                  <th className="px-4 py-3.5">Customer</th>
                  <th className="px-4 py-3.5">Items</th>
                  <th className="px-4 py-3.5">Total</th>
                  <th className="px-4 py-3.5">Payment</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((order) => {
                  const badge = STATUS_BADGES[order.order_status] || STATUS_BADGES.pending;

                  return (
                    <tr key={order.id} className="hover:bg-gray-50/70 transition-colors">
                      {/* Order Number */}
                      <td className="px-5 py-4 font-bold text-[#1F2937]">
                        <span className="font-mono text-xs text-[#4DA3FF] block">
                          {order.order_number}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {order.shipping_address?.city || ''}, {order.shipping_address?.state || ''}
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

                      {/* Line Items summary */}
                      <td className="px-4 py-4">
                        <span className="font-semibold text-gray-700 block">
                          {order.items?.length || 0} {order.items?.length === 1 ? 'item' : 'items'}
                        </span>
                        {order.items && order.items.length > 0 && (
                          <span className="text-[10px] text-gray-400 line-clamp-1">
                            {order.items.map((i) => `${i.product_name} (${i.quantity}x)`).join(', ')}
                          </span>
                        )}
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

                      {/* Payment Status */}
                      <td className="px-4 py-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                            order.payment_status === 'paid'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {order.payment_status}
                        </span>
                      </td>

                      {/* Order Status Selector */}
                      <td className="px-4 py-4">
                        <select
                          value={order.order_status}
                          disabled={updatingId === order.id}
                          onChange={(e) =>
                            handleStatusChange(order.id, e.target.value as OrderStatus)
                          }
                          className={`text-xs font-bold rounded-lg px-2.5 py-1 border cursor-pointer focus:outline-none ${badge.bg} ${badge.text} ${badge.border}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4 text-right text-gray-500 text-[11px]">
                        {order.created_at
                          ? new Date(order.created_at).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })
                          : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
