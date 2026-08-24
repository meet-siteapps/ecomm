import Link from 'next/link';
import { ShoppingBag, ArrowRight, Sparkles, Tag } from 'lucide-react';
import { SAMPLE_CATEGORIES } from '@/data/sampleProducts';
import { ProductCard } from '@/components/products/ProductCard';
import { getProducts } from '@/lib/supabase/products';

export const revalidate = 60; // Revalidate every 60s for fresh products

export default async function HomePage() {
  const featuredProducts = await getProducts({ limit: 4 });

  return (
    <div className="w-full space-y-12 sm:space-y-16 pb-12">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#EAF6FF]/70 via-[#EAF6FF]/30 to-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-[#4DA3FF] text-xs font-bold tracking-wide border border-[#4DA3FF]/20 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Essential Quality For Little Ones</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-[#1F2937] tracking-tight leading-tight">
            Curated Products, <br className="hidden sm:inline" />
            <span className="text-[#4DA3FF]">Designed with Care</span>
          </h1>

          <p className="text-sm sm:text-lg text-gray-600 max-w-2xl mx-auto font-normal leading-relaxed">
            Discover thoughtfully selected clothing, toys, nursery essentials, and accessories made for comfort and durability.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/products"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[#4DA3FF] hover:bg-[#2B8BE6] text-white font-bold text-sm transition-all shadow-xs hover:shadow-md active:scale-98"
            >
              <span>Shop All Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/products?sort=discount"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white hover:bg-gray-50 text-[#1F2937] font-semibold text-sm border border-gray-200 hover:border-gray-300 transition-all shadow-xs active:scale-98"
            >
              <Tag className="w-4 h-4 text-[#4DA3FF]" />
              <span>Special Offers</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. SHOP BY CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1F2937] tracking-tight">
              Shop by Category
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Explore our handpicked collection by department
            </p>
          </div>
          <Link
            href="/products"
            className="text-xs sm:text-sm font-semibold text-[#4DA3FF] hover:text-[#2B8BE6] flex items-center gap-1 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {SAMPLE_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${encodeURIComponent(cat.name)}`}
              className="group p-4 rounded-2xl bg-white border border-gray-200/80 hover:border-[#4DA3FF] hover:bg-[#EAF6FF]/30 shadow-xs hover:shadow-md transition-all flex flex-col items-center text-center gap-2.5 active:scale-95"
            >
              <div className="w-12 h-12 rounded-xl bg-[#EAF6FF] text-[#4DA3FF] group-hover:bg-[#4DA3FF] group-hover:text-white flex items-center justify-center transition-colors shadow-2xs">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-[#1F2937] group-hover:text-[#4DA3FF] transition-colors line-clamp-1">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1F2937] tracking-tight">
              Featured Products
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Top customer favorites this season
            </p>
          </div>
          <Link
            href="/products"
            className="text-xs sm:text-sm font-semibold text-[#4DA3FF] hover:text-[#2B8BE6] flex items-center gap-1 transition-colors"
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

      {/* 4. SIMPLE PROMOTIONAL SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-[#1F2937] to-[#111827] text-white p-8 sm:p-12 overflow-hidden shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-left max-w-xl">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-[#4DA3FF] bg-[#4DA3FF]/10 px-3 py-1 rounded-full">
              Limited Time Welcome Offer
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Enjoy Up to 30% Off on Best Sellers
            </h3>
            <p className="text-xs sm:text-sm text-gray-300">
              Upgrade your little one&apos;s daily wardrobe and play collection with clean, safe, and premium essentials.
            </p>
          </div>

          <Link
            href="/products"
            className="shrink-0 px-8 py-3.5 rounded-xl bg-[#4DA3FF] hover:bg-[#2B8BE6] text-white font-bold text-sm transition-all shadow-md active:scale-98"
          >
            Explore Deals
          </Link>
        </div>
      </section>
    </div>
  );
}
