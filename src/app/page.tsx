import Link from 'next/link';
import { ArrowRight, Sparkles, Tag, Heart } from 'lucide-react';
import { ProductCard } from '@/components/products/ProductCard';
import { getProducts } from '@/lib/supabase/products';

export const revalidate = 60; // Revalidate every 60s for fresh products

import {
  HeroCharactersIllustration,
  FloatingPastelDecorations,
} from '@/components/common/CartoonIllustrations';
import { ShieldCheck, Truck, HeartHandshake, Leaf } from 'lucide-react';

export default async function HomePage() {
  const featuredProducts = await getProducts({ limit: 4 });

  return (
    <div className="w-full space-y-12 sm:space-y-16 pb-16">
      {/* 1. HERO SECTION WITH STORYBOOK CARTOON ILLUSTRATIONS */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF5F7] via-[#FDF8F3] to-[#FAF7F2] pt-12 pb-16 sm:pt-16 sm:pb-20 px-4 sm:px-6 lg:px-8 border-b border-[#EFE7DE]/80">
        {/* Floating Cartoon Decorations (Stars, Hearts, Clouds, Sparkles) */}
        <FloatingPastelDecorations />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center relative z-10">
          {/* Left Column: Heading & CTAs */}
          <div className="lg:col-span-6 text-center lg:text-left space-y-5">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-[#FF6B8B] text-xs font-extrabold tracking-wide border border-[#FFEAEF] shadow-cute">
              <Sparkles className="w-4 h-4 text-[#FF6B8B]" />
              <span>Safe &amp; Gentle For Little Ones ✨</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#2D3748] tracking-tight leading-[1.15]">
              Made with <span className="text-[#FF6B8B]">Love</span> <br />
              For Little Ones
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-[#718096] max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
              Safe, soft and sustainable products for your baby&apos;s happy world. Curated clothing, gentle fabrics, and adorable essentials.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
              <Link
                href="/products"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#FF6B8B] hover:bg-[#FA5578] text-white font-extrabold text-sm transition-all shadow-cute-pink active:scale-98"
              >
                <span>Shop Now</span>
                <Heart className="w-4 h-4 fill-white" />
              </Link>
              <Link
                href="/products?sort=discount"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white hover:bg-[#FAF7F2] text-[#2D3748] font-bold text-sm border border-[#EFE7DE] transition-all shadow-cute active:scale-98"
              >
                <span>Explore Categories</span>
                <ArrowRight className="w-4 h-4 text-[#FF6B8B]" />
              </Link>
            </div>
          </div>

          {/* Right Column: Cute Storybook Cartoon Characters (Teddy & Penguin under Rainbow) */}
          <div className="lg:col-span-6 flex justify-center items-center">
            <HeroCharactersIllustration className="w-full max-w-md sm:max-w-lg lg:max-w-xl" />
          </div>
        </div>

        {/* Floating Value Propositions Pill Card in Hero */}
        <div className="max-w-5xl mx-auto mt-8 sm:mt-12 px-2 relative z-20">
          <div className="bg-white/95 backdrop-blur-md rounded-3xl sm:rounded-full p-4 sm:p-5 border border-[#EFE7DE] shadow-cute-lg grid grid-cols-2 sm:grid-cols-4 gap-4 items-center justify-between divide-y sm:divide-y-0 sm:divide-x divide-[#EFE7DE]">
            {/* 1. Safe & Certified */}
            <div className="flex items-center gap-3 px-2 pt-2 sm:pt-0 first:pt-0">
              <div className="w-10 h-10 rounded-2xl bg-[#D1FAE5] text-[#059669] flex items-center justify-center shrink-0 shadow-2xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="text-xs sm:text-sm font-extrabold text-[#2D3748] leading-tight">Safe &amp; Certified</h4>
                <p className="text-[10px] sm:text-xs text-[#718096] font-medium mt-0.5">Gentle on skin</p>
              </div>
            </div>

            {/* 2. 100% Organic */}
            <div className="flex items-center gap-3 px-2 pt-2 sm:pt-0">
              <div className="w-10 h-10 rounded-2xl bg-[#FFEAEF] text-[#FF6B8B] flex items-center justify-center shrink-0 shadow-2xs">
                <Leaf className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="text-xs sm:text-sm font-extrabold text-[#2D3748] leading-tight">100% Organic</h4>
                <p className="text-[10px] sm:text-xs text-[#718096] font-medium mt-0.5">Natural fabrics</p>
              </div>
            </div>

            {/* 3. Fast Delivery */}
            <div className="flex items-center gap-3 px-2 pt-2 sm:pt-0">
              <div className="w-10 h-10 rounded-2xl bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center shrink-0 shadow-2xs">
                <Truck className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="text-xs sm:text-sm font-extrabold text-[#2D3748] leading-tight">Fast Delivery</h4>
                <p className="text-[10px] sm:text-xs text-[#718096] font-medium mt-0.5">Across India</p>
              </div>
            </div>

            {/* 4. Loved by Parents */}
            <div className="flex items-center gap-3 px-2 pt-2 sm:pt-0">
              <div className="w-10 h-10 rounded-2xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shrink-0 shadow-2xs">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="text-xs sm:text-sm font-extrabold text-[#2D3748] leading-tight">Loved by Parents</h4>
                <p className="text-[10px] sm:text-xs text-[#718096] font-medium mt-0.5">5-Star Quality</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#2D3748] tracking-tight">
              Featured Products
            </h2>
            <p className="text-xs sm:text-sm text-[#718096] mt-0.5 font-medium">
              Top customer favorites this season
            </p>
          </div>
          <Link
            href="/products"
            className="text-xs sm:text-sm font-bold text-[#FF6B8B] hover:text-[#FA5578] flex items-center gap-1 transition-colors"
          >
            <span>See More</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
          {featuredProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* 4. PROMOTIONAL SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-[#FF6B8B] via-[#FA7070] to-[#A78BFA] text-white p-8 sm:p-12 overflow-hidden shadow-cute-pink flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Subtle circles */}
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/15 blur-xl pointer-events-none" />

          <div className="space-y-3 text-center md:text-left max-w-xl relative z-10">
            <span className="inline-block text-xs font-extrabold uppercase tracking-wider text-white bg-white/20 backdrop-blur-xs px-3.5 py-1 rounded-full shadow-2xs">
              Limited Time Welcome Offer ✨
            </span>
            <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Enjoy Up to 30% Off on Best Sellers
            </h3>
            <p className="text-xs sm:text-sm text-white/90 font-medium">
              Upgrade your little one&apos;s daily wardrobe and play collection with clean, safe, and premium essentials.
            </p>
          </div>

          <Link
            href="/products"
            className="shrink-0 px-8 py-4 rounded-full bg-white hover:bg-[#FAF7F2] text-[#FF6B8B] font-extrabold text-sm transition-all shadow-cute active:scale-98 relative z-10"
          >
            Explore Deals
          </Link>
        </div>
      </section>
    </div>
  );
}
