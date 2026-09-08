'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  X,
  UploadCloud,
  Loader2,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Info
} from 'lucide-react';
import { Product } from '@/types/product';
import { createProduct, updateProduct } from '@/lib/api/products';
import { uploadProductImage } from '@/lib/supabase/storage';
import { SAMPLE_CATEGORIES } from '@/lib/constants';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
  onSuccess: (savedProduct: Product) => void;
}

export function ProductFormModal({
  isOpen,
  onClose,
  productToEdit,
  onSuccess,
}: ProductFormModalProps) {
  const isEditMode = Boolean(productToEdit);

  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState(SAMPLE_CATEGORIES[0]?.name || 'Clothing');
  const [subcategory, setSubcategory] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [mrp, setMrp] = useState<number>(999);
  const [price, setPrice] = useState<number>(799);
  const [discount, setDiscount] = useState<number>(20);
  const [stock, setStock] = useState<number>(10);
  const [isActive, setIsActive] = useState<boolean>(true);

  // Specifications
  const [ageGroup, setAgeGroup] = useState('');
  const [size, setSize] = useState('');
  const [colour, setColour] = useState('');
  const [material, setMaterial] = useState('');
  const [description, setDescription] = useState('');
  const [careInstructions, setCareInstructions] = useState('');

  // Dynamic Lists
  const [keyFeatures, setKeyFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState('');
  const [whatsIncluded, setWhatsIncluded] = useState<string[]>([]);
  const [newIncluded, setNewIncluded] = useState('');

  // Image URL input fallback
  const [customImageUrl, setCustomImageUrl] = useState('');

  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Populate form on edit
  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name || '');
      setBrand(productToEdit.brand || '');
      setCategory(productToEdit.category || SAMPLE_CATEGORIES[0]?.name || 'Clothing');
      setSubcategory(productToEdit.subcategory || '');
      setImages(productToEdit.images || []);
      setMrp(productToEdit.mrp || 0);
      setPrice(productToEdit.price || 0);
      setDiscount(productToEdit.discount || 0);
      setStock(productToEdit.stock || 0);
      setIsActive(productToEdit.is_active ?? true);
      setAgeGroup(productToEdit.age_group || '');
      setSize(productToEdit.size || '');
      setColour(productToEdit.colour || '');
      setMaterial(productToEdit.material || '');
      setDescription(productToEdit.description || '');
      setCareInstructions(productToEdit.care_instructions || '');
      setKeyFeatures(productToEdit.key_features || []);
      setWhatsIncluded(productToEdit.whats_included || []);
    } else {
      // Defaults for new product
      setName('');
      setBrand('');
      setCategory(SAMPLE_CATEGORIES[0]?.name || 'Clothing');
      setSubcategory('');
      setImages([]);
      setMrp(999);
      setPrice(799);
      setDiscount(20);
      setStock(10);
      setIsActive(true);
      setAgeGroup('');
      setSize('');
      setColour('');
      setMaterial('');
      setDescription('');
      setCareInstructions('');
      setKeyFeatures([]);
      setWhatsIncluded([]);
    }
    setError(null);
  }, [productToEdit, isOpen]);

  // Recalculate discount when MRP or Price changes
  const handlePriceChange = (newPrice: number, newMrp: number) => {
    setPrice(newPrice);
    setMrp(newMrp);
    if (newMrp > 0 && newMrp >= newPrice) {
      const calcDiscount = Math.round(((newMrp - newPrice) / newMrp) * 100);
      setDiscount(calcDiscount);
    } else {
      setDiscount(0);
    }
  };

  // Upload image to Supabase Storage
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setError(null);

    try {
      const uploadPromises = Array.from(files).map((file) => uploadProductImage(file));
      const uploadedUrls = await Promise.all(uploadPromises);
      setImages((prev) => [...prev, ...uploadedUrls]);
    } catch (err: any) {
      console.error('Image upload failed:', err);
      setError(err.message || 'Failed to upload image. Please try again or use direct image URL.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleAddImageUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (customImageUrl.trim()) {
      setImages((prev) => [...prev, customImageUrl.trim()]);
      setCustomImageUrl('');
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setKeyFeatures((prev) => [...prev, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (idx: number) => {
    setKeyFeatures((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleAddIncluded = () => {
    if (newIncluded.trim()) {
      setWhatsIncluded((prev) => [...prev, newIncluded.trim()]);
      setNewIncluded('');
    }
  };

  const handleRemoveIncluded = (idx: number) => {
    setWhatsIncluded((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Product name is required.');
      return;
    }
    if (price <= 0 || mrp <= 0) {
      setError('Price and MRP must be greater than 0.');
      return;
    }

    setIsSubmitting(true);

    try {
      const productPayload = {
        name: name.trim(),
        brand: brand.trim(),
        category: category.trim(),
        subcategory: subcategory.trim(),
        images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800&auto=format&fit=crop&q=80'],
        mrp: Number(mrp),
        price: Number(price),
        discount: Number(discount),
        stock: Number(stock),
        is_active: isActive,
        age_group: ageGroup.trim(),
        size: size.trim(),
        colour: colour.trim(),
        material: material.trim(),
        description: description.trim(),
        whats_included: whatsIncluded,
        key_features: keyFeatures,
        care_instructions: careInstructions.trim(),
      };

      let saved: Product;
      if (isEditMode && productToEdit) {
        saved = await updateProduct(productToEdit.id, productPayload);
      } else {
        saved = await createProduct(productPayload);
      }

      onSuccess(saved);
      onClose();
    } catch (err: any) {
      console.error('Failed to save product:', err);
      setError(err.message || 'An error occurred while saving the product to Supabase.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl my-8 bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/70">
          <div>
            <h2 className="text-lg font-bold text-[#1F2937]">
              {isEditMode ? 'Edit Product' : 'Add New Product'}
            </h2>
            <p className="text-xs text-gray-500">
              {isEditMode
                ? 'Update product details in your live catalog'
                : 'Publish a new item directly to your store'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* 1. Basic Info */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              1. Basic Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold text-gray-700">Product Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Organic Cotton Baby Romper"
                  className="w-full text-xs text-[#1F2937] bg-gray-50/50 rounded-xl px-3.5 py-2.5 border border-gray-200 focus:bg-white focus:border-[#4DA3FF] focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/20"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700">Brand</label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g. LittleHaven"
                  className="w-full text-xs text-[#1F2937] bg-gray-50/50 rounded-xl px-3.5 py-2.5 border border-gray-200 focus:bg-white focus:border-[#4DA3FF] focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/20"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-xs text-[#1F2937] bg-gray-50/50 rounded-xl px-3.5 py-2.5 border border-gray-200 focus:bg-white focus:border-[#4DA3FF] focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/20 cursor-pointer"
                >
                  {SAMPLE_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700">Subcategory (Optional)</label>
                <input
                  type="text"
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                  placeholder="e.g. Rompers, Educational, Feeding"
                  className="w-full text-xs text-[#1F2937] bg-gray-50/50 rounded-xl px-3.5 py-2.5 border border-gray-200 focus:bg-white focus:border-[#4DA3FF] focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/20"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700">Status</label>
                <div className="flex items-center gap-3 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-[#1F2937]">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="w-4 h-4 text-[#4DA3FF] rounded-md border-gray-300 focus:ring-[#4DA3FF]"
                    />
                    <span>Active (Visible on Customer Store)</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Pricing & Stock */}
          <div className="space-y-4 pt-2 border-t border-gray-100">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              2. Pricing & Inventory
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700">MRP (₹) *</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={mrp}
                  onChange={(e) => handlePriceChange(price, Number(e.target.value))}
                  className="w-full text-xs text-[#1F2937] bg-gray-50/50 rounded-xl px-3.5 py-2.5 border border-gray-200 focus:bg-white focus:border-[#4DA3FF] focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/20"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700">Selling Price (₹) *</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={price}
                  onChange={(e) => handlePriceChange(Number(e.target.value), mrp)}
                  className="w-full text-xs text-[#1F2937] bg-gray-50/50 rounded-xl px-3.5 py-2.5 border border-gray-200 focus:bg-white focus:border-[#4DA3FF] focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/20"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700">Discount (%)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="w-full text-xs text-[#1F2937] bg-gray-50/50 rounded-xl px-3.5 py-2.5 border border-gray-200 focus:bg-white focus:border-[#4DA3FF] focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/20"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700">Stock Quantity</label>
                <input
                  type="number"
                  min={0}
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value))}
                  className="w-full text-xs text-[#1F2937] bg-gray-50/50 rounded-xl px-3.5 py-2.5 border border-gray-200 focus:bg-white focus:border-[#4DA3FF] focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/20"
                />
              </div>
            </div>
          </div>

          {/* 3. Product Images (Storage upload & URL) */}
          <div className="space-y-3 pt-2 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                3. Product Images
              </h3>
              <span className="text-[11px] text-gray-400">
                Uploaded directly to Supabase Storage <code>products</code>
              </span>
            </div>

            {/* Upload Area */}
            <div className="border-2 border-dashed border-gray-200 hover:border-[#4DA3FF] rounded-2xl p-4 text-center transition-colors bg-gray-50/40">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                multiple
                accept="image/*"
                className="hidden"
                id="product-image-upload"
              />
              <label
                htmlFor="product-image-upload"
                className="cursor-pointer flex flex-col items-center justify-center gap-1.5"
              >
                {isUploading ? (
                  <Loader2 className="w-6 h-6 animate-spin text-[#4DA3FF]" />
                ) : (
                  <UploadCloud className="w-6 h-6 text-[#4DA3FF]" />
                )}
                <span className="text-xs font-semibold text-[#1F2937]">
                  {isUploading ? 'Uploading to Supabase Storage...' : 'Click to Upload Product Images'}
                </span>
                <span className="text-[10px] text-gray-400">PNG, JPG, WEBP up to 5MB</span>
              </label>
            </div>

            {/* Direct URL Input */}
            <div className="flex gap-2">
              <input
                type="url"
                value={customImageUrl}
                onChange={(e) => setCustomImageUrl(e.target.value)}
                placeholder="Or paste an image URL (e.g. https://images.unsplash.com/...)"
                className="flex-1 text-xs text-[#1F2937] bg-gray-50/50 rounded-xl px-3.5 py-2 border border-gray-200 focus:bg-white focus:border-[#4DA3FF] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-semibold text-gray-700 transition-colors"
              >
                Add URL
              </button>
            </div>

            {/* Thumbnail Gallery Preview */}
            {images.length > 0 && (
              <div className="flex flex-wrap gap-3 pt-2">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200 group"
                  >
                    <Image src={img} alt={`Preview ${idx + 1}`} fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-xs"
                      title="Remove image"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                    {idx === 0 && (
                      <span className="absolute bottom-0 inset-x-0 bg-[#4DA3FF] text-white text-[9px] font-bold text-center py-0.5">
                        Cover
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 4. Specifications */}
          <div className="space-y-4 pt-2 border-t border-gray-100">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              4. Specifications (Optional)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700">Age Group</label>
                <input
                  type="text"
                  value={ageGroup}
                  onChange={(e) => setAgeGroup(e.target.value)}
                  placeholder="e.g. 0–12 Months, 1–4 Years"
                  className="w-full text-xs text-[#1F2937] bg-gray-50/50 rounded-xl px-3.5 py-2.5 border border-gray-200 focus:bg-white focus:border-[#4DA3FF] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700">Size(s)</label>
                <input
                  type="text"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  placeholder="e.g. 0–6M, 6–12M, Large (22L)"
                  className="w-full text-xs text-[#1F2937] bg-gray-50/50 rounded-xl px-3.5 py-2.5 border border-gray-200 focus:bg-white focus:border-[#4DA3FF] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700">Colour(s)</label>
                <input
                  type="text"
                  value={colour}
                  onChange={(e) => setColour(e.target.value)}
                  placeholder="e.g. Sky Blue, Soft Mint"
                  className="w-full text-xs text-[#1F2937] bg-gray-50/50 rounded-xl px-3.5 py-2.5 border border-gray-200 focus:bg-white focus:border-[#4DA3FF] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700">Material</label>
                <input
                  type="text"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  placeholder="e.g. 100% Organic Cotton"
                  className="w-full text-xs text-[#1F2937] bg-gray-50/50 rounded-xl px-3.5 py-2.5 border border-gray-200 focus:bg-white focus:border-[#4DA3FF] focus:outline-none"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold text-gray-700">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed information about the product..."
                  className="w-full text-xs text-[#1F2937] bg-gray-50/50 rounded-xl p-3 border border-gray-200 focus:bg-white focus:border-[#4DA3FF] focus:outline-none"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold text-gray-700">Care Instructions</label>
                <input
                  type="text"
                  value={careInstructions}
                  onChange={(e) => setCareInstructions(e.target.value)}
                  placeholder="e.g. Machine wash cold gentle cycle. Tumble dry low."
                  className="w-full text-xs text-[#1F2937] bg-gray-50/50 rounded-xl px-3.5 py-2.5 border border-gray-200 focus:bg-white focus:border-[#4DA3FF] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* 5. Key Features & What's Included */}
          <div className="space-y-4 pt-2 border-t border-gray-100">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              5. Highlights & Package Content
            </h3>

            {/* Key Features */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-700">Key Features</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddFeature();
                    }
                  }}
                  placeholder="e.g. Nickel-free snaps along the inseam"
                  className="flex-1 text-xs text-[#1F2937] bg-gray-50/50 rounded-xl px-3.5 py-2 border border-gray-200 focus:bg-white focus:border-[#4DA3FF] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="px-3.5 py-2 rounded-xl bg-[#4DA3FF] text-white text-xs font-semibold hover:bg-[#2B8BE6]"
                >
                  Add
                </button>
              </div>

              {keyFeatures.length > 0 && (
                <div className="space-y-1 pt-1">
                  {keyFeatures.map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-200 text-xs text-gray-700"
                    >
                      <span>• {feat}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(idx)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* What's Included */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-semibold text-gray-700">What&apos;s Included</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newIncluded}
                  onChange={(e) => setNewIncluded(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddIncluded();
                    }
                  }}
                  placeholder="e.g. 1x Organic Romper, 1x Beanie"
                  className="flex-1 text-xs text-[#1F2937] bg-gray-50/50 rounded-xl px-3.5 py-2 border border-gray-200 focus:bg-white focus:border-[#4DA3FF] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddIncluded}
                  className="px-3.5 py-2 rounded-xl bg-[#4DA3FF] text-white text-xs font-semibold hover:bg-[#2B8BE6]"
                >
                  Add
                </button>
              </div>

              {whatsIncluded.length > 0 && (
                <div className="space-y-1 pt-1">
                  {whatsIncluded.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-200 text-xs text-gray-700"
                    >
                      <span>• {item}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveIncluded(idx)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3 sticky bottom-0 bg-white py-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="px-6 py-2.5 rounded-xl bg-[#4DA3FF] hover:bg-[#2B8BE6] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving to Supabase...</span>
                </>
              ) : (
                <span>{isEditMode ? 'Save Changes' : 'Publish Product'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
