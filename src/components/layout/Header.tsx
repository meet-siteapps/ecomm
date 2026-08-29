'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Search, User, X, Shield, LogOut } from 'lucide-react';
import { MobileMenu } from './MobileMenu';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';

import { CuteTeddyLogo } from '@/components/common/CartoonIllustrations';

export function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const totalCartItems = useCartStore((state) => state.getTotalItems());
  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);
  const signOut = useAuthStore((state) => state.signOut);

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

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#EFE7DE] shadow-cute">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-3 sm:gap-4">
        {/* Brand Logo with Cute Cartoon Teddy */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 shrink-0 group">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#FFEAEF] p-1 flex items-center justify-center transition-all group-hover:scale-110 group-hover:rotate-6 shadow-2xs">
            <CuteTeddyLogo className="w-full h-full" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg sm:text-xl text-[#2D3748] tracking-tight leading-none group-hover:text-[#FF6B8B] transition-colors">
              Baby Ladoo
            </span>
            <span className="text-[9px] sm:text-[10px] text-[#FF6B8B] font-bold tracking-wider mt-0.5">
              FOR LITTLE ONES ✨
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-2">
          <Link
            href="/"
            className="px-3.5 py-1.5 rounded-full text-sm font-bold text-[#4A5568] hover:text-[#FF6B8B] hover:bg-[#FFEAEF]/70 transition-all"
          >
            Home
          </Link>
          <Link
            href="/products"
            className="px-3.5 py-1.5 rounded-full text-sm font-bold text-[#4A5568] hover:text-[#FF6B8B] hover:bg-[#FFEAEF]/70 transition-all"
          >
            All Products
          </Link>
          {isAuthenticated && (
            <Link
              href="/account"
              className="px-3.5 py-1.5 rounded-full text-sm font-bold text-[#4A5568] hover:text-[#FF6B8B] hover:bg-[#FFEAEF]/70 transition-all"
            >
              My Orders
            </Link>
          )}
          {isAdmin && (
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-[#F3E8FF] text-[#8B5CF6] hover:bg-[#E9D5FF] border border-[#E9D5FF] transition-all shadow-2xs"
            >
              <Shield className="w-3.5 h-3.5 text-[#8B5CF6]" />
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
              placeholder="Search soft clothing, cute toys, essentials..."
              className="w-full bg-[#FAF7F2] hover:bg-[#FAF7F2]/80 text-xs sm:text-sm font-medium text-[#2D3748] placeholder-gray-400 rounded-full pl-10 pr-4 py-2.5 border border-[#EFE7DE] focus:border-[#FF6B8B] focus:bg-white focus:outline-none focus:ring-3 focus:ring-[#FF6B8B]/15 transition-all shadow-2xs"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </form>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Mobile Search Toggle Button */}
          <button
            type="button"
            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            className="lg:hidden p-2.5 rounded-full text-[#4A5568] hover:bg-[#FFEAEF] hover:text-[#FF6B8B] transition-all"
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
            className="relative p-2.5 rounded-full text-[#4A5568] hover:bg-[#FFEAEF] hover:text-[#FF6B8B] transition-all"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[20px] h-[20px] px-1 text-[10px] font-extrabold bg-[#FF6B8B] text-white rounded-full flex items-center justify-center shadow-cute-pink animate-in zoom-in-75 duration-200">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </Link>

          {/* Account Button (Desktop) */}
          <Link
            href={isAuthenticated ? '/account' : '/login'}
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-[#4A5568] bg-[#FAF7F2] hover:bg-[#FFEAEF] hover:text-[#FF6B8B] border border-[#EFE7DE] hover:border-[#FF6B8B]/30 transition-all shadow-2xs"
          >
            <User className="w-4 h-4 text-[#FF6B8B]" />
            <span>{isAuthenticated ? `Hi, ${displayName}` : 'Sign In'}</span>
          </Link>

          {/* Quick Logout Button (Desktop) */}
          {isAuthenticated && (
            <button
              type="button"
              onClick={handleSignOut}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold text-gray-500 hover:text-red-600 hover:bg-red-50 border border-[#EFE7DE] hover:border-red-200 transition-all"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          )}

          {/* Mobile Menu Trigger & Drawer */}
          <MobileMenu cartCount={cartCount} />
        </div>
      </div>

      {/* Expandable Mobile Search Bar Dropdown */}
      {isMobileSearchOpen && (
        <div className="lg:hidden px-4 py-3 bg-[#FAF7F2] border-t border-[#EFE7DE] animate-in slide-in-from-top-2 duration-200">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search baby clothing, toys..."
              autoFocus
              className="w-full bg-white text-xs sm:text-sm text-[#2D3748] placeholder-gray-400 rounded-full pl-10 pr-4 py-2.5 border border-[#EFE7DE] focus:border-[#FF6B8B] focus:outline-none focus:ring-2 focus:ring-[#FF6B8B]/20 shadow-2xs"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </form>
        </div>
      )}
    </header>
  );
}
