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

import { CuteTeddyLogo, HotAirBalloonIllustration } from '@/components/common/CartoonIllustrations';

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
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#EFE7DE] shadow-cute text-center space-y-4 relative overflow-hidden">
        <div className="w-16 h-16 rounded-3xl bg-[#D1FAE5] text-[#059669] flex items-center justify-center mx-auto shadow-2xs animate-in zoom-in-75">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B8B]">
            Order Received ✨
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2D3748] tracking-tight">
            Thank You For Your Order! 🎉
          </h1>
          <p className="text-xs sm:text-sm text-[#718096] max-w-md mx-auto font-medium">
            Your Baby Ladoo order has been recorded. We will notify you once fulfillment begins.
          </p>
        </div>

        {/* Order Number Pill */}
        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FAF7F2] border border-[#EFE7DE] text-xs font-mono font-bold text-[#2D3748]">
          <span>Order Number:</span>
          <span className="text-[#FF6B8B]">{orderNumber || order?.order_number || 'ORD-PENDING'}</span>
        </div>
      </div>

      {/* Order Snapshot & Delivery Details */}
      {order && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EFE7DE] shadow-cute space-y-6">
          <div className="flex items-center justify-between border-b border-[#EFE7DE] pb-4">
            <h2 className="text-xs font-extrabold text-[#2D3748] uppercase tracking-wider flex items-center gap-2">
              <Package className="w-4 h-4 text-[#FF6B8B]" />
              <span>Order Details</span>
            </h2>
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A] capitalize flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{order.order_status}</span>
            </span>
          </div>

          {/* Payment Method Notice */}
          <div className="p-4 rounded-2xl bg-[#D1FAE5]/60 border border-[#A7F3D0] flex items-center justify-between text-xs font-medium">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <span className="font-bold text-[#065F46]">Payment Method: Cash on Delivery (COD)</span>
            </div>
            <span className="text-[#059669] font-extrabold">Pay ₹{order.total.toLocaleString('en-IN')} upon delivery</span>
          </div>

          {/* Shipping Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#718096]">
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EFE7DE] space-y-1.5 font-medium">
              <span className="font-bold text-[#2D3748] block">Delivery Address:</span>
              <p className="font-extrabold text-[#2D3748]">{order.shipping_address?.fullName || order.customer_name}</p>
              <p>{order.shipping_address?.addressLine1}</p>
              {order.shipping_address?.addressLine2 && <p>{order.shipping_address.addressLine2}</p>}
              <p>
                {order.shipping_address?.city}, {order.shipping_address?.state} - {order.shipping_address?.pincode}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EFE7DE] space-y-1.5 font-medium">
              <span className="font-bold text-[#2D3748] block">Contact Details:</span>
              <p className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#A0AEC0]" />
                <span>{order.customer_email}</span>
              </p>
              <p className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#A0AEC0]" />
                <span>{order.customer_phone}</span>
              </p>
            </div>
          </div>

          {/* Items Purchased */}
          {order.items && order.items.length > 0 && (
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold text-[#718096] uppercase tracking-wider block">
                Items ({order.items.length})
              </span>
              <div className="divide-y divide-[#EFE7DE] border-t border-b border-[#EFE7DE]">
                {order.items.map((item, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between text-xs font-medium">
                    <div>
                      <span className="font-bold text-[#2D3748] block">{item.product_name}</span>
                      <span className="text-[10px] text-[#A0AEC0]">
                        Qty: {item.quantity} × ₹{item.purchase_price.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <span className="font-extrabold text-[#2D3748]">
                      ₹{item.total.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total Row */}
              <div className="flex justify-between items-baseline pt-2">
                <span className="text-sm font-bold text-[#2D3748]">Total Amount Due on Delivery:</span>
                <span className="text-xl font-extrabold text-[#2D3748]">
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
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#FF6B8B] hover:bg-[#FA5578] text-white text-xs sm:text-sm font-extrabold transition-all shadow-cute-pink active:scale-98"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Continue Shopping</span>
        </Link>
        <Link
          href="/account"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-white hover:bg-[#FAF7F2] text-[#2D3748] text-xs sm:text-sm font-bold border border-[#EFE7DE] transition-all shadow-cute active:scale-98"
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
