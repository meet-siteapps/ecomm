'use client';

import { create } from 'zustand';
import { Product } from '@/frontend/types/product';
import {
  fetchUserWishlist,
  fetchUserWishlistProductIds,
  addToWishlist,
  removeFromWishlist,
} from '@/frontend/lib/supabase/wishlist';

interface WishlistState {
  wishlistProductIds: string[];
  wishlistProducts: Product[];
  isLoading: boolean;
  isInitialized: boolean;

  fetchWishlist: (userId: string) => Promise<void>;
  toggleWishlist: (product: Product, userId?: string | null) => Promise<'added' | 'removed' | 'unauthenticated'>;
  removeFromWishlist: (productId: string, userId?: string | null) => Promise<boolean>;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  wishlistProductIds: [],
  wishlistProducts: [],
  isLoading: false,
  isInitialized: false,

  fetchWishlist: async (userId: string) => {
    if (!userId) {
      set({ wishlistProductIds: [], wishlistProducts: [], isInitialized: true });
      return;
    }

    set({ isLoading: true });
    try {
      const [products, productIds] = await Promise.all([
        fetchUserWishlist(userId),
        fetchUserWishlistProductIds(userId),
      ]);

      // Deduplicate IDs
      const uniqueIds = Array.from(new Set([...productIds, ...products.map((p) => p.id)]));

      set({
        wishlistProducts: products,
        wishlistProductIds: uniqueIds,
        isLoading: false,
        isInitialized: true,
      });
    } catch (err) {
      console.error('Failed to load user wishlist:', err);
      set({ isLoading: false, isInitialized: true });
    }
  },

  isInWishlist: (productId: string) => {
    return get().wishlistProductIds.includes(productId);
  },

  toggleWishlist: async (product: Product, userId?: string | null) => {
    if (!userId) {
      return 'unauthenticated';
    }

    const { wishlistProductIds, wishlistProducts } = get();
    const isCurrentlyWishlisted = wishlistProductIds.includes(product.id);

    if (isCurrentlyWishlisted) {
      // Optimistic Removal
      set({
        wishlistProductIds: wishlistProductIds.filter((id) => id !== product.id),
        wishlistProducts: wishlistProducts.filter((p) => p.id !== product.id),
      });

      const success = await removeFromWishlist(userId, product.id);
      if (!success) {
        // Rollback if failed
        set({
          wishlistProductIds: [...wishlistProductIds],
          wishlistProducts: [...wishlistProducts],
        });
      }
      return 'removed';
    } else {
      // Optimistic Addition
      set({
        wishlistProductIds: [...wishlistProductIds, product.id],
        wishlistProducts: [product, ...wishlistProducts.filter((p) => p.id !== product.id)],
      });

      const success = await addToWishlist(userId, product.id);
      if (!success) {
        // Rollback if failed
        set({
          wishlistProductIds: wishlistProductIds.filter((id) => id !== product.id),
          wishlistProducts: wishlistProducts.filter((p) => p.id !== product.id),
        });
      }
      return 'added';
    }
  },

  removeFromWishlist: async (productId: string, userId?: string | null) => {
    const { wishlistProductIds, wishlistProducts } = get();

    // Optimistic removal
    set({
      wishlistProductIds: wishlistProductIds.filter((id) => id !== productId),
      wishlistProducts: wishlistProducts.filter((p) => p.id !== productId),
    });

    if (userId) {
      const success = await removeFromWishlist(userId, productId);
      if (!success) {
        // Rollback
        set({
          wishlistProductIds: [...wishlistProductIds],
          wishlistProducts: [...wishlistProducts],
        });
        return false;
      }
    }

    return true;
  },

  clearWishlist: () => {
    set({
      wishlistProductIds: [],
      wishlistProducts: [],
      isLoading: false,
      isInitialized: false,
    });
  },
}));
