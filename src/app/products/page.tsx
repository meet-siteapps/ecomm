'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductCard } from '@/frontend/components/products/ProductCard';
import { getProducts } from '@/backend/products/products';
import { Product } from '@/frontend/types/product';
import { SAMPLE_CATEGORIES } from '@/frontend/lib/constants';
import { Search, SlidersHorizontal, X, ChevronDown, Loader2 } from 'lucide-react';

const AGE_RANGES = ['0-6 Months', '6-12 Months', '1-2 Years', '2-4 Years'];
const SORT_OPTIONS = [
  { value: 'popular', label: 'Popular' },
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
  const [selectedAges, setSelectedAges] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(4000);
  const [sortBy, setSortBy] = useState('popular');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (searchParams.get('search')) {
      setSearch(searchParams.get('search') || '');
    }
    if (searchParams.get('category')) {
      setSelectedCategory(searchParams.get('category') || 'all');
    }
  }, [searchParams]);

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

  const toggleAge = (age: string) => {
    if (selectedAges.includes(age)) {
      setSelectedAges(selectedAges.filter((a) => a !== age));
    } else {
      setSelectedAges([...selectedAges, age]);
    }
  };

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        if (search.trim()) {
          const query = search.toLowerCase();
          const matchesName = product.name.toLowerCase().includes(query);
          const matchesBrand = product.brand.toLowerCase().includes(query);
          const matchesCat = product.category.toLowerCase().includes(query);
          if (!matchesName && !matchesBrand && !matchesCat) return false;
        }

        if (selectedCategory !== 'all') {
          if (product.category.toLowerCase() !== selectedCategory.toLowerCase()) {
            return false;
          }
        }

        if (selectedAges.length > 0) {
          const hasMatchingAge = selectedAges.some((age) => {
            const prefix = age.slice(0, 3);
            return product.age_group && product.age_group.includes(prefix);
          });
          if (!hasMatchingAge) return false;
        }

        if (product.price > maxPrice) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'discount') return b.discount - a.discount;
        return 0;
      });
  }, [products, search, selectedCategory, selectedAges, maxPrice, sortBy]);

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setSelectedAges([]);
    setMaxPrice(4000);
    setSortBy('popular');
  };

  const hasActiveFilters =
    search !== '' || selectedCategory !== 'all' || selectedAges.length > 0 || maxPrice < 4000;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT FILTER SIDEBAR */}
        <aside className="hidden lg:block lg:col-span-3 space-y-6 sticky top-24 bg-white/60 backdrop-blur-xs p-5 rounded-3xl border border-[#EFE6DA] shadow-2xs">
          <div className="space-y-3">
            <h3 className="text-sm font-extrabold text-[#193653]">Categories</h3>
            <div className="space-y-1 text-xs">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`block w-full text-left px-3 py-2 rounded-xl font-bold transition-all duration-200 ${
                  selectedCategory === 'all'
                    ? 'bg-[#FFD6E0] text-[#F27A8A] shadow-2xs'
                    : 'text-[#5D7285] hover:text-[#193653] hover:bg-[#FAF4EE]'
                }`}
              >
                All Categories
              </button>
              {SAMPLE_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`block w-full text-left px-3 py-2 rounded-xl font-bold transition-all duration-200 ${
                    selectedCategory.toLowerCase() === cat.name.toLowerCase()
                      ? 'bg-[#FFD6E0] text-[#F27A8A] shadow-2xs'
                      : 'text-[#5D7285] hover:text-[#193653] hover:bg-[#FAF4EE]'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-[#EFE6DA]">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-[#193653]">Filters</h3>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-xs text-[#F27A8A] hover:underline font-bold transition-colors"
                >
                  Reset
                </button>
              )}
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-[#5D7285]">Age</span>
              <div className="space-y-2">
                {AGE_RANGES.map((age) => {
                  const isChecked = selectedAges.includes(age);
                  return (
                    <label
                      key={age}
                      className="flex items-center gap-2 text-xs text-[#5D7285] cursor-pointer hover:text-[#193653] select-none transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleAge(age)}
                        className="w-4 h-4 rounded-md border-[#EFE6DA] text-[#F27A8A] focus:ring-[#F27A8A]/20 accent-[#F27A8A] cursor-pointer transition-transform duration-150 active:scale-90"
                      />
                      <span>{age}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs text-[#5D7285] font-bold">
                <span>Price</span>
                <span className="text-[#193653]">₹{maxPrice.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min={500}
                max={4000}
                step={100}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#F27A8A] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-[#5D7285] font-medium">
                <span>₹0</span>
                <span>₹4000</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-[#5D7285]">Sort by</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full appearance-none bg-white text-xs font-semibold text-[#193653] rounded-xl pl-3.5 pr-8 py-2 border border-[#EFE6DA] focus:border-[#F27A8A] focus:outline-none cursor-pointer transition-colors shadow-2xs"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        </aside>

        {/* RIGHT PRODUCTS GRID AREA */}
        <main className="lg:col-span-9 space-y-6">
          <div className="flex items-center justify-between gap-4 pb-2">
            <p className="text-xs sm:text-sm text-[#5D7285] font-medium">
              {isLoading
                ? 'Loading products...'
                : `Showing 1-${Math.min(filteredProducts.length, 12)} of ${filteredProducts.length} products`}
            </p>

            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-[#EFE6DA] text-xs font-bold text-[#193653] shadow-2xs hover:border-[#F27A8A]/40 active:scale-95 transition-all"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#F27A8A]" />
              <span>Filters</span>
              {hasActiveFilters && <span className="w-1.5 h-1.5 rounded-full bg-[#F27A8A]" />}
            </button>

            <div className="hidden lg:flex items-center gap-2">
              <span className="text-xs text-[#5D7285] font-medium">Sort by:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white text-xs font-semibold text-[#193653] rounded-full pl-3.5 pr-8 py-1.5 border border-[#EFE6DA] focus:border-[#F27A8A] focus:outline-none cursor-pointer shadow-2xs hover:border-[#F27A8A]/40 transition-colors"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin text-[#F27A8A]" />
              <span className="text-xs font-bold text-[#5D7285]">Loading catalog...</span>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-5">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 px-4 bg-white rounded-3xl border border-[#EFE6DA] shadow-cute space-y-4 animate-fade-up">
              <div className="w-14 h-14 rounded-2xl bg-[#FDE8EB] text-[#F27A8A] flex items-center justify-center mx-auto shadow-2xs">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-[#193653]">No products found</h3>
              <p className="text-xs text-[#5D7285] max-w-sm mx-auto font-medium">
                We couldn&apos;t find any products matching your filters. Try selecting different categories or clearing filters.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="px-6 py-2.5 text-xs font-bold bg-[#F27A8A] text-white rounded-full hover:bg-[#e06878] transition-all shadow-cute-pink active:scale-95 hover:shadow-cute-pink-hover"
              >
                Clear all filters
              </button>
            </div>
          )}

          {!isLoading && filteredProducts.length > 0 && (
            <div className="pt-8 flex items-center justify-center gap-2">
              {[1, 2, 3, 4].map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-full text-xs font-bold transition-all duration-200 active:scale-90 ${
                    currentPage === page
                      ? 'bg-[#F27A8A] text-white shadow-cute-pink'
                      : 'bg-white text-[#5D7285] hover:bg-[#FDE8EB] hover:text-[#F27A8A] border border-[#EFE6DA]'
                  }`}
                >
                  {page}
                </button>
              ))}
              <span className="text-xs text-gray-400 px-1">...</span>
              <button
                type="button"
                onClick={() => setCurrentPage(10)}
                className={`w-8 h-8 rounded-full text-xs font-bold transition-all duration-200 active:scale-90 ${
                  currentPage === 10
                    ? 'bg-[#F27A8A] text-white shadow-cute-pink'
                    : 'bg-white text-[#5D7285] hover:bg-[#FDE8EB] hover:text-[#F27A8A] border border-[#EFE6DA]'
                }`}
              >
                10
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(10, p + 1))}
                className="w-8 h-8 rounded-full text-xs font-bold bg-white text-[#5D7285] hover:bg-[#FDE8EB] hover:text-[#F27A8A] border border-[#EFE6DA] flex items-center justify-center transition-all active:scale-90"
                aria-label="Next page"
              >
                &gt;
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filters Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          <div
            className="fixed inset-0 bg-[#193653]/40 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="relative z-10 w-full max-w-xs h-full bg-[#FFF9F2] shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300 ease-out">
            <div className="p-5 space-y-6">
              <div className="flex items-center justify-between border-b border-[#EFE6DA] pb-3 bg-white p-3 rounded-2xl shadow-2xs">
                <h3 className="font-extrabold text-base text-[#193653] flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#F27A8A]" />
                  Filters
                </h3>
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1.5 text-gray-500 hover:bg-[#FDE8EB] hover:text-[#F27A8A] rounded-full transition-all active:scale-90"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#193653]">Category</label>
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('all')}
                    className={`w-full text-left px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                      selectedCategory === 'all' ? 'bg-[#FFD6E0] text-[#F27A8A] shadow-2xs' : 'text-[#5D7285] bg-white hover:bg-[#FAF4EE]'
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
                          ? 'bg-[#FFD6E0] text-[#F27A8A] shadow-2xs'
                          : 'text-[#5D7285] bg-white hover:bg-[#FAF4EE]'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#193653]">Age</label>
                <div className="space-y-2 bg-white p-3 rounded-2xl border border-[#EFE6DA] shadow-2xs">
                  {AGE_RANGES.map((age) => (
                    <label key={age} className="flex items-center gap-2 text-xs text-[#5D7285] cursor-pointer hover:text-[#193653] transition-colors">
                      <input
                        type="checkbox"
                        checked={selectedAges.includes(age)}
                        onChange={() => toggleAge(age)}
                        className="w-4 h-4 rounded accent-[#F27A8A]"
                      />
                      <span>{age}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2 bg-white p-4 rounded-2xl border border-[#EFE6DA] shadow-2xs">
                <div className="flex items-center justify-between text-xs font-bold text-[#193653]">
                  <span>Max Price</span>
                  <span className="text-[#F27A8A] font-extrabold">₹{maxPrice.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min={500}
                  max={4000}
                  step={100}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#F27A8A]"
                />
              </div>
            </div>

            <div className="p-4 border-t border-[#EFE6DA] bg-white flex gap-2">
              <button
                type="button"
                onClick={clearFilters}
                className="flex-1 py-3 rounded-full border border-[#EFE6DA] text-xs font-bold text-[#5D7285] bg-[#FFF9F2] hover:bg-[#FAF4EE] active:scale-95 transition-all"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 py-3 rounded-full bg-[#F27A8A] text-white text-xs font-extrabold shadow-cute-pink active:scale-95 transition-all"
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
