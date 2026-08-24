'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  CheckCircle2,
  Package,
  ArrowRight,
  Clock,
  MapPin,
  Phone,
  Mail,
  ShoppingBag,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { getOrderDetails } from '@/lib/supabase/orders';
import { Order } from '@/types/order';

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order_number') || '';
  const orderId = searchParams.get('order_id') || '';

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (orderId || orderNumber) {
        setIsLoading(true);
        try {
          const data = await getOrderDetails(orderId || orderNumber);
          setOrder(data);
        } catch (err) {
          console.error('Failed to load order details:', err);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    }
    load();
  }, [orderId, orderNumber]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      {/* Top Banner */}
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-gray-200/80 shadow-xs text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-2xs animate-in zoom-in-75">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-[#4DA3FF]">
            Order Received
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] tracking-tight">
            Thank You For Your Order!
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
            Your pending order has been recorded. We will notify you once fulfillment begins.
          </p>
        </div>

        {/* Order Number Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-mono font-bold text-[#1F2937]">
          <span>Order Number:</span>
          <span className="text-[#4DA3FF]">{orderNumber || order?.order_number || 'ORD-PENDING'}</span>
        </div>
      </div>

      {/* Order Snapshot & Delivery Details */}
      {order && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <h2 className="text-sm font-bold text-[#1F2937] uppercase tracking-wider flex items-center gap-2">
              <Package className="w-4 h-4 text-[#4DA3FF]" />
              <span>Order Details</span>
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 capitalize flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{order.order_status}</span>
            </span>
          </div>

          {/* Shipping Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-600">
            <div className="p-4 rounded-2xl bg-gray-50/70 border border-gray-100 space-y-1.5">
              <span className="font-bold text-[#1F2937] block">Delivery Address:</span>
              <p className="font-medium text-[#1F2937]">{order.shipping_address?.fullName || order.customer_name}</p>
              <p>{order.shipping_address?.addressLine1}</p>
              {order.shipping_address?.addressLine2 && <p>{order.shipping_address.addressLine2}</p>}
              <p>
                {order.shipping_address?.city}, {order.shipping_address?.state} - {order.shipping_address?.pincode}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50/70 border border-gray-100 space-y-1.5">
              <span className="font-bold text-[#1F2937] block">Contact Details:</span>
              <p className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-gray-400" />
                <span>{order.customer_email}</span>
              </p>
              <p className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-gray-400" />
                <span>{order.customer_phone}</span>
              </p>
            </div>
          </div>

          {/* Items Purchased */}
          {order.items && order.items.length > 0 && (
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                Items ({order.items.length})
              </span>
              <div className="divide-y divide-gray-100 border-t border-b border-gray-100">
                {order.items.map((item, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-[#1F2937] block">{item.product_name}</span>
                      <span className="text-[10px] text-gray-400">
                        Qty: {item.quantity} × ₹{item.purchase_price.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <span className="font-bold text-[#1F2937]">
                      ₹{item.total.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total Row */}
              <div className="flex justify-between items-baseline pt-2">
                <span className="text-sm font-bold text-[#1F2937]">Grand Total Paid/Pending:</span>
                <span className="text-lg font-extrabold text-[#1F2937]">
                  ₹{order.total.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Navigation actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
        <Link
          href="/products"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#4DA3FF] hover:bg-[#2B8BE6] text-white text-xs sm:text-sm font-bold transition-all shadow-xs"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Continue Shopping</span>
        </Link>
        <Link
          href="/account"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-gray-50 text-gray-700 text-xs sm:text-sm font-semibold border border-gray-200 transition-all shadow-xs"
        >
          <span>View in My Account</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="p-16 text-center text-xs text-gray-500">Loading order summary...</div>}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
