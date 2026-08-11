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
  LogIn
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/authService';
import { OtpLoginForm } from './OtpLoginForm';
import { OtpSignupForm } from './OtpSignupForm';

interface AuthCardProps {
  initialMode?: 'login' | 'signup';
}

export const AuthCard: React.FC<AuthCardProps> = ({ initialMode = 'login' }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get('redirect') || '/account';
  const { login } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [loginMethod, setLoginMethod] = useState<'otp' | 'password'>('otp'); // Mobile OTP is preferred modern choice

  // Password Login State
  const [loginInput, setLoginInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

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
      const msg = err?.response?.data?.message || err?.message || 'Invalid credentials provided. Please check and try again.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-card text-card-foreground p-6 sm:p-10 rounded-3xl shadow-xl border border-border-custom/80 space-y-6">
      
      {/* Header Branding & Welcome Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center gap-2 mb-1">
          <div className="h-10 w-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black">
            <ShoppingBag size={20} />
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
          {mode === 'login' ? 'Welcome Back!' : 'Create Your Account'}
        </h2>
        <p className="text-xs text-muted-custom font-medium max-w-sm mx-auto">
          {mode === 'login'
            ? 'Login to continue your shopping journey on JSS Marketplace.'
            : 'Join JSS Marketplace and start shopping from verified sellers.'}
        </p>
      </div>

      {/* MODE = LOGIN */}
      {mode === 'login' && (
        <div className="space-y-6">
          
          {/* Tab Switcher: [ Login with OTP ] [ Login with Password ] */}
          <div className="flex bg-background-secondary p-1.5 rounded-2xl border border-border-custom/80">
            <button
              type="button"
              onClick={() => {
                setLoginMethod('otp');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                loginMethod === 'otp'
                  ? 'bg-card text-primary shadow-xs border border-border-custom/60'
                  : 'text-muted-custom hover:text-foreground'
              }`}
            >
              <Phone size={14} />
              <span>Login with OTP</span>
              <span className="text-[9px] bg-primary/15 text-primary border border-primary/20 px-1.5 py-0.2 rounded-md uppercase tracking-wider font-extrabold ml-1">
                Fast
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setLoginMethod('password');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                loginMethod === 'password'
                  ? 'bg-card text-primary shadow-xs border border-border-custom/60'
                  : 'text-muted-custom hover:text-foreground'
              }`}
            >
              <KeyRound size={14} />
              <span>Login with Password</span>
            </button>
          </div>

          {/* LOGIN METHOD A: OTP LOGIN */}
          {loginMethod === 'otp' ? (
            <OtpLoginForm onSwitchToSignup={() => setMode('signup')} />
          ) : (
            /* LOGIN METHOD B: PASSWORD LOGIN */
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              {errorMessage && (
                <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2.5 animate-shake">
                  <AlertCircle size={18} className="shrink-0 text-rose-500" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-xs font-black uppercase tracking-wider text-muted-custom">
                  Email / Mobile Number <span className="text-rose-500">*</span>
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
            </form>
          )}

          {/* Switch to Signup */}
          <div className="pt-4 border-t border-border-custom/80 text-center">
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
          </div>

        </div>
      )}

      {/* MODE = SIGNUP */}
      {mode === 'signup' && (
        <div className="space-y-6">
          <OtpSignupForm onSwitchToLogin={() => setMode('login')} />

          {/* Switch to Login */}
          <div className="pt-4 border-t border-border-custom/80 text-center">
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
          </div>
        </div>
      )}

    </div>
  );
};
