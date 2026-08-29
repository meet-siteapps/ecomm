'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Check, Edit, Eye, EyeOff, Shield } from 'lucide-react';
import { Product } from '@/types/product';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { toggleProductStatus } from '@/lib/supabase/products';

interface ProductCardProps {
  product: Product;
  onStatusChange?: (updatedProduct: Product) => void;
}

export function ProductCard({ product, onStatusChange }: ProductCardProps) {
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [isActiveState, setIsActiveState] = useState(product.is_active);

  const addItem = useCartStore((state) => state.addItem);
  const profile = useAuthStore((state) => state.profile);
  const isAdmin = profile?.role === 'admin';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleToggleStatus = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isToggling) return;
    setIsToggling(true);
    try {
      const nextStatus = !isActiveState;
      const updated = await toggleProductStatus(product.id, nextStatus);
      setIsActiveState(nextStatus);
      if (onStatusChange) {
        onStatusChange(updated);
      }
    } catch (err) {
      console.error('Failed to toggle product status:', err);
    } finally {
      setIsToggling(false);
    }
  };

  const mainImage =
    !imgError && product.images && product.images.length > 0
      ? product.images[0]
      : 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800&auto=format&fit=crop&q=80';

  return (
    <div className={`group relative bg-white rounded-3xl border transition-all duration-300 flex flex-col overflow-hidden ${
      !isActiveState
        ? 'border-dashed border-[#E2D5C8] opacity-75 bg-[#FAF7F2]/50'
        : 'border-[#EFE7DE] hover:border-[#FF6B8B]/40 shadow-cute hover:shadow-cute-lg hover:-translate-y-1'
    }`}>
      {/* Product Image Container */}
      <Link href={`/products/${product.id}`} className="relative aspect-square w-full bg-[#FAF7F2] overflow-hidden block">
        <Image
          src={mainImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
          onError={() => setImgError(true)}
        />

        {/* Discount Badge */}
        {product.discount > 0 && isActiveState && (
          <span className="absolute top-3 left-3 px-2.5 py-0.5 text-[11px] font-extrabold bg-[#FF6B8B] text-white rounded-full shadow-cute-pink">
            {product.discount}% OFF
          </span>
        )}

        {/* Admin Badge & Inactive Badge */}
        {isAdmin && (
          <span className="absolute top-3 right-3 px-2.5 py-0.5 text-[10px] font-bold bg-[#8B5CF6] text-white rounded-full flex items-center gap-1 shadow-2xs">
            <Shield className="w-3 h-3" />
            <span>Admin</span>
          </span>
        )}

        {!isActiveState && (
          <div className="absolute inset-0 bg-[#2D3748]/60 backdrop-blur-2xs flex items-center justify-center">
            <span className="px-3.5 py-1 text-xs font-bold text-white bg-black/60 rounded-full border border-white/20">
              Deactivated
            </span>
          </div>
        )}

        {/* Out of Stock Pill */}
        {product.stock <= 0 && isActiveState && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center">
            <span className="px-3 py-1 text-xs font-bold text-[#FA5578] bg-[#FFEAEF] rounded-full border border-[#FF6B8B]/30">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Product Info */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3">
        <Link href={`/products/${product.id}`} className="space-y-1 block">
          {/* Brand */}
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#FF6B8B]">
            {product.brand}
          </p>

          {/* Short Name */}
          <h3 className="text-sm font-bold text-[#2D3748] group-hover:text-[#FF6B8B] transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>
        </Link>

        {/* Price & Action Row */}
        <div className="pt-2 border-t border-[#EFE7DE]/70 flex items-center justify-between gap-2">
          {/* Pricing */}
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-base sm:text-lg font-extrabold text-[#2D3748]">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.mrp > product.price && (
              <span className="text-xs text-[#A0AEC0] line-through font-medium">
                ₹{product.mrp.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Action: Role-based (Customer -> Add to Cart | Admin -> Edit & Deactivate) */}
          {isAdmin ? (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleToggleStatus}
                disabled={isToggling}
                title={isActiveState ? 'Deactivate product' : 'Activate product'}
                className={`p-2 rounded-xl text-xs font-bold border transition-all ${
                  isActiveState
                    ? 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A] hover:bg-[#FDE68A]'
                    : 'bg-[#D1FAE5] text-[#059669] border-[#A7F3D0] hover:bg-[#A7F3D0]'
                }`}
              >
                {isActiveState ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>

              <Link
                href={`/admin/products?edit=${product.id}`}
                className="p-2 rounded-xl bg-[#F3E8FF] text-[#8B5CF6] border border-[#E9D5FF] hover:bg-[#E9D5FF] text-xs font-bold transition-all"
                title="Edit Product in Admin"
              >
                <Edit className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className={`p-2 sm:px-3.5 sm:py-2 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all shadow-cute-pink active:scale-95 ${
                added
                  ? 'bg-[#10B981] text-white'
                  : 'bg-[#FF6B8B] hover:bg-[#FA5578] text-white disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed'
              }`}
              aria-label="Add to cart"
            >
              {added ? (
                <>
                  <Check className="w-4 h-4" />
                  <span className="hidden sm:inline">Added!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span className="hidden sm:inline">Add</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
