import Link from 'next/link';
import { ShoppingBag, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full bg-[#EAF6FF]/40 border-t border-gray-100 mt-auto">
      {/* Value props banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-b border-gray-200/60">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white text-[#4DA3FF] shadow-xs flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#1F2937]">Fast Delivery</h4>
              <p className="text-xs text-gray-500">Quick shipping to your doorstep</p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white text-[#4DA3FF] shadow-xs flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#1F2937]">Secure Payments</h4>
              <p className="text-xs text-gray-500">100% secure checkout via Razorpay</p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white text-[#4DA3FF] shadow-xs flex items-center justify-center shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#1F2937]">Easy Support</h4>
              <p className="text-xs text-gray-500">Dedicated assistance for your orders</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-3 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg text-[#1F2937]">
              <div className="w-8 h-8 rounded-xl bg-white shadow-xs text-[#4DA3FF] flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <span>The Shop</span>
            </Link>
            <p className="text-xs text-gray-500 leading-relaxed">
              Your clean, minimal online shopping destination. Quality products delivered with simplicity.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-xs font-semibold text-[#1F2937] uppercase tracking-wider mb-3">
              Shop
            </h5>
            <ul className="space-y-2 text-xs text-gray-600">
              <li>
                <Link href="/products" className="hover:text-[#4DA3FF] transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/products?sort=featured" className="hover:text-[#4DA3FF] transition-colors">
                  Featured Items
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-[#4DA3FF] transition-colors">
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h5 className="text-xs font-semibold text-[#1F2937] uppercase tracking-wider mb-3">
              Account
            </h5>
            <ul className="space-y-2 text-xs text-gray-600">
              <li>
                <Link href="/login" className="hover:text-[#4DA3FF] transition-colors">
                  Sign In / Register
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-[#4DA3FF] transition-colors">
                  My Profile
                </Link>
              </li>
              <li>
                <Link href="/account/orders" className="hover:text-[#4DA3FF] transition-colors">
                  Order History
                </Link>
              </li>
            </ul>
          </div>

          {/* Help & Policies */}
          <div>
            <h5 className="text-xs font-semibold text-[#1F2937] uppercase tracking-wider mb-3">
              Support
            </h5>
            <ul className="space-y-2 text-xs text-gray-600">
              <li>
                <span className="text-gray-500">Email: support@theshop.com</span>
              </li>
              <li>
                <span className="text-gray-500">Payments: INR (₹) Razorpay</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 mt-8 border-t border-gray-200/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} The Shop. All rights reserved.</p>
          <p className="text-[11px] text-gray-400">
            Powered by Next.js & Supabase
          </p>
        </div>
      </div>
    </footer>
  );
}
