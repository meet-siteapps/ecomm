'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Package,
  ShoppingCart,
  Users,
  Clock,
  Plus,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  ExternalLink
} from 'lucide-react';
import { getAdminDashboardStats } from '@/lib/supabase/products';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    lowStockProducts: 0,
    totalCustomers: 0,
    totalOrders: 0,
    pendingOrders: 0,
    recentOrders: [] as any[],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadStats() {
      setIsLoading(true);
      try {
        const data = await getAdminDashboardStats();
        if (isMounted) {
          setStats(data);
        }
      } catch (err) {
        console.error('Error loading dashboard stats:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    loadStats();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] tracking-tight">
            Store Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Overview of your products, orders, and customer activity
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#4DA3FF] hover:bg-[#2B8BE6] text-white text-xs font-bold transition-all shadow-xs active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Manage Products</span>
          </Link>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Total Products */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Products
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#EAF6FF] text-[#4DA3FF] flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-extrabold text-[#1F2937]">
              {isLoading ? '...' : stats.totalProducts}
            </span>
            <span className="text-xs text-gray-500 block mt-0.5">
              {stats.activeProducts} active in store
            </span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Orders
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-extrabold text-[#1F2937]">
              {isLoading ? '...' : stats.totalOrders}
            </span>
            <span className="text-xs text-gray-500 block mt-0.5">Lifetime orders</span>
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Pending Orders
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-extrabold text-[#1F2937]">
              {isLoading ? '...' : stats.pendingOrders}
            </span>
            <span className="text-xs text-gray-500 block mt-0.5">Awaiting fulfillment</span>
          </div>
        </div>

        {/* Customers */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Customers
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-extrabold text-[#1F2937]">
              {isLoading ? '...' : stats.totalCustomers}
            </span>
            <span className="text-xs text-gray-500 block mt-0.5">Registered accounts</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Orders & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders (Left 2 cols) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#1F2937]">Recent Orders</h2>
              <p className="text-xs text-gray-500">Latest transactions from your storefront</p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-semibold text-[#4DA3FF] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {stats.recentOrders.length === 0 ? (
            <div className="text-center py-12 px-4 border border-dashed border-gray-200 rounded-2xl space-y-2">
              <div className="w-10 h-10 rounded-xl bg-gray-50 text-gray-400 flex items-center justify-center mx-auto">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <p className="text-xs font-semibold text-gray-700">No orders placed yet</p>
              <p className="text-[11px] text-gray-400 max-w-xs mx-auto">
                When customers complete checkouts, their orders and fulfillment statuses will appear right here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {stats.recentOrders.map((order) => (
                <div key={order.id} className="py-3.5 flex items-center justify-between gap-4 hover:bg-gray-50/60 transition-colors rounded-xl px-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#4DA3FF]">
                        {order.order_number || `#${order.id.slice(0, 8)}`}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold capitalize bg-amber-50 text-amber-700 border border-amber-200">
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-[#1F2937]">{order.customer_name}</p>
                    <span className="text-[10px] text-gray-400 block">{order.date}</span>
                  </div>
                  <span className="text-xs sm:text-sm font-extrabold text-[#1F2937]">
                    ₹{order.amount.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Management Shortcuts (Right 1 col) */}
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-[#1F2937]">Quick Actions</h2>
            <div className="space-y-2">
              <Link
                href="/admin/products"
                className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-[#EAF6FF] border border-gray-200/80 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white text-[#4DA3FF] shadow-2xs flex items-center justify-center">
                    <Package className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#1F2937] block group-hover:text-[#4DA3FF]">
                      Product Catalog
                    </span>
                    <span className="text-[10px] text-gray-400">Add, edit, change prices</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#4DA3FF]" />
              </Link>

              <Link
                href="/admin/orders"
                className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-[#EAF6FF] border border-gray-200/80 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white text-emerald-600 shadow-2xs flex items-center justify-center">
                    <ShoppingCart className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#1F2937] block group-hover:text-[#4DA3FF]">
                      Manage Orders
                    </span>
                    <span className="text-[10px] text-gray-400">View status & shipping</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#4DA3FF]" />
              </Link>

              <Link
                href="/"
                className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-[#EAF6FF] border border-gray-200/80 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white text-purple-600 shadow-2xs flex items-center justify-center">
                    <ExternalLink className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#1F2937] block group-hover:text-[#4DA3FF]">
                      Live Storefront
                    </span>
                    <span className="text-[10px] text-gray-400">Customer view</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#4DA3FF]" />
              </Link>
            </div>
          </div>

          {/* Sync status card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#EAF6FF] to-blue-50/50 border border-[#4DA3FF]/20 space-y-1.5">
            <div className="flex items-center gap-2 text-[#4DA3FF]">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-bold">Instant Sync Enabled</span>
            </div>
            <p className="text-[11px] text-gray-600 leading-relaxed">
              All changes to products and inventory in this admin panel update Supabase instantly and reflect on your customer store.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
