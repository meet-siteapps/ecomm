'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Check } from 'lucide-react';
import { Product } from '@/types/product';
import { useCartStore } from '@/store/useCartStore';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const mainImage =
    !imgError && product.images && product.images.length > 0
      ? product.images[0]
      : 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800&auto=format&fit=crop&q=80';

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-200/80 hover:border-[#4DA3FF]/40 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden">
      {/* Product Image Container */}
      <Link href={`/products/${product.id}`} className="relative aspect-square w-full bg-[#EAF6FF]/30 overflow-hidden block">
        <Image
          src={mainImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
          onError={() => setImgError(true)}
        />

        {/* Discount Badge */}
        {product.discount > 0 && (
          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 text-[11px] font-bold bg-[#4DA3FF] text-white rounded-lg shadow-xs">
            {product.discount}% OFF
          </span>
        )}

        {/* Out of Stock Pill */}
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-white/75 backdrop-blur-xs flex items-center justify-center">
            <span className="px-3 py-1 text-xs font-bold text-red-600 bg-red-50 rounded-full border border-red-200">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Product Info */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between gap-3">
        <Link href={`/products/${product.id}`} className="space-y-1 block">
          {/* Brand */}
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#4DA3FF]">
            {product.brand}
          </p>

          {/* Short Name */}
          <h3 className="text-sm font-semibold text-[#1F2937] group-hover:text-[#4DA3FF] transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>
        </Link>

        {/* Price & Action Row */}
        <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
          {/* Pricing */}
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-base sm:text-lg font-bold text-[#1F2937]">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.mrp > product.price && (
              <span className="text-xs text-gray-400 line-through">
                ₹{product.mrp.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Compact Add to Cart Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={`p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs active:scale-95 ${
              added
                ? 'bg-emerald-600 text-white'
                : 'bg-[#4DA3FF] hover:bg-[#2B8BE6] text-white disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed'
            }`}
            aria-label="Add to cart"
          >
            {added ? (
              <>
                <Check className="w-4 h-4" />
                <span className="hidden sm:inline">Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
