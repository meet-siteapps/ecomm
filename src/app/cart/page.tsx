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
        <div className="w-20 h-20 rounded-3xl bg-[#FFEAEF] text-[#FF6B8B] flex items-center justify-center mx-auto shadow-cute-pink">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2D3748] tracking-tight">
            Your Cart is Empty
          </h1>
          <p className="text-xs sm:text-sm text-[#718096] max-w-sm mx-auto font-medium">
            Looks like you haven&apos;t added any items to your bag yet. Explore our curated collections for your little ones.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#FF6B8B] hover:bg-[#FA5578] text-white font-extrabold text-xs sm:text-sm transition-all shadow-cute-pink active:scale-98"
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
      <div className="flex items-center justify-between border-b border-[#EFE7DE] pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2D3748] tracking-tight">
            Shopping Bag
          </h1>
          <p className="text-xs text-[#718096] mt-0.5 font-medium">
            {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <button
          type="button"
          onClick={clearCart}
          className="text-xs font-bold text-[#718096] hover:text-[#FA5578] transition-colors"
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
          <div className="p-4 rounded-3xl bg-[#FAF7F2] border border-[#EFE7DE] space-y-2 shadow-2xs">
            <div className="flex items-center justify-between text-xs font-bold">
              <div className="flex items-center gap-2 text-[#2D3748]">
                <div className="w-6 h-6 rounded-lg bg-[#FFEAEF] text-[#FF6B8B] flex items-center justify-center">
                  <Truck className="w-3.5 h-3.5" />
                </div>
                {amountNeededForFreeShipping === 0 ? (
                  <span className="text-[#059669] font-extrabold">
                    🎉 You unlocked FREE Standard Shipping!
                  </span>
                ) : (
                  <span>
                    Add <strong className="text-[#FF6B8B]">₹{amountNeededForFreeShipping.toLocaleString('en-IN')}</strong> more for <strong className="text-[#059669]">FREE Delivery</strong>
                  </span>
                )}
              </div>
              <span className="text-[11px] font-extrabold text-[#718096]">{shippingProgress}%</span>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-2.5 rounded-full bg-white overflow-hidden border border-[#EFE7DE] shadow-2xs">
              <div
                className="h-full bg-gradient-to-r from-[#FF6B8B] via-[#FA7070] to-[#10B981] rounded-full transition-all duration-300"
                style={{ width: `${shippingProgress}%` }}
              />
            </div>
          </div>

          {/* Items Container */}
          <div className="bg-white rounded-3xl border border-[#EFE7DE] shadow-cute divide-y divide-[#EFE7DE] overflow-hidden">
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
                      className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-[#FAF7F2] border border-[#EFE7DE] shrink-0 block"
                    >
                      <Image
                        src={coverImage}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </Link>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF6B8B] block">
                        {product.brand}
                      </span>
                      <Link
                        href={`/products/${product.id}`}
                        className="text-sm sm:text-base font-bold text-[#2D3748] hover:text-[#FF6B8B] transition-colors line-clamp-1 block"
                      >
                        {product.name}
                      </Link>

                      {/* Variant Options pills */}
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {selectedColor && (
                          <span className="text-[10px] font-bold bg-[#FAF7F2] text-[#718096] border border-[#EFE7DE] px-2.5 py-0.5 rounded-full">
                            Color: {selectedColor}
                          </span>
                        )}
                        {selectedSize && (
                          <span className="text-[10px] font-bold bg-[#FAF7F2] text-[#718096] border border-[#EFE7DE] px-2.5 py-0.5 rounded-full">
                            Size: {selectedSize}
                          </span>
                        )}
                      </div>

                      {/* Unit Price */}
                      <div className="flex items-baseline gap-2 pt-1">
                        <span className="text-sm font-extrabold text-[#2D3748]">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        {product.mrp > product.price && (
                          <span className="text-xs text-[#A0AEC0] line-through font-medium">
                            ₹{product.mrp.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quantity & Item Subtotal & Delete Action */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-[#EFE7DE]">
                    {/* Quantity Controls */}
                    <div className="flex items-center border border-[#EFE7DE] rounded-full overflow-hidden bg-[#FAF7F2] shadow-2xs">
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="px-3 py-1.5 text-xs font-bold text-[#2D3748] hover:bg-[#FFEAEF] transition-colors"
                      >
                        -
                      </button>
                      <span className="px-3 py-1.5 text-xs font-extrabold text-[#2D3748] min-w-[2rem] text-center bg-white">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        disabled={quantity >= (product.stock || 99)}
                        className="px-3 py-1.5 text-xs font-bold text-[#2D3748] hover:bg-[#FFEAEF] disabled:opacity-40 transition-colors"
                      >
                        +
                      </button>
                    </div>

                    {/* Total Price */}
                    <span className="text-base font-extrabold text-[#2D3748] min-w-[5rem] text-right">
                      ₹{itemTotal.toLocaleString('en-IN')}
                    </span>

                    {/* Remove */}
                    <button
                      type="button"
                      onClick={() => removeItem(product.id)}
                      className="p-2 text-[#A0AEC0] hover:text-[#FA5578] hover:bg-[#FFEAEF] rounded-full transition-colors"
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
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF6B8B] hover:underline"
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
          <div className="bg-white p-6 rounded-3xl border border-[#EFE7DE] shadow-cute space-y-5 sticky top-24">
            <h2 className="text-base font-extrabold text-[#2D3748]">Order Summary</h2>

            <div className="space-y-3 text-xs text-[#718096] divide-y divide-[#EFE7DE]">
              <div className="flex justify-between items-center pt-1 font-medium">
                <span>Items Subtotal</span>
                <span className="font-extrabold text-[#2D3748]">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between items-center pt-3 font-medium">
                <span>Shipping Fee</span>
                <span className="font-bold">
                  {shippingFee === 0 ? (
                    <span className="text-[#059669]">FREE</span>
                  ) : (
                    `₹${shippingFee}`
                  )}
                </span>
              </div>

              {savings > 0 && (
                <div className="flex justify-between items-center pt-3 text-[#059669] font-bold">
                  <span>Total Savings</span>
                  <span>-₹{savings.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between items-baseline pt-4 text-base">
                <span className="font-extrabold text-[#2D3748]">Grand Total</span>
                <span className="font-extrabold text-xl text-[#2D3748]">
                  ₹{total.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <Link
              href="/checkout"
              className="w-full py-4 px-6 rounded-full bg-[#FF6B8B] hover:bg-[#FA5578] text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-cute-pink active:scale-98"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {/* Trust Badges */}
            <div className="pt-2 border-t border-[#EFE7DE] flex items-center justify-center gap-4 text-[11px] text-[#718096] font-medium">
              <div className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                <span>100% Safe Payments</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#FF6B8B]" />
                <span>Easy Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
