'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X, ShoppingBag, Search, User, Home, Grid, ChevronRight, Shield, LogOut, Package } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

interface MobileMenuProps {
  cartCount?: number;
}

export function MobileMenu({ cartCount = 0 }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);
  const signOut = useAuthStore((state) => state.signOut);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const isAuthenticated = mounted && Boolean(user);
  const isAdmin = mounted && profile?.role === 'admin';
  const displayName = mounted && (profile?.name ? profile.name.split(' ')[0] : user?.email ? user.email.split('@')[0] : 'User');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsOpen(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
    router.push('/login');
  };

  return (
    <div className="md:hidden">
      {/* Mobile Hamburger Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-xl text-[#1F2937] hover:bg-[#EAF6FF] active:bg-[#EAF6FF] transition-colors focus:outline-none"
        aria-label="Open mobile navigation"
      >
        <Menu className="w-6 h-6 text-[#1F2937]" />
      </button>

      {/* Mobile Drawer Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          {/* Dark Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Solid Slide-in Panel */}
          <div className="relative z-10 w-full max-w-[320px] h-full bg-white shadow-2xl flex flex-col justify-between overflow-hidden border-l border-gray-100 animate-in slide-in-from-right duration-300">
            {/* Top Bar */}
            <div>
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-white">
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 font-bold text-base text-[#1F2937]"
                >
                  <div className="w-8 h-8 rounded-xl bg-[#EAF6FF] text-[#4DA3FF] flex items-center justify-center shadow-xs">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <span>The Shop</span>
                </Link>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
                  aria-label="Close mobile navigation"
                >
                  <X className="w-5 h-5 text-[#1F2937]" />
                </button>
              </div>

              {/* Search Bar */}
              <div className="p-4 border-b border-gray-100 bg-slate-50/60">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full bg-white text-sm text-[#1F2937] placeholder-gray-400 rounded-xl pl-9 pr-4 py-2.5 border border-gray-200 focus:border-[#4DA3FF] focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/20 transition-all"
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </form>
              </div>

              {/* Navigation Links */}
              <nav className="p-3 space-y-1">
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium text-[#1F2937] hover:bg-[#EAF6FF] hover:text-[#4DA3FF] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Home className="w-4 h-4 text-gray-500" />
                    <span>Home</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                </Link>

                <Link
                  href="/products"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium text-[#1F2937] hover:bg-[#EAF6FF] hover:text-[#4DA3FF] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Grid className="w-4 h-4 text-gray-500" />
                    <span>All Products</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                </Link>

                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold bg-purple-50 text-purple-800 hover:bg-purple-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Shield className="w-4 h-4 text-purple-600" />
                      <span>Admin Panel</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-purple-400" />
                  </Link>
                )}

                {isAuthenticated && (
                  <Link
                    href="/account"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium text-[#1F2937] hover:bg-[#EAF6FF] hover:text-[#4DA3FF] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Package className="w-4 h-4 text-gray-500" />
                      <span>My Orders</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                  </Link>
                )}

                <Link
                  href="/cart"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium text-[#1F2937] hover:bg-[#EAF6FF] hover:text-[#4DA3FF] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="w-4 h-4 text-gray-500" />
                    <span>Shopping Cart</span>
                  </div>
                  {cartCount > 0 ? (
                    <span className="px-2 py-0.5 text-xs font-bold bg-[#4DA3FF] text-white rounded-full">
                      {cartCount}
                    </span>
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                  )}
                </Link>
              </nav>
            </div>

            {/* Bottom Account Action */}
            <div className="p-4 border-t border-gray-100 bg-[#EAF6FF]/40 space-y-2">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/account"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-[#1F2937] text-sm font-semibold transition-colors shadow-2xs"
                  >
                    <User className="w-4 h-4 text-[#4DA3FF]" />
                    <span>My Account ({displayName})</span>
                  </Link>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-red-600 hover:bg-red-50 text-xs font-bold transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-[#4DA3FF] hover:bg-[#2B8BE6] active:bg-[#2B8BE6] text-white text-sm font-semibold transition-colors shadow-xs"
                >
                  <User className="w-4 h-4" />
                  <span>Account / Sign In</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
