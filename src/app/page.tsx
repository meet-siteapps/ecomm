import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShieldCheck, Truck, Heart, Leaf } from 'lucide-react';
import { ProductCard } from '@/components/products/ProductCard';
import { getProducts } from '@/lib/api/products';
import {
  FloatingPastelDecorationsEnhanced,
  WavyDivider,
  HeroGroundShape,
} from '@/components/common/CartoonIllustrations';
import { FloatingStars, FloatingHeartsMinimal } from '@/components/common/DecorativeElements';

export const revalidate = 60; // Revalidate every 60s for fresh real products from Supabase

export default async function HomePage() {
  const featuredProducts = await getProducts({ limit: 8 });

  return (
    <div className="w-full space-y-10 sm:space-y-14 pb-16 animate-fade-in">
      {/* ========================================================= */}
      {/* 1. HERO SECTION WITH SEAMLESS MASCOTS & MATCHING BG       */}
      {/* ========================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FFFEFA] via-[#FFFDF9] to-[#FFFBF5] pt-6 sm:pt-10 lg:pt-16 pb-12 sm:pb-16 lg:pb-24 px-4 sm:px-6 lg:px-8 border-b border-[#F3ECE1]">
        {/* Floating Pastel Decorations */}
        <FloatingPastelDecorationsEnhanced />
        
        {/* Decorative Stars and Hearts */}
        <FloatingStars />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center relative z-10">
          {/* Left Column: Heading, Subtext & Two CTAs */}
          <div className="text-center lg:text-left space-y-5 sm:space-y-6 animate-fade-up">
            <h1 className="text-4xl xs:text-5xl sm:text-6xl lg:text-[62px] font-black text-[#1E293B] tracking-tight leading-[1.12]">
              Made with{' '}
              <span className="text-[#F06277] relative inline-block">
                Love
                {/* Floating Pink Outline Heart */}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#F06277"
                  strokeWidth="2.2"
                  className="w-4 h-4 sm:w-6 sm:h-6 absolute -top-2 -right-5 sm:-right-7 animate-twinkle pointer-events-none"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </span>
              <br />
              For Little Ones
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-[#64748B] max-w-lg mx-auto lg:mx-0 font-medium leading-relaxed">
              Safe, soft and sustainable products for your baby&apos;s happy world.
            </p>

            {/* Two CTAs: Primary Pink Button with Heart + Text Link with Arrow */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 px-7 sm:px-8 py-3.5 sm:py-4 rounded-full bg-[#F06277] hover:bg-[#D9455B] text-white font-extrabold text-sm sm:text-base transition-all duration-300 shadow-[0_6px_20px_-2px_rgba(240,98,119,0.38)] hover:shadow-[0_8px_24px_-2px_rgba(240,98,119,0.48)] active:scale-95 group"
              >
                <span>Shop Now</span>
                <Heart className="w-4 h-4 fill-white text-white group-hover:scale-110 transition-transform duration-200" />
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-1.5 py-3 text-[#1E293B] hover:text-[#F06277] font-extrabold text-sm sm:text-base transition-colors group"
              >
                <span>Explore Categories</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-200" />
              </Link>
            </div>
          </div>

          {/* Right Column: Hero Image - Now Wider with Better Spacing */}
          <div className="flex justify-center items-center lg:justify-end">
            <div className="relative w-full max-w-[500px] sm:max-w-[580px] lg:max-w-[620px] aspect-[4/3] flex items-center justify-center">
              <Image
                src="/heroimg1.png"
                alt="100% Organic & Safe Baby Essentials - Teddy Bear and Penguin under Rainbow"
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 55vw, 620px"
                className="object-contain object-center drop-shadow-lg pointer-events-none select-none animate-fade-in"
              />
            </div>
          </div>
        </div>

        {/* 4 Value Propositions Pill Badges in Hero */}
        <div className="max-w-5xl mx-auto mt-10 sm:mt-14 px-2 relative z-20 animate-fade-up">
          <div className="relative">
            {/* Subtle decorative leaf sprouts on pill ends */}
            <div className="absolute -left-3 top-1/2 -translate-y-1/2 -rotate-45 pointer-events-none hidden sm:block opacity-75">
              <Leaf className="w-5 h-5 text-[#A8C98B] fill-[#A8C98B]" />
            </div>
            <div className="absolute -right-3 top-1/2 -translate-y-1/2 rotate-45 pointer-events-none hidden sm:block opacity-75">
              <Leaf className="w-5 h-5 text-[#A8C98B] fill-[#A8C98B]" />
            </div>

            {/* Clean White Floating Pill Card */}
            <div className="bg-white/95 backdrop-blur-md rounded-3xl sm:rounded-full px-5 sm:px-6 py-4 sm:py-5 border border-[#F3ECE1] shadow-[0_8px_30px_rgb(0,0,0,0.04)] grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-0 lg:divide-x lg:divide-[#F3ECE1] items-center">
              {/* 1. Safe & Certified (Soft Sage Green circle) */}
              <div className="flex items-center gap-3 px-2 sm:px-4">
                <div className="w-10 h-10 rounded-full bg-[#EBF7EE] text-[#34A853] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs sm:text-sm font-extrabold text-[#1E293B] leading-tight">Safe &amp; Certified</h4>
                  <p className="text-[11px] text-[#64748B] font-medium mt-0.5">GOTS Certified Products</p>
                </div>
              </div>

              {/* 2. 100% Organic (Coral Pink circle) */}
              <div className="flex items-center gap-3 px-2 sm:px-4">
                <div className="w-10 h-10 rounded-full bg-[#FDF2F4] text-[#F06277] flex items-center justify-center shrink-0">
                  <Leaf className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs sm:text-sm font-extrabold text-[#1E293B] leading-tight">100% Organic</h4>
                  <p className="text-[11px] text-[#64748B] font-medium mt-0.5">Natural &amp; Gentle Fabric</p>
                </div>
              </div>

              {/* 3. Fast Delivery (Pastel Sky Blue circle) */}
              <div className="flex items-center gap-3 px-2 sm:px-4">
                <div className="w-10 h-10 rounded-full bg-[#EBF5FB] text-[#2B8CE6] flex items-center justify-center shrink-0">
                  <Truck className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs sm:text-sm font-extrabold text-[#1E293B] leading-tight">Fast Delivery</h4>
                  <p className="text-[11px] text-[#64748B] font-medium mt-0.5">Across India</p>
                </div>
              </div>

              {/* 4. Loved by Parents (Pastel Yellow circle) */}
              <div className="flex items-center gap-3 px-2 sm:px-4">
                <div className="w-10 h-10 rounded-full bg-[#FEF9E8] text-[#EAB308] flex items-center justify-center shrink-0">
                  <Heart className="w-5 h-5 fill-[#EAB308] stroke-[2.2]" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs sm:text-sm font-extrabold text-[#1E293B] leading-tight">Loved by Parents</h4>
                  <p className="text-[11px] text-[#64748B] font-medium mt-0.5">Trusted by Thousands</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ground/Sand Shape with Bushes at Bottom of Hero */}
        <HeroGroundShape />
      </section>

      {/* Wavy Divider: Hero → Featured Products */}
      <div className="bg-[#FFFBF5]">
        <WavyDivider topColor="#FFFBF5" bottomColor="#FFFFFF" />
      </div>

      {/* ========================================================= */}
      {/* 2. FEATURED REAL PRODUCTS GRID                            */}
      {/* ========================================================= */}
      <section className="bg-white py-10 sm:py-14 relative">
        {/* Minimal decorative hearts */}
        <FloatingHeartsMinimal />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-up relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#1E293B] tracking-tight">
                Featured Products
              </h2>
              <p className="text-xs sm:text-sm text-[#64748B] mt-0.5 font-medium">
                Curated essentials for your little one
              </p>
            </div>
            <Link
              href="/products"
              className="text-xs sm:text-sm font-bold text-[#F06277] hover:text-[#D9455B] flex items-center gap-1 transition-colors group"
            >
              <span>See All</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-5">
              {featuredProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 px-4 bg-[#FFFEFA] rounded-3xl border border-[#F3ECE1] shadow-cute">
              <p className="text-xs text-[#64748B] font-medium">No products added to catalog yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Wavy Divider: Featured Products → Promotional Banner */}
      <div className="bg-white">
        <WavyDivider topColor="#FFFFFF" bottomColor="#FFFBF5" />
      </div>

      {/* ========================================================= */}
      {/* 3. SOFT PASTEL PROMOTIONAL BANNER                         */}
      {/* ========================================================= */}
      <section className="bg-[#FFFBF5] py-10 sm:py-14 relative">
        {/* Decorative sparkles */}
        <FloatingStars className="opacity-60" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="relative rounded-3xl bg-gradient-to-br from-[#FFFEFA] via-[#FDF2F4] to-[#EBF7EE] p-8 sm:p-12 overflow-hidden border border-[#F3ECE1] shadow-[0_10px_28px_-4px_rgba(30,41,59,0.06)] hover:shadow-cute transition-shadow duration-300 flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Subtle decorative accents in background */}
            <div className="absolute top-6 right-8 opacity-25 pointer-events-none animate-float">
              <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
                <circle cx="20" cy="20" r="18" fill="#F06277" opacity="0.3" />
                <circle cx="20" cy="20" r="12" fill="#F06277" opacity="0.2" />
              </svg>
            </div>
            <div className="absolute bottom-8 left-12 opacity-20 pointer-events-none animate-twinkle" style={{ animationDelay: '1s' }}>
              <svg viewBox="0 0 24 24" fill="#A8C98B" className="w-6 h-6">
                <path d="M12 2l2.4 7.4h7.6l-6.2 4.5 2.4 7.4-6.2-4.5-6.2 4.5 2.4-7.4-6.2-4.5h7.6z" />
              </svg>
            </div>
            <div className="absolute top-1/2 right-16 opacity-15 pointer-events-none hidden lg:block">
              <svg viewBox="0 0 24 24" fill="#8FD3E8" className="w-5 h-5">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>

            <div className="space-y-3 text-center md:text-left max-w-xl relative z-10">
              <span className="inline-block text-xs font-extrabold uppercase tracking-wider text-[#F06277] bg-white/90 backdrop-blur-xs px-3.5 py-1.5 rounded-full shadow-2xs border border-[#F06277]/20">
                Welcome Offer ✨
              </span>
              <h3 className="text-2xl sm:text-4xl font-black tracking-tight text-[#1E293B]">
                Enjoy Up to 30% Off on Best Sellers
              </h3>
              <p className="text-xs sm:text-sm text-[#64748B] font-medium leading-relaxed">
                Upgrade your little one&apos;s daily wardrobe and play collection with clean, safe, and premium essentials.
              </p>
            </div>

            <Link
              href="/products?sort=discount"
              className="shrink-0 px-8 py-3.5 rounded-full bg-[#F06277] hover:bg-[#D9455B] text-white font-extrabold text-sm transition-all duration-300 shadow-[0_6px_20px_-2px_rgba(240,98,119,0.38)] hover:shadow-[0_8px_24px_-2px_rgba(240,98,119,0.48)] active:scale-95 relative z-10"
            >
              Explore Deals
            </Link>
          </div>
        </div>
      </section>
      
      {/* Final divider before footer */}
      <div className="bg-[#FFFBF5]">
        <WavyDivider topColor="#FFFBF5" bottomColor="#FFFEFA" />
      </div>
    </div>
  );
}
