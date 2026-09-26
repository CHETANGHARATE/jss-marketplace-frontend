'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { PasswordInput } from '../../components/ui/PasswordInput';
import { authService } from '../../services/authService';
import {
  Lock,
  Mail,
  KeyRound,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const emailParam = searchParams.get('email') || '';
  const tokenParam = searchParams.get('token') || searchParams.get('otp') || '';

  const [email, setEmail] = useState(emailParam);
  const [token, setToken] = useState(tokenParam);
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isTokenInvalid, setIsTokenInvalid] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsTokenInvalid(false);

    const cleanEmail = email.trim().toLowerCase();
    const cleanToken = token.trim();

    if (!cleanEmail) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (!cleanToken) {
      setErrorMessage('Please enter the 6-digit verification code or token sent to your email.');
      return;
    }
    if (!password || !passwordConfirmation) {
      setErrorMessage('Please enter and confirm your new password.');
      return;
    }
    if (password.length < 8) {
      setErrorMessage('New password must be at least 8 characters long.');
      return;
    }
    if (password !== passwordConfirmation) {
      setErrorMessage('Password and confirmation password do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      const msg = await authService.resetPassword({
        email: cleanEmail,
        token: cleanToken,
        otp: cleanToken,
        password,
        password_confirmation: passwordConfirmation,
      });

      setSuccessMessage(msg || 'Your password has been reset successfully!');
      setTimeout(() => {
        router.push('/login');
      }, 2500);
    } catch (err: any) {
      const rawMsg = err?.response?.data?.message || err?.message || 'Failed to reset password.';
      if (
        rawMsg.toLowerCase().includes('expired') ||
        rawMsg.toLowerCase().includes('invalid') ||
        err?.response?.status === 400
      ) {
        setIsTokenInvalid(true);
        setErrorMessage('Your password reset code or link is invalid or has expired.');
      } else {
        setErrorMessage(rawMsg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Forgot Password', href: '/forgot-password' },
          { label: 'Reset Password' },
        ]}
      />

      <div className="min-h-[75vh] flex items-center justify-center py-6 sm:py-10 px-4 sm:px-6">
        <div className="w-full max-w-md bg-card rounded-3xl shadow-2xl shadow-slate-200/50 dark:shadow-none border border-border-custom/80 p-6 sm:p-10 space-y-6 relative overflow-hidden">
          
          {/* Header Branding */}
          <div className="text-center space-y-3 flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shadow-inner">
              <Lock size={28} />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-primary px-3 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                <ShieldCheck size={12} />
                <span>Security Update</span>
              </div>
              <h1 className="text-2xl font-black text-foreground tracking-tight mt-2">
                Reset Your Password
              </h1>
              <p className="text-xs text-muted-custom font-medium mt-1 leading-relaxed">
                Enter the verification code sent to your email along with your desired new password.
              </p>
            </div>
          </div>

          {/* Success Screen */}
          {successMessage ? (
            <div className="space-y-5 animate-fade-in text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-500/20 shadow-inner">
                <CheckCircle2 size={36} />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-foreground">Password Reset Successfully</h3>
                <p className="text-xs text-muted-custom font-medium">
                  {successMessage} You will be redirected to the login page momentarily.
                </p>
              </div>

              <Link
                href="/login"
                className="w-full bg-primary hover:bg-primary-hover text-white font-black text-xs py-3.5 px-6 rounded-2xl transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Proceed to Login</span>
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          ) : (
            <>
              {/* Error Banner */}
              {errorMessage && (
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-start gap-3 animate-shake">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-500" />
                  <div className="space-y-2 flex-1">
                    <span className="font-bold block uppercase tracking-wider text-[10px]">
                      Validation Error
                    </span>
                    <p>{errorMessage}</p>

                    {isTokenInvalid && (
                      <div className="pt-2 border-t border-rose-500/20">
                        <Link
                          href="/forgot-password"
                          className="inline-flex items-center gap-1.5 bg-rose-500 text-white px-3 py-1.5 rounded-xl text-xs font-extrabold hover:bg-rose-600 transition-colors shadow-xs"
                        >
                          <RotateCcw size={12} />
                          <span>Request New Reset Link</span>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-black uppercase tracking-wider text-muted-custom">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <Mail size={16} className="absolute left-3.5 text-muted-custom font-bold" />
                    <input
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      disabled={isSubmitting}
                      className="w-full bg-background-secondary text-foreground text-sm font-bold pl-10 pr-4 py-3.5 rounded-2xl border border-border-custom/80 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-custom/50"
                    />
                  </div>
                </div>

                {/* Verification Code / Token */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-black uppercase tracking-wider text-muted-custom">
                    6-Digit Verification Code or Token <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <KeyRound size={16} className="absolute left-3.5 text-muted-custom font-bold" />
                    <input
                      type="text"
                      required
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      placeholder="Enter 6-digit code or reset token"
                      disabled={isSubmitting}
                      className="w-full bg-background-secondary text-foreground text-sm font-bold pl-10 pr-4 py-3.5 rounded-2xl border border-border-custom/80 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-custom/50 font-mono"
                    />
                  </div>
                </div>

                {/* New Password with Eye Toggle */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-black uppercase tracking-wider text-muted-custom">
                    New Password (Min 8 characters) <span className="text-rose-500">*</span>
                  </label>
                  <PasswordInput
                    required
                    minLength={8}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new strong password"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Confirm New Password with Eye Toggle */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-black uppercase tracking-wider text-muted-custom">
                    Confirm New Password <span className="text-rose-500">*</span>
                  </label>
                  <PasswordInput
                    required
                    minLength={8}
                    autoComplete="new-password"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    placeholder="Re-enter new password"
                    disabled={isSubmitting}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !password || password.length < 8 || password !== passwordConfirmation}
                  className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary-hover hover:to-blue-700 text-white font-extrabold text-sm py-3.5 px-6 rounded-2xl transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer mt-2"
                >
                  {isSubmitting ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin text-white" />
                      <span>Updating Password...</span>
                    </>
                  ) : (
                    <>
                      <span>Reset Password</span>
                      <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          {/* Footer Back Link */}
          <div className="pt-2 border-t border-border-custom/60 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-custom hover:text-primary transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Back to Login</span>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 flex flex-col items-center justify-center gap-3 text-foreground/60">
          <Sparkles className="w-8 h-8 text-primary animate-spin" />
          <p className="text-sm font-bold tracking-wide">Loading Security Portal...</p>
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
