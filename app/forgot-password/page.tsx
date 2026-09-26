'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { authService } from '../../services/authService';
import {
  KeyRound,
  Mail,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';

function ForgotPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get('email') || '';

  const [email, setEmail] = useState(initialEmail);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{ message: string; demoOtp?: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setErrorMessage('Please enter your registered email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await authService.forgotPassword(cleanEmail);
      setSuccessData({
        message: res.message || 'If an account exists for this email, password reset instructions have been sent.',
        demoOtp: res.demo_otp,
      });
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Unable to process password reset request. Please check your email and try again.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Forgot Password' },
        ]}
      />

      <div className="min-h-[75vh] flex items-center justify-center py-6 sm:py-10 px-4 sm:px-6">
        <div className="w-full max-w-md bg-card rounded-3xl shadow-2xl shadow-slate-200/50 dark:shadow-none border border-border-custom/80 p-6 sm:p-10 space-y-6 relative overflow-hidden">
          
          {/* Header Branding */}
          <div className="text-center space-y-3 flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shadow-inner">
              <KeyRound size={28} />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-primary px-3 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                <ShieldCheck size={12} />
                <span>Account Recovery</span>
              </div>
              <h1 className="text-2xl font-black text-foreground tracking-tight mt-2">
                Forgot Password?
              </h1>
              <p className="text-xs text-muted-custom font-medium mt-1 leading-relaxed">
                Enter your registered email address below. We&apos;ll send you a password reset code to recover your account securely.
              </p>
            </div>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-start gap-3 animate-shake">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-500" />
              <div className="space-y-1">
                <span className="font-bold block uppercase tracking-wider text-[10px]">
                  Request Failed
                </span>
                <p>{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Success Banner */}
          {successData ? (
            <div className="space-y-5 animate-fade-in">
              <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 space-y-2">
                <div className="flex items-center gap-2 font-black text-sm">
                  <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                  <span>Instructions Dispatched</span>
                </div>
                <p className="text-xs font-medium leading-relaxed">
                  {successData.message}
                </p>
                {successData.demoOtp && (
                  <div className="mt-2 p-2 bg-emerald-500/20 rounded-xl font-mono text-xs font-black text-center">
                    Demo Code: {successData.demoOtp}
                  </div>
                )}
              </div>

              <div className="space-y-3 pt-2">
                <Link
                  href={`/reset-password?email=${encodeURIComponent(email.trim().toLowerCase())}`}
                  className="w-full bg-primary hover:bg-primary-hover text-white font-black text-xs py-3.5 px-6 rounded-2xl transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>Enter Reset Code</span>
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>

                <button
                  type="button"
                  onClick={() => setSuccessData(null)}
                  className="w-full text-center text-xs font-bold text-muted-custom hover:text-foreground py-2 transition-colors cursor-pointer"
                >
                  Change email address
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-black uppercase tracking-wider text-muted-custom">
                  Registered Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <Mail size={16} className="absolute left-3.5 text-muted-custom font-bold" />
                  <input
                    type="email"
                    required
                    autoFocus
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    disabled={isSubmitting}
                    className="w-full bg-background-secondary text-foreground text-sm font-bold pl-10 pr-4 py-3.5 rounded-2xl border border-border-custom/80 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-custom/50"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !email.trim()}
                className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary-hover hover:to-blue-700 text-white font-extrabold text-sm py-3.5 px-6 rounded-2xl transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin text-white" />
                    <span>Dispatching Reset Code...</span>
                  </>
                ) : (
                  <>
                    <span>Send Reset Code</span>
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Footer Back Link */}
          <div className="pt-2 border-t border-border-custom/60 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-custom hover:text-primary transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Remember your password? Back to Login</span>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 flex flex-col items-center justify-center gap-3 text-foreground/60">
          <Sparkles className="w-8 h-8 text-primary animate-spin" />
          <p className="text-sm font-bold tracking-wide">Loading Recovery Portal...</p>
        </div>
      }
    >
      <ForgotPasswordContent />
    </Suspense>
  );
}
