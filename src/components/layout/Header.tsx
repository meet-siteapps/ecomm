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
  ChevronRight,
  Sparkles,
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
  const lastAddedTimestamp = useCartStore((state) => state.lastAddedTimestamp);
  const [isCartBouncing, setIsCartBouncing] = useState(false);
  const lastAnimatedTimestampRef = useRef(0);

  useEffect(() => {
    if (lastAddedTimestamp && lastAddedTimestamp > lastAnimatedTimestampRef.current) {
      lastAnimatedTimestampRef.current = lastAddedTimestamp;
      setIsCartBouncing(true);
      const timer = setTimeout(() => {
        setIsCartBouncing(false);
      }, 750);
      return () => clearTimeout(timer);
    }
  }, [lastAddedTimestamp]);

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
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
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
        } rounded-[28px] sm:rounded-[32px] lg:rounded-[36px] border-2 border-[#D4C4AE]`}
      >
        {/* Inner content container */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div 
            className={`flex items-center justify-between gap-2 sm:gap-4 lg:gap-6 transition-all duration-300 ${
              isScrolled 
                ? 'h-11 sm:h-13 lg:h-14' 
                : 'h-12 sm:h-15 lg:h-16'
            }`}
          >
            {/* 1. BRAND LOGO */}
            <Link
              href="/"
              className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 group select-none focus:outline-none"
              aria-label="Baby Ladoo Home"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-[#FFD6E0] to-[#FFC1CC] p-1 sm:p-1.5 flex items-center justify-center border-2 border-white/90 shadow-[0_4px_16px_rgba(255,214,224,0.5)] transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_6px_24px_rgba(255,214,224,0.7)]">
                <CuteTeddyLogo className="w-full h-full transition-transform duration-300 group-hover:rotate-6" />
              </div>

              {/* Brand Name - Colorful text on cream background */}
              <div className="flex items-baseline font-black text-base sm:text-xl lg:text-2xl tracking-tight select-none">
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

            {/* 2. NAVIGATION - Visible on tablet (md:) and desktop (lg:) */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-1.5 xl:gap-2 flex-1 justify-center max-w-xl mx-auto" aria-label="Main navigation">
              <Link
                href="/"
                className={`relative px-3 lg:px-4 xl:px-5 py-1.5 lg:py-2 rounded-full text-xs lg:text-sm font-bold transition-all duration-250 ${
                  pathname === '/'
                    ? 'bg-[#FEF3C7] text-[#92400E] shadow-md scale-105'
                    : 'text-[#5D4E37] hover:text-[#3D2E17] hover:bg-[#FEF3C7]/50 hover:scale-105'
                }`}
              >
                Home
              </Link>

              <Link
                href="/products"
                className={`relative px-3 lg:px-4 xl:px-5 py-1.5 lg:py-2 rounded-full text-xs lg:text-sm font-bold transition-all duration-250 ${
                  pathname.startsWith('/products')
                    ? 'bg-[#FDF2F4] text-[#F06277] shadow-md scale-105'
                    : 'text-[#5D4E37] hover:text-[#F06277] hover:bg-[#FDF2F4]/70 hover:scale-105'
                }`}
              >
                Shop
              </Link>

              <Link
                href="/about"
                className={`relative px-3 lg:px-4 xl:px-5 py-1.5 lg:py-2 rounded-full text-xs lg:text-sm font-bold transition-all duration-250 ${
                  pathname === '/about'
                    ? 'bg-[#EBF7EE] text-[#5E933E] shadow-md scale-105'
                    : 'text-[#5D4E37] hover:text-[#5E933E] hover:bg-[#EBF7EE]/70 hover:scale-105'
                }`}
              >
                About
              </Link>

              <Link
                href="/contact"
                className={`relative px-3 lg:px-4 xl:px-5 py-1.5 lg:py-2 rounded-full text-xs lg:text-sm font-bold transition-all duration-250 ${
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
                className={`relative p-2 sm:p-2.5 rounded-full text-[#5D4E37] bg-white/60 hover:bg-[#FDE8EB] hover:text-[#F27A8A] active:scale-95 transition-all duration-250 focus:outline-none group shadow-sm hover:shadow-md ${
                  isCartBouncing
                    ? 'animate-cart-bounce bg-[#FDE8EB] text-[#F27A8A] ring-2 ring-[#F27A8A]/50 shadow-md'
                    : ''
                }`}
                aria-label={`Shopping Cart with ${cartCount} items`}
              >
                {/* Glowing ripple on Add to Cart */}
                {isCartBouncing && (
                  <span className="absolute -inset-1 rounded-full bg-[#F27A8A]/35 animate-ping pointer-events-none" />
                )}

                <ShoppingBag
                  className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-250 ${
                    isCartBouncing ? 'scale-110 text-[#F27A8A]' : 'group-hover:scale-110'
                  }`}
                  strokeWidth={2.5}
                />
                {cartCount > 0 && (
                  <span
                    className={`absolute -top-1 -right-1 min-w-[16px] h-[16px] sm:min-w-[18px] sm:h-[18px] px-1 text-[8px] sm:text-[9px] font-extrabold bg-gradient-to-br from-[#F27A8A] to-[#e06878] text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white ${
                      isCartBouncing ? 'animate-badge-pop scale-110' : 'animate-pop-in'
                    }`}
                  >
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>

              {/* Auth Buttons - Desktop Only */}
              {isAuthenticated ? (
                <div className="relative hidden md:block" ref={userMenuRef}>
                  {/* Main Trigger Button styled like mobile navbar buttons */}
                  <button
                    type="button"
                    onClick={() => setIsUserMenuOpen((prev) => !prev)}
                    className="flex items-center gap-2 py-1.5 px-3 sm:px-3.5 rounded-full border-2 border-[#D4C4AE] bg-gradient-to-br from-[#FAF3E9] via-[#F7EDDF] to-[#F4E8D5] text-[#5D4E37] hover:bg-[#FDE8EB] hover:text-[#F27A8A] hover:border-[#F27A8A]/40 shadow-xs hover:shadow-md transition-all duration-300 active:scale-95 focus:outline-none cursor-pointer select-none group"
                    aria-expanded={isUserMenuOpen}
                    aria-haspopup="true"
                    aria-label="User Account Menu"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#FFD6E0] to-[#FFC1CC] text-[#F27A8A] border-2 border-white text-xs font-black flex items-center justify-center shadow-xs transition-transform duration-200 group-hover:scale-105">
                      {userInitial}
                    </div>
                    <span className="text-xs sm:text-sm font-extrabold text-[#5D4E37] group-hover:text-[#F27A8A] max-w-[100px] truncate tracking-tight transition-colors">
                      {userName}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-[#7D6E57] group-hover:text-[#F27A8A] transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180 text-[#F27A8A]' : ''}`} />
                  </button>

                  {/* Profile Dropdown styled like Mobile Side Open Bar */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 top-full mt-3 w-64 bg-gradient-to-br from-[#FAF3E9] via-[#F7EDDF] to-[#F4E8D5] shadow-[0_8px_40px_-4px_rgba(30,41,59,0.25)] rounded-[24px] border-2 border-[#D4C4AE] flex flex-col overflow-hidden z-50 origin-top-right animate-dropdown-drawer">
                      {/* 1. Header with Avatar & Details */}
                      <div className="relative px-4 py-3 border-b-2 border-[#D4C4AE]/60 bg-white/80 backdrop-blur-sm flex items-center gap-3 shrink-0 shadow-2xs">
                        {/* Decorative Sparkle */}
                        <div className="absolute top-2 right-3 opacity-40 pointer-events-none animate-twinkle">
                          <Sparkles className="w-3.5 h-3.5 text-[#F6D77A]" />
                        </div>

                        <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#FFD6E0] to-[#FFC1CC] p-1 flex items-center justify-center border-2 border-white shadow-[0_3px_12px_rgba(242,122,138,0.25)] shrink-0">
                          <span className="text-sm font-black text-[#F27A8A]">{userInitial}</span>
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <p className="text-xs font-black text-[#193653] truncate leading-tight">{userName}</p>
                            {isAdmin && (
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-[#8FD3E8]/40 text-[#193653] text-[9px] font-black shrink-0">
                                <Shield className="w-2.5 h-2.5 text-[#1F95B5]" />
                                Admin
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#5D7285] truncate font-medium mt-0.5">{user?.email}</p>
                        </div>
                      </div>

                      {/* 2. Navigation Items */}
                      <div className="p-2.5 space-y-1">
                        <Link
                          href="/account"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-bold text-[#193653] hover:bg-white hover:text-[#F27A8A] hover:shadow-2xs active:scale-[0.98] transition-all duration-200 group"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-xl bg-[#FFD6E0] text-[#F27A8A] flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform duration-200">
                              <User className="w-3.5 h-3.5" />
                            </div>
                            <span>My Profile</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-[#5D7285]/50 group-hover:text-[#F27A8A] group-hover:translate-x-0.5 transition-all duration-200" />
                        </Link>

                        <Link
                          href="/account"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-bold text-[#193653] hover:bg-white hover:text-[#D99A26] hover:shadow-2xs active:scale-[0.98] transition-all duration-200 group"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-xl bg-[#FFF3E6] text-[#D99A26] flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform duration-200">
                              <Package className="w-3.5 h-3.5" />
                            </div>
                            <span>My Orders</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-[#5D7285]/50 group-hover:text-[#D99A26] group-hover:translate-x-0.5 transition-all duration-200" />
                        </Link>

                        <Link
                          href="/wishlist"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-bold text-[#193653] hover:bg-white hover:text-[#F27A8A] hover:shadow-2xs active:scale-[0.98] transition-all duration-200 group"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-xl bg-[#FDE8EB] text-[#F27A8A] flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform duration-200">
                              <Heart className="w-3.5 h-3.5 fill-[#F27A8A]" />
                            </div>
                            <span>My Wishlist</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-[#5D7285]/50 group-hover:text-[#F27A8A] group-hover:translate-x-0.5 transition-all duration-200" />
                        </Link>

                        {isAdmin && (
                          <Link
                            href="/admin"
                            onClick={() => setIsUserMenuOpen(false)}
                            className={`flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-bold transition-all duration-200 active:scale-[0.98] group ${
                              pathname.startsWith('/admin')
                                ? 'bg-[#8FD3E8]/40 text-[#193653] shadow-2xs font-extrabold'
                                : 'bg-[#EBF8FC] text-[#193653] hover:bg-[#8FD3E8]/30'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-xl bg-[#8FD3E8] text-[#193653] flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform duration-200">
                                <Shield className="w-3.5 h-3.5" />
                              </div>
                              <span>Admin Dashboard</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-[#193653]/60 group-hover:translate-x-0.5 transition-transform duration-200" />
                          </Link>
                        )}
                      </div>

                      {/* 3. Bottom Sign Out */}
                      <div className="p-2 border-t-2 border-[#D4C4AE]/60 bg-white/60 backdrop-blur-xs">
                        <button
                          type="button"
                          onClick={handleSignOut}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-bold text-[#DC2626] hover:bg-[#FDE8EB] active:scale-[0.98] transition-all duration-200 group cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-xl bg-[#FDE8EB] text-[#F06277] flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform duration-200">
                              <LogOut className="w-3.5 h-3.5" />
                            </div>
                            <span>Sign Out</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-[#F06277]/40 group-hover:text-[#F06277] group-hover:translate-x-0.5 transition-all duration-200" />
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
