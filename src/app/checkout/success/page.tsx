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
  ExternalLink,
  Loader2,
  MessageCircle,
  Copy,
  Check,
  Smartphone,
  AlertCircle,
} from 'lucide-react';
import { fetchOrderById } from '@/lib/api/orders';
import { fetchStoreSettings } from '@/lib/api/settings';
import { Order } from '@/types/order';
import { StoreSettings } from '@/types/settings';

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber   = searchParams.get('order_number') || '';
  const orderId       = searchParams.get('order_id')     || '';
  const methodParam   = searchParams.get('method')       || '';
  const waPhoneParam  = searchParams.get('wa_phone')     || '';
  const upiIdParam    = searchParams.get('upi_id')       || '';

  const [order,     setOrder]     = useState<Order | null>(null);
  const [settings,  setSettings]  = useState<StoreSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [upiCopied, setUpiCopied] = useState(false);

  useEffect(() => {
    async function load() {
      const targetId = orderId || orderNumber;
      try {
        const [orderData, settingsData] = await Promise.all([
          targetId ? fetchOrderById(targetId).catch(() => null) : Promise.resolve(null),
          fetchStoreSettings().catch(() => null),
        ]);
        if (orderData)   setOrder(orderData);
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

  const orderTotal    = order?.total ?? 0;
  const formattedTotal = orderTotal ? `₹${orderTotal.toLocaleString('en-IN')}` : '';

  const resolvedUpiId = upiIdParam || settings?.upi_id || '';

  const rawWaNumber   = waPhoneParam || settings?.whatsapp_number || settings?.contact_phone || (!isLoading ? '919876543210' : '');
  const cleanDigits   = rawWaNumber.replace(/\D/g, '');
  const phoneForWa    = cleanDigits.length === 10 ? `91${cleanDigits}` : cleanDigits;

  const upiDeepLink = resolvedUpiId
    ? `upi://pay?pa=${encodeURIComponent(resolvedUpiId)}&pn=${encodeURIComponent('Baby Ladoo')}&am=${encodeURIComponent(orderTotal)}&cu=INR&tn=${encodeURIComponent(`Order ${displayOrderNumber}`)}`
    : '';

  // Card A — WhatsApp confirm after paying on-site
  const waAfterPayMessage = `Hi Baby Ladoo! I've paid ${formattedTotal} for order ${displayOrderNumberFormatted}. Please confirm and process my order.`;
  const waAfterPayUrl = phoneForWa ? `https://wa.me/${phoneForWa}?text=${encodeURIComponent(waAfterPayMessage)}` : '#';

  // Card B — Chat & pay via WhatsApp directly
  const waChatMessage = `Hi Baby Ladoo! I'd like to pay for order ${displayOrderNumberFormatted}${formattedTotal ? ` (${formattedTotal})` : ''} via WhatsApp.`;
  const waChatUrl = phoneForWa ? `https://wa.me/${phoneForWa}?text=${encodeURIComponent(waChatMessage)}` : '#';

  const handleCopyUpiId = async () => {
    if (!resolvedUpiId) return;
    try {
      await navigator.clipboard.writeText(resolvedUpiId);
    } catch {
      const el = document.createElement('input');
      el.value = resolvedUpiId;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setUpiCopied(true);
    setTimeout(() => setUpiCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-5 sm:space-y-7">

      {/* ── Top Banner ── compact on mobile ── */}
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

      {/* ── Payment Options — UPI WhatsApp orders only ── */}
      {isUpiWhatsapp && (
        <>
          {isPaid ? (
            /* ── PAID STATE: replace both cards with single confirmation ── */
            <div className="bg-gradient-to-br from-emerald-50 via-white to-emerald-50/40 p-6 sm:p-8 rounded-3xl border-2 border-emerald-400 shadow-md space-y-2.5 text-center">
              <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-base font-extrabold text-[#1F2937]">Payment Confirmed ✓</h2>
              <p className="text-xs text-emerald-800 font-medium max-w-sm mx-auto">
                We have received your payment of <strong>{formattedTotal}</strong>. Your order is now being processed.
              </p>
            </div>
          ) : (
            /* ── PENDING: two equal-prominence option cards ── */
            <div className="space-y-3">
              <p className="text-[11px] font-bold text-[#718096] uppercase tracking-wider text-center">
                Complete Payment — Choose Your Preferred Method
              </p>

              {/* 2-column on sm+, stacked on mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                {/* ── CARD A: Pay Here, Then Confirm ── */}
                <div className="bg-gradient-to-b from-emerald-50 to-white rounded-2xl border-2 border-emerald-300 p-4 flex flex-col gap-3">
                  {/* Header */}
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-[#1F2937] leading-tight">Pay Here, Then Confirm</p>
                      <p className="text-[10px] text-emerald-700 font-medium">GPay / PhonePe / Paytm</p>
                    </div>
                  </div>

                  {/* UPI ID row */}
                  {resolvedUpiId ? (
                    <div className="flex items-center gap-2 bg-white rounded-xl border border-emerald-200 px-3 py-2">
                      <span className="font-mono text-xs font-extrabold text-[#1F2937] flex-1 min-w-0 truncate">
                        {resolvedUpiId}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyUpiId}
                        aria-label="Copy UPI ID"
                        className={`shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-extrabold transition-all active:scale-95 ${
                          upiCopied
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        }`}
                      >
                        {upiCopied
                          ? <><Check className="w-3 h-3" /><span>Copied!</span></>
                          : <><Copy className="w-3 h-3" /><span>Copy</span></>
                        }
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <p className="text-[10px] text-amber-800 font-medium">UPI ID not set — use Card B to pay via WhatsApp.</p>
                    </div>
                  )}

                  {/* Pay Now button */}
                  {resolvedUpiId && (
                    <a
                      href={upiDeepLink}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-sm transition-all active:scale-98"
                    >
                      <Smartphone className="w-3.5 h-3.5 shrink-0" />
                      <span>Pay Now with UPI App</span>
                      <ExternalLink className="w-3 h-3 shrink-0 opacity-75" />
                    </a>
                  )}

                  {/* Divider + WhatsApp confirm (self-contained in Card A) */}
                  <div className="border-t border-emerald-100 pt-2.5 space-y-1.5">
                    <p className="text-[10px] text-gray-400 font-medium text-center">After paying, tap to confirm ↓</p>
                    <a
                      href={waAfterPayUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-700 text-[11px] font-extrabold border border-emerald-300 transition-all active:scale-98"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-[#25D366] shrink-0" />
                      <span>Confirm Payment on WhatsApp</span>
                      <ExternalLink className="w-3 h-3 shrink-0 opacity-50" />
                    </a>
                  </div>
                </div>

                {/* ── CARD B: Chat & Pay on WhatsApp ── */}
                <div className="bg-gradient-to-b from-[#f0fdf4] to-white rounded-2xl border-2 border-[#86efac] p-4 flex flex-col gap-3">
                  {/* Header */}
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#25D366] text-white flex items-center justify-center shrink-0">
                      <MessageCircle className="w-4 h-4 fill-white" />
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-[#1F2937] leading-tight">Chat &amp; Pay on WhatsApp</p>
                      <p className="text-[10px] text-green-700 font-medium">We&apos;ll help you complete payment</p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-[11px] text-[#718096] font-medium leading-relaxed">
                    Prefer to chat? Message us on WhatsApp — we&apos;ll share payment details and confirm your order personally.
                  </p>

                  {/* Spacer to push button to bottom so cards match height on desktop */}
                  <div className="flex-1" />

                  {/* WhatsApp CTA */}
                  <a
                    href={waChatUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-extrabold shadow-sm transition-all active:scale-98"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-white shrink-0" />
                    <span>Open WhatsApp to Pay</span>
                    <ExternalLink className="w-3 h-3 shrink-0 opacity-75" />
                  </a>

                  {/* Bottom spacer so Card B footer aligns with Card A */}
                  <div className="border-t border-green-100 pt-2.5">
                    <p className="text-[10px] text-gray-400 text-center font-medium">
                      Pre-filled with your order number &amp; amount
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
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
