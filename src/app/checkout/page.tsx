'use client';

import { useState, useEffect, useSyncExternalStore } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Navigation,
  ShieldCheck,
  ArrowRight,
  ChevronLeft,
  AlertCircle,
  Loader2,
  Lock,
  Truck,
  Banknote,
  CreditCard,
  CheckCircle2
} from 'lucide-react';
import { useCartStore } from '@/frontend/store/useCartStore';
import { useAuthStore } from '@/frontend/store/useAuthStore';
import { createOrder } from '@/frontend/lib/api/orders';

const emptySubscribe = () => () => {};

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi NCR', 'Chandigarh'
];

export default function CheckoutPage() {
  const router = useRouter();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  const items = useCartStore((state) => state.items);
  const getSubtotal = useCartStore((state) => state.getSubtotal);
  const getShippingFee = useCartStore((state) => state.getShippingFee);
  const getTotalSavings = useCartStore((state) => state.getTotalSavings);
  const getTotal = useCartStore((state) => state.getTotal);
  const clearCart = useCartStore((state) => state.clearCart);

  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [landmark, setLandmark] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('cod');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdOrderNumber, setCreatedOrderNumber] = useState('');

  // Prefill authenticated profile info
  useEffect(() => {
    if (profile) {
      if (profile.name) setName(profile.name);
      if (profile.phone) setPhone(profile.phone);
      if (profile.email) setEmail(profile.email);
    } else if (user?.email) {
      setEmail(user.email);
    }
  }, [profile, user]);

  const isAuthLoading = useAuthStore((state) => state.isLoading);

  // Require Login for Checkout
  useEffect(() => {
    if (mounted && !isAuthLoading && !user && !isSuccess) {
      router.push('/login?redirect=/checkout');
    }
  }, [mounted, isAuthLoading, user, isSuccess, router]);

  if (!mounted || isAuthLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#F27A8A] mx-auto" />
        <p className="text-xs text-[#5D7285] font-medium">Verifying your secure session...</p>
      </div>
    );
  }

  // If not logged in and not finished with an order, prompt login
  if (!user && !isSuccess) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-5">
        <div className="w-16 h-16 rounded-3xl bg-[#FDE8EB] text-[#F27A8A] flex items-center justify-center mx-auto shadow-cute-pink">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-2xl font-extrabold text-[#193653]">Sign In to Checkout</h2>
          <p className="text-xs sm:text-sm text-[#5D7285] font-medium">
            Please log in or create an account to proceed with your order. Your cart items will be saved!
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href="/login?redirect=/checkout"
            className="flex-1 py-3 px-6 rounded-full bg-[#F27A8A] hover:bg-[#e06878] text-white text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 shadow-cute-pink transition-all active:scale-98"
          >
            <span>Log In</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/register?redirect=/checkout"
            className="flex-1 py-3 px-6 rounded-full bg-white hover:bg-gray-50 text-[#193653] border border-[#EFE6DA] text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-2xs transition-all active:scale-98"
          >
            <span>Create Account</span>
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = getSubtotal();
  const shippingFee = getShippingFee();
  const savings = getTotalSavings();
  const total = getTotal();

  // Redirect if cart is empty and not on success view
  if (items.length === 0 && !isSuccess) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-[#FDE8EB] text-[#F27A8A] flex items-center justify-center mx-auto shadow-cute-pink">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-[#193653]">Your Cart is Empty</h2>
        <p className="text-xs text-[#5D7285] max-w-sm mx-auto">
          Please add items to your cart before proceeding to checkout.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#F27A8A] text-white text-xs font-bold shadow-cute-pink"
        >
          <span>Browse Products</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  // Handle Order Placement
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Basic Validation
    if (!name.trim() || !email.trim() || !phone.trim() || !addressLine1.trim() || !city.trim() || !state.trim() || !pincode.trim()) {
      setErrorMessage('Please fill in all required shipping address fields.');
      return;
    }

    if (pincode.length !== 6 || !/^\d+$/.test(pincode)) {
      setErrorMessage('Please enter a valid 6-digit Indian Pincode.');
      return;
    }

    setLoading(true);

    try {
      // 1. Create Pending Order in Express Backend
      const order = await createOrder({
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          selectedSize: item.selectedSize,
          selectedColor: item.selectedColor,
        })),
        shippingAddress: {
          fullName: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          addressLine1: addressLine1.trim(),
          addressLine2: addressLine2.trim() || undefined,
          city: city.trim(),
          state: state.trim(),
          pincode: pincode.trim(),
          landmark: landmark.trim() || undefined,
        },
        paymentMethod,
      });

      // Order created successfully
      setCreatedOrderNumber(order.order_number || order.id || '');
      setIsSuccess(true);
      clearCart();
    } catch (err: any) {
      console.error('Order creation error:', err);
      setErrorMessage(err.message || 'An unexpected error occurred during checkout.');
    } finally {
      setLoading(false);
    }
  };

  // SUCCESS VIEW
  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-[#EFF7E9] text-[#729c50] flex items-center justify-center mx-auto shadow-2xs">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#193653] tracking-tight">
            Order Confirmed! 🎉
          </h1>
          <p className="text-xs sm:text-sm text-[#5D7285] max-w-md mx-auto font-medium">
            Thank you for shopping with Baby Ladoo! We have received your order{' '}
            <strong className="text-[#193653]">#{createdOrderNumber}</strong> and will start packing it with love right away.
          </p>
        </div>

        <div className="p-5 bg-white rounded-3xl border border-[#EFE6DA] shadow-cute text-left space-y-3 max-w-md mx-auto text-xs">
          <div className="flex justify-between border-b border-[#EFE6DA] pb-2">
            <span className="text-[#5D7285]">Order Number</span>
            <span className="font-bold text-[#193653]">#{createdOrderNumber}</span>
          </div>
          <div className="flex justify-between border-b border-[#EFE6DA] pb-2">
            <span className="text-[#5D7285]">Payment Method</span>
            <span className="font-bold uppercase text-[#193653]">{paymentMethod}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#5D7285]">Delivery To</span>
            <span className="font-bold text-[#193653]">{city}, {state} ({pincode})</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/products"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#F27A8A] hover:bg-[#e06878] text-white text-xs font-extrabold shadow-cute-pink transition-all"
          >
            Continue Shopping
          </Link>
          <Link
            href="/account"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white hover:bg-[#FFF9F2] text-[#193653] text-xs font-bold border border-[#EFE6DA] transition-all"
          >
            View My Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      {/* Back Link */}
      <Link
        href="/cart"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5D7285] hover:text-[#F27A8A] transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Back to Cart</span>
      </Link>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-[#193653] tracking-tight">
        Secure Checkout
      </h1>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Shipping & Payment (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. Contact & Shipping Details */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EFE6DA] shadow-cute space-y-4">
            <h2 className="text-base font-extrabold text-[#193653] flex items-center gap-2 border-b border-[#EFE6DA] pb-3">
              <MapPin className="w-4 h-4 text-[#F27A8A]" />
              <span>Shipping Address</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#193653]">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full text-xs text-[#193653] bg-[#FFF9F2] rounded-2xl px-3.5 py-2.5 border border-[#EFE6DA] focus:bg-white focus:border-[#F27A8A] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#193653]">Phone Number (10 digits) *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full text-xs text-[#193653] bg-[#FFF9F2] rounded-2xl px-3.5 py-2.5 border border-[#EFE6DA] focus:bg-white focus:border-[#F27A8A] focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#193653]">Email Address (For order tracking) *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full text-xs text-[#193653] bg-[#FFF9F2] rounded-2xl px-3.5 py-2.5 border border-[#EFE6DA] focus:bg-white focus:border-[#F27A8A] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#193653]">House / Flat / Building *</label>
              <input
                type="text"
                required
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                placeholder="Flat 402, Sunshine Heights"
                className="w-full text-xs text-[#193653] bg-[#FFF9F2] rounded-2xl px-3.5 py-2.5 border border-[#EFE6DA] focus:bg-white focus:border-[#F27A8A] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#193653]">Street / Area / Colony</label>
              <input
                type="text"
                value={addressLine2}
                onChange={(e) => setAddressLine2(e.target.value)}
                placeholder="Near Central Park, 2nd Main"
                className="w-full text-xs text-[#193653] bg-[#FFF9F2] rounded-2xl px-3.5 py-2.5 border border-[#EFE6DA] focus:bg-white focus:border-[#F27A8A] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#193653]">City *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Mumbai"
                  className="w-full text-xs text-[#193653] bg-[#FFF9F2] rounded-2xl px-3.5 py-2.5 border border-[#EFE6DA] focus:bg-white focus:border-[#F27A8A] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#193653]">State *</label>
                <select
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full text-xs text-[#193653] bg-[#FFF9F2] rounded-2xl px-3 py-2.5 border border-[#EFE6DA] focus:bg-white focus:border-[#F27A8A] focus:outline-none"
                >
                  <option value="">Select State</option>
                  {INDIAN_STATES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#193653]">Pincode (6 digits) *</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="e.g. 400001"
                  className="w-full text-xs text-[#193653] bg-[#FFF9F2] rounded-2xl px-3.5 py-2.5 border border-[#EFE6DA] focus:bg-white focus:border-[#F27A8A] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* 2. Payment Method Selector */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EFE6DA] shadow-cute space-y-4">
            <h2 className="text-base font-extrabold text-[#193653] flex items-center gap-2 border-b border-[#EFE6DA] pb-3">
              <CreditCard className="w-4 h-4 text-[#F27A8A]" />
              <span>Select Payment Method</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Cash on Delivery */}
              <label
                className={`p-4 rounded-2xl border-2 flex items-center gap-3 cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-[#F27A8A] bg-[#FDE8EB]/40'
                    : 'border-[#EFE6DA] hover:border-gray-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="accent-[#F27A8A] w-4 h-4 cursor-pointer"
                />
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-[#193653]">
                    <Banknote className="w-4 h-4 text-[#F27A8A]" />
                    <span>Cash on Delivery (COD)</span>
                  </div>
                  <p className="text-[10px] text-[#5D7285]">Pay comfortably with cash/UPI upon delivery</p>
                </div>
              </label>

              {/* Online Payment / Razorpay (Coming Soon / Disabled) */}
              <div
                className="p-4 rounded-2xl border-2 border-dashed border-[#EFE6DA] bg-[#FFF9F2]/60 opacity-70 cursor-not-allowed flex items-center justify-between gap-3 select-none relative"
                title="Online payments via UPI, Debit/Credit Cards & NetBanking will be available soon. Please select Cash on Delivery for now."
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="razorpay"
                    disabled
                    checked={false}
                    className="accent-gray-400 w-4 h-4 cursor-not-allowed"
                  />
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-gray-500">
                      <CreditCard className="w-4 h-4 text-gray-400" />
                      <span>UPI, Cards, NetBanking</span>
                    </div>
                    <p className="text-[10px] text-gray-400">Online payment gateway integration in progress</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
                  Coming Soon
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Order Summary & Place Order (4 cols) */}
        <div className="lg:col-span-4 space-y-4 sticky top-24">
          <div className="bg-white rounded-3xl p-6 border border-[#EFE6DA] shadow-cute space-y-5">
            <h2 className="text-base font-extrabold text-[#193653] border-b border-[#EFE6DA] pb-3">
              Order Review ({items.length} {items.length === 1 ? 'item' : 'items'})
            </h2>

            {/* Mini Items Scroll List */}
            <div className="max-h-48 overflow-y-auto space-y-2.5 pr-1">
              {items.map((item) => (
                <div key={item.product.id} className="flex items-center gap-2.5 text-xs">
                  <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-[#FFF9F2] shrink-0 border border-[#EFE6DA]">
                    <Image
                      src={
                        item.product.images && item.product.images.length > 0
                          ? item.product.images[0]
                          : 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800&auto=format&fit=crop&q=80'
                      }
                      alt={item.product.name}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-[#193653] truncate">{item.product.name}</p>
                    <p className="text-[10px] text-[#5D7285]">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-extrabold text-[#193653] shrink-0">
                    ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 text-xs border-t border-[#EFE6DA] pt-3">
              <div className="flex justify-between text-[#5D7285]">
                <span>Items Subtotal</span>
                <span className="font-bold text-[#193653]">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              {savings > 0 && (
                <div className="flex justify-between text-[#729c50]">
                  <span>Savings</span>
                  <span className="font-bold">-₹{savings.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between text-[#5D7285]">
                <span>Delivery Charges</span>
                <span>
                  {shippingFee === 0 ? (
                    <strong className="text-[#729c50]">FREE</strong>
                  ) : (
                    <strong className="text-[#193653]">₹{shippingFee}</strong>
                  )}
                </span>
              </div>

              <div className="border-t border-[#EFE6DA] pt-3 flex justify-between items-baseline">
                <span className="text-sm font-extrabold text-[#193653]">Grand Total</span>
                <span className="text-xl font-extrabold text-[#F27A8A]">
                  ₹{total.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-[#F27A8A] hover:bg-[#e06878] text-white text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all shadow-cute-pink active:scale-98 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Confirming Order...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Place Order (₹{total.toLocaleString('en-IN')})</span>
                </>
              )}
            </button>

            {/* Security Guarantee */}
            <div className="p-2.5 bg-[#EFF7E9] rounded-2xl flex items-center justify-center gap-2 text-[10px] font-bold text-[#729c50]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Safe &amp; Non-Toxic Certified Store</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
