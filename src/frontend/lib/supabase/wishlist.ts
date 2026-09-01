import { createClient } from './client';
import { Product } from '@/frontend/types/product';

/**
 * Fetch all wishlisted products for a specific authenticated user from Supabase.
 */
export async function fetchUserWishlist(userId: string): Promise<Product[]> {
  try {
    if (!userId) return [];
    const supabase = createClient();

    const { data, error } = await supabase
      .from('wishlists')
      .select(`
        id,
        user_id,
        product_id,
        created_at,
        products (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user wishlist from Supabase:', error.message);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Extract joined products (handling single object relation)
    const products: Product[] = [];
    for (const item of data as any[]) {
      if (item.products) {
        products.push(item.products as Product);
      }
    }

    return products;
  } catch (err) {
    console.error('Error in fetchUserWishlist:', err);
    return [];
  }
}

/**
 * Fast lookup of all product IDs in a user's wishlist from Supabase.
 */
export async function fetchUserWishlistProductIds(userId: string): Promise<string[]> {
  try {
    if (!userId) return [];
    const supabase = createClient();

    const { data, error } = await supabase
      .from('wishlists')
      .select('product_id')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching wishlist product IDs from Supabase:', error.message);
      return [];
    }

    return (data || []).map((row: any) => row.product_id);
  } catch (err) {
    console.error('Error in fetchUserWishlistProductIds:', err);
    return [];
  }
}

/**
 * Add a product to the user's wishlist in Supabase.
 */
export async function addToWishlist(userId: string, productId: string): Promise<boolean> {
  try {
    if (!userId || !productId) return false;
    const supabase = createClient();

    const { error } = await supabase
      .from('wishlists')
      .upsert(
        {
          user_id: userId,
          product_id: productId,
        },
        { onConflict: 'user_id,product_id' }
      );

    if (error) {
      console.error('Error adding to wishlist in Supabase:', error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Error in addToWishlist:', err);
    return false;
  }
}

/**
 * Remove a product from the user's wishlist in Supabase.
 */
export async function removeFromWishlist(userId: string, productId: string): Promise<boolean> {
  try {
    if (!userId || !productId) return false;
    const supabase = createClient();

    const { error } = await supabase
      .from('wishlists')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId);

    if (error) {
      console.error('Error removing from wishlist in Supabase:', error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Error in removeFromWishlist:', err);
    return false;
  }
}

/**
 * Toggle a product in user's wishlist (Add if absent, Remove if present).
 */
export async function toggleWishlistInSupabase(
  userId: string,
  productId: string,
  currentlyWishlisted: boolean
): Promise<boolean> {
  if (currentlyWishlisted) {
    return await removeFromWishlist(userId, productId);
  } else {
    return await addToWishlist(userId, productId);
  }
}
