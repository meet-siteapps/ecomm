'use client';

import { useState, useEffect, useCallback, useSyncExternalStore, useRef } from 'react';
import { createPortal } from 'react-dom';
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
        className="p-2 sm:p-2.5 rounded-full text-[#5D4E37] bg-white/60 hover:bg-[#FDE8EB] hover:text-[#F27A8A] active:scale-90 transition-all duration-200 focus:outline-none shadow-sm"
        aria-label="Open mobile navigation menu"
        aria-expanded={isOpen}
      >
        <Menu className="w-5 h-5 sm:w-5 sm:h-5 text-current" strokeWidth={2.5} />
      </button>

      {/* Mobile Drawer Modal - Opens from exact hamburger button position in top-right */}
      {mounted && isOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex justify-end items-start pt-[14px] sm:pt-[16px] lg:pt-[16px] pr-[16px] sm:pr-[24px] lg:pr-[36px] pb-6 pl-4">
          {/* Backdrop (dark overlay with smooth fade) */}
          <div
            className={`fixed inset-0 bg-[#1E293B]/50 backdrop-blur-sm transition-all duration-400 ease-out ${
              isClosing ? 'opacity-0' : 'opacity-100'
            }`}
            onClick={closeMenu}
            aria-hidden="true"
          />

          {/* Slide-in Drawer Panel - animates from hamburger button position */}
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Navigation Menu"
            className={`relative z-10 w-[280px] sm:w-[320px] max-h-[calc(100vh-80px)] bg-gradient-to-br from-[#FAF3E9] via-[#F7EDDF] to-[#F4E8D5] shadow-[0_8px_40px_-4px_rgba(30,41,59,0.25)] flex flex-col overflow-hidden rounded-[24px] sm:rounded-[28px] border-2 border-[#D4C4AE] transition-all duration-400 ease-out origin-top-right ${
              isClosing ? 'translate-x-12 -translate-y-12 opacity-0 scale-75' : 'translate-x-0 translate-y-0 opacity-100 scale-100'
            }`}
          >
            {/* 1. Header with Brand & Polished Close Button (Sticky top) */}
            <div className="relative px-4 py-3 border-b-2 border-[#D4C4AE]/60 bg-white/80 backdrop-blur-sm shrink-0 flex items-center justify-between shadow-sm z-20">
              {/* Subtle Decorative Sparkle */}
              <div className="absolute top-2 right-12 opacity-35 pointer-events-none animate-twinkle">
                <Sparkles className="w-3.5 h-3.5 text-[#F6D77A]" />
              </div>

              <Link
                href="/"
                onClick={closeMenu}
                className="flex items-center gap-2 group focus:outline-none"
              >
                <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-[#FFD6E0] to-[#FFC1CC] p-1.5 flex items-center justify-center border-2 border-white shadow-[0_3px_12px_rgba(242,122,138,0.25)] transition-all duration-300 group-hover:scale-105 group-hover:rotate-3">
                  <CuteTeddyLogo className="w-full h-full" />
                </div>

                {/* Colorful letters for Baby Ladoo - smaller text */}
                <div className="flex items-baseline font-black text-base tracking-tight select-none">
                  <span className="text-[#F27A8A]">B</span>
                  <span className="text-[#D99A26]">a</span>
                  <span className="text-[#1F95B5]">b</span>
                  <span className="text-[#5E933E]">y</span>
                  <span className="w-1 inline-block"></span>
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
                className="w-8 h-8 rounded-full border-2 border-[#D4C4AE] bg-white/90 text-[#5D4E37] hover:bg-[#FDE8EB] hover:text-[#F27A8A] hover:border-[#F27A8A]/40 flex items-center justify-center transition-all duration-300 active:scale-90 shadow-sm hover:shadow-md"
                aria-label="Close navigation menu"
              >
                <X className="w-4 h-4 text-current" strokeWidth={2.5} />
              </button>
            </div>

            {/* 2. Unified Scrollable Menu Body (Nav + Bottom Auth in single scroll stream) */}
            <div
              className="flex-1 min-h-0 overflow-y-auto overscroll-contain scrollbar-thin"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              <div className="min-h-full flex flex-col justify-between">
                {/* Navigation Items */}
                <div className="px-3 py-3 space-y-2">
                  {/* Main Navigation Group */}
                  <div className="space-y-1.5">
                    {/* Home Item */}
                    <div className="animate-stagger-item" style={{ animationDelay: '60ms' }}>
                      <Link
                        href="/"
                        onClick={closeMenu}
                        className={`flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-bold transition-all duration-200 active:scale-[0.98] ${
                          pathname === '/'
                            ? 'bg-[#FFD6E0] text-[#F27A8A] shadow-2xs font-extrabold ring-1 ring-[#F27A8A]/30'
                            : 'text-[#193653] hover:bg-white hover:text-[#F27A8A] hover:shadow-2xs'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-xl bg-[#FFD6E0] text-[#F27A8A] flex items-center justify-center shrink-0 shadow-2xs">
                            <Home className="w-3.5 h-3.5" />
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
                        className={`flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-bold transition-all duration-200 active:scale-[0.98] ${
                          pathname.startsWith('/products')
                            ? 'bg-[#FFD6E0] text-[#F27A8A] shadow-2xs font-extrabold ring-1 ring-[#F27A8A]/30'
                            : 'text-[#193653] hover:bg-white hover:text-[#F27A8A] hover:shadow-2xs'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-xl bg-[#FFF3E6] text-[#D99A26] flex items-center justify-center shrink-0 shadow-2xs">
                            <ShoppingBag className="w-3.5 h-3.5" />
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
                        className={`flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-bold transition-all duration-200 active:scale-[0.98] ${
                          pathname === '/about'
                            ? 'bg-[#FFD6E0] text-[#F27A8A] shadow-2xs font-extrabold ring-1 ring-[#F27A8A]/30'
                            : 'text-[#193653] hover:bg-white hover:text-[#F27A8A] hover:shadow-2xs'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-xl bg-[#FFE8A3] text-[#B88714] flex items-center justify-center shrink-0 shadow-2xs">
                            <Info className="w-3.5 h-3.5" />
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
                        className={`flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-bold transition-all duration-200 active:scale-[0.98] ${
                          pathname === '/contact'
                            ? 'bg-[#FFD6E0] text-[#F27A8A] shadow-2xs font-extrabold ring-1 ring-[#F27A8A]/30'
                            : 'text-[#193653] hover:bg-white hover:text-[#F27A8A] hover:shadow-2xs'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-xl bg-[#D7F5E8] text-[#3D8F68] flex items-center justify-center shrink-0 shadow-2xs">
                            <Phone className="w-3.5 h-3.5" />
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
                    <div className="w-full border-t-2 border-[#D4C4AE]/40" />
                    <div className="absolute bg-gradient-to-br from-[#FAF3E9] via-[#F7EDDF] to-[#F4E8D5] px-2 text-[#F27A8A] text-sm select-none">
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
                        className={`flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-bold transition-all duration-200 active:scale-[0.98] ${
                          pathname === '/account'
                            ? 'bg-[#FFD6E0] text-[#F27A8A] shadow-2xs font-extrabold ring-1 ring-[#F27A8A]/30'
                            : 'text-[#193653] hover:bg-white hover:text-[#F27A8A] hover:shadow-2xs'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-xl bg-[#D7F5E8] text-[#3D8F68] flex items-center justify-center shrink-0 shadow-2xs">
                            <User className="w-3.5 h-3.5" />
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
                          className="flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-bold text-[#193653] hover:bg-white hover:text-[#F27A8A] hover:shadow-2xs transition-all duration-200 active:scale-[0.98]"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-xl bg-[#FFE8A3] text-[#B88714] flex items-center justify-center shrink-0 shadow-2xs">
                              <Package className="w-3.5 h-3.5" />
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
                        className={`flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-bold transition-all duration-200 active:scale-[0.98] ${
                          pathname === '/wishlist'
                            ? 'bg-[#FFD6E0] text-[#F27A8A] shadow-2xs font-extrabold ring-1 ring-[#F27A8A]/30'
                            : 'text-[#193653] hover:bg-white hover:text-[#F27A8A] hover:shadow-2xs'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-xl bg-[#FDE8EB] text-[#F27A8A] flex items-center justify-center shrink-0 shadow-2xs">
                            <Heart className="w-3.5 h-3.5 fill-[#F27A8A]" />
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
                        className={`flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-bold transition-all duration-200 active:scale-[0.98] ${
                          pathname === '/cart'
                            ? 'bg-[#FFD6E0] text-[#F27A8A] shadow-2xs font-extrabold ring-1 ring-[#F27A8A]/30'
                            : 'text-[#193653] hover:bg-white hover:text-[#F27A8A] hover:shadow-2xs'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-xl bg-[#DDEBFF] text-[#287DB2] flex items-center justify-center shrink-0 shadow-2xs">
                            <ShoppingBag className="w-3.5 h-3.5" />
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
                          className={`flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-bold transition-all duration-200 active:scale-[0.98] ${
                            pathname.startsWith('/admin')
                              ? 'bg-[#8FD3E8]/40 text-[#193653] shadow-2xs font-extrabold'
                              : 'bg-[#EBF8FC] text-[#193653] hover:bg-[#8FD3E8]/30'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-xl bg-[#8FD3E8] text-[#193653] flex items-center justify-center shrink-0 shadow-2xs">
                              <Shield className="w-3.5 h-3.5" />
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
                      className="block p-2.5 rounded-2xl bg-gradient-to-r from-[#FFF3E6] via-[#FAF4EE] to-[#FFF3E6] border border-[#F27A8A]/25 hover:border-[#F27A8A]/50 transition-all duration-300 shadow-2xs hover:shadow-cute group active:scale-[0.98]"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-xl bg-[#FDE8EB] text-[#F27A8A] flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform duration-200">
                            <Gift className="w-3.5 h-3.5" />
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

                {/* 3. Bottom Auth Section: with generous bottom padding */}
                <div className="relative p-3 border-t-2 border-[#D4C4AE]/60 bg-white/80 backdrop-blur-sm shrink-0 overflow-hidden shadow-sm mt-4 pb-12 sm:pb-8">
                  {/* Peeking Cute Teddy Bear Mascot in Bottom-Right Corner */}
                  <div className="absolute -bottom-2 -right-2 pointer-events-none opacity-80 z-0">
                    <CuteSittingTeddyIllustration className="w-20 h-20 sm:w-24 sm:h-24" />
                  </div>

                  <div className="relative z-10 pr-14 animate-stagger-item" style={{ animationDelay: '460ms' }}>
                    {isAuthenticated ? (
                      <div className="space-y-2">
                        {/* User Profile Card */}
                        <div className="flex items-center gap-2 pb-1">
                          <div className="w-8 h-8 rounded-full bg-[#FFD6E0] text-[#F27A8A] font-extrabold text-xs flex items-center justify-center shadow-sm shrink-0">
                            {userInitial}
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-[11px] font-extrabold text-[#3D2E17] truncate">
                              {userName}
                            </p>
                            <p className="text-[9px] text-[#7D6E57] truncate font-medium">
                              {user?.email}
                            </p>
                          </div>
                        </div>

                        {/* Sign Out Button */}
                        <button
                          type="button"
                          onClick={handleSignOut}
                          className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-full bg-white hover:bg-[#FDE8EB] border-2 border-[#F27A8A]/40 text-[#F27A8A] text-xs font-extrabold shadow-sm hover:shadow-md active:scale-95 transition-all duration-300"
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
                          className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full bg-[#F06277] hover:bg-[#D9455B] text-white text-xs font-extrabold shadow-[0_3px_14px_-2px_rgba(240,98,119,0.5)] hover:shadow-[0_5px_20px_-2px_rgba(240,98,119,0.6)] active:scale-95 transition-all duration-300"
                        >
                          <LogIn className="w-3.5 h-3.5" />
                          <span>Sign In</span>
                        </Link>

                        {/* Create Account Link */}
                        <p className="text-[10px] text-center text-[#7D6E57] font-medium pt-0.5">
                          New here?{' '}
                          <Link
                            href="/register"
                            onClick={closeMenu}
                            className="text-[#F06277] font-extrabold hover:underline"
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
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
