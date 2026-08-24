'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Mail,
  Lock,
  Phone,
  KeyRound,
  ArrowRight,
  Sparkles,
  AlertCircle,
  ShoppingBag,
  UserPlus,
  LogIn,
  User,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/authService';
import { OtpLoginForm } from './OtpLoginForm';
import { OtpSignupForm } from './OtpSignupForm';
import { EmailOtpLoginForm } from './EmailOtpLoginForm';
import { EmailOtpSignupForm } from './EmailOtpSignupForm';
import { BrandLogo } from '../BrandLogo';

interface AuthCardProps {
  initialMode?: 'login' | 'signup';
}

export type AuthMethod = 'password' | 'email_otp' | 'mobile_otp';

export const AuthCard: React.FC<AuthCardProps> = ({ initialMode = 'login' }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get('redirect') || '/account';
  const { login, register } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [method, setMethod] = useState<AuthMethod>('password');

  // Password Login & Signup Form States
  const [loginInput, setLoginInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setErrorCode(null);

    if (!loginInput.trim() || !passwordInput) {
      setErrorMessage('Please enter your email / mobile number and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const isEmail = loginInput.includes('@');
      const loggedUser = await login({
        login: loginInput.trim(),
        email: isEmail ? loginInput.trim() : undefined,
        phone: !isEmail ? loginInput.trim() : undefined,
        password: passwordInput,
        rememberMe,
      });

      const userRole = String(loggedUser?.role || '').toLowerCase();
      if (redirectParam && redirectParam !== '/account') {
        router.replace(redirectParam);
      } else if (userRole === 'seller' || userRole === 'vendor') {
        router.replace('/vendor');
      } else if (userRole === 'admin') {
        router.replace('/admin');
      } else {
        router.replace('/account');
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Incorrect email or password.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasskeyLogin = async () => {
    setErrorMessage(null);
    setErrorCode(null);
    setIsSubmitting(true);

    try {
      const { passkeyService } = await import('../../services/passkeyService');
      const res = await passkeyService.loginWithPasskey();

      if (res?.token) {
        localStorage.setItem('auth_token', res.token);
        if (res.user) {
          localStorage.setItem('user', JSON.stringify(res.user));
        }
        setSuccessMessage('Passkey verified successfully! Redirecting...');
        setTimeout(() => {
          if (redirectParam && redirectParam !== '/account') {
            router.replace(redirectParam);
          } else {
            router.replace('/account');
          }
        }, 400);
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Passkey authentication failed.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setErrorCode(null);

    if (!nameInput.trim() || !loginInput.trim() || !passwordInput) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (passwordInput.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    setIsSubmitting(true);
    try {
      const registeredUser = await register({
        name: nameInput.trim(),
        email: loginInput.trim(),
        password: passwordInput,
        phone: phoneInput ? ('+91' + phoneInput.replace(/\D/g, '')) : undefined,
        role: 'customer',
      });

      setSuccessMessage('Account created successfully! Redirecting...');
      setTimeout(() => {
        router.replace(redirectParam);
      }, 500);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Registration failed. Please check details and try again.';
      if (msg.toLowerCase().includes('already registered') || msg.toLowerCase().includes('already exists')) {
        setErrorCode('EMAIL_ALREADY_REGISTERED');
        setErrorMessage('This email is already registered. Please login instead.');
      } else {
        setErrorMessage(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full text-card-foreground space-y-6">
      
      {/* Header Title & Branding */}
      <div className="text-center space-y-2 flex flex-col items-center">
        <div className="lg:hidden mb-1">
          <BrandLogo variant="header" size="md" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
          {mode === 'login' ? 'Welcome Back!' : 'Create Your Account'}
        </h2>
        <p className="text-xs text-muted-custom font-medium max-w-sm mx-auto">
          {mode === 'login'
            ? 'Choose how you want to log in to JSS Marketplace.'
            : 'Select your preferred signup method below.'}
        </p>
      </div>

      {/* Professional 3-Way Method Selector Bar */}
      <div className="grid grid-cols-3 gap-1 p-1.5 bg-background-secondary rounded-2xl border border-border-custom/80">
        <button
          type="button"
          onClick={() => {
            setMethod('password');
            setErrorMessage(null);
            setSuccessMessage(null);
          }}
          className={`py-2 px-2.5 rounded-xl text-xs font-black transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 ${
            method === 'password'
              ? 'bg-card text-primary shadow-xs border border-border-custom/60'
              : 'text-muted-custom hover:text-foreground'
          }`}
        >
          <KeyRound size={14} className="shrink-0" />
          <span className="truncate">Email & Pass</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setMethod('email_otp');
            setErrorMessage(null);
            setSuccessMessage(null);
          }}
          className={`py-2 px-2.5 rounded-xl text-xs font-black transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 ${
            method === 'email_otp'
              ? 'bg-card text-primary shadow-xs border border-border-custom/60'
              : 'text-muted-custom hover:text-foreground'
          }`}
        >
          <Mail size={14} className="shrink-0" />
          <span className="truncate">Email OTP</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setMethod('mobile_otp');
            setErrorMessage(null);
            setSuccessMessage(null);
          }}
          className={`py-2 px-2.5 rounded-xl text-xs font-black transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 ${
            method === 'mobile_otp'
              ? 'bg-card text-primary shadow-xs border border-border-custom/60'
              : 'text-muted-custom hover:text-foreground'
          }`}
        >
          <Phone size={14} className="shrink-0" />
          <span className="truncate">Mobile OTP</span>
        </button>
      </div>

      {/* METHOD 1: EMAIL & PASSWORD */}
      {method === 'password' && (
        mode === 'login' ? (
          /* LOGIN FORM (EMAIL & PASSWORD) */
          <form onSubmit={handlePasswordLogin} className="space-y-4">
            {errorMessage && (
              <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2.5 animate-shake">
                <AlertCircle size={18} className="shrink-0 text-rose-500" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-xs font-black uppercase tracking-wider text-muted-custom">
                Email Address / Mobile <span className="text-rose-500">*</span>
              </label>
              <div className="relative flex items-center">
                <Mail size={16} className="absolute left-3.5 text-muted-custom font-bold" />
                <input
                  type="text"
                  value={loginInput}
                  onChange={(e) => setLoginInput(e.target.value)}
                  placeholder="name@example.com or 9876543210"
                  disabled={isSubmitting}
                  className="w-full bg-background-secondary text-foreground text-sm font-bold pl-10 pr-4 py-3.5 rounded-2xl border border-border-custom/80 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-custom/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-black uppercase tracking-wider text-muted-custom">
                  Password <span className="text-rose-500">*</span>
                </label>
                <Link
                  href="/account?tab=forgot-password"
                  className="text-xs font-bold text-primary hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative flex items-center">
                <Lock size={16} className="absolute left-3.5 text-muted-custom font-bold" />
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  disabled={isSubmitting}
                  className="w-full bg-background-secondary text-foreground text-sm font-bold pl-10 pr-4 py-3.5 rounded-2xl border border-border-custom/80 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-custom/50"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded-md border-border-custom text-primary focus:ring-primary/20 accent-primary cursor-pointer"
                />
                <span className="text-xs font-semibold text-foreground">Remember Me</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !loginInput.trim() || !passwordInput}
              className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary-hover hover:to-blue-700 text-white font-extrabold text-sm py-3.5 px-6 rounded-2xl transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isSubmitting ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-white" />
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <span>LOGIN</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {/* Feature 171: Passkey / Biometrics Login */}
            <div className="pt-2">
              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-border-custom/60"></div>
                <span className="flex-shrink mx-2 text-[10px] uppercase font-bold text-muted-custom">Or passwordless</span>
                <div className="flex-grow border-t border-border-custom/60"></div>
              </div>

              <button
                type="button"
                onClick={handlePasskeyLogin}
                disabled={isSubmitting}
                className="w-full mt-2 bg-background hover:bg-background-secondary border border-border-custom/90 text-foreground font-black text-xs py-3 px-4 rounded-2xl transition-all shadow-2xs flex items-center justify-center gap-2 cursor-pointer hover:border-primary/50"
              >
                <ShieldCheck size={16} className="text-primary" />
                <span>Sign in with Passkey (Face ID / Fingerprint)</span>
              </button>
            </div>
          </form>
        ) : (
          /* SIGNUP FORM (EMAIL & PASSWORD) */
          <form onSubmit={handlePasswordSignup} className="space-y-4">
            {errorMessage && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-600 dark:text-rose-400 text-xs font-semibold space-y-2 animate-shake">
                <div className="flex items-start gap-2.5">
                  <AlertCircle size={18} className="shrink-0 text-rose-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="leading-relaxed">{errorMessage}</p>
                  </div>
                </div>

                {errorCode === 'EMAIL_ALREADY_REGISTERED' && (
                  <div className="pt-2 border-t border-rose-500/20 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="inline-flex items-center gap-1.5 bg-primary text-white px-3.5 py-1.5 rounded-xl text-xs font-extrabold hover:bg-primary-hover transition-all shadow-xs"
                    >
                      <LogIn size={13} />
                      <span>Login Instead</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-xs font-black uppercase tracking-wider text-muted-custom">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative flex items-center">
                <User size={16} className="absolute left-3.5 text-muted-custom font-bold" />
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
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
                  value={loginInput}
                  onChange={(e) => setLoginInput(e.target.value)}
                  placeholder="name@example.com"
                  disabled={isSubmitting}
                  className="w-full bg-background-secondary text-foreground text-sm font-bold pl-10 pr-4 py-3.5 rounded-2xl border border-border-custom/80 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-custom/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-black uppercase tracking-wider text-muted-custom">
                Password (Min 8 characters) <span className="text-rose-500">*</span>
              </label>
              <div className="relative flex items-center">
                <Lock size={16} className="absolute left-3.5 text-muted-custom font-bold" />
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  disabled={isSubmitting}
                  className="w-full bg-background-secondary text-foreground text-sm font-bold pl-10 pr-4 py-3.5 rounded-2xl border border-border-custom/80 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-custom/50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !nameInput.trim() || !loginInput.trim() || passwordInput.length < 8}
              className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary-hover hover:to-blue-700 text-white font-extrabold text-sm py-3.5 px-6 rounded-2xl transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isSubmitting ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-white" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>CREATE ACCOUNT</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        )
      )}

      {/* METHOD 2: EMAIL OTP */}
      {method === 'email_otp' && (
        mode === 'login' ? (
          <EmailOtpLoginForm onSwitchToSignup={() => setMode('signup')} />
        ) : (
          <EmailOtpSignupForm onSwitchToLogin={() => setMode('login')} />
        )
      )}

      {/* METHOD 3: MOBILE OTP (MSG91) */}
      {method === 'mobile_otp' && (
        mode === 'login' ? (
          <OtpLoginForm onSwitchToSignup={() => setMode('signup')} />
        ) : (
          <OtpSignupForm onSwitchToLogin={() => setMode('login')} />
        )
      )}

      {/* Switch between Login and Signup Modes */}
      <div className="pt-4 border-t border-border-custom/80 text-center">
        {mode === 'login' ? (
          <p className="text-xs font-semibold text-muted-custom">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => setMode('signup')}
              className="text-primary font-black hover:underline inline-flex items-center gap-1 ml-1"
            >
              <span>Sign Up</span>
              <UserPlus size={13} />
            </button>
          </p>
        ) : (
          <p className="text-xs font-semibold text-muted-custom">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => setMode('login')}
              className="text-primary font-black hover:underline inline-flex items-center gap-1 ml-1"
            >
              <span>Login</span>
              <LogIn size={13} />
            </button>
          </p>
        )}
      </div>

    </div>
  );
};
