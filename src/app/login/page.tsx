'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShoppingBag, Lock, Mail, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/store/useAuthStore';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect');
  const errorParam = searchParams.get('error');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(
    errorParam === 'confirmation_failed'
      ? 'Email confirmation link was invalid or has expired. Please sign in or reset your password.'
      : null
  );
  const [isLoading, setIsLoading] = useState(false);

  const fetchProfile = useAuthStore((state) => state.fetchProfile);
  const setUser = useAuthStore((state) => state.setUser);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) {
        if (authError.message?.toLowerCase().includes('invalid login credentials')) {
          setError('Invalid email or password. Please check your credentials or create an account.');
        } else {
          setError(authError.message || 'Invalid email or password.');
        }
        setIsLoading(false);
        return;
      }

      if (data.user) {
        setUser(data.user);
        const profile = await fetchProfile(data.user.id);

        // Role-based navigation
        if (redirectTo) {
          router.push(redirectTo);
        } else if (profile?.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/account');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-3xl border border-[#EFE7DE] shadow-cute space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-3xl bg-[#FFEAEF] text-[#FF6B8B] flex items-center justify-center mx-auto shadow-cute-pink">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2D3748] tracking-tight">
            Welcome Back! 👋
          </h1>
          <p className="text-xs sm:text-sm text-[#718096] font-medium">
            Enter your credentials to access your Baby Ladoo account
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-[#FFEAEF] border border-[#FF6B8B]/30 text-[#E11D48] text-xs font-bold flex items-start gap-2.5 animate-in fade-in-50">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#FF6B8B]" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#2D3748] uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                suppressHydrationWarning
                className="w-full bg-[#FAF7F2] text-sm text-[#2D3748] placeholder-gray-400 rounded-2xl pl-10 pr-4 py-3 border border-[#EFE7DE] focus:border-[#FF6B8B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B8B]/20 transition-all font-medium"
              />
              <Mail className="w-4 h-4 text-[#A0AEC0] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#2D3748] uppercase tracking-wider">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs font-bold text-[#FF6B8B] hover:underline"
              >
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                suppressHydrationWarning
                className="w-full bg-[#FAF7F2] text-sm text-[#2D3748] placeholder-gray-400 rounded-2xl pl-10 pr-4 py-3 border border-[#EFE7DE] focus:border-[#FF6B8B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B8B]/20 transition-all font-medium"
              />
              <Lock className="w-4 h-4 text-[#A0AEC0] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 px-4 rounded-full bg-[#FF6B8B] hover:bg-[#FA5578] active:scale-98 text-white text-sm font-extrabold flex items-center justify-center gap-2 transition-all shadow-cute-pink disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="pt-4 border-t border-[#EFE7DE] text-center text-xs text-[#718096] font-medium">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-extrabold text-[#FF6B8B] hover:underline">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-gray-500">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
