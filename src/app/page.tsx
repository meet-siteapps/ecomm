import Link from 'next/link';
import { ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#EAF6FF]/50 to-white py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAF6FF] text-[#4DA3FF] text-xs font-semibold tracking-wide border border-[#4DA3FF]/20 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Clean & Minimal Shopping</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-[#1F2937] tracking-tight leading-tight">
            Welcome to <span className="text-[#4DA3FF]">The Shop</span>
          </h1>

          <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto font-normal leading-relaxed">
            A thoughtfully designed storefront bringing you essential quality products with a smooth, friendly shopping experience.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/products"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#4DA3FF] hover:bg-[#2B8BE6] text-white font-medium text-sm transition-all shadow-xs hover:shadow-md active:scale-98"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-gray-50 text-[#1F2937] font-medium text-sm border border-gray-200 hover:border-gray-300 transition-all active:scale-98"
            >
              <ShoppingBag className="w-4 h-4 text-[#4DA3FF]" />
              <span>Customer Account</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
