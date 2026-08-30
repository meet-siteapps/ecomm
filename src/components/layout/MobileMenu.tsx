'use client';

import { useState, useEffect, useCallback, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  ShoppingBag,
  User,
  Home,
  Shield,
  Heart,
  HelpCircle,
  Phone,
  LogOut,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { CuteTeddyLogo } from '@/components/common/CartoonIllustrations';

const emptySubscribe = () => () => {};

interface MobileMenuProps {
  cartCount?: number;
}

export function MobileMenu({ cartCount = 0 }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);
  const signOut = useAuthStore((state) => state.signOut);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

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

  const isAuthenticated = mounted && Boolean(user);
  const isAdmin = mounted && profile?.role === 'admin';

  const handleSignOut = async () => {
    await signOut();
    closeMenu();
  };

  return (
    <div className="md:hidden">
      {/* Mobile Hamburger Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-full text-[#193653] hover:bg-[#FDE8EB] hover:text-[#F27A8A] active:scale-95 transition-all focus:outline-none"
        aria-label="Open mobile navigation menu"
        aria-expanded={isOpen}
      >
        <Menu className="w-6 h-6 text-current" />
      </button>

      {/* Mobile Drawer Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[#193653]/40 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
            onClick={closeMenu}
            aria-hidden="true"
          />

          {/* Slide-in Drawer */}
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Navigation Menu"
            className="relative z-10 w-full max-w-[300px] h-screen h-[100dvh] bg-[#FAF4EE] shadow-2xl flex flex-col justify-between overflow-hidden border-l border-[#EFE4D6] animate-in slide-in-from-right duration-300 ease-out"
          >
            {/* Top Bar with Brand & Close Button */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#EFE4D6] bg-white shrink-0">
              <Link
                href="/"
                onClick={closeMenu}
                className="flex items-center gap-2 group focus:outline-none"
              >
                <div className="w-8 h-8 rounded-xl bg-[#FDE8EB] p-1 flex items-center justify-center border border-[#F27A8A]/30">
                  <CuteTeddyLogo className="w-full h-full" />
                </div>
                {/* Colorful letters for Baby Ladoo */}
                <div className="flex items-baseline font-black text-base tracking-tight select-none">
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

              <button
                type="button"
                onClick={closeMenu}
                className="p-1.5 rounded-full text-[#5D7285] hover:bg-[#FDE8EB] hover:text-[#F27A8A] transition-all"
                aria-label="Close navigation menu"
              >
                <X className="w-5 h-5 text-current" />
              </button>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1.5">
              {/* Home */}
              <Link
                href="/"
                onClick={closeMenu}
                className={`flex items-center justify-between px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                  pathname === '/'
                    ? 'bg-[#FDE8EB] text-[#F27A8A]'
                    : 'text-[#193653] hover:bg-white hover:text-[#F27A8A]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Home className="w-4 h-4 text-[#F27A8A]" />
                  <span>Home</span>
                </div>
              </Link>

              {/* Shop */}
              <Link
                href="/products"
                onClick={closeMenu}
                className={`flex items-center justify-between px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                  pathname.startsWith('/products')
                    ? 'bg-[#FDE8EB] text-[#F27A8A]'
                    : 'text-[#193653] hover:bg-white hover:text-[#F27A8A]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-4 h-4 text-[#193653]" />
                  <span>Shop</span>
                </div>
              </Link>

              {/* About Us */}
              <Link
                href="/about"
                onClick={closeMenu}
                className={`flex items-center justify-between px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                  pathname === '/about'
                    ? 'bg-[#FDE8EB] text-[#F27A8A]'
                    : 'text-[#193653] hover:bg-white hover:text-[#F27A8A]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-4 h-4 text-[#193653]" />
                  <span>About Us</span>
                </div>
              </Link>

              {/* Contact Us */}
              <Link
                href="/contact"
                onClick={closeMenu}
                className={`flex items-center justify-between px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                  pathname === '/contact'
                    ? 'bg-[#FDE8EB] text-[#F27A8A]'
                    : 'text-[#193653] hover:bg-white hover:text-[#F27A8A]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#193653]" />
                  <span>Contact Us</span>
                </div>
              </Link>

              {/* Divider */}
              <div className="my-2 border-t border-[#EFE4D6]" />

              {/* My Account */}
              <Link
                href={isAuthenticated ? '/account' : '/login'}
                onClick={closeMenu}
                className="flex items-center justify-between px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold text-[#193653] hover:bg-white hover:text-[#F27A8A] transition-all"
              >
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-[#193653]" />
                  <span>My Account</span>
                </div>
              </Link>

              {/* Wishlist */}
              <Link
                href="/products?sort=featured"
                onClick={closeMenu}
                className="flex items-center justify-between px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold text-[#193653] hover:bg-white hover:text-[#F27A8A] transition-all"
              >
                <div className="flex items-center gap-3">
                  <Heart className="w-4 h-4 text-[#193653]" />
                  <span>Wishlist</span>
                </div>
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                onClick={closeMenu}
                className="flex items-center justify-between px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold text-[#193653] hover:bg-white hover:text-[#F27A8A] transition-all"
              >
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-4 h-4 text-[#193653]" />
                  <span>Cart</span>
                </div>
                {cartCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#F27A8A] text-white text-[10px] font-extrabold flex items-center justify-center shadow-cute-pink">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Admin Panel */}
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={closeMenu}
                  className="flex items-center justify-between px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold bg-[#8FD3E8]/30 text-[#193653] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <Shield className="w-4 h-4" />
                    <span>Admin Panel</span>
                  </div>
                </Link>
              )}
            </div>

            {/* Bottom Account Trigger */}
            <div className="p-4 border-t border-[#EFE4D6] bg-white shrink-0">
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#FAF4EE] border border-red-200 text-red-600 text-xs font-bold shadow-2xs hover:bg-red-50 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#F27A8A] hover:bg-[#e06878] text-white text-xs font-extrabold shadow-cute-pink transition-all"
                >
                  <User className="w-4 h-4" />
                  <span>Sign In</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
