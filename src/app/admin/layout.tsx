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
import { AdminGuard } from '@/frontend/components/admin/AdminGuard';

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
      <div className="min-h-[85vh] bg-[#FAF7F2] pb-16">
        {/* Admin Navigation Bar */}
        <div className="bg-white border-b border-[#EFE7DE] sticky top-16 z-30 shadow-2xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14 gap-4 overflow-x-auto no-scrollbar">
              {/* Left: Section Title & Badge */}
              <div className="flex items-center gap-2.5 shrink-0 pr-2 border-r border-[#EFE7DE]">
                <div className="w-8 h-8 rounded-xl bg-[#F3E8FF] text-[#8B5CF6] flex items-center justify-center shadow-2xs">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="text-xs font-extrabold text-[#2D3748] tracking-tight uppercase">
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
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-[#FFEAEF] text-[#FF6B8B] shadow-2xs'
                          : 'text-[#718096] hover:text-[#2D3748] hover:bg-[#FAF7F2]'
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
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-[#718096] hover:text-[#FF6B8B] bg-[#FAF7F2] hover:bg-[#FFEAEF] border border-[#EFE7DE] transition-all shadow-2xs"
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
