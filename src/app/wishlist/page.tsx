'use client';

import { useEffect, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, ArrowRight, Loader2, LogIn } from 'lucide-react';
import { ProductCard } from '@/components/products/ProductCard';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useCartStore } from '@/store/useCartStore';

const emptySubscribe = () => () => {};

export default function WishlistPage() {
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  const user = useAuthStore((state) => state.user);
  const isAuthLoading = useAuthStore((state) => state.isLoading);

  const wishlistProducts = useWishlistStore((state) => state.wishlistProducts);
  const isLoading = useWishlistStore((state) => state.isLoading);
  const isInitialized = useWishlistStore((state) => state.isInitialized);
  const fetchWishlist = useWishlistStore((state) => state.fetchWishlist);

  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    if (user?.id && !isInitialized) {
      fetchWishlist(user.id);
    }
  }, [user?.id, isInitialized, fetchWishlist]);

  if (!mounted || isAuthLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-[#F27A8A] animate-spin" />
        <p className="text-xs text-[#5D7285] font-medium">Loading your wishlist...</p>
      </div>
    );
  }

  // If user is not logged in, prompt sign in
  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-5 animate-fade-in">
        <div className="w-20 h-20 rounded-3xl bg-[#FFD6E0] text-[#F27A8A] flex items-center justify-center mx-auto shadow-cute-pink">
          <Heart className="w-10 h-10 fill-[#F27A8A]" />
        </div>
        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#193653] tracking-tight">
            Sign In to View Your Wishlist
          </h1>
          <p className="text-xs sm:text-sm text-[#5D7285] max-w-md mx-auto font-medium">
            Save your favorite cute clothing, gentle fabrics, and essentials across all your devices.
          </p>
        </div>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/login?redirect=/wishlist"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#F27A8A] hover:bg-[#e06878] text-white text-xs sm:text-sm font-extrabold shadow-cute-pink active:scale-95 transition-all"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In to Continue</span>
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white hover:bg-[#FFF9F2] text-[#193653] text-xs sm:text-sm font-bold border border-[#EFE4D6] active:scale-95 transition-all"
          >
            <span>Browse Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const handleAddAllToCart = () => {
    for (const product of wishlistProducts) {
      if (product.stock > 0 && product.is_active) {
        addItem(product, 1);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-fade-in">
      {/* Title & Stats Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EFE4D6] pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#FFD6E0] text-[#F27A8A] flex items-center justify-center shadow-2xs">
              <Heart className="w-5 h-5 fill-[#F27A8A]" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#193653] tracking-tight">
              My Wishlist
            </h1>
          </div>
          <p className="text-xs text-[#5D7285] font-medium">
            {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'} saved in your wishlist
          </p>
        </div>

        {wishlistProducts.length > 0 && (
          <button
            type="button"
            onClick={handleAddAllToCart}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#F27A8A] hover:bg-[#e06878] text-white text-xs font-extrabold shadow-cute-pink active:scale-95 transition-all self-start sm:self-auto"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Add All Available to Cart</span>
          </button>
        )}
      </div>

      {/* Wishlist Content Grid */}
      {isLoading ? (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-[#F27A8A] animate-spin mx-auto" />
          <p className="text-xs text-[#5D7285] font-medium">Fetching saved items from database...</p>
        </div>
      ) : wishlistProducts.length === 0 ? (
        <div className="max-w-md mx-auto py-16 text-center space-y-4 bg-white p-8 sm:p-10 rounded-3xl border border-[#EFE4D6] shadow-cute">
          <div className="w-16 h-16 rounded-2xl bg-[#FFD6E0] text-[#F27A8A] flex items-center justify-center mx-auto shadow-2xs">
            <Heart className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-extrabold text-[#193653]">Your Wishlist is Empty</h2>
            <p className="text-xs text-[#5D7285] font-medium leading-relaxed">
              You haven&apos;t added any items to your wishlist yet. Tap the heart icon on any product to save it here!
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[#F27A8A] hover:bg-[#e06878] text-white text-xs font-extrabold shadow-cute-pink active:scale-95 transition-all"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
          {wishlistProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
