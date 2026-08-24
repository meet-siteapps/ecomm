'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { AdminGuard } from '@/components/admin/AdminGuard';

interface AdminLayoutProps {
  children: ReactNode;
}

const ADMIN_NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();

  return (
    <AdminGuard>
      <div className="min-h-[85vh] bg-slate-50/50 pb-16">
        {/* Admin Navigation Bar */}
        <div className="bg-white border-b border-gray-200/80 sticky top-16 z-30 shadow-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14 gap-4 overflow-x-auto no-scrollbar">
              {/* Left: Section Title & Badge */}
              <div className="flex items-center gap-2.5 shrink-0 pr-2 border-r border-gray-200">
                <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="text-xs font-extrabold text-[#1F2937] tracking-tight uppercase">
                  Admin Panel
                </span>
              </div>

              {/* Center: Admin Links */}
              <nav className="flex items-center gap-1 sm:gap-1.5 flex-1 min-w-max">
                {ADMIN_NAV.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.exact
                    ? pathname === item.href
                    : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-[#EAF6FF] text-[#4DA3FF] font-bold shadow-2xs'
                          : 'text-gray-600 hover:text-[#1F2937] hover:bg-gray-100/80'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Right: View Store Link */}
              <div className="shrink-0 pl-2">
                <Link
                  href="/"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-600 hover:text-[#4DA3FF] bg-gray-50 hover:bg-[#EAF6FF] border border-gray-200 transition-all shadow-2xs"
                >
                  <span>View Store</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Page Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
          {children}
        </main>
      </div>
    </AdminGuard>
  );
}
