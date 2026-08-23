'use client';

import { useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Zap,
  Check,
  ChevronLeft,
  ShieldCheck,
  Package,
  Layers,
  Sparkles,
  Info,
  Calendar,
  Ruler,
  Palette,
  Feather,
  Box,
  Scale,
  HeartHandshake
} from 'lucide-react';
import { SAMPLE_PRODUCTS } from '@/data/sampleProducts';
import { useCartStore } from '@/store/useCartStore';
import { PincodeChecker } from '@/components/products/PincodeChecker';

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);

  const product = SAMPLE_PRODUCTS.find((p) => p.id === id);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-[#1F2937]">Product Not Found</h2>
        <p className="text-sm text-gray-500">
          The product you are looking for does not exist or has been removed.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4DA3FF] text-white text-sm font-semibold hover:bg-[#2B8BE6] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Products
        </Link>
      </div>
    );
  }

  // Parse color options if provided
  const colorOptions = product.colour
    ? product.colour.split(',').map((c) => c.trim())
    : [];

  // Parse size options if provided
  const sizeOptions = product.size
    ? product.size.split(',').map((s) => s.trim())
    : [];

  const handleAddToCart = () => {
    addItem(product, quantity, selectedColor || colorOptions[0], selectedSize || sizeOptions[0]);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addItem(product, quantity, selectedColor || colorOptions[0], selectedSize || sizeOptions[0]);
    router.push('/cart');
  };

  const currentImage =
    product.images && product.images.length > 0
      ? product.images[selectedImageIndex] || product.images[0]
      : 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800&auto=format&fit=crop&q=80';

  // Check which optional specification fields exist
  const hasSpecifications = Boolean(
    product.age_group ||
    product.size ||
    product.colour ||
    product.material ||
    product.dimensions ||
    product.weight ||
    (product.key_features && product.key_features.length > 0) ||
    (product.whats_included && product.whats_included.length > 0) ||
    product.care_instructions
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Breadcrumb / Back Link */}
      <nav className="mb-6">
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#4DA3FF] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </Link>
      </nav>

      {/* Main Product Layout: Left (Images) & Right (Details & Buy) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* ============================================================ */}
        {/* 1. IMAGES GALLERY */}
        {/* ============================================================ */}
        <div className="lg:col-span-6 space-y-3">
          {/* Main Display Image */}
          <div className="relative aspect-square w-full bg-[#EAF6FF]/30 rounded-2xl overflow-hidden border border-gray-200/80 shadow-xs">
            <Image
              src={currentImage}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
            />
            {product.discount > 0 && (
              <span className="absolute top-3 left-3 px-2.5 py-1 text-xs font-bold bg-[#4DA3FF] text-white rounded-lg shadow-xs">
                {product.discount}% OFF
              </span>
            )}
          </div>

          {/* Thumbnail Gallery (Only rendered if multiple images exist) */}
          {product.images && product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    selectedImageIndex === idx
                      ? 'border-[#4DA3FF] ring-2 ring-[#4DA3FF]/20'
                      : 'border-gray-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ============================================================ */}
        {/* 2. PRODUCT MAIN INFO & ACTIONS (Exact Roadmap Flow) */}
        {/* Images -> Name -> Price -> Options -> Quantity -> Cart/Buy -> Delivery -> Description -> Available Details */}
        {/* ============================================================ */}
        <div className="lg:col-span-6 space-y-6">
          {/* Brand & Name */}
          <div className="space-y-1.5 border-b border-gray-100 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#4DA3FF]">
              {product.brand}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] tracking-tight leading-tight">
              {product.name}
            </h1>
            <div className="flex items-center gap-3 pt-1">
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-md">
                {product.category}
              </span>
              {product.stock > 0 ? (
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md">
                  In Stock ({product.stock} available)
                </span>
              ) : (
                <span className="text-xs font-semibold text-red-600 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-md">
                  Out of Stock
                </span>
              )}
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl sm:text-4xl font-extrabold text-[#1F2937]">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.mrp > product.price && (
              <>
                <span className="text-base sm:text-lg text-gray-400 line-through">
                  ₹{product.mrp.toLocaleString('en-IN')}
                </span>
                <span className="text-sm font-bold text-[#4DA3FF] bg-[#EAF6FF] px-2 py-0.5 rounded-md">
                  Save {product.discount}%
                </span>
              </>
            )}
          </div>

          {/* Options (Color/Size - Only when applicable) */}
          {colorOptions.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Available Colours
              </label>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((col) => (
                  <button
                    key={col}
                    type="button"
                    onClick={() => setSelectedColor(col)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      (selectedColor || colorOptions[0]) === col
                        ? 'border-[#4DA3FF] bg-[#EAF6FF] text-[#4DA3FF] ring-2 ring-[#4DA3FF]/20'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {col}
                  </button>
                ))}
              </div>
            </div>
          )}

          {sizeOptions.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Available Sizes
              </label>
              <div className="flex flex-wrap gap-2">
                {sizeOptions.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      (selectedSize || sizeOptions[0]) === sz
                        ? 'border-[#4DA3FF] bg-[#EAF6FF] text-[#4DA3FF] ring-2 ring-[#4DA3FF]/20'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector & Action Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Quantity:</span>
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1 || product.stock <= 0}
                  className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition-colors"
                >
                  -
                </button>
                <span className="px-4 py-2 text-xs font-bold text-[#1F2937] min-w-[2.5rem] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(product.stock || 99, q + 1))}
                  disabled={quantity >= product.stock || product.stock <= 0}
                  className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons: Add to Cart & Buy Now */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className={`py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-xs active:scale-98 ${
                  added
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#4DA3FF] hover:bg-[#2B8BE6] text-white disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="py-3.5 px-6 rounded-xl font-bold text-sm bg-[#1F2937] hover:bg-black text-white flex items-center justify-center gap-2 transition-all shadow-xs active:scale-98 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Buy Now</span>
              </button>
            </div>
          </div>

          {/* Delivery & Pincode Checker */}
          <div className="pt-2">
            <PincodeChecker />
          </div>

          {/* Short Description */}
          {product.description && (
            <div className="pt-2 border-t border-gray-100 space-y-2">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Product Description
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {/* ============================================================ */}
          {/* 3. OPTIONAL PRODUCT DETAILS (Dynamic Display Rule) */}
          {/* Only rendered if populated. Never shows empty fields/labels. */}
          {/* ============================================================ */}
          {hasSpecifications && (
            <div className="pt-4 border-t border-gray-100 space-y-4">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <Info className="w-4 h-4 text-[#4DA3FF]" />
                Specifications & Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Age Group */}
                {product.age_group && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-gray-100 flex items-start gap-2.5">
                    <Calendar className="w-4 h-4 text-[#4DA3FF] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-gray-400 font-medium block">Age Group</span>
                      <span className="font-semibold text-[#1F2937]">{product.age_group}</span>
                    </div>
                  </div>
                )}

                {/* Size */}
                {product.size && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-gray-100 flex items-start gap-2.5">
                    <Ruler className="w-4 h-4 text-[#4DA3FF] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-gray-400 font-medium block">Size</span>
                      <span className="font-semibold text-[#1F2937]">{product.size}</span>
                    </div>
                  </div>
                )}

                {/* Colour */}
                {product.colour && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-gray-100 flex items-start gap-2.5">
                    <Palette className="w-4 h-4 text-[#4DA3FF] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-gray-400 font-medium block">Colour</span>
                      <span className="font-semibold text-[#1F2937]">{product.colour}</span>
                    </div>
                  </div>
                )}

                {/* Material */}
                {product.material && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-gray-100 flex items-start gap-2.5">
                    <Feather className="w-4 h-4 text-[#4DA3FF] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-gray-400 font-medium block">Material</span>
                      <span className="font-semibold text-[#1F2937]">{product.material}</span>
                    </div>
                  </div>
                )}

                {/* Dimensions */}
                {product.dimensions && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-gray-100 flex items-start gap-2.5">
                    <Box className="w-4 h-4 text-[#4DA3FF] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-gray-400 font-medium block">Dimensions</span>
                      <span className="font-semibold text-[#1F2937]">{product.dimensions}</span>
                    </div>
                  </div>
                )}

                {/* Weight */}
                {product.weight && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-gray-100 flex items-start gap-2.5">
                    <Scale className="w-4 h-4 text-[#4DA3FF] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-gray-400 font-medium block">Weight</span>
                      <span className="font-semibold text-[#1F2937]">{product.weight}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Key Features (Only when present) */}
              {product.key_features && product.key_features.length > 0 && (
                <div className="p-4 rounded-xl bg-[#EAF6FF]/40 border border-gray-200/80 space-y-2">
                  <h4 className="text-xs font-bold text-[#1F2937] flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#4DA3FF]" />
                    Key Features
                  </h4>
                  <ul className="space-y-1.5 text-xs text-gray-600">
                    {product.key_features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-[#4DA3FF] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* What's Included (Only when present) */}
              {product.whats_included && product.whats_included.length > 0 && (
                <div className="p-4 rounded-xl bg-slate-50 border border-gray-100 space-y-2">
                  <h4 className="text-xs font-bold text-[#1F2937] flex items-center gap-2">
                    <Package className="w-3.5 h-3.5 text-[#4DA3FF]" />
                    What&apos;s Included
                  </h4>
                  <ul className="space-y-1 text-xs text-gray-600">
                    {product.whats_included.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#4DA3FF]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Care Instructions (Only when present) */}
              {product.care_instructions && (
                <div className="p-4 rounded-xl bg-slate-50 border border-gray-100 space-y-1.5">
                  <h4 className="text-xs font-bold text-[#1F2937] flex items-center gap-2">
                    <HeartHandshake className="w-3.5 h-3.5 text-[#4DA3FF]" />
                    Care Instructions
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {product.care_instructions}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
