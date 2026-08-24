'use client';

import Link from 'next/link';
import { ShoppingCart, ArrowLeft, Package, Clock } from 'lucide-react';

export default function AdminOrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] tracking-tight">
          Store Orders
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Monitor customer orders, shipping labels, and payment statuses
        </p>
      </div>

      <div className="bg-white p-12 rounded-3xl border border-gray-200/80 shadow-xs text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-2xs">
          <ShoppingCart className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <h2 className="text-base font-bold text-[#1F2937]">Order Management Ready</h2>
          <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
            As soon as customers complete purchases via the checkout flow, orders will be captured and listed here with full order line items and status tracking.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4DA3FF] text-white text-xs font-bold hover:bg-[#2B8BE6] transition-all shadow-xs"
          >
            <Package className="w-4 h-4" />
            <span>Manage Products</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
