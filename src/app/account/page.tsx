'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, ShieldCheck, LogOut, Package, ShoppingBag, ArrowRight, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export default function AccountPage() {
  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);
  const isLoading = useAuthStore((state) => state.isLoading);
  const signOut = useAuthStore((state) => state.signOut);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [isLoading, user, router]);

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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Profile Summary */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#EAF6FF] text-[#4DA3FF] flex items-center justify-center text-xl font-extrabold shadow-xs">
            {(profile?.name || user.email || 'U').charAt(0).toUpperCase()}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#1F2937]">
                {profile?.name || 'Customer'}
              </h1>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                  isAdmin
                    ? 'bg-purple-100 text-purple-700 border border-purple-200'
                    : 'bg-[#EAF6FF] text-[#4DA3FF] border border-[#4DA3FF]/20'
                }`}
              >
                {isAdmin ? 'Store Admin' : 'Customer'}
              </span>
            </div>
            <p className="text-xs text-gray-500 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-gray-400" />
              <span>{user.email}</span>
            </p>
          </div>
        </div>

        {/* Sign Out Button */}
        <button
          type="button"
          onClick={handleSignOut}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-colors shadow-2xs self-start sm:self-auto"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Account Info Details & Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Info Card */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-[#1F2937] uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4 text-[#4DA3FF]" />
            Personal Details
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-400">Full Name</span>
              <span className="font-semibold text-[#1F2937]">{profile?.name || '—'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-400">Email Address</span>
              <span className="font-semibold text-[#1F2937]">{user.email}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-400">Phone</span>
              <span className="font-semibold text-[#1F2937]">{profile?.phone || 'Not provided'}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-400">Account Type</span>
              <span className="font-semibold text-[#1F2937] capitalize">{profile?.role || 'customer'}</span>
            </div>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-[#1F2937] uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#4DA3FF]" />
            Quick Navigation
          </h2>

          <div className="space-y-2.5">
            {isAdmin && (
              <Link
                href="/admin"
                className="flex items-center justify-between p-3.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-purple-700" />
                  <span className="text-xs font-bold">Admin Management Dashboard</span>
                </div>
                <ArrowRight className="w-4 h-4 text-purple-600" />
              </Link>
            )}

            <Link
              href="/products"
              className="flex items-center justify-between p-3.5 rounded-xl bg-[#EAF6FF]/50 hover:bg-[#EAF6FF] text-[#1F2937] border border-gray-200/60 transition-colors"
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4 text-[#4DA3FF]" />
                <span className="text-xs font-semibold">Browse Products</span>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </Link>

            <Link
              href="/cart"
              className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-[#1F2937] border border-gray-200/60 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4 text-gray-600" />
                <span className="text-xs font-semibold">View Shopping Cart</span>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
