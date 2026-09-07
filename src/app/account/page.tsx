'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  LogOut,
  Package,
  ShoppingBag,
  ArrowRight,
  Loader2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  CreditCard,
  Banknote,
  ChevronRight
} from 'lucide-react';
import { useAuthStore } from '@/frontend/store/useAuthStore';
import { fetchUserOrders } from '@/frontend/lib/api/orders';
import { Order, OrderStatus } from '@/frontend/types/order';

const STATUS_BADGES: Record<OrderStatus, { label: string; bg: string; text: string; border: string }> = {
  pending: { label: 'Pending Confirmation', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  confirmed: { label: 'Order Confirmed', bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' },
  processing: { label: 'Processing', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  shipped: { label: 'Shipped / In Transit', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  delivered: { label: 'Delivered', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  cancelled: { label: 'Cancelled', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
};

export default function AccountPage() {
  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);
  const isLoading = useAuthStore((state) => state.isLoading);
  const signOut = useAuthStore((state) => state.signOut);
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    async function loadOrders() {
      if (user?.id) {
        setLoadingOrders(true);
        try {
          const userOrders = await fetchUserOrders();
          setOrders(userOrders);
        } catch (err) {
          console.error('Failed to load user orders:', err);
        } finally {
          setLoadingOrders(false);
        }
      }
    }
    if (user?.id) {
      loadOrders();
    }
  }, [user?.id]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-[#4DA3FF] animate-spin" />
        <p className="text-xs text-gray-500 font-medium">Loading account details...</p>
      </div>
    );
  }

  const isAdmin = profile?.role === 'admin';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* ============================================================ */}
      {/* STEP 23 — ACCOUNT HEADER & PROFILE DETAILS */}
      {/* ============================================================ */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EFE7DE] shadow-cute flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-[#FFEAEF] text-[#FF6B8B] flex items-center justify-center text-xl font-extrabold shadow-cute-pink">
            {(profile?.name || user.email || 'U').charAt(0).toUpperCase()}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#2D3748]">
                {profile?.name || 'Customer'}
              </h1>
              <span
                className={`px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                  isAdmin
                    ? 'bg-[#F3E8FF] text-[#8B5CF6] border border-[#E9D5FF]'
                    : 'bg-[#FFEAEF] text-[#FF6B8B] border border-[#FF6B8B]/20'
                }`}
              >
                {isAdmin ? 'Store Admin' : 'Customer'}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#718096] font-medium">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#A0AEC0]" />
                <span>{user.email}</span>
              </span>
              {profile?.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#A0AEC0]" />
                  <span>{profile.phone}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          {isAdmin && (
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#F3E8FF] hover:bg-[#E9D5FF] text-[#8B5CF6] text-xs font-bold border border-[#E9D5FF] transition-colors shadow-2xs"
            >
              <ShieldCheck className="w-4 h-4 text-[#8B5CF6]" />
              <span>Admin Panel</span>
            </Link>
          )}

          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-[#FF6B8B]/30 text-[#FF6B8B] hover:bg-[#FFEAEF] text-xs font-bold transition-colors shadow-2xs"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* STEP 24 — MY ORDERS */}
      {/* ============================================================ */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Package className="w-5 h-5 text-[#FF6B8B]" />
            <h2 className="text-lg sm:text-xl font-extrabold text-[#2D3748] tracking-tight">
              My Orders
            </h2>
          </div>
          <span className="text-xs font-bold text-[#718096]">
            {orders.length} {orders.length === 1 ? 'order' : 'orders'} placed
          </span>
        </div>

        {loadingOrders ? (
          <div className="bg-white p-12 rounded-3xl border border-[#EFE7DE] text-center space-y-3 shadow-cute">
            <Loader2 className="w-7 h-7 text-[#FF6B8B] animate-spin mx-auto" />
            <p className="text-xs text-[#718096] font-medium">Loading your purchase history...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-[#EFE7DE] text-center space-y-4 shadow-cute">
            <div className="w-16 h-16 rounded-3xl bg-[#FFEAEF] text-[#FF6B8B] flex items-center justify-center mx-auto shadow-2xs">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-[#2D3748]">No orders yet</h3>
              <p className="text-xs text-[#718096] max-w-sm mx-auto font-medium">
                You haven&apos;t placed any orders yet. Discover our collection of baby essentials.
              </p>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#FF6B8B] hover:bg-[#FA5578] text-white text-xs font-extrabold transition-all shadow-cute-pink active:scale-98"
            >
              <span>Start Shopping</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const statusBadge = STATUS_BADGES[order.order_status] || STATUS_BADGES.pending;

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl border border-[#EFE7DE] shadow-cute overflow-hidden divide-y divide-[#EFE7DE]"
                >
                  {/* Order Top Meta */}
                  <div className="p-5 bg-[#FAF7F2] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#FF6B8B] text-sm">
                          {order.order_number}
                        </span>
                        <span
                          className={`px-3 py-0.5 rounded-full text-[10px] font-bold uppercase border ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}
                        >
                          {statusBadge.label}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#A0AEC0] block font-medium">
                        Placed on{' '}
                        {order.created_at
                          ? new Date(order.created_at).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : 'Recently'}
                      </span>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-sm font-extrabold text-[#2D3748] block">
                        ₹{order.total.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-[#A0AEC0] capitalize font-medium">
                        Payment: {order.payment_status}
                      </span>
                    </div>
                  </div>

                  {/* Order Items List */}
                  <div className="p-5 space-y-3">
                    {order.items && order.items.length > 0 ? (
                      <div className="divide-y divide-[#EFE7DE]">
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4 text-xs font-medium"
                          >
                            <div>
                              <span className="font-bold text-[#2D3748] block">{item.product_name}</span>
                              <div className="flex items-center gap-2 text-[11px] text-[#A0AEC0] mt-0.5">
                                <span>Quantity: {item.quantity}</span>
                                {item.selected_colour && <span>• Color: {item.selected_colour}</span>}
                                {item.selected_size && <span>• Size: {item.selected_size}</span>}
                              </div>
                            </div>
                            <span className="font-extrabold text-[#2D3748] shrink-0">
                              ₹{item.total.toLocaleString('en-IN')}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-[#A0AEC0] font-medium">Order snapshot recorded</p>
                    )}
                  </div>

                  {/* Order Shipping Summary Footer */}
                  <div className="p-4 bg-[#FAF7F2] text-[11px] text-[#718096] flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-medium">
                    <span>
                      Shipping to:{' '}
                      <strong className="text-[#2D3748]">
                        {order.shipping_address?.fullName || order.customer_name}
                      </strong>{' '}
                      ({order.shipping_address?.city}, {order.shipping_address?.state})
                    </span>
                    <span className="text-[#059669] font-bold">
                      Standard Delivery • 3-5 Business Days
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
