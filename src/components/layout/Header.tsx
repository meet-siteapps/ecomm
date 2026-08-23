'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Search, User } from 'lucide-react';
import { MobileMenu } from './MobileMenu';

interface HeaderProps {
  cartCount?: number;
  userName?: string | null;
  isAdmin?: boolean;
}

export function Header({ cartCount = 0, userName = null, isAdmin = false }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-xs border-b border-gray-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-9 h-9 rounded-xl bg-[#EAF6FF] text-[#4DA3FF] flex items-center justify-center transition-transform group-hover:scale-105 shadow-xs">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg text-[#1F2937] tracking-tight leading-none">
              The Shop
            </span>
            <span className="text-[10px] text-gray-400 font-medium tracking-wide">
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
          {isAdmin && (
            <Link
              href="/admin"
              className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#EAF6FF] text-[#4DA3FF] hover:bg-[#4DA3FF] hover:text-white transition-colors"
            >
              Admin Panel
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
              placeholder="Search products, brands and more..."
              className="w-full bg-[#EAF6FF]/50 hover:bg-[#EAF6FF]/70 text-sm text-[#1F2937] placeholder-gray-400 rounded-xl pl-10 pr-4 py-2 border border-transparent focus:border-[#4DA3FF] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/20 transition-all"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </form>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Cart Button */}
          <Link
            href="/cart"
            className="relative p-2.5 rounded-xl text-[#1F2937] hover:bg-[#EAF6FF] hover:text-[#4DA3FF] transition-colors"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 text-[10px] font-bold bg-[#4DA3FF] text-white rounded-full flex items-center justify-center animate-in zoom-in-75 duration-200">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </Link>

          {/* Account Button */}
          <Link
            href={userName ? '/account' : '/login'}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium text-[#1F2937] hover:bg-[#EAF6FF] hover:text-[#4DA3FF] border border-gray-200 hover:border-[#4DA3FF]/30 transition-all"
          >
            <User className="w-4 h-4 text-[#4DA3FF]" />
            <span>{userName || 'Sign In'}</span>
          </Link>

          {/* Mobile Menu Trigger */}
          <MobileMenu cartCount={cartCount} />
        </div>
      </div>
    </header>
  );
}
