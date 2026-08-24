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
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            name: name.trim(),
            phone: phone.trim(),
            role: 'customer',
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message || 'Registration failed.');
        setIsLoading(false);
        return;
      }

      if (data.user) {
        // If email enumeration protection is ON, an already registered user returns empty identities array
        if (data.user.identities && data.user.identities.length === 0) {
          setError('An account with this email already exists. Please log in instead.');
          setIsLoading(false);
          return;
        }

        setUser(data.user);

        if (data.session) {
          // Auto signed in
          await fetchProfile(data.user.id);
          router.push('/account');
        } else {
          // Email confirmation required
          setSuccess(true);
        }
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-sm space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#EAF6FF] text-[#4DA3FF] flex items-center justify-center mx-auto shadow-xs">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] tracking-tight">
            Create Account
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Sign up to start shopping and tracking your orders
          </p>
        </div>

        {/* Success Alert */}
        {success && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium space-y-2 animate-in fade-in-50">
            <div className="flex items-center gap-2 font-bold text-sm text-emerald-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Registration Successful!</span>
            </div>
            <p>
              Please check your email to confirm your account, then{' '}
              <Link href="/login" className="font-bold underline text-emerald-900">
                sign in here
              </Link>.
            </p>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium flex items-start gap-2.5 animate-in fade-in-50">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        {!success && (
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
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
                  className="w-full bg-[#EAF6FF]/30 text-sm text-[#1F2937] placeholder-gray-400 rounded-xl pl-10 pr-4 py-2.5 border border-gray-200 focus:border-[#4DA3FF] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/20 transition-all"
                />
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
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
                  className="w-full bg-[#EAF6FF]/30 text-sm text-[#1F2937] placeholder-gray-400 rounded-xl pl-10 pr-4 py-2.5 border border-gray-200 focus:border-[#4DA3FF] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/20 transition-all"
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Phone Number (Optional)
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  suppressHydrationWarning
                  className="w-full bg-[#EAF6FF]/30 text-sm text-[#1F2937] placeholder-gray-400 rounded-xl pl-10 pr-4 py-2.5 border border-gray-200 focus:border-[#4DA3FF] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/20 transition-all"
                />
                <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
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
                  className="w-full bg-[#EAF6FF]/30 text-sm text-[#1F2937] placeholder-gray-400 rounded-xl pl-10 pr-4 py-2.5 border border-gray-200 focus:border-[#4DA3FF] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/20 transition-all"
                />
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl bg-[#4DA3FF] hover:bg-[#2B8BE6] active:scale-98 text-white text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-xs disabled:opacity-60 disabled:cursor-not-allowed"
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
        <div className="pt-4 border-t border-gray-100 text-center text-xs text-gray-500">
          Already have an account?{' '}
          <Link href="/login" className="font-bold text-[#4DA3FF] hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
