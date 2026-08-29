'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/products/ProductCard';
import { getProducts } from '@/lib/supabase/products';
import { Product } from '@/types/product';
import { SAMPLE_CATEGORIES } from '@/data/sampleProducts';
import { Search, SlidersHorizontal, X, ArrowUpDown, Loader2 } from 'lucide-react';

const AGE_GROUPS = ['All Ages', '0–12 Months', '1–4 Years', '6–18 Months', '6+ Months'];
const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'discount', label: 'Biggest Discount' },
];

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || 'all';

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedAge, setSelectedAge] = useState('All Ages');
  const [maxPrice, setMaxPrice] = useState<number>(4000);
  const [sortBy, setSortBy] = useState('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Sync URL search params if changed
  useEffect(() => {
    if (searchParams.get('search')) {
      setSearch(searchParams.get('search') || '');
    }
    if (searchParams.get('category')) {
      setSelectedCategory(searchParams.get('category') || 'all');
    }
  }, [searchParams]);

  // Load products from Supabase
  useEffect(() => {
    let isMounted = true;
    async function load() {
      setIsLoading(true);
      try {
        const data = await getProducts();
        if (isMounted) {
          setProducts(data);
        }
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter and Sort Logic in memory over loaded database products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Search query
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesBrand = product.brand.toLowerCase().includes(query);
        const matchesCat = product.category.toLowerCase().includes(query);
        if (!matchesName && !matchesBrand && !matchesCat) return false;
      }

      // Category
      if (selectedCategory !== 'all') {
        if (product.category.toLowerCase() !== selectedCategory.toLowerCase()) {
          return false;
        }
      }

      // Age group
      if (selectedAge !== 'All Ages') {
        if (!product.age_group || !product.age_group.toLowerCase().includes(selectedAge.toLowerCase().slice(0, 4))) {
          return false;
        }
      }

      // Price range
      if (product.price > maxPrice) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'discount') return b.discount - a.discount;
      return 0; // default featured
    });
  }, [products, search, selectedCategory, selectedAge, maxPrice, sortBy]);

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setSelectedAge('All Ages');
    setMaxPrice(4000);
    setSortBy('featured');
  };

  const hasActiveFilters =
    search !== '' || selectedCategory !== 'all' || selectedAge !== 'All Ages' || maxPrice < 4000;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Header & Search / Sort controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#EFE7DE]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2D3748] tracking-tight">
            All Products
          </h1>
          <p className="text-xs sm:text-sm text-[#718096] mt-1 font-medium">
            {isLoading
              ? 'Loading products...'
              : `Showing ${filteredProducts.length} ${filteredProducts.length === 1 ? 'product' : 'products'}`}
          </p>
        </div>

        {/* Mobile Filter Toggle & Sort selector */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Mobile Filter Button */}
          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(true)}
            className="flex-1 md:hidden inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-white border border-[#EFE7DE] text-sm font-bold text-[#2D3748] shadow-cute active:bg-gray-50"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#FF6B8B]" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-[#FF6B8B]" />
            )}
          </button>

          {/* Sort Dropdown */}
          <div className="relative flex-1 md:w-48">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full appearance-none bg-white text-xs sm:text-sm font-bold text-[#2D3748] rounded-full pl-4 pr-9 py-2.5 border border-[#EFE7DE] focus:border-[#FF6B8B] focus:outline-none focus:ring-2 focus:ring-[#FF6B8B]/20 shadow-cute cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Main Content Grid: Sidebar + Product Cards */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block lg:col-span-1 bg-white p-6 rounded-3xl border border-[#EFE7DE] shadow-cute space-y-6 sticky top-24">
          <div className="flex items-center justify-between border-b border-[#EFE7DE]/70 pb-3">
            <h2 className="text-xs font-extrabold text-[#2D3748] uppercase tracking-wider flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#FF6B8B]" />
              Filters
            </h2>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs text-[#FF6B8B] hover:underline font-bold"
              >
                Reset All
              </button>
            )}
          </div>

          {/* Search Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#2D3748]">Search</label>
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Product name, brand..."
                className="w-full bg-[#FAF7F2] text-xs text-[#2D3748] placeholder-gray-400 rounded-full pl-9 pr-3.5 py-2.5 border border-[#EFE7DE] focus:border-[#FF6B8B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B8B]/20"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#2D3748]">Category</label>
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left px-3.5 py-2 rounded-2xl text-xs font-bold transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-[#FFEAEF] text-[#FF6B8B]'
                    : 'text-[#718096] hover:bg-[#FAF7F2] hover:text-[#2D3748]'
                }`}
              >
                All Categories
              </button>
              {SAMPLE_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`w-full text-left px-3.5 py-2 rounded-2xl text-xs font-bold transition-all ${
                    selectedCategory.toLowerCase() === cat.name.toLowerCase()
                      ? 'bg-[#FFEAEF] text-[#FF6B8B]'
                      : 'text-[#718096] hover:bg-[#FAF7F2] hover:text-[#2D3748]'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Age Group Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#2D3748]">Age Group</label>
            <div className="space-y-1">
              {AGE_GROUPS.map((age) => (
                <button
                  key={age}
                  type="button"
                  onClick={() => setSelectedAge(age)}
                  className={`w-full text-left px-3.5 py-2 rounded-2xl text-xs font-bold transition-all ${
                    selectedAge === age
                      ? 'bg-[#F3E8FF] text-[#8B5CF6]'
                      : 'text-[#718096] hover:bg-[#FAF7F2] hover:text-[#2D3748]'
                  }`}
                >
                  {age}
                </button>
              ))}
            </div>
          </div>

          {/* Max Price Filter */}
          <div className="space-y-2 pt-2 border-t border-[#EFE7DE]/70">
            <div className="flex items-center justify-between text-xs font-bold text-[#2D3748]">
              <span>Max Price</span>
              <span className="text-[#FF6B8B] font-extrabold">₹{maxPrice.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min={500}
              max={4000}
              step={100}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#FF6B8B] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-bold text-[#A0AEC0]">
              <span>₹500</span>
              <span>₹4,000</span>
            </div>
          </div>
        </aside>

        {/* Product Cards Grid Area */}
        <section className="lg:col-span-3">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin text-[#FF6B8B]" />
              <span className="text-xs font-bold text-[#718096]">Fetching catalog...</span>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 px-4 bg-white rounded-3xl border border-[#EFE7DE] shadow-cute space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#FFEAEF] text-[#FF6B8B] flex items-center justify-center mx-auto shadow-2xs">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-[#2D3748]">No products found</h3>
              <p className="text-xs text-[#718096] max-w-sm mx-auto font-medium">
                We couldn&apos;t find any products matching your selected filters. Try searching with different keywords or resetting filters.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="px-6 py-2.5 text-xs font-bold bg-[#FF6B8B] text-white rounded-full hover:bg-[#FA5578] transition-all shadow-cute-pink active:scale-95"
              >
                Clear all filters
              </button>
            </div>
          )}
        </section>
      </div>

      {/* Mobile Filters Drawer Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="relative z-10 w-full max-w-xs h-full bg-[#FAF7F2] shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
            <div className="p-5 space-y-6">
              <div className="flex items-center justify-between border-b border-[#EFE7DE] pb-3 bg-white p-3 rounded-2xl shadow-2xs">
                <h3 className="font-extrabold text-base text-[#2D3748] flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#FF6B8B]" />
                  Filter Products
                </h3>
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 text-gray-500 hover:bg-[#FFEAEF] hover:text-[#FF6B8B] rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Category Filter */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#2D3748]">Category</label>
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('all')}
                    className={`w-full text-left px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                      selectedCategory === 'all'
                        ? 'bg-[#FFEAEF] text-[#FF6B8B]'
                        : 'text-[#718096] bg-white'
                    }`}
                  >
                    All Categories
                  </button>
                  {SAMPLE_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.name)}
                      className={`w-full text-left px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                        selectedCategory.toLowerCase() === cat.name.toLowerCase()
                          ? 'bg-[#FFEAEF] text-[#FF6B8B]'
                          : 'text-[#718096] bg-white'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Age Filter */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#2D3748]">Age Group</label>
                <div className="space-y-1">
                  {AGE_GROUPS.map((age) => (
                    <button
                      key={age}
                      type="button"
                      onClick={() => setSelectedAge(age)}
                      className={`w-full text-left px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                        selectedAge === age
                          ? 'bg-[#F3E8FF] text-[#8B5CF6]'
                          : 'text-[#718096] bg-white'
                      }`}
                    >
                      {age}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Price Slider */}
              <div className="space-y-2 bg-white p-4 rounded-2xl border border-[#EFE7DE]">
                <div className="flex items-center justify-between text-xs font-bold text-[#2D3748]">
                  <span>Max Price</span>
                  <span className="text-[#FF6B8B] font-extrabold">₹{maxPrice.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min={500}
                  max={4000}
                  step={100}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#FF6B8B]"
                />
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-[#EFE7DE] bg-white flex gap-2">
              <button
                type="button"
                onClick={clearFilters}
                className="flex-1 py-3 rounded-full border border-[#EFE7DE] text-xs font-bold text-[#718096] bg-[#FAF7F2]"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 py-3 rounded-full bg-[#FF6B8B] text-white text-xs font-extrabold shadow-cute-pink"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-gray-500">Loading catalog...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
