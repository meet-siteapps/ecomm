'use client';

import { useState, useRef, useEffect, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  ShoppingBag,
  User,
  Shield,
  LogOut,
  LogIn,
  Package,
  Heart,
  ChevronDown,
} from 'lucide-react';
import { MobileMenu } from './MobileMenu';
import { useCartStore } from '@/frontend/store/useCartStore';
import { useAuthStore } from '@/frontend/store/useAuthStore';
import { CuteTeddyLogo } from '@/frontend/components/common/CartoonIllustrations';

const emptySubscribe = () => () => {};

export function Header() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

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
  const userName = profile?.name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'Account';
  const userInitial = (userName || 'U').charAt(0).toUpperCase();

  // Close user dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setIsUserMenuOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    setIsUserMenuOpen(false);
    await signOut();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#EFE4D6] shadow-[0_2px_15px_-3px_rgba(25,54,83,0.06)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* 1. BRAND LOGO (Directs to Main Page) */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 sm:gap-2.5 shrink-0 group select-none py-1 focus:outline-none"
            aria-label="Baby Ladoo Home"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl bg-[#FFD6E0] p-1 flex items-center justify-center border border-[#F27A8A]/30 shadow-2xs transition-all duration-300 group-hover:scale-105 group-hover:rotate-3">
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

        {/* 2. DESKTOP NAVIGATION PILLS (VISIBLE ONLY ON DESKTOP) */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-3">
          <Link
            href="/"
            className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 ${
              pathname === '/'
                ? 'bg-[#FFD6E0] text-[#F27A8A] shadow-2xs font-extrabold'
                : 'text-[#193653] hover:text-[#F27A8A] hover:bg-[#FDE8EB]/60'
            }`}
          >
            Home
          </Link>

          <Link
            href="/products"
            className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 ${
              pathname.startsWith('/products')
                ? 'bg-[#FFD6E0] text-[#F27A8A] shadow-2xs font-extrabold'
                : 'text-[#193653] hover:text-[#F27A8A] hover:bg-[#FDE8EB]/60'
            }`}
          >
            Shop
          </Link>

          <Link
            href="/about"
            className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 ${
              pathname === '/about'
                ? 'bg-[#FFD6E0] text-[#F27A8A] shadow-2xs font-extrabold'
                : 'text-[#193653] hover:text-[#F27A8A] hover:bg-[#FDE8EB]/60'
            }`}
          >
            About Us
          </Link>

          <Link
            href="/contact"
            className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 ${
              pathname === '/contact'
                ? 'bg-[#FFD6E0] text-[#F27A8A] shadow-2xs font-extrabold'
                : 'text-[#193653] hover:text-[#F27A8A] hover:bg-[#FDE8EB]/60'
            }`}
          >
            Contact Us
          </Link>

          {isAdmin && (
            <Link
              href="/admin"
              className={`inline-flex items-center gap-1 text-xs font-extrabold px-3 py-1.5 rounded-full transition-all duration-200 ${
                pathname.startsWith('/admin')
                  ? 'bg-[#8FD3E8] text-[#193653] shadow-2xs'
                  : 'bg-[#EBF8FC] text-[#193653] hover:bg-[#8FD3E8]/40 border border-[#8FD3E8]/40'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-current" />
              <span>Admin</span>
            </Link>
          )}
        </nav>

        {/* 3. RIGHT ACTIONS: CART & AUTH BUTTONS */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Shopping Cart Button with Dynamic Badge */}
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

          {/* ======================================================== */}
          {/* DESKTOP AUTH BUTTONS & PROFILE DROPDOWN                  */}
          {/* ======================================================== */}
          {isAuthenticated ? (
            <div className="relative hidden md:block" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 py-1 px-3 rounded-full border border-[#EFE4D6] hover:border-[#F27A8A]/40 bg-[#FAF4EE]/70 hover:bg-[#FDE8EB]/40 transition-all focus:outline-none active:scale-98"
                aria-expanded={isUserMenuOpen}
                aria-haspopup="true"
              >
                <div className="w-6 h-6 rounded-full bg-[#FFD6E0] text-[#F27A8A] text-[11px] font-extrabold flex items-center justify-center shadow-2xs">
                  {userInitial}
                </div>
                <span className="text-xs font-bold text-[#193653] max-w-[110px] truncate">
                  {userName}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-[#5D7285]" />
              </button>

              {/* Profile Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#EFE4D6] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-[#EFE4D6]">
                    <p className="text-xs font-extrabold text-[#193653] truncate">{userName}</p>
                    <p className="text-[11px] text-[#5D7285] truncate">{user?.email}</p>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/account"
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-[#193653] hover:bg-[#FDE8EB]/60 hover:text-[#F27A8A] transition-colors"
                    >
                      <User className="w-4 h-4 text-[#F27A8A]" />
                      <span>My Profile</span>
                    </Link>

                    <Link
                      href="/account"
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-[#193653] hover:bg-[#FDE8EB]/60 hover:text-[#F27A8A] transition-colors"
                    >
                      <Package className="w-4 h-4 text-[#D99A26]" />
                      <span>My Orders</span>
                    </Link>

                    <Link
                      href="/wishlist"
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-[#193653] hover:bg-[#FDE8EB]/60 hover:text-[#F27A8A] transition-colors"
                    >
                      <Heart className="w-4 h-4 text-[#F27A8A]" />
                      <span>My Wishlist</span>
                    </Link>

                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-[#193653] bg-[#EBF8FC] hover:bg-[#8FD3E8]/30 transition-colors"
                      >
                        <Shield className="w-4 h-4 text-[#1F95B5]" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}
                  </div>

                  <div className="pt-1 border-t border-[#EFE4D6]">
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#F27A8A] hover:bg-[#e06878] text-white text-xs font-extrabold shadow-cute-pink active:scale-98 transition-all"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center px-3.5 py-2 rounded-full border border-[#EFE4D6] hover:border-[#F27A8A]/40 bg-[#FAF4EE] hover:bg-[#FDE8EB]/40 text-[#193653] hover:text-[#F27A8A] text-xs font-bold active:scale-98 transition-all"
              >
                <span>Register</span>
              </Link>
            </div>
          )}

          {/* Mobile Drawer Trigger (Hidden on Desktop: md:hidden) */}
          <MobileMenu cartCount={cartCount} />
        </div>
      </div>
    </header>
  );
}
