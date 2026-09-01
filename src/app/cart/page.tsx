'use client';

import { useSyncExternalStore } from 'react';
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
} from 'lucide-react';
import { useCartStore } from '@/frontend/store/useCartStore';

const emptySubscribe = () => () => {};

export default function CartPage() {
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const getSubtotal = useCartStore((state) => state.getSubtotal);
  const getShippingFee = useCartStore((state) => state.getShippingFee);
  const getTotalSavings = useCartStore((state) => state.getTotalSavings);
  const getTotal = useCartStore((state) => state.getTotal);
  const freeShippingThreshold = useCartStore((state) => state.freeShippingThreshold);

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
        <div className="w-20 h-20 rounded-3xl bg-[#FDE8EB] text-[#F27A8A] flex items-center justify-center mx-auto shadow-cute-pink">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#193653] tracking-tight">
            Your Cart is Empty
          </h1>
          <p className="text-xs sm:text-sm text-[#5D7285] max-w-sm mx-auto font-medium">
            Looks like you haven&apos;t added any items to your bag yet. Explore our curated collections for your little ones.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#F27A8A] hover:bg-[#e06878] text-white text-xs sm:text-sm font-extrabold shadow-cute-pink transition-all active:scale-98"
          >
            <span>Start Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      {/* Title Bar */}
      <div className="flex items-center justify-between border-b border-[#EFE6DA] pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#193653] tracking-tight">
            Shopping Cart
          </h1>
          <p className="text-xs text-[#5D7285] font-medium mt-0.5">
            {items.length} {items.length === 1 ? 'item' : 'items'} in your bag
          </p>
        </div>
        <button
          type="button"
          onClick={clearCart}
          className="text-xs font-bold text-gray-400 hover:text-red-600 transition-colors"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {/* Free Shipping Progress Alert */}
          <div className="p-4 rounded-2xl bg-[#EBF8FC] border border-[#8FD3E8]/40 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#193653]">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#3599b8]" />
                <span>
                  {amountNeededForFreeShipping === 0 ? (
                    <strong className="text-[#3599b8]">Congratulations! You unlocked FREE Delivery! 🎉</strong>
                  ) : (
                    <>
                      Add <strong className="text-[#3599b8]">₹{amountNeededForFreeShipping}</strong> more for{' '}
                      <strong>FREE Delivery</strong>
                    </>
                  )}
                </span>
              </div>
              <span className="text-[#3599b8] font-extrabold">{shippingProgress}%</span>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-2 bg-white rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#8FD3E8] to-[#F27A8A] transition-all duration-300 rounded-full"
                style={{ width: `${shippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items Cards */}
          <div className="space-y-3">
            {items.map((item) => {
              const imageSrc =
                item.product.images && item.product.images.length > 0
                  ? item.product.images[0]
                  : 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800&auto=format&fit=crop&q=80';

              return (
                <div
                  key={item.product.id}
                  className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EFE6DA] shadow-cute flex flex-col sm:flex-row items-center gap-4 justify-between"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    {/* Image */}
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-[#FFF9F2] shrink-0 border border-[#EFE6DA]">
                      <Image
                        src={imageSrc}
                        alt={item.product.name}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </div>

                    {/* Meta */}
                    <div className="space-y-1 min-w-0">
                      <span className="text-[10px] font-bold text-[#5D7285] uppercase tracking-wider">
                        {item.product.brand || item.product.category}
                      </span>
                      <Link
                        href={`/products/${item.product.id}`}
                        className="text-xs sm:text-sm font-extrabold text-[#193653] hover:text-[#F27A8A] transition-colors line-clamp-1 block"
                      >
                        {item.product.name}
                      </Link>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xs sm:text-sm font-extrabold text-[#193653]">
                          ₹{item.product.price.toLocaleString('en-IN')}
                        </span>
                        {item.product.mrp > item.product.price && (
                          <span className="text-[10px] sm:text-xs text-[#5D7285] line-through">
                            ₹{item.product.mrp.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quantity Stepper & Subtotal */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-[#EFE6DA]">
                    {/* Stepper */}
                    <div className="flex items-center bg-[#FFF9F2] border border-[#EFE6DA] rounded-full p-0.5 shadow-2xs">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-full text-xs font-extrabold text-[#193653] hover:bg-white flex items-center justify-center transition-colors"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-xs font-extrabold text-[#193653]">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-full text-xs font-extrabold text-[#193653] hover:bg-white flex items-center justify-center transition-colors"
                      >
                        +
                      </button>
                    </div>

                    {/* Total Price for item */}
                    <span className="text-xs sm:text-sm font-extrabold text-[#193653] min-w-[70px] text-right">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </span>

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => removeItem(item.product.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#F27A8A] hover:underline"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>

        {/* RIGHT COLUMN: Order Summary Card */}
        <div className="lg:col-span-4 space-y-4 sticky top-24">
          <div className="bg-white rounded-3xl p-6 border border-[#EFE6DA] shadow-cute space-y-5">
            <h2 className="text-base font-extrabold text-[#193653] border-b border-[#EFE6DA] pb-3">
              Order Summary
            </h2>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-[#5D7285] font-medium">
                <span>Subtotal ({items.length} items)</span>
                <span className="font-bold text-[#193653]">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              {savings > 0 && (
                <div className="flex justify-between text-[#729c50] font-medium">
                  <span>Product Savings</span>
                  <span className="font-bold">-₹{savings.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between text-[#5D7285] font-medium">
                <span>Estimated Delivery</span>
                <span>
                  {shippingFee === 0 ? (
                    <strong className="text-[#729c50]">FREE</strong>
                  ) : (
                    <strong className="text-[#193653]">₹{shippingFee}</strong>
                  )}
                </span>
              </div>

              <div className="border-t border-[#EFE6DA] pt-3 flex justify-between items-baseline">
                <span className="text-sm font-extrabold text-[#193653]">Total Amount</span>
                <span className="text-xl font-extrabold text-[#F27A8A]">
                  ₹{total.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Checkout CTA */}
            <Link
              href="/checkout"
              className="w-full py-3.5 rounded-full bg-[#F27A8A] hover:bg-[#e06878] text-white text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all shadow-cute-pink active:scale-98"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {/* Trust Assurance */}
            <div className="p-3 bg-[#EFF7E9] rounded-2xl flex items-center gap-2.5 text-[11px] font-bold text-[#729c50]">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Safe &amp; Encrypted Checkout Guaranteed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
