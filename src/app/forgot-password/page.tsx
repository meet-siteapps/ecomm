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
        redirectTo: `${origin}/reset-password`,
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
      <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-sm space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#EAF6FF] text-[#4DA3FF] flex items-center justify-center mx-auto shadow-xs">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] tracking-tight">
            Reset Password
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Enter your email and we will send you a reset link
          </p>
        </div>

        {/* Success Alert */}
        {success ? (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium space-y-3 animate-in fade-in-50">
            <div className="flex items-center gap-2 font-bold text-sm text-emerald-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Reset Link Sent</span>
            </div>
            <p>
              If an account exists with <strong>{email}</strong>, you will receive password reset instructions shortly.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-900 hover:underline"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Return to Sign In</span>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleResetRequest} className="space-y-4">
            {error && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Account Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-[#EAF6FF]/30 text-sm text-[#1F2937] placeholder-gray-400 rounded-xl pl-10 pr-4 py-2.5 border border-gray-200 focus:border-[#4DA3FF] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/20"
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl bg-[#4DA3FF] hover:bg-[#2B8BE6] text-white text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-xs disabled:opacity-60"
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

        <div className="pt-4 border-t border-gray-100 text-center text-xs text-gray-500">
          Remember your password?{' '}
          <Link href="/login" className="font-bold text-[#4DA3FF] hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
