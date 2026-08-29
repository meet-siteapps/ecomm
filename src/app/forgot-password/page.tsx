'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Mail, AlertCircle, ArrowRight, Loader2, CheckCircle2, ChevronLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const supabase = createClient();
      const origin = window.location.origin;
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${origin}/auth/callback?next=/reset-password`,
      });

      if (resetError) {
        setError(resetError.message || 'Failed to send password reset email.');
      } else {
        setSuccess(true);
      }
    } catch (err) {
      console.error('Password reset error:', err);
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
            Reset Password
          </h1>
          <p className="text-xs sm:text-sm text-[#718096] font-medium">
            Enter your email and we will send you a reset link
          </p>
        </div>

        {/* Success Alert */}
        {success ? (
          <div className="p-4 rounded-2xl bg-[#D1FAE5] border border-[#A7F3D0] text-[#065F46] text-xs font-medium space-y-3 animate-in fade-in-50">
            <div className="flex items-center gap-2 font-bold text-sm text-[#065F46]">
              <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
              <span>Reset Link Sent</span>
            </div>
            <p>
              If an account exists with <strong>{email}</strong>, you will receive password reset instructions shortly.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#065F46] hover:underline"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Return to Sign In</span>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleResetRequest} className="space-y-4">
            {error && (
              <div className="p-3.5 rounded-2xl bg-[#FFEAEF] border border-[#FF6B8B]/30 text-[#E11D48] text-xs font-bold flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#FF6B8B]" />
                <span>{error}</span>
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
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-[#FAF7F2] text-sm text-[#2D3748] placeholder-gray-400 rounded-2xl pl-10 pr-4 py-3 border border-[#EFE7DE] focus:border-[#FF6B8B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B8B]/20 font-medium"
                />
                <Mail className="w-4 h-4 text-[#A0AEC0] absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-4 rounded-full bg-[#FF6B8B] hover:bg-[#FA5578] text-white text-sm font-extrabold flex items-center justify-center gap-2 transition-all shadow-cute-pink disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending link...</span>
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
