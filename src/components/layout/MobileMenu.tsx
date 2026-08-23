'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ShoppingBag, Search, User, Home, Grid } from 'lucide-react';

interface MobileMenuProps {
  cartCount?: number;
}

export function MobileMenu({ cartCount = 0 }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
      setIsOpen(false);
    }
  };

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-xl text-gray-700 hover:bg-[#EAF6FF] transition-colors"
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6 text-[#1F2937]" />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-[280px] sm:w-[320px] bg-white shadow-xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 font-bold text-lg text-[#1F2937]"
          >
            <div className="w-8 h-8 rounded-xl bg-[#EAF6FF] flex items-center justify-center text-[#4DA3FF]">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <span>The Shop</span>
          </Link>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-[#1F2937]" />
          </button>
        </div>

        {/* Search in Mobile Drawer */}
        <div className="p-4 border-b border-gray-100">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-[#EAF6FF]/60 text-sm text-[#1F2937] placeholder-gray-400 rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/40 border border-transparent focus:border-[#4DA3FF]"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </form>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#1F2937] hover:bg-[#EAF6FF] hover:text-[#4DA3FF] transition-colors"
          >
            <Home className="w-4 h-4" />
            Home
          </Link>
          <Link
            href="/products"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#1F2937] hover:bg-[#EAF6FF] hover:text-[#4DA3FF] transition-colors"
          >
            <Grid className="w-4 h-4" />
            All Products
          </Link>
          <Link
            href="/cart"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-[#1F2937] hover:bg-[#EAF6FF] hover:text-[#4DA3FF] transition-colors"
          >
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-4 h-4" />
              Cart
            </div>
            {cartCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-semibold bg-[#4DA3FF] text-white rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-100 bg-[#EAF6FF]/30">
          <Link
            href="/login"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-[#4DA3FF] hover:bg-[#2B8BE6] text-white text-sm font-medium transition-colors shadow-xs"
          >
            <User className="w-4 h-4" />
            Account / Sign In
          </Link>
        </div>
      </aside>
    </div>
  );
}
