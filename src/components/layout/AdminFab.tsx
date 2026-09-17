'use client';

import { useSyncExternalStore } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

const emptySubscribe = () => () => {};

export function AdminFab() {
  const pathname = usePathname();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const profile = useAuthStore((state) => state.profile);

  // Strictly render ONLY for authenticated users with role 'admin'
  // Also hide when already inside the admin dashboard (/admin/*)
  const isAdmin = mounted && profile?.role === 'admin';
  const isInsideAdmin = pathname.startsWith('/admin');

  if (!isAdmin || isInsideAdmin) {
    return null;
  }

  return (
    <aside
      aria-label="Admin quick access"
      className="md:hidden fixed bottom-5 right-5 z-40 animate-pop-in pointer-events-auto"
    >
      <Link
        href="/admin"
        aria-label="Open Admin Dashboard"
        title="Admin Dashboard"
        className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-[#1F95B5] to-[#157A96] text-white border-2 border-white/95 shadow-[0_6px_20px_rgba(31,149,181,0.4)] hover:shadow-[0_8px_25px_rgba(31,149,181,0.55)] active:scale-90 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-[#8FD3E8]/50"
      >
        {/* Shield Icon */}
        <Shield
          className="w-5 h-5 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)] transition-transform duration-200 active:scale-95"
          strokeWidth={2.3}
        />

        {/* Small "Admin" notification dot/accent on top edge */}
        <span
          className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-[#8FD3E8] border-2 border-white rounded-full shadow-xs"
          aria-hidden="true"
        />

        {/* Desktop Tooltip bubble on hover */}
        <span
          role="tooltip"
          className="hidden sm:inline-flex absolute right-full mr-3 px-3 py-1.5 rounded-full bg-[#1E293B] text-white text-xs font-bold whitespace-nowrap shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none items-center gap-1.5"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#8FD3E8]" />
          Admin Dashboard
        </span>
      </Link>
    </aside>
  );
}
