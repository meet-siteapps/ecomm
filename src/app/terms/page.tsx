import { FileCheck, AlertCircle, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service | Baby Ladoo',
  description: 'Terms and conditions governing use and purchases on Baby Ladoo.',
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <div className="text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-[#EBF8FC] text-[#3599b8] flex items-center justify-center mx-auto shadow-2xs">
          <FileCheck className="w-7 h-7" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#193653] tracking-tight">
          Terms &amp; Conditions
        </h1>
        <p className="text-xs sm:text-sm text-[#5D7285] max-w-md mx-auto">
          Please review these terms before shopping on the Baby Ladoo storefront.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#EFE6DA] shadow-cute space-y-8 text-xs sm:text-sm text-[#5D7285] leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-extrabold text-[#193653] flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-[#F27A8A]" />
            <span>1. Orders &amp; Pricing</span>
          </h2>
          <p>
            All prices listed on Baby Ladoo are in Indian Rupees (INR) inclusive of applicable taxes. We make every effort to maintain accurate inventory levels. In rare instances where an item runs out of stock after order placement, we will promptly notify you and process an immediate full refund or exchange.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-extrabold text-[#193653] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#D99A26]" />
            <span>2. User Accounts &amp; Conduct</span>
          </h2>
          <p>
            You are responsible for safeguarding your login credentials. You agree to provide accurate, up-to-date delivery and contact details to ensure reliable delivery of your orders.
          </p>
        </section>

        <section className="space-y-3 border-t border-[#EFE6DA] pt-6">
          <h2 className="text-base font-extrabold text-[#193653]">Contact Customer Support</h2>
          <p>
            For any legal or contractual inquiries, email us at{' '}
            <a href="mailto:support@babyladoo.com" className="text-[#F27A8A] font-bold hover:underline">
              support@babyladoo.com
            </a>{' '}
            or visit our{' '}
            <Link href="/contact" className="text-[#F27A8A] font-bold hover:underline">
              Help Center
            </Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
