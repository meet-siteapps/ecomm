"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProducts = getProducts;
exports.getProductById = getProductById;
exports.getAllProductsAdmin = getAllProductsAdmin;
exports.createProduct = createProduct;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
exports.toggleProductStatus = toggleProductStatus;
const supabase_js_1 = require("./supabase.js");
const supabaseAdmin_js_1 = require("./supabaseAdmin.js");
const errorHandler_js_1 = require("../middleware/errorHandler.js");
async function getProducts(options = {}) {
    const supabase = (0, supabase_js_1.getSupabaseClient)();
    let query = supabase
        .from('products')
        .select('*')
        .eq('is_active', true);
    if (options.category && options.category.toLowerCase() !== 'all') {
        query = query.ilike('category', options.category);
    }
    if (options.maxPrice && options.maxPrice > 0) {
        query = query.lte('price', options.maxPrice);
    }
    if (options.sortBy === 'price-low') {
        query = query.order('price', { ascending: true });
    }
    else if (options.sortBy === 'price-high') {
        query = query.order('price', { ascending: false });
    }
    else if (options.sortBy === 'discount') {
        query = query.order('discount', { ascending: false });
    }
    else {
        query = query.order('created_at', { ascending: false });
    }
    if (options.limit) {
        query = query.limit(options.limit);
    }
    const { data, error } = await query;
    if (error) {
        throw new Error(`Supabase error fetching products: ${error.message}`);
    }
    let products = (data ?? []);
    if (options.search?.trim()) {
        const q = options.search.toLowerCase().trim();
        products = products.filter((p) => p.name.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            (p.description && p.description.toLowerCase().includes(q)));
    }
    if (options.ageGroup && options.ageGroup.toLowerCase() !== 'all ages') {
        const prefix = options.ageGroup.toLowerCase().slice(0, 4);
        products = products.filter((p) => p.age_group && p.age_group.toLowerCase().includes(prefix));
    }
    return { products, total: products.length };
}
async function getProductById(id) {
    const supabase = (0, supabase_js_1.getSupabaseClient)();
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .maybeSingle();
    if (error) {
        throw new Error(`Supabase error fetching product ${id}: ${error.message}`);
    }
    return data ?? null;
}
async function getAllProductsAdmin() {
    const supabase = (0, supabaseAdmin_js_1.getSupabaseAdminClient)();
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
    if (error) {
        throw new Error(`Supabase error fetching admin products: ${error.message}`);
    }
    return data ?? [];
}
async function createProduct(input) {
    const supabase = (0, supabaseAdmin_js_1.getSupabaseAdminClient)();
    const { data, error } = await supabase
        .from('products')
        .insert([input])
        .select()
        .single();
    if (error) {
        throw new errorHandler_js_1.AppError(`Failed to create product: ${error.message}`, 500, 'PRODUCT_CREATE_FAILED');
    }
    return data;
}
async function updateProduct(id, input) {
    const supabase = (0, supabaseAdmin_js_1.getSupabaseAdminClient)();
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
        throw new errorHandler_js_1.AppError(`Failed to update product ${id}: ${error.message}`, 500, 'PRODUCT_UPDATE_FAILED');
    }
    if (!data) {
        throw new errorHandler_js_1.AppError(`Product not found: ${id}`, 404, 'PRODUCT_NOT_FOUND');
    }
    return data;
}
async function deleteProduct(id) {
    const supabase = (0, supabaseAdmin_js_1.getSupabaseAdminClient)();
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
        throw new errorHandler_js_1.AppError(`Failed to delete product ${id}: ${error.message}`, 500, 'PRODUCT_DELETE_FAILED');
    }
    if (!data) {
        throw new errorHandler_js_1.AppError(`Product not found: ${id}`, 404, 'PRODUCT_NOT_FOUND');
    }
    return data;
}
async function toggleProductStatus(id, isActive) {
    return updateProduct(id, { is_active: isActive });
}
//# sourceMappingURL=productService.js.map