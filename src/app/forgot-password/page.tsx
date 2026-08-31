'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Mail, AlertCircle, ArrowRight, Loader2, CheckCircle2, ChevronLeft, UserPlus } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [noAccountFound, setNoAccountFound] = useState(false);

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNoAccountFound(false);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();

      // 1. Check if an account exists for this email via secure RPC
      try {
        const { data: exists, error: rpcError } = await supabase.rpc('check_user_exists_by_email', {
          p_email: cleanEmail,
        });

        if (!rpcError && typeof exists === 'boolean') {
          if (!exists) {
            setNoAccountFound(true);
            setError('No account found with this email address.');
            setIsLoading(false);
            return;
          }
        }
      } catch (checkErr) {
        console.warn('RPC check_user_exists_by_email skipped, continuing with reset:', checkErr);
      }

      // 2. Dispatch password recovery email
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: `${origin}/auth/callback?next=/reset-password`,
      });

      if (resetError) {
        if (
          resetError.message?.toLowerCase().includes('user not found') ||
          resetError.message?.toLowerCase().includes('invalid user')
        ) {
          setNoAccountFound(true);
          setError('No account found with this email address.');
        } else if (resetError.message?.toLowerCase().includes('rate limit') || resetError.status === 429) {
          setError('Too many requests. Please wait a few minutes before trying again.');
        } else {
          setError(resetError.message || 'Failed to send password reset email.');
        }
      } else {
        setSuccess(true);
      }
    } catch (err: any) {
      console.error('Password reset error:', err);
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
            Reset Password
          </h1>
          <p className="text-xs sm:text-sm text-[#718096] font-medium">
            Enter your email and we will send you a reset link
          </p>
        </div>

        {/* Success Alert */}
        {success ? (
          <div className="p-5 rounded-2xl bg-[#D1FAE5] border border-[#A7F3D0] text-[#065F46] text-xs font-medium space-y-3 animate-in fade-in-50">
            <div className="flex items-center gap-2 font-bold text-sm text-[#065F46]">
              <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
              <span>Reset Link Sent!</span>
            </div>
            <p className="leading-relaxed">
              We have sent password reset instructions to <strong>{email}</strong>. Please check your inbox and spam folder.
            </p>
            <div className="pt-1">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#065F46] hover:underline"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Return to Sign In</span>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleResetRequest} className="space-y-4">
            {error && (
              <div className="p-4 rounded-2xl bg-[#FFEAEF] border border-[#FF6B8B]/30 text-[#E11D48] text-xs font-bold space-y-2 animate-in fade-in-50">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#FF6B8B]" />
                  <span>{error}</span>
                </div>

                {noAccountFound && (
                  <div className="pt-1">
                    <Link
                      href="/register"
                      className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-[#FF6B8B] hover:underline"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Create a new account now &rarr;</span>
                    </Link>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#2D3748] uppercase tracking-wider">
                Account Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="name@example.com"
                  className="w-full bg-[#FAF7F2] text-sm text-[#2D3748] placeholder-gray-400 rounded-2xl pl-10 pr-4 py-3 border border-[#EFE7DE] focus:border-[#FF6B8B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B8B]/20 font-medium transition-all"
                />
                <Mail className="w-4 h-4 text-[#A0AEC0] absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-4 rounded-full bg-[#FF6B8B] hover:bg-[#FA5578] text-white text-sm font-extrabold flex items-center justify-center gap-2 transition-all shadow-cute-pink active:scale-98 disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Checking account...</span>
                </>
              ) : (
                <>
                  <span>Send Reset Link</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        <div className="pt-4 border-t border-[#EFE7DE] text-center text-xs text-[#718096] font-medium">
          Remember your password?{' '}
          <Link href="/login" className="font-extrabold text-[#FF6B8B] hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
