import { createClient } from '@/frontend/lib/supabase/client';
import { Product } from '@/frontend/types/product';

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
      console.error('Error fetching products from Supabase:', error.message);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    let products = data as Product[];

    // In-memory search & age group filtering for multi-field matching
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
    return [];
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
      console.error('Error fetching product by ID from Supabase:', error.message);
      return null;
    }

    return (data as Product) || null;
  } catch (err) {
    console.error('Error in getProductById:', err);
    return null;
  }
}

/**
 * ==============================================================================
 * ADMIN PRODUCT MANAGEMENT FUNCTIONS
 * ==============================================================================
 */

/**
 * Fetch all products (both active & inactive) for Admin Catalog Management from Supabase
 */
export async function getAllProductsAdmin(): Promise<Product[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching admin products from Supabase:', error.message);
      return [];
    }

    return (data as Product[]) || [];
  } catch (err) {
    console.error('Error in getAllProductsAdmin:', err);
    return [];
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
 * Update an existing product by ID in Supabase
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
 * Delete a product by ID in Supabase
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
 * Quick toggle of active/inactive status in Supabase
 */
export async function toggleProductStatus(id: string, is_active: boolean): Promise<Product> {
  return updateProduct(id, { is_active });
}

/**
 * Get stats for Admin Dashboard from Supabase
 */
export async function getAdminDashboardStats() {
  try {
    const supabase = createClient();
    
    // 1. Total products & active products
    const { count: totalProducts } = await supabase
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
      .select('*', { count: 'exact', head: true });

    // 3. Orders stats from orders table
    const { count: totalOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true });

    const { count: pendingOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('order_status', 'pending');

    // 4. Recent orders list
    const { data: recentOrdersData } = await supabase
      .from('orders')
      .select('id, order_number, customer_name, total, order_status, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    return {
      totalProducts: totalProducts ?? 0,
      activeProducts: activeProducts ?? 0,
      lowStockProducts: lowStockProducts ?? 0,
      totalCustomers: totalCustomers ?? 0,
      totalOrders: totalOrders ?? 0,
      pendingOrders: pendingOrders ?? 0,
      recentOrders: (recentOrdersData || []).map((o) => ({
        id: o.id,
        order_number: o.order_number,
        customer_name: o.customer_name,
        amount: o.total,
        status: o.order_status,
        date: o.created_at
          ? new Date(o.created_at).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            })
          : 'Recently',
      })),
    };
  } catch (err) {
    console.error('Error getting dashboard stats:', err);
    return {
      totalProducts: 0,
      activeProducts: 0,
      lowStockProducts: 0,
      totalCustomers: 0,
      totalOrders: 0,
      pendingOrders: 0,
      recentOrders: [],
    };
  }
}
