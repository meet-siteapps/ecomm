'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { ShieldAlert, ArrowLeft, Loader2 } from 'lucide-react';

interface AdminGuardProps {
  children: ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);
  const isLoading = useAuthStore((state) => state.isLoading);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#4DA3FF]" />
        <p className="text-xs text-gray-500 font-medium">Verifying administrator access...</p>
      </div>
    );
  }

  // Not logged in or not an admin
  if (!user || profile?.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-red-100 shadow-sm text-center space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-[#1F2937]">Admin Access Required</h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            You must be signed in with an administrator account to view and manage store products, orders, and settings.
          </p>
        </div>

        <div className="pt-2 flex flex-col gap-2.5">
          {!user ? (
            <Link
              href="/login?redirect=/admin"
              className="w-full py-2.5 px-4 rounded-xl bg-[#4DA3FF] hover:bg-[#2B8BE6] text-white text-xs font-bold transition-all shadow-xs"
            >
              Sign In to Admin
            </Link>
          ) : (
            <div className="p-3 bg-amber-50 rounded-xl text-amber-800 text-xs text-left space-y-1 border border-amber-200">
              <span className="font-bold block">Current Role: {profile?.role || 'customer'}</span>
              <span className="text-[11px] block">
                To promote this account, update the role to <code>admin</code> in your Supabase <code>profiles</code> table.
              </span>
            </div>
          )}

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Storefront</span>
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
