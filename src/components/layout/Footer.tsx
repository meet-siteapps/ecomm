import Link from 'next/link';
import { ShieldCheck, Truck, HeartHandshake, Heart } from 'lucide-react';
import { CuteTeddyLogo, HotAirBalloonIllustration, BabyGiraffeIllustration } from '@/components/common/CartoonIllustrations';

export function Footer() {
  return (
    <footer className="w-full bg-[#FAF7F2] border-t border-[#EFE7DE] mt-auto relative overflow-hidden">
      {/* Value props banner - Floating Pill Style */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="flex items-center gap-3.5 p-4 rounded-3xl bg-white border border-[#EFE7DE] shadow-cute hover:scale-102 transition-transform">
            <div className="w-12 h-12 rounded-2xl bg-[#E0F2FE] text-[#0284C7] shadow-2xs flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-[#2D3748]">Fast Delivery</h4>
              <p className="text-xs text-[#718096] font-medium">Quick shipping across India</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-3xl bg-white border border-[#EFE7DE] shadow-cute hover:scale-102 transition-transform">
            <div className="w-12 h-12 rounded-2xl bg-[#D1FAE5] text-[#059669] shadow-2xs flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-[#2D3748]">100% Safe & Organic</h4>
              <p className="text-xs text-[#718096] font-medium">Gentle & certified for baby skin</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-3xl bg-white border border-[#EFE7DE] shadow-cute hover:scale-102 transition-transform">
            <div className="w-12 h-12 rounded-2xl bg-[#FFEAEF] text-[#FF6B8B] shadow-2xs flex items-center justify-center shrink-0">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-[#2D3748]">Loved by Parents</h4>
              <p className="text-xs text-[#718096] font-medium">Trusted by thousands of families</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links with Side Cartoon Characters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left: Hot Air Balloon & Brand */}
          <div className="md:col-span-4 flex items-start gap-4">
            <div className="hidden sm:block shrink-0 -mt-3">
              <HotAirBalloonIllustration className="w-24 h-36" />
            </div>
            <div className="space-y-3">
              <Link href="/" className="flex items-center gap-2.5 font-extrabold text-xl text-[#2D3748] group">
                <div className="w-10 h-10 rounded-2xl bg-[#FFEAEF] p-1 shadow-2xs flex items-center justify-center group-hover:scale-110 transition-transform">
                  <CuteTeddyLogo className="w-full h-full" />
                </div>
                <div className="flex flex-col">
                  <span className="group-hover:text-[#FF6B8B] transition-colors leading-tight">Baby Ladoo</span>
                  <span className="text-[9px] text-[#FF6B8B] font-bold tracking-wider">FOR YOUR LITTLE ONES</span>
                </div>
              </Link>
              <p className="text-xs text-[#718096] leading-relaxed font-medium">
                Carefully crafted with love, keeping your little one&apos;s comfort and happiness in mind.
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2">
            <h5 className="text-xs font-extrabold text-[#2D3748] uppercase tracking-wider mb-3">
              Shop
            </h5>
            <ul className="space-y-2.5 text-xs text-[#718096]">
              <li>
                <Link href="/products" className="hover:text-[#FF6B8B] transition-colors font-medium">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/products?sort=featured" className="hover:text-[#FF6B8B] transition-colors font-medium">
                  Featured Items
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-[#FF6B8B] transition-colors font-medium">
                  Shopping Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div className="md:col-span-2">
            <h5 className="text-xs font-extrabold text-[#2D3748] uppercase tracking-wider mb-3">
              Account
            </h5>
            <ul className="space-y-2.5 text-xs text-[#718096]">
              <li>
                <Link href="/login" className="hover:text-[#FF6B8B] transition-colors font-medium">
                  Sign In / Register
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-[#FF6B8B] transition-colors font-medium">
                  My Profile
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-[#FF6B8B] transition-colors font-medium">
                  Order History
                </Link>
              </li>
            </ul>
          </div>

          {/* Help & Policies */}
          <div className="md:col-span-2">
            <h5 className="text-xs font-extrabold text-[#2D3748] uppercase tracking-wider mb-3">
              Support
            </h5>
            <ul className="space-y-2.5 text-xs text-[#718096]">
              <li>
                <span className="font-medium block">support@babyladoo.com</span>
              </li>
              <li>
                <span className="font-medium block">Cash on Delivery Available</span>
              </li>
            </ul>
          </div>

          {/* Right: Baby Giraffe Cartoon Illustration */}
          <div className="hidden lg:flex md:col-span-2 justify-end -mt-6">
            <BabyGiraffeIllustration className="w-24 h-44" />
          </div>
        </div>
      </div>

      {/* Storybook Scalloped Grass Bottom Bar */}
      <div className="w-full bg-[#8BC380] text-white pt-4 pb-4 relative">
        {/* Scalloped edge top of grass bar */}
        <div className="absolute -top-3 left-0 right-0 h-4 bg-[#8BC380] rounded-t-full opacity-90" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-semibold">
          <p>© {new Date().getFullYear()} Baby Ladoo. All rights reserved.</p>
          <p className="text-[11px] flex items-center gap-1.5 opacity-90">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-[#FFEAEF] fill-[#FFEAEF]" />
            <span>for your baby&apos;s happy world</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
