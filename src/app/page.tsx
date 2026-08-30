import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShieldCheck, Truck, HeartHandshake, Leaf } from 'lucide-react';
import { ProductCard } from '@/components/products/ProductCard';
import { getProducts } from '@/lib/supabase/products';
import { FloatingPastelDecorations } from '@/components/common/CartoonIllustrations';

export const revalidate = 60; // Revalidate every 60s for fresh real products from Supabase

export default async function HomePage() {
  const featuredProducts = await getProducts({ limit: 8 });

  return (
    <div className="w-full space-y-12 sm:space-y-16 pb-16">
      {/* ========================================================= */}
      {/* 1. HERO SECTION WITH HEROIMG1.PNG & MATCHING BACKGROUND   */}
      {/* ========================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FDF8F3] via-[#FAF4EE] to-[#FAF4EE] pt-6 sm:pt-10 lg:pt-14 pb-12 sm:pb-16 lg:pb-20 px-4 sm:px-6 lg:px-8 border-b border-[#EFE4D6]/80">
        {/* Floating Pastel Decorations */}
        <FloatingPastelDecorations />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center relative z-10">
          {/* Left Column: Heading & CTAs */}
          <div className="lg:col-span-6 text-center lg:text-left space-y-4 sm:space-y-6">
            <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#193653] tracking-tight leading-[1.15] sm:leading-[1.12]">
              Made with{' '}
              <span className="text-[#F27A8A] relative inline-block">
                Love
                {/* Tiny Floating Pink Outline Heart */}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#F27A8A"
                  strokeWidth="2"
                  className="w-4 h-4 sm:w-6 sm:h-6 absolute -top-2 -right-5 sm:-right-7 animate-twinkle"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </span>
              <br />
              For Little Ones
            </h1>

            <p className="text-xs sm:text-base lg:text-lg text-[#5D7285] max-w-lg mx-auto lg:mx-0 font-medium leading-relaxed">
              Safe, soft and sustainable products for your baby&apos;s happy world. Curated clothing, gentle fabrics, and adorable essentials.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full bg-[#F27A8A] hover:bg-[#e06878] text-white font-extrabold text-xs sm:text-sm transition-all shadow-cute-pink active:scale-98"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/products?sort=discount"
                className="inline-flex items-center justify-center gap-1.5 px-4 sm:px-6 py-3 sm:py-3.5 rounded-full bg-transparent hover:bg-[#FDE8EB]/50 text-[#F27A8A] font-bold text-xs sm:text-sm transition-all active:scale-98"
              >
                <span>Explore Deals</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: Uploaded Hero Image (heroimg1.png) */}
          <div className="lg:col-span-6 flex justify-center items-center">
            <div className="relative w-full max-w-[360px] xs:max-w-[420px] sm:max-w-lg lg:max-w-xl aspect-[16/10] sm:aspect-[16/9] rounded-3xl overflow-hidden shadow-cute-lg border border-[#EFE4D6]/60 bg-[#FAF4EE] group hover:scale-[1.02] transition-transform duration-300">
              <Image
                src="/heroimg1.png"
                alt="100% Organic & Safe Baby Essentials - Teddy Bear and Penguin under Rainbow"
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                className="object-contain object-center"
              />
            </div>
          </div>
        </div>

        {/* 4 Value Propositions Pill Badges in Hero */}
        <div className="max-w-5xl mx-auto mt-8 sm:mt-12 px-2 relative z-20">
          <div className="bg-white/95 backdrop-blur-md rounded-3xl sm:rounded-full p-3.5 sm:p-4 border border-[#EFE4D6] shadow-cute-lg grid grid-cols-2 sm:grid-cols-4 gap-3 items-center justify-between">
            {/* 1. Safe & Certified (Soft Sage) */}
            <div className="flex items-center gap-2.5 px-2">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#EFF7E9] text-[#729c50] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="text-left">
                <h4 className="text-xs sm:text-sm font-extrabold text-[#193653] leading-tight">Safe &amp; Certified</h4>
              </div>
            </div>

            {/* 2. 100% Organic (Coral Pink) */}
            <div className="flex items-center gap-2.5 px-2">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#FDE8EB] text-[#F27A8A] flex items-center justify-center shrink-0">
                <Leaf className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="text-left">
                <h4 className="text-xs sm:text-sm font-extrabold text-[#193653] leading-tight">100% Organic</h4>
              </div>
            </div>

            {/* 3. Fast Delivery (Pastel Sky Blue) */}
            <div className="flex items-center gap-2.5 px-2">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#EBF8FC] text-[#3599b8] flex items-center justify-center shrink-0">
                <Truck className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="text-left">
                <h4 className="text-xs sm:text-sm font-extrabold text-[#193653] leading-tight">Fast Delivery</h4>
              </div>
            </div>

            {/* 4. Loved by Parents (Pastel Yellow) */}
            <div className="flex items-center gap-2.5 px-2">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#FEF9E8] text-[#E0B538] flex items-center justify-center shrink-0">
                <HeartHandshake className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="text-left">
                <h4 className="text-xs sm:text-sm font-extrabold text-[#193653] leading-tight">Loved by Parents</h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. FEATURED REAL PRODUCTS GRID                            */}
      {/* ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-[#193653] tracking-tight">
              Featured Products
            </h2>
            <p className="text-xs text-[#5D7285] mt-0.5 font-medium">
              Curated essentials for your little one
            </p>
          </div>
          <Link
            href="/products"
            className="text-xs sm:text-sm font-bold text-[#F27A8A] hover:text-[#e06878] flex items-center gap-1 transition-colors"
          >
            <span>See All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-5">
            {featuredProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 px-4 bg-white rounded-3xl border border-[#EFE4D6] shadow-cute">
            <p className="text-xs text-[#5D7285] font-medium">No products added to catalog yet.</p>
          </div>
        )}
      </section>

      {/* ========================================================= */}
      {/* 3. SOFT PASTEL PROMOTIONAL BANNER                         */}
      {/* ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-[#F27A8A] via-[#F6929F] to-[#8FD3E8] text-white p-8 sm:p-12 overflow-hidden shadow-cute-pink flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-left max-w-xl relative z-10">
            <span className="inline-block text-xs font-extrabold uppercase tracking-wider text-white bg-white/20 backdrop-blur-xs px-3.5 py-1 rounded-full shadow-2xs">
              Welcome Offer ✨
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
            className="shrink-0 px-8 py-3.5 rounded-full bg-white hover:bg-[#FAF4EE] text-[#F27A8A] font-extrabold text-sm transition-all shadow-cute active:scale-98 relative z-10"
          >
            Explore Deals
          </Link>
        </div>
      </section>
    </div>
  );
}
