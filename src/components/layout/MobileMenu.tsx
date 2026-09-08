'use client';

import { useState, useEffect, useCallback, useSyncExternalStore, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Menu,
  X,
  ShoppingBag,
  User,
  Home,
  Shield,
  Info,
  Phone,
  LogOut,
  LogIn,
  Gift,
  ChevronRight,
  Package,
  Heart,
  Sparkles,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { CuteTeddyLogo, CuteSittingTeddyIllustration } from '@/components/common/CartoonIllustrations';

const emptySubscribe = () => () => {};

interface MobileMenuProps {
  cartCount?: number;
}

export function MobileMenu({ cartCount = 0 }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);

  const pathname = usePathname();
  const router = useRouter();

  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);
  const signOut = useAuthStore((state) => state.signOut);

  // Smooth exit transition before unmounting
  const closeMenu = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    closeTimerRef.current = setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 320);
  }, [isClosing]);

  const openMenu = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }
    setIsClosing(false);
    setIsOpen(true);
  };

  // Lock body scroll when drawer is open & handle ESC key
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          closeMenu();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen, closeMenu]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  const isAuthenticated = mounted && Boolean(user);
  const isAdmin = mounted && profile?.role === 'admin';
  const userName = profile?.name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'Parent';
  const userInitial = (userName || 'U').charAt(0).toUpperCase();

  const handleSignOut = async () => {
    await signOut();
    closeMenu();
    router.push('/login');
  };

  return (
    <div className="md:hidden">
      {/* Mobile Hamburger Trigger Button with Soft Pastel Feedback */}
      <button
        type="button"
        onClick={openMenu}
        className="p-2 sm:p-2.5 rounded-full text-[#193653] hover:bg-[#FDE8EB] hover:text-[#F27A8A] active:scale-90 transition-all duration-200 focus:outline-none"
        aria-label="Open mobile navigation menu"
        aria-expanded={isOpen}
      >
        <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-current" />
      </button>

      {/* Mobile Drawer Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Soft Blurred / Translucent Pastel Overlay */}
          <div
            className={`fixed inset-0 bg-[#193653]/35 backdrop-blur-sm transition-all duration-300 ${
              isClosing ? 'animate-backdrop-out' : 'animate-backdrop-in'
            }`}
            onClick={closeMenu}
            aria-hidden="true"
          />

          {/* Smooth Right-to-Left Slide Drawer Panel */}
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Navigation Menu"
            className={`relative z-10 w-full max-w-[320px] sm:max-w-[340px] h-screen h-[100dvh] bg-[#FAF4EE] shadow-2xl flex flex-col justify-between overflow-hidden border-l border-[#EFE4D6] ${
              isClosing ? 'animate-drawer-out' : 'animate-drawer-in'
            }`}
          >
            {/* 1. Header with Brand & Polished Close Button */}
            <div className="relative px-5 py-4 border-b border-[#EFE4D6] bg-white shrink-0 flex items-center justify-between shadow-2xs">
              {/* Subtle Decorative Sparkle */}
              <div className="absolute top-2 right-16 opacity-35 pointer-events-none animate-twinkle">
                <Sparkles className="w-4 h-4 text-[#F6D77A]" />
              </div>

              <Link
                href="/"
                onClick={closeMenu}
                className="flex items-center gap-2.5 group focus:outline-none"
              >
                <div className="w-9 h-9 rounded-2xl bg-[#FFD6E0] p-1 flex items-center justify-center border border-[#F27A8A]/30 shadow-2xs transition-transform duration-300 group-hover:scale-105 group-hover:rotate-2">
                  <CuteTeddyLogo className="w-full h-full" />
                </div>

                {/* Colorful letters for Baby Ladoo */}
                <div className="flex items-baseline font-black text-lg tracking-tight select-none">
                  <span className="text-[#F27A8A]">B</span>
                  <span className="text-[#D99A26]">a</span>
                  <span className="text-[#1F95B5]">b</span>
                  <span className="text-[#5E933E]">y</span>
                  <span className="w-1.5 inline-block"></span>
                  <span className="text-[#F27A8A]">L</span>
                  <span className="text-[#D99A26]">a</span>
                  <span className="text-[#1F95B5]">d</span>
                  <span className="text-[#5E933E]">o</span>
                  <span className="text-[#F27A8A]">o</span>
                </div>
              </Link>

              {/* Polished Close Button */}
              <button
                type="button"
                onClick={closeMenu}
                className="w-8 h-8 rounded-full border border-[#EFE4D6] bg-[#FAF4EE] text-[#5D7285] hover:bg-[#FFD6E0] hover:text-[#F27A8A] hover:border-[#F27A8A]/40 flex items-center justify-center transition-all duration-200 active:scale-90 shadow-2xs"
                aria-label="Close navigation menu"
              >
                <X className="w-4 h-4 text-current" />
              </button>
            </div>

            {/* 2. Scrollable Menu Body with Staggered Slide Entrances */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2 scrollbar-thin">
              {/* Main Navigation Group */}
              <div className="space-y-1.5">
                {/* Home Item */}
                <div className="animate-stagger-item" style={{ animationDelay: '60ms' }}>
                  <Link
                    href="/"
                    onClick={closeMenu}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 active:scale-[0.98] ${
                      pathname === '/'
                        ? 'bg-[#FFD6E0] text-[#F27A8A] shadow-2xs font-extrabold ring-1 ring-[#F27A8A]/30'
                        : 'text-[#193653] hover:bg-white hover:text-[#F27A8A] hover:shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#FFD6E0] text-[#F27A8A] flex items-center justify-center shrink-0 shadow-2xs">
                        <Home className="w-4 h-4" />
                      </div>
                      <span>Home</span>
                    </div>
                    {pathname === '/' && (
                      <span className="text-sm select-none text-[#E0B538] animate-pop-in">★</span>
                    )}
                  </Link>
                </div>

                {/* Shop Item */}
                <div className="animate-stagger-item" style={{ animationDelay: '100ms' }}>
                  <Link
                    href="/products"
                    onClick={closeMenu}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 active:scale-[0.98] ${
                      pathname.startsWith('/products')
                        ? 'bg-[#FFD6E0] text-[#F27A8A] shadow-2xs font-extrabold ring-1 ring-[#F27A8A]/30'
                        : 'text-[#193653] hover:bg-white hover:text-[#F27A8A] hover:shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#FFF3E6] text-[#D99A26] flex items-center justify-center shrink-0 shadow-2xs">
                        <ShoppingBag className="w-4 h-4" />
                      </div>
                      <span>Shop</span>
                    </div>
                    {pathname.startsWith('/products') && (
                      <span className="text-sm select-none text-[#E0B538] animate-pop-in">★</span>
                    )}
                  </Link>
                </div>

                {/* About Us Item */}
                <div className="animate-stagger-item" style={{ animationDelay: '140ms' }}>
                  <Link
                    href="/about"
                    onClick={closeMenu}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 active:scale-[0.98] ${
                      pathname === '/about'
                        ? 'bg-[#FFD6E0] text-[#F27A8A] shadow-2xs font-extrabold ring-1 ring-[#F27A8A]/30'
                        : 'text-[#193653] hover:bg-white hover:text-[#F27A8A] hover:shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#FFE8A3] text-[#B88714] flex items-center justify-center shrink-0 shadow-2xs">
                        <Info className="w-4 h-4" />
                      </div>
                      <span>About Us</span>
                    </div>
                    {pathname === '/about' && (
                      <span className="text-sm select-none text-[#E0B538] animate-pop-in">★</span>
                    )}
                  </Link>
                </div>

                {/* Contact Us Item */}
                <div className="animate-stagger-item" style={{ animationDelay: '180ms' }}>
                  <Link
                    href="/contact"
                    onClick={closeMenu}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 active:scale-[0.98] ${
                      pathname === '/contact'
                        ? 'bg-[#FFD6E0] text-[#F27A8A] shadow-2xs font-extrabold ring-1 ring-[#F27A8A]/30'
                        : 'text-[#193653] hover:bg-white hover:text-[#F27A8A] hover:shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#D7F5E8] text-[#3D8F68] flex items-center justify-center shrink-0 shadow-2xs">
                        <Phone className="w-4 h-4" />
                      </div>
                      <span>Contact Us</span>
                    </div>
                    {pathname === '/contact' && (
                      <span className="text-sm select-none text-[#E0B538] animate-pop-in">★</span>
                    )}
                  </Link>
                </div>
              </div>

              {/* Heart Divider */}
              <div className="relative py-2 flex items-center justify-center animate-stagger-item" style={{ animationDelay: '220ms' }}>
                <div className="w-full border-t border-[#EFE4D6]" />
                <div className="absolute bg-[#FAF4EE] px-2 text-[#F27A8A] text-xs select-none">
                  ♡
                </div>
              </div>

              {/* Account & Shopping Group */}
              <div className="space-y-1.5">
                {/* My Account */}
                <div className="animate-stagger-item" style={{ animationDelay: '260ms' }}>
                  <Link
                    href={isAuthenticated ? '/account' : '/login'}
                    onClick={closeMenu}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 active:scale-[0.98] ${
                      pathname === '/account'
                        ? 'bg-[#FFD6E0] text-[#F27A8A] shadow-2xs font-extrabold ring-1 ring-[#F27A8A]/30'
                        : 'text-[#193653] hover:bg-white hover:text-[#F27A8A] hover:shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#D7F5E8] text-[#3D8F68] flex items-center justify-center shrink-0 shadow-2xs">
                        <User className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <span className="block">My Account</span>
                        {isAuthenticated && (
                          <span className="text-[10px] text-[#5D7285] block font-normal -mt-0.5 truncate max-w-[130px]">
                            {userName}
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#5D7285]/50" />
                  </Link>
                </div>

                {/* My Orders (When Logged In) */}
                {isAuthenticated && (
                  <div className="animate-stagger-item" style={{ animationDelay: '300ms' }}>
                    <Link
                      href="/account"
                      onClick={closeMenu}
                      className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold text-[#193653] hover:bg-white hover:text-[#F27A8A] hover:shadow-2xs transition-all duration-200 active:scale-[0.98]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-[#FFE8A3] text-[#B88714] flex items-center justify-center shrink-0 shadow-2xs">
                          <Package className="w-4 h-4" />
                        </div>
                        <span>My Orders</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#5D7285]/50" />
                    </Link>
                  </div>
                )}

                {/* Wishlist Link */}
                <div className="animate-stagger-item" style={{ animationDelay: '320ms' }}>
                  <Link
                    href="/wishlist"
                    onClick={closeMenu}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 active:scale-[0.98] ${
                      pathname === '/wishlist'
                        ? 'bg-[#FFD6E0] text-[#F27A8A] shadow-2xs font-extrabold ring-1 ring-[#F27A8A]/30'
                        : 'text-[#193653] hover:bg-white hover:text-[#F27A8A] hover:shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#FDE8EB] text-[#F27A8A] flex items-center justify-center shrink-0 shadow-2xs">
                        <Heart className="w-4 h-4 fill-[#F27A8A]" />
                      </div>
                      <span>Wishlist</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#5D7285]/50" />
                  </Link>
                </div>

                {/* Cart with Live Badge */}
                <div className="animate-stagger-item" style={{ animationDelay: '360ms' }}>
                  <Link
                    href="/cart"
                    onClick={closeMenu}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 active:scale-[0.98] ${
                      pathname === '/cart'
                        ? 'bg-[#FFD6E0] text-[#F27A8A] shadow-2xs font-extrabold ring-1 ring-[#F27A8A]/30'
                        : 'text-[#193653] hover:bg-white hover:text-[#F27A8A] hover:shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#DDEBFF] text-[#287DB2] flex items-center justify-center shrink-0 shadow-2xs">
                        <ShoppingBag className="w-4 h-4" />
                      </div>
                      <span>Cart</span>
                    </div>
                    {cartCount > 0 ? (
                      <span className="min-w-[20px] h-[20px] px-1.5 rounded-full bg-[#F27A8A] text-white text-[11px] font-extrabold flex items-center justify-center shadow-cute-pink">
                        {cartCount}
                      </span>
                    ) : (
                      <ChevronRight className="w-4 h-4 text-[#5D7285]/50" />
                    )}
                  </Link>
                </div>

                {/* Admin Dashboard (When Admin) */}
                {isAdmin && (
                  <div className="animate-stagger-item" style={{ animationDelay: '380ms' }}>
                    <Link
                      href="/admin"
                      onClick={closeMenu}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 active:scale-[0.98] ${
                        pathname.startsWith('/admin')
                          ? 'bg-[#8FD3E8]/40 text-[#193653] shadow-2xs font-extrabold'
                          : 'bg-[#EBF8FC] text-[#193653] hover:bg-[#8FD3E8]/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-[#8FD3E8] text-[#193653] flex items-center justify-center shrink-0 shadow-2xs">
                          <Shield className="w-4 h-4" />
                        </div>
                        <span>Admin Dashboard</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#193653]/60" />
                    </Link>
                  </div>
                )}
              </div>

              {/* Special Promo Card */}
              <div className="pt-2 animate-stagger-item" style={{ animationDelay: '420ms' }}>
                <Link
                  href="/products?sort=discount"
                  onClick={closeMenu}
                  className="block p-3 rounded-2xl bg-gradient-to-r from-[#FFF3E6] via-[#FAF4EE] to-[#FFF3E6] border border-[#F27A8A]/25 hover:border-[#F27A8A]/50 transition-all duration-300 shadow-2xs hover:shadow-cute group active:scale-[0.98]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-[#FDE8EB] text-[#F27A8A] flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform duration-200">
                        <Gift className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-black text-[#F27A8A] block leading-tight">
                          Special for you!
                        </span>
                        <span className="text-[11px] text-[#5D7285] block font-medium leading-tight">
                          Cute finds for your little one
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#F27A8A] group-hover:translate-x-1 transition-transform duration-200 shrink-0" />
                  </div>
                </Link>
              </div>
            </div>

            {/* 3. Bottom Auth Section with Peeking Cute Mascot */}
            <div className="relative p-4 border-t border-[#EFE4D6] bg-white shrink-0 overflow-hidden shadow-cute">
              {/* Peeking Cute Teddy Bear Mascot in Bottom-Right Corner */}
              <div className="absolute -bottom-2 -right-2 pointer-events-none opacity-90 z-0">
                <CuteSittingTeddyIllustration className="w-24 h-24 sm:w-28 sm:h-28" />
              </div>

              <div className="relative z-10 pr-16 animate-stagger-item" style={{ animationDelay: '460ms' }}>
                {isAuthenticated ? (
                  <div className="space-y-2">
                    {/* User Profile Card */}
                    <div className="flex items-center gap-2.5 pb-1">
                      <div className="w-8 h-8 rounded-full bg-[#FFD6E0] text-[#F27A8A] font-extrabold text-xs flex items-center justify-center shadow-2xs shrink-0">
                        {userInitial}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs font-extrabold text-[#193653] truncate">
                          {userName}
                        </p>
                        <p className="text-[10px] text-[#5D7285] truncate font-medium">
                          {user?.email}
                        </p>
                      </div>
                    </div>

                    {/* Sign Out Button */}
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-full bg-[#FAF4EE] hover:bg-[#FDE8EB] border border-[#F27A8A]/30 text-[#F27A8A] text-xs font-extrabold shadow-2xs hover:shadow-cute active:scale-95 transition-all duration-200"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {/* Rounded Coral-Pink Sign In Button */}
                    <Link
                      href="/login"
                      onClick={closeMenu}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[#F27A8A] hover:bg-[#e06878] text-white text-xs font-extrabold shadow-cute-pink hover:shadow-cute-pink-hover active:scale-95 transition-all duration-200"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Sign In</span>
                    </Link>

                    {/* Create Account Link */}
                    <p className="text-[11px] text-center text-[#5D7285] font-medium pt-0.5">
                      New here?{' '}
                      <Link
                        href="/register"
                        onClick={closeMenu}
                        className="text-[#F27A8A] font-extrabold hover:underline"
                      >
                        Create an account
                      </Link>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
