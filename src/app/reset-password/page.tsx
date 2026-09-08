'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Lock, AlertCircle, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/client';

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[0-9]|[^a-zA-Z0-9]/, 'Password must include at least one number or symbol');

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPasswordError(null);

    const passwordValidation = passwordSchema.safeParse(password);
    if (!passwordValidation.success) {
      setPasswordError(passwordValidation.error.issues[0]?.message || 'Invalid password');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        setError(updateError.message || 'Failed to update password.');
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push('/login');
        }, 2500);
      }
    } catch (err) {
      console.error('Update password error:', err);
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
            New Password
          </h1>
          <p className="text-xs sm:text-sm text-[#718096] font-medium">
            Enter your new secure password below
          </p>
        </div>

        {/* Success Alert */}
        {success ? (
          <div className="p-4 rounded-2xl bg-[#D1FAE5] border border-[#A7F3D0] text-[#065F46] text-xs font-medium space-y-2 animate-in fade-in-50">
            <div className="flex items-center gap-2 font-bold text-sm text-[#065F46]">
              <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
              <span>Password Updated!</span>
            </div>
            <p>Your password has been changed successfully. Redirecting to login...</p>
          </div>
        ) : (
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            {error && (
              <div className="p-3.5 rounded-2xl bg-[#FFEAEF] border border-[#FF6B8B]/30 text-[#E11D48] text-xs font-bold flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#FF6B8B]" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#2D3748] uppercase tracking-wider">
                New Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) setPasswordError(null);
                  }}
                  placeholder="At least 8 characters"
                  className={`w-full bg-[#FAF7F2] text-sm text-[#2D3748] placeholder-gray-400 rounded-2xl pl-10 pr-4 py-3 border focus:bg-white focus:outline-none focus:ring-2 font-medium ${
                    passwordError
                      ? 'border-[#FF6B8B] focus:border-[#FF6B8B] focus:ring-[#FF6B8B]/20'
                      : 'border-[#EFE7DE] focus:border-[#FF6B8B] focus:ring-[#FF6B8B]/20'
                  }`}
                />
                <Lock className="w-4 h-4 text-[#A0AEC0] absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
              <p className="text-[11px] text-[#718096] font-medium">
                At least 8 characters, with a number or symbol
              </p>
              {passwordError && (
                <div className="p-2.5 rounded-xl bg-[#FFEAEF] border border-[#FF6B8B]/30 text-[#E11D48] text-xs font-bold flex items-center gap-2 animate-in fade-in-50">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 text-[#FF6B8B]" />
                  <span>{passwordError}</span>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#2D3748] uppercase tracking-wider">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full bg-[#FAF7F2] text-sm text-[#2D3748] placeholder-gray-400 rounded-2xl pl-10 pr-4 py-3 border border-[#EFE7DE] focus:border-[#FF6B8B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B8B]/20 font-medium"
                />
                <Lock className="w-4 h-4 text-[#A0AEC0] absolute left-3.5 top-1/2 -translate-y-1/2" />
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
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <span>Update Password</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
