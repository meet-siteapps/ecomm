'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail, ChevronDown } from 'lucide-react';
import { CuteTeddyLogo } from '@/components/common/CartoonIllustrations';
import { fetchStoreSettings } from '@/lib/api/settings';
import { StoreSettings, DEFAULT_STORE_SETTINGS } from '@/types/settings';

export function Footer() {
  // Accordion state for mobile - only one can be open at a time
  const [openSection, setOpenSection] = useState<string | null>(null);
  
  // Store settings state
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_STORE_SETTINGS);

  // Fetch store settings on mount
  useEffect(() => {
    fetchStoreSettings()
      .then(setSettings)
      .catch(() => {
        // Silently fall back to DEFAULT_STORE_SETTINGS on error
        console.warn('Footer: Could not fetch store settings, using defaults');
      });
  }, []);

  const toggleSection = (section: string) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  return (
    <footer className="w-full bg-[#FFFBF5] mt-auto relative overflow-hidden border-t border-[#F3ECE1]">
      {/* ========================================================= */}
      {/* 1. MAIN FOOTER CONTENT ON LIGHT CREAM BACKGROUND          */}
      {/* ========================================================= */}
      <div className="pt-6 md:pt-10 sm:pt-14 pb-3 md:pb-4 sm:pb-6 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          
          {/* Mobile Top Header: Brand info + Small Hot Air Balloon */}
          <div className="flex md:hidden items-center justify-between gap-4 pb-4 mb-4 border-b border-[#EFE8DC]/80">
            <div className="space-y-1.5 max-w-[70%]">
              <Link href="/" className="inline-flex items-center gap-1.5 group">
                <div className="w-7 h-7 rounded-xl bg-[#FDF2F4] p-1 flex items-center justify-center border border-[#F06277]/20 shadow-2xs">
                  <CuteTeddyLogo className="w-full h-full" />
                </div>
                <div>
                  <div className="flex items-baseline font-black text-base tracking-tight select-none">
                    <span className="text-[#F06277]">B</span>
                    <span className="text-[#D99A26]">a</span>
                    <span className="text-[#1F95B5]">b</span>
                    <span className="text-[#5E933E]">y</span>
                    <span className="w-0.5 inline-block"></span>
                    <span className="text-[#F06277]">L</span>
                    <span className="text-[#D99A26]">a</span>
                    <span className="text-[#1F95B5]">d</span>
                    <span className="text-[#5E933E]">o</span>
                    <span className="text-[#F06277]">o</span>
                  </div>
                  <p className="text-[9px] text-[#64748B] font-medium leading-none">
                    For your little ones
                  </p>
                </div>
              </Link>
              <p className="text-[11px] text-[#64748B] font-medium leading-relaxed">
                Carefully crafted with love for your little one.
              </p>
            </div>

            {/* Mobile Hot Air Balloon Illustration */}
            <div className="relative w-24 sm:w-28 shrink-0 animate-float opacity-90">
              <Image
                src="/hotairbaloon.png"
                alt=""
                width={800}
                height={1317}
                className="w-full h-auto object-contain select-none pointer-events-none mix-blend-multiply transition-transform duration-500 hover:scale-110"
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

            {/* Wrapper for both mobile accordions and desktop columns */}
            <div className="flex-1 w-full">
              {/* ========================================================= */}
              {/* MOBILE ACCORDION SECTIONS (below md breakpoint)           */}
              {/* ========================================================= */}
              <div className="md:hidden space-y-2.5 w-full">
                {/* Accordion 1: SHOP */}
                <div className={`border-2 rounded-2xl overflow-hidden transition-all duration-300 ${
                  openSection === 'shop' 
                    ? 'border-[#F06277] bg-gradient-to-br from-[#FDF2F4] to-white shadow-md' 
                    : 'border-[#EFE8DC] bg-white/50 hover:border-[#F06277]/30 hover:bg-white/70'
                }`}>
                  <button
                    type="button"
                    onClick={() => toggleSection('shop')}
                    className="w-full flex items-center justify-between px-4 py-3 text-left group"
                    aria-expanded={openSection === 'shop'}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${
                        openSection === 'shop'
                          ? 'bg-[#F06277] text-white scale-110'
                          : 'bg-[#FDF2F4] text-[#F06277] group-hover:scale-105'
                      }`}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                          <line x1="3" y1="6" x2="21" y2="6" />
                          <path d="M16 10a4 4 0 0 1-8 0" />
                        </svg>
                      </div>
                      <h5 className={`text-xs font-extrabold tracking-wider uppercase transition-colors ${
                        openSection === 'shop' ? 'text-[#F06277]' : 'text-[#1E293B]'
                      }`}>
                        SHOP
                      </h5>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 transition-all duration-300 ${
                        openSection === 'shop' 
                          ? 'rotate-180 text-[#F06277]' 
                          : 'text-[#64748B] group-hover:text-[#F06277]'
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      openSection === 'shop' ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <ul className="px-4 pb-4 pt-1 space-y-2 text-xs text-[#64748B]">
                      <li>
                        <Link href="/products" className="hover:text-[#F06277] transition-all font-medium block py-1.5 hover:translate-x-1 duration-200">
                          All Products
                        </Link>
                      </li>
                      <li>
                        <Link href="/products?sort=new" className="hover:text-[#F06277] transition-all font-medium block py-1.5 hover:translate-x-1 duration-200">
                          New Arrivals
                        </Link>
                      </li>
                      <li>
                        <Link href="/products?sort=bestseller" className="hover:text-[#F06277] transition-all font-medium block py-1.5 hover:translate-x-1 duration-200">
                          Best Sellers
                        </Link>
                      </li>
                      <li>
                        <Link href="/products?sort=discount" className="hover:text-[#F06277] transition-all font-medium block py-1.5 hover:translate-x-1 duration-200">
                          Baby Essentials
                        </Link>
                      </li>
                      <li>
                        <Link href="/products" className="hover:text-[#F06277] transition-all font-medium block py-1.5 hover:translate-x-1 duration-200">
                          Gift Sets
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Accordion 2: INFORMATION */}
                <div className={`border-2 rounded-2xl overflow-hidden transition-all duration-300 ${
                  openSection === 'information' 
                    ? 'border-[#5E933E] bg-gradient-to-br from-[#EBF7EE] to-white shadow-md' 
                    : 'border-[#EFE8DC] bg-white/50 hover:border-[#5E933E]/30 hover:bg-white/70'
                }`}>
                  <button
                    type="button"
                    onClick={() => toggleSection('information')}
                    className="w-full flex items-center justify-between px-4 py-3 text-left group"
                    aria-expanded={openSection === 'information'}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${
                        openSection === 'information'
                          ? 'bg-[#5E933E] text-white scale-110'
                          : 'bg-[#EBF7EE] text-[#5E933E] group-hover:scale-105'
                      }`}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="16" x2="12" y2="12" />
                          <line x1="12" y1="8" x2="12.01" y2="8" />
                        </svg>
                      </div>
                      <h5 className={`text-xs font-extrabold tracking-wider uppercase transition-colors ${
                        openSection === 'information' ? 'text-[#5E933E]' : 'text-[#1E293B]'
                      }`}>
                        INFORMATION
                      </h5>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 transition-all duration-300 ${
                        openSection === 'information' 
                          ? 'rotate-180 text-[#5E933E]' 
                          : 'text-[#64748B] group-hover:text-[#5E933E]'
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      openSection === 'information' ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <ul className="px-4 pb-4 pt-1 space-y-2 text-xs text-[#64748B]">
                      <li>
                        <Link href="/about" className="hover:text-[#5E933E] transition-all font-medium block py-1.5 hover:translate-x-1 duration-200">
                          About Us
                        </Link>
                      </li>
                      <li>
                        <Link href="/about" className="hover:text-[#5E933E] transition-all font-medium block py-1.5 hover:translate-x-1 duration-200">
                          Our Materials
                        </Link>
                      </li>
                      <li>
                        <Link href="/about" className="hover:text-[#5E933E] transition-all font-medium block py-1.5 hover:translate-x-1 duration-200">
                          Sizing Guide
                        </Link>
                      </li>
                      <li>
                        <Link href="/about" className="hover:text-[#5E933E] transition-all font-medium block py-1.5 hover:translate-x-1 duration-200">
                          Care Instructions
                        </Link>
                      </li>
                      <li>
                        <Link href="/about" className="hover:text-[#5E933E] transition-all font-medium block py-1.5 hover:translate-x-1 duration-200">
                          Sustainability
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Accordion 3: CUSTOMER SERVICE */}
                <div className={`border-2 rounded-2xl overflow-hidden transition-all duration-300 ${
                  openSection === 'customerService' 
                    ? 'border-[#1F95B5] bg-gradient-to-br from-[#EBF5FB] to-white shadow-md' 
                    : 'border-[#EFE8DC] bg-white/50 hover:border-[#1F95B5]/30 hover:bg-white/70'
                }`}>
                  <button
                    type="button"
                    onClick={() => toggleSection('customerService')}
                    className="w-full flex items-center justify-between px-4 py-3 text-left group"
                    aria-expanded={openSection === 'customerService'}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${
                        openSection === 'customerService'
                          ? 'bg-[#1F95B5] text-white scale-110'
                          : 'bg-[#EBF5FB] text-[#1F95B5] group-hover:scale-105'
                      }`}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                      </div>
                      <h5 className={`text-xs font-extrabold tracking-wider uppercase transition-colors ${
                        openSection === 'customerService' ? 'text-[#1F95B5]' : 'text-[#1E293B]'
                      }`}>
                        CUSTOMER SERVICE
                      </h5>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 transition-all duration-300 ${
                        openSection === 'customerService' 
                          ? 'rotate-180 text-[#1F95B5]' 
                          : 'text-[#64748B] group-hover:text-[#1F95B5]'
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      openSection === 'customerService' ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <ul className="px-4 pb-4 pt-1 space-y-2 text-xs text-[#64748B]">
                      <li>
                        <Link href="/contact" className="hover:text-[#1F95B5] transition-all font-medium block py-1.5 hover:translate-x-1 duration-200">
                          Help Center
                        </Link>
                      </li>
                      <li>
                        <Link href="/shipping-policy" className="hover:text-[#1F95B5] transition-all font-medium block py-1.5 hover:translate-x-1 duration-200">
                          Shipping &amp; Delivery
                        </Link>
                      </li>
                      <li>
                        <Link href="/return-refund-policy" className="hover:text-[#1F95B5] transition-all font-medium block py-1.5 hover:translate-x-1 duration-200">
                          Returns &amp; Exchanges
                        </Link>
                      </li>
                      <li>
                        <Link href="/account" className="hover:text-[#1F95B5] transition-all font-medium block py-1.5 hover:translate-x-1 duration-200">
                          Track Your Order
                        </Link>
                      </li>
                      <li>
                        <Link href="/contact" className="hover:text-[#1F95B5] transition-all font-medium block py-1.5 hover:translate-x-1 duration-200">
                          Contact Us
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* CONTACT US - Always visible on mobile (not collapsed) */}
                <div className="border-2 border-[#F06277]/40 rounded-2xl overflow-hidden bg-gradient-to-br from-[#FDF2F4] via-white to-[#FFF9F0] px-4 py-3.5 mt-3 shadow-sm">
                  <h5 className="text-xs font-extrabold text-[#1E293B] tracking-wider uppercase mb-2.5">
                    CONTACT US
                  </h5>
                  <ul className="space-y-2 text-xs text-[#64748B]">
                    <li className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#F06277] shrink-0 mt-0.5" />
                      <span className="leading-snug font-medium">
                        {settings.store_address}
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-[#34A853] shrink-0" />
                      <a href={`tel:${settings.contact_phone}`} className="hover:text-[#F06277] transition-colors font-medium">
                        {settings.contact_phone}
                      </a>
                    </li>
                    <li className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                      <a href={`mailto:${settings.contact_email}`} className="hover:text-[#F06277] transition-colors font-medium">
                        {settings.contact_email}
                      </a>
                    </li>
                  </ul>

                  {/* Mobile Social Icons */}
                  <div className="flex items-center gap-2 pt-3 border-t border-[#F06277]/20 mt-3">
                    <a
                      href="#facebook"
                      aria-label="Facebook"
                      className="w-7 h-7 rounded-full bg-[#3B82F6] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-2xs"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                      </svg>
                    </a>
                    <a
                      href="#instagram"
                      aria-label="Instagram"
                      className="w-7 h-7 rounded-full bg-[#F06277] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-2xs"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                      </svg>
                    </a>
                    <a
                      href="#youtube"
                      aria-label="YouTube"
                      className="w-7 h-7 rounded-full bg-[#EF4444] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-2xs"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                        <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="white" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              {/* Central 5 Columns - Desktop only (md and up) */}
              <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-5 gap-8 sm:gap-6 flex-1 w-full self-start pt-2">
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

                {/* Column 5: CONTACT US - Desktop only */}
                <div className="space-y-3">
                  <h5 className="text-xs sm:text-sm font-extrabold text-[#1E293B] tracking-wider uppercase">
                    CONTACT US
                  </h5>
                  <ul className="space-y-2.5 text-xs text-[#64748B]">
                    <li className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-[#F06277] shrink-0 mt-0.5" />
                      <span className="leading-snug font-medium">
                        {settings.store_address}
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-[#34A853] shrink-0" />
                      <a href={`tel:${settings.contact_phone}`} className="hover:text-[#F06277] transition-colors font-medium">
                        {settings.contact_phone}
                      </a>
                    </li>
                    <li className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[#10B981] shrink-0" />
                      <a href={`mailto:${settings.contact_email}`} className="hover:text-[#F06277] transition-colors font-medium">
                        {settings.contact_email}
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            {/* End wrapper for mobile accordions and desktop columns */}

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

          {/* Mobile Giraffe Mascot: decorative accent with animation */}
          <div className="flex md:hidden justify-end items-end pt-4 -mb-3">
            <div className="relative w-24 sm:w-28 shrink-0 animate-sway opacity-85">
              <Image
                src="/giraffe.png"
                alt=""
                width={879}
                height={1216}
                className="w-full h-auto object-contain object-bottom select-none pointer-events-none mix-blend-multiply transition-transform duration-500 hover:scale-110"
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
