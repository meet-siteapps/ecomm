'use client';

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Zap,
  Check,
  ChevronRight,
  Heart,
  Star,
  ShieldCheck,
  Wrench,
  Award,
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
import { getProductById } from '@/backend/products/products';
import { Product } from '@/frontend/types/product';
import { useCartStore } from '@/frontend/store/useCartStore';
import { useAuthStore } from '@/frontend/store/useAuthStore';
import { useWishlistStore } from '@/frontend/store/useWishlistStore';
import { PincodeChecker } from '@/frontend/components/products/PincodeChecker';

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const user = useAuthStore((state) => state.user);

  const isWishlisted = useWishlistStore((state) => state.isInWishlist(id));
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);

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
        <Loader2 className="w-8 h-8 animate-spin text-[#F27A8A] mx-auto" />
        <p className="text-xs text-[#5D7285] font-medium">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-[#193653]">Product Not Found</h2>
        <p className="text-sm text-gray-500">
          The product you are looking for does not exist or has been removed.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#F27A8A] text-white text-xs font-bold shadow-cute-pink"
        >
          Back to Products
        </Link>
      </div>
    );
  }

  // Parse color and size options safely
  const colorList = product.colour
    ? product.colour.split(',').map((c: string) => c.trim()).filter(Boolean)
    : [];

  const sizeList = product.size
    ? product.size.split(',').map((s: string) => s.trim()).filter(Boolean)
    : [];

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
    router.push('/checkout');
  };

  const productImages =
    product.images && product.images.length > 0
      ? product.images
      : ['https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800&auto=format&fit=crop&q=80'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      {/* 1. BREADCRUMBS */}
      <nav className="flex items-center gap-1.5 text-xs text-[#5D7285] font-medium overflow-x-auto">
        <Link href="/" className="hover:text-[#F27A8A] transition-colors shrink-0">
          Home
        </Link>
        <ChevronRight className="w-3 h-3 shrink-0 text-gray-400" />
        <Link href={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-[#F27A8A] transition-colors shrink-0">
          {product.category}
        </Link>
        <ChevronRight className="w-3 h-3 shrink-0 text-gray-400" />
        <span className="text-[#193653] font-bold truncate shrink-0 max-w-[200px] sm:max-w-none">
          {product.name}
        </span>
      </nav>

      {/* 2. MAIN PRODUCT GALLERY & INFO GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Left Column: Image Stack + Main Gallery (5 cols) */}
        <div className="lg:col-span-6 flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 items-start">
          {/* Vertical Thumbnails */}
          {productImages.length > 1 && (
            <div className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-y-auto max-h-[480px] shrink-0 w-full sm:w-20 pb-2 sm:pb-0">
              {productImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-[#FFF9F2] border transition-all shrink-0 ${
                    selectedImageIndex === idx
                      ? 'border-[#F27A8A] ring-2 ring-[#F27A8A]/20 shadow-2xs'
                      : 'border-[#EFE6DA] hover:border-gray-300'
                  }`}
                >
                  <Image src={img} alt="" fill sizes="80px" className="object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Main Large Image Container */}
          <div className="relative w-full aspect-square bg-[#FFF9F2] rounded-3xl overflow-hidden border border-[#EFE6DA] shadow-cute">
            <Image
              src={productImages[selectedImageIndex] || productImages[0]}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />

            {/* Persistent Supabase Wishlist Button on Top Right */}
            <button
              type="button"
              onClick={async () => {
                if (!product) return;
                if (!user) {
                  router.push(`/login?redirect=/products/${id}`);
                  return;
                }
                await toggleWishlist(product, user.id);
              }}
              className={`absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center border border-[#EFE6DA] shadow-2xs transition-all duration-200 active:scale-90 z-10 hover:shadow-cute ${
                isWishlisted ? 'text-[#F27A8A] bg-[#FDE8EB] border-[#F27A8A]/30' : 'text-gray-400 hover:text-[#F27A8A]'
              }`}
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              title={isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}
            >
              <Heart className={`w-5 h-5 transition-transform duration-200 ${isWishlisted ? 'fill-[#F27A8A] scale-110' : ''}`} />
            </button>

            {/* Discount Badge */}
            {product.discount > 0 && (
              <span className="absolute top-4 left-4 px-3 py-1 text-xs font-extrabold bg-[#F27A8A] text-white rounded-full shadow-cute-pink">
                {product.discount}% OFF
              </span>
            )}
          </div>
        </div>

        {/* Right Column: Product Details & Buying Controls (6 cols) */}
        <div className="lg:col-span-6 space-y-5">
          {/* Header Info */}
          <div className="space-y-1.5">
            <span className="inline-block text-xs font-extrabold uppercase tracking-wider text-[#F27A8A] bg-[#FDE8EB] px-3 py-0.5 rounded-full">
              {product.brand || product.category}
            </span>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#193653] tracking-tight leading-tight">
              {product.name}
            </h1>
          </div>

          {/* Ratings & Reviews */}
          <div className="flex items-center gap-3">
            <div className="flex items-center text-[#E0B538]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <span className="text-xs font-bold text-[#193653]">(4.9/5)</span>
            <span className="text-xs text-[#5D7285] font-medium">• 128 verified reviews</span>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-3 p-4 bg-[#FFF9F2] rounded-2xl border border-[#EFE6DA]">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#193653]">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.mrp > product.price && (
              <span className="text-sm text-[#5D7285] line-through font-medium">
                ₹{product.mrp.toLocaleString('en-IN')}
              </span>
            )}
            {product.discount > 0 && (
              <span className="text-xs font-extrabold text-[#729c50] bg-[#EFF7E9] px-2.5 py-0.5 rounded-full">
                Save ₹{(product.mrp - product.price).toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Color Options - Only show if product has colors */}
          {colorList.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#193653]">
                Color:{' '}
                <span className="text-[#5D7285] font-normal">
                  {selectedColor || 'Select a shade'}
                </span>
              </label>
              <div className="flex items-center gap-2.5">
                {colorList.map((colorHex: string, idx: number) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedColor(colorHex)}
                    style={{ backgroundColor: colorHex }}
                    className={`w-7 h-7 rounded-full border-2 transition-all ${
                      selectedColor === colorHex
                        ? 'border-[#F27A8A] ring-2 ring-[#F27A8A]/30 scale-110 shadow-2xs'
                        : 'border-white shadow-2xs hover:scale-105'
                    }`}
                    aria-label={`Select color ${colorHex}`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size Options - Only show if product has sizes */}
          {sizeList.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#193653]">
                Size:{' '}
                <span className="text-[#5D7285] font-normal">
                  {selectedSize || 'Choose size'}
                </span>
              </label>
              <div className="flex flex-wrap gap-2">
                {sizeList.map((sz: string) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                      selectedSize === sz
                        ? 'bg-[#F27A8A] text-white border-[#F27A8A] shadow-cute-pink'
                        : 'bg-white text-[#193653] border-[#EFE6DA] hover:border-gray-300'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Stepper & Add to Cart Action */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              {/* Stepper */}
              <div className="flex items-center bg-white border border-[#EFE6DA] rounded-full p-1 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-full text-xs font-extrabold text-[#193653] hover:bg-[#FFF9F2] flex items-center justify-center transition-colors"
                >
                  -
                </button>
                <span className="w-10 text-center text-xs font-extrabold text-[#193653]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(product.stock || 10, q + 1))}
                  className="w-8 h-8 rounded-full text-xs font-extrabold text-[#193653] hover:bg-[#FFF9F2] flex items-center justify-center transition-colors"
                >
                  +
                </button>
              </div>

              {/* Full Width Add To Cart Pill */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className={`flex-1 py-3.5 px-6 rounded-full text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all shadow-cute-pink active:scale-98 ${
                  added
                    ? 'bg-[#A8C98B] text-[#193653]'
                    : 'bg-[#F27A8A] hover:bg-[#e06878] text-white disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed'
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
            </div>

            {/* Buy Now Button */}
            <button
              type="button"
              onClick={handleBuyNow}
              disabled={product.stock <= 0}
              className="w-full py-3 rounded-full bg-[#193653] hover:bg-[#12283d] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-2xs transition-all active:scale-98 disabled:opacity-50"
            >
              <Zap className="w-4 h-4 text-[#F6D77A]" />
              <span>Buy Now</span>
            </button>
          </div>

          {/* Pincode & Delivery Checker */}
          <div className="pt-2">
            <PincodeChecker />
          </div>

          {/* 3 Feature Badges matching Reference */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-3 border-t border-[#EFE6DA]">
            {/* Safe Materials */}
            <div className="p-2.5 rounded-2xl bg-[#EFF7E9] text-center space-y-1 border border-[#A8C98B]/30">
              <ShieldCheck className="w-4 h-4 text-[#729c50] mx-auto" />
              <h4 className="text-[10px] sm:text-xs font-bold text-[#193653]">Safe Materials</h4>
            </div>

            {/* Easy Care */}
            <div className="p-2.5 rounded-2xl bg-[#EBF8FC] text-center space-y-1 border border-[#8FD3E8]/40">
              <Wrench className="w-4 h-4 text-[#3599b8] mx-auto" />
              <h4 className="text-[10px] sm:text-xs font-bold text-[#193653]">Easy Care</h4>
            </div>

            {/* Durable & Sturdy */}
            <div className="p-2.5 rounded-2xl bg-[#FEF9E8] text-center space-y-1 border border-[#F6D77A]/40">
              <Award className="w-4 h-4 text-[#E0B538] mx-auto" />
              <h4 className="text-[10px] sm:text-xs font-bold text-[#193653]">Durable</h4>
            </div>
          </div>
        </div>
      </div>

      {/* 3. PRODUCT DESCRIPTION & DYNAMIC SPECIFICATIONS */}
      <div className="space-y-6">
        {/* Description Section (Only if present) */}
        {product.description && product.description.trim().length > 0 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EFE6DA] shadow-cute space-y-3">
            <h2 className="text-base sm:text-lg font-extrabold text-[#193653]">
              Product Description
            </h2>
            <div className="text-xs sm:text-sm text-[#5D7285] leading-relaxed font-medium space-y-2">
              <p>{product.description}</p>
            </div>
          </div>
        )}

        {/* Dynamic Attributes & Specifications (Only render if any attribute exists) */}
        {(product.age_group || product.material || product.category || product.brand || product.stock !== undefined) && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EFE6DA] shadow-cute space-y-4">
            <h3 className="text-base sm:text-lg font-extrabold text-[#193653]">
              Specifications & Details
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {product.age_group && (
                <div className="p-3.5 bg-[#FFF9F2] rounded-2xl border border-[#EFE6DA] space-y-1">
                  <span className="text-[11px] font-bold text-[#5D7285] uppercase tracking-wider block">Age Group</span>
                  <span className="text-xs sm:text-sm font-extrabold text-[#193653]">{product.age_group}</span>
                </div>
              )}
              {product.material && (
                <div className="p-3.5 bg-[#FFF9F2] rounded-2xl border border-[#EFE6DA] space-y-1">
                  <span className="text-[11px] font-bold text-[#5D7285] uppercase tracking-wider block">Material</span>
                  <span className="text-xs sm:text-sm font-extrabold text-[#193653]">{product.material}</span>
                </div>
              )}
              {product.category && (
                <div className="p-3.5 bg-[#FFF9F2] rounded-2xl border border-[#EFE6DA] space-y-1">
                  <span className="text-[11px] font-bold text-[#5D7285] uppercase tracking-wider block">Category</span>
                  <span className="text-xs sm:text-sm font-extrabold text-[#193653]">{product.category}</span>
                </div>
              )}
              {product.brand && (
                <div className="p-3.5 bg-[#FFF9F2] rounded-2xl border border-[#EFE6DA] space-y-1">
                  <span className="text-[11px] font-bold text-[#5D7285] uppercase tracking-wider block">Brand</span>
                  <span className="text-xs sm:text-sm font-extrabold text-[#193653]">{product.brand}</span>
                </div>
              )}
              {product.stock !== undefined && (
                <div className="p-3.5 bg-[#FFF9F2] rounded-2xl border border-[#EFE6DA] space-y-1">
                  <span className="text-[11px] font-bold text-[#5D7285] uppercase tracking-wider block">Availability</span>
                  <span className={`text-xs sm:text-sm font-extrabold ${product.stock > 0 ? 'text-[#729c50]' : 'text-red-500'}`}>
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Key Features (Only if provided) */}
        {product.key_features && Array.isArray(product.key_features) && product.key_features.filter(Boolean).length > 0 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EFE6DA] shadow-cute space-y-3">
            <h3 className="text-base sm:text-lg font-extrabold text-[#193653]">
              Key Features
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {product.key_features.filter(Boolean).map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-[#5D7285] font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F27A8A] shrink-0 mt-1.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* What's Included (Only if provided) */}
        {product.whats_included && Array.isArray(product.whats_included) && product.whats_included.filter(Boolean).length > 0 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EFE6DA] shadow-cute space-y-3">
            <h3 className="text-base sm:text-lg font-extrabold text-[#193653]">
              What&apos;s Included in the Box
            </h3>
            <div className="flex flex-wrap gap-2">
              {product.whats_included.filter(Boolean).map((inc, idx) => (
                <span key={idx} className="px-3.5 py-1.5 rounded-xl bg-[#FFF9F2] border border-[#EFE6DA] text-xs font-bold text-[#193653]">
                  {inc}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Care Instructions (Only if provided) */}
        {product.care_instructions && product.care_instructions.trim().length > 0 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EFE6DA] shadow-cute space-y-3">
            <h3 className="text-base sm:text-lg font-extrabold text-[#193653]">
              Care & Washing Instructions
            </h3>
            <p className="text-xs sm:text-sm text-[#5D7285] font-medium leading-relaxed">
              {product.care_instructions}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
