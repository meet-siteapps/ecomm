'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Check, Heart, Edit, Eye, EyeOff, Shield } from 'lucide-react';
import { Product } from '@/types/product';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { toggleProductStatus } from '@/lib/api/products';

interface ProductCardProps {
  product: Product;
  onStatusChange?: (updatedProduct: Product) => void;
}

export function ProductCard({ product, onStatusChange }: ProductCardProps) {
  const router = useRouter();
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [isActiveState, setIsActiveState] = useState(product.is_active);

  const addItem = useCartStore((state) => state.addItem);
  const profile = useAuthStore((state) => state.profile);
  const user = useAuthStore((state) => state.user);
  const isAdmin = profile?.role === 'admin';

  const isWishlisted = useWishlistStore((state) => state.isInWishlist(product.id));
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      router.push(`/login?redirect=/products/${product.id}`);
      return;
    }

    await toggleWishlist(product, user.id);
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
    <div
      className={`group relative bg-white rounded-3xl border transition-all duration-300 ease-out flex flex-col overflow-hidden ${
        !isActiveState
          ? 'border-dashed border-[#EFE6DA] opacity-75 bg-[#FFF9F2]/50'
          : 'border-[#EFE6DA] hover:border-[#F27A8A]/40 shadow-cute hover:shadow-cute-lg hover:-translate-y-1'
      }`}
    >
      {/* Product Image Container */}
      <Link
        href={`/products/${product.id}`}
        className="relative aspect-square w-full bg-[#FFF9F2] overflow-hidden block"
      >
        <Image
          src={mainImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={() => setImgError(true)}
        />

        {/* Persistent Supabase Wishlist Heart Icon Button */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center border border-[#EFE6DA] shadow-2xs transition-all duration-200 active:scale-90 z-10 hover:shadow-cute ${
            isWishlisted ? 'text-[#F27A8A] bg-[#FDE8EB] border-[#F27A8A]/30' : 'text-gray-400 hover:text-[#F27A8A]'
          }`}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          title={isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 transition-transform duration-200 ${isWishlisted ? 'fill-[#F27A8A] scale-110' : ''}`} />
        </button>

        {/* Discount Badge */}
        {product.discount > 0 && isActiveState && (
          <span className="absolute top-3 left-3 px-2.5 py-0.5 text-[10px] sm:text-[11px] font-extrabold bg-[#F27A8A] text-white rounded-full shadow-cute-pink animate-fade-in">
            {product.discount}% OFF
          </span>
        )}

        {/* Admin Badge */}
        {isAdmin && (
          <span className="absolute bottom-3 left-3 px-2 py-0.5 text-[9px] font-bold bg-[#8FD3E8] text-[#193653] rounded-full flex items-center gap-1 shadow-2xs">
            <Shield className="w-2.5 h-2.5" />
            <span>Admin</span>
          </span>
        )}

        {!isActiveState && (
          <div className="absolute inset-0 bg-[#193653]/60 backdrop-blur-2xs flex items-center justify-center animate-fade-in">
            <span className="px-3.5 py-1 text-xs font-bold text-white bg-black/60 rounded-full border border-white/20">
              Deactivated
            </span>
          </div>
        )}

        {/* Out of Stock Pill */}
        {product.stock <= 0 && isActiveState && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center animate-fade-in">
            <span className="px-3 py-1 text-xs font-bold text-[#F27A8A] bg-[#FDE8EB] rounded-full border border-[#F27A8A]/30">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Product Info */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between gap-2.5">
        <Link href={`/products/${product.id}`} className="space-y-1 block group/title">
          <p className="text-[10px] sm:text-[11px] font-bold text-[#5D7285] truncate">
            {product.brand || product.category}
          </p>

          <h3 className="text-xs sm:text-sm font-bold text-[#193653] group-hover/title:text-[#F27A8A] transition-colors duration-200 line-clamp-1 leading-snug">
            {product.name}
          </h3>
        </Link>

        {/* Price & Action Row */}
        <div className="pt-2 border-t border-[#EFE6DA]/70 flex items-center justify-between gap-2">
          {/* Price */}
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-sm sm:text-base font-extrabold text-[#193653]">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.mrp > product.price && (
              <span className="text-[10px] sm:text-xs text-[#5D7285] line-through font-medium">
                ₹{product.mrp.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Action Button */}
          {isAdmin ? (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleToggleStatus}
                disabled={isToggling}
                title={isActiveState ? 'Deactivate' : 'Activate'}
                className={`p-1.5 rounded-xl text-xs font-bold border transition-all duration-200 active:scale-95 ${
                  isActiveState
                    ? 'bg-[#FEF9E8] text-[#E0B538] border-[#F6D77A] hover:bg-[#FEF9E8]/80'
                    : 'bg-[#EFF7E9] text-[#729c50] border-[#A8C98B] hover:bg-[#EFF7E9]/80'
                }`}
              >
                {isActiveState ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>

              <Link
                href={`/admin/products?edit=${product.id}`}
                className="p-1.5 rounded-xl bg-[#EBF8FC] hover:bg-[#8FD3E8]/30 text-[#3599b8] border border-[#8FD3E8]/40 text-xs font-bold transition-all duration-200 active:scale-95"
                title="Edit Product"
              >
                <Edit className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className={`p-2 rounded-full text-xs font-bold flex items-center justify-center transition-all duration-200 shadow-cute-pink active:scale-90 ${
                added
                  ? 'bg-[#A8C98B] text-[#193653] shadow-none scale-105'
                  : 'bg-[#F27A8A] hover:bg-[#e06878] text-white hover:shadow-cute-pink-hover disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed'
              }`}
              aria-label="Add to cart"
            >
              {added ? <Check className="w-3.5 h-3.5 animate-pop-in" /> : <ShoppingBag className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
