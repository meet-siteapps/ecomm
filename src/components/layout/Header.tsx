'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Search, User, X, Shield } from 'lucide-react';
import { MobileMenu } from './MobileMenu';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';

export function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const totalCartItems = useCartStore((state) => state.getTotalItems());
  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cartCount = mounted ? totalCartItems : 0;
  const isAuthenticated = mounted && Boolean(user);
  const isAdmin = mounted && profile?.role === 'admin';
  const displayName = mounted && (profile?.name ? profile.name.split(' ')[0] : user?.email ? user.email.split('@')[0] : null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 sm:gap-2.5 shrink-0 group">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#EAF6FF] text-[#4DA3FF] flex items-center justify-center transition-transform group-hover:scale-105 shadow-xs">
            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base sm:text-lg text-[#1F2937] tracking-tight leading-none">
              The Shop
            </span>
            <span className="text-[9px] sm:text-[10px] text-gray-400 font-medium tracking-wide">
              STOREFRONT
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium text-[#1F2937] hover:text-[#4DA3FF] transition-colors"
          >
            Home
          </Link>
          <Link
            href="/products"
            className="text-sm font-medium text-[#1F2937] hover:text-[#4DA3FF] transition-colors"
          >
            All Products
          </Link>
          {isAuthenticated && (
            <Link
              href="/account"
              className="text-sm font-medium text-[#1F2937] hover:text-[#4DA3FF] transition-colors"
            >
              My Orders
            </Link>
          )}
          {isAdmin && (
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 transition-colors"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Panel</span>
            </Link>
          )}
        </nav>

        {/* Search Bar (Desktop) */}
        <div className="hidden lg:flex flex-1 max-w-md mx-4">
          <form onSubmit={handleSearch} className="w-full relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, brands..."
              className="w-full bg-[#EAF6FF]/50 hover:bg-[#EAF6FF]/70 text-sm text-[#1F2937] placeholder-gray-400 rounded-xl pl-10 pr-4 py-2 border border-transparent focus:border-[#4DA3FF] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/20 transition-all"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </form>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1 sm:gap-3">
          {/* Mobile Search Toggle Button */}
          <button
            type="button"
            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            className="lg:hidden p-2 rounded-xl text-[#1F2937] hover:bg-[#EAF6FF] hover:text-[#4DA3FF] transition-colors"
            aria-label="Toggle search"
          >
            {isMobileSearchOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Search className="w-5 h-5" />
            )}
          </button>

          {/* Cart Button */}
          <Link
            href="/cart"
            className="relative p-2 rounded-xl text-[#1F2937] hover:bg-[#EAF6FF] hover:text-[#4DA3FF] transition-colors"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 text-[10px] font-bold bg-[#4DA3FF] text-white rounded-full flex items-center justify-center animate-in zoom-in-75 duration-200">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </Link>

          {/* Account Button (Desktop) */}
          <Link
            href={isAuthenticated ? '/account' : '/login'}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium text-[#1F2937] hover:bg-[#EAF6FF] hover:text-[#4DA3FF] border border-gray-200 hover:border-[#4DA3FF]/30 transition-all"
          >
            <User className="w-4 h-4 text-[#4DA3FF]" />
            <span>{isAuthenticated ? `Hi, ${displayName}` : 'Sign In'}</span>
          </Link>

          {/* Mobile Menu Trigger & Drawer */}
          <MobileMenu cartCount={cartCount} />
        </div>
      </div>

      {/* Expandable Mobile Search Bar Dropdown */}
      {isMobileSearchOpen && (
        <div className="lg:hidden px-4 py-3 bg-[#EAF6FF]/40 border-t border-gray-100 animate-in slide-in-from-top-2 duration-200">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, brands..."
              autoFocus
              className="w-full bg-white text-sm text-[#1F2937] placeholder-gray-400 rounded-xl pl-10 pr-4 py-2.5 border border-gray-200 focus:border-[#4DA3FF] focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/20 shadow-xs"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </form>
        </div>
      )}
    </header>
  );
}
