'use client';

import { useState, useEffect } from 'react';
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
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { validateStockAndCreatePendingOrder } from '@/lib/supabase/orders';

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
  const [mounted, setMounted] = useState(false);

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
  const [state, setState] = useState('Gujarat');
  const [pincode, setPincode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'razorpay'>('cod');

  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Pre-fill user details if logged in
  useEffect(() => {
    if (profile) {
      if (profile.name) setName(profile.name);
      if (profile.email) setEmail(profile.email);
      if (profile.phone) setPhone(profile.phone);
    } else if (user) {
      if (user.email) setEmail(user.email);
    }
  }, [profile, user]);

  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-sm text-gray-500">
        Loading checkout...
      </div>
    );
  }

  // If cart is empty, prompt user to go to cart
  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-gray-200 text-center space-y-4 shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-[#EAF6FF] text-[#4DA3FF] flex items-center justify-center mx-auto">
          <ShoppingBag className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-[#1F2937]">Your cart is empty</h2>
        <p className="text-xs text-gray-500">
          Please add items to your cart before proceeding to checkout.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4DA3FF] text-white text-xs font-bold hover:bg-[#2B8BE6] transition-all"
        >
          <span>Shop Products</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const subtotal = getSubtotal();
  const shipping = getShippingFee();
  const savings = getTotalSavings();
  const total = getTotal();

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 1. Validation
    if (!name.trim() || !email.trim() || !phone.trim() || !addressLine1.trim() || !city.trim() || !pincode.trim()) {
      setError('Please fill in all required shipping and contact details.');
      return;
    }

    const cleanPincode = pincode.trim().replace(/\s+/g, '');
    if (!/^\d{6}$/.test(cleanPincode)) {
      setError('Please enter a valid 6-digit Indian PIN code.');
      return;
    }

    const cleanPhone = phone.trim().replace(/[^0-9+]/g, '');
    if (cleanPhone.replace(/\D/g, '').length < 10) {
      setError('Please enter a valid 10-digit mobile phone number.');
      return;
    }

    setIsProcessing(true);

    try {
      // 2. Validate Stock & Create Pending COD Order in Supabase
      const result = await validateStockAndCreatePendingOrder({
        userId: user?.id || null,
        customerName: name.trim(),
        customerEmail: email.trim(),
        customerPhone: cleanPhone,
        shippingAddress: {
          fullName: name.trim(),
          phone: cleanPhone,
          email: email.trim(),
          addressLine1: addressLine1.trim(),
          addressLine2: addressLine2.trim() || undefined,
          city: city.trim(),
          state: state.trim(),
          pincode: cleanPincode,
        },
        subtotal,
        shipping,
        total,
        cartItems: items,
      });

      if (!result.success || !result.order) {
        setError(result.error || 'Failed to place order. Please check item stock.');
        setIsProcessing(false);
        return;
      }

      // 3. Order successfully created in database!
      const createdOrder = result.order;
      clearCart();

      // 4. Redirect to order success page
      router.push(`/checkout/success?order_number=${encodeURIComponent(createdOrder.order_number)}&order_id=${createdOrder.id}&payment_method=cod`);
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] tracking-tight">
            Checkout
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Enter your delivery details and choose your payment method
          </p>
        </div>

        <Link
          href="/cart"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-[#4DA3FF] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Cart</span>
        </Link>
      </div>

      {/* Main Grid: Form (Left) & Order Summary (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ============================================================ */}
        {/* LEFT: SHIPPING, CONTACT & PAYMENT FORM */}
        {/* ============================================================ */}
        <div className="lg:col-span-8">
          <form onSubmit={handleCheckoutSubmit} className="space-y-6">
            {error && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold flex items-start gap-3 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* 1. Contact Info Card */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h2 className="text-sm font-bold text-[#1F2937] uppercase tracking-wider flex items-center gap-2">
                  <User className="w-4 h-4 text-[#4DA3FF]" />
                  <span>1. Contact Information</span>
                </h2>
                {!user && (
                  <Link
                    href="/login?redirect=/checkout"
                    className="text-xs font-semibold text-[#4DA3FF] hover:underline"
                  >
                    Already have an account? Sign In
                  </Link>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-gray-700">Full Name *</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Meet Patel"
                      className="w-full text-xs text-[#1F2937] bg-gray-50/50 rounded-xl pl-9 pr-3.5 py-2.5 border border-gray-200 focus:bg-white focus:border-[#4DA3FF] focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/20"
                    />
                    <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700">Email Address *</label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full text-xs text-[#1F2937] bg-gray-50/50 rounded-xl pl-9 pr-3.5 py-2.5 border border-gray-200 focus:bg-white focus:border-[#4DA3FF] focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/20"
                    />
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700">Phone Number *</label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full text-xs text-[#1F2937] bg-gray-50/50 rounded-xl pl-9 pr-3.5 py-2.5 border border-gray-200 focus:bg-white focus:border-[#4DA3FF] focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/20"
                    />
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Shipping Address Card */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs space-y-4">
              <h2 className="text-sm font-bold text-[#1F2937] uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-3">
                <MapPin className="w-4 h-4 text-[#4DA3FF]" />
                <span>2. Shipping Address</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-gray-700">Flat / House No. / Street Address *</label>
                  <input
                    type="text"
                    required
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    placeholder="e.g. Flat 402, Sunshine Residency, Ring Road"
                    className="w-full text-xs text-[#1F2937] bg-gray-50/50 rounded-xl px-3.5 py-2.5 border border-gray-200 focus:bg-white focus:border-[#4DA3FF] focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/20"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-gray-700">Landmark / Area (Optional)</label>
                  <input
                    type="text"
                    value={addressLine2}
                    onChange={(e) => setAddressLine2(e.target.value)}
                    placeholder="e.g. Near City Mall"
                    className="w-full text-xs text-[#1F2937] bg-gray-50/50 rounded-xl px-3.5 py-2.5 border border-gray-200 focus:bg-white focus:border-[#4DA3FF] focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/20"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700">City *</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Ahmedabad"
                      className="w-full text-xs text-[#1F2937] bg-gray-50/50 rounded-xl pl-9 pr-3.5 py-2.5 border border-gray-200 focus:bg-white focus:border-[#4DA3FF] focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/20"
                    />
                    <Building className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700">State *</label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full text-xs text-[#1F2937] font-medium bg-gray-50/50 rounded-xl px-3.5 py-2.5 border border-gray-200 focus:bg-white focus:border-[#4DA3FF] focus:outline-none cursor-pointer"
                  >
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700">PIN Code *</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="e.g. 380015"
                      className="w-full text-xs text-[#1F2937] bg-gray-50/50 rounded-xl pl-9 pr-3.5 py-2.5 border border-gray-200 focus:bg-white focus:border-[#4DA3FF] focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/20"
                    />
                    <Navigation className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Payment Method Card (COD fully working + Razorpay Coming Soon) */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs space-y-4">
              <h2 className="text-sm font-bold text-[#1F2937] uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-3">
                <Banknote className="w-4 h-4 text-[#4DA3FF]" />
                <span>3. Payment Method</span>
              </h2>

              <div className="space-y-3">
                {/* Cash on Delivery (Active / Default) */}
                <label
                  onClick={() => setPaymentMethod('cod')}
                  className={`flex items-start justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                    paymentMethod === 'cod'
                      ? 'border-[#4DA3FF] bg-[#EAF6FF]/30 shadow-xs'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div className="mt-0.5">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="w-4 h-4 text-[#4DA3FF] focus:ring-[#4DA3FF]"
                      />
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Banknote className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs sm:text-sm font-bold text-[#1F2937]">
                          Cash on Delivery (COD)
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 uppercase tracking-wide">
                          Available
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Pay with cash or UPI at your doorstep upon order delivery.
                      </p>
                    </div>
                  </div>
                  <CheckCircle2
                    className={`w-5 h-5 ${
                      paymentMethod === 'cod' ? 'text-[#4DA3FF]' : 'text-gray-300'
                    }`}
                  />
                </label>

                {/* Online Payment / Razorpay (Disabled - Coming Soon) */}
                <div className="flex items-start justify-between p-4 rounded-2xl border border-gray-200 bg-gray-50/70 opacity-75 cursor-not-allowed">
                  <div className="flex items-start gap-3.5">
                    <div className="mt-0.5">
                      <input
                        type="radio"
                        disabled
                        name="paymentMethod"
                        checked={false}
                        className="w-4 h-4 text-gray-300 cursor-not-allowed"
                      />
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-gray-400" />
                        <span className="text-xs sm:text-sm font-bold text-gray-600">
                          Online Payment (Razorpay: UPI / Cards / NetBanking)
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-700 uppercase tracking-wide">
                          Coming Soon
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">
                        Online payment gateway integration will be available shortly in Phase 10.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Place Order CTA button (Mobile/Desktop) */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 px-6 rounded-2xl bg-[#4DA3FF] hover:bg-[#2B8BE6] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Validating Stock & Placing COD Order...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Place COD Order (₹{total.toLocaleString('en-IN')})</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* ============================================================ */}
        {/* RIGHT: ORDER SUMMARY & ITEMS REVIEW */}
        {/* ============================================================ */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs space-y-5 sticky top-24">
            <h2 className="text-base font-bold text-[#1F2937]">Order Summary</h2>

            {/* Line items preview */}
            <div className="divide-y divide-gray-100 max-h-60 overflow-y-auto no-scrollbar pr-1">
              {items.map((item, idx) => {
                const cover =
                  item.product.images && item.product.images.length > 0
                    ? item.product.images[0]
                    : 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800&auto=format&fit=crop&q=80';

                return (
                  <div key={idx} className="py-3 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                        <Image src={cover} alt={item.product.name} fill className="object-cover" />
                      </div>
                      <div>
                        <span className="font-bold text-[#1F2937] line-clamp-1 block">
                          {item.product.name}
                        </span>
                        <span className="text-[10px] text-gray-400">Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <span className="font-extrabold text-[#1F2937] shrink-0">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Cost breakdown */}
            <div className="space-y-2.5 text-xs text-gray-600 border-t border-gray-100 pt-3">
              <div className="flex justify-between items-center">
                <span>Items Subtotal</span>
                <span className="font-semibold text-[#1F2937]">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between items-center">
                <span>Shipping</span>
                <span className="font-semibold">
                  {shipping === 0 ? (
                    <span className="text-emerald-600 font-bold">FREE</span>
                  ) : (
                    `₹${shipping}`
                  )}
                </span>
              </div>

              {savings > 0 && (
                <div className="flex justify-between items-center text-emerald-600 font-medium">
                  <span>Savings</span>
                  <span>-₹{savings.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between items-baseline border-t border-gray-100 pt-3 text-base">
                <span className="font-extrabold text-[#1F2937]">Total Amount</span>
                <span className="font-extrabold text-xl text-[#1F2937]">
                  ₹{total.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100 text-[11px] text-gray-500 space-y-1.5">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Cash on Delivery Verified</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-[#4DA3FF] shrink-0" />
                <span>Delivery within 3-5 business days</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
