'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail } from 'lucide-react';
import { CuteTeddyLogo } from '@/components/common/CartoonIllustrations';

export function Footer() {
  return (
    <footer className="w-full bg-[#FFFBF5] mt-auto relative overflow-hidden border-t border-[#F3ECE1]">
      {/* ========================================================= */}
      {/* 1. MAIN FOOTER CONTENT ON LIGHT CREAM BACKGROUND          */}
      {/* ========================================================= */}
      <div className="pt-10 sm:pt-14 pb-4 sm:pb-6 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          
          {/* Mobile Top Header: Brand info + Mobile Hot Air Balloon */}
          <div className="flex lg:hidden items-center justify-between gap-4 pb-6 mb-6 border-b border-[#EFE8DC]/80">
            <div className="space-y-2 max-w-[70%]">
              <Link href="/" className="inline-flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-xl bg-[#FDF2F4] p-1 flex items-center justify-center border border-[#F06277]/20 shadow-2xs">
                  <CuteTeddyLogo className="w-full h-full" />
                </div>
                <div>
                  <div className="flex items-baseline font-black text-lg tracking-tight select-none">
                    <span className="text-[#F06277]">B</span>
                    <span className="text-[#D99A26]">a</span>
                    <span className="text-[#1F95B5]">b</span>
                    <span className="text-[#5E933E]">y</span>
                    <span className="w-1 inline-block"></span>
                    <span className="text-[#F06277]">L</span>
                    <span className="text-[#D99A26]">a</span>
                    <span className="text-[#1F95B5]">d</span>
                    <span className="text-[#5E933E]">o</span>
                    <span className="text-[#F06277]">o</span>
                  </div>
                  <p className="text-[10px] text-[#64748B] font-medium leading-none">
                    For your little ones
                  </p>
                </div>
              </Link>
              <p className="text-xs text-[#64748B] font-medium leading-relaxed">
                Carefully crafted with love for your little one&apos;s comfort and safety.
              </p>
            </div>

            {/* Mobile Hot Air Balloon Illustration */}
            <div className="relative w-20 sm:w-24 shrink-0 animate-float">
              <Image
                src="/hotairbaloon.png"
                alt="Baby Ladoo Hot Air Balloon"
                width={800}
                height={1317}
                className="w-full h-auto object-contain select-none pointer-events-none mix-blend-multiply"
              />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row items-end justify-between gap-6 lg:gap-8">
            {/* Desktop Left Bookend: Hot Air Balloon Image */}
            <div className="hidden lg:flex shrink-0 items-end justify-center self-end -mb-4 xl:-mb-6">
              <div className="relative w-28 lg:w-32 xl:w-36 h-auto group animate-float">
                <Image
                  src="/hotairbaloon.png"
                  alt="Baby Ladoo Hot Air Balloon"
                  width={800}
                  height={1317}
                  className="w-full h-auto object-contain object-bottom select-none pointer-events-none mix-blend-multiply transition-transform duration-500 ease-out group-hover:scale-110"
                />
              </div>
            </div>

            {/* Central 5 Columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 sm:gap-6 flex-1 w-full self-start pt-2">
              {/* Column 1: Brand & Social (Hidden on mobile since shown in mobile header) */}
              <div className="hidden lg:block space-y-3.5">
                <Link href="/" className="inline-flex items-center gap-2 group">
                  <div className="w-9 h-9 rounded-2xl bg-[#FDF2F4] p-1 flex items-center justify-center border border-[#F06277]/20 shadow-2xs group-hover:scale-105 transition-transform">
                    <CuteTeddyLogo className="w-full h-full" />
                  </div>
                  <div>
                    <div className="flex items-baseline font-black text-xl tracking-tight select-none">
                      <span className="text-[#F06277]">B</span>
                      <span className="text-[#D99A26]">a</span>
                      <span className="text-[#1F95B5]">b</span>
                      <span className="text-[#5E933E]">y</span>
                      <span className="w-1.5 inline-block"></span>
                      <span className="text-[#F06277]">L</span>
                      <span className="text-[#D99A26]">a</span>
                      <span className="text-[#1F95B5]">d</span>
                      <span className="text-[#5E933E]">o</span>
                      <span className="text-[#F06277]">o</span>
                    </div>
                    <p className="text-[11px] text-[#64748B] font-medium leading-none mt-0.5">
                      For your little ones
                    </p>
                  </div>
                </Link>

                <p className="text-xs text-[#64748B] leading-relaxed font-medium max-w-xs">
                  Carefully crafted with love, keeping your little one&apos;s comfort and safety in mind.
                </p>

                {/* Social Circle Badges: Facebook, Instagram, YouTube */}
                <div className="flex items-center gap-2 pt-1">
                  <a
                    href="#facebook"
                    aria-label="Facebook"
                    className="w-8 h-8 rounded-full bg-[#3B82F6] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-2xs"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                  </a>
                  <a
                    href="#instagram"
                    aria-label="Instagram"
                    className="w-8 h-8 rounded-full bg-[#F06277] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-2xs"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                  </a>
                  <a
                    href="#youtube"
                    aria-label="YouTube"
                    className="w-8 h-8 rounded-full bg-[#EF4444] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-2xs"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="white" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Column 2: SHOP */}
              <div className="space-y-3">
                <h5 className="text-xs sm:text-sm font-extrabold text-[#1E293B] tracking-wider uppercase">
                  SHOP
                </h5>
                <ul className="space-y-2 text-xs text-[#64748B]">
                  <li>
                    <Link href="/products" className="hover:text-[#F06277] transition-colors font-medium">
                      All Products
                    </Link>
                  </li>
                  <li>
                    <Link href="/products?sort=new" className="hover:text-[#F06277] transition-colors font-medium">
                      New Arrivals
                    </Link>
                  </li>
                  <li>
                    <Link href="/products?sort=bestseller" className="hover:text-[#F06277] transition-colors font-medium">
                      Best Sellers
                    </Link>
                  </li>
                  <li>
                    <Link href="/products?sort=discount" className="hover:text-[#F06277] transition-colors font-medium">
                      Baby Essentials
                    </Link>
                  </li>
                  <li>
                    <Link href="/products" className="hover:text-[#F06277] transition-colors font-medium">
                      Gift Sets
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Column 3: INFORMATION */}
              <div className="space-y-3">
                <h5 className="text-xs sm:text-sm font-extrabold text-[#1E293B] tracking-wider uppercase">
                  INFORMATION
                </h5>
                <ul className="space-y-2 text-xs text-[#64748B]">
                  <li>
                    <Link href="/about" className="hover:text-[#F06277] transition-colors font-medium">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" className="hover:text-[#F06277] transition-colors font-medium">
                      Our Materials
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" className="hover:text-[#F06277] transition-colors font-medium">
                      Sizing Guide
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" className="hover:text-[#F06277] transition-colors font-medium">
                      Care Instructions
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" className="hover:text-[#F06277] transition-colors font-medium">
                      Sustainability
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Column 4: CUSTOMER SERVICE */}
              <div className="space-y-3">
                <h5 className="text-xs sm:text-sm font-extrabold text-[#1E293B] tracking-wider uppercase">
                  CUSTOMER SERVICE
                </h5>
                <ul className="space-y-2 text-xs text-[#64748B]">
                  <li>
                    <Link href="/contact" className="hover:text-[#F06277] transition-colors font-medium">
                      Help Center
                    </Link>
                  </li>
                  <li>
                    <Link href="/shipping-policy" className="hover:text-[#F06277] transition-colors font-medium">
                      Shipping &amp; Delivery
                    </Link>
                  </li>
                  <li>
                    <Link href="/return-refund-policy" className="hover:text-[#F06277] transition-colors font-medium">
                      Returns &amp; Exchanges
                    </Link>
                  </li>
                  <li>
                    <Link href="/account" className="hover:text-[#F06277] transition-colors font-medium">
                      Track Your Order
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="hover:text-[#F06277] transition-colors font-medium">
                      Contact Us
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Column 5: CONTACT US */}
              <div className="space-y-3">
                <h5 className="text-xs sm:text-sm font-extrabold text-[#1E293B] tracking-wider uppercase">
                  CONTACT US
                </h5>
                <ul className="space-y-2.5 text-xs text-[#64748B]">
                  <li className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[#F06277] shrink-0 mt-0.5" />
                    <span className="leading-snug font-medium">
                      123, Happy Lane, Kidstown, Jaipur, Rajasthan 302018
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#34A853] shrink-0" />
                    <a href="tel:+919876543210" className="hover:text-[#F06277] transition-colors font-medium">
                      +91 98765 43210
                    </a>
                  </li>
                  <li className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#10B981] shrink-0" />
                    <a href="mailto:hello@babyladoo.com" className="hover:text-[#F06277] transition-colors font-medium">
                      hello@babyladoo.com
                    </a>
                  </li>
                </ul>

                {/* Mobile Social Icons */}
                <div className="flex lg:hidden items-center gap-2.5 pt-2">
                  <a
                    href="#facebook"
                    aria-label="Facebook"
                    className="w-8 h-8 rounded-full bg-[#3B82F6] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-2xs"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                  </a>
                  <a
                    href="#instagram"
                    aria-label="Instagram"
                    className="w-8 h-8 rounded-full bg-[#F06277] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-2xs"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                  </a>
                  <a
                    href="#youtube"
                    aria-label="YouTube"
                    className="w-8 h-8 rounded-full bg-[#EF4444] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-2xs"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="white" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Desktop Right Bookend: Giraffe Image */}
            <div className="hidden lg:flex shrink-0 items-end justify-center self-end -mb-4 xl:-mb-6">
              <div className="relative w-32 lg:w-36 xl:w-44 h-auto group animate-sway">
                <Image
                  src="/giraffe.png"
                  alt="Baby Ladoo Giraffe Mascot"
                  width={879}
                  height={1216}
                  className="w-full h-auto object-contain object-bottom select-none pointer-events-none mix-blend-multiply transition-transform duration-500 ease-out group-hover:scale-110 group-hover:rotate-3"
                />
              </div>
            </div>
          </div>

          {/* Mobile Giraffe Mascot: sitting happily in the corner right above the green bar */}
          <div className="flex lg:hidden justify-end items-end pt-4 -mb-4">
            <div className="relative w-28 sm:w-32 shrink-0 animate-sway">
              <Image
                src="/giraffe.png"
                alt="Baby Ladoo Giraffe Mascot"
                width={879}
                height={1216}
                className="w-full h-auto object-contain object-bottom select-none pointer-events-none mix-blend-multiply"
              />
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. GREEN GRASS GROUND BANNER (#A1BE7A) MATCHING IMAGES    */}
      {/* ========================================================= */}
      <div className="w-full bg-[#A1BE7A] relative py-3.5 px-4 sm:px-6">
        {/* Delicate dashed stitching on top edge */}
        <div className="absolute top-0 left-0 right-0 border-t-2 border-dashed border-[#B8D494] pointer-events-none" />

        {/* Small Flowers on Left and Right of bottom bar */}
        <div className="max-w-7xl mx-auto flex items-center justify-between relative z-10">
          {/* Left flower sprigs */}
          <div className="hidden sm:flex items-center gap-1.5 opacity-85">
            <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
              <circle cx="10" cy="10" r="4" fill="#FDF2F4" />
              <circle cx="10" cy="10" r="1.8" fill="#FDE68A" />
            </svg>
            <svg viewBox="0 0 20 20" fill="none" className="w-3.5 h-3.5">
              <circle cx="10" cy="10" r="3.5" fill="#FDE68A" />
              <circle cx="10" cy="10" r="1.5" fill="#FFFFFF" />
            </svg>
          </div>

          {/* Center Copyright */}
          <p className="w-full sm:w-auto text-center text-xs text-white font-semibold tracking-wide drop-shadow-xs">
            © {new Date().getFullYear()} BabyLadoo. All rights reserved.
          </p>

          {/* Right flower sprigs */}
          <div className="hidden sm:flex items-center gap-1.5 opacity-85">
            <svg viewBox="0 0 20 20" fill="none" className="w-3.5 h-3.5">
              <circle cx="10" cy="10" r="3.5" fill="#FDE68A" />
              <circle cx="10" cy="10" r="1.5" fill="#FFFFFF" />
            </svg>
            <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
              <circle cx="10" cy="10" r="4" fill="#FDF2F4" />
              <circle cx="10" cy="10" r="1.8" fill="#FDE68A" />
            </svg>
          </div>
        </div>
      </div>
    </footer>
  );
}
