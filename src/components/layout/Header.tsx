'use client';

import { useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { ShoppingBag, Search, User, X, Shield, LogOut } from 'lucide-react';
import { MobileMenu } from './MobileMenu';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { CuteTeddyLogo } from '@/components/common/CartoonIllustrations';

const emptySubscribe = () => () => {};

export function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  const totalCartItems = useCartStore((state) => state.getTotalItems());
  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);
  const signOut = useAuthStore((state) => state.signOut);

  const cartCount = mounted ? totalCartItems : 0;
  const isAuthenticated = mounted && Boolean(user);
  const isAdmin = mounted && profile?.role === 'admin';

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
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#EFE4D6] shadow-[0_2px_15px_-3px_rgba(25,54,83,0.06)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
        {/* 1. BRAND LOGO WITH COLORFUL PLAYFUL LETTERS */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 sm:gap-2.5 shrink-0 group select-none py-1 focus:outline-none"
            aria-label="Baby Ladoo Home"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl bg-[#FDE8EB] p-1 flex items-center justify-center border border-[#F27A8A]/30 shadow-2xs transition-all duration-300 group-hover:scale-105 group-hover:rotate-3">
              <CuteTeddyLogo className="w-full h-full" />
            </div>

            {/* Playful Colorful Letters for Baby Ladoo */}
            <div className="flex items-baseline font-black text-lg sm:text-xl lg:text-2xl tracking-tight select-none">
              <span className="text-[#F27A8A]">B</span>
              <span className="text-[#D99A26]">a</span>
              <span className="text-[#1F95B5]">b</span>
              <span className="text-[#5E933E]">y</span>
              <span className="w-1.5 sm:w-2 inline-block"></span>
              <span className="text-[#F27A8A]">L</span>
              <span className="text-[#D99A26]">a</span>
              <span className="text-[#1F95B5]">d</span>
              <span className="text-[#5E933E]">o</span>
              <span className="text-[#F27A8A]">o</span>
            </div>
          </Link>
        </div>

        {/* 2. DESKTOP NAVIGATION PILLS */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-3">
          <Link
            href="/"
            className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 ${
              pathname === '/'
                ? 'bg-[#F27A8A] text-white shadow-cute-pink'
                : 'text-[#193653] hover:text-[#F27A8A] hover:bg-[#FDE8EB]/60'
            }`}
          >
            Home
          </Link>

          <Link
            href="/products"
            className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 ${
              pathname.startsWith('/products')
                ? 'bg-[#F27A8A] text-white shadow-cute-pink'
                : 'text-[#193653] hover:text-[#F27A8A] hover:bg-[#FDE8EB]/60'
            }`}
          >
            Shop
          </Link>

          <Link
            href="/about"
            className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 ${
              pathname === '/about'
                ? 'bg-[#F27A8A] text-white shadow-cute-pink'
                : 'text-[#193653] hover:text-[#F27A8A] hover:bg-[#FDE8EB]/60'
            }`}
          >
            About Us
          </Link>

          <Link
            href="/contact"
            className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 ${
              pathname === '/contact'
                ? 'bg-[#F27A8A] text-white shadow-cute-pink'
                : 'text-[#193653] hover:text-[#F27A8A] hover:bg-[#FDE8EB]/60'
            }`}
          >
            Contact Us
          </Link>

          {isAdmin && (
            <Link
              href="/admin"
              className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full transition-all duration-200 ${
                pathname.startsWith('/admin')
                  ? 'bg-[#8FD3E8] text-[#193653] shadow-2xs font-extrabold'
                  : 'bg-[#EBF8FC] text-[#193653] hover:bg-[#8FD3E8]/40 border border-[#8FD3E8]/40'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-current" />
              <span>Admin</span>
            </Link>
          )}
        </nav>

        {/* 3. RIGHT ACTION ICONS */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          <div className="hidden lg:block relative w-44 xl:w-56">
            <form onSubmit={handleSearch} className="w-full relative group">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full bg-[#FAF4EE] hover:bg-[#FAF4EE]/90 focus:bg-white text-xs font-medium text-[#193653] placeholder-[#5D7285]/70 rounded-full pl-8 pr-7 py-1.5 border border-[#EFE4D6] focus:border-[#F27A8A] focus:outline-none focus:ring-2 focus:ring-[#F27A8A]/15 transition-all shadow-2xs"
              />
              <Search className="w-3.5 h-3.5 text-[#5D7285] group-focus-within:text-[#F27A8A] absolute left-2.5 top-1/2 -translate-y-1/2 transition-colors pointer-events-none" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-gray-400 hover:text-gray-600"
                  aria-label="Clear search"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </form>
          </div>

          <button
            type="button"
            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            className="lg:hidden p-2 rounded-full text-[#193653] hover:bg-[#FDE8EB] hover:text-[#F27A8A] active:scale-95 transition-all focus:outline-none"
            aria-label="Toggle search"
          >
            {isMobileSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
          </button>

          <Link
            href={isAuthenticated ? '/account' : '/login'}
            className="p-2 sm:p-2.5 rounded-full text-[#193653] hover:bg-[#FDE8EB] hover:text-[#F27A8A] active:scale-95 transition-all focus:outline-none"
            aria-label="User Account"
          >
            <User className="w-5 h-5" />
          </Link>

          <Link
            href="/cart"
            className="relative p-2 sm:p-2.5 rounded-full text-[#193653] hover:bg-[#FDE8EB] hover:text-[#F27A8A] active:scale-95 transition-all focus:outline-none group"
            aria-label={`Shopping Cart with ${cartCount} items`}
          >
            <ShoppingBag className="w-5 h-5 group-hover:scale-105 transition-transform" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 text-[10px] font-extrabold bg-[#F27A8A] text-white rounded-full flex items-center justify-center shadow-cute-pink animate-pop-in border-2 border-white">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </Link>

          {isAuthenticated && (
            <button
              type="button"
              onClick={handleSignOut}
              className="hidden sm:inline-flex p-2 rounded-full text-[#5D7285] hover:text-red-600 hover:bg-red-50 transition-all"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}

          <MobileMenu cartCount={cartCount} />
        </div>
      </div>

      {isMobileSearchOpen && (
        <div className="lg:hidden px-4 py-2.5 bg-[#FAF4EE]/95 backdrop-blur-sm border-t border-[#EFE4D6] animate-in slide-in-from-top-2 duration-200">
          <form onSubmit={handleSearch} className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              autoFocus
              className="w-full bg-white text-xs text-[#193653] placeholder-[#5D7285]/70 rounded-full pl-9 pr-8 py-2 border border-[#EFE4D6] focus:border-[#F27A8A] focus:outline-none focus:ring-2 focus:ring-[#F27A8A]/20 shadow-2xs"
            />
            <Search className="w-4 h-4 text-[#5D7285] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>
        </div>
      )}
    </header>
  );
}
