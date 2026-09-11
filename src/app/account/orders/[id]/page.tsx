'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Package,
  Clock,
  Mail,
  Phone,
  Loader2,
  AlertCircle,
  ShoppingBag,
} from 'lucide-react';
import { fetchOrderById } from '@/lib/api/orders';
import { fetchStoreSettings } from '@/lib/api/settings';
import { sanitizeWaPhone } from '@/lib/utils/phone';
import { UpiPaymentCards, PaymentConfirmedCard } from '@/components/payment/UpiPaymentCards';
import { useAuthStore } from '@/store/useAuthStore';
import { Order, OrderStatus, PaymentStatus } from '@/types/order';
import { StoreSettings } from '@/types/settings';

// ── Badge maps (matching account/page.tsx and admin/orders/page.tsx) ──────────

const ORDER_STATUS_BADGES: Record<OrderStatus, { label: string; bg: string; text: string; border: string }> = {
  pending:    { label: 'Pending',    bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200' },
  confirmed:  { label: 'Confirmed',  bg: 'bg-cyan-50',    text: 'text-cyan-700',    border: 'border-cyan-200' },
  processing: { label: 'Processing', bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-200' },
  shipped:    { label: 'Shipped',    bg: 'bg-purple-50',  text: 'text-purple-700',  border: 'border-purple-200' },
  delivered:  { label: 'Delivered',  bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  cancelled:  { label: 'Cancelled',  bg: 'bg-red-50',     text: 'text-red-700',     border: 'border-red-200' },
};

const PAYMENT_STATUS_BADGES: Record<PaymentStatus, { label: string; bg: string; text: string; border: string }> = {
  unpaid:   { label: 'Unpaid',    bg: 'bg-red-50',     text: 'text-red-700',     border: 'border-red-200' },
  pending:  { label: 'Pending',   bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200' },
  paid:     { label: 'Paid',      bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  failed:   { label: 'Failed',    bg: 'bg-red-50',     text: 'text-red-700',     border: 'border-red-200' },
  refunded: { label: 'Refunded',  bg: 'bg-gray-50',    text: 'text-gray-700',    border: 'border-gray-200' },
};

// ─────────────────────────────────────────────────────────────────────────────

export default function OrderDetailPage() {
  const params   = useParams();
  const router   = useRouter();
  const orderId  = typeof params.id === 'string' ? params.id : '';

  const user      = useAuthStore((state) => state.user);
  const isAuthLoading = useAuthStore((state) => state.isLoading);

  const [order,     setOrder]     = useState<Order | null>(null);
  const [settings,  setSettings]  = useState<StoreSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error,     setError]     = useState<string | null>(null);

  // Auth guard — redirect to login if no session
  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push(`/login?redirect=/account/orders/${orderId}`);
    }
  }, [isAuthLoading, user, orderId, router]);

  // Fetch order + settings in parallel
  useEffect(() => {
    if (!orderId || !user) return;

    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const [orderData, settingsData] = await Promise.all([
          fetchOrderById(orderId),
          fetchStoreSettings().catch(() => null),
        ]);
        setOrder(orderData);
        if (settingsData) setSettings(settingsData);
      } catch (err: any) {
        setError(err?.message || 'Could not load order details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [orderId, user]);

  // ── Loading state ───────────────────────────────────────────────────────────
  if (isAuthLoading || (isLoading && !error)) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF6B8B] mx-auto" />
        <p className="text-xs text-[#718096] font-medium">Loading order details...</p>
      </div>
    );
  }

  // ── Error state ─────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mx-auto">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h2 className="text-base font-extrabold text-[#2D3748]">Could Not Load Order</h2>
        <p className="text-xs text-[#718096] max-w-sm mx-auto font-medium">{error}</p>
        <Link
          href="/account"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#FF6B8B] hover:bg-[#FA5578] text-white text-xs font-extrabold transition-all shadow-cute-pink"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to My Orders</span>
        </Link>
      </div>
    );
  }

  if (!order) return null;

  // ── Derived values ──────────────────────────────────────────────────────────
  const isUpiWhatsapp = order.payment_method === 'upi_whatsapp';
  const isPaid        = order.payment_status === 'paid';

  const orderTotal     = order.total ?? 0;
  const formattedTotal = orderTotal ? `₹${orderTotal.toLocaleString('en-IN')}` : '';

  const resolvedUpiId = settings?.upi_id || '';
  const rawWaPhone    = settings?.whatsapp_number || settings?.contact_phone || '919876543210';
  const phoneForWa    = sanitizeWaPhone(rawWaPhone);

  const orderBadge   = ORDER_STATUS_BADGES[order.order_status]   || ORDER_STATUS_BADGES.pending;
  const paymentBadge = PAYMENT_STATUS_BADGES[order.payment_status] || PAYMENT_STATUS_BADGES.pending;

  const displayOrderNumber = order.order_number || `#${orderId.slice(0, 8)}`;

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-5 sm:space-y-7">

      {/* ── Back nav ── */}
      <Link
        href="/account"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#718096] hover:text-[#FF6B8B] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to My Orders</span>
      </Link>

      {/* ── Order header ── */}
      <div className="bg-white px-5 py-5 sm:p-8 rounded-3xl border border-[#EFE7DE] shadow-cute space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-base sm:text-lg font-extrabold text-[#FF6B8B]">
                #{displayOrderNumber.replace(/^#/, '')}
              </span>
              <span className={`px-3 py-0.5 rounded-full text-[10px] font-bold uppercase border ${orderBadge.bg} ${orderBadge.text} ${orderBadge.border}`}>
                {orderBadge.label}
              </span>
              <span className={`px-3 py-0.5 rounded-full text-[10px] font-bold uppercase border ${paymentBadge.bg} ${paymentBadge.text} ${paymentBadge.border}`}>
                {paymentBadge.label}
              </span>
            </div>
            <p className="text-[11px] text-[#A0AEC0] font-medium">
              Placed on{' '}
              {order.created_at
                ? new Date(order.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'long', year: 'numeric',
                    hour: '2-digit', minute: '2-digit',
                  })
                : 'Recently'}
            </p>
          </div>
          <div className="text-right shrink-0">
            <span className="text-xl font-extrabold text-[#2D3748] block">{formattedTotal}</span>
            <span className="text-[10px] text-[#A0AEC0] font-medium capitalize">
              {order.payment_method === 'upi_whatsapp' ? 'Pay via UPI' : order.payment_method || 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* ── Payment section — UPI WhatsApp orders only ── */}
      {isUpiWhatsapp && (
        isPaid ? (
          <PaymentConfirmedCard formattedTotal={formattedTotal} />
        ) : (
          <UpiPaymentCards
            orderNumber={displayOrderNumber}
            orderTotal={orderTotal}
            upiId={resolvedUpiId}
            rawWaPhone={phoneForWa}
          />
        )
      )}

      {/* ── Order items ── */}
      <div className="bg-white p-5 sm:p-8 rounded-3xl border border-[#EFE7DE] shadow-cute space-y-5">
        <h2 className="text-xs font-extrabold text-[#2D3748] uppercase tracking-wider flex items-center gap-2 border-b border-[#EFE7DE] pb-3">
          <Package className="w-4 h-4 text-[#FF6B8B]" />
          <span>Items Ordered</span>
        </h2>

        {order.items && order.items.length > 0 ? (
          <div className="space-y-2.5">
            <div className="divide-y divide-[#EFE7DE] border-t border-b border-[#EFE7DE]">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between text-xs font-medium">
                  <div className="space-y-0.5">
                    <span className="font-bold text-[#2D3748] block">{item.product_name}</span>
                    <div className="flex items-center gap-2 text-[11px] text-[#A0AEC0]">
                      <span>Qty: {item.quantity} × ₹{item.purchase_price.toLocaleString('en-IN')}</span>
                      {item.selected_colour && <span>· Color: {item.selected_colour}</span>}
                      {item.selected_size   && <span>· Size: {item.selected_size}</span>}
                    </div>
                  </div>
                  <span className="font-extrabold text-[#2D3748] shrink-0">
                    ₹{item.total.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-1.5 pt-1 text-xs">
              {order.subtotal != null && (
                <div className="flex justify-between text-[#718096]">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#2D3748]">₹{order.subtotal.toLocaleString('en-IN')}</span>
                </div>
              )}
              {order.shipping != null && (
                <div className="flex justify-between text-[#718096]">
                  <span>Delivery</span>
                  <span className="font-bold text-[#2D3748]">
                    {order.shipping === 0 ? 'FREE' : `₹${order.shipping.toLocaleString('en-IN')}`}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-baseline border-t border-[#EFE7DE] pt-2 mt-1">
                <span className="text-sm font-extrabold text-[#2D3748]">Total</span>
                <span className="text-xl font-extrabold text-[#2D3748]">{formattedTotal}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-6 text-center space-y-2">
            <ShoppingBag className="w-8 h-8 text-[#CBD5E0] mx-auto" />
            <p className="text-xs text-[#A0AEC0] font-medium">Item details not available</p>
          </div>
        )}
      </div>

      {/* ── Shipping & Contact ── */}
      <div className="bg-white p-5 sm:p-8 rounded-3xl border border-[#EFE7DE] shadow-cute space-y-4">
        <h2 className="text-xs font-extrabold text-[#2D3748] uppercase tracking-wider border-b border-[#EFE7DE] pb-3">
          Delivery Information
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#718096]">
          <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EFE7DE] space-y-1 font-medium">
            <span className="font-bold text-[#2D3748] block">Delivery Address</span>
            <p className="font-extrabold text-[#2D3748]">
              {order.shipping_address?.fullName || order.customer_name}
            </p>
            <p>{order.shipping_address?.addressLine1}</p>
            {order.shipping_address?.addressLine2 && <p>{order.shipping_address.addressLine2}</p>}
            <p>
              {order.shipping_address?.city}, {order.shipping_address?.state} —{' '}
              {order.shipping_address?.pincode}
            </p>
            {order.shipping_address?.landmark && (
              <p className="text-[#A0AEC0]">Landmark: {order.shipping_address.landmark}</p>
            )}
          </div>
          <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EFE7DE] space-y-1 font-medium">
            <span className="font-bold text-[#2D3748] block">Contact</span>
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
      </div>

      {/* ── Navigation ── */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pb-2">
        <Link
          href="/account"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-white hover:bg-[#FAF7F2] text-[#2D3748] text-xs sm:text-sm font-bold border border-[#EFE7DE] transition-all shadow-cute active:scale-98"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Orders</span>
        </Link>
        <Link
          href="/products"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#FF6B8B] hover:bg-[#FA5578] text-white text-xs sm:text-sm font-extrabold transition-all shadow-cute-pink active:scale-98"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Continue Shopping</span>
        </Link>
      </div>
    </div>
  );
}
