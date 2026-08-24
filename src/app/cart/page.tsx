'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  ChevronLeft,
  Truck,
  ShieldCheck,
  Sparkles,
  ArrowLeft,
  Check
} from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

export default function CartPage() {
  const [mounted, setMounted] = useState(false);

  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const getSubtotal = useCartStore((state) => state.getSubtotal);
  const getShippingFee = useCartStore((state) => state.getShippingFee);
  const getTotalSavings = useCartStore((state) => state.getTotalSavings);
  const getTotal = useCartStore((state) => state.getTotal);
  const freeShippingThreshold = useCartStore((state) => state.freeShippingThreshold);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center text-sm text-gray-500">
        Loading shopping bag...
      </div>
    );
  }

  const subtotal = getSubtotal();
  const shippingFee = getShippingFee();
  const savings = getTotalSavings();
  const total = getTotal();

  // Free shipping progress
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const shippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-5">
        <div className="w-20 h-20 rounded-3xl bg-[#EAF6FF] text-[#4DA3FF] flex items-center justify-center mx-auto shadow-sm">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] tracking-tight">
            Your Cart is Empty
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto">
            Looks like you haven&apos;t added any items to your bag yet. Explore our curated collections for your little ones.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#4DA3FF] hover:bg-[#2B8BE6] text-white font-bold text-xs sm:text-sm transition-all shadow-xs active:scale-98"
          >
            <span>Explore Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] tracking-tight">
            Shopping Bag
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <button
          type="button"
          onClick={clearCart}
          className="text-xs font-semibold text-gray-500 hover:text-red-600 transition-colors"
        >
          Clear Cart
        </button>
      </div>

      {/* Main Grid: Cart Items (Left 2 cols) + Order Summary (Right 1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ============================================================ */}
        {/* LEFT: CART ITEMS LIST */}
        {/* ============================================================ */}
        <div className="lg:col-span-8 space-y-4">
          {/* Free Shipping Progress Alert */}
          <div className="p-4 rounded-2xl bg-[#EAF6FF]/60 border border-[#4DA3FF]/20 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-[#1F2937] font-semibold">
                <Truck className="w-4 h-4 text-[#4DA3FF]" />
                {amountNeededForFreeShipping === 0 ? (
                  <span className="text-emerald-700 font-bold">
                    🎉 You unlocked FREE Standard Shipping!
                  </span>
                ) : (
                  <span>
                    Add <strong className="text-[#4DA3FF]">₹{amountNeededForFreeShipping.toLocaleString('en-IN')}</strong> more for <strong className="text-emerald-700">FREE Delivery</strong>
                  </span>
                )}
              </div>
              <span className="text-[11px] font-bold text-gray-500">{shippingProgress}%</span>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-2 rounded-full bg-white overflow-hidden shadow-2xs">
              <div
                className="h-full bg-gradient-to-r from-[#4DA3FF] to-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${shippingProgress}%` }}
              />
            </div>
          </div>

          {/* Items Container */}
          <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs divide-y divide-gray-100 overflow-hidden">
            {items.map((item, index) => {
              const { product, quantity, selectedColor, selectedSize } = item;
              const coverImage =
                product.images && product.images.length > 0
                  ? product.images[0]
                  : 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800&auto=format&fit=crop&q=80';

              const itemTotal = product.price * quantity;

              return (
                <div key={`${product.id}-${index}`} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  {/* Thumbnail & Product Details */}
                  <div className="flex items-center gap-4 flex-1">
                    <Link
                      href={`/products/${product.id}`}
                      className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-[#EAF6FF]/30 border border-gray-200 shrink-0 block"
                    >
                      <Image
                        src={coverImage}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </Link>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#4DA3FF] block">
                        {product.brand}
                      </span>
                      <Link
                        href={`/products/${product.id}`}
                        className="text-sm sm:text-base font-bold text-[#1F2937] hover:text-[#4DA3FF] transition-colors line-clamp-1 block"
                      >
                        {product.name}
                      </Link>

                      {/* Variant Options pills */}
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {selectedColor && (
                          <span className="text-[10px] font-medium bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md">
                            Color: {selectedColor}
                          </span>
                        )}
                        {selectedSize && (
                          <span className="text-[10px] font-medium bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md">
                            Size: {selectedSize}
                          </span>
                        )}
                      </div>

                      {/* Unit Price */}
                      <div className="flex items-baseline gap-2 pt-1">
                        <span className="text-sm font-bold text-[#1F2937]">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        {product.mrp > product.price && (
                          <span className="text-xs text-gray-400 line-through">
                            ₹{product.mrp.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quantity & Item Subtotal & Delete Action */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                    {/* Quantity Controls */}
                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50 shadow-2xs">
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="px-2.5 py-1.5 text-xs text-gray-600 hover:bg-gray-200 transition-colors"
                      >
                        -
                      </button>
                      <span className="px-3 py-1.5 text-xs font-bold text-[#1F2937] min-w-[2rem] text-center bg-white">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        disabled={quantity >= (product.stock || 99)}
                        className="px-2.5 py-1.5 text-xs text-gray-600 hover:bg-gray-200 disabled:opacity-40 transition-colors"
                      >
                        +
                      </button>
                    </div>

                    {/* Total Price */}
                    <span className="text-base font-extrabold text-[#1F2937] min-w-[5rem] text-right">
                      ₹{itemTotal.toLocaleString('en-IN')}
                    </span>

                    {/* Remove */}
                    <button
                      type="button"
                      onClick={() => removeItem(product.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Continue Shopping Link */}
          <div className="pt-2">
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4DA3FF] hover:underline"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>

        {/* ============================================================ */}
        {/* RIGHT: ORDER SUMMARY CARD */}
        {/* ============================================================ */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs space-y-5 sticky top-24">
            <h2 className="text-base font-bold text-[#1F2937]">Order Summary</h2>

            <div className="space-y-3 text-xs text-gray-600 divide-y divide-gray-100">
              <div className="flex justify-between items-center pt-1">
                <span>Items Subtotal</span>
                <span className="font-semibold text-[#1F2937]">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between items-center pt-3">
                <span>Shipping Fee</span>
                <span className="font-semibold">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-600 font-bold">FREE</span>
                  ) : (
                    `₹${shippingFee}`
                  )}
                </span>
              </div>

              {savings > 0 && (
                <div className="flex justify-between items-center pt-3 text-emerald-600 font-medium">
                  <span>Total Savings</span>
                  <span>-₹{savings.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between items-baseline pt-4 text-base">
                <span className="font-extrabold text-[#1F2937]">Grand Total</span>
                <span className="font-extrabold text-xl text-[#1F2937]">
                  ₹{total.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <Link
              href="/checkout"
              className="w-full py-3.5 px-6 rounded-xl bg-[#4DA3FF] hover:bg-[#2B8BE6] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xs hover:shadow-md active:scale-98"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {/* Trust Badges */}
            <div className="pt-2 border-t border-gray-100 flex items-center justify-center gap-4 text-[11px] text-gray-500">
              <div className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Safe Payments</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#4DA3FF]" />
                <span>Easy Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
