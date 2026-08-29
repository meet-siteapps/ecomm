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
          <div className="relative z-10 w-full max-w-[320px] h-full bg-[#FAF7F2] shadow-2xl flex flex-col justify-between overflow-hidden border-l border-[#EFE7DE] animate-in slide-in-from-right duration-300">
            {/* Top Bar */}
            <div>
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#EFE7DE] bg-white">
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 font-extrabold text-base text-[#2D3748]"
                >
                  <div className="w-8 h-8 rounded-xl bg-[#FFEAEF] text-[#FF6B8B] flex items-center justify-center shadow-2xs">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <span>Baby Ladoo</span>
                </Link>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full text-gray-500 hover:bg-[#FFEAEF] hover:text-[#FF6B8B] transition-colors"
                  aria-label="Close mobile navigation"
                >
                  <X className="w-5 h-5 text-[#2D3748]" />
                </button>
              </div>

              {/* Search Bar */}
              <div className="p-4 border-b border-[#EFE7DE] bg-white/60">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search baby products..."
                    className="w-full bg-[#FAF7F2] text-xs text-[#2D3748] placeholder-gray-400 rounded-full pl-9 pr-4 py-2.5 border border-[#EFE7DE] focus:border-[#FF6B8B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B8B]/20 transition-all shadow-2xs"
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </form>
              </div>

              {/* Navigation Links */}
              <nav className="p-3 space-y-1">
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold text-[#4A5568] hover:bg-white hover:text-[#FF6B8B] transition-all shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-xl bg-[#FFEAEF] text-[#FF6B8B] flex items-center justify-center">
                      <Home className="w-3.5 h-3.5" />
                    </div>
                    <span>Home</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                </Link>

                <Link
                  href="/products"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold text-[#4A5568] hover:bg-white hover:text-[#FF6B8B] transition-all shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center">
                      <Grid className="w-3.5 h-3.5" />
                    </div>
                    <span>All Products</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                </Link>

                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold bg-[#F3E8FF] text-[#8B5CF6] hover:bg-[#E9D5FF] transition-all border border-[#E9D5FF] shadow-2xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-xl bg-[#8B5CF6] text-white flex items-center justify-center">
                        <Shield className="w-3.5 h-3.5" />
                      </div>
                      <span>Admin Panel</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-purple-400" />
                  </Link>
                )}

                {isAuthenticated && (
                  <Link
                    href="/account"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold text-[#4A5568] hover:bg-white hover:text-[#FF6B8B] transition-all shadow-2xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-xl bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center">
                        <Package className="w-3.5 h-3.5" />
                      </div>
                      <span>My Orders</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                  </Link>
                )}

                <Link
                  href="/cart"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold text-[#4A5568] hover:bg-white hover:text-[#FF6B8B] transition-all shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-xl bg-[#D1FAE5] text-[#059669] flex items-center justify-center">
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </div>
                    <span>Shopping Cart</span>
                  </div>
                  {cartCount > 0 ? (
                    <span className="px-2.5 py-0.5 text-xs font-extrabold bg-[#FF6B8B] text-white rounded-full shadow-cute-pink">
                      {cartCount}
                    </span>
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                  )}
                </Link>
              </nav>
            </div>

            {/* Bottom Account Action */}
            <div className="p-4 border-t border-[#EFE7DE] bg-white space-y-2">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/account"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-full bg-[#FAF7F2] border border-[#EFE7DE] hover:bg-[#FFEAEF] hover:text-[#FF6B8B] text-[#2D3748] text-sm font-bold transition-all shadow-2xs"
                  >
                    <User className="w-4 h-4 text-[#FF6B8B]" />
                    <span>My Account ({displayName})</span>
                  </Link>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-full text-red-600 hover:bg-red-50 text-xs font-bold transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-full bg-[#FF6B8B] hover:bg-[#FA5578] text-white text-sm font-bold transition-all shadow-cute-pink active:scale-98"
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
