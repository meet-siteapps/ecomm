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
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { CuteTeddyLogo, ScallopDivider } from '@/components/common/CartoonIllustrations';

const emptySubscribe = () => () => {};

export function Header() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
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

  // Scroll behavior - add shadow and reduce padding when scrolled
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 px-3 sm:px-5 lg:px-8 pt-2 sm:pt-3 lg:pt-3`}
    >
      {/* Outer wrapper with rounded corners and lighter warm cream gradient */}
      <div 
        className={`relative transition-all duration-300 ${
          isScrolled 
            ? 'bg-gradient-to-br from-[#FBF5ED] via-[#F8F0E5] to-[#F5EBD9] shadow-[0_8px_32px_-4px_rgba(139,92,46,0.18),0_4px_16px_-2px_rgba(139,92,46,0.12)]' 
            : 'bg-gradient-to-br from-[#FAF3E9] via-[#F7EDDF] to-[#F4E8D5] shadow-[0_6px_24px_-2px_rgba(139,92,46,0.15),0_2px_12px_-1px_rgba(139,92,46,0.1)]'
        } rounded-[28px] sm:rounded-[32px] lg:rounded-[36px] overflow-hidden border-2 border-[#D4C4AE]`}
      >
        {/* Inner content container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            className={`flex items-center justify-between gap-4 sm:gap-6 transition-all duration-300 ${
              isScrolled 
                ? 'h-11 sm:h-13 lg:h-14' 
                : 'h-12 sm:h-15 lg:h-16'
            }`}
          >
            {/* 1. BRAND LOGO */}
            <Link
              href="/"
              className="flex items-center gap-2 sm:gap-2.5 shrink-0 group select-none focus:outline-none"
              aria-label="Baby Ladoo Home"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-[#FFD6E0] to-[#FFC1CC] p-1.5 flex items-center justify-center border-2 border-white/90 shadow-[0_4px_16px_rgba(255,214,224,0.5)] transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_6px_24px_rgba(255,214,224,0.7)]">
                <CuteTeddyLogo className="w-full h-full transition-transform duration-300 group-hover:rotate-6" />
              </div>

              {/* Brand Name - Colorful text on cream background */}
              <div className="flex items-baseline font-black text-lg sm:text-xl lg:text-2xl tracking-tight select-none">
                <span className="text-[#F27A8A] drop-shadow-[0_1px_2px_rgba(0,0,0,0.08)]">B</span>
                <span className="text-[#D99A26] drop-shadow-[0_1px_2px_rgba(0,0,0,0.08)]">a</span>
                <span className="text-[#1F95B5] drop-shadow-[0_1px_2px_rgba(0,0,0,0.08)]">b</span>
                <span className="text-[#5E933E] drop-shadow-[0_1px_2px_rgba(0,0,0,0.08)]">y</span>
                <span className="w-1 sm:w-1.5 inline-block"></span>
                <span className="text-[#F27A8A] drop-shadow-[0_1px_2px_rgba(0,0,0,0.08)]">L</span>
                <span className="text-[#D99A26] drop-shadow-[0_1px_2px_rgba(0,0,0,0.08)]">a</span>
                <span className="text-[#1F95B5] drop-shadow-[0_1px_2px_rgba(0,0,0,0.08)]">d</span>
                <span className="text-[#5E933E] drop-shadow-[0_1px_2px_rgba(0,0,0,0.08)]">o</span>
                <span className="text-[#F27A8A] drop-shadow-[0_1px_2px_rgba(0,0,0,0.08)]">o</span>
              </div>
            </Link>

            {/* 2. DESKTOP NAVIGATION - More breathing room */}
            <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2 flex-1 justify-center max-w-xl mx-auto" aria-label="Main navigation">
              <Link
                href="/"
                className={`relative px-4 xl:px-5 py-2 rounded-full text-sm font-bold transition-all duration-250 ${
                  pathname === '/'
                    ? 'bg-[#FEF3C7] text-[#92400E] shadow-md scale-105'
                    : 'text-[#5D4E37] hover:text-[#3D2E17] hover:bg-[#FEF3C7]/50 hover:scale-105'
                }`}
              >
                Home
              </Link>

              <Link
                href="/products"
                className={`relative px-4 xl:px-5 py-2 rounded-full text-sm font-bold transition-all duration-250 ${
                  pathname.startsWith('/products')
                    ? 'bg-[#FDF2F4] text-[#F06277] shadow-md scale-105'
                    : 'text-[#5D4E37] hover:text-[#F06277] hover:bg-[#FDF2F4]/70 hover:scale-105'
                }`}
              >
                Shop
              </Link>

              <Link
                href="/about"
                className={`relative px-4 xl:px-5 py-2 rounded-full text-sm font-bold transition-all duration-250 ${
                  pathname === '/about'
                    ? 'bg-[#EBF7EE] text-[#5E933E] shadow-md scale-105'
                    : 'text-[#5D4E37] hover:text-[#5E933E] hover:bg-[#EBF7EE]/70 hover:scale-105'
                }`}
              >
                About
              </Link>

              <Link
                href="/contact"
                className={`relative px-4 xl:px-5 py-2 rounded-full text-sm font-bold transition-all duration-250 ${
                  pathname === '/contact'
                    ? 'bg-[#EBF5FB] text-[#1F95B5] shadow-md scale-105'
                    : 'text-[#5D4E37] hover:text-[#1F95B5] hover:bg-[#EBF5FB]/70 hover:scale-105'
                }`}
              >
                Contact
              </Link>

              {isAdmin && (
                <Link
                  href="/admin"
                  className={`inline-flex items-center gap-1.5 text-sm font-bold px-4 xl:px-5 py-2 rounded-full transition-all duration-250 ${
                    pathname.startsWith('/admin')
                      ? 'bg-[#8FD3E8] text-white shadow-md scale-105'
                      : 'bg-[#EBF8FC] text-[#193653] hover:bg-[#8FD3E8] hover:text-white border border-[#8FD3E8]/30 hover:scale-105'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </Link>
              )}
            </nav>

            {/* 3. RIGHT ACTIONS - Better spacing */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Shopping Cart */}
              <Link
                href="/cart"
                className="relative p-2 sm:p-2.5 rounded-full text-[#5D4E37] bg-white/60 hover:bg-[#FDE8EB] hover:text-[#F27A8A] active:scale-95 transition-all duration-250 focus:outline-none group shadow-sm hover:shadow-md"
                aria-label={`Shopping Cart with ${cartCount} items`}
              >
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform duration-250" strokeWidth={2.5} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] sm:min-w-[18px] sm:h-[18px] px-1 text-[8px] sm:text-[9px] font-extrabold bg-gradient-to-br from-[#F27A8A] to-[#e06878] text-white rounded-full flex items-center justify-center shadow-lg animate-pop-in border-2 border-white">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>

              {/* Auth Buttons - Desktop Only */}
              {isAuthenticated ? (
                <div className="relative hidden md:block" ref={userMenuRef}>
                  <button
                    type="button"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 py-2 px-3.5 rounded-full border border-[#D4B896] hover:border-[#C4A886] bg-white/70 hover:bg-white/90 transition-all duration-250 focus:outline-none active:scale-98"
                    aria-expanded={isUserMenuOpen}
                    aria-haspopup="true"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#FFD6E0] text-[#F27A8A] text-xs font-extrabold flex items-center justify-center shadow-sm">
                      {userInitial}
                    </div>
                    <span className="text-sm font-bold text-[#5D4E37] max-w-[100px] truncate">
                      {userName}
                    </span>
                    <ChevronDown className="w-4 h-4 text-[#7D6E57]" />
                  </button>

                  {/* Profile Dropdown - Keep existing functionality */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#E6D2B5] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-2 border-b border-[#F0DCC4]">
                        <p className="text-xs font-extrabold text-[#3D2E17] truncate">{userName}</p>
                        <p className="text-[11px] text-[#7D6E57] truncate">{user?.email}</p>
                      </div>

                      <div className="py-1">
                        <Link
                          href="/account"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-[#5D4E37] hover:bg-[#FDF2F4]/60 hover:text-[#F27A8A] transition-colors"
                        >
                          <User className="w-4 h-4 text-[#F27A8A]" />
                          <span>My Profile</span>
                        </Link>

                        <Link
                          href="/account"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-[#5D4E37] hover:bg-[#FDF2F4]/60 hover:text-[#F27A8A] transition-colors"
                        >
                          <Package className="w-4 h-4 text-[#D99A26]" />
                          <span>My Orders</span>
                        </Link>

                        <Link
                          href="/wishlist"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-[#5D4E37] hover:bg-[#FDF2F4]/60 hover:text-[#F27A8A] transition-colors"
                        >
                          <Heart className="w-4 h-4 text-[#F27A8A]" />
                          <span>My Wishlist</span>
                        </Link>

                        {isAdmin && (
                          <Link
                            href="/admin"
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-[#5D4E37] bg-[#EBF8FC] hover:bg-[#8FD3E8]/30 transition-colors"
                          >
                            <Shield className="w-4 h-4 text-[#1F95B5]" />
                            <span>Admin Dashboard</span>
                          </Link>
                        )}
                      </div>

                      <div className="pt-1 border-t border-[#F0DCC4]">
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
                  {/* Sign In - Solid pink pill button */}
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#F06277] hover:bg-[#D9455B] text-white text-sm font-extrabold shadow-[0_3px_14px_-2px_rgba(240,98,119,0.5)] hover:shadow-[0_5px_20px_-2px_rgba(240,98,119,0.6)] hover:scale-105 active:scale-95 transition-all duration-250"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Sign In</span>
                  </Link>
                  
                  {/* Register - Outlined button */}
                  <Link
                    href="/register"
                    className="inline-flex items-center px-5 py-2 rounded-full border-2 border-[#F06277] bg-white hover:bg-[#FDF2F4] text-[#F06277] hover:text-[#D9455B] text-sm font-bold hover:scale-105 active:scale-95 transition-all duration-250"
                  >
                    <span>Register</span>
                  </Link>
                </div>
              )}

              {/* Mobile Menu - Keep completely unchanged */}
              <MobileMenu cartCount={cartCount} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Removed Scalloped divider - cleaner modern look */}
    </header>
  );
}
