'use client';

/**
 * UpiPaymentCards
 *
 * Shared component rendering the two equal-prominence payment option cards
 * for a pending upi_whatsapp order:
 *
 *   Card A — Pay Here, Then Confirm
 *     UPI ID display + Copy button, "Pay Now" UPI deep link, WhatsApp confirm
 *
 *   Card B — Chat & Pay on WhatsApp
 *     Opens WhatsApp with pre-filled "I'd like to pay" message
 *
 * Also exports <PaymentConfirmedCard> for the paid state.
 *
 * Used by:
 *   - src/app/checkout/success/page.tsx
 *   - src/app/account/orders/[id]/page.tsx
 */

import { useState } from 'react';
import {
  CheckCircle2,
  ExternalLink,
  MessageCircle,
  Copy,
  Check,
  Smartphone,
  AlertCircle,
} from 'lucide-react';
import { sanitizeWaPhone } from '@/lib/utils/phone';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UpiPaymentCardsProps {
  /** Formatted order number, e.g. "ORD-20240101-001" */
  orderNumber: string;
  /** Order total in rupees (numeric) */
  orderTotal: number;
  /** UPI ID from store settings, e.g. "babyladoo@upi". Empty string = not configured. */
  upiId: string;
  /** Raw WhatsApp phone number from store settings (will be sanitized internally) */
  rawWaPhone: string;
}

export interface PaymentConfirmedCardProps {
  formattedTotal: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatTotal(total: number): string {
  return total ? `₹${total.toLocaleString('en-IN')}` : '';
}

// ─── PaymentConfirmedCard ─────────────────────────────────────────────────────

export function PaymentConfirmedCard({ formattedTotal }: PaymentConfirmedCardProps) {
  return (
    <div className="bg-gradient-to-br from-emerald-50 via-white to-emerald-50/40 p-6 sm:p-8 rounded-3xl border-2 border-emerald-400 shadow-md space-y-2.5 text-center">
      <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
        <CheckCircle2 className="w-6 h-6" />
      </div>
      <h2 className="text-base font-extrabold text-[#1F2937]">Payment Confirmed ✓</h2>
      <p className="text-xs text-emerald-800 font-medium max-w-sm mx-auto">
        {formattedTotal
          ? <>We have received your payment of <strong>{formattedTotal}</strong>. Your order is now being processed.</>
          : <>We have received your payment. Your order is now being processed.</>}
      </p>
    </div>
  );
}

// ─── UpiPaymentCards ──────────────────────────────────────────────────────────

export function UpiPaymentCards({
  orderNumber,
  orderTotal,
  upiId,
  rawWaPhone,
}: UpiPaymentCardsProps) {
  const [upiCopied, setUpiCopied] = useState(false);

  const formattedTotal = formatTotal(orderTotal);

  // Sanitize phone number once, here — single source of truth
  const phoneForWa = sanitizeWaPhone(rawWaPhone);

  // Normalise order number display
  const orderNumberFormatted = orderNumber.startsWith('#') ? orderNumber : `#${orderNumber}`;

  // UPI deep link (Card A — Pay Now button)
  const upiDeepLink = upiId
    ? `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent('Baby Ladoo')}&am=${encodeURIComponent(orderTotal)}&cu=INR&tn=${encodeURIComponent(`Order ${orderNumber}`)}`
    : '';

  // Card A — WhatsApp confirm after paying on-site
  const waAfterPayMessage = `Hi Baby Ladoo! I've paid ${formattedTotal} for order ${orderNumberFormatted}. Please confirm and process my order.`;
  const waAfterPayUrl = phoneForWa
    ? `https://wa.me/${phoneForWa}?text=${encodeURIComponent(waAfterPayMessage)}`
    : '#';

  // Card B — Chat & pay directly via WhatsApp
  const waChatMessage = `Hi Baby Ladoo! I'd like to pay for order ${orderNumberFormatted}${formattedTotal ? ` (${formattedTotal})` : ''} via WhatsApp.`;
  const waChatUrl = phoneForWa
    ? `https://wa.me/${phoneForWa}?text=${encodeURIComponent(waChatMessage)}`
    : '#';

  const handleCopyUpiId = async () => {
    if (!upiId) return;
    try {
      await navigator.clipboard.writeText(upiId);
    } catch {
      const el = document.createElement('input');
      el.value = upiId;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setUpiCopied(true);
    setTimeout(() => setUpiCopied(false), 2000);
  };

  return (
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
          {upiId ? (
            <div className="flex items-center gap-2 bg-white rounded-xl border border-emerald-200 px-3 py-2">
              <span className="font-mono text-xs font-extrabold text-[#1F2937] flex-1 min-w-0 truncate">
                {upiId}
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
                {upiCopied ? (
                  <><Check className="w-3 h-3" /><span>Copied!</span></>
                ) : (
                  <><Copy className="w-3 h-3" /><span>Copy</span></>
                )}
              </button>
            </div>
          ) : (
            <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
              <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-[10px] text-amber-800 font-medium">
                UPI ID not set — use the WhatsApp option to pay.
              </p>
            </div>
          )}

          {/* Pay Now button */}
          {upiId && (
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
            Prefer to chat? Message us on WhatsApp — we&apos;ll share payment details and confirm your
            order personally.
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

          {/* Footer note */}
          <div className="border-t border-green-100 pt-2.5">
            <p className="text-[10px] text-gray-400 text-center font-medium">
              Pre-filled with your order number &amp; amount
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
