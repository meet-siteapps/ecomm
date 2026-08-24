import { createClient } from '@/lib/supabase/client';
import { Product } from '@/types/product';
import { SAMPLE_PRODUCTS } from '@/data/sampleProducts';

export interface ProductFilterOptions {
  search?: string;
  category?: string;
  ageGroup?: string;
  maxPrice?: number;
  sortBy?: 'featured' | 'price-low' | 'price-high' | 'discount' | string;
  limit?: number;
}

/**
 * Fetch all active products matching optional filters from Supabase.
 * Falls back to sample data if table has not been created/populated yet.
 */
export async function getProducts(options: ProductFilterOptions = {}): Promise<Product[]> {
  try {
    const supabase = createClient();
    let query = supabase
      .from('products')
      .select('*')
      .eq('is_active', true);

    // Apply Category Filter
    if (options.category && options.category !== 'all') {
      query = query.ilike('category', options.category);
    }

    // Apply Max Price Filter
    if (options.maxPrice && options.maxPrice > 0) {
      query = query.lte('price', options.maxPrice);
    }

    // Apply Sorting
    if (options.sortBy === 'price-low') {
      query = query.order('price', { ascending: true });
    } else if (options.sortBy === 'price-high') {
      query = query.order('price', { ascending: false });
    } else if (options.sortBy === 'discount') {
      query = query.order('discount', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    if (options.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error) {
      console.warn('Could not fetch products from Supabase, using fallback:', error.message);
      return filterSampleProducts(options);
    }

    if (!data || data.length === 0) {
      // If table is empty or not seeded yet, fallback cleanly
      return filterSampleProducts(options);
    }

    let products = data as Product[];

    // In-memory search & age group filtering for highest accuracy across fields
    if (options.search?.trim()) {
      const q = options.search.toLowerCase().trim();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q))
      );
    }

    if (options.ageGroup && options.ageGroup !== 'All Ages') {
      const q = options.ageGroup.toLowerCase().slice(0, 4);
      products = products.filter(
        (p) => p.age_group && p.age_group.toLowerCase().includes(q)
      );
    }

    return products;
  } catch (err) {
    console.error('Error in getProducts:', err);
    return filterSampleProducts(options);
  }
}

/**
 * Fetch a single product by its ID from Supabase
 */
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.warn('Error fetching product by ID from Supabase:', error.message);
      return SAMPLE_PRODUCTS.find((p) => p.id === id) || null;
    }

    if (data) {
      return data as Product;
    }

    // Fallback search in sample products if id matches mock ID
    return SAMPLE_PRODUCTS.find((p) => p.id === id) || null;
  } catch (err) {
    console.error('Error in getProductById:', err);
    return SAMPLE_PRODUCTS.find((p) => p.id === id) || null;
  }
}

/**
 * ==============================================================================
 * ADMIN PRODUCT MANAGEMENT FUNCTIONS (Phase 6)
 * ==============================================================================
 */

/**
 * Fetch all products (both active & inactive) for Admin Catalog Management
 */
export async function getAllProductsAdmin(): Promise<Product[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching admin products:', error.message);
      return SAMPLE_PRODUCTS;
    }

    return (data as Product[]) || [];
  } catch (err) {
    console.error('Error in getAllProductsAdmin:', err);
    return SAMPLE_PRODUCTS;
  }
}

/**
 * Create a new product in Supabase
 */
export async function createProduct(
  productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>
): Promise<Product> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('products')
    .insert([productData])
    .select()
    .single();

  if (error) {
    console.error('Error creating product:', error);
    throw new Error(error.message || 'Failed to create product');
  }

  return data as Product;
}

/**
 * Update an existing product by ID
 */
export async function updateProduct(
  id: string,
  updates: Partial<Product>
): Promise<Product> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('products')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating product:', error);
    throw new Error(error.message || 'Failed to update product');
  }

  return data as Product;
}

/**
 * Delete a product by ID
 */
export async function deleteProduct(id: string): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting product:', error);
    throw new Error(error.message || 'Failed to delete product');
  }

  return true;
}

/**
 * Quick toggle of active/inactive status
 */
export async function toggleProductStatus(id: string, is_active: boolean): Promise<Product> {
  return updateProduct(id, { is_active });
}

/**
 * Get simple stats for Admin Dashboard
 */
export async function getAdminDashboardStats() {
  try {
    const supabase = createClient();
    
    // 1. Total products & active products
    const { count: totalProducts, error: prodErr } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    const { count: activeProducts } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    const { count: lowStockProducts } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .lte('stock', 5);

    // 2. Total customers from profiles
    const { count: totalCustomers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'customer');

    return {
      totalProducts: totalProducts ?? SAMPLE_PRODUCTS.length,
      activeProducts: activeProducts ?? SAMPLE_PRODUCTS.length,
      lowStockProducts: lowStockProducts ?? 0,
      totalCustomers: totalCustomers ?? 1,
      totalOrders: 0,
      pendingOrders: 0,
      recentOrders: [],
    };
  } catch (err) {
    console.error('Error getting dashboard stats:', err);
    return {
      totalProducts: SAMPLE_PRODUCTS.length,
      activeProducts: SAMPLE_PRODUCTS.length,
      lowStockProducts: 0,
      totalCustomers: 1,
      totalOrders: 0,
      pendingOrders: 0,
      recentOrders: [],
    };
  }
}

/**
 * Helper to filter mock products when DB is offline or not yet migrated
 */
function filterSampleProducts(options: ProductFilterOptions): Product[] {
  return SAMPLE_PRODUCTS.filter((product) => {
    if (options.search?.trim()) {
      const q = options.search.toLowerCase().trim();
      const match =
        product.name.toLowerCase().includes(q) ||
        product.brand.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q);
      if (!match) return false;
    }

    if (options.category && options.category !== 'all') {
      if (product.category.toLowerCase() !== options.category.toLowerCase()) {
        return false;
      }
    }

    if (options.ageGroup && options.ageGroup !== 'All Ages') {
      if (
        !product.age_group ||
        !product.age_group.toLowerCase().includes(options.ageGroup.toLowerCase().slice(0, 4))
      ) {
        return false;
      }
    }

    if (options.maxPrice && product.price > options.maxPrice) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    if (options.sortBy === 'price-low') return a.price - b.price;
    if (options.sortBy === 'price-high') return b.price - a.price;
    if (options.sortBy === 'discount') return b.discount - a.discount;
    return 0;
  });
}
