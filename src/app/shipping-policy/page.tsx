import { Truck, Clock, MapPin, PackageCheck } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Shipping Policy | Baby Ladoo',
  description: 'Fast, secure, and reliable pan-India delivery details for Baby Ladoo.',
};

export default function ShippingPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <div className="text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-[#EBF8FC] text-[#3599b8] flex items-center justify-center mx-auto shadow-2xs">
          <Truck className="w-7 h-7" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#193653] tracking-tight">
          Shipping &amp; Delivery Policy
        </h1>
        <p className="text-xs sm:text-sm text-[#5D7285] max-w-md mx-auto">
          We ship every order with extra care and speed across India.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#EFE6DA] shadow-cute space-y-8 text-xs sm:text-sm text-[#5D7285] leading-relaxed">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-[#EFF7E9] text-left space-y-1.5 border border-[#A8C98B]/30">
            <PackageCheck className="w-5 h-5 text-[#729c50]" />
            <h3 className="font-extrabold text-[#193653] text-xs">FREE Shipping</h3>
            <p className="text-[11px] text-[#5D7285]">On all orders above ₹999 across India.</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FDE8EB] text-left space-y-1.5 border border-[#F27A8A]/30">
            <Clock className="w-5 h-5 text-[#F27A8A]" />
            <h3 className="font-extrabold text-[#193653] text-xs">3–5 Business Days</h3>
            <p className="text-[11px] text-[#5D7285]">Standard transit time to major metro cities.</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FEF9E8] text-left space-y-1.5 border border-[#E0B538]/30">
            <MapPin className="w-5 h-5 text-[#E0B538]" />
            <h3 className="font-extrabold text-[#193653] text-xs">Pan-India Reach</h3>
            <p className="text-[11px] text-[#5D7285]">Serving 27,000+ pincodes through tier-1 couriers.</p>
          </div>
        </div>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-extrabold text-[#193653]">Order Processing Time</h2>
          <p>
            Orders placed before 2:00 PM IST on working days are packed and dispatched on the same day. Orders placed on weekends or national holidays are dispatched on the next business day.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-extrabold text-[#193653]">Order Tracking</h2>
          <p>
            Once your package is handed to our courier partner, you will receive an SMS and email notification with your live tracking AWB number. You can also view live status updates directly in your{' '}
            <Link href="/account" className="text-[#F27A8A] font-bold hover:underline">
              My Orders
            </Link>{' '}
            dashboard.
          </p>
        </section>

        <section className="space-y-3 border-t border-[#EFE6DA] pt-6">
          <h2 className="text-base font-extrabold text-[#193653]">Delivery Inquiries</h2>
          <p>
            Need help tracking a shipment? Contact us at{' '}
            <a href="mailto:support@babyladoo.com" className="text-[#F27A8A] font-bold hover:underline">
              support@babyladoo.com
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}
