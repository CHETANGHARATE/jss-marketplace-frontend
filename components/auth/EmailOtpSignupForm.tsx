'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { User, Mail, ArrowRight, RefreshCw, AlertCircle, CheckCircle2, Sparkles, LogIn } from 'lucide-react';
import { authService } from '../../services/authService';
import { useAuth } from '../../contexts/AuthContext';
import { OtpInput } from './OtpInput';

interface EmailOtpSignupFormProps {
  onSwitchToLogin?: () => void;
}

export const EmailOtpSignupForm: React.FC<EmailOtpSignupFormProps> = ({ onSwitchToLogin }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get('redirect') || '/account';
  const { setAuthSession } = useAuth();

  const [step, setStep] = useState<'request' | 'verify'>('request');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [otpValue, setOtpValue] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (cooldown > 0) {
      interval = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [cooldown]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setErrorCode(null);
    setSuccessMessage(null);

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await authService.sendEmailOtp({
        email: cleanEmail,
        purpose: 'signup',
      });

      if (res.success) {
        setStep('verify');
        setCooldown(30);
        setSuccessMessage(`OTP code sent successfully to ${cleanEmail}`);
      } else {
        setErrorCode(res.code || null);
        if (res.code === 'EMAIL_ALREADY_REGISTERED' || res.message.toLowerCase().includes('already registered')) {
          setErrorMessage('This email is already registered. Please login instead.');
        } else {
          setErrorMessage(res.message || 'Unable to send OTP right now. Please try again later.');
        }
      }
    } catch (err: any) {
      setErrorMessage('Something went wrong. Please check your internet connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);
    setErrorCode(null);

    if (otpValue.length !== 6) {
      setErrorMessage('Please enter the complete 6-digit OTP code.');
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    setIsSubmitting(true);

    try {
      const res = await authService.verifyEmailOtpFull({
        email: cleanEmail,
        otp: otpValue,
        purpose: 'signup',
        name: fullName.trim(),
      });

      if (res.success && res.user && res.token) {
        setSuccessMessage('Account created successfully! Redirecting...');
        await setAuthSession(res.user, res.token, true);

        setTimeout(() => {
          router.replace(redirectParam);
        }, 500);
      } else {
        setErrorCode(res.code || null);
        setErrorMessage(res.message || 'Incorrect OTP. Please check the code and try again.');
      }
    } catch (err: any) {
      setErrorMessage('Account creation failed. Please check the OTP code and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    if (cooldown > 0 || isSubmitting) return;
    setErrorMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    setIsSubmitting(true);

    try {
      const res = await authService.sendEmailOtp({
        email: cleanEmail,
        purpose: 'signup',
      });

      if (res.success) {
        setCooldown(30);
        setSuccessMessage('A new verification code has been sent to your email.');
      } else {
        setErrorMessage(res.message || 'Unable to resend OTP right now. Please try again later.');
      }
    } catch (err: any) {
      setErrorMessage('Failed to resend OTP. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      {errorMessage && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-600 dark:text-rose-400 text-xs font-semibold space-y-2 animate-shake">
          <div className="flex items-start gap-2.5">
            <AlertCircle size={18} className="shrink-0 text-rose-500 mt-0.5" />
            <div className="flex-1">
              <p className="leading-relaxed">{errorMessage}</p>
            </div>
          </div>

          {(errorCode === 'EMAIL_ALREADY_REGISTERED' || errorMessage.includes('already registered')) && onSwitchToLogin && (
            <div className="pt-2 border-t border-rose-500/20 flex justify-end">
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="inline-flex items-center gap-1.5 bg-primary text-white px-3.5 py-1.5 rounded-xl text-xs font-extrabold hover:bg-primary-hover transition-all shadow-xs"
              >
                <LogIn size={13} />
                <span>Login with Email OTP</span>
              </button>
            </div>
          )}
        </div>
      )}

      {successMessage && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2.5">
          <CheckCircle2 size={18} className="shrink-0 text-emerald-500" />
          <span>{successMessage}</span>
        </div>
      )}

      {step === 'request' ? (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-xs font-black uppercase tracking-wider text-muted-custom">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative flex items-center">
              <User size={16} className="absolute left-3.5 text-muted-custom font-bold" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                disabled={isSubmitting}
                className="w-full bg-background-secondary text-foreground text-sm font-bold pl-10 pr-4 py-3.5 rounded-2xl border border-border-custom/80 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-custom/50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-black uppercase tracking-wider text-muted-custom">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <div className="relative flex items-center">
              <Mail size={16} className="absolute left-3.5 text-muted-custom font-bold" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                disabled={isSubmitting}
                className="w-full bg-background-secondary text-foreground text-sm font-bold pl-10 pr-4 py-3.5 rounded-2xl border border-border-custom/80 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-custom/50"
              />
            </div>
            <p className="text-[11px] text-muted-custom font-medium">A 6-digit verification code will be sent to your email.</p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !fullName.trim() || !email.includes('@')}
            className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary-hover hover:to-blue-700 text-white font-extrabold text-sm py-3.5 px-6 rounded-2xl transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {isSubmitting ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-white" />
                <span>Sending Email OTP...</span>
              </>
            ) : (
              <>
                <span>SEND EMAIL OTP</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div className="bg-background-secondary p-4 rounded-2xl border border-border-custom/80 flex items-center justify-between">
            <div>
              <p className="text-[11px] text-muted-custom font-bold">OTP Code sent for {fullName}:</p>
              <p className="text-sm font-black text-foreground">{email}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setStep('request');
                setOtpValue('');
                setErrorMessage(null);
              }}
              className="text-xs font-bold text-primary hover:underline"
            >
              Change
            </button>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-black uppercase tracking-wider text-muted-custom text-center">
              Enter 6-Digit Email OTP <span className="text-rose-500">*</span>
            </label>

            <OtpInput
              value={otpValue}
              onChange={setOtpValue}
              disabled={isSubmitting}
              onComplete={(completedOtp) => {
                setOtpValue(completedOtp);
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || otpValue.length !== 6}
            className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary-hover hover:to-blue-700 text-white font-extrabold text-sm py-3.5 px-6 rounded-2xl transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {isSubmitting ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-white" />
                <span>Verifying & Creating Account...</span>
              </>
            ) : (
              <>
                <span>VERIFY & CREATE ACCOUNT</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          <div className="flex items-center justify-between pt-2 text-xs">
            <span className="text-muted-custom font-medium">Didn't receive the email?</span>
            {cooldown > 0 ? (
              <span className="font-bold text-muted-custom bg-background-secondary border border-border-custom px-3 py-1 rounded-xl">
                Resend in <strong className="text-primary font-black">00:{cooldown < 10 ? `0${cooldown}` : cooldown}</strong>
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isSubmitting}
                className="font-black text-primary hover:text-primary-hover flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <RefreshCw size={13} />
                <span>Resend Email OTP</span>
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
};
