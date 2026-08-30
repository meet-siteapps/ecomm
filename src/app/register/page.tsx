'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Lock, Mail, User, Phone, AlertCircle, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/store/useAuthStore';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const fetchProfile = useAuthStore((state) => state.fetchProfile);
  const setUser = useAuthStore((state) => state.setUser);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      setIsLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            name: name.trim(),
            phone: phone.trim(),
            role: 'customer',
          },
          emailRedirectTo: origin ? `${origin}/auth/callback?next=/account` : undefined,
        },
      });

      if (signUpError) {
        if (
          signUpError.message?.toLowerCase().includes('already registered') ||
          signUpError.message?.toLowerCase().includes('already exists') ||
          signUpError.message?.toLowerCase().includes('user already exists')
        ) {
          setError('An account with this email already exists. Please log in instead.');
        } else {
          setError(signUpError.message || 'Registration failed.');
        }
        setIsLoading(false);
        return;
      }

      if (data.user) {
        // In Supabase Auth (Email Enumeration Protection), existing accounts return an empty identities array []
        if (data.user.identities && data.user.identities.length === 0) {
          setError('An account with this email already exists. Please log in instead.');
          setIsLoading(false);
          return;
        }

        setUser(data.user);

        if (data.session) {
          // Auto signed in (Email confirmation disabled)
          await fetchProfile(data.user.id);
          router.push('/account');
        } else {
          // Email confirmation required for new account
          setSuccess(true);
        }
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err?.message || 'An unexpected error occurred. Please try again.');
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
            Create Account ✨
          </h1>
          <p className="text-xs sm:text-sm text-[#718096] font-medium">
            Sign up to start shopping and tracking your Baby Ladoo orders
          </p>
        </div>

        {/* Success Alert */}
        {success && (
          <div className="p-4 rounded-2xl bg-[#D1FAE5] border border-[#A7F3D0] text-[#065F46] text-xs font-medium space-y-2 animate-in fade-in-50">
            <div className="flex items-center gap-2 font-bold text-sm text-[#065F46]">
              <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
              <span>Registration Successful!</span>
            </div>
            <p>
              Please check your email to confirm your account, then{' '}
              <Link href="/login" className="font-bold underline text-[#065F46]">
                sign in here
              </Link>.
            </p>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-[#FFEAEF] border border-[#FF6B8B]/30 text-[#E11D48] text-xs font-bold flex items-start gap-2.5 animate-in fade-in-50">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#FF6B8B]" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        {!success && (
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#2D3748] uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  suppressHydrationWarning
                  className="w-full bg-[#FAF7F2] text-sm text-[#2D3748] placeholder-gray-400 rounded-2xl pl-10 pr-4 py-3 border border-[#EFE7DE] focus:border-[#FF6B8B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B8B]/20 transition-all font-medium"
                />
                <User className="w-4 h-4 text-[#A0AEC0] absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Email Address */}
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

            {/* Phone Number */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#2D3748] uppercase tracking-wider">
                Phone Number (Optional)
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  suppressHydrationWarning
                  className="w-full bg-[#FAF7F2] text-sm text-[#2D3748] placeholder-gray-400 rounded-2xl pl-10 pr-4 py-3 border border-[#EFE7DE] focus:border-[#FF6B8B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B8B]/20 transition-all font-medium"
                />
                <Phone className="w-4 h-4 text-[#A0AEC0] absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#2D3748] uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
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
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Register Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Footer */}
        <div className="pt-4 border-t border-[#EFE7DE] text-center text-xs text-[#718096] font-medium">
          Already have an account?{' '}
          <Link href="/login" className="font-extrabold text-[#FF6B8B] hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
