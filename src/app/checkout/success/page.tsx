'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  CheckCircle2,
  Package,
  ArrowRight,
  Clock,
  Phone,
  Mail,
  ShoppingBag,
  Loader2,
} from 'lucide-react';
import { fetchOrderById } from '@/lib/api/orders';
import { fetchStoreSettings } from '@/lib/api/settings';
import { sanitizeWaPhone } from '@/lib/utils/phone';
import { UpiPaymentCards, PaymentConfirmedCard } from '@/components/payment/UpiPaymentCards';
import { Order } from '@/types/order';
import { StoreSettings } from '@/types/settings';

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber  = searchParams.get('order_number') || '';
  const orderId      = searchParams.get('order_id')     || '';
  const methodParam  = searchParams.get('method')       || '';
  // wa_phone and upi_id may be passed from checkout page as a convenience
  // shortcut, but the page always re-fetches settings so they are optional.
  const waPhoneParam = searchParams.get('wa_phone') || '';
  const upiIdParam   = searchParams.get('upi_id')   || '';

  const [order,     setOrder]     = useState<Order | null>(null);
  const [settings,  setSettings]  = useState<StoreSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const targetId = orderId || orderNumber;
      try {
        const [orderData, settingsData] = await Promise.all([
          targetId ? fetchOrderById(targetId).catch(() => null) : Promise.resolve(null),
          fetchStoreSettings().catch(() => null),
        ]);
        if (orderData)    setOrder(orderData);
        if (settingsData) setSettings(settingsData);
      } catch (err) {
        console.error('Failed to load order/settings details:', err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [orderId, orderNumber]);

  const isUpiWhatsapp = methodParam === 'upi_whatsapp' || order?.payment_method === 'upi_whatsapp';
  const isPaid        = order?.payment_status === 'paid';

  const displayOrderNumber = orderNumber || order?.order_number || (orderId ? `#${orderId.slice(0, 8)}` : 'ORD-PENDING');
  const displayOrderNumberFormatted = displayOrderNumber.startsWith('#') ? displayOrderNumber : `#${displayOrderNumber}`;

  const orderTotal     = order?.total ?? 0;
  const formattedTotal = orderTotal ? `₹${orderTotal.toLocaleString('en-IN')}` : '';

  // URL params are a convenience shortcut from checkout page; settings fetch
  // is the authoritative source so either path works correctly.
  const resolvedUpiId  = upiIdParam  || settings?.upi_id           || '';
  const rawWaPhone     = waPhoneParam || settings?.whatsapp_number  || settings?.contact_phone || (!isLoading ? '919876543210' : '');
  const phoneForWa     = sanitizeWaPhone(rawWaPhone);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-5 sm:space-y-7">

      {/* ── Top Banner ── */}
      <div className="bg-white px-5 py-5 sm:p-8 rounded-3xl border border-[#EFE7DE] shadow-cute text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-[#D1FAE5] text-[#059669] flex items-center justify-center mx-auto shadow-2xs animate-in zoom-in-75">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF6B8B]">Order Placed ✨</span>
          <h1 className="text-xl sm:text-3xl font-extrabold text-[#2D3748] tracking-tight leading-tight">
            Thank You For Your Order! 🎉
          </h1>
          {isUpiWhatsapp && !isPaid && (
            <p className="text-[11px] sm:text-sm text-[#718096] font-medium">
              Choose how you&apos;d like to complete payment below.
            </p>
          )}
          {(!isUpiWhatsapp || isPaid) && (
            <p className="text-[11px] sm:text-sm text-[#718096] font-medium">
              {isPaid
                ? 'Your payment has been confirmed. We are getting your order ready!'
                : 'Your order has been recorded. We will notify you once fulfillment begins.'}
            </p>
          )}
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FAF7F2] border border-[#EFE7DE] text-xs font-mono font-bold text-[#2D3748]">
          <span>Order:</span>
          <span className="text-[#FF6B8B]">{displayOrderNumberFormatted}</span>
          {formattedTotal && (
            <>
              <span className="text-[#CBD5E0]">·</span>
              <span className="text-emerald-700">{formattedTotal}</span>
            </>
          )}
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

      {/* ── Order Details card ── */}
      {order && (
        <div className="bg-white p-5 sm:p-8 rounded-3xl border border-[#EFE7DE] shadow-cute space-y-5">
          <div className="flex items-center justify-between border-b border-[#EFE7DE] pb-3">
            <h2 className="text-xs font-extrabold text-[#2D3748] uppercase tracking-wider flex items-center gap-2">
              <Package className="w-4 h-4 text-[#FF6B8B]" />
              <span>Order Details</span>
            </h2>
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A] capitalize flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{order.order_status}</span>
            </span>
          </div>

          {/* Payment status pill */}
          {isUpiWhatsapp ? (
            isPaid ? (
              <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 flex flex-wrap items-center justify-between gap-2 text-xs font-medium">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  <span className="font-bold text-emerald-900">Payment Confirmed</span>
                </div>
                <span className="text-emerald-700 font-extrabold">Paid · {formattedTotal}</span>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 flex flex-wrap items-center justify-between gap-2 text-xs font-medium">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
                  <span className="font-bold text-amber-900">Pay via UPI</span>
                </div>
                <span className="text-amber-700 font-extrabold">Awaiting Payment · {formattedTotal}</span>
              </div>
            )
          ) : (
            <div className="p-3 rounded-xl bg-[#D1FAE5]/60 border border-[#A7F3D0] flex flex-wrap items-center justify-between gap-2 text-xs font-medium">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse shrink-0" />
                <span className="font-bold text-[#065F46]">Cash on Delivery (COD)</span>
              </div>
              <span className="text-[#059669] font-extrabold">Pay {formattedTotal} on delivery</span>
            </div>
          )}

          {/* Shipping + Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#718096]">
            <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EFE7DE] space-y-1 font-medium">
              <span className="font-bold text-[#2D3748] block">Delivery Address</span>
              <p className="font-extrabold text-[#2D3748]">{order.shipping_address?.fullName || order.customer_name}</p>
              <p>{order.shipping_address?.addressLine1}</p>
              {order.shipping_address?.addressLine2 && <p>{order.shipping_address.addressLine2}</p>}
              <p>{order.shipping_address?.city}, {order.shipping_address?.state} — {order.shipping_address?.pincode}</p>
            </div>
            <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EFE7DE] space-y-1 font-medium">
              <span className="font-bold text-[#2D3748] block">Contact</span>
              <p className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-[#A0AEC0]" /><span>{order.customer_email}</span></p>
              <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-[#A0AEC0]" /><span>{order.customer_phone}</span></p>
            </div>
          </div>

          {/* Items */}
          {order.items && order.items.length > 0 && (
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-[#718096] uppercase tracking-wider block">
                Items ({order.items.length})
              </span>
              <div className="divide-y divide-[#EFE7DE] border-t border-b border-[#EFE7DE]">
                {order.items.map((item, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between text-xs font-medium">
                    <div>
                      <span className="font-bold text-[#2D3748] block">{item.product_name}</span>
                      <span className="text-[10px] text-[#A0AEC0]">
                        Qty: {item.quantity} × ₹{item.purchase_price.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <span className="font-extrabold text-[#2D3748]">₹{item.total.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-baseline pt-1">
                <span className="text-sm font-bold text-[#2D3748]">
                  {isUpiWhatsapp && !isPaid ? 'Total Payable:' : isUpiWhatsapp ? 'Total Paid:' : 'Total Due on Delivery:'}
                </span>
                <span className="text-xl font-extrabold text-[#2D3748]">{formattedTotal}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Navigation ── */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pb-2">
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
    <Suspense
      fallback={
        <div className="p-16 text-center text-xs text-gray-500">
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#FF6B8B] mb-2" />
          <span>Loading order confirmation...</span>
        </div>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
}
