'use client';

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Zap,
  Check,
  ChevronLeft,
  Package,
  Sparkles,
  Info,
  Calendar,
  Ruler,
  Palette,
  Feather,
  HeartHandshake,
  Loader2
} from 'lucide-react';
import { getProductById } from '@/lib/supabase/products';
import { Product } from '@/types/product';
import { useCartStore } from '@/store/useCartStore';
import { PincodeChecker } from '@/components/products/PincodeChecker';

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [added, setAdded] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      setIsLoading(true);
      try {
        const data = await getProductById(id);
        if (isMounted) {
          setProduct(data);
        }
      } catch (err) {
        console.error('Failed to load product details:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-[#4DA3FF] mx-auto" />
        <p className="text-xs text-gray-500 font-medium">Loading product details...</p>
      </div>
    );
  }

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
    ? product.colour.split(',').map((c) => c.trim()).filter(Boolean)
    : [];

  // Parse size options if provided
  const sizeOptions = product.size
    ? product.size.split(',').map((s) => s.trim()).filter(Boolean)
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
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#718096] hover:text-[#FF6B8B] transition-colors bg-white px-3.5 py-1.5 rounded-full border border-[#EFE7DE] shadow-2xs"
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
          <div className="relative aspect-square w-full bg-[#FAF7F2] rounded-3xl overflow-hidden border border-[#EFE7DE] shadow-cute">
            <Image
              src={currentImage}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
            />
            {product.discount > 0 && (
              <span className="absolute top-3.5 left-3.5 px-3 py-1 text-xs font-extrabold bg-[#FF6B8B] text-white rounded-full shadow-cute-pink">
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
                  className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 shrink-0 transition-all ${
                    selectedImageIndex === idx
                      ? 'border-[#FF6B8B] ring-2 ring-[#FF6B8B]/20 shadow-2xs'
                      : 'border-[#EFE7DE] opacity-70 hover:opacity-100'
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
        {/* 2. PRODUCT MAIN INFO & ACTIONS */}
        {/* ============================================================ */}
        <div className="lg:col-span-6 space-y-6">
          {/* Brand & Name */}
          <div className="space-y-1.5 border-b border-[#EFE7DE] pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B8B]">
              {product.brand}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2D3748] tracking-tight leading-tight">
              {product.name}
            </h1>
            <div className="flex items-center gap-2.5 pt-1.5 flex-wrap">
              <span className="text-xs font-bold text-[#718096] bg-[#FAF7F2] border border-[#EFE7DE] px-3 py-1 rounded-full">
                {product.category}
              </span>
              {product.stock > 0 ? (
                <span className="text-xs font-bold text-[#059669] bg-[#D1FAE5] border border-[#A7F3D0] px-3 py-1 rounded-full">
                  In Stock ({product.stock} available)
                </span>
              ) : (
                <span className="text-xs font-bold text-[#FA5578] bg-[#FFEAEF] border border-[#FF6B8B]/30 px-3 py-1 rounded-full">
                  Out of Stock
                </span>
              )}
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl sm:text-4xl font-extrabold text-[#2D3748]">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.mrp > product.price && (
              <>
                <span className="text-base sm:text-lg text-[#A0AEC0] line-through font-medium">
                  ₹{product.mrp.toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-extrabold text-[#FF6B8B] bg-[#FFEAEF] px-2.5 py-1 rounded-full shadow-2xs">
                  Save {product.discount}%
                </span>
              </>
            )}
          </div>

          {/* Options (Color/Size - Only when applicable) */}
          {colorOptions.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#2D3748] uppercase tracking-wider">
                Available Colours
              </label>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((col) => (
                  <button
                    key={col}
                    type="button"
                    onClick={() => setSelectedColor(col)}
                    className={`px-4 py-2 rounded-2xl text-xs font-bold border transition-all ${
                      (selectedColor || colorOptions[0]) === col
                        ? 'border-[#FF6B8B] bg-[#FFEAEF] text-[#FF6B8B] ring-2 ring-[#FF6B8B]/20 shadow-2xs'
                        : 'border-[#EFE7DE] bg-white text-[#718096] hover:border-[#E2D5C8]'
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
              <label className="text-xs font-bold text-[#2D3748] uppercase tracking-wider">
                Available Sizes
              </label>
              <div className="flex flex-wrap gap-2">
                {sizeOptions.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    className={`px-4 py-2 rounded-2xl text-xs font-bold border transition-all ${
                      (selectedSize || sizeOptions[0]) === sz
                        ? 'border-[#FF6B8B] bg-[#FFEAEF] text-[#FF6B8B] ring-2 ring-[#FF6B8B]/20 shadow-2xs'
                        : 'border-[#EFE7DE] bg-white text-[#718096] hover:border-[#E2D5C8]'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector & Action Buttons */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-[#2D3748] uppercase tracking-wider">Quantity:</span>
              <div className="flex items-center border border-[#EFE7DE] rounded-full overflow-hidden bg-[#FAF7F2] shadow-2xs">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1 || product.stock <= 0}
                  className="px-3.5 py-2 text-sm font-bold text-[#2D3748] hover:bg-[#FFEAEF] disabled:opacity-40 transition-colors"
                >
                  -
                </button>
                <span className="px-4 py-2 text-xs font-extrabold text-[#2D3748] min-w-[2.5rem] text-center bg-white">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(product.stock || 99, q + 1))}
                  disabled={quantity >= product.stock || product.stock <= 0}
                  className="px-3.5 py-2 text-sm font-bold text-[#2D3748] hover:bg-[#FFEAEF] disabled:opacity-40 transition-colors"
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
                className={`py-4 px-6 rounded-full font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-cute-pink active:scale-98 ${
                  added
                    ? 'bg-[#10B981] text-white'
                    : 'bg-[#FF6B8B] hover:bg-[#FA5578] text-white disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed'
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
                className="py-4 px-6 rounded-full font-extrabold text-sm bg-[#2D3748] hover:bg-[#1A202C] text-white flex items-center justify-center gap-2 transition-all shadow-cute active:scale-98 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                <Zap className="w-4 h-4 text-[#FBBF24]" />
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
            <div className="pt-2 border-t border-[#EFE7DE] space-y-2">
              <h3 className="text-xs font-bold text-[#2D3748] uppercase tracking-wider">
                Product Description
              </h3>
              <p className="text-sm text-[#718096] leading-relaxed font-medium">
                {product.description}
              </p>
            </div>
          )}

          {/* ============================================================ */}
          {/* 3. OPTIONAL PRODUCT DETAILS */}
          {/* Only rendered if populated. Never shows empty fields. */}
          {/* ============================================================ */}
          {hasSpecifications && (
            <div className="pt-4 border-t border-[#EFE7DE] space-y-4">
              <h3 className="text-xs font-bold text-[#2D3748] uppercase tracking-wider flex items-center gap-2">
                <Info className="w-4 h-4 text-[#FF6B8B]" />
                Specifications & Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Age Group */}
                {product.age_group && (
                  <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EFE7DE] flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-xl bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center shrink-0">
                      <Calendar className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-[#A0AEC0] font-medium block">Age Group</span>
                      <span className="font-bold text-[#2D3748]">{product.age_group}</span>
                    </div>
                  </div>
                )}

                {/* Size */}
                {product.size && (
                  <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EFE7DE] flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shrink-0">
                      <Ruler className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-[#A0AEC0] font-medium block">Size</span>
                      <span className="font-bold text-[#2D3748]">{product.size}</span>
                    </div>
                  </div>
                )}

                {/* Colour */}
                {product.colour && (
                  <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EFE7DE] flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-xl bg-[#F3E8FF] text-[#8B5CF6] flex items-center justify-center shrink-0">
                      <Palette className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-[#A0AEC0] font-medium block">Colour</span>
                      <span className="font-bold text-[#2D3748]">{product.colour}</span>
                    </div>
                  </div>
                )}

                {/* Material */}
                {product.material && (
                  <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EFE7DE] flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-xl bg-[#D1FAE5] text-[#059669] flex items-center justify-center shrink-0">
                      <Feather className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-[#A0AEC0] font-medium block">Material</span>
                      <span className="font-bold text-[#2D3748]">{product.material}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Key Features (Only when present) */}
              {product.key_features && product.key_features.length > 0 && (
                <div className="p-4 rounded-3xl bg-[#FAF7F2] border border-[#EFE7DE] space-y-2">
                  <h4 className="text-xs font-bold text-[#2D3748] flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#FF6B8B]" />
                    Key Features
                  </h4>
                  <ul className="space-y-1.5 text-xs text-[#718096]">
                    {product.key_features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-[#FF6B8B] shrink-0 mt-0.5" />
                        <span className="font-medium">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* What's Included (Only when present) */}
              {product.whats_included && product.whats_included.length > 0 && (
                <div className="p-4 rounded-3xl bg-[#FAF7F2] border border-[#EFE7DE] space-y-2">
                  <h4 className="text-xs font-bold text-[#2D3748] flex items-center gap-2">
                    <Package className="w-3.5 h-3.5 text-[#FF6B8B]" />
                    What&apos;s Included
                  </h4>
                  <ul className="space-y-1 text-xs text-[#718096]">
                    {product.whats_included.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B8B]" />
                        <span className="font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Care Instructions (Only when present) */}
              {product.care_instructions && (
                <div className="p-4 rounded-3xl bg-[#FAF7F2] border border-[#EFE7DE] space-y-1.5">
                  <h4 className="text-xs font-bold text-[#2D3748] flex items-center gap-2">
                    <HeartHandshake className="w-3.5 h-3.5 text-[#FF6B8B]" />
                    Care Instructions
                  </h4>
                  <p className="text-xs text-[#718096] leading-relaxed font-medium">
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
