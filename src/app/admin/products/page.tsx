'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  XOctagon,
  Eye,
  EyeOff,
  Package,
  ArrowUpDown,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Loader2,
  SlidersHorizontal,
  RefreshCw
} from 'lucide-react';
import { Product } from '@/types/product';
import {
  getAllProductsAdmin,
  toggleProductStatus,
  deleteProduct,
  permanentDeleteProduct,
  updateProduct,
} from '@/lib/api/products';
import { ProductFormModal } from '@/components/admin/ProductFormModal';
import { SAMPLE_CATEGORIES } from '@/lib/constants';

function AdminProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const editIdParam = searchParams.get('edit');

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Quick Inline edits
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [permDeletingId, setPermDeletingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const data = await getAllProductsAdmin();
      setProducts(data);
    } catch (err) {
      console.error('Failed to load admin products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Handle ?edit={id} from URL
  useEffect(() => {
    if (editIdParam && products.length > 0) {
      const prod = products.find((p) => p.id === editIdParam);
      if (prod) {
        setEditingProduct(prod);
        setIsModalOpen(true);
      }
    }
  }, [editIdParam, products]);

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 3500);
  };

  // Toggle status
  const handleToggleStatus = async (product: Product) => {
    setTogglingId(product.id);
    try {
      const nextStatus = !product.is_active;
      const updated = await toggleProductStatus(product.id, nextStatus);
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, is_active: nextStatus } : p))
      );
      showFeedback('success', `Product "${product.name}" ${nextStatus ? 'activated' : 'deactivated'}.`);
    } catch (err: any) {
      showFeedback('error', err.message || 'Failed to toggle status.');
    } finally {
      setTogglingId(null);
    }
  };

  // Soft delete product (sets is_active = false)
  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to deactivate "${name}"?`)) {
      return;
    }
    setDeletingId(id);
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      showFeedback('success', `Product "${name}" deleted successfully.`);
    } catch (err: any) {
      showFeedback('error', err.message || 'Failed to delete product.');
    } finally {
      setDeletingId(null);
    }
  };

  // Permanently delete product (hard delete, allowed only when zero order history)
  const handlePermanentDeleteProduct = async (id: string, name: string) => {
    if (
      !confirm(
        'This will permanently erase this product and cannot be undone. Are you sure?'
      )
    ) {
      return;
    }
    setPermDeletingId(id);
    try {
      await permanentDeleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      showFeedback('success', `Product "${name}" was permanently deleted.`);
    } catch (err: any) {
      showFeedback('error', err.message || 'Failed to permanently delete product.');
    } finally {
      setPermDeletingId(null);
    }
  };

  // Quick update price / stock inline
  const handleQuickUpdate = async (id: string, field: 'price' | 'stock', value: number) => {
    try {
      const updated = await updateProduct(id, { [field]: value });
      setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
      showFeedback('success', `Updated ${field} to ${value}.`);
    } catch (err: any) {
      showFeedback('error', err.message || `Failed to update ${field}.`);
    }
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleModalSuccess = (savedProduct: Product) => {
    loadProducts();
    showFeedback('success', `Product "${savedProduct.name}" saved successfully.`);
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesBrand = p.brand.toLowerCase().includes(q);
        const matchesCat = p.category.toLowerCase().includes(q);
        if (!matchesName && !matchesBrand && !matchesCat) return false;
      }

      if (selectedCategory !== 'all') {
        if (p.category.toLowerCase() !== selectedCategory.toLowerCase()) return false;
      }

      if (statusFilter === 'active' && !p.is_active) return false;
      if (statusFilter === 'inactive' && p.is_active) return false;

      return true;
    });
  }, [products, search, selectedCategory, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] tracking-tight">
            Products Catalog
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Create, edit, change prices, update stock, or deactivate items in your store
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={loadProducts}
            disabled={isLoading}
            className="p-2.5 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors shadow-2xs"
            title="Refresh product list"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#4DA3FF] hover:bg-[#2B8BE6] text-white text-xs font-bold transition-all shadow-xs active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div
          className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 animate-in fade-in ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Controls Bar: Search, Category, Status Filters */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col md:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, brand, category..."
            className="w-full bg-gray-50 text-xs text-[#1F2937] placeholder-gray-400 rounded-xl pl-9 pr-3 py-2 border border-gray-200 focus:bg-white focus:border-[#4DA3FF] focus:outline-none"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        {/* Category Select */}
        <div className="w-full md:w-48">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-gray-50 text-xs text-[#1F2937] font-medium rounded-xl px-3 py-2 border border-gray-200 focus:bg-white focus:border-[#4DA3FF] focus:outline-none cursor-pointer"
          >
            <option value="all">All Categories</option>
            {SAMPLE_CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="w-full md:w-36">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-full bg-gray-50 text-xs text-[#1F2937] font-medium rounded-xl px-3 py-2 border border-gray-200 focus:bg-white focus:border-[#4DA3FF] focus:outline-none cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="inactive">Deactivated Only</option>
          </select>
        </div>
      </div>

      {/* Products Table Container */}
      <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-16 text-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#4DA3FF] mx-auto" />
            <p className="text-xs text-gray-500 font-medium">Loading catalog from database...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <Package className="w-10 h-10 text-gray-300 mx-auto" />
            <h3 className="text-sm font-bold text-[#1F2937]">No products found</h3>
            <p className="text-xs text-gray-400">
              Try adjusting your search criteria or create a new product above.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700">
              <thead className="bg-gray-50/80 text-[11px] font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100">
                <tr>
                  <th className="px-5 py-3.5">Product</th>
                  <th className="px-4 py-3.5">Category</th>
                  <th className="px-4 py-3.5">MRP / Price</th>
                  <th className="px-4 py-3.5">Stock</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((product) => {
                  const coverImage =
                    product.images && product.images.length > 0
                      ? product.images[0]
                      : 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800&auto=format&fit=crop&q=80';

                  return (
                    <tr
                      key={product.id}
                      className={`hover:bg-gray-50/70 transition-colors ${
                        !product.is_active ? 'bg-gray-50/40 opacity-75' : ''
                      }`}
                    >
                      {/* Product Thumbnail & Title */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                            <Image
                              src={coverImage}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-[#4DA3FF] uppercase tracking-wider block">
                              {product.brand || 'No Brand'}
                            </span>
                            <span className="text-xs font-bold text-[#1F2937] line-clamp-1">
                              {product.name}
                            </span>
                            <span className="text-[10px] text-gray-400 block">
                              ID: {product.id.slice(0, 8)}...
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-4 font-medium text-gray-600">
                        <span>{product.category}</span>
                        {product.subcategory && (
                          <span className="text-[10px] text-gray-400 block">
                            {product.subcategory}
                          </span>
                        )}
                      </td>

                      {/* Pricing */}
                      <td className="px-4 py-4">
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-bold text-[#1F2937]">
                            ₹{product.price.toLocaleString('en-IN')}
                          </span>
                          {product.mrp > product.price && (
                            <span className="text-[10px] text-gray-400 line-through">
                              ₹{product.mrp.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                        {product.discount > 0 && (
                          <span className="text-[10px] font-semibold text-[#4DA3FF]">
                            {product.discount}% discount
                          </span>
                        )}
                      </td>

                      {/* Stock Quantity */}
                      <td className="px-4 py-4">
                        <span
                          className={`font-semibold ${
                            product.stock <= 0
                              ? 'text-red-600'
                              : product.stock <= 5
                              ? 'text-amber-600'
                              : 'text-gray-700'
                          }`}
                        >
                          {product.stock} units
                        </span>
                        {product.stock <= 0 && (
                          <span className="text-[10px] text-red-500 font-bold block">
                            Out of Stock
                          </span>
                        )}
                      </td>

                      {/* Active Status Badge */}
                      <td className="px-4 py-4">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(product)}
                          disabled={togglingId === product.id}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                            product.is_active
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                          }`}
                        >
                          {product.is_active ? (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              <span>Active</span>
                            </>
                          ) : (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                              <span>Deactivated</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Action Buttons */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View on Store */}
                          <Link
                            href={`/products/${product.id}`}
                            className="p-2 rounded-xl text-gray-400 hover:text-[#4DA3FF] hover:bg-[#EAF6FF] transition-colors"
                            title="View on Storefront"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>

                          {/* Edit */}
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(product)}
                            className="p-2 rounded-xl text-gray-600 hover:text-purple-700 hover:bg-purple-50 transition-colors"
                            title="Edit Product"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          {/* Soft Delete */}
                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(product.id, product.name)}
                            disabled={deletingId === product.id || permDeletingId === product.id}
                            className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-40"
                            title="Deactivate Product (Soft Delete)"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          {/* Permanently Delete */}
                          <button
                            type="button"
                            onClick={() => handlePermanentDeleteProduct(product.id, product.name)}
                            disabled={permDeletingId === product.id || deletingId === product.id}
                            className="p-2 rounded-xl text-gray-400 hover:text-rose-700 hover:bg-rose-50 transition-colors disabled:opacity-40"
                            title="Permanently Delete (Hard delete if 0 orders)"
                          >
                            {permDeletingId === product.id ? (
                              <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
                            ) : (
                              <XOctagon className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Product Form Modal (Add / Edit) */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
          // remove edit query param if present
          if (editIdParam) {
            router.push('/admin/products');
          }
        }}
        productToEdit={editingProduct}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
}

export default function AdminProductsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-gray-500">Loading catalog...</div>}>
      <AdminProductsContent />
    </Suspense>
  );
}
