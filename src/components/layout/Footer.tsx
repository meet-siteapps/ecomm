'use client';

import Link from 'next/link';
import { ShieldCheck, Truck, Heart, Leaf } from 'lucide-react';
import { CuteTeddyLogo, HotAirBalloonIllustration } from '@/components/common/CartoonIllustrations';

export function Footer() {
  return (
    <footer className="w-full bg-[#FAF4EE] mt-auto relative overflow-hidden">
      {/* ========================================================= */}
      {/* 1. 4-TONE PASTEL TRUST BAR                                */}
      {/* ========================================================= */}
      <div className="w-full grid grid-cols-2 md:grid-cols-4 border-t border-b border-[#EFE4D6]">
        {/* 1. Safe & Certified (Soft Sage) */}
        <div className="bg-[#EFF7E9]/80 hover:bg-[#EFF7E9] transition-colors p-3.5 sm:p-5 flex items-center justify-center gap-2 sm:gap-3 border-r border-[#A8C98B]/30">
          <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-white/90 text-[#729c50] flex items-center justify-center shrink-0 shadow-2xs">
            <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="text-left">
            <h4 className="text-xs sm:text-sm font-extrabold text-[#193653] leading-tight">Safe &amp; Certified</h4>
            <p className="text-[10px] sm:text-xs text-[#729c50] font-medium hidden xs:block">Non-toxic &amp; tested</p>
          </div>
        </div>

        {/* 2. 100% Organic (Coral Pink) */}
        <div className="bg-[#FDE8EB]/80 hover:bg-[#FDE8EB] transition-colors p-3.5 sm:p-5 flex items-center justify-center gap-2 sm:gap-3 border-r md:border-r border-[#F27A8A]/30">
          <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-white/90 text-[#F27A8A] flex items-center justify-center shrink-0 shadow-2xs">
            <Leaf className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="text-left">
            <h4 className="text-xs sm:text-sm font-extrabold text-[#193653] leading-tight">100% Organic</h4>
            <p className="text-[10px] sm:text-xs text-[#F27A8A] font-medium hidden xs:block">Gentle fabrics</p>
          </div>
        </div>

        {/* 3. Fast Delivery (Pastel Sky Blue) */}
        <div className="bg-[#EBF8FC]/80 hover:bg-[#EBF8FC] transition-colors p-3.5 sm:p-5 flex items-center justify-center gap-2 sm:gap-3 border-r border-[#8FD3E8]/40">
          <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-white/90 text-[#3599b8] flex items-center justify-center shrink-0 shadow-2xs">
            <Truck className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="text-left">
            <h4 className="text-xs sm:text-sm font-extrabold text-[#193653] leading-tight">Fast Delivery</h4>
            <p className="text-[10px] sm:text-xs text-[#3599b8] font-medium hidden xs:block">Across India</p>
          </div>
        </div>

        {/* 4. Loved by Parents (Pastel Yellow) */}
        <div className="bg-[#FEF9E8]/80 hover:bg-[#FEF9E8] transition-colors p-3.5 sm:p-5 flex items-center justify-center gap-2 sm:gap-3">
          <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-white/90 text-[#E0B538] flex items-center justify-center shrink-0 shadow-2xs">
            <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-[#E0B538]" />
          </div>
          <div className="text-left">
            <h4 className="text-xs sm:text-sm font-extrabold text-[#193653] leading-tight">Loved by Parents</h4>
            <p className="text-[10px] sm:text-xs text-[#E0B538] font-medium hidden xs:block">5-Star Quality</p>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. SCALLOPED CLOUD WAVE TOP DIVIDER                      */}
      {/* ========================================================= */}
      <div className="w-full h-4 bg-white relative">
        <svg viewBox="0 0 1200 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-4 text-white preserve-3d" preserveAspectRatio="none">
          <path d="M0 0 Q 30 24 60 0 Q 90 24 120 0 Q 150 24 180 0 Q 210 24 240 0 Q 270 24 300 0 Q 330 24 360 0 Q 390 24 420 0 Q 450 24 480 0 Q 510 24 540 0 Q 570 24 600 0 Q 630 24 660 0 Q 690 24 720 0 Q 750 24 780 0 Q 810 24 840 0 Q 870 24 900 0 Q 930 24 960 0 Q 990 24 1020 0 Q 1050 24 1080 0 Q 1110 24 1140 0 Q 1170 24 1200 0 L 1200 24 L 0 24 Z" fill="white" />
        </svg>
      </div>

      {/* ========================================================= */}
      {/* 3. MAIN CLEAN FOOTER CONTENT                              */}
      {/* ========================================================= */}
      <div className="bg-white pt-6 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Brand Logo & Social Icons */}
            <div className="md:col-span-4 space-y-4">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-[#FDE8EB] p-1 flex items-center justify-center border border-[#F27A8A]/30 shadow-2xs group-hover:scale-105 transition-transform">
                  <CuteTeddyLogo className="w-full h-full" />
                </div>
                {/* Colorful letters for Baby Ladoo */}
                <div className="flex items-baseline font-black text-xl sm:text-2xl tracking-tight select-none">
                  <span className="text-[#F27A8A]">B</span>
                  <span className="text-[#D99A26]">a</span>
                  <span className="text-[#1F95B5]">b</span>
                  <span className="text-[#5E933E]">y</span>
                  <span className="w-1.5 sm:w-2 inline-block"></span>
                  <span className="text-[#F27A8A]">L</span>
                  <span className="text-[#D99A26]">a</span>
                  <span className="text-[#1F95B5]">d</span>
                  <span className="text-[#5E933E]">o</span>
                  <span className="text-[#F27A8A]">o</span>
                </div>
              </Link>

              <p className="text-xs text-[#5D7285] leading-relaxed font-medium max-w-sm">
                Safe, soft and playful baby essentials crafted with pure love for your little ones.
              </p>

              {/* Social Media Rounded Badges */}
              <div className="flex items-center gap-2.5 pt-1">
                <a
                  href="#instagram"
                  aria-label="Instagram"
                  className="w-8 h-8 rounded-full bg-[#FDE8EB] text-[#F27A8A] flex items-center justify-center hover:bg-[#F27A8A] hover:text-white transition-all shadow-2xs"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
                <a
                  href="#facebook"
                  aria-label="Facebook"
                  className="w-8 h-8 rounded-full bg-[#EBF8FC] text-[#3599b8] flex items-center justify-center hover:bg-[#3599b8] hover:text-white transition-all shadow-2xs"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
                <a
                  href="#youtube"
                  aria-label="YouTube"
                  className="w-8 h-8 rounded-full bg-[#FDE8EB] text-[#E11D48] flex items-center justify-center hover:bg-[#E11D48] hover:text-white transition-all shadow-2xs"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="white" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links Column */}
            <div className="md:col-span-3 space-y-3">
              <h5 className="text-xs sm:text-sm font-extrabold text-[#193653]">
                Quick Links
              </h5>
              <ul className="space-y-2 text-xs text-[#5D7285]">
                <li>
                  <Link href="/" className="hover:text-[#F27A8A] transition-colors font-medium">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="hover:text-[#F27A8A] transition-colors font-medium">
                    All Products
                  </Link>
                </li>
                <li>
                  <Link href="/products?sort=discount" className="hover:text-[#F27A8A] transition-colors font-medium">
                    Special Offers
                  </Link>
                </li>
                <li>
                  <Link href="/cart" className="hover:text-[#F27A8A] transition-colors font-medium">
                    Shopping Cart
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company & Support Column */}
            <div className="md:col-span-3 space-y-3">
              <h5 className="text-xs sm:text-sm font-extrabold text-[#193653]">
                Company &amp; Help
              </h5>
              <ul className="space-y-2 text-xs text-[#5D7285]">
                <li>
                  <Link href="/about" className="hover:text-[#F27A8A] transition-colors font-medium">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-[#F27A8A] transition-colors font-medium">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/account" className="hover:text-[#F27A8A] transition-colors font-medium">
                    Order Tracking
                  </Link>
                </li>
                <li>
                  <Link href="/shipping-policy" className="hover:text-[#F27A8A] transition-colors font-medium">
                    Shipping Policy
                  </Link>
                </li>
                <li>
                  <Link href="/return-refund-policy" className="hover:text-[#F27A8A] transition-colors font-medium">
                    Return &amp; Refund Policy
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className="hover:text-[#F27A8A] transition-colors font-medium">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-[#F27A8A] transition-colors font-medium">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>

            {/* Right Mascot Illustration */}
            <div className="hidden lg:flex md:col-span-2 justify-center items-center">
              <HotAirBalloonIllustration className="w-28 h-40" />
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="mt-10 pt-6 border-t border-[#EFE4D6] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#5D7285]">
            <p>© {new Date().getFullYear()} Baby Ladoo. All rights reserved.</p>
            <p className="flex items-center gap-1">
              <span>Made with</span>
              <Heart className="w-3.5 h-3.5 text-[#F27A8A] fill-[#F27A8A]" />
              <span>for your little ones</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
