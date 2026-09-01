import { ShieldCheck, Lock, Eye, FileText } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | Baby Ladoo',
  description: 'Learn how Baby Ladoo collects, uses, and protects your personal information.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <div className="text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-[#EFF7E9] text-[#729c50] flex items-center justify-center mx-auto shadow-2xs">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#193653] tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs sm:text-sm text-[#5D7285] max-w-md mx-auto">
          Last updated: August 2026. Your privacy and trust are of paramount importance to us.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#EFE6DA] shadow-cute space-y-8 text-xs sm:text-sm text-[#5D7285] leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-extrabold text-[#193653] flex items-center gap-2">
            <Eye className="w-4 h-4 text-[#F27A8A]" />
            <span>1. Information We Collect</span>
          </h2>
          <p>
            When you purchase from Baby Ladoo, create an account, or browse our storefront, we collect information you provide directly to us:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#5D7285]">
            <li><strong>Personal Contact Info</strong>: Full name, delivery address, phone number, and email address.</li>
            <li><strong>Order History</strong>: Items purchased, selected sizes/colors, date of purchase, and delivery status.</li>
            <li><strong>Payment Information</strong>: Encrypted transaction identifiers (we do not store raw card numbers or CVV on our servers).</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-extrabold text-[#193653] flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#3599b8]" />
            <span>2. How We Protect Your Data</span>
          </h2>
          <p>
            We use industry-standard encryption protocols (SSL/TLS) and strict Row Level Security (RLS) policies within our database infrastructure. Your account data is inaccessible to unauthorized third parties.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-extrabold text-[#193653] flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#D99A26]" />
            <span>3. Sharing with Logistics &amp; Services</span>
          </h2>
          <p>
            We only share necessary shipping data (your name, shipping address, and phone number) with verified courier partners across India strictly to deliver your packages safely and swiftly.
          </p>
        </section>

        <section className="space-y-3 border-t border-[#EFE6DA] pt-6">
          <h2 className="text-base font-extrabold text-[#193653]">Questions or Data Inquiries?</h2>
          <p>
            If you have any questions regarding your data or wish to delete your account profile, please contact our privacy team at{' '}
            <a href="mailto:privacy@babyladoo.com" className="text-[#F27A8A] font-bold hover:underline">
              privacy@babyladoo.com
            </a>{' '}
            or reach out via our{' '}
            <Link href="/contact" className="text-[#F27A8A] font-bold hover:underline">
              Contact Page
            </Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
