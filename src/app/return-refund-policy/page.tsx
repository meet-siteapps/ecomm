import { RotateCcw, ShieldCheck, CheckCircle2, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Return & Refund Policy | Baby Ladoo',
  description: 'Hassle-free 7-day return and exchange policy for Baby Ladoo products.',
};

export default function ReturnRefundPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <div className="text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-[#FDE8EB] text-[#F27A8A] flex items-center justify-center mx-auto shadow-2xs">
          <RotateCcw className="w-7 h-7" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#193653] tracking-tight">
          Return &amp; Refund Policy
        </h1>
        <p className="text-xs sm:text-sm text-[#5D7285] max-w-md mx-auto">
          We want you and your baby to be 100% happy with every purchase.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#EFE6DA] shadow-cute space-y-8 text-xs sm:text-sm text-[#5D7285] leading-relaxed">
        <div className="p-4 rounded-2xl bg-[#EFF7E9] border border-[#A8C98B]/30 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-[#729c50] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-extrabold text-[#193653] text-xs">7-Day Easy Returns &amp; Exchanges</h3>
            <p className="text-[11px] text-[#5D7285]">
              If you receive an incorrect size, defective product, or transit-damaged item, request a free exchange or return within 7 days of delivery.
            </p>
          </div>
        </div>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-extrabold text-[#193653] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#729c50]" />
            <span>Eligible for Return / Exchange</span>
          </h2>
          <ul className="list-disc pl-5 space-y-1 text-xs text-[#5D7285]">
            <li>Item is unworn, unwashed, and with all original tags attached.</li>
            <li>Original packaging is retained.</li>
            <li>Product manufacturing defects or incorrect items dispatched.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-extrabold text-[#193653] flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#D99A26]" />
            <span>Non-Returnable Items (Hygiene Policy)</span>
          </h2>
          <p>
            Due to strict baby hygiene guidelines, opened pacifiers, baby grooming tools, and used teethers cannot be returned once the seal is broken unless delivered damaged.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-extrabold text-[#193653]">Refund Timelines</h2>
          <p>
            Once our warehouse receives and inspects the returned parcel, refunds are processed within 2–4 business days back to your original payment method (or via UPI/bank transfer for Cash on Delivery orders).
          </p>
        </section>

        <section className="space-y-3 border-t border-[#EFE6DA] pt-6">
          <h2 className="text-base font-extrabold text-[#193653]">Initiate a Return</h2>
          <p>
            To start a return or exchange, visit your{' '}
            <Link href="/account" className="text-[#F27A8A] font-bold hover:underline">
              Account Orders
            </Link>{' '}
            page or reach out directly to{' '}
            <a href="mailto:support@babyladoo.com" className="text-[#F27A8A] font-bold hover:underline">
              support@babyladoo.com
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}
