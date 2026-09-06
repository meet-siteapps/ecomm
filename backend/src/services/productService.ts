import { getSupabaseClient } from './supabase.js';
import { getSupabaseAdminClient } from './supabaseAdmin.js';
import {
  Product,
  ProductListQuery,
  ProductListResponse,
  CreateProductInput,
  UpdateProductInput,
} from '../types/product.js';
import { AppError } from '../middleware/errorHandler.js';

/**
 * Fetch all active products with optional filtering, sorting and search.
 *
 * Strategy mirrors the existing Next.js implementation:
 *  1. DB-level filters: is_active, category (ilike), maxPrice (lte), sortBy, limit
 *  2. In-memory filters: free-text search across name/brand/category/description,
 *     and ageGroup prefix matching — kept in-memory to support multi-field search
 *     without a full-text index.
 */
export async function getProducts(
  options: ProductListQuery = {},
): Promise<ProductListResponse> {
  const supabase = getSupabaseClient();

  let query = supabase
    .from('products')
    .select('*')
    .eq('is_active', true);

  // ── DB-level filters ─────────────────────────────────────────────────────

  if (options.category && options.category.toLowerCase() !== 'all') {
    query = query.ilike('category', options.category);
  }

  if (options.maxPrice && options.maxPrice > 0) {
    query = query.lte('price', options.maxPrice);
  }

  // ── Sorting ──────────────────────────────────────────────────────────────

  if (options.sortBy === 'price-low') {
    query = query.order('price', { ascending: true });
  } else if (options.sortBy === 'price-high') {
    query = query.order('price', { ascending: false });
  } else if (options.sortBy === 'discount') {
    query = query.order('discount', { ascending: false });
  } else {
    // 'featured' or default → newest first
    query = query.order('created_at', { ascending: false });
  }

  if (options.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Supabase error fetching products: ${error.message}`);
  }

  let products = (data ?? []) as Product[];

  // ── In-memory filters ────────────────────────────────────────────────────

  if (options.search?.trim()) {
    const q = options.search.toLowerCase().trim();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q)),
    );
  }

  if (options.ageGroup && options.ageGroup.toLowerCase() !== 'all ages') {
    // Match on the first 4 chars of the age string (e.g. "0-6 " from "0-6 Months")
    const prefix = options.ageGroup.toLowerCase().slice(0, 4);
    products = products.filter(
      (p) => p.age_group && p.age_group.toLowerCase().includes(prefix),
    );
  }

  return { products, total: products.length };
}

/**
 * Fetch a single product by UUID.
 * Returns null when not found (callers should respond 404).
 * Note: does NOT filter by is_active so direct links to inactive products
 * return the product — consistent with the existing Next.js behaviour.
 */
export async function getProductById(id: string): Promise<Product | null> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw new Error(`Supabase error fetching product ${id}: ${error.message}`);
  }

  return (data as Product) ?? null;
}

/**
 * Fetch all products (both active and inactive) for admin inventory management.
 */
export async function getAllProductsAdmin(): Promise<Product[]> {
  const supabase = getSupabaseAdminClient();

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Supabase error fetching admin products: ${error.message}`);
  }

  return (data as Product[]) ?? [];
}

/**
 * Create a new product in Supabase using the service-role admin client.
 *
 * @param input Validated product payload
 * @returns The newly created Product record
 */
export async function createProduct(
  input: CreateProductInput,
): Promise<Product> {
  const supabase = getSupabaseAdminClient();

  const { data, error } = await supabase
    .from('products')
    .insert([input])
    .select()
    .single();

  if (error) {
    throw new AppError(
      `Failed to create product: ${error.message}`,
      500,
      'PRODUCT_CREATE_FAILED',
    );
  }

  return data as Product;
}

/**
 * Partially or fully update an existing product by UUID.
 *
 * @param id The product UUID
 * @param input Partial product updates
 * @returns The updated Product record
 */
export async function updateProduct(
  id: string,
  input: UpdateProductInput,
): Promise<Product> {
  const supabase = getSupabaseAdminClient();

  const { data, error } = await supabase
    .from('products')
    .update({
      ...input,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .maybeSingle();

  if (error) {
    throw new AppError(
      `Failed to update product ${id}: ${error.message}`,
      500,
      'PRODUCT_UPDATE_FAILED',
    );
  }

  if (!data) {
    throw new AppError(
      `Product not found: ${id}`,
      404,
      'PRODUCT_NOT_FOUND',
    );
  }

  return data as Product;
}

/**
 * Soft delete a product by UUID (sets is_active to false).
 * Products are never hard-deleted to preserve order history integrity.
 *
 * @param id The product UUID
 * @returns The soft-deleted Product record
 */
export async function deleteProduct(id: string): Promise<Product> {
  const supabase = getSupabaseAdminClient();

  const { data, error } = await supabase
    .from('products')
    .update({
      is_active: false,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .maybeSingle();

  if (error) {
    throw new AppError(
      `Failed to delete product ${id}: ${error.message}`,
      500,
      'PRODUCT_DELETE_FAILED',
    );
  }

  if (!data) {
    throw new AppError(
      `Product not found: ${id}`,
      404,
      'PRODUCT_NOT_FOUND',
    );
  }

  return data as Product;
}

/**
 * Quick toggle of product active/inactive status.
 *
 * @param id The product UUID
 * @param isActive Target boolean active status
 * @returns The updated Product record
 */
export async function toggleProductStatus(
  id: string,
  isActive: boolean,
): Promise<Product> {
  return updateProduct(id, { is_active: isActive });
}

