'use client';

import { useState } from 'react';
import { Settings, ShieldCheck, Sparkles, Check, Database, Lock } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export default function AdminSettingsPage() {
  const profile = useAuthStore((state) => state.profile);
  const [copied, setCopied] = useState(false);

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] tracking-tight">
          Store Settings
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Configuration, security, and integration parameters
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#1F2937]">Current Administrator</h2>
            <p className="text-xs text-gray-500">{profile?.email} ({profile?.name || 'Admin'})</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
            Supabase Connection
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-1">
              <div className="flex items-center gap-2 text-gray-500">
                <Database className="w-4 h-4 text-[#4DA3FF]" />
                <span className="font-semibold">Storage Bucket</span>
              </div>
              <span className="font-mono text-[11px] font-bold text-[#1F2937] block">
                products (public)
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-1">
              <div className="flex items-center gap-2 text-gray-500">
                <Lock className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold">Row Level Security</span>
              </div>
              <span className="font-mono text-[11px] font-bold text-emerald-700 block">
                Active & Enforced
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#EAF6FF]/50 border border-[#4DA3FF]/20 space-y-2">
          <div className="flex items-center gap-2 text-[#4DA3FF]">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-bold">Admin Management Tip</span>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            Admins have full write and delete permissions on products and image storage. Regular customers are restricted by Postgres RLS to read-only access on active items.
          </p>
        </div>
      </div>
    </div>
  );
}
